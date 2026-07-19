import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Find the JSDoc-style leading block comment attached to a node, if any.
 * @param {Array<{type:string,value:string,start:number,end:number}>} comments
 * @param {number} nodeStart
 * @param {string} source
 * @returns {string|null}
 */
function leadingComment(comments, nodeStart, source) {
    let best = null;
    for (const c of comments) {
        if (c.type !== 'Block' || !c.value.startsWith('*')) continue;
        if (c.end > nodeStart) continue;
        const between = source.slice(c.end, nodeStart);
        if (!/^[\s]*$/.test(between)) continue; // only whitespace between comment and node
        if (best === null || c.end > best.end) best = c;
    }
    return best ? `/*${best.value}*/` : null;
}

function keyName(keyNode, source) {
    if (keyNode.type === 'Identifier') return keyNode.name;
    if (keyNode.type === 'PrivateIdentifier') return `#${keyNode.name}`;
    if (keyNode.type === 'Literal') return String(keyNode.value);
    return source.slice(keyNode.start, keyNode.end);
}

/**
 * Find the object literal returned by a function, following the common
 * `const result = {...}; ...; return result;` and `return {...};` patterns
 * used across the codebase's `defineSchema()` implementations.
 * @param {object} fnNode - FunctionDeclaration/FunctionExpression node
 * @param {string} source
 * @returns {{objectNode: object|null, hasDynamicAdditions: boolean}}
 */
export function findReturnedObjectLiteral(fnNode, source) {
    const body = fnNode.body;
    if (!body || body.type !== 'BlockStatement') return {objectNode: null, hasDynamicAdditions: false};

    const returns = body.body.filter(s => s.type === 'ReturnStatement' && s.argument);
    if (!returns.length) return {objectNode: null, hasDynamicAdditions: false};
    const ret = returns[returns.length - 1];

    let hasDynamicAdditions = false;
    for (const stmt of body.body) {
        if (stmt.type === 'ForStatement' || stmt.type === 'ForOfStatement' || stmt.type === 'ForInStatement') {
            hasDynamicAdditions = true;
        }
    }

    if (ret.argument.type === 'ObjectExpression') {
        return {objectNode: ret.argument, hasDynamicAdditions};
    }
    if (ret.argument.type === 'Identifier') {
        const name = ret.argument.name;
        for (const stmt of body.body) {
            if (stmt.type === 'VariableDeclaration') {
                for (const decl of stmt.declarations) {
                    if (decl.id.type === 'Identifier' && decl.id.name === name && decl.init && decl.init.type === 'ObjectExpression') {
                        return {objectNode: decl.init, hasDynamicAdditions};
                    }
                }
            }
        }
    }
    return {objectNode: null, hasDynamicAdditions};
}

/**
 * Find local variable names assigned directly to `super.defineSchema()`
 * (e.g. `const base = super.defineSchema();`), so that `...base` spreads
 * later in the same function can also be recognized as "inherited fields,
 * already covered by the real `extends` relationship".
 * @param {object} fnNode - FunctionDeclaration/FunctionExpression node
 * @returns {string[]}
 */
function findSuperDefineSchemaAliases(fnNode) {
    const names = [];
    const body = fnNode.body;
    if (!body || body.type !== 'BlockStatement') return names;
    for (const stmt of body.body) {
        if (stmt.type !== 'VariableDeclaration') continue;
        for (const decl of stmt.declarations) {
            if (decl.id.type === 'Identifier' && decl.init && isSuperDefineSchemaCall(decl.init)) {
                names.push(decl.id.name);
            }
        }
    }
    return names;
}

function isSuperDefineSchemaCall(node) {
    return node.type === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.object.type === 'Super'
        && node.callee.property.type === 'Identifier'
        && node.callee.property.name === 'defineSchema';
}

/**
 * Extract member info (methods/fields) from a ClassBody.
 * @param {object} classBodyNode
 * @param {string} source
 * @param {Array} comments
 */
function extractMembers(classBodyNode, source, comments) {
    const members = [];
    let defineSchemaMethodNode = null;

    for (const el of classBodyNode.body) {
        if (el.type === 'StaticBlock') continue;
        const isField = el.type === 'PropertyDefinition';
        const name = keyName(el.key, source);
        const isStatic = !!el.static;
        const doc = leadingComment(comments, el.start, source);

        if (isField) {
            members.push({
                kind: 'field',
                name,
                static: isStatic,
                private: el.key.type === 'PrivateIdentifier',
                valueNode: el.value ?? null,
                doc,
            });
        } else if (el.type === 'MethodDefinition') {
            const fn = el.value;
            members.push({
                kind: el.kind, // 'constructor' | 'method' | 'get' | 'set'
                name,
                static: isStatic,
                private: el.key.type === 'PrivateIdentifier',
                params: fn.params.map(p => source.slice(p.start, p.end)),
                isAsync: !!fn.async,
                isGenerator: !!fn.generator,
                doc,
                fnNode: fn,
            });
            if (el.kind === 'method' && isStatic && name === 'defineSchema') {
                defineSchemaMethodNode = fn;
            }
        }
    }
    return {members, defineSchemaMethodNode};
}

function superClassInfo(node, source) {
    if (!node) return {raw: null, kind: null};
    const raw = source.slice(node.start, node.end);
    if (node.type === 'Identifier') return {raw, kind: 'local', name: node.name};
    if (node.type === 'MemberExpression') return {raw, kind: 'foreign'};
    return {raw, kind: 'other'};
}

/**
 * Parse one JS source file and extract classes (including anonymous classes
 * returned by "factory" functions), top-level helper functions, and
 * `UOSE.register*` / `UOSE.publicView().x = y` call sites.
 * @param {string} absPath
 * @param {string} relPath - path relative to the scripts/ root, posix separators
 */
export function parseSourceFile(absPath, relPath) {
    const source = fs.readFileSync(absPath, 'utf-8');
    const comments = [];
    let ast;
    try {
        ast = acorn.parse(source, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowHashBang: true,
            onComment: comments,
        });
    } catch (e) {
        console.error(`Warning: failed to parse ${relPath}: ${e.message}`);
        return null;
    }

    const classes = [];
    const topLevelFunctions = new Map();
    const registerCalls = [];
    const directAssignments = [];

    function handleClassNode(classNode, {isExported, factoryName = null, factoryParams = null}) {
        const {members, defineSchemaMethodNode} = extractMembers(classNode.body, source, comments);
        let schemaResolution = null;
        let superAliasNames = [];
        if (defineSchemaMethodNode) {
            schemaResolution = findReturnedObjectLiteral(defineSchemaMethodNode, source);
            superAliasNames = findSuperDefineSchemaAliases(defineSchemaMethodNode);
        }
        classes.push({
            name: factoryName ?? (classNode.id ? classNode.id.name : '(anonymous)'),
            isExported,
            isFactory: !!factoryName,
            factoryParams,
            superClass: superClassInfo(classNode.superClass, source),
            doc: leadingComment(comments, (factoryName ? classNode.start : classNode.start), source),
            members,
            schemaObjectNode: schemaResolution ? schemaResolution.objectNode : null,
            schemaHasDynamicAdditions: schemaResolution ? schemaResolution.hasDynamicAdditions : false,
            schemaSuperAliases: superAliasNames,
            hasDefineSchema: !!defineSchemaMethodNode,
        });
    }

    for (const stmt of ast.body) {
        let inner = stmt;
        let isExported = false;
        if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration) {
            inner = stmt.declaration;
            isExported = true;
        } else if (stmt.type === 'ExportDefaultDeclaration') {
            inner = stmt.declaration;
            isExported = true;
        }

        if (inner.type === 'ClassDeclaration') {
            handleClassNode(inner, {isExported});
        } else if (inner.type === 'FunctionDeclaration' && inner.id) {
            topLevelFunctions.set(inner.id.name, inner);
            // Class-factory pattern: `function X(...) { return class extends Y {...}; }`
            const {objectNode: _unused} = {objectNode: null};
            const returns = inner.body.body.filter(s => s.type === 'ReturnStatement' && s.argument);
            const classReturn = returns.find(r => r.argument.type === 'ClassExpression');
            if (classReturn) {
                handleClassNode(classReturn.argument, {
                    isExported,
                    factoryName: inner.id.name,
                    factoryParams: inner.params.map(p => source.slice(p.start, p.end)),
                });
            }
        } else if (stmt.type === 'ExpressionStatement') {
            const expr = stmt.expression;
            if (expr.type === 'CallExpression'
                && expr.callee.type === 'MemberExpression'
                && expr.callee.object.type === 'Identifier'
                && expr.callee.object.name === 'UOSE'
                && expr.callee.property.type === 'Identifier'
                && expr.callee.property.name.startsWith('register')) {
                registerCalls.push({
                    method: expr.callee.property.name,
                    args: expr.arguments.map(a => describeArg(a, source)),
                });
            } else if (expr.type === 'AssignmentExpression'
                && expr.left.type === 'MemberExpression'
                && expr.left.object.type === 'CallExpression'
                && expr.left.object.callee.type === 'MemberExpression'
                && expr.left.object.callee.object.name === 'UOSE'
                && expr.left.object.callee.property.name === 'publicView'
                && expr.left.property.type === 'Identifier') {
                directAssignments.push({
                    field: expr.left.property.name,
                    valueDescr: describeArg(expr.right, source),
                });
            }
        }
    }

    return {
        relPath,
        dirRelPath: path.posix.dirname(relPath),
        source,
        classes,
        topLevelFunctions,
        registerCalls,
        directAssignments,
    };
}

/**
 * Lightweight description of a call argument, used to resolve
 * `UOSE.register*` call sites without a full expression evaluator.
 */
function describeArg(node, source) {
    if (node.type === 'Identifier') return {kind: 'identifier', name: node.name};
    if (node.type === 'MemberExpression'
        && node.object.type === 'Identifier' && node.object.name === 'UOSE'
        && node.property.type === 'Identifier') {
        return {kind: 'uoseConstant', name: node.property.name};
    }
    if (node.type === 'Literal') return {kind: 'literal', value: node.value};
    if (node.type === 'NewExpression' && node.callee.type === 'Identifier') {
        return {kind: 'new', name: node.callee.name};
    }
    return {kind: 'raw', text: source.slice(node.start, node.end)};
}

export {isSuperDefineSchemaCall, findReturnedObjectLiteral as _findReturnedObjectLiteral};

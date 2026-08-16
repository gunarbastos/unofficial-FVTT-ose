import fs from 'node:fs';
import * as acorn from 'acorn';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Collect every name bound by a declaration id, including destructuring forms.
 * @param {object} idNode
 * @param {string[]} out
 */
function collectPatternNames(idNode, out) {
    if (!idNode) return;
    switch (idNode.type) {
        case 'Identifier':
            out.push(idNode.name);
            break;
        case 'ObjectPattern':
            for (const prop of idNode.properties) {
                if (prop.type === 'RestElement') collectPatternNames(prop.argument, out);
                else collectPatternNames(prop.value, out);
            }
            break;
        case 'ArrayPattern':
            for (const el of idNode.elements) collectPatternNames(el, out);
            break;
        case 'AssignmentPattern':
            collectPatternNames(idNode.left, out);
            break;
        case 'RestElement':
            collectPatternNames(idNode.argument, out);
            break;
        default:
            break;
    }
}

/**
 * Parse a source file, returning the AST or null on a syntax error.
 * Options match `lib/jsdocsParser.js` so both tools accept the same language.
 * @param {string} filePath - absolute path
 * @returns {object|null}
 */
export function parseFile(filePath) {
    const source = fs.readFileSync(filePath, 'utf-8');
    try {
        return acorn.parse(source, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            allowHashBang: true,
        });
    } catch (e) {
        console.error(`Warning: failed to parse ${filePath}: ${e.message}`);
        return null;
    }
}

/**
 * Names exported by a source file, in source order.
 *
 * Parsed rather than pattern-matched: a regex cannot tell an export from the
 * same text inside a comment or a string literal, and misses multi-declarator
 * and destructuring forms entirely. See `uose-docs/INDEXES-ACORN.md`.
 *
 * `export default` is skipped - it cannot be re-exported by bare name from a
 * barrel. `export * from` contributes no names.
 *
 * @param {string} filePath - absolute path
 * @returns {string[]|null} null when the file could not be parsed
 */
export function collectExports(filePath) {
    const ast = parseFile(filePath);
    if (!ast) return null;

    const names = [];
    for (const stmt of ast.body) {
        if (stmt.type !== 'ExportNamedDeclaration') continue;

        if (stmt.declaration) {
            const declaration = stmt.declaration;
            if (declaration.type === 'VariableDeclaration') {
                for (const declarator of declaration.declarations) collectPatternNames(declarator.id, names);
            } else if (declaration.id) {
                names.push(declaration.id.name);
            }
            continue;
        }

        for (const spec of stmt.specifiers) {
            const exported = spec.exported;
            const name = exported.type === 'Identifier' ? exported.name : String(exported.value);
            if (name === 'default') continue;
            names.push(name);
        }
    }
    return names;
}

/**
 * Relative imports and re-export sources in a file, with the names each pulls in.
 * Absolute/bare specifiers (`acorn`, `node:fs`) are ignored - nothing to resolve
 * against the source tree.
 * @param {string} filePath - absolute path
 * @returns {Array<{specifier: string, names: string[], namespace: boolean}>|null}
 */
export function collectImports(filePath) {
    const ast = parseFile(filePath);
    if (!ast) return null;

    const out = [];
    for (const stmt of ast.body) {
        const isImport = stmt.type === 'ImportDeclaration';
        const isReExport = (stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportAllDeclaration') && stmt.source;
        if (!isImport && !isReExport) continue;

        const specifier = stmt.source.value;
        if (!specifier.startsWith('.')) continue;

        const names = [];
        let namespace = false;
        for (const spec of stmt.specifiers ?? []) {
            if (spec.type === 'ImportSpecifier') names.push(spec.imported.name);
            else if (spec.type === 'ExportSpecifier') names.push(spec.local.name);
            else namespace = true; // default or namespace import - not name-checkable here
        }
        if (stmt.type === 'ExportAllDeclaration') namespace = true;

        out.push({specifier, names, namespace});
    }
    return out;
}

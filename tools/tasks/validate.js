import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';
import {collectExports, collectImports, parseFile} from '../lib/jsExports.js';

console.log(`Loaded: ${import.meta.url}`);

const problems = [];

/**
 * @param {string} check - short check name, e.g. 'barrel'
 * @param {string} where - path the problem is about
 * @param {string} message
 */
function report(check, where, message) {
    problems.push({check, where, message});
}

/**
 * Every `.js`/`.mjs` directly in `dir`, excluding `index.js`.
 * @param {string} dir
 * @returns {string[]} absolute paths
 */
function looseJsFiles(dir) {
    return fs.readdirSync(dir, {withFileTypes: true})
        .filter(e => e.isFile() && ['.js', '.mjs'].includes(path.extname(e.name)) && e.name !== 'index.js')
        .map(e => path.join(dir, e.name));
}

/**
 * Every directory at or under `root`, breadth first.
 * @param {string} root
 * @returns {string[]}
 */
function allDirs(root) {
    const out = [];
    const stack = [root];
    while (stack.length) {
        const dir = stack.shift();
        out.push(dir);
        for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
            if (entry.isDirectory()) stack.push(path.join(dir, entry.name));
        }
    }
    return out;
}

// ---------------------------------------------------------------------------
// 1. Barrels exist and cover what they should
// ---------------------------------------------------------------------------

function checkBarrels(scriptsRoot) {
    for (const dir of allDirs(scriptsRoot)) {
        const files = looseJsFiles(dir);
        const indexFile = path.join(dir, 'index.js');
        const hasIndex = fs.existsSync(indexFile);

        const expected = new Map(); // exported name -> source file basename
        let anyExports = false;
        for (const file of files) {
            const names = collectExports(file);
            if (names === null) {
                report('parse', file, 'file could not be parsed');
                continue;
            }
            if (names.length) anyExports = true;
            for (const name of names) expected.set(name, path.basename(file));
        }

        if (!anyExports) {
            if (hasIndex) report('barrel', indexFile, 'folder yields no exports but a stale index.js is present');
            continue;
        }

        if (!hasIndex) {
            report('barrel', dir, 'folder has exporting .js files but no index.js');
            continue;
        }

        const barrelNames = collectExports(indexFile);
        if (barrelNames === null) {
            report('parse', indexFile, 'barrel could not be parsed');
            continue;
        }
        const barrelSet = new Set(barrelNames);

        for (const [name, from] of expected) {
            if (!barrelSet.has(name)) {
                report('barrel', indexFile, `missing export "${name}" from ${from} - regenerate with: tools indexes --dir=...`);
            }
        }
        for (const name of barrelNames) {
            if (!expected.has(name)) {
                report('barrel', indexFile, `exports "${name}" which no file in the folder provides - stale barrel`);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// 2. Every `order` entry resolves
// ---------------------------------------------------------------------------

function checkOrderFiles(roots) {
    for (const root of roots) {
        const isLess = path.basename(root) === 'less';
        for (const dir of allDirs(root)) {
            const orderFile = path.join(dir, 'order');
            if (!fs.existsSync(orderFile)) continue;

            const entries = common.readOrderFile(dir, isLess ? '' : 'js');

            for (const entry of entries) {
                // A LESS order entry may carry space-separated import options:
                // `mixins.less reference` names the file plus an option.
                const nameOnly = isLess ? entry.split(/\s+/)[0] : entry;
                const asGiven = path.join(dir, nameOnly);
                const asLess = path.join(dir, nameOnly.endsWith('.less') ? nameOnly : `${nameOnly}.less`);
                if (fs.existsSync(asGiven) || (isLess && fs.existsSync(asLess))) continue;
                report(
                    'order',
                    orderFile,
                    `entry "${entry}" resolves to nothing`
                    + (isLess ? '' : ' - silently skipped, folder falls back to alphabetical'),
                );
            }
        }
    }
}

// ---------------------------------------------------------------------------
// 3. Registered class names resolve under the key pattern
// ---------------------------------------------------------------------------

/**
 * Read `UOSE.#classNamePattern` and `#domainNameGroups` out of the source rather
 * than duplicating them, so there is one definition of the naming rule.
 * @param {string} uoseJsPath
 * @returns {{pattern: RegExp, replacement: string}|null}
 */
function loadClassNamePattern(uoseJsPath) {
    const ast = parseFile(uoseJsPath);
    if (!ast) return null;

    let pattern = null;
    let replacement = null;

    for (const stmt of ast.body) {
        const decl = stmt.type === 'ExportNamedDeclaration' ? stmt.declaration : stmt;
        if (!decl || decl.type !== 'ClassDeclaration' || decl.id?.name !== 'UOSE') continue;

        for (const el of decl.body.body) {
            if (el.type !== 'PropertyDefinition' || !el.static || !el.value) continue;
            const key = el.key.type === 'PrivateIdentifier' ? `#${el.key.name}` : el.key.name;
            if (key === '#classNamePattern' && el.value.type === 'Literal' && el.value.regex) {
                pattern = new RegExp(el.value.regex.pattern, el.value.regex.flags);
            }
            if (key === '#domainNameGroups' && el.value.type === 'Literal') {
                replacement = String(el.value.value);
            }
        }
    }

    if (!pattern || replacement === null) return null;
    return {pattern, replacement};
}

/**
 * Register call sites in a file, as `{method, className}` pairs.
 *
 * Only `registerDocument`, `registerDataModel`, `registerSheet` and `registerApp`
 * derive their key through `#classNamePattern`. `registerBaseClass` and
 * `registerReplacement` strip a bare `UOSE` prefix instead, and `registerEffect`
 * uses `cls.type` - so the pattern must not be applied to those.
 * @param {string} filePath
 * @returns {Array<{method: string, className: string}>}
 */
function registerCalls(filePath) {
    const ast = parseFile(filePath);
    if (!ast) return [];

    const calls = [];
    for (const stmt of ast.body) {
        if (stmt.type !== 'ExpressionStatement') continue;
        const expr = stmt.expression;
        if (expr.type !== 'CallExpression') continue;
        const callee = expr.callee;
        if (callee.type !== 'MemberExpression') continue;
        if (callee.object.type !== 'Identifier' || callee.object.name !== 'UOSE') continue;
        if (callee.property.type !== 'Identifier' || !callee.property.name.startsWith('register')) continue;

        for (const arg of expr.arguments) {
            if (arg.type === 'Identifier' && /^(UOSE|TGL)/.test(arg.name)) {
                calls.push({method: callee.property.name, className: arg.name});
            }
        }
    }
    return calls;
}

/** Register methods whose key is derived through `#classNamePattern`. */
const PATTERN_DERIVED = new Set(['registerDocument', 'registerDataModel', 'registerSheet', 'registerApp']);

function checkClassNames(scriptsRoot, uoseJsPath) {
    const loaded = loadClassNamePattern(uoseJsPath);
    if (!loaded) {
        report('naming', uoseJsPath, 'could not read UOSE.#classNamePattern / #domainNameGroups - names not checked');
        return;
    }

    for (const dir of allDirs(scriptsRoot)) {
        for (const file of looseJsFiles(dir)) {
            for (const {method, className} of registerCalls(file)) {
                if (!PATTERN_DERIVED.has(method)) continue;
                const key = className.replace(loaded.pattern, loaded.replacement);
                if (key === className) {
                    report('naming', file, `"${className}" does not match the key pattern used by ${method}() - it would register under its full literal`);
                } else if (!key) {
                    report('naming', file, `"${className}" derives an empty registry key`);
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// 4. system.json documentTypes round-trips against registered data models
// ---------------------------------------------------------------------------

function checkDocumentTypes(projectRoot, scriptsRoot, uoseJsPath) {
    const manifestPath = path.join(projectRoot, 'unofficial-FVTT-ose', 'system.json');
    if (!fs.existsSync(manifestPath)) {
        report('manifest', manifestPath, 'system.json not found');
        return;
    }
    const loaded = loadClassNamePattern(uoseJsPath);
    if (!loaded) return; // already reported by checkClassNames

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    for (const [documentName, folder] of [['Actor', 'actors'], ['Item', 'items']]) {
        const declared = new Set(Object.keys(manifest.documentTypes?.[documentName] ?? {}));

        const modelDir = path.join(scriptsRoot, 'dataModels', folder);
        const derived = new Set();
        if (fs.existsSync(modelDir)) {
            for (const file of looseJsFiles(modelDir)) {
                for (const {method, className} of registerCalls(file)) {
                    if (method !== 'registerDataModel') continue; // base classes are not types
                    const key = className.replace(loaded.pattern, loaded.replacement);
                    if (key && key !== className) derived.add(key);
                }
            }
        }

        for (const key of derived) {
            if (!declared.has(key)) {
                report('manifest', manifestPath, `${documentName} type "${key}" is registered in code but not declared in documentTypes`);
            }
        }
        for (const key of declared) {
            if (!derived.has(key)) {
                report('manifest', manifestPath, `${documentName} type "${key}" is declared in documentTypes but no data model registers it`);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// 5. Relative imports resolve to a real file and a real exported name
// ---------------------------------------------------------------------------

const exportCache = new Map();

function exportsOf(filePath) {
    if (!exportCache.has(filePath)) exportCache.set(filePath, collectExports(filePath) ?? []);
    return exportCache.get(filePath);
}

function checkImports(scriptsRoot) {
    for (const dir of allDirs(scriptsRoot)) {
        const files = [...looseJsFiles(dir)];
        const indexFile = path.join(dir, 'index.js');
        if (fs.existsSync(indexFile)) files.push(indexFile);

        for (const file of files) {
            const imports = collectImports(file);
            if (imports === null) continue; // parse failure already reported

            for (const entry of imports) {
                let target = path.resolve(dir, entry.specifier);
                if (!path.extname(target)) target = `${target}.js`;

                if (!fs.existsSync(target)) {
                    report('import', file, `"${entry.specifier}" resolves to a file that does not exist`);
                    continue;
                }
                if (entry.namespace) continue;

                const available = new Set(exportsOf(target));
                for (const name of entry.names) {
                    if (!available.has(name)) {
                        report('import', file, `imports "${name}" from "${entry.specifier}", which does not export it`);
                    }
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------

export async function validate() {
    const projectRoot = common.projectRoot();
    const scriptsRoot = path.join(projectRoot, 'unofficial-FVTT-ose', 'scripts');
    const lessRoot = path.join(projectRoot, 'unofficial-FVTT-ose', 'less');
    const uoseJsPath = path.join(scriptsRoot, 'foundry', 'uose.js');

    if (!fs.existsSync(scriptsRoot)) {
        common.fail(`Directory ${scriptsRoot} does not exist`);
    }

    console.log(`Validating ${scriptsRoot} ...`);

    checkBarrels(scriptsRoot);
    checkOrderFiles([scriptsRoot, lessRoot].filter(dir => fs.existsSync(dir)));
    checkClassNames(scriptsRoot, uoseJsPath);
    checkDocumentTypes(projectRoot, scriptsRoot, uoseJsPath);
    checkImports(scriptsRoot);

    if (!problems.length) {
        console.log('validate: no problems found.');
        process.exit(0);
    }

    const byCheck = new Map();
    for (const problem of problems) {
        if (!byCheck.has(problem.check)) byCheck.set(problem.check, []);
        byCheck.get(problem.check).push(problem);
    }

    for (const [check, list] of byCheck) {
        console.error(`\n[${check.toUpperCase()}] ${list.length} problem(s)`);
        for (const problem of list) console.error(`  ${problem.where}\n    ${problem.message}`);
    }

    console.error(`\nvalidate: ${problems.length} problem(s) found.`);
    process.exit(1);
}

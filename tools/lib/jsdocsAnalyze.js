import fs from 'node:fs';
import path from 'node:path';
import {parseSourceFile} from './jsdocsParser.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Recursively find every `.js`/`.mjs` file under `root`, excluding `index.js`.
 * @param {string} root
 * @returns {Array<{abs: string, rel: string}>}
 */
function walkJsFiles(root) {
    const out = [];
    const stack = [root];
    while (stack.length) {
        const dir = stack.shift();
        for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
            const abs = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                stack.push(abs);
            } else if (entry.isFile() && ['.js', '.mjs'].includes(path.extname(entry.name)) && entry.name !== 'index.js') {
                out.push({abs, rel: path.relative(root, abs).split(path.sep).join('/')});
            }
        }
    }
    return out;
}

/**
 * Parse the whole scripts/ tree (needed for correct cross-file `extends`
 * resolution and the global `_uose` registry, even when only regenerating
 * a single directory's output file).
 * @param {string} scriptsRoot
 * @returns {Array<object>} parsed file objects (jsdocsParser.parseSourceFile results), nulls filtered out
 */
export function analyzeScripts(scriptsRoot) {
    const files = walkJsFiles(scriptsRoot);
    const parsed = [];
    for (const f of files) {
        const result = parseSourceFile(f.abs, f.rel);
        if (result) parsed.push(result);
    }
    return parsed;
}

/**
 * Group parsed files by their directory (relative to scripts/).
 * @param {Array<object>} parsedFiles
 * @returns {Map<string, object[]>}
 */
export function groupByDirectory(parsedFiles) {
    const byDir = new Map();
    for (const file of parsedFiles) {
        if (!byDir.has(file.dirRelPath)) byDir.set(file.dirRelPath, []);
        byDir.get(file.dirRelPath).push(file);
    }
    return byDir;
}

/**
 * Build a global name -> {classInfo, file} index across every parsed file.
 * Covers both real classes and factory-produced classes (both are plain
 * entries in `file.classes`). Needed to walk `extends` chains for schema
 * flattening without redeclaring any class ourselves.
 * @param {Array<object>} parsedFiles
 * @returns {Map<string, {classInfo: object, file: object}>}
 */
export function buildClassIndex(parsedFiles) {
    const index = new Map();
    for (const file of parsedFiles) {
        for (const classInfo of file.classes) {
            if (index.has(classInfo.name)) {
                console.error(`Warning: duplicate class name "${classInfo.name}" found in both `
                    + `${index.get(classInfo.name).file.relPath} and ${file.relPath}`);
            }
            index.set(classInfo.name, {classInfo, file});
        }
    }
    return index;
}

export {walkJsFiles};

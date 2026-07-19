import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';

console.log(`Loaded: ${import.meta.url}`);

/** @typedef {{ path: string, options: string[] }} LessFile */

/**
 * Return {dirs, files} for the immediate children of `folder`.
 * Files are only .less (excluding main.less).
 * @param {string} folder
 * @returns {{dirs: string[], files: string[]}}
 */
function partitionChildren(folder) {
    const dirs = [];
    const files = [];
    for (const entry of fs.readdirSync(folder, {withFileTypes: true})) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(folder, entry.name);
        if (entry.isDirectory()) {
            dirs.push(full);
        } else if (entry.isFile()) {
            if (entry.name.endsWith('.less') && entry.name !== 'main.less') files.push(full);
        }
    }
    return {dirs, files};
}

/**
 * Match an 'order' entry to a child name. Accepts either exact name (with
 * extension for files) or name without .less for files. Directories match by exact name.
 * @param {string} entry
 * @param {string} candidate - absolute path
 * @param {boolean} candidateIsDir
 */
function nameMatches(entry, candidate, candidateIsDir) {
    const name = path.basename(candidate);
    if (candidateIsDir) return entry === name;
    if (entry === name) return true;
    if (name.endsWith('.less') && entry === name.slice(0, -'.less'.length)) return true;
    return false;
}

/**
 * Given desired 'entries' and the current immediate dirs/files, pick the ones
 * that match (preserving order).
 * @returns {{orderedDirs: string[], orderedFiles: LessFile[], remainingDirs: string[], remainingFiles: string[]}}
 */
function consumeInOrder(entries, dirs, files, orderFileMtimeMs, graceSeconds = 5) {
    const orderedDirs = [];
    const orderedFiles = [];
    const remainingDirs = [...dirs];
    const remainingFiles = [...files];

    function popFirstMatch(name, items, isDir) {
        const idx = items.findIndex(p => nameMatches(name, p, isDir));
        if (idx === -1) return null;
        return items.splice(idx, 1)[0];
    }

    const recentlyEdited = orderFileMtimeMs != null && (Date.now() - orderFileMtimeMs) < graceSeconds * 1000;

    for (const entry of entries) {
        const parts = entry.split(' ');
        const file = parts.shift();

        let hit = popFirstMatch(file, remainingDirs, true);
        if (hit) {
            orderedDirs.push(hit);
            continue;
        }
        hit = popFirstMatch(file, remainingFiles, false);
        if (hit) {
            orderedFiles.push({path: hit, options: parts});
            continue;
        }
        if (!recentlyEdited) {
            common.fail(`Error: order entry '${file}' not found`);
        }
    }

    return {orderedDirs, orderedFiles, remainingDirs, remainingFiles};
}

/**
 * Depth-first traversal of `folder`:
 *  - obey 'order' file for immediate children
 *  - then any remaining dirs/files (dirs first), alpha by relative path
 *  - recurse into dirs; files are yielded in place
 * Returns a list of `@import` lines for .less files (excluding main.less), in traversal order.
 * @param {string} folder
 * @param {string} base
 * @returns {string[]}
 */
function walkLessInFolder(folder, base) {
    const orderEntries = common.readOrderFile(folder);
    const {dirs, files} = partitionChildren(folder);

    const orderFilePath = path.join(folder, 'order');
    const orderFileMtimeMs = orderEntries.length ? fs.statSync(orderFilePath).mtimeMs : null;

    const {orderedDirs, orderedFiles, remainingDirs, remainingFiles} =
        consumeInOrder(orderEntries, dirs, files, orderFileMtimeMs);

    const relLower = p => path.relative(base, p).split(path.sep).join('/').toLowerCase();
    remainingDirs.sort((a, b) => relLower(a).localeCompare(relLower(b)));
    remainingFiles.sort((a, b) => relLower(a).localeCompare(relLower(b)));

    const seqDirs = [...orderedDirs, ...remainingDirs];

    const out = [];
    for (const d of seqDirs) out.push(...walkLessInFolder(d, base));

    for (const file of orderedFiles) {
        const rel = path.relative(base, file.path).split(path.sep).join('/');
        const opts = file.options.length ? `(${file.options.join(', ')}) ` : '';
        out.push(`@import ${opts}"${rel}";`);
    }
    for (const file of remainingFiles) {
        const rel = path.relative(base, file).split(path.sep).join('/');
        out.push(`@import "${rel}";`);
    }

    return out;
}

/**
 * Build main.less content: header + @import lines for all .less files under
 * less_dir, respecting per-folder 'order' files.
 * @param {string} lessDir
 * @returns {string}
 */
function buildMainLessContent(lessDir) {
    const ordered = walkLessInFolder(lessDir, lessDir);
    const header = `// File generated automatically.\n// Last Updated: ${common.formatHeaderTimestamp(common.nowTmz())}\n\n`;
    const imports = ordered.join('\n');
    return header + imports + (imports ? '\n' : '');
}

/**
 * First run: always overwrite if file exists with different body OR if not present.
 * Later runs: only rewrite if body (everything after first two header lines) changed.
 * @returns {boolean} true if the file was written/updated
 */
function writeIfBodyChanged(target, newContent) {
    const created = !fs.existsSync(target);
    if (!created) {
        const existing = fs.readFileSync(target, 'utf-8').split('\n');
        const fresh = newContent.split('\n');
        const existingBody = existing.slice(3).join('\n');
        const newBody = fresh.slice(3).join('\n');
        if (existingBody === newBody) return false;
    }
    fs.writeFileSync(target, newContent, 'utf-8');
    return true;
}

export async function compileLess() {
    const projectDir = common.projectRoot();
    const lessDir = path.join(projectDir, 'unofficial-FVTT-ose', 'less');
    const mainLess = path.join(lessDir, 'main.less');
    const outputCss = path.join(projectDir, 'unofficial-FVTT-ose', 'main.css');

    if (!fs.existsSync(lessDir)) {
        console.log(`LESS source dir not found: ${lessDir}`);
        process.exit(1);
    }

    // 1) Generate desired main.less content (order-file aware traversal)
    const newMain = buildMainLessContent(lessDir);

    // 2) Write only if body changed (ignoring the first three header lines)
    const changed = writeIfBodyChanged(mainLess, newMain);
    if (changed) console.log(`Updated ${mainLess}`);

    // 3) Compile to CSS using the `less` package's JS API (replaces the old
    //    shell-out to node_modules/.bin/lessc.cmd, so this works the same way
    //    cross-platform without depending on a Windows-only binary name).
    console.log(`Running LESS compiler on: ${mainLess}`);
    try {
        const less = (await import('less')).default;
        const source = fs.readFileSync(mainLess, 'utf-8');
        const result = await less.render(source, {filename: mainLess, paths: [lessDir]});
        fs.writeFileSync(outputCss, result.css, 'utf-8');
        console.log('Compilation successful.');
    } catch (e) {
        console.log(`LESS compilation failed: ${e.message ?? e}`);
        process.exit(1);
    }
}

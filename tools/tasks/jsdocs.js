import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';
import {analyzeScripts, groupByDirectory, buildClassIndex} from '../lib/jsdocsAnalyze.js';
import {buildRegistry} from '../lib/jsdocsRegistry.js';
import {renderDirectoryFile} from '../lib/jsdocsRender.js';
import {renderUoseFile, buildLangTypedef} from '../lib/jsdocsUoseGen.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Map a scripts-relative directory path to its aggregate jsdoc output filename,
 * e.g. "sheets/actors" -> "sheetsActors.js", "dataModels" -> "dataModels.js".
 * @param {string} dirRelPath
 * @returns {string}
 */
function dirToOutputFileName(dirRelPath) {
    if (!dirRelPath || dirRelPath === '.') return 'scripts.js';
    const parts = dirRelPath.split('/');
    return parts.map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('') + '.js';
}

/**
 * Only write `content` to `target` if its body changed, mirroring the
 * "ignore the first few header lines" convention used by indexes.js/lessc.js
 * so watcher-triggered regenerations don't create noisy timestamp-only diffs.
 * @param {string} target
 * @param {string} content
 * @param {number} headerLines
 */
function writeIfBodyChanged(target, content, headerLines) {
    if (fs.existsSync(target)) {
        const existing = fs.readFileSync(target, 'utf-8').split('\n');
        const fresh = content.split('\n');
        const existingBody = existing.slice(headerLines).join('\n');
        const newBody = fresh.slice(headerLines).join('\n');
        if (existingBody === newBody) return false;
    }
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content, 'utf-8');
    return true;
}

/**
 * @param {string|null} file - a changed file's path; only its directory's output is rewritten
 * @param {string|null} dir - a directory whose output should be rewritten
 */
export async function generateJsdocs(file, dir) {
    const projectRoot = common.projectRoot();
    const scriptsRoot = path.join(projectRoot, 'unofficial-FVTT-ose', 'scripts');
    const jsdocsRoot = path.join(projectRoot, 'jsdocs');
    const langJsonPath = path.join(projectRoot, 'unofficial-FVTT-ose', 'lang', 'en.json');

    if (!fs.existsSync(scriptsRoot)) {
        console.log(`Directory ${scriptsRoot} does not exist`);
        process.exit(1);
    }

    console.log(`Analyzing ${scriptsRoot} ...`);
    const parsedFiles = analyzeScripts(scriptsRoot);
    const byDir = groupByDirectory(parsedFiles);
    const registry = buildRegistry(parsedFiles);
    const classIndex = buildClassIndex(parsedFiles);
    const headerTimestamp = common.formatHeaderTimestamp(common.nowTmz());

    // Determine which directories' output files need to be (re)written.
    let targetDirs = null; // null => all
    if (file != null) {
        const abs = path.resolve(file);
        const rel = path.relative(scriptsRoot, path.dirname(abs)).split(path.sep).join('/');
        targetDirs = new Set([rel === '' ? '.' : rel]);
    } else if (dir != null) {
        const abs = path.resolve(dir);
        const rel = path.relative(scriptsRoot, abs).split(path.sep).join('/');
        targetDirs = new Set([rel === '' ? '.' : rel]);
    }

    let written = 0;
    const expectedFiles = new Set();
    for (const [dirRelPath, filesInDir] of byDir) {
        if (targetDirs && !targetDirs.has(dirRelPath)) continue;

        const orderEntries = common.readOrderFile(path.join(scriptsRoot, dirRelPath), 'js');
        const orderedFiles = [...filesInDir];
        if (orderEntries.length) {
            const remaining = [...orderedFiles];
            const ordered = [];
            for (const entry of orderEntries) {
                const idx = remaining.findIndex(f => f.relPath.split('/').pop() === entry);
                if (idx !== -1) ordered.push(remaining.splice(idx, 1)[0]);
            }
            remaining.sort((a, b) => a.relPath.localeCompare(b.relPath));
            orderedFiles.length = 0;
            orderedFiles.push(...ordered, ...remaining);
        } else {
            orderedFiles.sort((a, b) => a.relPath.localeCompare(b.relPath));
        }

        const content = renderDirectoryFile(dirRelPath, orderedFiles, registry, classIndex, headerTimestamp);
        if (!content) continue; // e.g. a directory with only helper functions and no classes

        const outFile = path.join(jsdocsRoot, dirToOutputFileName(dirRelPath));
        expectedFiles.add(outFile);
        const changed = writeIfBodyChanged(outFile, content, 2);
        if (changed) {
            console.log(`Updated ${outFile}`);
            written++;
        }
    }

    // The `_uose.js` registry file and lang typedef reflect the *whole* project,
    // so they're always considered (cheap to regenerate, and any register-call
    // change anywhere should be reflected here regardless of --file/--dir scope).
    const langTypedef = buildLangTypedef(langJsonPath);
    const uoseContent = renderUoseFile(registry, headerTimestamp, langTypedef);
    const uoseOutFile = path.join(jsdocsRoot, '_uose.js');
    expectedFiles.add(uoseOutFile);
    if (writeIfBodyChanged(uoseOutFile, uoseContent, 2)) {
        console.log(`Updated ${uoseOutFile}`);
        written++;
    }

    // Remove stale generated files (e.g. a directory that used to produce output
    // but no longer does). Only runs on a full, unscoped regeneration - a
    // --file/--dir run only examines a subset of directories, so it can't safely
    // know which *other* files are still valid. Guarded to only ever delete files
    // that carry our own generated-file marker, so hand-authored files placed in
    // /jsdocs are never touched.
    if (!targetDirs && fs.existsSync(jsdocsRoot)) {
        const MARKER = '// File generated automatically by `tools jsdocs`.';
        for (const entry of fs.readdirSync(jsdocsRoot, {withFileTypes: true})) {
            if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
            const full = path.join(jsdocsRoot, entry.name);
            if (expectedFiles.has(full)) continue;
            const firstLine = fs.readFileSync(full, 'utf-8').split('\n', 1)[0];
            if (firstLine.startsWith(MARKER)) {
                fs.rmSync(full);
                console.log(`Removed stale ${full}`);
                written++;
            }
        }
    }

    console.log(`jsdocs: ${written} file(s) updated.`);
    process.exit(0);
}

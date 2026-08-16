import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';
import {collectExports} from '../lib/jsExports.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * @param {string} directory - absolute path
 * @returns {'created'|'changed'|'unchanged'|'empty'}
 */
function generateIndexesInternal(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory ${directory} does not exist`);
        process.exit(1);
    }

    // The tooling is not a module tree. Generating a barrel here would overwrite
    // the CLI entry point with generated exports and break every invocation.
    if (common.isInsideToolsRoot(directory)) {
        common.fail(`Refusing to generate an index.js inside the tooling folder: ${directory}`);
    }

    console.log(`Generating index.js file for directory ${directory}`);

    const orderEntries = common.readOrderFile(directory, 'js');
    let fileList = fs.readdirSync(directory, {withFileTypes: true})
        .filter(f => f.isFile() && ['.js', '.mjs'].includes(path.extname(f.name)))
        .map(f => path.join(directory, f.name));

    const orderedFileList = [];
    for (const orderFile of orderEntries) {
        const idx = fileList.findIndex(f => path.basename(f) === orderFile);
        if (idx !== -1) {
            orderedFileList.push(fileList[idx]);
            fileList.splice(idx, 1);
        }
    }
    orderedFileList.push(...fileList);

    const exports = [];
    for (const file of orderedFileList) {
        if (path.basename(file) === 'index.js') continue;
        const baseName = path.basename(file, path.extname(file));
        const fileExports = collectExports(file);
        if (fileExports === null) continue;
        const joinedFileExports = fileExports.join(', ');
        exports.push(`export {${joinedFileExports}} from './${baseName}.js';`);
    }

    const now = common.nowTmz();
    const indexFile = path.join(directory, 'index.js');
    const createdFile = !fs.existsSync(indexFile);

    const header = `// File generated automatically.\n// Last Updated: ${common.formatHeaderTimestamp(now)}\n\n`;
    const body = 'console.log(`Loaded: ${import.meta.url}`);\n\n' + exports.join('\n') + '\n';
    const newContent = header + body;

    if (exports.length === 0) return 'empty';

    if (createdFile) {
        fs.writeFileSync(indexFile, newContent, 'utf-8');
        console.log(`[CREATED] ${indexFile} (staged with git add)`);
        common.run(['git', 'add', indexFile]);
        return 'created';
    }

    // Compare below the two-line header, so a timestamp alone is not a change
    const existingBody = fs.readFileSync(indexFile, 'utf-8').split('\n').slice(2).join('\n');
    const newBody = newContent.split('\n').slice(2).join('\n');
    if (existingBody === newBody) return 'unchanged';

    fs.writeFileSync(indexFile, newContent, 'utf-8');
    console.log(`[CHANGED] ${indexFile}`);
    return 'changed';
}

/**
 * @param {string|null} file - filename of the changed file; index.js of that folder is generated
 * @param {string|null} dir - directory to generate index.js for
 */
export async function generateIndexes(file, dir) {
    const tally = {created: 0, changed: 0, unchanged: 0, empty: 0};
    const record = (result) => {
        tally[result] += 1;
    };

    if (file != null) {
        record(generateIndexesInternal(path.dirname(path.resolve(file))));
    } else if (dir != null) {
        record(generateIndexesInternal(path.resolve(dir)));
    } else {
        const root = path.join(common.projectRoot(), 'unofficial-FVTT-ose', 'scripts');
        const stack = [root];
        while (stack.length) {
            const dirPath = stack.shift();
            record(generateIndexesInternal(dirPath));
            for (const entry of fs.readdirSync(dirPath, {withFileTypes: true})) {
                if (entry.isDirectory()) stack.push(path.join(dirPath, entry.name));
            }
        }
    }

    const touched = tally.created + tally.changed;
    console.log(`indexes: ${touched} file(s) updated`
        + ` (${tally.created} created, ${tally.changed} changed,`
        + ` ${tally.unchanged} unchanged, ${tally.empty} with no exports).`);

    process.exit(0);
}

import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';

console.log(`Loaded: ${import.meta.url}`);

const exportRegexes = [common.regex.EXPORT_DECL, common.regex.EXPORT_LIST];

/**
 * @param {string} directory - absolute path
 */
function generateIndexesInternal(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory ${directory} does not exist`);
        process.exit(1);
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
        const content = fs.readFileSync(file, 'utf-8');
        const baseName = path.basename(file, path.extname(file));
        const fileExports = [];
        for (const re of exportRegexes) {
            re.lastIndex = 0;
            let match;
            while ((match = re.exec(content)) !== null) {
                const rawNames = match[1].split(',');
                for (const name of rawNames) {
                    const parts = name.trim().split(common.regex.EXPORT_AS);
                    const exportName = parts.length > 1 ? parts[1].trim() : parts[0].trim();
                    if (exportName) fileExports.push(exportName);
                }
            }
        }
        const joinedFileExports = fileExports.join(', ');
        exports.push(`export {${joinedFileExports}} from './${baseName}.js';`);
    }

    const now = common.nowTmz();
    const indexFile = path.join(directory, 'index.js');
    const createdFile = !fs.existsSync(indexFile);

    const header = `// File generated automatically.\n// Last Updated: ${common.formatHeaderTimestamp(now)}\n\n`;
    const body = 'console.log(`Loaded: ${import.meta.url}`);\n\n' + exports.join('\n') + '\n';
    const newContent = header + body;

    if (exports.length > 0) {
        if (!createdFile) {
            const existingLines = fs.readFileSync(indexFile, 'utf-8').split('\n');
            const newLines = newContent.split('\n');
            const existingBody = existingLines.slice(2).join('\n');
            const newBody = newLines.slice(2).join('\n');
            if (existingBody !== newBody) {
                fs.writeFileSync(indexFile, newContent, 'utf-8');
            }
        } else {
            console.log(`adding ${indexFile} to git`);
            fs.writeFileSync(indexFile, newContent, 'utf-8');
            common.run(['git', 'add', indexFile]);
        }
    }
}

/**
 * @param {string|null} file - filename of the changed file; index.js of that folder is generated
 * @param {string|null} dir - directory to generate index.js for
 */
export async function generateIndexes(file, dir) {
    if (file != null) {
        generateIndexesInternal(path.dirname(path.resolve(file)));
    } else if (dir != null) {
        generateIndexesInternal(path.resolve(dir));
    } else {
        const root = path.join(common.projectRoot(), 'unofficial-FVTT-ose', 'scripts');
        const stack = [root];
        while (stack.length) {
            const dirPath = stack.shift();
            generateIndexesInternal(dirPath);
            for (const entry of fs.readdirSync(dirPath, {withFileTypes: true})) {
                if (entry.isDirectory()) stack.push(path.join(dirPath, entry.name));
            }
        }
    }
    process.exit(0);
}

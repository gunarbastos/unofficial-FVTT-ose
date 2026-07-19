import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Recursively list every file under `dir`, returning absolute paths.
 * @param {string} dir
 * @returns {string[]}
 */
function listFilesRecursive(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...listFilesRecursive(full));
        else if (entry.isFile()) out.push(full);
    }
    return out;
}

/**
 * @param {string|null} [tag] - release tag, e.g. "v1.2.3" or "1.2.3"
 */
export async function buildRelease(tag = null) {
    const projectRoot = common.projectRoot();
    let version, versionForPaths;
    if (tag) {
        version = common.normalizeVersion(tag);
        versionForPaths = `v${common.normalizeVersion(tag)}`;
    } else {
        version = 'dev';
        versionForPaths = 'dev';
    }

    const zipName = `unofficial-FVTT-ose-${versionForPaths}.zip`;

    const repo = common.parseOwnerRepoFromOrigin();
    const relDir = path.join(projectRoot, 'releases', version);
    fs.mkdirSync(relDir, {recursive: true});

    const systemPath = path.join(projectRoot, 'unofficial-FVTT-ose');
    const sysJsonPath = path.join(systemPath, 'system.json');
    const systemJson = JSON.parse(fs.readFileSync(sysJsonPath, 'utf-8'));

    if (tag) {
        systemJson.version = version;
        systemJson.url = `https://github.com/${repo}`;
        systemJson.readme = `https://raw.githubusercontent.com/${repo}/stable/README.md`;
        systemJson.changelog = `https://raw.githubusercontent.com/${repo}/stable/CHANGELOG.md`;
        systemJson.license = `https://raw.githubusercontent.com/${repo}/stable/LICENSE`;
        systemJson.manifest = `https://github.com/${repo}/releases/latest/download/system.json`;
        // NOTE: kept identical to the python version, including the trailing
        // ".zip.zip" duplication in the download URL - this looks like a bug
        // inherited from the original tooling, left as-is for parity.
        systemJson.download = `https://github.com/${repo}/releases/download/${versionForPaths}/${zipName}.zip`;
    }

    const newJsonPath = path.join(relDir, 'system.json');
    const serialized = JSON.stringify(systemJson, null, 2);
    fs.writeFileSync(sysJsonPath, serialized, 'utf-8');
    fs.writeFileSync(newJsonPath, serialized, 'utf-8');

    const zipPath = path.join(relDir, zipName);
    const {default: archiver} = await import('archiver');
    await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {zlib: {level: 9}});
        output.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(output);
        for (const file of listFilesRecursive(systemPath)) {
            archive.file(file, {name: path.relative(projectRoot, file).split(path.sep).join('/')});
        }
        archive.finalize();
    });

    console.log(`Built: ${version} @ ${relDir}`);
}

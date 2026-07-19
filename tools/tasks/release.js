import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as common from '../common.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Extract the markdown block for a version from a Keep a Changelog file.
 * Accepts headings like:
 *   ## [0.1.2] - 2025-09-26
 *   ## [v0.1.2] - 2025-09-26
 * and returns everything up to the next '## ' heading (or EOF).
 * @param {string} version
 * @param {string} changelogPath
 * @returns {string}
 */
function extractNotesFromChangelog(version, changelogPath) {
    if (!fs.existsSync(changelogPath)) {
        common.fail(`Error: CHANGELOG not found at "${changelogPath}".`);
    }
    const text = fs.readFileSync(changelogPath, 'utf-8');

    const headerRe = common.regex.CHANGELOG_HEADER_FOR(version);
    const m = headerRe.exec(text);
    if (!m) common.fail(`Error: CHANGELOG has no section for version ${version}.`);
    console.log(' - version present in CHANGELOG.md');

    const start = m.index + m[0].length;

    const nextHeaderRe = new RegExp(common.regex.CHANGELOG_NEXT_HEADER.source, common.regex.CHANGELOG_NEXT_HEADER.flags);
    nextHeaderRe.lastIndex = start;
    const n = nextHeaderRe.exec(text);
    const end = n ? n.index : text.length;

    const notes = text.slice(start, end).trim();
    if (!notes) common.fail(`Error: CHANGELOG section for ${version} is empty.`);
    console.log(' - version changes in CHANGELOG.md is not empty');

    return notes;
}

/**
 * Verify the reference link like:
 *   [0.1.2]: https://github.com/<owner>/<repo>/releases/tag/v0.1.2
 * exists and matches the version. Allows [v0.1.2] label too.
 * @param {string} version
 * @param {string} changelogPath
 */
function verifyVersionLinkReference(version, changelogPath) {
    const text = fs.readFileSync(changelogPath, 'utf-8');

    const m = common.regex.REF_LINE_URL_FOR(version).exec(text);
    if (!m) {
        common.fail(`Error: CHANGELOG is missing a reference link for version ${version} `
            + `(e.g., "[${version}]: https://.../releases/tag/v${version}").`);
    }

    const url = m[1];
    const expectedFragment = `/releases/tag/v${version}`;
    if (!url.includes(expectedFragment)) {
        common.fail(`Error: Version reference URL does not point to "${expectedFragment}".\nFound: ${url}`);
    }
    console.log(' - version link is present in CHANGELOG.md');
}

/**
 * @param {string} folder
 * @param {string} tagName
 */
function precheck(folder, tagName) {
    const {code: ghVersionCode} = common.run(['gh', '--version']);
    if (ghVersionCode !== 0) {
        common.fail('Error: GitHub CLI (gh) is not installed or not on PATH. See https://cli.github.com/');
    }
    console.log(' - gh present');

    let r = common.run(['gh', 'auth', 'status']);
    if (r.code !== 0) common.fail(`Error: gh is not authenticated or token is invalid/expired.\nDetails: ${r.stderr || r.stdout || 'Unknown authentication error.'}`);
    console.log(' - gh authenticated');

    r = common.run(['gh', 'api', 'user']);
    if (r.code !== 0) common.fail(`Error: gh token appears invalid/expired when calling API.\nDetails: ${r.stderr || r.stdout || 'Unknown API error.'}`);
    console.log(' - gh can make requests');

    if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
        common.fail(`Error: required folder "${folder}" does not exist.`);
    }
    if (!fs.existsSync(path.join(folder, 'system.json'))) {
        common.fail(`Error: required file "${path.join(folder, 'system.json')}" does not exist.`);
    }
    const zipPath = path.join(folder, `unofficial-FVTT-ose-${tagName}.zip`);
    if (!fs.existsSync(zipPath)) {
        common.fail(`Error: required file "${zipPath}" does not exist.`);
    }
    console.log(' - required files and folders present');

    common.run(['git', 'fetch', '--prune', 'origin']);
    common.run(['git', 'fetch', '--prune', '--tags', 'origin']);
    console.log(' - updated tags');

    r = common.run(['git', 'ls-remote', '--exit-code', '--refs', '--tags', 'origin', `refs/tags/${tagName}`]);
    if (r.code === 0) {
        common.fail(`Error: tag for the version already exists.\nDetails: ${r.stderr || r.stdout || 'Tag already exists.'}`);
    } else if (r.code !== 2) {
        common.fail(`Error: unable to query remote tags.\nDetails: ${r.stderr || r.stdout || 'Unknown'}`);
    }
    console.log(' - no remote tag with intended name');
}

/**
 * @param {string} version
 */
export async function runRelease(version) {
    const finalVersion = common.normalizeVersion(version);
    const projectRoot = common.projectRoot();
    const versionFolder = path.join(projectRoot, 'releases', finalVersion);
    const changelogPath = path.join(projectRoot, 'CHANGELOG.md');
    console.log(`Releasing version v${finalVersion}`);
    console.log('Running prechecks...');
    verifyVersionLinkReference(finalVersion, changelogPath);
    const notes = extractNotesFromChangelog(finalVersion, changelogPath);
    precheck(versionFolder, `v${finalVersion}`);
    console.log('Passed prechecks');
    console.log('');

    console.log('== patch notes =======================');
    console.log(notes);
    console.log('======================================');

    let notesFile;
    try {
        notesFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tools-')), 'notes.md');
        fs.writeFileSync(notesFile, notes, 'utf-8');

        let r = common.run([
            'gh', 'pr', 'create',
            '--base', 'stable',
            '--title', `v${finalVersion}`,
            '--body', `v${finalVersion}`,
            '--json', 'number,url',
        ]);
        if (r.code !== 0) common.fail(`PR creation failed: ${r.stderr || r.stdout}`);
        const pr = JSON.parse(r.stdout);
        console.log(`PR opened: #${pr.number} ${pr.url}`);

        r = common.run([
            'gh', 'pr', 'merge', String(pr.number),
            '--merge', '--delete-branch', '--admin', '--confirm',
        ]);
        if (r.code !== 0) common.fail(`PR merge failed: ${r.stderr || r.stdout}`);
        console.log('PR merged successfully.');

        const assets = [
            path.join(versionFolder, 'system.json'),
            path.join(versionFolder, `unofficial-FVTT-ose-v${finalVersion}.zip`),
        ];
        r = common.run([
            'gh', 'release', 'create', `v${finalVersion}`,
            '--target', 'stable',
            '--title', `v${finalVersion}`,
            '--notes-file', notesFile,
            '--latest',
            ...assets,
        ]);
        if (r.code !== 0) common.fail(`Release creation failed: ${r.stderr || r.stdout}`);

        r = common.run([
            'gh', 'release', 'view', `v${finalVersion}`,
            '--json', 'url,isLatest,assets',
            '--jq', '{url,isLatest,assets:[.assets[].name]}',
        ]);
        if (r.code !== 0) common.fail(`Release view failed: ${r.stderr || r.stdout}`);
        console.log(r.stdout);
    } finally {
        try {
            if (notesFile) fs.rmSync(path.dirname(notesFile), {recursive: true, force: true});
        } catch {
            // best effort cleanup
        }
    }
}

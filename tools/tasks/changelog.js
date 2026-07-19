import fs from 'node:fs';
import path from 'node:path';
import * as common from '../common.js';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Return a set of GitHub usernames (no leading @) found in CODEOWNERS.
 * If the file doesn't exist, returns an empty set.
 * @param {string} [codeownersPath]
 * @returns {Set<string>}
 */
function loadCodeownersUsernames(codeownersPath = path.join('.github', 'CODEOWNERS')) {
    let text;
    try {
        text = fs.readFileSync(codeownersPath, 'utf-8');
    } catch {
        return new Set();
    }
    const names = new Set();
    for (const m of text.matchAll(/@([A-Za-z0-9][A-Za-z0-9\-/]+)/g)) names.add(m[1]);
    return new Set([...names].filter(n => !n.includes('/')));
}

/**
 * Uses `gh` to resolve the GitHub author login for a commit.
 * @param {string} ownerRepo
 * @param {string} sha
 * @returns {string|null}
 */
function ghCommitAuthorLogin(ownerRepo, sha) {
    const {code, stdout} = common.run([
        'gh', 'api', `repos/${ownerRepo}/commits/${sha}`,
        '--jq', '.author.login // empty',
    ]);
    if (code !== 0) return null;
    return stdout.trim() || null;
}

/**
 * Very light numeric comparator for versions like 0.1.10 vs 0.1.5.
 * Extracts all integers and compares lexicographically.
 * @param {string} v
 * @returns {number[]}
 */
function versionKey(v) {
    const nums = [...v.matchAll(common.regex.CHANGELOG_VERSION_TOKEN)].map(m => parseInt(m[0], 10));
    return nums.length ? nums : [0];
}

function compareVersionKeys(a, b) {
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const av = a[i] ?? 0, bv = b[i] ?? 0;
        if (av !== bv) return av - bv;
    }
    return 0;
}

/**
 * Fail early if `version` is lower than the highest version heading in the CHANGELOG.
 * Looks for headings like: ## [0.1.2] - YYYY-MM-DD
 * @param {string} changelogPath
 * @param {string} version
 */
function assertNotLowerThanHighest(changelogPath, version) {
    if (!fs.existsSync(changelogPath)) return; // let other checks handle missing file
    const text = fs.readFileSync(changelogPath, 'utf-8');
    const found = [...text.matchAll(common.regex.CHANGELOG_VERSION_HEADER)]
        .map(m => m[1])
        .filter(v => v.toLowerCase() !== 'unreleased');
    if (!found.length) return;
    let highest = found[0];
    for (const v of found) if (compareVersionKeys(versionKey(v), versionKey(highest)) > 0) highest = v;
    if (compareVersionKeys(versionKey(version), versionKey(highest)) < 0) {
        common.fail(`Error: provided version ${version} is lower than highest in CHANGELOG (${highest}).`);
    }
}

/**
 * @param {string} changelogPath
 * @param {string} version
 * @param {string} notesMd
 * @param {string|null} ownerRepo
 */
function updateChangelogFile(changelogPath, version, notesMd, ownerRepo) {
    if (!fs.existsSync(changelogPath)) {
        common.fail(`Error: CHANGELOG not found at "${changelogPath}".`);
    }

    let text = fs.readFileSync(changelogPath, 'utf-8');
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // 1) Upsert the version section
    const newBlock = `## [${version}] - ${today}\n\n${notesMd.trim()}\n\n`;
    const headerRe = common.regex.CHANGELOG_HEADER_FOR(version);
    const m = headerRe.exec(text);

    let updated;
    if (m) {
        const start = m.index;
        const end0 = m.index + m[0].length;
        const rest = text.slice(end0);
        const nextHeaderRe = new RegExp(common.regex.CHANGELOG_NEXT_HEADER.source, common.regex.CHANGELOG_NEXT_HEADER.flags);
        const nextHeader = nextHeaderRe.exec(rest);
        const end = end0 + (nextHeader ? nextHeader.index : rest.length);
        updated = text.slice(0, start) + newBlock + text.slice(end);
    } else {
        // If there's an Unreleased section, insert the new version *after* it and
        // its content, i.e. right before the first actual version header following it.
        const unreleasedRe = new RegExp(common.regex.CHANGELOG_UNRELEASED_CHANGES_HEADER.source, common.regex.CHANGELOG_UNRELEASED_CHANGES_HEADER.flags);
        const unreleasedHdr = unreleasedRe.exec(text);
        if (unreleasedHdr) {
            const afterUnreleased = text.slice(unreleasedHdr.index + unreleasedHdr[0].length);
            const nextHeaderRe = new RegExp(common.regex.CHANGELOG_NEXT_HEADER.source, common.regex.CHANGELOG_NEXT_HEADER.flags);
            const nextAfterUnreleased = nextHeaderRe.exec(afterUnreleased);
            const insertAt = nextAfterUnreleased
                ? (unreleasedHdr.index + unreleasedHdr[0].length) + nextAfterUnreleased.index
                : text.length;
            updated = text.slice(0, insertAt) + newBlock + text.slice(insertAt);
        } else {
            // No Unreleased section: insert before the very first version header (top of history)
            const firstHeaderRe = new RegExp(common.regex.CHANGELOG_NEXT_HEADER.source, common.regex.CHANGELOG_NEXT_HEADER.flags);
            const firstHeader = firstHeaderRe.exec(text);
            if (firstHeader) {
                updated = text.slice(0, firstHeader.index) + newBlock + text.slice(firstHeader.index);
            } else {
                updated = text.replace(/\s+$/, '') + '\n\n' + newBlock;
            }
        }
    }

    // 2) Update the [Unreleased] compare link
    if (!ownerRepo) ownerRepo = common.parseOwnerRepoFromOrigin();
    if (!ownerRepo) {
        common.fail("Error: Unable to determine owner/repo from 'origin' to update [Unreleased] link.");
    }

    const unreleasedLine = `[Unreleased]: https://github.com/${ownerRepo}/compare/v${version}...HEAD`;
    const unreleasedRefRe = new RegExp(common.regex.CHANGELOG_UNRELEASED_REF.source, common.regex.CHANGELOG_UNRELEASED_REF.flags);
    const mUnreleased = unreleasedRefRe.exec(updated);
    let insertPos;
    if (mUnreleased) {
        const start = mUnreleased.index;
        const end = start + mUnreleased[0].length;
        updated = updated.slice(0, start) + unreleasedLine + updated.slice(end);
        const insertAfter = updated.indexOf('\n', start);
        insertPos = insertAfter !== -1 ? insertAfter + 1 : updated.length;
    } else {
        updated = updated.replace(/\s+$/, '') + '\n' + unreleasedLine + '\n';
        insertPos = updated.length;
    }

    // 3) Ensure the version reference line exists, and place it *below Unreleased*
    const refExistsRe = common.regex.REF_LINE_FOR(version);
    const refExists = refExistsRe.test(updated);
    if (!refExists) {
        const versRef = `[${version}]: https://github.com/${ownerRepo}/releases/tag/v${version}`;
        updated = updated.slice(0, insertPos) + versRef + '\n' + updated.slice(insertPos);
    }

    fs.writeFileSync(changelogPath, updated, 'utf-8');
}

/**
 * @param {string} release - release tag or version string
 */
export async function changelog(release) {
    const version = common.normalizeVersion(release);
    const {code: gitCode} = common.run(['git', '--version']);
    if (gitCode !== 0) common.fail('Error: git is not on PATH.');

    const changelogPath = path.join('CHANGELOG.md');
    assertNotLowerThanHighest(changelogPath, version);

    // Ensure remote refs fresh
    common.run(['git', 'fetch', '--prune', 'origin']);

    const ownerRepo = common.parseOwnerRepoFromOrigin() || '';
    const codeowners = loadCodeownersUsernames();

    // Collect SHA|subject in develop not in origin/stable
    const {code, stdout, stderr} = common.run([
        'git', 'log',
        '--pretty=%H|%s',
        '--reverse',
        'origin/stable..develop',
        '--no-merges',
    ]);
    if (code !== 0) common.fail(`Error: git log failed. Details: ${stderr || stdout || 'unknown'}`);

    const rawLines = stdout.split('\n').filter(l => l.trim());
    if (!rawLines.length) {
        console.error('(no new commits on develop relative to origin/stable)');
        process.exit(0);
    }

    const lines = [];
    for (const row of rawLines) {
        const sepIdx = row.indexOf('|');
        const sha = sepIdx === -1 ? '' : row.slice(0, sepIdx);
        let subj = sepIdx === -1 ? row : row.slice(sepIdx + 1);

        const login = (sha && ownerRepo) ? ghCommitAuthorLogin(ownerRepo, sha) : null;
        if (login && !codeowners.has(login)) subj = `${subj} (${login})`;
        lines.push(subj);
    }

    const notesMd = lines.map(s => `- ${s}`).join('\n');
    updateChangelogFile(changelogPath, version, notesMd, ownerRepo || null);

    console.log(`CHANGELOG.md updated for [${version}] with ${lines.length} commit(s).`);
}

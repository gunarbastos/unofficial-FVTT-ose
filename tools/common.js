import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

console.log(`Loaded: ${import.meta.url}`);

/**
 * Run a command synchronously, capturing stdout/stderr as text.
 * Mirrors python's `tools.common.run`.
 * @param {string[]} cmd - argv array, e.g. ["git", "status"]
 * @returns {{code: number, stdout: string, stderr: string}}
 */
export function run(cmd) {
    const [bin, ...args] = cmd;
    const result = spawnSync(bin, args, {encoding: 'utf-8', shell: process.platform === 'win32'});
    const code = result.status ?? (result.error ? 1 : 0);
    const stdout = (result.stdout ?? '').toString().trim();
    const stderr = (result.stderr ?? (result.error ? String(result.error.message) : '')).toString().trim();
    return {code, stdout, stderr};
}

export function parseOwnerRepoFromOrigin() {
    const {code, stdout} = run(['git', 'remote', 'get-url', 'origin']);
    if (code !== 0 || !stdout) return null;
    const url = stdout.trim();

    let m = url.match(regex.GITHUB_HTTPS_REMOTE);
    if (m) return `${m[1]}/${m[2]}`;

    m = url.match(regex.GITHUB_SSH_REMOTE);
    if (m) return `${m[1]}/${m[2]}`;

    return null;
}

/**
 * Print an error message to stderr and exit the process with code 1.
 * @param {string} msg
 * @returns {never}
 */
export function fail(msg) {
    console.error(msg);
    process.exit(1);
}

/**
 * Absolute path to the repository root (parent of the `/tools` folder).
 * @returns {string}
 */
export function projectRoot() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(here, '..');
}

/** @returns {Date} the current date/time (JS Dates always carry local tz offset info) */
export function nowTmz() {
    return new Date();
}

/**
 * Format a Date the same way python's `now.strftime("%d/%m/%Y %H:%M:%S.mmm UTC±H")` did.
 * @param {Date} now
 * @returns {string}
 */
export function formatHeaderTimestamp(now) {
    const pad = (n, l = 2) => String(n).padStart(l, '0');
    const offsetMinutes = -now.getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
    const sign = offsetHours >= 0 ? '+' : '-';
    const offsetStr = `UTC${sign}${Math.abs(offsetHours)}`;
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} `
        + `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)} ${offsetStr}`;
}

/**
 * @param {string} version - either a literal version string (optionally prefixed with 'v'),
 *  or a path to a file whose contents are the version.
 * @returns {string} normalized version, without a leading 'v'
 */
export function normalizeVersion(version) {
    let internalVersion = version;
    try {
        if (fs.existsSync(version) && fs.statSync(version).isFile()) {
            internalVersion = fs.readFileSync(version, 'utf-8');
        }
    } catch {
        // not a path, use literal value
    }
    return internalVersion.replace(/^v+/, '');
}

/**
 * Read an 'order' file in `folder`, if present.
 * Returns a list of names (files or directories) in the order specified.
 * Ignores blank lines and lines starting with #, //, or ;.
 * @param {string} folder
 * @param {string} [enforceExtension]
 * @returns {string[]}
 */
export function readOrderFile(folder, enforceExtension = '') {
    const orderFile = path.join(folder, 'order');
    if (!fs.existsSync(orderFile) || !fs.statSync(orderFile).isFile()) return [];
    const lines = [];
    for (const raw of fs.readFileSync(orderFile, 'utf-8').split(/\r?\n/)) {
        let line = raw.trim();
        if (!line || line.startsWith('#') || line.startsWith('//') || line.startsWith(';')) continue;
        if (enforceExtension && !line.endsWith(`.${enforceExtension}`)) line = `${line}.${enforceExtension}`;
        lines.push(line);
    }
    return lines;
}

/**
 * Compiled regex patterns and helpers, mirroring python's `common.regex` namespace.
 */
export const regex = {
    // --- Git remotes ---
    GITHUB_HTTPS_REMOTE: /https?:\/\/[^/]+\/([^/]+)\/([^/]+?)(?:\.git)?$/,
    GITHUB_SSH_REMOTE: /git@[^:]+:([^/]+)\/([^/]+?)(?:\.git)?$/,

    // --- Changelog headings/sections ---
    CHANGELOG_NEXT_HEADER: /^##\s*\[/m,

    /** @param {string} version */
    CHANGELOG_HEADER_FOR(version) {
        const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^##\\s*\\[\\s*v?${escaped}\\s*]\\s*(?:-\\s*\\d{4}-\\d{2}-\\d{2})?\\s*$`, 'm');
    },

    CHANGELOG_VERSION_HEADER: /^##\s*\[\s*v?([\w.-]+)\s*]/gm,

    CHANGELOG_UNRELEASED_REF: /^\[Unreleased]\s*:\s*(\S+)\s*$/im,
    CHANGELOG_VERSION_TOKEN: /\d+/g,
    CHANGELOG_UNRELEASED_CHANGES_HEADER: /^##\s*\[\s*Unreleased\s*]\s*$/im,

    /** @param {string} version */
    REF_LINE_FOR(version) {
        const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^\\[\\s*v?${escaped}\\s*]\\s*:\\s*\\S+\\s*$`, 'im');
    },

    /** @param {string} version */
    REF_LINE_URL_FOR(version) {
        const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^\\[\\s*v?${escaped}\\s*]\\s*:\\s*(\\S+)\\s*$`, 'im');
    },

    // --- JS export parsing ---
    EXPORT_DECL: /export\s+(?:const|let|var|function|class)\s+([a-zA-Z0-9_]+)/g,
    EXPORT_LIST: /export\s*\{\s*([^}]+)\s*}/g,
    EXPORT_AS: /\s+as\s+/,
};

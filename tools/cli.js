import {parseArgs} from 'node:util';
import {fail} from './common.js';

console.log(`Loaded: ${import.meta.url}`);

const PROG = 'tools';

const USAGE = `${PROG} - Tio Gunny's Tooling CLI

Usage:
  ${PROG} indexes [--file=<path>] [--dir=<path>]
      Generate index.js files. If no extra parameters are given, regenerates
      for all module folders. If both are given, --file takes precedence over --dir.

  ${PROG} less
      Compile LESS to CSS.

  ${PROG} release <version>
      Release a version.

  ${PROG} build <release>
      Build release package.

  ${PROG} changelog <release>
      Build release notes into CHANGELOG.md.

  ${PROG} jsdocs [--file=<path>] [--dir=<path>]
      Generate WebStorm JSDoc library files under /jsdocs from the game system's
      scripts. If no extra parameters are given, regenerates for the whole
      scripts tree. If both are given, --file takes precedence over --dir.

  ${PROG} validate
      Check structural invariants across the source tree: barrels current,
      order entries resolving, registered class names matching the key pattern,
      system.json documentTypes round-tripping, and relative imports resolving
      to a real file and a real exported name. Exits non-zero on any problem.
`;

function usageError(msg) {
    console.error(msg);
    console.error();
    console.error(USAGE);
    process.exit(2);
}

/**
 * Parse `tools <cmd> ...` the same way tools/cli.py's argparse setup did, then
 * dispatch to the matching task module (lazily imported, mirroring the
 * python version's local imports inside each `elif` branch).
 */
export async function main() {
    const [cmd, ...rest] = process.argv.slice(2);

    if (!cmd) usageError('Error: a command is required.');

    switch (cmd) {
        case 'indexes': {
            const {values} = parseArgs({
                args: rest,
                options: {
                    file: {type: 'string'},
                    dir: {type: 'string'},
                },
                strict: true,
            });
            const {generateIndexes} = await import('./tasks/indexes.js');
            await generateIndexes(values.file ?? null, values.dir ?? null);
            break;
        }
        case 'less': {
            const {compileLess} = await import('./tasks/lessc.js');
            await compileLess();
            break;
        }
        case 'release': {
            const version = rest.find(a => !a.startsWith('-'));
            if (!version) usageError('Error: "release" requires a <version> argument.');
            const {runRelease} = await import('./tasks/release.js');
            await runRelease(version);
            break;
        }
        case 'build': {
            const releaseTag = rest.find(a => !a.startsWith('-'));
            if (!releaseTag) usageError('Error: "build" requires a <release> argument.');
            const {buildRelease} = await import('./tasks/build.js');
            await buildRelease(releaseTag);
            break;
        }
        case 'changelog': {
            const releaseTag = rest.find(a => !a.startsWith('-'));
            if (!releaseTag) usageError('Error: "changelog" requires a <release> argument.');
            const {changelog} = await import('./tasks/changelog.js');
            await changelog(releaseTag);
            break;
        }
        case 'jsdocs': {
            const {values} = parseArgs({
                args: rest,
                options: {
                    file: {type: 'string'},
                    dir: {type: 'string'},
                },
                strict: true,
            });
            const {generateJsdocs} = await import('./tasks/jsdocs.js');
            await generateJsdocs(values.file ?? null, values.dir ?? null);
            break;
        }
        case 'validate': {
            const {validate} = await import('./tasks/validate.js');
            await validate();
            break;
        }
        default:
            usageError(`Error: unknown command "${cmd}".`);
    }
}

import fs from 'node:fs';

console.log(`Loaded: ${import.meta.url}`);

function isSafeKey(k) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
}

function keyOut(k) {
    return isSafeKey(k) ? k : JSON.stringify(k);
}

/**
 * Only reference an identifier as a JSDoc type if it looks like one of the
 * project's own class names (by convention, `UOSE*`) - other identifiers
 * (e.g. a private `_rawConstants` object literal) aren't real, globally
 * resolvable types in the ambient library and would just show as unresolved.
 * @param {string|null} name
 */
function safeClassTypeRef(name) {
    return name && /^UOSE/.test(name) ? name : '*';
}

/**
 * Same as safeClassTypeRef, but wrapped in JSDoc's `typeof` operator - i.e.
 * "the class/constructor value itself", not an instance of it. This is what
 * every `UOSE.register*(...)` call actually stores (the class, e.g.
 * `UOSE.publicView().utils = UOSEUtils`), so referencing it as a bare
 * `{UOSEUtils}` type (meaning "an instance of UOSEUtils") is wrong and
 * causes WebStorm to flag calls to the class's `static` members as
 * inaccessible instance-member access.
 * @param {string|null} name
 */
function classTypeofRef(name) {
    const ref = safeClassTypeRef(name);
    return ref === '*' ? '*' : `typeof ${ref}`;
}

function inlineTypeFromStringMap(map) {
    const entries = Object.entries(map);
    if (!entries.length) return 'object';
    return `{${entries.map(([k, v]) => `${keyOut(k)}: ${classTypeofRef(v)}`).join(', ')}}`;
}

function inlineTypeFromTypedEntryMap(map) {
    const entries = Object.entries(map);
    if (!entries.length) return 'object';
    return `{${entries.map(([k, entry]) => {
        const parts = [`type: string`];
        if (entry.document) parts.push(`document?: ${classTypeofRef(entry.document)}`);
        if (entry.dataModel) parts.push(`dataModel?: ${classTypeofRef(entry.dataModel)}`);
        if (entry.sheet) parts.push(`sheet?: ${classTypeofRef(entry.sheet)}`);
        return `${keyOut(k)}: {${parts.join(', ')}}`;
    }).join(', ')}}`;
}

/**
 * Recursively build a `@property` typedef block for a nested plain-object
 * shape (used for `lang/en.json`, whose leaf values become their own
 * flattened dotted-key string at runtime - see UOSEUtils.createLangObject()).
 * @param {object} obj
 * @param {string} prefix
 * @param {string[]} out
 */
function collectLangProperties(obj, prefix, out) {
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            out.push(`@property {object} ${path}`);
            collectLangProperties(value, path, out);
        } else {
            // Every leaf is replaced at runtime with its own flattened key string,
            // e.g. `_uose.lang.SYSTEM.NAME === "UOSE.SYSTEM.NAME"`.
            out.push(`@property {string} ${path}`);
        }
    }
}

/**
 * @param {string} langJsonPath - absolute path to lang/en.json
 * @returns {string|null} a `/** @typedef {object} _UOSELang ... *\/` block, or null if unavailable
 */
export function buildLangTypedef(langJsonPath) {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(langJsonPath, 'utf-8'));
    } catch {
        return null;
    }
    const root = data.UOSE && typeof data.UOSE === 'object' ? data.UOSE : data;
    const props = [];
    collectLangProperties(root, '', props);
    return [
        '/**',
        ' * Mirrors the shape of lang/en.json under its "UOSE" key. At runtime each leaf',
        ' * is replaced by UOSEUtils.createLangObject() with its own flattened i18n key',
        ' * string (e.g. `_uose.lang.SYSTEM.NAME === "UOSE.SYSTEM.NAME"`), so every leaf',
        ' * here is typed as `string`.',
        ' * @typedef {object} _UOSELang',
        ...props.map(p => ` * ${p}`),
        ' */',
    ].join('\n');
}

/**
 * Render the ambient `_uose.js` file: the `_UOSE` class (mirroring the real
 * `_uose` object built up in scripts/foundry/uose.js plus everything
 * registered into it via `UOSE.Register*` calls) and, best-effort, a
 * `game.uose` expando typing.
 * @param {object} registry - from jsdocsRegistry.buildRegistry
 * @param {string} headerTimestamp
 * @param {string|null} langTypedef
 */
export function renderUoseFile(registry, headerTimestamp, langTypedef) {
    const c = registry.classes;

    const lines = [
        '// File generated automatically by `tools jsdocs`. Do not edit by hand.',
        `// Last Updated: ${headerTimestamp}`,
        '//',
        '// Mirrors the runtime shape of `_uose` / `game.uose` (scripts/foundry/uose.js),',
        '// including everything registered into it via `UOSE.Register*(...)` calls',
        '// across the codebase. Purely a type-completion aid; never imported/executed.',
        '',
    ];

    if (langTypedef) {
        lines.push(langTypedef, '');
    }

    lines.push(
        '/**',
        ' * @typedef {object} _UOSEClasses',
        ` * @property {${inlineTypeFromStringMap(c.base)}} base`,
        ` * @property {object} documents`,
        ` * @property {${inlineTypeFromStringMap(c.documents.actors)}} documents.actors`,
        ` * @property {${inlineTypeFromStringMap(c.documents.items)}} documents.items`,
        ` * @property {object} dataModels`,
        ` * @property {${inlineTypeFromStringMap(c.dataModels.actors)}} dataModels.actors`,
        ` * @property {${inlineTypeFromStringMap(c.dataModels.items)}} dataModels.items`,
        ` * @property {object} sheets`,
        ` * @property {${inlineTypeFromStringMap(c.sheets.actors)}} sheets.actors`,
        ` * @property {${inlineTypeFromStringMap(c.sheets.items)}} sheets.items`,
        ` * @property {${inlineTypeFromStringMap(c.apps)}} apps`,
        ` * @property {${inlineTypeFromTypedEntryMap(c.actors)}} actors`,
        ` * @property {${inlineTypeFromTypedEntryMap(c.items)}} items`,
        ` * @property {${inlineTypeFromStringMap(c.effects)}} effects`,
        ` * @property {${inlineTypeFromStringMap(c.replacements)}} replacements`,
        ' */',
        '',
        'class _UOSE {',
        '    /** @type {_UOSEClasses} */',
        '    classes;',
        '',
        '    /** @type {*} pointer to the Foundry CONFIG object */',
        '    foundryConfig;',
        '',
        `    /** @type {${safeClassTypeRef(registry.constants)}} */`,
        '    constants;',
        '',
        `    /** @type {${classTypeofRef(registry.utils)}} */`,
        '    utils;',
        '',
        `    /** @type {${safeClassTypeRef(registry.settings)}} */`,
        '    settings;',
        '',
        `    /** @type {${langTypedef ? '_UOSELang' : '*'}} */`,
        '    lang;',
        '',
        '    /** @type {object} name -> instantiated app instance */',
        '    apps;',
        '}',
        '',
        '// Best-effort typing of `game.uose` as an expando property of Foundry\'s `Game`',
        '// class. This only resolves in WebStorm if the separate "Foundry VTT" library',
        '// already declares a global `Game` class - if it does not, this line is inert',
        '// and `game.uose` simply falls back to untyped/`any`.',
        '/** @type {_UOSE} */',
        '// eslint-disable-next-line no-undef',
        'Game.prototype.uose;',
        '',
    );

    return lines.join('\n');
}

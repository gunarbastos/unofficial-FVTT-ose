console.log(`Loaded: ${import.meta.url}`);

// Mirrors UOSE's private #bitsAndBobsMatch / #bitsAndBobsReplace in scripts/foundry/uose.js
const BITS_AND_BOBS = /^UOSE(?<n>.*?)(?<suffix>Vehicle|Animal)?(?<type>Actor|Item)?(?<object>Document|DataModel|Sheet)$/;
const APP_NAME = /^UOSE(?<n>.*?)App$/;

function canonicalDocSheetDataModelName(className) {
    const m = className.match(BITS_AND_BOBS);
    if (!m) return className;
    return `${m.groups.n ?? ''}${m.groups.suffix ?? ''}`;
}

function canonicalAppName(className) {
    const m = className.match(APP_NAME);
    return m ? (m.groups.n ?? '') : className;
}

function canonicalBaseName(className) {
    return className.replace(/^UOSE/, '');
}

/**
 * @param {string} kind - resolved 'actor' | 'item' from a describeArg() UOSE constant
 */
function typeCollectionKey(kind) {
    if (kind === 'actor') return 'actors';
    if (kind === 'item') return 'items';
    return null;
}

/**
 * Resolve a describeArg()-shaped argument to a plain string identifier, when possible.
 */
function resolveConstant(argDescr) {
    if (!argDescr) return null;
    if (argDescr.kind === 'uoseConstant') return argDescr.name === 'actor' ? 'actor' : (argDescr.name === 'item' ? 'item' : null);
    if (argDescr.kind === 'literal') return String(argDescr.value);
    return null;
}

/**
 * Find a static field named `type` on a class and return its literal value, if any.
 * @param {object} classInfo - as produced by jsdocsParser
 */
function staticTypeLiteral(classInfo, source) {
    const field = classInfo.members.find(m => m.kind === 'field' && m.static && m.name === 'type');
    if (!field || !field.valueNode || field.valueNode.type !== 'Literal') return null;
    return String(field.valueNode.value);
}

/**
 * Build the canonical `_uose`-shaped registry from every parsed file's register calls.
 * @param {Array<{relPath: string, source: string, classes: object[], registerCalls: object[], directAssignments: object[]}>} parsedFiles
 */
export function buildRegistry(parsedFiles) {
    const registry = {
        classes: {
            base: {},                                   // canonicalName -> className
            documents: {actors: {}, items: {}},          // canonicalName -> className
            dataModels: {actors: {}, items: {}},         // canonicalName -> className
            sheets: {actors: {}, items: {}},              // canonicalName -> className
            apps: {},                                     // canonicalName -> className
            actors: {},                                    // canonicalName -> {type, document?, dataModel?, sheet?}
            items: {},
            effects: {},                                    // effectType -> className
            replacements: {},                                // canonicalName -> className
        },
        settings: null,   // className
        constants: null,  // className/identifier assigned
        utils: null,       // className
        lang: null,         // marker only (computed at runtime from lang/en.json, see buildLangTypedef)
    };

    for (const file of parsedFiles) {
        const classByName = new Map(file.classes.map(c => [c.name, c]));

        for (const call of file.registerCalls) {
            const {method, args} = call;

            if (method === 'registerDocument' || method === 'registerDataModel' || method === 'registerSheet') {
                const kind = resolveConstant(args[0]);
                const clsArg = args[1];
                if (!kind || !clsArg || clsArg.kind !== 'identifier') continue;
                const className = clsArg.name;
                const groupKey = typeCollectionKey(kind);
                if (!groupKey) continue;
                const canonical = canonicalDocSheetDataModelName(className);

                const bucket = method === 'registerDocument' ? registry.classes.documents
                    : method === 'registerDataModel' ? registry.classes.dataModels
                        : registry.classes.sheets;
                bucket[groupKey][canonical] = className;

                const typeBucket = registry.classes[groupKey];
                if (!typeBucket[canonical]) typeBucket[canonical] = {type: canonical};
                const slot = method === 'registerDocument' ? 'document' : method === 'registerDataModel' ? 'dataModel' : 'sheet';
                typeBucket[canonical][slot] = className;
            } else if (method === 'registerApp') {
                const clsArg = args[0];
                if (!clsArg || clsArg.kind !== 'identifier') continue;
                registry.classes.apps[canonicalAppName(clsArg.name)] = clsArg.name;
            } else if (method === 'registerBaseClass') {
                const clsArg = args[0];
                if (!clsArg || clsArg.kind !== 'identifier') continue;
                registry.classes.base[canonicalBaseName(clsArg.name)] = clsArg.name;
            } else if (method === 'registerReplacement') {
                const clsArg = args[0];
                if (!clsArg || clsArg.kind !== 'identifier') continue;
                registry.classes.replacements[canonicalBaseName(clsArg.name)] = clsArg.name;
            } else if (method === 'registerEffect') {
                const clsArg = args[0];
                if (!clsArg || clsArg.kind !== 'identifier') continue;
                const classInfo = classByName.get(clsArg.name);
                const typeKey = (classInfo && staticTypeLiteral(classInfo, file.source)) ?? clsArg.name;
                registry.classes.effects[typeKey] = clsArg.name;
            } else if (method === 'registerSettings') {
                const arg = args[0];
                if (arg && arg.kind === 'new') registry.settings = arg.name;
            } else if (method === 'registerConstants') {
                const arg = args[0];
                if (arg && arg.kind === 'identifier') registry.constants = arg.name;
            }
            // registerLanguage isn't called anywhere in the codebase today (lang is populated
            // directly via UOSEUtils.createLangObject() in UOSEPackageHooks), so it's intentionally
            // not handled here beyond the `lang` marker populated by buildLangTypedef.
        }

        for (const assign of file.directAssignments) {
            if (assign.field === 'utils' && assign.valueDescr.kind === 'identifier') {
                registry.utils = assign.valueDescr.name;
            }
        }
    }

    return registry;
}

export {canonicalDocSheetDataModelName, canonicalAppName, canonicalBaseName};

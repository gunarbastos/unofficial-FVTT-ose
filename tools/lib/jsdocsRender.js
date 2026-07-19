import {resolveOwnSchemaProperties} from './jsdocsSchema.js';
import * as parserModule from './jsdocsParser.js';

console.log(`Loaded: ${import.meta.url}`);

function roleForDir(dirRelPath) {
    if (dirRelPath === 'dataModels' || dirRelPath.startsWith('dataModels/')) return 'dataModel';
    if (dirRelPath === 'documents' || dirRelPath.startsWith('documents/')) return 'document';
    if (dirRelPath === 'sheets' || dirRelPath.startsWith('sheets/')) return 'sheet';
    return 'other';
}

/**
 * Build reverse lookup maps (documentClassName -> dataModelClassName,
 * sheetClassName -> documentClassName) from the canonical `_uose` registry.
 */
export function buildPairingMaps(registry) {
    const docToDataModel = new Map();
    const sheetToDoc = new Map();
    for (const group of [registry.classes.actors, registry.classes.items]) {
        for (const entry of Object.values(group)) {
            if (entry.document && entry.dataModel) docToDataModel.set(entry.document, entry.dataModel);
            if (entry.sheet && entry.document) sheetToDoc.set(entry.sheet, entry.document);
        }
    }
    return {docToDataModel, sheetToDoc};
}

/**
 * Resolve a class's OWN schema properties (via jsdocsSchema), given its
 * classInfo/file context.
 */
function ownSchemaProperties(classInfo, file) {
    if (!classInfo.hasDefineSchema) return {properties: [], notes: []};
    return resolveOwnSchemaProperties(classInfo.schemaObjectNode, {
        source: file.source,
        topLevelFunctions: file.topLevelFunctions,
        superAliasNames: new Set(classInfo.schemaSuperAliases ?? []),
        parserModule,
    });
}

/**
 * Recursively flatten a DataModel class's defineSchema() fields, walking the
 * real `extends` chain (parent-first, own fields override by name) - i.e.
 * "the object as built in Foundry" per spec. Only resolvable for
 * locally-known classes/factories; an unresolvable/foreign base (e.g.
 * `foundry.abstract.TypeDataModel` itself) simply contributes no extra
 * fields, which is correct since it has none of its own.
 * @param {string} className
 * @param {Map<string, {classInfo: object, file: object}>} classIndex
 * @param {Set<string>} [visited] - cycle guard
 * @returns {{properties: Array<{name:string,type:string}>, notes: string[]}}
 */
export function flattenSchema(className, classIndex, visited = new Set()) {
    if (visited.has(className)) return {properties: [], notes: []};
    visited.add(className);

    const entry = classIndex.get(className);
    if (!entry) return {properties: [], notes: []};
    const {classInfo, file} = entry;

    let parentProps = [];
    let notes = [];
    if (classInfo.superClass.kind === 'local' && classIndex.has(classInfo.superClass.name)) {
        const parent = flattenSchema(classInfo.superClass.name, classIndex, visited);
        parentProps = parent.properties;
        notes = notes.concat(parent.notes);
    }

    const own = ownSchemaProperties(classInfo, file);
    notes = notes.concat(own.notes);

    const merged = new Map(parentProps.map(p => [p.name, p]));
    for (const p of own.properties) merged.set(p.name, p);

    return {properties: [...merged.values()], notes};
}

function indentBlock(lines) {
    return lines.map(l => ` * ${l}`).join('\n');
}

/**
 * Render a `<ClassName>Schema` typedef for a DataModel-role class, if it (or
 * any of its ancestors) declares schema fields. Returns null if there's
 * nothing to say (e.g. a class with an empty/unresolvable schema).
 * @param {string} className
 * @param {Map} classIndex
 * @returns {{text: string, notes: string[]}|null}
 */
export function renderSchemaTypedef(className, classIndex) {
    const {properties, notes} = flattenSchema(className, classIndex);
    if (!properties.length) return null;

    const lines = [
        `Resolved from ${className}.defineSchema(), flattened across its full`,
        'inheritance chain (parent fields first, own fields override by name).',
        `@typedef {object} ${className}Schema`,
        ...properties.map(p => `@property {${p.type}} ${p.name}`),
    ];
    return {
        text: `/**\n${indentBlock(lines)}\n */`,
        notes,
    };
}

/**
 * Render a `<DocumentClass>.prototype.system` type augmentation, if the
 * document is paired to a DataModel via `UOSE.register*`. This is a
 * *reference* to the real class (never a redeclaration), so it can't shadow
 * or hijack go-to-definition on the real class.
 * @param {string} documentClassName
 * @param {string} dataModelClassName
 * @param {Map} classIndex
 */
export function renderSystemAugmentation(documentClassName, dataModelClassName, classIndex) {
    const hasSchema = classIndex.has(dataModelClassName) && flattenSchema(dataModelClassName, classIndex).properties.length > 0;
    const type = hasSchema ? `${dataModelClassName} & ${dataModelClassName}Schema` : dataModelClassName;
    return [
        `/** @type {${type}} */`,
        `${documentClassName}.prototype.system;`,
    ].join('\n');
}

/**
 * Render a `<SheetClass>.prototype.document` type augmentation.
 */
export function renderDocumentAugmentation(sheetClassName, documentClassName) {
    return [
        `/** @type {${documentClassName}} */`,
        `${sheetClassName}.prototype.document;`,
    ].join('\n');
}

/**
 * Render the aggregate jsdoc file for a whole scripts subdirectory. Emits
 * ONLY typedefs and prototype-expando type augmentations - it never
 * redeclares a real project class, so it can't collide with or hijack
 * "go to declaration" on the real source.
 * @param {string} dirRelPath
 * @param {Array<object>} filesInDir - parsed file objects for this dir (index.js already excluded upstream)
 * @param {object} registry
 * @param {Map} classIndex
 * @param {string} headerTimestamp
 */
export function renderDirectoryFile(dirRelPath, filesInDir, registry, classIndex, headerTimestamp) {
    const role = roleForDir(dirRelPath);
    const pairing = buildPairingMaps(registry);

    const chunks = [];
    const allNotes = [];

    for (const file of filesInDir) {
        for (const classInfo of file.classes) {
            if (role === 'dataModel') {
                const typedef = renderSchemaTypedef(classInfo.name, classIndex);
                if (typedef) {
                    chunks.push(typedef.text);
                    allNotes.push(...typedef.notes.map(n => `${file.relPath}: ${n}`));
                }
            } else if (role === 'document' && pairing.docToDataModel.has(classInfo.name)) {
                const dm = pairing.docToDataModel.get(classInfo.name);
                chunks.push(renderSystemAugmentation(classInfo.name, dm, classIndex));
            } else if (role === 'sheet' && pairing.sheetToDoc.has(classInfo.name)) {
                const doc = pairing.sheetToDoc.get(classInfo.name);
                chunks.push(renderDocumentAugmentation(classInfo.name, doc));
            }
            // role === 'other' (apps/engine/foundry/replacements): nothing to add -
            // real methods/fields are already fully visible via real "go to
            // declaration" on the actual source, so there's no non-redundant,
            // non-colliding value jsdocs can add for these.
        }
    }

    if (!chunks.length) return null;

    const header = [
        '// File generated automatically by `tools jsdocs`. Do not edit by hand.',
        `// Last Updated: ${headerTimestamp}`,
        '//',
        '// This file is part of the "jsdocs" WebStorm library (see .idea/libraries/jsdocs.xml)',
        '// and is never imported or executed. It ONLY ever declares brand-new type names',
        '// (`<Class>Schema` typedefs) and augments real classes via `Class.prototype.x = ...`',
        '// references - it never redeclares a real class under its own name, so it cannot',
        '// shadow or hijack "go to declaration" on the actual source.',
    ];
    if (allNotes.length) {
        header.push('//', '// Notes from static analysis (unresolved/dynamic schema pieces):');
        for (const n of allNotes) header.push(`//  - ${n}`);
    }

    return header.join('\n') + '\n\n' + chunks.join('\n\n') + '\n';
}

export {roleForDir};

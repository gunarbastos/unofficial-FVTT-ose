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

function literalRender(node) {
    if (!node || node.type !== 'Literal') return null;
    if (typeof node.value === 'string') return {jsType: 'string', text: JSON.stringify(node.value)};
    if (typeof node.value === 'number') return {jsType: 'number', text: String(node.value)};
    if (typeof node.value === 'boolean') return {jsType: 'boolean', text: String(node.value)};
    if (node.value === null) return {jsType: '*', text: 'null'};
    return null;
}

function indent(text, spaces = 4) {
    const pad = ' '.repeat(spaces);
    return text.split('\n').map(l => (l ? pad + l : l)).join('\n');
}

/**
 * Render a single class (or factory-produced class) as an ambient stub.
 * @param {object} classInfo - from jsdocsParser
 * @param {{source: string, topLevelFunctions: Map}} fileCtx
 * @param {{role: string, pairing: {docToDataModel: Map, sheetToDoc: Map}}} opts
 */
export function renderClass(classInfo, fileCtx, opts) {
    const lines = [];
    const bodyLines = [];
    const notes = [];

    // --- header doc / extends ---
    const extendsClause = classInfo.superClass.raw ? ` extends ${classInfo.superClass.raw}` : '';
    const headerDocParts = [];
    if (classInfo.doc) headerDocParts.push(classInfo.doc);
    if (classInfo.isFactory) {
        lines.push(`// Produced by calling the \`${classInfo.name}(${(classInfo.factoryParams ?? []).join(', ')})\` factory function.`);
        lines.push('// Declared here as a plain class purely for type-completion purposes.');
    }

    // --- schema-derived instance properties (DataModel role only) ---
    if (opts.role === 'dataModel' && classInfo.hasDefineSchema) {
        const {properties, notes: schemaNotes} = resolveOwnSchemaProperties(classInfo.schemaObjectNode, {
            source: fileCtx.source,
            topLevelFunctions: fileCtx.topLevelFunctions,
            superAliasNames: new Set(classInfo.schemaSuperAliases ?? []),
            parserModule,
        });
        if (properties.length) {
            bodyLines.push('// --- Resolved from static defineSchema() ---');
            for (const prop of properties) {
                bodyLines.push(`/** @type {${prop.type}} */`);
                bodyLines.push(`${prop.name};`);
            }
        }
        for (const n of schemaNotes) bodyLines.push(`// NOTE: ${n}`);
        notes.push(...schemaNotes);
    }

    // --- document <-> dataModel / sheet <-> document pairing ---
    if (opts.role === 'document' && opts.pairing.docToDataModel.has(classInfo.name)) {
        const dm = opts.pairing.docToDataModel.get(classInfo.name);
        bodyLines.push('// --- Foundry document/data-model pairing (via UOSE.register*) ---');
        bodyLines.push(`/** @type {${dm}} */`);
        bodyLines.push('system;');
    }
    if (opts.role === 'sheet' && opts.pairing.sheetToDoc.has(classInfo.name)) {
        const doc = opts.pairing.sheetToDoc.get(classInfo.name);
        bodyLines.push('// --- Foundry sheet/document pairing (via UOSE.register*) ---');
        bodyLines.push(`/** @type {${doc}} */`);
        bodyLines.push('document;');
    }

    if (bodyLines.length) bodyLines.push('');

    // --- real members, in source order ---
    for (const m of classInfo.members) {
        if (m.kind === 'field') {
            const lit = literalRender(m.valueNode);
            if (m.doc) bodyLines.push(m.doc);
            if (lit) {
                if (!m.doc) bodyLines.push(`/** @type {${lit.jsType}} */`);
                bodyLines.push(`${m.static ? 'static ' : ''}${m.name} = ${lit.text};`);
            } else {
                if (!m.doc) bodyLines.push('/** @type {*} */');
                bodyLines.push(`${m.static ? 'static ' : ''}${m.name};`);
            }
        } else {
            // constructor | method | get | set
            const kindPrefix = m.kind === 'get' ? 'get ' : m.kind === 'set' ? 'set ' : '';
            const asyncPrefix = m.isAsync ? 'async ' : '';
            const genStar = m.isGenerator ? '*' : '';
            const staticPrefix = m.static ? 'static ' : '';
            const nameOut = m.kind === 'constructor' ? 'constructor' : m.name;
            if (m.doc) bodyLines.push(m.doc);
            bodyLines.push(`${staticPrefix}${asyncPrefix}${kindPrefix}${genStar}${nameOut}(${m.params.join(', ')}) {}`);
        }
    }

    const classHeader = headerDocParts.length ? headerDocParts.join('\n') + '\n' : '';
    lines.push(`${classHeader}class ${classInfo.name}${extendsClause} {`);
    lines.push(indent(bodyLines.join('\n')));
    lines.push('}');

    return {text: lines.join('\n'), notes};
}

/**
 * Order a directory's files according to its `order` file (matching by
 * filename, `.js`-enforced), falling back to alphabetical for the rest.
 * @param {string[]} orderEntries - from common.readOrderFile(dir, 'js')
 * @param {Array<{relPath: string}>} files
 */
export function orderFiles(orderEntries, files) {
    const remaining = [...files];
    const ordered = [];
    for (const entry of orderEntries) {
        const idx = remaining.findIndex(f => f.relPath.split('/').pop() === entry);
        if (idx !== -1) ordered.push(remaining.splice(idx, 1)[0]);
    }
    remaining.sort((a, b) => a.relPath.localeCompare(b.relPath));
    return [...ordered, ...remaining];
}

/**
 * Render the aggregate jsdoc file for a whole scripts subdirectory.
 * @param {string} dirRelPath
 * @param {Array<object>} filesInDir - parsed file objects for this dir (index.js already excluded upstream)
 * @param {object} registry
 * @param {string} headerTimestamp
 */
export function renderDirectoryFile(dirRelPath, filesInDir, registry, headerTimestamp) {
    const role = roleForDir(dirRelPath);
    const pairing = buildPairingMaps(registry);

    const chunks = [];
    const allNotes = [];
    for (const file of filesInDir) {
        for (const classInfo of file.classes) {
            const {text, notes} = renderClass(classInfo, file, {role, pairing});
            chunks.push(text);
            allNotes.push(...notes.map(n => `${file.relPath}: ${n}`));
        }
    }

    if (!chunks.length) return null;

    const header = [
        '// File generated automatically by `tools jsdocs`. Do not edit by hand.',
        `// Last Updated: ${headerTimestamp}`,
        '//',
        '// This file is part of the "jsdocs" WebStorm library (see .idea/libraries/jsdocs.xml)',
        '// and is never imported or executed - it exists purely to give WebStorm real',
        '// code-completion and inspections for the runtime shape of UOSE classes.',
    ];
    if (allNotes.length) {
        header.push('//', '// Notes from static analysis (unresolved/dynamic schema pieces):');
        for (const n of allNotes) header.push(`//  - ${n}`);
    }

    return header.join('\n') + '\n\n' + chunks.join('\n\n') + '\n';
}

export {roleForDir};

console.log(`Loaded: ${import.meta.url}`);

/**
 * Maps a Foundry `foundry.data.fields.XField` constructor name to a JSDoc type.
 * Anything not covered here falls back to '*' and gets flagged by the caller.
 */
const SIMPLE_FIELD_TYPES = {
    StringField: 'string',
    HTMLField: 'string',
    FilePathField: 'string',
    DocumentUUIDField: 'string',
    DocumentIdField: 'string',
    ForeignDocumentField: 'string',
    ColorField: 'string',
    DocumentTypeField: 'string',
    JSONField: 'string',
    NumberField: 'number',
    AngleField: 'number',
    AlphaField: 'number',
    IntegerSortField: 'number',
    BooleanField: 'boolean',
    ObjectField: 'object',
};

function propKeyName(keyNode, source) {
    if (keyNode.type === 'Identifier') return keyNode.name;
    if (keyNode.type === 'Literal') return String(keyNode.value);
    return source.slice(keyNode.start, keyNode.end);
}

/**
 * Try to resolve the class name referenced by an `EmbeddedDataField`/
 * `EmbeddedCollectionField`-style argument, which is either a bare class
 * reference (`UOSERangeDataModel`) or a factory call (`UOSEMovementDataModel()`).
 * @param {object} argNode
 * @returns {string|null}
 */
function resolveEmbeddedClassName(argNode) {
    if (!argNode) return null;
    if (argNode.type === 'Identifier') return argNode.name;
    if (argNode.type === 'CallExpression' && argNode.callee.type === 'Identifier') return argNode.callee.name;
    return null;
}

/**
 * Map a `new fields.XField(...)` (or nested) value node to a JSDoc type string.
 * @param {object} valueNode
 * @param {string} source
 * @param {string[]} notes - unresolved-field notes are pushed here
 * @returns {string}
 */
export function mapFieldValue(valueNode, source, notes) {
    if (!valueNode || valueNode.type !== 'NewExpression') return '*';

    let calleeName = null;
    if (valueNode.callee.type === 'MemberExpression' && valueNode.callee.property.type === 'Identifier') {
        calleeName = valueNode.callee.property.name;
    } else if (valueNode.callee.type === 'Identifier') {
        calleeName = valueNode.callee.name;
    }
    const args = valueNode.arguments;

    if (calleeName && SIMPLE_FIELD_TYPES[calleeName]) return SIMPLE_FIELD_TYPES[calleeName];

    if (calleeName === 'ArrayField' || calleeName === 'SetField') {
        const inner = args[0] ? mapFieldValue(args[0], source, notes) : '*';
        return calleeName === 'SetField' ? `Set<${inner}>` : `${inner}[]`;
    }

    if (calleeName === 'EmbeddedDataField') {
        const cls = resolveEmbeddedClassName(args[0]);
        return cls ?? '*';
    }

    if (calleeName === 'EmbeddedCollectionField' || calleeName === 'EmbeddedDocumentField') {
        const cls = resolveEmbeddedClassName(args[0]);
        return cls ? `${cls}[]` : '*';
    }

    if (calleeName === 'SchemaField') {
        if (args[0] && args[0].type === 'ObjectExpression') {
            return buildInlineObjectType(args[0], source, notes);
        }
        return 'object';
    }

    if (calleeName === 'TypedObjectField' || calleeName === 'TypedSchemaField') {
        return 'object';
    }

    if (calleeName) {
        notes.push(`unmapped Foundry field type '${calleeName}' - defaulted to '*'`);
    }
    return '*';
}

/**
 * Build an inline `{key: Type, ...}` JSDoc object-type string for a nested
 * `SchemaField({...})` object literal.
 */
export function buildInlineObjectType(objNode, source, notes) {
    const parts = [];
    for (const prop of objNode.properties) {
        if (prop.type === 'SpreadElement') {
            parts.push('*');
            continue;
        }
        const key = propKeyName(prop.key, source);
        const type = mapFieldValue(prop.value, source, notes);
        parts.push(`${key}: ${type}`);
    }
    return `{${parts.join(', ')}}`;
}

/**
 * Resolve the *own* (non-inherited) schema fields declared in a class's
 * `defineSchema()` return object. `...super.defineSchema()` spreads are
 * intentionally skipped here since inheritance is represented via a real
 * `extends` relationship in the generated stub. Local helper-function
 * spreads (e.g. `..._commonAttributes()`) are inlined.
 * @param {object} objectExpressionNode
 * @param {{source: string, topLevelFunctions: Map<string, object>}} ctx
 * @returns {{properties: Array<{name:string, type:string}>, notes: string[]}}
 */
export function resolveOwnSchemaProperties(objectExpressionNode, ctx) {
    const properties = [];
    const notes = [];
    if (!objectExpressionNode) return {properties, notes};

    for (const prop of objectExpressionNode.properties) {
        if (prop.type === 'SpreadElement') {
            const arg = prop.argument;
            const isSuperCall = arg.type === 'CallExpression'
                && arg.callee.type === 'MemberExpression'
                && arg.callee.object.type === 'Super'
                && arg.callee.property.name === 'defineSchema';
            const isSuperAlias = arg.type === 'Identifier' && ctx.superAliasNames && ctx.superAliasNames.has(arg.name);
            if (isSuperCall || isSuperAlias) continue; // inherited via real `extends`

            if (arg.type === 'CallExpression' && arg.callee.type === 'Identifier' && ctx.topLevelFunctions.has(arg.callee.name)) {
                const fnNode = ctx.topLevelFunctions.get(arg.callee.name);
                // Lazily import to avoid a circular dependency at module load time.
                const {findReturnedObjectLiteral} = ctx.parserModule;
                const {objectNode, hasDynamicAdditions} = findReturnedObjectLiteral(fnNode, ctx.source);
                if (objectNode) {
                    const sub = resolveOwnSchemaProperties(objectNode, ctx);
                    properties.push(...sub.properties);
                    notes.push(...sub.notes);
                    if (hasDynamicAdditions) {
                        notes.push(`additional fields may be added dynamically at runtime by ${arg.callee.name}()`);
                    }
                } else {
                    notes.push(`unresolved spread: ...${ctx.source.slice(arg.start, arg.end)}`);
                }
                continue;
            }

            notes.push(`unresolved spread: ...${ctx.source.slice(arg.start, arg.end)}`);
            continue;
        }

        if (prop.type === 'Property') {
            const name = propKeyName(prop.key, ctx.source);
            const type = mapFieldValue(prop.value, ctx.source, notes);
            properties.push({name, type});
        }
    }

    return {properties, notes};
}

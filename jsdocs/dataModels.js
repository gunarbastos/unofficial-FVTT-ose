// File generated automatically by `tools jsdocs`. Do not edit by hand.
// Last Updated: 19/07/2026 19:47:49.905 UTC-3
//
// This file is part of the "jsdocs" WebStorm library (see .idea/libraries/jsdocs.xml)
// and is never imported or executed. It ONLY ever declares brand-new type names
// (`<Class>Schema` typedefs) and augments real classes via `Class.prototype.x = ...`
// references - it never redeclares a real class under its own name, so it cannot
// shadow or hijack "go to declaration" on the actual source.
//
// Notes from static analysis (unresolved/dynamic schema pieces):
//  - dataModels/UOSEAbilityDataModel.js: unmapped Foundry field type 'TGLPolymorphicEmbeddedField' - defaulted to '*'

/**
 * Resolved from UOSEAbilityDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAbilityDataModelSchema
 * @property {number} level
 * @property {string} description
 * @property {*[]} effects
 */

/**
 * Resolved from UOSEArmorClassDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEArmorClassDataModelSchema
 * @property {number} descending
 * @property {number} ascending
 */

/**
 * Resolved from UOSEAttackDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAttackDataModelSchema
 * @property {boolean} useItem
 * @property {string} itemUUID
 * @property {string} damage
 * @property {string} targets
 * @property {string} saveAgainst
 * @property {string} description
 */

/**
 * Resolved from UOSEBaseDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEBaseDataModelSchema
 * @property {object} automation
 */

/**
 * Resolved from UOSEEmbedBaseDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedBaseDataModelSchema
 * @property {object} automation
 */

/**
 * Resolved from UOSEEffectDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEffectDataModelSchema
 * @property {string} internalType
 */

/**
 * Resolved from UOSEHitDiceDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEHitDiceDataModelSchema
 * @property {string} formula
 * @property {number} average
 * @property {number} specialAbilities
 */

/**
 * Resolved from UOSEMovementDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEMovementDataModelSchema
 * @property {number} base
 * @property {number} encounter
 */

/**
 * Resolved from UOSENumberAppearingDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSENumberAppearingDataModelSchema
 * @property {string} dungeon
 * @property {string} lairOrWilderness
 */

/**
 * Resolved from UOSERangeDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSERangeDataModelSchema
 * @property {UOSEValueRangeDataModel} melee
 * @property {{short: UOSEValueRangeDataModel, medium: UOSEValueRangeDataModel, long: UOSEValueRangeDataModel}} ranged
 */

/**
 * Resolved from UOSESavesDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSESavesDataModelSchema
 * @property {number} death
 * @property {number} wand
 * @property {number} paralysis
 * @property {number} breath
 * @property {number} spell
 */

/**
 * Resolved from UOSEToHitDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEToHitDataModelSchema
 * @property {number} thac0
 * @property {number} attackBonus
 */

/**
 * Resolved from UOSETokenBarEligibleAttribute.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSETokenBarEligibleAttributeSchema
 * @property {number} min
 * @property {number} max
 * @property {number} value
 */

/**
 * Resolved from UOSEValueRangeDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEValueRangeDataModelSchema
 * @property {number} start
 * @property {number} end
 */

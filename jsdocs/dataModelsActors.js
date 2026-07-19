// File generated automatically by `tools jsdocs`. Do not edit by hand.
// Last Updated: 19/07/2026 19:47:49.905 UTC-3
//
// This file is part of the "jsdocs" WebStorm library (see .idea/libraries/jsdocs.xml)
// and is never imported or executed. It ONLY ever declares brand-new type names
// (`<Class>Schema` typedefs) and augments real classes via `Class.prototype.x = ...`
// references - it never redeclares a real class under its own name, so it cannot
// shadow or hijack "go to declaration" on the actual source.

/**
 * Resolved from UOSEBaseActorDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEBaseActorDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 */

/**
 * Resolved from UOSELivingDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSELivingDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 */

/**
 * Resolved from UOSENpcDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSENpcDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {number} morale
 * @property {number} xp
 * @property {UOSEAttackDataModel[][]} attacks
 */

/**
 * Resolved from UOSECharacterDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSECharacterDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {{str: number, int: number, wis: number, dex: number, con: number, cha: number}} attributes
 * @property {{total: number, unassigned: number, assignLog: string[]}} xp
 * @property {string[]} languages
 * @property {{forage: number, findTrap: number, hunt: number, listenAtDoor: number, openStuckDoor: number, findSecretDoor: number, secondary: string[]}} skills
 * @property {{title: string, origin: string}[]} titles
 */

/**
 * Resolved from UOSEAnimalActorDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAnimalActorDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {number} morale
 * @property {number} xp
 * @property {UOSEAttackDataModel[][]} attacks
 * @property {string} linkedItemUUID
 */

/**
 * Resolved from UOSELandVehicleActorDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSELandVehicleActorDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 */

/**
 * Resolved from UOSEMonsterDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEMonsterDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {number} morale
 * @property {number} xp
 * @property {UOSEAttackDataModel[][]} attacks
 * @property {string} linkedItemUUID
 * @property {UOSENumberAppearingDataModel} numberAppearing
 * @property {string} treasureType
 */

/**
 * Resolved from UOSERetainerDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSERetainerDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 * @property {UOSEToHitDataModel} toHit
 * @property {UOSETokenBarEligibleAttribute} hp
 * @property {UOSEHitDiceDataModel} hd
 * @property {string} alignment
 * @property {UOSESavesDataModel} saves
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {{str: number, int: number, wis: number, dex: number, con: number, cha: number}} attributes
 * @property {{total: number, unassigned: number, assignLog: string[]}} xp
 * @property {string[]} languages
 * @property {{forage: number, findTrap: number, hunt: number, listenAtDoor: number, openStuckDoor: number, findSecretDoor: number, secondary: string[]}} skills
 * @property {{title: string, origin: string}[]} titles
 * @property {number} loyalty
 * @property {string} linkedItemUUID
 */

/**
 * Resolved from UOSEWaterVehicleActorDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEWaterVehicleActorDataModelSchema
 * @property {object} automation
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEMovementDataModel} movement
 */

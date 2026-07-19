// File generated automatically by `tools jsdocs`. Do not edit by hand.
// Last Updated: 19/07/2026 19:47:49.905 UTC-3
//
// This file is part of the "jsdocs" WebStorm library (see .idea/libraries/jsdocs.xml)
// and is never imported or executed. It ONLY ever declares brand-new type names
// (`<Class>Schema` typedefs) and augments real classes via `Class.prototype.x = ...`
// references - it never redeclares a real class under its own name, so it cannot
// shadow or hijack "go to declaration" on the actual source.

/**
 * Resolved from UOSEBaseItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEBaseItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 */

/**
 * Resolved from UOSEMarketItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEMarketItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 */

/**
 * Resolved from UOSEInventoryItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEInventoryItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 */

/**
 * Resolved from UOSEEquipableItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEquipableItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {boolean} equipped
 * @property {string[]} equipableBy
 */

/**
 * Resolved from UOSEAdventuringGearDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAdventuringGearDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {number} numberOfUses
 * @property {string[]} tags
 * @property {UOSEEmbedAdventuringGearDataModel} embed
 */

/**
 * Resolved from UOSEEmbedAdventuringGearDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedAdventuringGearDataModelSchema
 * @property {number} quantityRemaining
 */

/**
 * Resolved from UOSEAmmunitionDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAmmunitionDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {number} quantity
 * @property {string[]} usableBy
 * @property {UOSEEmbedAmmunitionDataModel} embed
 */

/**
 * Resolved from UOSEEmbedAmmunitionDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedAmmunitionDataModelSchema
 * @property {number} quantityRemaining
 */

/**
 * Resolved from UOSEAnimalItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEAnimalItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {string} subtype
 * @property {{maxLoad: number, milesPerDay: number, movement: UOSEMovementDataModel}} unencumbered
 * @property {{maxLoad: number, milesPerDay: number, movement: UOSEMovementDataModel}} encumbered
 * @property {UOSEEmbedAnimalItemDataModel} embed
 */

/**
 * Resolved from UOSEEmbedAnimalItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedAnimalItemDataModelSchema
 * @property {string} actor
 */

/**
 * Resolved from UOSEArmorDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEArmorDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {boolean} equipped
 * @property {string[]} equipableBy
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {string} type
 */

/**
 * Resolved from UOSEClassDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEClassDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {{stat: string, value: number}[]} requirements
 * @property {string[]} prime
 * @property {{level: number, xp: number, hitDice: string, thac0: {table: number, bonus: number}, save: UOSESavesDataModel, extraSkills: {name: string, value: number}[]}[]} levels
 * @property {string} proficiencies
 * @property {string[]} languages
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {string[]} titles
 * @property {{name: string, abbreviation: string, roll: string, comparison: string}[]} extraSkills
 * @property {UOSEEmbedClassDataModel} embed
 */

/**
 * Resolved from UOSEEmbedClassDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedClassDataModelSchema
 * @property {number} xp
 * @property {{level: number, amount: number}[]} hpGained
 */

/**
 * Resolved from UOSEContainerDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEContainerDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {boolean} equipped
 * @property {string[]} equipableBy
 * @property {number} capacity
 */

/**
 * Resolved from UOSELandVehicleItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSELandVehicleItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} milesPerDay
 * @property {UOSEMovementDataModel} movement
 * @property {{quantityHorses: number, quantityMules: number, maxLoad: number}} minimumAnimals
 * @property {{quantityHorses: number, quantityMules: number, maxLoad: number}} extraAnimals
 * @property {UOSEEmbedLandVehicleItemDataModel} embed
 */

/**
 * Resolved from UOSEEmbedLandVehicleItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedLandVehicleItemDataModelSchema
 * @property {string} actor
 */

/**
 * Resolved from UOSEPoisonDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEPoisonDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {number} saveModifier
 * @property {number} chanceOfDetection
 * @property {string} onsetTime
 * @property {{onSave: UOSEAbilityDataModel[], onFail: UOSEAbilityDataModel[]}} effects
 * @property {string} deliveryMethod
 */

/**
 * Resolved from UOSERaceDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSERaceDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {{stat: string, value: number}[]} requirements
 * @property {{stat: string, value: number}[]} abilityModifiers
 * @property {{name: string, maxLevel: number}[]} classes
 * @property {string[]} languages
 * @property {UOSEAbilityDataModel[]} abilities
 * @property {string[]} titles
 */

/**
 * Resolved from UOSEServiceDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEServiceDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {string} subtype
 * @property {{value: number, frequency: number}} wage
 * @property {{value: number, frequency: number, fractionalShares: number}} fee
 * @property {UOSEEmbedServiceDataModel} embed
 */

/**
 * Resolved from UOSEEmbedServiceDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedServiceDataModelSchema
 * @property {string} actor
 */

/**
 * Resolved from UOSESpellDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSESpellDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} level
 * @property {string[]} spellLists
 * @property {{activation: UOSEAbilityDataModel[], reverse: UOSEAbilityDataModel[]}} effects
 * @property {string} targets
 * @property {boolean} concentration
 */

/**
 * Resolved from UOSEWaterVehicleItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEWaterVehicleItemDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} cargoCapacity
 * @property {string} usage
 * @property {boolean} seaworthy
 * @property {{length: string, beam: string, draft: string}} dimensions
 * @property {boolean} mayBePilotedByUnskilled
 * @property {{requiresCaptain: boolean, multiroleCrew: boolean, maximumMercenaries: number, oarsmen: {numberRequired: number, milesPerDay: number, movement: UOSEMovementDataModel}, sailors: {numberRequired: number, milesPerDay: number, movement: UOSEMovementDataModel}}} crew
 * @property {{min: number, max: number, perSquare: boolean}} hullPoints
 * @property {UOSEArmorClassDataModel} armorClass
 * @property {{has: boolean, builtIn: boolean}} ram
 * @property {{has: boolean, max: number}} catapult
 * @property {UOSEEmbedWaterVehicleItemDataModel} embed
 */

/**
 * Resolved from UOSEEmbedWaterVehicleItemDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEEmbedWaterVehicleItemDataModelSchema
 * @property {string} actor
 */

/**
 * Resolved from UOSEWeaponDataModel.defineSchema(), flattened across its full
 * inheritance chain (parent fields first, own fields override by name).
 * @typedef {object} UOSEWeaponDataModelSchema
 * @property {object} automation
 * @property {string} description
 * @property {number} price
 * @property {number} weight
 * @property {string} storedAtUUID
 * @property {boolean} equipped
 * @property {string[]} equipableBy
 * @property {string} damage
 * @property {string[]} qualities
 * @property {UOSERangeDataModel} range
 * @property {string} subtype
 * @property {UOSEAbilityDataModel[]} abilities
 */

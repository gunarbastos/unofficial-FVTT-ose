// File generated automatically by `tools jsdocs`. Do not edit by hand.
// Last Updated: 16/08/2026 03:28:03.864 UTC-3
//
// Mirrors the runtime shape of `_uose` / `game.uose` (scripts/foundry/uose.js),
// including everything registered into it via `UOSE.Register*(...)` calls
// across the codebase. Purely a type-completion aid; never imported/executed.

/**
 * Mirrors the shape of lang/en.json under its "UOSE" key. At runtime each leaf
 * is replaced by UOSEUtils.createLangObject() with its own flattened i18n key
 * string (e.g. `_uose.lang.SYSTEM.NAME === "UOSE.SYSTEM.NAME"`), so every leaf
 * here is typed as `string`.
 * @typedef {object} _UOSELang
 * @property {object} COMMON
 * @property {object} COMMON.UI
 * @property {string} COMMON.UI.ADD
 * @property {string} COMMON.UI.EDIT
 * @property {string} COMMON.UI.REMOVE
 * @property {string} COMMON.UI.INCREASE
 * @property {string} COMMON.UI.DECREASE
 * @property {string} COMMON.UI.SETTINGS
 * @property {object} SYSTEM
 * @property {string} SYSTEM.NAME
 * @property {string} SYSTEM.SHORT
 * @property {object} ALIGNMENTS
 * @property {string} ALIGNMENTS.LAWFUL
 * @property {string} ALIGNMENTS.NEUTRAL
 * @property {string} ALIGNMENTS.EVIL
 * @property {object} SETTINGS
 * @property {object} SETTINGS.LANGUAGES
 * @property {string} SETTINGS.LANGUAGES.LABEL
 * @property {string} SETTINGS.LANGUAGES.HINT
 * @property {string} SETTINGS.LANGUAGES.PH
 * @property {object} SETTINGS.ALIGNMENT
 * @property {string} SETTINGS.ALIGNMENT.LABEL
 * @property {string} SETTINGS.ALIGNMENT.HINT
 * @property {string} SETTINGS.ALIGNMENT.PH
 * @property {object} SETTINGS.ADVANCED_CHARACTER_CREATION
 * @property {string} SETTINGS.ADVANCED_CHARACTER_CREATION.LABEL
 * @property {string} SETTINGS.ADVANCED_CHARACTER_CREATION.HINT
 * @property {string} SETTINGS.ADVANCED_CHARACTER_CREATION.SOURCE
 * @property {object} SETTINGS.MULTICLASS
 * @property {string} SETTINGS.MULTICLASS.LABEL
 * @property {string} SETTINGS.MULTICLASS.HINT
 * @property {string} SETTINGS.MULTICLASS.SOURCE
 * @property {object} SETTINGS.INDIVIDUAL_INITIATIVE
 * @property {string} SETTINGS.INDIVIDUAL_INITIATIVE.LABEL
 * @property {string} SETTINGS.INDIVIDUAL_INITIATIVE.HINT
 * @property {string} SETTINGS.INDIVIDUAL_INITIATIVE.SOURCE
 * @property {object} SETTINGS.ASCENDING_AC
 * @property {string} SETTINGS.ASCENDING_AC.LABEL
 * @property {string} SETTINGS.ASCENDING_AC.HINT
 * @property {string} SETTINGS.ASCENDING_AC.SOURCE
 * @property {object} SETTINGS.ATTACK_ROLL_USING_THAC0
 * @property {string} SETTINGS.ATTACK_ROLL_USING_THAC0.LABEL
 * @property {string} SETTINGS.ATTACK_ROLL_USING_THAC0.HINT
 * @property {string} SETTINGS.ATTACK_ROLL_USING_THAC0.SOURCE
 * @property {object} SETTINGS.MORALE
 * @property {string} SETTINGS.MORALE.LABEL
 * @property {string} SETTINGS.MORALE.HINT
 * @property {string} SETTINGS.MORALE.SOURCE
 * @property {object} SETTINGS.ENCUMBRANCE
 * @property {string} SETTINGS.ENCUMBRANCE.LABEL
 * @property {string} SETTINGS.ENCUMBRANCE.HINT
 * @property {string} SETTINGS.ENCUMBRANCE.SOURCE
 * @property {object} SETTINGS.ADD_STR_TO_ITEM_BASED_ENCUMBRANCE
 * @property {string} SETTINGS.ADD_STR_TO_ITEM_BASED_ENCUMBRANCE.LABEL
 * @property {string} SETTINGS.ADD_STR_TO_ITEM_BASED_ENCUMBRANCE.HINT
 * @property {string} SETTINGS.ADD_STR_TO_ITEM_BASED_ENCUMBRANCE.SOURCE
 * @property {object} SETTINGS.RETURNING_FROM_DEATH
 * @property {string} SETTINGS.RETURNING_FROM_DEATH.LABEL
 * @property {string} SETTINGS.RETURNING_FROM_DEATH.HINT
 * @property {string} SETTINGS.RETURNING_FROM_DEATH.SOURCE
 * @property {object} SETTINGS.RELOAD
 * @property {string} SETTINGS.RELOAD.LABEL
 * @property {string} SETTINGS.RELOAD.HINT
 * @property {string} SETTINGS.RELOAD.SOURCE
 * @property {object} SETTINGS.DAMAGE_PER_WEAPON
 * @property {string} SETTINGS.DAMAGE_PER_WEAPON.LABEL
 * @property {string} SETTINGS.DAMAGE_PER_WEAPON.HINT
 * @property {string} SETTINGS.DAMAGE_PER_WEAPON.SOURCE
 * @property {object} SETTINGS.SECONDARY_SKILL
 * @property {string} SETTINGS.SECONDARY_SKILL.LABEL
 * @property {string} SETTINGS.SECONDARY_SKILL.HINT
 * @property {string} SETTINGS.SECONDARY_SKILL.SOURCE
 * @property {object} SETTINGS.WEAPON_PROFICIENCY
 * @property {string} SETTINGS.WEAPON_PROFICIENCY.LABEL
 * @property {string} SETTINGS.WEAPON_PROFICIENCY.HINT
 * @property {string} SETTINGS.WEAPON_PROFICIENCY.SOURCE
 * @property {object} SETTINGS.REROLL_1_AND_2_ON_1ST_LEVEL_HD
 * @property {string} SETTINGS.REROLL_1_AND_2_ON_1ST_LEVEL_HD.LABEL
 * @property {string} SETTINGS.REROLL_1_AND_2_ON_1ST_LEVEL_HD.HINT
 * @property {string} SETTINGS.REROLL_1_AND_2_ON_1ST_LEVEL_HD.SOURCE
 * @property {object} SETTINGS.ALLOW_ILLUSIONIST_TO_WIELD_STAVES
 * @property {string} SETTINGS.ALLOW_ILLUSIONIST_TO_WIELD_STAVES.LABEL
 * @property {string} SETTINGS.ALLOW_ILLUSIONIST_TO_WIELD_STAVES.HINT
 * @property {string} SETTINGS.ALLOW_ILLUSIONIST_TO_WIELD_STAVES.SOURCE
 * @property {object} SETTINGS.ALLOW_MAGIC_USERS_TO_WIELD_STAVES
 * @property {string} SETTINGS.ALLOW_MAGIC_USERS_TO_WIELD_STAVES.LABEL
 * @property {string} SETTINGS.ALLOW_MAGIC_USERS_TO_WIELD_STAVES.HINT
 * @property {string} SETTINGS.ALLOW_MAGIC_USERS_TO_WIELD_STAVES.SOURCE
 * @property {object} SETTINGS.IGNORE_RACE_CLASS_RESTRICTIONS
 * @property {string} SETTINGS.IGNORE_RACE_CLASS_RESTRICTIONS.LABEL
 * @property {string} SETTINGS.IGNORE_RACE_CLASS_RESTRICTIONS.HINT
 * @property {string} SETTINGS.IGNORE_RACE_CLASS_RESTRICTIONS.SOURCE
 * @property {object} SETTINGS.IGNORE_RACE_MAX_LEVEL_RESTRICTION
 * @property {string} SETTINGS.IGNORE_RACE_MAX_LEVEL_RESTRICTION.LABEL
 * @property {string} SETTINGS.IGNORE_RACE_MAX_LEVEL_RESTRICTION.HINT
 * @property {string} SETTINGS.IGNORE_RACE_MAX_LEVEL_RESTRICTION.SOURCE
 * @property {object} SETTINGS.LIMIT_TURN_UNDEAD
 * @property {string} SETTINGS.LIMIT_TURN_UNDEAD.LABEL
 * @property {string} SETTINGS.LIMIT_TURN_UNDEAD.HINT
 * @property {string} SETTINGS.LIMIT_TURN_UNDEAD.SOURCE
 * @property {object} SETTINGS.ADVANCED_SPELL_BOOK
 * @property {string} SETTINGS.ADVANCED_SPELL_BOOK.LABEL
 * @property {string} SETTINGS.ADVANCED_SPELL_BOOK.HINT
 * @property {string} SETTINGS.ADVANCED_SPELL_BOOK.SOURCE
 * @property {object} SETTINGS.VARIABLE_WIND_CONDITIONS
 * @property {string} SETTINGS.VARIABLE_WIND_CONDITIONS.LABEL
 * @property {string} SETTINGS.VARIABLE_WIND_CONDITIONS.HINT
 * @property {string} SETTINGS.VARIABLE_WIND_CONDITIONS.SOURCE
 * @property {object} SETTINGS.ATTACKING_WITH_TWO_WEAPONS
 * @property {string} SETTINGS.ATTACKING_WITH_TWO_WEAPONS.LABEL
 * @property {string} SETTINGS.ATTACKING_WITH_TWO_WEAPONS.HINT
 * @property {string} SETTINGS.ATTACKING_WITH_TWO_WEAPONS.SOURCE
 * @property {object} SETTINGS.CHARGING_INTO_MELEE
 * @property {string} SETTINGS.CHARGING_INTO_MELEE.LABEL
 * @property {string} SETTINGS.CHARGING_INTO_MELEE.HINT
 * @property {string} SETTINGS.CHARGING_INTO_MELEE.SOURCE
 * @property {object} SETTINGS.INVULNERABILITIES
 * @property {string} SETTINGS.INVULNERABILITIES.LABEL
 * @property {string} SETTINGS.INVULNERABILITIES.HINT
 * @property {string} SETTINGS.INVULNERABILITIES.SOURCE
 * @property {object} SETTINGS.MISSILE_ATTACKS_ON_TARGETS_IN_MELEE
 * @property {string} SETTINGS.MISSILE_ATTACKS_ON_TARGETS_IN_MELEE.LABEL
 * @property {string} SETTINGS.MISSILE_ATTACKS_ON_TARGETS_IN_MELEE.HINT
 * @property {string} SETTINGS.MISSILE_ATTACKS_ON_TARGETS_IN_MELEE.SOURCE
 * @property {object} SETTINGS.PARRYING
 * @property {string} SETTINGS.PARRYING.LABEL
 * @property {string} SETTINGS.PARRYING.HINT
 * @property {string} SETTINGS.PARRYING.SOURCE
 * @property {object} SETTINGS.SPLASH_WEAPONS
 * @property {string} SETTINGS.SPLASH_WEAPONS.LABEL
 * @property {string} SETTINGS.SPLASH_WEAPONS.HINT
 * @property {string} SETTINGS.SPLASH_WEAPONS.SOURCE
 * @property {object} SETTINGS.SUBDUING
 * @property {string} SETTINGS.SUBDUING.LABEL
 * @property {string} SETTINGS.SUBDUING.HINT
 * @property {string} SETTINGS.SUBDUING.SOURCE
 * @property {object} SETTINGS.THIEF_D6_SKILLS
 * @property {string} SETTINGS.THIEF_D6_SKILLS.LABEL
 * @property {string} SETTINGS.THIEF_D6_SKILLS.HINT
 * @property {string} SETTINGS.THIEF_D6_SKILLS.SOURCE
 * @property {object} SETTINGS.COMBAT_TALENTS
 * @property {string} SETTINGS.COMBAT_TALENTS.LABEL
 * @property {string} SETTINGS.COMBAT_TALENTS.HINT
 * @property {string} SETTINGS.COMBAT_TALENTS.SOURCE
 * @property {object} SETTINGS.TREASURE_SHARE_XP
 * @property {string} SETTINGS.TREASURE_SHARE_XP.LABEL
 * @property {string} SETTINGS.TREASURE_SHARE_XP.HINT
 * @property {string} SETTINGS.TREASURE_SHARE_XP.SOURCE
 * @property {object} SETTINGS.CANTRIPS
 * @property {string} SETTINGS.CANTRIPS.LABEL
 * @property {string} SETTINGS.CANTRIPS.HINT
 * @property {string} SETTINGS.CANTRIPS.SOURCE
 * @property {object} SETTINGS.SPECIAL_MATERIALS
 * @property {string} SETTINGS.SPECIAL_MATERIALS.LABEL
 * @property {string} SETTINGS.SPECIAL_MATERIALS.HINT
 * @property {string} SETTINGS.SPECIAL_MATERIALS.SOURCE
 * @property {object} APPS
 * @property {object} APPS.SETTINGS_EDITOR
 * @property {string} APPS.SETTINGS_EDITOR.NAME
 * @property {string} APPS.SETTINGS_EDITOR.TITLE
 * @property {object} APPS.SETTINGS_EDITOR.SECTIONS
 * @property {string} APPS.SETTINGS_EDITOR.SECTIONS.OVERRIDES
 * @property {string} APPS.SETTINGS_EDITOR.SECTIONS.OPTIONAL
 * @property {string} APPS.SETTINGS_EDITOR.SECTIONS.AUTOMATION
 * @property {string} APPS.SETTINGS_EDITOR.SECTIONS.HOOKS
 * @property {object} APPS.SETTINGS_EDITOR.UI
 * @property {object} APPS.SETTINGS_EDITOR.UI.FILTER
 * @property {string} APPS.SETTINGS_EDITOR.UI.FILTER.LABEL
 * @property {string} APPS.SETTINGS_EDITOR.UI.FILTER.PH
 * @property {string} APPS.SETTINGS_EDITOR.UI.SOURCE
 * @property {string} APPS.SETTINGS_EDITOR.UI.LAUNCHER_BTN
 * @property {object} APPS.PARTY_MANAGER
 * @property {string} APPS.PARTY_MANAGER.NAME
 * @property {string} APPS.PARTY_MANAGER.TITLE
 * @property {object} APPS.PARTY_MANAGER.UI
 * @property {string} APPS.PARTY_MANAGER.UI.LAUNCHER_BTN
 * @property {string} APPS.PARTY_MANAGER.UI.ADD_GOLD_BTN
 * @property {string} APPS.PARTY_MANAGER.UI.ADD_ITEMS_BTN
 * @property {string} APPS.PARTY_MANAGER.UI.ADD_XP_BTN
 * @property {string} APPS.PARTY_MANAGER.UI.MEMBERS_TITLE
 * @property {string} APPS.PARTY_MANAGER.UI.PLAYER_MEMBER
 * @property {string} APPS.PARTY_MANAGER.UI.RETAINER_MEMBER
 * @property {string} APPS.PARTY_MANAGER.UI.GUEST_MEMBER
 * @property {string} APPS.PARTY_MANAGER.UI.TREASURE_TITLE
 * @property {string} APPS.PARTY_MANAGER.UI.TREASURE_GOLD
 * @property {string} APPS.PARTY_MANAGER.UI.TREASURE_LOOT
 * @property {string} APPS.PARTY_MANAGER.UI.OTHER_ACTORS_TITLE
 * @property {object} SHEETS
 * @property {object} SHEETS.ACTORS
 * @property {object} SHEETS.ACTORS.ANIMAL
 * @property {string} SHEETS.ACTORS.ANIMAL.TITLE
 * @property {object} SHEETS.ACTORS.CHARACTER
 * @property {string} SHEETS.ACTORS.CHARACTER.TITLE
 * @property {object} SHEETS.ACTORS.LANDVEHICLE
 * @property {string} SHEETS.ACTORS.LANDVEHICLE.TITLE
 * @property {object} SHEETS.ACTORS.MONSTER
 * @property {string} SHEETS.ACTORS.MONSTER.TITLE
 * @property {object} SHEETS.ACTORS.RETAINER
 * @property {string} SHEETS.ACTORS.RETAINER.TITLE
 * @property {object} SHEETS.ACTORS.WATERVEHICLE
 * @property {string} SHEETS.ACTORS.WATERVEHICLE.TITLE
 * @property {object} SHEETS.ITEMS
 * @property {object} ATTRIBUTES
 * @property {string} ATTRIBUTES.STR
 * @property {string} ATTRIBUTES.INT
 * @property {string} ATTRIBUTES.WIS
 * @property {string} ATTRIBUTES.CHA
 * @property {string} ATTRIBUTES.DEX
 * @property {string} ATTRIBUTES.CON
 * @property {object} ATTRIBUTES.SHORT
 * @property {string} ATTRIBUTES.SHORT.STR
 * @property {string} ATTRIBUTES.SHORT.INT
 * @property {string} ATTRIBUTES.SHORT.WIS
 * @property {string} ATTRIBUTES.SHORT.CHA
 * @property {string} ATTRIBUTES.SHORT.DEX
 * @property {string} ATTRIBUTES.SHORT.CON
 * @property {object} ATTRIBUTES.FULL
 * @property {string} ATTRIBUTES.FULL.STR
 * @property {string} ATTRIBUTES.FULL.INT
 * @property {string} ATTRIBUTES.FULL.WIS
 * @property {string} ATTRIBUTES.FULL.CHA
 * @property {string} ATTRIBUTES.FULL.DEX
 * @property {string} ATTRIBUTES.FULL.CON
 */

/**
 * @typedef {object} _UOSEClasses
 * @property {{BaseApp: typeof UOSEBaseApp, BaseAppSettings: typeof UOSEBaseAppSettings, BaseDataModel: typeof UOSEBaseDataModel, BaseSettings: typeof UOSEBaseSettings, BaseActorDataModel: typeof UOSEBaseActorDataModel, BaseItemDataModel: typeof UOSEBaseItemDataModel, BaseActorDocument: typeof UOSEBaseActorDocument, BaseItemDocument: typeof UOSEBaseItemDocument, BaseActorSheet: typeof UOSEBaseActorSheet, BaseItemSheet: typeof UOSEBaseItemSheet}} base
 * @property {object} documents
 * @property {{Animal: typeof UOSEAnimalActorDocument, Character: typeof UOSECharacterActorDocument, LandVehicle: typeof UOSELandVehicleActorDocument, Monster: typeof UOSEMonsterActorDocument, Retainer: typeof UOSERetainerActorDocument, WaterVehicle: typeof UOSEWaterVehicleActorDocument}} documents.actors
 * @property {{AdventuringGear: typeof UOSEAdventuringGearItemDocument, Ammunition: typeof UOSEAmmunitionItemDocument, Animal: typeof UOSEAnimalItemDocument, Armor: typeof UOSEArmorItemDocument, Class: typeof UOSEClassItemDocument, Container: typeof UOSEContainerItemDocument, LandVehicle: typeof UOSELandVehicleItemDocument, Poison: typeof UOSEPoisonItemDocument, Race: typeof UOSERaceItemDocument, Service: typeof UOSEServiceItemDocument, Spell: typeof UOSESpellItemDocument, WaterVehicle: typeof UOSEWaterVehicleItemDocument, Weapon: typeof UOSEWeaponItemDocument}} documents.items
 * @property {object} dataModels
 * @property {{Animal: typeof UOSEAnimalActorDataModel, Character: typeof UOSECharacterActorDataModel, LandVehicle: typeof UOSELandVehicleActorDataModel, Monster: typeof UOSEMonsterActorDataModel, Retainer: typeof UOSERetainerActorDataModel, WaterVehicle: typeof UOSEWaterVehicleActorDataModel}} dataModels.actors
 * @property {{AdventuringGear: typeof UOSEAdventuringGearItemDataModel, Ammunition: typeof UOSEAmmunitionItemDataModel, Animal: typeof UOSEAnimalItemDataModel, Armor: typeof UOSEArmorItemDataModel, Class: typeof UOSEClassItemDataModel, Container: typeof UOSEContainerItemDataModel, LandVehicle: typeof UOSELandVehicleItemDataModel, Poison: typeof UOSEPoisonItemDataModel, Race: typeof UOSERaceItemDataModel, Service: typeof UOSEServiceItemDataModel, Spell: typeof UOSESpellItemDataModel, WaterVehicle: typeof UOSEWaterVehicleItemDataModel, Weapon: typeof UOSEWeaponItemDataModel}} dataModels.items
 * @property {object} sheets
 * @property {{Character: typeof UOSECharacterActorSheet, Retainer: typeof UOSERetainerActorSheet}} sheets.actors
 * @property {object} sheets.items
 * @property {{PartyManager: typeof UOSEPartyManagerApp, SettingsEditor: typeof UOSESettingsEditorApp}} apps
 * @property {{Animal: {type: string, document?: typeof UOSEAnimalActorDocument, dataModel?: typeof UOSEAnimalActorDataModel}, Character: {type: string, document?: typeof UOSECharacterActorDocument, dataModel?: typeof UOSECharacterActorDataModel, sheet?: typeof UOSECharacterActorSheet}, LandVehicle: {type: string, document?: typeof UOSELandVehicleActorDocument, dataModel?: typeof UOSELandVehicleActorDataModel}, Monster: {type: string, document?: typeof UOSEMonsterActorDocument, dataModel?: typeof UOSEMonsterActorDataModel}, Retainer: {type: string, document?: typeof UOSERetainerActorDocument, dataModel?: typeof UOSERetainerActorDataModel, sheet?: typeof UOSERetainerActorSheet}, WaterVehicle: {type: string, document?: typeof UOSEWaterVehicleActorDocument, dataModel?: typeof UOSEWaterVehicleActorDataModel}}} actors
 * @property {{AdventuringGear: {type: string, document?: typeof UOSEAdventuringGearItemDocument, dataModel?: typeof UOSEAdventuringGearItemDataModel}, Ammunition: {type: string, document?: typeof UOSEAmmunitionItemDocument, dataModel?: typeof UOSEAmmunitionItemDataModel}, Animal: {type: string, document?: typeof UOSEAnimalItemDocument, dataModel?: typeof UOSEAnimalItemDataModel}, Armor: {type: string, document?: typeof UOSEArmorItemDocument, dataModel?: typeof UOSEArmorItemDataModel}, Class: {type: string, document?: typeof UOSEClassItemDocument, dataModel?: typeof UOSEClassItemDataModel}, Container: {type: string, document?: typeof UOSEContainerItemDocument, dataModel?: typeof UOSEContainerItemDataModel}, LandVehicle: {type: string, document?: typeof UOSELandVehicleItemDocument, dataModel?: typeof UOSELandVehicleItemDataModel}, Poison: {type: string, document?: typeof UOSEPoisonItemDocument, dataModel?: typeof UOSEPoisonItemDataModel}, Race: {type: string, document?: typeof UOSERaceItemDocument, dataModel?: typeof UOSERaceItemDataModel}, Service: {type: string, document?: typeof UOSEServiceItemDocument, dataModel?: typeof UOSEServiceItemDataModel}, Spell: {type: string, document?: typeof UOSESpellItemDocument, dataModel?: typeof UOSESpellItemDataModel}, WaterVehicle: {type: string, document?: typeof UOSEWaterVehicleItemDocument, dataModel?: typeof UOSEWaterVehicleItemDataModel}, Weapon: {type: string, document?: typeof UOSEWeaponItemDocument, dataModel?: typeof UOSEWeaponItemDataModel}}} items
 * @property {{damage: typeof UOSEDamageEffectDataModel}} effects
 * @property {{Actors: typeof UOSEActors, Settings: typeof UOSESettings}} replacements
 */

class _UOSE {
    /** @type {_UOSEClasses} */
    classes;

    /** @type {*} pointer to the Foundry CONFIG object */
    foundryConfig;

    /** @type {*} */
    constants;

    /** @type {typeof UOSEUtils} */
    utils;

    /** @type {UOSESystemSettings} */
    settings;

    /** @type {_UOSELang} */
    lang;

    /** @type {object} name -> instantiated app instance */
    apps;
}

// Best-effort typing of `game.uose` as an expando property of Foundry's `Game`
// class. This only resolves in WebStorm if the separate "Foundry VTT" library
// already declares a global `Game` class - if it does not, this line is inert
// and `game.uose` simply falls back to untyped/`any`.
/** @type {_UOSE} */
// eslint-disable-next-line no-undef
Game.prototype.uose;

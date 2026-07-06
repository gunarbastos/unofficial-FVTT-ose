import {UOSE} from "../foundry/uose.js"

console.log(`Loaded: ${import.meta.url}`);

let _rawConstants = {
    PACKAGE_ID: "unofficial-FVTT-ose",
    PACKAGE_TYPE: "system",
    FOUNDRY: CONST,
}

_rawConstants = {
    ..._rawConstants,
    PACKAGE_ROOT_FOLDER: `${_rawConstants.PACKAGE_TYPE}s/${_rawConstants.PACKAGE_ID}`,

    //Raw Constants
    CORE_ID: "core",

    //sockets
    SOCKETS: {
        ID: `${_rawConstants.PACKAGE_TYPE}.${_rawConstants.PACKAGE_ID}`,
        MESSAGES: {
            REFRESH_PLAYER_SHEET: "REFRESH_PLAYER_SHEET",
        }
    },

    TEMPLATES: {
    },

    ASSETS: {
    },

    //Enums

    //Defaults

    APPS: {
    //     CHARACTER_HUD: {
    //         ID: "dtg.characterHud",
    //         SOCKET_ID: "dtg.characterHud",
    //     },
    //     CHARACTER_MANAGER: {
    //         ID: "dtg.characterManager",
    //         SOCKET_ID: "dtg.characterManager",
    //     },
    //     COMBAT_TRACKER: {
    //         ID: "dtg.combatTracker",
    //         SOCKET_ID: "dtg.combatTracker",
    //     },
    //     DEATH_MOVE_HANDLER: {
    //         ID: "dtg.deathMoveHandler",
    //         SOCKET_ID: "dtg.deathMoveHandler",
    //     },
    //     FEAR_TRACKER: {
    //         ID: "dtg.fearTracker",
    //         SOCKET_ID: "dtg.fearTracker",
    //     },
    //     FEATURE_EDITOR: {
    //         ID: "dtg.featureEditor",
    //         SOCKET_ID: "dtg.featureEditor",
    //     },
    //     PROGRESS_TRACKER: {
    //         ID: "dtg.progressTracker",
    //         SOCKET_ID: "dtg.progressTracker",
    //     },
    //     SETTINGS_MANAGER: {
    //         ID: "dtg.settingsManager",
    //         SOCKET_ID: "dtg.settingsManager",
    //     }
    },
}

//Sheets
// _rawConstants.SHEETS.ACTORS.push({class: AdversarySheet, label: _rawConstants.LANG.ACTOR_TYPES.ADVERSARY, types: [_rawConstants.ACTOR_TYPES.ADVERSARY], default: true});
// _rawConstants.SHEETS.ACTORS.push({class: EnvironmentSheet, label: _rawConstants.LANG.ACTOR_TYPES.ENVIRONMENT, types: [_rawConstants.ACTOR_TYPES.ENVIRONMENT], default: true});
// _rawConstants.SHEETS.ACTORS.push({class: PlayerSheet, label: _rawConstants.LANG.ACTOR_TYPES.PLAYER, types: [_rawConstants.ACTOR_TYPES.PLAYER], default: true});
//
// _rawConstants.SHEETS.ITEMS.push({class: AncestrySheet, label: _rawConstants.LANG.ITEM_TYPES.ANCESTRY, types: [_rawConstants.ITEM_TYPES.ANCESTRY], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: ArmorSheet, label: _rawConstants.LANG.ITEM_TYPES.ARMOR, types: [_rawConstants.ITEM_TYPES.ARMOR], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: ClassSheet, label: _rawConstants.LANG.ITEM_TYPES.CLASS, types: [_rawConstants.ITEM_TYPES.CLASS], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: CommonItemSheet, label: _rawConstants.LANG.ITEM_TYPES.COMMON_ITEM, types: [_rawConstants.ITEM_TYPES.COMMON_ITEM], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: CommunitySheet, label: _rawConstants.LANG.ITEM_TYPES.COMMUNITY, types: [_rawConstants.ITEM_TYPES.COMMUNITY], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: ConsumableSheet, label: _rawConstants.LANG.ITEM_TYPES.CONSUMABLE, types: [_rawConstants.ITEM_TYPES.CONSUMABLE], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: DomainSheet, label: _rawConstants.LANG.ITEM_TYPES.DOMAIN, types: [_rawConstants.ITEM_TYPES.DOMAIN], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: DomainCardSheet, label: _rawConstants.LANG.ITEM_TYPES.DOMAIN_CARD, types: [_rawConstants.ITEM_TYPES.DOMAIN_CARD], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: FeatureSheet, label: _rawConstants.LANG.ITEM_TYPES.FEATURE, types: [_rawConstants.ITEM_TYPES.FEATURE], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: MagicItemSheet, label: _rawConstants.LANG.ITEM_TYPES.MAGIC_ITEM, types: [_rawConstants.ITEM_TYPES.MAGIC_ITEM], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: MateriaSheet, label: _rawConstants.LANG.ITEM_TYPES.MATERIA, types: [_rawConstants.ITEM_TYPES.MATERIA], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: SpellSheet, label: _rawConstants.LANG.ITEM_TYPES.SPELL, types: [_rawConstants.ITEM_TYPES.SPELL], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: SubclassSheet, label: _rawConstants.LANG.ITEM_TYPES.SUBCLASS, types: [_rawConstants.ITEM_TYPES.SUBCLASS], default: true});
// _rawConstants.SHEETS.ITEMS.push({class: WeaponSheet, label: _rawConstants.LANG.ITEM_TYPES.WEAPON, types: [_rawConstants.ITEM_TYPES.WEAPON], default: true});

//Templates to preload
_rawConstants.TEMPLATES.ROOT_DIR = `${_rawConstants.PACKAGE_ROOT_FOLDER}/template`;
//#region Fields
// _rawConstants.TEMPLATES.NUMBER_FIELD = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/numberField.hbs`, PRELOAD: true, ALIAS: "numberField" };
// _rawConstants.TEMPLATES.TEXT_FIELD = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/textField.hbs`, PRELOAD: true, ALIAS: "textField" };
// _rawConstants.TEMPLATES.HTML_FIELD = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/htmlField.hbs`, PRELOAD: true, ALIAS: "htmlField" };
// _rawConstants.TEMPLATES.DESCRIPTION_FIELD = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/descriptionField.hbs`, PRELOAD: true, ALIAS: "descriptionField" };
//#endregion
//#region Buttons
// _rawConstants.TEMPLATES.BTN_ACTIVATE = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnActivate.hbs`, PRELOAD: true, ALIAS: "btnActivate" };
// _rawConstants.TEMPLATES.BTN_ATTACH = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnAttach.hbs`, PRELOAD: true, ALIAS: "btnAttach" };
// _rawConstants.TEMPLATES.BTN_CONSUME = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnConsume.hbs`, PRELOAD: true, ALIAS: "btnConsume" };
// _rawConstants.TEMPLATES.BTN_DELETE = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnDelete.hbs`, PRELOAD: true, ALIAS: "btnDelete" };
// _rawConstants.TEMPLATES.BTN_EQUIP = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnEquip.hbs`, PRELOAD: true, ALIAS: "btnEquip" };
// _rawConstants.TEMPLATES.BTN_OPEN = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnOpen.hbs`, PRELOAD: true, ALIAS: "btnOpen" };
// _rawConstants.TEMPLATES.BTN_HIT_ROLL = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnHitRoll.hbs`, PRELOAD: true, ALIAS: "btnHitRoll" };
// _rawConstants.TEMPLATES.BTN_DMG_ROLL = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnDmgRoll.hbs`, PRELOAD: true, ALIAS: "btnDmgRoll" };
// _rawConstants.TEMPLATES.BTN_SETTINGS = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/btnSettings.hbs`, PRELOAD: true, ALIAS: "btnSettings" };
//#endregion
//#region Chat Messages
// _rawConstants.TEMPLATES.DUALITY_DICE_ROLL = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/chat/dualityDiceRoll.hbs` };
// _rawConstants.TEMPLATES.DUALITY_DICE_ROLL_DETAILS =  { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/chat/partials/dualityDiceRollDetails.hbs`, PRELOAD: true, ALIAS: "dualityDiceRollDetails" };
//#endregion
//#region UI
// _rawConstants.TEMPLATES.COMBAT_TRACKER_ADVERSARY_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/app/dtgCombatTracker/partial/adversary.hbs`, PRELOAD: true, ALIAS: "CTAdversary" };
// _rawConstants.TEMPLATES.COMBAT_TRACKER_PLAYER_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/app/dtgCombatTracker/partial/player.hbs`, PRELOAD: true, ALIAS: "CTPlayer" };
// _rawConstants.TEMPLATES.RULER = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/canvas/ruler-waypoint-label.hbs` };
//#endregion
//#region All Apps
// _rawConstants.TEMPLATES.RESOURCE_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/common/resourceRow.hbs`, PRELOAD: true, ALIAS: "resourceRow" };
//#endregion
//#region Sheets
// _rawConstants.TEMPLATES.SHEET_DOCUMENT_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/documentRow.hbs`, PRELOAD: true, ALIAS: "sheetDocumentRow" };
// _rawConstants.TEMPLATES.SHEET_RESOURCE_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/resourceRow.hbs`, PRELOAD: true, ALIAS: "sheetResourceRow" };
// _rawConstants.TEMPLATES.SHEET_EXPERIENCE_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/experienceRow.hbs`, PRELOAD: true, ALIAS: "sheetExperienceRow" };
// _rawConstants.TEMPLATES.PLAYER_SHEET_TRAIT = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/player/partial/trait.hbs`, PRELOAD: true, ALIAS: "playerSheetTrait" };
// _rawConstants.TEMPLATES.PLAYER_SHEET_BACKPACK_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/player/partial/backpackRow.hbs`};
// _rawConstants.TEMPLATES.PLAYER_SHEET_QUICKACTION_ROW = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/player/partial/actionRow.hbs`, PRELOAD: true, ALIAS: "playerSheetActionRow" };
// _rawConstants.TEMPLATES.SHEET_THRESHOLDS = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/thresholds.hbs`, PRELOAD: true, ALIAS: "sheetThresholds" }
// _rawConstants.TEMPLATES.SHEET_SECTION = { PATH: `${_rawConstants.TEMPLATES.ROOT_DIR}/sheet/common/section.hbs`, PRELOAD: true, ALIAS: "sheetSection" }
//#endregion

//Asset dirs
_rawConstants.ASSETS.ROOT_DIR = `${_rawConstants.PACKAGE_ROOT_FOLDER}/asset`;
_rawConstants.ASSETS.ICON_DIR = `${_rawConstants.ASSETS.ROOT_DIR}/icon`;

export const UOSEConstants = _rawConstants;

UOSE.registerConstants(_rawConstants);
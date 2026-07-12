import {UOSE} from "../foundry/uose.js"

console.log(`Loaded: ${import.meta.url}`);

let _rawConstants = {
    PACKAGE_ID: "unofficial-FVTT-ose",
    SHORT_ID: "uose",
    CSS_ROOT_CLASS: "uose",
    PACKAGE_TYPE: "system",
    VERSION: "0.0.1",
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
        DIR: {},
        PREFIXES: {},
        PARTIALS: [],
    },

    ASSETS: {
        ICONS: {

        },
        ICONLIB: {
            PREFIX: 'fa',
            DEFAULT_STYLE: 'regular',
            UNDEFINED_ICON: 'notdef',
            FAMILY: {
                DUOTONE: 'duotone',
                SHARP: 'sharp',
                SHARP_DUOTONE: 'sharp-duotone',
            },
            STYLES: {
                SOLID: 'solid',
                REGULAR: 'regular',
                LIGHT: 'light',
                THIN: 'thin',
            },
            ROTATE: {
                BY_90: 'rotate-90',
                BY_180: 'rotate-180',
                BY_270: 'rotate-270',
                BY_ANGLE: 'rotate-by',
            },
            TRANSFORM: {
                FLIP_HORIZONTAL: 'flip-horizontal',
                FLIP_VERTICAL: 'flip-vertical',
                FLIP_BOTH: 'flip-both',
            },
            SIZE: {
                XXS: '2xs',
                XS: 'xs',
                SM: 'sm',
                LG: 'lg',
                XL: 'xl',
                XXL: '2xl'
            },
            CSS_VARS: {
                ROTATE_ANGLE: '--fa-rotate-angle',
                PRIMARY_COLOR: '--fa-primary-color',
                SECONDARY_COLOR: '--fa-secondary-color',
            },
        }
    },

    //Enums

    //Defaults
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
_rawConstants.TEMPLATES.DIR.ROOT_DIR = `${_rawConstants.PACKAGE_ROOT_FOLDER}/template`;
_rawConstants.TEMPLATES.DIR.HBSPARTIALS = `${_rawConstants.PACKAGE_ROOT_FOLDER}/template/partials`;
_rawConstants.TEMPLATES.DIR.APPV2PARTS = `${_rawConstants.PACKAGE_ROOT_FOLDER}/template/parts`;
//#region Fields
_rawConstants.TEMPLATES.PARTIALS = [
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/blockButton.hbs`, PRELOAD: true, ALIAS: "bbutton" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/button.hbs`, PRELOAD: true, ALIAS: "button" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/numberField.hbs`, PRELOAD: true, ALIAS: "numberField" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/textField.hbs`, PRELOAD: true, ALIAS: "textField" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/stringField.hbs`, PRELOAD: true, ALIAS: "stringField" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/htmlField.hbs`, PRELOAD: true, ALIAS: "htmlField" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/switchField.hbs`, PRELOAD: true, ALIAS: "switchField" },
    { PATH: `${_rawConstants.TEMPLATES.DIR.HBSPARTIALS}/common/comboField.hbs`, PRELOAD: true, ALIAS: "comboField" },
];

//#endregion
//#region Buttons
// _rawConstants.TEMPLATES.BTN_ACTIVATE = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnActivate.hbs`, PRELOAD: true, ALIAS: "btnActivate" };
// _rawConstants.TEMPLATES.BTN_ATTACH = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnAttach.hbs`, PRELOAD: true, ALIAS: "btnAttach" };
// _rawConstants.TEMPLATES.BTN_CONSUME = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnConsume.hbs`, PRELOAD: true, ALIAS: "btnConsume" };
// _rawConstants.TEMPLATES.BTN_DELETE = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnDelete.hbs`, PRELOAD: true, ALIAS: "btnDelete" };
// _rawConstants.TEMPLATES.BTN_EQUIP = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnEquip.hbs`, PRELOAD: true, ALIAS: "btnEquip" };
// _rawConstants.TEMPLATES.BTN_OPEN = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnOpen.hbs`, PRELOAD: true, ALIAS: "btnOpen" };
// _rawConstants.TEMPLATES.BTN_HIT_ROLL = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnHitRoll.hbs`, PRELOAD: true, ALIAS: "btnHitRoll" };
// _rawConstants.TEMPLATES.BTN_DMG_ROLL = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnDmgRoll.hbs`, PRELOAD: true, ALIAS: "btnDmgRoll" };
// _rawConstants.TEMPLATES.BTN_SETTINGS = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/btnSettings.hbs`, PRELOAD: true, ALIAS: "btnSettings" };
//#endregion
//#region Chat Messages
// _rawConstants.TEMPLATES.DUALITY_DICE_ROLL = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/chat/dualityDiceRoll.hbs` };
// _rawConstants.TEMPLATES.DUALITY_DICE_ROLL_DETAILS =  { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/chat/partials/dualityDiceRollDetails.hbs`, PRELOAD: true, ALIAS: "dualityDiceRollDetails" };
//#endregion
//#region UI
// _rawConstants.TEMPLATES.COMBAT_TRACKER_ADVERSARY_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/app/dtgCombatTracker/partial/adversary.hbs`, PRELOAD: true, ALIAS: "CTAdversary" };
// _rawConstants.TEMPLATES.COMBAT_TRACKER_PLAYER_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/app/dtgCombatTracker/partial/player.hbs`, PRELOAD: true, ALIAS: "CTPlayer" };
// _rawConstants.TEMPLATES.RULER = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/canvas/ruler-waypoint-label.hbs` };
//#endregion
//#region All Apps
// _rawConstants.TEMPLATES.RESOURCE_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/common/resourceRow.hbs`, PRELOAD: true, ALIAS: "resourceRow" };
//#endregion
//#region Sheets
// _rawConstants.TEMPLATES.SHEET_DOCUMENT_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/common/documentRow.hbs`, PRELOAD: true, ALIAS: "sheetDocumentRow" };
// _rawConstants.TEMPLATES.SHEET_RESOURCE_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/common/resourceRow.hbs`, PRELOAD: true, ALIAS: "sheetResourceRow" };
// _rawConstants.TEMPLATES.SHEET_EXPERIENCE_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/common/experienceRow.hbs`, PRELOAD: true, ALIAS: "sheetExperienceRow" };
// _rawConstants.TEMPLATES.PLAYER_SHEET_TRAIT = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/player/partial/trait.hbs`, PRELOAD: true, ALIAS: "playerSheetTrait" };
// _rawConstants.TEMPLATES.PLAYER_SHEET_BACKPACK_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/player/partial/backpackRow.hbs`};
// _rawConstants.TEMPLATES.PLAYER_SHEET_QUICKACTION_ROW = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/player/partial/actionRow.hbs`, PRELOAD: true, ALIAS: "playerSheetActionRow" };
// _rawConstants.TEMPLATES.SHEET_THRESHOLDS = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/common/thresholds.hbs`, PRELOAD: true, ALIAS: "sheetThresholds" }
// _rawConstants.TEMPLATES.SHEET_SECTION = { PATH: `${_rawConstants.TEMPLATES.DIR.ROOT_DIR}/sheet/common/section.hbs`, PRELOAD: true, ALIAS: "sheetSection" }
//#endregion

//Asset dirs
_rawConstants.ASSETS.ROOT_DIR = `${_rawConstants.PACKAGE_ROOT_FOLDER}/asset`;
_rawConstants.ASSETS.ICON_DIR = `${_rawConstants.ASSETS.ROOT_DIR}/icon`;

export const UOSEConstants = _rawConstants;

UOSE.registerConstants(_rawConstants);
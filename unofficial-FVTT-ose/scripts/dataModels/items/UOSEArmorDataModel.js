import {UOSEEmbedEquipableItemDataModel, UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js"; //UOSEEquipableItemDataModel
import {UOSEAbilityDataModel, UOSEArmorClassDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        armorClass: new fields.EmbeddedDataField(UOSEArmorClassDataModel),
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        type: new fields.StringField({required: true, initial: 'armor'}), //Todo: choices
    }
}

export class UOSEArmorDataModel extends UOSEEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}

export class UOSEEmbedArmorDataModel extends UOSEEmbedEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEArmorDataModel);
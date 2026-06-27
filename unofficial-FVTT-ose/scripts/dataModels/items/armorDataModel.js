import {EquipableItemDataModel, EmbedEquipableItemDataModel} from "./equipableItemDataModel.js"; //EquipableItemDataModel
import {AbilityDataModel, ArmorClassDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        armorClass: new fields.EmbeddedDataField(ArmorClassDataModel),
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        type: new fields.StringField({required: true, initial: 'armor'}), //Todo: choices
    }
}

export class ArmorDataModel extends EquipableItemDataModel {

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

export class EmbedArmorDataModel extends EmbedEquipableItemDataModel {

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
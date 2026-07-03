import {UOSEEmbedEquipableItemDataModel, UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js"; //UOSEEquipableItemDataModel
import {UOSEAbilityDataModel, UOSERangeDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        damage: new fields.StringField({required: true, initial: '1d8'}),
        qualities: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
        range: new fields.EmbeddedDataField(UOSERangeDataModel),
        subtype: new fields.StringField({required: true, blank: true}), //todo: figure out choices in this system
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
    }
}

export class UOSEWeaponDataModel extends UOSEEquipableItemDataModel {

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

export class UOSEEmbedWeaponDataModel extends UOSEEmbedEquipableItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEWeaponDataModel);
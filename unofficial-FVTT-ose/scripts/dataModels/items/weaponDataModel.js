import {EquipableItemDataModel, EmbedEquipableItemDataModel} from "./equipableItemDataModel.js"; //EquipableItemDataModel
import {AbilityDataModel, RangeDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        damage: new fields.StringField({required: true, initial: '1d8'}),
        qualities: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
        range: new fields.EmbeddedDataField(RangeDataModel),
        subtype: new fields.StringField({required: true, blank: true}), //todo: figure out choices in this system
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
    }
}

export class WeaponDataModel extends EquipableItemDataModel {

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

export class EmbedWeaponDataModel extends EmbedEquipableItemDataModel {

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
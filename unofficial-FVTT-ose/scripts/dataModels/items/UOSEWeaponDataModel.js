import {UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js"; //UOSEEquipableItemDataModel
import {UOSEAbilityDataModel, UOSERangeDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEWeaponDataModel extends UOSEEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            damage: new fields.StringField({required: true, initial: '1d8'}),
            qualities: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
            range: new fields.EmbeddedDataField(UOSERangeDataModel),
            subtype: new fields.StringField({required: true, blank: true}), //todo: figure out choices in this system
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEWeaponDataModel);
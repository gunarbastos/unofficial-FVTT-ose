import {UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js"; //UOSEEquipableItemDataModel
import {UOSEAbilityDataModel, UOSEArmorClassDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEArmorDataModel extends UOSEEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            armorClass: new fields.EmbeddedDataField(UOSEArmorClassDataModel),
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            type: new fields.StringField({required: true, initial: 'armor'}), //Todo: choices
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEArmorDataModel);
import {UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEEquipableItemDataModel extends UOSEInventoryItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            equipped: new fields.BooleanField({required: true, initial: false}),
            equipableBy: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
        }
    }
}
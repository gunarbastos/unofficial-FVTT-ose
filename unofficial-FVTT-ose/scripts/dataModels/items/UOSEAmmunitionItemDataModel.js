import {UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);


export class UOSEAmmunitionItemDataModel extends UOSEInventoryItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            quantity: new fields.NumberField({required: true, initial: 0}),
            usableBy: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
            embed: new fields.EmbeddedDataField(UOSEEmbedAmmunitionDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

class UOSEEmbedAmmunitionDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            quantityRemaining: new fields.NumberField({required: false, integer: true}),
        }
    }

}

UOSE.registerDataModel(UOSE.item, UOSEAmmunitionItemDataModel);
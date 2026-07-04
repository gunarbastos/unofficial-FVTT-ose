import {UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEMarketItemDataModel extends UOSEBaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            price: new fields.NumberField({required: true, integer: true, min: 1}),
        }
    }
}
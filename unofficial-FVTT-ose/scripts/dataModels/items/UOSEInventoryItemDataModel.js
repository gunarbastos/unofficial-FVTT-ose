import {UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEInventoryItemDataModel extends UOSEMarketItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            weight: new fields.NumberField({integer: true, required: false}),
            storedAtUUID: new fields.DocumentUUIDField({required: false}),
        }
    }
}
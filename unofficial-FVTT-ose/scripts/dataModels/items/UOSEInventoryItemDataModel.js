import {UOSEEmbedMarketItemDataModel, UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        weight: new fields.NumberField({integer: true, required: false}),
        storedAtUUID: new fields.DocumentUUIDField({required: false}),
    }
}

export class UOSEInventoryItemDataModel extends UOSEMarketItemDataModel {

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

export class UOSEEmbedInventoryItemDataModel extends UOSEEmbedMarketItemDataModel {

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
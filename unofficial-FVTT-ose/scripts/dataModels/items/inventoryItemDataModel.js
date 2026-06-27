import {MarketItemDataModel, EmbedMarketItemDataModel} from "./marketItemDataModel.js"; //MarketItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        weight: new fields.NumberField({integer: true, required: false}),
        storedAtUUID: new fields.DocumentUUIDField({required: false}),
    }
}

export class InventoryItemDataModel extends MarketItemDataModel {

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

export class EmbedInventoryItemDataModel extends EmbedMarketItemDataModel {

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
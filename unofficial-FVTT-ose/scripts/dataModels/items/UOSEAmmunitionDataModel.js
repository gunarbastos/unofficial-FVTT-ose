import {UOSEEmbedInventoryItemDataModel, UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        quantity: new fields.NumberField({required: true, initial: 0}),
        usableBy: new fields.ArrayField(new fields.StringField({required: true, blank: true}), {initial: []}), //todo: figure out choices in this system
    }
}

export class UOSEAmmunitionDataModel extends UOSEInventoryItemDataModel {

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

export class UOSEEmbedAmmunitionDataModel extends UOSEEmbedInventoryItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEAmmunitionDataModel);
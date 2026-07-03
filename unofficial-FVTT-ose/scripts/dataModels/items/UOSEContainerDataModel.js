import {UOSEEmbedEquipableItemDataModel, UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        capacity: new fields.NumberField({required: true, integer: true, initial: 0}),
    }
}

export class UOSEContainerDataModel extends UOSEEquipableItemDataModel {

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

export class UOSEEmbedContainerDataModel extends UOSEEmbedEquipableItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEContainerDataModel);
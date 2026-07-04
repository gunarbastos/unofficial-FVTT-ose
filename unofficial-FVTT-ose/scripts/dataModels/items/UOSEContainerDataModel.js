import {UOSEEquipableItemDataModel} from "./UOSEEquipableItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEContainerDataModel extends UOSEEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            capacity: new fields.NumberField({required: true, integer: true, initial: 0}),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEContainerDataModel);
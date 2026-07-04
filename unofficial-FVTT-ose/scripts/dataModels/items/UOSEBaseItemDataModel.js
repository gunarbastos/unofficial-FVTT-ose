import {UOSEBaseDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);


export class UOSEBaseItemDataModel extends UOSEBaseDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            description: new fields.HTMLField({required: false}),
        }
    }
}

UOSE.registerBaseClass(UOSEBaseItemDataModel);
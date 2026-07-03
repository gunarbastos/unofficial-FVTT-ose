import {UOSEEmbedBaseDataModel, UOSEBaseDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;
function _commonAttributes(){
    return {
        description: new fields.HTMLField({required: false}),
    }
}

export class UOSEBaseItemDataModel extends UOSEBaseDataModel {

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

export class UOSEEmbedBaseItemDataModel extends UOSEEmbedBaseDataModel {

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
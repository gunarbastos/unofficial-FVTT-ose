import {BaseDataModel, EmbedBaseDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;
function _commonAttributes(){
    return {
        description: new fields.HTMLField({required: false}),
    }
}

export class BaseItemDataModel extends BaseDataModel {

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

export class EmbedBaseItemDataModel extends EmbedBaseDataModel {

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
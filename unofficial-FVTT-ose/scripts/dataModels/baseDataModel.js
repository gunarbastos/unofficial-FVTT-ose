import {Utils} from "./utils.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;
function _commonAttributes(){
    return {
        automation: new fields.ObjectField({required: true, initial : { enabled: true }}),
    }
}

export class BaseDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        return {
            ..._commonAttributes(),
        }
    }

    _buildCacheMap(setOfUUIDs) {
        const map = new Map();
        for (const uuid of setOfUUIDs)
            map.set(uuid, Utils.getCachedDocument(uuid));
        return map;
    }
}

export class EmbedBaseDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        return {
            ..._commonAttributes(),
        }
    }

    _buildCacheMap(setOfUUIDs) {
        const map = new Map();
        for (const uuid of setOfUUIDs)
            map.set(uuid, Utils.getCachedDocument(uuid));
        return map;
    }
}
import {UOSEUtils} from "../foundry/UOSEUtils.js";
import {UOSE} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;
function _commonAttributes(){
    return {
        automation: new fields.ObjectField({required: true, initial : { enabled: true }}),
    }
}

export class UOSEBaseDataModel extends foundry.abstract.TypeDataModel {

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
            map.set(uuid, UOSEUtils.getCachedDocument(uuid));
        return map;
    }
}

export class UOSEEmbedBaseDataModel extends foundry.abstract.DataModel {

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
            map.set(uuid, UOSEUtils.getCachedDocument(uuid));
        return map;
    }
}

UOSE.registerBaseClass(UOSEBaseDataModel);
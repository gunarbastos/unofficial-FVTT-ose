import {UOSEValueRangeDataModel} from "./UOSEValueRangeDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSERangeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            melee: new fields.EmbeddedDataField(UOSEValueRangeDataModel),
            ranged: new fields.SchemaField({
                short: new fields.EmbeddedDataField(UOSEValueRangeDataModel),
                medium: new fields.EmbeddedDataField(UOSEValueRangeDataModel),
                long: new fields.EmbeddedDataField(UOSEValueRangeDataModel),
            }),
        }
    }

}
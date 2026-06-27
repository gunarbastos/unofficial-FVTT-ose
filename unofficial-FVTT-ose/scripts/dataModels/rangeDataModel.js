import {ValueRangeDataModel} from "../valueRangeDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class RangeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            melee: new fields.EmbeddedDataField(ValueRangeDataModel),
            ranged: new fields.SchemaField({
                short: new fields.EmbeddedDataField(ValueRangeDataModel),
                medium: new fields.EmbeddedDataField(ValueRangeDataModel),
                long: new fields.EmbeddedDataField(ValueRangeDataModel),
            }),
        }
    }

}
console.log(`Loaded: ${import.meta.url}`);

export class UOSEValueRangeDataModel extends foundry.abstract.TypeDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            start: new fields.NumberField({required: false}),
            end: new fields.NumberField({required: false}),
        }
    }

}
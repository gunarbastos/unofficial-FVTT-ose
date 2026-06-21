console.log(`Loaded: ${import.meta.url}`);

export class ArmorClassDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            descending: new fields.NumberField({required: true, integer: true, initial: 9}),
            ascending: new fields.NumberField({required: true, integer: true, initial: 10}),
        }
    }

}
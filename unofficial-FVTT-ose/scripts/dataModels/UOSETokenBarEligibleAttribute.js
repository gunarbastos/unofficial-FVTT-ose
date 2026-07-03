console.log(`Loaded: ${import.meta.url}`);

export class UOSETokenBarEligibleAttribute extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            min: new fields.NumberField({required: true, integer: true, initial: 0}),
            max: new fields.NumberField({required: true, integer: true, initial: 0}),
            value: new fields.NumberField({required: true, integer: true, initial: 0}),
        }
    }

}
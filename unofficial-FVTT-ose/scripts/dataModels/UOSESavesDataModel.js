console.log(`Loaded: ${import.meta.url}`);

export class UOSESavesDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            death: new fields.NumberField({required: true, integer: true, initial: 0}),
            wand: new fields.NumberField({required: true, integer: true, initial: 0}),
            paralysis: new fields.NumberField({required: true, integer: true, initial: 0}),
            breath: new fields.NumberField({required: true, integer: true, initial: 0}),
            spell: new fields.NumberField({required: true, integer: true, initial: 0}),
        }
    }

}
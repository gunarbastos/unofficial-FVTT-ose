console.log(`Loaded: ${import.meta.url}`);

export class UOSEHitDiceDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            formula: new fields.StringField({required: true}),
            average: new fields.NumberField({required: true, integer: true, min: 1}),
            specialAbilities: new fields.NumberField({required: true, min: 0, initial: 0}),
        }
    }

}
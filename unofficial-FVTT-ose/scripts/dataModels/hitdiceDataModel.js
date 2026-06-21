console.log(`Loaded: ${import.meta.url}`);

export class HitDiceDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            formula: fields.StringField({required: true}),
            average: fields.NumberField({required: true, integer: true, min: 1}),
            specialAbilities: fields.NumberField({required: true, min: 0, initial: 0}),
        }
    }

}
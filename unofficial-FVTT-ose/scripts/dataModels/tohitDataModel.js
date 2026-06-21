console.log(`Loaded: ${import.meta.url}`);

export class ToHitDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            thac0: new fields.NumberField({required: true, integer: true, initial: 0}),
            attackBonus: new fields.NumberField({required: true, integer: true, initial: 0}),
        }
    }

}
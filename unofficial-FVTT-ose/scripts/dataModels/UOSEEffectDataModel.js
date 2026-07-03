console.log(`Loaded: ${import.meta.url}`);

export class UOSEEffectDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    static type = 'not_set';

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            internalType: new fields.StringField({required: true, initial: this.type}),
        }
    }

}
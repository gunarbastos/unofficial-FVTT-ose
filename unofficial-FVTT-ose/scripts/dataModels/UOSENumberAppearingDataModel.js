console.log(`Loaded: ${import.meta.url}`);

export class UOSENumberAppearingDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            dungeon: new fields.StringField({required: false}),
            lairOrWilderness: new fields.StringField({required: false}),
        }
    }

}
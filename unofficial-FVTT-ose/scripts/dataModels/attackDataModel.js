console.log(`Loaded: ${import.meta.url}`);

export class AttackDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            useItem: new fields.BooleanField({initial: false}),
            itemUUID: new fields.DocumentUUIDField({required: false}),
            damage: new fields.StringField({required: false}),
            targets: new fields.StringField({required: false}),
            saveAgainst: new fields.StringField({required: false}),
            description: new fields.StringField({required: false}),
        }
    }

}
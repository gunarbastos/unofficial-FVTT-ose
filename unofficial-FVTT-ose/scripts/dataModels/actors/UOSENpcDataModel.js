import {UOSELivingDataModel} from "./UOSELivingDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSENpcDataModel extends UOSELivingDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            morale: new fields.NumberField({required: true, integer: true, initial: 0}),
            xp: new fields.NumberField({required: true, integer: true, initial: 0}),
            attacks: new fields.ArrayField(new fields.ArrayField(new fields.EmbeddedDataField(AtttackDataModel), { initial: [] })),
            // abilities: new fields.ArrayField(new fields.EmbeddedDataField(, {initial: []})) //TODO: Define Ability DataModel
        }
    }
}
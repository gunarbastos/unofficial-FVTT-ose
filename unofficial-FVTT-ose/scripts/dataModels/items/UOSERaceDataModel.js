import {UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";
import {UOSEAbilityDataModel} from "../UOSEAbilityDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSERaceDataModel extends UOSEBaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            requirements: new fields.ArrayField(new fields.SchemaField({
                stat: new fields.StringField({required: true}), //Todo: Choices
                value: new fields.NumberField({required: true, integer: true}),
            }), {initial: []}),
            abilityModifiers: new fields.ArrayField(new fields.SchemaField({
                stat: new fields.StringField({required: true}), //Todo: Choices
                value: new fields.NumberField({required: true, integer: true}),
            }), {initial: []}),
            classes: new fields.ArrayField(new fields.SchemaField({
                name: fields.StringField({required: true}),
                maxLevel: new fields.NumberField({required: true, integer: true}),
            }), {initial: []}),
            languages: new fields.ArrayField(new fields.StringField({required: true})), //Todo: Choices
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            titles: new fields.ArrayField(new fields.StringField({required: true})),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSERaceDataModel);
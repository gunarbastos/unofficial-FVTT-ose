import {UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";
import {UOSEAbilityDataModel, UOSESavesDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEClassDataModel extends UOSEBaseItemDataModel {

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
            prime: new fields.ArrayField(new fields.StringField({required: true})), //Todo: choices
            levels: new fields.ArrayField(new fields.SchemaField({
                level: new fields.NumberField({required: true, integer: true}),
                xp: new fields.NumberField({required: true, integer: true}),
                hitDice: new fields.StringField({required: true}),
                thac0: new fields.SchemaField({
                    table: new fields.NumberField({required: true, integer: true}),
                    bonus: new fields.NumberField({required: true, integer: true}),
                }),
                save: new fields.EmbeddedDataField(UOSESavesDataModel),
                extraSkills: new fields.ArrayField(new fields.SchemaField({
                    name: new fields.StringField({required: true}),
                    value: new fields.NumberField({required: true, integer: true}),
                }), {initial: []}),
            }), {initial: []}),
            proficiencies: new fields.StringField({
                armor: new fields.ArrayField(new fields.SchemaField({
                    tag: new fields.StringField({required: true}),
                    rule: new fields.StringField({required: true}), //Todo: Choices (Include / Exclude)
                }), {initial: []}),
                weapons: new fields.ArrayField(new fields.SchemaField({
                    tag: new fields.StringField({required: true}),
                    rule: new fields.StringField({required: true}), //Todo: Choices (Include / Exclude)
                }), {initial: []}),
            }),
            languages: new fields.ArrayField(new fields.StringField({required: true})), //Todo: Choices
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            titles: new fields.ArrayField(new fields.StringField({required: true})),
            extraSkills: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField({required: true}),
                abbreviation: new fields.StringField({required: true}),
                roll: new fields.StringField({required: true, initial: '1d100'}), //1d100 / 1d6
                comparison: new fields.StringField({required: true}), //todo: choices (above / below)
            }), {initial: []}),
            embed: new fields.EmbeddedDataField(UOSEEmbedClassDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

export class UOSEEmbedClassDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            xp: new fields.NumberField({required: true, integer: true, initial: 0}),
            hpGained: new fields.ArrayField(new fields.SchemaField({
                level: new fields.NumberField({required: true, integer: true}),
                amount: new fields.NumberField({required: true, integer: true}),
            }, {initial: []})),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEClassDataModel);
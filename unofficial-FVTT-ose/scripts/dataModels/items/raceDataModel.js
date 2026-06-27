import {BaseItemDataModel, EmbedBaseItemDataModel} from "./baseItemDataModel.js";
import {SavesDataModel} from "../savesDataModel.js";
import {AbilityDataModel} from "../abilityDataModel.js"; //BaseItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
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
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        titles: new fields.ArrayField(new fields.StringField({required: true})),
    }
}

export class RaceDataModel extends BaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}

export class EmbedRaceDataModel extends EmbedBaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}
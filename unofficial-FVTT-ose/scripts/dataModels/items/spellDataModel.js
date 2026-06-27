import {BaseItemDataModel, EmbedBaseItemDataModel} from "./baseItemDataModel.js";
import {AbilityDataModel} from "../abilityDataModel.js"; //BaseItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        level: new fields.NumberField({required: true, integer: true, initial: 1}),
        spellLists: new fields.ArrayField(new fields.StringField({required: true})), //TODO: Choices
        effects: new fields.SchemaField({
            activation: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            reverse: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        }),
        targets: new fields.StringField({required: false}),
        concentration: new fields.BooleanField({required: true, initial: false}),
    }
}

export class SpellDataModel extends BaseItemDataModel {

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

export class EmbedSpellDataModel extends EmbedBaseItemDataModel {

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
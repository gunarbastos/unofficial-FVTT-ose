import {UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";
import {UOSEAbilityDataModel} from "../UOSEAbilityDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESpellDataModel extends UOSEBaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            level: new fields.NumberField({required: true, integer: true, initial: 1}),
            spellLists: new fields.ArrayField(new fields.StringField({required: true})), //TODO: Choices
            effects: new fields.SchemaField({
                activation: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
                reverse: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            }),
            targets: new fields.StringField({required: false}),
            concentration: new fields.BooleanField({required: true, initial: false}),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSESpellDataModel);
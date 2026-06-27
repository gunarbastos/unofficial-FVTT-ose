import {InventoryItemDataModel, EmbedInventoryItemDataModel} from "./inventoryItemDataModel.js";
import {AbilityDataModel} from "../abilityDataModel.js"; //InventoryItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        saveModifier: new fields.NumberField({required: true, integer: true, initial: 0}),
        chanceOfDetection: new fields.NumberField({required: true, integer: true, initial: 0, min: 0, max: 100}),
        onsetTime: new fields.StringField({required: true, blank: false, initial: 'instant'}), //Todo: review validation for formula or instant
        effects: new fields.SchemaField({
            onSave: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
            onFail: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        }),
        deliveryMethod: new fields.StringField({required: true, blank: false}), //Todo: Default/initial and choices
    }
}

export class PoisonDataModel extends InventoryItemDataModel {

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

export class EmbedPoisonDataModel extends EmbedInventoryItemDataModel {

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
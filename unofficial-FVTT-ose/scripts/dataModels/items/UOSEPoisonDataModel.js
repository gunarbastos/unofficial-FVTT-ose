import {UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";
import {UOSEAbilityDataModel} from "../UOSEAbilityDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEPoisonDataModel extends UOSEInventoryItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            saveModifier: new fields.NumberField({required: true, integer: true, initial: 0}),
            chanceOfDetection: new fields.NumberField({required: true, integer: true, initial: 0, min: 0, max: 100}),
            onsetTime: new fields.StringField({required: true, blank: false, initial: 'instant'}), //Todo: review validation for formula or instant
            effects: new fields.SchemaField({
                onSave: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }),
                onFail: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }),
            }),
            deliveryMethod: new fields.StringField({required: true, blank: false}), //Todo: Default/initial and choices,
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEPoisonDataModel);
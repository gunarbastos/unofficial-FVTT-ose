import {UOSEEmbedMarketItemDataModel, UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js"; //UOSEMarketItemDataModel
import {UOSEMovementDataModel} from "../index.js"
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        subtype: new fields.StringField({required: true}), //todo: choices
        unencumbered: new fields.SchemaField({
            maxLoad: new fields.NumberField({required: true, integer: true}),
            milesPerDay: new fields.NumberField({required: true, integer: true}),
            movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
        }),
        encumbered: new fields.SchemaField({
            maxLoad: new fields.NumberField({required: true, integer: true}),
            milesPerDay: new fields.NumberField({required: true, integer: true}),
            movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
        }),
    }
}

export class UOSEAnimalItemDataModel extends UOSEMarketItemDataModel {

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

export class UOSEEmbedAnimalItemDataModel extends UOSEEmbedMarketItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
            actor: new fields.DocumentUUIDField({required: false}),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEAnimalItemDataModel);
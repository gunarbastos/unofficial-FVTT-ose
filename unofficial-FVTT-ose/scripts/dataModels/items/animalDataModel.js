import {MarketItemDataModel, EmbedMarketItemDataModel} from "./marketItemDataModel.js"; //MarketItemDataModel
import {MovementDataModel} from "../index.js"

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        subtype: new fields.StringField({required: true}), //todo: choices
        unencumbered: new fields.SchemaField({
            maxLoad: new fields.NumberField({required: true, integer: true}),
            milesPerDay: new fields.NumberField({required: true, integer: true}),
            movement: new fields.EmbeddedDataField(MovementDataModel()),
        }),
        encumbered: new fields.SchemaField({
            maxLoad: new fields.NumberField({required: true, integer: true}),
            milesPerDay: new fields.NumberField({required: true, integer: true}),
            movement: new fields.EmbeddedDataField(MovementDataModel()),
        }),
    }
}

export class AnimalDataModel extends MarketItemDataModel {

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

export class EmbedAnimalDataModel extends EmbedMarketItemDataModel {

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
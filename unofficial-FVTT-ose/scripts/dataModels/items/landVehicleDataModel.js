import {MarketItemDataModel, EmbedMarketItemDataModel} from "./marketItemDataModel.js"; //MarketItemDataModel
import {MovementDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        milesPerDay: new fields.NumberField({required: true, integer: true}),
        movement: new fields.EmbeddedDataField(MovementDataModel()),
        minimumAnimals: new fields.SchemaField({
            quantityHorses: new fields.NumberField({required: true, integer: true}),
            quantityMules: new fields.NumberField({required: true, integer: true}),
            maxLoad: new fields.NumberField({required: true, integer: true}),
        }),
        extraAnimals: new fields.SchemaField({
            quantityHorses: new fields.NumberField({required: true, integer: true}),
            quantityMules: new fields.NumberField({required: true, integer: true}),
            maxLoad: new fields.NumberField({required: true, integer: true}),
        }),
    }
}

export class LandVehicleDataModel extends MarketItemDataModel {

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

export class EmbedLandVehicleDataModel extends EmbedMarketItemDataModel {

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
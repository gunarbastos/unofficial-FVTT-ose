import {UOSEEmbedMarketItemDataModel, UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js"; //UOSEMarketItemDataModel
import {UOSEMovementDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        milesPerDay: new fields.NumberField({required: true, integer: true}),
        movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
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

export class UOSELandVehicleItemDataModel extends UOSEMarketItemDataModel {

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

export class UOSEEmbedLandVehicleItemDataModel extends UOSEEmbedMarketItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSELandVehicleItemDataModel);
import {UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js"; //UOSEMarketItemDataModel
import {UOSEMovementDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSELandVehicleItemDataModel extends UOSEMarketItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
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
            embed: new fields.EmbeddedDataField(UOSEEmbedLandVehicleItemDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

export class UOSEEmbedLandVehicleItemDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            actor: new fields.DocumentUUIDField({required: false}),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSELandVehicleItemDataModel);
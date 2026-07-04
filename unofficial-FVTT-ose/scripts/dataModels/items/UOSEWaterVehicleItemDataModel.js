import {UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js";
import {UOSEArmorClassDataModel, UOSEMovementDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);


export class UOSEWaterVehicleItemDataModel extends UOSEMarketItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            cargoCapacity: new fields.NumberField({required: true, integer: true}),
            usage: new fields.StringField({required: true, initial: 'Any'}),
            seaworthy: new fields.BooleanField({required: true, initial: false}),
            dimensions: new fields.SchemaField({
                length: new fields.StringField({required: false}),
                beam: new fields.StringField({required: false}),
                draft: new fields.StringField({required: false}),
            }),
            mayBePilotedByUnskilled: new fields.BooleanField({required: true, initial: false}),
            crew: new fields.SchemaField({
                requiresCaptain: new fields.BooleanField({required: true, initial: false}),
                multiroleCrew: new fields.BooleanField({required: true, initial: false}),
                maximumMercenaries: new fields.NumberField({required: true, initial: 0}),
                oarsmen: new fields.SchemaField({
                    numberRequired: new fields.NumberField({required: true, initial: 1}),
                    milesPerDay: new fields.NumberField({required: true, initial: 1}),
                    movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
                }, {required: false}),
                sailors: new fields.SchemaField({
                    numberRequired: new fields.NumberField({required: true, initial: 1}),
                    milesPerDay: new fields.NumberField({required: true, initial: 1}),
                    movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
                }, {required: false}),
            }),
            hullPoints: new fields.SchemaField({
                min: new fields.NumberField({required: true}),
                max: new fields.NumberField({required: true}),
                perSquare: new fields.BooleanField({required: false}),
            }),
            armorClass: new fields.EmbeddedDataField(UOSEArmorClassDataModel),
            ram: new fields.SchemaField({
                has: new fields.BooleanField({required: true, initial: false}),
                builtIn: new fields.BooleanField({required: true, initial: false}),
            }),
            catapult: new fields.SchemaField({
                has: new fields.BooleanField({required: true, initial: false}),
                max: new fields.NumberField({required: false}),
            }),
            embed: new fields.EmbeddedDataField(UOSEEmbedWaterVehicleItemDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

class UOSEEmbedWaterVehicleItemDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            actor: new fields.DocumentUUIDField({required: false}),
        }
    }
}

UOSE.registerDataModel(UOSE.item, UOSEWaterVehicleItemDataModel);
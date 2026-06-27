import {MarketItemDataModel, EmbedMarketItemDataModel} from "./marketItemDataModel.js";
import {ArmorClassDataModel, MovementDataModel} from "../index.js"; //MarketItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
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
                movement: new fields.EmbeddedDataField(MovementDataModel()),
            }, {required: false}),
            sailors: new fields.SchemaField({
                numberRequired: new fields.NumberField({required: true, initial: 1}),
                milesPerDay: new fields.NumberField({required: true, initial: 1}),
                movement: new fields.EmbeddedDataField(MovementDataModel()),
            }, {required: false}),
        }),
        hullPoints: new fields.SchemaField({
            min: new fields.NumberField({required: true}),
            max: new fields.NumberField({required: true}),
            perSquare: new fields.BooleanField({required: false}),
        }),
        armorClass: new fields.EmbeddedDataField(ArmorClassDataModel),
        ram: new fields.SchemaField({
            has: new fields.BooleanField({required: true, initial: false}),
            builtIn: new fields.BooleanField({required: true, initial: false}),
        }),
        catapult: new fields.SchemaField({
            has: new fields.BooleanField({required: true, initial: false}),
            max: new fields.NumberField({required: false}),
        })
    }
}

export class WaterVehicleDataModel extends MarketItemDataModel {

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

export class EmbedWaterVehicleDataModel extends EmbedMarketItemDataModel {

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
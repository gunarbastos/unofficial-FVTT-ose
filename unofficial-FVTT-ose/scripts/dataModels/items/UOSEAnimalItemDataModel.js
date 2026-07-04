import {UOSEMarketItemDataModel} from "./UOSEMarketItemDataModel.js"; //UOSEMarketItemDataModel
import {UOSEMovementDataModel} from "../index.js"
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAnimalItemDataModel extends UOSEMarketItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
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
            embed: new fields.EmbeddedDataField(UOSEEmbedAnimalItemDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

export class UOSEEmbedAnimalItemDataModel extends foundry.abstract.DataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEAnimalItemDataModel);
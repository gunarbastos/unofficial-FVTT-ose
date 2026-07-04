import {UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEServiceDataModel extends UOSEBaseItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            subtype: new fields.StringField({required: true}), //Todo: choices
            wage: new fields.SchemaField({
                value: new fields.NumberField({required: true, integer: true}),
                frequency: new fields.NumberField({required: true, integer: true, initial: 30}), //In number of days
            }),
            fee: new fields.SchemaField({
                value: new fields.NumberField({required: true, integer: true}),
                frequency: new fields.NumberField({required: true, integer: true, initial: 30}), //In number of days
                fractionalShares: new fields.NumberField({required: false, integer: true}),
            }),
            embed: new fields.EmbeddedDataField(UOSEEmbedServiceDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

export class UOSEEmbedServiceDataModel extends foundry.abstract.DataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEServiceDataModel);
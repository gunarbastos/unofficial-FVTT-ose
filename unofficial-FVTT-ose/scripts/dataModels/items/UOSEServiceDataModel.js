import {UOSEEmbedBaseItemDataModel, UOSEBaseItemDataModel} from "./UOSEBaseItemDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
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
    }
}

export class UOSEServiceDataModel extends UOSEBaseItemDataModel {

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

export class UOSEEmbedServiceDataModel extends UOSEEmbedBaseItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEServiceDataModel);
import {CharacterDataModel} from "./characterDataModel.js"; //characterDataModel

console.log(`Loaded: ${import.meta.url}`);

export class RetainerDataModel extends CharacterDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            loyalty: new fields.NumberField({required: true, integer: true, initial: 0}),
            linkedItemUUID: new fields.DocumentUUIDField({required: true}),
        }
    }

}
import {NpcDataModel} from "./npcDataModel.js"; //npcDataModel

console.log(`Loaded: ${import.meta.url}`);

export class AnimalDataModel extends NpcDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            linkedItemUUID: new fields.DocumentUUIDField({required: true}),
        }
    }

}
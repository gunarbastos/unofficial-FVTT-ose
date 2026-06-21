import {NpcDataModel} from "../npcDataModel.js";
import {NumberAppearingDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

export class MonsterDataModel extends NpcDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            linkedItemUUID: new fields.DocumentUUIDField({required: false}),
            numberAppearing: new fields.EmbeddedDataField(NumberAppearingDataModel),
            treasureType: new fields.StringField({required: false}),
        }
    }
}
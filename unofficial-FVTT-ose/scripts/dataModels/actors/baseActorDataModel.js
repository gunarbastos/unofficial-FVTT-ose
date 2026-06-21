import {BaseDataModel, MovementDataModel, ArmorClassDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

export class BaseActorDataModel extends BaseDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            armorClass: new fields.EmbeddedDataField(ArmorClassDataModel),
            movement: new fields.EmbeddedDataField(MovementDataModel()),
        }
    }
}
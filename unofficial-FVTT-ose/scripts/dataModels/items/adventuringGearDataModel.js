import {InventoryItemDataModel, EmbedInventoryItemDataModel} from "./inventoryItemDataModel.js";
import {AbilityDataModel} from "../abilityDataModel.js"; //InventoryItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        numberOfUses: new fields.NumberField({required: false, integer: true}),
        tags: new fields.ArrayField(new fields.StringField({required: true}), { initial: [] }),
    }
}

export class AdventuringGearDataModel extends InventoryItemDataModel {

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

export class EmbedAdventuringGearDataModel extends EmbedInventoryItemDataModel {

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
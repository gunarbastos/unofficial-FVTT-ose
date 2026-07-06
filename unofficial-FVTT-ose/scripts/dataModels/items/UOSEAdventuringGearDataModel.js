import {UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";
import {UOSEAbilityDataModel} from "../UOSEAbilityDataModel.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAdventuringGearDataModel extends UOSEInventoryItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        const fields = foundry.data.fields;
        return {
            ...base,
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }),
            numberOfUses: new fields.NumberField({required: false, integer: true}),
            tags: new fields.ArrayField(new fields.StringField({required: true}), { initial: [] }),
            embed: new fields.EmbeddedDataField(UOSEEmbedAdventuringGearDataModel, {required: false, nullable: true, initial: null}),
        }
    }
}

class UOSEEmbedAdventuringGearDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            quantityRemaining: new fields.NumberField({required: false, integer: true}),
        }
    }

}

UOSE.registerDataModel(UOSE.item, UOSEAdventuringGearDataModel);
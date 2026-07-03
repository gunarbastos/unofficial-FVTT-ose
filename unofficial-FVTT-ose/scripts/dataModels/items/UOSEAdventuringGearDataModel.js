import {UOSEEmbedInventoryItemDataModel, UOSEInventoryItemDataModel} from "./UOSEInventoryItemDataModel.js";
import {UOSEAbilityDataModel} from "../UOSEAbilityDataModel.js";
import {UOSE} from "../../foundry/index.js"; //UOSEInventoryItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        numberOfUses: new fields.NumberField({required: false, integer: true}),
        tags: new fields.ArrayField(new fields.StringField({required: true}), { initial: [] }),
    }
}

export class UOSEAdventuringGearDataModel extends UOSEInventoryItemDataModel {

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

export class UOSEEmbedAdventuringGearDataModel extends UOSEEmbedInventoryItemDataModel {

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

UOSE.registerDataModel(UOSE.item, UOSEAdventuringGearDataModel);
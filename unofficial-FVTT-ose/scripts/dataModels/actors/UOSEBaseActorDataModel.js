import {UOSEArmorClassDataModel, UOSEBaseDataModel, UOSEMovementDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseActorDataModel extends UOSEBaseDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            armorClass: new fields.EmbeddedDataField(UOSEArmorClassDataModel),
            movement: new fields.EmbeddedDataField(UOSEMovementDataModel()),
        }
    }
}

UOSE.registerBaseClass(UOSEBaseActorDataModel);
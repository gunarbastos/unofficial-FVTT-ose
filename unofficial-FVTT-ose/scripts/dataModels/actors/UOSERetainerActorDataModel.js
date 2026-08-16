import {UOSECharacterActorDataModel} from "./UOSECharacterActorDataModel.js";
import {UOSE} from "../../foundry/index.js"; //characterDataModel

console.log(`Loaded: ${import.meta.url}`);

export class UOSERetainerActorDataModel extends UOSECharacterActorDataModel {

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

UOSE.registerDataModel(UOSE.actor, UOSERetainerActorDataModel);
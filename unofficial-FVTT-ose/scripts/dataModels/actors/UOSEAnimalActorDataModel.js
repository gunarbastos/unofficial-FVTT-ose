import {UOSENpcActorDataModel} from "./UOSENpcActorDataModel.js";
import {UOSE} from "../../foundry/index.js"; //npcDataModel

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAnimalActorDataModel extends UOSENpcActorDataModel {

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

UOSE.registerDataModel(UOSE.actor, UOSEAnimalActorDataModel);
import {UOSENpcActorDataModel} from "./UOSENpcActorDataModel.js";
import {UOSENumberAppearingDataModel} from "../index.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEMonsterActorDataModel extends UOSENpcActorDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            linkedItemUUID: new fields.DocumentUUIDField({required: false}),
            numberAppearing: new fields.EmbeddedDataField(UOSENumberAppearingDataModel),
            treasureType: new fields.StringField({required: false}),
        }
    }
}

UOSE.registerDataModel(UOSE.actor, UOSEMonsterActorDataModel);
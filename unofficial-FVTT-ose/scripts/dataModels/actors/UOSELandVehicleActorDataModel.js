import {UOSE} from "../../foundry/index.js";
import {UOSEBaseActorDataModel} from "./UOSEBaseActorDataModel.js"; //vehicleDataModel

console.log(`Loaded: ${import.meta.url}`);

export class UOSELandVehicleActorDataModel extends UOSEBaseActorDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            //TODO: Define Model
        }
    }

}

UOSE.registerDataModel(UOSE.actor, UOSELandVehicleActorDataModel);
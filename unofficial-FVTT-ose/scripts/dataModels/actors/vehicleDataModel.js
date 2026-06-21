import {BaseActorDataModel} from "./baseActorDataModel.js"; //baseActorDataModel

console.log(`Loaded: ${import.meta.url}`);

export class VehicleDataModel extends BaseActorDataModel {

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
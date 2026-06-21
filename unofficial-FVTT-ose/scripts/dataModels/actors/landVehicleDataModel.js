import {VehicleDataModel} from "./vehicleDataModel.js"; //vehicleDataModel

console.log(`Loaded: ${import.meta.url}`);

export class LandVehicleDataModel extends VehicleDataModel {

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
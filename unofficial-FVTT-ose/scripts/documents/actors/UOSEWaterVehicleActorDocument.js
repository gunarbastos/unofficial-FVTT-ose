import {UOSEBaseActorDocument} from "./UOSEBaseActorDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEWaterVehicleActorDocument extends UOSEBaseActorDocument {

    get defaultPrototypeToken() {
        return {
            actorLink: true,
            disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
            displayBars: CONST.TOKEN_DISPLAY_MODES.CONTROL,
            displayName: CONST.TOKEN_DISPLAY_MODES.CONTROL,
            bar1: {attribute: "hp"}
        };
    }

}

UOSE.registerDocument(UOSE.actor, UOSEWaterVehicleActorDocument);
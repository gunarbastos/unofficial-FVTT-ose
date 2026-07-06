import {UOSEBaseActorDocument} from "./UOSEBaseActorDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class ${NAME} extends UOSEBaseActorDocument {

    get defaultPrototypeToken() {
        return {
            actorLink: ,
            disposition: CONST.TOKEN_DISPOSITIONS.,
            displayBars: CONST.TOKEN_DISPLAY_MODES.,
            displayName: CONST.TOKEN_DISPLAY_MODES.,
            bar1: { attribute: "hp" }
        };
    }

}

UOSE.registerDocument(UOSE.actor, ${NAME});
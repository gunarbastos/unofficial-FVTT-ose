import {UOSEBaseActorDocument} from "./UOSEBaseActorDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEMonsterActorDocument extends UOSEBaseActorDocument {

    get defaultPrototypeToken() {
        return {
            actorLink: false,
            appendNumber: true,
            disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
            displayBars: CONST.TOKEN_DISPLAY_MODES.CONTROL,
            displayName: CONST.TOKEN_DISPLAY_MODES.CONTROL,
            bar1: {attribute: "hp"}
        };
    }

}

UOSE.registerDocument(UOSE.actor, UOSEMonsterActorDocument);
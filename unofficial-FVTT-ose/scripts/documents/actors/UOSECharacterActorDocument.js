import {UOSEBaseActorDocument} from "./UOSEBaseActorDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSECharacterActorDocument extends UOSEBaseActorDocument {

    get defaultPrototypeToken() {
        return {
            actorLink: true,
            disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
            displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
            displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
            bar1: { attribute: "hp" }
        };
    }

    grantXP(amount) {
        game.uose.utils.log('UOSECharacterActorDocument', 'grantXP', amount);
    }

}

UOSE.registerDocument(UOSE.actor, UOSECharacterActorDocument);
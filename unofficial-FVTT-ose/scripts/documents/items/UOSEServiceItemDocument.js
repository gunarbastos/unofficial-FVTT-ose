import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEServiceItemDocument extends UOSEBaseItemDocument {

    static _fillEmbedData(clone) {
        clone.system.embed ??= {
            actor: null
        }
    }

}

UOSE.registerDocument(UOSE.item, UOSEServiceItemDocument);
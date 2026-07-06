import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEServiceItemDocument extends UOSEBaseItemDocument {

    _fillEmbedData(clone) {
        clone.embed ??= {
            actor: null
        }
    }

}

UOSE.registerDocument(UOSE.item, UOSEServiceItemDocument);
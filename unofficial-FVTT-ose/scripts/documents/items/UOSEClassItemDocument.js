import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEClassItemDocument extends UOSEBaseItemDocument {

    _fillEmbedData(clone) {
        clone.embed ??= {
            xp: 0,
            hpGained: []
        }
    }

}

UOSE.registerDocument(UOSE.item, UOSEClassItemDocument);
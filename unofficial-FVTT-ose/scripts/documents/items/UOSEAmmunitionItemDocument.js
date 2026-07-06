import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAmmunitionItemDocument extends UOSEBaseItemDocument {

    _fillEmbedData(clone) {
        clone.embed ??= {
            quantityRemaining: clone.quantity,
        }
    }

}

UOSE.registerDocument(UOSE.item, UOSEAmmunitionItemDocument);
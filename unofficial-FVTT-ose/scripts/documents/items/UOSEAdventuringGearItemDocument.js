import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAdventuringGearItemDocument extends UOSEBaseItemDocument {

    _fillEmbedData(clone) {
        clone.embed ??= {
            quantityRemaining: clone.numberOfUses,
        }
    }

}

UOSE.registerDocument(UOSE.item, UOSEAdventuringGearItemDocument);
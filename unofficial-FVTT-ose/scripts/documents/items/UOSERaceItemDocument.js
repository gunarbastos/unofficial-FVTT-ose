import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSERaceItemDocument extends UOSEBaseItemDocument {

}

UOSE.registerDocument(UOSE.item, UOSERaceItemDocument);
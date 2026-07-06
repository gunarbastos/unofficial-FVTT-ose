import {UOSEBaseItemDocument} from "./UOSEBaseItemDocument.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEArmorItemDocument extends UOSEBaseItemDocument {

}

UOSE.registerDocument(UOSE.item, UOSEArmorItemDocument);
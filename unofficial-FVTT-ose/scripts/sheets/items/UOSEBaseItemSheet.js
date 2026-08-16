import {UOSE, UOSEMixins} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseItemSheet extends UOSEMixins.UOSESheet(foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2)) {


    static get DEFAULT_OPTIONS() {
        return { classes: ['item'] };
    }

}

UOSE.registerBaseClass(UOSEBaseItemSheet);
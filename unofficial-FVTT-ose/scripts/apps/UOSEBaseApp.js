import {UOSE} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseApp extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

}

UOSE.registerBaseClass(UOSEBaseApp);
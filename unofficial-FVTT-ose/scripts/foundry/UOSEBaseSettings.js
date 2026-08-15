import {UOSE} from "./uose.js";
import {TGLBaseSettings} from "./TGLBaseSettings.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseSettings extends TGLBaseSettings {

    register(){
        this._internalRegister(game.uose.constants.PACKAGE_ID);
    }

}

UOSE.registerBaseClass(UOSEBaseSettings);
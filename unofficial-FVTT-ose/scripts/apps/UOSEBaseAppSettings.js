import {UOSE, UOSEBaseSettings} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseAppSettings extends UOSEBaseSettings {

    _buildDefinitions() {
        return {
            isOpened: {scope: 'user', config: false, type: Boolean, default: true},
            position: {scope: 'user', config: false, type: Object, default: {}},
        }
    }

}

UOSE.registerBaseClass(UOSEBaseAppSettings);
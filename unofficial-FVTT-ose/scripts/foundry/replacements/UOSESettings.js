import {UOSE} from "../uose.js";
import {UOSEConstants} from "../../engine/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESettings extends CONFIG.ui.settings {

    static DEFAULT_OPTIONS = {
        window: {
            title: "SIDEBAR.TabSettings"
        },
        actions: {
            openUOSESettings: UOSESettings.#onOpenUOSESettings,
        }
    };

    /** @override */
    static PARTS = {
        settings: {
            template: `${UOSEConstants.TEMPLATES.ROOT_DIR}/parts/ui/settings.hbs`,
            root: true
        }
    };

    static async #onOpenUOSESettings(event) {
        game.uose.apps.settingsEditor.render({force: true});
    }

}

UOSE.registerReplacement(UOSESettings);
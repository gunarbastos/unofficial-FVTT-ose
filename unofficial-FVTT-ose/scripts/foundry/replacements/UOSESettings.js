import {UOSE} from "../uose.js";
import {UOSEConstants} from "../../engine/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESettings extends CONFIG.ui.settings {

    static DEFAULT_OPTIONS = {
        actions: {
            openUOSESettings: UOSESettings.#onOpenUOSESettings,
        }
    };

    static async #onOpenUOSESettings(event) {
        game.uose.apps.settingsEditor.render({force: true});
    }

    async _onRender(context, options) {
        super._onRender(context, options);
        const ourselves = this.element.querySelector("#uoseSettingsAppLauncher");
        if(!ourselves) {
            const sibling = this.element.querySelector('[data-app="configure"]');
            if(!sibling) return;

            const hbsReturn = await foundry.applications.handlebars.renderTemplate(`${game.uose.constants.TEMPLATES.ROOT_DIR}/partials/ui/UOSESettingsButton.hbs`, {
                id: 'uoseSettingsAppLauncher',
                action: 'openUOSESettings',
                style: 'solid',
                icon: 'screwdriver-wrench'
            });

            const button = document.createElement('button');
            sibling.closest('section').insertBefore(button, sibling);
            button.outerHTML = hbsReturn;
            // button.outerHTML = '<button id="uoseSettingsAppLauncher" type="button" data-action="openUOSESettings" style="">\n' +
            //     '        <i class="fa-solid fa-screwdriver-wrench" inert=""></i> UOSE Settings\n' +
            //     '</button>';
        }
    }

}

UOSE.registerReplacement(UOSESettings);
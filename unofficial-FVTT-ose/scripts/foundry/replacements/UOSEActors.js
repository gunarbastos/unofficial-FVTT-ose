import {UOSE} from "../uose.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEActors extends CONFIG.ui.actors {

    static DEFAULT_OPTIONS = {
        actions: {
            openUOSEPartyManager: UOSEActors.#onOpenUOSEPartyManager,
        }
    };

    static async #onOpenUOSEPartyManager(event) {
        game.uose.apps.partyManager.render({force: true});
    }

    async _onRender(context, options) {
        super._onRender(context, options);
        const ourselves = this.element.querySelector("#uosePartyManagerAppLauncher");
        if(!ourselves) {
            const parent = this.element.querySelector('.header-actions');
            if(!parent) return;

            const hbsReturn = await foundry.applications.handlebars.renderTemplate(`${game.uose.constants.TEMPLATES.DIR.ROOT_DIR}/partials/ui/UOSEPartyManagerButton.hbs`, {
                id: 'uosePartyManagerAppLauncher',
                action: 'openUOSEPartyManager',
                style: 'solid',
                icon: 'users'
            });

            const button = document.createElement('button');
            parent.insertBefore(button, parent.firstElementChild);
            button.outerHTML = hbsReturn;
        }
    }

}

UOSE.registerReplacement(UOSEActors);
import {UOSEBaseApp} from "./UOSEBaseApp.js";
import {UOSEPartyManagerSettings} from "./UOSEPartyManagerSettings.js";
import {UOSE} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEPartyManagerApp extends UOSEBaseApp {

    static settingsClass = UOSEPartyManagerSettings;
    static id = "uose-pma";

    static get PARTS() {
        return {
            content: { template: `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/partyManager/main.hbs` },
        };
    }

    // static get PARTIALS() {
    //     const root = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/partyManager`;
    //     return [
    //         {alias: 'sidebar', template: `${root}/sidebar.hbs`},
    //         {alias: 'filter', template: `${root}/filter.hbs`},
    //         {alias: 'hooks', template: `${root}/hooks.hbs`},
    //         {alias: 'overrides', template: `${root}/overrides.hbs`},
    //         {alias: 'optionalRules', template: `${root}/optionalRules.hbs`},
    //         {alias: 'automation', template: `${root}/automation.hbs`},
    //         {alias: 'setting', template: `${root}/setting.hbs`},
    //         {alias: 'settingsSection', template: `${root}/settingsSection.hbs`},
    //     ]
    // }

    static get DEFAULT_OPTIONS() {
        const options = UOSEPartyManagerApp.baseDefaultOptions();
        options.window.title = 'UOSE.APPS.PARTY_MANAGER.TITLE';
        // options.position = {width: '80%', height: '80%', top: '20%', left: '20%' };
        options.tag = 'form';
        return options;
    }

    static async formSubmitHandler(event, form, formData) {
        game.uose.utils.log('UOSEPartyManagerApp', 'formSubmitHandler', formData);
    }

    async _prepareContext(options) {
        const base = await super._prepareContext(options);
        return {
            ...base,
        };
    }

}

UOSE.registerApp(UOSEPartyManagerApp);
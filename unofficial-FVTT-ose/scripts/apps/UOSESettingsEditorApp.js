import {UOSEBaseApp} from "./UOSEBaseApp.js";
import {UOSE} from "../foundry/index.js";
import {UOSESettingsEditorSettings} from "./UOSESettingsEditorSettings.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESettingsEditorApp extends UOSEBaseApp {

    static settingsClass = UOSESettingsEditorSettings;
    static id = "SettingsEditorApp";

    static get PARTS() {
        return {
            content: { template: `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/settingsEditor/main.hbs` },
        };
    }

    static get PARTIALS() {
        const root = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/settingsEditor`;
        return [
            {alias: 'sidebar', template: `${root}/sidebar.hbs`},
            {alias: 'filter', template: `${root}/filter.hbs`},
            {alias: 'hooks', template: `${root}/hooks.hbs`},
            {alias: 'overrides', template: `${root}/overrides.hbs`},
            {alias: 'optionalRules', template: `${root}/optionalRules.hbs`},
            {alias: 'automation', template: `${root}/automation.hbs`},
            {alias: 'setting', template: `${root}/setting.hbs`},
            {alias: 'settingsSection', template: `${root}/settingsSection.hbs`},
        ]
    }

    static get DEFAULT_OPTIONS() {
        const options = UOSESettingsEditorApp.baseDefaultOptions();
        options.window.title = 'UOSE.APPS.SETTINGS_EDITOR.TITLE';
        options.position = {width: '80%', height: '80%', top: '20%', left: '20%' };
        options.tag = 'form';
        return options;
    }

    static async formSubmitHandler(event, form, formData) {
        for(const entry of Object.entries(formData.object)) {
            if(!game.uose.settings.hasOwnProperty(entry[0])) continue;
            if((game.uose.settings._definitions.languages.key === entry[0]) || (game.uose.settings._definitions.alignment.key === entry[0])) {
                const splitValue = entry[1].split(', ');
                let equals = true;
                if(game.uose.settings[entry[0]].length === splitValue.length) {
                    for (let index = 0; index < splitValue.length; index++) {
                        equals = equals && (game.uose.settings[entry[0]][index] === splitValue[index]);
                    }
                }
                if(equals) continue;
                entry[1] = splitValue;
            } else if(game.uose.settings[entry[0]] === entry[1]) continue;
            await game.uose.utils.setGameSetting(game.uose.settings._definitions[entry[0]], entry[1]);
        }
    }

    async _prepareContext(options) {
        const base = await super._prepareContext(options);
        return {
            ...base,
            ICONS: {
                OVERRIDES: 'sliders',
                OPTIONAL: 'clipboard-question',
                AUTOMATION: 'square-binary',
                HOOKS: 'code'
            },
            SETTINGS: game.uose.settings,
        };
    }


}

UOSE.registerApp(UOSESettingsEditorApp);
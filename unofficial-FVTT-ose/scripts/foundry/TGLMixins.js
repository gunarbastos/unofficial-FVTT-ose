import {TGLUtils} from "./TGLUtils.js";
import {TGLBaseSettings} from "./TGLBaseSettings.js";

console.log(`Loaded: ${import.meta.url}`);

export class TGLMixins {

    static SettingsRegistration(BaseClass) {
        return class extends BaseClass {

            static settingsClass = TGLBaseSettings;
            static id = '';
            static useSockets = false;
            static socketId = '';

            /** @type UOSEBaseAppSettings */
            settings = null;

            constructor(...args) {
                super(...args);
                if(this.constructor.settingsClass) {
                    this.settings = new this.constructor.settingsClass();
                    this.settings.register();
                    TGLUtils.deepFreeze(this.settings);
                }
            }

        }
    }

    static OpenCloseStatusPreservation(BaseClass) {
        return class extends BaseClass {

            async _setOpenConfig(show) {
                if(this.settings) {
                    if (this.settings.isOpened && typeof show === 'boolean')
                        await game.uose.utils.setGameSetting(this.settings._definitions.isOpened, show);
                }
            }

            async render({ persistConfigs = true, ...options} = {}, _options={}) {
                if(persistConfigs) await this._setOpenConfig(true);
                return await super.render(options, _options);
            }

            async close({ persistConfigs = true, ...options} = {}) {
                if(persistConfigs) await this._setOpenConfig(false);
                return await super.close(options);
            }

        }
    }

    static RememberPosition(BaseClass) {
        return class extends BaseClass {

            async _setPositionConfig(position) {
                if(this.settings) {
                    if (this.settings.position && position)
                        await game.uose.utils.setGameSetting(this.settings._definitions.position, position);
                }
            }

            _onPosition(position) {
                this._setPositionConfig(position).then(r => null);
                super._onPosition(position);
            }

            async _onFirstRender(context, options) {
                super._onFirstRender(context, options);
                if(this.settings && this.settings.position) {
                    const appPosition = this.settings.position;
                    if (appPosition && typeof appPosition === 'object' && Object.prototype.toString.call(appPosition) === "[object Object]") {
                        this.setPosition(appPosition);
                    }
                }
            }

            async close({ persistConfigs = true, ...options} = {}) {
                if(persistConfigs) await this._setPositionConfig(this.position ?? {});
                return await super.close(options);
            }
        }
    }

    static CaretPositionPreservation(BaseClass) {
        return class extends BaseClass {
            #selection = {
                start: 0,
                end: 0,
                value: '',
                restore: false,
            }

            async _preRender(context, options){
                if(document.activeElement && typeof document.activeElement.selectionStart === "number" && typeof document.activeElement.selectionEnd === "number"){
                    this.#selection.start = document.activeElement.selectionStart;
                    this.#selection.end = document.activeElement.selectionEnd;
                    if(document.activeElement.value && typeof document.activeElement.value === "string")
                        this.#selection.value = document.activeElement.value;
                    else
                        this.#selection.end = undefined;

                    this.#selection.restore = true;
                }
                super._preRender(context, options);
            }

            async _postRender(context, options){
                super._postRender(context, options);
                if(this.#selection.restore === true && document.activeElement){
                    if(typeof document.activeElement.selectionStart === "number" && typeof document.activeElement.selectionEnd === "number"){
                        if(typeof document.activeElement.value === "string" && this.#selection.value) document.activeElement.value = this.#selection.value;
                        document.activeElement.selectionStart = this.#selection.start;
                        document.activeElement.selectionEnd = this.#selection.end;
                    } else if(typeof document.activeElement.select === "function"){
                        document.activeElement.select();
                    }
                }
                this.#selection.restore = false;
            }
        }
    }

    static ShowSettings(BaseClass) {
        return class extends BaseClass {
            static SETTINGS_PART_NAME = "settings";

            static get DEFAULT_OPTIONS() {
                return {
                    actions: {
                        openSettings: this._actionOpenSettings,
                    }
                }
            }

            _configureRenderOptions(options) {
                super._configureRenderOptions(options);

                if(options.parts.includes(this.constructor.SETTINGS_PART_NAME)) options.parts.splice(options.parts.indexOf(this.constructor.SETTINGS_PART_NAME), 1);
            }

            async _preFirstRender(context, options) {
                super._configureRenderOptions(options);

                if(options.parts.includes(this.constructor.SETTINGS_PART_NAME)) options.parts.splice(options.parts.indexOf(this.constructor.SETTINGS_PART_NAME), 1);
            }

            static async _actionOpenSettings(event) {
                if(this.constructor.PARTS && this.constructor.PARTS[this.constructor.SETTINGS_PART_NAME] && this.constructor.PARTS[this.constructor.SETTINGS_PART_NAME].template){
                    await TGLUtils.showSheetPartInDialog(this, this.constructor.SETTINGS_PART_NAME);
                } else {
                    TGLUtils.error('_actionOpenSettings', 'settings not setup propertly for this sheet', this.constructor.SETTINGS_PART_NAME);
                }
            }
        }
    }

    static RegisterPartials(BaseClass) {
        TGLUtils.log('Inserted Mixin', 'RegisterPartials');
        return class extends BaseClass {

            static PARTIALS = undefined;

            constructor(...args) {
                super(...args);
                if(this.constructor.PARTIALS) {
                    TGLUtils.log('loading templates for App');
                    for(const template of Object.values(this.constructor.PARTIALS) ) {
                        if( typeof template !== 'object' || Array.isArray(template)) { continue; }
                        foundry.applications.handlebars.getTemplate(template.template).then( result => {
                            TGLUtils.log('loaded ', template.template);
                            Handlebars.registerPartial(`${game.uose.constants.SHORT_ID}/${this.constructor.id}/${template.alias}`, result);
                            TGLUtils.log(`Alias ${template.alias} created for ${template.template}`);
                        });
                    }
                }
            }

        }
    }

    static MIXINS = {
        SettingsRegistration: 0,
        OpenCloseStatusPreservation: 1,
        RememberPosition: 2,
        CaretPositionPreservation: 3,
        ShowSettings: 4,
        RegisterPartials: 5
    }

    /** @return any */
    static BuildComposedMixins(BaseClass, Mixins = []) {
        let result = BaseClass;
        for (let key of Mixins) {
            switch (key) {
                case 0: result = this.SettingsRegistration(result); break;
                case 1: result = this.OpenCloseStatusPreservation(result); break;
                case 2: result = this.RememberPosition(result); break;
                case 3: result = this.CaretPositionPreservation(result); break;
                case 4: result = this.ShowSettings(result); break;
                case 5: result = this.RegisterPartials(result); break;
            }
        }
        return result;
    }

}
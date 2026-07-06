import {UOSEBaseAppSettings} from "./UOSEBaseAppSettings.js";
import {UOSE, UOSEUtils} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseApp extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

    static settingsClass = UOSEBaseAppSettings;

    /** @type UOSEBaseAppSettings */
    #settings = null;

    static get PARTS() {
        UOSEUtils.log('UOSEBaseApp', this.name, `${game.uose.constants.TEMPLATES.ROOT_DIR}/missing.hbs`);
        return {
            content: { template: `${game.uose.constants.TEMPLATES.ROOT_DIR}/missing.hbs` },
        };
    }

    constructor(...args) {
        super(...args);
        this.#settings = new this.constructor.settingsClass();
        this.#settings.register();
    }

    _onPosition(position) {
        this._setConfigs({position: position}).then(r => null);
        super._onPosition(position);
    }

    static get DEFAULT_OPTIONS() {
        return {
            id: `${game.uose.constants.PACKAGE_ID}-${this.name}`,
            classes: [game.uose.constants.PACKAGE_ID],
            tag: 'div',
            positioned: true,
            window: {
                contentClasses: ['standard-form'],
                frame: true,
                title: 'Missing Title',
                resizable: true,
            },
        };
    }

    get title(){
        return game.uose.utils.localize(this.options.window.title ?? 'Missing Title');
    }

    async _prepareContext(options) {
        const base = await super._prepareContext(options);
        return {
            ...base,
            CONSTANTS: game.uose.constants,
        };
    }

    async _onFirstRender(context, options) {
        super._onFirstRender(context, options);
        if(this.#settings && this.#settings.position) {
            const appPosition = this.#settings.position;
            if (appPosition && typeof appPosition === 'object' && Object.prototype.toString.call(appPosition) === "[object Object]") {
                this.setPosition(appPosition);
            }
        }
    }

    async _setConfigs({show = undefined, position = undefined}){
        if(this.#settings) {
            if (this.#settings.isOpened && typeof show === 'boolean')
                await UOSEUtils.setGameSetting(this.#settings._definitions.isOpened, show);
            if (this.#settings.position && position)
                await UOSEUtils.setGameSetting(this.#settings._definitions.position, position);
        }
    }

    async render({ persistConfigs = true, ...options} = {}, _options={}) {
        if(persistConfigs) await this._setConfigs({show: true});
        return await super.render(options, _options);
    }

    async close({ persistConfigs = true, ...options} = {}) {
        if(persistConfigs) await this._setConfigs({show: false, position: this.position ?? {}});
        return await super.close(options);
    }

    static _isValidSetting(Setting){
        return Setting && typeof Setting === "object" && Setting.hasOwnProperty('id') && typeof Setting.id === 'string';
    }

    async reRenderHeader(){
        await this.render({ window: { controls: true } });
    }

    getControl(action){
        const controls = this.options?.window?.controls ?? [];
        return controls.find(c => c.action === action);
    }
}

UOSE.registerBaseClass(UOSEBaseApp);
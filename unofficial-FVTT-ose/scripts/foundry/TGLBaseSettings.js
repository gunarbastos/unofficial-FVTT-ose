import {TGLUtils} from "./TGLUtils.js";

console.log(`Loaded: ${import.meta.url}`);

export class TGLBaseSettings {

    #definitions;

    get _definitions() {
        if (!this.#definitions) {
            this.#definitions = this._buildDefinitions();
        }
        return this.#definitions;
    }

    _buildDefinitions() {
        return {};
    }

    _namespace = null;

    _internalRegister(packageId){
        for(const [settingKey, settingValue] of Object.entries(this._definitions)) {
            const finalSettingKey = this._namespace ? `${this._namespace}_${settingKey}` : settingKey;
            if(game.settings.settings.has(`${packageId}.${finalSettingKey}`)) continue; //already registered
            TGLUtils.log(this.constructor.name, `Registering Setting`, finalSettingKey);
            settingValue.key = finalSettingKey;
            const hasMethod = typeof this[`${settingKey}OnChange`] === 'function';
            if(hasMethod === true) {
                settingValue.onChange = this[`${settingKey}OnChange`];
            }
            game.settings.register(packageId, finalSettingKey, settingValue);

            Object.defineProperty(this, settingKey, {
                enumerable: true,
                configurable: true,
                get () {
                    return TGLUtils.getGameSetting(packageId, settingValue.key, settingValue.hasOwnProperty('default') ? settingValue.default : undefined);
                }
            });
        }
    }

    register() {}

}
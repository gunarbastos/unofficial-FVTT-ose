import {UOSEUtils} from "./UOSEUtils.js";
// import {UOSEConstants} from "../engine/index.js";
import {UOSE} from "./uose.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseSettings {

    _definitions = {};

    _namespace = null;

    register(){
        for(const [settingKey, settingValue] of Object.entries(this._definitions)) {
            const finalSettingKey = this._namespace ? `${this._namespace}_${settingKey}` : settingKey;
            if(game.settings.settings.has(`${game.uose.constants.PACKAGE_ID}.${finalSettingKey}`)) continue; //already registered
            UOSEUtils.log(this.constructor.name, `Registering Setting`, finalSettingKey);
            settingValue.key = finalSettingKey;
            const hasMethod = typeof this[`${settingKey}OnChange`] === 'function';
            if(hasMethod === true) {
                settingValue.onChange = this[`${settingKey}OnChange`];
            }
            game.settings.register(game.uose.constants.PACKAGE_ID, finalSettingKey, settingValue);

            Object.defineProperty(this, settingKey, {
               enumerable: true,
               configurable: true,
               get () {
                   return game.uose.utils.getGameSetting(settingValue);
               }
            });
        }
    }

}

UOSE.registerBaseClass(UOSEBaseSettings);
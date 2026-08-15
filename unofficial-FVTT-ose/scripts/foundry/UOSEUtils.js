import {UOSE} from "./uose.js"
import {TGLUtils} from "./TGLUtils.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEUtils extends TGLUtils {

    static _logPrefixes = ['UOSE |'];

    static getGameSetting(setting){
        return super.getGameSetting(game.uose.constant.PACKAGE_ID, setting.key, setting.hasOwnProperty('default') ? setting.default : undefined);
    }

    static async setGameSetting(setting, value){
        await super.setGameSetting(game.uose.constants.PACKAGE_ID, setting.key, value);
    }

    static getTemplateUrl(templateUrlFromProjectRoot){
        return `${game.uose.constants.TEMPLATES.DIR.ROOT}/${templateUrlFromProjectRoot}`;
    }

    static createLangObject() {
        const langObject = this.deepClone(game.i18n.translations.UOSE);
        const flatLangObject = foundry.utils.flattenObject({UOSE:langObject});
        for (const flatLangKey of Object.keys(flatLangObject)) {
            const keyParts = flatLangKey.split('.');
            keyParts.shift();
            let objPart = langObject;
            for (let keyIdx = 0; keyIdx <= keyParts.length-2; keyIdx++) {
                objPart = objPart[keyParts[keyIdx]];
            }
            objPart[keyParts[keyParts.length - 1]] = flatLangKey;
        }
        return langObject;
    }

    static getFlag(object, flagKey, defaultValue = undefined) {
        return TGLUtils.getFlag(object, game.uose.constants.PACKAGE_ID, flagKey, defaultValue);
    }

    static async setFlag(object, flagKey, value) {
        await TGLUtils.setFlag(object, game.uose.constants.PACKAGE_ID, flagKey, value);
    }

}

UOSE.publicView().utils = UOSEUtils;
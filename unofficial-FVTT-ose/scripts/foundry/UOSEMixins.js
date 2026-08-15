import {TGLMixins} from "./TGLMixins.js";
import {TGLUtils} from "./TGLUtils.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEMixins {

    static #defaultParts = [
        TGLMixins.MIXINS.CaretPositionPreservation,
        TGLMixins.MIXINS.SettingsRegistration,
        TGLMixins.MIXINS.ShowSettings,
        TGLMixins.MIXINS.RegisterPartials
    ];

    static #UOSECommon(BaseClass, Mixins) {

        return class extends TGLMixins.BuildComposedMixins(BaseClass, Mixins) {

            /*expected format
            * {
            *   flagName: {type: 'user'|'document', default: ''},
            *   flagName: {type: 'user'|'document'}
            * }
            * */
            get _flags() { return {}; }
            #flags = undefined;
            get flags () {
                if(!this.#flags) {
                    this.#flags = {};
                    this._buildFlags();
                    Object.freeze(this.#flags);
                }
                return this.#flags;
            }

            static get DEFAULT_OPTIONS() {
                return {
                    classes: [game.uose.constants.CSS_ROOT_CLASS],
                    tag: 'div',
                    positioned: true,
                    window: {
                        contentClasses: ['standard-form'],
                        frame: true,
                        title: 'Missing Title',
                        resizable: true,
                    },
                    actions: {
                        notYetImplemented: game.uose.utils.actionNotYetImplemented,
                    }
                }
            }

            get title(){
                return game.uose.utils.localize(this.options.window.title ?? 'Missing Title');
            }

            getUserFlag(flag){
                return game.uose.utils.getFlag(game.user, flag.key, flag.default);
            }

            async setUserFlag(flag, value){
                await game.uose.utils.setFlag(game.user, flag.key, value);
            }

            getDocumentFlag(document, flag){
                return game.uose.utils.getFlag(document, flag.key, flag.default);
            }

            async setDocumentFlag(document, flag, value){
                await game.uose.utils.setFlag(document, flag.key, value);
            }

            _getOwnDocument() {
                if(this.document && typeof this.document === "object"){
                    return this.document;
                } else {
                    return undefined;
                }
            }

            getOwnDocumentFlag(flag){
                return this.getDocumentFlag(this._getOwnDocument(), flag)
            }

            async setOwnDocumentFlag(flag, value){
                await this.setDocumentFlag(this._getOwnDocument(), flag, value);
            }

            _buildFlags() {
                for(const [flagKey, flagValue] of Object.entries(this._flags)) {
                    flagValue.key = flagKey;
                    switch(flagValue.type) {
                        case game.uose.constants.FLAG_TYPES.user:
                            Object.defineProperty(this.#flags, flagKey, {
                                enumerable: true,
                                configurable: true,
                                get: () => this.getUserFlag(flagValue)
                            })
                            break;
                        case game.uose.constants.FLAG_TYPES.document:
                            Object.defineProperty(this.#flags, flagKey, {
                                enumerable: true,
                                configurable: true,
                                get: () => this.getOwnDocumentFlag(flagValue)
                            })
                            break;
                        default:
                            game.uose.utils.error(`${flagKey} does not have a valid flag type.`);
                            break;
                    }
                }
            }

            async _prepareContext(options) {
                const base = await super._prepareContext(options);
                return {
                    ...base,
                    CONSTANTS: game.uose.constants,
                    ICL: game.uose.constants.ASSETS.ICONLIB,
                    TEMPLATES: game.uose.constants.TEMPLATES,
                    LANG: game.uose.lang,
                    FLAGS: this.flags,
                };
            }

            async reRenderHeader(){
                await this.render({ window: { controls: true } });
            }

            getControl(action){
                const controls = this.options?.window?.controls ?? [];
                return controls.find(c => c.action === action);
            }
        }
    }

    static UOSESheet(BaseClass) {
        return class extends UOSEMixins.#UOSECommon(BaseClass, [
            ...UOSEMixins.#defaultParts,
        ]) {

            // static FLAG_DEFAULT_VALUES = {}
            //
            //
            // _getFlag(flag){
            //     let value = this.document.getFlag(game.uose.constants.PACKAGE_ID, flag);
            //     if (Utils.isBoxedPrimitive(value)) {
            //         ui.notifications.error(`Flag ${flag} is a boxed primitive.`);
            //         value = undefined;
            //     }
            //     if(!value && this.constructor.FLAG_DEFAULT_VALUES[flag]) value = this.constructor.FLAG_DEFAULT_VALUES[flag];
            //
            //     return value;
            // }
            //
            // async _setFlag(flag, value){
            //     if (Utils.isBoxedPrimitive(value)) {
            //         ui.notifications.error(`Value passed to flag ${flag} is a boxed primitive.`);
            //         return;
            //     }
            //     let finalName = `flags.${game.uose.constants.PACKAGE_ID}.${flag}`;
            //     if(!value){
            //         value = null;
            //         finalName = `flags.${game.uose.constants.PACKAGE_ID}.-=${flag}`;
            //     }
            //     await this.document.update({[finalName]: value}, {render: false});
            // }

        }
    }

    static UOSEApp(AppId, BaseClass) {
        return class extends UOSEMixins.#UOSECommon(BaseClass, [
            ...UOSEMixins.#defaultParts,
            TGLMixins.MIXINS.OpenCloseStatusPreservation,
            TGLMixins.MIXINS.RememberPosition
        ]) {

            static id = AppId;

            static get PARTS() {
                return {
                    content: { template: `${game.uose.constants.TEMPLATES.DIR.ROOT_DIR}/missing.hbs` },
                };
            }

            static get DEFAULT_OPTIONS() {
                return {
                    id: `${game.uose.constants.PACKAGE_ID}-${this.id}`,
                    classes: [this.id],
                    window: {
                        contentClasses: [`${this.id}-window`],
                    },
                    form :{
                        handler: this.formSubmitHandler,
                        submitOnChange: true,
                        closeOnSubmit: false,
                    }
                };
            }

            static async formSubmitHandler(event, form, formData){}

        }
    }
}
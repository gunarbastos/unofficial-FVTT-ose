import {UOSEUtils} from "./UOSEUtils.js";
import {UOSE} from "./uose.js";


console.log(`Loaded: ${import.meta.url}`);

export class UOSEPackageHooks {

    static registerHooks(){
        Hooks.once("init", UOSEPackageHooks.#onInit);
        Hooks.once("ready", UOSEPackageHooks.#onReady);
        //Hooks.on("getSceneControlButtons", UOSEPackageHooks.#getSceneControlButtons);
        Hooks.once("i18nInit", UOSEPackageHooks.#onI18nInit);
    }

    //#region Init Hooks
    static #onInit(){
        UOSEUtils.log(`#onInit`);
        //Internal Setup
        UOSEUtils.log('initializing internal data');

        UOSEUtils.log('defining global objects');
        game.uose = UOSE.publicView();

        // UOSEPackageHooks.#registerCustomChatCommands();

        UOSEUtils.log('defining document classes');
        // Document overrides
        CONFIG.Actor.documentClass = game.uose.classes.base.BaseActorDocument;
        CONFIG.Item.documentClass = game.uose.classes.base.BaseItemDocument;

        UOSEUtils.log('registering data models');
        // Data Model registrations
        Object.assign(CONFIG.Actor.dataModels, game.uose.classes.dataModels.actors);
        Object.assign(CONFIG.Item.dataModels, game.uose.classes.dataModels.items);

        UOSEUtils.log('registering sheets');
        // Sheet registrations
        UOSEPackageHooks.#registerSheets(foundry.documents.collections.Actors, 'ACTORS', Object.values(game.uose.classes.actors));
        UOSEPackageHooks.#registerSheets(foundry.documents.collections.Items, 'ITEMS', Object.values(game.uose.classes.items));

        if(game.uose.settings) game.uose.settings.register();

        UOSEUtils.log(`registering handlebar helpers`);
        UOSEUtils.registerCommonHelpers();

        UOSEUtils.log('preloading templates');
        for(const template of Object.values(game.uose.constants.TEMPLATES.PARTIALS) ) {
            if( typeof template !== 'object' || Array.isArray(template)) { continue; }
            if(template.hasOwnProperty('PRELOAD') && template.PRELOAD === true) {
                foundry.applications.handlebars.getTemplate(template.PATH).then( result => {
                    UOSEUtils.log('preloaded ', template.PATH);
                    if(template.hasOwnProperty('ALIAS')) {
                        Handlebars.registerPartial(`${game.uose.constants.SHORT_ID}/${template.GROUP ? template.GROUP : 'common'}/${template.ALIAS}`, result);
                        UOSEUtils.log(`Alias ${template.ALIAS} created for ${template.PATH}`);
                    }
                });
            }
        }

        game.uose.apps.settingsEditor = new game.uose.classes.apps.SettingsEditor();
        game.uose.apps.partyManager = new game.uose.classes.apps.PartyManager();

        CONFIG.ui.settings = game.uose.classes.replacements.Settings;
        CONFIG.ui.actors = game.uose.classes.replacements.Actors;
        UOSEUtils.log(`#onInit end`);
    }

    static #onI18nInit(){
        UOSEUtils.log(`#onI18nInit`);
        UOSEUtils.log('exposing localization strings');
        game.uose.lang = UOSEUtils.createLangObject();
        UOSEUtils.deepFreeze(game.uose.lang);
        UOSEUtils.log(`#onI18nInit end`);
    }

    static async #onReady(){
        UOSEUtils.log(`#onReady`);

        // UOSEUtils.log('Configuring DTG Tools bar');
        // if(game.dtg.apps.fearTracker.userCanSee()) {
        //     ui.controls.controls.dtg.tools.fearTracker = await UOSEPackageHooks.#getFearTrackerToolsEntry();
        //     if(FearTrackerApp.SETTINGS_NAME.IS_OPENED ? UOSEUtils.getGameSetting(FearTrackerApp.SETTINGS_NAME.IS_OPENED) === true : false)
        //         await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
        // }
        //
        // if(ResourceManagerApp.SETTINGS_NAME.IS_OPENED ? UOSEUtils.getGameSetting(ResourceManagerApp.SETTINGS_NAME.IS_OPENED) === true : true)
        //     await game.dtg.apps.resourceManager.render({persistConfigs: false, force : true});
        //
        // UOSEUtils.log('Setting Socket Hooks');
        // game.socket.on(UOSEConstants.SOCKETS.ID, DtgSockets.socketHandler);
        UOSEUtils.log(`#onReady end`);
    }
    //#endregion

    //#region Auxiliary Functions
    static #registerSettings(){
        UOSEUtils.log(`#registerSettings`);
        for(const setting of Object.values(UOSEConstants.SETTINGS)) {
            UOSEUtils.log(`registering setting`, setting.id);
            const finalSetting = UOSEUtils.deepClone(setting);
            //delete finalSetting.id;
            // if(finalSetting.customType === 'DTGRadioType'){
            //     finalSetting.type = new DTGRadioType({...UOSEUtils.deepClone(setting)});
            // }
            const hasMethod = typeof this[`${setting.id}OnChange`] === 'function';
            if(hasMethod === true) {
                finalSetting.onChange = this[`${setting.id}OnChange`];
            }
            game.settings.register(game.uose.constants.PACKAGE_ID, setting.id, finalSetting);
        }
    }

    // static async FEAR_MAXIMUMOnChange(value){
    //     const currFear = await game.settings.get(UOSEConstants.SYSTEM_ID, UOSEConstants.SETTINGS.FEAR_CURRENT.id);
    //     if(currFear > value){
    //         await UOSEUtils.setGameSetting(UOSEConstants.SETTINGS.FEAR_CURRENT, value);
    //     }
    //
    //     if(game.dtg.apps.fearTracker.rendered){
    //         game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //     }
    // }
    //
    // static async FEAR_CURRENTOnChange(value){
    //     const maxFear = UOSEUtils.getGameSetting(UOSEConstants.SETTINGS.FEAR_MAXIMUM);
    //     if(value > maxFear){
    //         await UOSEUtils.setGameSetting(UOSEConstants.SETTINGS.FEAR_CURRENT, maxFear);
    //     }
    //
    //     if(game.dtg.apps.fearTracker.rendered){
    //         await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //     }
    // }
    //
    // static async FEAR_ASSISTANT_CAN_EDITOnChange(value){
    //     if(game.dtg.apps.fearTracker.rendered){
    //         await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //     }
    // }
    //
    // static async FEAR_PLAYERS_CAN_SEEOnChange(value){
    //     if(game.dtg.apps.fearTracker.userCanSee()){
    //         ui.controls.controls.dtg.tools.fearTracker = await UOSEPackageHooks.#getFearTrackerToolsEntry();
    //
    //         if(game.dtg.apps.fearTracker.rendered){
    //             await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //         }
    //     } else {
    //         if(value === false) {
    //             delete ui.controls.controls.dtg.tools.fearTracker;
    //             if(game.dtg.apps.fearTracker.rendered){
    //                 await game.dtg.apps.fearTracker.close({persistConfigs: false});
    //             }
    //         }
    //         if(value === true){
    //             ui.controls.controls.dtg.tools.fearTracker = await UOSEPackageHooks.#getFearTrackerToolsEntry();
    //             if(UOSEUtils.getGameSetting(UOSEConstants.SETTINGS.FEAR_WINDOW_IS_OPEN)){
    //                 await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //             }
    //         }
    //     }
    //
    //     ui.controls.render();
    // }
    //
    // static async SPOTLIGHTOnChange(value){
    //     ui.combat.render({parts:['spotlight']});
    // }
    //
    // static async SMALL_ICONS_STYLEOnChange(value){
    //     await ui.combat.render({parts:['players', 'adversaries']});
    // }
    //
    // static async MEDIUM_ICONS_STYLEOnChange(value){
    //     if(game.dtg.apps.resourceManager && game.dtg.apps.resourceManager.rendered)
    //         await game.dtg.apps.resourceManager.render({parts:['hp', 'armor', 'stress', 'hope']});
    //     for(const [key, value] of foundry.applications.instances){
    //         for(const actor of UOSEConstants.SHEETS.ACTORS){
    //             if(value instanceof actor.class){
    //                 await value.render();
    //             }
    //         }
    //     }
    // }
    //
    // static async COMBATTRACKER_PLAYERS_SEE_NOT_OWNED_ACTORS_RESOURCES(value){
    //     await ui.combat.render({parts:['players', 'adversaries']});
    // }

    static #registerSheets(collection, documentType, documentList) {
        if(collection.sheetClasses && collection.sheetClasses[game.uose.constants.CORE_ID]){
            for (const sheetId in collection.sheetClasses[game.uose.constants.CORE_ID]) {
                collection.unregisterSheet(game.uose.constants.CORE_ID, collection.sheetClasses[game.uose.constants.CORE_ID][sheetId].cls);
            }
        }

        for(const item of documentList ?? []){
            if(!item.sheet) continue;
            game.uose.utils.log('UOSEPackageHooks', '#registerSheets', 'registering sheet for', documentType, item.type);
            collection.registerSheet(game.uose.constants.SHORT_ID, item.sheet, {
                types: [item.type],
                label: `UOSE.SHEETS.${documentType.toUpperCase()}${!documentType.toLowerCase().endsWith('s') ? 'S' : ''}.${item.type.toUpperCase()}.LABEL`,
                makeDefault: true,
            });
        }
    }
    //#endregion
}
import {Utils} from "./utils.js";
import {CONSTANTS} from "./constants.js";


console.log(`Loaded: ${import.meta.url}`);

export class PackageHooks {

    static registerHooks(){
        Hooks.once("init", PackageHooks.#onInit);
        Hooks.once("ready", PackageHooks.#onReady);
        //Hooks.on("getSceneControlButtons", DTGHooks.#getSceneControlButtons);
        Hooks.once("i18nInit", PackageHooks.#onI18nInit);
    }

    //#region Individual Registrations
    static #registerInitHooks() {

    }

    //#region Init Hooks
    static #onInit(){
        Utils.log(`#onInit`);
        //Internal Setup
        Utils.log('initializing internal data');
        //CONSTANTS.LANG = Utils.createLangObject();
        Utils.deepFreeze(CONSTANTS);

        Utils.log('defining global objects');
        game.uose ??= {
            utils: Utils,
            constants: CONSTANTS,
            documents: {
                //document Class references
            },
            rolls: {
                //roll functions
            },
            apps: {
                //app instances
            },
            settings: {
                //settings with setter and getters to make things easier to access
            }
        };

        // Utils.log('registering Document Classes');
        // game.dtg.documents = {};
        // game.dtg.documents.FeatureDocument = FeatureDocument;
        // game.dtg.documents.InventoryItemDocument = InventoryItemDocument;
        // game.dtg.documents.ClassDocument = ClassDocument;
        // game.dtg.documents.DomainDocument = DomainDocument;
        // game.dtg.documents.DomainCardDocument = DomainCardDocument;
        // game.dtg.documents.SubclassDocument = SubclassDocument;
        // game.dtg.documents.AncestryDocument = AncestryDocument;
        // game.dtg.documents.CommunityDocument = CommunityDocument;
        // game.dtg.documents.SpellDocument = SpellDocument;
        // game.dtg.documents.ArmorDocument = ArmorDocument;
        // game.dtg.documents.WeaponDocument = WeaponDocument;
        // game.dtg.documents.CommonItemDocument = CommonItemDocument;
        // game.dtg.documents.ConsumableDocument = ConsumableDocument;
        // game.dtg.documents.MagicItemDocument = MagicItemDocument;
        // game.dtg.documents.MateriaDocument = MateriaDocument;
        //
        // game.dtg.documents.PlayerDocument = PlayerDocument;
        // game.dtg.documents.AdversaryDocument = AdversaryDocument;
        // game.dtg.documents.EnvironmentDocument = EnvironmentDocument;
        //
        // DTGHooks.#registerCustomChatCommands();
        //
        // // Document overrides
        // CONFIG.Actor.documentClass = DTGActorDocument;
        // CONFIG.Item.documentClass = DTGItemDocument;
        //
        // //Not sure if needed
        // // CONFIG.Actor.DataModel = BaseDataModel;
        // // CONFIG.Item.DataModel = BaseDataModel;
        //
        // Utils.log('registering data models');
        // // Data Model registrations
        // Object.assign(CONFIG.Actor.dataModels, CONSTANTS.DATA_MODELS.ACTORS);
        // Object.assign(CONFIG.Item.dataModels, CONSTANTS.DATA_MODELS.ITEMS);
        //
        // Utils.log('registering sheets');
        // // Sheet registrations
        // const actors = foundry.documents.collections.Actors;
        // const items = foundry.documents.collections.Items;
        //
        // DTGHooks.#registerSheets(actors, CONSTANTS.SHEETS.ACTORS);
        // DTGHooks.#registerSheets(items, CONSTANTS.SHEETS.ITEMS);
        //
        // DTGHooks.#registerSettings();
        //
        // Utils.log(`registering handlebar helpers`);
        // Utils.registerCommonHelpers();
        //
        // Utils.log('preloading templates');
        // for(const template of Object.values(CONSTANTS.TEMPLATES) ) {
        //     if( typeof template !== 'object' || Array.isArray(template)) { continue; }
        //     if(template.hasOwnProperty('PRELOAD') && template.PRELOAD === true) {
        //         foundry.applications.handlebars.getTemplate(template.PATH).then( result => {
        //             Utils.log('preloaded ', template.PATH);
        //             if(template.hasOwnProperty('ALIAS')) {
        //                 Handlebars.registerPartial(template.ALIAS, result);
        //                 Utils.log(`Alias ${template.ALIAS} created for ${template.PATH}`);
        //             }
        //         });
        //     }
        // }
        //
        // game.dtg.apps.fearTracker = new FearTrackerApp();
        // game.dtg.apps.resourceManager = new ResourceManagerApp();
        //
        // CONFIG.ui.combat = DTGCombatTracker;
        // CONFIG.Token.documentClass = DTGTokenDocument;
        // CONFIG.Canvas.rulerClass = DTGRuler;
        // CONFIG.Token.rulerClass = DTGTokenRuler;
        // CONFIG.MeasuredTemplate.objectClass = DTGMeasuredTemplate;
        // CONFIG.ui.controls = DTGSceneControls;
        Utils.log(`#onInit end`);
    }

    static #onI18nInit(){
        Utils.log(`#onI18nInit`);
        Utils.log('exposing localization strings');
        game.uose.lang = Utils.createLangObject();
        Utils.deepFreeze(game.uose.lang);
        Utils.log(`#onI18nInit end`);
    }

    static async #onReady(){
        Utils.log(`#onReady`);

        // Utils.log('Configuring DTG Tools bar');
        // if(game.dtg.apps.fearTracker.userCanSee()) {
        //     ui.controls.controls.dtg.tools.fearTracker = await DTGHooks.#getFearTrackerToolsEntry();
        //     if(FearTrackerApp.SETTINGS_NAME.IS_OPENED ? Utils.getGameSetting(FearTrackerApp.SETTINGS_NAME.IS_OPENED) === true : false)
        //         await game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
        // }
        //
        // if(ResourceManagerApp.SETTINGS_NAME.IS_OPENED ? Utils.getGameSetting(ResourceManagerApp.SETTINGS_NAME.IS_OPENED) === true : true)
        //     await game.dtg.apps.resourceManager.render({persistConfigs: false, force : true});
        //
        // Utils.log('Setting Socket Hooks');
        // game.socket.on(CONSTANTS.SOCKETS.ID, DtgSockets.socketHandler);

        Utils.log(`#onReady end`);
    }
    //#endregion

    //#region Auxiliary Functions
    static #registerSettings(){
        // Utils.log(`#registerSettings`);
        // for(const setting of Object.values(CONSTANTS.SETTINGS)) {
        //     Utils.log(`registering setting`, setting.id);
        //     const finalSetting = Utils.deepClone(setting);
        //     delete finalSetting.id;
        //     if(finalSetting.customType === 'DTGRadioType'){
        //         finalSetting.type = new DTGRadioType({...Utils.deepClone(setting)});
        //     }
        //     const hasMethod = typeof this[`${setting.id}OnChange`] === 'function';
        //     if(hasMethod === true) {
        //         finalSetting.onChange = this[`${setting.id}OnChange`];
        //     }
        //     game.settings.register(CONSTANTS.SYSTEM_ID, setting.id, finalSetting);
        // }
    }

    // static async FEAR_MAXIMUMOnChange(value){
    //     const currFear = await game.settings.get(CONSTANTS.SYSTEM_ID, CONSTANTS.SETTINGS.FEAR_CURRENT.id);
    //     if(currFear > value){
    //         await Utils.setGameSetting(CONSTANTS.SETTINGS.FEAR_CURRENT, value);
    //     }
    //
    //     if(game.dtg.apps.fearTracker.rendered){
    //         game.dtg.apps.fearTracker.render({persistConfigs: false, force : true});
    //     }
    // }
    //
    // static async FEAR_CURRENTOnChange(value){
    //     const maxFear = Utils.getGameSetting(CONSTANTS.SETTINGS.FEAR_MAXIMUM);
    //     if(value > maxFear){
    //         await Utils.setGameSetting(CONSTANTS.SETTINGS.FEAR_CURRENT, maxFear);
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
    //         ui.controls.controls.dtg.tools.fearTracker = await DTGHooks.#getFearTrackerToolsEntry();
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
    //             ui.controls.controls.dtg.tools.fearTracker = await DTGHooks.#getFearTrackerToolsEntry();
    //             if(Utils.getGameSetting(CONSTANTS.SETTINGS.FEAR_WINDOW_IS_OPEN)){
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
    //         for(const actor of CONSTANTS.SHEETS.ACTORS){
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

    static #registerSheets(collection, sheetList) {
        // if(collection.sheetClasses && collection.sheetClasses[CONSTANTS.CORE_ID]){
        //     for (const sheetId in collection.sheetClasses[CONSTANTS.CORE_ID]) {
        //         collection.unregisterSheet(CONSTANTS.CORE_ID, collection.sheetClasses[CONSTANTS.CORE_ID][sheetId].cls);
        //     }
        // }
        // for(const sheet of sheetList ?? []){
        //     collection.registerSheet(CONSTANTS.SYSTEM_ID, sheet.class, {
        //         types: sheet.types,
        //         label: sheet.label.en,
        //         makeDefault: sheet.default,
        //     });
        // }
    }

    static async #getSceneControlButtons(controls = []){
        // if (!game?.user) return;
        //
        // controls[CONSTANTS.SYSTEM_ID] = {
        //     name: CONSTANTS.SYSTEM_ID,
        //     title: CONSTANTS.SYSTEM_ID,
        //     activeTool: 'doNothing',
        //     icon: "fas fa-dragon",
        //     tools: {
        //         resourceManager: {
        //             name: "resourceManager",
        //             title: "Resource Manager",
        //             icon: "fas fa-address-card",
        //             toggle: true,
        //             visible: true,
        //             active: ResourceManagerApp.SETTINGS_NAME.IS_OPENED ? Utils.getGameSetting(ResourceManagerApp.SETTINGS_NAME.IS_OPENED) === true : false,
        //             onChange: (event, active) => {
        //                 Utils.log(`tool`, event, active);
        //                 const app = game.dtg.apps.resourceManager;
        //                 if (active) {
        //                     app.render({force: true}, {});
        //                 } else {
        //                     app.close({});
        //                 }
        //             },
        //             order: 0,
        //         },
        //         rest: {
        //             name: "rest",
        //             title: "rest",
        //             icon: "fas fa-tent",
        //             visible: true,
        //             onChange: (event, active) => {
        //                 Utils.actionNotYetImplemented(event);
        //             },
        //             order: 2,
        //         },
        //         countdownProgress: {
        //             name: "countdownProgress",
        //             title: "countdown / progress",
        //             icon: "fas fa-hourglass-start",
        //             toggle: true,
        //             visible: true,
        //             active: false,
        //             onChange: (event, active) => {
        //                 Utils.actionNotYetImplemented(event);
        //             },
        //             order: 3,
        //         }
        //
        //     },
        //     order: 1,
        //     onChange: (event, active) => {
        //     }
        // };
        // controls[CONSTANTS.SYSTEM_ID].tools.doNothing = {
        //     name: "doNothing",
        //     title: "gambiarra",
        //     icon: "fas fa-empty",
        //     visible: true,
        //     order: 66,
        // };

    }
    //#endregion
}
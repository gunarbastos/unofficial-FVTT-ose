import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseItemDocument extends Item {

    constructor(data, context) {
        super(data, context);

        for(const itemType of Object.values(game.uose.classes.items)){
            if(!itemType || !itemType.dataModel || !itemType.document) continue;
            // if(this.system instanceof itemType.dataModel) Object.setPrototypeOf(this, itemType.document.prototype);
            if(this.system.constructor.name === itemType.dataModel.prototype.constructor.name) {
                Object.setPrototypeOf(this, itemType.document.prototype);
                break;
            }
        }
    }

    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);
        if(this.parent) return;

        this.updateSource({
            ownership: {
                default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
            }
        });
    }

    _updateApps(changed, userId, skipRequester, requesterApp){
        for (const app of Object.values(this.apps)){
            if(!app.rendered) continue;
            if(skipRequester === true && requesterApp && app.id === requesterApp) continue;
            if(typeof app.constructor.requiresRender === 'function'){
                const { requires, options } = app.constructor.requiresRender(changed);
                if(requires === true) app.render(options);
            }
            else
                app.render();
        }
    }

    _onUpdate(changed, options, userId) {
        const skipRequester = options && typeof options === "object" && options.hasOwnProperty('skipRequester') && options.skipRequester === true && userId === game.user.id;
        const requesterApp = options && typeof options === "object" && options.hasOwnProperty('appId') ? options.appId : undefined;
        if(skipRequester === true) options.render = false;
        super._onUpdate(changed, options, userId);

        //re-renders only what is needed if update was not made to re-render all
        if(options.render !== true && options.force !== true && this.apps && typeof this.apps === "object"){
            this._updateApps(changed, userId, skipRequester, requesterApp);
        }
    }

}

UOSE.registerBaseClass(UOSEBaseItemDocument);
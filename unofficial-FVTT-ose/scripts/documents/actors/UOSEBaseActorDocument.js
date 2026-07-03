import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseActorDocument extends Actor {

    constructor(data, context) {
        super(data, context);

        for(const actorType of Object.values(game.uose.classes.actors)){
            if(!actorType || !actorType.dataModel || !actorType.document) continue;
            // if(this.system instanceof actorType.dataModel) Object.setPrototypeOf(this, actorType.document.prototype);
            if(this.system.constructor.name === actorType.dataModel.prototype.constructor.name) {
                Object.setPrototypeOf(this, actorType.document.prototype);
                break;
            }
        }
    }

    async _preCreate(data, options, userId) {
        await super._preCreate(data, options, userId);
        this.updateSource({
            prototypeToken: this.defaultPrototypeToken
        });
    }

    get defaultPrototypeToken(){
        return {};
    }

    async _preUpdate(changes, options, userId) {
        await super._preUpdate(changes, options, userId);

        const newImg = changes?.img;
        if (newImg && !foundry.utils.getProperty(changes, "prototypeToken.texture.src")){ // actor image is changing and is also not set by the user as part of the update
            const oldImg   = this.img ?? "";
            const tokenImg = this.prototypeToken?.texture?.src ?? "";
            const isUnset  = (s) => !s || s === "icons/svg/mystery-man.svg";

            // copy only if token image was blank or mirroring the old actor image
            if (isUnset(tokenImg) || tokenImg === oldImg) {
                foundry.utils.setProperty(changes, "prototypeToken.texture.src", newImg);
            }
        }

        const newName = changes?.name;
        if (newName && !foundry.utils.getProperty(changes, "prototypeToken.name")){ // actor name is changing and is also not set by the user as part of the update
            const oldName   = this.name ?? "";
            const tokenName = this.prototypeToken?.name ?? "";

            // copy only if token name was blank or mirroring the old actor name
            if (tokenName === '' || tokenName === oldName) {
                foundry.utils.setProperty(changes, "prototypeToken.name", newName);
            }
        }
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

    _onCreateDescendantDocuments(parent, collection, documents, data, options, userId){
        if(parent !== this) return null;
        this._updateApps({'items': {operation: 'create', documents: documents} }, userId,  false, undefined);
    }

    _onDeleteDescendantDocuments(parent, collection, documents, ids, options, userId){
        if(parent !== this) return null;
        this._updateApps({'items': {operation: 'delete', ids: ids}}, userId,  false, undefined);
    }

    _onUpdateDescendantDocuments(parent, collection, documents, changes, options, userId){
        if(parent !== this) return null;
        this._updateApps({'items': {operation: 'update', documents: documents}}, userId,  false, undefined);
    }

}

UOSE.registerBaseClass(UOSEBaseActorDocument)
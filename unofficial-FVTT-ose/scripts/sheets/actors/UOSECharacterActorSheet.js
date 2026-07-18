import {UOSEBaseActorSheet} from "./UOSEBaseActorSheet.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSECharacterActorSheet extends UOSEBaseActorSheet {

    static get PARTS() {
        const baseFolder = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/actors`

        return {
            //TODO: fill parts
        };
    }

    static get DEFAULT_OPTIONS() {
        return {
            classes: [game.uose.classes.actors.Character.type],
            position: {width: 1200, height: 1200},
            actions: {
                //TODO: define actions
            },
            window: { title: 'UOSE.SHEETS.ACTORS.CHARACTER.TITLE' },
        };
    }

    static get PARTIALS() {
        const root = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/actors/Character`;
        return [
            //TODO: define partials
            //{alias: 'sidebar', template: `${root}/sidebar.hbs`},
        ]
    }

    // async _onRender(context, options) {
    //     await super._onRender(context, options);
    //     game.uose.utils.log(this.constructor.name, '_onRender', this._dragDrop);
    // }

}

UOSE.registerSheet(UOSE.actor, UOSECharacterActorSheet);
#set($TYPE = $NAME.substring(4, $NAME.length() - 10))
import {UOSEBaseActorSheet} from "./UOSEBaseActorSheet.js";
import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class ${NAME} extends UOSEBaseActorSheet {

    static get PARTS() {
        const baseFolder = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/actors/${TYPE}`

        return {
            //TODO: fill parts
        };
    }

    static get DEFAULT_OPTIONS() {
        return {
            classes: [game.uose.classes.actors.${TYPE}.type],
            position: {width: 1200, height: 1200},
            actions: {
                //TODO: define actions
            },
            window: { title: 'UOSE.SHEETS.ACTORS.${TYPE.toUpperCase()}.TITLE' },
        };
    }

    static get PARTIALS() {
        const root = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/actors/${TYPE}`;
        return [
            //TODO: define partials
            //{alias: 'sidebar', template: `\${root}/sidebar.hbs`},
        ]
    }

}

UOSE.registerSheet(UOSE.actor, ${NAME});
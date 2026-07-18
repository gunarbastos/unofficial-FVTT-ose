import {UOSE} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {

    static get PARTS() {
        const baseFolder = game.uose.constants.TEMPLATES.DIR.ROOT_DIR

        return {
            content: { template: `${baseFolder}/base.hbs` },
            debug: { template: `${baseFolder}/debug.hbs` },
        };
    }

    static get DEFAULT_OPTIONS() {
        return {
            classes: [game.uose.constants.SHORT_ID, 'actor'],
        };
    }

    async _onDropItem(event, item){
        game.uose.utils.log(this.constructor.name, '_onDropItem', event, item, this);
        if(item instanceof game.uose.classes.documents.items.Service) {
            const fd = await foundry.applications.api.DialogV2.input({
                window: { title: "Name the Retainer" },
                content: `<label>Retainer Name</label><input name="retainerName" type="text" value="${this.document.name}'s retainer" autofocus required>`,
                ok: { label: "Hire Retainer" },
                modal: true // blocks interaction with the rest of the UI until resolved
            });

            // fd is null if the user cancels/closes the dialog
            if (!fd || !fd.retainerName?.trim()) {
                ui.notifications.warn("Retainer creation cancelled — no name provided.");
                return;
            }

            const data = item.toObject();
            game.uose.classes.documents.items.Service._fillEmbedData(data);
            const retainerActor = await foundry.documents.Actor.implementation.create({
                name: fd.retainerName.trim(),
                type: game.uose.classes.actors.Retainer.type,
                ownership: game.uose.utils.deepClone(this.ownership),
            });
            data.system.embed.actor = retainerActor.uuid;
            //await item.update({'system.embed.actor': retainerActor.uuid});
            delete data._id;

            const [created] = await this.document.createEmbeddedDocuments("Item", [data], { render: false });
            game.uose.utils.log(this.constructor.name, '_onDropItem', 'created', data, created);
            return created;
        }
    }

}

UOSE.registerBaseClass(UOSEBaseActorSheet);
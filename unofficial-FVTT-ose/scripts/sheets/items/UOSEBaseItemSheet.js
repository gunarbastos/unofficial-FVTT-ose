import {UOSE, UOSEMixins} from "../../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEBaseItemSheet extends UOSEMixins.UOSESheet(foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2)) {

    static _hasSpecific = undefined;

    static get PARTS() {
        const baseFolder = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/items/`;
        let specific = {}
        if(this._hasSpecific){ specific = {specific: { template: this.SPECIFIC_PATH }} }
        return {
            ...specific,
            base: { template: `${game.uose.constants.TEMPLATES.DIR.ROOT_DIR}/base.hbs` },
            debug: { template: `${game.uose.constants.TEMPLATES.DIR.ROOT_DIR}/debug.hbs` },
        }
    }

    static get DEFAULT_OPTIONS() {
        return { classes: ['item'] };
    }

    async templateExists(path) {
        if (!path) return false;
        try { await foundry.applications.handlebars.getTemplate(path); return true; }  // compiles & caches
        catch { return false; }
    }

    static get SPECIFIC_PATH() {
        let doctype = this.DOCTYPE ?? "";
        if(!(doctype === "")) {
            doctype = doctype.charAt(0).toLowerCase() + doctype.slice(1);
        }
        return `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/sheets/items/${doctype}.hbs`;
    }

    async render(opts = {}) {
        if (this.constructor._hasSpecific === undefined) {
            const specPath = this.constructor.SPECIFIC_PATH;
            this.constructor._hasSpecific = await this.templateExists(specPath);
        }
        return super.render(opts);
    }

    _configureRenderOptions(options) {
        super._configureRenderOptions(options);
        options.parts = ["base"];
        if (this.constructor._hasSpecific) {options.parts.push("specific");}
        if(game.user && game.user.isGM) {
            options.parts.push("debug");
        }
    }

}

UOSE.registerBaseClass(UOSEBaseItemSheet);
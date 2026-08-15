import {UOSEBaseApp} from "./UOSEBaseApp.js";
import {UOSEPartyManagerSettings} from "./UOSEPartyManagerSettings.js";
import {UOSE, UOSEMixins} from "../foundry/index.js";

console.log(`Loaded: ${import.meta.url}`);

/**
 * @typedef {UOSEBaseApp} UOSEPartyManagerApp
 * @property {UOSEPartyManagerSettings} settings
 */
export class UOSEPartyManagerApp extends UOSEMixins.UOSEApp("uose-pma", UOSEBaseApp) {

    static settingsClass = UOSEPartyManagerSettings;

    //#region AppUI
    static get PARTS() {
        return {
            content: { template: `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/partyManager/main.hbs` },
        };
    }

    // static get PARTIALS() {
    //     const root = `${game.uose.constants.TEMPLATES.DIR.APPV2PARTS}/apps/partyManager`;
    //     return [
    //         {alias: 'sidebar', template: `${root}/sidebar.hbs`},
    //         {alias: 'filter', template: `${root}/filter.hbs`},
    //         {alias: 'hooks', template: `${root}/hooks.hbs`},
    //         {alias: 'overrides', template: `${root}/overrides.hbs`},
    //         {alias: 'optionalRules', template: `${root}/optionalRules.hbs`},
    //         {alias: 'automation', template: `${root}/automation.hbs`},
    //         {alias: 'setting', template: `${root}/setting.hbs`},
    //         {alias: 'settingsSection', template: `${root}/settingsSection.hbs`},
    //     ]
    // }

    static get DEFAULT_OPTIONS() {
        return {
            tag: 'form'
        }
    }

    get title(){
        return game.uose.utils.localize(game.uose.lang.APPS.PARTY_MANAGER.TITLE);
    }

    static async formSubmitHandler(event, form, formData) {
        game.uose.utils.log('UOSEPartyManagerApp', 'formSubmitHandler', formData);
    }

    async _prepareContext(options) {
        const base = await super._prepareContext(options);
        const expeditionMembers = game.uose.apps.partyManager.settings.expeditionMembers;
        const partyMembers = game.uose.classes.apps.PartyManager.getPartyMembers().map(
            member => { return {...member, expedition: expeditionMembers.some(uuid => uuid === member.actor.uuid)}}
        );
        return {
            ...base,
            members: partyMembers,
            treasure: game.uose.apps.partyManager.settings.treasure
        };
    }
    //#endregion

    //#region API
    static #classifyActor(actor) {
        if (actor instanceof game.uose.classes.actors.Character.document) return 'character';
        if (actor instanceof game.uose.classes.actors.Retainer.document) return 'retainer';
        return 'npc';
    }

    static #shareFromFractionalShares(fractionalShares) {
        if (typeof fractionalShares !== 'number') return 0;
        return fractionalShares / 100;
    }

    /**
     * @returns {Array<{actor: Actor, type: 'character'|'retainer'|'npc', description?: string, wage?: object, fee?: object}>}
     */
    static getPartyMembers() {
        const manualMembers = game.uose.apps.partyManager.settings.manualMembers;
        const members = new Map(); // uuid -> frozen entry

        const addEntry = (actorDoc, extra = undefined) => {
            if (!actorDoc || members.has(actorDoc.uuid)) return;
            members.set(actorDoc.uuid, Object.freeze({
                actor: actorDoc,
                type: UOSEPartyManagerApp.#classifyActor(actorDoc),
                ...(extra ?? {}),
            }));
        };

        // 1) Controlled Characters (covers GM logged in as player via user.character)
        const playerActors = game.actors.filter(
            act =>
                act.type === game.uose.classes.actors.Character.type
                && (
                    Object.entries(act.ownership).map(
                        it =>
                            game.users.get(it[0])
                            && !game.users.get(it[0]).isGM
                            && it[1] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
                    ).some(Boolean)
                )
        );

        for (const character of playerActors) addEntry(character);

        // 2) Actors linked via Service items owned by the Characters above
        for (const character of playerActors) {
            for (const item of character.serviceItems) {
                const linkedUuid = item.system?.embed?.actor;
                if (!linkedUuid) continue;
                const linkedActor = game.uose.utils.getCachedDocument(linkedUuid);
                if (!linkedActor) continue;
                addEntry(linkedActor, {
                    description: undefined, // Service.system.description intentionally not surfaced here
                    wage: item.system.wage ? game.uose.utils.deepClone(item.system.wage) : undefined,
                    fee: item.system.fee ? game.uose.utils.deepClone(item.system.fee) : undefined,
                });
            }
        }

        // 3) DM-added manual members
        for (const entry of manualMembers) {
            const actorDoc = game.uose.utils.getCachedDocument(entry.actor);
            if (!actorDoc) continue;
            addEntry(actorDoc, {
                description: entry.observations || undefined,
                wage: entry.wage ? game.uose.utils.deepClone(entry.wage) : undefined,
                fee: entry.fee ? game.uose.utils.deepClone(entry.fee) : undefined,
            });
        }

        return [...members.values()];
    }

    static async giveXP(amount) {
        if (game.uose.settings.treasureShareXp) return; // handled via gold/loot distribution instead

        const expeditionMembers = game.uose.apps.partyManager.settings.expeditionMembers;
        const activeMembers = UOSEPartyManagerApp.getPartyMembers()
            .filter(m => expeditionMembers.includes(m.actor.uuid));
        if (!activeMembers.length) return;

        const perMemberSplit = Math.floor(amount / activeMembers.length);

        for (const member of activeMembers) {
            if (member.type === 'character') {
                await member.actor.grantXP(perMemberSplit);
            } else if (member.type === 'retainer') {
                await member.actor.grantXP(Math.floor(perMemberSplit / 2));
            }
            // npc: no XP
        }
    }

    static async addGold(amount) {
        const treasure = game.uose.utils.deepClone(game.uose.apps.partyManager.settings.treasure);
        treasure.gold += amount;
        await game.uose.utils.setGameSetting(game.uose.apps.partyManager.settings._definitions.treasure, treasure);
    }

    static async addLoot(item) {
        const treasure = game.uose.utils.deepClone(game.uose.apps.partyManager.settings.treasure);
        const embedData = typeof item.produceEmbedData === 'function' ? item.produceEmbedData() : game.uose.utils.deepClone(item);
        embedData._id = foundry.utils.randomID(); // our own stable ref for later giveLoot() lookups
        treasure.items.push(embedData);
        await game.uose.utils.setGameSetting(game.uose.apps.partyManager.settings._definitions.treasure, treasure);
    }

    static async giveLoot(actor, item) {
        const treasure = game.uose.utils.deepClone(game.uose.apps.partyManager.settings.treasure);
        const itemId = typeof item === 'string' ? item : item._id;
        const idx = treasure.items.findIndex(i => i._id === itemId);
        if (idx === -1) return;
        const [treasureItem] = treasure.items.splice(idx, 1);

        const type = UOSEPartyManagerApp.#classifyActor(actor);
        if (type === 'character' || type === 'retainer') {
            const toCreate = {...treasureItem};
            delete toCreate._id; // let Foundry assign a real one on the actor
            await actor.createEmbeddedDocuments('Item', [toCreate]);
        } else {
            treasure.ledger.push({
                id: foundry.utils.randomID(),
                timestamp: Date.now(),
                actor: actor.uuid,
                kind: 'item',
                item: treasureItem,
            });
        }
        await game.uose.utils.setGameSetting(game.uose.apps.partyManager.settings._definitions.treasure, treasure);
    }

    static async giveGold(actor, amount) {
        const treasure = game.uose.utils.deepClone(game.uose.apps.partyManager.settings.treasure);
        if (treasure.gold < amount) {
            game.uose.utils.warn('UOSEPartyManagerApp', 'giveGold', `Insufficient treasure gold (${treasure.gold}) for requested amount ${amount}`, {showUiNotification: true});
            return;
        }
        treasure.gold -= amount;

        const type = UOSEPartyManagerApp.#classifyActor(actor);
        if (type === 'character') {
            await actor.update({'system.currency': (actor.system.currency ?? 0) + amount});
        } else {
            treasure.ledger.push({
                id: foundry.utils.randomID(),
                timestamp: Date.now(),
                actor: actor.uuid,
                kind: 'gold',
                amount: amount,
            });
        }
        await game.uose.utils.setGameSetting(game.uose.apps.partyManager.settings._definitions.treasure, treasure);

        if (game.uose.settings.treasureShareXp && (type === 'character' || type === 'retainer')) {
            await actor.grantXP(amount);
        }
    }

    /**
     * @returns {Record<string, number>} actor UUID -> split gold amount
     */
    static getDefaultSplits(amount) {
        const manualMembers = game.uose.apps.partyManager.settings.manualMembers;
        const expeditionMembers = game.uose.apps.partyManager.settings.expeditionMembers;
        const activeMembers = UOSEPartyManagerApp.getPartyMembers()
            .filter(m => expeditionMembers.includes(m.actor.uuid));

        const manualByUuid = game.uose.utils.arrayToMap(manualMembers, 'actor');

        const shares = activeMembers.map(member => {
            let share;
            if (member.type === 'character') {
                share = 1;
            } else if (member.type === 'retainer') {
                share = UOSEPartyManagerApp.#shareFromFractionalShares(member.fee?.fractionalShares);
            } else {
                const manualEntry = manualByUuid.get(member.actor.uuid);
                share = UOSEPartyManagerApp.#shareFromFractionalShares(manualEntry?.fee?.fractionalShares);
            }
            return {uuid: member.actor.uuid, share};
        });

        const totalShares = shares.reduce((sum, s) => sum + s.share, 0);
        const result = {};
        if (totalShares <= 0) return result;

        for (const {uuid, share} of shares) {
            result[uuid] = Math.floor(amount * (share / totalShares));
        }
        return result;
    }

    static async addMember(actor, {observations, wage, fee} = {}) {
        const uuid = typeof actor === 'string' ? actor : actor.uuid;
        const manualMembers = game.uose.utils.deepClone(game.uose.apps.partyManager.settings.manualMembers);

        if (manualMembers.some(entry => entry.actor === uuid)) return; // already a manual member

        manualMembers.push({
            actor: uuid,
            observations: observations ?? '',
            wage: wage ?? null,
            fee: fee ?? null,
        });

        await game.uose.utils.setGameSetting(game.uose.apps.partyManager.settings._definitions.manualMembers, manualMembers);
    }
    //#endregion

}

UOSE.registerApp(UOSEPartyManagerApp);
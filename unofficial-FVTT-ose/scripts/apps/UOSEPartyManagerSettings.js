import {UOSEBaseAppSettings} from "./UOSEBaseAppSettings.js";

console.log(`Loaded: ${import.meta.url}`);

/**
 * @typedef {Object} UOSEPartyManagerSettingsMember
 * @property {string} actor
 * @property {string} observations
 * @property {{value: number, frequency: number}} wage
 * @property {{value: number, frequency: number, fractionalShares: number}} fee
 */

/**
 * @typedef {Object} UOSEPartyManagerSettingsTreasureLedger
 * @prop {string} id
 * @prop {number} timestamp
 * @prop {string} actor
 * @prop {string} kind
 * @prop {number} amount
 * @prop {Object} item
 */

/**
 * @typedef {Object} UOSEPartyManagerSettingsTreasure
 * @property {number} gold
 * @property {Array[Object]} items
 * @property {Array[UOSEPartyManagerSettingsTreasureLedger]} ledger
 */

/**
 * @typedef {UOSEBaseAppSettings} UOSEPartyManagerSettings
 * @property {Array[UOSEPartyManagerSettingsMember]} manualMembers
 * @property {Array[string]} expeditionMembers
 * @property {UOSEPartyManagerSettingsTreasure} treasure
 */
export class UOSEPartyManagerSettings extends UOSEBaseAppSettings {

    _namespace = `PartyManager`

    _buildDefinitions() {
        const fields = foundry.data.fields;

        return {
            ...super._buildDefinitions(),
            manualMembers: {
                scope: 'world',
                config: false,
                type: new fields.ArrayField(new fields.SchemaField({
                    actor: new fields.DocumentUUIDField({required: true, nullable: false}),
                    observations: new fields.StringField({required: false, blank: true, initial: ''}),
                    wage: new fields.SchemaField({
                        value: new fields.NumberField({required: true, integer: true}),
                        frequency: new fields.NumberField({required: true, integer: true, initial: 30}), //In number of days
                    }, {required: false, nullable: true, initial: null}),
                    fee: new fields.SchemaField({
                        value: new fields.NumberField({required: true, integer: true}),
                        frequency: new fields.NumberField({required: true, integer: true, initial: 30}), //In number of days
                        fractionalShares: new fields.NumberField({required: false, integer: true}),
                    }, {required: false, nullable: true, initial: null}),
                })),
                default: [],
            },
            expeditionMembers: {
                scope: 'world',
                config: false,
                type: Array,
                default: [],
            },
            treasure: {
                scope: 'world',
                config: false,
                type: new fields.SchemaField({
                    gold: new fields.NumberField({required: true, integer: true, min: 0, initial: 0}),
                    items: new fields.ArrayField(new fields.ObjectField()), // full embedded Item data, not yet owned by anyone
                    ledger: new fields.ArrayField(new fields.SchemaField({
                        id: new fields.StringField({required: true, blank: false}),
                        timestamp: new fields.NumberField({required: true, integer: true}),
                        actor: new fields.DocumentUUIDField({required: true, nullable: false}), // npc/retainer who received it
                        kind: new fields.StringField({required: true, choices: ['gold', 'item']}),
                        amount: new fields.NumberField({required: false, integer: true}), // gold entries
                        item: new fields.ObjectField({required: false}), // full item snapshot, item entries — needed to restore to treasure on undo
                    })),
                }),
                default: {gold: 0, items: [], ledger: []},
            },
        };
    }

}
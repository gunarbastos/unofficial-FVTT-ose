import {LivingDataModel} from "./livingDataModel.js";
import {MovementDataModel} from "../movementDataModel.js"; //livingDataModel

console.log(`Loaded: ${import.meta.url}`);

export class CharacterDataModel extends LivingDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            attributes: fields.SchemaField({
                str: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
                int: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
                wis: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
                dex: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
                con: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
                cha: new fields.NumberField({required: true, integer: true, initial: 0, min: 3, max: 18}),
            }),
            xp: fields.SchemaField({
                total: new fields.NumberField({required: true, integer: true, initial: 0}),
                unassigned: new fields.NumberField({required: true, integer: true, initial: 0}),
                assignLog: new fields.ArrayField(new fields.StringField({required: true}), {initial: []}),
            }),
            movement: new fields.EmbeddedDataField(MovementDataModel({extras:[{name: 'overland', initial: 0}, {name: 'exploration', initial: 0}]})),
            languages: new fields.ArrayField(new fields.StringField({required: true}), {initial: []}),
            skills: new fields.SchemaField({
                forage: new fields.NumberField({required: true, integer: true, initial: 1}),
                findTrap: new fields.NumberField({required: true, integer: true, initial: 1}),
                hunt: new fields.NumberField({required: true, integer: true, initial: 1}),
                listenAtDoor: new fields.NumberField({required: true, integer: true, initial: 1}),
                openStuckDoor: new fields.NumberField({required: true, integer: true, initial: 1}),
                findSecretDoor: new fields.NumberField({required: true, integer: true, initial: 1}),
                secondary: new fields.ArrayField(new fields.StringField({required: true}), {initial: []}),
            }),
            titles: new fields.ArrayField(new fields.SchemaField({
                title: new fields.StringField({required: true}),
                origin: new fields.StringField({required: true}),
            }), {initial: []}),
        }
    }

}
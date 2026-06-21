import {EffectDataModel} from "..effectDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class DamageEffectDataModel extends EffectDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    static type = 'damage';

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            internalType: new fields.StringField({required: true, initial: this.type}),
            formula: new fields.StringField({required: true, initial: '', blank: true}),
            when: new fields.StringField({required: true, initial: 'immediate'}), //immediate|round
            duration: new fields.StringField({required: false}),
        }
    }

}
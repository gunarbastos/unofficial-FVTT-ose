import {UOSEEffectDataModel} from "../UOSEEffectDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSEDamageEffectDataModel extends UOSEEffectDataModel {

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
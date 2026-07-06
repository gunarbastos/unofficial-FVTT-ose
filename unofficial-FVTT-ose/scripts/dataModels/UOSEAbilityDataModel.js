import {TGLPolymorphicEmbeddedField} from "./TGLPolymorphicDataType.js"
import {UOSEEffectDataModel} from "./UOSEEffectDataModel.js"
import {UOSEDamageEffectDataModel} from "./effects/index.js"

console.log(`Loaded: ${import.meta.url}`);

export class UOSEAbilityDataModel extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            level: new fields.NumberField({required: false, integer: true}),
            description: new fields.StringField({required: false}),
            effects: new fields.ArrayField(/** @type any*/ new TGLPolymorphicEmbeddedField(
                UOSEEffectDataModel,
                {
                    [UOSEDamageEffectDataModel.type]: UOSEDamageEffectDataModel,
                },
                {}), {initial: []}), //Todo: Define each Effect Type, and the required Base and Map info, hopefully without need for UOSEConstants
        }
    }

}
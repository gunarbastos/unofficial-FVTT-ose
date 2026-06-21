import {EffectDataModel} from "..effectDataModel.js";

console.log(`Loaded: ${import.meta.url}`);

export class ${NAME.substring(0,1).toUpperCase()}${NAME.substring(1)} extends EffectDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;
    
    #set($TypeName = $NAME.replaceFirst("EffectDataModel$", ""))
    static type = '${TypeName.substring(0,1).toLowerCase()}${TypeName.substring(1)}'; 

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            internalType: new fields.StringField({required: true, initial: this.type}),
            //TODO: Define Model
        }
    }
    
}
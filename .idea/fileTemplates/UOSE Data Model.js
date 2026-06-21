import {${Extends_From.substring(0,1).toUpperCase()}${Extends_From.substring(1)}} from "./${Extends_From.substring(0,1).toLowerCase()}${Extends_From.substring(1)}.js"; //${Extends_From}

console.log(`Loaded: ${import.meta.url}`);

export class ${NAME.substring(0,1).toUpperCase()}${NAME.substring(1)} extends ${Extends_From.substring(0,1).toUpperCase()}${Extends_From.substring(1)} {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            //TODO: Define Model
        }
    }
    
}
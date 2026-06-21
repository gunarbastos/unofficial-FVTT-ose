console.log(`Loaded: ${import.meta.url}`);

export class ${NAME.substring(0,1).toUpperCase()}${NAME.substring(1)} extends foundry.abstract.DataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @type any */
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            //TODO: Define Model
        }
    }

}
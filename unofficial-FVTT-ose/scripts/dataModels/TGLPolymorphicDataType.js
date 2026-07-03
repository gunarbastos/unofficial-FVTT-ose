console.log(`Loaded: ${import.meta.url}`);

export class TGLPolymorphicEmbeddedField extends foundry.data.fields.EmbeddedDataField {
    constructor(base, mapping, options = {}) {
        super(base, options);
        this.mapping = mapping;
    }

    /** Override initialize to pick the right class */
    initialize(value, model, options={}) {
        const ModelClass = this.mapping[value.internalType] || this.type;
        return super.initialize(value, ModelClass, options);
    }
}
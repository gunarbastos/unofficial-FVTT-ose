console.log(`Loaded: ${import.meta.url}`);

export function MovementDataModel({ extras = [] } = {}) {
    return class extends foundry.abstract.DataModel {
        /** @inheritDoc */
        static _enableV10Validation = true;

        /** @inheritDoc */
        static defineSchema() {
            const fields = foundry.data.fields;
            const result = {
                base: new fields.NumberField({required: true, integer: true, initial: 120}),
                encounter: new fields.NumberField({required: true, integer: true, initial: 40}),
            };
            for (const field of extras) {
                result[field.name] = new fields.NumberField({required: true, integer: true, initial: field.initial});
            }
            return result;
        }
    }
};
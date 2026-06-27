import {EquipableItemDataModel, EmbedEquipableItemDataModel} from "./equipableItemDataModel.js"; //EquipableItemDataModel

console.log(`Loaded: ${import.meta.url}`);

const fields = foundry.data.fields;

function _commonAttributes() {
    return {
        capacity: new fields.NumberField({required: true, integer: true, initial: 0}),
    }
}

export class ContainerDataModel extends EquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}

export class EmbedContainerDataModel extends EmbedEquipableItemDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const base = super.defineSchema();
        return {
            ...base,
            ..._commonAttributes(),
        }
    }
}
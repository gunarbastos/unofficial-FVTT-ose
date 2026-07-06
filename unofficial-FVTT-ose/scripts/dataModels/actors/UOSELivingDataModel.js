import {UOSEBaseActorDataModel} from "./UOSEBaseActorDataModel.js";
import {UOSEAbilityDataModel, UOSEHitDiceDataModel, UOSESavesDataModel, UOSEToHitDataModel, UOSETokenBarEligibleAttribute} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSELivingDataModel extends UOSEBaseActorDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            toHit: new fields.EmbeddedDataField(UOSEToHitDataModel),
            hp: new fields.EmbeddedDataField(UOSETokenBarEligibleAttribute),
            hd: new fields.EmbeddedDataField(UOSEHitDiceDataModel),
            alignment: new fields.StringField({required: false}), //TODO: Define if I'm going to use choices for this one or not.
            saves: new fields.EmbeddedDataField(UOSESavesDataModel),
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(UOSEAbilityDataModel), { initial: [] }),
        }
    }
}
import {BaseActorDataModel} from "./baseActorDataModel.js";
import {HitDiceDataModel, SavesDataModel, ToHitDataModel, AbilityDataModel} from "../index.js";

console.log(`Loaded: ${import.meta.url}`);

export class LivingDataModel extends BaseActorDataModel {

    /** @inheritDoc */
    static _enableV10Validation = true;

    /** @inheritDoc */
    static defineSchema() {
        const fields = foundry.data.fields;
        const base = super.defineSchema();
        return {
            ...base,
            toHit: new fields.EmbeddedDataField(ToHitDataModel),
            hp: new fields.EmbeddedDataField(TokenBarEligibleAttribute),
            hd: new fields.EmbeddedDataField(HitDiceDataModel),
            alignment: new fields.StringField({required: false}), //TODO: Define if I'm going to use choices for this one or not.
            saves: new fields.EmbeddedDataField(SavesDataModel),
            abilities: new fields.ArrayField(new fields.EmbeddedDataField(AbilityDataModel), { initial: [] }), //Todo: define abilities thingy
        }
    }
}
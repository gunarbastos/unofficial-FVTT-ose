import {UOSEBaseSettings} from "./UOSEBaseSettings.js";
import {UOSE} from "./uose.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESystemSettings extends UOSEBaseSettings {

    _definitions = {
        //CUSTOMIZABLE ASPECTS
        languages: {scope: 'world', config: false, type: Array, default: ['Common', 'Lawful', 'Neutral', 'Evil', 'Bugbear', 'Doppelganger', 'Dragon', 'Dwarvish', 'Elvish', 'Gargoyle', 'Gnoll', 'Gnomish', 'Goblin', 'Halfling', 'Harpy', 'Hobgoblin',
                'Kobold', 'Lizard Man', 'Medusa', 'Minotaur', 'Ogre', 'Orcish', 'Pixie', 'Human dialect', 'Druidic', 'Deepcommon', 'Secret language of spiders', 'Languague of creatures of Sylvan forests', 'Secret language of burrowing mammals', 'Language of earth elementals']},
        alignment: {scope: 'world', config: false, type: Array, default: ['Lawful', 'Neutral', 'Evil']},

        //OPTIONAL RULES
        advancedCharacterCreation: {scope: 'world', config: false, type: Boolean, default: false},
        multiclass: {scope: 'world', config: false, type: Boolean, default: false},
        individualInitiative: {scope: 'world', config: false, type: Boolean, default: false},
        ascendingAC: {scope: 'world', config: false, type: Boolean, default: false},
        attackRollUsingThac0: {scope: 'world', config: false, type: Boolean, default: false},
        morale: {scope: 'world', config: false, type: Boolean, default: false},
        encumbrance: {scope: 'world', config: false, type: String, options: [{value:'Disabled'}, {value:'Basic'}, {value:'Detailed'}, {value:'Item',description:'Item Based'}], default: 'Disabled'},
        addStrToItemBasedEncumbrance: {scope: 'world', config: false, type: Boolean, default: false},
        returningFromDeath: {scope: 'world', config: false, type: Boolean, default: false},
        reload: {scope: 'world', config: false, type: Boolean, default: false},
        damagePerWeapon: {scope: 'world', config: false, type: Boolean, default: false},
        secondarySkill: {scope: 'world', config: false, type: Boolean, default: false},
        weaponProficiency: {scope: 'world', config: false, type: Boolean, default: false},
        reroll1And2On1stLevelHD: {scope: 'world', config: false, type: Boolean, default: false},
        allowIllusionistToWieldStaves: {scope: 'world', config: false, type: Boolean, default: false},
        allowMagicUsersToWieldStaves: {scope: 'world', config: false, type: Boolean, default: false},
        ignoreRaceClassRestrictions: {scope: 'world', config: false, type: Boolean, default: false},
        ignoreRaceMaxLevelRestriction: {scope: 'world', config: false, type: Boolean, default: false},
        limitTurnUndead: {scope: 'world', config: false, type: Boolean, default: false},
        advancedSpellBook: {scope: 'world', config: false, type: Boolean, default: false},
        variableWindConditions: {scope: 'world', config: false, type: Boolean, default: false},
        attackingWithTwoWeapons: {scope: 'world', config: false, type: Boolean, default: false},
        chargingIntoMelee: {scope: 'world', config: false, type: Boolean, default: false},
        invulnerabilities: {scope: 'world', config: false, type: Boolean, default: false},
        missileAttacksOnTargetsInMelee: {scope: 'world', config: false, type: Boolean, default: false},
        parrying: {scope: 'world', config: false, type: Boolean, default: false},
        splashWeapons: {scope: 'world', config: false, type: Boolean, default: false},
        subduing: {scope: 'world', config: false, type: Boolean, default: false},
        thiefD6Skills: {scope: 'world', config: false, type: Boolean, default: false},
        combatTalents: {scope: 'world', config: false, type: Boolean, default: false},
        treasureShareXp: {scope: 'world', config: false, type: Boolean, default: false},
        cantrips: {scope: 'world', config: false, type: Boolean, default: false},
        specialMaterials: {scope: 'world', config: false, type: Boolean, default: false},
    }

}

UOSE.registerSettings(new UOSESystemSettings());

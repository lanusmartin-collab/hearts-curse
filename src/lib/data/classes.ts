
export interface ClassData {
    id: string;
    name: string;
    hp: number; // Hit Die size (e.g. 10 for d10)
    saves: string[];
    proficiencies: string[];
    traits: string[];
    spellcasting?: {
        ability: "int" | "wis" | "cha";
        type: "prepared" | "known"; // Wizard/Cleric vs Bard/Sorc
        cantripsKnown: number; // At Level 20
        spellsKnown?: number; // For 'known' casters
        slots: { [level: number]: number }; // Lvl 20 Slots
    };
}

// Standard 5e Slot Progression for Full Casters at Lvl 20
const FULL_CASTER_SLOTS = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 };
const HALF_CASTER_SLOTS = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 }; // Paladin/Ranger roughly

export const CLASSES: ClassData[] = [
    {
        id: "barbarian", name: "Barbarian", hp: 12,
        saves: ["Strength", "Constitution"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Rage", "Unarmored Defense", "Reckless Attack", "Danger Sense", "Extra Attack", "Fast Movement", "Feral Instinct", "Brutal Critical", "Relentless Rage", "Persistent Rage", "Indomitable Might", "Primal Champion"]
    },
    {
        id: "bard", name: "Bard", hp: 8,
        saves: ["Dexterity", "Charisma"],
        proficiencies: ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        traits: ["Bardic Inspiration", "Jack of All Trades", "Song of Rest", "Expertise", "Font of Inspiration", "Countercharm", "Magical Secrets", "Superior Inspiration"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 4, spellsKnown: 22,
            slots: FULL_CASTER_SLOTS
        }
    },
    {
        id: "cleric", name: "Cleric", hp: 8,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons"],
        traits: ["Divine Domain", "Channel Divinity", "Destroy Undead", "Divine Intervention"],
        spellcasting: {
            ability: "wis", type: "prepared", cantripsKnown: 5,
            slots: FULL_CASTER_SLOTS
        }
    },
    {
        id: "druid", name: "Druid", hp: 8,
        saves: ["Intelligence", "Wisdom"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
        traits: ["Druidic", "Wild Shape", "Timeless Body", "Beast Spells", "Archdruid"],
        spellcasting: {
            ability: "wis", type: "prepared", cantripsKnown: 4,
            slots: FULL_CASTER_SLOTS
        }
    },
    {
        id: "fighter", name: "Fighter", hp: 10,
        saves: ["Strength", "Constitution"],
        proficiencies: ["All Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Fighting Style", "Second Wind", "Action Surge", "Martial Archetype", "Extra Attack (3)", "Indomitable"]
    },
    {
        id: "monk", name: "Monk", hp: 8,
        saves: ["Strength", "Dexterity"],
        proficiencies: ["Simple Weapons", "Shortswords"],
        traits: ["Unarmored Defense", "Martial Arts", "Ki", "Unarmored Movement", "Deflect Missiles", "Slow Fall", "Extra Attack", "Stunning Strike", "Ki-Empowered Strikes", "Evasion", "Stillness of Mind", "Purity of Body", "Tongue of the Sun and Moon", "Diamond Soul", "Timeless Body", "Empty Body", "Perfect Self"]
    },
    {
        id: "paladin", name: "Paladin", hp: 10,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["All Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Divine Sense", "Lay on Hands", "Fighting Style", "Divine Smite", "Divine Health", "Sacred Oath", "Extra Attack", "Aura of Protection", "Aura of Courage", "Improved Divine Smite", "Cleansing Touch", "Aura Improvements"],
        spellcasting: {
            ability: "cha", type: "prepared", cantripsKnown: 0,
            slots: HALF_CASTER_SLOTS // Lvl 20 finishes at 5th level spells
        }
    },
    {
        id: "ranger", name: "Ranger", hp: 10,
        saves: ["Strength", "Dexterity"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Favored Enemy", "Natural Explorer", "Fighting Style", "Primeval Awareness", "Extra Attack", "Land's Stride", "Hide in Plain Sight", "Vanish", "Feral Senses", "Foe Slayer"],
        spellcasting: {
            ability: "wis", type: "known", cantripsKnown: 0, spellsKnown: 11,
            slots: HALF_CASTER_SLOTS
        }
    },
    {
        id: "rogue", name: "Rogue", hp: 8,
        saves: ["Dexterity", "Intelligence"],
        proficiencies: ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        traits: ["Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Uncanny Dodge", "Evasion", "Reliable Talent", "Blindsense", "Slippery Mind", "Elusive", "Stroke of Luck"]
    },
    {
        id: "sorcerer", name: "Sorcerer", hp: 6,
        saves: ["Constitution", "Charisma"],
        proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows"],
        traits: ["Sorcerous Origin", "Font of Magic", "Metamagic", "Sorcerous Restoration"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 6, spellsKnown: 15,
            slots: FULL_CASTER_SLOTS
        }
    },
    {
        id: "warlock", name: "Warlock", hp: 8,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["Light Armor", "Simple Weapons"],
        traits: ["Otherworldly Patron", "Pact Magic", "Eldritch Invocations", "Pact Boon", "Mystic Arcanum", "Eldritch Master"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 4, spellsKnown: 15,
            slots: { 5: 4 } // Pact Magic is weird, just 4 slots of 5th level (plus Mystic Arcanum handled via traits for now)
        }
    },
    {
        id: "wizard", name: "Wizard", hp: 6,
        saves: ["Intelligence", "Wisdom"],
        proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows"],
        traits: ["Arcane Recovery", "Arcane Tradition", "Spell Mastery", "Signature Spells"],
        spellcasting: {
            ability: "int", type: "prepared", cantripsKnown: 5,
            slots: FULL_CASTER_SLOTS
        }
    }
];

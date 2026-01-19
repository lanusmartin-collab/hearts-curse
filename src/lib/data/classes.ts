
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
    subclasses?: {
        name: string;
        description: string;
        features: string[];
    }[];
}

// Standard 5e Slot Progression for Full Casters at Lvl 20
const FULL_CASTER_SLOTS = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 };
const HALF_CASTER_SLOTS = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 }; // Paladin/Ranger roughly

export const CLASSES: ClassData[] = [
    {
        id: "barbarian", name: "Barbarian", hp: 12,
        saves: ["Strength", "Constitution"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Rage", "Unarmored Defense", "Reckless Attack", "Danger Sense", "Extra Attack", "Fast Movement", "Feral Instinct", "Brutal Critical", "Relentless Rage", "Persistent Rage", "Indomitable Might", "Primal Champion"],
        subclasses: [
            { name: "Path of the Berserker", description: "Fury incarnate.", features: ["Frenzy", "Mindless Rage", "Intimidating Presence", "Retaliation"] },
            { name: "Path of the Totem Warrior", description: "Spirit guided.", features: ["Spirit Seeker", "Totem Spirit", "Aspect of the Beast", "Totemic Attunement"] }
        ]
    },
    {
        id: "bard", name: "Bard", hp: 8,
        saves: ["Dexterity", "Charisma"],
        proficiencies: ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        traits: ["Bardic Inspiration", "Jack of All Trades", "Song of Rest", "Expertise", "Font of Inspiration", "Countercharm", "Magical Secrets", "Superior Inspiration"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 4, spellsKnown: 22,
            slots: FULL_CASTER_SLOTS
        },
        subclasses: [
            { name: "College of Lore", description: "Seekers of knowledge.", features: ["Bonus Proficiencies", "Cutting Words", "Additional Magical Secrets", "Peerless Skill"] },
            { name: "College of Valor", description: "Heroes of old.", features: ["Combat Inspiration", "Extra Attack", "Battle Magic"] }
        ]
    },
    {
        id: "cleric", name: "Cleric", hp: 8,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons"],
        traits: ["Divine Domain", "Channel Divinity", "Destroy Undead", "Divine Intervention"],
        spellcasting: {
            ability: "wis", type: "prepared", cantripsKnown: 5,
            slots: FULL_CASTER_SLOTS
        },
        subclasses: [
            { name: "Life Domain", description: "Preservers of vitality.", features: ["Bonus Proficiency", "Disciple of Life", "Channel Divinity: Preserve Life", "Blessed Healer", "Divine Strike", "Supreme Healing"] },
            { name: "Light Domain", description: "Servants of truth.", features: ["Warding Flare", "Radiance of the Dawn", "Corona of Light"] }
        ]
    },
    {
        id: "druid", name: "Druid", hp: 8,
        saves: ["Intelligence", "Wisdom"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
        traits: ["Druidic", "Wild Shape", "Timeless Body", "Beast Spells", "Archdruid"],
        spellcasting: {
            ability: "wis", type: "prepared", cantripsKnown: 4,
            slots: FULL_CASTER_SLOTS
        },
        subclasses: [
            { name: "Circle of the Land", description: "Guardians of ancient knowledge.", features: ["Bonus Cantrip", "Natural Recovery", "Land's Stride", "Nature's Ward", "Nature's Sanctuary"] },
            { name: "Circle of the Moon", description: "Changeable as the moon.", features: ["Combat Wild Shape", "Circle Forms", "Primal Strike", "Elemental Wild Shape", "Thousand Forms"] }
        ]
    },
    {
        id: "fighter", name: "Fighter", hp: 10,
        saves: ["Strength", "Constitution"],
        proficiencies: ["All Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Fighting Style", "Second Wind", "Action Surge", "Martial Archetype", "Extra Attack (3)", "Indomitable"],
        subclasses: [
            { name: "Champion", description: "Raw physical power.", features: ["Improved Critical", "Remarkable Athlete", "Additional Fighting Style", "Superior Critical", "Survivor"] },
            { name: "Battle Master", description: "Combat superiority.", features: ["Combat Superiority", "Student of War", "Know Your Enemy", "Relentless"] }
        ]
    },
    {
        id: "monk", name: "Monk", hp: 8,
        saves: ["Strength", "Dexterity"],
        proficiencies: ["Simple Weapons", "Shortswords"],
        traits: ["Unarmored Defense", "Martial Arts", "Ki", "Unarmored Movement", "Deflect Missiles", "Slow Fall", "Extra Attack", "Stunning Strike", "Ki-Empowered Strikes", "Evasion", "Stillness of Mind", "Purity of Body", "Tongue of the Sun and Moon", "Diamond Soul", "Timeless Body", "Empty Body", "Perfect Self"],
        subclasses: [
            { name: "Way of the Open Hand", description: "Masters of martial arts.", features: ["Open Hand Technique", "Wholeness of Body", "Tranquility", "Quivering Palm"] },
            { name: "Way of Shadow", description: "Assassins and spies.", features: ["Shadow Arts", "Shadow Step", "Cloak of Shadows", "Opportunist"] }
        ]
    },
    {
        id: "paladin", name: "Paladin", hp: 10,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["All Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Divine Sense", "Lay on Hands", "Fighting Style", "Divine Smite", "Divine Health", "Sacred Oath", "Extra Attack", "Aura of Protection", "Aura of Courage", "Improved Divine Smite", "Cleansing Touch", "Aura Improvements"],
        spellcasting: {
            ability: "cha", type: "prepared", cantripsKnown: 0,
            slots: HALF_CASTER_SLOTS // Lvl 20 finishes at 5th level spells
        },
        subclasses: [
            { name: "Oath of Devotion", description: "The ideal of the knight in shining armor.", features: ["Sacred Weapon", "Turn the Unholy", "Aura of Devotion", "Purity of Spirit", "Holy Nimbus"] },
            { name: "Oath of Vengeance", description: "Punishers of the wicked.", features: ["Abjure Enemy", "Vow of Enmity", "Relentless Avenger", "Soul of Vengeance", "Avenging Angel"] }
        ]
    },
    {
        id: "ranger", name: "Ranger", hp: 10,
        saves: ["Strength", "Dexterity"],
        proficiencies: ["Light Armor", "Medium Armor", "Shields", "Simple Weapons", "Martial Weapons"],
        traits: ["Favored Enemy", "Natural Explorer", "Fighting Style", "Primeval Awareness", "Extra Attack", "Land's Stride", "Hide in Plain Sight", "Vanish", "Feral Senses", "Foe Slayer"],
        spellcasting: {
            ability: "wis", type: "known", cantripsKnown: 0, spellsKnown: 11,
            slots: HALF_CASTER_SLOTS
        },
        subclasses: [
            { name: "Hunter", description: "Master of the wild.", features: ["Hunter's Prey", "Defensive Tactics", "Multiattack", "Superior Hunter's Defense"] },
            { name: "Beast Master", description: "Bonded with a beast.", features: ["Ranger's Companion", "Exceptional Training", "Bestial Fury", "Share Spells"] }
        ]
    },
    {
        id: "rogue", name: "Rogue", hp: 8,
        saves: ["Dexterity", "Intelligence"],
        proficiencies: ["Light Armor", "Simple Weapons", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        traits: ["Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Uncanny Dodge", "Evasion", "Reliable Talent", "Blindsense", "Slippery Mind", "Elusive", "Stroke of Luck"],
        subclasses: [
            { name: "Thief", description: "Burglars and bandits.", features: ["Fast Hands", "Second-Story Work", "Supreme Sneak", "Use Magic Device", "Thief's Reflexes"] },
            { name: "Assassin", description: "Masters of death.", features: ["Bonus Proficiencies", "Assassinate", "Infiltration Expertise", "Impostor", "Death Strike"] }
        ]
    },
    {
        id: "sorcerer", name: "Sorcerer", hp: 6,
        saves: ["Constitution", "Charisma"],
        proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows"],
        traits: ["Sorcerous Origin", "Font of Magic", "Metamagic", "Sorcerous Restoration"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 6, spellsKnown: 15,
            slots: FULL_CASTER_SLOTS
        },
        subclasses: [
            { name: "Draconic Bloodline", description: "Dragon's power.", features: ["Dragon Ancestor", "Draconic Resilience", "Elemental Affinity", "Dragon Wings", "Draconic Presence"] },
            { name: "Wild Magic", description: "Chaos incarnate.", features: ["Wild Magic Surge", "Tides of Chaos", "Bend Luck", "Controlled Chaos", "Spell Bombardment"] }
        ]
    },
    {
        id: "warlock", name: "Warlock", hp: 8,
        saves: ["Wisdom", "Charisma"],
        proficiencies: ["Light Armor", "Simple Weapons"],
        traits: ["Otherworldly Patron", "Pact Magic", "Eldritch Invocations", "Pact Boon", "Mystic Arcanum", "Eldritch Master"],
        spellcasting: {
            ability: "cha", type: "known", cantripsKnown: 4, spellsKnown: 15,
            slots: { 5: 4 } // Pact Magic is weird, just 4 slots of 5th level (plus Mystic Arcanum handled via traits for now)
        },
        subclasses: [
            { name: "The Fiend", description: "A deal with a devil.", features: ["Dark One's Blessing", "Dark One's Own Luck", "Fiendish Resilience", "Hurl Through Hell"] },
            { name: "The Genie", description: "Noble genie patron.", features: ["Genie's Vessel", "Elemental Gift", "Sanctuary Vessel", "Limited Wish"] }
        ]
    },
    {
        id: "wizard", name: "Wizard", hp: 6,
        saves: ["Intelligence", "Wisdom"],
        proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows"],
        traits: ["Arcane Recovery", "Arcane Tradition", "Spell Mastery", "Signature Spells"],
        spellcasting: {
            ability: "int", type: "prepared", cantripsKnown: 5,
            slots: FULL_CASTER_SLOTS
        },
        subclasses: [
            { name: "School of Evocation", description: "Destructive magic.", features: ["Evocation Savant", "Sculpt Spells", "Potent Cantrip", "Empowered Evocation", "Overchannel"] },
            { name: "School of Abjuration", description: "Protective magic.", features: ["Abjuration Savant", "Arcane Ward", "Projected Ward", "Improved Abjuration", "Spell Resistance"] }
        ]
    }
];

export type Statblock = {
    name: string;
    size: string;
    type: string;
    alignment: string;
    ac: number;
    armorType: string;
    hp: number;
    hitDice: string;
    speed: string;
    stats: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
    saves: string;
    skills: string;
    immunities: string;
    resistances?: string;
    conditionImmunities?: string;
    senses?: string;
    languages: string;
    cr: string;
    xp: number;
    traits: { name: string; desc: string }[];
    actions: { name: string; desc: string; attack?: string; damage?: string }[];
    bonus_actions?: { name: string; desc: string }[];
    reactions?: { name: string; desc: string }[];
    legendary?: { name: string; desc: string }[];
    lair?: string[];
    treasure?: string;
    image?: string;
    description?: string;
    initiative?: number;
    slug?: string;
};

export const STATBLOCKS: Record<string, Statblock> = {
    "fimble": {
        name: "Fimble Futterly",
        size: "Small",
        type: "Humanoid (Gnome)",
        alignment: "Chaotic Neutral",
        ac: 17,
        armorType: "Glamoured Studded Leather",
        hp: 88,
        hitDice: "16d6 + 32",
        speed: "25 ft.",
        stats: { str: 8, dex: 18, con: 14, int: 19, wis: 14, cha: 16 },
        saves: "Dex +8, Int +8",
        skills: "Deception +11, Sleight of Hand +11, Arcana +8",
        immunities: "None",
        languages: "Common, Gnomish, Sylvan, Undercommon",
        cr: "9",
        xp: 5000,
        traits: [
            { name: "Spellcasting", desc: "Fimble is a 9th-level spellcaster. Int is his casting mod (+8, DC 16). Cantrips: Mage Hand, Minor Illusion, Prestidigitation. 1st: Charm Person, Disguise Self. 2nd: Invisibility, Mirror Image. 3rd: Major Image, Hypnotic Pattern. 4th: Greater Invisibility." },
            { name: "Cunning Action", desc: "Bonus action to Dash, Disengage, or Hide." },
            { name: "Sentient Capital Aura", desc: "Anyone trading with Fimble must make a DC 16 Wis save or feel compelled to offer a memory." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two dagger attacks." },
            { name: "Dagger of Lost Thoughts", desc: "+8 to hit, 20/60 ft. Hit: 1d4+4 piercing + 3d6 psychic. Target has disadvantage on next attack." }
        ],
        treasure: "Immaculate Ledger, Bag of Holding"
    },
    "kaelen": {
        name: "Kaelen Muldar",
        size: "Medium",
        type: "Humanoid (Dwarf)",
        alignment: "Lawful Neutral",
        ac: 20,
        armorType: "Plate Armor",
        hp: 136,
        hitDice: "16d8 + 64",
        speed: "25 ft.",
        stats: { str: 20, dex: 10, con: 18, int: 12, wis: 16, cha: 12 },
        saves: "Con +8, Wis +7",
        skills: "Athletics +9, Smith's Tools +12",
        immunities: "Fire, Poison",
        languages: "Common, Dwarvish, Ignan",
        cr: "10",
        xp: 5900,
        traits: [
            { name: "Master of the Forge", desc: "Kaelen's attacks deal an extra 1d8 Fire damage (included)." },
            { name: "Dwarven Resilience", desc: "Advantage on saves vs poison." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two attacks with the Ghost-Hammer." },
            { name: "The Ghost-Hammer", desc: "+9 to hit, reach 5 ft. Hit: 2d6+5 bludgeoning + 1d8 fire. Ignores resistance to non-magical attacks." },
            { name: "Heat Metal (3/day)", desc: "Casts Heat Metal as a 3rd level spell (DC 15)." }
        ],
        treasure: "Hammer of the Iron Knot, Belt of Dwarvenkind"
    },
    "crow": {
        name: "The Crow",
        size: "Medium",
        type: "Humanoid (Elf)",
        alignment: "Neutral Evil",
        ac: 18,
        armorType: "Studded Leather +2",
        hp: 120,
        hitDice: "16d8 + 48",
        speed: "35 ft., climb 30 ft.",
        stats: { str: 12, dex: 20, con: 16, int: 14, wis: 14, cha: 18 },
        saves: "Dex +9, Cha +8",
        skills: "Stealth +13, Perception +6, Intimidation +8",
        immunities: "None",
        languages: "Common, Elvish, Thieves' Cant",
        cr: "11",
        xp: 7200,
        traits: [
            { name: "Assassinate", desc: "Advantage vs creatures that haven't taken a turn. Auto-crit on hit if surprised." },
            { name: "Sneak Attack", desc: "Once per turn, deal extra 6d6 damage if advantage or ally adjacent." },
            { name: "Evasion", desc: "Half damage on failed Dex save, no damage on success." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three attacks: two with rapier, one with hand crossbow." },
            { name: "Rapier of Debt", desc: "+9 to hit, reach 5 ft. Hit: 1d8+5 piercing + 2d6 poison." },
            { name: "Hand Crossbow", desc: "+9 to hit, range 30/120. Hit: 1d6+5 piercing + drow poison (DC 13 Con or poisoned 1hr)." }
        ],
        treasure: "Cloak of Elvenkind, Rapier +2"
    },
    "zhentarim_champion": {
        name: "Zhentarim Champion",
        size: "Medium", type: "Humanoid", alignment: "Lawful Evil",
        ac: 18, armorType: "Plate", hp: 143, hitDice: "22d8+44", speed: "30 ft.",
        stats: { str: 20, dex: 15, con: 14, int: 10, wis: 14, cha: 12 },
        saves: "Str +9, Con +6", skills: "Intimidation +5",
        immunities: "", languages: "Common",
        cr: "9", xp: 5000,
        traits: [{ name: "Indomitable", desc: "Reroll save 2/day." }],
        actions: [{ name: "Multiattack", desc: "Three Greatsword attacks." }, { name: "Greatsword", desc: "+9 to hit, 2d6+5 slashing." }]
    },

    "dracolich": {
        name: "Ancient White Dracolich",
        size: "Gargantuan",
        type: "Undead",
        alignment: "Chaotic Evil",
        ac: 22,
        armorType: "Natural Armor",
        hp: 333,
        hitDice: "18d20 + 144",
        speed: "40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.",
        stats: { str: 26, dex: 10, con: 26, int: 10, wis: 13, cha: 14 },
        saves: "Dex +7, Con +15, Wis +8, Cha +9",
        skills: "Perception +15, Stealth +7",
        immunities: "Cold, Necrotic, Poison",
        languages: "Common, Draconic",
        cr: "24",
        xp: 62000,
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeeds on failed save." },
            { name: "Ice Walk", desc: "Can move across icy surfaces without ability checks. Difficult terrain composed of ice doesn't cost extra movement." }
        ],
        actions: [
            { name: "Multiattack", desc: "Uses Frightful Presence. Makes three attacks: one bite, two claws." },
            { name: "Necrotic Frost Breath (Recharge 5-6)", desc: "90-foot cone. DC 22 Con save, taking 72 (16d8) Cold plus 35 (10d6) Necrotic damage on fail." }
        ],
        legendary: [
            { name: "Wing Attack (Costs 2 Actions)", desc: "Beats wings. Each creature within 15 ft. DC 23 Dex save or take 15 (2d6+8) bludgeoning and be prone. Dracolich flies up to half speed." }
        ]
    },
    "vanko": {
        name: "Vanko the Silk",
        size: "Medium", type: "Humanoid (Human)", alignment: "Lawful Evil",
        ac: 17, armorType: "Glamoured Studded Leather", hp: 99, hitDice: "18d8 + 18", speed: "30 ft., fly 40 ft. (Winged Boots)",
        stats: { str: 10, dex: 16, con: 12, int: 20, wis: 14, cha: 18 },
        saves: "Int +10, Wis +7, Cha +9",
        skills: "Deception +14, Insight +12, Persuasion +14, Arcana +10, Sleight of Hand +11, Stealth +11",
        immunities: "None",
        resistances: "None",
        languages: "Common, Elvish, Draconic, Undercommon, Infernal",
        cr: "13", xp: 10000,
        traits: [
            { name: "Cunning Action", desc: "Bonus action: Dash, Disengage, Hide." },
            { name: "Sneak Attack (4d6)", desc: "Once per turn, deals extra 4d6 damage if advantage or ally adjacent." },
            { name: "Spellcasting", desc: "14th level Wizard (Enchanter). Int DC 18. Slots: 1st-7th.\nAt Will: Friends, Message, Prestidigitation.\n1st: Charm Person, Disguise Self, Shield.\n2nd: Detect Thoughts, Hold Person, Misty Step, Suggestion.\n3rd: Counterspell, Major Image, Sending.\n4th: Arcane Eye, Dimension Door.\n5th: Dominate Person, Modify Memory, Seeming.\n6th: Mass Suggestion.\n7th: Power Word Pain." },
            { name: "Special Equipment", desc: "Vanko wears *Glamoured Studded Leather* (usually looks like silk robes), *Winged Boots* (fly speed), and a *Ring of Mind Shielding* (invisible). He carries a *Staff of Charming* (looks like a cane) and a hidden *Dagger of Venom*." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Dagger attacks." },
            { name: "Dagger of Venom", desc: "+8 to hit, reach 5ft. Hit: 1d4+3 piercing + 4d6 poison (Sneak Attack applicable)." },
            { name: "Staff of Charming", desc: "Melee: +6 to hit, 1d6 bludgeoning. Spells (10 charges): Charm Person (1), Command (1), Comprehend Languages (1). Recharges 1d8+2 at dawn. If you fail a save vs an enchantment spell while holding it, you can turn the spell back on the caster (1 charge)." },
            { name: "Diplomatic Immunity (Recharge 5-6)", desc: "Vanko creates a sanctuary field. For 1 minute, any creature attempting to attack him must make a DC 18 Wis save. On failure, they lose the attack." }
        ],
        bonus_actions: [
            { name: "Command Guardian", desc: "Vanko verbally commands one connected Shield Guardian to move up to its speed and make one attack." },
            { name: "Coat Dagger", desc: "Vanko uses a bonus action to coat his dagger in black poison (included in Dagger of Venom damage)." }
        ],
        reactions: [
            { name: "Redirect Attack", desc: "When targeted by an attack, Vanko can swap places with a Guardian within 5ft. The Guardian takes the hit." },
            { name: "Uncanny Dodge", desc: "Halve damage from one attack he can see." }
        ],
        legendary: [
            { name: "Cast Cantrip", desc: "Casts a cantrip." },
            { name: "Command Guardian", desc: "Uses Command Guardian bonus action." },
            { name: "Tactical Displacement (2 Actions)", desc: "Vanko and one willing creature within 30ft teleport, swapping places." }
        ],
        treasure: "Ring of Mind Shielding, Staff of Charming, Dagger of Venom, Bank Notes worth 50,000gp"
    },
    "zhentarim_guardian": {
        name: "Zhentarim Shield Guardian",
        size: "Large", type: "Construct", alignment: "Unaligned",
        ac: 17, armorType: "Natural Armor", hp: 142, hitDice: "15d10 + 60", speed: "30 ft.",
        stats: { str: 18, dex: 8, con: 18, int: 7, wis: 10, cha: 3 },
        saves: "", skills: "",
        immunities: "Poison",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Paralyzed, Poisoned",
        senses: "Blindsight 10 ft., Darkvision 60 ft.",
        languages: "Understands Vanko",
        cr: "7", xp: 2900,
        traits: [
            { name: "Bound", desc: "Magically bound to an amulet worn by Vanko. Vanko knows its location and can cast spells through it." },
            { name: "Shield", desc: "If within 5ft of Vanko, grants him +2 AC." },
            { name: "Spell Storing", desc: "Can store one 4th level spell. Currently: Dimension Door (Trigger: Vanko drops below 50% HP, teleports Vanko to safety)." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two fist attacks." },
            { name: "Fist", desc: "+7 to hit, 2d6+4 bludgeoning." }
        ],
        reactions: [
            { name: "Shield", desc: "When Vanko is hit by an attack within 5 ft, the Guardian takes half the damage." }
        ]
    },
    "night_shard": {
        name: "The Night Shard",
        size: "Medium",
        type: "Humanoid (Elf)",
        alignment: "Neutral Evil",
        ac: 19,
        armorType: "Studded Leather",
        hp: 155,
        hitDice: "18d8 + 72",
        speed: "40 ft.",
        stats: { str: 12, dex: 22, con: 16, int: 14, wis: 16, cha: 14 },
        saves: "Dex +11, Int +7",
        skills: "Acrobatics +11, Stealth +16, Perception +8",
        immunities: "None",
        languages: "Common, Elvish, Undercommon",
        cr: "15",
        xp: 13000,
        traits: [
            { name: "Assassinate", desc: "Advantage on attack rolls against creatures that haven't taken a turn. Hit is auto-crit if surprised." },
            { name: "Shadow Step", desc: "Bonus action to teleport 60ft from dim light to dim light." }
        ],
        actions: [
            { name: "Multiattack", desc: "Makes three attacks with Dagger +2." },
            { name: "Dagger +2", desc: "+13 to hit, reach 5ft. Hit: 1d4 + 8 piercing + 4d6 poison." }
        ],
        treasure: "Dagger +2 (Venom), Ring of Protection"
    },
    "jarlaxle": {
        name: "Jarlaxle Baenre", size: "Medium", type: "Humanoid (Drow)", alignment: "Chaotic Neutral",
        ac: 24, armorType: "+3 Leather, Dual Wielder, Bracers", hp: 123, hitDice: "19d8 + 38", speed: "30 ft.",
        stats: { str: 12, dex: 22, con: 14, int: 20, wis: 16, cha: 22 },
        saves: "Dex +11, Int +10, Cha +11",
        skills: "Acrobatics +11, Deception +16, Persuasion +16, Sleight of Hand +11, Stealth +16",
        immunities: "", languages: "Common, Elvish, Undercommon, Abyssal",
        cr: "15", xp: 13000,
        traits: [
            { name: "Master Duelist", desc: "Jarlaxle adds his Cha mod to AC (included)." },
            { name: "Fey Ancestry", desc: "Advantage vs Charm, cannot sleep." },
            { name: "Legendary Resistance (3/Day)", desc: "Succeed failed save." },
            { name: "Wand of Wonder", desc: "Holds a wand that triggers random effects." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three attacks with Rapier +3 or Daggers." },
            { name: "Rapier +3", desc: "+14 to hit, 1d8+9 piercing." },
            { name: "Dagger +3", desc: "+14 to hit, range 20/60, 1d4+9 piercing." }
        ],
        legendary: [
            { name: "Quick Step", desc: "Move without provoking opportunity attacks." },
            { name: "Riposte", desc: "Make one melee attack against a creature that missed him." }
        ]
    },
    "khelben": {
        name: "Khelben 'Blackstaff' Arunsun", size: "Medium", type: "Humanoid", alignment: "Lawful Neutral",
        ac: 15, armorType: "Robes of the Archmagi", hp: 160, hitDice: "25d8 + 50", speed: "30 ft.",
        stats: { str: 10, dex: 14, con: 14, int: 27, wis: 18, cha: 16 },
        saves: "Int +15, Wis +11", skills: "Arcana +18, History +18",
        immunities: "Psychic", languages: "All",
        cr: "18", xp: 20000,
        traits: [
            { name: "The Blackstaff", desc: "Can drain magic from items or creatures. Advantage on saves vs spells." },
            { name: "Spellmaster", desc: "Can cast without components constantly." }
        ],
        actions: [
            { name: "Blackstaff Strike", desc: "Melee Spell Attack: +15 to hit, 4d6+8 Force damage. Dispel Magic effect on hit." },
            { name: "High Magic (Recharge 6)", desc: "Cast any spell 7th level or lower instantly." }
        ],
        legendary: [
            { name: "Cast Spell", desc: "Cast cantrip." },
            { name: "Arcane Deflection", desc: "+4 AC vs one attack." }
        ]
    },

    "bregan_daerthe_mercenary": {
        name: "Bregan D'aerthe Mercenary", size: "Medium", type: "Humanoid (Drow)", alignment: "Chaotic Neutral",
        ac: 16, armorType: "Studded Leather", hp: 78, hitDice: "12d8+24", speed: "30 ft.",
        stats: { str: 10, dex: 18, con: 14, int: 12, wis: 10, cha: 14 },
        saves: "Dex +7", skills: "Stealth +7, Deception +4",
        immunities: "", languages: "Common, Elvish, Undercommon",
        cr: "5", xp: 1800,
        traits: [
            { name: "Fey Ancestry", desc: "Advantage vs Charm, cannot sleep." },
            { name: "Sunlight Sensitivity", desc: "Disadvantage on attack rolls and Perception checks in direct sunlight." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two attacks with shortsword or hand crossbow." },
            { name: "Shortsword", desc: "+7 to hit, 1d6+4 piercing." },
            { name: "Hand Crossbow", desc: "+7 to hit, range 30/120 ft., 1d6+4 piercing + Drow Poison (DC 13 Con save or poisoned for 1 hour)." }
        ]
    },
    "arcanum_wraith": {
        name: "Arcanum Wraith (Rogue Netherese)", size: "Medium", type: "Undead", alignment: "Neutral Evil",
        ac: 15, armorType: "Shadowstuff", hp: 80, hitDice: "12d8+24", speed: "Fly 50 ft.",
        stats: { str: 6, dex: 18, con: 14, int: 10, wis: 12, cha: 14 },
        saves: "Dex +7", skills: "Stealth +7", immunities: "Necrotic, Poison", languages: "Netherese",
        cr: "7", xp: 2900,
        traits: [{ name: "Shadow Stealth", desc: "Bonus action Hide in dim light." }],
        actions: [{ name: "Shadow Blade", desc: "+7 to hit, 4d8+4 psychic." }]
    },
    "chitine_lord": {
        name: "Chitine Scourge-Lord", size: "Medium", type: "Monstrosity", alignment: "Chaotic Evil",
        ac: 16, armorType: "Chitin", hp: 95, hitDice: "14d8+28", speed: "30 ft., climb 30 ft.",
        stats: { str: 12, dex: 18, con: 14, int: 10, wis: 14, cha: 10 },
        saves: "Dex +7", skills: "Stealth +7",
        immunities: "", languages: "Undercommon",
        cr: "5", xp: 1800,
        traits: [{ name: "Web Walker", desc: "Ignores web restrictions." }],
        actions: [{ name: "Multiattack", desc: "Three dagger attacks." }, { name: "Dagger", desc: "+7 to hit, 1d4+4 piercing." }]
    },
    "shadow_walker": {
        name: "Vhaeraunian Shadow-Walker", size: "Medium", type: "Humanoid (Drow)", alignment: "Chaotic Neutral",
        ac: 17, armorType: "Studded Leather", hp: 80, hitDice: "14d8+14", speed: "30 ft.",
        stats: { str: 12, dex: 20, con: 12, int: 12, wis: 14, cha: 14 },
        saves: "Dex +8", skills: "Stealth +11",
        immunities: "", languages: "Elvish, Common",
        cr: "6", xp: 2300,
        traits: [{ name: "Shadow Step", desc: "Teleport 60ft in dim light (Bonus)." }],
        actions: [{ name: "Shortsword", desc: "+8 to hit, 1d6+5 piercing + 2d6 poison." }]
    },
    "red_wizard_enforcer": {
        name: "Red Wizard Enforcer", size: "Medium", type: "Humanoid (Human)", alignment: "Lawful Evil",
        ac: 15, armorType: "Arcane Deflection", hp: 90, hitDice: "12d8+36", speed: "30 ft.",
        stats: { str: 10, dex: 14, con: 16, int: 18, wis: 12, cha: 10 },
        saves: "Int +7, Wis +4", skills: "Arcana +7, Intimidation +3",
        immunities: "", languages: "Common, Thayan, Draconic",
        cr: "7", xp: 2900,
        traits: [{ name: "Arcane Ward", desc: "Has 20 temporary HP that recharges after casting Abjuration spells." }],
        actions: [
            { name: "Multiattack", desc: "Two Firebolt attacks." },
            { name: "Firebolt", desc: "+7 to hit, 2d10 Fire damage." },
            { name: "Fireball (3/Day)", desc: "DC 15 Dex save, 8d6 Fire damage." }
        ]
    },
    "mithral_golem": {
        name: "Mithral Golem", size: "Large", type: "Construct", alignment: "Unaligned",
        ac: 20, armorType: "Mithral Plate", hp: 180, hitDice: "18d10+90", speed: "40 ft.",
        stats: { str: 24, dex: 14, con: 20, int: 3, wis: 11, cha: 1 },
        saves: "Con +10", skills: "Perception +5",
        immunities: "Poison, Psychic, Non-magical attacks",
        languages: "Understands Creator",
        cr: "13", xp: 10000,
        traits: [
            { name: "Spell Reflection", desc: "If a spell attack misses the golem, roll d6. On 6, it reflects back at the caster." },
            { name: "Immutable Form", desc: "Immune to polymorph." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Slam attacks." },
            { name: "Slam", desc: "+12 to hit, reach 10ft, 3d8+7 bludgeoning." }
        ]
    },

    "netherese_specter": {
        name: "Netherese Specter", size: "Medium", type: "Undead", alignment: "Chaotic Evil",
        ac: 13, armorType: "None", hp: 45, hitDice: "10d8", speed: "0 ft., fly 50 ft.",
        stats: { str: 1, dex: 16, con: 10, int: 14, wis: 10, cha: 15 },
        saves: "", skills: "",
        immunities: "Necrotic, Poison",
        languages: "Netherese",
        cr: "4", xp: 1100,
        traits: [{ name: "Magic Resistance", desc: "Advantage on saves vs spells." }],
        actions: [{ name: "Life Drain", desc: "+5 to hit, 3d6 necrotic. Max HP reduced." }]
    },
    "balor_ignis": {
        name: "Ignis-Void (Balor)", size: "Huge", type: "Fiend", alignment: "Chaotic Evil",
        ac: 19, armorType: "Natural Armor", hp: 262, hitDice: "21d12+126", speed: "40 ft., fly 80 ft.",
        stats: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
        saves: "Str +14, Con +12, Wis +9, Cha +12", skills: "",
        immunities: "Fire, Poison",
        languages: "Abyssal, Telepathy 120ft",
        cr: "20", xp: 25000,
        traits: [
            { name: "Death Throes", desc: "Explodes: DC 20 Dex save, 20d6 Fire damage." },
            { name: "Fire Aura", desc: "Start of turn within 5ft: 3d6 Fire damage." }
        ],
        actions: [
            { name: "Multiattack", desc: "One Longsword, One Whip." },
            { name: "Longsword", desc: "+14 to hit, 3d8+8 slashing + 3d8 lightning." },
            { name: "Whip", desc: "+14 to hit, reach 30ft, 1d6+8 slashing + 3d6 fire. Pulls target 25ft." }
        ]
    },
    "dullahan": {
        name: "Dullahan", size: "Medium", type: "Fey", alignment: "Lawful Evil",
        ac: 17, armorType: "Half-Plate", hp: 130, hitDice: "16d8+64", speed: "40 ft., fly 60 ft. (mounted)",
        stats: { str: 18, dex: 14, con: 18, int: 11, wis: 14, cha: 16 },
        saves: "Con +7", skills: "Intimidation +6",
        immunities: "Charmed, Frightened",
        languages: "Sylvan",
        cr: "10", xp: 5900,
        traits: [{ name: "Headless", desc: "Immune to critical hits." }],
        actions: [
            { name: "Multiattack", desc: "Two attacks with Spine Whip." },
            { name: "Spine Whip", desc: "+8 to hit, reach 15ft, 2d6+4 slashing + 1d8 necrotic." },
            { name: "Death Calling", desc: "DC 15 Con save or drop to 0 HP (if under 30 HP)." }
        ]
    },
    "ulitharid": {
        name: "Ulitharid", size: "Large", type: "Aberration", alignment: "Lawful Evil",
        ac: 15, armorType: "Breastplate", hp: 127, hitDice: "17d10+34", speed: "30 ft., fly 60 ft.",
        stats: { str: 15, dex: 12, con: 15, int: 21, wis: 19, cha: 21 },
        saves: "Int +9, Wis +8, Cha +9", skills: "Arcana +9, Insight +8",
        immunities: "", languages: "Deep Speech, Undercommon, Telepathy 2 miles",
        cr: "9", xp: 5000,
        traits: [{ name: "Psionic Hub", desc: "Connects all mind flayers." }],
        actions: [
            { name: "Extract Brain", desc: "+9 to hit vs Incapacitated. 10d10 piercing." },
            { name: "Mind Blast (Recharge 5-6)", desc: "60ft cone, 4d8+5 psychic. DC 17 Int save or Stunned." }
        ]
    },

    "warden_of_sighs": {
        name: "Warden of Sighs",
        initiative: 12,
        size: "Medium",
        type: "Aberration (Star Spawn)",
        alignment: "Chaotic Evil",
        ac: 16,
        armorType: "Natural Armor",
        hp: 168,
        hitDice: "16d8 + 96",
        speed: "30 ft., fly 60 ft. (hover)",
        stats: { str: 14, dex: 12, con: 22, int: 22, wis: 12, cha: 16 },
        saves: "Dex +6, Wis +6, Cha +8",
        skills: "Perception +6, Insight +6",
        immunities: "Psychic",
        resistances: "Cold; Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Charmed, Frightened, Paralyzed, Petrified, Poisoned, Restrained",
        senses: "Darkvision 120 ft., Passive Perception 16",
        languages: "Deep Speech, Undercommon, Telepathy 60 ft.",
        cr: "16",
        xp: 15000,
        traits: [
            { name: "Return to Worms", desc: "When the Warden drops to 0 HP, it breaks apart into a Swarm of Insects (Larvae) in its space. The Warden is destroyed only if the swarm is killed." },
            { name: "Aura of Despair", desc: "Any creature that starts its turn within 20 ft of the Warden must make a DC 18 Wisdom save. Failure: Disadvantage on saving throws until start of next turn." },
            { name: "Magic Resistance", desc: "Advantage on saves vs spells." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three Slam attacks. Can replace one with Consume Joy." },
            { name: "Slam", desc: "+10 to hit, reach 5 ft. Hit: 3d6+5 bludgeoning + 2d10 psychic." },
            { name: "Plague of Worms (Recharge 6)", desc: "20ft radius. DC 19 Dex save. Hit: 10d10 necrotic. If reduced to 0 HP, target dissolves into a Swarm of Larvae." },
            { name: "Consume Joy", desc: "Range 30ft. Target must succeed DC 18 Wis save or take 4d10 psychic and be Paralyzed (1 min). Save ends. Failure by 5+ drains a memory." }
        ],
        legendary: [
            { name: "Worm Step", desc: "Teleport 60ft as a swarm of worms." },
            { name: "Slam", desc: "Make one Slam attack." },
            { name: "Feed on Misery (2 Actions)", desc: "Target one Frightened/Paralyzed creature. It takes 4d10 psychic, Warden heals equal amount." }
        ],
        treasure: "Key to the Cage of Solitude"
    },
    "avatar_of_despair": {
        name: "Umbravos the Empty Heart",
        size: "Gargantuan",
        type: "Dragon (Shadow)",
        alignment: "Neutral Evil",
        ac: 22,
        armorType: "Natural Armor",
        hp: 567,
        hitDice: "21d20 + 147",
        speed: "40 ft., fly 80 ft., swim 40 ft.",
        stats: { str: 27, dex: 14, con: 25, int: 16, wis: 15, cha: 19 },
        saves: "Dex +9, Con +14, Wis +9, Cha +11",
        skills: "Stealth +9, Perception +16",
        immunities: "Necrotic, Acid",
        resistances: "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks while in Dim Light or Darkness",
        conditionImmunities: "Charmed, Frightened",
        senses: "Truesight 120 ft., Passive Perception 26",
        languages: "Common, Draconic, Umbral",
        cr: "21",
        xp: 33000,
        traits: [
            { name: "Aura of Despair", desc: "120 ft radius. Bright light becomes dim light. No creature can have advantage on attack checks, saving throws, or ability checks. Magical healing is halved." },
            { name: "Living Shadow", desc: "While in dim light or darkness, Umbravos has resistance to all damage except Force, Psychic, or Radiant." },
            { name: "Devour Hope", desc: "Whenever a creature within 120ft regains hit points or gains temporary hit points, Umbravos gains 20 Temporary HP." },
            { name: "Avatar of Failure", desc: "Reaction: When a creature within 60ft misses an attack or fails a save, Umbravos can force them to take 4d6 psychic damage. He heals equal to the damage dealt." },
            { name: "Legendary Resistance (3/Day)", desc: "Succeeds on failed save." },
            { name: "Sunlight Sensitivity", desc: "Disadvantage on attack rolls and Perception checks in direct sunlight." }
        ],
        actions: [
            { name: "Multiattack", desc: "Uses Frightful Presence. Makes three attacks: one bite, two claws." },
            { name: "Bite", desc: "+15 to hit, reach 15 ft. Hit: 2d10+8 piercing + 2d8 necrotic." },
            { name: "Claw", desc: "+15 to hit, reach 10 ft. Hit: 2d6+8 slashing." },
            { name: "Tail", desc: "+15 to hit, reach 20 ft. Hit: 2d8+8 bludgeoning." },
            { name: "Breath of the Void (Recharge 5-6)", desc: "90-foot cone. DC 22 Con save. Hit: 16d8 Necrotic damage. A target that fails by 5 or more takes 1 level of Exhaustion." },
            { name: "Shadow Jump (Bonus)", desc: "Teleport 60ft from dim light/darkness to dim light/darkness." }
        ],
        legendary: [
            { name: "Tail Attack", desc: "Make a Tail attack." },
            { name: "Suffocating Gloom (2 Actions)", desc: "Extinguishes all non-magical light in 60ft. Dispels light spells of 4th level or lower. Creatures in the darkness are Blinded unless they have Devil's Sight." },
            { name: "Crush Hope (3 Actions)", desc: "Target one creature Umbravos can see. Target must make DC 19 Charisma save. Failure: Target falls Prone and is Stunned until end of next turn, overwhelmed by grief." }
        ]
    },
    "varth": {
        name: "General Varth",
        size: "Medium",
        type: "Undead (Death Knight)",
        alignment: "Chaotic Evil",
        ac: 20,
        armorType: "Plate Armor +2",
        hp: 247,
        hitDice: "19d8 + 95",
        speed: "30 ft.",
        stats: { str: 20, dex: 11, con: 20, int: 12, wis: 16, cha: 18 },
        saves: "Dex +6, Wis +9, Cha +10",
        skills: "Athletics +11, Perception +9, Intimidation +10",
        immunities: "Necrotic, Poison",
        conditionImmunities: "Exhaustion, Frightened, Poisoned",
        senses: "Darkvision 120 ft., Passive Perception 19",
        languages: "Abyssal, Common, Draconic",
        cr: "17",
        xp: 18000,
        traits: [
            { name: "Magic Resistance", desc: "Advantage on saving throws against spells and other magical effects." },
            { name: "Marshal Undead", desc: "Unless incapacitated, Varth and undead within 60 ft have advantage on saving throws against being turned." },
            { name: "Nightmare Mount", desc: "Varth rides a Nightmare. While mounted, attacks against him have disadvantage unless the attacker is also mounted or flying." }
        ],
        actions: [
            { name: "Multiattack", desc: "Varth makes three attacks with his Hellfire Greatsword." },
            { name: "Hellfire Greatsword", desc: "+11 to hit, reach 5 ft. Hit: 4d6+5 slashing + 4d6 fire damage." },
            { name: "Hellfire Orb (1/Day)", desc: "Hurls a magical ball of fire that explodes at a point he can see within 120 ft. Each creature in a 20-ft radius sphere must make a DC 18 Dex save. Fail: 10d6 fire + 10d6 necrotic damage. Success: Half damage." },
            { name: "Horn of the Abyss (1/Day)", desc: "Varth blows a warhorn. Summons 1d4 Shadow Demons or 1d6 Undead Soldiers (Wights) in unoccupied spaces within 60ft. They roll initiative and act on their own." }
        ],
        treasure: "Hellfire Greatsword, Plate Armor +2"
    },
    "foreman": {
        name: "The Patchwork Foreman",
        size: "Large",
        type: "Construct",
        alignment: "Neutral Evil",
        ac: 16,
        armorType: "Natural Armor",
        hp: 210,
        hitDice: "14d10 + 70",
        speed: "30 ft.",
        stats: { str: 22, dex: 9, con: 20, int: 6, wis: 10, cha: 5 },
        saves: "Con +9",
        skills: "Athletics +10",
        immunities: "Lightning, Poison, Psychic; Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Paralyzed, Poisoned",
        senses: "Darkvision 60 ft., Tremorsense 60 ft.",
        languages: "Understands Common but can't speak",
        cr: "11",
        xp: 7200,
        traits: [
            { name: "Trash Absorption", desc: "Whenever the Foreman is subjected to lightning damage, it takes no damage and instead regains hit points equal to the lightning damage dealt." },
            { name: "Berserk", desc: "Whenever the Foreman starts its turn with 60 hit points or fewer, roll a d6. On a 6, the Foreman goes berserk. On each of its turns while berserk, the Foreman attacks the nearest creature it can see." },
            { name: "Magic Resistance", desc: "The Foreman has advantage on saving throws against spells and other magical effects." }
        ],
        actions: [
            { name: "Multiattack", desc: "The Foreman makes two slam attacks." },
            { name: "Slam", desc: "+10 to hit, reach 5 ft. Hit: 3d8+6 bludgeoning damage." },
            { name: "Vent Steam (Recharge 5-6)", desc: "The Foreman releases superheated steam in a 20-foot cube. Each creature in that area must make a DC 17 Constitution saving throw, taking 6d8 fire damage on a failed save, or half as much damage on a successful one." }
        ],
        treasure: "Belt of Dwarvenkind (Embedded in chest)"
    },
    "xylantropy": {
        name: "Xylantropy (The Void Eye)",
        size: "Large",
        type: "Aberration (Beholder)",
        alignment: "Lawful Evil",
        ac: 20,
        armorType: "Natural Armor + Void Shield",
        hp: 375,
        hitDice: "25d10 + 125",
        speed: "0 ft., fly 40 ft. (hover)",
        stats: { str: 14, dex: 16, con: 20, int: 22, wis: 17, cha: 19 },
        saves: "Int +12, Wis +9, Cha +10",
        skills: "Perception +15, Arcana +12",
        immunities: "Prone, Psychic",
        conditionImmunities: "Charmed, Frightened, Paralyzed",
        senses: "Darkvision 120 ft., Passive Perception 25",
        languages: "Deep Speech, Undercommon, Netherese",
        cr: "18",
        xp: 20000,
        traits: [
            { name: "Antimagic & Void Cone", desc: "150-foot cone. At the start of its turn, Xylantropy decides whether the cone is Antimagic or Void. Void: Creatures in the cone take 4d6 necrotic damage at start of turn and speed is halved." },
            { name: "Vertical Mastery", desc: "Xylantropy can fly vertically without expending movement and has advantage on Dex saves while flying." },
            { name: "Prismatic Weaver", desc: "Xylantropy can focus its eye rays on a single target. If it hits a target with 3+ rays in a turn, the target is banished to the Void (Maze spell) for 1 round." }
        ],
        actions: [
            { name: "Eye Rays", desc: "Shoots four rays at random targets." },
            { name: "Bite", desc: "+8 to hit, reach 5 ft. Hit: 6d6+4 piercing." }
        ],
        legendary: [
            { name: "Magnetic Pulse (2 Actions)", desc: "All creatures in metal armor within 60ft must make DC 18 Str save or be pulled 20ft towards Xylantropy and Restrained." },
            { name: "Void Warp", desc: "Teleport up to 60ft to unoccupied space." }
        ],
        treasure: "Robe of Eyes, Prism of the Void"
    },
    "quenthel": {
        name: "Quenthel Baenre",
        size: "Medium",
        type: "Humanoid (Drow)",
        alignment: "Chaotic Evil",
        ac: 18,
        armorType: "Piwafwi + Chain Mail",
        hp: 220,
        hitDice: "20d8 + 60",
        speed: "30 ft.",
        stats: { str: 12, dex: 18, con: 16, int: 17, wis: 22, cha: 20 },
        saves: "Con +8, Wis +11, Cha +10",
        skills: "Insight +11, Perception +11, Religion +8, Stealth +9",
        immunities: "None",
        senses: "Darkvision 120 ft.",
        languages: "Elvish, Undercommon, Abyssal",
        cr: "15",
        xp: 13000,
        traits: [
            { name: "Fey Ancestry", desc: "Advantage on saves vs charm; magic can't put her to sleep." },
            { name: "Spider Queen's Blessing", desc: "AC includes her Wisdom modifier." },
            { name: "Innate Spellcasting", desc: "At will: Dancing Lights. 1/day: Darkness, Faerie Fire, Levitate." }
        ],
        actions: [
            { name: "Tentacle Rod", desc: "+9 to hit, reach 15 ft. Three attacks. Hit: 1d6+4 bludgeoning. If all 3 hit one target, DC 15 Con save or speed halved + no reactions/bonus actions for 1 min." },
            { name: "Snake Headed Whip", desc: "+9 to hit, reach 10 ft. Hit: 1d6+4 slashing + 3d6 poison." },
            { name: "Summon Yochlol (1/Day)", desc: "Summons a Yochlol demon." }
        ],
        treasure: "Piwafwi (Cloak of Elvenkind), Rod of the Pact Keeper +3"
    },
    "rhaugilath": {
        name: "Rhaugilath (The Ageless)",
        size: "Medium",
        type: "Undead (Lich)",
        alignment: "Train Neutral Evil",
        ac: 17,
        armorType: "Natural Armor",
        hp: 198,
        hitDice: "18d8 + 54",
        speed: "30 ft.",
        stats: { str: 11, dex: 16, con: 16, int: 22, wis: 14, cha: 16 },
        saves: "Con +10, Int +13, Wis +9",
        skills: "Arcana +20, History +20, Insight +9, Perception +9",
        immunities: "Poison; Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Paralyzed, Poisoned",
        senses: "Truesight 120 ft., Passive Perception 19",
        languages: "Common, Draconic, Elvish, Netherese",
        cr: "22",
        xp: 41000,
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeeds on failed save." },
            { name: "Rejuvenation", desc: "If destroyed, regains all HP in 1d10 days unless phylactery (The Nether Scrolls) is destroyed." },
            { name: "Spellcasting", desc: "20th-level spellcaster. Int is spellcasting ability (DC 21, +13 to hit). Cantrips: Mage Hand, Prestidigitation, Ray of Frost. 1st-8th: (Slots as Lich). 9th: Time Stop, Power Word Kill." }
        ],
        actions: [
            { name: "Paralyzing Touch", desc: "+13 to hit, reach 5 ft. Hit: 3d6 cold damage. DC 18 Con save or Paralyzed for 1 min." }
        ],
        legendary: [
            { name: "Cantrip", desc: "Casts a cantrip." },
            { name: "Paralyzing Touch (2 Actions)", desc: "Uses Paralyzing Touch." },
            { name: "Frightening Gaze (2 Actions)", desc: "Fixes gaze on one creature within 10 ft. DC 18 Wis save or Frightened for 1 min." }
        ],
        treasure: "The Nether Scrolls (Artifact), Robe of the Archmagi (Black)"
    },
    "veznan": {
        name: "Vez'nan the Deceiver",
        size: "Medium",
        type: "Humanoid (Human, Netherese)",
        alignment: "Lawful Evil",
        ac: 18,
        armorType: "Robes of the Archmagi",
        hp: 330,
        hitDice: "30d8 + 90",
        speed: "30 ft., fly 60 ft.",
        stats: { str: 10, dex: 14, con: 16, int: 24, wis: 18, cha: 18 },
        saves: "Int +13, Wis +10, Cha +10",
        skills: "Arcana +20, History +20, Deception +10",
        immunities: "Psychic",
        senses: "Truesight 60 ft., Passive Perception 14",
        languages: "Common, Infernal, Draconic, Elvish, Netherese",
        cr: "20",
        xp: 25000,
        traits: [
            { name: "Magic Resistance", desc: "Advantage on saving throws against spells." },
            { name: "Netherese Secrets", desc: "Vez'nan can maintain concentration on two spells at once. If he fails a constitution save, he loses both." },
            { name: "Arcane Absorption (Reaction)", desc: "When targeted by a spell, Vez'nan can absorb it. DC 10 + Spell Level Int check. Success: Spell fails, Vez'nan regains slot or temporary HP." },
            { name: "Spellcasting", desc: "20th-level spellcaster. Int is spellcasting ability (DC 21, +13 to hit). At will: Shield, Misty Step. Spells: Forcecage, Maze, Time Stop, Meteor Swarm, Ravenous Void (9th)." }
        ],
        actions: [
            { name: "Scepter of the Void", desc: "+10 to hit, reach 5 ft. Hit: 2d6+4 bludgeoning + 4d6 necrotic. Target must succeed DC 21 Con save or max HP is reduced." }
        ],
        legendary: [
            { name: "Cast Spell (2 actions)", desc: "Casts a spell of 5th level or lower." },
            { name: "Void Step", desc: "Teleports 60ft and leaves a void zone that deals 4d6 necrotic to area." }
        ],
        treasure: "Scepter of the Void (Unstable Artifact), Robe of the Archmagi"
    },
    "zoltus": {
        name: "Zoltus (Broken Arcanist)",
        size: "Medium",
        type: "Humanoid (High Elf)",
        alignment: "Chaotic Neutral",
        ac: 15,
        armorType: "Mage Armor",
        hp: 198,
        hitDice: "18d8 + 54",
        speed: "30 ft.",
        stats: { str: 10, dex: 14, con: 16, int: 20, wis: 14, cha: 12 },
        saves: "Int +9, Wis +6",
        skills: "Arcana +13, Perception +6",
        immunities: "None",
        senses: "Passive Perception 16",
        languages: "Common, Elvish, Draconic",
        cr: "14",
        xp: 11500,
        traits: [
            { name: "Retributive Strike", desc: "If Zoltus drops to 0 HP, the Staff of Power releases unleashed energy (DC 17 Dex save, 8d6 force damage)." },
            { name: "Spellcasting", desc: "14th-level spellcaster. Int is spellcasting ability (DC 17, +9 to hit). Known: Magic Missile, Lightning Bolt, Wall of Fire, Cone of Cold." }
        ],
        actions: [
            { name: "Staff of Power", desc: "Melee: +8 to hit, 1d6+2 blugeoning + 1d6 force. Spell attack +9. Spells (Charges): Cone of Cold, Fireball, Globe of Invulnerability, Hold Monster, Levitate, Lightning Bolt, Magic Missile, Ray of Enfeeblement, Wall of Force." }
        ],
        treasure: "Staff of Power (Very Rare), Spellbook"
    },
    "ignacio": {
        name: "Ignacio (The Adjuster)",
        size: "Medium",
        type: "Humanoid (Human, Zhentarim)",
        alignment: "Lawful Evil",
        ac: 17,
        armorType: "Studded Leather +2",
        hp: 165,
        hitDice: "22d8 + 66",
        speed: "30 ft.",
        stats: { str: 10, dex: 20, con: 16, int: 18, wis: 16, cha: 18 },
        saves: "Dex +10, Int +9, Cha +9",
        skills: "Deception +14, Insight +13, Persuasion +14, Sleight of Hand +15",
        immunities: "None",
        senses: "Passive Perception 13",
        languages: "Common, Thieves' Cant, Infernal, Undercommon",
        cr: "14",
        xp: 11500,
        traits: [
            { name: "Coin of Fate", desc: "Ignacio flips a coin at the start of his turn. Heads: He crits on 18-20 and has advantage on saves. Tails: The first enemy he hits takes extra 4d6 necrotic damage." },
            { name: "Cunning Action", desc: "Bonus action: Dash, Disengage, Hide." },
            { name: "Evasion", desc: "Half damage on Dex save fail, no damage on success." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three Rapier attacks." },
            { name: "Rapier of Shared Suffering", desc: "+10 to hit, reach 5 ft. Hit: 1d8+5 piercing + 3d6 psychic." },
            { name: "Debt Collection (Recharge 5-6)", desc: "Target one creature within 30ft. DC 18 Cha save. On fail, take psychic damage equal to half the HP the target has lost from its maximum. (Max 60 dmg)." }
        ],
        treasure: "Rapier of Shared Suffering, Coin of Twisted Fate"
    },
    "elias": {
        name: "Elias Thornefield",
        size: "Medium",
        type: "Humanoid (Human)",
        alignment: "Neutral Good",
        ac: 18,
        armorType: "Breastplate + Shield",
        hp: 91,
        hitDice: "14d8 + 28",
        speed: "30 ft.",
        stats: { str: 14, dex: 10, con: 14, int: 12, wis: 18, cha: 14 },
        saves: "Wis +7, Cha +5",
        skills: "History +4, Medicine +7, Persuasion +5",
        immunities: "None",
        senses: "Passive Perception 14",
        languages: "Common, Celestial",
        cr: "5",
        xp: 1800,
        traits: [
            { name: "Sanctuary Aura", desc: "Any enemy targeting Elias or an ally within 10ft must make DC 15 Wis save or lose the attack." },
            { name: "Spellcasting", desc: "9th level Cleric (Life). Wis DC 15. Slots: 1st-5th. Prepared: Cure Wounds, Revivify, Spirit Guardians, Greater Restoration." }
        ],
        actions: [
            { name: "Mace", desc: "+5 to hit, 1d6+2 bludgeoning." }
        ],
        treasure: "Amulet of the Keeper"
    },
    "korgul": {
        name: "Korgul 'The Vulture'",
        size: "Medium",
        type: "Humanoid (Half-Orc)",
        alignment: "Neutral Evil",
        ac: 16,
        armorType: "Chain Mail",
        hp: 112,
        hitDice: "15d8 + 45",
        speed: "30 ft.",
        stats: { str: 18, dex: 12, con: 16, int: 10, wis: 12, cha: 10 },
        saves: "Con +6, Str +7",
        skills: "Survival +7, Intimidation +6",
        immunities: "None",
        senses: "Darkvision 60 ft.",
        languages: "Common, Orc",
        cr: "7",
        xp: 2900,
        traits: [
            { name: "Carrion Feeder", desc: "When a creature within 30ft dies, Korgul regains 15 HP." },
            { name: "Relentless Endurance (1/day)", desc: "Drops to 1 HP instead of 0." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Greataxe attacks." },
            { name: "Greataxe", desc: "+7 to hit, 1d12+4 slashing + 1d6 poison (coated)." },
            { name: "Pocket Sand (Recharge 5-6)", desc: "15 ft cone. DC 14 Dex save or Blinded for 1 round." }
        ],
        treasure: "Pouch of Gemstones"
    },
    "pereghost": {
        name: "The Pereghost",
        size: "Medium",
        type: "Humanoid (Human)",
        alignment: "Lawful Evil",
        ac: 20,
        armorType: "White Plate +1",
        hp: 170,
        hitDice: "20d8 + 80",
        speed: "30 ft.",
        stats: { str: 20, dex: 10, con: 18, int: 16, wis: 14, cha: 16 },
        saves: "Str +9, Con +8, Wis +6",
        skills: "Athletics +9, History +7",
        immunities: "None",
        senses: "Passive Perception 12",
        languages: "Common, Netherese",
        cr: "12",
        xp: 8400,
        traits: [
            { name: "Ghost in the Steel", desc: "Pereghost can move through creatures and objects as if they were difficult terrain. He takes 1d10 force damage if he ends his turn inside an object." },
            { name: "Tactical Command", desc: "Allies within 30ft gain +2 to hit." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three attacks with Ethereal Greatsword." },
            { name: "Ethereal Greatsword", desc: "+10 to hit, reach 5 ft. Hit: 2d6+5 slashing + 2d8 force." }
        ],
        treasure: "White Plate of the Ghost"
    },
    "goristroi": {
        name: "Goristroi (The Lost)",
        size: "Huge",
        type: "Undead (Ghost)",
        alignment: "Chaotic Evil",
        ac: 13,
        armorType: "Natural Armor",
        hp: 184,
        hitDice: "16d12 + 80",
        speed: "0 ft., fly 40 ft. (hover)",
        stats: { str: 24, dex: 10, con: 20, int: 6, wis: 10, cha: 16 },
        saves: "Con +9, Cha +7",
        skills: "Intimidation +7",
        immunities: "Cold, Necrotic, Poison; Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Grappled, Paralyzed, Petrified, Poisoned, Prone, Restrained",
        senses: "Darkvision 60 ft.",
        languages: "Giant, Abyssal",
        cr: "12",
        xp: 8400,
        traits: [
            { name: "Incorporeal Movement", desc: "Can move through objects/creatures." },
            { name: "Ethereal Sight", desc: "Can see into Ethereal Plane." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Slam attacks." },
            { name: "Slam", desc: "+11 to hit, reach 10 ft. Hit: 4d8+7 necrotic." }
        ]
    },
    "jorum": {
        name: "Jorum the Barbarian",
        size: "Medium",
        type: "Humanoid (Human)",
        alignment: "Chaotic Neutral",
        ac: 17,
        armorType: "Unarmored Defense",
        hp: 161,
        hitDice: "14d12 + 70",
        speed: "40 ft.",
        stats: { str: 20, dex: 16, con: 20, int: 8, wis: 12, cha: 10 },
        saves: "Str +9, Con +9",
        skills: "Athletics +9, Survival +5",
        immunities: "None",
        senses: "Passive Perception 11",
        languages: "Common",
        cr: "10",
        xp: 5900,
        traits: [
            { name: "Reckless Attack", desc: "Advantage on attacks, attacks against him have advantage." },
            { name: "Undying Rage (3/day)", desc: "If reduced to 0 HP, DC 10 Con save to drop to 1 HP instead." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three Greataxe attacks." },
            { name: "Twin Greataxe", desc: "+9 to hit. Hit: 1d12+5 slashing + 1d6 cold." }
        ]
    },
    "yazmina": {
        name: "Yaz'mina the Witch",
        size: "Medium",
        type: "Humanoid (Elf)",
        alignment: "Chaotic Evil",
        ac: 15,
        armorType: "Mage Armor",
        hp: 110,
        hitDice: "20d8 + 20",
        speed: "30 ft.",
        stats: { str: 8, dex: 16, con: 12, int: 14, wis: 12, cha: 20 },
        saves: "Con +5, Cha +9",
        skills: "Deception +9, Stealth +7",
        immunities: "None",
        senses: "Darkvision 120 ft.",
        languages: "Common, Elvish, Sylvan",
        cr: "11",
        xp: 7200,
        traits: [
            { name: "Hound of Ill Omen", desc: "Bonus action: Summon a shadow hound to harass a target (Advantage on attacks vs target while hound is adjacent)." },
            { name: "Spellcasting", desc: "11th level Sorcerer. Cha DC 17. Spells: Greater Invisibility, Shadow Blade, Synaptic Static, Confusion." }
        ],
        actions: [
            { name: "Shadow Bolt", desc: "+9 to hit, 120 ft. Hit: 4d8 psychic." }
        ]
    },
    "gravel_mouth": {
        name: "Gravel Mouth",
        size: "Large",
        type: "Elemental (Earth)",
        alignment: "Neutral",
        ac: 18,
        armorType: "Natural Armor",
        hp: 168,
        hitDice: "16d10 + 80",
        speed: "30 ft., burrow 30 ft.",
        stats: { str: 22, dex: 8, con: 20, int: 10, wis: 10, cha: 12 },
        saves: "Str +10, Con +9",
        skills: "Athletics +10",
        immunities: "Poison",
        senses: "Tremorsense 60 ft.",
        languages: "Terran, Common",
        cr: "11",
        xp: 7200,
        traits: [
            { name: "Earth Glide", desc: "Can burrow through nonmagical unworked earth and stone without disturbing it." },
            { name: "Siege Monster", desc: "Double damage to objects and structures." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Slam attacks." },
            { name: "Slam", desc: "+10 to hit, reach 10 ft. Hit: 3d8+6 bludgeoning." }
        ]
    },
    "ignis_void": {
        name: "Ignis-Void (Elemental)",
        size: "Huge",
        type: "Elemental",
        alignment: "Chaotic Evil",
        ac: 19,
        armorType: "Natural Armor",
        hp: 250,
        hitDice: "20d12 + 120",
        speed: "50 ft., fly 50 ft.",
        stats: { str: 21, dex: 22, con: 22, int: 6, wis: 10, cha: 10 },
        saves: "Dex +11, Con +11",
        skills: "Perception +9, Intimidation +10",
        immunities: "Fire, Cold, Poison",
        senses: "Darkvision 120 ft.",
        languages: "Ignan",
        cr: "16",
        xp: 15000,
        traits: [
            { name: "Freezing Burn", desc: "Its fire deals half Fire and half Cold damage (necrotic frost)." },
            { name: "Void Aura", desc: "Start of turn within 10ft: 2d10 Cold damage." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two Slam attacks." },
            { name: "Slams", desc: "+11 to hit, reach 15ft. Hit: 4d8+6 fire/cold damage." },
            { name: "Nova (Recharge 5-6)", desc: "60ft radius. DC 19 Dex save. 10d6 Fire + 10d6 Cold." }
        ]
    },
    "lolth_avatar": {
        name: "Avatar of Lolth (Spider Queen)",
        size: "Gargantuan",
        type: "Fiend (Demon)",
        alignment: "Chaotic Evil",
        ac: 24,
        armorType: "Natural Armor",
        hp: 580,
        hitDice: "24d20 + 240",
        speed: "50 ft., climb 50 ft., fly 60 ft.",
        stats: { str: 26, dex: 24, con: 30, int: 26, wis: 24, cha: 28 },
        saves: "Dex +14, Con +17, Wis +14, Cha +16",
        skills: "Deception +16, Insight +14, Perception +14, Stealth +14",
        immunities: "Poison, Cold, Acid/Fire (Variable); Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Poisoned",
        senses: "Truesight 120 ft., Passive Perception 24",
        languages: "All, Telepathy 120 ft.",
        cr: "30",
        xp: 155000,
        traits: [
            { name: "Legendary Resistance (5/Day)", desc: "Succeeds on failed save." },
            { name: "Magic Resistance", desc: "Advantage on saves vs spells." },
            { name: "Spider Queen's Web", desc: "Terrain in a 120ft radius is difficult terrain (webs). Lolth ignores this. Creatures starting turn in webs must succeed DC 24 Dex save or be Restrained." },
            { name: "Divinity", desc: "Lolth cannot be killed unless her connection to the Demonweb Pits is severed. If reduced to 0 HP, she reforms in 1d10 days." },
            { name: "Spellcasting", desc: "Innate. DC 24. At will: Web, Darkness, Dispel Magic. 3/day: Divine Word, Teleport, Power Word Stun. 1/day: Gate, Time Stop." }
        ],
        actions: [
            { name: "Multiattack", desc: "Uses Frightful Presence. Makes one Bite and two Foreleg Strike attacks. or casts a spell." },
            { name: "Bite", desc: "+17 to hit, reach 10ft. Hit: 4d10+8 piercing + 6d8 poison. Target must succeed DC 25 Con save or be Poisoned and Paralyzed for 1 minute." },
            { name: "Foreleg Strike", desc: "+17 to hit, reach 20ft. Hit: 4d8+8 piercing. Target is Grappled (escape DC 23)." },
            { name: "Venom Spray (Recharge 5-6)", desc: "90ft cone. DC 25 Con save. Hit: 20d6 poison damage. Halved on success. Creatures failing by 5+ are Blinded." },
            { name: "Summon Children (1/Day)", desc: "Summons 1d4 Yochlols or 2d4 Draegloths. They appear in unoccupied spaces within 60ft." }
        ],
        legendary: [
            { name: "Teleport", desc: "Teleports up to 120ft." },
            { name: "Cast Spell (Costs 2 Actions)", desc: "Casts a spell." },
            { name: "Web Lash (Costs 2 Actions)", desc: "+17 to hit, reach 60ft. One creature is pulled 50ft towards Lolth and Restrained." },
            { name: "Divine Command (Costs 3 Actions)", desc: "Lolth chooses one creature within 60ft. DC 24 Wis save. Failure: Creature uses its reaction to attack an ally of Lolth's choice." }
        ],
        treasure: "Divine Spark (Story Item), Blood of a God"
    }
};

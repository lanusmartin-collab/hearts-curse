import { Statblock } from "./statblocks";

export const SRD_MONSTERS: Record<string, Statblock> = {
    "aboleth": {
        name: "Aboleth", size: "Large", type: "Aberration", alignment: "Lawful Evil",
        ac: 17, armorType: "Natural Armor", hp: 135, hitDice: "18d10 + 36", speed: "10 ft., swim 40 ft.",
        stats: { str: 21, dex: 9, con: 15, int: 18, wis: 15, cha: 18 },
        saves: "Con +6, Int +8, Wis +6", skills: "History +12, Perception +10",
        immunities: "", languages: "Deep Speech, Telepathy 120 ft.",
        cr: "10", xp: 5900,
        traits: [
            { name: "Amphibious", desc: "Can breathe air and water." },
            { name: "Mucous Cloud", desc: "While underwater, a 5-foot-radius cloud surrounds the aboleth. Touching it requires a DC 14 Con save or become diseased (1d4 hours air breathing only)." }
        ],
        actions: [
            { name: "Multiattack", desc: "Three tentacle attacks." },
            { name: "Tentacle", desc: "+9 to hit, reach 10ft. Hit: 2d6+5 bludgeoning. Target must succeed DC 14 Con save or become diseased." },
            { name: "Tail", desc: "+9 to hit, reach 10ft. Hit: 3d6+5 bludgeoning." }
        ],
        legendary: [
            { name: "Detect", desc: "Make a Perception check." },
            { name: "Tail Swipe", desc: "Make one tail attack." },
            { name: "Psychic Drain (Costs 2 actions)", desc: "One creature charmed by aboleth takes 3d6 psychic damage, aboleth regains HP." }
        ]
    },
    "balor": {
        name: "Balor", size: "Huge", type: "Fiend (Demon)", alignment: "Chaotic Evil",
        ac: 19, armorType: "Natural Armor", hp: 262, hitDice: "21d12 + 126", speed: "40 ft., fly 80 ft.",
        stats: { str: 26, dex: 15, con: 22, int: 20, wis: 16, cha: 22 },
        saves: "Str +14, Con +12, Wis +9, Cha +12", skills: "",
        immunities: "Fire, Poison", languages: "Abyssal, Telepathy 120 ft.",
        cr: "19", xp: 22000,
        traits: [
            { name: "Death Throes", desc: "Explodes when dies. 70 damage (fire) to all within 30ft (DC 20 Dex half)." },
            { name: "Fire Aura", desc: "Start turn within 5ft takes 3d6 fire damage." }
        ],
        actions: [
            { name: "Multiattack", desc: "One Longsword, one Whip." },
            { name: "Longsword", desc: "+14 to hit, reach 10ft. Hit: 3d8+8 slashing + 3d8 lightning." },
            { name: "Whip", desc: "+14 to hit, reach 30ft. Hit: 2d6+8 slashing + 3d6 fire. Pulls target 25ft." }
        ]
    },
    "black_dragon_adult": {
        name: "Adult Black Dragon", size: "Huge", type: "Dragon", alignment: "Chaotic Evil",
        ac: 19, armorType: "Natural Armor", hp: 195, hitDice: "17d12 + 85", speed: "40 ft., fly 80 ft., swim 40 ft.",
        stats: { str: 23, dex: 14, con: 21, int: 14, wis: 13, cha: 17 },
        saves: "Dex +7, Con +10, Wis +6, Cha +8", skills: "Perception +11, Stealth +7",
        immunities: "Acid", languages: "Common, Draconic",
        cr: "14", xp: 11500,
        image: "https://www.aidedd.org/monster/img/black-dragon.jpg",
        traits: [{ name: "Amphibious", desc: "Breathes air and water." }],
        actions: [
            { name: "Multiattack", desc: "Frightful Presence, then one Bite and two Claws." },
            { name: "Acid Breath (Recharge 5-6)", desc: "60ft line. DC 18 Dex save, 12d8 acid damage." }
        ],
        legendary: [{ name: "Wing Attack (2 actions)", desc: "Beat wings, creatures within 15ft DC 19 Dex save or prone." }]
    },
    // ... (keep other existing entries unmodified) ...

    "air_elemental": {
        name: "Air Elemental", size: "Large", type: "Elemental", alignment: "Neutral",
        ac: 15, armorType: "Natural Armor", hp: 90, hitDice: "12d10 + 24", speed: "0 ft., fly 90 ft. (hover)",
        stats: { str: 14, dex: 20, con: 14, int: 6, wis: 10, cha: 6 },
        saves: "", skills: "", immunities: "Poison", languages: "Auran",
        cr: "5", xp: 1800,
        image: "https://www.aidedd.org/monster/img/air-elemental.jpg",
        traits: [
            { name: "Air Form", desc: "Can enter a hostile creature's space and stop there. Move through a space as narrow as 1 inch wide without squeezing." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two slam attacks." },
            { name: "Slam", desc: "+8 to hit, 2d8+5 bludgeoning." },
            { name: "Whirlwind (Recharge 4-6)", desc: "Each creature in creature's space DC 13 Str save or 3d8+2 bludgeoning + flung 20ft." }
        ]
    },
    "ancient_gold_dragon": {
        name: "Ancient Gold Dragon", size: "Gargantuan", type: "Dragon", alignment: "Lawful Good",
        ac: 22, armorType: "Natural Armor", hp: 546, hitDice: "28d20 + 252", speed: "40 ft., fly 80 ft., swim 40 ft.",
        stats: { str: 30, dex: 14, con: 29, int: 18, wis: 17, cha: 28 },
        saves: "Dex +9, Con +16, Wis +10, Cha +16", skills: "Insight +10, Perception +17, Persuasion +16, Stealth +9",
        immunities: "Fire", languages: "Common, Draconic",
        cr: "24", xp: 62000,
        image: "https://www.aidedd.org/monster/img/gold-dragon-ancient.jpg",
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeed failed save." },
            { name: "Amphibious", desc: "Breathe air and water." }
        ],
        actions: [
            { name: "Multiattack", desc: "Presence, Bite, two Claws." },
            { name: "Bite", desc: "+17 to hit, 2d10+10 piercing." },
            { name: "Claws", desc: "+17 to hit, 2d6+10 slashing." },
            { name: "Breath Weapons (Recharge 5-6)", desc: "Fire Breath (90ft cone, 13d10 fire) or Weakening Breath." }
        ]
    },
    "ancient_red_dragon": {
        name: "Ancient Red Dragon", size: "Gargantuan", type: "Dragon", alignment: "Chaotic Evil",
        ac: 22, armorType: "Natural Armor", hp: 546, hitDice: "28d20 + 252", speed: "40 ft., climb 40 ft., fly 80 ft.",
        stats: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
        saves: "Dex +7, Con +16, Wis +9, Cha +13", skills: "Perception +16, Stealth +7",
        immunities: "Fire", languages: "Common, Draconic",
        cr: "24", xp: 62000,
        image: "https://www.aidedd.org/monster/img/red-dragon-ancient.jpg",
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeed failed save." }
        ],
        actions: [
            { name: "Multiattack", desc: "Presence, Bite, two Claws." },
            { name: "Bite", desc: "+17 to hit, 2d10+10 piercing + 4d6 fire." },
            { name: "Claws", desc: "+17 to hit, 2d6+10 slashing." },
            { name: "Fire Breath (Recharge 5-6)", desc: "90ft cone DC 24 Dex, 26d6 fire." }
        ]
    },
    "ancient_silver_dragon": {
        name: "Ancient Silver Dragon", size: "Gargantuan", type: "Dragon", alignment: "Lawful Good",
        ac: 22, armorType: "Natural Armor", hp: 487, hitDice: "25d20 + 225", speed: "40 ft., fly 80 ft.",
        stats: { str: 30, dex: 10, con: 29, int: 18, wis: 15, cha: 23 },
        saves: "Dex +7, Con +16, Wis +9, Cha +13", skills: "Arcana +11, History +11, Perception +16, Stealth +7",
        immunities: "Cold", languages: "Common, Draconic",
        cr: "23", xp: 50000,
        image: "https://www.aidedd.org/monster/img/silver-dragon-ancient.jpg",
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeed failed save." }
        ],
        actions: [
            { name: "Multiattack", desc: "Presence, Bite, two Claws." },
            { name: "Bite", desc: "+17 to hit, 2d10+10 piercing." },
            { name: "Claws", desc: "+17 to hit, 2d6+10 slashing." },
            { name: "Breath Weapons (Recharge 5-6)", desc: "Cold Breath (90ft cone, 15d8 cold) or Paralyzing Breath." }
        ]
    },
    "gelatinous_cube": {
        name: "Gelatinous Cube", size: "Large", type: "Ooze", alignment: "Unaligned",
        ac: 6, armorType: "None", hp: 84, hitDice: "8d10+40", speed: "15 ft.",
        stats: { str: 14, dex: 3, con: 20, int: 1, wis: 6, cha: 1 },
        saves: "", skills: "", immunities: "Acid", languages: "--",
        cr: "2", xp: 450,
        traits: [{ name: "Transparent", desc: "DC 15 Perception to spot. Otherwise surprise." }],
        actions: [
            { name: "Pseudopod", desc: "+4 to hit, 3d6 acid." },
            { name: "Engulf", desc: "DC 12 Dex save or be engulfed (restrained, 6d6 acid/turn)." }
        ]
    },
    "lich": {
        name: "Lich", size: "Medium", type: "Undead", alignment: "Any Evil",
        ac: 17, armorType: "Natural Armor", hp: 135, hitDice: "18d8+54", speed: "30 ft.",
        stats: { str: 11, dex: 16, con: 16, int: 20, wis: 14, cha: 16 },
        saves: "Con +10, Int +12, Wis +9", skills: "Arcana +19, History +12",
        immunities: "Poison; Bludgeoning, Piercing, Slashing from nonmagical", languages: "Common plus 5 others",
        cr: "21", xp: 33000,
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "Succeed failed save." },
            { name: "Rejuvenation", desc: "If phylactery exists, regains body in 1d10 days." }
        ],
        actions: [
            { name: "Paralyzing Touch", desc: "Melee Spell Attack: +12 to hit, 3d6 cold. DC 18 Con save or paralyzed." }
        ],
        legendary: [
            { name: "Cast Spell (1-3 actions)", desc: "Uses spell slot." },
            { name: "Frightening Gaze (2 actions)", desc: "Fix gaze, DC 18 Wis save or frightened." }
        ]
    },
    "tarrasque": {
        name: "Tarrasque", size: "Gargantuan", type: "Monstrosity", alignment: "Unaligned",
        ac: 25, armorType: "Natural Armor", hp: 676, hitDice: "33d20 + 330", speed: "40 ft.",
        stats: { str: 30, dex: 11, con: 30, int: 3, wis: 11, cha: 11 },
        saves: "Int +5, Wis +9, Cha +9", skills: "",
        immunities: "Fire, Poison; Bludgeoning, Piercing, Slashing from nonmagical", languages: "--",
        cr: "30", xp: 155000,
        traits: [
            { name: "Reflective Carapace", desc: "Reflects Magic Missile, lines, and cones (1-6 d6 roll)." }
        ],
        actions: [
            { name: "Multiattack", desc: "Use Frightful Presence, then five attacks: one bite, two claws, one horns, one tail." },
            { name: "Bite", desc: "+19 to hit, 4d12+10 piercing. Restrained if Huge or smaller." },
            { name: "Tail", desc: "+19 to hit, 4d6+10 bludgeoning. Prone if DC 20 Str fail." }
        ],
        legendary: [
            { name: "Move", desc: "Moves half speed." },
            { name: "Chomp (2 actions)", desc: "One bite attack or swallow." }
        ]
    },
    "wraith": {
        name: "Wraith", size: "Medium", type: "Undead", alignment: "Neutral Evil",
        ac: 13, armorType: "None", hp: 67, hitDice: "9d8+27", speed: "0 ft., fly 60 ft. (hover)",
        stats: { str: 6, dex: 16, con: 16, int: 12, wis: 14, cha: 15 },
        saves: "", skills: "", immunities: "Necrotic, Poison", languages: "The languages it knew in life",
        cr: "5", xp: 1800,
        traits: [
            { name: "Incorporeal Movement", desc: "Move through objects/creatures. 1d10 force dmg if ending turn inside." },
            { name: "Sunlight Sensitivity", desc: "Disadvantage under sunlight." }
        ],
        actions: [
            { name: "Life Drain", desc: "+6 to hit, 4d8+3 necrotic. Target HP max reduced by dmg taken. Dies if 0." },
            { name: "Create Specter", desc: "Target humanoid slain by Life Drain rises as Specter in 1d4 rounds." }
        ]
    },
    "chimera": {
        name: "Chimera", size: "Large", type: "Monstrosity", alignment: "Chaotic Evil",
        ac: 14, armorType: "Natural Armor", hp: 114, hitDice: "12d10 + 48", speed: "30 ft., fly 60 ft.",
        stats: { str: 19, dex: 11, con: 19, int: 3, wis: 14, cha: 10 },
        saves: "", skills: "Perception +8", immunities: "", languages: "Draconic",
        cr: "6", xp: 2300,
        traits: [],
        actions: [
            { name: "Multiattack", desc: "Three attacks: Bite, Horns, Claws. Fire Breath acts as Bite replacement." },
            { name: "Bite", desc: "+7 to hit, 2d6+4 piercing." },
            { name: "Horns", desc: "+7 to hit, 1d12+4 bludgeoning." },
            { name: "Claws", desc: "+7 to hit, 2d6+4 slashing." },
            { name: "Fire Breath (Recharge 5-6)", desc: "15ft cone. DC 15 Dex save, 7d8 fire damage (half on success)." }
        ]
    },
    "cockatrice": {
        name: "Cockatrice", size: "Small", type: "Monstrosity", alignment: "Unaligned",
        ac: 11, armorType: "None", hp: 27, hitDice: "6d6 + 6", speed: "20 ft., fly 40 ft.",
        stats: { str: 6, dex: 12, con: 12, int: 2, wis: 13, cha: 5 },
        saves: "", skills: "", immunities: "", languages: "--",
        cr: "1/2", xp: 100,
        traits: [],
        actions: [
            { name: "Bite", desc: "+3 to hit, 1d4+1 piercing. Target must succeed DC 11 Con save or be Petrification (Restrained, then stone 24h)." }
        ]
    },
    "cyclops": {
        name: "Cyclops", size: "Huge", type: "Giant", alignment: "Chaotic Neutral",
        ac: 14, armorType: "Natural Armor", hp: 138, hitDice: "12d12 + 60", speed: "30 ft.",
        stats: { str: 22, dex: 11, con: 20, int: 8, wis: 6, cha: 10 },
        saves: "", skills: "", immunities: "", languages: "Giant",
        cr: "6", xp: 2300,
        traits: [{ name: "Poor Depth Perception", desc: "Disadvantage on attacks > 30ft away." }],
        actions: [
            { name: "Multiattack", desc: "Two greatclub attacks." },
            { name: "Greatclub", desc: "+9 to hit, reach 10ft. Hit: 3d8+6 bludgeoning." },
            { name: "Rock", desc: "+9 to hit, range 30/120. Hit: 4d10+6 bludgeoning." }
        ]
    },
    "darkmantle": {
        name: "Darkmantle", size: "Small", type: "Monstrosity", alignment: "Unaligned",
        ac: 11, armorType: "None", hp: 22, hitDice: "5d6 + 5", speed: "10 ft., fly 30 ft.",
        stats: { str: 16, dex: 12, con: 13, int: 2, wis: 10, cha: 5 },
        saves: "", skills: "Stealth +3", immunities: "", languages: "--",
        cr: "1/2", xp: 100,
        traits: [
            { name: "Echolocation", desc: "No blindsight if deafened." },
            { name: "False Appearance", desc: "Looks like stalactite while still." }
        ],
        actions: [
            { name: "Crush", desc: "+5 to hit, 1d6+3 bludgeoning. Attaches to target (blinded/suffocating)." },
            { name: "Darkness Aura (1/Day)", desc: "15ft radius magical darkness for 10 min." }
        ]
    },
    "doppelganger": {
        name: "Doppelganger", size: "Medium", type: "Monstrosity (Shapechanger)", alignment: "Neutral",
        ac: 14, armorType: "None", hp: 52, hitDice: "8d8 + 16", speed: "30 ft.",
        stats: { str: 11, dex: 18, con: 14, int: 11, wis: 12, cha: 14 },
        saves: "", skills: "Deception +6, Insight +3", immunities: "", languages: "Common",
        cr: "3", xp: 700,
        traits: [
            { name: "Shapechanger", desc: "Polymorph into Small/Medium humanoid." },
            { name: "Ambusher", desc: "Advantage on attack vs surprised creatures." },
            { name: "Surprise Attack", desc: "Extra 3d6 damage on first hit vs surprised target." }
        ],
        actions: [
            { name: "Multiattack", desc: "Two melee attacks." },
            { name: "Slam", desc: "+6 to hit, 1d6+4 bludgeoning." },
            { name: "Read Thoughts", desc: "Read surface thoughts 60ft. Advantage on Insight/Deception vs target." }
        ]
    },
    "drider": {
        name: "Drider", size: "Large", type: "Monstrosity", alignment: "Chaotic Evil",
        ac: 19, armorType: "Natural Armor", hp: 123, hitDice: "13d10+52", speed: "30 ft., climb 30 ft.",
        stats: { str: 16, dex: 16, con: 18, int: 13, wis: 14, cha: 12 },
        saves: "", skills: "Perception +5, Stealth +9", immunities: "", languages: "Elvish, Undercommon",
        cr: "6", xp: 2300,
        traits: [
            { name: "Fey Ancestry", desc: "Advantage vs Charm, no sleep." },
            { name: "Spider Climb", desc: "Climb difficult surfaces without check." },
            { name: "Sunlight Sensitivity", desc: "Disadvantage in sunlight." },
            { name: "Innate Spellcasting", desc: "Dancing Lights (at will), Darkness/Faerie Fire (1/day)." },
            { name: "Spellcasting", desc: "The drider is a 7th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). It has the following spells prepared:\nCantrips (at will): poison spray, thaumaturgy, mage hand, ray of frost\n1st level (4 slots): bane, detect magic, sanctuary, magic missile, shield\n2nd level (3 slots): hold person, silence, web, invisibility\n3rd level (3 slots): clairvoyance, dispel magic, fireball, lightning bolt\n4th level (1 slot): freedom of movement, greater invisibility" }
        ],
        actions: [
            { name: "Multiattack", desc: "Three attacks (Longsword/Longbow). One can be Bite." },
            { name: "Bite", desc: "+6 to hit, 1d4 piercing + 2d8 poison." },
            { name: "Longsword", desc: "+6 to hit, 1d8+3 slashing (1d10 two-handed)." },
            { name: "Longbow", desc: "+6 to hit, 150/600, 1d8+3 piercing + 1d8 poison." }
        ]
    },
    "dryad": {
        name: "Dryad", size: "Medium", type: "Fey", alignment: "Neutral",
        ac: 11, armorType: "None (16 Barkskin)", hp: 22, hitDice: "5d8", speed: "30 ft.",
        stats: { str: 10, dex: 12, con: 11, int: 14, wis: 15, cha: 18 },
        saves: "", skills: "Perception +4, Stealth +5", immunities: "", languages: "Elvish, Sylvan",
        cr: "1", xp: 200,
        traits: [
            { name: "Magic Resistance", desc: "Advantage on saves vs spells." },
            { name: "Tree Stride", desc: "Step into tree, emerge from another 60ft away." },
            { name: "Innate Casting", desc: "Druidcraft, Entangle, Goodberry, Barkskin, Pass Without Trace, Shillelagh." }
        ],
        actions: [
            { name: "Club", desc: "+2 to hit (+4 with Shillelagh), 1d4 (1d8+4) bludgeoning." },
            { name: "Fey Charm", desc: "Target humanoid/beast 30ft. DC 14 Wis save or charmed." }
        ]
    },
    "ettercap": {
        name: "Ettercap", size: "Medium", type: "Monstrosity", alignment: "Neutral Evil",
        ac: 13, armorType: "Natural Armor", hp: 44, hitDice: "8d8+8", speed: "30 ft., climb 30 ft.",
        stats: { str: 14, dex: 15, con: 13, int: 7, wis: 12, cha: 8 },
        saves: "", skills: "Perception +3, Stealth +4, Survival +3", immunities: "", languages: "--",
        cr: "2", xp: 450,
        traits: [
            { name: "Web Sense", desc: "Sense movement on webs." },
            { name: "Spider Climb", desc: "Climb walls/ceilings." }
        ],
        actions: [
            { name: "Multiattack", desc: "Bite and Claws." },
            { name: "Bite", desc: "+4 to hit, 1d8+2 piercing + 1d8 poison (DC 11 Con save)." },
            { name: "Claws", desc: "+4 to hit, 2d4+2 slashing." },
            { name: "Web (Recharge 5-6)", desc: "Ranged +4 vs Large or small. Restrained (Escape DC 11)." }
        ]
    },
    "gargoyle": {
        name: "Gargoyle", size: "Medium", type: "Elemental", alignment: "Chaotic Evil",
        ac: 15, armorType: "Natural Armor", hp: 52, hitDice: "7d8+21", speed: "30 ft., fly 60 ft.",
        stats: { str: 15, dex: 11, con: 16, int: 6, wis: 11, cha: 7 },
        saves: "", skills: "", immunities: "Poison", languages: "Terran",
        cr: "2", xp: 450,
        traits: [{ name: "False Appearance", desc: "Statue when still." }],
        actions: [
            { name: "Multiattack", desc: "Bite and Claws." },
            { name: "Bite", desc: "+4 to hit, 1d6+2 piercing." },
            { name: "Claws", desc: "+4 to hit, 1d6+2 slashing." }
        ]
    },
    "ghast": {
        name: "Ghast", size: "Medium", type: "Undead", alignment: "Chaotic Evil",
        ac: 13, armorType: "None", hp: 36, hitDice: "8d8", speed: "30 ft.",
        stats: { str: 16, dex: 17, con: 10, int: 11, wis: 10, cha: 8 },
        saves: "", skills: "", immunities: "Poison", languages: "Common",
        cr: "2", xp: 450,
        traits: [
            { name: "Stench", desc: "5ft radius. DC 10 Con save or Poisoned." },
            { name: "Turning Defiance", desc: "Advantage on saves vs Turning." }
        ],
        actions: [
            { name: "Bite", desc: "+3 to hit, 2d8+3 piercing." },
            { name: "Claws", desc: "+5 to hit, 2d6+3 slashing. DC 10 Con save or Paralyzed 1 minute." }
        ]
    }
};

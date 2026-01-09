export const PROLOGUE_POWERS = {
    title: "Prologue Powers",
    bonuses: [
        "Level 10: Retain one Feat from previous life.",
        "Level 15: +2 to one Ability Score (Max 22).",
        "Level 20: One Epic Boon."
    ]
};

export const CURSE_MECHANICS = {
    description: "A magical affliction that drains the life force of its victims over 21 days.", // [NEW] Added for Campaign Book
    stages: [
        { day: 3, name: "The Hollow ache", effect: "Cannot regain Hit Dice on Long Rest." },
        { day: 7, name: "The Fading Color", effect: "Disadvantage on Cha checks. Vision limited to 60ft (colorblind)." },
        { day: 14, name: "The Whispering Void", effect: "Must make DC 15 Wis save to wake up. Fail = 1 Exhaustion." },
        { day: 21, name: "Heart Failure", effect: "Max HP reduces by 1d10 every dawn. Death = Rise as Wraith." }
    ]
};

export const SAFE_HAVEN = {
    title: "The Sunken Crypt",
    features: [
        "Located beneath The Drowned Tankard.",
        "Blocks all Scrying sensors.",
        "Long Rests are safe here.",
        "Time passes at 1/2 speed relative to the surface."
    ]
};

// [NEW] Version 4.0 Mechanics

export const SILENT_WARDS_MECHANIC = {
    title: "The Silent Wards (Layer 1)",
    description: "A labyrinth of polished Mithral. The walls shift position based on the Initiative count.",
    trigger: "On Initiative Count 20 (Losing ties), roll 1d6.",
    table: [
        { d6: "1-2", effect: "Clockwise Rotation: The entire room rotates 90 degrees. PCs must succeed DC 15 Dex save or fall prone/slide 10ft." },
        { d6: "3-4", effect: "Wall Shift: Interior walls retract or extend. Cover changes from 1/2 to Full, or Vice Versa." },
        { d6: "5", effect: "Mithral Resonance: A deafening hum. All creatures take 2d6 Thunder damage. Spellcasters must succeed Con save to maintain concentration." },
        { d6: "6", effect: "Silence: The room is under the effect of a Silence spell until the next Count 20." }
    ]
};

export const WILD_MAGIC_TABLE = {
    title: "Netherese Wild Magic Surge",
    description: "When a spell of 1st level or higher is cast, roll d20. On a 1, roll on this table.",
    d100: [
        { roll: "01-05", effect: "Gravity reverses in a 30ft radius for 1 minute." },
        { roll: "06-10", effect: "Caster casts 'Blur' on themselves." },
        { roll: "11-15", effect: "1d4 hostile Shadows appear next to the caster." },
        { roll: "16-20", effect: "Caster regains one expended spell slot of the lowest level." },
        { roll: "21-25", effect: "All light sources within 60ft carry the properties of magical darkness for 1 minute." },
        { roll: "26-30", effect: "Caster teleports 60ft to an unoccupied space they can see." },
        { roll: "31-35", effect: "A random creature within 30ft becomes frightened of the caster for 1 minute." },
        { roll: "36-40", effect: "Caster turns into a potted plant (Petrified) until the start of their next turn." },
        { roll: "41-45", effect: "Action Surge: Caster gains one additional action immediately." },
        { roll: "46-50", effect: "Necrotic Pulse: All creatures within 30ft take 1d10 Necrotic damage." },
        { roll: "51-55", effect: "Caster speaks only in Netherese (Abyssal) for 1 hour." },
        { roll: "56-60", effect: "Maximize Damage: The spell deals maximum possible damage." },
        { roll: "61-65", effect: "Spell reflects: Target changes to a random creature within range." },
        { roll: "66-70", effect: "Time Stop: Time stops for 1 round (everyone skips turn except caster)." },
        { roll: "71-75", effect: "Caster becomes invisible for 1 minute." },
        { roll: "76-80", effect: "Polymorph: Caster turns into a Nothic for 1 hour." },
        { roll: "81-85", effect: "Vulnerability: Caster becomes vulnerable to all damage for 1 round." },
        { roll: "86-90", effect: "Mirror Image: 3 duplicates appear." },
        { roll: "91-95", effect: "Lich touch: Caster's next melee attack deals extra 4d6 Cold damage." },
        { roll: "96-00", effect: "Avatar of Mystra: Caster regains all spell slots." }
    ]
};

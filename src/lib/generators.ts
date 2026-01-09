
import { Statblock } from "./data/statblocks";
import { ShopItem } from "./data/items";

// --- DATA TABLES ---

export type GeneratorTheme = "Surface" | "Underdark" | "Undead" | "Arcane" | "Construct";

const RACES = [
    { name: "Human", traits: [{ name: "Versatile", desc: "Gains one skill proficiency." }], themes: ["Surface", "Undead", "Arcane"] },
    { name: "Elf", traits: [{ name: "Fey Ancestry", desc: "Advantage vs Charm, immune to magical sleep." }, { name: "Darkvision", desc: "60ft." }], themes: ["Surface", "Arcane"] },
    { name: "Drow", traits: [{ name: "Sunlight Sensitivity", desc: "Disadvantage in direct sunlight." }, { name: "Drow Magic", desc: "Dancing Lights, Faerie Fire." }], themes: ["Underdark", "Arcane"] },
    { name: "Dwarf", traits: [{ name: "Dwarven Resilience", desc: "Advantage vs Poison, resistance to Poison damage." }, { name: "Darkvision", desc: "60ft." }], themes: ["Surface", "Underdark"] },
    { name: "Tiefling", traits: [{ name: "Hellish Resistance", desc: "Resistance to Fire damage." }, { name: "Darkvision", desc: "60ft." }], themes: ["Surface", "Underdark"] },
    { name: "Halfling", traits: [{ name: "Lucky", desc: "Reroll 1s on d20s." }, { name: "Brave", desc: "Advantage vs Frightened." }], themes: ["Surface"] },
    { name: "Orc", traits: [{ name: "Aggressive", desc: "Bonus action to move towards enemy." }, { name: "Darkvision", desc: "60ft." }], themes: ["Surface", "Underdark"] },
    { name: "Gnome", traits: [{ name: "Gnome Cunning", desc: "Advantage on Int/Wis/Cha saves vs magic." }], themes: ["Surface", "Underdark", "Arcane"] },
    { name: "Dragonborn", traits: [{ name: "Breath Weapon", desc: "Can use a storage breath weapon (Type varies)." }, { name: "Damage Resistance", desc: "Resistance to breath damage type." }], themes: ["Surface"] },
    { name: "Undead", traits: [{ name: "Undead Nature", desc: "Doesn't require air, food, drink, or sleep." }, { name: "Turn Resistance", desc: "Advantage on saves vs Turn Undead." }], themes: ["Undead"] },
    { name: "Construct", traits: [{ name: "Antimagic Susceptibility", desc: "Incapacitated in Antimagic Field." }, { name: "Immutable Form", desc: "Immune to polymorph." }], themes: ["Construct"] }
];

const CLASSES = [
    { name: "Warrior", role: "Melee", hd: "d10", stats: ["str", "con"], armor: "Plate", weapons: ["Greatsword", "Longbow"], themes: ["Surface", "Underdark", "Undead", "Construct"] },
    { name: "Soldier", role: "Melee", hd: "d10", stats: ["str", "con"], armor: "Chain Mail", weapons: ["Longsword", "Shield", "Crossbow"], themes: ["Surface", "Underdark", "Undead"] },
    { name: "Mage", role: "Caster", hd: "d6", stats: ["int", "wis"], armor: "Robes", weapons: ["Staff", "Dagger"], themes: ["Surface", "Underdark", "Arcane", "Undead"] },
    { name: "Priest", role: "Caster", hd: "d8", stats: ["wis", "cha"], armor: "Chain Shirt", weapons: ["Mace", "Shield"], themes: ["Surface", "Underdark", "Arcane"] },
    { name: "Rogue", role: "Skirmisher", hd: "d8", stats: ["dex", "int"], armor: "Leather", weapons: ["Shortsword", "Shortbow", "Dagger"], themes: ["Surface", "Underdark"] },
    { name: "Berserker", role: "Melee", hd: "d12", stats: ["str", "con"], armor: "Hide", weapons: ["Greataxe", "Handaxe"], themes: ["Surface", "Underdark", "Undead"] },
    { name: "Cultist", role: "Caster", hd: "d8", stats: ["cha", "con"], armor: "Leather", weapons: ["Dagger"], themes: ["Surface", "Underdark", "Arcane", "Undead"] },
    { name: "Guard", role: "Melee", hd: "d8", stats: ["str", "dex"], armor: "Chain Shirt", weapons: ["Spear", "Shield"], themes: ["Surface", "Underdark", "Construct"] }
];

const WEAPONS: Record<string, { hit: string, dmg: string, prop: string }> = {
    "Greatsword": { hit: "Str", dmg: "2d6 slashing", prop: "Heavy, Two-Handed" },
    "Longsword": { hit: "Str", dmg: "1d8 slashing", prop: "Versatile (1d10)" },
    "Shortsword": { hit: "Dex", dmg: "1d6 piercing", prop: "Finesse, Light" },
    "Dagger": { hit: "Dex", dmg: "1d4 piercing", prop: "Finesse, Light, Thrown (20/60)" },
    "Greataxe": { hit: "Str", dmg: "1d12 slashing", prop: "Heavy, Two-Handed" },
    "Mace": { hit: "Str", dmg: "1d6 bludgeoning", prop: "--" },
    "Staff": { hit: "Str", dmg: "1d6 bludgeoning", prop: "Versatile (1d8)" },
    "Spear": { hit: "Str", dmg: "1d6 piercing", prop: "Thrown (20/60), Versatile (1d8)" },
    "Longbow": { hit: "Dex", dmg: "1d8 piercing", prop: "Ammunition (150/600), Heavy, Two-Handed" },
    "Shortbow": { hit: "Dex", dmg: "1d6 piercing", prop: "Ammunition (80/320), Two-Handed" },
    "Crossbow": { hit: "Dex", dmg: "1d8 piercing", prop: "Ammunition (80/320), Loading" },
    "Handaxe": { hit: "Str", dmg: "1d6 slashing", prop: "Light, Thrown (20/60)" }
};

const ARMOR: Record<string, { ac: number, type: string, dexMax?: number }> = {
    "Plate": { ac: 18, type: "Heavy", dexMax: 0 },
    "Chain Mail": { ac: 16, type: "Heavy", dexMax: 0 },
    "Scale Mail": { ac: 14, type: "Medium", dexMax: 2 },
    "chain Shirt": { ac: 13, type: "Medium", dexMax: 2 },
    "Hide": { ac: 12, type: "Medium", dexMax: 2 },
    "Leather": { ac: 11, type: "Light", dexMax: 99 },
    "Studded Leather": { ac: 12, type: "Light", dexMax: 99 },
    "Robes": { ac: 10, type: "None", dexMax: 99 },
    "None": { ac: 10, type: "None", dexMax: 99 }
};

// --- LOOT DATA ---
const LOOT_TYPES = ["Weapon", "Armor", "Potion", "Scroll", "Wondrous", "Ring", "Wand", "Rod"];
const WEAPON_TYPES = ["Longsword", "Shortsword", "Greatsword", "Greataxe", "Dagger", "Maul", "Rapier", "Longbow", "Heavy Crossbow"];
const ARMOR_TYPES = ["Plate Armor", "Chain Mail", "Scale Mail", "Leather Armor", "Studded Leather", "Breastplate", "Shield"];

const LORE_PREFIXES = [
    "Larloch's",
    "Veznan's",
    "Valrath's",
    "Aumvor's",
    "Netherese",
    "Iriolarthas'",
    "Rhaugilath's",
    "Shadowvar"
];

const RARITY_ODDS = [
    { name: "Common", chance: 50, costMod: 1, propCount: 0 },
    { name: "Uncommon", chance: 30, costMod: 10, propCount: 1 },
    { name: "Rare", chance: 15, costMod: 100, propCount: 2 },
    { name: "Very Rare", chance: 4, costMod: 1000, propCount: 3 },
    { name: "Legendary", chance: 1, costMod: 10000, propCount: 4 }
];

const THEMED_ADJECTIVES: Record<GeneratorTheme, string[]> = {
    "Surface": ["Rusty", "Golden", "Polished", "Oaken", "Traveler's", "Royal", "Merchant's", "Knight's"],
    "Underdark": ["Obsidian", "Spider-Silk", "Glowing", "Duergar", "Poisoned", "Crystal", "Abyssal", "Web-Strung"],
    "Undead": ["Bone", "Rotting", "Ghostly", "Necrotic", "Ancient", "Tomb", "Funeral", "Grave-dirt"],
    "Arcane": ["Aetheral", "Runed", "Floating", "Singing", "Void", "Astral", "Prismatic", "Spell-Weaved"],
    "Construct": ["Clockwork", "Brass", "Clicking", "Steam-Powered", "Cogwork", "Mithral", "Forged", "Automated"]
};

// --- SYNERGISTIC EFFECTS TABLE ---
type MagicEffect = { desc: string; duration: string; suffix: string; }

const MAGIC_EFFECTS: MagicEffect[] = [
    { desc: "Deal +1d6 fire damage on hit.", duration: "Instantaneous", suffix: "of the Phoenix" },
    { desc: "Deal +1d6 cold damage on hit.", duration: "Instantaneous", suffix: "of Winter" },
    { desc: "User can cast Sanctuary.", duration: "1 Minute", suffix: "of Sanctuary" },
    { desc: "Glows in the presence of evil.", duration: "Permanent", suffix: "of Vigilance" },
    { desc: "Increases speed by 10ft.", duration: "Permanent", suffix: "of Speed" },
    { desc: "Grants resistance to Cold damage.", duration: "Permanent", suffix: "of Warmth" },
    { desc: "Allows water breathing.", duration: "Permanent", suffix: "of the Depths" },
    { desc: "User has advantage on Initiative.", duration: "Permanent", suffix: "of Alacrity" },
    { desc: "Cannot be terrified.", duration: "Permanent", suffix: "of Courage" },
    { desc: "Whispers dark secrets to the wearer.", duration: "Permanent", suffix: "of Madness" },
    { desc: "Critical hits knock the target prone.", duration: "Instantaneous", suffix: "of Impact" },
    { desc: "Thrown weapons return to hand immediately.", duration: "Instantaneous", suffix: "of Returning" },
    { desc: "User ignores difficult terrain.", duration: "Permanent", suffix: "of Freedom" },
    { desc: "Grants Darkvision 60ft.", duration: "Permanent", suffix: "of Night-Sight" },
    { desc: "Advantage on Perception checks.", duration: "Permanent", suffix: "of Awareness" },
    { desc: "Casts Light on command.", duration: "1 Hour", suffix: "of Illumination" },
    { desc: "Allows casting of Shield.", duration: "1 Round", suffix: "of Shielding" },
    { desc: "User can cast Misty Step.", duration: "Instantaneous", suffix: "of Blinking" },
    { desc: "Grants resistance to Fire damage.", duration: "Permanent", suffix: "of Dousing" }
];

const THEMED_QUOTES: Record<GeneratorTheme, string[]> = {
    // ... (Same as before)
    "Surface": ["A fine piece of craftmanship.", "Simple, sturdy, and reliable."],
    "Underdark": ["Be careful. It bites back.", "Forged in the dark."],
    "Undead": ["It's cold to the touch.", "Do not ask who wore this last."],
    "Arcane": ["It hums with a song.", "Look at the way it bends light."],
    "Construct": ["The gears still turn.", "Precision engineering."]
};

// --- ARTIFACT / SENTIENCE TABLES ---

const SENTIENCE_ALIGNMENTS = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];

const SENTIENCE_PURPOSES = [
    "Defeat the enemies of Netheril.",
    "Destroy all Undead.",
    "Seek and preserve ancient knowledge.",
    "Spread chaos and destruction.",
    "Protect the Wielder at all costs.",
    "Overthrow the current rulers of Faerûn.",
    "Collect rare magical items.",
    "Hunt down Drow."
];

const SENTIENCE_SENSES = [
    "Hearing and Normal Vision 30 ft.",
    "Hearing and Darkvision 60 ft.",
    "Hearing and Darkvision 120 ft.",
    "Blindsight 60 ft."
];

const ARTIFACT_PROPERTIES_BENEFICIAL = [
    "Regenerate 1d6 HP every 10 minutes.",
    "Resistance to all Magic Damage.",
    "Cast Wish 1/year.",
    "User's Proficiency Bonus increases by 1.",
    "User can fly (60 ft).",
    "User's attacks ignore resistance.",
    "Grants Truesight 60 ft."
];

const ARTIFACT_PROPERTIES_DETRIMENTAL = [
    "User takes 4d10 psychic damage when unattuned.",
    "User has disadvantage on saving throws vs spells.",
    "User cannot smell or taste anything.",
    "Nearby animals become hostile.",
    "User looks pale and skeletal.",
    "User hears constant whispering.",
    "User refuses to part with the item."
];

// --- GENERATORS ---

export function generateNPC(theme: GeneratorTheme = "Surface"): Statblock {
    // ... (Existing implementation)
    // For brevity in this diff, reusing the existing body structure via "..." comment if I could, 
    // but I must provide the full file content.
    // RE-INSERTING PREVIOUS generateNPC CODE...
    const availableRaces = RACES.filter(r => r.themes.includes(theme));
    const race = availableRaces[Math.floor(Math.random() * availableRaces.length)] || RACES[0];
    const availableClasses = CLASSES.filter(c => c.themes.includes(theme));
    const cls = availableClasses[Math.floor(Math.random() * availableClasses.length)] || CLASSES[0];
    const stats: any = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    Object.keys(stats).forEach(k => stats[k] = 8 + Math.floor(Math.random() * 6));
    cls.stats.forEach(s => stats[s] += 2 + Math.floor(Math.random() * 3));
    const crVal = Math.floor(Math.random() * 5);
    const pb = 2 + Math.floor(crVal / 5);
    const hp = Math.floor((parseInt(cls.hd.substring(1)) / 2 + 0.5 + Math.floor((stats.con - 10) / 2)) * (crVal + 2));
    let armorAc = ARMOR[cls.armor]?.ac || 10;
    const dexMod = Math.floor((stats.dex - 10) / 2);
    if (ARMOR[cls.armor]?.type === "Light") armorAc += dexMod;
    if (ARMOR[cls.armor]?.type === "Medium") armorAc += Math.min(dexMod, 2);
    if (ARMOR[cls.armor]?.type === "None") armorAc += dexMod;
    if (cls.weapons.includes("Shield")) armorAc += 2;
    const actions = cls.weapons.map(wName => {
        if (wName === "Shield") return null;
        const w = WEAPONS[wName];
        if (!w) return null;
        const isDex = w.prop.includes("Finesse") && stats.dex > stats.str;
        const isRange = w.prop.includes("Ammunition");
        const modStat = (isDex || isRange) ? stats.dex : stats.str;
        const mod = Math.floor((modStat - 10) / 2);
        const hit = mod + pb;
        const dmgMod = mod;
        return {
            name: wName,
            desc: `${isRange ? "Ranged" : "Melee"} Weapon Attack: +${hit} to hit, ${isRange ? "range 80/320" : "reach 5 ft."}, one target. Hit: ${w.dmg} + ${dmgMod} damage.`
        };
    }).filter(Boolean) as { name: string, desc: string }[];
    if (cls.role === "Caster") {
        const spellStat = cls.name === "Mage" ? "int" : "wis";
        const dc = 8 + pb + Math.floor((stats[spellStat] - 10) / 2);
        const hit = pb + Math.floor((stats[spellStat] - 10) / 2);
        actions.push({ name: "Spellcasting", desc: `The ${cls.name.toLowerCase()} is a spellcaster (DC ${dc}, +${hit} to hit). Prepared spells: Fire Bolt (2d10), Cure Wounds, Shield.` });
    }
    const savesList = cls.stats.map(s => {
        const mod = Math.floor((stats[s] - 10) / 2) + pb;
        return `${s.charAt(0).toUpperCase() + s.slice(1)} ${mod >= 0 ? "+" : ""}${mod}`;
    }).join(", ");
    return {
        name: `Random ${theme} ${race.name} ${cls.name}`,
        size: "Medium",
        type: `${race.name} humanoid (${cls.name})`,
        alignment: "Neutral",
        ac: armorAc,
        armorType: cls.armor,
        hp: hp,
        hitDice: `${crVal + 2}${cls.hd}`,
        speed: "30 ft.",
        stats: stats,
        saves: savesList,
        skills: `Perception +${Math.floor((stats.wis - 10) / 2) + pb}`,
        immunities: theme === "Construct" ? "Poison, Psychic" : (theme === "Undead" ? "Necrotic, Poison" : ""),
        languages: "Common",
        cr: crVal === 0 ? "1/2" : crVal.toString(),
        xp: crVal * 200, // Approx
        traits: [...race.traits],
        actions: actions
    };
}

export function generateLootItem(theme: GeneratorTheme = "Surface"): ShopItem {
    // ... (Existing implementation)
    // RE-INSERTING PREVIOUS generateLootItem CODE...
    const roll = Math.floor(Math.random() * 100);
    let rarityObj = RARITY_ODDS[0];
    let currentSum = 0;
    for (const r of RARITY_ODDS) { currentSum += r.chance; if (roll < currentSum) { rarityObj = r; break; } }
    const typeCat = LOOT_TYPES[Math.floor(Math.random() * LOOT_TYPES.length)];
    const isLoreItem = rarityObj.name !== "Common" && Math.random() < 0.15;
    const lorePrefix = isLoreItem ? LORE_PREFIXES[Math.floor(Math.random() * LORE_PREFIXES.length)] : "";
    let noun = ""; let bonusEligible = false;
    if (typeCat === "Weapon") { noun = WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)]; bonusEligible = true; }
    else if (typeCat === "Armor") { noun = ARMOR_TYPES[Math.floor(Math.random() * ARMOR_TYPES.length)]; bonusEligible = true; }
    else if (typeCat === "Potion") noun = "Potion";
    else if (typeCat === "Scroll") noun = "Scroll";
    else if (typeCat === "Rod") { if (Math.random() > 0.6) { noun = "Rod of the Pact Keeper"; bonusEligible = true; } else noun = "Rod"; }
    else if (typeCat === "Wand") { if (Math.random() > 0.6) { noun = "Wand of the War Mage"; bonusEligible = true; } else noun = "Wand"; }
    else if (typeCat === "Wondrous" || typeCat === "Ring") { if (rarityObj.name !== "Common" && Math.random() > 0.7) { noun = ["Bracers of Defense", "Ring of Protection", "Cloak of Protection", "Amulet of Health"][Math.floor(Math.random() * 4)]; bonusEligible = true; } else { noun = ["Amulet", "Boots", "Cloak", "Gloves", "Helm", "Bag", "Gem", "Ring"][Math.floor(Math.random() * 8)]; } }
    else noun = typeCat;

    const magicEffectObj = MAGIC_EFFECTS[Math.floor(Math.random() * MAGIC_EFFECTS.length)];
    let effectText = magicEffectObj.desc;
    let nameSuffix = magicEffectObj.suffix;
    let magicBonus = 0;

    if (rarityObj.name === "Common") {
        const materials = ["Silvered", "Adamantine", "Cold Iron", "Masterwork"];
        if (bonusEligible && Math.random() > 0.6) {
            const mat = materials[Math.floor(Math.random() * materials.length)];
            if (mat === "Silvered") effectText = "Counts as magical for overcoming resistances.";
            if (mat === "Adamantine") effectText = "Critical hits against you become normal (Armor) or Objects take auto-crit (Weapon).";
            if (mat === "Masterwork") effectText = "Exquisitely crafted. Worth double.";
            nameSuffix = ""; noun = `${mat} ${noun}`;
        } else { effectText = "Standard quality, but reliable."; nameSuffix = ""; }
    } else {
        if (bonusEligible) {
            if (rarityObj.name === "Uncommon") magicBonus = 1;
            if (rarityObj.name === "Rare") magicBonus = 2;
            if (rarityObj.name === "Very Rare") magicBonus = 3;
            if (rarityObj.name === "Legendary") magicBonus = 3;
            if (Math.random() > 0.3) { effectText = ""; nameSuffix = ""; }
            else { effectText = `${magicEffectObj.desc} (Duration: ${magicEffectObj.duration})`; }
        } else { effectText = `${magicEffectObj.desc} (Duration: ${magicEffectObj.duration})`; }
    }
    if (magicBonus > 0) {
        let bonusDesc = "";
        if (typeCat === "Weapon") bonusDesc = `Grants a +${magicBonus} bonus to attack and damage rolls.`;
        else if (typeCat === "Armor") bonusDesc = `Grants a +${magicBonus} bonus to AC.`;
        else if (noun.includes("Wand")) bonusDesc = `Grants a +${magicBonus} bonus to spell attack rolls.`;
        else if (noun.includes("Rod")) bonusDesc = `Grants a +${magicBonus} bonus to spell attack rolls and save DCs.`;
        else if (noun.includes("Protection") || noun.includes("Defense")) bonusDesc = `Grants a +${magicBonus} bonus to AC and Saving Throws.`;
        effectText = effectText ? `${bonusDesc} ${effectText}` : bonusDesc;
    }
    const isNamedItem = noun.includes(" of ") || noun.includes("Bracers");
    let name = "";
    if (isNamedItem) { name = lorePrefix ? `${lorePrefix} ${noun}` : noun; }
    else {
        if (nameSuffix && magicBonus > 0) { name = `${noun} ${nameSuffix}`; }
        else if (nameSuffix) { name = lorePrefix ? `${lorePrefix} ${noun} ${nameSuffix}` : `${noun} ${nameSuffix}`; }
        else {
            if (lorePrefix) name = `${lorePrefix} ${noun}`;
            else {
                const adjectives = THEMED_ADJECTIVES[theme] || THEMED_ADJECTIVES["Surface"];
                const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                name = `${adj} ${noun}`;
            }
        }
    }
    if (magicBonus > 0) name += ` +${magicBonus}`;
    let cost = 50 * rarityObj.costMod; cost = Math.floor(cost * (0.8 + Math.random() * 0.4));
    if (noun === "Potion" || noun === "Scroll") cost = Math.floor(cost / 5);
    const props = [];
    if (typeCat === "Weapon") props.push("Martial", noun.includes("Two-Handed") || noun.includes("Great") ? "Two-Handed" : "Versatile");
    if (typeCat === "Armor") props.push(noun.includes("Plate") || noun.includes("Splint") ? "Heavy Armor" : "Light/Medium Armor");
    if (typeCat === "Potion" || typeCat === "Scroll") props.push("Consumable");
    if (typeCat === "Wondrous" || typeCat === "Ring" || typeCat === "Wand" || typeCat === "Rod") props.push("Wondrous Item");
    if (theme) props.push(theme);
    if (rarityObj.name !== "Common") props.push("Magic");
    if (rarityObj.name === "Legendary") props.push("Attunement", "Indestructible");
    const quotes = THEMED_QUOTES[theme] || THEMED_QUOTES["Surface"];
    const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return { name: name, type: noun, rarity: rarityObj.name, cost: `${cost} gp`, effect: effectText, properties: props, npcQuote: selectedQuote };
}

export function generateArtifact(theme: GeneratorTheme = "Surface"): ShopItem {
    // 1. Lore Priority: 100%
    const lorePrefix = LORE_PREFIXES[Math.floor(Math.random() * LORE_PREFIXES.length)];

    // Artifact Noun
    const noun = ["Orb", "Staff", "Blade", "Grimoire", "Crown", "Amulet", "Plate", "Skull", "Scepter"][Math.floor(Math.random() * 9)];

    // Artifact Name construction
    // "Larloch's Skull of the Void"
    const magicEffectObj = MAGIC_EFFECTS[Math.floor(Math.random() * MAGIC_EFFECTS.length)];
    const name = `${lorePrefix} ${noun} ${magicEffectObj.suffix}`;

    // Properties
    const benProp = ARTIFACT_PROPERTIES_BENEFICIAL[Math.floor(Math.random() * ARTIFACT_PROPERTIES_BENEFICIAL.length)];
    const detProp = ARTIFACT_PROPERTIES_DETRIMENTAL[Math.floor(Math.random() * ARTIFACT_PROPERTIES_DETRIMENTAL.length)];

    const props = ["Artifact", "Attunement", "Indestructible", "Legendary", theme];

    let effectText = `**Major Benefit:** ${benProp} \n**Side Effect:** ${detProp} \n\n${magicEffectObj.desc} (Duration: ${magicEffectObj.duration})`;

    // Sentience Chance (50%)
    const isSentient = Math.random() > 0.5;
    let npcQuote = "This item thrums with quiet power.";

    if (isSentient) {
        props.push("Sentient");
        const alignment = SENTIENCE_ALIGNMENTS[Math.floor(Math.random() * SENTIENCE_ALIGNMENTS.length)];
        const purpose = SENTIENCE_PURPOSES[Math.floor(Math.random() * SENTIENCE_PURPOSES.length)];
        const senses = SENTIENCE_SENSES[Math.floor(Math.random() * SENTIENCE_SENSES.length)];

        effectText += `\n\n**Sentience:** ${alignment}. Int ${12 + Math.floor(Math.random() * 6)}, Wis ${12 + Math.floor(Math.random() * 6)}, Cha ${14 + Math.floor(Math.random() * 6)}. ${senses}`;
        effectText += `\n**Purpose:** ${purpose}`;

        npcQuote = `"${["I serve only the strong.", "Blood... I need blood.", "We must find the Master.", "Do not bore me, mortal."][Math.floor(Math.random() * 4)]}"`;
    }

    return {
        name: name,
        type: "Artifact",
        rarity: "Artifact",
        cost: "Priceless",
        effect: effectText,
        properties: props,
        npcQuote: npcQuote
    };
}

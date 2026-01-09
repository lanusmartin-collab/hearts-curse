
import { Statblock } from "./data/statblocks";
import { ShopItem } from "./data/items";

// --- DATA TABLES ---

const RACES = [
    { name: "Human", traits: [{ name: "Versatile", desc: "Gains one skill proficiency." }] },
    { name: "Elf", traits: [{ name: "Fey Ancestry", desc: "Advantage vs Charm, immune to magical sleep." }, { name: "Darkvision", desc: "60ft." }] },
    { name: "Dwarf", traits: [{ name: "Dwarven Resilience", desc: "Advantage vs Poison, resistance to Poison damage." }, { name: "Darkvision", desc: "60ft." }] },
    { name: "Tiefling", traits: [{ name: "Hellish Resistance", desc: "Resistance to Fire damage." }, { name: "Darkvision", desc: "60ft." }] },
    { name: "Halfling", traits: [{ name: "Lucky", desc: "Reroll 1s on d20s." }, { name: "Brave", desc: "Advantage vs Frightened." }] },
    { name: "Orc", traits: [{ name: "Aggressive", desc: "Bonus action to move towards enemy." }, { name: "Darkvision", desc: "60ft." }] },
    { name: "Gnome", traits: [{ name: "Gnome Cunning", desc: "Advantage on Int/Wis/Cha saves vs magic." }] },
    { name: "Dragonborn", traits: [{ name: "Breath Weapon", desc: "Can use a storage breath weapon (Type varies)." }, { name: "Damage Resistance", desc: "Resistance to breath damage type." }] }
];

const CLASSES = [
    { name: "Warrior", role: "Melee", hd: "d10", stats: ["str", "con"], armor: "Plate", weapons: ["Greatsword", "Longbow"] },
    { name: "Soldier", role: "Melee", hd: "d10", stats: ["str", "con"], armor: "Chain Mail", weapons: ["Longsword", "Shield", "Crossbow"] },
    { name: "Mage", role: "Caster", hd: "d6", stats: ["int", "wis"], armor: "Robes", weapons: ["Staff", "Dagger"] },
    { name: "Priest", role: "Caster", hd: "d8", stats: ["wis", "cha"], armor: "Chain Shirt", weapons: ["Mace", "Shield"] },
    { name: "Rogue", role: "Skirmisher", hd: "d8", stats: ["dex", "int"], armor: "Leather", weapons: ["Shortsword", "Shortbow", "Dagger"] },
    { name: "Berserker", role: "Melee", hd: "d12", stats: ["str", "con"], armor: "Hide", weapons: ["Greataxe", "Handaxe"] },
    { name: "Cultist", role: "Caster", hd: "d8", stats: ["cha", "con"], armor: "Leather", weapons: ["Dagger"] },
    { name: "Guard", role: "Melee", hd: "d8", stats: ["str", "dex"], armor: "Chain Shirt", weapons: ["Spear", "Shield"] }
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

const STAT_MODS = [-1, 0, 1, 2, 3, 4, 5]; // For low level NPCs

// --- LOOT DATA ---
const LOOT_TYPES = ["Weapon", "Armor", "Potion", "Scroll", "Wondrous", "Ring", "Wand"];
const RARITY_ODDS = [
    { name: "Common", chance: 50, costMod: 1, propCount: 0 },
    { name: "Uncommon", chance: 30, costMod: 10, propCount: 1 },
    { name: "Rare", chance: 15, costMod: 100, propCount: 2 },
    { name: "Very Rare", chance: 4, costMod: 1000, propCount: 3 },
    { name: "Legendary", chance: 1, costMod: 10000, propCount: 4 }
];

const LOOT_ADJECTIVES = ["Ancient", "Cursed", "Shining", "Bloodstained", "Whispering", "Heavy", "Golden", "Rusty", "Ethereal", "Runed"];
const LOOT_NOUNS = ["Blade", "Shield", "Amulet", "Ring", "Gem", "Tome", "Boots", "Cloak", "Gloves", "Helm"];

const EFFECTS = [
    "Grants +1 to AC.",
    "Deal +1d6 fire damage on hit.",
    "User can cast Sanctuary 1/day.",
    "Glows in the presence of evil.",
    "Increases speed by 10ft.",
    "Grants resistance to Cold damage.",
    "Allows water breathing.",
    "User has advantage on Initiative.",
    "Cannot be terrified.",
    "Whispers dark secrets to the wearer."
];

// --- GENERATORS ---

export function generateNPC(): Statblock {
    const race = RACES[Math.floor(Math.random() * RACES.length)];
    const cls = CLASSES[Math.floor(Math.random() * CLASSES.length)];

    // Generate Stats
    const stats: any = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    Object.keys(stats).forEach(k => stats[k] = 8 + Math.floor(Math.random() * 6)); // Base 8-13

    // Buf primary stats
    cls.stats.forEach(s => stats[s] += 2 + Math.floor(Math.random() * 3)); // +2 to +4

    const crVal = Math.floor(Math.random() * 5); // 0-4
    const pb = 2 + Math.floor(crVal / 5);
    const hp = Math.floor((parseInt(cls.hd.substring(1)) / 2 + 0.5 + Math.floor((stats.con - 10) / 2)) * (crVal + 2));

    // Calculate AC
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

    // Add Spellcasting Action for Mages/Priests
    if (cls.role === "Caster") {
        const spellStat = cls.name === "Mage" ? "int" : "wis";
        const dc = 8 + pb + Math.floor((stats[spellStat] - 10) / 2);
        const hit = pb + Math.floor((stats[spellStat] - 10) / 2);
        actions.push({
            name: "Spellcasting",
            desc: `The ${cls.name.toLowerCase()} is a spellcaster (DC ${dc}, +${hit} to hit). Prepared spells: Fire Bolt (2d10), Cure Wounds, Shield.`
        });
    }

    // Calculate Saves (Primary stats + PB)
    const savesList = cls.stats.map(s => {
        const mod = Math.floor((stats[s] - 10) / 2) + pb;
        return `${s.charAt(0).toUpperCase() + s.slice(1)} ${mod >= 0 ? "+" : ""}${mod}`;
    }).join(", ");

    return {
        name: `Random ${race.name} ${cls.name}`,
        size: "Medium",
        type: `${race.name} humanoid (${cls.name})`,
        alignment: "Neutral",
        ac: armorAc,
        armorType: cls.armor,
        hp: hp,
        hitDice: `${crVal + 2}${cls.hd}`,
        speed: "30 ft.",
        stats: stats,
        saves: savesList, // Now populated
        skills: `Perception +${Math.floor((stats.wis - 10) / 2) + pb}`,
        immunities: "",
        languages: "Common",
        cr: crVal === 0 ? "1/2" : crVal.toString(),
        xp: crVal * 200, // Approx
        traits: [...race.traits],
        actions: actions
    };
}

export function generateLootItem(): ShopItem {
    const roll = Math.floor(Math.random() * 100);
    let rarityObj = RARITY_ODDS[0];
    let currentSum = 0;
    for (const r of RARITY_ODDS) {
        currentSum += r.chance;
        if (roll < currentSum) {
            rarityObj = r;
            break;
        }
    }

    const type = LOOT_TYPES[Math.floor(Math.random() * LOOT_TYPES.length)];
    const adj = LOOT_ADJECTIVES[Math.floor(Math.random() * LOOT_ADJECTIVES.length)];
    const noun = type === "Weapon" ? "Blade" : (type === "Armor" ? "Plate" : LOOT_NOUNS[Math.floor(Math.random() * LOOT_NOUNS.length)]);

    const name = `${adj} ${noun} of the ${["Wolf", "Bear", "Eagle", "Dragon", "Ghost", "Void", "Sun"][Math.floor(Math.random() * 7)]}`;

    const effect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];

    let cost = 50 * rarityObj.costMod;
    // Add some variance
    cost = Math.floor(cost * (0.8 + Math.random() * 0.4));

    const props = [];
    // GUARANTEE PROPERTIES
    if (type === "Weapon") props.push("Martial", "Versatile");
    if (type === "Armor") props.push("Medium Armor");
    if (type === "Potion" || type === "Scroll") props.push("Consumable");
    if (type === "Wondrous" || type === "Ring" || type === "Wand") props.push("Wondrous Item");

    if (rarityObj.name !== "Common") props.push("Magic");
    if (rarityObj.name === "Legendary") props.push("Attunement", "Indestructible");

    return {
        name: name,
        type: type,
        rarity: rarityObj.name,
        cost: `${cost} gp`,
        effect: effect,
        properties: props,
        npcQuote: "A fine piece, found in the deep places."
    };
}

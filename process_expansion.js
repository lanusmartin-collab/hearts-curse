const fs = require('fs');

const EXPANSION_FILE = 'src/lib/data/monsters_expansion_raw.json';
const EXISTING_FILE = 'src/lib/data/monsters_2024_final.json';
const OUTPUT_TS_FILE = 'src/lib/data/monsters_complete.ts';

function parseSize(typeStr) {
    const sizes = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
    const lower = typeStr.toLowerCase();
    for (const sz of sizes) {
        if (lower.startsWith(sz.toLowerCase())) {
            return {
                size: sz,
                type: typeStr.substring(sz.length).trim()
            };
        }
    }
    return { size: "Medium", type: typeStr }; // Default
}

function normalize(m, source) {
    // Splits type/size
    const { size, type } = parseSize(m.type || "Medium Beast");

    // Ensure stats are numbers
    const stats = m.stats || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    return {
        slug: m.slug,
        name: m.name,
        size: size,
        type: type.replace(/^\s*\(|\)\s*$/g, '').replace(/,/g, '').trim(), // clean "humanoid (human)"
        subtype: "", // Optional, maybe extract parens
        alignment: m.alignment || m.align || "Unaligned",
        ac: m.ac || 10,
        hp: m.hp || 10,
        hitDice: m.hitDice || "",
        speed: m.speed || "30 ft.",
        stats: stats,
        saves: m.saves,
        skills: m.skills,
        immunities: m.immunities,
        conditionImmunities: m.conditionImmunities,
        resistances: m.resistances, // if any
        senses: m.senses, // if any
        languages: m.languages,
        cr: m.cr || "0",
        traits: m.traits || [],
        actions: m.actions || [],
        legendary: m.legendary || [],
        image: m.imageUrl || m.image || m.image_path, // Map to 'image'
        source: source
    };
}

function main() {
    console.log("Processing monsters...");

    let expansion = [];
    try {
        expansion = JSON.parse(fs.readFileSync(EXPANSION_FILE, 'utf8'));
    } catch (e) {
        console.warn("No expansion file found yet.");
    }

    let existing = [];
    try {
        existing = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));
    } catch (e) {
        console.warn("No existing file found.");
    }

    const monsterMap = new Map();

    // Add existing first (overwrite priority? Usually expansion is newer/better? 
    // Actually, existing 2024 was summary. Expansion is full.
    // But expansion only targeted MISSING.
    // So we just merge.)

    existing.forEach(m => {
        // Generate slug if missing
        const slug = m.slug || m.name.toLowerCase().replace(/[']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
        monsterMap.set(slug, normalize({ ...m, slug: slug }, "2024_Scrape"));
    });

    expansion.forEach(m => {
        monsterMap.set(m.slug, normalize(m, "AideDD_Expansion"));
    });

    console.log(`Total Unified Monsters: ${monsterMap.size}`);

    const allMonstersObj = {};
    for (const [slug, m] of monsterMap.entries()) {
        allMonstersObj[slug] = m;
    }

    const tsContent = `import { Statblock } from "./statblocks";

export const ALL_MONSTERS: Record<string, Statblock> = ${JSON.stringify(allMonstersObj, null, 2)};
`;

    fs.writeFileSync(OUTPUT_TS_FILE, tsContent);
    console.log(`Saved to ${OUTPUT_TS_FILE}`);
}

main();

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'src', 'lib', 'data');
const FILE_CORE = path.join(DATA_DIR, 'monsters_2024_raw.json');
const FILE_EXPANSION = path.join(DATA_DIR, 'monsters_expansion_raw.json');
const FILE_DROW = path.join(DATA_DIR, 'drow_monsters.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'monsters_2024_final.json');

const PUBLIC_DIR = path.join(__dirname, 'public');

function parseCr(crStr) {
    if (!crStr) return 0;
    if (String(crStr).includes('/')) {
        const [num, den] = crStr.split('/').map(Number);
        return num / den;
    }
    const val = parseFloat(crStr);
    return isNaN(val) ? 0 : val;
}

function parseStat(val) {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 10 : parsed;
}

function normalizeMonster(raw) {
    // Basic stats
    const stats = {};
    if (raw.stats) {
        for (const [k, v] of Object.entries(raw.stats)) {
            stats[k.toLowerCase()] = parseStat(v);
        }
    } else {
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(k => stats[k] = 10);
    }

    // AC
    let ac = 0;
    let acDisplay = String(raw.ac || "");
    if (typeof raw.ac === 'number') ac = raw.ac;
    else if (raw.ac) {
        const match = String(raw.ac).match(/(\d+)/);
        ac = match ? parseInt(match[1], 10) : 0;
    }

    // HP
    let hp = 0;
    let hpDisplay = String(raw.hp || "");
    if (typeof raw.hp === 'number') hp = raw.hp;
    else if (raw.hp) {
        const match = String(raw.hp).match(/(\d+)/);
        hp = match ? parseInt(match[1], 10) : 0;
    }
    // Slug
    let slug = raw.slug;
    if (!slug && raw.name) {
        slug = raw.name.toLowerCase().replace(/[']/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    // Image logic
    let imagePath = null;

    // 1. Check strict local file existence and valid size (> 3KB)
    if (slug) {
        const localPath = path.join(PUBLIC_DIR, 'images', 'monsters', `${slug}.jpg`);
        if (fs.existsSync(localPath)) {
            const stats = fs.statSync(localPath);
            if (stats.size > 3000) {
                imagePath = `/images/monsters/${slug}.jpg`;
            }
        }
    }

    // 2. Fallback: If no valid local image, try inferred remote for Expansion content
    if (!imagePath && (raw.source === "AideDD_Expansion" || raw.source === "2024_Scrape")) {
        imagePath = `https://www.aidedd.org/dnd/images/${slug}.jpg`;
    }

    // 3. Last resort: use what was in raw if not already set
    if (!imagePath && raw.image_path) imagePath = raw.image_path;
    if (!imagePath && raw.imageUrl) imagePath = raw.imageUrl;
    if (!imagePath && raw.image_url) imagePath = raw.image_url;

    // Helper to normalize spellcasting descriptions
    const normalizeTrait = (t) => {
        if (t.name && (t.name.toLowerCase().includes("spellcasting") || t.name.toLowerCase().includes("innate"))) {
            let desc = t.desc;
            // ANTIGRAVITY FIX: Inject newlines before headers
            const headerPattern = /(:?)\s*((?:Cantrips|At will|\d+\s*\/[\s\w]*[Dd]ay|\d+(?:st|nd|rd|th)\s+level).*?:)/g;

            desc = desc.replace(headerPattern, (match, colon, header) => {
                return "\n" + header.trim();
            });

            // Clean up leading/double newlines
            desc = desc.replace(/^\n+/, "").replace(/\n\s*\n/g, "\n");

            return { ...t, desc };
        }
        return t;
    };

    return {
        name: raw.name || "Unknown",
        slug: slug,
        cr: parseCr(raw.cr),
        cr_display: String(raw.cr || "0"),
        type: raw.type || "Unknown",
        size: raw.size || "Medium",
        ac: ac,
        ac_display: acDisplay,
        hp: hp,
        hp_display: hpDisplay,
        speed: raw.speed || "",
        stats: stats,
        alignment: raw.alignment || "",

        saves: raw.saves || "",
        skills: raw.skills || "",
        immunities: raw.immunities || "",
        resistances: raw.resistances || "",
        conditionImmunities: raw.conditionImmunities || "",
        senses: raw.senses || "",
        languages: raw.languages || "",

        description: raw.description || "",
        initiative: (raw.initiative !== undefined) ? raw.initiative : Math.floor((stats.dex - 10) / 2),

        traits: (raw.traits || []).map(normalizeTrait),
        actions: (raw.actions || []).map(normalizeTrait),
        legendary: raw.legendary || [],

        source_url: raw.url || raw.source_url || "",
        image_url: imagePath,
        has_image: !!imagePath,
        image_path: imagePath,
        source: raw.source || "Core"
    };
}

function main() {
    let allMonsters = [];

    // 1. Load Core
    if (fs.existsSync(FILE_CORE)) {
        try {
            let content = fs.readFileSync(FILE_CORE, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            const core = JSON.parse(content);
            console.log(`Loaded ${core.length} core monsters.`);
            allMonsters = allMonsters.concat(core.map(m => ({ ...m, source: "Core_2024" })));
        } catch (e) { console.error("Error loading core:", e.message); }
    }

    // 2. Load Expansion
    if (fs.existsSync(FILE_EXPANSION)) {
        try {
            let content = fs.readFileSync(FILE_EXPANSION, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            const expansion = JSON.parse(content);
            console.log(`Loaded ${expansion.length} expansion monsters.`);
            allMonsters = allMonsters.concat(expansion);
        } catch (e) { console.error("Error loading expansion:", e.message); }
    }

    // 3. Load Drow
    if (fs.existsSync(FILE_DROW)) {
        try {
            let content = fs.readFileSync(FILE_DROW, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            const drow = JSON.parse(content);
            console.log(`Loaded ${drow.length} drow monsters.`);
            // Filter out "List"
            const filteredDrow = drow.filter(m => !m.name.toLowerCase().includes("list »"));
            allMonsters = allMonsters.concat(filteredDrow);
        } catch (e) { console.error("Error loading drow:", e.message); }
    }

    // 3.5 Load Custom
    const FILE_CUSTOM = path.join(DATA_DIR, 'monsters_custom.json');
    if (fs.existsSync(FILE_CUSTOM)) {
        try {
            let content = fs.readFileSync(FILE_CUSTOM, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            const custom = JSON.parse(content);
            console.log(`Loaded ${custom.length} custom monsters.`);
            allMonsters = allMonsters.concat(custom);
        } catch (e) { console.error("Error loading custom:", e.message); }
    }

    // 3.6 Load Migrated
    const FILE_MIGRATED = path.join(DATA_DIR, 'monsters_migrated.json');
    if (fs.existsSync(FILE_MIGRATED)) {
        try {
            let content = fs.readFileSync(FILE_MIGRATED, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            const migrated = JSON.parse(content);
            allMonsters = allMonsters.concat(migrated);
            console.log(`Loaded ${migrated.length} migrated monsters.`);
        } catch (e) { console.error("Error loading migrated:", e.message); }
    }

    // 4. Merge
    // Iterating and overwriting in map ensures last one wins.
    // Order: Core -> Expansion -> Drow

    const map = new Map();

    for (const m of allMonsters) {
        const norm = normalizeMonster(m);
        if (!norm.slug) continue;
        map.set(norm.slug, norm);
    }

    const final = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(final, null, 2));
    console.log(`Wrote ${final.length} monsters to ${OUTPUT_FILE}`);
}

main();

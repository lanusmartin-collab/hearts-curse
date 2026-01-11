const fs = require('fs');
const path = require('path');

const INPUT_FILE = './src/lib/data/monsters_2024_final.json';
const OUTPUT_FILE = './src/lib/data/monsters_2024_final.json';

// Size to Die mapping
const HIT_DIE = {
    "Tiny": 4,
    "Small": 6,
    "Medium": 8,
    "Large": 10,
    "Huge": 12,
    "Gargantuan": 20
};

function calculateHitDice(monster) {
    // If already has valid hit dice, skip (optional, but good for idempotency if manually set)
    // But our goal is to backfill.

    // Parse numeric HP
    const hp = typeof monster.hp === 'number' ? monster.hp : parseInt(monster.hp) || 0;
    if (hp === 0) return null;

    // Get Constitution Modifier
    const con = monster.stats.con || 10;
    const conMod = Math.floor((con - 10) / 2);

    // Get Size Die
    // Handle cases like "Medium humanoid" -> "Medium"
    let size = monster.size.split(' ')[0];
    // Fallback if size is "Medium or Small"
    if (size === "Medium" && monster.size.includes("Small")) size = "Medium";

    const die = HIT_DIE[size] || 8; // Default to d8 if unknown

    // avg HP = (die/2 + 0.5 + conMod) * level
    const avgPerLevel = (die / 2) + 0.5 + conMod;

    // Approximate level
    // level = hp / avgPerLevel
    let level = Math.round(hp / avgPerLevel);
    if (level < 1) level = 1;

    // Construct String
    // e.g. "18d10 + 36"
    const bonus = level * conMod;
    const sign = bonus >= 0 ? "+" : "-";
    const absBonus = Math.abs(bonus);

    const hitDiceStr = `${level}d${die} ${absBonus > 0 ? `${sign} ${absBonus}` : ""}`.trim();

    return hitDiceStr;
}

function main() {
    console.log(`Reading from ${INPUT_FILE}...`);
    try {
        const raw = fs.readFileSync(INPUT_FILE, 'utf8');
        const monsters = JSON.parse(raw);

        let updatedCount = 0;
        const updatedMonsters = monsters.map(m => {
            const hd = calculateHitDice(m);
            if (hd) {
                // Formatting: update hitDice field (or create it)
                // Also update hp_display to include it if we want it baked in, 
                // BUT the task is to show it in UI separately or part of display.
                // The existing UI uses `data.hitDice` if present.
                m.hitDice = hd;

                // Optional: Validating vs existing HP display might be tricky.
                // Let's just set the field.
                updatedCount++;
            }
            return m;
        });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedMonsters, null, 2));
        console.log(`Updated ${updatedCount} monsters with Hit Dice.`);
        console.log(`Saved to ${OUTPUT_FILE}`);

    } catch (err) {
        console.error("Error processing file:", err);
    }
}

main();


const fs = require('fs');
const https = require('https');
const path = require('path');

const URL = "https://raw.githubusercontent.com/mattearly/DnD_5e_Perfect_Spells/master/allSpells.json";
const OUTPUT_PATH = path.join(__dirname, '../src/lib/data/spells.json');

console.log(`Fetching spells from ${URL}...`);

https.get(URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const spells = json.allSpells || json; // Handle potential structure variation

            console.log(`Fetched ${spells.length} spells.`);

            // Optimize: Create a map keyed by name (lowercase) for O(1) lookup
            const spellMap = {};
            spells.forEach(spell => {
                const key = spell.name.toLowerCase().trim();
                spellMap[key] = spell;
            });

            // Write both the array and the map? Or just the array?
            // Let's write the flat array to keep the file raw-ish, and build the map in TS.
            // Actually, writing the raw array is safer for future re-processing.

            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spells, null, 2));
            console.log(`Saved to ${OUTPUT_PATH}`);

        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    });

}).on("error", (err) => {
    console.error("Error: " + err.message);
});

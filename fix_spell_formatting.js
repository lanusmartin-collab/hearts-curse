const fs = require('fs');

const FILES = [
    'src/lib/data/monsters_expansion_raw.json',
    'src/lib/data/monsters_2024_raw.json',
    'src/lib/data/monsters_custom.json',
    'src/lib/data/drow_monsters.json'
];

function formatSpells(desc) {
    if (!desc) return desc;
    let newDesc = desc;

    // Add newline before "Cantrips" or "Cantrips (at will)"
    newDesc = newDesc.replace(/ (Cantrips)/g, "\n$1");

    // Add newline before spell levels e.g. "1st level", "2nd level"
    newDesc = newDesc.replace(/ (\d+(?:st|nd|rd|th) level)/g, "\n$1");

    // Add newline before "At will" if it's the start of a list item context (heuristic)
    // Often "At will:" starts a line.
    newDesc = newDesc.replace(/ (At will:)/g, "\n$1");

    // Add newline before X/day
    newDesc = newDesc.replace(/ (\d+\/day)/g, "\n$1");

    return newDesc;
}

function processFile(path) {
    if (!fs.existsSync(path)) {
        console.log(`Skipping ${path} (not found)`);
        return;
    }

    console.log(`Processing ${path}...`);
    try {
        let content = fs.readFileSync(path, 'utf8');
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        const data = JSON.parse(content);
        let modifiedCount = 0;

        for (const m of data) {
            if (!m.traits) continue;
            for (const t of m.traits) {
                if (t.name === 'Spellcasting' || t.name === 'Innate Spellcasting' || t.name.includes('Spellcasting')) {
                    const original = t.desc;
                    const formatted = formatSpells(original);
                    if (original !== formatted) {
                        t.desc = formatted;
                        modifiedCount++;
                    }
                }
            }
        }

        if (modifiedCount > 0) {
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            console.log(`  Updated ${modifiedCount} spellcasting traits.`);
        } else {
            console.log(`  No changes needed.`);
        }

    } catch (e) {
        console.error(`Error processing ${path}:`, e);
    }
}

FILES.forEach(processFile);

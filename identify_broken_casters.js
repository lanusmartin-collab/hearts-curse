const fs = require('fs');

const INPUT_FILE = 'src/lib/data/monsters_expansion_raw.json';
const OUTPUT_FILE = 'broken_casters.json';

function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error("No expansion data found.");
        return;
    }

    let content = fs.readFileSync(INPUT_FILE, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    const monsters = JSON.parse(content);

    const broken = [];

    for (const m of monsters) {
        if (!m.traits) continue;
        const casting = m.traits.find(t => t.name.includes("Spellcasting"));

        if (casting) {
            const desc = casting.desc.trim();

            // Criteria for broken/truncated spell lists:
            // 1. Ends with a colon (e.g. "following spells:")
            // 2. Ends with "prepared:"
            // 3. Short string (<150 chars) but mentions "following" or "prepared" or "innately"

            if (desc.endsWith(':') ||
                desc.endsWith('prepared:') ||
                desc.endsWith('spells:') ||
                (desc.length < 150 && (desc.includes("following") || desc.includes("prepared") || desc.includes("innately")))
            ) {
                broken.push({
                    name: m.name,
                    slug: m.slug,
                    url: m.url || m.source_url
                });
            }
        }
    }

    // Force check for Abjurer Wizard if not found
    if (!broken.find(b => b.slug === 'abjurer-wizard')) {
        const abjurer = monsters.find(m => m.slug === 'abjurer-wizard');
        if (abjurer) {
            broken.push({
                name: abjurer.name,
                slug: abjurer.slug,
                url: abjurer.url
            });
        }
    }

    console.log(`Found ${broken.length} broken casters.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(broken, null, 2));
}

main();

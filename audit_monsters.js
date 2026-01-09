const path = require('path');

const FILE = 'src/lib/data/monsters_2024_final.json';

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

let incomplete = 0;
let sources = {};

console.log(`Total monsters: ${data.length}`);

const missingList = [];

for (const m of data) {
    const hasActions = m.actions && m.actions.length > 0;
    // const hasTraits = m.traits && m.traits.length > 0;
    // const hasTraits = m.traits && m.traits.length > 0;

    if (!hasActions) {
        incomplete++;
        sources[m.source] = (sources[m.source] || 0) + 1;
        // console.log(`Missing actions: ${m.name} (${m.source})`);
        missingList.push(m);
    }
}

console.log(`\nIncomplete monsters (no actions): ${incomplete}`);
console.log('By Source:');
console.log(sources);

// Output a list of potential scrape targets
// We'll generate a list for scrape_missing.js
// Format: { name, slug, url? }
// We can infer URL for AideDD if meaningful
const toScrape = missingList.map(m => {
    // Try to guess URL if not present or if source is Core
    let url = m.source_url;
    if (!url || m.source === "Core_2024") {
        url = `https://www.aidedd.org/dnd/monstres.php?vo=${m.slug}`;
    }
    return {
        name: m.name,
        slug: m.slug,
        url: url
    };
});

fs.writeFileSync('incomplete_monsters.json', JSON.stringify(toScrape, null, 2));
console.log(`\nWrote ${toScrape.length} incomplete monsters to incomplete_monsters.json`);

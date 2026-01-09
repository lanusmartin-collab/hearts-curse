const fs = require('fs');
const https = require('https');

// Helper to fetch text
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    try {
        // 1. Load Local
        let localSlugs = new Set();
        try {
            const localData = JSON.parse(fs.readFileSync('src/lib/data/monsters_2024_final.json', 'utf8'));
            localData.forEach(m => {
                // Normalize logic
                let slug = m.name.toLowerCase().replace(/[']/g, "").replace(/[^a-z0-9]+/g, "-");
                if (slug.endsWith('-')) slug = slug.slice(0, -1);
                localSlugs.add(slug);
                if (m.url) {
                    const urlSlug = m.url.split('/').pop();
                    localSlugs.add(urlSlug);
                }
            });
        } catch (e) {
            console.log("Local file not found or empty.");
        }
        console.log(`Local monsters count: ${localSlugs.size}`);

        // 2. Fetch Remote
        const url = "https://www.aidedd.org/en/rules/monsters/";
        console.log(`Fetching ${url}...`);
        let html = await fetchUrl(url);

        // Regex to find links: href="../dnd/monstres.php?vo=slug"
        // Pattern: <a href="[^"]*monstres\.php\?vo=([^"&]+)">([^<]+)</a>
        const regex = /<a[^>]+href="[^"]*monstres\.php\?vo=([^"&]+)"[^>]*>([^<]+)<\/a>/g;
        let match;
        const remoteMonsters = [];

        while ((match = regex.exec(html)) !== null) {
            remoteMonsters.push({
                slug: match[1],
                name: match[2].trim(),
                url: `https://www.aidedd.org/dnd/monstres.php?vo=${match[1]}`
            });
        }

        console.log(`Remote monsters found: ${remoteMonsters.length}`);

        // 3. Diff
        const missing = remoteMonsters.filter(rm => !localSlugs.has(rm.slug));
        console.log(`Missing monsters: ${missing.length}`);

        fs.writeFileSync('missing_monsters.json', JSON.stringify(missing, null, 2));

    } catch (e) {
        console.error(e);
    }
}

main();

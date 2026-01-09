/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');

const LOCAL_FILE = 'src/lib/data/monsters_2024_final.json';
const OUTPUT_FILE = 'missing_monsters.json';

// Fetch Helper
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    try {
        // 1. Load Local
        let localSlugs = new Set();
        if (fs.existsSync(LOCAL_FILE)) {
            const localData = JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'));
            localData.forEach(m => {
                if (m.slug) localSlugs.add(m.slug);
                const nameSlug = m.name.toLowerCase().replace(/[']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                localSlugs.add(nameSlug);
            });
        }
        console.log(`Local monsters: ${localSlugs.size}`);

        // 2. Fetch Remote
        console.log("Fetching remote list...");
        const html = await fetchUrl("https://www.aidedd.org/dnd-filters/monsters.php");

        // Looser regex: look for the query param pattern irrespective of tag structure
        // Pattern: href="...monstres.php?vo=SLUG" or href='...'
        const linkRegex = /href=['"]([^'"]*monstres\.php\?vo=([^'"]+))['"]/gi;

        let match;
        const missing = [];
        let foundRemote = 0;

        // Also capture the name if possible. usually after the href closing tag >NAME</a>
        // But since we are doing a global scan on a massive string, we might just look for slugs first.
        // Let's iterate.

        // To get name, we really should match the <a> tag.
        // In the dump: <a href="...vo=slug" target='_blank'>Name</a>
        const tagRegex = /<a[^>]+href=['"]([^'"]*monstres\.php\?vo=([^'"]+))['"][^>]*>([\s\S]*?)<\/a>/gi;

        while ((match = tagRegex.exec(html)) !== null) {
            foundRemote++;
            let fullUrl = match[1];
            if (!fullUrl.startsWith('http')) {
                if (fullUrl.startsWith('../')) fullUrl = `https://www.aidedd.org${fullUrl.replace('..', '')}`;
                else if (fullUrl.startsWith('/')) fullUrl = `https://www.aidedd.org${fullUrl}`;
                else fullUrl = `https://www.aidedd.org/dnd/${fullUrl}`;
            }

            const slug = match[2];
            let name = match[3].replace(/<[^>]+>/g, '').trim(); // Remove inner tags if any

            if (!localSlugs.has(slug)) {
                missing.push({ name, slug, url: fullUrl });
            }
        }
        console.log(`Remote monsters found: ${foundRemote}`);
        console.log(`Missing monsters: ${missing.length}`);

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(missing, null, 2));
        console.log(`Saved to ${OUTPUT_FILE}`);

    } catch (e) {
        console.error(e);
    }
}

main();

const https = require('https');
const fs = require('fs');

const URL = 'https://www.aidedd.org/spell/';
const OUTPUT = 'spells_2024_links.json';

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
    console.log(`Fetching ${URL}...`);
    try {
        const html = await fetchUrl(URL);

        // Match: <td class='item'><a href='slug' ...>Name</a>
        const regex = /<td class=['"]item['"]><a href=['"]([^'"]+)['"][^>]*>([^<]+)<\/a>/g;
        let match;
        const spells = [];
        const seen = new Set();

        while ((match = regex.exec(html)) !== null) {
            let href = match[1];
            let name = match[2].trim();

            if (!href.startsWith('http')) {
                // It's relative, e.g. 'acid-splash'
                href = 'https://www.aidedd.org/spell/' + href;
            }

            const slug = href.split('/').pop();

            if (!seen.has(href)) {
                seen.add(href);
                spells.push({ name, url: href, slug });
            }
        }

        console.log(`Found ${spells.length} spells.`);
        fs.writeFileSync(OUTPUT, JSON.stringify(spells, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();

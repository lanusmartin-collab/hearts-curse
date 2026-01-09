const fs = require('fs');
const https = require('https');

// Config
const DELAY_MS = 300;
const OUTPUT_FILE = 'src/lib/data/monsters_expansion_raw.json';
const MISSING_FILE = 'broken_casters.json';

// Utility: Fetch
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect (rare but possible)
                resolve(fetchUrl(res.headers.location));
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
    });
}

// Utility: Sleep
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Parser
function parseMonster(html, slug, url) {
    const m = { slug, url, source: "AideDD_Expansion" };

    // 1. Name
    const nameMatch = /<h1>(.*?)<\/h1>/i.exec(html);
    if (nameMatch) m.name = nameMatch[1].trim();

    // 2. Type/Align
    const typeMatch = /class=['"]type['"]>([^<]+)<\/div>/i.exec(html);
    if (typeMatch) {
        const raw = typeMatch[1].trim();
        const lastComma = raw.lastIndexOf(',');
        if (lastComma !== -1) {
            m.type = raw.substring(0, lastComma).trim();
            m.alignment = raw.substring(lastComma + 1).trim();
        } else {
            m.type = raw;
            m.alignment = "Unaligned";
        }
    }

    // 2.5 Description
    const descPattern = /<div class=['"]type['"]>[\s\S]*?<\/div>([\s\S]*?)<strong>Armor Class/i;
    const descMatch = descPattern.exec(html);
    if (descMatch) {
        let rawDesc = descMatch[1];
        rawDesc = rawDesc.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
            .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
            .replace(/<div[^>]*>([\s\S]*?)<\/div>/gim, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        if (rawDesc.length > 5 && !rawDesc.startsWith("Armor Class")) {
            m.description = rawDesc;
        }
    }

    // 3. Stats
    const acMatch = /<strong>Armor Class<\/strong>\s*([^<]+)/i.exec(html);
    if (acMatch) m.ac = parseInt(acMatch[1]);

    const hpMatch = /<strong>Hit Points<\/strong>\s*([^<]+)/i.exec(html);
    if (hpMatch) m.hp = parseInt(hpMatch[1]);

    const speedMatch = /<strong>Speed<\/strong>\s*([^<]+)/i.exec(html);
    if (speedMatch) m.speed = speedMatch[1].trim();

    // 4. Ability Scores
    const statsPattern = /<div class=['"]carac['"]><strong>([A-Z]+)<\/strong><br>(\d+)/gi;
    let stat;
    m.stats = {};
    while ((stat = statsPattern.exec(html)) !== null) {
        const attr = stat[1].toLowerCase();
        const val = parseInt(stat[2]);
        m.stats[attr] = val;
    }

    // 5. Attributes
    const saveMatch = /<strong>Saving Throws<\/strong>\s*([^<]+)/i.exec(html);
    if (saveMatch) m.saves = saveMatch[1].trim();

    const skillMatch = /<strong>Skills<\/strong>\s*([^<]+)/i.exec(html);
    if (skillMatch) m.skills = skillMatch[1].trim();

    const immMatch = /<strong>Damage Immunities<\/strong>\s*([^<]+)/i.exec(html);
    if (immMatch) m.immunities = immMatch[1].trim();

    const condMatch = /<strong>Condition Immunities<\/strong>\s*([^<]+)/i.exec(html);
    if (condMatch) m.conditionImmunities = condMatch[1].trim();

    const langMatch = /<strong>Languages<\/strong>\s*([^<]+)/i.exec(html);
    if (langMatch) m.languages = langMatch[1].trim();

    const crMatch = /<strong>Challenge<\/strong>\s*([^<\(]+)/i.exec(html);
    if (crMatch) m.cr = crMatch[1].trim();

    // 6. Image
    const imgMatch = /<img src=['"]([^'"]+)['"][^>]*alt=['"]([^'"]*)['"]>/.exec(html);
    if (imgMatch && imgMatch[1].includes('dnd/images')) {
        m.imageUrl = imgMatch[1];
    }

    // 7. Traits, Actions, Legendary (IMPROVED PARSER)
    const actionsStart = html.indexOf('Actions</div>');
    const legStart = html.indexOf('Legendary actions</div>');

    let traitsHtml = html;
    let actionsHtml = "";
    let legHtml = "";

    if (actionsStart !== -1) {
        traitsHtml = html.substring(0, actionsStart);
        if (legStart !== -1) {
            actionsHtml = html.substring(actionsStart, legStart);
            legHtml = html.substring(legStart);
        } else {
            actionsHtml = html.substring(actionsStart);
        }
    }

    // Improved extractor
    const extractItems = (sectionHtml) => {
        const items = [];
        // Match start of a trait/action: 
        // 1. <p><strong>Something</strong>.
        // 2. <p>At will: ... (Sometimes used in spell lists without strong tags for the intro)

        // We match explicitly <strong>Name</strong>. 
        // We use a regex to find all start positions
        const headerRegex = /<p><strong>(?:<em>)?(.*?)(?:<\/em>)?<\/strong>\.?/gi;

        let match;
        const matches = [];

        while ((match = headerRegex.exec(sectionHtml)) !== null) {
            matches.push({
                name: match[1].trim(),
                index: match.index,
                endHeader: headerRegex.lastIndex
            });
        }

        for (let i = 0; i < matches.length; i++) {
            const current = matches[i];
            const next = matches[i + 1];

            const start = current.endHeader;
            const end = next ? next.index : sectionHtml.length;

            let content = sectionHtml.substring(start, end);

            // Clean content
            content = content
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>\s*<p>/gi, '\n')
                .replace(/<[^>]+>/g, '') // Strip all tags
                .trim();

            content = content.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

            items.push({
                name: current.name,
                desc: content
            });
        }

        return items;
    };

    m.traits = extractItems(traitsHtml);
    m.actions = extractItems(actionsHtml);
    m.legendary = extractItems(legHtml);

    return m;
}

async function main() {
    try {
        if (!fs.existsSync(MISSING_FILE)) {
            console.log("No broken casters file found. Skipping scrape.");
            return;
        }

        const missing = JSON.parse(fs.readFileSync(MISSING_FILE, 'utf8'));
        console.log(`Re-scraping ${missing.length} broken monsters...`);

        // Load existing
        let results = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            let content = fs.readFileSync(OUTPUT_FILE, 'utf8');
            if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
            results = JSON.parse(content);
        }

        // Create a map for fast lookup/update
        const dataMap = new Map();
        results.forEach(m => dataMap.set(m.slug, m));

        let completed = 0;
        for (const m of missing) {
            console.log(`[${++completed}/${missing.length}] Fetching ${m.name}...`);
            try {
                const html = await fetchUrl(m.url);
                const statblock = parseMonster(html, m.slug, m.url);

                // Update map
                dataMap.set(m.slug, statblock);

                // Save periodically
                if (completed % 10 === 0) {
                    const arr = Array.from(dataMap.values());
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(arr, null, 2));
                }
            } catch (err) {
                console.error(`Failed to scrape ${m.name}: ${err.message}`);
            }
            await sleep(DELAY_MS);
        }

        const finalArr = Array.from(dataMap.values());
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalArr, null, 2));
        console.log("Done!");

    } catch (e) {
        console.error(e);
    }
}

main();

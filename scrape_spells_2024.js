/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const https = require('https');

// Config
const DELAY_MS = 300; // Be nice to the server
const INPUT_FILE = 'spells_2024_links.json';
const OUTPUT_FILE = 'src/lib/data/spells_2024_raw.json';
const ERRORS_FILE = 'src/lib/data/spells_2024_errors.json';

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
function parseSpell(html, slug, url) {
    const s = {
        name: "",
        level: 0,
        school: "",
        classes: [],
        ritual: false,
        castingTime: "",
        range: "",
        components: "",
        material: "",
        duration: "",
        concentration: false,
        description: "",
        source: "PHB 2024",
        page: "",
        url: url
    };

    // 1. Name
    const nameMatch = /<h1>(.*?)<\/h1>/i.exec(html);
    if (nameMatch) s.name = nameMatch[1].trim();

    // 2. Ecole (Level, School, Classes)
    // Example: <div class='ecole'>Level 0 Evocation (Sorcerer, Wizard)</div>
    // Example: <div class='ecole'>Level 1 Abjuration (Wizard)</div>
    const ecoleMatch = /<div class=['"]ecole['"]>(.*?)<\/div>/i.exec(html);
    if (ecoleMatch) {
        let text = ecoleMatch[1].trim();

        // Extract Classes
        const parenExact = text.match(/\((.*?)\)/);
        if (parenExact) {
            s.classes = parenExact[1].split(',').map(c => c.trim());
            // Remove classes from text for easier parsing
            text = text.replace(parenExact[0], '').trim();
        }

        // Extract Level and School
        // Format: "Level X School" or "School Cantrip" ?
        // The example said "Level 0 Evocation".
        // Let's assume standard format matches "Level \d+ School"
        const levelMatch = text.match(/Level\s+(\d+)/i);
        if (levelMatch) {
            s.level = parseInt(levelMatch[1]);
        } else if (text.toLowerCase().includes('cantrip')) {
            s.level = 0;
        }

        // School is the remaining word usually
        // "Level 0 Evocation" -> remove "Level 0" -> "Evocation"
        let schoolText = text.replace(/Level\s+\d+/i, '').replace(/cantrip/i, '').trim();
        s.school = schoolText;
    }

    // 3. Casting Time
    const timeMatch = /<div class=['"]t['"]><strong>Casting Time<\/strong>:\s*(.*?)<\/div>/i.exec(html);
    if (timeMatch) {
        s.castingTime = timeMatch[1].trim();
        if (s.castingTime.toLowerCase().includes('ritual')) {
            s.ritual = true;
        }
    }

    // 4. Range
    const rangeMatch = /<div class=['"]r['"]><strong>Range<\/strong>:\s*(.*?)<\/div>/i.exec(html);
    if (rangeMatch) s.range = rangeMatch[1].trim();

    // 5. Components
    const compMatch = /<div class=['"]c['"]><strong>Components<\/strong>:\s*(.*?)<\/div>/i.exec(html);
    if (compMatch) {
        let raw = compMatch[1].trim();
        // Check for material
        // "V, S, M (a drop of acid)"
        const matMatch = raw.match(/\((.*?)\)/);
        if (matMatch && raw.includes('M')) {
            s.material = matMatch[1].trim();
            // Remove the material description from components string? 
            // Usually we keep "V, S, M"
            // Let's strip the parens part for 'components' field
            s.components = raw.replace(/\s*\(.*?\)/, '').trim();
        } else {
            s.components = raw;
        }
    }

    // 6. Duration
    const durMatch = /<div class=['"]d['"]><strong>Duration<\/strong>:\s*(.*?)<\/div>/i.exec(html);
    if (durMatch) {
        s.duration = durMatch[1].trim();
        if (s.duration.toLowerCase().includes('concentration')) {
            s.concentration = true;
        }
    }

    // 7. Description
    const descMatch = /<div class=['"]description['"]>([\s\S]*?)<\/div>/i.exec(html);
    if (descMatch) {
        let rawDesc = descMatch[1];
        // Clean up
        // Replace <br> with \n
        rawDesc = rawDesc.replace(/<br\s*\/?>/gi, '\n');
        // Paragraphs
        rawDesc = rawDesc.replace(/<\/p>\s*<p>/gi, '\n\n');
        // Strip other tags
        rawDesc = rawDesc.replace(/<[^>]+>/g, '');
        // Decode entities
        rawDesc = rawDesc.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&rsquo;/g, "'").replace(/&quot;/g, '"');
        s.description = rawDesc.trim();
    }

    // 8. Source
    const sourceMatch = /<div class=['"]source['"]>(.*?)<\/div>/i.exec(html);
    if (sourceMatch) {
        const srcTxt = sourceMatch[1].trim();
        s.source = srcTxt;
        // Try to assume page?
        // Maybe "Player's Handbook 2024"
    }

    return s;
}

async function main() {
    try {
        if (!fs.existsSync(INPUT_FILE)) {
            console.error("Input file not found!");
            return;
        }

        const spellsIn = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
        console.log(`Scraping ${spellsIn.length} spells...`);

        // Resume support
        let results = [];
        const seenUrls = new Set();
        if (fs.existsSync(OUTPUT_FILE)) {
            try {
                results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
                results.forEach(r => seenUrls.add(r.url));
                console.log(`Loaded ${results.length} existing records.`);
            } catch (e) {
                console.log("Error loading existing output, starting fresh.");
            }
        }

        const errors = [];

        for (let i = 0; i < spellsIn.length; i++) {
            const spell = spellsIn[i];
            if (seenUrls.has(spell.url)) {
                continue;
            }

            console.log(`[${i + 1}/${spellsIn.length}] Fetching ${spell.name}...`);
            try {
                const html = await fetchUrl(spell.url);
                const data = parseSpell(html, spell.slug, spell.url);
                results.push(data);

                // Save incrementally
                if (results.length % 10 === 0) {
                    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
                }
            } catch (e) {
                console.error(`Failed ${spell.name}: ${e.message}`);
                errors.push({ name: spell.name, url: spell.url, error: e.message });
            }

            await sleep(DELAY_MS);
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        if (errors.length > 0) {
            fs.writeFileSync(ERRORS_FILE, JSON.stringify(errors, null, 2));
            console.log(`Completed with ${errors.length} errors.`);
        } else {
            console.log("Completed successfully!");
        }

    } catch (e) {
        console.error(e);
    }
}

main();

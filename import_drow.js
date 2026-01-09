const fs = require('fs');
const path = require('path');

const STATBLOCKS_DIR = String.raw`d:\D&D\Campaign\Heart's Curse\Monster statblocks`;
const OUTPUT_FILE = 'src/lib/data/drow_monsters.json';

function parseMonster(html, filename) {
    // Basic slug from filename
    // "Drow Elite Warrior » Monster Stat Block - DnD 5e.html" -> "drow-elite-warrior"
    let slug = filename.split('»')[0].trim().toLowerCase().replace(/\s+/g, '-');
    const url = `local://${filename}`;

    const m = { slug, url, source: "Local_Drow" };

    // 1. Name: <h1>Drow Elite Warrior</h1>
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

    // 3. Stats (AC, HP, Speed) - using robust regex
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

    // 6. Image - local files might not have it or have relative paths
    // For these drow, let's just leave it empty or try to find it.
    // The HTML has <img src='...'> but it might be relative or broken.
    // Let's rely on standard image naming if possible, or skip image logic for now
    // since these are imported from text.
    // However, the HTML does contain image links to aidedd.org if they are online copies.
    const imgMatch = /<img src=['"]([^'"]+)['"][^>]*alt=['"]([^'"]*)['"]>/.exec(html);
    if (imgMatch && imgMatch[1].includes('dnd/images')) {
        m.imageUrl = imgMatch[1];
    }


    // 7. Traits, Actions, Legendary
    const actionsStart = html.indexOf('Actions</div>');
    const legStart = html.indexOf('Legendary actions</div>');
    const reactStart = html.indexOf('Reactions</div>');

    let traitsHtml = html;
    let actionsHtml = "";
    let legHtml = "";
    let reactHtml = "";

    // Rough segmentation
    let indices = [
        { name: 'actions', idx: actionsStart },
        { name: 'legendary', idx: legStart },
        { name: 'reactions', idx: reactStart }
    ].filter(x => x.idx !== -1).sort((a, b) => a.idx - b.idx);

    // Traits is from type end to first section
    // Actually simplicity:
    if (indices.length > 0) {
        traitsHtml = html.substring(0, indices[0].idx);
        for (let i = 0; i < indices.length; i++) {
            const current = indices[i];
            const next = indices[i + 1];
            const endIdx = next ? next.idx : html.length;
            const content = html.substring(current.idx, endIdx);

            if (current.name === 'actions') actionsHtml = content;
            else if (current.name === 'legendary') legHtml = content;
            else if (current.name === 'reactions') reactHtml = content;
        }
    }

    const extractItems = (sectionHtml) => {
        const items = [];
        const pRegex = /<p><strong><em>(.*?)<\/em><\/strong>\.?\s*(.*?)<\/p>/gs;
        let match;
        while ((match = pRegex.exec(sectionHtml)) !== null) {
            items.push({
                name: match[1].trim(),
                desc: match[2].replace(/<[^>]+>/g, '').trim()
            });
        }
        return items;
    };

    m.traits = extractItems(traitsHtml);
    m.actions = extractItems(actionsHtml);
    m.legendary = extractItems(legHtml);
    m.reactions = extractItems(reactHtml);

    return m;
}

function main() {
    try {
        const files = fs.readdirSync(STATBLOCKS_DIR).filter(f => f.endsWith('.html') && !f.startsWith('List'));
        console.log(`Found ${files.length} HTML files.`);

        const results = [];
        for (const file of files) {
            console.log(`Processing ${file}...`);
            const content = fs.readFileSync(path.join(STATBLOCKS_DIR, file), 'utf8');
            const monster = parseMonster(content, file);
            results.push(monster);
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`Saved ${results.length} drow monsters to ${OUTPUT_FILE}`);

    } catch (e) {
        console.error(e);
    }
}

main();

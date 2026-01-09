const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src', 'lib', 'data', 'monsters_2024_final.json');
const outputPath = path.join(__dirname, 'src', 'lib', 'data', 'monsters_2024.ts');

try {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const tsContent = `import { Statblock } from "./statblocks";

export const MONSTERS_2024: Record<string, Statblock> = {
${data.map(m => {
    // Clean string values for TS
    const safeString = (str) => JSON.stringify(str || "");
    const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return `  "${slug}": {
    slug: "${slug}",
    name: ${safeString(m.name)},
    size: ${safeString(m.size)},
    type: ${safeString(m.type)},
    subtype: "",
    alignment: ${safeString(m.alignment)},
    ac: ${m.ac || 10},
    hp: ${m.hp || 10},
    hitDice: "",
    speed: ${safeString(m.speed)},
    stats: {
      str: ${m.stats?.str || 10},
      dex: ${m.stats?.dex || 10},
      con: ${m.stats?.con || 10},
      int: ${m.stats?.int || 10},
      wis: ${m.stats?.wis || 10},
      cha: ${m.stats?.cha || 10}
    },
    saves: ${safeString(m.saves)},
    skills: ${safeString(m.skills)},
    immunities: ${safeString(m.immunities)},
    resistances: ${safeString(m.resistances)},
    conditionImmunities: ${safeString(m.conditionImmunities)},
    senses: ${safeString(m.senses)},
    languages: ${safeString(m.languages)},
    description: ${safeString(m.description)},
    initiative: ${m.initiative || 0},
    cr: ${m.cr || 0},
    traits: ${JSON.stringify(m.traits || [])},
    actions: ${JSON.stringify(m.actions || [])},
    legendary: ${JSON.stringify(m.legendary || [])},
    image: ${m.image_path ? `"${m.image_path}"` : (m.image_url ? `"${m.image_url}"` : "null")},
    source: "${m.source || "2024_Scrape"}"
  }`;
  }).join(',\n')}
};

export const ALL_MONSTERS = MONSTERS_2024;
`;

  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`Successfully generated ${outputPath}`);

} catch (err) {
  console.error("Error generating TS:", err);
}

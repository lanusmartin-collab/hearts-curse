const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/lib/data/monsters_2024_raw.json');

try {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    // Remove BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
        fileContent = fileContent.slice(1);
    }

    const data = JSON.parse(fileContent);
    console.log(`Total monsters: ${data.length}`);

    const counts = {};
    data.forEach(m => {
        const firstChar = m.name.charAt(0).toUpperCase();
        counts[firstChar] = (counts[firstChar] || 0) + 1;
    });

    console.log("Counts by letter:");
    Object.keys(counts).sort().forEach(k => {
        console.log(`${k}: ${counts[k]}`);
    });

} catch (e) {
    console.error(e);
}

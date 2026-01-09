
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

try {
    const data = fs.readFileSync('src/lib/data/monsters_2024_final.json', 'utf8');
    JSON.parse(data);
    console.log("JSON is VALID");
} catch (e) {
    console.error("JSON is INVALID:", e.message);
}

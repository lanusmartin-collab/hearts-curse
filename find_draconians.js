
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('src/lib/data/monsters_2024_final.json');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNumber = 0;
    for await (const line of rl) {
        lineNumber++;
        if (line.includes('Draconian') && line.includes('name')) {
            console.log(`Line ${lineNumber}: ${line.trim()}`);
        }
    }
}

processLineByLine();

const https = require('https');
const fs = require('fs');

// Load monster data
const rawData = fs.readFileSync('src/lib/data/monsters_2024_final.json', 'utf8');
const monsters = JSON.parse(rawData);

const broken = [];
const limit = 20; // Concurrent requests limit
let active = 0;
let index = 0;

console.log(`Checking ${monsters.length} monsters...`);

function checkNext() {
    if (index >= monsters.length && active === 0) {
        console.log('\n--- Report ---');
        console.log(`Found ${broken.length} broken images.`);
        if (broken.length > 0) {
            console.log(JSON.stringify(broken, null, 2));
        }
        return;
    }

    if (index >= monsters.length) return;

    while (active < limit && index < monsters.length) {
        checkMonster(monsters[index++]);
    }
}

function checkMonster(monster) {
    if (!monster.image_url || !monster.image_url.startsWith('http')) {
        // Skip if no external URL
        return;
    }

    active++;
    const req = https.request(monster.image_url, { method: 'HEAD', timeout: 3000 }, (res) => {
        if (res.statusCode === 404) {
            process.stdout.write('X');
            broken.push({ name: monster.name, slug: monster.slug, url: monster.image_url });
        } else {
            process.stdout.write('.');
        }
        active--;
        checkNext();
    });

    req.on('error', (e) => {
        // console.error(`Error checking ${monster.name}: ${e.message}`);
        process.stdout.write('E');
        active--;
        checkNext();
    });

    req.end();
}

checkNext();

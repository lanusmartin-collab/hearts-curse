const fs = require('fs');
const https = require('https');

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

fetchUrl("https://www.aidedd.org/dnd-filters/monsters.php").then(html => {
    fs.writeFileSync('debug_monsters.html', html);
    console.log("Dumped HTML.");
});

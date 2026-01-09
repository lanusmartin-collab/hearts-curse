const https = require('https');
const fs = require('fs');

const url = "https://www.aidedd.org/dnd/monstres.php?vo=aboleth";

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        fs.writeFileSync('aboleth.html', data);
    });
});

const https = require('https');

const url = "https://www.aidedd.org/dnd/monstres.php?vo=aboleth";

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Print the relevant part of HTML (Stats block)
        const start = data.indexOf('<div class="bloc">');
        const end = data.indexOf('<h3>Actions</h3>');
        console.log(data.substring(start, end + 500)); // Show stats + some actions
    });
});

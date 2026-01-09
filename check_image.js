const https = require('https');

const url = "https://www.aidedd.org/dnd/images/lich.jpg";

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
}).on('error', (e) => {
    console.error(e);
});

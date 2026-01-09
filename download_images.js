const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const inputPath = path.join(__dirname, 'src', 'lib', 'data', 'monsters_2024_processed.json');
const outputJsonPath = path.join(__dirname, 'src', 'lib', 'data', 'monsters_2024_final.json');
const imagesDir = path.join(__dirname, 'public', 'images', 'monsters');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirect
                if (response.headers.location) {
                    downloadImage(response.headers.location, dest)
                        .then(resolve)
                        .catch(reject);
                    return;
                }
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => { });
                reject(`Status Code: ${response.statusCode}`);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
}

async function processImages() {
    let data;
    try {
        if (!fs.existsSync(inputPath)) {
            console.error(`Input file not found: ${inputPath}`);
            return;
        }
        data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    } catch (err) {
        console.error("Error reading JSON:", err);
        return;
    }

    const total = data.length;
    let downloaded = 0;
    let failed = 0;
    let skipped = 0;

    console.log(`Starting download for ${total} monsters...`);

    // Process in chunks
    const CHUNK_SIZE = 10;
    for (let i = 0; i < total; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(async (monster) => {
            // Create a clean filename
            let filename = "";
            let slug = "";

            if (monster.image_url) {
                slug = monster.image_url.split('/').pop();
            }

            if (!slug) {
                // Try generating slug from name
                slug = monster.name.toLowerCase()
                    .replace(/['’]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                slug += ".jpg";
            }

            filename = slug;
            if (!filename.endsWith('.jpg')) filename += '.jpg';

            const localFilename = filename;
            const localPath = path.join(imagesDir, localFilename);
            const publicUrl = `/images/monsters/${localFilename}`;

            // Check if already exists
            if (fs.existsSync(localPath)) {
                monster.image_path = publicUrl;
                monster.has_image = true;
                skipped++;
                return;
            }

            // Construct URL candidates
            const baseUrl = "https://www.aidedd.org/monster/img/";
            let candidates = [filename];

            // Try with 'giant-' prefix removal if applicable, though Aidedd usually matches slug

            let success = false;
            for (const cand of candidates) {
                const tryUrl = `${baseUrl}${cand}`;

                try {
                    await downloadImage(tryUrl, localPath);
                    monster.image_path = publicUrl;
                    monster.has_image = true;
                    downloaded++;
                    success = true;
                    break;
                } catch {
                    // console.error(`Failed ${cand}: ${err}`);
                }
            }

            if (!success) {
                // If failed, verify if it was meant to happen
                monster.image_path = null;
                failed++;
            }
        }));

        if (i % 50 === 0 && i > 0) {
            console.log(`Processed ${i}/${total} (Downloads: ${downloaded}, Skips: ${skipped}, Fails: ${failed})...`);
        }
    }

    console.log(`Job complete.`);
    console.log(`Downloaded: ${downloaded}`);
    console.log(`Skipped (Already Existed): ${skipped}`);
    console.log(`Failed: ${failed}`);

    // Clean data for TS output
    const cleanData = data.map(m => ({
        ...m,
        slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        source: "2024_Scrape"
    }));

    fs.writeFileSync(outputJsonPath, JSON.stringify(cleanData, null, 2), 'utf8');
    console.log(`Saved final data to ${outputJsonPath}`);
}

processImages();

import requests
from bs4 import BeautifulSoup
import json
import re

# 1. Load Local Monsters
try:
    with open('src/lib/data/monsters_2024_final.json', 'r', encoding='utf-8') as f:
        local_data = json.load(f)
        # Slugs in local data might need normalization. 
        # The scraping process created slugs from names.
        # Let's see if we have 'slug' or 'url' in local data.
        # We constructed slugs as name.toLowerCase().replace(...) in the process script.
        # But let's look at the keys in 'monsters_2024.ts' or just re-generate slugs from names.
        local_slugs = set()
        for m in local_data:
            # Reconstruct the slug logic used previously
            slug = m['name'].lower().replace(' ', '-').replace("'", "")
            # Remove special chars
            slug = re.sub(r'[^a-z0-9-]', '', slug)
            local_slugs.add(slug)
            
            # Also add the URL-based slug if present
            if 'url' in m:
                url_slug = m['url'].split('/')[-1]
                local_slugs.add(url_slug)
except FileNotFoundError:
    print("Local file not found, assuming empty.")
    local_slugs = set()

print(f"Local monsters count: {len(local_slugs)}")

# 2. Fetch Remote List
url = "https://www.aidedd.org/en/rules/monsters/"
print(f"Fetching {url}...")
try:
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch list: {response.status_code}")
        # Try the other URL found in browser logs if this fails
        url = "https://www.aidedd.org/dnd-filters/monsters.php" 
        print(f"Retrying with {url}...")
        response = requests.get(url)

    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Selector based on browser investigation
    # 'a[href^="../dnd/monstres.php?vo="]'
    links = soup.select('a[href*="monstres.php?vo="]')
    
    remote_monsters = []
    for link in links:
        href = link.get('href')
        name = link.text.strip()
        # Extract vo parameter
        match = re.search(r'vo=([^&]+)', href)
        if match:
            slug = match.group(1)
            remote_monsters.append({'name': name, 'slug': slug, 'url': f"https://www.aidedd.org/dnd/monstres.php?vo={slug}"})

    print(f"Remote monsters found: {len(remote_monsters)}")

    # 3. Diff
    missing = []
    for rm in remote_monsters:
        if rm['slug'] not in local_slugs:
            # Try fuzzy match? (e.g. 'adult-black-dragon' vs 'dragon-black-adult')
            # For now, simplistic check.
            missing.append(rm)

    print(f"Missing monsters: {len(missing)}")
    
    # Save missing list
    with open('missing_monsters.json', 'w', encoding='utf-8') as f:
        json.dump(missing, f, indent=2)

except Exception as e:
    print(f"Error: {e}")

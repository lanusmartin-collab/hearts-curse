import json
import re

def parse_cr(cr_str):
    if '/' in cr_str:
        num, den = cr_str.split('/')
        return float(num) / float(den)
    try:
        if cr_str == "None" or cr_str == "":
            return 0
        return float(cr_str)
    except ValueError:
        return 0

def normalize_monster(raw):
    # Stats to numbers
    stats = {}
    for k, v in raw.get("stats", {}).items():
        try:
            stats[k] = int(v)
        except:
            stats[k] = 10 # Default fall back?
            
    # AC and HP to numbers (strip text if any)
    # AC might have text like "18 (natural armor)"
    ac_str = str(raw.get("ac", "0"))
    ac_match = re.match(r"(\d+)", ac_str)
    ac = int(ac_match.group(1)) if ac_match else 0
    
    hp_str = str(raw.get("hp", "0"))
    hp_match = re.match(r"(\d+)", hp_str)
    hp = int(hp_match.group(1)) if hp_match else 0
    
    # Image URL Construction
    # Aidedd images are often at https://www.aidedd.org/dnd/images/[slug].jpg
    # But names can be complex. Typically it uses the same slug as the URL.
    # url example: https://www.aidedd.org/monster/young-green-dragon
    # potential image: https://www.aidedd.org/dnd/images/young-green-dragon.jpg
    # We will assume this pattern for now and verify later.
    image_url = ""
    if raw.get("image") is True:
        slug = raw.get("url", "").split("/")[-1]
        if slug:
            image_url = f"https://www.aidedd.org/dnd/images/{slug}.jpg"
            
    return {
        "name": raw["name"],
        "cr": parse_cr(raw.get("cr", "0")),
        "cr_display": raw.get("cr", "0"),
        "type": raw.get("type", "Unknown"),
        "size": raw.get("size", "Medium"),
        "ac": ac,
        "ac_display": raw.get("ac", ""),
        "hp": hp,
        "hp_display": raw.get("hp", ""),
        "speed": raw.get("speed", ""),
        "stats": stats,
        "alignment": raw.get("alignment", ""),
        "legendary": raw.get("legendary", "") == "Legendary",
        "source_url": raw.get("url", ""),
        "image_url": image_url,
        "has_image": raw.get("image", False)
    }

input_path = r"d:\D&D\Campaign\Heart's Curse\web-app\src\lib\data\monsters_2024_raw.json"
output_path = r"d:\D&D\Campaign\Heart's Curse\web-app\src\lib\data\monsters_2024_processed.json"

with open(input_path, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)

processed_data = [normalize_monster(m) for m in raw_data]

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(processed_data, f, indent=2)

print(f"Processed {len(processed_data)} monsters.")

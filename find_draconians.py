
import json

try:
    with open("src/lib/data/monsters_2024_final.json", "r", encoding="utf-8") as f:
        # Read line by line to get line numbers
        for i, line in enumerate(f):
            if "Draconian" in line and "name" in line:
                print(f"Line {i+1}: {line.strip()}")
except Exception as e:
    print(f"Error: {e}")

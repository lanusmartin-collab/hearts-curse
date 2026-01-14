
export type LootTableEntry = {
    name: string;
    type: string; // "Popen", "Scroll", "Ring", "Wondrous", "Weapon", "Armor"
    rarity: string;
};

// --- GEMSTONES ---
// 10 gp
export const GEMS_10_GP = [
    "Azurite", "Banded Agate", "Blue Quartz", "Eye Agate", "Hematite", "Lapis Lazuli", "Malachite", "Moss Agate", "Obsidian", "Rhodochrosite", "Tiger Eye", "Turquoise"
];

// 50 gp
export const GEMS_50_GP = [
    "Bloodstone", "Carnelian", "Chalcedony", "Chrysoprase", "Citrine", "Jasper", "Moonstone", "Onyx", "Quartz", "Sardonyx", "Star Rose Quartz", "Zircon"
];

// 100 gp
export const GEMS_100_GP = [
    "Amber", "Amethyst", "Chrysoberyl", "Coral", "Garnet", "Jade", "Jet", "Pearl", "Spinel", "Tourmaline"
];

// 500 gp
export const GEMS_500_GP = [
    "Alexandrite", "Aquamarine", "Black Pearl", "Blue Spinel", "Peridot", "Topaz"
];

// 1,000 gp
export const GEMS_1000_GP = [
    "Black Opal", "Blue Sapphire", "Emerald", "Fire Opal", "Opal", "Star Ruby", "Star Sapphire", "Yellow Sapphire"
];

// 5,000 gp
export const GEMS_5000_GP = [
    "Black Sapphire", "Diamond", "Jacinth", "Ruby"
];

// --- ART OBJECTS ---
// 25 gp
export const ART_25_GP = [
    "Silver ewer", "Carved bone statuette", "Small gold bracelet", "Cloth-of-gold vestments", "Black velvet mask stitched with silver thread", "Copper chalice with silver filigree", "Pair of engraved bone dice", "Small mirror set in a painted wooden frame", "Embroidered silk handkerchief", "Gold locket with a painted portrait inside"
];

// 250 gp
export const ART_250_GP = [
    "Gold ring set with bloodstones", "Carved ivory statuette", "Large gold bracelet", "Silver necklace with a gemstone pendant", "Bronze crown", "Silk robe with gold embroidery", "Large well-made tapestry", "Brass mug with jade inlays", "Box of turquoise animal figurines", "Gold bird cage with electrum filigree"
];

// 750 gp
export const ART_750_GP = [
    "Silver chalice set with moonstones", "Silver-plated steel longsword with jet set in hilt", "Carved harp of exotic wood with ivory inlay and zircon gems", "Small gold idol", "Gold dragon comb set with red garnets", "Bottle stopper cork embossed with gold leaf and set with amethysts", "Ceremonial electrum dagger with a black pearl in the pommel", "Silver and gold brooch"
];

// 2,500 gp
export const ART_2500_GP = [
    "Fine gold chain set with a fire opal", "Old masterpiece painting", "Embroidered silk and velvet mantle set with numerous moonstones", "Platinum bracelet set with a sapphire", "Embroidered glove set with jewel chips", "Jeweled anklet", "Gold music box", "Gold circlet set with four aquamarines", "Eye patch with a mock eye set in blue sapphire and moonstone"
];

// 7,500 gp
export const ART_7500_GP = [
    "Jeweled gold crown", "Jeweled platinum ring", "Small gold statuette set with rubies", "Gold cup set with emeralds", "Gold jewelry box with platinum filigree", "Painted gold child's sarcophagus", "Jade game board with solid gold playing pieces", "Bejeweled ivory drinking horn with gold filigree"
];

// --- MAGIC ITEM TABLES (Simplified 5e SRD + Homebrew) ---

// TABLE A: Potions (Common/Uncommon) & Cantrips
export const MAGIC_ITEMS_A = [
    { name: "Potion of Healing", type: "Potion", rarity: "Common" },
    { name: "Potion of Climbing", type: "Potion", rarity: "Common" },
    { name: "Scroll of Cantrip", type: "Scroll", rarity: "Common" },
    { name: "Scroll of 1st Level Spell", type: "Scroll", rarity: "Common" },
    { name: "Bag of Holding", type: "Wondrous", rarity: "Uncommon" }, // Moved down for fun
    { name: "Driftglobe", type: "Wondrous", rarity: "Uncommon" }
];

// TABLE B: Utils & Uncommon Potions
export const MAGIC_ITEMS_B = [
    { name: "Potion of Greater Healing", type: "Potion", rarity: "Uncommon" },
    { name: "Potion of Water Breathing", type: "Potion", rarity: "Uncommon" },
    { name: "Potion of Growth", type: "Potion", rarity: "Uncommon" },
    { name: "Scroll of 2nd Level Spell", type: "Scroll", rarity: "Uncommon" },
    { name: "Scroll of 3rd Level Spell", type: "Scroll", rarity: "Uncommon" },
    { name: "Bag of Holding", type: "Wondrous", rarity: "Uncommon" },
    { name: "Alchemy Jug", type: "Wondrous", rarity: "Uncommon" },
    { name: "Mariner's Armor", type: "Armor", rarity: "Uncommon" },
    { name: "Saddle of the Cavalier", type: "Wondrous", rarity: "Uncommon" },
    { name: "Wand of Magic Detection", type: "Wand", rarity: "Uncommon" },
    { name: "Cap of Water Breathing", type: "Wondrous", rarity: "Uncommon" },
    { name: "Lantern of Revealing", type: "Wondrous", rarity: "Uncommon" },
    { name: "Rope of Climbing", type: "Wondrous", rarity: "Uncommon" }
];

// TABLE C: Rare Potions & Scrolls
export const MAGIC_ITEMS_C = [
    { name: "Potion of Superior Healing", type: "Potion", rarity: "Rare" },
    { name: "Potion of Heroism", type: "Potion", rarity: "Rare" },
    { name: "Potion of Diminution", type: "Potion", rarity: "Rare" },
    { name: "Scroll of 4th Level Spell", type: "Scroll", rarity: "Rare" },
    { name: "Scroll of 5th Level Spell", type: "Scroll", rarity: "Rare" },
    { name: "Quaal's Feather Token", type: "Wondrous", rarity: "Rare" },
    { name: "Horseshoes of Speed", type: "Wondrous", rarity: "Rare" },
    { name: "Necklace of Fireballs", type: "Wondrous", rarity: "Rare" },
    { name: "Chime of Opening", type: "Wondrous", rarity: "Rare" }
];

// TABLE D: Potions V.Rare & High Scrolls
export const MAGIC_ITEMS_D = [
    { name: "Potion of Supreme Healing", type: "Potion", rarity: "Very Rare" },
    { name: "Potion of Invisibility", type: "Potion", rarity: "Very Rare" },
    { name: "Potion of Speed", type: "Potion", rarity: "Very Rare" },
    { name: "Scroll of 6th Level Spell", type: "Scroll", rarity: "Very Rare" },
    { name: "Scroll of 7th Level Spell", type: "Scroll", rarity: "Very Rare" },
    { name: "Scroll of 8th Level Spell", type: "Scroll", rarity: "Very Rare" },
    { name: "Arrow of Slaying", type: "Weapon", rarity: "Very Rare" },
    { name: "Portable Hole", type: "Wondrous", rarity: "Rare" },
    { name: "Nolzur's Marvelous Pigments", type: "Wondrous", rarity: "Very Rare" }
];

// TABLE E: Legendaries
export const MAGIC_ITEMS_E = [
    { name: "Scroll of 9th Level Spell", type: "Scroll", rarity: "Legendary" },
    { name: "Potion of Storm Giant Strength", type: "Potion", rarity: "Legendary" },
    { name: "Sovereign Glue", type: "Wondrous", rarity: "Legendary" },
    { name: "Universal Solvent", type: "Wondrous", rarity: "Legendary" },
    { name: "Arrow of Slaying (Dragon)", type: "Weapon", rarity: "Very Rare" }
];

// TABLE F: Uncommon Stat Boosters & Weapons
export const MAGIC_ITEMS_F = [
    { name: "Weapon, +1", type: "Weapon", rarity: "Uncommon" },
    { name: "Shield, +1", type: "Armor", rarity: "Uncommon" },
    { name: "Rod of the Pact Keeper +1", type: "Rod", rarity: "Uncommon" },
    { name: "Wand of the War Mage +1", type: "Wand", rarity: "Uncommon" },
    { name: "Gauntlets of Ogre Power", type: "Wondrous", rarity: "Uncommon" },
    { name: "Headband of Intellect", type: "Wondrous", rarity: "Uncommon" },
    { name: "Boots of Elvenkind", type: "Wondrous", rarity: "Uncommon" },
    { name: "Cloak of Elvenkind", type: "Wondrous", rarity: "Uncommon" },
    { name: "Boots of Striding and Springing", type: "Wondrous", rarity: "Uncommon" },
    { name: "Bracers of Archery", type: "Wondrous", rarity: "Uncommon" },
    { name: "Brooch of Shielding", type: "Wondrous", rarity: "Uncommon" },
    { name: "Broom of Flying", type: "Wondrous", rarity: "Uncommon" },
    { name: "Cloak of Protection", type: "Wondrous", rarity: "Uncommon" },
    { name: "Gem of Brightness", type: "Wondrous", rarity: "Uncommon" },
    { name: "Gloves of Missile Snaring", type: "Wondrous", rarity: "Uncommon" },
    { name: "Hat of Disguise", type: "Wondrous", rarity: "Uncommon" },
    { name: "Javelin of Lightning", type: "Weapon", rarity: "Uncommon" },
    { name: "Pearl of Power", type: "Wondrous", rarity: "Uncommon" },
    { name: "Ring of Mind Shielding", type: "Ring", rarity: "Uncommon" },
    { name: "Ring of Protection", type: "Ring", rarity: "Rare" }, // Actually Rare usually
    { name: "Ring of Swimming", type: "Ring", rarity: "Uncommon" },
    { name: "Ring of Warmth", type: "Ring", rarity: "Uncommon" },
    { name: "Slippers of Spider Climbing", type: "Wondrous", rarity: "Uncommon" },
    { name: "Winged Boots", type: "Wondrous", rarity: "Uncommon" }
];

// TABLE G: Rare Weapons & Wonder
export const MAGIC_ITEMS_G = [
    { name: "Weapon, +2", type: "Weapon", rarity: "Rare" },
    { name: "Weapon of Warning", type: "Weapon", rarity: "Rare" },
    { name: "Shield, +2", type: "Armor", rarity: "Rare" },
    { name: "Armor, +1", type: "Armor", rarity: "Rare" },
    { name: "Wand of the War Mage +2", type: "Wand", rarity: "Rare" },
    { name: "Rod of the Pact Keeper +2", type: "Rod", rarity: "Rare" },
    { name: "Amulet of Health", type: "Wondrous", rarity: "Rare" },
    { name: "Belt of Hill Giant Strength", type: "Wondrous", rarity: "Rare" },
    { name: "Boots of Speed", type: "Wondrous", rarity: "Rare" },
    { name: "Bracers of Defense", type: "Wondrous", rarity: "Rare" },
    { name: "Cloak of Displacement", type: "Wondrous", rarity: "Rare" },
    { name: "Cape of the Mountebank", type: "Wondrous", rarity: "Rare" },
    { name: "Dagger of Venom", type: "Weapon", rarity: "Rare" },
    { name: "Flame Tongue", type: "Weapon", rarity: "Rare" },
    { name: "Mace of Disruption", type: "Weapon", rarity: "Rare" },
    { name: "Mace of Smiting", type: "Weapon", rarity: "Rare" },
    { name: "Mace of Terror", type: "Weapon", rarity: "Rare" },
    { name: "Mantle of Spell Resistance", type: "Wondrous", rarity: "Rare" },
    { name: "Ring of Evasion", type: "Ring", rarity: "Rare" },
    { name: "Ring of Feather Falling", type: "Ring", rarity: "Rare" },
    { name: "Ring of Free Action", type: "Ring", rarity: "Rare" },
    { name: "Ring of Protection", type: "Ring", rarity: "Rare" },
    { name: "Ring of Resistance", type: "Ring", rarity: "Rare" },
    { name: "Ring of Spell Storing", type: "Ring", rarity: "Rare" },
    { name: "Sun Blade", type: "Weapon", rarity: "Rare" },
    { name: "Vicious Weapon", type: "Weapon", rarity: "Rare" },
    { name: "Wings of Flying", type: "Wondrous", rarity: "Rare" }
];

// TABLE H: Very Rare Power
export const MAGIC_ITEMS_H = [
    { name: "Weapon, +3", type: "Weapon", rarity: "Very Rare" },
    { name: "Shield, +3", type: "Armor", rarity: "Very Rare" },
    { name: "Armor, +2", type: "Armor", rarity: "Very Rare" },
    { name: "Wand of the War Mage +3", type: "Wand", rarity: "Very Rare" },
    { name: "Rod of the Pact Keeper +3", type: "Rod", rarity: "Very Rare" },
    { name: "Amulet of the Planes", type: "Wondrous", rarity: "Very Rare" },
    { name: "Belt of Fire Giant Strength", type: "Wondrous", rarity: "Very Rare" },
    { name: "Belt of Frost Giant Strength", type: "Wondrous", rarity: "Very Rare" },
    { name: "Belt of Stone Giant Strength", type: "Wondrous", rarity: "Very Rare" },
    { name: "Candle of Invocation", type: "Wondrous", rarity: "Very Rare" },
    { name: "Cloak of Arachnida", type: "Wondrous", rarity: "Very Rare" },
    { name: "Dancing Sword", type: "Weapon", rarity: "Very Rare" },
    { name: "Demon Armor", type: "Armor", rarity: "Very Rare" },
    { name: "Dwarven Plate", type: "Armor", rarity: "Very Rare" },
    { name: "Dwarven Thrower", type: "Weapon", rarity: "Very Rare" },
    { name: "Frost Brand", type: "Weapon", rarity: "Very Rare" },
    { name: "Helm of Brilliance", type: "Wondrous", rarity: "Very Rare" },
    { name: "Manual of Bodily Health", type: "Wondrous", rarity: "Very Rare" },
    { name: "Manual of Quickness of Action", type: "Wondrous", rarity: "Very Rare" },
    { name: "Ring of Regeneration", type: "Ring", rarity: "Very Rare" },
    { name: "Ring of Shooting Stars", type: "Ring", rarity: "Very Rare" },
    { name: "Ring of Telekinesis", type: "Ring", rarity: "Very Rare" },
    { name: "Robe of Scintillating Colors", type: "Wondrous", rarity: "Very Rare" },
    { name: "Robe of Stars", type: "Wondrous", rarity: "Very Rare" },
    { name: "Spellguard Shield", type: "Armor", rarity: "Very Rare" },
    { name: "Staff of Fire", type: "Staff", rarity: "Very Rare" },
    { name: "Staff of Power", type: "Staff", rarity: "Very Rare" }
];

// TABLE I: Legendary / Artifact
export const MAGIC_ITEMS_I = [
    { name: "Armor, +3", type: "Armor", rarity: "Legendary" },
    { name: "Belt of Cloud Giant Strength", type: "Wondrous", rarity: "Legendary" },
    { name: "Belt of Storm Giant Strength", type: "Wondrous", rarity: "Legendary" },
    { name: "Cloak of Invisibility", type: "Wondrous", rarity: "Legendary" },
    { name: "Deck of Many Things", type: "Wondrous", rarity: "Legendary" },
    { name: "Defender", type: "Weapon", rarity: "Legendary" },
    { name: "Hammer of Thunderbolts", type: "Weapon", rarity: "Legendary" },
    { name: "Holy Avenger", type: "Weapon", rarity: "Legendary" },
    { name: "Luck Blade", type: "Weapon", rarity: "Legendary" },
    { name: "Plate Armor of Etherealness", type: "Armor", rarity: "Legendary" },
    { name: "Ring of Djinni Summoning", type: "Ring", rarity: "Legendary" },
    { name: "Ring of Elemental Command", type: "Ring", rarity: "Legendary" },
    { name: "Ring of Spell Turning", type: "Ring", rarity: "Legendary" },
    { name: "Rod of Lordly Might", type: "Rod", rarity: "Legendary" },
    { name: "Staff of the Magi", type: "Staff", rarity: "Legendary" },
    { name: "Vorpal Sword", type: "Weapon", rarity: "Legendary" },
    { name: "Apparatus of Kwalish", type: "Wondrous", rarity: "Legendary" },
    { name: "Sphere of Annihilation", type: "Wondrous", rarity: "Legendary" },
    { name: "Talisman of Pure Good", type: "Wondrous", rarity: "Legendary" },
    { name: "Talisman of Ultimate Evil", type: "Wondrous", rarity: "Legendary" }
];

export type ShopItem = {
    name: string;
    type?: string;
    rarity?: string;
    cost: string;
    effect?: string; // This acts as the description for most items
    stock?: number;
    npcQuote?: string;
    properties?: string[];
    source?: string; // Added to match usage
    attunement?: boolean; // Added to match usage
    description?: string; // Added to match usage
};

export const KHELBEN_GIFTS: ShopItem[] = [
    { name: "The Blade of Gales and Aether", type: "Rapier +2", rarity: "Very Rare", cost: "Gift", effect: "Cyclone Spellblade (3/day): Action to unleash a 30ft line of wind. Creatures caught must succeed on a DC 16 STR save or take 3d6 slashing damage and be pushed 15ft away.", npcQuote: "Light as a whisper, sharp as a rebuke. Treat it well.", properties: ["Finesse", "Light", "Attunement"] },
    { name: "The Resonance Sky-Axe", type: "Halberd +2", rarity: "Very Rare", cost: "Gift", effect: "Djinni's Caprice (Recharge 5-6): As a bonus action, teleport up to 30ft to an unoccupied space you can see. Thunder booms, dealing 2d6 thunder damage to adjacent creatures (DC 16 CON save negates).", npcQuote: "It hums when the storm approaches. Do you feel it?", properties: ["Heavy", "Reach", "Two-Handed", "Attunement"] },
    { name: "The Storm-Wind Greatbow", type: "Longbow +2", rarity: "Very Rare", cost: "Gift", effect: "Whirlwind Step (3/day): When you hit a creature, you can teleport to an unoccupied space within 10ft of the target.", npcQuote: "Draw deep, and let the wind carry your hate.", properties: ["Ammunition", "Heavy", "Two-Handed", "Attunement"] },
    { name: "Mantle of the Azure Cloud", type: "Wondrous", rarity: "Very Rare", cost: "Gift", effect: "Gale-Force Strike: While flying, diving at least 30ft before hitting with a melee attack deals an extra 2d8 lightning damage and knocks the target Prone (no save). Grants Fly speed 50ft.", npcQuote: "Wrap yourself in the sky, little hero.", properties: ["Attunement"] },
    { name: "The Blackstaff's Zephyr-Pouch", type: "Wondrous", rarity: "Legendary", cost: "Gift", effect: "Breeze Control: As a bonus action, you can summon a gust of wind to retrieve an object weighing less than 5lbs from within 30ft, or push a creature 5ft (DC 14 STR negates). Functions as Bag of Holding.", npcQuote: "A small piece of infinite sky. Don't get lost in it." }
];

export const FIMBLE_INVENTORY: ShopItem[] = [
    { name: "Potion of Speed", type: "Potion", rarity: "Very Rare", cost: "The Sacrifice of Innocence (Lose 1 Skill Proficiency)", effect: "Doubles speed, +2 AC, Advantage on Dex saves, and an additional action on each turn (1 minute).", npcQuote: "Fast as thought... but thoughts fade, don't they? Heh heh.", properties: ["Consumable"] },
    { name: "Potion of Invisibility", type: "Potion", rarity: "Very Rare", cost: "The Weight of Years (Age 1d10 years)", effect: "You become invisible for 1 hour. Taking an action or attacking breaks it.", npcQuote: "Gone... like your youth. A fair trade, yes?", properties: ["Consumable"] },
    { name: "Potion of Flying", type: "Potion", rarity: "Very Rare", cost: "The Fading Memory (Lose memory of loved one)", effect: "You gain a flying speed equal to your walking speed for 1 hour and can hover.", npcQuote: "Up, up, and away... leaving everything behind.", properties: ["Consumable"] },
    { name: "Oil of Sharpness", type: "Oil", rarity: "Very Rare", cost: "The Toll of Labor (1 Exhaustion, remove outside only)", effect: "Coat a slashing/piercing weapon. It becomes +3 and deals maximized damage against objects (1 hour).", npcQuote: "Sharp enough to cut the fabric of fate. Costs a bit of sweat.", properties: ["Consumable"] },
    { name: "Spell Scroll (6th-8th)", type: "Scroll", rarity: "Very Rare", cost: "The Cognitive Debt (Lose 1st lvl slot)", effect: "Cast a random spell of 6th-8th level (DM choice).", npcQuote: "Knowledge is power... until it burns a hole in your mind.", properties: ["Consumable", "Wizard Only"] },
    { name: "Staff of Power", type: "Staff", rarity: "Very Rare", cost: "The Geas of the Gilded (Quest)", effect: "+2 to AC/Saves/Spell Attacks. Charges (20) used for Fireball, Lightning Bolt, Wall of Force, etc.", npcQuote: "Ah, the big stick! For this... I need a favor. A small, dangerous favor.", properties: ["Attunement (Sorcerer, Warlock, or Wizard)"] },
    { name: "Belt of Fire Giant Strength", type: "Wondrous", rarity: "Very Rare", cost: "The Heavy Burden (-2d10 Max HP)", effect: "Your Strength score becomes 25.", npcQuote: "Strong as a mountain... and just as eroding.", properties: ["Attunement"] },
    { name: "Manual of Bodily Health", type: "Wondrous", rarity: "Very Rare", cost: "The Trade of Vitality (Age 2d10 years)", effect: "Read for 48 hours over 6 days. Con increases by +2 (max 30).", npcQuote: "Health... for time. The eternal irony.", properties: ["Consumable"] }
];

export const IRON_KNOT_SERVICES = [
    { name: "Ghost-Touch Weapon Oil", cost: "1 Bottled Lightning", effect: "Ignores resistance/immunity of undead/incorporeal. +1d8 Force.", npcQuote: "Makes the steel bite the spirit. Good against the misty ones.", properties: ["Consumable", "Applied"] },
    { name: "Ghost-Touch Armor Polish", cost: "1 Bottled Lightning", effect: "+2 AC vs Incorporeal. Can grapple ghosts.", npcQuote: "Slick it on. Ghosts slide right off, or stick if you want 'em to.", properties: ["Consumable", "Applied"] },
    { name: "Item Restoration", cost: "1 Bottled Lightning + Sacrifice of Effort (DC 18 Athletics, 1 Exhaustion)", effect: "Repair drained items.", npcQuote: "Bring me the lightning... and your back-breaking effort. We'll fix it." },
    { name: "Masterwork Upgrade", cost: "3 Bottled Lightning + Rare Material + Moment of Peace", effect: "Upgrade +1 to +2, or add property.", npcQuote: "To make it sing... I need the storm in a bottle." }
];

export const CROW_NEST_INVENTORY: ShopItem[] = [
    { name: "Rations (1 day)", type: "Gear", rarity: "Common", cost: "3 gp", stock: 100, npcQuote: "Eat up. Might be your last meal. No refunds.", properties: ["Consumable"], effect: "Prevents exhaustion from starvation for one day." },
    { name: "Potion of Healing", type: "Potion", rarity: "Uncommon", cost: "150 gp", stock: 4, npcQuote: "Red juice. Keeps the blood inside. 150 gold. Pay up.", properties: ["Consumable"], effect: "Restores 2d4 + 2 hit points." },
    { name: "Potion of Greater Healing", type: "Potion", rarity: "Rare", cost: "400 gp", stock: 2, npcQuote: "The good stuff. For when you really screw up.", properties: ["Consumable"], effect: "Restores 4d4 + 4 hit points." },
    { name: "Amulet of Health", type: "Wondrous", rarity: "Uncommon", cost: "450 gp", stock: 1, npcQuote: "Found it on a corpse. Wash it off, it's fine.", properties: ["Attunement"], effect: "Your Constitution score is 19 while you wear this amulet." },
    { name: "Cloak of Protection", type: "Wondrous", rarity: "Uncommon", cost: "600 gp", stock: 1, npcQuote: "Keeps the rain off... and the knives. Mostly.", properties: ["Attunement"], effect: "You gain a +1 bonus to AC and saving throws." },
    { name: "Weapon, +1", type: "Weapon", rarity: "Uncommon", cost: "500 gp", stock: 3, npcQuote: "Sharp enough. Don't ask where I got it.", properties: ["Versatile?"], effect: "You have a +1 bonus to attack and damage rolls made with this magic weapon." },
    { name: "Scimitar of Speed", type: "Weapon", rarity: "Rare", cost: "2500 gp (Risk Fee applies)", npcQuote: "Fastest blade in the dark. You assume all liability.", properties: ["Finesse", "Light", "Attunement"], effect: "+2 bonus to attack and damage rolls. Bonus action to make one attack with it." }
];

// [NEW] Special Order Stock for The Iron Knot (Zhentarim)
export const ZHENTARIM_SPECIAL_STOCK: ShopItem[] = [
    { name: "Drow Poison (3 doses)", type: "Poison", rarity: "Rare", cost: "500 gp", effect: "Correction: Sleep Poison. DC 13 CON or Unconscious for 1 hour. Wakes if damaged.", npcQuote: "Silence in a bottle. Very popular." },
    { name: "Assassin's Blood (Ingested)", type: "Poison", rarity: "Rare", cost: "300 gp", effect: "DC 10 CON. On fail: 1d12 Poison dmg + Poisoned for 24h.", npcQuote: "For the dinner guest who talks too much." },
    { name: "Chime of Opening", type: "Wondrous", rarity: "Rare", cost: "1,500 gp", effect: "10 Charges. Action: Open locked object within 60ft.", npcQuote: "No door is closed to us." },
    { name: "Slippers of Spider Climbing", type: "Wondrous", rarity: "Uncommon", cost: "800 gp", stock: 1, effect: "Walk up walls/ceilings hands-free.", npcQuote: "We learned a few tricks from the drow." },
    { name: "Nolzur's Marvelous Pigments", type: "Wondrous", rarity: "Very Rare", cost: "3,000 gp", effect: "Paint objects into reality.", npcQuote: "Create your own exit." },
    { name: "Portable Hole", type: "Wondrous", rarity: "Rare", cost: "2,000 gp", effect: "6ft diameter hole into extra-dimensional space.", npcQuote: "The ultimate smuggling tool." },
    { name: "Ring of Mind Shielding", type: "Ring", rarity: "Uncommon", cost: "1,200 gp", effect: "Immune to magic that reads thoughts/lies.", npcQuote: "Keep your secrets. Keep your head.", properties: ["Attunement"] }
];

export const CAMPAIGN_UNIQUE_ITEMS: ShopItem[] = [
    // Oakhaven & Mines
    { name: "Adamantine Ingot", type: "Material", rarity: "Uncommon", cost: "Loot", effect: "Can be used to craft/upgrade Armor to negate crits.", npcQuote: "Cold, heavy, and unbreakable. Like a dwarf's grudge." },
    { name: "Dagger of Venom", type: "Weapon", rarity: "Rare", cost: "Loot", effect: "+1 Dagger. Action: Coat blade in black poison (DC 15 CON or 2d10 Poison + Poisoned).", npcQuote: "It drips malice even when dry.", properties: ["Finesse", "Light"] },

    // Castle & Silent Wards
    { name: "Scroll of Counterspell", type: "Scroll", rarity: "Uncommon", cost: "Loot", effect: "Casts Counterspell (3rd Level).", npcQuote: "No." },
    { name: "Wand of Magic Missiles", type: "Wand", rarity: "Uncommon", cost: "Loot", effect: "7 Charges. Cast Magic Missile (1-3 charges). +1 Force damage.", npcQuote: "Reliable. Boring. Deadly." },
    { name: "Boots of Striding and Springing", type: "Wondrous", rarity: "Uncommon", cost: "Loot", effect: "Speed 30ft min. Jump distance x3.", npcQuote: "Made for dwarf legs, fits anyone." },
    { name: "Scroll of Remove Curse", type: "Scroll", rarity: "Uncommon", cost: "Quest Reward", effect: "Removes a curse.", npcQuote: "A few words to wash away a lifetime of bad choices." },
    { name: "Bag of Holding", type: "Wondrous", rarity: "Uncommon", cost: "Quest Reward", effect: "Holds 500lbs. Weighs 15lbs.", npcQuote: "Don't put sharp objects in it. Or water. Or... actually, just be careful." },
    { name: "Driftglobe", type: "Wondrous", rarity: "Uncommon", cost: "Loot", effect: "Casts Light or Daylight. Floats 5ft off ground. Essential for the Void.", npcQuote: "A little sun for the places god forgot." },
    { name: "Bag of Tricks (Rust)", type: "Wondrous", rarity: "Uncommon", cost: "Loot", effect: "Pull a mechanical animal ball (1/day).", npcQuote: "It's full of fuzz and gears. Don't let them bite." },
    { name: "Horn of Blasting", type: "Wondrous", rarity: "Rare", cost: "Loot (Goristroi)", effect: "Action: 30ft cone. 5d6 Thunder dmg (DC 15 CON save halves). 20% chance to blow up user.", npcQuote: "Loud enough to wake the dead. Hopefully not literaly." },

    // Library & Catacombs
    { name: "Pearl of Power", type: "Wondrous", rarity: "Uncommon", cost: "Loot (Rhaugilath)", effect: "Regain one spell slot up to 3rd level (1/day).", npcQuote: "It pulses with a heartbeat of pure mana.", properties: ["Attunement (Spellcaster)"] },
    { name: "The Nether Scrolls", type: "Artifact", rarity: "Legendary", cost: "Quest Item", effect: "Contains the history of Netheril. Grants +2 INT max 24. Dangerous knowledge.", npcQuote: "Some things were forgotten for a reason.", properties: ["Cursed"] },
    { name: "Ring of Spell Storing", type: "Ring", rarity: "Rare", cost: "Loot (Death Tyrant)", effect: "Store up to 5 levels of spells.", npcQuote: "A battery for miracles.", properties: ["Attunement"] },
    { name: "Shadowfell Shard", type: "Wondrous", rarity: "Rare", cost: "Loot (Umbravos)", effect: "+1 DC to Necrotic Spells. Darkvision 60ft.", npcQuote: "A piece of the night that never ends.", properties: ["Attunement"] },
    { name: "Tear of Regret", type: "Key Item", rarity: "Unique", cost: "Quest Item", effect: "Crystallized sorrow. Opens the Vault of Despair.", npcQuote: "It is heavy with the weight of what could have been." },
    { name: "Lantern of Revealing", type: "Wondrous", rarity: "Uncommon", cost: "Loot (Warden)", effect: "Reveals invisible creatures in 30ft bright light.", npcQuote: "Shadows cannot hide from the truth.", properties: ["Fuel (Oil)"] },

    // Heart Chamber & Deep Threats
    { name: "Larloch's Spare Robes", type: "Wondrous", rarity: "Legendary", cost: "Loot (Larloch)", effect: "AC 15 + Dex. Adv on Saves vs Spells. +2 Spell Attack/DC.", npcQuote: "Even a god needs a change of clothes.", properties: ["Attunement (Sorcerer/Warlock/Wizard)", "Alignment (Evil)"] },
    { name: "Hammer of the Ancestors", type: "Weapon", rarity: "Very Rare", cost: "Loot (Tieg Duran)", effect: "+2 Warhammer. Thrown (20/60) returns to hand. +1d8 radiant vs Drow/Duergar.", npcQuote: "It rings like a bell when it hits a drow.", properties: ["Attunement (Dwarf)", "Versatile"] },
    { name: "Insignia of House Baenre", type: "Wondrous", rarity: "Rare", cost: "Loot (Yaz'mina)", effect: "Grants safe passage through Drow lines. Adv on Intimidation vs Drow.", npcQuote: "The symbol of the Spider Queen's favor." },
    { name: "Rod of the Pact Keeper +2", type: "Rod", rarity: "Rare", cost: "Loot (Yaz'mina)", effect: "+2 to Warlock Spell Attacks/DC. Regain 1 slot long rest.", npcQuote: "A dark conduit for a darker master.", properties: ["Attunement (Warlock)"] },
    { name: "Rod of the Pact Keeper +3", type: "Rod", rarity: "Very Rare", cost: "Loot (Quenthel)", effect: "+3 to Warlock Spell Attacks/DC.", npcQuote: "It hurts to hold.", properties: ["Attunement (Warlock)"] },
    { name: "Piwafwi (Cloak of Elvenkind)", type: "Wondrous", rarity: "Uncommon", cost: "Loot (Arach-Tinilith)", effect: "Incosequential to Drow sensors. Adv on Stealth.", npcQuote: "To be unseen is to survive in the dark.", properties: ["Attunement"] },
    { name: "Prism of the Void", type: "Wondrous", rarity: "Artifact", cost: "Quest Item", effect: "Absorbs magic. Key to breaking the Curse.", npcQuote: "It drinks the light." }
];

// AGGREGATE ALL ITEMS FOR CAMPAIGN BOOK
export const ITEMS = [
    ...KHELBEN_GIFTS,
    ...FIMBLE_INVENTORY,
    ...CROW_NEST_INVENTORY,
    ...CAMPAIGN_UNIQUE_ITEMS
].sort((a, b) => a.name.localeCompare(b.name));

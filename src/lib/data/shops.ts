export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: "weapon" | "armor" | "potion" | "misc";
    stock: number;
}

export interface ShopData {
    id: string;
    name: string;
    description: string;
    keeper: string; // Name of the shopkeeper
    image: string; // Background image
    inventory: ShopItem[];
    currency: "gp" | "soul_coins";
}

export const SHOPS: Record<string, ShopData> = {
    "market": { // Fimble's Shop
        id: "market",
        name: "The Gilded Coffer",
        description: "Fimble Futterly (Gnome) stands behind a counter made of floating drifted wood. The air smells of ozone and old parchment.",
        keeper: "Fimble Futterly",
        image: "/shops/fimble_shop.png",
        currency: "gp",
        inventory: [
            { id: "potion_healing", name: "Potion of Healing", description: "Regains 2d4+2 HP.", cost: 50, type: "potion", stock: 10 },
            { id: "crowbar", name: "Adamantine Crowbar", description: "Advantage on Strength checks to open objects.", cost: 200, type: "misc", stock: 1 },
            { id: "lantern", name: "Ghost Lantern", description: "Sheds bright light for 30ft. Reveals invisible undead.", cost: 500, type: "misc", stock: 1 },
            { id: "scroll_id", name: "Scroll of Identify", description: "Identify one magic item.", cost: 100, type: "misc", stock: 5 }
        ]
    },
    "crows_nest": { // Zhentarim Black Market
        id: "crows_nest",
        name: "The Crow's Nest",
        description: "A hooded figure watches you from the shadows. The goods here are illicit, dangerous, and expensive.",
        keeper: "The Crow",
        image: "/shops/crow_shop.png",
        currency: "gp",
        inventory: [
            { id: "poison_drow", name: "Drow Poison (Vial)", description: "DC 13 Con save or Poisoned/Sleep.", cost: 200, type: "misc", stock: 3 },
            { id: "venom_blade", name: "Dagger of Venom", description: "+1 Dagger. Once per day deal extra 2d10 poison.", cost: 2000, type: "weapon", stock: 1 },
            { id: "thieves_tools", name: "Masterwork Thieves' Tools", description: "+2 to Sleight of Hand checks.", cost: 1500, type: "misc", stock: 1 }
        ]
    },
    "iron": { // The Iron Knot
        id: "iron",
        name: "The Iron Knot",
        description: "Kaelen Muldar's forge. The ghost of a master smith works here, offering services rather than physical goods.",
        keeper: "Kaelen Muldar",
        image: "/shops/iron_shop.png",
        currency: "gp",
        inventory: [
            { id: "ghost_weapon_oil", name: "Ghost-Touch Weapon Oil", description: "Makes the steel bite the spirit. Good against the misty ones. Cost: 1 Bottled Lightning", cost: 0, type: "potion", stock: 99 },
            { id: "ghost_armor_polish", name: "Ghost-Touch Armor Polish", description: "+2 AC vs Incorporeal. Can grapple ghosts. Cost: 1 Bottled Lightning", cost: 0, type: "potion", stock: 99 },
            { id: "item_restoration", name: "Item Restoration", description: "Repair drained items. Cost: 1 Bottled Lightning + Sacrifice of Effort", cost: 0, type: "misc", stock: 99 },
            { id: "masterwork_upgrade", name: "Masterwork Upgrade", description: "Upgrade +1 to +2, or add property. Cost: 3 Bottled Lightning + Rare Material + Moment of Peace", cost: 0, type: "misc", stock: 99 }
        ]
    }
};

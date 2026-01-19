export interface EquipmentItem {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'gear';
    stats?: string; // e.g. "1d8 slashing", "AC 18"
}

export const STARTING_EQUIPMENT: EquipmentItem[] = [
    // Weapons
    { id: 'longsword', name: 'Longsword +3', type: 'weapon', stats: '1d8+3 slashing' },
    { id: 'greataxe', name: 'Greataxe +3', type: 'weapon', stats: '1d12+3 slashing' },
    { id: 'bow', name: 'Longbow +3', type: 'weapon', stats: '1d8+3 piercing' },
    { id: 'staff', name: 'Staff of Power', type: 'weapon', stats: '1d6+2 bludgeoning' },
    { id: 'dagger', name: 'Dagger of Venom', type: 'weapon', stats: '1d4+1 piercing' },

    // Armor
    { id: 'plate', name: 'Plate Armor +2', type: 'armor', stats: 'AC 20' },
    { id: 'studded', name: 'Studded Leather +2', type: 'armor', stats: 'AC 14 + Dex' },
    { id: 'robes', name: 'Robes of the Archmagi', type: 'armor', stats: 'AC 15 + Dex' },
    { id: 'shield', name: 'Sentinel Shield', type: 'armor', stats: '+2 AC' },

    // Gear
    { id: 'potion_healing', name: 'Potion of Supreme Healing', type: 'gear' },
    { id: 'ring_prot', name: 'Ring of Protection', type: 'gear', stats: '+1 AC/Saves' },
    { id: 'cloak', name: 'Cloak of Displacement', type: 'gear' }
];

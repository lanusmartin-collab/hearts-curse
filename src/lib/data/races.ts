export interface Race {
    id: string;
    name: string;
    speed: number;
    size: 'Medium' | 'Small';
    bonuses: { [key: string]: number }; // e.g. { str: 2, cha: 1 }
    traits: string[];
}

export const RACES: Race[] = [
    {
        id: 'human',
        name: 'Human',
        speed: 30,
        size: 'Medium',
        bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        traits: ['Versatile']
    },
    {
        id: 'elf',
        name: 'Elf (High)',
        speed: 30,
        size: 'Medium',
        bonuses: { dex: 2, int: 1 },
        traits: ['Darkvision', 'Fey Ancestry', 'Trance']
    },
    {
        id: 'dwarf',
        name: 'Dwarf (Mountain)',
        speed: 25,
        size: 'Medium',
        bonuses: { con: 2, str: 2 },
        traits: ['Darkvision', 'Dwarven Resilience']
    },
    {
        id: 'halfling',
        name: 'Halfling (Lightfoot)',
        speed: 25,
        size: 'Small',
        bonuses: { dex: 2, cha: 1 },
        traits: ['Lucky', 'Brave', 'Halfling Nimbleness']
    },
    {
        id: 'dragonborn',
        name: 'Dragonborn',
        speed: 30,
        size: 'Medium',
        bonuses: { str: 2, cha: 1 },
        traits: ['Draconic Ancestry', 'Breath Weapon']
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        speed: 30,
        size: 'Medium',
        bonuses: { cha: 2, int: 1 },
        traits: ['Darkvision', 'Hellish Resistance']
    }
];

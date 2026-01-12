import spellsRaw from './spells.json';
import customSpellsRaw from './custom_spells.json';

export interface Spell {
    name: string;
    classes: string;
    level: string | number; // JSON has it as ? but usually string in some sources, let's verify
    school: string;
    ritual: boolean;
    castingTime: string; // "action"
    range: string;
    components: string;
    material: string;
    duration: string;
    description: string;
    source: string;
    page: number;
}

// Ensure type safety
const SPELLS_LIST = [...(spellsRaw as unknown as Spell[]), ...(customSpellsRaw as unknown as Spell[])];

// Create a lookup map for performance
export const SPELL_MAP = new Map<string, Spell>();

SPELLS_LIST.forEach(spell => {
    SPELL_MAP.set(spell.name.toLowerCase(), spell);
});

export const ALL_SPELLS = SPELLS_LIST;

export function getSpell(name: string): Spell | undefined {
    return SPELL_MAP.get(name.toLowerCase().trim());
}

// Helper to find spells by class or level
export function filterSpells(query: string): Spell[] {
    const lowerQuery = query.toLowerCase();
    return SPELLS_LIST.filter(s => s.name.toLowerCase().includes(lowerQuery));
}

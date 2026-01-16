import spellsRaw from './spells.json';
import customSpellsRaw from './custom_spells.json';

export type Spell = {
    name: string;
    level: string;
    school?: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    description: string;
    classes?: string[];
    ritual?: boolean;
    material?: string;
    source?: string;
    page?: number;
    concentration?: boolean;
    url?: string;
    slug?: string;
};

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

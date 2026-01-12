import { Combatant } from "@/types/combat";
import { Statblock } from "@/lib/data/statblocks";

export function rollInitiative(dex: number): number {
    const mod = Math.floor((dex - 10) / 2);
    const d20 = Math.floor(Math.random() * 20) + 1;
    return d20 + mod;
}

export function createCombatantFromStatblock(statblock: Statblock, count: number = 1): Combatant[] {
    const combatants: Combatant[] = [];

    // Parse HP from string "45 (6d8 + 18)" or just "45"
    // Parse HP from string "45 (6d8 + 18)" or just "45"
    let maxHp = 10;
    const rawHp = statblock.hp as unknown;
    if (typeof rawHp === 'number') {
        maxHp = rawHp;
    } else if (typeof rawHp === 'string') {
        const match = rawHp.match(/^(\d+)/);
        if (match) maxHp = parseInt(match[1]);
    }

    // Parse AC "16 (natural armor)" -> 16
    let ac = 10;
    const rawAc = statblock.ac as unknown;
    if (typeof rawAc === 'number') {
        ac = rawAc;
    } else if (typeof rawAc === 'string') {
        const match = rawAc.match(/^(\d+)/);
        if (match) ac = parseInt(match[1]);
    }

    const dex = statblock.stats.dex || 10;

    for (let i = 0; i < count; i++) {
        const suffix = count > 1 ? ` ${String.fromCharCode(65 + i)}` : '';
        const init = rollInitiative(dex);

        combatants.push({
            id: `${statblock.name}-${Date.now()}-${i}`,
            name: `${statblock.name}${suffix}`,
            initiative: init,
            hp: maxHp,
            maxHp: maxHp,
            ac: ac,
            conditions: [],
            statblock: statblock,
            type: 'monster'
        });
    }

    return combatants;
}

export function sortCombatants(list: Combatant[]): Combatant[] {
    return [...list].sort((a, b) => {
        if (b.initiative !== a.initiative) return b.initiative - a.initiative;
        // Tie-breaker: Dex? For now just random or Player priority could be added
        return 0;
    });
}

import monstersData from "@/lib/data/monsters_custom.json";
import { Combatant } from "@/types/combat";

// Define a type for the raw JSON to avoid 'any' if possible, but for now 'any' matches previous usage
// We can refine this type based on the JSON structure later.
type RawMonster = any;

export const MonsterService = {
    /**
     * Retrieves a full Combatant object for a given monster slug.
     * Applies difficulty modifiers based on Curse Days.
     */
    getMonsterBySlug: (slug: string, curseDays: number = 0): Combatant | null => {
        // 1. Find Data
        const data = (monstersData as RawMonster[]).find((m) => m.slug === slug);

        if (!data) {
            console.warn(`MonsterService: Slug '${slug}' not found.`);
            return null;
        }

        // 2. Calculate Modifiers
        let curseMultiplier = 1;
        if (curseDays >= 7) curseMultiplier = 1.1; // Simple logic from CombatLayout
        if (curseDays >= 14) curseMultiplier = 1.25;
        if (curseDays >= 30) curseMultiplier = 1.5;

        // 3. Parse Stats
        const baseHp = data.hp || 10;
        const maxHp = Math.floor(baseHp * curseMultiplier);

        // 4. Parse Actions
        const monsterAttacks = data.actions?.map((a: any) => {
            const hitMatch = a.desc?.match(/\+(\d+)\s+to\s+hit/);
            const dmgMatch = a.desc?.match(/Hit:\s+\d+\s+\(([^)]+)\)/);
            return {
                name: a.name,
                bonus: hitMatch ? parseInt(hitMatch[1]) : 5,
                damage: dmgMatch ? dmgMatch[1] : "1d6+2",
                type: "melee", // Simplified for now
                isAoE: a.desc.toLowerCase().includes("radius") || a.desc.toLowerCase().includes("cone") || a.desc.toLowerCase().includes("all creatures"),
                radius: 20
            };
        }) || [];

        // 5. Construct Combatant
        // Unique ID generation should normally happen in the context of a specific battle (e.g. "goblin-1", "goblin-2").
        // The service returns the *template*. The consumer should assign the final ID if multiple exist.
        // For single retrieval, we'll return a generic ID.
        return {
            id: `monster-${slug}-${Date.now()}`, // Temporary ID
            name: data.name,
            type: "monster",
            hp: maxHp,
            maxHp: maxHp,
            ac: data.ac || 10,
            initiative: Math.floor(Math.random() * 20), // Can be re-rolled by consumer
            conditions: [],
            statblock: data,
            attacks: monsterAttacks,
            resources: {
                action: true,
                bonusAction: true,
                movement: data.speed?.includes("fly") ? 50 : 30,
                reaction: true
            }
        };
    },

    /**
     * Hydrates a list of slugs into Combatants for an encounter.
     */
    createEncounter: (slugs: string[], curseDays: number = 0): Combatant[] => {
        return slugs.map((slug, i) => {
            const monster = MonsterService.getMonsterBySlug(slug, curseDays);
            if (monster) {
                // Assign unique ID for this instance
                monster.id = `e-${i}-${slug}`;
                return monster;
            }
            return null;
        }).filter(Boolean) as Combatant[];
    }
};

export type WarlockSkill = {
    name: string;
    cost: number;
    description: string;
    effectLogic: (level: number, stats: { int: number, personality: number }) => string;
};

export const WARLOCK_SKILLS: WarlockSkill[] = [
    {
        name: "Armor of Agathys",
        cost: 1,
        description: "Improves armor and has no limited duration.",
        effectLogic: (level, _stats) => {
            const armorBonus = level * 5;
            return `Gain +${armorBonus} Temporary Armor (No Duration).`;
        }
    },
    {
        name: "Agonizing Blast",
        cost: 1,
        description: "Improves main attack damage.",
        effectLogic: (level, stats) => {
            const baseBonus = stats.int + stats.personality;
            const levelBonus = level - 1; // Starts at +0 bonus at lvl 1 (base is purely stats)? Prompt says "improves by +1 per Int/Pers at lvl 1 AND increase by 1 point each level". 
            // Clarification from prompt: "improves the main attack dmg by +1 per Int and Personality point) at lvl 1 and increase by 1 point each level."
            // Intepretation: Damage Bonus = (Int + Personality) + (Level - 1)
            // Wait, "increase by 1 point each level" could mean the multiplier increases? 
            // Or a flat +1? "increase by 1 point each level" implies flat +1.
            // Let's assume: Total Bonus = (Int + Personality) + (Level - 1). 
            // Actually, prompt says: "+1 per Int and Personality point". 
            // Maybe it means: Damage = (Int + Personality) * 1 at lvl 1?
            // "increase by 1 point each level" -> usually means flat damage.

            // Let's stick to: Damage Bonus = (Int + Personality) + (Level - 1).

            return `Main Attack Damage +${baseBonus + levelBonus}`;
        }
    },
    {
        name: "Hellish Rebuke",
        cost: 1,
        description: "Reflects damage received.",
        effectLogic: (level, _stats) => {
            // "reflects dmg recieved in a 25% at lvl 1 and increases up to 75% in lvl 3."
            // Linear progression? Lvl 1: 25%, Lvl 2: 50%, Lvl 3+: 75%?
            let reflect = 25;
            if (level === 2) reflect = 50;
            if (level >= 3) reflect = 75;

            return `Reflect ${reflect}% of received damage.`;
        }
    },
    {
        name: "Drain Life",
        cost: 1,
        description: "Heals when killing an enemy.",
        effectLogic: (level, stats) => {
            // "Each time an enemy is killed the hero is healed for a 10 hp at lvl 1 and increases by 10 per level upt o lvl 3 when it also adds Personality and INT to the dmg healed."
            let heal = level * 10;
            if (level >= 3) {
                heal += stats.int + stats.personality;
            }
            return `On Kill: Heal ${heal} HP.`;
        }
    }
];

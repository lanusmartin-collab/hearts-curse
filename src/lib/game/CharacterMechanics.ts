import { Combatant } from "@/types/combat";

export function downgradeCharacter(char: Combatant): Combatant {
    if (!char.level || char.level <= 10) return char;

    const newLevel = 10;

    // Simple HP reduction simulation for Lvl 20 -> 10
    // Roughly 55-60% of max HP
    const newMaxHp = Math.floor(char.maxHp * 0.55);

    // Reduce Proficiency Bonus from +6 to +4 impacts attacks?
    // For now, we just update the specific fields we track

    return {
        ...char,
        level: newLevel,
        maxHp: newMaxHp,
        hp: newMaxHp, // Full heal at new max
        // Could remove legendary items here if we wanted, but let's keep them as "broken" or just keep them for fun?
        // User didn't specify stripping gear, just "modify character to lvl 10"
        attacks: char.attacks?.map(a => ({
            ...a,
            bonus: a.bonus - 2 // Prof bonus drops from +6 to +4
        }))
    };
}

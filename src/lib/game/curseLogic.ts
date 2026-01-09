import { CURSE_MECHANICS, WILD_MAGIC_TABLE, SILENT_WARDS_MECHANIC } from "@/lib/data/mechanics";

export type CurseStage = {
    day: number;
    name: string;
    effect: string;
};

export type RegionalEffect = {
    title: string;
    description: string;
    trigger?: string;
};

export function getCurseStage(days: number): CurseStage {
    // Find the highest stage that matches the day count
    const stage = CURSE_MECHANICS.stages
        .slice()
        .reverse()
        .find(s => days >= s.day);

    return stage || { day: 0, name: "Latent", effect: "No visible effects... yet." };
}

export function getRegionalEffect(mapId: string): RegionalEffect | null {
    if (mapId === "silent_wards") {
        return {
            title: SILENT_WARDS_MECHANIC.title,
            description: SILENT_WARDS_MECHANIC.description + " " + SILENT_WARDS_MECHANIC.trigger
        };
    }
    if (mapId === "netheril" || mapId === "castle") {
        return {
            title: WILD_MAGIC_TABLE.title,
            description: WILD_MAGIC_TABLE.description,
            trigger: "Cast spell level 1+"
        };
    }
    // Add more map-specific logic here
    return null;
}

export function rollWildMagic(): { roll: number, result: string } {
    const roll = Math.floor(Math.random() * 100) + 1;
    // Find the effect in the d100 table
    // The table format is "01-05", need to parse.
    const entry = WILD_MAGIC_TABLE.d100.find(e => {
        const [min, max] = e.roll.split('-').map(Number);
        return roll >= min && roll <= max;
    });

    return {
        roll,
        result: entry ? entry.effect : "The magic fizzles... nothing happens."
    };
}

import { CURSE_MECHANICS, WILD_MAGIC_TABLE, SILENT_WARDS_MECHANIC } from "@/lib/data/mechanics";

export type CurseStage = {
    day: number;
    name: "Dormant" | "Awakened" | "Rising" | "Critical";
    effect: string;
    visualClass: string; // CSS class for global overlay
    audioCue?: string;
};

export type RegionalEffect = {
    title: string;
    description: string;
    trigger?: string;
};

const CURSE_PROGRESSION: CurseStage[] = [
    { day: 0, name: "Dormant", effect: "The air feels heavy, but silent.", visualClass: "" },
    { day: 5, name: "Awakened", effect: "Faint whispers can be heard in the silence.", visualClass: "curse-stage-1" },
    { day: 10, name: "Rising", effect: "Shadows seem to lengthen and move on their own.", visualClass: "curse-stage-2" },
    { day: 15, name: "Critical", effect: "Reality flickers. The Heart's beat is audible.", visualClass: "curse-stage-3" }
];

export function getCurseStage(days: number): CurseStage {
    // Find saturation point
    const stage = CURSE_PROGRESSION
        .slice()
        .reverse()
        .find(s => days >= s.day);

    return stage || CURSE_PROGRESSION[0];
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
    if (mapId.includes("town")) {
        return {
            title: "Zhentarim Law",
            description: "Guards are doubled. Prices +20%. Open casting is illegal.",
            trigger: "Interaction"
        };
    }
    if (mapId === "heart") {
        return {
            title: "Reality Hemorrhage",
            description: "The veil is torn. Magic always surges. Gravity is subjective.",
            trigger: "Constant"
        };
    }
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

import { Statblock } from "@/lib/data/statblocks";

export interface Combatant {
    id: string;
    name: string;
    initiative: number;
    hp: number;
    maxHp: number;
    ac: number;
    conditions: string[];
    statblock?: Statblock;
    type: 'player' | 'monster' | 'npc';
    isHidden?: boolean;

    // New Combat Properties
    level?: number;
    race?: string;
    alignment?: string;
    equipment?: string[];

    stats?: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    attacks?: {
        name: string;
        bonus: number;
        damage: string; // e.g. "1d8+3"
        isAoE?: boolean;
        radius?: number;
    }[];
}

export type Condition =
    | "Blinded" | "Charmed" | "Deafened" | "Frightened"
    | "Grappled" | "Incapacitated" | "Invisible" | "Paralyzed"
    | "Petrified" | "Poisoned" | "Prone" | "Restrained"
    | "Stunned" | "Unconscious" | "Exhaustion";

export const ALL_CONDITIONS: Condition[] = [
    "Blinded", "Charmed", "Deafened", "Frightened",
    "Grappled", "Incapacitated", "Invisible", "Paralyzed",
    "Petrified", "Poisoned", "Prone", "Restrained",
    "Stunned", "Unconscious", "Exhaustion"
];

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
    isHidden?: boolean; // For fog of war / hidden enemies potentially
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

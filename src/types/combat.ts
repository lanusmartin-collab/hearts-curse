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
    img?: string;
    mana?: number;
    maxMana?: number;

    // New Combat Properties
    level?: number;
    race?: string;
    class?: string;
    background?: string;
    alignment?: string;
    equipment?: string[];

    // Action Economy State (Reset each turn)
    resources?: {
        action: boolean;      // true if available
        bonusAction: boolean; // true if available
        movement: number;     // Remaining feet
        reaction: boolean;
    };

    spellSlots?: {
        [level: number]: { max: number, current: number };
    };
    preparedSpells?: string[]; // Names of spells ready to cast

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
        range?: string;
        type?: "melee" | "ranged" | "spell";
        isAoE?: boolean;
        radius?: number;
        effect?: string; // For special effects logic
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

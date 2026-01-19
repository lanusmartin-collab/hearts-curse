import { MapNode } from "@/lib/data/maps";

export interface NarrativeEvent {
    type: 'move' | 'examine' | 'combat' | 'item' | 'error';
    text: string;
    details?: string;
}

export const NarrativeEngine = {
    /**
     * Generates a descriptive block for entering a new area.
     */
    describeLocation: (node: MapNode, direction?: string): NarrativeEvent => {
        const movementPrefix = direction
            ? `You travel ${direction.toUpperCase()}... `
            : "You find yourself in... ";

        const cleanDesc = (node.description || "The area is silent.").replace(/\*\*/g, ""); // Remove markdown bold for raw text if needed

        return {
            type: "move",
            text: `${movementPrefix} ${node.label}`,
            details: cleanDesc
        };
    },

    /**
     * Formats a system message (Save, Error, Info).
     */
    systemMessage: (msg: string): NarrativeEvent => {
        return {
            type: "error", // Using 'error' for general system style for now, or add 'system'
            text: `SYSTEM > ${msg}`
        };
    },

    /**
     * Combat encounter start text.
     */
    encounterTrigger: (monsters: string[]): NarrativeEvent => {
        const count = monsters.length;
        const text = count === 1
            ? "A shadow moves. Something is watching you."
            : `Movement in the darkness. ${count} hostiles detected.`;

        return {
            type: "combat",
            text: "COMBAT INITIATED",
            details: text
        };
    },

    /**
     * Combat result text.
     */
    combatResult: (result: 'victory' | 'defeat' | 'flee'): NarrativeEvent => {
        if (result === 'victory') {
            return {
                type: "combat",
                text: "VICTORY ACHIEVED",
                details: "The silence returns. You catch your breath as the adrenaline fades."
            };
        } else if (result === 'flee') {
            return {
                type: "combat",
                text: "ESCAPED",
                details: "You scramble away into the darkness, barely escaping with your life."
            };
        }
        return {
            type: "combat",
            text: "DEFEAT",
            details: "Your vision fades onto the cold stone floor..."
        };
    }
};

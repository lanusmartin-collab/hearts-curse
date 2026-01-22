export interface AiResponse {
    text: string;
    source: "Mock Oracle" | "GPT-4" | "Claude";
}

const NARRATIVE_TEMPLATES = [
    "The air in the {location} is stale and cold. Shadows dance along the walls, casting long, spindly shapes that seem to reach for you. A faint smell of {smell} lingers in the air.",
    "You step into the {location}. It is unnervingly quiet here. Dust motes float in the beams of light piercing through cracks in the ceiling. You spot {object} in the corner.",
    "The {location} is damp and dripping with moisture. Meaningless graffiti covers the stone walls, written in a language you don't recognize. A sense of dread washes over you.",
    "Torches line the walls of the {location}, flickering with an unnatural blue light. In the center of the room, {object} hums with a low, vibrating energy."
];

const NPC_RESPONSES = [
    "I don't know anything about that, traveler. I just want to survive the night.",
    "The mists have been thicker lately. Bad omens, if you ask me.",
    "Have you seen the symbol of the Eye? It watches us all.",
    "Keep your voice down. The walls have ears here.",
    "I used to differ, until I took a curse to the knee.",
    "Depends on who's asking. And how much gold they have."
];

export class AiService {
    /* 
      A simple mock service that simulates AI generation.
      In a real implementation, this would call OpenAI or Anthropic APIs.
    */

    static async generateDescription(context: { location: string, keywords: string[] }): Promise<AiResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        let template = NARRATIVE_TEMPLATES[Math.floor(Math.random() * NARRATIVE_TEMPLATES.length)];

        // Simple slot filling
        template = template.replace("{location}", context.location || "chamber");
        template = template.replace("{smell}", context.keywords.includes("Death") ? "rot" : "ozone");
        template = template.replace("{object}", context.keywords.includes("Treasure") ? "a heavy iron chest" : "a shattered statue");

        // Append keyword flavor
        if (context.keywords.length > 0) {
            template += ` Details of ${context.keywords.join(", ")} catch your eye.`;
        }

        return {
            text: template,
            source: "Mock Oracle"
        };
    }

    static async generateNpcChat(npcName: string, traits: string[], message: string): Promise<AiResponse> {
        await new Promise(resolve => setTimeout(resolve, 600));

        const baseResponse = NPC_RESPONSES[Math.floor(Math.random() * NPC_RESPONSES.length)];

        return {
            text: `[${npcName}]: "${baseResponse}"`,
            source: "Mock Oracle"
        };
    }
}

export interface Chapter {
    id: string;
    title: string;
    sections: Section[];
}

export interface Section {
    id: string;
    title: string;
    content: string; // Markdown-like string
}

export const CAMPAIGN_CONTENT: Chapter[] = [
    {
        id: "intro",
        title: "1. The Curse of the Heart",
        sections: [
            {
                id: "synopsis",
                title: "Synopsis",
                content: `
# The Curse of the Heart

A shadow has fallen over the valley of Oakhaven. The **Heart of the Mountain**, a gem said to protect the region from the influence of the Underdark, has begun to pulsate with a sickening red light.

> "The sky turned the color of bruised plums, and the birds fell silent. It was then we knew the pact had been broken." - Elder Brond

## The Hook
The party arrives in Oakhaven finding it under quarantine. The local guard, led by **Captain Kaelen**, turns away all travelers unless they can prove they are not "tainted".

The taint manifests as black veins spreading from the fingertips.
`
            },
            {
                id: "npcs",
                title: "Key NPCs",
                content: `
# Key NPCs

## Captain Kaelen (Human Fighter)
Stern but exhausted. He holds the line at the gates.
* **Trait:** Obsessively checks his own hands for black veins.
* **Needs:** Supplies for the town, and someone to investigate the mines.

## Elara Moonwhisper (Elf Wizard)
The town's only arcane scholar. She believes the Heart is being corrupted by a **Mind Flayer** presence deep below.
`
            }
        ]
    },
    {
        id: "oakhaven",
        title: "2. Oakhaven Village",
        sections: [
            {
                id: "locations",
                title: "Locations",
                content: `
# Village Locations

## 1. The Broken Anvil
Run by **Thrum**, a dwarf who refuses to stop smithing despite the ban on open fires (fear of attracting "shadow moths").

## 2. The Silent Square
Where the weekly markets used to be. now filled with makeshift cots for the sick.

> **Read Aloud:**
> The sound of coughing echoes off the cobblestones. A heavy fog clings to the ground, swirling around your ankles like grasping hands. Above, the Spire looms, its tip glowing with a rhythmic, bloody pulse.
`
            }
        ]
    },
    {
        id: "dungeon",
        title: "3. The Mines",
        sections: [
            {
                id: "entry",
                title: "The Mine Entrance",
                content: `
# The Mine Entrance

The entrance to the Oakhaven Mines is barred by a heavy iron gate. The lock is rusted, but shows signs of recent tampering.

**Encounter:** 3x **Zombies** rise from the mud as the party approaches.

> **Read Aloud:**
> The air here smells of sulfur and rot. The darkness of the tunnel mouth seems to swallow the light of your torches. You hear a skittering sound from deep within...
`
            }
        ]
    }
];

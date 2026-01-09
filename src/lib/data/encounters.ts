export type Encounter = {
    roll: number[];
    name: string;
    description: string;
    monsters?: string[];
};

// --- OAKHAVEN (SURFACE) ---
export const TOWN_DAY_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Hollow Procession", description: "SCENE: Twenty 'Echoes' (neutral ghosts) walk in perfect unison towards the cliffside. They pass through walls and people. \nMECHANIC: Interacting forces a DC 18 Wis save or the PC joins the line, unable to act for 1 minute.", monsters: ["ghost"] },
    { roll: [6, 10], name: "Zhentarim Surveillance", description: "SCENE: A reflection on a rooftop. A Zhentarim Assassin is tracking the party, counting their gold. \nTWIST: If spotted, he flees using a *Potion of Gaseous Form* rather than fight.", monsters: ["assassin"] },
    { roll: [11, 14], name: "Mithral Dust Storm", description: "SCENE: The wind shifts, bringing glittering grey dust from the mines. \nTHREAT: Heavy Obscurement. Breathing it requires DC 12 Con save or Poisoned for 1 hour. Magic items glow brightly in the dust.", monsters: [] },
    { roll: [15, 18], name: "The Tax Collector", description: "SCENE: A Helmed Horror blocks the street, pointing a gauntlet. \nDEMAND: 'The Tithe'. It demands 100gp or 1 Hit Die worth of blood. It attacks if refused.", monsters: ["helmed-horror"] },
    { roll: [19, 20], name: "Netherese Flare", description: "SCENE: The air tastes like ozone. A pulse from the castle disrupts magic. \nEFFECT: The next spell cast triggers a Wild Magic Surge. If no spell is cast in 1 minute, a random nearby object explodes (4d6 Force).", monsters: [] }
];

export const TOWN_NIGHT_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Whispering Fog", description: "SCENE: The mist thickens and forms faces of the PCs' dead loved ones. \nMECHANIC: DC 19 Wis save or gain Short-Term Madness (Fear of the Dark). The mist is semi-solid.", monsters: [] },
    { roll: [6, 10], name: "Wraith Patrol", description: "SCENE: The temperature drops to freezing. 1d4 Wraiths drift through the walls of the nearest building. \nTACTIC: They act as a squad, focusing fire on the target with the highest Strength.", monsters: ["wraith"] },
    { roll: [11, 15], name: "Phase Spider Nest", description: "SCENE: The cobblestones ripple like water. \nAMBUSH: 4 Phase Spiders emerge from the Ethereal Plane, attack, and vanish. They attempt to drag a grappled PC into the Ethereal.", monsters: ["phase-spider"] },
    { roll: [16, 19], name: "Drow Night-Raid", description: "SCENE: Silhouettes move across the rooftops. \nENCOUNTER: 3 Drow Elite Warriors scouting surface weaknesses. They carry poison-tipped crossbows.", monsters: ["drow-elite-warrior"] },
    { roll: [20, 20], name: "Larloch's Projection", description: "SCENE: A 20ft tall illusion of the Lich King appears in the town square. \nACTION: He points at a random NPC, casting *Finger of Death*. The NPC turns into a Zombie instantly. Larloch laughs and fades.", monsters: ["larloch", "zombie"] }
];

// --- UNDERDARK / MINES ---
export const OAKHAVEN_MINES_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Rotting Support", description: "SCENE: The ceiling groans. A support beam rots instantly due to necrotic seepage. \nMECHANIC: DC 15 Dex save or take 4d10 Bludgeoning from falling rocks. The path is blocked.", monsters: [] },
    { roll: [6, 10], name: "Scavenger Construct", description: "SCENE: A Flesh Golem made of miner corpses lumbers through the dark. \nBEHAVIOR: It is non-hostile unless it sees gold/metal directly. It eats metal.", monsters: ["flesh-golem"] },
    { roll: [11, 15], name: "Duergar Invisiblestalkers", description: "SCENE: Footsteps in the dust, but no one is there. \nAMBUSH: 4 Duergar (Invisible) surround the party. Surprise Round likely.", monsters: ["duergar"] },
    { roll: [16, 19], name: "Chasm Winds", description: "SCENE: A gust from the deep chasm threatens to blow small creatures off the ledge. \nMECHANIC: DC 14 Str save or be pushed 10ft toward the edge.", monsters: [] },
    { roll: [20, 20], name: "The Mithral Mother", description: "SCENE: A Xorn with mithral-plating feasts on a vein. \nREWARD: If defeated or bribed (500gp in gems), it yields 1d4 Mithral Ores.", monsters: ["xorn"] }
];

export const UNDERDARK_TRAVEL_TABLE: Encounter[] = [
    { roll: [1, 4], name: "Faerzress Storm", description: "SCENE: Purple radiation illuminates the cavern. \nEFFECT: All spells have a 50% chance to surge. Teleportation always fails. Lasts 1d4 hours.", monsters: [] },
    { roll: [5, 8], name: "Hook Horror Pack", description: "SCENE: Clicking sounds echo from the ceiling stalactites. \nCOMBAT: 3 Hook Horrors drop from above. They use Hook to grapple and drag PCs up.", monsters: ["hook-horror"] },
    { roll: [9, 12], name: "Mind Flayer Scout", description: "SCENE: You feel a headache before you see him. \nTHREAT: A Mind Flayer is surveying for new thralls. It attempts to *Dominate* the Barbarian/Fighter first.", monsters: ["mind-flayer"] },
    { roll: [13, 16], name: "Drow Toll-Gate", description: "SCENE: A Drow Elite Warrior and 6 Drow have fortified a choke point. \nDEMAND: '500gp or your heads.'", monsters: ["drow-elite-warrior", "drow"] },
    { roll: [17, 19], name: "Purple Worm Tremors", description: "SCENE: The ground shakes violently. \nHAZARD: A Purple Worm bursts through the wall, creating a new tunnel. It swallows the path ahead.", monsters: ["purple-worm"] },
    { roll: [20, 20], name: "The Wandering Emporium", description: "SCENE: A giant snail carries a hut on its back. \nNPC: A Svirfneblin Merchant selling *Potions of Supreme Healing* and bottled surface air.", monsters: ["deep-gnome"] }
];

// --- HIGH LEVEL ZONES ---
export const NETHERIL_RUINS_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Gravity Failure", description: "SCENE: The gravity spell on this island fails. \nMECHANIC: Everyone floats. Combat becomes 3D. Newton's laws apply (Equal/Opposite reaction).", monsters: [] },
    { roll: [6, 10], name: "Arcanum Wraiths", description: "SCENE: Robed ghosts phase through the obsidian rubble. \nLORE: They are debating 10th-level spell theory. They attack only if interrupted or contradicted.", monsters: ["arcanum-wraith"] },
    { roll: [11, 15], name: "Living Spell", description: "SCENE: A *Living Cloudkill* drifts across the void bridge. \nTHREAT: Immune to physical dmg. Must be dispelled or absorbed.", monsters: [] },
    { roll: [16, 19], name: "Beholder Projection", description: "SCENE: A giant eye opens in the stars. \nEFFECT: An Anti-Magic cone sweeps across the battlefield for 1d4 rounds.", monsters: [] },
    { roll: [20, 20], name: "Timeline Glitch", description: "SCENE: You see yourselves from 1 minute ago entering the room. \nMECHANIC: If you interact, you cause a Paradox explosion (10d10 Force). If you ignore them, you gain Advantage on Initiative.", monsters: [] }
];

export const SILENT_WARDS_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Shifting Walls", description: "SCENE: The dungeon reconfigures early. \nMECHANIC: Dex Save DC 16. Failure: 4d10 Bludgeoning and separated from party.", monsters: [] },
    { roll: [6, 10], name: "The Clockwork Hunt", description: "SCENE: A Steel Predator is tracking the party by scent. \nTHREAT: It is immune to non-magical damage and hits like a truck.", monsters: ["steel-predator"] },
    { roll: [11, 15], name: "Mithral Golems", description: "SCENE: Two statues animate silently. \nFEATURE: Immune to Magic. They reflect spells of level 3 or lower.", monsters: ["mithral-golem"] },
    { roll: [16, 19], name: "Silence Trap", description: "SCENE: The air goes dead. \nAMBUSH: 4 Invisible Stalkers attack in the silence. Casters are useless.", monsters: ["invisible-stalker"] },
    { roll: [20, 20], name: "The Master Key", description: "SCENE: A skeleton is crushed in the gears. \nLOOT: Holding a *Chime of Opening* (1 charge left).", monsters: [] }
];

export const OUTSKIRTS_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Dust-Bound Drifter", description: "SCENE: A lone wanderer in rags approaches. He is a Revenant. \nDIALOGUE: 'You stole my breath...' He attacks the Warlock/Cleric specifically.", monsters: ["revenant"] },
    { roll: [6, 10], name: "Sky-Slayer Ambush", description: "SCENE: Shadows pass over the sun. \nCOMBAT: 1d4 Perytons dive-bomb from the clouds. They target PCs with high Charisma to eat their hearts.", monsters: ["peryton"] },
    { roll: [11, 15], name: "Zhentarim Toll-Gate", description: "SCENE: A barricade of overturned wagons. \nFORCE: 1 Mage and 10 Thugs. '100gp or heads.' They have a Ballista aimed at the road.", monsters: ["mage", "thug"] },
    { roll: [16, 19], name: "Stampede of the Scourged", description: "SCENE: The ground rumbles. Undead Aurochs are being chased by a Will-o'-Wisp. \nMECHANIC: DC 15 Dex save or 4d10 Bludgeoning.", monsters: ["will-o-wisp"] },
    { roll: [20, 20], name: "Larloch's Manifestation", description: "SCENE: A zombie stumbles forward, its eyes glowing blue. \nACTION: Larloch speaks through it, then casts *Counterspell* on the party's next healing spell.", monsters: ["larloch", "zombie"] }
];

export const LIBRARY_WHISPERS_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Scroll Swarm", description: "SCENE: A shelf collapses. Hundreds of spellbooks take flight. \nCOMBAT: 10 Swarms of Animated Books. They cast *Fire Bolt* every turn. Fire is dangerous here.", monsters: ["swarm-of-animated-books"] },
    { roll: [6, 10], name: "Lich-Librarian", description: "SCENE: A Demi-Lich skull hovers by a 'Quiet Please' sign. \nINTERACTION: Demands a Library Card. If none, it howls (Con save or 0 HP).", monsters: ["demilich"] },
    { roll: [11, 15], name: "Forbidden Knowledge", description: "SCENE: A book flies open in front of the Wizard. \nEFFECT: DC 20 Wis save. Success: Learn 1 spell. Failure: *Contact Other Plane* (Insanity).", monsters: [] },
    { roll: [16, 19], name: "The Shushing", description: "SCENE: You spoke too loudly. \nAMBUSH: 3 'Scholars of the Void' (Specters) emerge to silence you permanently.", monsters: ["specter"] },
    { roll: [20, 20], name: "Rhaugilath's Echo", description: "SCENE: The Ghost of the Archlich Rhaugilath appears. \nOFFER: He will trade a 5th-level Spell Slot (consumed) for a key lore secret.", monsters: ["rhaugilath"] }
];

export const ARACH_TINILITH_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Web of Lies", description: "SCENE: The floor here is sticky. \nTRAP: It is a Mimic Colony (Huge). The entire room is a mouth.", monsters: ["mimic"] },
    { roll: [6, 10], name: "Demon Patrol", description: "SCENE: The smell of sulfur overrides the rot. \nPATROL: Quenthel's personal guard: 1 Draegloth and 2 Vrocks patrolling the air.", monsters: ["draegloth", "vrock"] },
    { roll: [11, 15], name: "Yochlol Deception", description: "SCENE: A beautiful Drow maiden cries for help in a cell. \nTWIST: It is a Yochlol demon. If released, it tries to possess the rescuer.", monsters: ["yochlol"] },
    { roll: [16, 19], name: "Phase Spider Ambush", description: "SCENE: The walls ripple. \nAMBUSH: 4 Phase Spiders blink in. They attempt to teleport away with a captive.", monsters: ["phase-spider"] },
    { roll: [20, 20], name: "Avatar's Echo", description: "SCENE: A momentary rift to the Demonweb Pits opens. \nTHREAT: A Balor steps through for 1d4 rounds before being pulled back. Survive.", monsters: ["balor"] }
];

export const HEART_CHAMBER_TABLE: Encounter[] = [
    { roll: [1, 5], name: "The Heartbeat", description: "SCENE: The Castle's heart pulses. \nMECHANIC: DC 22 Con save. Failure: 1 Level of Exhaustion. Success: Gain 10 Temp HP.", monsters: [] },
    { roll: [6, 10], name: "Blood of the Dragon", description: "SCENE: A droplet of Drakharaz's necrotic blood falls on a PC. \nEFFECT: 6d10 Necrotic damage. If survived, gain Resistance to Necrotic for 1 hour.", monsters: [] },
    { roll: [11, 15], name: "Larloch's Attention", description: "SCENE: Larloch turns his head slightly. \nEFFECT: Gravity reverses for one specific PC. They fall 'up' into the storm clouds.", monsters: ["larloch"] },
    { roll: [16, 19], name: "Void-Touched Nightwalker", description: "SCENE: A shadow tears itself from the floor. \nCOMBAT: A Nightwalker (CR 20) manifests. This is a severe threat.", monsters: ["nightwalker"] },
    { roll: [20, 20], name: "The Redemption", description: "SCENE: A specter of the Dragon's former self (Good) offers aid. \nBOON: He breaths 'Life' on the party. Effects of a Long Rest applied instantly.", monsters: [] }
];

export const OSSUARY_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Boneslide", description: "SCENE: The mountain of bones shifts like a landslide. \nMECHANIC: DC 18 Str save or be buried. Suffocation rules apply.", monsters: [] },
    { roll: [6, 10], name: "Banshee Choir", description: "SCENE: The wind sounds like screaming. \nCOMBAT: 3 Banshees rise from the dust. They can wail as a Lair Action.", monsters: ["banshee"] },
    { roll: [11, 15], name: "The Corpse Gatherer", description: "SCENE: A hill stands up. It is a Giant made of gravestones and bodies. \nTHREAT: Inspects players for 'good bones'.", monsters: ["corpse-gatherer"] },
    { roll: [16, 19], name: "Mirror of Despair", description: "SCENE: A polished black mirror. \nEFFECT: DC 16 Cha save. Failure: Character sees their own death and is Frightened for 1 hour.", monsters: [] },
    { roll: [20, 20], name: "Lich's Philactery Echo", description: "SCENE: You find a failed phylactery of Larloch. \nLOOT: Crushing it yields a *Soul Coin*.", monsters: [] }
];

export const SHOP_AMBUSH_TABLE: Encounter[] = [
    {
        roll: [1, 20],
        name: "The Debt of Memory",
        description: "SCENE: A courier delivers a heavy iron box instead of the goods. Inside is the Shopkeeper's severed hand and a note: 'The Black Network cannot be charmed.' \n\nAMBUSH: Ignacio (Zhentarim Leader) steps from invisibility with 4 Veterans and 1 Mage. They have silenced the room. \n\nIGNACIO'S PARANOIA: He believes the Modify Memory was a Psionic/Mind Flayer attack. 'Tell me where the Colony is, Drow-lovers, or I crack your skulls to find it.' \n\nSIDEBAR: The Mercenary PC receives a *Sending*: '7,000 Platinum to walk away. Khelben never needs to know.'",
        monsters: ["ignacio-zhentarim-lord", "mage", "zhentarim-veteran"]
    }
];

export type Encounter = {
    roll: number[];
    name: string;
    description: string;
    monsters?: string[];
};

export const TOWN_DAY_TABLE: Encounter[] = [
    { roll: [1, 3], name: "The Hollow Procession", description: "Twenty 'Echoes' (neutral ghosts) walk in perfect unison towards the cliffside. Mechanics: Interacting forces a DC 18 Wis save or the PC joins the line, unable to act.", monsters: ["ghost"] },
    { roll: [4, 5], name: "Zhentarim Tail", description: "One Assassin (CR 8) is spotted shadowing the party from rooftops. If caught, he drinks a potion of gaseous form. He is counting their gold.", monsters: ["assassin"] },
    { roll: [6, 7], name: "The Glitch", description: "An Echo morphs into a Gibbering Mouther (CR 10) mid-sentence. The street warps into sticky flesh (Difficult Terrain).", monsters: ["gibbering-mouther"] },
    { roll: [8, 9], name: "Mithral Dust Storm", description: "A sudden gust from the mines. DC 19 Dex save or Blinded for 1 hour. Magic items glow revealingly during the storm." },
    { roll: [10, 12], name: "Drow Scouts", description: "Three Drow Elite Warriors (CR 5) testing the town's defenses. They carry no gold, only maps of the tavern.", monsters: ["drow-elite-warrior"] },
    { roll: [13, 14], name: "The Tax Collector", description: "A Helmed Horror demands 'The Tithe' (100gp or 1 hit die worth of blood). It is immune to Force, Necrotic, and Fire.", monsters: ["helmed-horror"] },
    { roll: [15, 16], name: "Uncanny Silence", description: "Effect: Silence spell 60ft radius. Within the silence, 2d4 Shadows manifest and attack with Advantage.", monsters: ["shadow"] },
    { roll: [17, 18], name: "Fimble's Eye", description: "A floating Spectral Eye (AC 18, 1 HP). It watches. Fimble will know their location for the next 24 hours.", monsters: ["spectral-eye"] },
    { roll: [19, 19], name: "Khelben's Omen", description: "A silver raven drops a Scroll of Greater Restoration. It whispers 'Ascend' before dissolving into mist.", monsters: ["khelben"] },
    { roll: [20, 20], name: "Netherese Flare", description: "Wild Magic Surge. The next spell of 1st level or higher cast by a PC is automatically upcast to 9th level." }
];

export const TOWN_NIGHT_TABLE: Encounter[] = [
    { roll: [1, 3], name: "The Whispering Fog", description: "The mist becomes sentient. DC 19 Wis save or acquire Short-Term Madness (Fear of the dark)." },
    { roll: [4, 6], name: "Wraith Patrol", description: "1d4 Wraiths seeking creatures with Strength > 16. They focus fire on the strongest PC.", monsters: ["wraith"] },
    { roll: [7, 8], name: "The Mirror House", description: "Windows in the town reflect the PCs as rotting corpses. Effect: DC 15 Cha save or Disadvantage on all checks until Long Rest." },
    { roll: [9, 11], name: "Phase Spider Nest", description: "4 Phase Spiders (CR 12 variants). They ambush from the Ethereal Plane, attack, and phase back.", monsters: ["phase-spider"] },
    { roll: [12, 14], name: "Night Shard's Volley", description: "A volley of purple-fletched bolts strikes from 600ft away. +11 to hit, 4d10 Poison damage. No shooter found.", monsters: ["night-shard"] },
    { roll: [15, 16], name: "Cold Blue Flare", description: "Larloch captures a soul nearby. 6d8 Cold damage to all PCs unless they are indoors.", monsters: ["larloch"] },
    { roll: [17, 18], name: "Soul-Siphon", description: "The Curse pulses. DC 20 Cha save or lose one lowest-level spell slot/Ki point/Superiority die." },
    { roll: [19, 19], name: "Elias's Ghost", description: "The ghost of the previous Mayor appears. He offers one secret about Larloch's phylactery location.", monsters: ["ghost"] },
    { roll: [20, 20], name: "Larloch's Projection", description: "A 20ft tall image of the Lich appears. He casts 'Finger of Death' (7th level) on a random NPC nearby, then laughs.", monsters: ["larloch"] }
];

export const OUTSKIRTS_TABLE: Encounter[] = [
    { roll: [1, 1], name: "The Dust-Bound Drifter", description: "A Revenant who thinks the Warlock PC is his killer. 'You stole my breath...'", monsters: ["revenant"] },
    { roll: [2, 2], name: "Sky-Slayer Ambush", description: "1d4 Perytons dive-bomb. They target PCs with high Charisma (hearts).", monsters: ["peryton"] },
    { roll: [3, 3], name: "Zhentarim Toll-Gate", description: "10 Thugs and 1 Mage. They have set up a barricade. '100gp or your head.'", monsters: ["thug", "mage"] },
    { roll: [4, 4], name: "Stampede of the Scourged", description: "Undead Aurochs chased by a Will-o'-Wisp. DC 15 Dex save to avoid 4d10 bludgeoning.", monsters: ["undead-aurochs", "will-o-wisp"] },
    { roll: [5, 5], name: "The Arcane Sinkhole", description: "A 20ft radius zone where Gravity is reversed (fall upward 100ft)." },
    { roll: [11, 11], name: "The Echo of the Raven Queen", description: "Shadow Mastiffs hunt Shadar-kai. They ignore other races unless provoked.", monsters: ["shadow-mastiff", "shadar-kai"] },
    { roll: [12, 12], name: "The Giant's Runestone", description: "Touching it recharges one 'Action Surge' or similar 1/rest ability. Take 2d6 Lightning damage." },
    { roll: [15, 15], name: "The Bladesong Duelist", description: "A Sword Wraith Commander challenges the party's Fighter/Paladin to single combat for a +2 weapon.", monsters: ["sword-wraith-commander"] },
    { roll: [20, 20], name: "Larloch's Manifestation", description: "Larloch acts through a zombie. Casts Counterspell on the party's next healing spell.", monsters: ["larloch", "zombie"] }
];

export const SHOP_AMBUSH_TABLE: Encounter[] = [
    { roll: [1, 20], name: "The Crow's Collection", description: "The Crow does not forgive debt. 1x Zhentarim Champion (CR 9), 2x Drow Elite Warriors (CR 5), 4x Zhentarim Thugs. They focus on the PC with the most gold.", monsters: ["crow", "zhentarim-champion", "drow-elite-warrior", "thug"] }
];

// [NEW] Version 4.0 Dungeon Encounters
export const SILENT_WARDS_TABLE: Encounter[] = [
    { roll: [1, 1], name: "The Shifting Crush", description: "Walls retract rapidly. DC 16 Dex save or 4d10 Bludgeoning damage." },
    { roll: [2, 10], name: "Arcanum Wraiths", description: "2 Arcanum Wraiths phase through the mithral walls. They speak in Netherese.", monsters: ["arcanum-wraith"] },
    { roll: [11, 15], name: "Mithral Golem", description: "A Construct (Iron Golem stats) made of Mithral. Magic resistance, reflects spells on 6.", monsters: ["mithral-golem"] },
    { roll: [16, 19], name: "Silence Trap", description: "A glyph activates 'Silence'. Inside, 4 Invisible Stalkers attack.", monsters: ["invisible-stalker"] },
    { roll: [20, 20], name: "Mithral Vein", description: "Players find a raw vein of Mithral worth 2000gp. Mining it summons a Purple Worm (1 hour later).", monsters: ["purple-worm"] }
];

export const LIBRARY_WHISPERS_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Scroll Swarm", description: "10 Swarms of Animated Books (flying) attack. They cast Firebolt (cantrip) each turn.", monsters: ["swarm-of-animated-books"] },
    { roll: [6, 12], name: "Lich-Librarian", description: "A Demi-Lich skull demands a library card. Failure to produce one = Howl.", monsters: ["demilich"] },
    { roll: [13, 18], name: "Forbidden Knowledge", description: "A book flies open. Reader makes DC 20 Wis save or gains 'Contact Other Plane' effect." },
    { roll: [19, 20], name: "Rhaugilath's Echo", description: "Rhaugilath appears. He offers to trade a spell slot for a piece of lore.", monsters: ["rhaugilath"] }
];

export const HEART_CHAMBER_TABLE: Encounter[] = [
    { roll: [1, 5], name: "Lair Action: Pulse", description: "The Dracolich bone pile pulses. DC 22 Con save or 1 Exhaustion.", monsters: ["dracolich"] },
    { roll: [6, 12], name: "Void-Touched", description: "1d4 Nightwalkers spawn from the shadows.", monsters: ["nightwalker"] },
    { roll: [13, 17], name: "Larloch's Gaze", description: "The Shadow King watches. All healing is halved for 1 minute.", monsters: ["larloch"] },
    { roll: [18, 20], name: "Drakharaz Reawakens", description: "Drakharaz the Eternal (CR 25 Dracolich) rises from the bones. The Final Guardian.", monsters: ["drakharaz-the-eternal"] }
];

export const UNDERDARK_TRAVEL_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Faerzress Storm", description: "A surge of magical radiation. All spells cast have a 50% chance to trigger a Wild Magic Surge. Lasts 1 hour." },
    { roll: [3, 4], name: "Web-Choked Tunnel", description: "The path is blocked by thick webbing. 2 Giant Spiders (CR 1) and 1 Ettercap (CR 2) attack from hiding.", monsters: ["giant-spider", "ettercap"] },
    { roll: [5, 6], name: "Drow Patrol", description: "A Drow Elite Warrior (CR 5) and 4 Drow (CR 1/4) demand a toll of 500gp or blood.", monsters: ["drow-elite-warrior", "drow"] },
    { roll: [7, 7], name: "Hook Horror Ambush", description: "Claws click in the dark. 2 Hook Horrors (CR 3) drop from the ceiling.", monsters: ["hook-horror"] },
    { roll: [8, 8], name: "The Mad Cartographer", description: "An insane NPC scribbling on the walls. He offers a map shortcut (Success) or leads you into a trap (Failure).", monsters: ["mad-cartographer"] },
    { roll: [9, 9], name: "Deep Gnome Guides?", description: "A group of Svirfneblin offer aid. One is a Doppelganger ('The Traitorous Surveyor') planning to lead you to Mind Flayers.", monsters: ["deep-gnome", "traitorous-surveyor"] },
    { roll: [10, 10], name: "Umber Hulk Tunneling", description: "The wall explodes. An Umber Hulk (CR 5) bursts through, confusing everyone.", monsters: ["umber-hulk"] },
    { roll: [11, 11], name: "Roper's Trap", description: "A stalagmite isn't what it seems. A Roper (CR 5) attempts to eat the point character.", monsters: ["roper"] },
    { roll: [12, 12], name: "Mind Flayer Scout", description: "A Mind Flayer (CR 7) detects the party's minds. It attempts to Dominate the strongest warrior.", monsters: ["mind-flayer"] },
    { roll: [13, 13], name: "Fungal Behemoth", description: "A massive, animated mass of violet fungus blocks the path. It releases toxic spores.", monsters: ["fungal-behemoth"] },
    { roll: [14, 14], name: "Beholder's Gaze", description: "You stumble into a vertical shaft. A Beholder (CR 13) floats down, eyes glowing.", monsters: ["beholder"] },
    { roll: [15, 15], name: "The Purple Worm", description: "Tremors shake the ground. A Purple Worm (CR 15) swallows the path ahead.", monsters: ["purple-worm"] },
    { roll: [16, 17], name: "Drider Curse", description: "3 Driders (CR 6) weave a ritual. They are creating more of their kind from captured Drow.", monsters: ["drider"] },
    { roll: [18, 18], name: "Deep Balor", description: "A Balor ('The Deep Balor') bound to the shadows. It guards a Netherese ruin. (Go to Maps > The Netheril Ruins to run this adventure).", monsters: ["the-deep-balor"] },
    { roll: [19, 19], name: "Lich's Apprentice", description: "An Alhoon (Mind Flayer Lich) is studying a scroll. It casts Wall of Force to study you.", monsters: ["alhoon"] },
    { roll: [20, 20], name: "Araushnee's Blessing", description: "A rare shrine to the Elven goddess before her fall. Restores all spell slots." }
];

export const ARACH_TINILITH_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Web of Lies", description: "The sticky floor is actually a Mimic Colony (Huge).", monsters: ["mimic"] },
    { roll: [3, 5], name: "Demon Patrol", description: "Quenthel's personal guard: 1 Draegloth and 2 Vrocks patrolling the air.", monsters: ["draegloth", "vrock"] },
    { roll: [6, 8], name: "Lolth's Kiss", description: "A trap rune triggers. DC 22 Con save or be poisoned (paralyzed) for 1 hour.", monsters: [] },
    { roll: [9, 11], name: "The Failed Ascendants", description: "3 Driders (cursed drow) beg for death. They fight until killed.", monsters: ["drider"] },
    { roll: [12, 14], name: "Yochlol Deception", description: "A beautiful Drow invites the party to hide. It is a Yochlol in disguise.", monsters: ["yochlol"] },
    { roll: [15, 17], name: "Phase Spider Ambush", description: "The walls ripple. 4 Phase Spiders blink in, attack, and blink out.", monsters: ["phase-spider"] },
    { roll: [18, 19], name: "High Priestess Procession", description: "A Drow Priestess of Lolth leads 6 Elite Warriors. Players must hide (Stealth DC 20) or fight.", monsters: ["drow-priestess-of-lolth", "drow-elite-warrior"] },
    { roll: [20, 20], name: "Avatar's Echo", description: "A momentary rift to the Demonweb Pits. A Balor steps through for 1d4 rounds before being pulled back.", monsters: ["balor"] }
];

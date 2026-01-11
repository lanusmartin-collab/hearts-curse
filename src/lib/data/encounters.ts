export type Encounter = {
    roll: number[];
    name: string;
    description: string;
    monsters?: string[];
};

// --- OAKHAVEN (SURFACE) ---
// THEME: A town stuck in time. Echoes of the past, gray despair, Zhentarim greed, and subtle Drow infiltration.

export const TOWN_DAY_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Hollow Procession", description: "SCENE: Twenty 'Echoes' (neutral ghosts) walk in perfect unison towards the cliffside. They pass through walls and people. \nMECHANIC: Interacting forces a DC 18 Wis save or the PC joins the line, unable to act for 1 minute as they relive a memory of the town's founding.", monsters: ["ghost"] },
    { roll: [3, 4], name: "Barkeep's Remorse", description: "SCENE: Elias (Good Spirit) is wiping a spectral window. He points to a Zhentarim thug bullying a child. 'I cannot intervene,' he whispers. \nOPPORTUNITY: If the party helps, Elias grants them a *Potion of Healing* that tastes like warm ale.", monsters: [] },
    { roll: [5, 6], name: "Zhentarim Extortion", description: "SCENE: Three Zhentarim Thugs are demanding 'protection tax' from a confused Echo. \nCOMBAT: They are real; the Echo is not. If attacked, they shout for backup. Defeating them boosts town morale (temporarily).", monsters: ["thug"] },
    { roll: [7, 8], name: "Mithral Dust Storm", description: "SCENE: The wind shifts, bringing glittering grey dust from the mines. \nTHREAT: Heavy Obscurement. Breathing it requires DC 12 Con save or Poisoned for 1 hour. Magic items glow brightly in the dust, revealing their aura schools.", monsters: [] },
    { roll: [9, 10], name: "The Thayan Merchant", description: "SCENE: A Red Wizard (Non-hostile) has set up a stall selling 'cures' for the curse. \nINTERACTION: He knows the cures are fake but sells valuable spell components. He is spying on Larloch's progress.", monsters: ["mage"] },
    { roll: [11, 12], name: "Drow Reconnaissance", description: "SCENE: A beggar in the alley has purple eyes. It is a Drow Spy in disguise. \nREVEAL: If approached, he tries to sell a 'Map of the Mines' (True) for 50gp to sow chaos.", monsters: ["spy"] },
    { roll: [13, 14], name: "The Tax Collector", description: "SCENE: A Helmed Horror blocks the street, pointing a gauntlet. \nDEMAND: 'The Tithe'. It demands 100gp or 1 Hit Die worth of blood. It attacks if refused.", monsters: ["helmed-horror"] },
    { roll: [15, 16], name: "Mind Flayer Inquisitor", description: "SCENE: A robed figure stands motionless in the square. \nREVEAL: It is an Illithid serving House Baenre, scanning thoughts for 'The Key'. \nACTION: It attempts to *Detect Thoughts* on the party. If caught, it *Levitates* away.", monsters: ["mind-flayer"] },
    { roll: [17, 18], name: "Netherese Flare", description: "SCENE: The air tastes like ozone. A pulse from the castle disrupts magic. \nEFFECT: The next spell cast triggers a Wild Magic Surge. If no spell is cast in 1 minute, a random nearby object explodes (4d6 Force).", monsters: [] },
    { roll: [19, 19], name: "The Lost Child", description: "SCENE: A small girl cries over a broken doll. Both are Echoes. \nLORE: Repairing the doll with *Mending* causes the girl to fade peacefully, leaving behind a small silver locket (worth 25gp).", monsters: [] },
    { roll: [20, 20], name: "Khelben's Sign", description: "SCENE: A Blackstaff symbol briefly glows on a wall in blue fire. \nBOON: Reading it restores 1 Spell Slot of the lowest level expended.", monsters: [] }
];

export const TOWN_NIGHT_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Whispering Fog", description: "SCENE: The mist thickens and forms faces of the PCs' dead loved ones. \nMECHANIC: DC 19 Wis save or gain Short-Term Madness (Fear of the Dark). The mist is semi-solid.", monsters: [] },
    { roll: [3, 4], name: "Wraith Patrol", description: "SCENE: The temperature drops to freezing. 1d4 Wraiths drift through the walls of the nearest building. \nTACTIC: They act as a squad, focusing fire on the target with the highest Strength.", monsters: ["wraith"] },
    { roll: [5, 6], name: "The Midnight Market", description: "SCENE: Ghostly vendors appear, selling items that don't exist in the waking world. \nTRADE: You can trade a 'happy memory' for a *Potion of Invisibility*. The memory is lost forever.", monsters: [] },
    { roll: [7, 8], name: "Zhentarim Assassin", description: "SCENE: A reflection on a rooftop. A Zhentarim Assassin is tracking the party, counting their gold. \nTWIST: If spotted, he flees using a *Potion of Gaseous Form* rather than fight.", monsters: ["assassin"] },
    { roll: [9, 10], name: "Phase Spider Nest", description: "SCENE: The cobblestones ripple like water. \nAMBUSH: 4 Phase Spiders emerge from the Ethereal Plane, attack, and vanish. They attempt to drag a grappled PC into the Ethereal.", monsters: ["phase-spider"] },
    { roll: [11, 12], name: "Drow Extraction Team", description: "SCENE: 3 Drow Elite Warriors and a Mage are cornering a 'Ghost' to interrogate it about the castle. \nCOMBAT: They fight tactically, using *Darkness* and poison. They carry a *Map of the Mines*.", monsters: ["drow-elite-warrior", "mage"] },
    { roll: [13, 14], name: "House Baenre Hunter", description: "SCENE: A Drider skitters silently on the rooftops, watching. \nMISSION: It is hunting for the 'Surface Dwellers' mentioned in the prophecy. It waits for the party to be separated.", monsters: ["drider"] },
    { roll: [15, 16], name: "The Hounds of Larloch", description: "SCENE: 1d6 Shadow Mastiffs emerge from a non-existent alley. \nTHREAT: They howl, possibly alerting the Castle. Stealth is the best option.", monsters: ["shadow-mastiff"] },
    { roll: [17, 18], name: "Vampiric Mist", description: "SCENE: A red fog rolls across the ground. \nCOMBAT: It seeks to drain blood from sleeping targets. PCs on watch must succeed DC 15 Perception.", monsters: ["vampiric-mist"] },
    { roll: [19, 19], name: "The Weeping Statue", description: "SCENE: The town square statue weeps blood. \nEFFECT: Collecting the blood yields one dose of basic poison. Touching it causes 2d6 Necrotic damage.", monsters: [] },
    { roll: [20, 20], name: "Larloch's Projection", description: "SCENE: A 20ft tall illusion of the Lich King appears in the town square. \nACTION: He points at a random NPC, casting *Finger of Death*. The NPC turns into a Zombie instantly. Larloch laughs and fades.", monsters: ["larloch", "zombie"] }
];

// --- UNDERDARK / MINES ---
// THEME: Subterranean horror, ancient mining equipment, Drow territory, and alien flora.

export const OAKHAVEN_MINES_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Rotting Support", description: "SCENE: The ceiling groans. A support beam rots instantly due to necrotic seepage. \nMECHANIC: DC 15 Dex save or take 4d10 Bludgeoning from falling rocks. The path is blocked.", monsters: [] },
    { roll: [3, 4], name: "Ghostly Miners", description: "SCENE: Transparent dwarves are mining a vein that has been empty for centuries. \nINTERACTION: They ignore the party unless a specific pickaxe (found elsewhere) is returned. Reward: Directions to a hidden stash.", monsters: ["ghost"] },
    { roll: [5, 6], name: "Scavenger Construct", description: "SCENE: A Flesh Golem made of miner corpses lumbers through the dark. \nBEHAVIOR: It is non-hostile unless it sees gold/metal directly. It eats metal.", monsters: ["flesh-golem"] },
    { roll: [7, 8], name: "Carrion Crawler Nest", description: "SCENE: The smell of rot is overwhelming. \nCOMBAT: 3 Carrion Crawlers are feasting on a Zhentarim corpse. They defend their meal.", monsters: ["carrion-crawler"] },
    { roll: [9, 10], name: "Duergar Invisiblestalkers", description: "SCENE: Footsteps in the dust, but no one is there. \nAMBUSH: 4 Duergar (Invisible) surround the party. Surprise Round likely.", monsters: ["duergar"] },
    { roll: [11, 12], name: "Mithral Vein", description: "SCENE: A pristine vein of Mithral Ore (worth 500gp) is exposed. \nTRAP: It is covered in Yellow Mold. Touching it releases a spore cloud (Poisoned).", monsters: [] },
    { roll: [13, 14], name: "Chasm Winds", description: "SCENE: A gust from the deep chasm threatens to blow small creatures off the ledge. \nMECHANIC: DC 14 Str save or be pushed 10ft toward the edge.", monsters: [] },
    { roll: [15, 16], name: "Rust Monster Swarm", description: "SCENE: Clicking sounds. Five Rust Monsters smell the Paladin's armor. \nTHREAT: They are hungry for iron. Throwing rations of spikes/metal can distract them.", monsters: ["rust-monster"] },
    { roll: [17, 18], name: "The Xorn's Bargain", description: "SCENE: A Xorn emerges from the wall. It speaks Terran. \nOFFER: 'Status for Gems?' It will reveal the location of the nearest enemy for 100gp in gems.", monsters: ["xorn"] },
    { roll: [19, 19], name: "Elevator Shaft", description: "SCENE: An ancient dwarven elevator. The ropes are frayed. \nUSE: Can descend 2 levels instantly, but 25% chance to snap (10d6 falling damage).", monsters: [] },
    { roll: [20, 20], name: "The Mithral Mother", description: "SCENE: A Huge Xorn with mithral-plating feasts on a vein. \nREWARD: If defeated or bribed (500gp in gems), it yields 1d4 Mithral Ores.", monsters: ["xorn"] }
];

export const UNDERDARK_TRAVEL_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Faerzress Storm", description: "SCENE: Purple radiation illuminates the cavern. \nEFFECT: All spells have a 50% chance to surge. Teleportation always fails. Lasts 1d4 hours.", monsters: [] },
    { roll: [3, 4], name: "Deep Gnome Caravan", description: "SCENE: A Svirfneblin expedition led by 'Blingdenstone Bob'. \nTRADE: They sell Spell Gems (store 1 spell) and Salted Spiders. Neutral.", monsters: ["deep-gnome"] },
    { roll: [5, 6], name: "Hook Horror Pack", description: "SCENE: Clicking sounds echo from the ceiling stalactites. \nCOMBAT: 3 Hook Horrors drop from above. They use Hook to grapple and drag PCs up.", monsters: ["hook-horror"] },
    { roll: [7, 8], name: "Myconid Pilgrim", description: "SCENE: A solitary Myconid Sovereign walks silently. \nINTERACTION: It offers 'The Meld'. Accepting grants telepathy for 24h but disadvantage on Init.", monsters: ["myconid-sovereign"] },
    { roll: [9, 10], name: "Mind Flayer Scout", description: "SCENE: You feel a headache before you see him. \nTHREAT: A Mind Flayer is surveying for new thralls. It attempts to *Dominate* the Barbarian/Fighter first.", monsters: ["mind-flayer"] },
    { roll: [11, 12], name: "Drow Toll-Gate", description: "SCENE: A Drow Elite Warrior and 6 Drow have fortified a choke point. \nDEMAND: '500gp or your heads.' They will accept information about Oakhaven instead.", monsters: ["drow-elite-warrior", "drow"] },
    { roll: [13, 14], name: "Giant Rocktopus", description: "SCENE: Tentacles painted to look like stalagmites. \nCOMBAT: A Giant Octopus adapted for land attacks from the ceiling. CR 4.", monsters: ["giant-octopus"] },
    { roll: [15, 16], name: "Purple Worm Tremors", description: "SCENE: The ground shakes violently. \nHAZARD: A Purple Worm bursts through the wall, creating a new tunnel. It swallows the path ahead.", monsters: ["purple-worm"] },
    { roll: [17, 18], name: "Kuo-Toa Shrine", description: "SCENE: A crude altar to 'BLIBDOOLPOOLP'. \nLOOT: Pearls worth 200gp. Taking them summons 2d6 Kuo-Toa Whips.", monsters: ["kuo-toa-whip"] },
    { roll: [19, 19], name: "Subterranean Lake", description: "SCENE: A black lake blocks the path. \nSECRET: An Aboleth sleeps here. Disturbing the water wakes it.", monsters: ["aboleth"] },
    { roll: [20, 20], name: "The Wandering Emporium", description: "SCENE: A giant snail carries a hut on its back. \nNPC: A Svirfneblin Merchant selling *Potions of Supreme Healing* and bottled surface air.", monsters: ["deep-gnome"] }
];

export const ARACH_TINILITH_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Web of Lies", description: "SCENE: The floor here is sticky. \nTRAP: It is a Mimic Colony (Huge). The entire room is a mouth.", monsters: ["mimic"] },
    { roll: [3, 4], name: "Slave Uprising", description: "SCENE: A group of goblin slaves is killing a Drow overseer. \nCHOICE: Help the slaves (Good), Help the Drow (Evil), or Watch (Neutral).", monsters: ["goblin", "drow"] },
    { roll: [5, 6], name: "Demon Patrol", description: "SCENE: The smell of sulfur overrides the rot. \nPATROL: Quenthel's personal guard: 1 Draegloth and 2 Vrocks patrolling the air.", monsters: ["draegloth", "vrock"] },
    { roll: [7, 8], name: "Lolth's Favor", description: "SCENE: A Drow Priestess is sacrificing a prisoner to a spider statue. \nINTERRUPT: Combat with Priestess + 2 Giant Spiders. Saving the prisoner rewards a faction alliance.", monsters: ["drow-priestess-of-lolth", "giant-spider"] },
    { roll: [9, 10], name: "Yochlol Deception", description: "SCENE: A beautiful Drow maiden cries for help in a cell. \nTWIST: It is a Yochlol demon. If released, it tries to possess the rescuer.", monsters: ["yochlol"] },
    { roll: [11, 12], name: "Drider Outcast", description: "SCENE: A Drider weeps in a side tunnel, cursed by Lolth. \nSOCIAL: He hates the Drow. He can guide the party to a secret entrance to the temple if healed.", monsters: ["drider"] },
    { roll: [13, 14], name: "Phase Spider Ambush", description: "SCENE: The walls ripple. \nAMBUSH: 4 Phase Spiders blink in. They attempt to teleport away with a captive.", monsters: ["phase-spider"] },
    { roll: [15, 16], name: "Matron's Echo", description: "SCENE: A magical projection of Matron Quenthel gives orders to invisible troops. \nINTEL: Reveals her plan to use the 'Soul Gem'.", monsters: [] },
    { roll: [17, 18], name: "The Spider's Kiss", description: "SCENE: Small spiders rain from the ceiling. \nMECHANIC: 1d4 damage/round until shaken off (Action). Distraction causes Disadvantage on next attack.", monsters: ["swarm-of-spiders"] },
    { roll: [19, 19], name: "Demonweb Rift", description: "SCENE: Space tears open. \nTHREAT: Gravity shifts towards the rift. DC 20 Str save or be pulled into the Abyss (Instant Death).", monsters: [] },
    { roll: [20, 20], name: "Avatar's Echo", description: "SCENE: A momentary rift to the Demonweb Pits opens. \nTHREAT: A Balor steps through for 1d4 rounds before being pulled back. Survive.", monsters: ["balor"] }
];

// --- HIGH LEVEL ZONES ---
// THEME: Reality breaking down, high magic, deadly constructs, and time manipulation.

export const NETHERIL_RUINS_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Gravity Failure", description: "SCENE: The gravity spell on this island fails. \nMECHANIC: Everyone floats. Combat becomes 3D. Newton's laws apply (Equal/Opposite reaction).", monsters: [] },
    { roll: [3, 4], name: "Arcane Debate", description: "SCENE: Two Arcanum Wraiths argue over 10th-level spell theory. \nSOCIAL: A Wizard can intervene (Arcana DC 25). Success grants a permanent +1 to Spell Save DC. Failure initiates combat.", monsters: ["arcanum-wraith"] },
    { roll: [5, 6], name: "Arcanum Wraiths", description: "SCENE: Robed ghosts phase through the obsidian rubble. \nLORE: Ancient Netherese mages. They attack only if interrupted or contradicted.", monsters: ["arcanum-wraith"] },
    { roll: [7, 8], name: "Living Spell", description: "SCENE: A *Living Cloudkill* drifts across the void bridge. \nTHREAT: Immune to physical dmg. Must be dispelled or absorbed.", monsters: ["living-cloudkill"] },
    { roll: [9, 10], name: "Memory of the Fall", description: "SCENE: Vivid illusion of Karsus's Folly. The sky turns red, cities fall. \nMECHANIC: DC 20 Wis save or Stunned for 1 minute (traumatized).", monsters: [] },
    { roll: [11, 12], name: "Void Scavenger", description: "SCENE: A Nightwalker is picking through the ruins. \nSTEALTH: It has not seen you. Sneaking past requires DC 18 Stealth. Combat is lethal.", monsters: ["nightwalker"] },
    { roll: [13, 14], name: "Beholder Projection", description: "SCENE: A giant eye opens in the stars. \nEFFECT: An Anti-Magic cone sweeps across the battlefield for 1d4 rounds.", monsters: [] },
    { roll: [15, 16], name: "Chronal Shift", description: "SCENE: The party ages 1d10 years instantly. \nREVERSAL: Casting *Greater Restoration* reverses it. Otherwise permanent.", monsters: [] },
    { roll: [17, 18], name: "Ioun Stone Drift", description: "SCENE: An unsecured Ioun Stone floats by. \nSKILL: DC 20 Acrobatics to catch it. (Roll on random Ioun Stone table).", monsters: [] },
    { roll: [19, 19], name: "Phaerimm Ambush", description: "SCENE: The ground erupts. \nCOMBAT: A Phaerimm (Ancient Enemy of Netheril) attacks. It wants to drain magic items.", monsters: [] },
    { roll: [20, 20], name: "Timeline Glitch", description: "SCENE: You see yourselves from 1 minute ago entering the room. \nMECHANIC: If you interact, you cause a Paradox explosion (10d10 Force). If you ignore them, you gain Advantage on Initiative.", monsters: [] }
];

export const SILENT_WARDS_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Shifting Walls", description: "SCENE: The dungeon reconfigures early. \nMECHANIC: Dex Save DC 16. Failure: 4d10 Bludgeoning and separated from party.", monsters: [] },
    { roll: [3, 4], name: "Malfunctioning Golem", description: "SCENE: An Iron Golem is walking into a wall repeatedly. \nFIX: DC 20 Tinkering/Arcana repair. If fixed, it follows the party for 1 hour.", monsters: ["iron-golem"] },
    { roll: [5, 6], name: "The Clockwork Hunt", description: "SCENE: A Steel Predator is tracking the party by scent. \nTHREAT: It is immune to non-magical damage and hits like a truck.", monsters: ["steel-predator"] },
    { roll: [7, 8], name: "Mithral Golems", description: "SCENE: Two statues animate silently. \nFEATURE: Immune to Magic. They reflect spells of level 3 or lower.", monsters: ["mithral-golem"] },
    { roll: [9, 10], name: "Silence Trap", description: "SCENE: The air goes dead. \nAMBUSH: 4 Invisible Stalkers attack in the silence. Casters are useless.", monsters: ["invisible-stalker"] },
    { roll: [11, 12], name: "Logic Door", description: "SCENE: A door with no handle. It asks a riddle in binary (flashing lights). \nPUZZLE: Answer is 'Time'. Failure summons a Modron army.", monsters: ["monodrone"] },
    { roll: [13, 14], name: "The Cleaning Crew", description: "SCENE: A Gelatinous Cube sweeps the hallway. \nLOOT: Inside it is a skeleton with a *Wand of Secrets*.", monsters: ["gelatinous-cube"] },
    { roll: [15, 16], name: "Temporal Echo", description: "SCENE: See a previous party of adventurers dying to a trap. \nINTEL: Reveals the location of the next trap.", monsters: [] },
    { roll: [17, 18], name: "Arcane Turret", description: "SCENE: A wall-mounted crystal turret. \nACTION: Casts *Disintegrate* on anything moving faster than a walk.", monsters: [] },
    { roll: [19, 19], name: "The Archivist", description: "SCENE: A Shield Guardian asks for a password. \nSOCIAL: Can be bluffed. If bypassed, guards a lore archive.", monsters: ["shield-guardian"] },
    { roll: [20, 20], name: "The Master Key", description: "SCENE: A skeleton is crushed in the gears. \nLOOT: Holding a *Chime of Opening* (1 charge left).", monsters: [] }
];

export const LIBRARY_WHISPERS_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Scroll Swarm", description: "SCENE: A shelf collapses. Hundreds of spellbooks take flight. \nCOMBAT: 10 Swarms of Animated Books. They cast *Fire Bolt* every turn. Fire is dangerous here.", monsters: ["swarm-of-animated-books"] },
    { roll: [3, 4], name: "The Helpful Tome", description: "SCENE: A sentient spellbook floats over. \nSOCIAL: It is lonely. It will trade a prepared spell for a conversation about the weather.", monsters: [] },
    { roll: [5, 6], name: "Lich-Librarian", description: "SCENE: A Demi-Lich skull hovers by a 'Quiet Please' sign. \nINTERACTION: Demands a Library Card. If none, it howls (Con save or 0 HP).", monsters: ["demilich"] },
    { roll: [7, 8], name: "Forbidden Knowledge", description: "SCENE: A book flies open in front of the Wizard. \nEFFECT: DC 20 Wis save. Success: Learn 1 spell. Failure: *Contact Other Plane* (Insanity).", monsters: [] },
    { roll: [9, 10], name: "Nothic Scribes", description: "SCENE: 3 Nothics are copying texts. \nTRADE: They trade secrets. They know one PC's dark secret.", monsters: ["nothic"] },
    { roll: [11, 12], name: "The Shushing", description: "SCENE: You spoke too loudly. \nAMBUSH: 3 'Scholars of the Void' (Specters) emerge to silence you permanently.", monsters: ["specter"] },
    { roll: [13, 14], name: "Ink Elemental", description: "SCENE: A puddle of black ink rises. \nCOMBAT: Use Water Elemental stats but it blinds targets and deals Necrotic.", monsters: ["water-elemental"] },
    { roll: [15, 16], name: "The Indexer", description: "SCENE: An Allip wanders, muttering the true name of a demon. \nTHREAT: Hearing it causes Psychic damage.", monsters: ["allip"] },
    { roll: [17, 18], name: "Papercut Storm", description: "SCENE: A whirlwind of razor-sharp pages. \nHAZARD: 4d6 Slashing damage per round. Heavy Obscurement.", monsters: [] },
    { roll: [19, 19], name: "Secret Passage", description: "SCENE: Pulling a specific book ('The Lusty Argonian Maid') opens a wall. \nSHORTCUT: Skips next encounter.", monsters: [] },
    { roll: [20, 20], name: "Rhaugilath's Echo", description: "SCENE: The Ghost of the Archlich Rhaugilath appears. \nOFFER: He will trade a 5th-level Spell Slot (consumed) for a key lore secret.", monsters: ["rhaugilath"] }
];

export const HEART_CHAMBER_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Heartbeat", description: "SCENE: The Castle's heart pulses. \nMECHANIC: DC 22 Con save. Failure: 1 Level of Exhaustion. Success: Gain 10 Temp HP.", monsters: [] },
    { roll: [3, 4], name: "Blood of the Dragon", description: "SCENE: A droplet of Drakharaz's necrotic blood falls on a PC. \nEFFECT: 6d10 Necrotic damage. If survived, gain Resistance to Necrotic for 1 hour.", monsters: [] },
    { roll: [5, 6], name: "Dracolich Scale", description: "SCENE: A loose scale falls. \nLOOT: Can be fashioned into a +2 Shield. Heavy.", monsters: [] },
    { roll: [7, 8], name: "Larloch's Attention", description: "SCENE: Larloch turns his head slightly. \nEFFECT: Gravity reverses for one specific PC. They fall 'up' into the storm clouds.", monsters: ["larloch"] },
    { roll: [9, 10], name: "Soul Siphon", description: "SCENE: A vortex opens. \nTHREAT: One random magic item is sucked in. DC 20 Str check to hold onto it.", monsters: [] },
    { roll: [11, 12], name: "Void-Touched Nightwalker", description: "SCENE: A shadow tears itself from the floor. \nCOMBAT: A Nightwalker (CR 20) manifests. This is a severe threat.", monsters: ["nightwalker"] },
    { roll: [13, 14], name: "The Moral Choice", description: "SCENE: An illusion of the PC's family begs them to stop. \nTEST: Disbelieving requires a DC 18 Int save. Failure: Charmed by Larloch.", monsters: [] },
    { roll: [15, 16], name: "Necrotic Storm", description: "SCENE: Lightning strikes the platform. \nDAMAGE: 8d8 Lightning + 8d8 Necrotic to anyone flying.", monsters: [] },
    { roll: [17, 18], name: "Reinforcements", description: "SCENE: Larloch summons help. \nCOMBAT: 2 Death Knights rise from the bone piles.", monsters: ["death-knight"] },
    { roll: [19, 19], name: "Unstable Magic", description: "SCENE: The Weave tears. \nEFFECT: All spells cast at 1 level higher for 1d4 rounds.", monsters: [] },
    { roll: [20, 20], name: "The Redemption", description: "SCENE: A specter of the Dragon's former self (Good) offers aid. \nBOON: He breaths 'Life' on the party. Effects of a Long Rest applied instantly.", monsters: [] }
];

export const OSSUARY_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Boneslide", description: "SCENE: The mountain of bones shifts like a landslide. \nMECHANIC: DC 18 Str save or be buried. Suffocation rules apply.", monsters: [] },
    { roll: [3, 4], name: "Grieving Spirit", description: "SCENE: A ghost cries over a specific skull. \nSOCIAL: Bringing the skull to a hallowed spot releases the spirit. Reward: Blessing (+1 Saves).", monsters: ["ghost"] },
    { roll: [5, 6], name: "Banshee Choir", description: "SCENE: The wind sounds like screaming. \nCOMBAT: 3 Banshees rise from the dust. They can wail as a Lair Action.", monsters: ["banshee"] },
    { roll: [7, 8], name: "Bone Golem", description: "SCENE: A heap of bones assembles itself. \nCOMBAT: Use Clay Golem stats but vulnerable to Bludgeoning.", monsters: ["clay-golem"] },
    { roll: [9, 10], name: "The Corpse Gatherer", description: "SCENE: A hill stands up. It is a Giant made of gravestones and bodies. \nTHREAT: Inspects players for 'good bones'.", monsters: ["corpse-gatherer"] },
    { roll: [11, 12], name: "Hallowed Ground", description: "SCENE: A small circle of white flowers amidst the rot. \nSAFE: Undead cannot enter. Short Rest gives max HP.", monsters: [] },
    { roll: [13, 14], name: "Mirror of Despair", description: "SCENE: A polished black mirror. \nEFFECT: DC 16 Cha save. Failure: Character sees their own death and is Frightened for 1 hour.", monsters: [] },
    { roll: [15, 16], name: "Vampire Spawn Pit", description: "SCENE: You fall into a pit. \nCOMBAT: 6 Vampire Spawn are sleeping here. They wake up hungry.", monsters: ["vampire-spawn"] },
    { roll: [17, 18], name: "Skeletal Juggernaut", description: "SCENE: A massive amalgamation of skeletons rolls forward. \nRUN: Chase scene mechanics. DC 15 Athletics checks.", monsters: [] },
    { roll: [19, 19], name: "Whispering Skull", description: "SCENE: A skull on a pike whispers a password. \nINTEL: Password opens the next sealed door.", monsters: [] },
    { roll: [20, 20], name: "Lich's Philactery Echo", description: "SCENE: You find a failed phylactery of Larloch. \nLOOT: Crushing it yields a *Soul Coin*.", monsters: [] }
];

export const OUTSKIRTS_TABLE: Encounter[] = [
    { roll: [1, 2], name: "The Dust-Bound Drifter", description: "SCENE: A lone wanderer in rags approaches. He is a Revenant. \nDIALOGUE: 'You stole my breath...' He attacks the Warlock/Cleric specifically.", monsters: ["revenant"] },
    { roll: [3, 4], name: "Desperate Refugees", description: "SCENE: A family hiding under a wagon. \nSOCIAL: They are starving. Giving food grants 'Inspiration'.", monsters: ["commoner"] },
    { roll: [5, 6], name: "Sky-Slayer Ambush", description: "SCENE: Shadows pass over the sun. \nCOMBAT: 1d4 Perytons dive-bomb from the clouds. They target PCs with high Charisma to eat their hearts.", monsters: ["peryton"] },
    { roll: [7, 8], name: "Broken Caravan", description: "SCENE: A destroyed merchant cart. \nINVESTIGATION: DC 15. Success finds a hidden compartment with 200gp.", monsters: [] },
    { roll: [9, 10], name: "Zhentarim Toll-Gate", description: "SCENE: A barricade of overturned wagons. \nFORCE: 1 Mage and 10 Thugs. '100gp or heads.' They have a Ballista aimed at the road.", monsters: ["mage", "thug"] },
    { roll: [11, 12], name: "Werewolf Pack", description: "SCENE: A group of 'hunters' invites the party to a fire. \nTWIST: They are Werewolves. They transform at midnight.", monsters: ["werewolf"] },
    { roll: [13, 14], name: "Stampede of the Scourged", description: "SCENE: The ground rumbles. Undead Aurochs are being chased by a Will-o'-Wisp. \nMECHANIC: DC 15 Dex save or 4d10 Bludgeoning.", monsters: ["will-o-wisp"] },
    { roll: [15, 16], name: "Corrupted Treant", description: "SCENE: A dead tree animates. \nCOMBAT: It is rotting and insane. Vulnerable to Fire.", monsters: ["treant"] },
    { roll: [17, 18], name: "Strange Weather", description: "SCENE: It starts raining blood. \nEFFECT: All visibility reduced to 10ft. Morale penalty.", monsters: [] },
    { roll: [19, 19], name: "Traveling Bard", description: "SCENE: A bard plays a lute on a stump, untouched by the gloom. \nSONG: Grants 1d10 Temp HP to listeners.", monsters: ["bard"] },
    { roll: [20, 20], name: "Larloch's Manifestation", description: "SCENE: A zombie stumbles forward, its eyes glowing blue. \nACTION: Larloch speaks through it, then casts *Counterspell* on the party's next healing spell.", monsters: ["larloch", "zombie"] }
];

export const SHOP_AMBUSH_TABLE: Encounter[] = [
    {
        roll: [1, 8],
        name: "The Debt of Memory",
        description: "SCENE: A courier delivers a heavy iron box instead of the goods. Inside is the Shopkeeper's severed hand and a note: 'The Black Network cannot be charmed.' \n\nAMBUSH: Ignacio (Zhentarim Lord) steps from invisibility with his personal bodyguard, 'The Wall' (Juggernaut), and a Counterspell Mage. \n\nIGNACIO'S PARANOIA: He believes the Modify Memory was a Psionic/Mind Flayer attack. 'Tell me where the Colony is, Drow-lovers.' \n\nSIDEBAR: The Mercenary PC receives a *Sending*: '7,000 Platinum to walk away. Khelben never needs to know.'",
        monsters: ["ignacio", "varth", "mage"]
    },
    {
        roll: [9, 15],
        name: "Diplomatic Immunity",
        description: "SCENE: Vanko the Silk awaits the party, flanked by THREE Shield Guardians. He offers a *Ring of Mind Shielding* or *Staff of Charming* (calling it a 'Gentleman's Cane') as a 'Token of Apology'.\n\nTACTIC: If attacked, Vanko uses *Sanctuary* and *Mislead* to let his Guardians tank. He creates illusions of himself to confuse attackers while he coats his hidden dagger.",
        monsters: ["vanko", "zhentarim_guardian", "zhentarim_guardian", "zhentarim_guardian"]
    },
    {
        roll: [16, 20],
        name: "Audit in Progress",
        description: "SCENE: The area is unnaturally quiet. A *Silence* spell blankets the shop. The Red Ledger team has arrived to 'balance the books'.\n\nTACTIC: The Auditor (Maximilian) maintains *Silence* on casters and uses Counterspell. The Eraser (Sniper) takes shots from 200ft away (Stealth). The Cleaner (Monk) rushes in to decompose the bodies.\n\nNOTE: This only triggers if the party has killed Vanko or betrayed the Zhentarim significantly.",
        monsters: ["auditor", "eraser", "cleaner"]
    }
];

export const CASTLE_MOURNWATCH_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Wild Magic Surge", description: "SCENE: A stray spell hits the courtyard. \nEFFECT: Roll on the Wild Magic Table. Gravity might reverse (Dex save DC 15) or everyone turns blue.", monsters: [] },
    { roll: [3, 4], name: "Red Wizard Patrol", description: "SCENE: Thayan Wizards levitating over the ramparts. \nCOMBAT: 1 Mage and 2 Thugs (Guards). They spot anyone not disguised.", monsters: ["mage", "thug"] },
    { roll: [5, 6], name: "Undead Archers", description: "SCENE: Skeleton archers on the high walls. \nHAZARD: Volley fire! DC 14 Dex save or take 3d6 Piercing. They are out of range.", monsters: ["skeleton"] },
    { roll: [7, 8], name: "Gargoyle Ambush", description: "SCENE: The statues turn comfortably. \nAMBUSH: 4 Gargoyles swoop down to drop PCs off the edge.", monsters: ["gargoyle"] },
    { roll: [9, 10], name: "Chain Break", description: "SCENE: One of the massive shadow-chains snaps. \nHAZARD: The island tilts. DC 16 Dex save or slide 20ft towards the edge.", monsters: [] },
    { roll: [11, 12], name: "Spectral Knight", description: "SCENE: A Ghost Knight challenges the party to a duel. \nHONOR: 1v1 Combat. Win: He grants passage. Loss: He takes 1 Hit Die max HP.", monsters: ["ghost"] },
    { roll: [13, 14], name: "Necrotic Fog", description: "SCENE: Black clouds roll in. \nEFFECT: Visibility 5ft. Taking an action deals 1d4 Necrotic damage.", monsters: [] },
    { roll: [15, 16], name: "Captured Rebel", description: "SCENE: A Zhentarim defector is being hung continuously (revived and hung again). \nCHOICE: Rescue him for intel on Varth, or leave him.", monsters: ["zombie"] },
    { roll: [17, 18], name: "Varth's Gaze", description: "SCENE: The General watches from the balcony. \nEFFECT: DC 15 Wis save or Frightened for 1 minute.", monsters: [] },
    { roll: [19, 19], name: "Loot Wagon", description: "SCENE: A wagon of supplies for the siege. \nLOOT: 3 Potions of Healing and a barrel of explosives.", monsters: [] },
    { roll: [20, 20], name: "The Gatekeeper", description: "SCENE: A Death Knight blocks the path. \nCOMBAT: High difficulty. He guards the key to the Geodes.", monsters: ["death-knight"] }
];

export const CATACOMBS_DESPAIR_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Weeping Wall", description: "SCENE: The faces in the stone wall are crying. \nEFFECT: Touching the tears causes 1d6 Psychic damage and a memory of sorrow.", monsters: [] },
    { roll: [3, 4], name: "Caged Souls", description: "SCENE: A soul-cage rattles. \nINTERACTION: The soul begs for release. Breaking the cage (AC 18) releases a Specter (Confused).", monsters: ["specter"] },
    { roll: [5, 6], name: "Grave Robbers", description: "SCENE: 3 Ghouls are digging up a fresh grave. \nCOMBAT: They fight fiercely over a shiny ring.", monsters: ["ghoul"] },
    { roll: [7, 8], name: "The Warden's Pet", description: "SCENE: Chains rattle in the dark. \nCOMBAT: A Bone Devil (The Warden's favorite) is hunting escaped souls.", monsters: ["bone-devil"] },
    { roll: [9, 10], name: "Despair Field", description: "SCENE: A wave of hopelessness hits. \nMECHANIC: DC 15 Cha save. Failure: Disadvantage on all rolls for 10 minutes.", monsters: [] },
    { roll: [11, 12], name: "Lost Adventurer", description: "SCENE: A skeleton in plate mail holding a diary. \nLOOT: Diary gives a hint to the 'Vault of Despair'.", monsters: [] },
    { roll: [13, 14], name: "Shadow Essence", description: "SCENE: A pool of liquid shadow. \nEFFECT: Drinking it grants Darkvision but imparts Sunlight Sensitivity.", monsters: [] },
    { roll: [15, 16], name: "Larva Mage", description: "SCENE: A figure made of worms approaches. \nCOMBAT: A Star Spawn Larva Mage (or reskinned Mage). Extremely dangerous.", monsters: ["mage"] },
    { roll: [17, 18], name: "Banshee's wail", description: "SCENE: Distant screaming gets closer. \nTHREAT: Brace for a Banshee attack.", monsters: ["banshee"] },
    { roll: [19, 19], name: "Moment of Peace", description: "SCENE: A single ray of light breaks the gloom. \nHEAL: Standing in it restores 2d8 HP.", monsters: [] },
    { roll: [20, 20], name: "Avatar of Woe", description: "SCENE: The Shadow Dragon flies overhead. \nHAZARD: His breath weapon strafes the walkway. 10d6 Necrotic damage (Dex save half).", monsters: [] }
];

export const DWARVEN_RUINS_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Drow Patrol", description: "SCENE: 4 Drow led by an Elite Warrior. \nTACTIC: They use Darkness and Faerie Fire. They want prisoners.", monsters: ["drow", "drow-elite-warrior"] },
    { roll: [3, 4], name: "Giant Spider Ambush", description: "SCENE: Webs cover the ceiling. \nCOMBAT: 3 Giant Spiders descend silently. Web attacks to restrain.", monsters: ["giant-spider"] },
    { roll: [5, 6], name: "Dwarven Ghost", description: "SCENE: A ghostly smith works at a cold anvil. \nQUEST: 'Light the forge...' He marks a hidden armory on the map.", monsters: ["ghost"] },
    { roll: [7, 8], name: "Web Trap", description: "SCENE: Invisible tripwires. \nTRAP: DC 15 Dex save or restrained and bells ring, alerting nearby Drow.", monsters: [] },
    { roll: [9, 10], name: "Drider Outcast", description: "SCENE: A Drider cursed by Lolth is eating a Drow. \nSOCIAL: He hates the Drow more than you. Temporary ally?", monsters: ["drider"] },
    { roll: [11, 12], name: "Slave Pen Breakout", description: "SCENE: 2 Quaggoths chasing a Gnome slave. \nCHOICE: Intervene or hide. The Gnome knows the gate password.", monsters: ["quaggoth"] },
    { roll: [13, 14], name: "Baenre Inquisitor", description: "SCENE: A Drow Priestess of Lolth questioning a prisoner. \nCOMBAT: High threat. She has spells.", monsters: ["drow-priestess-of-lolth"] },
    { roll: [15, 16], name: "Roper Decoy", description: "SCENE: A stalagmite looks suspicious. \nCOMBAT: It's a Roper. It tries to drag PCs into the chasm.", monsters: ["roper"] },
    { roll: [17, 18], name: "Loot Cache", description: "SCENE: A hidden Drow supply crate. \nLOOT: 2 Drow Poison vials and a Potion of Climbing.", monsters: [] },
    { roll: [19, 19], name: "The Silence", description: "SCENE: Absolute silence falls. \nTHREAT: Someone cast Silence. An assassin is near.", monsters: ["assassin"] },
    { roll: [20, 20], name: "Yaz'mina's Avatar", description: "SCENE: A projection of the High Priestess. \nEFFECT: She curses the party. -1d4 to attempts to stealth for 1 hour.", monsters: [] }
];

export const MIND_FLAYER_COLONY_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Psionic blast", description: "SCENE: A headache splits your skull. \nEFFECT: 3d6 Psychic damage to everyone. Int save DC 14 for half.", monsters: [] },
    { roll: [3, 4], name: "Intellect Devourers", description: "SCENE: Brain-cats on legs skitter by. \nCOMBAT: 3 Intellect Devourers looking for bodies. Protect the Barbarian!", monsters: ["intellect-devourer"] },
    { roll: [5, 6], name: "Thrall Patrol", description: "SCENE: 4 Grimlocks with glazed eyes. \nCOMBAT: They fight to the death. Mindless.", monsters: ["grimlock"] },
    { roll: [7, 8], name: "Mind Flayer Arcanist", description: "SCENE: An Illithid floating and reading a scroll. \nCOMBAT: Uses magic and psionics. Deadly.", monsters: ["mind-flayer"] },
    { roll: [9, 10], name: "Tadpole Pool", description: "SCENE: A brine pool full of tadpoles. \nHAZARD: DC 12 Dex save near edge or fall in. Infestation risk.", monsters: [] },
    { roll: [11, 12], name: "Captured NPC", description: "SCENE: An NPC from Oakhaven is being strapped to a chair. \nQUEST: Save them before ceremorphosis (1d4 rounds).", monsters: ["mind-flayer"] },
    { roll: [13, 14], name: "Githyanki Raiding Party", description: "SCENE: A Githyanki Knight and 2 Warriors warp in. \nSOCIAL: Enemy of my enemy? They are hunting Illithids.", monsters: ["githyanki-knight"] },
    { roll: [15, 16], name: "Elder Brain Resonance", description: "SCENE: The Hive Mind speaks. \nSAVE: DC 16 Wis save or be Stunned 1 round.", monsters: [] },
    { roll: [17, 18], name: "Strange Tech", description: "SCENE: Alien machinery humming. \nCHECK: DC 20 Arcana to activate. Restores a spell slot.", monsters: [] },
    { roll: [19, 19], name: "Neothelid Tremor", description: "SCENE: The massive worm passes nearby. \nEFFECT: Knockdown. Everyone Prone.", monsters: [] },
    { roll: [20, 20], name: "The Ulitharid", description: "SCENE: A 6-tentacled Mind Flayer lord. \nBOSS: Run or die. He commands respect.", monsters: ["mind-flayer"] }
];

export const BEHOLDER_LAIR_TABLE: Encounter[] = [
    { roll: [1, 2], name: "Disintegration Ray", description: "SCENE: A stray beam cuts the darkness. \nSAVE: DC 16 Dex save or take 10d8 Force damage. Terrain destroyed.", monsters: [] },
    { roll: [3, 4], name: "Gauth Guards", description: "SCENE: 2 Lesser Beholders (Gauths) eating magic items. \nCOMBAT: They drain magic charges from items.", monsters: ["gauth"] },
    { roll: [5, 6], name: "Anti-Magic Cone", description: "SCENE: All magic items turn off for 1 minute. \nPANIC: You are vulnerable. Something is watching.", monsters: [] },
    { roll: [7, 8], name: "Petrified Victim", description: "SCENE: A remarkably detailed statue of a rogue. \nLOOT: A Potion of Greater Healing in its stone pouch.", monsters: [] },
    { roll: [9, 10], name: "Vertical Ambush", description: "SCENE: Death from above. \nCOMBAT: 3 Grell descend silently with tentacles.", monsters: ["grell"] },
    { roll: [11, 12], name: "Spectator Guardian", description: "SCENE: A Spectator guarding a chest. \nSOCIAL: It is bored. It might let you look for a joke.", monsters: ["spectator"] },
    { roll: [13, 14], name: "Gravity Flip", description: "SCENE: The lair's magic glitched. \nEFFECT: Gravity reverses. Fall to the ceiling (3d6 dmg).", monsters: [] },
    { roll: [15, 16], name: "Eyes in the Dark", description: "SCENE: Hundreds of tiny eyes open on the walls. \nEFFECT: Disadvantage on Stealth. Xylantropy knows where you are.", monsters: [] },
    { roll: [17, 18], name: "Death Kiss", description: "SCENE: A massive blood-drinking beholder-kin. \nCOMBAT: Grapples and drains blood.", monsters: ["grell"] },
    { roll: [19, 19], name: "Xylantropy's Laugh", description: "SCENE: Deep booming laughter. \nEFFECT: DC 16 Wis save or Frightened.", monsters: [] },
    { roll: [20, 20], name: "The Hoard", description: "SCENE: You find a stash Xylantropy forgot. \nLOOT: Level 15 Spell Scroll and 500gp.", monsters: [] }
];

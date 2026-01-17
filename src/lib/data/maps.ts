
export type MapNode = {
    id: string;
    x: number;
    y: number;
    label: string;
    type: "quest" | "encounter" | "boss" | "loot" | "info" | "entrance" | "trap";
    description?: string;
    itemId?: string; // [NEW] Link to ShopItem.name
    link?: string; // [NEW] URL to navigate to (e.g. /shops?tab=crow)
};

export type CampaignMap = {
    id: string;
    title: string;
    imagePath: string;
    gridType: "hex" | "square" | "none";
    description: string;
    mechanics?: string[]; // Environmental rules
    nodes?: MapNode[];
    category?: "Main Quest" | "Plot Twist";
    questGuide?: string;
    route?: string; // [NEW] If set, clicking this map navigates to this route instead of setting state
};

const OAKHAVEN: CampaignMap = {
    id: "oakhaven",
    title: "Oakhaven's Rest",
    imagePath: "/oakhaven_map_v4_b.png",
    gridType: "hex",
    mechanics: [
        "The Mists: Leaving via the bridge loops you back to the square. The mist tastes of sulfur and old tears.",
        "Spectral Echoes: The town is populated by harmless ghosts replaying their last days. They pass through players like cold drafts.",
        "Stagnation: Time does not pass normally. Long Rests feel like mere blinks, offering no comfort (DC 10 Wis save or gain 1 Exhaustion on wake).",
        "Table Rule: The Mists of Forgetfulness. Players cannot consult their own notes from previous sessions while in town."
    ],
    questGuide: `**OBJECTIVE:** Destroy the Source.
**CONTEXT:** This is the heart of the curse. Drakharaz (the Dracolich) powers the castle, and Larloch pulls the strings.
**SOLUTION:**
1.  **Sever the Cables:** Drakharaz is tethered to the room. Destroying the 4 Necrotic Cables (AC 15, 20 HP) disconnects him from the Castle's shield, making him vulnerable.
2.  **Survive the Pulse:** Every round, the 'Heartbeat' triggers. Time your moves.
3.  **The Choice:** Larloch will not fight unless attacked. He offers a deal: Leave the Castle and he ends the curse on the valley, but keeps the souls he has already taken.`,
    nodes: [
        { id: "q1", x: 25, y: 50, label: "The Echo's Ledger", type: "quest", description: "**QUEST:** 'The Unfinished Business'. The spectral Town Clerk, a weeping ghost in ink-stained robes, frantically searches the **Ruined Archive** (Center-Left). **OBJECTIVE:** Forge a 'Completed Ledger' (DC 15 Forgery) or find the real one hidden in the rubble. **REWARD:** +2 Reputation, *Scroll of Remove Curse*." },
        { id: "q2", x: 75, y: 50, label: "The Coffer's Shadow", type: "quest", description: "**QUEST:** 'Shadows of Greed'. Fimble's **Magic Shop** (Purple Banners, Center-Right) is under siege. A Shadow Demon has possessed his shadow and is stealing gold. **REWARD:** 100gp (Ancient minted), *Bag of Holding*." },
        { id: "market", x: 50, y: 50, label: "The Gilded Coffer", type: "info", description: "**MARKET:** Fimble trades in 'Sentient Capital' in the **Central Square**. The air smells of ozone and old parchment. **TRINKETS:** 'Coin of Bad Luck', 'Memory in a Bottle', 'Ghost-Lantern'.", link: "/shops?tab=fimble" },
        { id: "tavern", x: 25, y: 70, label: "The Drowned Tankard", type: "info", description: "**SAFE HAVEN:** The warm-lit building (Bottom-Left) stands defiant against the mist. Inside, the fire is real. **RUMORS:** 1. 'The Castle's magic acts like a lightning rod.' 2. 'The miners dug too deep and found a drow highway.' 3. 'The Librarian eats the sounds of the dying.'" },
        { id: "thay_embassy", x: 75, y: 70, label: "Red Wizards Enclave", type: "encounter", description: "**ENCOUNTER:** 'The Red Ultimatum'. Zoltus (Red Wizard) has barricaded the **Fortified Embassy** (Bottom-Right). He demands the *Prism of the Void*. **OFFER:** Retrieve it, and he grants a *Thayan Writ of Passage*." },
        { id: "crows_nest", x: 60, y: 5, label: "The Crow's Nest", type: "info", description: "**ZHENTARIM MARKET:** A black market hidden on the cliff edge. 'The Crow' sells illicit goods and poisons. **SERVICES:** Fence stolen goods, buy *Drow Poison*.", link: "/shops?tab=crow" },
        { id: "bridge", x: 50, y: 90, label: "The Looping Bridge", type: "entrance", description: "**THE OUTER MISTS:** A stone bridge crossing a sluggish grey river. **CURSE:** Any attempt to cross it loops the traveler back to the Town Square. The mist is impenetrable and whispers your name." },
        { id: "forge", x: 15, y: 20, label: "The Artisan's Row", type: "encounter", description: "**THE IRON KNOT:** Kaelen Muldar's forge (Top-Left) is cold, covered in grey ash. **HAUNT:** The sound of a ghostly hammer rings eternally. **LOOT:** *Adamantine Ingot* found in the cold coals, still warm to the touch.", link: "/shops?tab=iron" },
        { id: "cliff", x: 85, y: 20, label: "The Cliffside Ascent", type: "encounter", description: "**PATH TO CASTLE:** A steep, winding path (Top-Right) leads to Mournwatch. **ENCOUNTER:** 'The Night Shard'. 3 Assassins (Zhentarim & Cultist alliance) ambush the party from the shadows. They drop a *Dagger of Venom*." },
        { id: "shrine", x: 10, y: 40, label: "Ancient Shrine (Lore)", type: "info", description: "**LORE:** A crumbled statue of Mystra. Reading the inscription (DC 14 Religion) reveals: 'When the Heart stops, the Weave unravels.' You feel a moment of peace here (+1d4 Temp HP)." },
        { id: "outpost", x: 90, y: 35, label: "Abandoned Outpost", type: "encounter", description: "**COMBAT:** An old watchtower. **THREAT:** 4 Ghouls wearing tattered town guard uniforms. They are eating a horse carcass. **LOOT:** *Potion of Vitality* in a saddlebag." },
        { id: "grove", x: 35, y: 10, label: "Whispering Grove", type: "trap", description: "**SKILL CHECK:** The trees lean in. **SURVIVAL DC 13:** The roots try to trip you (Prone). **ARCANA DC 15:** You hear the trees gossiping. They say 'The Library is not on this plane'." }
    ],
    description: `
**Location:** Hub (Starting Point)
**Narrative:**
"The mist clings to Oakhaven like a shroud. This is a town that forgot how to die. Dozens of grey row-houses and cottages crowd the streets, their windows dark and empty like skull sockets. The people are memories, trapped in the loop of their final week, unaware that they are dead. Above it all, the Castle looms, reachable only by the treacherous cliff path."
    `
};

const MAIN_QUEST_MAPS: CampaignMap[] = [
    {
        id: "castle",
        title: "🏰 Castle Exterior: Wild Magic Siege",
        category: "Main Quest",
        imagePath: "/castle_mournwatch_map.png",
        gridType: "hex",
        mechanics: [
            "Wild Magic Surge: Casting a spell of 1st level+ triggers a d20 roll. On a 1, roll on the Wild Magic Table.",
            "Necrotic Wind: Flying creatures take 1d6 necrotic damage at start of turn.",
            "Table Rule: Wild Magic Static. If a player says the word 'Magic' or a spell name out loud without declaring the action first, a Wild Magic Surge triggers."
        ],
        questGuide: `**OBJECTIVE:** Breach the Castle Shield.
**CONTEXT:** General Varth has erected a prismatic barrier around the main keep, powered by three volatile Geodes.
**SOLUTION:** Destroy or Attune to the **3 Magic Geodes**:
1.  **South Geode (Arcane):** A pulsing crystal. Destroying it (AC 15, 30HP) is easy but triggers an explosion. Attuning to it (DC 18 Arcana) disables it safely.
2.  **East Geode (Combat):** Guarded by a Thayan Evoker. He is already attuned. Defeat him to break the link.
3.  **Central Geode (Gravity):** Levitating in zero-g debris. Smash it or calibrate it (INT check) to open the path.
**FINALE:** Once the Geodes are neutralized, the barrier falls and the Gate opens.`,
        nodes: [
            { id: "node1", x: 20, y: 80, label: "South Geode", type: "quest", description: "**MECHANIC:** 'Unstable Geode'. A humming crystal pylon. **OPTION A:** Destroy (AC 15, 30HP) -> 4d6 Force Damage explosion. **OPTION B:** Attune (DC 18 Arcana) -> Disables quietly. **LOOT:** *Scroll of Counterspell* on a scorched wizard.", itemId: "Scroll of Counterspell" },
            { id: "node2", x: 80, y: 80, label: "East Geode", type: "quest", description: "**ENCOUNTER:** 'Thayan Interference'. A Red Wizard Enforcer is channeling the Geode. He counts as 'Attuned'. Defeating him breaks the link. **LOOT:** *Wand of Magic Missiles*.", itemId: "Wand of Magic Missiles" },
            { id: "node3", x: 50, y: 50, label: "Central Geode", type: "quest", description: "**MECHANIC:** 'Gravity Well'. The Geode floats in a debris field. **OPTION A:** Smash it (Range only). **OPTION B:** Attune (Jump check to reach it). **LOOT:** *Boots of Striding and Springing* drifting nearby.", itemId: "Boots of Striding and Springing" },
            { id: "gate", x: 50, y: 20, label: "The Obsidian Gate", type: "boss", description: "**BOSS:** General Varth (Death Knight). He guards the main gate on a Nightmare steed. **TACTIC:** He uses 'Hellfire Orb' and attempts to shove players off the floating island into the abyss." }
        ],
        description: `
**Location:** 1 Day Hike North (Vertical Ascent)
**Adversaries:** Undead Legion vs. Thayan Infiltrators

**Narrative:**
"The castle floats, tethered to the earth by massive chains of shadow that groan in the wind. Wild magic arcs like lightning, turning gravity into a suggestion. You must disable the anchor nodes to lower the barrier, all while General Varth watches from the high walls."
        `
    },
    {
        id: "silent_wards",
        title: "💠 The Silent Wards (Layer 1)",
        category: "Main Quest",
        imagePath: "/silent_wards_map_v5.png",
        gridType: "square",
        route: "/maps/silent-wards", // [NEW] Directs to the custom mechanic page
        mechanics: [
            "Shifting Layout: On Initiative 20, the dungeon reconfigures. Roll 1d4. 1: 90° Clockwise Rotation. 2: 90° Counter-Clockwise. 3: Walls shift 10ft inward (Dex Save DC 15 or 4d10 Bludgeoning). 4: Gravity reverses for 1 round.",
            "Absolute Silence: The entire floor is under a permanent 'Silence' spell. Replaced by a low mechanical thrum. Verbal spells are impossible unless the caster is inside a 'Tiny Hut' or similar shelter.",
            "Table Rule: Rotational Disorientation. When the dungeon shifts (Initiative 20), players must rotate their physical character sheets to match the map's new orientation (90, 180, 270 degrees). Reading stats upside-down is harder."
        ],
        questGuide: `**OBJECTIVE:** Navigate the Shifting Labyrinth.
**CONTEXT:** The dungeon is a living puzzle. The goal is to reach the exit before being crushed or lost.
**SOLUTION:** Map the Shifts.
1.  **Observation:** Pay attention to the shift patterns. They are not entirely random.
2.  **Keystones:** The exit requires 3 Keystones (Ruby, Sapphire, Emerald) found in specific rooms.
3.  **Timing:** Use the 'Silence' mechanic to your advantage for stealth, but be wary of the shifting walls.`,
        nodes: [
            { id: "start", x: 50, y: 50, label: "Central Hub", type: "encounter", description: "**SCENE:** A Zhentarim raiding party (4 Veterans, 1 Mage) is trapped, arguing over a map. **LOOT:** 200gp and a map of Layer 1 (User gets minimap reveal)." },
            { id: "gears", x: 20, y: 20, label: "The Gear Chamber (Top-Left)", type: "encounter", description: "**SCENE:** Giant mithral cogs grind the walls. **MECHANIC:** 'The Conveyor'. DC 16 STR save or be pulled into the crushers (4d10 Bludgeoning). **ENCOUNTER:** 2x Mithral Golems protecting the machinery." },
            { id: "mirrors", x: 80, y: 20, label: "Hall of Mirrors (Top-Right)", type: "trap", description: "**SCENE:** Infinite reflections. **MECHANIC:** 'Shattered Visage'. Smashing a mirror deals 2d6 Psychic damage to the attacker. **ENCOUNTER:** 3x Doppelgangers hiding as 'reflections' of the party members." },
            { id: "garden", x: 80, y: 50, label: "Metal Garden (East Wing)", type: "quest", description: "**SCENE:** Clockwork flowers and steel vines. **LOOT:** *Bag of Tricks (Rust)* - summons mechanical animals. It is currently held by a 'Steel Predator' (Construct) acting as the gardener.", itemId: "Bag of Tricks (Rust)" },
            { id: "furnace", x: 20, y: 80, label: "Furnace Room (Bottom-Left)", type: "quest", description: "**SCENE:** Lava pools illuminate the room with angry red light. **LOOT:** *Potion of Fire Resistance* (x2) and the **Ruby Keystone** resting in the flames." },
            { id: "vault", x: 80, y: 80, label: "Void Vault (Bottom-Right)", type: "quest", description: "**SCENE:** A floating platform over a starry void. **MECHANIC:** Zero Gravity. **LOOT:** *Driftglobe* (Essential for the dark layers below) and the **Emerald Keystone**.", itemId: "Driftglobe" },
            { id: "boss", x: 50, y: 50, label: "The Minotaur's Ghosts", type: "boss", description: "**BOSS:** Goristroi the Lost. A Minotaur spirit bound to the maze. **MECHANIC:** He can phase through walls (Incorporeal Movement). Drops *Horn of Blasting*." },
            { id: "exit", x: 50, y: 15, label: "Stairs to Library", type: "entrance", description: "**LOCKED:** Requires 3 Keystones (Ruby, Sapphire, Emerald) to open the spiral stairs. They decend upward into the ceiling." },
            { id: "hidden_cell", x: 10, y: 50, label: "The Hidden Cell", type: "info", description: "**SECRET:** A small room behind a fake wall. Scratched on the floor: 'Rotation is the key. North becomes East. Wait for the click.' (Hint for Puzzle)." }
        ],
        description: `
**Location:** Castle Mournwatch (First Floor)
**Narrative:**
"The silence is not empty; it is waiting. The walls are made of shifting mithral gears that grind with a sound like breaking bones. Every twenty minutes, the dungeon reconfigures, slamming doors and rotating corridors. You are not guests here; you are foreign objects in a precision engine."
        `
    },
    {
        id: "library",
        title: "The Library of Whispers",
        category: "Main Quest",
        imagePath: "/library_whispers_map.png",
        gridType: "square",
        route: "/maps/library", // [NEW] Dedicated Silence Page
        mechanics: [
            "Silence Required: The library is semi-sentient and hates noise. Casting any spell with a Verbal (V) component triggers an immediate 'Counterspell' (+7 bonus) from the environment itself. Whispering allows normal conversation.",
            "Scholars of the Void: Passive Liches study at the tables. They ignore players unless spoken to loudly or interrupted. Any loud noise (Thunder dmg, shouting) causes them to ALL cast 'Power Word Kill' on the offender.",
            "Escherian Staircases: The map is a single self-contained loop. Ascending a staircase leads the character to descend from the ceiling onto the same floor.",
            "Table Rule: Mandatory Whisper (Intensified). Players must whisper at the table. If anyone speaks at normal volume, their character takes 1d12 Psychic damage from the annoyed librarians."
        ],
        questGuide: `**OBJECTIVE:** Navigate the Infinite Library.
**CONTEXT:** This place is a prison for knowledge. The layout contradicts physics (Escherian stairs).
**SOLUTION:** You need access to the **Portal Gallery** to travel deeper.
1.  **Find the Index:** The 'Infinite Index' node contains the location of the portals.
2.  **Bargain with Rhaugilath:** The Lich in the *Private Study* has the key to the Red Portal (Catacombs). He will trade it for a secret or a service (removing his curse).
3.  **Silence is Key:** Combat here is dangerous because noise attracts the *Scholars of the Void*. Keep it quiet.`,
        nodes: [
            { id: "portals", x: 50, y: 80, label: "The Portal Gallery", type: "info", description: "**HUB:** Three arches float in the void. 1. Blue (Open) -> The Index. 2. Silver (Needs Key) -> Rhaugilath. 3. Red (Locked) -> Catacombs." },
            { id: "rhaugilath", x: 90, y: 90, label: "Rhaugilath's Study (Off-Map)", type: "quest", description: "**NPC:** Rhaugilath the Ageless (Lich). He is tired of Larloch's rule. **QUEST:** 'The Calibration'. **LOOT:** His old arcane focus: *Pearl of Power*.", itemId: "Pearl of Power" },
            { id: "index", x: 10, y: 90, label: "The Infinite Index (Off-Map)", type: "info", description: "**SCENE:** A pocket dimension of flying books. **LOOT:** 'The Codex of Forgotten Wars' (Worth 750gp to Candlekeep, or grants +1 INT)." },
            { id: "tyrant", x: 20, y: 60, label: "The Eye of Decay", type: "boss", description: "**BOSS:** Death Tyrant. It guards 'The Nether Scrolls'. **LOOT:** *Ring of Spell Storing* inside its floating eye-socket.", itemId: "Ring of Spell Storing" },
            { id: "lich", x: 50, y: 50, label: "Head Librarian", type: "boss", description: "**BOSS:** Vez'nan. **MECHANIC:** 'Shush'. He creates Silence auras. Vulnerable to Thunder damage. Drops Key to Red Portal." }
        ],
        description: `
**Location:** Suspended in the Astral Void
**Narrative:** 
"This place disrupts the mind. The Library has no walls, only endless shelves floating in a purple nebula. The scholars here are dead things, liches and wraiths who study in silence. To speak is to invite death."
        `
    },
    {
        id: "catacombs_despair",
        title: "💀 Catacombs of Despair",
        category: "Main Quest",
        imagePath: "/catacombs_despair_map.png",
        gridType: "square",
        mechanics: [
            "Aura of Hopelessness: DC 18 WIS save every hour. Failure: Character gains 1 level of Exhaustion.",
            "Living Darkness: Light sources only shed dim light for 10ft.",
            "True Despair: If a player smiles, laughs, or celebrates at the table, their character takes 1d6 Psychic damage and gains Disadvantage on their next roll. Sorrow is mandatory."
        ],
        nodes: [
            { id: "ent", x: 50, y: 95, label: "The Gates of Grief", type: "entrance", description: "**ENTRANCE:** You fall out of the Red Portal onto cold black marble. The air freezes tears Instantly." },
            { id: "hint_statue", x: 50, y: 85, label: "Statue of the Forgotten", type: "info", description: "**HINT:** A weeping statue points West toward the Cages. Inscription reads: 'Only the heaviest sorrow opens the way.'" },
            { id: "void_nexus", x: 50, y: 75, label: "The Void Nexus", type: "encounter", description: "**GAP:** A massive break in the platform. The void below pulls at you (Str Save DC 16 near edge). Falling here is eternal." },
            { id: "echo_bridge", x: 50, y: 65, label: "Bridge of Echoes", type: "trap", description: "**CROSSING:** A narrow span of bone crossing the Nexus. Whispers of your past failures urge you to jump." },

            { id: "prisoners", x: 15, y: 65, label: "The Cage of Solitude (West)", type: "encounter", description: "**SIDE ISLE:** Soul-cages hang from chains over the void. **BOSS:** 'The Warden of Sighs' (Larva Mage). **MECHANIC:** Interrogating a prisoner yields a 'Tear of Regret' (Key Item)." },
            { id: "shattered", x: 85, y: 65, label: "Shattered Walkway (East)", type: "info", description: "**SIDE ISLE:** Debris floating in stasis. **LOOT:** A 'Netherese Diary' floats here, detailing the fall of the empire and the start of the curse." },
            { id: "vault_door", x: 90, y: 65, label: "The Vault of Despair", type: "loot", description: "**LOCKED:** Hidden on the East Isle. **SOLUTION:** Fill the door's chalice with the 'Tear of Regret'. Inside contains the *Shadowfell Shard*.", itemId: "Shadowfell Shard" },

            { id: "avatar", x: 50, y: 35, label: "The Throne of Loss", type: "boss", description: "**BOSS:** Umbravos (Shadow Dragon). He guards the final gate. **OFFER:** Sacrafice a 'Memory of true happiness' (Perm -1 Wisdom) to pass without fighting. Fight him to keep your soul." },
            { id: "exit", x: 50, y: 10, label: "The Event Horizon Gate", type: "entrance", description: "**PORTAL:** A swirling vortex leading UP to the Heart Chamber. It looks like the eye of a storm." }
        ],
        questGuide: `**OBJECTIVE:** Open the Vault of Despair.
**CONTEXT:** The Vault is not locked by a key, but by an emotion. It requires a specific resonance to open.
**SOLUTION:** The "Ritual of Sorrow":
1.  **Find the Cage:** Locate the *Cage of Solitude* on the Western Isle.
2.  **The Tear:** Defeat or Bargain with the 'Warden of Sighs'. You must obtain a **Tear of Regret** from one of the prisoners (or the Warden himself).
3.  **The Chalice:** Carry the Tear to the *Vault Door* on the East Isle. Pouring it into the chalice unseals the door.
**WARNING:** If the players are too happy (Table Rule), the environment attacks them.`,
        description: `
**Location:** Extraplanar Pocket
**Narrative:**
"The darkness here is living; it presses against your eyes. You are standing on a platform of black marble floating in a starless void. The air is cold enough to crack steel. Hope feels like a childish memory here."
        `
    },
    {
        id: "heart_chamber",
        title: "❤️ The Heart Chamber",
        category: "Main Quest",
        imagePath: "/heart_chamber_map.png",
        route: "/maps/heart-chamber", // [NEW] Dedicated Finale Page
        gridType: "hex",
        mechanics: [
            "Pulse of the Dead: Lair Action. DC 22 CON save or Exhaustion.",
            "Table Rule: The Synchronized Pulse. At top of the round, all players must thump the table in unison twice (Heartbeat). Failure gives the Boss Advantage on all attacks that round."
        ],
        questGuide: `**OBJECTIVE:** Break the Cycle.
**CONTEXT:** Larloch is using the dragon as a battery to fuel his ascension. He ignores you until you threaten his power.
**SOLUTION:**
1.  **Sever the Link:** Drakharaz regenerates 50 HP/round via the necrotic cables. Destroy them (AC 15) to make damage stick.
2.  **The Prism:** If you found the *Prism of the Void* (Netheril Ruins), you can use it to capture Larloch's essence instead of fighting him (DC 22 Arcana Check). This grants the **Good Ending**.
3.  **The Fall:** Defeating Drakharaz causes the castle to fall. Run for the *Secret Hatch* to reach the Ossuary before impact.`,
        nodes: [
            { id: "dracolich", x: 50, y: 40, label: "Drakharaz's Corpse", type: "boss", description: "**BOSS:** Drakharaz (Ancient White Dracolich). The massive skeletal dragon acts as a living battery, attached to the castle by pulsating necrotic cables. **WEAKNESS:** Severing the cables deals 50 damage to him." },
            { id: "larloch", x: 50, y: 20, label: "Larloch's Throne", type: "boss", description: "**SCENE:** Larloch levitates above the central spire, ignoring the battle until provoked. **LOOT:** *Larloch's Spare Robes* (Acts as *Robes of the Archmagi* [Neutral Evil]) found in a chest that defies gravity.", itemId: "Larloch's Spare Robes" },
            { id: "catacomb_ent", x: 50, y: 80, label: "Secret Hatch", type: "entrance", description: "**ESCAPE:** A hidden hatch in the floor. It smells of ozone and ancient dust. Leads down to the 'True Foundation' (The Ossuary)." }
        ],
        description: `
**Location:** Castle Mournwatch (Summit)
**Narrative:**
"The wind at the summit screams. Above you, Larloch weaves reality like a loom. The massive skeletal form of Drakharaz dominates the platform, its eye sockets burning with cold blue fire. The Heart of the Castle beats with a rhythm that stops your own."
        `
    },
    {
        id: "ossuary",
        title: "🦴 The Fathomless Ossuary",
        category: "Main Quest",
        imagePath: "/catacombs_map.png",
        gridType: "square",
        mechanics: [
            "Crushing Despair: DC 15 Wis save/hour or Disadvantage on Attacks.",
            "Calcified Air: The dust of ground bones chokes the lungs. DC 14 Con save after combat or gain 1 level of Exhaustion.",
            "Table Rule: Bone Dust. Players cannot drink water or eat snacks at the table while their characters are here."
        ],
        questGuide: `**OBJECTIVE:** Reach the True Phylactery.
**CONTEXT:** You have fallen into the body of the Titan that connects the castle to the earth.
**SOLUTION:**
1.  **The Mirror Puzzle:** The *Sphere of Annihilation* guarding the phylactery destroys anything it touches.
2.  **The Reflection:** You must go to the *Reflection Pool* and defeat your own shadow. This grants you the ability to interact with the Sphere safely.
3.  **The Sacrifice:** Touching the Sphere requires a DC 20 CON save or instant disintegration, even with the reflection's aid.`,
        nodes: [
            { id: "ent", x: 50, y: 5, label: "The Bone Tunnel", type: "entrance", description: "**ENTRANCE:** You slide down a spiral of fused vertebrae. The walls are made of crushed skulls that whisper as you pass." },
            { id: "river", x: 50, y: 20, label: "River of Marrow", type: "trap", description: "**HAZARD:** A sluggish, yellow river of necrotic bile. Touching it deals 4d10 Acid damage. **BRIDGE:** A ribcage bridge spans the flow but is trap-wired (DC 15 Investigation to spot the pressure pate)." },
            { id: "phylactery", x: 60, y: 40, label: "The True Phylactery", type: "boss", description: "**PUZZLE:** The Soul-Gem floats inside a Sphere of Annihilation. **MECHANIC:** 'Mirror-Match'. The sphere destroys matter, but a 'Reflection' from the nearby pool can reach inside safely." },
            { id: "cathedrals", x: 15, y: 60, label: "Ribcage Cathedrals", type: "encounter", description: "**SCENE:** Arches made of titan ribs form a macabre church. **LOOT:** *Scroll of Resurrection* found in a bone altar, clutched by a skeletal priest." },
            { id: "screams", x: 85, y: 60, label: "Canyon of Screams", type: "encounter", description: "**HAZARD:** The wind howls with the physical force of the dead's voices. **ENCOUNTER:** 3x Banshees rise from the dust to silence the living." },
            { id: "reflection", x: 50, y: 70, label: "The Reflection", type: "encounter", description: "**ROOM:** A floor of polished obsidian. **COMBAT:** Characters must fight their own 'Shadow Self'. **LOOT:** *Shard of the Self* (Advantage on Wisdom Saves) awarded for accepting one's flaws." },
            { id: "piles", x: 50, y: 90, label: "The Corpse Mounds", type: "encounter", description: "**SCENE:** Hills of loose bones shifting like sand dunes. **ENCOUNTER:** A 'Corpse Gatherer' (Giant) sleeping under the debris. Stepping loudly wakes it." }
        ],
        description: `
**Location:** Sub-Layer (Deepest Campaign Point)
**Narrative:**
"This is the foundation of the castle—a literal mountain of bones gathered over millennia to fuel the spells above. The air tastes of calcium and ancient rot. Somewhere in this white desert lies the true soul of the Shadow King."
        `
    }
];

const PLOT_TWIST_MAPS: CampaignMap[] = [
    {
        id: "oakhaven_mines",
        title: "⛏️ Oakhaven Mine (The Complex Labyrinth)",
        category: "Plot Twist",
        imagePath: "/oakhaven_mine_v9.png",
        gridType: "hex",
        route: "/maps/mines", // [NEW] Dedicated Hex-Crawl Page
        mechanics: [
            "The Great Chasm: A single massive void cuts through all 3 layers. The Drow Silk Lift connects them.",
            "Tremor Sense (Global): Moving >15ft/turn in 'Unstable' zones triggers DC 13 Dex save vs Rockfall (2d6 Bludgeoning).",
            "Layered Hazard: Level 2 has Exploding Pyrite (Fire Vuln). Level 3 has Anti-Magic Zones (Beholder proximity).",
            "Table Rule: Claustrophobia. Players must keep their hands on the table at all times. Removing them triggers a 'cave-in' Dex save."
        ],
        questGuide: `**OBJECTIVE:** Repair the Drow Silk Lift.
**CONTEXT:** The lift is the only way down through the Great Chasm, but it is broken and sabotaged.
**SOLUTION:** Three-Part Repair Job:
1.  **The Engine (Level 1):** The gears are jammed. Defeat the Mithral Golems or use the *Golden Gear* (Level 2) to fix it.
2.  **The Tracks (Level 2):** Rusted shut. You need *Refined Oil* from the *Fungal Cave* to lubricate the shaft.
3.  **The Power (Level 3):** The spiders powering the crank are dead/gone. You must re-bind the Giant Spiders in the *Spider Engine Room* or turn the crank manually (Exhaustion checks).`,
        nodes: [
            // Level 1: The Scavenger's Den (Top Strip - Earth/Wood)
            { id: "ent", x: 10, y: 15, label: "The Greedy Maw (Lvl 1)", type: "entrance", description: "**ENTRANCE:** Wooden gates on the far left. The town throws its garbage and 'unwanted' citizens here. **BOSS:** 'The Patchwork Foreman' (Flesh Golem) made of sewn-together miners blocks the path. Drops *Belt of Dwarvenkind*." },
            { id: "shanty", x: 30, y: 20, label: "Candle-Light Shanty", type: "quest", description: "**SAFE ZONE:** Hidden in a side-cave illuminated by tallow candles. 'Old Jorum's' shop. He sells 'Canary Cages' (Detects gas) and 'Mining Picks' (+1 vs Constructs)." },
            { id: "office", x: 15, y: 30, label: "Foreman's Office", type: "loot", description: "**LOOT:** 'The Miner's Savings'. A hollowed-out boot hidden under floorboards containing 250gp in raw nuggets and a *Ring of Warmth* (covered in frost)." },
            { id: "bunk", x: 70, y: 15, label: "Rotting Bunkhouse", type: "trap", description: "**HAZARD:** 'Silent Death'. Poisonous gas fills the room (heavier than air). **ENCOUNTER:** 3x Bodaks risen from suffocated miners. Constitution Save DC 14 or Poisoned." },
            { id: "lift_1", x: 50, y: 25, label: "Lift Station Alpha", type: "encounter", description: "**TRANSIT:** Wooden platform over the central shaft. The Drow Silk Lift arrives here every 1d6 rounds. Taking it alerts the Driders below." },

            // Level 2: The Broken Works (Middle Strip - Iron/Rust)
            { id: "repair", x: 20, y: 50, label: "Repair Bay (Lvl 2)", type: "quest", description: "**NPC:** 'Unit 734' (Damaged Shield Guardian). It is pinned under debris. Repairing it (DC 18 INT) gains a temporary ally for this map." },
            { id: "crusher", x: 50, y: 50, label: "The Crusher Chamber", type: "boss", description: "**BOSS:** Spirit Naga coiling in the massive central pit. It guards 'The Golden Gear', a key required to manual override the elevator." },
            { id: "pyrite", x: 80, y: 45, label: "Pyrite Maze", type: "trap", description: "**TRAP:** Explosive gold dust coats the tunnels. ANY Fire damage triggers 4d6 Fire explosion in 20ft radius." },
            { id: "fungal", x: 10, y: 55, label: "Fungal Cave", type: "loot", description: "**LOOT:** Rare 'Timmask Spores' (Confuses enemies) and 3x *Potions of Greater Healing* grown inside glowing moss pods." },
            { id: "lift_2", x: 50, y: 40, label: "Lift Station Beta", type: "encounter", description: "**TRANSIT:** Rusted iron gantry. **THREAT:** Cloakers disguise themselves as old leather tarps near the ceiling, waiting for prey." },

            // Level 3: The Deep Road (Bottom Strip - Purple Stone)
            { id: "blockade", x: 30, y: 80, label: "Drow Blockade (Lvl 3)", type: "encounter", description: "**COMBAT:** Drider Cavalry holding the depths. They have set up a magical barrier (Dispel Magic DC 15) to stop movement." },
            { id: "crystal", x: 80, y: 85, label: "Crystal Grotto", type: "loot", description: "**LOOT:** *Ioun Stone (Protection)* and a Sleeping Behir (if awakened, CR 11). The crystal formation amplifies magic (+1 spell attacks while standing near)." },
            { id: "sump", x: 15, y: 90, label: "The Sump", type: "loot", description: "**HIDDEN:** *Dagger of Venom* found in the black, oily water. DC 16 Perception to spot the glint." },
            { id: "lift_3", x: 50, y: 75, label: "Lift Foundation", type: "encounter", description: "**MECHANIC:** 'Spider Engine Room'. Giant mutated spiders turn the crank. Setting them free disables the lift for reinforcements." },
            { id: "breach", x: 90, y: 90, label: "The Ancient Breach", type: "quest", description: "**EXIT:** Glowing blue crack in the wall where the Drow broke through. The air gets colder. Leads to Tieg Duran." }
        ],
        description: `
**Location:** Beneath Oakhaven
**Narrative:**
"The sheer scale of the drop hits you first. A single, bottomless chasm pierces the earth, connecting the starving upper shanties, the rusted middle works, and the deep Drow blockade. You must traverse the complex maze of tunnels to find the Silk Lift and descend."
        `
    },

    {
        id: "dwarven_ruins",
        title: "🏚️ The Lost Ruins of Tieg Duran",
        category: "Plot Twist",
        imagePath: "/tieg_duran_v2.png",
        gridType: "square",
        mechanics: [
            "The Military Road: The main path is magically smoothed. Stepping off it requires Dex Save DC 14 or fall Prone in rubble.",
            "Drow Patrols: Every 10 minutes, roll d6. On 1, a patrol (Elite Warrior + 2 Giant Spiders) descends from the ceiling.",
            "Web-Choked Silence: Sound does not travel well. Perception checks related to hearing are at Disadvantage.",
            "Table Rule: Tactical Silence. Communication is limited to 3 words per sentence OOC."
        ],
        questGuide: `**OBJECTIVE:** Bypass the Drow Blockade.
**CONTEXT:** The Drow have fortified the ancient dwarven highway. A magical *Force Wall* blocks the exit.
**SOLUTION:** Infiltration or War.
1.  **The Key:** The *Force Wall* is keyed to House Baenre blood or insignia.
2.  **Option A (Stealth):** Steal the *Insignia of House Baenre* from Yaz'mina's Forward Command tent. Use the 'Silent Market' distractions.
3.  **Option B (Combat):** Kill Yaz'mina. Her death dispels the wall, but alerts the entire camp.`,
        nodes: [
            { id: "gate", x: 50, y: 95, label: "The Breached Gate", type: "entrance", description: "**ENTRANCE:** From Oakhaven Mines. The massive adamantine doors are blown INWARD by a force greater than any siege engine. Drow House Baenre banners hang from the arch." },
            { id: "road", x: 50, y: 70, label: "The Convoy Route", type: "encounter", description: "**SCENE:** A highway of impossible smoothness. **ENCOUNTER:** A Drow Supply Barge moving prisoners. Liberating them grants 'Rebel Intel'. **LOOT:** 3x *Potions of Invisibility* and Crate of Drow Poison." },
            { id: "market", x: 20, y: 60, label: "Silent Market (Ruins)", type: "trap", description: "**SCENE:** The stalls are draped in thick, white silk. It looks like snow, but it sticks. **LOOT:** 'Gemcutter's Satchel' (500gp gems) + 4 Bolts of *Drow Spider Silk* (worth 200gp each)." },
            { id: "bridge", x: 50, y: 50, label: "The Spire-Bridge", type: "encounter", description: "**SCENE:** A razor-thin arch over the void. **THREAT:** Drow Snipers (Crossbow experts) hiding on the underside of the bridge. Cover is essential." },
            { id: "temple", x: 80, y: 60, label: "Temple of the Broken Anvil", type: "quest", description: "**QUEST:** 'The Ancestral Call'. The statue of Moradin is beheaded. Placing a specific gemstone (Found in Market) in the socket reveals a hidden compartment. **LOOT:** *Hammer of the Ancestors* (+2 Warhammer, Throws and returns).", itemId: "Hammer of the Ancestors" },
            { id: "command", x: 50, y: 15, label: "Baenre's Forward Command", type: "boss", description: "**BOSS:** High Priestess Yaz'mina Baenre. She coordinates the invasion from a repurposed Dwarven Throne. **LOOT:** *Rod of the Pact Keeper +2*, *Insignia of House Baenre* (Safe passage through Drow lines).", itemId: "Rod of the Pact Keeper +2" },
            { id: "exit", x: 50, y: 5, label: "The Deep Road", type: "entrance", description: "**EXIT:** The military highway continues down into the true Underdark. Leads to the 'Underdark Travel' Map." }
        ],
        description: `
**Location:** Buried City (The Drow Road)
**Narrative:**
"Tieg Duran has been repurposed. The main thoroughfare is clean, lit by violet faerie fire, and busy with the march of House Baenre's army. But step off the road, and you find only darkness, webs, and the things that feed in the quiet. This is an occupation."
        `
    },
    {
        id: "underdark",
        title: "The Underdark Travel",
        category: "Plot Twist",
        imagePath: "/underdark_map_v2.png",
        gridType: "hex",
        mechanics: [
            "Webs: Difficult Terrain (Half Speed).",
            "Madness: Long Rest without shelter triggers Wisdom Save DC 12 or Short/Long Term Madness.",
            "Table Rule: Sensory Deprivation. When it is not your turn, you must close your eyes. You rely only on what the DM tells you."
        ],
        questGuide: `**OBJECTIVE:** Survive the Long Travel.
**CONTEXT:** A hex-crawl through the hostile Underdark. Resources are scarce, and madness is real.
**SOLUTION:** Travel 4 Days South.
1.  **Resource Management:** You consume 1 Ration/Water per hex. Failure = Exhaustion.
2.  **Navigation:** Survival Check DC 15 per day. Failure = Random Encounter or getting lost (Return to previous hex).
3.  **The Pursuit:** Every day, roll a d6. On a 1, a Drow Hunting Party catches up.`,
        nodes: [
            { id: "start", x: 10, y: 10, label: "Road from Tieg Duran", type: "info", description: "**INFO:** You leave the ruins. The air gets warmer and humid, smelling of bioluminescent mold." },
            { id: "colony", x: 20, y: 60, label: "Mind Flayer Colony", type: "entrance", description: "**DANGER:** Psionic static detected. High risk, high reward. A massive nautiloid ship is crashed here. Leads to 'The Synaptic Deep'." },
            { id: "beholder", x: 80, y: 40, label: "Beholder's Lair", type: "entrance", description: "**DANGER:** Vertical shaft with anti-magic readings. The walls are smooth, melted by disintegration beams. Leads to 'The Eye's Domain'." },
            { id: "merchant", x: 50, y: 50, label: "The Wandering Emporium", type: "quest", description: "**ENCOUNTER:** Xorn-Trader 'Gravel-Mouth'. He sets up camp in a giant geode. **SERVICES:** Sells 'Surface Air' (bottled, removes Exhaustion) and *Rope of Climbing* for gemstones." },
            { id: "arach", x: 50, y: 80, label: "Arach-Tinilith", type: "boss", description: "**DESTINATION:** The Drow City. The Soul-Gem is here. Towers of spun iron pierce the ceiling." }
        ],
        description: `
**Location:** Below Oakhaven Mines
**Narrative:** "The darkness is absolute. The silence is a lie. Thousands of red eyes watch you from the ceiling. You are traveling through the veins of the world, and there are antibodies everywhere."
        `
    },
    {
        id: "mind_flayer",
        title: "🧠 The Synaptic Deep (Level 15)",
        category: "Plot Twist",
        imagePath: "/mind_flayer_map.png",
        gridType: "hex",
        mechanics: [
            "Psionic Static: -1d4 to all saving throws.",
            "Hive Mind: If one enemy sees you, all within 100ft know your location immediately.",
            "Table Rule: The Collective. Players are forbidden from using words 'I', 'Me', or 'My'. Must use 'We'. Failure triggers 1d4 Psychic dmg to character."
        ],
        questGuide: `**OBJECTIVE:** Disable the Hive Mind.
**CONTEXT:** The Elder Brain coordinates the monster attacks in the region. Killing it disrupts enemy communication.
**SOLUTION:**
1.  **The Shield:** The Brain is shielded by Psionic amplifiers in the *Thrall Processing* room. Destroying the vats weakens the shield.
2.  **Psychic Stealth:** Using telepathy or the *Ring of Mind Shielding* allows you to bypass the thralls.
3.  **The Decoy:** Releasing the Neothelid from the nursery causes a massive distraction, drawing defenders away from the Brain.`,
        nodes: [
            { id: "thrall", x: 60, y: 70, label: "Thrall Processing", type: "encounter", description: "**SCENE:** Grimlocks grinding bones to paste in vat-pools. **LOOT:** 3x *Mind Flayer Skulls* (Valuable to Alchemists, 500gp each)." },
            { id: "breeding", x: 40, y: 50, label: "Tadpole Nursery", type: "encounter", description: "**MECHANIC:** 'Infestation'. Pools of brine teeming with tadpoles. **THREAT:** Neothelid (Young). It guards the future of the colony. Drops *Rod of the Tentacle* (+1 Mace, grapple on hit)." },
            { id: "elder", x: 20, y: 30, label: "The Elder Brain", type: "boss", description: "**BOSS:** Elder Brain. It floats in a central brine pool. **MECHANIC:** 'Mind Blast Wave'. **LOOT:** *Ring of Mind Shielding* found on a floating skeleton. The ring is alive and whispers warnings." },
            { id: "vault", x: 30, y: 20, label: "Psionic Vault", type: "loot", description: "**LOOT:** Alien technology locked in bio-organic pods. *Helm of Telepathy* and a crystalline roadmap of the Drow invasion plans." }
        ],
        description: `
**Location:** 4 Days West (Underdark Route)
**Narrative:**
"The rock turns soft and spongey. The air vibrates with a low thrum that makes your teeth ache. You are walking into the mind of a god, and it knows you are here."
        `
    },
    {
        id: "beholder",
        title: "👁️ The Eye's Domain (Hard Mode)",
        category: "Plot Twist",
        imagePath: "/beholder_map.png",
        gridType: "none",
        mechanics: [
            "Anti-Magic Zones: Random 20ft spheres disable flight/spells.",
            "Vertical Combat: Flight is essential. Falling damage is maxed.",
            "Table Rule: The Gaze. Players must maintain eye contact with the DM when declaring an action. Looking away imposes Disadvantage."
        ],
        questGuide: `**OBJECTIVE:** Claim the Eye's Hoard.
**CONTEXT:** Xylantropy, the Void-Eye, has gathered items of immense power. He hovers in a vertical shaft.
**SOLUTION:** Verticality is the mechanic.
1.  **Flight/Climb:** The floor is lava/spikes. You MUST have a fly speed or reliable climbing gear.
2.  **Anti-Magic:** The central cone suppresses magic. Melee fighters must engage him while casters hide behind floating statues.
3.  **The Mirror Trick:** Xylantropy is vain. Showing him his own reflection (using a polished shield) acts as a *Fear* spell.`,
        nodes: [
            { id: "ambush", x: 50, y: 80, label: "The Killing Field", type: "encounter", description: "**EVENT:** 'The Gaze'. Statues of previous adventurers block the path. Some still look terrified. **ENCOUNTER:** 2x Gauths patrolling the statues." },
            { id: "prison", x: 20, y: 60, label: "Petrified Prison", type: "quest", description: "**QUEST:** A Petrified Red Wizard holds a clue in his stone hand. `Greater Restoration` frees him. **REWARD:** *Scroll of Disintegrate*." },
            { id: "boss", x: 50, y: 40, label: "Xylantropy's Throne", type: "boss", description: "**BOSS:** Xylantropy (Beholder). He floats in the center of a magnetic storm, using telekinesis to throw debris." },
            { id: "hoard", x: 50, y: 10, label: "The Eye's Hoard", type: "loot", description: "**LOOT:** 15,000gp. *Robe of Eyes*, *Wand of Fear*, and *Shield of Missile Attraction* (Cursed: Attracts ranged attacks). The hoard is trapped with Glyph of Warding." }
        ],
        description: `
**Location:** 5 Days East (Underdark Chasm)
**Narrative:**
"Xylantropy has anticipated this moment for a hundred years. The cavern is a vertical silo of magnetic rock. Every step is potential death by gravity or disintegration."
        `
    },
    {
        id: "spire",
        title: "🌪️ The Spire of Screaming Gales",
        category: "Plot Twist",
        route: "/maps/spire",
        imagePath: "/spire_map.png",
        gridType: "hex",
        mechanics: [
            "High Altitude: Creatures without fly speed must save vs Exhaustion per hour.",
            "Wind Tunnel: Ranged attacks have Disadvantage. Flying speed is doubled tailwind, halved headwind.",
            "Table Rule: The Shout. Players must shout to be heard over the wind. Whispering is impossible."
        ],
        questGuide: `**OBJECTIVE:** Summit the Spire.
**CONTEXT:** Aerisi Kalinoth is conducting a ritual at the peak to summon Yan-C-Bin.
**SOLUTION:** The Three Gales.
1.  **The Base:** Navigate the whiteout clouds using Survival checks.
2.  **The Ascent:** Defeat the Aarakocra guards on the hanging platforms.
3.  **The Eye:** The boss fight takes place in worst-case weather conditions.`,
        nodes: [
            { id: "1", x: 50, y: 90, label: "Base of the Spire", type: "info", description: "The wind howls like a dying god. Visibility is 30ft due to clouds." },
            { id: "2", x: 30, y: 70, label: "The Gale-Gate", type: "encounter", description: "Encounter: 2 Air Elementals + 4 Aarakocra Skirmishers. Lair Action: Gust (DC 15 Str save or pushed 20ft)." },
            { id: "3", x: 70, y: 50, label: "The Whispering Terrace", type: "quest", description: "Puzzle: Align the wind chimes to the Song of Aerdrie Faenya to reveal the stairs." },
            { id: "4", x: 50, y: 30, label: "Eye of the Storm", type: "boss", description: "BOSS: Aerisi (Air Prophet) mounted on an Invisible Stalker. Loot: 'Fan of Gales'." },
            { id: "5", x: 50, y: 15, label: "The Apex", type: "loot", description: "Treasure: Scroll of Control Weather & Elemental Gem (Blue)." }
        ],
        description: `
**Location:** The Highest Peak
**Narrative:**
"The Spire pierces the clouds, a needle of rock screaming in the wind. This is the domain of elemental air, where gravity is a suggestion and the fall is eternal."
        `
    },
    {
        id: "netheril",
        title: "⚡ The Netheril Ruins",
        category: "Plot Twist",
        route: "/maps/netheril", // Dedicated page
        imagePath: "/netheril_map.png",
        gridType: "square",
        mechanics: [
            "Void Gravity: Jump distance is tripled.",
            "Necrotic Humming: 1d4 necrotic damage/turn to living creatures.",
            "Table Rule: Arcane Decay. If a player forgets a rule or asks 'what do I roll?', the spell fails."
        ],
        questGuide: `**OBJECTIVE:** Survive the Void Trial.
**CONTEXT:** A remnant of ancient Netheril, suspended in zero-g. The magic here is wild and hungry.
**SOLUTION:** The Password.
1.  **The Specters:** The guards demand a password ("Karsus"). It can be found in the *Netherese Diary* (Catacombs) or guessed with DC 25 History.
2.  **The Gate:** Opening the gate without the password triggers the *Ignis-Void* boss fight immediately.
3.  **The Prize:** The *Prism of the Void* is here, essential for the good ending of the campaign.`,
        nodes: [
            { id: "gate", x: 50, y: 85, label: "The Shattered Gate", type: "encounter", description: "**SCENE:** Ancient obsidian rubble floating in zero-g. **ENCOUNTER:** Guarded by 2 Netherese Specters who demand a password in High Draconic." },
            { id: "mirror", x: 50, y: 60, label: "Hall of Mirrors", type: "trap", description: "**MECHANIC:** 'Simulacrum Breach'. Reflections step out and attack. They have 1/2 HP of players but deal full damage." },
            { id: "altar", x: 50, y: 25, label: "The Void Altar", type: "boss", description: "**BOSS:** Ignis-Void (Balor) bound to the altar by cold chains. He cannot leave the room but rains fire and void-bolts." },
            { id: "loot", x: 50, y: 5, label: "The Treasury", type: "loot", description: "**LOOT:** *Prism of the Void* (Quest Item), *Ioun Stone of Sustenance* (No food/water needed). The treasury has no air.", itemId: "Prism of the Void" }
        ],
        description: `
**Location:** 2 Days East
**Narrative:**
"This is a graveyard of empire. Giant chunks of obsidian float in a purple void. The magic here is stale, dead, and incredibly dangerous. It hums with a hunger that makes your skin crawl."
        `
    },
    {
        id: "arach",
        title: "🕸️ Arach-Tinilith: The Cathedral of Webs",
        category: "Plot Twist",
        imagePath: "/arach_tinilith_map.png",
        gridType: "square",
        mechanics: [
            "Web-Sense: Touching webs reveals location to Quenthel.",
            "Lolth's Gaze: Disadvantage on Wisdom Saves while in the Cathedral.",
            "Table Rule: Web of Lies. Players are encouraged to pass secret notes. If a note is intercepted by the DM, the contents become true for the enemy."
        ],
        questGuide: `**OBJECTIVE:** Stop the Summoning Ritual.
**CONTEXT:** Quenthel Baenre is summoning a Lolth Avatar. If she finishes (5 Rounds), the campaign ends in failure/TPK.
**SOLUTION:** Disrupt the Chant.
1.  **Direct Damage:** Dealing 50+ damage to Quenthel in a single round forces a CON save to maintain concentration.
2.  **Silence:** Casting *Silence* on the altar stops the ritual instantly, but draws aggro from EVERY drow in the city.
3.  **The Slaves:** Releasing the slaves causes a riot, occupying the guards so you can focus on the boss.`,
        nodes: [
            { id: "bridge", x: 50, y: 90, label: "The Silken Bridge", type: "encounter", description: "**ENTRY:** A narrow bridge over the Demonweb Pits. Heat rises from below. **THREAT:** Yochlol Handmaidens try to pull players off." },
            { id: "slaves", x: 20, y: 60, label: "The Slave Pens", type: "quest", description: "**OPTIONAL:** Rescue Coalition members destined for sacrifice. They can fight as minions (AC 12, 10 HP)." },
            { id: "barracks", x: 80, y: 60, label: "The War-Halls", type: "encounter", description: "**OBSTACLE:** Elite Guard (Drow champions). They wield *Drow Poison* weapons and have the 'Parry' reaction." },
            { id: "ritual", x: 50, y: 30, label: "The Ritual Chamber", type: "boss", description: "**FINAL BATTLE:** Quenthel Baenre. She is completing the ritual to summon a fragment of Lolth. **TIME LIMIT:** 5 Rounds to stop the chant." },
            { id: "loot", x: 50, y: 10, label: "Lolth's Treasury", type: "loot", description: "**REWARD:** *Piwafwi* (Cloak of Elvenkind), *Rod of the Pact Keeper +3*, and the Soul-Gem. The room is webbed shut (DC 20 Strength)." }
        ],
        description: `
**Location:** 2 Days travel below the Beholder's Lair.
**The Adventure:**
**Act 1: The Descent**. You enter the Drow city, a marvel of bioluminescence and cruelty. 
**Act 2: The Cathedral**. Arach-Tinilith stands in the center, a building made of spun iron and spider silk. 
**Act 3: The Goddess**. If you fail, Lolth herself may glance this way.
        `
    }
];

export const CAMPAIGN_MAPS: CampaignMap[] = [OAKHAVEN, ...MAIN_QUEST_MAPS, ...PLOT_TWIST_MAPS];

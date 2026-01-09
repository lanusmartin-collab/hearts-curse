export type LoreSection = {
    id: string;
    title: string;
    content: string; // Markdown supported
};

export const CAMPAIGN_LORE: LoreSection[] = [
    {
        id: "prologue",
        title: "I. The Prologue: The Final Stand",
        content: `The campaign begins with a "cold open" cinematic battle. The players are currently 20th level, fighting atop the spires of Castle Mournwatch.
    
**The Scene**: Larloch the Shadow King is successfully siphoning souls from the town below to animate a colossal Ancient White Dracolich.

**The Turning Point**: As the Dracolich prepares to unleash a necrotic frost breath that will wipe the party, their ally—a Genie Warlock (Noble Dhjinn)—realizes victory is impossible.

**The Wish**: The Genie uses its Limited Wish to state: "I wish for a new opportunity to defeat Larloch!"

**The Transition**: The world blurs into a kaleidoscope of sand and shadow. The players wake up at level 10, standing in the heart of Blackstaff Tower in Waterdeep, three weeks before the disaster occurs.`
    },
    {
        id: "khelben",
        title: "The Patron: Khelben Blackstaff",
        content: `Khelben "Blackstaff" Arunsun helps the confused party. Having sensed the temporal ripple, he realizes they are the only hope. He gives them Very Rare magical equipment and a Bag of Holding for their journey.

**Appearance**: A tall, severe man in star-spangled black robes, wielding the Blackstaff.

**Intentions**:
- Pragmatic Survival: He will use any means to save Waterdeep.
- Maintaining Balance: Larloch's ambition is a catastrophic imbalance.
- Secrecy: No one else must know of the time manipulation.

**Hints**:
1. **The Curse is a Battery**: Larloch uses an ancient Netherese soul-binding ritual.
2. **The Drow Complication**: "Be wary of shadows that move with purpose."
3. **The Safe Haven**: "The old ale house in Oakhaven's Rest holds a secret... Candlekeep."
4. **Larloch's Weakness**: Find the flaw in his Netherese equation.`
    },
    {
        id: "town",
        title: "Oakhaven's Rest: A Town of Echoes",
        content: `As you approach Oakhaven’s Rest, the vibrant colors of the Sword Coast fade, replaced by a monochrome landscape trapped in a perpetual, unnatural twilight.

**Atmosphere**: Heavy, damp air smelling of wet pennies. Buildings draped in pulsing grey moss. Inhabitants are "Echoes"—pale figures that dissipate into shadows at night.

**The Curse**: A pervasive feeling of stasis. You cannot leave (looping bridge). The town feeds on vitality.`
    },
    {
        id: "npcs",
        title: "Relevant People: The Cursed Souls",
        content: `**Elias Thornefield (Barkeep)**: Neutral Good. Gaunt, grey skin. Wants the curse lifted. Guardian of the Safe Haven (The Sunken Crypt).
- **Services**: "Gray-Ale" (reveals glyphs), Information (trades for Light).

**Master Teller Fimble Futterly (The Gilded Coffer)**: Neutral Evil. Spectral gnome obsessed with "Sentient Capital".
- **Services**: Buys memories/stats for powerful items.

**Kaelen Muldar (The Iron Knot)**: Lawful Neutral. Hulking blacksmith frozen mid-swing.
- **Services**: "Ghost-Touch" refining, Item Restoration (requires "Sacrifice of Effort").

**Korgul "The Vulture" Goresh**: Neutral Evil. Human mercenary/fence. Zhentarim agent.
- **Services**: Basic supplies at 300% markup, salvaged magic items.`
    },
    {
        id: "dungeon",
        title: "The Main Dungeon: Castle Mournwatch",
        content: `A gothic fortress floating slightly above a jagged cliffside.

**Layer 1: The Silent Wards** (Lvl 10-13): Shifting mithral walls. Enemies: Hollow Guard.
**Layer 2: The Library of Whispers** (Lvl 14-17): Vertical library of trapped souls. Enemies: Netherese Liches, Vez'nan.
**Layer 3: The Heart-Chamber** (Lvl 18-20): The Dracolich and Soul-Gem.`
    },
    {
        id: "spider_gambit",
        title: "The Spider's Gambit (Alternate Ending)",
        content: `**The Twist**: During the chaotic battle for the Heart Chamber, as the Dracolich falls or distraction reigns, Quenthel Baenre strikes. Using a *Scroll of Time Stop*, she steps through the frozen battlefield, snatches the pulsing Soul-Gem from the Dracolich's chest, and vanishes via *Word of Recall*.

**The Stakes**: This is not a simple theft. Quenthel intends to use the gem's amassed soul energy—thousands of lives from Oakhaven—to perform the "Ritual of the Black Sun". If successful, she will summon a "Dark Avatar of Lolth" directly into the material plane. This avatar would not only consume Waterdeep but merge the Demonweb Pits with the Sword Coast, creating an eternal kingdom of drow supremacy.

**The Chase**: The players must realize the threat immediately. The trail leads deep into the Underdark, past the Mind Flayer colonies and Beholder lairs, to Arach-Tinilith. They are on a clock: every hour wasted allows Quenthel to break another seal on the gem. The final confrontation takes place in the Cathedral of Webs, where Quenthel is protected by "Demon Anchors"—summoning runes fueled by high-level sacrifices.`
    }
];

export type Faction = {
    id: string;
    name: string;
    description: string;
    members: string[];
    alignment: string;
    goals: string[];
};

export const FACTIONS: Faction[] = [
    {
        id: "shadow_court",
        name: "Larloch's Court (The Eternal Eclipse)",
        description: "The primary antagonists. A legion of undead and corrupted mages seeking to harvest soul energy to fuel Larloch's ascension.",
        alignment: "Neutral Evil",
        members: ["Larloch the Shadow King (Lich)", "Vez'nan the Deceiver (Archmage)", "The Hollow Guard (Death Knights)", "Ancient White Dracolich (Construct)"],
        goals: ["Consume Waterdeep's souls", "Break the weave of time", "Maintain the Curse on Oakhaven"]
    },
    {
        id: "drow",
        name: "House Baenre (Rulers of Menzoberranzan)",
        description: "The First House of Menzoberranzan has taken personal interest in the Netherese magic permeating Oakhaven. Led by Matron Mother Quenthel Baenre herself, they seek to claim the ancient power for Lolth.",
        alignment: "Chaotic Evil",
        members: ["Matron Mother Quenthel Baenre (Leader)", "Jarlaxle Baenre (Reluctant Ally)", "Drider Royal Guards", "High Priestesses of Lolth"],
        goals: ["Seize the Netherese Soul-Gem", "Eliminate Larloch as a rival to Lolth", "Subjugate the surface dwellers"]
    },
    {
        id: "zhentarim",
        name: "The Black Network (Zhentarim)",
        description: "A criminal syndicate controlling the black market within Oakhaven's Rest. They provide goods at extortionate prices and control information.",
        alignment: "Lawful Evil",
        members: ["Korgul 'The Vulture' Goresh", "Pereghost (rumored)", "Zhent Thugs", "Darkhold Assassins"],
        goals: ["Monopolize trade in the cursed zone", "Acquire power for the Black Network", "Survive"]
    },
    {
        id: "coalition",
        name: "The Heroes' Coalition (Light's Last Stand)",
        description: "The unified front of players and their allies attempting to break the time loop and save the city.",
        alignment: "Chaotic Good",
        members: ["The Party", "Khelben 'Blackstaff' Arunsun", "Elias Thornefield", "Noble Dhjinn (The Time Weaver)"],
        goals: ["Defeat Larloch", "Break the Time Loop", "Save Waterdeep"]
    },
    {
        id: "thay",
        name: "The Wizards of Thay (Szass Tam's Envoys)",
        description: "Red Wizards sent by Szass Tam to investigate the necrotic anomaly. They view Larloch as a rival to be studied or destroyed. They are dangerous 'allies' who will turn on the party the moment they have what they need.",
        alignment: "Lawful Evil",
        members: ["Zoltus the Red (Thayan Archmage)", "Bonecloak Necromancers", "Undead Servitors", "Thayan Knights"],
        goals: ["Steal Larloch's research on the Dracolich", "Capture the 'Prism of the Void' for Szass Tam", "Eliminate any witnesses"]
    }
];

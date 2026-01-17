"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import PremiumGate from "@/components/auth/PremiumGate";
import StatblockCard from "@/components/ui/StatblockCard";
import { Skull, X, Zap, Shield, Music } from "lucide-react";
import { Statblock } from "@/lib/data/statblocks";

// Embedded Boss Data to ensure no import issues for the finale
const BOSS_DATA: Record<string, Statblock> = {
    "drakharaz": {
        name: "Drakharaz the Eternal",
        size: "Gargantuan",
        type: "Undead (Dragon)",
        alignment: "Chaotic Evil",
        ac: 22,
        armorType: "Natural Armor",
        hp: 750,
        hitDice: "25d20+250",
        speed: "40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.",
        stats: { str: 30, dex: 13, con: 30, int: 13, wis: 17, cha: 18 },
        saves: "Dex +8, Con +17, Wis +10, Cha +11",
        skills: "Perception +18, Stealth +8",
        immunities: "Cold, Necrotic, Poison",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Paralyzed, Petrified, Poisoned",
        senses: "Blindsight 60 ft., Darkvision 120 ft.",
        languages: "Common, Draconic",
        cr: "25",
        xp: 75000,
        traits: [
            { name: "Legendary Resistance (3/Day)", desc: "If the dracolich fails a saving throw, it can choose to succeed instead." },
            { name: "Magic Resistance", desc: "Advantage on saving throws against spells and other magical effects." },
            { name: "Heart of the Curse", desc: "Drakharaz is bound to the Heart's Curse. The Cursed Heart (if present) is a vulnerable point. If the Heart is destroyed, Drakharaz loses his Magic Resistance." }
        ],
        actions: [
            { name: "Multiattack", desc: "The dracolich can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws." },
            { name: "Bite", desc: "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 9 (2d8) cold damage." },
            { name: "Claw", desc: "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage." },
            { name: "Necrotic Frost Breath (Recharge 5–6)", desc: "90-foot cone. Each creature must make a DC 25 Con save, taking 52 (8d12) cold and 52 (8d12) necrotic damage on a failed save, or half on success." }
        ],
        legendary: [
            { name: "Wing Attack (Costs 2 Actions)", desc: "The dracolich beats its wings. Each creature within 15 ft. must succeed on a DC 25 Dex save or take 17 (2d6 + 10) bludgeoning and be prone." },
            { name: "Cast Spell (Costs 2 Actions)", desc: "Drakharaz casts a spell of 6th level or lower." }
        ]
    },
    "larloch": {
        name: "Larloch the Shadow King",
        size: "Medium",
        type: "Undead (Lich)",
        alignment: "Lawful Evil",
        ac: 22,
        armorType: "Magical Protection",
        hp: 300,
        hitDice: "30d8",
        speed: "30 ft., fly 60 ft. (hover)",
        stats: { str: 10, dex: 16, con: 22, int: 30, wis: 24, cha: 20 },
        saves: "Con +13, Int +17, Wis +14",
        skills: "Arcana +24, History +24, Insight +14, Perception +14",
        immunities: "Necrotic, Poison; Bludgeoning, Piercing, and Slashing from Nonmagical Attacks",
        conditionImmunities: "Charmed, Exhaustion, Frightened, Paralyzed, Poisoned",
        senses: "Truesight 120 ft.",
        languages: "Common, Netherese, Draconic, Elvish",
        cr: "30",
        xp: 155000,
        traits: [
            { name: "Legendary Resistance (5/Day)", desc: "Succeeds on failed save." },
            { name: "Master of Magic", desc: "Larloch can concentrate on two spells at once. He has advantage on saves against spells." },
            { name: "Spellcasting", desc: "Larloch is a 20th-level spellcaster. Spell save DC 25, +17 to hit. All Wizard spells prepared." }
        ],
        actions: [
            { name: "Paralyzing Touch", desc: "Melee Spell Attack: +17 to hit, reach 5 ft. Hit: 3d6 cold damage. DC 20 Con save or be paralyzed for 1 minute." },
            { name: "Finger of Death (At Will)", desc: "Casts Finger of Death. If target dies, it rises as a Zombie under his control." }
        ],
        legendary: [
            { name: "Cast Spell", desc: "Casts a spell of 5th level or lower." },
            { name: "Frightful Gaze", desc: "One creature within 60 ft must succeed DC 20 Wis save or be Frightened." }
        ]
    }
};

const CHAMBER_NODES: MapNode[] = [
    { id: "1", x: 50, y: 50, label: "The Dracolich Heart", type: "boss", description: "BOSS: Drakharaz the Eternal. The heart beats with necrotic energy. Every beat pulses damage to non-undead." },
    { id: "2", x: 20, y: 20, label: "West Pylon (Active)", type: "encounter", description: "Shield Pylon. Must be destroyed to lower Larloch's AC. Guarded by 2 Death Tyrants." },
    { id: "3", x: 80, y: 20, label: "East Pylon (Active)", type: "encounter", description: "Shield Pylon. Guarded by 2 Liches." },
    { id: "4", x: 50, y: 90, label: "Void Edge", type: "info", description: "Falling here leads to the Negative Energy Plane (Instant Death)." },
    { id: "5", x: 50, y: 80, label: "Entrance to Catacombs", type: "quest", description: "Hidden hatch revealed only when Drakharaz is defeated. Leads to the True Phylactery." }
];

const CATACOMB_NODES: MapNode[] = [
    { id: "c1", x: 10, y: 10, label: "The Bone Tunnel", type: "info", description: "Walls made of crushed skulls. Claustrophobic." },
    { id: "c2", x: 50, y: 50, label: "The Reflection", type: "encounter", description: "A mirror room where PCs fight their own shadows (Shadow Assassin stats)." },
    { id: "c3", x: 90, y: 90, label: "The True Phylactery", type: "boss", description: "FINAL BOSS: Larloch's Human Form. He wields the Ioun Stones as weapons." }
];


const TOMB_NODES: MapNode[] = [
    { id: "t1", x: 50, y: 80, label: "The Sealed Gate", type: "info", description: "A massive adamantine door sealed with 9th level magic. Requires the Key of the Warden." },
    { id: "t2", x: 50, y: 50, label: "Sarcophagus of the First", type: "boss", description: "BOSS: The First Warden (Death Knight). Immune to Turn Undead." },
    { id: "t3", x: 20, y: 20, label: "Left Reliquary", type: "loot", description: "Loot: Shield of the Hidden Lord." },
    { id: "t4", x: 80, y: 20, label: "Right Reliquary", type: "loot", description: "Loot: SunBlade of Aumvor." }
];

export default function HeartChamberPage() {
    const [view, setView] = useState<"chamber" | "catacombs" | "tomb">("chamber");
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [finaleMusicPlaying, setFinaleMusicPlaying] = useState(false);

    const toggleMusic = () => {
        // Placeholder for music logic
        setFinaleMusicPlaying(!finaleMusicPlaying);
    };

    return (
        <PremiumGate feature="The Heart Chamber">
            <div className="retro-container h-screen flex flex-col">
                <div className="no-print mb-4 shrink-0">
                    <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
                </div>

                <header className="mb-4 border-b border-red-800 pb-4 shrink-0 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl text-red-500 text-shadow-neon">The Heart Chamber</h1>
                        <p className="font-mono text-red-300 mt-2">LAYER 3: LEVEL 17-20 (FINALE)</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={toggleMusic}
                            className={`flex items-center gap-2 px-3 py-1 border text-xs font-mono uppercase tracking-widest transition ${finaleMusicPlaying ? "bg-red-500 text-black border-red-500 animate-pulse" : "bg-black text-red-500 border-red-800 hover:border-red-500"}`}
                        >
                            <Music size={14} /> {finaleMusicPlaying ? "Finale Track Active" : "Play Soundtrack"}
                        </button>
                    </div>
                </header>

                <div className="flex gap-4 flex-1 overflow-hidden">
                    {/* Map Area */}
                    <div className="flex-1 relative bg-black border border-red-900 flex flex-col">

                        {/* Map Tabs */}
                        <div className="flex border-b border-red-900">
                            <button
                                onClick={() => { setView("chamber"); setSelectedNode(null); }}
                                className={`flex-1 py-2 text-xs font-mono tracking-widest ${view === "chamber" ? "bg-red-900 text-white" : "bg-black text-red-500 hover:bg-red-950"}`}
                            >
                                LAYER 3: THE HEART
                            </button>
                            <button
                                onClick={() => { setView("catacombs"); setSelectedNode(null); }}
                                className={`flex-1 py-2 text-xs font-mono tracking-widest ${view === "catacombs" ? "bg-red-900 text-white" : "bg-black text-red-500 hover:bg-red-950"}`}
                            >
                                SUB-LAYER 1: CATACOMBS
                            </button>
                            <button
                                onClick={() => { setView("tomb"); setSelectedNode(null); }}
                                className={`flex-1 py-2 text-xs font-mono tracking-widest ${view === "tomb" ? "bg-red-900 text-white" : "bg-black text-red-500 hover:bg-red-950"}`}
                            >
                                SUB-LAYER 2: THE TOMB
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <InteractiveMap
                                key={view}
                                src={view === "chamber" ? "/heart_chamber_map.png" : (view === "tomb" ? "/tomb_map.png" : "/catacombs_map.png")}
                                title={view === "chamber" ? "DRAKHARAZ'S LAIR" : (view === "tomb" ? "THE FIRST TOMB" : "THE TRUE CATACOMBS")}
                                nodes={view === "chamber" ? CHAMBER_NODES : (view === "tomb" ? TOMB_NODES : CATACOMB_NODES)}
                                onNodeClick={setSelectedNode}
                                gridType={view === "chamber" ? "hex" : "square"}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-[400px] shrink-0 bg-paper-texture border-l-4 border-red-600 flex flex-col text-gray-900 h-full">
                        {selectedNode ? (
                            <div className="animate-fade-in flex flex-col h-full overflow-hidden">
                                {/* Sidebar Header */}
                                <div className="p-4 border-b border-red-900 bg-red-50 shrink-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-bold text-red-900 leading-none font-header">{selectedNode.label}</h2>
                                        <button onClick={() => setSelectedNode(null)} className="text-red-900 hover:text-red-600">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="font-mono text-[10px] bg-red-900 text-white px-2 py-0.5 inline-block rounded uppercase tracking-widest">
                                        TYPE: {selectedNode.type}
                                    </div>
                                    <p className="text-sm mt-3 leading-relaxed font-serif italic text-gray-800">{selectedNode.description}</p>
                                </div>

                                {/* Sidebar Content (Scrollable) */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                                    {selectedNode.type === 'boss' && (
                                        <>
                                            {/* LAIR ACTIONS WIDGET */}
                                            <div className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-inner">
                                                <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                    <Skull size={16} /> Lair Actions
                                                </h3>

                                                {view === "chamber" ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-2 bg-white border border-red-200 rounded">
                                                            <div className="flex items-center gap-2">
                                                                <Zap size={14} className="text-red-600" />
                                                                <span className="text-xs font-bold text-red-800">PULSE OF THE DEAD</span>
                                                            </div>
                                                            <button className="text-[10px] bg-red-900 text-white px-2 py-1 rounded hover:bg-red-700 transition">TRIGGER (DC 24)</button>
                                                        </div>
                                                        <div className="flex items-center justify-between p-2 bg-white border border-red-200 rounded">
                                                            <div className="flex items-center gap-2">
                                                                <Skull size={14} className="text-blue-600" />
                                                                <span className="text-xs font-bold text-red-800">NECROTIC BREATH</span>
                                                            </div>
                                                            <button className="text-[10px] bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-700 transition">RECHARGE 5-6</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-2 bg-white border border-red-200 rounded">
                                                            <div className="flex items-center gap-2">
                                                                <Zap size={14} className="text-indigo-600" />
                                                                <span className="text-xs font-bold text-red-800">TIME STOP</span>
                                                            </div>
                                                            <button className="text-[10px] bg-indigo-900 text-white px-2 py-1 rounded hover:bg-indigo-700 transition">CAST</button>
                                                        </div>
                                                        <div className="p-2 bg-white border border-red-200 rounded">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Shield size={14} className="text-green-600" />
                                                                <span className="text-xs font-bold text-red-800">PHYLACTERY SHIELD</span>
                                                            </div>
                                                            <div className="flex gap-1 h-3">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="flex-1 bg-green-200 border border-green-500 rounded-sm"></div>
                                                                ))}
                                                            </div>
                                                            <div className="text-[9px] text-center mt-1 text-gray-500 uppercase tracking-widest">3 Anchors Active</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* BOSS STATBLOCK RENDERING */}
                                            <div className="shadow-lg transform scale-[0.98]">
                                                {selectedNode.id === '1' && <StatblockCard data={BOSS_DATA['drakharaz']} />}
                                                {selectedNode.id === 'c3' && <StatblockCard data={BOSS_DATA['larloch']} />}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4 p-8">
                                <Skull size={48} className="text-red-900" />
                                <div className="italic font-serif text-red-900">
                                    {view === "chamber" ? "The heartbeat allows no silence." : (view === "tomb" ? "The First Warden sleeps." : "Quiet... they are listening.")}
                                </div>
                                <div className="text-xs font-mono text-red-800 mt-8 border-t border-red-300 pt-4 w-full">
                                    SELECT A NODE TO VIEW DETAILS
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PremiumGate>
    );
}

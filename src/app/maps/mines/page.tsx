"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import { X, Flame, Eye, EyeOff } from "lucide-react";

const MINES_NODES: MapNode[] = [
    // Level 1: The Scavenger's Den (Top Strip - Earth/Wood)
    { id: "ent", x: 10, y: 15, label: "The Greedy Maw (Lvl 1)", type: "entrance", description: "Wooden gates on the far left. The town throws its garbage and 'unwanted' citizens here.", monsters: ["flesh-golem"] },
    { id: "shanty", x: 30, y: 20, label: "Candle-Light Shanty", type: "quest", description: "SAFE ZONE: Hidden in a side-cave illuminated by tallow candles. 'Old Jorum's' shop.", monsters: [] },
    { id: "office", x: 15, y: 30, label: "Foreman's Office", type: "loot", description: "LOOT: 'The Miner's Savings'. A hollowed-out boot hidden under floorboards containing 250gp in raw nuggets.", monsters: [] },
    { id: "bunk", x: 70, y: 15, label: "Rotting Bunkhouse", type: "trap", description: "HAZARD: 'Silent Death'. Poisonous gas fills the room (heavier than air).", monsters: [] }, // Bodaks not in list yet, simple trap for now
    { id: "lift_1", x: 50, y: 25, label: "Lift Station Alpha", type: "encounter", description: "TRANSIT: Wooden platform over the central shaft. The Drow Silk Lift arrives here every 1d6 rounds.", monsters: [] },

    // Level 2: The Broken Works (Middle Strip - Iron/Rust)
    { id: "repair", x: 20, y: 50, label: "Repair Bay (Lvl 2)", type: "quest", description: "NPC: 'Unit 734' (Damaged Shield Guardian). It is pinned under debris. Repairing it (DC 18 INT) gains a temporary ally.", monsters: ["shield-guardian"] },
    { id: "crusher", x: 50, y: 50, label: "The Crusher Chamber", type: "boss", description: "BOSS: Spirit Naga coiling in the massive central pit. It guards 'The Golden Gear'.", monsters: ["spirit-naga"] },
    { id: "pyrite", x: 80, y: 45, label: "Pyrite Maze", type: "trap", description: "TRAP: Explosive gold dust coats the tunnels. ANY Fire damage triggers 4d6 Fire explosion.", monsters: ["rust-monster", "rust-monster"] },
    { id: "fungal", x: 10, y: 55, label: "Fungal Cave", type: "loot", description: "LOOT: Rare 'Timmask Spores' (Confuses enemies) and 3x Potions of Greater Healing.", monsters: ["myconid-sovereign"] },
    { id: "lift_2", x: 50, y: 40, label: "Lift Station Beta", type: "encounter", description: "TRANSIT: Rusted iron gantry. THREAT: Cloakers disguise themselves as old leather tarps.", monsters: ["cloaker"] },

    // Level 3: The Deep Road (Bottom Strip - Purple Stone)
    { id: "blockade", x: 30, y: 80, label: "Drow Blockade (Lvl 3)", type: "encounter", description: "COMBAT: Duergar mercenaries holding the depths. They have set up a magical barrier.", monsters: ["duergar", "duergar", "duergar"] },
    { id: "crystal", x: 80, y: 85, label: "Crystal Grotto", type: "loot", description: "LOOT: Ioun Stone (Protection) and a Xorn eating the crystals.", monsters: ["xorn"] },
    { id: "sump", x: 15, y: 90, label: "The Sump", type: "loot", description: "HIDDEN: Dagger of Venom found in the black, oily water.", monsters: ["carrion-crawler"] },
    { id: "lift_3", x: 50, y: 75, label: "Lift Foundation", type: "encounter", description: "MECHANIC: 'Spider Engine Room'. Giant mutated spiders turn the crank.", monsters: ["phase-spider", "phase-spider"] },
    { id: "breach", x: 90, y: 90, label: "The Ancient Breach", type: "quest", description: "EXIT: Glowing blue crack in the wall where the Drow broke through.", monsters: [] }
];

export default function MinesPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [lanternOn, setLanternOn] = useState(false);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null);

    // Get monsters for the selected node
    const nodeMonsters = selectedNode?.monsters
        ?.map(slug => {
            const m = MONSTERS_2024[slug];
            if (!m) console.warn(`Missing monster data for slug: ${slug}`);
            return m;
        })
        .filter(Boolean);

    return (
        <div className="retro-container relative">

            {/* Dark Mode Overlay */}
            {!lanternOn && (
                <div className="absolute inset-0 z-0 pointer-events-none bg-black/60 mix-blend-multiply transition-all duration-1000" />
            )}

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Link href="/maps" className="retro-btn bg-gray-700">← EXIT MINE</Link>
            </div>

            <header className="mb-6 relative z-10">
                <h1 className="text-4xl text-amber-600 text-shadow-neon">Oakhaven Mines</h1>
                <p className="font-mono text-amber-800 mt-2">DEPTH: LAYERS 1-3</p>
                <div className="mt-4 p-4 bg-gray-900 border border-amber-900 text-sm text-amber-200 flex justify-between items-center">
                    <div>
                        <strong>Environmental Effect: Absolute Darkness.</strong>
                        <div className="text-xs text-gray-400 mt-1">
                            {!lanternOn ? "Current Status: PITCH BLACK (Disadvantage on Perception, Speed Halved)" : "Current Status: LANTERN LIT (Normal Vision, Monsters Attracted to Light)"}
                        </div>
                    </div>

                    <button
                        onClick={() => alert("MECHANICS GUIDE:\n\n1. THE GREAT CHASM: A single massive void cuts through all 3 layers. The Drow Silk Lift connects them.\n2. TREMOR SENSE: Moving >15ft/turn in 'Unstable' zones triggers DC 13 Dex save vs Rockfall (2d6 Bludgeoning).\n3. LAYERED HAZARD: Level 2 has Exploding Pyrite (Fire Vuln). Level 3 has Anti-Magic Zones.\n4. CLAUSTROPHOBIA (Table Rule): Players must keep their hands on the table. Removing them triggers a 'cave-in' Dex save.")}
                        className="mx-2 px-3 py-1 text-xs bg-amber-700 hover:bg-amber-600 text-amber-100 border border-amber-500 rounded"
                    >
                        ❓ DM RULES
                    </button>

                    <button
                        onClick={() => setLanternOn(!lanternOn)}
                        className={`retro-btn flex items-center gap-2 ${lanternOn ? "bg-amber-600 animate-pulse" : "bg-gray-800"}`}
                    >
                        {lanternOn ? <><Flame size={16} /> EXTINGUISH LANTERN</> : <><EyeOff size={16} /> IGNITE LANTERN</>}
                    </button>
                </div>
            </header >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Map Area */}
                <div className="lg:col-span-2 aspect-square bg-black border border-amber-900 overflow-hidden relative group">
                    {/* Dynamic Vignette if lantern is on */}
                    {lanternOn && (
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)] z-10" />
                    )}

                    <div className="w-full h-full">
                        <InteractiveMap
                            src="/oakhaven_mine_v9.png"
                            title="The Deep Shaft"
                            nodes={MINES_NODES}
                            onNodeClick={setSelectedNode}
                            gridType="hex"
                        />
                    </div>
                </div>

                {/* Info Panel */}
                <div className="retro-card h-[600px] overflow-y-auto bg-gray-900/90 border-amber-900/50">
                    {selectedNode ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-amber-500 mb-2 border-b border-amber-800 pb-2">
                                {selectedNode.label}
                            </h2>
                            <div className="text-xs font-mono text-gray-500 mb-4">
                                COORDS: {selectedNode.x}, {selectedNode.y} | TYPE: {selectedNode.type.toUpperCase()}
                            </div>

                            <p className="text-lg leading-relaxed text-amber-100">{selectedNode.description}</p>

                            {/* Deteced Threats Section */}
                            {nodeMonsters && nodeMonsters.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold border-b border-amber-800 text-amber-600 mb-2 uppercase text-sm">Seismic Tremors Detected</h3>
                                    <div className="flex flex-col gap-2">
                                        {nodeMonsters.map((monster, idx) => (
                                            <button
                                                key={`${monster?.slug}-${idx}`}
                                                onClick={() => setViewingStatblock(monster?.slug || null)}
                                                className="flex items-center justify-between p-2 bg-amber-950/30 hover:bg-amber-900/50 border border-amber-800/30 rounded transition-colors text-left group"
                                            >
                                                <div>
                                                    <span className="font-bold text-amber-500 block group-hover:underline">
                                                        {monster?.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 block">
                                                        CR {monster?.cr} • {monster?.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs bg-amber-900 text-amber-100 px-2 py-1 rounded">SCAN</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!lanternOn && (
                                <div className="mt-6 p-3 bg-black border border-gray-700 text-gray-500 text-xs italic">
                                    <EyeOff size={14} className="inline mr-1" />
                                    Visuals obscured by darkness. Ignite lantern to identify details.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 italic text-amber-700">
                            <div className="text-6xl mb-4">⛏️</div>
                            Select a sector to survey.
                        </div>
                    )}
                </div>
            </div>

            {/* Statblock Overlay Modal */}
            {
                viewingStatblock && (
                    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                        <div className="relative w-full max-w-2xl max-h-full overflow-y-auto bg-stone-900 rounded shadow-2xl border-4 border-double border-amber-900">
                            <button
                                onClick={() => setViewingStatblock(null)}
                                className="absolute top-2 right-2 z-10 p-1 bg-amber-900 text-white rounded-full hover:bg-amber-700 transition"
                            >
                                <X size={20} />
                            </button>

                            {/* Render the Statblock */}
                            {(() => {
                                const monster = viewingStatblock ? MONSTERS_2024[viewingStatblock] : null;
                                return monster ? (
                                    <StatblockCard data={monster} />
                                ) : (
                                    <div className="p-8 text-center text-red-600">Error loading statblock.</div>
                                );
                            })()}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

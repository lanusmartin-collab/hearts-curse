"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import { X, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import PremiumGate from "@/components/auth/PremiumGate";

const LIBRARY_NODES: MapNode[] = [
    { id: "portals", x: 50, y: 80, label: "The Portal Gallery", type: "info", description: "HUB: Three arches float in the void. 1. Blue (Open) -> The Index. 2. Silver (Needs Key) -> Rhaugilath. 3. Red (Locked) -> Catacombs.", monsters: ["specter"] },
    { id: "rhaugilath", x: 90, y: 90, label: "Rhaugilath's Study", type: "quest", description: "NPC: Rhaugilath the Ageless (Lich). He is tired of Larloch's rule. QUEST: 'The Calibration'.", monsters: ["lich"] },
    { id: "index", x: 10, y: 90, label: "The Infinite Index", type: "info", description: "SCENE: A pocket dimension of flying books. LOOT: 'The Codex of Forgotten Wars'.", monsters: [] },
    { id: "tyrant", x: 20, y: 60, label: "The Eye of Decay", type: "boss", description: "BOSS: Death Tyrant. It guards 'The Nether Scrolls'.", monsters: ["death-tyrant"] },
    { id: "lich", x: 50, y: 50, label: "Head Librarian", type: "boss", description: "BOSS: Vez'nan. MECHANIC: 'Shush'. He creates Silence auras.", monsters: ["lich"] }
];

export default function LibraryPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null);
    const [noiseLevel, setNoiseLevel] = useState<"SILENT" | "WHISPER" | "LOUD">("WHISPER");

    // Get monsters for the selected node
    const nodeMonsters = selectedNode?.monsters
        ?.map(slug => {
            const m = MONSTERS_2024[slug];
            if (!m) console.warn(`Missing monster data for slug: ${slug}`);
            return m;
        })
        .filter(Boolean);

    const toggleNoise = () => {
        if (noiseLevel === "WHISPER") setNoiseLevel("LOUD");
        else if (noiseLevel === "LOUD") setNoiseLevel("SILENT");
        else setNoiseLevel("WHISPER");
    };

    return (
        <PremiumGate feature="The Library of Whispers">
            <div className="retro-container relative bg-indigo-950">

                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <Link href="/maps" className="retro-btn bg-gray-700">← EXIT LIBRARY</Link>
                </div>

                <header className="mb-6 relative z-10">
                    <h1 className="text-4xl text-indigo-300 text-shadow-neon font-serif">The Library of Whispers</h1>
                    <p className="font-mono text-indigo-400 mt-2">DOMAIN: ASTRAL VOID</p>

                    {/* Silence Monitor */}
                    <div className={`mt-4 p-4 border transition-colors duration-500 rounded flex justify-between items-center ${noiseLevel === "LOUD" ? "bg-red-900/50 border-red-500 animate-pulse" :
                        noiseLevel === "SILENT" ? "bg-blue-900/30 border-blue-500" :
                            "bg-indigo-900/50 border-indigo-500"
                        }`}>
                        <div>
                            <strong className={noiseLevel === "LOUD" ? "text-red-400" : "text-indigo-200"}>
                                ENVIRONMENTAL SENSORS:
                                {noiseLevel === "LOUD" && " ⚠️ ACOUSTIC BREACH DETECTED"}
                                {noiseLevel === "WHISPER" && " STABLE (WHISPERS)"}
                                {noiseLevel === "SILENT" && " ABSOLUTE SILENCE"}
                            </strong>
                            <div className="text-xs text-gray-300 mt-1">
                                {noiseLevel === "LOUD" ? "LIBRARIAN AGGRO: IMMINENT. CASTING SPELLS TRIGGERS COUNTERSPELL." :
                                    noiseLevel === "WHISPER" ? "Safe threshold. Verbal components allowed at risk." :
                                        "Spells impossible. Stealth Advantage."}
                            </div>
                        </div>

                        <button
                            onClick={() => alert("MECHANICS GUIDE:\n\n1. SILENCE REQUIRED: Casting any spell with a Verbal (V) component triggers an immediate 'Counterspell' (+7).\n2. SCHOLARS OF THE VOID: Liches ignore players unless spoken to loudly. Loud noises trigger 'Power Word Kill'.\n3. ESCHERIAN STAIRCASES: The map is a loop. Ascending leads to descending from the ceiling.\n4. MANDATORY WHISPER (Table Rule): Players must whisper. Normal volume = 1d12 Psychic damage.")}
                            className="mx-2 px-3 py-1 text-xs bg-indigo-700 hover:bg-indigo-600 text-indigo-100 border border-indigo-500 rounded"
                        >
                            ❓ DM RULES
                        </button>

                        <button
                            onClick={toggleNoise}
                            className={`retro-btn flex items-center gap-2 ${noiseLevel === "LOUD" ? "bg-red-600 hover:bg-red-700" :
                                "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {noiseLevel === "LOUD" ? <><Volume2 size={16} /> SHUSH!</> :
                                noiseLevel === "SILENT" ? <><MicOff size={16} /> BREAK SILENCE</> :
                                    <><Mic size={16} /> SPEAK UP</>}
                        </button>
                    </div>
                </header >

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                    {/* Map Area */}
                    <div className="lg:col-span-2 aspect-square bg-black border border-indigo-900 overflow-hidden relative shadow-[0_0_30px_rgba(75,0,130,0.3)]">
                        <InteractiveMap
                            src="/library_whispers_map.png"
                            title="The Infinite Stacks"
                            nodes={LIBRARY_NODES}
                            onNodeClick={setSelectedNode}
                            gridType="square"
                        />
                        <div className="absolute bottom-2 left-2 text-[10px] text-indigo-500 font-mono pointer-events-none">
                            GEOMETRY: NON-EUCLIDEAN (ESCHERIAN LOOPS)
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="retro-card h-[600px] overflow-y-auto bg-gray-900/90 border-indigo-900/50 backdrop-blur">
                        {selectedNode ? (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-indigo-400 mb-2 border-b border-indigo-800 pb-2 font-serif">
                                    {selectedNode.label}
                                </h2>
                                <div className="text-xs font-mono text-gray-500 mb-4">
                                    LOC: {selectedNode.x}, {selectedNode.y} | CLASS: {selectedNode.type.toUpperCase()}
                                </div>

                                <p className="text-lg leading-relaxed text-indigo-100">{selectedNode.description}</p>

                                {/* Detected Threats Section */}
                                {nodeMonsters && nodeMonsters.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-bold border-b border-indigo-800 text-indigo-400 mb-2 uppercase text-sm">Arcane Signatures</h3>
                                        <div className="flex flex-col gap-2">
                                            {nodeMonsters.map((monster, idx) => (
                                                <button
                                                    key={`${monster?.slug}-${idx}`}
                                                    onClick={() => setViewingStatblock(monster?.slug || null)}
                                                    className="flex items-center justify-between p-2 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/30 rounded transition-colors text-left group"
                                                >
                                                    <div>
                                                        <span className="font-bold text-indigo-300 block group-hover:underline">
                                                            {monster?.name}
                                                        </span>
                                                        <span className="text-xs text-gray-400 block">
                                                            CR {monster?.cr} • {monster?.type}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded border border-indigo-700">ANALYZE</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-indigo-950/50 border border-indigo-800 rounded text-xs text-indigo-300">
                                    <strong>Escherian Physics:</strong> "Up" is relative. If a target flees up a staircase, they may appear on the floor behind you. Ranged attacks disregard gravity range increments.
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 italic text-indigo-500">
                                <div className="text-6xl mb-4">🤫</div>
                                Select a lexicon node.
                            </div>
                        )}
                    </div>
                </div>

                {/* Statblock Overlay Modal */}
                {
                    viewingStatblock && (
                        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                            <div className="relative w-full max-w-2xl max-h-full overflow-y-auto bg-stone-900 rounded shadow-2xl border-4 border-double border-indigo-500">
                                <button
                                    onClick={() => setViewingStatblock(null)}
                                    className="absolute top-2 right-2 z-10 p-1 bg-indigo-900 text-white rounded-full hover:bg-indigo-700 transition"
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
        </PremiumGate>
    );
}

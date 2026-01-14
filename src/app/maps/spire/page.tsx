"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import { X, Wind, CloudFog, CloudLightning, ArrowUp } from "lucide-react";

const SPIRE_NODES: MapNode[] = [
    { id: "1", x: 50, y: 90, label: "Base of the Spire", type: "info", description: "The wind howls like a dying god. Visibility is 30ft due to clouds.", monsters: [] },
    { id: "2", x: 30, y: 70, label: "The Gale-Gate", type: "encounter", description: "Encounter: 2 Air Elementals + 4 Aarakocra Skirmishers. Lair Action: Gust (DC 15 Str save or pushed 20ft).", monsters: ["air-elemental", "aarakocra"] },
    { id: "3", x: 70, y: 50, label: "The Whispering Terrace", type: "quest", description: "Puzzle: Align the wind chimes to the Song of Aerdrie Faenya to reveal the stairs.", monsters: ["invisible-stalker"] },
    { id: "4", x: 50, y: 30, label: "Eye of the Storm", type: "boss", description: "BOSS: Aerisi (Air Prophet) mounted on an Invisible Stalker. Loot: 'Fan of Gales'.", monsters: ["aerisi-kalinoth", "invisible-stalker"] },
    { id: "5", x: 50, y: 15, label: "The Apex", type: "loot", description: "Treasure: Scroll of Control Weather & Elemental Gem (Blue).", monsters: [] }
];

export default function SpirePage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null);
    const [windDirection, setWindDirection] = useState<number | null>(null); // 0-7 (N, NE, E...)
    const [altitude, setAltitude] = useState<"BASE" | "MID" | "APEX">("BASE");

    // Get monsters for the selected node
    const nodeMonsters = selectedNode?.monsters
        ?.map(slug => {
            const m = MONSTERS_2024[slug];
            if (!m) console.warn(`Missing monster data for slug: ${slug}`);
            return m;
        })
        .filter(Boolean);

    const triggerGust = () => {
        const dir = Math.floor(Math.random() * 8);
        setWindDirection(dir);
    };

    const getWindLabel = (dir: number) => {
        const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        return dirs[dir];
    };

    return (
        <div className="retro-container relative bg-cyan-950">

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <Link href="/maps" className="retro-btn bg-gray-700">← EXIT SPIRE</Link>
            </div>

            <header className="mb-6 relative z-10">
                <h1 className="text-4xl text-cyan-200 text-shadow-neon font-sans">The Spire of Screaming Gales</h1>
                <p className="font-mono text-cyan-400 mt-2">ALTITUDE: {altitude} ({altitude === "BASE" ? "10,000ft" : altitude === "MID" ? "20,000ft" : "30,000ft"})</p>

                {/* Wind Monitor */}
                <div className="mt-4 p-4 border border-cyan-500 bg-cyan-900/40 rounded flex justify-between items-center backdrop-blur">
                    <div>
                        <strong className="text-cyan-200 flex items-center gap-2">
                            <Wind size={18} className="animate-pulse" />
                            CURRENT WIND CONDITION
                        </strong>
                        <div className="text-sm text-cyan-100 mt-1">
                            {windDirection === null ? "Calm... too calm." : `GALE FORCE: Blowing ${getWindLabel(windDirection)} at 80mph.`}
                        </div>
                    </div>

                    <button
                        onClick={() => alert("MECHANICS GUIDE:\n\n1. HIGH ALTITUDE: Creatures without fly speed must save vs Exhaustion per hour.\n2. WIND TUNNEL: Ranged attacks have Disadvantage. Fly speed doubled tailwind, halved headwind.\n3. THE SHOUT (Table Rule): Players must shout to be heard. Whispering is impossible.")}
                        className="mx-2 px-3 py-1 text-xs bg-cyan-700 hover:bg-cyan-600 text-cyan-100 border border-cyan-500 rounded"
                    >
                        ❓ DM RULES
                    </button>

                    <button
                        onClick={triggerGust}
                        className="retro-btn bg-cyan-700 hover:bg-cyan-600 border-cyan-400 text-white flex gap-2 items-center"
                    >
                        <CloudLightning size={16} /> TRIGGER GUST
                    </button>
                </div>
            </header >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                {/* Map Area */}
                <div className="lg:col-span-2 aspect-square bg-gray-900 border border-cyan-800 overflow-hidden relative shadow-2xl">
                    {/* Clouds Layer */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent pointer-events-none z-10" />

                    <div className="w-full h-full">
                        <InteractiveMap
                            src="/spire_map_placeholder.png" // User needs to update this image later
                            title="The Vertical Shaft"
                            nodes={SPIRE_NODES}
                            onNodeClick={setSelectedNode}
                            gridType="hex"
                        />
                    </div>
                </div>

                {/* Info Panel */}
                <div className="retro-card h-[600px] overflow-y-auto bg-gray-900/90 border-cyan-800/50 backdrop-blur">
                    {selectedNode ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-2 border-b border-cyan-800 pb-2">
                                {selectedNode.label}
                            </h2>
                            <div className="text-xs font-mono text-gray-500 mb-4">
                                COORDS: {selectedNode.x}, {selectedNode.y} | TYPE: {selectedNode.type.toUpperCase()}
                            </div>

                            <p className="text-lg leading-relaxed text-cyan-50">{selectedNode.description}</p>

                            {/* Detected Threats Section */}
                            {nodeMonsters && nodeMonsters.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold border-b border-cyan-800 text-cyan-300 mb-2 uppercase text-sm flex items-center gap-2">
                                        <CloudFog size={14} /> Aerial Threats
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {nodeMonsters.map((monster, idx) => (
                                            <button
                                                key={`${monster?.slug}-${idx}`}
                                                onClick={() => setViewingStatblock(monster?.slug || null)}
                                                className="flex items-center justify-between p-2 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/30 rounded transition-colors text-left group"
                                            >
                                                <div>
                                                    <span className="font-bold text-cyan-200 block group-hover:underline">
                                                        {monster?.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400 block">
                                                        CR {monster?.cr} • {monster?.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs bg-cyan-900 text-cyan-100 px-2 py-1 rounded">SCAN</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 p-4 bg-cyan-950/50 border border-cyan-700 rounded text-sm text-cyan-200">
                                <strong>High Altitude Rule:</strong>
                                <br />Creatures without a flying speed must succeed on a DC 15 Constitution saving throw each hour or gain 1 level of exhaustion.
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 italic text-cyan-600">
                            <div className="text-6xl mb-4">⛈️</div>
                            Select a platform to investigate.
                        </div>
                    )}
                </div>
            </div>

            {/* Statblock Overlay Modal */}
            {
                viewingStatblock && (
                    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                        <div className="relative w-full max-w-2xl max-h-full overflow-y-auto bg-stone-900 rounded shadow-2xl border-4 border-double border-cyan-600">
                            <button
                                onClick={() => setViewingStatblock(null)}
                                className="absolute top-2 right-2 z-10 p-1 bg-cyan-900 text-white rounded-full hover:bg-cyan-700 transition"
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

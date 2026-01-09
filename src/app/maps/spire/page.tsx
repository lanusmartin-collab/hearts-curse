"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";

const SPIRE_NODES: MapNode[] = [
    { id: "1", x: 50, y: 90, label: "Base of the Spire", type: "info", description: "The wind howls like a dying god. Visibility is 30ft due to clouds." },
    { id: "2", x: 30, y: 70, label: "The Gale-Gate", type: "encounter", description: "Encounter: 2 Air Elementals + 4 Aarakocra Skirmishers. Lair Action: Gust (DC 15 Str save or pushed 20ft)." },
    { id: "3", x: 70, y: 50, label: "The Whispering Terrace", type: "quest", description: "Puzzle: Align the wind chimes to the Song of Aerdrie Faenya to reveal the stairs." },
    { id: "4", x: 50, y: 30, label: "Eye of the Storm", type: "boss", description: "BOSS: Aerisi (Air Prophet) mounted on an Invisible Stalker. Loot: 'Fan of Gales'." },
    { id: "5", x: 50, y: 15, label: "The Apex", type: "loot", description: "Treasure: Scroll of Control Weather & Elemental Gem (Blue)." }
];

export default function SpirePage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    return (
        <div className="retro-container">
            <div className="no-print mb-4">
                <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
            </div>

            <header className="mb-8 border-b border-accent-dim pb-4">
                <h1 className="text-4xl text-white text-shadow-neon">The Spire of Screaming Gales</h1>
                <p className="font-mono text-accent mt-2">ADVENTURE: LEVEL 11-13</p>
                <div className="mt-4 p-4 bg-gray-900 border border-gray-700 text-sm">
                    <strong>Environmental Effect: High Altitude.</strong> Creatures without a flying speed must succeed on a DC 15 Constitution saving throw each hour or gain 1 level of exhaustion.
                </div>
            </header>

            <div className="flex gap-8 h-[600px]">
                {/* Map Area */}
                <div className="flex-1 relative bg-black border border-gray-700">
                    <InteractiveMap
                        src="/spire_map_placeholder.png" // Placeholder, user will need to provide real map or generic one
                        title="The Spire"
                        nodes={SPIRE_NODES}
                        onNodeClick={setSelectedNode}
                        gridType="square"
                    />
                </div>

                {/* Sidebar */}
                <div className="w-[350px] bg-paper-texture p-4 border-l-4 border-accent overflow-auto text-gray-900">
                    {selectedNode ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2 border-b border-black pb-1">{selectedNode.label}</h2>

                            <div className="font-mono text-xs mb-4 bg-black text-white p-1 inline-block">
                                TYPE: {selectedNode.type.toUpperCase()}
                            </div>

                            <p className="text-lg leading-relaxed">{selectedNode.description}</p>

                            {selectedNode.type === 'boss' && (
                                <div className="mt-6 p-4 bg-red-100 border border-red-500 rounded">
                                    <h3 className="font-bold text-red-900 mb-2">☠️ BOSS TACTICS</h3>
                                    <ul className="list-disc pl-4 text-sm space-y-2">
                                        <li><strong>Aerisi:</strong> Flies 60ft. Casts <em>Chain Lightning</em> on round 1.</li>
                                        <li><strong>Invisible Stalker:</strong> Grapples spellcasters and drops them (200ft fall = 20d6 damage).</li>
                                        <li><strong>Lair Action:</strong> Wind Wall blocks projectiles.</li>
                                    </ul>
                                </div>
                            )}

                            {selectedNode.type === 'encounter' && (
                                <div className="mt-6">
                                    <h4 className="font-bold border-b border-gray-400 mb-2">Enemies</h4>
                                    <ul className="text-sm font-mono">
                                        <li>2x Air Elemental (CR 5)</li>
                                        <li>4x Aarakocra (CR 1/4)</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                            Select a node on the map to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

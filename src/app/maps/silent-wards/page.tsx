"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";

// Nodes could be dynamic based on wall rotation, but for now we keep them static
const SILENT_NODES: MapNode[] = [
    { id: "1", x: 50, y: 90, label: "The Shifting Hub", type: "info", description: "The walls here groan and grind. Every 6 seconds (1 round), the layout changes." },
    { id: "2", x: 20, y: 50, label: "Mithral Guard", type: "encounter", description: "Encounter: 2x Mithral Golems. They have blindsight and reflect spells of 4th level or lower." },
    { id: "3", x: 80, y: 50, label: "Silence Trap", type: "encounter", description: "A glyph glows on the floor. Standing on it casts 'Silence'. 4 Invisible Stalkers ambush immediately." },
    { id: "4", x: 50, y: 10, label: "Stairs to Layer 2", type: "quest", description: "The exit. It is sealed by 3 runic locks. You need to find the keystones." },
    { id: "5", x: 50, y: 50, label: "The Minotaur's Ghost", type: "boss", description: "BOSS: Goristroi the Lost (Ghost Minotaur). He can phase through the shifting walls." }
];

export default function SilentWardsPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [wallRotation, setWallRotation] = useState(0);

    // Mechanic: Rotating Walls Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setWallRotation(prev => (prev + 90) % 360);
        }, 10000); // Rotate every 10 seconds for flavor
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="retro-container">
            <div className="no-print mb-4">
                <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
            </div>

            <header className="mb-8 border-b border-cyan-800 pb-4">
                <h1 className="text-4xl text-cyan-400 text-shadow-neon">The Silent Wards</h1>
                <p className="font-mono text-cyan-300 mt-2">LAYER 1: LEVEL 10-13</p>
                <div className="mt-4 p-4 bg-gray-900 border border-cyan-900 text-sm text-cyan-200">
                    <strong>Environmental Effect: Shifting Labyrinth.</strong> On Initiative 20, roll a d6. On a 1-2, the walls rotate, changing line of sight and separating the party.
                </div>
            </header>

            <div className="flex gap-8 h-[600px]">
                {/* Map Area */}
                <div className="flex-1 relative bg-black border border-cyan-900 overflow-hidden">
                    <div style={{
                        transform: `rotate(${wallRotation}deg)`,
                        transition: "transform 1s ease-in-out",
                        width: "100%", height: "100%"
                    }}>
                        <InteractiveMap
                            src="/silent_wards_map.png" // The generated image
                            title="Mithral Maze"
                            nodes={SILENT_NODES} // Nodes technically shouldn't rotate visually if they are "places", but for the effect we let the whole map spin
                            onNodeClick={setSelectedNode}
                            gridType="square"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[350px] bg-paper-texture p-4 border-l-4 border-cyan-600 overflow-auto text-gray-900">
                    {selectedNode ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2 border-b border-cyan-900 pb-1 text-cyan-900">{selectedNode.label}</h2>

                            <div className="font-mono text-xs mb-4 bg-cyan-900 text-white p-1 inline-block rounded">
                                TYPE: {selectedNode.type.toUpperCase()}
                            </div>

                            <p className="text-lg leading-relaxed">{selectedNode.description}</p>

                            {selectedNode.type === 'encounter' && (
                                <div className="mt-6 p-4 bg-cyan-100 border border-cyan-500 rounded">
                                    <h3 className="font-bold text-cyan-900 mb-2">⚔️ TACTICAL NOTE</h3>
                                    <ul className="list-disc pl-4 text-sm space-y-2">
                                        <li><strong>Mithral Reflection:</strong> Any spell requiring a ranged attack roll that misses a Golem can ricochet off the walls (50% chance).</li>
                                        <li><strong>Silence:</strong> Casters in the Silent Zone are useless. Lure enemies out.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                            Select a sector. Watch the walls.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-center text-xs font-mono text-gray-500">
                WALL STATUS: {wallRotation}° ROTATION
            </div>
        </div>
    );
}

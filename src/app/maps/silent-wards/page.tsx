"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import { X } from "lucide-react";

// Nodes could be dynamic based on wall rotation, but for now we keep them static
const SILENT_NODES: MapNode[] = [
    { id: "1", x: 50, y: 90, label: "The Shifting Hub", type: "info", description: "The walls here groan and grind. Every 6 seconds (1 round), the layout changes.", monsters: [] },
    { id: "2", x: 20, y: 50, label: "Mithral Guard", type: "encounter", description: "Encounter: 2x Mithral Golems. They have blindsight and reflect spells of 4th level or lower.", monsters: ["mithral-golem", "mithral-golem"] },
    { id: "3", x: 80, y: 50, label: "Silence Trap", type: "encounter", description: "A glyph glows on the floor. Standing on it casts 'Silence'. 4 Invisible Stalkers ambush immediately.", monsters: ["invisible-stalker", "invisible-stalker", "invisible-stalker", "invisible-stalker"] },
    { id: "4", x: 50, y: 10, label: "Stairs to Layer 2", type: "quest", description: "The exit. It is sealed by 3 runic locks. You need to find the keystones.", monsters: [] },
    { id: "5", x: 50, y: 50, label: "The Minotaur's Ghost", type: "boss", description: "BOSS: Goristroi the Lost (Ghost Minotaur). He can phase through the shifting walls.", monsters: ["goristroi-the-lost"] }
];

export default function SilentWardsPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [wallRotation, setWallRotation] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null);

    // Get monsters for the selected node
    const nodeMonsters = selectedNode?.monsters
        ?.map(slug => {
            const m = MONSTERS_2024[slug];
            if (!m) console.warn(`Missing monster data for slug: ${slug}`);
            return m;
        })
        .filter(Boolean);

    // Mechanic: Rotating Walls Simulation
    useEffect(() => {
        if (isLocked) return; // Stop rotation if locked

        const interval = setInterval(() => {
            setWallRotation(prev => (prev + 90) % 360);
        }, 10000); // Rotate every 10 seconds for flavor
        return () => clearInterval(interval);
    }, [isLocked]);

    const handleLockMechanism = () => {
        // Simple client-side check for flavor
        const roll = Math.floor(Math.random() * 20) + 1;
        const mod = 5; // Assumed INT modifier of Tinkerer
        if (roll + mod >= 15) {
            setIsLocked(true);
            alert(`SUCCESS! (Rolled ${roll} + ${mod} = ${roll + mod})\n\nYou jam a piton into the gear assembly. The walls grind to a halt.`);
        } else {
            alert(`FAILURE! (Rolled ${roll} + ${mod} = ${roll + mod})\n\nThe gears shear the metal. The rotation speeds up momentarily!`);
            setWallRotation(prev => (prev + 180) % 360);
        }
    };

    return (
        <div className="retro-container">
            <div className="no-print mb-4">
                <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
            </div>

            <header className="mb-8 border-b border-cyan-800 pb-4">
                <h1 className="text-4xl text-cyan-400 text-shadow-neon">The Silent Wards</h1>
                <p className="font-mono text-cyan-300 mt-2">LAYER 1: LEVEL 10-13</p>
                <div className="mt-4 p-4 bg-gray-900 border border-cyan-900 text-sm text-cyan-200">
                    <strong>Environmental Effect: Shifting Labyrinth.</strong>
                    <div className="flex justify-between items-center mt-2">
                        <span>On Initiative 20, the walls rotate.</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => alert("HOW TO RUN THIS MECANIC:\n\n1. VISUAL: The map rotates 90 degrees.\n2. TABLE: Ask players to physically rotate their character sheets/phones.\n3. GAME: North becomes East. 'Forward' is now 'Right'.\n4. LOCK: Players can use thieves' tools (DC 15) to jam the gears (use the 'Attempt Lock' button).")}
                                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 rounded"
                            >
                                ❓ DM RULES
                            </button>
                            <button
                                onClick={handleLockMechanism}
                                disabled={isLocked}
                                className={`px-3 py-1 text-xs border rounded transition-all ${isLocked ? "bg-green-900 text-green-100 border-green-700 cursor-not-allowed" : "bg-cyan-900 hover:bg-cyan-700 text-white border-cyan-400"}`}
                            >
                                {isLocked ? "MECHANISM LOCKED" : "ATTEMPT LOCK (DC 15)"}
                            </button>
                        </div>
                    </div>
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
                            src="/silent_wards_map_v5.png" // The generated image
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
                                <div className="mt-6 p-4 bg-cyan-100 border border-cyan-500 rounded text-sm">
                                    <h3 className="font-bold text-cyan-900 mb-2">⚔️ TACTICAL NOTE</h3>
                                    <ul className="list-disc pl-4 space-y-2">
                                        <li><strong>Structure:</strong> The walls have AC 17 and 50 HP. Destroying them might create a shortcut but alerts the Golems.</li>
                                        <li><strong>Silence:</strong> Casters in the Silent Zone are useless. Lure enemies out.</li>
                                    </ul>
                                </div>
                            )}

                            {/* Deteced Threats Section */}
                            {nodeMonsters && nodeMonsters.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold border-b border-cyan-800 text-cyan-900 mb-2 uppercase text-sm">Detected Threats</h3>
                                    <div className="flex flex-col gap-2">
                                        {nodeMonsters.map((monster, idx) => (
                                            <button
                                                key={`${monster?.slug}-${idx}`}
                                                onClick={() => setViewingStatblock(monster?.slug || null)}
                                                className="flex items-center justify-between p-2 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded transition-colors text-left group"
                                            >
                                                <div>
                                                    <span className="font-bold text-cyan-900 block group-hover:underline">
                                                        {monster?.name}
                                                    </span>
                                                    <span className="text-xs text-gray-600 block">
                                                        CR {monster?.cr} • {monster?.type}
                                                    </span>
                                                </div>
                                                <span className="text-xs bg-cyan-900 text-white px-2 py-1 rounded">VIEW</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 italic">
                            <div className="text-6xl mb-4">⚙️</div>
                            Select a sector. Watch the walls.
                        </div>
                    )}
                </div>
            </div>

            {/* Statblock Overlay Modal */}
            {viewingStatblock && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                    <div className="relative w-full max-w-2xl max-h-full overflow-y-auto bg-paper-texture rounded shadow-2xl border-4 border-double border-cyan-900">
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
            )}

            <div className="mt-4 text-center text-xs font-mono text-gray-500">
                WALL STATUS: {wallRotation}° ROTATION {isLocked && "(LOCKED)"}
            </div>
        </div>
    );
}

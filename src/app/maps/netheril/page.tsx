"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import { X } from "lucide-react";
import PremiumGate from "@/components/auth/PremiumGate";

// Update Nodes with Monster Slugs
const NETHERIL_NODES: MapNode[] = [
    {
        id: "1", x: 50, y: 85, label: "The Shattered Gate", type: "encounter",
        description: "A massive archway of blackstone, humming with void energy. Two 'Echoes' stand guard.",
        monsters: ["arcanum-wraith", "arcanum-wraith"]
    },
    {
        id: "2", x: 50, y: 60, label: "Hall of Mirrors", type: "encounter",
        description: "A long corridor where reflections show the viewer's death. Wisdom Save DC 16 or Frightened. Trap: Soul Siphon (4d10 Necrotic).",
        monsters: ["living-cloudkill"]
    },
    {
        id: "3", x: 50, y: 25, label: "The Void Altar", type: "boss",
        description: "The central chamber. Gravity is distorted here (Jump x3). The Balor awaits.",
        monsters: ["balor", "vrock", "vrock"]
    },
    {
        id: "4", x: 50, y: 5, label: "The Treasury", type: "loot",
        description: "Hidden behind the throne. Protected by a Prismatic Wall. Loot: Prism of the Void.",
        monsters: ["nightwalker"] // Guarding the treasury
    }
];

export default function NetherilPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null);

    // Get monsters for the selected node using direct lookup
    // Filter out any undefined results to prevent crashes
    const nodeMonsters = selectedNode?.monsters
        ?.map(slug => {
            const m = MONSTERS_2024[slug];
            if (!m) console.warn(`Missing monster data for slug: ${slug}`);
            return m;
        })
        .filter(Boolean);

    return (
        <PremiumGate feature="The Netheril Ruins">
            <div className="retro-container relative">
                <div className="no-print mb-4">
                    <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
                </div>

                <header className="mb-8 border-b border-accent-dim pb-4">
                    <h1 className="text-4xl text-white text-shadow-neon">The Netheril Ruins</h1>
                    <p className="font-mono text-accent mt-2">OPTIONAL QUEST: LEVEL 14+</p>
                    <div className="mt-4 p-4 bg-gray-900 border border-gray-700 text-sm flex justify-between items-center">
                        <span>Dungeon Overview: The ruins of a crashed Netheril Enclave. The Balor "Ignis-Void" has been bound here by Larloch to guard the Prism.</span>
                        <button
                            onClick={() => alert("MECHANICS GUIDE:\n\n1. VOID GRAVITY: Jump distance is tripled.\n2. NECROTIC HUMMING: 1d4 necrotic damage/turn to living creatures.\n3. ARCANE DECAY (Table Rule): If a player forgets a rule or asks 'what do I roll?', the spell fails.")}
                            className="ml-4 px-3 py-1 text-xs bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 rounded"
                        >
                            ❓ DM RULES
                        </button>
                    </div>
                </header>

                <div className="flex gap-8 h-[600px]">
                    {/* Visual Map Area */}
                    <div className="flex-1 relative bg-black border border-gray-700">
                        <InteractiveMap
                            src="/netheril_map.png"
                            title="Netheril Enclave"
                            nodes={NETHERIL_NODES}
                            onNodeClick={setSelectedNode}
                            gridType="square"
                        />
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-[400px] bg-paper-texture p-4 border-l-4 border-accent overflow-y-auto overflow-x-hidden text-gray-900 shadow-2xl relative">
                        {selectedNode ? (
                            <div className="animate-fade-in pb-20">
                                <h2 className="text-2xl font-bold mb-2 border-b border-black pb-1 uppercase tracking-wider">{selectedNode.label}</h2>
                                <div className="font-mono text-xs mb-4 bg-black text-white p-1 inline-block">
                                    TYPE: {selectedNode.type.toUpperCase()}
                                </div>

                                <p className="text-lg leading-relaxed mb-6 font-serif">{selectedNode.description}</p>

                                {/* Deteced Threats Section */}
                                {nodeMonsters && nodeMonsters.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-bold border-b border-red-800 text-red-900 mb-2 uppercase text-sm">Detected Threats</h3>
                                        <div className="flex flex-col gap-2">
                                            {nodeMonsters.map((monster, idx) => (
                                                <button
                                                    key={`${monster?.slug}-${idx}`}
                                                    onClick={() => setViewingStatblock(monster?.slug || null)}
                                                    className="flex items-center justify-between p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors text-left group"
                                                >
                                                    <div>
                                                        <span className="font-bold text-red-900 block group-hover:underline">
                                                            {monster?.name}
                                                        </span>
                                                        <span className="text-xs text-gray-600 block">
                                                            CR {monster?.cr} • {monster?.type}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs bg-red-900 text-white px-2 py-1 rounded">VIEW</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedNode.type === 'loot' && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-500 rounded shadow-sm">
                                        <h4 className="font-bold text-yellow-900 mb-2 border-b border-yellow-200 pb-1">LOOT SPECIFICATION</h4>
                                        <div className="text-sm font-serif">
                                            <strong className="text-lg text-yellow-800">Prism of the Void</strong><br />
                                            <em className="text-gray-600">Wondrous Item, Legendary</em><br />
                                            <p className="mt-2 text-justify">
                                                As an action, creates a 30ft anti-magic cone that specifically targets floating magical objects (Ioun Stones), rendering them inert for 1 minute.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 italic">
                                <span className="text-4xl mb-4">🗺️</span>
                                Select a sector to analyze.
                            </div>
                        )}
                    </div>
                </div>

                {/* Statblock Overlay Modal */}
                {viewingStatblock && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
                        <div className="relative w-full max-w-2xl max-h-full overflow-y-auto bg-paper-texture rounded shadow-2xl border-4 border-double border-red-900">
                            <button
                                onClick={() => setViewingStatblock(null)}
                                className="absolute top-2 right-2 z-10 p-1 bg-red-900 text-white rounded-full hover:bg-red-700 transition"
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
            </div>
        </PremiumGate>
    );
}

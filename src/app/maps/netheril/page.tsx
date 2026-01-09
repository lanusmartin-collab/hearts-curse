"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";

const NETHERIL_NODES: MapNode[] = [
    { id: "1", x: 50, y: 85, label: "The Shattered Gate", type: "encounter", description: "A massive archway of blackstone, humming with void energy. Two &apos;Echoes&apos; stand guard. Encounter: 2x Netherese Specters." },
    { id: "2", x: 50, y: 60, label: "Hall of Mirrors", type: "encounter", description: "A long corridor where reflections show the viewer's death. Wisdom Save DC 16 or Frightened. Trap: Soul Siphon (4d10 Necrotic)." },
    { id: "3", x: 50, y: 25, label: "The Void Altar", type: "boss", description: "The central chamber. Gravity is distorted here (Jump x3). The Balor awaits. BOSS: Balor + 2 Vrocks." },
    { id: "4", x: 50, y: 5, label: "The Treasury", type: "loot", description: "Hidden behind the throne. Protected by a Prismatic Wall. Loot: Prism of the Void." }
];

export default function NetherilPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    return (
        <div className="retro-container">
            <div className="no-print mb-4">
                <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
            </div>

            <header className="mb-8 border-b border-accent-dim pb-4">
                <h1 className="text-4xl text-white text-shadow-neon">The Netheril Ruins</h1>
                <p className="font-mono text-accent mt-2">OPTIONAL QUEST: LEVEL 14+</p>
                <div className="mt-4 p-4 bg-gray-900 border border-gray-700 text-sm">
                    Dungeon Overview: The ruins of a crashed Netheril Enclave. The Balor &quot;Ignis-Void&quot; has been bound here by Larloch to guard the Prism.
                </div>
            </header>

            <div className="flex gap-8 h-[600px]">
                {/* Visual Map Area */}
                <div className="flex-1 relative bg-black border border-gray-700">
                    <InteractiveMap
                        src="/netheril_map_placeholder.png"
                        title="Netheril Enclave"
                        nodes={NETHERIL_NODES}
                        onNodeClick={setSelectedNode}
                        gridType="square"
                    />
                </div>

                {/* Sidebar Info */}
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
                                    <h4 className="font-bold text-red-900 mb-2">Balor Tactics</h4>
                                    <ul className="list-disc pl-4 text-sm space-y-2">
                                        <li>Explodes on death (20d6 Fire).</li>
                                        <li>Whip pulls enemies into Fire Aura.</li>
                                        <li>Teleports as Legendary Action.</li>
                                    </ul>
                                </div>
                            )}

                            {selectedNode.type === 'loot' && (
                                <div className="mt-6 p-4 bg-yellow-100 border border-yellow-500 rounded">
                                    <h4 className="font-bold text-yellow-900 mb-2">Loot Spec</h4>
                                    <div className="text-sm">
                                        <strong>Prism of the Void</strong><br />
                                        <em>Wondrous Item, Legendary</em><br />
                                        As an action, creates a 30ft anti-magic cone that specifically targets floating magical objects (Ioun Stones), rendering them inert for 1 minute.
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                            Select a room to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";

const COLONY_NODES: MapNode[] = [
    { id: "1", x: 80, y: 80, label: "Neural Network Entrance", type: "info", description: "The walls pulsate with faint bio-luminescence. You hear thoughts that aren't your own." },
    { id: "2", x: 60, y: 60, label: "Thrall Pen", type: "encounter", description: "Encounter: 4x Grimlocks + 2x Intellect Devourers inside the skulls of Duergar." },
    { id: "3", x: 40, y: 50, label: "Ceremorphosis Chamber", type: "quest", description: "Horror: A Drow scout is midway through transformation. Mercy kill or attempt extraction?" },
    { id: "4", x: 20, y: 30, label: "The Elder Brain Pool", type: "boss", description: "BOSS: Ulitharid (CR 9) guarding the brine pool. Lair Action: Psychic Static (DC 15 Int save or Stunned)." },
    { id: "5", x: 30, y: 20, label: "Psionic Archive", type: "loot", description: "Treasure: Ring of Mind Shielding & 3x Potions of Psychic Resistance." }
];

export default function MindFlayerPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    return (
        <div className="retro-container">
            <div className="no-print mb-4">
                <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
            </div>

            <header className="mb-8 border-b border-purple-800 pb-4">
                <h1 className="text-4xl text-purple-400 text-shadow-neon">The Synaptic Deep</h1>
                <p className="font-mono text-purple-300 mt-2">MIND FLAYER COLONY: LEVEL 12-14</p>
                <div className="mt-4 p-4 bg-gray-900 border border-purple-900 text-sm text-purple-200">
                    <strong>Environmental Effect: Psionic Hum.</strong> Telepathy is amplified to painful levels. Concentration checks have Disadvantage.
                </div>
            </header>

            <div className="flex gap-8 h-[600px]">
                {/* Map Area */}
                <div className="flex-1 relative bg-black border border-purple-900">
                    <InteractiveMap
                        src="/mind_flayer_map_placeholder.png"
                        title="THE COLONY"
                        nodes={COLONY_NODES}
                        onNodeClick={setSelectedNode}
                        gridType="hex"
                    />
                </div>

                {/* Sidebar */}
                <div className="w-[350px] bg-paper-texture p-4 border-l-4 border-purple-600 overflow-auto text-gray-900">
                    {selectedNode ? (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2 border-b border-purple-900 pb-1 text-purple-900">{selectedNode.label}</h2>

                            <div className="font-mono text-xs mb-4 bg-purple-900 text-white p-1 inline-block rounded">
                                TYPE: {selectedNode.type.toUpperCase()}
                            </div>

                            <p className="text-lg leading-relaxed">{selectedNode.description}</p>

                            {selectedNode.type === 'boss' && (
                                <div className="mt-6 p-4 bg-purple-100 border border-purple-500 rounded">
                                    <h3 className="font-bold text-purple-900 mb-2">🧠 BOSS TACTICS</h3>
                                    <ul className="list-disc pl-4 text-sm space-y-2">
                                        <li><strong>Ulitharid:</strong> Opening move: <em>Mass Suggestion</em> ("Surrender your brains").</li>
                                        <li><strong>Extract Brain:</strong> Triggers if a PC is grappled by tentacles. 10d10 piercing.</li>
                                        <li><strong>Mind Blast:</strong> Recharges on 5-6. 60ft cone, 4d8 + Stun.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                            Select a node to probe its thoughts...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

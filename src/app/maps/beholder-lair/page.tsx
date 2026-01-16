"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import PremiumGate from "@/components/auth/PremiumGate";

const BEHOLDER_NODES: MapNode[] = [
    { id: "1", x: 50, y: 95, label: "The Vertical Shaft", type: "info", description: "A 500ft smooth drop. Handholds are trapped with slime." },
    { id: "2", x: 20, y: 70, label: "Gallery of Statues", type: "quest", description: "Hundreds of petrified victims. One is holding the key. Investigation DC 18." },
    { id: "3", x: 80, y: 60, label: "Gazer Nest", type: "encounter", description: "Encounter: 6x Gazers (minion beholders). They swarm and pew-pew with mini-rays." },
    { id: "4", x: 50, y: 40, label: "The Central Eye", type: "boss", description: "BOSS: Xylantropy (Beholder). Paralyzed by paranoia. Keeps Anti-Magic Cone on the healer." },
    { id: "5", x: 50, y: 10, label: "Hoard of the Eye", type: "loot", description: "Treasure: Shield of Missile Attraction (Cursed) & Wand of Paralysis." }
];

export default function BeholderPage() {
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    return (
        <PremiumGate feature="The Eye's Domain">
            <div className="retro-container">
                <div className="no-print mb-4">
                    <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
                </div>

                <header className="mb-8 border-b border-green-800 pb-4">
                    <h1 className="text-4xl text-green-400 text-shadow-neon">The Eye&apos;s Domain</h1>
                    <p className="font-mono text-green-300 mt-2">BEHOLDER LAIR: LEVEL 13-15</p>
                    <div className="mt-4 p-4 bg-gray-900 border border-green-900 text-sm text-green-200">
                        <strong>Environmental Effect: Watching Eyes.</strong> You feel constantly watched. Stealth checks are made with Disadvantage.
                    </div>
                </header>

                <div className="flex gap-8 h-[600px]">
                    {/* Map Area */}
                    <div className="flex-1 relative bg-black border border-green-900">
                        <InteractiveMap
                            src="/beholder_map_placeholder.png"
                            title="THE LAIR"
                            nodes={BEHOLDER_NODES}
                            onNodeClick={setSelectedNode}
                            gridType="none"
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-[350px] bg-paper-texture p-4 border-l-4 border-green-600 overflow-auto text-gray-900">
                        {selectedNode ? (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-2 border-b border-green-900 pb-1 text-green-900">{selectedNode.label}</h2>

                                <div className="font-mono text-xs mb-4 bg-green-900 text-white p-1 inline-block rounded">
                                    TYPE: {selectedNode.type.toUpperCase()}
                                </div>

                                <p className="text-lg leading-relaxed">{selectedNode.description}</p>

                                {selectedNode.type === 'boss' && (
                                    <div className="mt-6 p-4 bg-green-100 border border-green-500 rounded">
                                        <h3 className="font-bold text-green-900 mb-2">👁️ BOSS TACTICS</h3>
                                        <ul className="list-disc pl-4 text-sm space-y-2">
                                            <li><strong>Anti-Magic Cone:</strong> 150ft cone. No magic works inside. Xylantropy keeps this on the strongest caster.</li>
                                            <li><strong>Eye Rays:</strong> Shoots 3 random rays per turn (Charm, Paralyze, Fear, Slow, Enervation, Telekinetic, Sleep, Petrification, Disintegration, Death).</li>
                                            <li><strong>Legendary Actions:</strong> Can use an Eye Ray at the end of another creature&apos;s turn.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                                Select a node. Caution is advised.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PremiumGate>
    );
}

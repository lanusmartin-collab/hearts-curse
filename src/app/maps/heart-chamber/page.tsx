"use client";

import Link from "next/link";
import { useState } from "react";
import InteractiveMap, { MapNode } from "@/components/ui/InteractiveMap";
import PremiumGate from "@/components/auth/PremiumGate";

const CHAMBER_NODES: MapNode[] = [
    { id: "1", x: 50, y: 50, label: "The Dracolich Heart", type: "boss", description: "BOSS: Drakharaz the Eternal. The heart beats with necrotic energy. Every beat pulses damage to non-undead." },
    { id: "2", x: 20, y: 20, label: "West Pylon (Active)", type: "encounter", description: "Shield Pylon. Must be destroyed to lower Larloch's AC. Guarded by 2 Death Tyrants." },
    { id: "3", x: 80, y: 20, label: "East Pylon (Active)", type: "encounter", description: "Shield Pylon. Guarded by 2 Liches." },
    { id: "4", x: 50, y: 90, label: "Void Edge", type: "info", description: "Falling here leads to the Negative Energy Plane (Instant Death)." },
    { id: "5", x: 50, y: 80, label: "Entrance to Catacombs", type: "quest", description: "Hidden hatch revealed only when Drakharaz is defeated. Leads to the True Phylactery." }
];

const CATACOMB_NODES: MapNode[] = [
    { id: "c1", x: 10, y: 10, label: "The Bone Tunne", type: "info", description: "Walls made of crushed skulls. Claustrophobic." },
    { id: "c2", x: 50, y: 50, label: "The Reflection", type: "encounter", description: "A mirror room where PCs fight their own shadows (Shadow Assassin stats)." },
    { id: "c3", x: 90, y: 90, label: "The True Phylactery", type: "boss", description: "FINAL BOSS: Larloch's Human Form. He wields the Ioun Stones as weapons." }
];

export default function HeartChamberPage() {
    const [view, setView] = useState<"chamber" | "catacombs">("chamber");
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    return (
        <PremiumGate feature="The Heart Chamber">
            <div className="retro-container">
                <div className="no-print mb-4">
                    <Link href="/maps">{"< BACK_TO_MAPS"}</Link>
                </div>

                <header className="mb-8 border-b border-red-800 pb-4">
                    <h1 className="text-4xl text-red-500 text-shadow-neon">The Heart Chamber</h1>
                    <p className="font-mono text-red-300 mt-2">LAYER 3: LEVEL 17-20 (FINALE)</p>
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={() => { setView("chamber"); setSelectedNode(null); }}
                            className={`px-4 py-2 border ${view === "chamber" ? "bg-red-900 text-white border-white" : "bg-black text-red-500 border-red-800"}`}
                        >
                            LAYER 3: THE HEART
                        </button>
                        <button
                            onClick={() => { setView("catacombs"); setSelectedNode(null); }}
                            className={`px-4 py-2 border ${view === "catacombs" ? "bg-red-900 text-white border-white" : "bg-black text-red-500 border-red-800"}`}
                        >
                            SUB-LAYER: CATACOMBS
                        </button>
                    </div>
                </header>

                <div className="flex gap-8 h-[600px]">
                    {/* Map Area */}
                    <div className="flex-1 relative bg-black border border-red-900">
                        <InteractiveMap
                            key={view}
                            src={view === "chamber" ? "/heart_chamber_map.png" : "/catacombs_map.png"}
                            title={view === "chamber" ? "DRAKHARAZ'S LAIR" : "THE TRUE CATACOMBS"}
                            nodes={view === "chamber" ? CHAMBER_NODES : CATACOMB_NODES}
                            onNodeClick={setSelectedNode}
                            gridType={view === "chamber" ? "hex" : "square"}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-[350px] bg-paper-texture p-4 border-l-4 border-red-600 overflow-auto text-gray-900">
                        {selectedNode ? (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold mb-2 border-b border-red-900 pb-1 text-red-900">{selectedNode.label}</h2>

                                <div className="font-mono text-xs mb-4 bg-red-900 text-white p-1 inline-block rounded">
                                    TYPE: {selectedNode.type.toUpperCase()}
                                </div>

                                <p className="text-lg leading-relaxed">{selectedNode.description}</p>

                                {selectedNode.type === 'boss' && (
                                    <div className="mt-6 p-4 bg-red-100 border border-red-500 rounded">
                                        <h3 className="font-bold text-red-900 mb-2">☠️ BOSS MECHANICS</h3>
                                        {view === "chamber" ? (
                                            <ul className="list-disc pl-4 text-sm space-y-2">
                                                <li><strong>Pulse of the Dead:</strong> Initiative 20. DC 24 Con save or 1 Exhaustion.</li>
                                                <li><strong>Ioun Swarm:</strong> Larloch uses Ioun Stones to absorb spells. Must target stones individually (AC 24, 20 HP).</li>
                                                <li><strong>Soul Tether:</strong> Drakharaz shares damage with the nearest PC until the Heart is attacked.</li>
                                            </ul>
                                        ) : (
                                            <ul className="list-disc pl-4 text-sm space-y-2">
                                                <li><strong>Larloch Ascended:</strong> He has infinite spell slots of 3rd level and lower.</li>
                                                <li><strong>Time Stop:</strong> Casts at start of combat.</li>
                                                <li><strong>Phylactery Safeguard:</strong> Takes 0 damage until all 3 &quot;Memory Ghosts&quot; in the room are persuaded or destroyed.</li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center opacity-50 italic">
                                {view === "chamber" ? "The heartbeat allows no silence." : "Quiet... they are listening."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PremiumGate>
    );
}

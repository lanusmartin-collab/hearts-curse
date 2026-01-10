"use client";

import { useState } from "react";
import Link from "next/link";
import InteractiveMap from "@/components/ui/InteractiveMap";
import DungeonModuleTemplate from "@/components/ui/DungeonModuleTemplate";
import { CAMPAIGN_MAPS, CampaignMap } from "@/lib/data/maps";
import { MechanicsDashboard } from "@/components/ui/MechanicsDashboard";
import DiceRoller from "@/components/ui/DiceRoller";
import { getRegionalEffect, rollWildMagic } from "@/lib/game/curseLogic";

export default function MapsPage() {
    const [selectedMapId, setSelectedMapId] = useState<string>(CAMPAIGN_MAPS[0].id);
    const [viewMode, setViewMode] = useState<"interactive" | "book">("interactive");

    const selectedMap = CAMPAIGN_MAPS.find(m => m.id === selectedMapId) || CAMPAIGN_MAPS[0];

    // Force Map to re-mount when map changes to reset state
    const mapKey = selectedMap.id;

    if (viewMode === "book") {
        return <DungeonModuleTemplate mapData={selectedMap} onClose={() => setViewMode("interactive")} />;
    }

    return (
        <div className="retro-container h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="no-print py-4 border-b border-gray-800 flex justify-between items-center px-4 shrink-0">
                <h1 className="retro-title text-2xl m-0">CARTOGRAPHY & ADVENTURES</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("book")}
                        className="retro-btn bg-amber-700 text-white text-xs px-3 py-1 hover:bg-amber-600 border-amber-900"
                    >
                        View as Module (2e)
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="retro-btn bg-blue-900 text-white text-xs px-3 py-1 hover:bg-blue-700"
                    >
                        Print Record
                    </button>
                    <Link href="/" className="retro-btn bg-red-900 text-white text-xs px-3 py-1 no-underline hover:bg-red-700">Back to Main Menu</Link>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="retro-border w-[300px] bg-[#fdf5c9] text-[#3e2723] flex flex-col shrink-0">
                    <div className="p-4 border-b-2 border-brown-800 bg-brown-100">
                        <h3 className="font-bold">LOCATIONS</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-4">
                        {/* Town / Uncategorized */}
                        <div>
                            {CAMPAIGN_MAPS.filter(m => !m.category).map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMapId(m.id)}
                                    className={`
                                        p-3 cursor-pointer transition-all border border-transparent rounded mb-1
                                        ${selectedMap.id === m.id
                                            ? "bg-red-900 text-white border-red-900 shadow-md font-bold"
                                            : "hover:bg-brown-200 hover:border-brown-400"}
                                    `}
                                >
                                    <div className="text-sm uppercase tracking-wider">{m.title}</div>
                                </div>
                            ))}
                        </div>

                        {/* Main Quest */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1 border-b border-gray-400">Main Quest</h4>
                            {CAMPAIGN_MAPS.filter(m => m.category === "Main Quest").map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMapId(m.id)}
                                    className={`
                                        p-3 cursor-pointer transition-all border border-transparent rounded mb-1
                                        ${selectedMap.id === m.id
                                            ? "bg-red-900 text-white border-red-900 shadow-md font-bold"
                                            : "hover:bg-brown-200 hover:border-brown-400"}
                                    `}
                                >
                                    <div className="text-sm uppercase tracking-wider">{m.title}</div>
                                </div>
                            ))}
                        </div>

                        {/* Plot Twist */}
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1 border-b border-gray-400">Plot Twist</h4>
                            {CAMPAIGN_MAPS.filter(m => m.category === "Plot Twist").map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedMapId(m.id)}
                                    className={`
                                        p-3 cursor-pointer transition-all border border-transparent rounded mb-1
                                        ${selectedMap.id === m.id
                                            ? "bg-red-900 text-white border-red-900 shadow-md font-bold"
                                            : "hover:bg-brown-200 hover:border-brown-400"}
                                    `}
                                >
                                    <div className="text-sm uppercase tracking-wider">{m.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main View */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-black">
                    {/* Visual Map */}
                    <div className="flex-1 relative overflow-hidden">
                        <MechanicsDashboard currentMapId={selectedMap.id} />
                        <DiceRoller onRollComplete={(result) => {
                            const effect = getRegionalEffect(selectedMap.id);
                            // Wild Magic Trigger: d20 roll of 1
                            if (effect?.title.includes("Wild Magic") && result.dice.some(d => d.sides === 20 && d.val === 1)) {
                                const surge = rollWildMagic();
                                alert(`🔮 WILD MAGIC SURGE! 🔮\n\nYou rolled a Natural 1 in a magic-saturated zone.\n\nEFFECT [${surge.roll}]: ${surge.result}`);
                            }
                        }} />
                        <InteractiveMap
                            key={mapKey}
                            src={selectedMap.imagePath}
                            title={selectedMap.title}
                            gridType={selectedMap.gridType || "hex"}
                            nodes={selectedMap.nodes}
                            onNodeClick={(node) => {
                                alert(`[${node.type.toUpperCase()}] ${node.label}\n\n${node.description || "No details available."}`);
                            }}
                        />
                    </div>

                    {/* Info / Description Panel */}
                    <div className="h-[250px] bg-[#1a1a1a] border-t-4 border-accent text-gray-300 p-6 overflow-y-auto shrink-0 flex gap-8">
                        <div className="flex-1">
                            <h2 className="text-accent font-mono text-xl mb-4 border-b border-gray-700 pb-2">
                                {selectedMap.title}
                            </h2>
                            <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedMap.description}
                            </div>
                        </div>

                        {/* Mechanics Panel (if present) */}
                        <div className="flex flex-col gap-4">
                            {selectedMap.mechanics && selectedMap.mechanics.length > 0 && (
                                <div className="w-[300px] bg-gray-900 p-4 border border-gray-700 rounded h-fit">
                                    <h3 className="text-red-500 font-bold mb-3 text-sm tracking-widest border-b border-red-900 pb-1">
                                        ⚠️ REGIONAL MECHANICS
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedMap.mechanics.map((mech, i) => (
                                            <li key={i} className="text-xs flex gap-2">
                                                <span className="text-red-500">➤</span>
                                                <span>{mech}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Quest Guide (if present) */}
                            {selectedMap.questGuide && (
                                <div className="w-[300px] bg-yellow-900/20 p-4 border border-yellow-700/50 rounded h-fit">
                                    <h3 className="text-yellow-500 font-bold mb-3 text-sm tracking-widest border-b border-yellow-900 pb-1">
                                        🗺️ QUEST GUIDE
                                    </h3>
                                    <p className="text-xs text-yellow-100 italic whitespace-pre-wrap">
                                        {selectedMap.questGuide.replace(/\*\*/g, '')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY: DUNGEON MASTER REFERENCE SHEET */}
            <div className="print-only hidden p-8 bg-white text-black" style={{ display: 'none' }}>
                {/* Title Section */}
                <div className="mb-6 border-b-4 border-black pb-4">
                    <h1 className="text-4xl font-bold uppercase mb-2">{selectedMap.title}</h1>
                    <p className="text-lg italic text-gray-700">{selectedMap.description.split('\n')[0].replace(/\*\*/g, '')}</p>
                </div>

                {/* Regional Mechanics */}
                {selectedMap.mechanics && selectedMap.mechanics.length > 0 && (
                    <div className="mb-8 p-4 border-2 border-black bg-gray-100 break-inside-avoid">
                        <h2 className="text-2xl font-bold mb-4 uppercase flex items-center gap-2">
                            ⚠️ Regional Rules & Mechanics
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {selectedMap.mechanics.map((mech, i) => (
                                <li key={i} className="text-sm font-medium leading-relaxed">{mech}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Encounter Keys / Nodes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-6">Area Key & Encounters</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {selectedMap.nodes?.map((node, i) => (
                            <div key={i} className="break-inside-avoid border border-gray-300 p-4 rounded bg-gray-50">
                                <div className="flex justify-between items-start mb-2 border-b border-gray-200 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg bg-black text-white w-8 h-8 flex items-center justify-center rounded-full">
                                            {i + 1}
                                        </span>
                                        <span className="font-bold text-xl">{node.label}</span>
                                    </div>
                                    <span className={`
                                        text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                                        ${node.type === 'boss' ? 'bg-red-100 text-red-800' :
                                            node.type === 'loot' ? 'bg-green-100 text-green-800' :
                                                node.type === 'trap' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-200 text-gray-800'}
                                    `}>
                                        {node.type}
                                    </span>
                                </div>
                                <div className="pl-10">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 font-serif">
                                        {node.description || "No specific details available for this location."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    Proprietary Campaign Data • Heart&apos;s Curse • Do Not Distribute
                </div>
            </div>


            <style jsx global>{`
                @media print {
                    .retro-container > div:first-child,
                    .retro-border,
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                }
            `}</style>
        </div >
    );
}

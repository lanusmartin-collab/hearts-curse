"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InteractiveMap from "@/components/ui/InteractiveMap";
import DungeonModuleTemplate from "@/components/ui/DungeonModuleTemplate";
import { CAMPAIGN_MAPS, CampaignMap } from "@/lib/data/maps";
import { MechanicsDashboard } from "@/components/ui/MechanicsDashboard";
import RegionalMechanicsWidget from "@/components/ui/RegionalMechanicsWidget";
import PremiumGate from "@/components/auth/PremiumGate";
import { getRegionalEffect, rollWildMagic } from "@/lib/game/curseLogic";
import { useRouter, useSearchParams } from "next/navigation";
import {
    TOWN_DAY_TABLE, OAKHAVEN_MINES_TABLE, UNDERDARK_TRAVEL_TABLE,
    NETHERIL_RUINS_TABLE, SILENT_WARDS_TABLE, OUTSKIRTS_TABLE,
    LIBRARY_WHISPERS_TABLE, ARACH_TINILITH_TABLE, HEART_CHAMBER_TABLE, OSSUARY_TABLE,
    SPIRE_TABLE, DWARVEN_RUINS_TABLE, MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE
} from "@/lib/data/encounters";

import QuestJournal from "@/components/ui/QuestJournal";

export default function MapsPage() {
    const searchParams = useSearchParams();
    const initialMapId = searchParams.get('id') || CAMPAIGN_MAPS[0].id;
    const [selectedMapId, setSelectedMapId] = useState<string>(initialMapId);
    const [viewMode, setViewMode] = useState<"interactive" | "book">("interactive");
    const [showJournal, setShowJournal] = useState(false);
    const router = useRouter();

    const selectedMap = CAMPAIGN_MAPS.find(m => m.id === selectedMapId) || CAMPAIGN_MAPS[0];

    // Force Map to re-mount when map changes to reset state
    const mapKey = selectedMap.id;

    const handleRollEncounter = () => {
        let table = null;
        switch (selectedMapId) {
            case 'oakhaven': table = TOWN_DAY_TABLE; break;
            case 'mines': table = OAKHAVEN_MINES_TABLE; break;
            case 'underdark': table = UNDERDARK_TRAVEL_TABLE; break;
            case 'netheril': table = NETHERIL_RUINS_TABLE; break;
            case 'library': table = LIBRARY_WHISPERS_TABLE; break;
            case 'arach': table = ARACH_TINILITH_TABLE; break;
            case 'heart': table = HEART_CHAMBER_TABLE; break;
            case 'ossuary': table = OSSUARY_TABLE; break;
            case 'spire': table = SPIRE_TABLE; break;
            case 'silent_wards': table = SILENT_WARDS_TABLE; break;
            case 'outskirts': table = OUTSKIRTS_TABLE; break;
            case 'dwarven_ruins': table = DWARVEN_RUINS_TABLE; break;
            case 'mind_flayer': table = MIND_FLAYER_COLONY_TABLE; break;
            case 'beholder': table = BEHOLDER_LAIR_TABLE; break;
            default: table = null;
        }

        if (!table) {
            alert("No random encounter table defined for this zone.");
            return;
        }

        const roll = Math.floor(Math.random() * 20) + 1;
        const encounter = table.find(e => roll >= e.roll[0] && roll <= e.roll[1]);

        if (encounter) {
            // Encode data for URL
            const params = new URLSearchParams({
                roll: roll.toString(),
                name: encounter.name,
                desc: encounter.description,
                monsters: JSON.stringify(encounter.monsters || [])
            });
            router.push(`/encounters?${params.toString()}`);
        }
    };

    const handleMapSelect = (m: CampaignMap) => {
        if (m.route) {
            router.push(m.route);
        } else {
            setSelectedMapId(m.id);
        }
    };

    // [NEW] Global Dice Listener for Wild Magic
    useEffect(() => {
        const handleDiceEvent = (e: Event) => {
            const customEvent = e as CustomEvent;
            const result = customEvent.detail;

            const effect = getRegionalEffect(selectedMap.id);
            // Wild Magic Trigger: d20 roll of 1 in 'castle' id
            if (effect?.title.includes("Wild Magic") && result.dice.some((d: any) => d.sides === 20 && d.val === 1)) {
                const surge = rollWildMagic();
                alert(`🔮 WILD MAGIC SURGE! 🔮\n\nYou rolled a Natural 1 in a magic-saturated zone.\n\nEFFECT [${surge.roll}]: ${surge.result}`);
            }
        };

        window.addEventListener('dice-roll-complete', handleDiceEvent);
        return () => window.removeEventListener('dice-roll-complete', handleDiceEvent);
    }, [selectedMap.id]);

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
                    <Link href="/" className="retro-btn bg-red-900 text-white text-xs px-3 py-1 no-underline hover:bg-red-700 animate-heartbeat">Back to Main Menu</Link>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Grimoire Style */}
                <div className="grimoire-sidebar w-[300px] flex flex-col shrink-0 overflow-hidden z-20">
                    <div className="grimoire-header">
                        <h3 className="grimoire-title">REALM ATLAS</h3>
                        <div className="flex gap-2 justify-center mt-2">
                            <button onClick={handleRollEncounter} className="text-xs bg-red-900/50 border border-red-700 text-red-100 px-3 py-1 rounded animate-heartbeat hover:bg-red-800 transition-colors uppercase tracking-widest" title="Determine Fate">
                                ⚔️ Roll
                            </button>
                            <button onClick={() => setShowJournal(true)} className="text-xs bg-amber-900/50 border border-amber-700 text-amber-100 px-3 py-1 rounded hover:bg-amber-800 transition-colors uppercase tracking-widest" title="Open Quest Log">
                                📜 Journal
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {/* Town / Uncategorized */}
                        <div className="grimoire-category">
                            <h4 className="grimoire-cat-header">Oakhaven Region</h4>
                            {CAMPAIGN_MAPS.filter(m => !m.category).map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => handleMapSelect(m)}
                                    className={`grimoire-item ${selectedMap.id === m.id ? 'active' : ''} animate-heartbeat`}
                                    style={{ animationDelay: `${Math.random() * 2}s` }} /* Randomize beat */
                                >
                                    <span>{m.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Main Quest */}
                        <div className="grimoire-category">
                            <h4 className="grimoire-cat-header">Main Quest</h4>
                            {CAMPAIGN_MAPS.filter(m => m.category === "Main Quest").map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => handleMapSelect(m)}
                                    className={`grimoire-item ${selectedMap.id === m.id ? 'active' : ''} animate-heartbeat`}
                                    style={{ animationDelay: `${Math.random() * 2}s` }}
                                >
                                    <span>{m.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Plot Twist */}
                        <div className="grimoire-category">
                            <h4 className="grimoire-cat-header">Hidden Truths</h4>
                            {CAMPAIGN_MAPS.filter(m => m.category === "Plot Twist").map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => handleMapSelect(m)}
                                    className={`grimoire-item ${selectedMap.id === m.id ? 'active' : ''} animate-heartbeat`}
                                    style={{ animationDelay: `${Math.random() * 2}s` }}
                                >
                                    <span>{m.title}</span>
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

                        {showJournal && <QuestJournal onClose={() => setShowJournal(false)} />}

                        {/* NEW: Regional Mechanics HUD Widget */}
                        <div className="absolute top-0 left-0 z-30 pointer-events-none w-full h-full">
                            <RegionalMechanicsWidget
                                mechanics={selectedMap.mechanics || []}
                                curseLevel={selectedMap.id === 'heart' ? 'Critical' : (selectedMap.id === 'silent_wards' ? 'High' : 'Low')}
                                faction={selectedMap.id.includes('town') ? 'Zhentarim' : undefined}
                            />
                        </div>

                        {selectedMap.id !== 'oakhaven' ? (
                            <div className="w-full h-full p-8 flex items-center justify-center bg-[#050505]">
                                <PremiumGate feature={`Map: ${selectedMap.title}`}>
                                    <InteractiveMap
                                        key={mapKey}
                                        src={selectedMap.imagePath}
                                        title={selectedMap.title}
                                        gridType={selectedMap.gridType || "hex"}
                                        nodes={selectedMap.nodes}
                                        onNodeClick={(node) => {
                                            if (node.link) {
                                                router.push(node.link);
                                            } else {
                                                alert(`[${node.type.toUpperCase()}] ${node.label}\n\n${node.description || "No details available."}`);
                                            }
                                        }}
                                    />
                                </PremiumGate>
                            </div>
                        ) : (
                            <InteractiveMap
                                key={mapKey}
                                src={selectedMap.imagePath}
                                title={selectedMap.title}
                                gridType={selectedMap.gridType || "hex"}
                                nodes={selectedMap.nodes}
                                onNodeClick={(node) => {
                                    if (node.link) {
                                        router.push(node.link);
                                    } else {
                                        alert(`[${node.type.toUpperCase()}] ${node.label}\n\n${node.description || "No details available."}`);
                                    }
                                }}
                            />
                        )}
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

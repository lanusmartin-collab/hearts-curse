"use client";

import { Plus, Save, Trash2, Crosshair, Edit, Move, Upload, FolderUp, Swords, Skull, ShieldAbsorb } from "lucide-react";
import StatblockCard from "@/components/ui/StatblockCard";
import { STATBLOCKS } from "@/lib/data/statblocks";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { useState, useEffect } from "react";
import Link from "next/link";
import InteractiveMap from "@/components/ui/InteractiveMap";
import DungeonModuleTemplate from "@/components/ui/DungeonModuleTemplate";
import { CAMPAIGN_MAPS, CampaignMap, MapNode } from "@/lib/data/maps";
import RegionalMechanicsWidget from "@/components/ui/RegionalMechanicsWidget";
import PremiumGate from "@/components/auth/PremiumGate";
import { rollWildMagic } from "@/lib/game/curseLogic";
import { useRouter, useSearchParams } from "next/navigation";
import {
    TOWN_DAY_TABLE, OAKHAVEN_MINES_TABLE, UNDERDARK_TRAVEL_TABLE,
    NETHERIL_RUINS_TABLE, SILENT_WARDS_TABLE, OUTSKIRTS_TABLE,
    LIBRARY_WHISPERS_TABLE, ARACH_TINILITH_TABLE, HEART_CHAMBER_TABLE, OSSUARY_TABLE,
    SPIRE_TABLE, DWARVEN_RUINS_TABLE, MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE
} from "@/lib/data/encounters";

import QuestJournal from "@/components/ui/QuestJournal";
import MapNodeEditor from "@/components/ui/MapNodeEditor";

export default function MapsClient() {
    const searchParams = useSearchParams();
    const initialMapId = searchParams.get('id') || CAMPAIGN_MAPS[0].id;
    const [selectedMapId, setSelectedMapId] = useState<string>(initialMapId);
    const [viewMode, setViewMode] = useState<"interactive" | "book">("interactive");
    const [showJournal, setShowJournal] = useState(false);
    const router = useRouter();

    // Map Data State (For Editing)
    const selectedMap = CAMPAIGN_MAPS.find(m => m.id === selectedMapId) || CAMPAIGN_MAPS[0];
    const [mapNodes, setMapNodes] = useState<MapNode[]>([]);

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [editingNode, setEditingNode] = useState<MapNode | null>(null);
    const [viewingStatblock, setViewingStatblock] = useState<string | null>(null); // Slug or ID

    // Force Map to re-mount when map changes to reset state
    const mapKey = selectedMap.id;

    // Update from URL if it changes
    useEffect(() => {
        const id = searchParams.get('id');
        if (id && id !== selectedMapId) {
            setSelectedMapId(id);
        }
    }, [searchParams]);

    // Initialize nodes when map changes
    useEffect(() => {
        setMapNodes(selectedMap.nodes || []);
    }, [selectedMapId, selectedMap]);

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

    const handleWildMagic = () => {
        const result = rollWildMagic(1);
        alert(`WILD MAGIC SURGE!\n\nYou rolled a ${result.roll} using a 1d20.\n\nEFFECT: ${result.effect}`);
    };

    const handleMapSelect = (m: CampaignMap) => {
        if (m.route) {
            router.push(m.route);
        } else {
            // Update URL shallowly
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('id', m.id);
            window.history.pushState({}, '', newUrl);
            setSelectedMapId(m.id);
        }
    };

    // Editor Handlers
    const handleNodeMove = (id: string, x: number, y: number) => {
        setMapNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
    };

    const handleMapClick = (x: number, y: number) => {
        if (!isEditing) return;
        const newNode: MapNode = {
            id: `node_${Date.now()}`,
            x, y,
            label: "New Location",
            type: "info",
            description: "Description pending..."
        };
        setMapNodes(prev => [...prev, newNode]);
        setEditingNode(newNode); // Open editor immediately
    };

    // Selection Handler (Distinguish between Edit/View)
    const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

    const onNodeClick = (node: MapNode) => {
        if (isEditing) {
            setEditingNode(node);
        } else {
            setSelectedNode(node);
        }
    };

    const handleNodeSave = (updatedNode: MapNode) => {
        setMapNodes(prev => prev.map(n => n.id === updatedNode.id ? updatedNode : n));
        setEditingNode(null);
    };

    const handleNodeDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this node?")) {
            setMapNodes(prev => prev.filter(n => n.id !== id));
            setEditingNode(null);
        }
    };

    const handleExport = () => {
        const json = JSON.stringify(mapNodes, null, 4);
        navigator.clipboard.writeText(json).then(() => {
            alert("Map Nodes JSON copied to clipboard!\n\nPaste this into src/lib/data/maps.ts under the 'nodes' array for this map.");
        });
    };

    return (
        <PremiumGate feature="Interactive Maps">
            <div className="retro-container h-screen flex flex-col overflow-hidden">
                <header className="shrink-0 mb-4 flex justify-between items-end border-b border-gray-600 pb-2">
                    <div>
                        <h1 className="text-3xl text-shadow-neon text-red-500 font-bold font-header">
                            CAMPAIGN CARTOGRAPHY
                        </h1>
                        <p className="text-gray-400 font-mono text-sm">
                            ZONE: {selectedMap.title.toUpperCase()}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex bg-gray-900 rounded border border-gray-700 p-1">
                            <button
                                onClick={() => setViewMode("interactive")}
                                className={`px-3 py-1 text-xs rounded transition ${viewMode === "interactive" ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"}`}
                            >
                                MAP VIEW
                            </button>
                            <button
                                onClick={() => setViewMode("book")}
                                className={`px-3 py-1 text-xs rounded transition ${viewMode === "book" ? "bg-red-900 text-white" : "text-gray-400 hover:text-white"}`}
                            >
                                GUIDE VIEW
                            </button>
                        </div>
                        <button onClick={() => setShowJournal(!showJournal)} className="retro-btn text-xs flex gap-2 items-center">
                            <FolderUp size={14} /> JOURNAL
                        </button>
                    </div>
                </header>

                {/* Mechanics Widget */}
                <div className="mb-4 shrink-0 pointer-events-none relative z-20">
                    <RegionalMechanicsWidget
                        mechanics={selectedMap.mechanics || []}
                        curseLevel="Active"
                        faction="Neutral"
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex gap-4 min-h-0 relative">
                    {/* LEFT: Map / Content */}
                    <div className="flex-1 bg-black border border-gray-700 relative overflow-hidden shadow-inner flex flex-col">

                        {/* DM Tools Overlay */}
                        <div className="absolute top-2 left-2 z-10 flex gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-3 py-1 text-xs font-bold border rounded shadow-lg transition-colors ${isEditing ? "bg-yellow-600 text-black border-yellow-400 animate-pulse" : "bg-gray-900 text-gray-400 border-gray-600 hover:text-white"}`}
                            >
                                <Edit size={14} /> {isEditing ? "DM EDITING ACTIVE" : "DM TOOLS"}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-3 py-1 text-xs font-bold bg-green-800 text-green-100 border border-green-600 rounded hover:bg-green-700 shadow-lg"
                                >
                                    <Upload size={14} /> EXPORT JSON
                                </button>
                            )}
                        </div>

                        {/* View Modes */}
                        {viewMode === "interactive" ? (
                            <div className="w-full h-full relative">
                                <InteractiveMap
                                    key={mapKey}
                                    src={selectedMap.imagePath}
                                    title={selectedMap.title}
                                    nodes={mapNodes}
                                    onNodeClick={onNodeClick}
                                    gridType={selectedMap.gridType as "hex" | "square" | "none"}
                                    isEditing={isEditing}
                                    onNodeMove={handleNodeMove}
                                    onMapClick={handleMapClick}
                                />

                                {/* Editor Modal (If Editing Node) */}
                                {editingNode && (
                                    <MapNodeEditor
                                        node={editingNode}
                                        onSave={handleNodeSave}
                                        onCancel={() => setEditingNode(null)}
                                        onDelete={handleNodeDelete}
                                    />
                                )}
                            </div>
                        ) : (
                            <DungeonModuleTemplate
                                title={selectedMap.title}
                                minLevel={1} maxLevel={20}
                                summary={selectedMap.description || "No data available."}
                                quests={[]}
                                npcs={[]}
                                secrets={[]}
                            >
                                <div className="p-4 text-gray-300 whitespace-pre-wrap font-serif">
                                    {selectedMap.questGuide || selectedMap.description}
                                </div>
                            </DungeonModuleTemplate>
                        )}

                        {/* Journal Overlay */}
                        {showJournal && (
                            <div className="absolute inset-0 bg-black/90 z-40 p-8 overflow-auto animate-in slide-in-from-right duration-300">
                                <button onClick={() => setShowJournal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">CLOSE [x]</button>
                                <QuestJournal />
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Sidebar Navigation & Details */}
                    <div className="w-[320px] shrink-0 flex flex-col gap-4 overflow-hidden">

                        {/* Minimap Selector */}
                        <div className="bg-paper-texture p-4 text-black border border-gray-600 shrink-0 shadow-lg">
                            <h3 className="font-bold border-b border-black mb-2 text-xs uppercase tracking-widest">Select Region</h3>
                            <select
                                className="w-full p-2 bg-white/50 border border-gray-800 font-mono text-sm"
                                value={selectedMapId}
                                onChange={(e) => {
                                    const m = CAMPAIGN_MAPS.find(x => x.id === e.target.value);
                                    if (m) handleMapSelect(m);
                                }}
                            >
                                {CAMPAIGN_MAPS.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-4 flex gap-2">
                                <button onClick={handleRollEncounter} className="flex-1 bg-black text-white px-2 py-2 text-xs font-bold hover:bg-gray-800 border border-gray-900 flex items-center justify-center gap-1">
                                    <Swords size={12} /> ENCOUNTER
                                </button>
                                <button onClick={handleWildMagic} className="flex-1 bg-pink-900 text-white px-2 py-2 text-xs font-bold hover:bg-pink-800 border border-pink-700 flex items-center justify-center gap-1">
                                    <ShieldAbsorb size={12} /> WILD MAGIC
                                </button>
                            </div>
                        </div>

                        {/* Selected Node Details */}
                        <div className="flex-1 bg-gray-900 border border-gray-700 p-4 text-gray-300 overflow-y-auto custom-scrollbar shadow-lg">
                            {selectedNode ? (
                                <div className="animate-fade-in block">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-700 pb-2">
                                        <h2 className="text-xl font-bold text-white leading-tight">{selectedNode.label}</h2>
                                        <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-white"><Crosshair size={16} /></button>
                                    </div>

                                    <div className="font-mono text-[10px] uppercase text-gray-500 mb-4 flex gap-2">
                                        <span className="bg-gray-800 px-1 rounded">ID: {selectedNode.id}</span>
                                        <span className={`px-1 rounded ${selectedNode.type === 'boss' ? 'bg-red-900 text-white' : 'bg-blue-900 text-white'}`}>
                                            TYPE: {selectedNode.type}
                                        </span>
                                    </div>

                                    <div className="prose prose-invert prose-sm">
                                        <p>{selectedNode.description || "No description provided."}</p>
                                    </div>

                                    {/* Link Button */}
                                    {selectedNode.link && (
                                        <Link href={selectedNode.link} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white text-center py-2 rounded flex items-center justify-center gap-2 transition-colors">
                                            <Move size={16} /> NAVIGATE TO DESTINATION
                                        </Link>
                                    )}

                                    {/* Threat Analysis / Monsters */}
                                    {(selectedNode.type === 'boss' || (selectedNode.monsters && selectedNode.monsters.length > 0)) && (
                                        <div className="mt-6 pt-4 border-t border-gray-700">
                                            <h3 className="font-bold text-red-500 mb-3 flex items-center gap-2">
                                                <Skull size={18} /> DETECTED THREATS
                                            </h3>

                                            <div className="space-y-2">
                                                {/* Check if ID maps to a statblock (Boss default) */}
                                                {(STATBLOCKS[selectedNode.id] || (selectedNode.itemId && STATBLOCKS[selectedNode.itemId])) && (
                                                    <button
                                                        onClick={() => setViewingStatblock(selectedNode.id in STATBLOCKS ? selectedNode.id : selectedNode.itemId!)}
                                                        className="w-full text-left p-3 bg-red-900/30 border border-red-800 hover:border-red-500 hover:bg-red-900/50 rounded transition-all group"
                                                    >
                                                        <div className="font-bold text-red-200 group-hover:text-white flex justify-between items-center">
                                                            {STATBLOCKS[selectedNode.id in STATBLOCKS ? selectedNode.id : selectedNode.itemId!].name}
                                                            <Swords size={16} />
                                                        </div>
                                                        <div className="text-xs text-red-400 mt-1">CR {STATBLOCKS[selectedNode.id in STATBLOCKS ? selectedNode.id : selectedNode.itemId!].cr} • {STATBLOCKS[selectedNode.id in STATBLOCKS ? selectedNode.id : selectedNode.itemId!].type}</div>
                                                    </button>
                                                )}

                                                {/* Check monster list */}
                                                {selectedNode.monsters?.map(slug => {
                                                    const m = MONSTERS_2024[slug] || STATBLOCKS[slug];
                                                    if (!m) return null;
                                                    return (
                                                        <button
                                                            key={slug}
                                                            onClick={() => setViewingStatblock(slug)}
                                                            className="w-full text-left p-3 bg-gray-800 border border-gray-700 hover:border-gray-500 rounded transition-all group"
                                                        >
                                                            <div className="font-bold text-gray-300 group-hover:text-white flex justify-between items-center">
                                                                {m.name}
                                                                <ShieldAbsorb size={14} />
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">CR {m.cr} • {m.type}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                                    <div className="p-4 rounded-full bg-gray-800/50">
                                        <Crosshair size={48} className="text-gray-700" />
                                    </div>
                                    <p className="font-mono text-sm">SELECT_SECTOR_TO_ANALYZE</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statblock Overlay Modal */}
                {viewingStatblock && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200" onClick={() => setViewingStatblock(null)}>
                        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-950 rounded-lg shadow-2xl border border-stone-800" onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 right-0 p-2 flex justify-end bg-stone-950/90 backdrop-blur z-10 border-b border-stone-800">
                                <button
                                    onClick={() => setViewingStatblock(null)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    CLOSE [X]
                                </button>
                            </div>
                            <StatblockCard data={MONSTERS_2024[viewingStatblock] || STATBLOCKS[viewingStatblock] || { name: "Unknown Entity", type: "Unknown", cr: "0", hp: 10, ac: 10, stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, saves: "", skills: "", languages: "", traits: [], actions: [] }} />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    Proprietary Campaign Data • Heart&apos;s Curse • Do Not Distribute
                </div>
            </div>
        </PremiumGate>
    );
}

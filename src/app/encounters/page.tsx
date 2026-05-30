"use client";

import { useState, useEffect, Suspense } from "react";
import { TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE, SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE, UNDERDARK_TRAVEL_TABLE, OAKHAVEN_MINES_TABLE, NETHERIL_RUINS_TABLE, OSSUARY_TABLE, ARACH_TINILITH_TABLE, CASTLE_MOURNWATCH_TABLE, CASTLE_EXTERIOR_TABLE, CATACOMBS_DESPAIR_TABLE, DWARVEN_RUINS_TABLE, MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE, THAY_EMBASSY_TABLE, Encounter } from "@/lib/data/encounters";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { Statblock } from "@/lib/data/statblocks";
import StatblockCard from "@/components/ui/StatblockCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dices, Map as MapIcon, ChevronDown, Activity, Search, ShieldAlert, Skull, BookOpen, Scroll, ArrowRight, Home, Sparkles, Swords } from "lucide-react";

// --- Navigation Data ---
const REGIONS = [
    { id: "sector-01", name: "Sector 01: Oakhaven" },
    { id: "sector-01-5", name: "Sector 01.5: Mournwatch" },
    { id: "sector-02", name: "Sector 02: The Depths" },
];

const TABLES_BY_REGION: Record<string, { id: string, name: string, table: Encounter[] }[]> = {
    "sector-01": [
        { id: "town_day", name: "Oakhaven (Day)", table: TOWN_DAY_TABLE },
        { id: "town_night", name: "Oakhaven (Night)", table: TOWN_NIGHT_TABLE },
        { id: "outskirts", name: "The Outskirts", table: OUTSKIRTS_TABLE },
        { id: "ambush", name: "Shop Ambush", table: SHOP_AMBUSH_TABLE },
        { id: "thay_embassy", name: "Thay Embassy", table: THAY_EMBASSY_TABLE },
    ],
    "sector-01-5": [
        { id: "castle_exterior", name: "Castle Exterior", table: CASTLE_EXTERIOR_TABLE },
        { id: "castle", name: "Castle Mournwatch", table: CASTLE_MOURNWATCH_TABLE },
        { id: "heart", name: "Heart Chamber", table: HEART_CHAMBER_TABLE },
        { id: "silent", name: "Silent Wards", table: SILENT_WARDS_TABLE },
        { id: "netheril", name: "Netheril Void", table: NETHERIL_RUINS_TABLE },
        { id: "library", name: "Library of Whispers", table: LIBRARY_WHISPERS_TABLE },
        { id: "catacombs", name: "Catacombs", table: CATACOMBS_DESPAIR_TABLE },
        { id: "ossuary", name: "The Ossuary", table: OSSUARY_TABLE },
    ],
    "sector-02": [
        { id: "mines", name: "Oakhaven Mines", table: OAKHAVEN_MINES_TABLE },
        { id: "dwarven", name: "Dwarven Ruins", table: DWARVEN_RUINS_TABLE },
        { id: "underdark", name: "Deep Travel", table: UNDERDARK_TRAVEL_TABLE },
        { id: "mindflayer", name: "Synaptic Deep", table: MIND_FLAYER_COLONY_TABLE },
        { id: "beholder", name: "Eye's Domain", table: BEHOLDER_LAIR_TABLE },
        { id: "drow", name: "Arach Tinilith", table: ARACH_TINILITH_TABLE },
    ],
};

// Helper to split description into Flavor (Narrative) and Mechanics
const parseDescription = (desc: string) => {
    // Check for "SCENE:" and "MECHANIC:" or "COMBAT:" markers
    if (!desc) return { flavor: "No description available.", mechanic: null };

    // Simple regex-like split if formatted
    // Fixed: Removed /s flag, used [\s\S] for multiline match for compatibility
    const sceneMatch = desc.match(/SCENE:\s*([\s\S]*?)(?=\s*(MECHANIC:|COMBAT:|TACTIC:|INTERACTION:|REVEAL:|$))/);
    const detailMatch = desc.match(/(MECHANIC:|COMBAT:|TACTIC:|INTERACTION:|REVEAL:)([\s\S]*)/);

    if (sceneMatch) {
        return {
            flavor: sceneMatch[1].trim(),
            mechanic: detailMatch ? detailMatch[0].trim() : null
        };
    }

    // Default Fallback
    return { flavor: desc, mechanic: null };
};

export default function EncountersPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#0a0a0c] text-[#8b7e66] flex items-center justify-center font-header animate-pulse">Consulting the Archives...</div>}>
            <GrimoireInterface />
        </Suspense>
    );
}

function GrimoireInterface() {
    // --- State ---
    const [selectedRegionId, setSelectedRegionId] = useState("sector-01");
    const [selectedTableId, setSelectedTableId] = useState("town_day");
    const [currentEncounter, setCurrentEncounter] = useState<Encounter | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [allStatblocks, setAllStatblocks] = useState<Record<string, Statblock>>(MONSTERS_2024);
    const router = useRouter();

    // Derived
    const currentTables = TABLES_BY_REGION[selectedRegionId] || [];
    const activeTableObj = currentTables.find(t => t.id === selectedTableId) || currentTables[0];
    const activeTable = activeTableObj?.table || [];

    // --- Actions ---
    const rollEncounter = () => {
        setIsRolling(true);
        setCurrentEncounter(null);
        setTimeout(() => {
            const d20 = Math.floor(Math.random() * 20) + 1;
            const match = activeTable.find(enc => d20 >= enc.roll[0] && d20 <= enc.roll[1]);
            if (match) setCurrentEncounter(match);
            setIsRolling(false);
        }, 600);
    };

    const handleForceSelect = (idx: string) => {
        const i = parseInt(idx);
        if (!isNaN(i) && activeTable[i]) {
            setCurrentEncounter(activeTable[i]);
        }
    };

    const loadCustom = () => {
        const saved = localStorage.getItem('custom_statblocks');
        if (saved) {
            const custom: Statblock[] = JSON.parse(saved);
            const merged = { ...MONSTERS_2024 };
            custom.forEach((sb, idx) => {
                const slug = `custom-${sb.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`;
                merged[slug] = sb;
            });
            setAllStatblocks(merged);
        }
    };
    useEffect(loadCustom, []);

    // Parsed Content
    const { flavor, mechanic } = currentEncounter ? parseDescription(currentEncounter.description) : { flavor: "", mechanic: null };

    return (
        <div className="encounters-page min-h-[100dvh] lg:h-screen w-full flex flex-col lg:flex-row bg-[#050505] lg:overflow-hidden font-serif">

            {/* LEFT SIDEBAR: THE SPINE (Controls) */}
            <div className="w-full lg:w-[360px] h-auto lg:h-full flex flex-col shrink-0 relative z-40 bg-[#111] border-b lg:border-r border-[#333] lg:shadow-2xl">
                {/* Book Spine Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('/textures/leather_dark.png')", backgroundSize: 'cover' }}></div>

                {/* Header (Adjusted padding for mobile) */}
                <div className="p-4 lg:p-8 pt-8 lg:pt-32 pb-4 lg:pb-6 border-b border-[#3a0b0b] bg-gradient-to-b from-[#1a0505] to-transparent relative z-10">
                    <h1 className="text-2xl lg:text-3xl font-header text-[#e0e0e0] tracking-[0.1em] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-[#8a1c1c] pb-2 mb-2">
                        COMPENDIUM
                    </h1>
                    <div className="text-center text-[10px] font-mono text-[#888] tracking-[0.4em] uppercase">
                        Threat Registry
                    </div>
                </div>

                <div className="flex-1 overflow-visible lg:overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6 lg:space-y-10 relative z-10">

                    {/* Region Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8a1c1c] uppercase tracking-widest flex items-center gap-2 mb-1">
                            <MapIcon size={12} /> Geographic Zone
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedRegionId}
                                onChange={(e) => {
                                    setSelectedRegionId(e.target.value);
                                    const first = TABLES_BY_REGION[e.target.value]?.[0];
                                    if (first) { setSelectedTableId(first.id); setCurrentEncounter(null); }
                                }}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-[#ccc] p-3 text-sm font-serif rounded-sm outline-none focus:border-[#a32222] appearance-none shadow-black shadow-inner transition-colors group-hover:border-[#555] cursor-pointer tracking-wide"
                            >
                                {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-[#666] pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Table Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8a1c1c] uppercase tracking-widest flex items-center gap-2 mb-1">
                            <Scroll size={12} /> Biome / Context
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedTableId}
                                onChange={(e) => { setSelectedTableId(e.target.value); setCurrentEncounter(null); }}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-[#ccc] p-3 text-sm font-serif rounded-sm outline-none focus:border-[#a32222] appearance-none shadow-black shadow-inner transition-colors group-hover:border-[#555] cursor-pointer tracking-wide"
                            >
                                {currentTables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-[#666] pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* ROLL BUTTON (Renamed) */}
                    <div className="pt-4">
                        <button
                            onClick={rollEncounter}
                            disabled={isRolling}
                            className="w-full relative group overflow-hidden bg-[#220a0a] border border-[#5c1212] text-[#d4af37] py-4 px-2 rounded-sm transition-all hover:bg-[#3a0b0b] hover:border-[#8a1c1c] hover:shadow-[0_0_20px_rgba(138,28,28,0.4)] active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <Dices className={`text-[#8a1c1c] group-hover:text-[#ff3333] transition-colors ${isRolling ? 'animate-spin' : ''}`} size={24} />
                                <span className="font-header font-bold text-lg tracking-[0.2em] uppercase">
                                    {isRolling ? "Rolling..." : "Roll Encounter"}
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Quick Select */}
                    <div className="pt-8 border-t border-[#333] mt-4">
                        <div className="relative">
                            <label className="absolute -top-2 left-2 px-1 bg-[#111] text-[9px] text-[#666] tracking-widest">QUICK SELECT</label>
                            <select
                                onChange={(e) => handleForceSelect(e.target.value)}
                                value=""
                                className="w-full bg-[#0a0a0a] border border-[#222] text-[#888] p-2 pl-3 pr-6 text-xs font-mono rounded-sm outline-none hover:border-[#444] focus:border-[#a32222] transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select specific scenario...</option>
                                {activeTable.map((enc, idx) => (
                                    <option key={idx} value={idx}>
                                        {enc.name}
                                    </option>
                                ))}
                            </select>
                            <Search size={12} className="absolute right-2 top-2.5 text-[#333] pointer-events-none" />
                        </div>
                    </div>

                </div>

                <div className="p-4 bg-[#080808] border-t border-[#222] grid grid-cols-3 gap-2 text-center relative z-10">
                    <Link href="/" className="flex flex-col items-center justify-center group gap-1">
                        <Home size={16} className="text-[#444] group-hover:text-[#e0e0e0] transition-colors" />
                        <span className="text-[8px] lg:text-[9px] font-bold text-[#444] group-hover:text-[#e0e0e0] uppercase tracking-widest transition-colors truncate w-full">Home</span>
                    </Link>
                    <Link href="/statblocks" className="flex flex-col items-center justify-center group gap-1">
                        <Skull size={16} className="text-[#444] group-hover:text-[#e0e0e0] transition-colors" />
                        <span className="text-[8px] lg:text-[9px] font-bold text-[#444] group-hover:text-[#e0e0e0] uppercase tracking-widest transition-colors truncate w-full">Compendium</span>
                    </Link>
                    <Link href="/maps" className="flex flex-col items-center justify-center group gap-1">
                        <MapIcon size={16} className="text-[#444] group-hover:text-[#e0e0e0] transition-colors" />
                        <span className="text-[8px] lg:text-[9px] font-bold text-[#444] group-hover:text-[#e0e0e0] uppercase tracking-widest transition-colors truncate w-full">Maps</span>
                    </Link>
                </div>
            </div>

            {/* RIGHT AREA: THE PAGE (Content) */}
            <div className="flex-1 bg-[#1a1a1c] relative lg:overflow-hidden flex flex-col items-center justify-start lg:justify-center p-2 lg:p-12 min-h-[50vh]">
                {/* Wood/Desk Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "url('/textures/wood_table_dark.jpg')", backgroundSize: 'cover' }}></div>

                {/* PARCHMENT SHEET */}
                <div className="w-full h-full max-w-6xl mx-auto bg-[#e8dcc5] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col animate-slide-up rounded-sm border-2 border-[#d8ccb5]" style={{ backgroundImage: "url('/textures/parchment.jpg')", backgroundSize: 'cover' }}>

                    {/* Overlay Grunge */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply" style={{ backgroundImage: "url('/textures/noise.png')" }}></div>

                    {/* Content Header */}
                    {currentEncounter && (
                        <div className="p-4 lg:p-8 pb-4 border-b-2 border-[#2c1a1a] border-double flex justify-between items-start shrink-0 bg-[#dcc9a3]/30 relative z-10">
                            <div>
                                <h2 className="text-2xl lg:text-5xl font-header font-bold text-[#2c1a1a] drop-shadow-sm leading-none mb-2">
                                    {currentEncounter.name}
                                </h2>
                                <div className="text-[#8a1c1c] font-serif italic text-xs lg:text-sm tracking-wide flex items-center gap-3">
                                    <span>{REGIONS.find(r => r.id === selectedRegionId)?.name} — {activeTableObj?.name}</span>
                                    <button
                                        onClick={() => {
                                            // Simple heuristic jump to maps
                                            let mapId = 'oakhaven';
                                            if (selectedRegionId === 'sector-01-5') mapId = 'castle';
                                            if (selectedRegionId === 'sector-02') mapId = 'underdark';
                                            router.push(`/maps?id=${mapId}`);
                                        }}
                                        className="flex items-center gap-1 bg-[#8a1c1c]/10 hover:bg-[#8a1c1c]/20 px-2 py-1 rounded border border-[#8a1c1c]/30 transition-colors pointer-events-auto cursor-pointer"
                                    >
                                        <MapIcon size={12} /> View on Map
                                    </button>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-xs font-bold text-[#555] uppercase tracking-widest mb-1">Encounter</span>
                                <div className="w-12 h-12 rounded-full border-2 border-[#2c1a1a] flex items-center justify-center font-mono text-xl font-bold text-[#2c1a1a]">
                                    {currentEncounter.roll[0]}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Body */}
                    <div className="flex-1 lg:overflow-y-auto custom-scrollbar p-4 lg:p-12 space-y-6 lg:space-y-10 relative z-10">
                        {currentEncounter ? (
                            <>
                                {/* NARRATIVE BLOCK (Flavor) */}
                                <div className="relative pl-8 border-l-4 border-[#8a1c1c]">
                                    <h3 className="absolute -top-6 left-0 text-[#8a1c1c] text-xs font-bold uppercase tracking-widest bg-none mb-2">Narrative</h3>
                                    <p className="text-2xl lg:text-3xl text-[#1a1a1a] font-serif leading-relaxed drop-shadow-sm">
                                        “{flavor}”
                                    </p>
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams({ context: flavor });
                                            router.push(`/oracle?${params.toString()}`);
                                        }}
                                        className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a1c1c] hover:text-[#ff3333] transition-colors"
                                    >
                                        <Sparkles size={14} /> Consult Oracle
                                    </button>
                                </div>

                                {/* MECHANICS BLOCK (DM Info) */}
                                {mechanic && (
                                    <div className="bg-[#d8ccb5]/40 border border-[#bfae95] p-6 rounded-sm">
                                        <h3 className="text-[#555] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <ShieldAlert size={14} /> Encounter Mechanics
                                        </h3>
                                        <p className="text-[#2c1a1a] font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                            {mechanic}
                                        </p>
                                    </div>
                                )}

                                {/* STATBLOCKS GRID */}
                                {currentEncounter.monsters && currentEncounter.monsters.length > 0 && (
                                    <div className="pt-6 border-t border-[#2c1a1a]/20">
                                        <div className="flex justify-between items-end mb-6">
                                            <h3 className="text-[#2c1a1a] font-header text-xl font-bold uppercase tracking-widest m-0 flex items-center gap-2">
                                                <Skull size={20} className="text-[#8a1c1c]" /> Bestiary
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    const currentMonsters = Array.from(new Set(currentEncounter.monsters));
                                                    const existing = JSON.parse(localStorage.getItem('combat_tracker_queue') || '[]');
                                                    const toAdd = currentMonsters.map(m => ({ slug: m, hp: allStatblocks[m]?.hp || 10, init: 0 }));
                                                    localStorage.setItem('combat_tracker_queue', JSON.stringify([...existing, ...toAdd]));
                                                    alert("Added to Combat Tracker!");
                                                }}
                                                className="bg-[#2c1a1a] text-[#e8dcc5] hover:bg-[#8a1c1c] text-xs font-bold uppercase px-3 py-1 rounded shadow transition-colors flex items-center gap-2"
                                            >
                                                <Swords size={14} /> Send to Tracker
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                            {Array.from(new Set(currentEncounter.monsters)).map(slug => {
                                                const data = allStatblocks[slug];
                                                if (!data) return null;
                                                return (
                                                    <div key={slug} className="break-inside-avoid shadow-lg bg-[#f0e6d2] p-2 rounded-sm border border-[#d8ccb5] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                                        {/* Force Light Mode Statblock */}
                                                        <div className="mix-blend-normal">
                                                            <StatblockCard data={data} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[#5c1212] opacity-30 select-none pb-20">
                                <BookOpen size={120} strokeWidth={1} className="mb-8" />
                                <div className="font-header text-4xl tracking-[0.2em] font-bold uppercase text-center text-[#2c1a1a]">
                                    Grimoire Open
                                </div>
                                <div className="font-serif italic text-lg mt-4 text-[#555] max-w-md text-center">
                                    "The stories are written in blood and shadow. Roll the bones to reveal their fate."
                                </div>
                            </div>
                        )}

                        <div className="h-20"></div> {/* Bottom Padding */}
                    </div>
                </div>
            </div>
        </div>
    );
}

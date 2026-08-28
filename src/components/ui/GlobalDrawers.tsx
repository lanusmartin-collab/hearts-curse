"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
    Skull, Scroll, Sparkles, PenTool, X, Search, ArrowLeft, Plus, Swords, ChevronLeft, ChevronRight
} from "lucide-react";
import clsx from "clsx";

// Spell & Monster Data Imports
import { ALL_SPELLS, Spell } from "@/lib/data/spells";
import { ALL_MONSTERS, MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { Statblock } from "@/lib/data/statblocks";
import {
    TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE,
    SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE,
    UNDERDARK_TRAVEL_TABLE, OAKHAVEN_MINES_TABLE, NETHERIL_RUINS_TABLE,
    OSSUARY_TABLE, ARACH_TINILITH_TABLE, CASTLE_MOURNWATCH_TABLE,
    CASTLE_EXTERIOR_TABLE, CATACOMBS_DESPAIR_TABLE, DWARVEN_RUINS_TABLE,
    MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE, THAY_EMBASSY_TABLE,
    SPIRE_TABLE
} from "@/lib/data/encounters";

// Component Imports
import StatblockCard from "@/components/ui/StatblockCard";
import NarrativeGenerator from "@/components/oracle/NarrativeGenerator";
import NpcChat from "@/components/oracle/NpcChat";

type DrawerTab = "bestiary" | "grimoire" | "oracle" | "notepad" | "encounters" | null;

const REGIONS = [
    { id: "sector-01", name: "Sector 01: Oakhaven" },
    { id: "sector-01-5", name: "Sector 01.5: Mournwatch" },
    { id: "sector-02", name: "Sector 02: The Depths" },
];

const TABLES_BY_REGION: Record<string, { id: string, name: string, table: any[] }[]> = {
    "sector-01": [
        { id: "town_day", name: "Oakhaven (Day)", table: TOWN_DAY_TABLE },
        { id: "town_night", name: "Oakhaven (Night)", table: TOWN_NIGHT_TABLE },
        { id: "outskirts", name: "The Outskirts", table: OUTSKIRTS_TABLE },
        { id: "ambush", name: "Shop Ambush", table: SHOP_AMBUSH_TABLE },
        { id: "thay_embassy", name: "Red Wizard Embassy", table: THAY_EMBASSY_TABLE },
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
        { id: "spire", name: "Screaming Gales Spire", table: SPIRE_TABLE },
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

export default function GlobalDrawers() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<DrawerTab>(null);
    const [isDockOpen, setIsDockOpen] = useState(false);
    const [customMonsters, setCustomMonsters] = useState<Statblock[]>([]);
    
    // Grimoire States
    const [spellSearch, setSpellSearch] = useState("");
    const [spellLevel, setSpellLevel] = useState("All");
    const [spellClass, setSpellClass] = useState("All");
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

    // Bestiary States
    const [monsterSearch, setMonsterSearch] = useState("");
    const [monsterType, setMonsterType] = useState("All");
    const [selectedMonster, setSelectedMonster] = useState<Statblock | null>(null);

    // Oracle Sub-tab State
    const [oracleMode, setOracleMode] = useState<"scene" | "chat">("scene");

    // Notepad State
    const [note, setNote] = useState("");
    const [notepadSavedTime, setNotepadSavedTime] = useState<string | null>(null);

    // Encounters Drawer States
    const [selectedRegionId, setSelectedRegionId] = useState("sector-01");
    const [selectedTableId, setSelectedTableId] = useState("town_day");
    const [currentEncounter, setCurrentEncounter] = useState<any | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const drawerRef = useRef<HTMLDivElement>(null);

    // Global Link Click Interceptor & Custom Window Event Listener to Open Drawers
    useEffect(() => {
        const handleGlobalLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            const drawerTabs: Record<string, DrawerTab> = {
                "/statblocks": "bestiary",
                "/grimoire": "grimoire",
                "/editor": "notepad",
                "/encounters": "encounters",
                "/oracle": "oracle"
            };

            const tab = drawerTabs[href];
            if (tab) {
                e.preventDefault();
                setActiveTab(tab);
            }
        };

        const handleOpenDrawer = (e: Event) => {
            const customEvent = e as CustomEvent<{ tab: DrawerTab }>;
            if (customEvent.detail && customEvent.detail.tab) {
                setActiveTab(customEvent.detail.tab);
            }
        };

        document.addEventListener("click", handleGlobalLinkClick);
        window.addEventListener("open-campaign-drawer", handleOpenDrawer);
        return () => {
            document.removeEventListener("click", handleGlobalLinkClick);
            window.removeEventListener("open-campaign-drawer", handleOpenDrawer);
        };
    }, []);

    // Toggle body class 'drawer-open' for desktop shifting
    useEffect(() => {
        if (activeTab) {
            document.body.classList.add("drawer-open");
        } else {
            document.body.classList.remove("drawer-open");
        }
        return () => {
            document.body.classList.remove("drawer-open");
        };
    }, [activeTab]);

    // Load custom monsters and notepad on mount
    useEffect(() => {
        const savedCustom = localStorage.getItem("custom_statblocks");
        if (savedCustom) {
            try {
                setCustomMonsters(JSON.parse(savedCustom));
            } catch (e) {
                console.error("Failed to load custom statblocks in drawer", e);
            }
        }

        const savedNote = localStorage.getItem("heart_curse_dm_notes");
        if (savedNote) {
            setNote(savedNote);
        }
    }, [activeTab]);

    // Handle clicks outside the drawer to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeTab && 
                drawerRef.current && 
                !drawerRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest(".drawer-tab-btn")
            ) {
                setActiveTab(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeTab]);

    // Combined monsters (built-in + custom)
    const getCombinedMonsters = (): Statblock[] => {
        const combined = new Map<string, Statblock>();
        
        // 1. Built-in monsters
        ALL_MONSTERS.forEach(m => {
            if (m.slug) combined.set(m.slug, m);
        });

        // 2. Custom monsters from localStorage
        customMonsters.forEach(m => {
            let key = m.slug;
            if (!key && m.name) {
                key = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            }
            if (key) combined.set(key, m);
        });

        return Array.from(combined.values()).sort((a, b) => a.name.localeCompare(b.name));
    };

    // Filtered Spells
    const filteredSpells = ALL_SPELLS.filter(spell => {
        if (spellSearch && !spell.name.toLowerCase().includes(spellSearch.toLowerCase())) return false;
        if (spellLevel !== "All") {
            const lvl = spellLevel === "Cantrip" ? 0 : parseInt(spellLevel);
            if (String(spell.level) !== String(lvl)) return false;
        }
        if (spellClass !== "All" && !spell.classes?.includes(spellClass)) return false;
        return true;
    });

    // Filtered Monsters
    const allMonstersList = getCombinedMonsters();
    const filteredMonsters = allMonstersList.filter(monster => {
        const matchesSearch = monster.name.toLowerCase().includes(monsterSearch.toLowerCase()) || 
            (monster.type && monster.type.toLowerCase().includes(monsterSearch.toLowerCase()));
        
        const mainType = monster.type ? monster.type.split(" ")[0].replace(/,/g, "").replace(/\(/g, "") : "Unknown";
        const matchesType = monsterType === "All" || mainType.toLowerCase() === monsterType.toLowerCase();

        return matchesSearch && matchesType;
    });

    // Extract unique monster types for filter dropdown
    const monsterTypes = ["All", ...Array.from(new Set(allMonstersList.map(m => {
        if (!m.type) return "Unknown";
        const mainType = m.type.split(" ")[0].replace(/,/g, "").replace(/\(/g, "");
        return mainType.charAt(0).toUpperCase() + mainType.slice(1);
    })))].sort();

    // Spell filter dropdown options
    const SPELL_LEVELS = ["All", "Cantrip", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const SPELL_CLASSES = ["All", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"];

    const handleTabClick = (tab: DrawerTab) => {
        if (activeTab === tab) {
            setActiveTab(null);
        } else {
            setActiveTab(tab);
        }
    };

    const handleNotepadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNote(value);
        localStorage.setItem("heart_curse_dm_notes", value);
        setNotepadSavedTime(new Date().toLocaleTimeString());
    };

    const handleAddMonsterToCombat = (monster: Statblock) => {
        const slug = monster.slug || monster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        // 1. Add to combat_tracker_queue in localStorage
        const existing = JSON.parse(localStorage.getItem("combat_tracker_queue") || "[]");
        const toAdd = { slug, hp: monster.hp || 10, init: 0 };
        localStorage.setItem("combat_tracker_queue", JSON.stringify([...existing, toAdd]));

        // 2. Dispatch event to combat page if it is active
        window.dispatchEvent(new CustomEvent("add-token-direct", { detail: { monster, slug } }));
        
        // Show indicator
        alert(`Sent ${monster.name} to Combat Tracker!`);
    };

    const handleRoll = () => {
        setIsRolling(true);
        setCurrentEncounter(null);
        let count = 0;
        const interval = setInterval(() => {
            const table = TABLES_BY_REGION[selectedRegionId]?.find(t => t.id === selectedTableId)?.table || [];
            if (table.length > 0) {
                const tempVal = table[Math.floor(Math.random() * table.length)];
                setCurrentEncounter(tempVal);
            }
            count++;
            if (count > 10) {
                clearInterval(interval);
                const table = TABLES_BY_REGION[selectedRegionId]?.find(t => t.id === selectedTableId)?.table || [];
                if (table.length > 0) {
                    const rollVal = Math.floor(Math.random() * 20) + 1;
                    const finalEncounter = table.find(e => e.roll.includes(rollVal));
                    setCurrentEncounter(finalEncounter || table[0]);
                }
                setIsRolling(false);
            }
        }, 80);
    };

    return (
        <>
            {/* BACKDROP */}
            <div
                className={clsx("drawer-backdrop no-print", activeTab && "open")}
                onClick={() => setActiveTab(null)}
            />

            {/* SIDE SLIDE-OUT PANEL */}
            <div
                ref={drawerRef}
                className={clsx("drawer-panel no-print", activeTab && "open")}
            >
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    borderBottom: "1px solid #222",
                    background: "#101012"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {activeTab === "bestiary" && (
                            <>
                                <Skull className="text-[#a32222]" size={18} />
                                <span className="font-header text-[var(--gold-accent)] uppercase tracking-wider text-sm">Bestiary Codex</span>
                            </>
                        )}
                        {activeTab === "grimoire" && (
                            <>
                                <Scroll className="text-[#a32222]" size={18} />
                                <span className="font-header text-[var(--gold-accent)] uppercase tracking-wider text-sm">Spells Grimoire</span>
                            </>
                        )}
                        {activeTab === "oracle" && (
                            <>
                                <Sparkles className="text-[var(--gold-accent)]" size={18} />
                                <span className="font-header text-[var(--gold-accent)] uppercase tracking-wider text-sm">AI Narrative Oracle</span>
                            </>
                        )}
                        {activeTab === "notepad" && (
                            <>
                                <PenTool className="text-[#b5a685]" size={18} />
                                <span className="font-header text-[var(--gold-accent)] uppercase tracking-wider text-sm">DM Scratchpad</span>
                            </>
                        )}
                        {activeTab === "encounters" && (
                            <>
                                <Swords className="text-[#a32222]" size={18} />
                                <span className="font-header text-[var(--gold-accent)] uppercase tracking-wider text-sm">Encounter Generator</span>
                            </>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setActiveTab(null)}
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: "0.25rem",
                            color: "#666",
                            cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
                        title="Close Drawer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Container */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem",
                    background: "#070708",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0
                }} className="custom-scrollbar">
                    
                    {/* BESTIARY TAB */}
                    {activeTab === "bestiary" && (
                        <div className="flex flex-col h-full gap-3">
                            {selectedMonster ? (
                                <div className="flex flex-col gap-3 h-full">
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#101012",
                                        padding: "0.5rem",
                                        border: "1px solid #222",
                                        borderRadius: "4px"
                                    }}>
                                        <button
                                            onClick={() => setSelectedMonster(null)}
                                            className="compact-btn cursor-pointer"
                                        >
                                            <ArrowLeft size={14} /> Back to Index
                                        </button>
                                        
                                        <button
                                            onClick={() => handleAddMonsterToCombat(selectedMonster)}
                                            className="retro-btn cursor-pointer"
                                        >
                                            <Plus size={12} /> Add to Board
                                        </button>
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        overflowY: "auto",
                                        border: "1px solid rgba(44, 26, 26, 0.3)",
                                        borderRadius: "4px"
                                    }} className="custom-scrollbar">
                                        <div className="mix-blend-normal rounded bg-[#fdf1dc]">
                                            <StatblockCard data={selectedMonster} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-3">
                                    {/* Search / Filters */}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        background: "#101012",
                                        padding: "0.75rem",
                                        border: "1px solid #222",
                                        borderRadius: "4px"
                                    }}>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2 text-[#555]" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search Bestiary..."
                                                className="w-full bg-[#050505] border border-[#333] rounded pl-8 pr-4 py-1.5 text-xs text-[#ccc] focus:border-[#a32222] focus:outline-none"
                                                value={monsterSearch}
                                                onChange={e => setMonsterSearch(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                className="w-full bg-[#050505] border border-[#333] p-1.5 text-xs text-[#ccc] rounded focus:border-[#a32222] capitalize"
                                                value={monsterType}
                                                onChange={e => setMonsterType(e.target.value)}
                                            >
                                                {monsterTypes.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div style={{
                                        flex: 1,
                                        overflowY: "auto",
                                        border: "1px solid #222",
                                        borderRadius: "4px",
                                        background: "#0a0a0c"
                                    }} className="custom-scrollbar">
                                        {filteredMonsters.length === 0 ? (
                                            <div className="p-8 text-center text-[#555] text-xs italic">
                                                No monsters match your filter...
                                            </div>
                                        ) : (
                                            filteredMonsters.map(monster => (
                                                <div
                                                    key={monster.slug || monster.name}
                                                    onClick={() => setSelectedMonster(monster)}
                                                    className="p-2 border-b border-[#222] cursor-pointer hover:bg-[#1a0505]/40 transition-colors flex justify-between items-center group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-header text-xs text-[#b5a685] group-hover:text-white">{monster.name}</span>
                                                        <span className="text-[10px] text-[#555] capitalize">{monster.type?.split(" ")[0]}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-[#666] font-mono bg-[#111] px-1.5 py-0.5 rounded border border-[#222]">
                                                            CR {monster.cr}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddMonsterToCombat(monster);
                                                            }}
                                                            style={{
                                                                background: "transparent",
                                                                border: "none",
                                                                padding: "0.25rem",
                                                                color: "#ffaaaa"
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 hover:text-white cursor-pointer"
                                                            title="Add directly to battlemap"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="text-[10px] text-center text-[#444] font-mono">
                                        Total indexed: {allMonstersList.length}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SPELLS TAB */}
                    {activeTab === "grimoire" && (
                        <div className="flex flex-col h-full gap-3">
                            {selectedSpell ? (
                                <div className="flex flex-col gap-3 h-full">
                                    <div style={{
                                        background: "#101012",
                                        padding: "0.5rem",
                                        border: "1px solid #222",
                                        borderRadius: "4px"
                                    }}>
                                        <button
                                            onClick={() => setSelectedSpell(null)}
                                            className="compact-btn cursor-pointer"
                                        >
                                            <ArrowLeft size={14} /> Back to Spells
                                        </button>
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        overflowY: "auto",
                                        border: "1px solid rgba(163, 148, 128, 0.3)",
                                        borderRadius: "4px"
                                    }} className="custom-scrollbar">
                                        <div className="w-full min-h-full bg-[#fdf1dc] p-6 relative rounded-sm border border-[#5c4033] text-[#1a1a1a]">
                                            <div className="border-b-2 border-[#8a1c1c] pb-2 mb-3">
                                                <h2 className="text-xl font-header font-bold text-[#1a0f0f] uppercase leading-none">{selectedSpell.name}</h2>
                                                <div className="mt-1 font-sans text-xs text-[#555] italic">
                                                    Level {selectedSpell.level === "0" || selectedSpell.level === "Cantrip" ? "Cantrip" : selectedSpell.level} • {selectedSpell.school}
                                                </div>
                                            </div>
                                            
                                            <div className="text-xs space-y-1 mb-4 border-b border-[#a39480]/50 pb-2">
                                                <div><strong className="text-[#8a1c1c]">Cast Time:</strong> {selectedSpell.castingTime}</div>
                                                <div><strong className="text-[#8a1c1c]">Range:</strong> {selectedSpell.range}</div>
                                                <div><strong className="text-[#8a1c1c]">Components:</strong> {selectedSpell.components}</div>
                                                <div><strong className="text-[#8a1c1c]">Duration:</strong> {selectedSpell.duration}</div>
                                            </div>

                                            <div className="font-serif text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedSpell.description}
                                            </div>

                                            <div className="mt-6 pt-2 border-t border-[#a39480]/50 text-[9px] text-[#666] flex justify-between font-mono">
                                                <span className="max-w-[70%] truncate">
                                                    {Array.isArray(selectedSpell.classes) ? selectedSpell.classes.join(', ') : selectedSpell.classes}
                                                </span>
                                                <span>{selectedSpell.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-3">
                                    {/* Search & Filters */}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        background: "#101012",
                                        padding: "0.75rem",
                                        border: "1px solid #222",
                                        borderRadius: "4px"
                                    }}>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2 text-[#555]" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search Spells..."
                                                className="w-full bg-[#050505] border border-[#333] rounded pl-8 pr-4 py-1.5 text-xs text-[#ccc] focus:border-[#a32222] focus:outline-none"
                                                value={spellSearch}
                                                onChange={e => setSpellSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 bg-[#050505] border border-[#333] p-1.5 text-xs text-[#ccc] rounded focus:border-[#a32222]"
                                                value={spellClass}
                                                onChange={e => setSpellClass(e.target.value)}
                                            >
                                                {SPELL_CLASSES.map(c => <option key={c} value={c}>{c === "All" ? "All Classes" : c}</option>)}
                                            </select>
                                            <select
                                                className="w-24 bg-[#050505] border border-[#333] p-1.5 text-xs text-[#ccc] rounded focus:border-[#a32222]"
                                                value={spellLevel}
                                                onChange={e => setSpellLevel(e.target.value)}
                                            >
                                                {SPELL_LEVELS.map(l => <option key={l} value={l}>{l === "All" ? "Level" : (l === "Cantrip" ? "Cantrip" : `Lvl ${l}`)}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div style={{
                                        flex: 1,
                                        overflowY: "auto",
                                        border: "1px solid #222",
                                        borderRadius: "4px",
                                        background: "#0a0a0c"
                                    }} className="custom-scrollbar">
                                        {filteredSpells.length === 0 ? (
                                            <div className="p-8 text-center text-[#555] text-xs italic">
                                                No spells found...
                                            </div>
                                        ) : (
                                            filteredSpells.map(spell => (
                                                <div
                                                    key={spell.name}
                                                    onClick={() => setSelectedSpell(spell)}
                                                    className="p-2 border-b border-[#222] cursor-pointer hover:bg-[#1a0505]/40 transition-colors flex justify-between items-center group"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-header text-xs text-[#b5a685] group-hover:text-white">{spell.name}</span>
                                                        <span className="text-[10px] text-[#555]">{spell.school}</span>
                                                    </div>
                                                    <span className="text-[10px] text-[#666] font-mono bg-[#111] px-1.5 py-0.5 rounded border border-[#222]">
                                                        {spell.level === "0" || spell.level === "Cantrip" ? "C" : spell.level}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="text-[10px] text-center text-[#444] font-mono">
                                        Total Spells: {ALL_SPELLS.length}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ORACLE TAB */}
                    {activeTab === "oracle" && (
                        <div className="flex flex-col h-full gap-3">
                            <div className="flex bg-[#101012] border border-[#222] rounded p-1">
                                <button
                                    onClick={() => setOracleMode("scene")}
                                    style={{ border: "none" }}
                                    className={clsx(
                                        "flex-1 py-1 text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer",
                                        oracleMode === "scene" ? "bg-[var(--gold-accent)] text-black font-bold" : "text-[#b5a685] hover:text-white"
                                    )}
                                >
                                    Scene Weaver
                                </button>
                                <button
                                    onClick={() => setOracleMode("chat")}
                                    style={{ border: "none" }}
                                    className={clsx(
                                        "flex-1 py-1 text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer",
                                        oracleMode === "chat" ? "bg-[var(--gold-accent)] text-black font-bold" : "text-[#b5a685] hover:text-white"
                                    )}
                                >
                                    Soul Speak
                                </button>
                            </div>
                            
                            <div className="flex-1 min-h-0">
                                {oracleMode === "scene" ? (
                                    <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                                        <NarrativeGenerator />
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col min-h-[400px]">
                                        <NpcChat />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* NOTEPAD TAB */}
                    {activeTab === "notepad" && (
                        <div className="flex flex-col h-full gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-mono text-[#666]">
                                    {notepadSavedTime ? `Saved: ${notepadSavedTime}` : "Auto-save active"}
                                </span>
                                <button
                                    onClick={() => {
                                        if (confirm("Clear notepad? This cannot be undone.")) {
                                            setNote("");
                                            localStorage.removeItem("heart_curse_dm_notes");
                                            setNotepadSavedTime(new Date().toLocaleTimeString());
                                        }
                                    }}
                                    className="compact-btn"
                                >
                                    Clear Notepad
                                </button>
                            </div>

                            <textarea
                                className="flex-1 w-full bg-[#141416] border border-[#222] p-4 text-xs font-mono text-[#ccc] resize-none outline-none focus:border-[var(--gold-accent)] transition-colors rounded-sm shadow-inner custom-scrollbar"
                                placeholder="Write session logs, track custom damage/health, note down player behaviors, or plan your next plot hook here..."
                                value={note}
                                onChange={handleNotepadChange}
                                style={{ minHeight: "450px" }}
                            />
                        </div>
                    )}

                    {/* ENCOUNTERS TAB */}
                    {activeTab === "encounters" && (
                        <div className="flex flex-col h-full gap-3">
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                background: "#101012",
                                padding: "0.75rem",
                                border: "1px solid #222",
                                borderRadius: "4px"
                            }}>
                                <label style={{ fontSize: "10px", color: "#666", textTransform: "uppercase" }}>Select Region</label>
                                <select
                                    className="w-full bg-[#050505] border border-[#333] p-1.5 text-xs text-[#ccc] rounded focus:border-[#a32222] cursor-pointer"
                                    value={selectedRegionId}
                                    onChange={(e) => {
                                        const regId = e.target.value;
                                        setSelectedRegionId(regId);
                                        setSelectedTableId(TABLES_BY_REGION[regId][0].id);
                                        setCurrentEncounter(null);
                                    }}
                                >
                                    {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>

                                <label style={{ fontSize: "10px", color: "#666", textTransform: "uppercase", marginTop: "0.25rem" }}>Select Table</label>
                                <select
                                    className="w-full bg-[#050505] border border-[#333] p-1.5 text-xs text-[#ccc] rounded focus:border-[#a32222] cursor-pointer"
                                    value={selectedTableId}
                                    onChange={(e) => {
                                        setSelectedTableId(e.target.value);
                                        setCurrentEncounter(null);
                                    }}
                                >
                                    {TABLES_BY_REGION[selectedRegionId].map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <button
                                onClick={handleRoll}
                                disabled={isRolling}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    background: isRolling ? "#4a0b0b" : "var(--scarlet-accent)",
                                    border: "1px solid var(--gold-accent)",
                                    color: "white",
                                    cursor: "pointer",
                                    textTransform: "uppercase",
                                    letterSpacing: "1px"
                                }}
                            >
                                {isRolling ? "Rolling d20..." : "🎲 Roll Encounter"}
                            </button>

                            {currentEncounter && (
                                <div style={{
                                    flex: 1,
                                    background: "#111",
                                    border: "1px solid #222",
                                    padding: "1rem",
                                    borderRadius: "4px",
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem"
                                }} className="custom-scrollbar">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(163,34,34,0.3)", paddingBottom: "0.5rem" }}>
                                        <span style={{ fontSize: "0.95rem", fontFamily: "var(--font-header)", color: "var(--gold-accent)" }}>{currentEncounter.name}</span>
                                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", background: "rgba(138,28,28,0.2)", padding: "2px 6px", border: "1px solid var(--scarlet-accent)", borderRadius: "3px", color: "var(--scarlet-accent)" }}>
                                            Roll: {currentEncounter.roll.join("-")}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: "0.8rem", color: "#ccc", whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                                        {currentEncounter.description}
                                    </p>
                                    {currentEncounter.monsters && currentEncounter.monsters.length > 0 && (
                                        <div style={{ marginTop: "1rem", borderTop: "1px solid #222", paddingTop: "0.5rem" }}>
                                            <div style={{ fontSize: "10px", color: "#666", textTransform: "uppercase", marginBottom: "0.5rem" }}>Encounter Monsters</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                {currentEncounter.monsters.map((monsterSlug: string) => {
                                                    const name = monsterSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                                    return (
                                                        <button
                                                            key={monsterSlug}
                                                            onClick={() => {
                                                                const foundMonster = ALL_MONSTERS.find(m => m.slug === monsterSlug) || ({ name, slug: monsterSlug, hp: 10 } as any as Statblock);
                                                                handleAddMonsterToCombat(foundMonster);
                                                            }}
                                                            style={{
                                                                background: "#1a0505",
                                                                border: "1px solid #ff4444",
                                                                color: "#ffaaaa",
                                                                fontSize: "0.7rem",
                                                                padding: "2px 6px",
                                                                borderRadius: "3px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            + Add {name} to Board
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* COLLAPSIBLE FLOATING TAB DOCK ON RIGHT EDGE */}
            <div className={clsx("drawer-tab-dock no-print", isDockOpen && "expanded")}>
                {/* Expand / Collapse Toggle Handle */}
                <button
                    onClick={() => setIsDockOpen(!isDockOpen)}
                    className="drawer-dock-toggle-btn"
                    title={isDockOpen ? "Collapse Tools Dock" : "Quick Access Tools"}
                    style={{
                        background: "#141416",
                        border: "1px solid rgba(201, 188, 160, 0.4)",
                        borderRight: "none",
                        borderRadius: "8px 0 0 8px",
                        color: "var(--gold-accent)",
                        padding: "6px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        boxShadow: "-3px 3px 12px rgba(0,0,0,0.6)",
                        marginBottom: "4px",
                        transition: "all 0.2s"
                    }}
                >
                    {isDockOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span className="dock-toggle-text">{isDockOpen ? "Hide" : "Tools"}</span>
                </button>

                {/* The 5 Drawer Action Tabs */}
                <div className={clsx("drawer-tab-buttons-container", !isDockOpen && "dock-collapsed")}>
                    <button
                        className={clsx("drawer-tab-btn", activeTab === "bestiary" && "active")}
                        onClick={() => handleTabClick("bestiary")}
                        title="Bestiary Codex"
                    >
                        <Skull size={18} />
                        <span>Bestiary</span>
                    </button>
                    <button
                        className={clsx("drawer-tab-btn", activeTab === "grimoire" && "active")}
                        onClick={() => handleTabClick("grimoire")}
                        title="Spells Grimoire"
                    >
                        <Scroll size={18} />
                        <span>Spells</span>
                    </button>
                    <button
                        className={clsx("drawer-tab-btn", activeTab === "encounters" && "active")}
                        onClick={() => handleTabClick("encounters")}
                        title="Encounter Generator"
                    >
                        <Swords size={18} />
                        <span>Encounters</span>
                    </button>
                    <button
                        className={clsx("drawer-tab-btn", activeTab === "notepad" && "active")}
                        onClick={() => handleTabClick("notepad")}
                        title="DM Scratchpad"
                    >
                        <PenTool size={18} />
                        <span>Notes</span>
                    </button>
                    <button
                        className={clsx("drawer-tab-btn", activeTab === "oracle" && "active")}
                        onClick={() => handleTabClick("oracle")}
                        title="AI Oracle"
                    >
                        <Sparkles size={18} />
                        <span>Oracle</span>
                    </button>
                </div>
            </div>
        </>
    );
}

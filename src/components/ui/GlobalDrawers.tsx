"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
    Skull, Scroll, Sparkles, PenTool, X, Search, ArrowLeft, Plus, Swords
} from "lucide-react";
import clsx from "clsx";

// Spell & Monster Data Imports
import { ALL_SPELLS, Spell } from "@/lib/data/spells";
import { ALL_MONSTERS, MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { Statblock } from "@/lib/data/statblocks";

// Component Imports
import StatblockCard from "@/components/ui/StatblockCard";
import NarrativeGenerator from "@/components/oracle/NarrativeGenerator";
import NpcChat from "@/components/oracle/NpcChat";

type DrawerTab = "bestiary" | "grimoire" | "oracle" | "notepad" | null;

export default function GlobalDrawers() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<DrawerTab>(null);
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

    const drawerRef = useRef<HTMLDivElement>(null);

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

    return (
        <>
            {/* FLOATING ACTION TABS ON RIGHT EDGE */}
            <div className="fixed right-0 top-1/4 z-[99] flex flex-col gap-2 no-print">
                <button
                    onClick={() => handleTabClick("bestiary")}
                    className={clsx(
                        "drawer-tab-btn flex flex-col items-center justify-center gap-1 p-3 w-16 rounded-l-md border-y border-l bg-[#0f0f10] border-amber-600/30 text-[#b5a685] hover:text-white hover:bg-[#1a1111] hover:border-amber-500/60 shadow-xl transition-all cursor-pointer",
                        activeTab === "bestiary" && "text-[var(--scarlet-accent)] bg-[#1c0c0c] border-[#a32222]/80 translate-x-[-4px]"
                    )}
                    title="Bestiary Drawer"
                >
                    <Skull size={20} />
                    <span className="text-[9px] uppercase tracking-wider font-mono">Bestiary</span>
                </button>
                
                <button
                    onClick={() => handleTabClick("grimoire")}
                    className={clsx(
                        "drawer-tab-btn flex flex-col items-center justify-center gap-1 p-3 w-16 rounded-l-md border-y border-l bg-[#0f0f10] border-amber-600/30 text-[#b5a685] hover:text-white hover:bg-[#1a1111] hover:border-amber-500/60 shadow-xl transition-all cursor-pointer",
                        activeTab === "grimoire" && "text-[var(--scarlet-accent)] bg-[#1c0c0c] border-[#a32222]/80 translate-x-[-4px]"
                    )}
                    title="Spell Grimoire"
                >
                    <Scroll size={20} />
                    <span className="text-[9px] uppercase tracking-wider font-mono">Spells</span>
                </button>

                <button
                    onClick={() => handleTabClick("oracle")}
                    className={clsx(
                        "drawer-tab-btn flex flex-col items-center justify-center gap-1 p-3 w-16 rounded-l-md border-y border-l bg-[#0f0f10] border-amber-600/30 text-[#b5a685] hover:text-white hover:bg-[#1a1111] hover:border-amber-500/60 shadow-xl transition-all cursor-pointer",
                        activeTab === "oracle" && "text-[var(--scarlet-accent)] bg-[#1c0c0c] border-[#a32222]/80 translate-x-[-4px]"
                    )}
                    title="The Oracle AI"
                >
                    <Sparkles size={20} />
                    <span className="text-[9px] uppercase tracking-wider font-mono">Oracle</span>
                </button>

                <button
                    onClick={() => handleTabClick("notepad")}
                    className={clsx(
                        "drawer-tab-btn flex flex-col items-center justify-center gap-1 p-3 w-16 rounded-l-md border-y border-l bg-[#0f0f10] border-amber-600/30 text-[#b5a685] hover:text-white hover:bg-[#1a1111] hover:border-amber-500/60 shadow-xl transition-all cursor-pointer",
                        activeTab === "notepad" && "text-[var(--scarlet-accent)] bg-[#1c0c0c] border-[#a32222]/80 translate-x-[-4px]"
                    )}
                    title="Scratchpad"
                >
                    <PenTool size={20} />
                    <span className="text-[9px] uppercase tracking-wider font-mono">Notes</span>
                </button>
            </div>

            {/* BACKDROP */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[90] transition-opacity duration-300 pointer-events-none no-print",
                    activeTab ? "opacity-100 pointer-events-auto" : "opacity-0"
                )}
                onClick={() => setActiveTab(null)}
            />

            {/* SIDE SLIDE-OUT PANEL */}
            <div
                ref={drawerRef}
                className={clsx(
                    "fixed right-0 top-0 h-full w-[460px] max-w-full z-[95] flex flex-col bg-[#0b0b0c] border-l border-[#a32222]/30 shadow-2xl transition-transform duration-300 ease-in-out no-print",
                    activeTab ? "translate-x-0" : "translate-x-full"
                )}
                style={{
                    boxShadow: activeTab ? "-10px 0 30px rgba(0,0,0,0.8)" : "none"
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#101012]">
                    <div className="flex items-center gap-2">
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
                    </div>
                    
                    <button
                        onClick={() => setActiveTab(null)}
                        className="text-[#666] hover:text-white p-1 rounded hover:bg-[#222] transition-colors cursor-pointer"
                        title="Close Drawer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 min-h-0 bg-[#070708]">
                    
                    {/* BESTIARY TAB */}
                    {activeTab === "bestiary" && (
                        <div className="flex flex-col h-full gap-3">
                            {selectedMonster ? (
                                <div className="flex flex-col gap-3 h-full">
                                    <div className="flex justify-between items-center bg-[#101012] p-2 border border-[#222] rounded">
                                        <button
                                            onClick={() => setSelectedMonster(null)}
                                            className="text-xs flex items-center gap-1 text-[#b5a685] hover:text-white uppercase font-mono tracking-wider cursor-pointer"
                                        >
                                            <ArrowLeft size={14} /> Back to Index
                                        </button>
                                        
                                        <button
                                            onClick={() => handleAddMonsterToCombat(selectedMonster)}
                                            className="bg-[#8a1c1c] hover:bg-[#a32222] text-white text-[10px] font-bold uppercase px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <Plus size={12} /> Add to Board
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#2c1a1a]/30 rounded">
                                        <div className="mix-blend-normal rounded bg-[#fdf1dc]">
                                            <StatblockCard data={selectedMonster} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-3">
                                    {/* Search / Filters */}
                                    <div className="flex flex-col gap-2 bg-[#101012] p-3 border border-[#222] rounded">
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
                                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#222] rounded bg-[#0a0a0c]">
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
                                                            className="opacity-0 group-hover:opacity-100 p-1 bg-[#8a1c1c] text-white rounded hover:bg-[#a32222] transition-all cursor-pointer"
                                                            title="Add directly to battlemap"
                                                        >
                                                            <Plus size={12} />
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
                                    <div className="bg-[#101012] p-2 border border-[#222] rounded">
                                        <button
                                            onClick={() => setSelectedSpell(null)}
                                            className="text-xs flex items-center gap-1 text-[#b5a685] hover:text-white uppercase font-mono tracking-wider cursor-pointer"
                                        >
                                            <ArrowLeft size={14} /> Back to Spells
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#a39480]/30 rounded">
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
                                    <div className="flex flex-col gap-2 bg-[#101012] p-3 border border-[#222] rounded">
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
                                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#222] rounded bg-[#0a0a0c]">
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
                                    className={clsx(
                                        "flex-1 py-1 text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer",
                                        oracleMode === "scene" ? "bg-[var(--gold-accent)] text-black font-bold" : "text-[#b5a685] hover:text-white"
                                    )}
                                >
                                    Scene Weaver
                                </button>
                                <button
                                    onClick={() => setOracleMode("chat")}
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
                                    className="text-[10px] text-red-500 hover:text-red-400 font-mono uppercase tracking-wider cursor-pointer"
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

                </div>
            </div>
        </>
    );
}

"use client";

import { useEffect, useState, useRef } from 'react';
import { ALL_SPELLS, filterSpells, Spell } from '@/lib/data/spells';
import { Search, BookOpen, Scroll, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function GrimoireContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // For shallow routing if needed
    const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const listRef = useRef<HTMLDivElement>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<string>("All"); // All, Cantrip, 1-9
    const [selectedClass, setSelectedClass] = useState<string>("All");
    const [isConcentration, setIsConcentration] = useState(false);
    const [isRitual, setIsRitual] = useState(false);

    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    // Initial Load from URL
    useEffect(() => {
        const spellParam = searchParams.get("spell");
        if (spellParam) {
            const spell = ALL_SPELLS.find(s => s.name.toLowerCase() === spellParam.toLowerCase());
            if (spell) {
                setActiveSpell(spell);
                // Optionally auto-set filters to match this spell?
                // For now, let's keep filters independent but ensure the spell is loaded.
            }
        }
    }, [searchParams]);

    // Filtering Logic
    const filteredSpells = ALL_SPELLS.filter(spell => {
        // Text Search
        if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        // Level Filter
        if (selectedLevel !== "All") {
            const lvl = selectedLevel === "Cantrip" ? 0 : parseInt(selectedLevel);
            // Fix: Ensure we compare comparable types. spell.level might be string or number.
            if (String(spell.level) !== String(lvl)) return false;
        }

        // Class Filter
        if (selectedClass !== "All") {
            // Fix: spell.classes could be undefined
            if (!spell.classes?.includes(selectedClass)) return false;
        }

        // Toggles
        if (isConcentration && !spell.duration.toLowerCase().includes("concentration")) return false;
        if (isRitual && !spell.ritual) return false;

        return true;
    });

    // Lists for Dropdowns
    const LEVELS = ["All", "Cantrip", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const CLASSES = ["All", "Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"];

    // Auto-scroll logic (Reading Pane Reset & List Scroll)
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll List Item into View
    // Scroll List Item into View
    // Scroll List Item into View
    // Only on initial load (Deep Link) to avoid jumping when user clicks manually
    const initialScrollDone = useRef(false);

    useEffect(() => {
        if (activeSpell && !initialScrollDone.current) {
            // Reset Reading Pane usually handled by user interaction or new render
            if (scrollRef.current) scrollRef.current.scrollTop = 0;

            const attemptScroll = () => {
                const node = itemsRef.current.get(activeSpell.name);
                const container = listRef.current;

                if (node && container) {
                    const topPos = node.offsetTop;
                    const containerHeight = container.clientHeight;
                    const nodeHeight = node.clientHeight;

                    container.scrollTop = topPos - (containerHeight / 2) + (nodeHeight / 2);

                    // Mark as done so we don't auto-scroll on manual clicks
                    initialScrollDone.current = true;
                    return true;
                }
                return false;
            };

            // Attempt immediately
            if (!attemptScroll()) {
                const t1 = setTimeout(attemptScroll, 100);
                const t2 = setTimeout(attemptScroll, 300);
                const t3 = setTimeout(attemptScroll, 600);
                const t4 = setTimeout(attemptScroll, 1000);

                return () => {
                    clearTimeout(t1);
                    clearTimeout(t2);
                    clearTimeout(t3);
                    clearTimeout(t4);
                };
            }
        } else if (activeSpell) {
            // Just reset the reading pane scroll on manual clicks
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }
    }, [activeSpell, filteredSpells]);

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-[#ccc] font-sans overflow-hidden">
            <Link href="/" className="no-print campaign-btn danger text-xs px-3 py-1 no-underline fixed top-4 right-4 z-[9999]">
                SANCTUM
            </Link>

            {/* Header */}
            <div className="bg-[#1a0505] border-b border-[#a32222] p-4 flex items-center justify-between shrink-0 z-10 shadow-lg">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-[#a32222]" />
                    <h1 className="grimoire-title text-2xl tracking-widest text-[#c9bca0]">THE GRIMOIRE</h1>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Controls & List (30%) */}
                <div className="w-[400px] bg-[#0a0a0c] border-r border-[#a32222] flex flex-col z-20 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">

                    {/* FILTERS CONTAINER */}
                    <div className="p-4 border-b border-[#333] bg-[#111] space-y-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-[#555]" size={16} />
                            <input
                                type="text"
                                placeholder="Search Incantations..."
                                className="w-full bg-[#050505] border border-[#333] rounded pl-10 pr-4 py-2 text-[#ccc] focus:border-[#a32222] focus:outline-none text-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Dropdowns */}
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-[#050505] border border-[#333] p-2 text-xs text-[#ccc] rounded focus:border-[#a32222]"
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                {CLASSES.map(c => <option key={c} value={c}>{c === "All" ? "All Classes" : c}</option>)}
                            </select>

                            <select
                                className="w-24 bg-[#050505] border border-[#333] p-2 text-xs text-[#ccc] rounded focus:border-[#a32222]"
                                value={selectedLevel}
                                onChange={e => setSelectedLevel(e.target.value)}
                            >
                                {LEVELS.map(l => <option key={l} value={l}>{l === "All" ? "Level" : (l === "Cantrip" ? "Cantrip" : `Lvl ${l}`)}</option>)}
                            </select>
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-4 text-xs select-none">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                <input type="checkbox" checked={isConcentration} onChange={e => setIsConcentration(e.target.checked)} className="accent-[#a32222]" />
                                Concentration
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                                <input type="checkbox" checked={isRitual} onChange={e => setIsRitual(e.target.checked)} className="accent-[#a32222]" />
                                Ritual
                            </label>
                        </div>
                    </div>

                    {/* SPELL LIST */}
                    {/* Only show list if filters are active */}
                    {(searchQuery === "" && selectedLevel === "All" && selectedClass === "All" && !isConcentration && !isRitual) ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                            <BookOpen size={48} className="mb-4 text-[#a32222]" />
                            <p className="text-sm font-serif italic text-[#c9bca0]">
                                The archives are vast.<br />
                                <span className="text-xs text-[#888] not-italic mt-2 block font-sans">
                                    Select a Class, Level, or Search to reveal incantations.
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto custom-scrollbar" ref={listRef}>
                            {filteredSpells.length === 0 ? (
                                <div className="p-8 text-center text-[#444] text-sm italic">
                                    No incantations match your filter...
                                </div>
                            ) : (
                                filteredSpells.map((spell) => (
                                    <div
                                        key={spell.name}
                                        ref={(node) => {
                                            if (node) itemsRef.current.set(spell.name, node);
                                            else itemsRef.current.delete(spell.name);
                                        }}
                                        onClick={() => setActiveSpell(spell)}
                                        className={`grimoire-item p-3 border-b border-[#222] cursor-pointer hover:bg-[#1a0505] transition-colors flex justify-between items-center group ${activeSpell?.name === spell.name ? 'bg-[#1a0505] border-l-4 border-l-[#a32222]' : ''}`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-header text-sm ${activeSpell?.name === spell.name ? 'text-[#c9bca0]' : 'text-[#888] group-hover:text-[#ccc]'}`}>{spell.name}</span>
                                            <span className="text-[10px] text-[#444]">{spell.school}</span>
                                        </div>
                                        <span className="text-[10px] text-[#444] font-mono ml-auto bg-[#111] px-1 rounded border border-[#222] min-w-[20px] text-center">
                                            {(spell.level === "0" || spell.level === "Cantrip") ? 'C' : `${spell.level}`}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    <div className="p-2 text-center text-[10px] text-[#444] border-t border-[#222]">
                        v1.4.0 (Filter-First)
                    </div>
                </div>

                {/* Right Panel: Reading Pane */}
                <div className="flex-1 bg-[#151515] relative p-8 flex items-center justify-center overflow-hidden">
                    {/* Decorative Borders */}
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#333] pointer-events-none opacity-50"></div>
                    <div className="absolute top-5 left-5 right-5 bottom-5 border border-[#222] pointer-events-none opacity-50"></div>

                    {activeSpell ? (
                        <div className="w-full max-w-3xl h-[90%] bg-[#fdf1dc] relative shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden border border-[#5c4033]">
                            {/* Inner Scroll */}
                            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto custom-scrollbar p-12 z-0">
                                <div className="max-w-2xl mx-auto">
                                    {/* Header 2024 Style */}
                                    <div className="border-b-[3px] border-[#8a1c1c] pb-2 mb-4">
                                        <h1 className="text-4xl font-header font-bold text-[#1a0f0f] uppercase tracking-wide leading-none">{activeSpell.name}</h1>
                                        <div className="mt-1 font-sans font-bold text-sm text-[#333] italic">
                                            {activeSpell.level === "0" || activeSpell.level === "Cantrip" ? "Cantrip" : `Level ${activeSpell.level}`}
                                            <span className="mx-2 text-[#8a1c1c]">•</span>
                                            {activeSpell.school}
                                            {activeSpell.ritual && <span className="ml-2 uppercase text-[10px] bg-[#ddd] px-1 rounded border border-[#ccc]">Ritual</span>}
                                            {activeSpell.duration.toLowerCase().includes("concentration") && <span className="ml-1 uppercase text-[10px] bg-[#ddd] px-1 rounded border border-[#ccc]">Conc.</span>}
                                        </div>
                                    </div>

                                    {/* Properties Block (2024 Style: Clean Lines) */}
                                    <div className="font-sans text-sm text-[#111] space-y-1 mb-6 border-b border-[#a39480] pb-4">
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="font-bold text-[#8a1c1c]">Casting Time:</span>
                                            <span>{activeSpell.castingTime}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="font-bold text-[#8a1c1c]">Range:</span>
                                            <span>{activeSpell.range} {activeSpell.range.includes("feet") ? "" : ""}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="font-bold text-[#8a1c1c]">Components:</span>
                                            <span>{activeSpell.components} {activeSpell.material && <span className="text-[#555] italic">({activeSpell.material})</span>}</span>
                                        </div>
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="font-bold text-[#8a1c1c]">Duration:</span>
                                            <span>{activeSpell.duration}</span>
                                        </div>
                                    </div>

                                    {/* Description Body */}
                                    <div className="font-serif text-base text-[#1a1a1a] leading-relaxed whitespace-pre-wrap break-words" style={{ fontFamily: "'Merriweather', serif" }}>
                                        {/* Handle Bold Headers in description if present in text, otherwise just render */}
                                        {activeSpell.description}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-8 pt-4 border-t border-[#a39480] text-[10px] text-[#666] flex justify-between uppercase font-sans font-bold opacity-70">
                                        <span>
                                            {Array.isArray(activeSpell.classes)
                                                ? activeSpell.classes.join(', ')
                                                : activeSpell.classes}
                                        </span>
                                        <span>{activeSpell.source} {activeSpell.page && `pg. ${activeSpell.page}`}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-30 text-[#444] animate-pulse-slow">
                            <Scroll size={120} strokeWidth={1} className="mx-auto mb-6" />
                            <h3 className="text-3xl font-header text-[#666]">Select an incantation to study...</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function GrimoirePage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-black text-[#a32222] font-header text-3xl animate-pulse">Summoning Grimoire...</div>}>
            <GrimoireContent />
        </Suspense>
    );
}

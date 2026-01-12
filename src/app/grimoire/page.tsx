"use client";

import { useEffect, useState, useRef } from 'react';
import { ALL_SPELLS, filterSpells, Spell } from '@/lib/data/spells';
import { Search, BookOpen, Scroll, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GrimoirePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    // Auto-scroll active item into view
    const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset scroll when spell changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeSpell]);

    const filteredSpells = searchQuery ? filterSpells(searchQuery) : ALL_SPELLS.slice(0, 100);

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-[#ccc] font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)" }}></div>

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
                {/* Left Sidebar: List (30%) */}
                <div className="w-[350px] bg-[#0a0a0c] border-r border-[#a32222] flex flex-col z-20 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">
                    <div className="p-4 border-b border-[#333] bg-black/20">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-[#555]" size={16} />
                            <input
                                type="text"
                                placeholder="Search Incantations..."
                                className="w-full bg-[#111] border border-[#333] rounded pl-10 pr-4 py-2 text-[#ccc] focus:border-[#a32222] focus:outline-none transition-colors"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredSpells.map((spell, idx) => (
                            <div
                                key={spell.name}
                                onClick={() => setActiveSpell(spell)}
                                className={`grimoire-item p-3 border-b border-[#222] cursor-pointer hover:bg-[#1a0505] transition-colors flex justify-between items-center group ${activeSpell?.name === spell.name ? 'bg-[#1a0505] border-l-4 border-l-[#a32222]' : ''}`}
                            >
                                <span className={`font-header text-sm ${activeSpell?.name === spell.name ? 'text-[#c9bca0]' : 'text-[#888] group-hover:text-[#ccc]'}`}>{spell.name}</span>
                                <span className="text-[10px] text-[#444] font-mono ml-auto bg-[#111] px-1 rounded border border-[#222]">{spell.level === 0 ? 'C' : `L${spell.level}`}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Reading Pane (70%) */}
                <div className="flex-1 bg-[#151515] relative p-8 flex items-center justify-center overflow-hidden">
                    {/* Decorative Borders for the "Book" feel */}
                    <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#333] pointer-events-none opacity-50"></div>
                    <div className="absolute top-5 left-5 right-5 bottom-5 border border-[#222] pointer-events-none opacity-50"></div>

                    {activeSpell ? (
                        <div className="w-full max-w-3xl h-[90%] bg-[#dccba8] relative shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden border border-[#5c4033]">
                            {/* Inner Scroll */}
                            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto custom-scrollbar p-12 z-0">
                                <div className="text-center mb-8">
                                    <h1 className="text-5xl font-header font-bold text-[#2a0a0a] mb-2 drop-shadow-sm uppercase tracking-wide">{activeSpell.name}</h1>
                                    <div className="flex justify-center gap-6 text-base font-bold italic text-[#5c1212] font-serif tracking-wider">
                                        <span>{activeSpell.level === 0 ? "Cantrip" : `Level ${activeSpell.level}`}</span>
                                        <span>•</span>
                                        <span>{activeSpell.school}</span>
                                    </div>
                                    <div className="w-24 h-1 bg-[#5c1212] mx-auto my-6 opacity-80"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-8 text-sm px-4">
                                    <div className="flex justify-between border-b border-[#a39480] pb-1">
                                        <strong className="text-[#4a0404] uppercase tracking-widest text-xs">Casting Time</strong>
                                        <span className="font-header italic text-[#111] font-bold">{activeSpell.castingTime}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#a39480] pb-1">
                                        <strong className="text-[#4a0404] uppercase tracking-widest text-xs">Range</strong>
                                        <span className="font-header italic text-[#111] font-bold">{activeSpell.range}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#a39480] pb-1">
                                        <strong className="text-[#4a0404] uppercase tracking-widest text-xs">Components</strong>
                                        <span className="font-header italic text-[#111] text-xs font-bold">{activeSpell.components} {activeSpell.material ? `(...)` : ''}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-[#a39480] pb-1">
                                        <strong className="text-[#4a0404] uppercase tracking-widest text-xs">Duration</strong>
                                        <span className="font-header italic text-[#111] font-bold">{activeSpell.duration}</span>
                                    </div>
                                </div>

                                <div className="max-w-none leading-relaxed text-justify px-4 font-serif text-xl text-black" style={{ fontFamily: "'Merriweather', serif" }}>
                                    <p className="whitespace-pre-wrap font-semibold tracking-wide first-letter:text-5xl first-letter:font-header first-letter:mr-3 first-letter:float-left first-letter:text-[#8a1c1c] leading-8">
                                        {activeSpell.description}
                                    </p>
                                </div>

                                <div className="mt-16 pt-8 border-t border-[#a39480] text-xs text-[#444] flex justify-between uppercase tracking-widest opacity-70 font-sans font-bold">
                                    <span>{activeSpell.classes}</span>
                                    <span>{activeSpell.source} pg. {activeSpell.page}</span>
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

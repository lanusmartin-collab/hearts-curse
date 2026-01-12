"use client";

import { useEffect, useState } from 'react';
import { useGrimoire } from '@/lib/game/spellContext';
import { ALL_SPELLS, getSpell, filterSpells, Spell } from '@/lib/data/spells';
import { X, Search, BookOpen, Scroll } from 'lucide-react';

export default function GrimoireModal() {
    const { isOpen, closeGrimoire, selectedSpellName } = useGrimoire();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    // Sync with global selection
    useEffect(() => {
        if (selectedSpellName) {
            const spell = getSpell(selectedSpellName);
            if (spell) {
                setActiveSpell(spell);
            } else {
                setSearchQuery(selectedSpellName); // Pre-fill search if not found exact
                setActiveSpell(null);
            }
        }
    }, [selectedSpellName]);

    if (!isOpen) return null;

    const filteredSpells = searchQuery ? filterSpells(searchQuery) : ALL_SPELLS.slice(0, 100); // Limit initial view

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={closeGrimoire}>
            <div
                className="w-full max-w-4xl h-[80vh] bg-[#0a0a0c] border border-[#a32222] shadow-[0_0_50px_rgba(163,34,34,0.3)] flex flex-col overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#1a0505] border-b border-[#a32222] p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <BookOpen className="text-[#a32222]" />
                        <h2 className="grimoire-title text-xl tracking-widest text-[#c9bca0]">THE GRIMOIRE</h2>
                    </div>
                    <button onClick={closeGrimoire} className="text-[#666] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar: List */}
                    <div className="grimoire-sidebar w-1/3 flex flex-col">
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
                                    className={`grimoire-item animate-heartbeat ${activeSpell?.name === spell.name ? 'active' : ''}`}
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <span className={`font-header text-sm ${activeSpell?.name === spell.name ? 'text-[#c9bca0]' : 'text-[#888]'}`}>{spell.name}</span>
                                    <span className="text-[10px] text-[#444] font-mono ml-auto">{spell.level === 0 ? 'C' : `L${spell.level}`}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Details */}
                    <div className="flex-1 bg-[url('/parchment-texture.jpg')] bg-cover bg-no-repeat relative">
                        {/* Overlay to darken parchment for readability if needed, or just use css var */}
                        <div className="absolute inset-0 bg-[#e8dcc5] opacity-10 pointer-events-none"></div>

                        {activeSpell ? (
                            <div className="h-full overflow-y-auto p-8 text-[#1a1a1a] font-serif custom-scrollbar bg-[#e8dcc5]">
                                <div className="border-b-2 border-[#1a1a1a] pb-4 mb-6">
                                    <h1 className="text-3xl font-bold uppercase tracking-wide text-[#4a0404] font-header mb-2">{activeSpell.name}</h1>
                                    <div className="flex gap-4 text-sm font-bold italic text-[#333]">
                                        <span>{activeSpell.level === 0 ? "Cantrip" : `Level ${activeSpell.level}`} {activeSpell.school}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-[#d8ccb5] p-4 rounded border border-[#b8ac95]">
                                    <div><strong className="text-[#4a0404]">Casting Time:</strong> {activeSpell.castingTime}</div>
                                    <div><strong className="text-[#4a0404]">Range:</strong> {activeSpell.range}</div>
                                    <div><strong className="text-[#4a0404]">Components:</strong> {activeSpell.components} {activeSpell.material && `(${activeSpell.material})`}</div>
                                    <div><strong className="text-[#4a0404]">Duration:</strong> {activeSpell.duration}</div>
                                </div>

                                <div className="prose prose-p:text-[#1a1a1a] prose-strong:text-[#4a0404] max-w-none leading-relaxed">
                                    <p className="whitespace-pre-wrap">{activeSpell.description}</p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-[#b8ac95] text-xs text-[#666] flex justify-between">
                                    <span>{activeSpell.classes}</span>
                                    <span>{activeSpell.source} pg. {activeSpell.page}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[#444] p-8 text-center opacity-50">
                                <Scroll size={64} className="mb-4" />
                                <h3 className="text-xl font-header">Select a spell to view its runes.</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

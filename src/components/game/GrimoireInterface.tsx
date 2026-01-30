import React, { useState } from 'react';
import { Spell, ALL_SPELLS } from '@/lib/data/spells';
import { X, BookOpen, Scroll, GraduationCap } from 'lucide-react';
import { useGameContext } from '@/lib/context/GameContext';

interface GrimoireInterfaceProps {
    onClose: () => void;
    onLearn: (spellName: string, cost: number) => void;
    playerGold: number;
    knownSpells: string[];
}

export default function GrimoireInterface({ onClose, onLearn, playerGold, knownSpells }: GrimoireInterfaceProps) {
    const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
    const [filterLevel, setFilterLevel] = useState<string>("All");

    // Filter spells - Simple logic: Show all wizard spells for now
    const librarySpells = ALL_SPELLS.filter(s => s.classes?.includes("Wizard") || s.classes?.includes("Sorcerer")).sort((a, b) => a.level.localeCompare(b.level));

    const getCost = (level: string) => {
        if (level === "Cantrip") return 50;
        const lvl = parseInt(level.charAt(0)) || 1;
        return lvl * 50; // 50gp per level
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a0c] border border-cyan-900 flex flex-col md:flex-row shadow-[0_0_50px_rgba(8,145,178,0.2)] overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-cyan-500 hover:text-white bg-black/50 p-2 rounded-full border border-cyan-900 hover:border-cyan-400 transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Panel: Flavor */}
                <div className="w-full md:w-1/3 bg-[#050508] border-r border-cyan-900/30 relative flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-bold text-cyan-100 uppercase tracking-widest">The Grimoire</h2>
                            <div className="text-xs text-cyan-700 font-mono">Khelben's Archive</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto text-sm text-cyan-800/80 font-serif italic leading-relaxed">
                        "Magic is not a gift. It is a burden of understanding. Within these pages lie the formulas to reshape reality. Take what you need, but remember: the Weave remembers."
                        <br /><br />
                        - Khelben "Blackstaff" Arunsun
                    </div>

                    <div className="mt-auto pt-4 border-t border-cyan-900/30">
                        <div className="text-xs font-mono text-cyan-600 uppercase tracking-widest mb-1">Your Gold</div>
                        <div className="text-xl text-yellow-500 font-bold">{playerGold} gp</div>
                    </div>
                </div>

                {/* Right Panel: Spells */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                    <div className="p-4 border-b border-cyan-900/30 flex gap-4 overflow-x-auto">
                        <button onClick={() => setFilterLevel("All")} className={`px-3 py-1 text-xs font-bold uppercase border ${filterLevel === "All" ? "border-cyan-500 text-cyan-400" : "border-transparent text-gray-600 hover:text-cyan-600"}`}>All</button>
                        {["Cantrip", "1st", "2nd", "3rd", "4th", "5th"].map(lvl => (
                            <button key={lvl} onClick={() => setFilterLevel(lvl)} className={`px-3 py-1 text-xs font-bold uppercase border ${filterLevel === lvl ? "border-cyan-500 text-cyan-400" : "border-transparent text-gray-600 hover:text-cyan-600"}`}>{lvl}</button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-2 custom-scrollbar">
                        {librarySpells.filter(s => filterLevel === "All" || s.level.startsWith(filterLevel)).map(spell => {
                            const isKnown = knownSpells.includes(spell.name);
                            const cost = getCost(spell.level);
                            const canAfford = playerGold >= cost;

                            return (
                                <div
                                    key={spell.name}
                                    onClick={() => setSelectedSpell(spell)}
                                    className={`p-3 border flex justify-between items-center cursor-pointer transition-all ${selectedSpell?.name === spell.name ? "bg-cyan-900/20 border-cyan-500" : "bg-[#0a0a0a] border-[#222] hover:border-cyan-800"}`}
                                >
                                    <div>
                                        <div className={`font-bold ${isKnown ? "text-green-500" : "text-gray-300"}`}>{spell.name} {isKnown && "✓"}</div>
                                        <div className="text-[10px] text-gray-600 max-w-[200px] truncate">{spell.level} • {spell.school}</div>
                                    </div>
                                    {!isKnown && (
                                        <div className={`text-xs font-mono ${canAfford ? "text-yellow-600" : "text-red-900"}`}>{cost} gp</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 border-t border-cyan-900/30 bg-[#08080a] h-32">
                        {selectedSpell ? (
                            <div className="flex justify-between items-end h-full">
                                <div className="flex-1 pr-4">
                                    <h3 className="text-cyan-400 font-bold">{selectedSpell.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{selectedSpell.description}</p>
                                </div>
                                {knownSpells.includes(selectedSpell.name) ? (
                                    <button disabled className="px-6 py-3 bg-green-900/20 border border-green-900 text-green-500 font-bold uppercase text-xs cursor-default">
                                        Learned
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onLearn(selectedSpell.name, getCost(selectedSpell.level))}
                                        disabled={playerGold < getCost(selectedSpell.level)}
                                        className={`px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all ${playerGold >= getCost(selectedSpell.level) ? "bg-cyan-900 hover:bg-cyan-700 text-white shadow-[0_0_15px_cyan]" : "bg-[#222] text-[#555] cursor-not-allowed"}`}
                                    >
                                        Copy Spell
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-700 text-xs italic">
                                Select a spell to decipher...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

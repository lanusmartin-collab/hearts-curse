import React, { useState } from 'react';
import { Skull, Shield, Zap, Book, ArrowRight } from 'lucide-react';

interface CharacterCreationProps {
    onComplete: (selectedClass: string) => void;
}

const CLASSES = [
    {
        id: 'paladin',
        name: 'The Oathbound',
        icon: Shield,
        description: 'A holy warrior driven by a sacred vow. Heavy armor, divine smites, and healing hands.',
        stats: 'STR / CHA',
        ability: 'Divine Smite'
    },
    {
        id: 'rogue',
        name: 'The Shadow',
        icon: Skull,
        description: 'A master of stealth and precision. Sneak attacks, skill mastery, and evasive maneuvers.',
        stats: 'DEX / INT',
        ability: 'Sneak Attack'
    },
    {
        id: 'wizard',
        name: 'The Arcanist',
        icon: Zap,
        description: 'A scholar of the arcane arts. Massive damage spells, utility rituals, and fragilty.',
        stats: 'INT / WIS',
        ability: 'Fireball'
    },
    {
        id: 'cleric',
        name: 'The Priest',
        icon: Book,
        description: 'A conduit of divine power. Powerful healing, protective buffs, and spiritual weapons.',
        stats: 'WIS / CON',
        ability: 'Turn Undead'
    }
];

export default function CharacterCreation({ onComplete }: CharacterCreationProps) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-[#d4c391] p-8 font-serif animate-fade-in relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl w-full">
                <h1 className="text-4xl md:text-6xl text-center mb-2 tracking-widest text-[#a32222] font-bold">WHO ART THOU?</h1>
                <p className="text-center mb-12 text-[#8b7e66] italic">"The cycle begins anew. Choose the vessel for your soul."</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {CLASSES.map((c) => {
                        const Icon = c.icon;
                        const isSelected = selected === c.id;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setSelected(c.id)}
                                className={`
                                    relative p-6 border-2 transition-all duration-300 flex flex-col items-center text-center group
                                    ${isSelected
                                        ? 'border-[#a32222] bg-[#2a0a0a] scale-105 shadow-[0_0_20px_rgba(163,34,34,0.4)]'
                                        : 'border-[#4a3e3e] bg-[#1a1212] hover:border-[#8b7e66] hover:bg-[#221a1a]'}
                                `}
                            >
                                <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-[#a32222]' : 'text-[#6b5e5e] group-hover:text-[#d4c391]'}`} />
                                <h3 className={`text-xl font-bold mb-2 uppercase tracking-wide ${isSelected ? 'text-[#ffdddd]' : 'text-[#8b7e66]'}`}>{c.name}</h3>
                                <div className="text-xs font-mono text-[#a32222] mb-3">{c.stats}</div>
                                <p className="text-sm opacity-80 leading-relaxed text-[#a19682]">{c.description}</p>

                                {isSelected && (
                                    <div className="absolute -bottom-3 bg-[#a32222] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                        Selected
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => selected && onComplete(selected)}
                        disabled={!selected}
                        className={`
                            group relative px-12 py-4 text-lg font-bold uppercase tracking-[0.2em] transition-all duration-500
                            ${selected
                                ? 'bg-[#a32222] text-black hover:bg-[#ff3333] hover:shadow-[0_0_30px_rgba(255,50,50,0.6)] cursor-pointer'
                                : 'bg-[#1a1212] text-[#4a3e3e] border border-[#2a2222] cursor-not-allowed'}
                        `}
                    >
                        <span className="flex items-center gap-4">
                            Begin Journey <ArrowRight className={`w-5 h-5 transition-transform ${selected ? 'group-hover:translate-x-2' : ''}`} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

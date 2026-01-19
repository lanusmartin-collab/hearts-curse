"use client";

import React, { useState } from 'react';
import { Skull, Shield, Zap, Book, ArrowRight, User } from 'lucide-react';
import { Combatant } from '@/types/combat';

interface CharacterCreationProps {
    onComplete: (character: Combatant) => void;
}

const CLASSES = [
    {
        id: 'warrior',
        name: 'The Oathbound',
        icon: Shield,
        description: 'A holy warrior driven by a sacred vow. Heavy armor and divine smites.',
        stats: { str: 16, dex: 10, con: 14, int: 10, wis: 12, cha: 14 },
        hp: 12, ac: 18,
        attacks: [
            { name: "Longsword", bonus: 5, damage: "1d8+3" },
            { name: "Divine Smite", bonus: 5, damage: "2d8+3" }
        ]
    },
    {
        id: 'rogue',
        name: 'The Shadow',
        icon: Skull,
        description: 'A master of stealth. Deals massive damage to distracted foes.',
        stats: { str: 10, dex: 16, con: 12, int: 14, wis: 10, cha: 14 },
        hp: 10, ac: 15,
        attacks: [
            { name: "Dagger", bonus: 5, damage: "1d4+3" },
            { name: "Sneak Attack", bonus: 5, damage: "3d6+3" }
        ]
    },
    {
        id: 'mage',
        name: 'The Arcanist',
        icon: Zap,
        description: 'A scholar of the arcane. Fragile, but commands destructive power.',
        stats: { str: 8, dex: 14, con: 12, int: 16, wis: 12, cha: 10 },
        hp: 8, ac: 12,
        attacks: [
            { name: "Firebolt", bonus: 5, damage: "1d10" },
            { name: "Magic Missile", bonus: 100, damage: "3d4+3" } // Auto hit mechanic logic handled separately or high bonus
        ]
    },
    {
        id: 'cleric',
        name: 'The Priest',
        icon: Book,
        description: 'A conduit of divine power. Heals allies and banishes the dark.',
        stats: { str: 12, dex: 10, con: 14, int: 10, wis: 16, cha: 12 },
        hp: 10, ac: 16,
        attacks: [
            { name: "Mace", bonus: 4, damage: "1d6+2" },
            { name: "Guiding Bolt", bonus: 5, damage: "4d6" }
        ]
    }
];

export default function CharacterCreation({ onComplete }: CharacterCreationProps) {
    const [name, setName] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleConfirm = () => {
        if (!name || !selectedId) return;
        const cls = CLASSES.find(c => c.id === selectedId);
        if (!cls) return;

        const newCharacter: Combatant = {
            id: `player-${Date.now()}`,
            name: name,
            type: 'player',
            hp: cls.hp,
            maxHp: cls.hp,
            ac: cls.ac,
            initiative: 0, // Rolled at combat start
            conditions: [],
            stats: cls.stats,
            attacks: cls.attacks
        };

        onComplete(newCharacter);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#d4c391] p-6 font-serif animate-in fade-in relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-10 blur-sm pointer-events-none"></div>

            <div className="relative z-10 max-w-5xl w-full flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl text-[#a32222] font-bold tracking-widest uppercase mb-2">Soul Vessel</h1>
                    <div className="h-[1px] w-24 bg-[#a32222] mx-auto mb-4"></div>
                    <p className="text-[#8b7e66] text-sm">Forge your identity before the end.</p>
                </div>

                {/* Name Input */}
                <div className="w-full max-w-md mb-12">
                    <label className="block text-xs uppercase tracking-widest text-[#555] mb-2 font-bold">Character Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full bg-[#0a0a0c] border border-[#333] py-4 pl-12 pr-4 text-[#d4c391] font-bold focus:outline-none focus:border-[#a32222] focus:ring-1 focus:ring-[#a32222] transition-all placeholder:text-[#333]"
                        />
                    </div>
                </div>

                {/* Class Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full">
                    {CLASSES.map((c) => {
                        const Icon = c.icon;
                        const isSelected = selectedId === c.id;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setSelectedId(c.id)}
                                className={`
                                    relative p-6 border transition-all duration-300 flex flex-col items-center text-center group overflow-hidden
                                    ${isSelected
                                        ? 'border-[#a32222] bg-[#1a0505] shadow-[0_0_20px_rgba(163,34,34,0.2)]'
                                        : 'border-[#1a1a1a] bg-[#0a0a0c] hover:border-[#444]'}
                                `}
                            >
                                {/* Selection Indicator */}
                                {isSelected && <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[#a32222]"></div>}

                                <Icon className={`w-10 h-10 mb-4 transition-colors ${isSelected ? 'text-[#a32222]' : 'text-[#444] group-hover:text-[#888]'}`} />
                                <h3 className={`text-lg font-bold mb-1 uppercase tracking-wide ${isSelected ? 'text-[#d4c391]' : 'text-[#666]'}`}>{c.name}</h3>

                                <div className="flex gap-2 text-[10px] font-mono text-[#a32222] mb-4 uppercase">
                                    <span>HP: {c.hp}</span>
                                    <span>AC: {c.ac}</span>
                                </div>

                                <p className="text-xs leading-relaxed text-[#888]">{c.description}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedId || !name}
                        className={`
                            group relative px-10 py-4 text-base font-bold uppercase tracking-[0.2em] transition-all duration-300
                            ${(selectedId && name)
                                ? 'bg-[#a32222] text-white hover:bg-[#c42828] hover:shadow-[0_0_20px_rgba(163,34,34,0.4)] cursor-pointer'
                                : 'bg-[#111] text-[#333] border border-[#222] cursor-not-allowed'}
                        `}
                    >
                        <span className="flex items-center gap-3">
                            Begin Journey <ArrowRight className={`w-4 h-4 transition-transform ${(selectedId && name) ? 'group-hover:translate-x-1' : ''}`} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

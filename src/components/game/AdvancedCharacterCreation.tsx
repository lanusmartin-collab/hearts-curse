"use client";

import React, { useState } from "react";
import { Dices, Save, Sword, Shield, Crown, Scroll, Ghost } from "lucide-react";
import { Combatant } from "@/types/combat";
import { RACES } from "@/lib/data/races";
import { ALIGNMENTS } from "@/lib/data/alignments";
import { STARTING_EQUIPMENT } from "@/lib/data/equipment";

interface AdvancedCharacterCreationProps {
    onComplete: (character: Combatant) => void;
}

const CLASSES = [
    { id: 'paladin', name: 'Paladin', hp: 120, ac: 18, traits: ['Smite', 'Lay on Hands'] },
    { id: 'wizard', name: 'Wizard', hp: 80, ac: 12, traits: ['Spellcasting', 'Arcane Recovery'] },
    { id: 'rogue', name: 'Rogue', hp: 100, ac: 15, traits: ['Sneak Attack', 'Evasion'] },
    { id: 'cleric', name: 'Cleric', hp: 110, ac: 16, traits: ['Divine Domain', 'Channel Divinity'] },
    { id: 'fighter', name: 'Fighter', hp: 130, ac: 17, traits: ['Action Surge', 'Second Wind'] },
];

export default function AdvancedCharacterCreation({ onComplete }: AdvancedCharacterCreationProps) {
    const [name, setName] = useState("Hero");
    const [raceId, setRaceId] = useState("human");
    const [classId, setClassId] = useState("paladin");
    const [alignment, setAlignment] = useState(ALIGNMENTS[0]);

    // Stats (0-20)
    const [stats, setStats] = useState({
        str: 15, dex: 10, con: 14, int: 10, wis: 12, cha: 14
    });

    const [equipment, setEquipment] = useState<Set<string>>(new Set());

    const selectedRace = RACES.find(r => r.id === raceId);
    const selectedClass = CLASSES.find(c => c.id === classId);

    const handleStatChange = (stat: keyof typeof stats, val: string) => {
        const num = parseInt(val) || 0;
        setStats(prev => ({ ...prev, [stat]: Math.min(20, Math.max(0, num)) }));
    };

    const rollStats = () => {
        const roll4d6drop1 = () => {
            const rolls = [0, 0, 0, 0].map(() => Math.ceil(Math.random() * 6)).sort((a, b) => b - a);
            return rolls[0] + rolls[1] + rolls[2];
        };
        setStats({
            str: roll4d6drop1(), dex: roll4d6drop1(), con: roll4d6drop1(),
            int: roll4d6drop1(), wis: roll4d6drop1(), cha: roll4d6drop1()
        });
    };

    const toggleEquip = (id: string) => {
        const next = new Set(equipment);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setEquipment(next);
    };

    const exportCharacter = () => {
        const char = createCharacterObject();
        const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_lvl20.json`;
        a.click();
    };

    const createCharacterObject = (): Combatant => {
        const hp = (selectedClass?.hp || 100) + ((stats.con - 10) * 10); // Rough Lvl 20 calc

        // Base AC + dex mod (simplified)
        let ac = 10 + Math.floor((stats.dex - 10) / 2);
        if (selectedClass?.ac) ac = selectedClass.ac; // Use class base if higher (representing armor)

        return {
            id: `player-${Date.now()}`,
            name,
            type: 'player',
            level: 20,
            race: raceId,
            alignment,
            equipment: Array.from(equipment),
            hp,
            maxHp: hp,
            ac,
            initiative: 0,
            conditions: [],
            stats,
            attacks: [
                { name: "Main Attack", bonus: 11, damage: "2d6+5" } // Placeholder
            ]
        };
    };

    const handleFinish = () => {
        onComplete(createCharacterObject());
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0c] text-[#d4c391] z-[100] font-serif overflow-y-auto custom-scrollbar flex">
            {/* LEFT: Controls */}
            <div className="w-1/2 p-8 space-y-8 border-r border-[#333]">

                <h2 className="text-3xl font-bold text-[#a32222] border-b border-[#333] pb-4">Character Creation (Lvl 20)</h2>

                {/* Name & Identity */}
                <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-widest text-[#666]">Identity</label>
                    <input
                        value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#a32222] outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={raceId} onChange={(e) => setRaceId(e.target.value)}
                            className="bg-[#111] border border-[#333] p-2"
                        >
                            {RACES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <select
                            value={alignment} onChange={(e) => setAlignment(e.target.value as any)}
                            className="bg-[#111] border border-[#333] p-2"
                        >
                            {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                {/* Class Selection */}
                <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-widest text-[#666]">Class</label>
                    <div className="grid grid-cols-3 gap-2">
                        {CLASSES.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setClassId(cls.id)}
                                className={`p-3 border text-sm transition-all ${classId === cls.id ? 'bg-[#a32222] border-[#ff4444] text-white' : 'border-[#333] hover:border-[#666]'}`}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-[#888] italic">Traits: {selectedClass?.traits.join(", ")}</p>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs uppercase tracking-widest text-[#666]">Ability Scores (Max 20)</label>
                        <button onClick={rollStats} className="text-[#a32222] text-xs flex items-center gap-1 hover:text-white"><Dices className="w-3 h-3" /> Roll 4d6</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {(Object.keys(stats) as Array<keyof typeof stats>).map(key => (
                            <div key={key} className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase text-[#666]">{key}</span>
                                <input
                                    type="number" max={20} min={1}
                                    value={stats[key]}
                                    onChange={(e) => handleStatChange(key, e.target.value)}
                                    className="bg-[#111] border border-[#333] p-2 text-center text-lg font-bold text-white focus:border-[#a32222] outline-none"
                                />
                                <span className="text-[10px] text-center text-[#444]">{Math.floor((stats[key] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stats[key] - 10) / 2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equipment */}
                <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-widest text-[#666]">Legendary Equipment</label>
                    <div className="h-48 overflow-y-auto custom-scrollbar border border-[#333] p-2 grid grid-cols-1 gap-2">
                        {STARTING_EQUIPMENT.map(item => (
                            <div
                                key={item.id}
                                onClick={() => toggleEquip(item.id)}
                                className={`flex justify-between items-center p-2 cursor-pointer border hover:bg-[#1a1a1a] transition-all ${equipment.has(item.id) ? 'border-[#d4c391] bg-[#1a1818]' : 'border-transparent'}`}
                            >
                                <div className="flex items-center gap-2">
                                    {item.type === 'weapon' && <Sword className="w-3 h-3 text-red-500" />}
                                    {item.type === 'armor' && <Shield className="w-3 h-3 text-blue-500" />}
                                    {item.type === 'gear' && <Crown className="w-3 h-3 text-yellow-500" />}
                                    <span className="text-sm">{item.name}</span>
                                </div>
                                {item.stats && <span className="text-[10px] text-[#666]">{item.stats}</span>}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT: Preview */}
            <div className="w-1/2 bg-[url('/textures/paper_texture.jpg')] bg-cover text-[#1a1a1a] p-12 relative flex flex-col">
                <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={exportCharacter} className="p-2 border border-[#8b7e66] hover:bg-[#8b7e66]/20 transition-colors" title="Export JSON">
                        <Save className="w-4 h-4" />
                    </button>
                </div>

                <div className="border-4 border-double border-[#4a0404] h-full p-8 flex flex-col items-center">
                    <div className="w-32 h-32 border-2 border-[#1a1a1a] rounded-full overflow-hidden mb-6 bg-gray-300">
                        {/* Avatar Placeholder */}
                    </div>

                    <h1 className="text-4xl font-bold uppercase tracking-widest border-b-2 border-[#1a1a1a] pb-2 mb-2">{name}</h1>
                    <div className="flex gap-4 text-sm font-bold uppercase tracking-wider mb-8">
                        <span>Lvl 20 {selectedClass?.name}</span>
                        <span>•</span>
                        <span>{selectedRace?.name}</span>
                        <span>•</span>
                        <span>{alignment}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full max-w-md">
                        <div className="flex justify-between border-b border-[#1a1a1a] border-dotted">
                            <span>Hit Points</span>
                            <span className="font-bold">{(selectedClass?.hp || 100) + ((stats.con - 10) * 10)}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1a1a1a] border-dotted">
                            <span>Armor Class</span>
                            <span className="font-bold">{10 + Math.floor((stats.dex - 10) / 2)}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1a1a1a] border-dotted">
                            <span>Proficiency</span>
                            <span className="font-bold">+6</span>
                        </div>
                        <div className="flex justify-between border-b border-[#1a1a1a] border-dotted">
                            <span>Speed</span>
                            <span className="font-bold">{selectedRace?.speed} ft</span>
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <h3 className="text-sm font-bold uppercase border-b border-[#1a1a1a] mb-2 flex items-center gap-2"><Scroll className="w-3 h-3" /> Inventory</h3>
                        <ul className="text-sm space-y-1">
                            {Array.from(equipment).map(id => {
                                const item = STARTING_EQUIPMENT.find(i => i.id === id);
                                return <li key={id}>- {item?.name}</li>
                            })}
                        </ul>
                    </div>

                    <div className="mt-auto pt-8">
                        <button
                            onClick={handleFinish}
                            className="w-full px-12 py-4 bg-[#8a1c1c] text-[#f4e8d1] font-bold text-xl uppercase tracking-[0.2em] shadow-lg hover:bg-[#a32222] transition-colors flex items-center justify-center gap-4"
                        >
                            <Sword className="w-6 h-6" /> Begin Prologue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

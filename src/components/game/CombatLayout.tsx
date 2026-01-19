"use client";

import React, { useState, useEffect } from "react";
import { Skull, Shield, Swords, Activity, Zap } from "lucide-react";
import CombatantCard from "@/components/ui/CombatantCard";
import { Combatant } from "@/types/combat";
import monstersData from "@/lib/data/monsters_custom.json"; // Assuming direct import works
import { useAudio } from "@/lib/context/AudioContext";
import DiceRoller from "@/components/ui/DiceRoller";

interface CombatLayoutProps {
    enemySlugs: string[];
    onVictory: () => void;
    onFlee: () => void;
}

// Mock Party Data (In a real app, this would be passed in or fetched from context)
const INITIAL_PARTY: Combatant[] = [
    { id: "p1", name: "Kaelen", type: "player", hp: 45, maxHp: 58, ac: 18, initiative: 12, conditions: [] },
    { id: "p2", name: "Lyra", type: "player", hp: 32, maxHp: 38, ac: 16, initiative: 18, conditions: [] },
    { id: "p3", name: "Ignis", type: "player", hp: 24, maxHp: 30, ac: 12, initiative: 10, conditions: [] },
    { id: "p4", name: "Torag", type: "player", hp: 38, maxHp: 44, ac: 20, initiative: 8, conditions: [] },
];

export default function CombatLayout({ enemySlugs, onVictory, onFlee }: CombatLayoutProps) {
    const { playSfx, playAmbience } = useAudio();
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [log, setLog] = useState<string[]>(["> Combat initiated.", "> Roll for initiative!"]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Initialize Combat
    useEffect(() => {
        playAmbience("combat");

        // Load Curse Level for Difficulty Scaling
        const savedDays = typeof window !== 'undefined' ? parseInt(localStorage.getItem('curse_days') || '0', 10) : 0;
        let curseMultiplier = 1;
        // Stage 2 (Day 7+): The Fading Color -> +10% HP
        if (savedDays >= 7) curseMultiplier = 1.1;
        // Stage 3 (Day 14+): The Whispering Void -> +25% HP
        if (savedDays >= 14) curseMultiplier = 1.25;
        // Stage 4 (Day 20+): Heart Failure -> +50% HP
        if (savedDays >= 20) curseMultiplier = 1.5;

        // Load Enemies from JSON
        console.log("Loading combat with slugs:", enemySlugs);

        const enemies: Combatant[] = enemySlugs.map((slug, i) => {
            const data = (monstersData as any[]).find((m: any) => m.slug === slug);
            if (!data) {
                console.warn(`Monster data not found for slug: ${slug}`);
                return null;
            }

            // Fallback for HP if missing
            const baseHp = data.hp || 10;
            const maxHp = Math.floor(baseHp * curseMultiplier);

            return {
                id: `e-${i}-${slug}`,
                name: data.name,
                type: "monster",
                hp: maxHp,
                maxHp: maxHp,
                ac: data.ac || 10,
                initiative: Math.floor(Math.random() * 20) + 1, // Random Init for now
                conditions: [],
                statblock: data // Store full data for inspection
            };
        }).filter(Boolean) as Combatant[];

        // Combine & Sort by Initiative
        const all = [...INITIAL_PARTY, ...enemies].sort((a, b) => b.initiative - a.initiative);
        setCombatants(all);
        setLog(prev => [...prev, `> ${enemies.length} hostiles detected.`, savedDays >= 7 ? `> CURSE EFFECT: Enemies buffed by ${Math.round((curseMultiplier - 1) * 100)}% HP.` : ""]);

    }, [enemySlugs, playAmbience]);

    // Derived State
    const currentTurnId = combatants[turnIndex]?.id;
    const currentCombatant = combatants[turnIndex];
    const isPlayerTurn = currentCombatant?.type === "player";
    const enemies = combatants.filter(c => c.type === "monster");
    const players = combatants.filter(c => c.type === "player");

    // Handlers
    const handleUpdate = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleRemove = (id: string) => {
        setCombatants(prev => prev.filter(c => c.id !== id));
        setLog(prev => [...prev, `> Combatant ${id} defeated/removed.`]);

        // Victory Check (Simple)
        if (enemies.every(e => e.id === id || e.hp <= 0)) { // This check is slightly buggy if we remove before HP 0, but good enough for now
            // Better chcek: check REMAINING
            const remainingEnemies = combatants.filter(c => c.type === "monster" && c.id !== id);
            if (remainingEnemies.length === 0) {
                setTimeout(onVictory, 2000);
                setLog(prev => [...prev, `> VICTORY! All enemies defeated.`]);
            }
        }
    };

    const nextTurn = () => {
        setTurnIndex(prev => (prev + 1) % combatants.length);
        const next = combatants[(turnIndex + 1) % combatants.length];
        setLog(prev => [...prev, `> Turn: ${next.name}`]);
    };

    const handleDefeat = (enemyId: string) => {
        handleUpdate(enemyId, { hp: 0 });
        setLog(prev => [...prev, `> Enemy defeated!`]);
        // Trigger Victory if all dead
        const remaining = enemies.filter(e => e.id !== enemyId && e.hp > 0);
        if (remaining.length === 0) {
            setLog(prev => [...prev, `> VICTORY ASSURED.`]);
            playSfx("/sfx/holy_crit.mp3");
            setTimeout(onVictory, 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black/95 text-[#c9bca0] font-serif flex flex-col animate-in fade-in duration-500">

            {/* TOP BAR */}
            <div className="h-14 border-b-2 border-[#5c1212] bg-[#1a0505] flex items-center justify-between px-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <Swords className="text-[#a32222] w-6 h-6 animate-pulse" />
                    <h1 className="text-xl font-bold tracking-widest text-[#a32222] uppercase">Combat Encounter</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                    <span>ROUND 1</span>
                    <button onClick={onFlee} className="text-gray-400 hover:text-white hover:underline">[FLEE]</button>
                </div>
            </div>

            {/* BATTLEFIELD */}
            <div className="flex-1 flex overflow-hidden">

                {/* INITIATIVE ORDER (Left Sidebar) */}
                <div className="w-64 bg-[#0a0a0c] border-r border-[#333] p-2 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs uppercase text-gray-600 font-bold mb-2 px-1">Turn Order</h3>
                    {combatants.map((c, i) => (
                        <div key={c.id} className={`opacity-${(c.hp <= 0) ? '40' : '100'}`}>
                            <CombatantCard
                                data={c}
                                isActive={c.id === currentCombatant?.id}
                                isInspected={selectedId === c.id}
                                onUpdate={handleUpdate}
                                onRemove={() => handleDefeat(c.id)} // "Remove" kills them for now
                                onInspect={setSelectedId}
                            />
                        </div>
                    ))}
                </div>

                {/* MAIN VIEW (Center - Statblocks & Actions) */}
                <div className="flex-1 flex flex-col bg-[#111] relative">
                    <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-10 grayscale pointer-events-none"></div>

                    {/* Active Combatant Info */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative z-10">
                        {isPlayerTurn ? (
                            <div className="animate-slide-up">
                                <h2 className="text-4xl text-[#4a9eff] font-bold mb-2">IT IS YOUR TURN</h2>
                                <p className="text-xl text-gray-400 mb-8">{currentCombatant?.name}, choose your action.</p>

                                <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                                    <button onClick={() => setLog(l => [...l, `> ${currentCombatant.name} attacks!`])} className="p-4 bg-[#2a0a0a] border border-[#a32222] hover:bg-[#a32222] hover:text-white transition-all uppercase tracking-widest font-bold">
                                        Attack
                                    </button>
                                    <button onClick={() => setLog(l => [...l, `> ${currentCombatant.name} casts a spell!`])} className="p-4 bg-[#0a1a2a] border border-[#0044aa] hover:bg-[#0044aa] hover:text-white transition-all uppercase tracking-widest font-bold">
                                        Cast Spell
                                    </button>
                                    <button className="p-4 bg-[#1a1a1a] border border-[#333] hover:border-gray-500 hover:text-white transition-all uppercase tracking-widest font-bold">
                                        Item
                                    </button>
                                    <button onClick={nextTurn} className="p-4 bg-[#333] border border-[#555] hover:bg-white hover:text-black transition-all uppercase tracking-widest font-bold">
                                        End Turn
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse">
                                <h2 className="text-4xl text-[#a32222] font-bold mb-2">ENEMY TURN</h2>
                                <p className="text-xl text-gray-400 mb-8">{currentCombatant?.name} is acting...</p>
                                <button onClick={nextTurn} className="px-6 py-2 border border-[#333] text-gray-500 hover:text-white">
                                    [DM: PROCEED]
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Statblock Viewer (Bottom or Overlay) */}
                    {selectedId && (
                        <div className="absolute top-4 right-4 w-96 max-h-[80vh] overflow-y-auto bg-black border border-[#a32222] p-4 shadow-2xl z-20">
                            <button onClick={() => setSelectedId(null)} className="absolute top-2 right-2 text-red-500">[x]</button>
                            <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                                {JSON.stringify(combatants.find(c => c.id === selectedId)?.statblock, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* COMBAT LOG */}
            <div className="h-40 bg-black border-t-2 border-[#333] p-4 overflow-y-auto font-mono text-sm text-green-500/80">
                {log.map((entry, i) => (
                    <div key={i} className="mb-1 border-b border-[#333]/30 pb-1">{entry}</div>
                ))}
                <div ref={(el) => el?.scrollIntoView()} />
            </div>

            {/* Dice Overlay */}
            <DiceRoller />
        </div>
    );
}

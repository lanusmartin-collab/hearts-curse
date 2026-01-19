"use client";

import React, { useState, useEffect } from "react";
import { Skull, Shield, Swords, Activity, Zap, Crosshair } from "lucide-react";
import CombatantCard from "@/components/ui/CombatantCard";
import { Combatant } from "@/types/combat";
import monstersData from "@/lib/data/monsters_custom.json";
import { useAudio } from "@/lib/context/AudioContext";
import DiceRoller from "@/components/ui/DiceRoller";

interface CombatLayoutProps {
    enemySlugs: string[];
    onVictory: () => void;
    onFlee: () => void;
    onDefeat?: () => void;
}

// Mock Party Data with Combat Stats
const INITIAL_PARTY: Combatant[] = [
    {
        id: "p1", name: "Kaelen", type: "player", hp: 45, maxHp: 58, ac: 18, initiative: 12, conditions: [],
        stats: { str: 18, dex: 10, con: 14, int: 10, wis: 14, cha: 16 },
        attacks: [
            { name: "Longsword", bonus: 7, damage: "1d8+4" },
            { name: "Smite", bonus: 7, damage: "1d8+4" } // Simplified
        ]
    },
    {
        id: "p2", name: "Lyra", type: "player", hp: 32, maxHp: 38, ac: 16, initiative: 18, conditions: [],
        stats: { str: 10, dex: 18, con: 12, int: 14, wis: 10, cha: 14 },
        attacks: [
            { name: "Shortbow", bonus: 6, damage: "1d6+4" },
            { name: "Dagger", bonus: 6, damage: "1d4+4" }
        ]
    },
    {
        id: "p3", name: "Ignis", type: "player", hp: 24, maxHp: 30, ac: 12, initiative: 10, conditions: [],
        stats: { str: 8, dex: 14, con: 14, int: 18, wis: 12, cha: 10 },
        attacks: [
            { name: "Firebolt", bonus: 7, damage: "1d10" },
            { name: "Dagger", bonus: 5, damage: "1d4+2" }
        ]
    },
    {
        id: "p4", name: "Torag", type: "player", hp: 38, maxHp: 44, ac: 20, initiative: 8, conditions: [],
        stats: { str: 16, dex: 10, con: 16, int: 10, wis: 16, cha: 12 },
        attacks: [
            { name: "Warhammer", bonus: 6, damage: "1d8+3" },
            { name: "Guiding Bolt", bonus: 6, damage: "4d6" }
        ]
    },
];

// Simple Dice Helper
function resolveRoll(formula: string): number {
    // Basic parser for "XdY+Z"
    let total = 0;
    const parts = formula.toLowerCase().replace(/\s/g, "").split('+');
    parts.forEach(part => {
        if (part.includes('d')) {
            const [count, sides] = part.split('d').map(Number);
            for (let i = 0; i < (count || 1); i++) {
                total += Math.floor(Math.random() * (sides || 6)) + 1;
            }
        } else {
            total += parseInt(part) || 0;
        }
    });
    return total;
}

export default function CombatLayout({ enemySlugs, onVictory, onFlee, onDefeat }: CombatLayoutProps) {
    const { playSfx, playAmbience } = useAudio();
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [log, setLog] = useState<string[]>(["> Combat initiated.", "> Roll for initiative!"]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [targetingMode, setTargetingMode] = useState(false);
    const [pendingAction, setPendingAction] = useState<any>(null); // Action waiting for target

    // Initialize Combat
    useEffect(() => {
        playAmbience("combat");

        const savedDays = typeof window !== 'undefined' ? parseInt(localStorage.getItem('curse_days') || '0', 10) : 0;
        let curseMultiplier = 1;
        if (savedDays >= 7) curseMultiplier = 1.1;
        if (savedDays >= 14) curseMultiplier = 1.25;
        if (savedDays >= 20) curseMultiplier = 1.5;

        console.log("Loading combat with slugs:", enemySlugs);

        const enemies: Combatant[] = enemySlugs.map((slug, i) => {
            const data = (monstersData as any[]).find((m: any) => m.slug === slug);
            if (!data) {
                console.warn(`Monster data not found for slug: ${slug}`);
                return null;
            }

            const baseHp = data.hp || 10;
            const maxHp = Math.floor(baseHp * curseMultiplier);

            // Extract attacks from actions if available
            const monsterAttacks = data.actions?.filter((a: any) => a.desc.includes("Attack")).map((a: any) => {
                // Heuristic parsing for statblocks
                const hitMatch = a.desc.match(/\+(\d+)\s+to\s+hit/);
                const dmgMatch = a.desc.match(/Hit:\s+\d+\s+\(([^)]+)\)/);
                return {
                    name: a.name,
                    bonus: hitMatch ? parseInt(hitMatch[1]) : 4,
                    damage: dmgMatch ? dmgMatch[1] : "1d6+2"
                };
            }) || [{ name: "Slam", bonus: 4, damage: "1d6+2" }];

            return {
                id: `e-${i}-${slug}`,
                name: data.name,
                type: "monster",
                hp: maxHp,
                maxHp: maxHp,
                ac: data.ac || 10,
                initiative: Math.floor(Math.random() * 20) + 1,
                conditions: [],
                statblock: data,
                attacks: monsterAttacks
            };
        }).filter(Boolean) as Combatant[];

        const all = [...INITIAL_PARTY, ...enemies].sort((a, b) => b.initiative - a.initiative);
        setCombatants(all);
        setLog(prev => [...prev, `> ${enemies.length} hostiles detected.`, savedDays >= 7 ? `> CURSE EFFECT: Enemies buffed by ${Math.round((curseMultiplier - 1) * 100)}% HP.` : ""]);

    }, [enemySlugs, playAmbience]);

    const currentCombatant = combatants[turnIndex];
    const isPlayerTurn = currentCombatant?.type === "player";
    const enemies = combatants.filter(c => c.type === "monster");
    const players = combatants.filter(c => c.type === "player");

    // Handlers
    const handleUpdate = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleDefeat = (entityId: string) => {
        handleUpdate(entityId, { hp: 0 });
        const entity = combatants.find(c => c.id === entityId);
        setLog(prev => [...prev, `> ${entity?.name || 'Unit'} defeated!`]);

        // Check Victory (No enemies left)
        if (entity?.type === 'monster') {
            const remainingEnemies = combatants.filter(c => c.type === 'monster' && c.id !== entityId && c.hp > 0);
            if (remainingEnemies.length === 0) {
                setLog(prev => [...prev, `> VICTORY ASSURED.`]);
                playSfx("/sfx/holy_crit.mp3");
                setTimeout(onVictory, 3000);
            }
        }

        // Check Defeat (No players left)
        if (entity?.type === 'player') {
            const remainingPlayers = combatants.filter(c => c.type === 'player' && c.id !== entityId && c.hp > 0);
            if (remainingPlayers.length === 0) {
                setLog(prev => [...prev, `> CRITICAL FAILURE. PARTY ELIMINATED.`]);
                if (onDefeat) {
                    setTimeout(onDefeat, 3000);
                } else {
                    setLog(prev => [...prev, `> GAME OVER.`]);
                }
            }
        }
    };

    const addToLog = (msg: string) => setLog(prev => [...prev.slice(-10), msg]);

    // Attack Workflow
    const prepareAttack = (attack: any) => {
        setPendingAction(attack);
        setTargetingMode(true);
        addToLog(`> Select a target for ${attack.name}...`);
    };

    const executeAttack = (targetId: string) => {
        if (!currentCombatant || !pendingAction) return;

        setTargetingMode(false);
        const target = combatants.find(c => c.id === targetId);
        if (!target) return;

        // Roll Hit
        const d20 = Math.floor(Math.random() * 20) + 1;
        const totalHit = d20 + pendingAction.bonus;
        const isCrit = d20 === 20;
        const isMiss = totalHit < target.ac && !isCrit;

        let msg = `> ${currentCombatant.name} uses ${pendingAction.name} on ${target.name}... `;

        if (isCrit) {
            msg += `CRITICAL HIT! (Nat 20) `;
            playSfx("/sfx/holy_crit.mp3");
        } else if (isMiss) {
            msg += `MISS. (${totalHit} vs AC ${target.ac})`;
            playSfx("/sfx/dice_settle.mp3"); // Weak sound
            addToLog(msg);
            setPendingAction(null);
            // End turn? Optional, maybe multiple attacks later
            return;
        } else {
            msg += `HIT. (${totalHit} vs AC ${target.ac}) `;
            playSfx("/sfx/dice_throw.mp3"); // Hit element
        }

        // Roll Damage
        const damage = resolveRoll(pendingAction.damage) * (isCrit ? 2 : 1);
        const newHp = Math.max(0, target.hp - damage);

        msg += `Deals ${damage} damage!`;
        addToLog(msg);

        handleUpdate(targetId, { hp: newHp });
        setPendingAction(null);

        if (newHp === 0) {
            handleDefeat(targetId);
        }
    };

    // Enemy AI
    const enemyTurnAI = () => {
        if (!currentCombatant) return;

        setTimeout(() => {
            // 1. Select Target (Random live player)
            const livePlayers = players.filter(p => p.hp > 0);
            const target = livePlayers[Math.floor(Math.random() * livePlayers.length)];

            if (!target) {
                addToLog(`> ${currentCombatant.name} roars in victory! (No targets left)`);
                return;
            }

            // 2. Select Attack
            const attack = currentCombatant.attacks?.[0] || { name: "Slam", bonus: 5, damage: "1d6+3" };

            // 3. Roll
            const d20 = Math.floor(Math.random() * 20) + 1;
            const totalHit = d20 + attack.bonus;

            if (totalHit >= target.ac) {
                const dmg = resolveRoll(attack.damage);
                addToLog(`> ${currentCombatant.name} attacks ${target.name} with ${attack.name}... HIT! Takes ${dmg} damage.`);
                handleUpdate(target.id, { hp: Math.max(0, target.hp - dmg) });
                playSfx("/sfx/glitch_crit.mp3"); // Enemy hit sound

                // Check if target died from this exact hit
                // handleUpdate is async state update so checking updated state here is tricky in this closure
                // But we can check the calculation
                if (Math.max(0, target.hp - dmg) === 0) {
                    handleDefeat(target.id);
                }

            } else {
                addToLog(`> ${currentCombatant.name} attacks ${target.name}... MISS. (${totalHit})`);
            }

            // 4. End Turn
            setTimeout(nextTurn, 1500);

        }, 1000);
    };

    useEffect(() => {
        if (!isPlayerTurn && currentCombatant) {
            enemyTurnAI();
        }
    }, [turnIndex, combatants]); // Re-run when turn changes

    const nextTurn = () => {
        setTurnIndex(prev => (prev + 1) % combatants.length);
        setTargetingMode(false);
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
                    <span className={isPlayerTurn ? "text-green-500" : "text-red-500"}>
                        {isPlayerTurn ? "PLAYER TURN" : "ENEMY TURN"}
                    </span>
                    <button onClick={onFlee} className="text-gray-400 hover:text-white hover:underline">[FLEE]</button>
                </div>
            </div>

            {/* BATTLEFIELD */}
            <div className="flex-1 flex overflow-hidden">
                {/* INITIATIVE ORDER */}
                <div className="w-64 bg-[#0a0a0c] border-r border-[#333] p-2 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs uppercase text-gray-600 font-bold mb-2 px-1">Turn Order</h3>
                    {combatants.map((c) => (
                        <div key={c.id} className={`opacity-${(c.hp <= 0) ? '40' : '100'}`}>
                            <CombatantCard
                                data={c}
                                isActive={c.id === currentCombatant?.id}
                                isInspected={selectedId === c.id}
                                onUpdate={handleUpdate}
                                onRemove={() => handleDefeat(c.id)}
                                onInspect={setSelectedId}
                            />
                        </div>
                    ))}
                </div>

                {/* MAIN VIEW */}
                <div className="flex-1 flex flex-col bg-[#111] relative">
                    <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-20 grayscale pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

                    {/* Active Combatant Info */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative z-10">
                        {isPlayerTurn ? (
                            <div className="animate-slide-up w-full max-w-2xl">
                                <h2 className="text-4xl text-[#4a9eff] font-bold mb-2 uppercase">{currentCombatant?.name}'s Turn</h2>
                                {targetingMode ? (
                                    <div className="text-center">
                                        <p className="text-xl text-red-500 animate-pulse mb-8 font-bold">SELECT A TARGET FROM THE LIST</p>
                                        <div className="flex flex-wrap gap-4 justify-center">
                                            {enemies.filter(e => e.hp > 0).map(e => (
                                                <button
                                                    key={e.id}
                                                    onClick={() => executeAttack(e.id)}
                                                    className="p-6 bg-[#1a0505] border-2 border-red-900 hover:bg-red-900 hover:text-white transition-all flex flex-col items-center gap-2 group"
                                                >
                                                    <Crosshair className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                                                    <span className="text-lg font-bold">{e.name}</span>
                                                    <span className="text-xs text-red-400">HP: {e.hp}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setTargetingMode(false)} className="mt-8 text-gray-500 hover:text-white underline">Cancel Attack</button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xl text-gray-400 mb-8">Choose an action</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {currentCombatant?.attacks?.map((atk, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => prepareAttack(atk)}
                                                    className="p-4 bg-[#2a0a0a] border border-[#a32222] hover:bg-[#a32222] hover:text-white transition-all uppercase tracking-widest font-bold flex flex-col items-center"
                                                >
                                                    <span>{atk.name}</span>
                                                    <span className="text-[10px] opacity-60 font-mono">+{atk.bonus} / {atk.damage}</span>
                                                </button>
                                            ))}
                                            <button className="p-4 bg-[#1a1a1a] border border-[#333] hover:border-gray-500 hover:text-white transition-all uppercase tracking-widest font-bold text-gray-500 cursor-not-allowed">
                                                Drink Potion
                                            </button>
                                            <button onClick={nextTurn} className="p-4 bg-[#333] border border-[#555] hover:bg-white hover:text-black transition-all uppercase tracking-widest font-bold">
                                                Skip Turn
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="animate-pulse flex flex-col items-center">
                                <Skull className="w-16 h-16 text-[#a32222] mb-4" />
                                <h2 className="text-4xl text-[#a32222] font-bold mb-2">ENEMY TURN</h2>
                                <p className="text-xl text-gray-400 mb-8">{currentCombatant?.name} is acting...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* COMBAT LOG */}
            <div className="h-48 bg-black border-t-2 border-[#333] p-4 overflow-y-auto font-mono text-xs text-green-500/80 custom-scrollbar">
                {log.map((entry, i) => (
                    <div key={i} className="mb-1 border-b border-[#333]/30 pb-1">{entry}</div>
                ))}
                <div ref={(el) => el?.scrollIntoView()} />
            </div>

            <DiceRoller />
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Skull, Swords, Zap, Crosshair, User, ShieldAlert, Heart } from "lucide-react";
import CombatantCard from "@/components/ui/CombatantCard";
import { Combatant } from "@/types/combat";
import monstersData from "@/lib/data/monsters_custom.json";
import { useAudio } from "@/lib/context/AudioContext";
import DiceRoller from "@/components/ui/DiceRoller";

interface CombatLayoutProps {
    enemySlugs: string[];
    playerCharacter?: Combatant;
    onVictory: () => void;
    onFlee: () => void;
    onDefeat?: () => void;
}

// Fallback if no character passed (e.g. testing)
const MOCK_PLAYER: Combatant = {
    id: "p1", name: "Unknown Hero", type: "player", hp: 20, maxHp: 20, ac: 14, initiative: 12, conditions: [],
    stats: { str: 14, dex: 14, con: 14, int: 10, wis: 10, cha: 10 },
    attacks: [{ name: "Rusty Blade", bonus: 4, damage: "1d6+2" }]
};

function resolveRoll(formula: string): number {
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

export default function CombatLayout({ enemySlugs, playerCharacter, onVictory, onFlee, onDefeat }: CombatLayoutProps) {
    const { playSfx, playAmbience } = useAudio();
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [turnIndex, setTurnIndex] = useState(0);
    const [log, setLog] = useState<string[]>(["> Combat initiated.", "> Roll for initiative!"]);
    const [targetingMode, setTargetingMode] = useState(false);
    const [pendingAction, setPendingAction] = useState<any>(null);

    // Initialize Combat
    useEffect(() => {
        playAmbience("combat");

        const savedDays = typeof window !== 'undefined' ? parseInt(localStorage.getItem('curse_days') || '0', 10) : 0;
        let curseMultiplier = 1;
        if (savedDays >= 7) curseMultiplier = 1.1;

        const enemies: Combatant[] = enemySlugs.map((slug, i) => {
            const data = (monstersData as any[]).find((m: any) => m.slug === slug);
            if (!data) return null;

            const baseHp = data.hp || 10;
            const maxHp = Math.floor(baseHp * curseMultiplier);
            const monsterAttacks = data.actions?.filter((a: any) => a.desc.includes("Attack")).map((a: any) => {
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

        const hero = playerCharacter ? { ...playerCharacter, initiative: Math.floor(Math.random() * 20) + playerCharacter.stats.dex } : MOCK_PLAYER;

        // Optionally add a narrative ally for the Intro fight? Keeping it solo for dragging effect
        const all = [hero, ...enemies].sort((a, b) => b.initiative - a.initiative);
        setCombatants(all);
        setLog([`> ${hero.name} draws their weapon.`, `> ${enemies.length} enemies engaging.`]);

    }, [enemySlugs, playAmbience, playerCharacter]);

    const currentCombatant = combatants[turnIndex];
    const isPlayerTurn = currentCombatant?.type === "player";
    const enemies = combatants.filter(c => c.type === "monster");

    const handleUpdate = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const handleDefeat = (entityId: string) => {
        handleUpdate(entityId, { hp: 0 });
        const entity = combatants.find(c => c.id === entityId);
        setLog(prev => [...prev, `> ${entity?.name} defeats.`]);

        if (entity?.type === 'monster') {
            const rem = combatants.filter(c => c.type === 'monster' && c.id !== entityId && c.hp > 0);
            if (rem.length === 0) setTimeout(onVictory, 2000);
        }
        if (entity?.type === 'player') {
            // For Prologue, defeat triggers narrative progression
            const rem = combatants.filter(c => c.type === 'player' && c.id !== entityId && c.hp > 0);
            if (rem.length === 0) {
                if (onDefeat) setTimeout(onDefeat, 2000);
            }
        }
    };

    const addToLog = (msg: string) => setLog(prev => [...prev.slice(-10), msg]);

    const prepareAttack = (attack: any) => {
        setPendingAction(attack);
        setTargetingMode(true);
        addToLog(`> Targeting with ${attack.name}...`);
    };

    const executeAttack = (targetId: string) => {
        if (!currentCombatant || !pendingAction) return;

        setTargetingMode(false);
        const target = combatants.find(c => c.id === targetId);
        if (!target) return;

        // Animation / Sound hook
        playSfx("/sfx/dice_throw.mp3");

        const d20 = Math.floor(Math.random() * 20) + 1;
        const totalHit = d20 + pendingAction.bonus;
        const isMiss = totalHit < target.ac;

        if (isMiss) {
            addToLog(`> ${pendingAction.name} MISS (${totalHit} vs AC${target.ac})`);
            playSfx("/sfx/dice_settle.mp3");
        } else {
            const dmg = resolveRoll(pendingAction.damage);
            const newHp = Math.max(0, target.hp - dmg);
            addToLog(`> HIT! ${target.name} takes ${dmg} damage.`);
            playSfx("/sfx/glitch_crit.mp3"); // placeholder hit sound
            handleUpdate(targetId, { hp: newHp });
            if (newHp === 0) handleDefeat(targetId);
        }

        setPendingAction(null);
        setTimeout(nextTurn, 1000);
    };

    // Enemy AI (Simplified)
    useEffect(() => {
        if (!isPlayerTurn && currentCombatant && currentCombatant.hp > 0) {
            setTimeout(() => {
                const players = combatants.filter(c => c.type === 'player' && c.hp > 0);
                const target = players[0]; // Simple AI targets first player

                if (target) {
                    const atk = currentCombatant.attacks?.[0];
                    if (atk) {
                        const hit = (Math.floor(Math.random() * 20) + 1) + atk.bonus;
                        if (hit >= target.ac) {
                            const dmg = resolveRoll(atk.damage);
                            addToLog(`> ${currentCombatant.name} hits ${target.name} for ${dmg} dmg!`);
                            playSfx("/sfx/glitch_crit.mp3");
                            const newHp = Math.max(0, target.hp - dmg);
                            handleUpdate(target.id, { hp: newHp });
                            if (newHp === 0) handleDefeat(target.id);
                        } else {
                            addToLog(`> ${currentCombatant.name} misses ${target.name}.`);
                        }
                    }
                }
                nextTurn();
            }, 1000);
        }
    }, [turnIndex, combatants]);

    const nextTurn = () => {
        setTurnIndex(prev => (prev + 1) % combatants.length);
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-[#0a0a0c] text-[#d4c391] font-serif flex flex-col">

            {/* Top HUD: Initiative & Status */}
            <div className="h-20 bg-[#111] border-b border-[#333] flex items-center px-6 gap-6 overflow-x-auto custom-scrollbar shadow-lg z-20">
                <div className="flex items-center gap-2 text-[#a32222] font-bold uppercase tracking-widest border-r border-[#333] pr-6">
                    <Swords className="w-5 h-5 animate-pulse" />
                    <span>Battle</span>
                </div>
                {combatants.map((c, i) => (
                    <div
                        key={c.id}
                        className={`
                            relative min-w-[140px] h-12 flex items-center gap-3 px-4 border transition-all duration-300
                            ${i === turnIndex ? 'bg-[#a32222] border-[#ff4444] text-white scale-105 shadow-md' : 'bg-[#0a0a0c] border-[#333] text-[#666]'}
                            ${c.hp <= 0 && 'opacity-40 grayscale'}
                        `}
                    >
                        {c.type === 'player' ? <User className="w-4 h-4" /> : <Skull className="w-4 h-4" />}
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold truncate w-20">{c.name}</span>
                            <span className="text-[10px] font-mono opacity-80">HP: {c.hp}/{c.maxHp}</span>
                        </div>
                        {i === turnIndex && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative bg-black flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-20 pointer-events-none grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c] pointer-events-none"></div>

                {/* Central Action Area */}
                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">

                    {/* Status Message */}
                    <div className="mb-12 h-16 flex items-center justify-center">
                        {isPlayerTurn ? (
                            <h2 className="text-4xl text-[#d4c391] font-bold uppercase tracking-[0.2em] drop-shadow-md animate-slide-up">
                                Your Turn
                            </h2>
                        ) : (
                            <h2 className="text-4xl text-[#a32222] font-bold uppercase tracking-[0.2em] drop-shadow-md animate-pulse">
                                Enemy Turn
                            </h2>
                        )}
                    </div>

                    {/* Action Interface (Only visible on Player Turn) */}
                    {isPlayerTurn && (
                        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {targetingMode ? (
                                <div className="text-center">
                                    <p className="text-[#a32222] font-bold animate-pulse mb-6 uppercase tracking-widest">Select Target</p>
                                    <div className="flex justify-center gap-6">
                                        {enemies.map(e => (
                                            <button
                                                key={e.id}
                                                onClick={() => executeAttack(e.id)}
                                                className="group relative w-48 h-64 bg-[#1a0505] border border-[#a32222] hover:bg-[#2a0a0a] hover:border-[#ff4444] transition-all flex flex-col items-center justify-center gap-4 disabled:opacity-50"
                                                disabled={e.hp <= 0}
                                            >
                                                <Skull className="w-12 h-12 text-[#a32222] group-hover:scale-110 transition-transform" />
                                                <div className="text-xl font-bold uppercase text-[#d4c391]">{e.name}</div>
                                                <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                                                    <Heart className="w-3 h-3 fill-current" /> {e.hp}/{e.maxHp}
                                                </div>
                                                {e.hp <= 0 && <span className="absolute inset-0 flex items-center justify-center bg-black/80 font-bold text-red-600 rotate-12 text-2xl uppercase border-4 border-red-600">Defeated</span>}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setTargetingMode(false)} className="mt-8 text-sm text-[#555] hover:text-[#bbb] uppercase underline decoration-1 underline-offset-4">
                                        Cancel Action
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {currentCombatant.attacks?.map((atk, i) => (
                                        <button
                                            key={i}
                                            onClick={() => prepareAttack(atk)}
                                            className="group relative h-40 bg-[#111] border border-[#333] hover:border-[#d4c391] hover:bg-[#1a1a1a] transition-all flex flex-col items-center justify-center p-4"
                                        >
                                            <Zap className="w-6 h-6 text-[#666] group-hover:text-[#d4c391] mb-2 transition-colors" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-[#bbb] group-hover:text-white mb-1">{atk.name}</span>
                                            <span className="text-[10px] font-mono text-[#555] group-hover:text-[#888]">
                                                {atk.damage} DMG • +{atk.bonus} HIT
                                            </span>
                                            <div className="absolute inset-x-2 bottom-0 h-1 bg-[#a32222] scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                                        </button>
                                    ))}

                                    <button
                                        className="h-40 bg-[#080808] border border-[#222] flex flex-col items-center justify-center p-4 opacity-50 cursor-not-allowed group"
                                        title="Coming soon"
                                    >
                                        <ShieldAlert className="w-6 h-6 text-[#333] mb-2" />
                                        <span className="text-xs font-bold uppercase text-[#444]">Defend</span>
                                    </button>

                                    <button
                                        onClick={onFlee}
                                        className="h-40 bg-[#080808] border border-[#a32222]/30 hover:border-[#a32222] hover:bg-[#1a0505] transition-all flex flex-col items-center justify-center p-4 group"
                                    >
                                        <span className="text-xs font-bold uppercase text-[#a32222] group-hover:text-red-400">Flee Combat</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Combat Log */}
            <div className="h-48 bg-[#050505] border-t border-[#222] p-4 text-xs font-mono text-[#666] overflow-y-auto custom-scrollbar">
                {log.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
                <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>

            <DiceRoller />
        </div>
    );
}

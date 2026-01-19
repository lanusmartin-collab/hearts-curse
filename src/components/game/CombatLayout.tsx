"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Sword, Shield, Zap, Skull, Heart, Ghost, Timer, Swords, User, ShieldAlert, BookOpen, Footprints } from 'lucide-react';
import TacticalMap from './combat/TacticalMap';
import CombatantCard from "@/components/ui/CombatantCard";
import { Combatant } from "@/types/combat";
import monstersData from "@/lib/data/monsters_custom.json";
import { ALL_SPELLS } from "@/lib/data/spells";
import { useAudio } from "@/lib/context/AudioContext";
import DiceRoller from "@/components/ui/DiceRoller";

interface CombatLayoutProps {
    enemySlugs: string[];
    playerCharacter?: Combatant;
    onVictory: () => void;
    onFlee: () => void;
    onDefeat?: () => void;
}

const MOCK_PLAYER: Combatant = {
    id: "p1", name: "Unknown Hero", type: "player", hp: 20, maxHp: 20, ac: 14, initiative: 12, conditions: [],
    stats: { str: 14, dex: 14, con: 14, int: 10, wis: 10, cha: 10 },
    attacks: [{ name: "Rusty Blade", bonus: 4, damage: "1d6+2" }],
    // Mock 5e data for fallback
    resources: { action: true, bonusAction: true, movement: 30, reaction: true },
    spellSlots: { 1: { max: 2, current: 2 } },
    preparedSpells: ["Magic Missile"]
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

    // UI STATES
    const [targetingMode, setTargetingMode] = useState<{ range: number, onSelect: (id: string | null) => void } | null>(null);
    const [spellMenuOpen, setSpellMenuOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<any>(null); // Attack or Spell object
    const [combatStarted, setCombatStarted] = useState(false);
    const [aoeData, setAoeData] = useState<{ radius: number, range: number, onConfirm: (x: number, y: number) => void } | null>(null);

    const logEndRef = useRef<HTMLDivElement>(null);

    // Initial Load
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
            const monsterAttacks = data.actions?.map((a: any) => {
                const hitMatch = a.desc?.match(/\+(\d+)\s+to\s+hit/);
                const dmgMatch = a.desc?.match(/Hit:\s+\d+\s+\(([^)]+)\)/);
                return {
                    name: a.name,
                    bonus: hitMatch ? parseInt(hitMatch[1]) : 5,
                    damage: dmgMatch ? dmgMatch[1] : "1d6+2",
                    type: "melee", // Simplified for monsters
                    isAoE: a.desc.includes("radius") || a.desc.includes("cone"),
                    radius: 20
                };
            }) || [];

            return {
                id: `e-${i}-${slug}`,
                name: data.name,
                type: "monster",
                hp: maxHp,
                maxHp: maxHp,
                ac: data.ac || 10,
                initiative: Math.floor(Math.random() * 20),
                conditions: [],
                statblock: data,
                attacks: monsterAttacks,
                resources: { action: true, bonusAction: true, movement: data.speed?.includes("fly") ? 50 : 30, reaction: true }
            };
        }).filter(Boolean) as Combatant[];

        const hero = playerCharacter ? {
            ...playerCharacter,
            initiative: Math.floor(Math.random() * 20) + (playerCharacter.stats?.dex || 0),
            // Ensure resources exist
            resources: { action: true, bonusAction: true, movement: 30, reaction: true }
        } : MOCK_PLAYER;

        const all = [hero, ...enemies].sort((a, b) => b.initiative - a.initiative);
        setCombatants(all);
    }, [enemySlugs, playAmbience, playerCharacter]);

    const currentCombatant = combatants[turnIndex];
    const isPlayerTurn = currentCombatant?.type === "player";
    const enemies = combatants.filter(c => c.type === "monster");

    // LOGGING
    const addToLog = (msg: string) => setLog(prev => [...prev.slice(-10), msg]);

    // UPDATE HELPER
    const handleUpdate = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    // CONSUME RESOURCE HELPER
    const consumeResource = (type: 'action' | 'bonus' | 'movement', amount: number = 1) => {
        if (!currentCombatant) return;
        const res = { ...currentCombatant.resources! };

        if (type === 'action') res.action = false;
        if (type === 'bonus') res.bonusAction = false;
        if (type === 'movement') res.movement = Math.max(0, res.movement - amount);

        handleUpdate(currentCombatant.id, { resources: res });
    };

    // TURN MGMT
    const nextTurn = () => {
        // Reset resources for current before leaving? No, reset for NEXT person
        setTurnIndex(prev => {
            const nextIndex = (prev + 1) % combatants.length;
            const nextCombatant = combatants[nextIndex];

            // Refill Resources for specific combatant
            handleUpdate(nextCombatant.id, {
                resources: { action: true, bonusAction: true, movement: 30, reaction: true }
            });

            return nextIndex;
        });
        setPendingAction(null);
        setTargetingMode(null);
        setSpellMenuOpen(false);
    };

    const handleDefeat = (entityId: string) => {
        handleUpdate(entityId, { hp: 0 });
        const entity = combatants.find(c => c.id === entityId);
        addToLog(`> ${entity?.name} falls!`);

        if (entity?.type === 'monster') {
            if (combatants.filter(c => c.type === 'monster' && c.id !== entityId && c.hp > 0).length === 0) {
                setTimeout(onVictory, 2000);
            }
        } else if (entity?.type === 'player') {
            onDefeat?.();
        }
    };

    // ACTIONS
    const selectAction = (action: any, type: 'attack' | 'spell') => {
        // Check Economy
        const isBonus = action.castingTime?.includes("Bonus") || action.name === "Healing Word"; // Heuristic
        const resourceType = isBonus ? 'bonus' : 'action';

        if ((resourceType === 'action' && !currentCombatant.resources?.action) ||
            (resourceType === 'bonus' && !currentCombatant.resources?.bonusAction)) {
            addToLog(`! No ${resourceType} remaining.`);
            playSfx("/sfx/ui_error.mp3");
            return;
        }

        action._resource = resourceType; // Tag it
        setPendingAction(action);

        // Mode Check
        const isAoE = action.isAoE || action.range?.toLowerCase().includes("radius") || action.name === "Fireball";

        // Parse range
        let range = 5; // Default melee
        if (action.range) {
            const rangeMatch = action.range.match(/(\d+)/);
            if (rangeMatch) range = parseInt(rangeMatch[1]);
        }
        // Override for melee attacks that might not have explicit range
        if (type === 'attack' && !action.range) range = 5;

        if (isAoE) {
            addToLog(`> Aiming ${action.name}...`);
            setAoeData({
                radius: action.radius || 20,
                range: range, // Range to CAST the spell
                onConfirm: (x, y) => executeAction(null, { x, y })
            });
        } else if (action.target === "Self") {
            executeAction(currentCombatant.id);
        } else {
            addToLog(`> Select target for ${action.name} (Range: ${range}ft).`);
            setTargetingMode({
                range,
                onSelect: (targetId) => executeAction(targetId)
            });
            // We need to pass the actual range data to the map now
            // But targetingMode in state is boolean. Refactoring state to object.
            // See BELOW for state refactor
        }
        setSpellMenuOpen(false);
    };

    const executeAction = (targetId: string | null, loc?: { x: number, y: number }) => {
        if (!pendingAction) return;

        // Deduct Resource
        if (pendingAction._resource === 'action') consumeResource('action');
        if (pendingAction._resource === 'bonus') consumeResource('bonus');

        // AOE LOGIC
        if (loc) {
            addToLog(`> ${pendingAction.name} blasts area!`);
            playSfx("/sfx/explosion.mp3");
            // Hit all enemies (simplification)
            enemies.forEach(e => {
                const dmg = resolveRoll(pendingAction.damage || "2d6");
                handleUpdate(e.id, { hp: Math.max(0, e.hp - dmg) });
                addToLog(`> ${e.name} takes ${dmg}.`);
                if (e.hp <= dmg) handleDefeat(e.id);
            });
        }
        // TARGET LOGIC
        else if (targetId) {
            const target = combatants.find(c => c.id === targetId);
            if (!target) return;

            const hitBonus = pendingAction.bonus || 5;
            const roll = Math.floor(Math.random() * 20) + 1;
            const total = roll + hitBonus;

            if (total >= target.ac) {
                const dmg = resolveRoll(pendingAction.damage || "1d8");
                handleUpdate(targetId, { hp: Math.max(0, target.hp - dmg) });
                addToLog(`> ${pendingAction.name} HITS ${target.name} for ${dmg}!`);
                playSfx("/sfx/hit.mp3");
                if (target.hp <= dmg) handleDefeat(targetId);
            } else {
                addToLog(`> ${pendingAction.name} MISSES (${total} vs AC${target.ac})`);
                playSfx("/sfx/miss.mp3");
            }
        }

        setPendingAction(null);
        setAoeData(null);
        setPendingAction(null);
        setAoeData(null);
        setTargetingMode(null);
    };

    // AI TURN
    useEffect(() => {
        if (!isPlayerTurn && combatStarted && currentCombatant && currentCombatant.hp > 0) {
            const t = setTimeout(() => {
                const players = combatants.filter(c => c.type === 'player' && c.hp > 0);
                if (players.length === 0) {
                    nextTurn();
                    return;
                }

                const target = players[0]; // Primary target (simplification)
                const distance = 5; // AI assumes close range for now or calculates mock distance

                // BOSS AI: LARLOCH
                if (currentCombatant.name.includes("Larloch") || currentCombatant.name.includes("Lich")) {
                    const spells = currentCombatant.statblock?.spellcasting?.spells || [];

                    // 1. Kill Threshold
                    if (target.hp < 100 && spells.includes("Power Word Kill")) {
                        addToLog(`> ${currentCombatant.name} utters a Word of Power...`);
                        const pwk = ALL_SPELLS.find(s => s.name === "Power Word Kill") || { name: "Power Word Kill", damage: "1000" };
                        selectAction(pwk, 'spell');
                        setTimeout(() => executeAction(target.id), 1000); // Trigger after brief delay
                        return; // Turn ends after execute
                    }

                    // 2. Critical Self-Preservation
                    if (currentCombatant.hp < (currentCombatant.maxHp * 0.3) && spells.includes("Time Stop")) {
                        addToLog(`> ${currentCombatant.name} bends time around himself!`);
                        // Mock healing/buffing during time stop
                        handleUpdate(currentCombatant.id, { hp: currentCombatant.hp + 50 });
                        addToLog(`> ...and re-appears revitalized.`);
                        nextTurn();
                        return;
                    }

                    // 3. AoE / Big Damage
                    if (spells.includes("Meteor Swarm") && Math.random() > 0.7) {
                        addToLog(`> ${currentCombatant.name} calls down the stars!`);
                        const meteor = ALL_SPELLS.find(s => s.name === "Meteor Swarm") || { name: "Meteor Swarm", damage: "40d6" };
                        selectAction(meteor, 'spell');
                        // Auto-confirm AoE on player location
                        setTimeout(() => executeAction(null, { x: 0, y: 0 }), 1000);
                        return;
                    }

                    // 4. Default Cantrip/Attack
                    const finger = ALL_SPELLS.find(s => s.name === "Finger of Death");
                    if (finger && Math.random() > 0.5) {
                        selectAction(finger, 'spell');
                        setTimeout(() => executeAction(target.id), 1000);
                        return;
                    }
                }

                // GENERIC MONSTER AI
                const atk = currentCombatant.attacks?.[0]; // Default attack
                if (atk) {
                    // Check Range (Mock) - Assume always in range for melee monsters for now to keep flow moving
                    const hitBonus = atk.bonus || 5;
                    const roll = Math.floor(Math.random() * 20) + 1;
                    const total = roll + hitBonus;

                    if (total >= target.ac) {
                        const dmg = resolveRoll(atk.damage);
                        addToLog(`> ${currentCombatant.name} attacks ${target.name} with ${atk.name}.`);
                        addToLog(`> HIT! (${total}) for ${dmg} damage.`);
                        handleUpdate(target.id, { hp: Math.max(0, target.hp - dmg) });
                        playSfx("/sfx/hit.mp3");
                        if (target.hp <= dmg) handleDefeat(target.id);
                    } else {
                        addToLog(`> ${currentCombatant.name} attacks ${target.name} with ${atk.name}.`);
                        addToLog(`> MISS! (${total})`);
                        playSfx("/sfx/miss.mp3");
                    }
                } else {
                    addToLog(`> ${currentCombatant.name} glares menacingly.`);
                }

                // End Turn delayed to allow logs to be read
                setTimeout(nextTurn, 1000);

            }, 1000);
            return () => clearTimeout(t);
        }
    }, [turnIndex, combatStarted]);

    return (
        <div className="fixed inset-0 z-[2000] bg-[#0a0a0c] text-[#d4c391] font-serif flex flex-col">

            {/* HUD */}
            <div className="h-16 bg-[#111] border-b border-[#333] flex items-center px-6 gap-4">
                <Swords className="text-[#a32222]" />
                <span className="font-bold uppercase tracking-widest text-[#a32222]">Turn Order</span>
                {combatants.map((c, i) => (
                    <div key={c.id} className={`px-3 py-1 flex flex-col items-center ${i === turnIndex ? 'bg-[#a32222] text-white' : 'opacity-50'}`}>
                        <span className="text-xs font-bold">{c.name}</span>
                        <span className="text-[10px]">{c.hp} HP</span>
                    </div>
                ))}
                <div className="ml-auto flex gap-4 text-xs font-mono">
                    <span className={currentCombatant?.resources?.action ? "text-green-500" : "text-gray-600"}>ACTION</span>
                    <span className={currentCombatant?.resources?.bonusAction ? "text-orange-500" : "text-gray-600"}>BONUS</span>
                    <span className="text-blue-500">{currentCombatant?.resources?.movement} FT</span>
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 relative bg-[#151515] flex items-center justify-center overflow-hidden">
                <TacticalMap
                    combatants={combatants}
                    activeCombatantId={currentCombatant?.id}
                    canMove={isPlayerTurn && combatStarted && (currentCombatant?.resources?.movement || 0) > 0}
                    aoeMode={aoeData}
                    targetingMode={targetingMode}
                    onMove={(id, x, y) => {
                        // Deduct movement (Assume 5ft per step, TacMap handles path, simplified here to 5ft per move event)
                        // In reality TacMap calculates distance.
                        consumeResource('movement', 5);
                    }}
                />

                {/* INIT OVERLAY */}
                {!combatStarted && (
                    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <button onClick={() => setCombatStarted(true)} className="px-12 py-6 bg-[#a32222] text-white text-3xl font-bold uppercase tracking-widest border border-red-500 hover:scale-110 transition-transform shadow-[0_0_50px_red]">
                            Roll Initiative
                        </button>
                    </div>
                )}
            </div>

            {/* PLAYER CONTROLS */}
            {isPlayerTurn && (
                <div className="h-64 bg-[#0a0a0c] border-t border-[#333] grid grid-cols-[1fr_2fr_1fr] gap-4 p-4 z-20">
                    {/* INFO */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#d4c391]">{currentCombatant.name}</h3>
                        <div className="flex flex-col gap-1 text-xs text-[#888]">
                            <div>HP: <span className="text-white">{currentCombatant.hp} / {currentCombatant.maxHp}</span></div>
                            <div>AC: <span className="text-white">{currentCombatant.ac}</span></div>
                            <div>Movement: <span className="text-blue-400">{currentCombatant.resources?.movement} ft</span></div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-4 justify-center items-center">
                        {/* ATTACK BUTTON */}
                        <div className="flex flex-col gap-2">
                            {currentCombatant.attacks?.map((atk, i) => (
                                <button key={i} onClick={() => selectAction(atk, 'attack')} className="px-6 py-3 bg-[#111] border border-[#333] hover:border-[#a32222] hover:bg-[#1a0505] flex items-center gap-2 transition-all">
                                    <Sword className="w-4 h-4 text-[#a32222]" />
                                    <span className="font-bold text-sm uppercase">{atk.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* SPELL MENU BUTTON */}
                        <div className="relative">
                            <button onClick={() => setSpellMenuOpen(!spellMenuOpen)} className="w-32 h-32 bg-[#050505] border border-cyan-900 hover:border-cyan-500 flex flex-col items-center justify-center gap-2 group transition-all">
                                <BookOpen className="w-8 h-8 text-cyan-700 group-hover:text-cyan-400" />
                                <span className="text-xs font-bold uppercase text-cyan-700 group-hover:text-cyan-400">Grimoire</span>
                            </button>

                            {/* SPELLS DROPDOWN - FETCHING FROM CHAR PREPARED */}
                            {spellMenuOpen && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 max-h-64 bg-[#0a0a0c] border border-cyan-800 p-2 overflow-y-auto custom-scrollbar shadow-2xl z-50">
                                    {currentCombatant.preparedSpells?.map(spellName => {
                                        const spellData = ALL_SPELLS.find(s => s.name === spellName);
                                        return (
                                            <button
                                                key={spellName}
                                                onClick={() => selectAction({ ...spellData, damage: "2d8" }, 'spell')} // Mock damage if missing
                                                className="w-full text-left p-2 hover:bg-cyan-900/30 text-xs text-cyan-200 border-b border-cyan-900/30"
                                            >
                                                <div className="font-bold">{spellName}</div>
                                                <div className="text-[10px] text-cyan-500 max-w-full truncate">{spellData?.school} • {spellData?.castingTime}</div>
                                            </button>
                                        );
                                    })}
                                    {(!currentCombatant.preparedSpells || currentCombatant.preparedSpells.length === 0) && (
                                        <div className="text-center text-xs text-gray-500 italic p-4">No spells prepared.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* END TURN */}
                    <div className="flex flex-col justify-end">
                        <button onClick={nextTurn} className="w-full py-4 bg-[#a32222] text-white font-bold uppercase tracking-widest hover:bg-[#c42828] transition-all border border-red-900">
                            End Turn
                        </button>
                    </div>
                </div>
            )}
            {/* LOG */}
            <div className="absolute top-20 right-4 w-64 h-32 bg-black/50 border border-[#333] p-2 text-[10px] font-mono text-[#888] overflow-y-auto pointer-events-none">
                {log.map((l, i) => <div key={i}>{l}</div>)}
            </div>
        </div>
    );
}

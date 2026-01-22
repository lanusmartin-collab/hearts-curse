"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Typewriter } from "@/components/ui/Typewriter";
import { SaveManager } from "@/lib/game/SaveManager";
import { useGameLogic } from "@/lib/hooks/useGameLogic";
import ShopInterface from "./ShopInterface";
import CombatLayout from "./CombatLayout";
import { Combatant } from "@/types/combat";
import { CAMPAIGN_MAPS } from "@/lib/data/maps";
import DiceRoller from "@/components/ui/DiceRoller";
import QuickActionBar from "@/components/game/dm/QuickActionBar";
import DoomGauge from "@/components/game/dm/DoomGauge"; // Add Import

const PARTY = [
    { name: "Kaelen", class: "Paladin", hp: 45, maxHp: 58, mana: 10, maxMana: 20, img: "/portraits/kaelen.png" },
    { name: "Lyra", class: "Rouge", hp: 32, maxHp: 38, mana: 0, maxMana: 0, img: "/portraits/lyra.png" },
    { name: "Ignis", class: "Wizard", hp: 24, maxHp: 30, mana: 30, maxMana: 40, img: "/portraits/ignis.png" },
    { name: "Torag", class: "Cleric", hp: 38, maxHp: 44, mana: 25, maxMana: 30, img: "/portraits/torag.png" },
];

export interface GameLayoutRef {
    saveGame: () => void;
}

interface GameLayoutProps {
    onExit: () => void;
    startingRewards?: any;
    playerCharacter?: Combatant;
    initialMapId?: string;
    initialNodeId?: string;
}

const GameLayout = forwardRef<GameLayoutRef, GameLayoutProps>(({ onExit, startingRewards, playerCharacter }, ref) => {

    // --- HOOK INTEGRATION ---
    const {
        consoleLog,
        inCombat,
        combatEnemies,
        showShop,
        setShowShop,
        currentMap,
        currentNode,
        currentShop,
        playerGold,
        inventory,
        addToInventory, // Add this
        visitedNodes,
        handleMove,
        startCombat,
        handleVictory,
        handleFlee,
        handleBuyItem,
        playSfx,
        activeCheck,
        resolveCheck
    } = useGameLogic(startingRewards);

    // --- LOCAL UI STATE (Visuals only) ---
    const consoleEndRef = React.useRef<HTMLDivElement>(null);
    const [showMap, setShowMap] = useState(false);

    // --- SAVE LOGIC ---
    useImperativeHandle(ref, () => ({
        saveGame: () => {
            if (playerCharacter && currentNode?.id) {
                const saveId = `manual_save_${Date.now()}`;
                SaveManager.saveGame(saveId, {
                    id: saveId,
                    timestamp: Date.now(),
                    name: `Manual Save - ${currentNode?.label || "Unknown"}`,
                    version: "3.0",
                    playerCharacter: playerCharacter,
                    currentMapId: currentMap?.id || "unknown",
                    currentNodeId: currentNode.id,
                    questState: {},
                    inventory: inventory,
                    gold: playerGold,
                    playtime: 0
                });
                playSfx("/sfx/retro_success.mp3");
            }
        }
    }));

    // Scroll to bottom of log
    React.useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [consoleLog]);


    // --- RENDER ---

    // --- RENDER ---

    // Helper to render the appropriate main content
    const renderContent = () => {
        if (inCombat) {
            return <CombatLayout enemySlugs={combatEnemies} playerCharacter={playerCharacter} onVictory={handleVictory} onFlee={handleFlee} />;
        }

        return (
            <div className="game-shell fixed inset-0 bg-black text-[#c9bca0] font-serif overflow-hidden flex flex-col">
                {/* SKILL CHECK OVERLAY */}
                {activeCheck && (
                    <div className="absolute inset-0 z-[3000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                        <h2 className="text-3xl font-bold text-[#a32222] mb-2 uppercase tracking-widest text-center">Skill Check</h2>
                        <div className="text-xl text-[var(--gold-accent)] mb-8 font-serif italic text-center max-w-lg">
                            "{activeCheck.details}"
                        </div>

                        <div className="bg-[#1a1515] border-2 border-[#5c1212] p-8 rounded-lg shadow-[0_0_50px_rgba(163,34,34,0.3)] flex flex-col items-center gap-6">
                            <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                                {activeCheck.skill} (DC {activeCheck.dc})
                            </div>

                            <DiceRoller
                                onRollComplete={(result) => resolveCheck(result.total, 0)}
                            /* Modifier 0 for now or fetch from char */
                            />

                            <div className="text-xs text-gray-600 italic mt-4">
                                Roll a D20 to attempt interaction.
                            </div>
                        </div>
                    </div>
                )}

                {/* SHOP MODAL */}
                {showShop && currentShop && (
                    <ShopInterface
                        shop={currentShop}
                        playerGold={playerGold}
                        onClose={() => setShowShop(false)}
                        onBuy={handleBuyItem}
                    />
                )}

                {/* 1. TOP BAR (Status) */}
                <div className="h-12 bg-[#1a1515] border-b-2 border-[#5c1212] flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-4">
                        <span className="text-[#a32222] font-bold tracking-widest uppercase text-sm">
                            {currentMap?.title || "UNKNOWN REGION"}
                        </span>
                        <span className="text-xs text-gray-600">|</span>

                        {/* DOOM GAUGE (Replaces/Augments Torch) */}
                        <DoomGauge
                            onStageChange={(stage) => {
                                // Can propagate to global context later
                                console.log("Doom Stage:", stage);
                            }}
                        />

                        <span className="text-xs text-yellow-600 ml-4">GOLD: {playerGold}gp</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onExit} className="text-[10px] text-[#a32222] hover:text-red-400 uppercase tracking-widest">[EXIT SIM]</button>
                    </div>
                </div>

                {/* 2. MAIN CONTENT GRID */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* MAP OVERLAY (Toggleable) */}
                    {showMap && (
                        <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="relative w-full max-w-4xl aspect-video border-2 border-[#a32222] bg-[#0a0a0c] p-4 shadow-2xl">
                                <button
                                    onClick={() => setShowMap(false)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-white border border-red-900 px-2 bg-black z-10"
                                >
                                    CLOSE MAP [Esc]
                                </button>
                                <div className="w-full h-full relative">
                                    {/* Simple Dot Map Render */}
                                    {currentMap?.nodes?.map(node => {
                                        const isVisited = visitedNodes.has(node.id);
                                        if (!isVisited) return null;

                                        const isCurrent = node.id === currentNode?.id;
                                        return (
                                            <div
                                                key={node.id}
                                                className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all
                                                ${isCurrent ? 'bg-red-500 border-white shadow-[0_0_10px_red] scale-125 z-20' : 'bg-gray-800 border-gray-900 z-10'}
                                            `}
                                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                            >
                                                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap bg-black/80 px-1 text-gray-500">
                                                    {node.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-5">
                                        {[...Array(72)].map((_, i) => <div key={i} className="border border-[#a32222]"></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LEFT: VIEWPORT (The Eye) -> Now NARRATIVE LOG */}
                    <div className="flex-1 relative bg-[#050505] border-r-2 border-[#333] flex flex-col font-mono">

                        {/* BACKGROUND ATMOSPHERE */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-1000">
                            {currentMap?.imagePath && (
                                <Image
                                    src={currentMap.imagePath}
                                    alt="Atmosphere"
                                    fill
                                    className="object-cover blur-sm grayscale"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                        </div>

                        {/* NARRATIVE SCROLL AREA */}
                        <div className="flex-1 relative z-10 p-8 overflow-y-auto custom-scrollbar flex flex-col-reverse">
                            {/* Bottom Spacer */}
                            <div className="h-4"></div>

                            {/* MAIN CONTENT AREA */}
                            <div className="flex-1 flex flex-col relative">

                                {/* 1. SCENE VISUALIZER (Top Half) */}
                                <div className="h-[50vh] relative bg-[#050505] overflow-hidden border-b border-[#333]">
                                    {/* Background Image Layer */}
                                    <div className="absolute inset-0 z-0 opacity-40">
                                        {currentMap?.imagePath && (
                                            <Image
                                                src={currentMap.imagePath}
                                                alt="Location"
                                                fill
                                                className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-[2000ms]"
                                            />
                                        )}
                                        {/* Vignette */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                                    </div>

                                    {/* Node Visualizer */}
                                    <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end pb-12 pointer-events-none">
                                        <h1 className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 animated-in slide-in-from-bottom-2">
                                            {currentNode?.label || "Unknown Location"}
                                        </h1>
                                        <div className="max-w-2xl bg-black/60 backdrop-blur-sm p-3 border-l-2 border-[#a32222] text-sm md:text-base leading-relaxed text-gray-300 shadow-xl">
                                            <Typewriter text={currentNode?.description || "You are in a void."} speed={15} />
                                            {currentNode?.monsters && (
                                                <div className="mt-2 text-red-400 text-xs uppercase font-bold tracking-wider animate-pulse">
                                                    ⚠ Threat Detected: {currentNode.monsters.length} Enemies
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. DASHBOARD (Bottom Half) */}
                                <div className="flex-1 bg-[#080808] grid grid-cols-12 gap-0">

                                    {/* LEFT: STATUS & EQUIPMENT */}
                                    <div className="col-span-3 border-r border-[#333] p-2 flex flex-col gap-2">
                                        {/* Mini Character Card */}
                                        <div className="bg-[#111] p-2 border border-[#333]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-8 h-8 bg-gray-800 rounded-full overflow-hidden border border-[#555]">
                                                    {playerCharacter?.img && <Image src={playerCharacter.img} alt="PC" width={32} height={32} />}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-white">{playerCharacter?.name}</div>
                                                    <div className="text-[9px] text-gray-500">{playerCharacter?.class} Lv{playerCharacter?.level || 1}</div>
                                                </div>
                                            </div>
                                            {/* Bars */}
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-full bg-[#333] rounded-full overflow-hidden">
                                                    <div className="h-full bg-red-700" style={{ width: `${(playerCharacter?.hp || 0) / (playerCharacter?.maxHp || 1) * 100}%` }} />
                                                </div>
                                                <div className="h-1.5 w-full bg-[#333] rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-700" style={{ width: `${(playerCharacter?.mana || 0) / (playerCharacter?.maxMana || 1) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Inventory / Loot */}
                                        <div className="flex-1 bg-[#111] border border-[#333] p-1 overflow-auto">
                                            <div className="text-[9px] uppercase text-gray-600 font-bold mb-1 text-center">Backpack</div>
                                            {inventory.length === 0 ? (
                                                <div className="text-[9px] text-gray-700 text-center italic mt-4">Empty</div>
                                            ) : (
                                                inventory.map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs border-b border-[#333] pb-1">
                                                        <span>{item.name}</span>
                                                        <span className="text-yellow-600/50 uppercase text-[10px]">{item.type}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* CENTER: NARRATIVE LOG */}
                                    <div className="col-span-6 flex flex-col relative bg-black/50">
                                        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-green-500 space-y-2 scrollbar-hide">
                                            {consoleLog.map((log, i) => (
                                                <div key={i} className="border-l border-green-900/30 pl-2">
                                                    {log.startsWith('>') ? (
                                                        <span className="text-gray-400">{log}</span>
                                                    ) : (
                                                        <span>{log}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {/* Anchor for auto-scroll */}
                                            <div ref={consoleEndRef} />
                                        </div>
                                        {/* Navigation Compass (Overlay) */}
                                        <div className="h-12 border-t border-[#333] bg-[#111] flex items-center justify-center gap-4">
                                            <button onClick={() => handleMove('west')} className="p-1 text-gray-500 hover:text-white hover:bg-[#333] rounded">← W</button>
                                            <button onClick={() => handleMove('north')} className="p-1 text-gray-500 hover:text-white hover:bg-[#333] rounded">↑ N</button>
                                            <button onClick={() => handleMove('south')} className="p-1 text-gray-500 hover:text-white hover:bg-[#333] rounded">↓ S</button>
                                            <button onClick={() => handleMove('east')} className="p-1 text-gray-500 hover:text-white hover:bg-[#333] rounded">E →</button>
                                        </div>
                                    </div>

                                    {/* RIGHT: ACTION MENU */}
                                    <div className="col-span-3 border-l border-[#333] bg-[#111] p-1 flex flex-col">
                                        <div className="text-[9px] uppercase text-gray-600 font-bold mb-1 text-center">Actions</div>

                                        <div className="grid grid-cols-2 gap-1">
                                            <button
                                                onClick={() => startCombat()}
                                                disabled={!currentNode?.monsters}
                                                className={`game-btn bg-[#222] border border-[#444] text-[10px] uppercase font-bold text-gray-400 ${currentNode?.monsters ? 'hover:bg-[#a32222] hover:text-white border-red-900 text-red-500' : 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                Attack
                                            </button>
                                            <button className="game-btn bg-[#222] border border-[#444] hover:bg-blue-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Spell</button>

                                            <button
                                                onClick={() => setShowShop(true)}
                                                disabled={!currentShop}
                                                className={`game-btn bg-[#222] border border-[#444] text-[10px] uppercase font-bold text-gray-400 ${currentShop ? 'hover:bg-yellow-700 hover:text-white border-yellow-800 text-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                Trade
                                            </button>

                                            {/* TRAVEL / MAP BUTTON */}
                                            {currentNode?.link ? (
                                                <button
                                                    className="game-btn bg-[#222] border border-cyan-800 text-cyan-500 hover:bg-cyan-900 hover:text-white text-[10px] uppercase font-bold animate-pulse"
                                                >
                                                    Enter
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setShowMap(!showMap)}
                                                    className={`game-btn bg-[#222] border border-[#444] hover:bg-green-900 hover:text-white text-[10px] uppercase font-bold text-gray-400 ${showMap ? 'border-green-500 text-green-500' : ''}`}
                                                >
                                                    Map
                                                </button>
                                            )}
                                            <button className="game-btn bg-[#222] border border-[#444] hover:bg-purple-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Rest</button>
                                        </div>

                                        <div className="mt-auto bg-black border border-[#333] p-1 text-[8px] text-center text-gray-600 font-mono">
                                            {currentShop ? "TRADING HUB AVAILABLE" : "AWAITING COMMAND..."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* GLOBAL CONSOLE (Bottom Strip) */}
                <div className="h-8 bg-black border-t border-[#333] flex items-center px-4 font-mono text-xs text-green-500/80 z-20">
                    <span className="mr-2 opacity-50">$</span>
                    <span className="animate-flicker">{consoleLog[consoleLog.length - 1]}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderContent()}

            {/* DM QUICK ACTION BAR - Persistent */}
            <QuickActionBar
                onSpawnLoot={(item) => {
                    addToInventory(item);
                }}
                onSpawnEncounter={(enemies) => startCombat(enemies)}
                currentLocationType={currentNode?.type || "unknown"}
            />
        </>
    );
});

GameLayout.displayName = "GameLayout";

export default GameLayout;

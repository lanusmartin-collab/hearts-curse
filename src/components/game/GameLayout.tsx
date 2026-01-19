"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/context/AudioContext";
import { CAMPAIGN_MAPS, MapNode } from "@/lib/data/maps";
import CombatLayout from "./CombatLayout";

// Placeholder for Party Data
const PARTY = [
    { name: "Kaelen", class: "Paladin", hp: 45, maxHp: 58, mana: 10, maxMana: 20, img: "/portraits/kaelen.png" },
    { name: "Lyra", class: "Rouge", hp: 32, maxHp: 38, mana: 0, maxMana: 0, img: "/portraits/lyra.png" },
    { name: "Ignis", class: "Wizard", hp: 24, maxHp: 30, mana: 30, maxMana: 40, img: "/portraits/ignis.png" },
    { name: "Torag", class: "Cleric", hp: 38, maxHp: 44, mana: 25, maxMana: 30, img: "/portraits/torag.png" },
];

interface GameLayoutProps {
    onExit: () => void;
}

export default function GameLayout({ onExit }: GameLayoutProps) {
    const { playSfx, playAmbience } = useAudio();
    const [consoleLog, setConsoleLog] = useState<string[]>([
        "> System initialized...",
        "> Entering the Heart's Curse...",
        "> Torches lit. Darkness recedes... barely."
    ]);
    const [activeTab, setActiveTab] = useState("party"); // party, inventory, spellbook

    // -- NAVIGATION STATE --
    const [currentMapId, setCurrentMapId] = useState("oakhaven");
    const [currentNodeId, setCurrentNodeId] = useState("market"); // Start at Market
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["market"]));
    const [showMap, setShowMap] = useState(false);

    // Combat State
    const [inCombat, setInCombat] = useState(false);
    const [combatEnemies, setCombatEnemies] = useState<string[]>([]);

    // Derived State
    const currentMap = CAMPAIGN_MAPS.find(m => m.id === currentMapId);
    const currentNode = currentMap?.nodes?.find(n => n.id === currentNodeId);

    // Initial Load & Persistence
    useEffect(() => {
        const saved = localStorage.getItem("hc_visited");
        if (saved) {
            setVisitedNodes(new Set(JSON.parse(saved)));
        }
        // Add hints
        setConsoleLog(prev => [...prev, "> Controls: WASD / Arrows to Move.", "> Status: Online."]);
    }, []);

    // KEYBOARD CONTROLS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (inCombat) return;

            // Prevent default scrolling for arrows/space
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.code) > -1) {
                e.preventDefault();
            }

            switch (e.key.toLowerCase()) {
                case "w":
                case "arrowup":
                    handleMove("north");
                    break;
                case "s":
                case "arrowdown":
                    handleMove("south");
                    break;
                case "a":
                case "arrowleft":
                    handleMove("west");
                    break;
                case "d":
                case "arrowright":
                    handleMove("east");
                    break;
                case "m":
                    setShowMap(prev => !prev);
                    break;
                case "escape":
                    if (showMap) setShowMap(false);
                    // maybe close other UI
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentNodeId, currentMapId, inCombat, showMap]); // Re-bind when node changes to capture fresh closures if needed, though handleMove depends on state

    // Update Visited & Persist
    useEffect(() => {
        if (!currentNodeId) return;
        setVisitedNodes(prev => {
            const next = new Set(prev);
            next.add(currentNodeId);
            localStorage.setItem("hc_visited", JSON.stringify(Array.from(next)));
            return next;
        });
    }, [currentNodeId]);

    useEffect(() => {
        // Switch to Dungeon Ambience
        playAmbience("dungeon");
    }, [playAmbience]);

    const addToLog = (msg: string) => {
        setConsoleLog(prev => [...prev.slice(-6), `> ${msg}`]);
    };

    const handleMove = (direction: "north" | "south" | "east" | "west") => {
        if (!currentNode?.exits) {
            addToLog("There are no exits here.");
            return;
        }

        const targetNodeId = currentNode.exits[direction];

        if (targetNodeId) {
            // Check if target exists
            const targetNode = currentMap?.nodes?.find(n => n.id === targetNodeId);
            if (targetNode) {
                setCurrentNodeId(targetNodeId);
                addToLog(`Moving ${direction.toUpperCase()} to ${targetNode.label}...`);
                playSfx("/sfx/footsteps.mp3"); // Assuming this exists or will be added
            } else {
                addToLog(`Error: Path to '${targetNodeId}' is blocked (Node missing).`);
            }
        } else {
            addToLog("You cannot go that way.");
            playSfx("/sfx/bump.mp3"); // Optional bump sound
        }
    };

    const startCombat = () => {
        if (!currentNode?.monsters || currentNode.monsters.length === 0) {
            addToLog("No enemies detected here.");
            return;
        }
        setCombatEnemies(currentNode.monsters);
        setInCombat(true);
        addToLog("COMBAT STARTED!");
    };

    const handleCombatEnd = () => {
        setInCombat(false);
        playAmbience("dungeon"); // Restore exploration music
        addToLog("Combat ended. You can recover.");
    };

    if (inCombat) {
        return <CombatLayout enemySlugs={combatEnemies} onVictory={handleCombatEnd} onFlee={handleCombatEnd} />;
    }

    return (
        <div className="game-shell fixed inset-0 z-[1000] bg-black text-[#c9bca0] font-serif overflow-hidden flex flex-col">
            {/* 1. TOP BAR (Status / Compass) */}
            <div className="h-12 bg-[#1a1515] border-b-2 border-[#5c1212] flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <span className="text-[#a32222] font-bold tracking-widest uppercase">
                        {currentMap?.title || "UNKNOWN REGION"} // {currentNode?.label || "Unknown Location"}
                    </span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-amber-600 animate-pulse">TORCH: 84%</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onExit} className="text-xs text-[#a32222] hover:text-red-400 uppercase tracking-widest">[EXIT SIM]</button>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* MAP OVERLAY */}
                {showMap && (
                    <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative w-full max-w-4xl aspect-video border-2 border-[#a32222] bg-[#0a0a0c] p-4 shadow-2xl">
                            <button
                                onClick={() => setShowMap(false)}
                                className="absolute top-2 right-2 text-red-500 hover:text-white border border-red-900 px-2 bg-black z-10"
                            >
                                CLOSE MAP [X]
                            </button>
                            <div className="w-full h-full relative">
                                {/* Simple Dot Map Render */}
                                {currentMap?.nodes?.map(node => {
                                    const isVisited = visitedNodes.has(node.id);
                                    if (!isVisited) return null;

                                    const isCurrent = node.id === currentNodeId;
                                    return (
                                        <div
                                            key={node.id}
                                            className={`absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all
                                                ${isCurrent ? 'bg-red-500 border-white shadow-[0_0_10px_red] scale-125 z-20' : 'bg-gray-600 border-gray-800 z-10'}
                                            `}
                                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                        >
                                            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap bg-black/80 px-1 text-gray-400">
                                                {node.label}
                                            </span>
                                        </div>
                                    );
                                })}
                                {/* Base Grid Lines (Optional Decoration) */}
                                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-10">
                                    {[...Array(72)].map((_, i) => <div key={i} className="border border-[#a32222]"></div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LEFT: VIEWPORT (The Eye) */}
                <div className="flex-1 relative bg-[#050505] border-r-2 border-[#333] flex flex-col overflow-hidden">

                    {/* 1. VISUAL MAP LAYER (Background) */}
                    <div className="absolute inset-0 z-0">
                        {currentMap?.imagePath && (
                            <div className="relative w-full h-full">
                                <Image
                                    src={currentMap.imagePath}
                                    alt="Map Region"
                                    fill
                                    className="object-cover opacity-60"
                                />
                                {/* Grid Overlay */}
                                <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20 pointer-events-none"></div>
                            </div>
                        )}

                        {/* Node Overlay */}
                        <div className="absolute inset-0">
                            {currentMap?.nodes?.map(node => {
                                const isVisited = visitedNodes.has(node.id);
                                if (!isVisited) return null; // Fog of War

                                const isCurrent = node.id === currentNodeId;
                                return (
                                    <div
                                        key={node.id}
                                        className={`absolute transition-all duration-500 flex flex-col items-center justify-center
                                            ${isCurrent ? 'z-20 scale-125' : 'z-10 opacity-70'}
                                        `}
                                        style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                                    >
                                        {/* Node Plot Point */}
                                        <div className={`w-3 h-3 rounded-full border-2 
                                            ${isCurrent ? 'bg-[#ff3333] border-white shadow-[0_0_15px_red] animate-pulse' : 'bg-[#333] border-[#666]'}
                                        `}></div>

                                        {/* Label */}
                                        <span className={`mt-2 px-2 py-0.5 text-[10px] font-mono rounded backdrop-blur-md whitespace-nowrap
                                            ${isCurrent ? 'bg-red-950/80 text-white border border-red-500/50' : 'bg-black/80 text-gray-500 border border-gray-800'}
                                        `}>
                                            {node.label}
                                        </span>

                                        {/* Player Icon (If Current) */}
                                        {isCurrent && (
                                            <div className="absolute -top-6 text-2xl filter drop-shadow-[0_0_5px_rgba(0,0,0,1)] animate-bounce">
                                                📍
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. HUD LAYER (Foreground) */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between pointer-events-none">

                        {/* Top HUD: Location Info */}
                        <div className="p-4 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent">
                            <div>
                                <h2 className="text-2xl text-[#ff3333] font-bold tracking-wider drop-shadow-md">{currentNode?.label}</h2>
                                <div className="text-xs text-gray-400 font-mono mt-1">
                                    COORD: {currentNode?.x}, {currentNode?.y} | SECTOR: {currentMap?.title}
                                </div>
                            </div>

                            {/* Compass Control (Interactive) */}
                            <div className="pointer-events-auto bg-black/50 p-2 rounded border border-[#333] backdrop-blur-sm">
                                <div className="grid grid-cols-3 gap-1 w-24">
                                    <div className="col-start-2">
                                        <button onClick={() => handleMove("north")} className={`w-full h-8 flex items-center justify-center border text-xs ${currentNode?.exits?.north ? 'bg-[#222] border-[#555] text-white hover:bg-[#a32222]' : 'border-transparent text-gray-700'}`}>N</button>
                                    </div>
                                    <div className="col-start-1 row-start-2">
                                        <button onClick={() => handleMove("west")} className={`w-full h-8 flex items-center justify-center border text-xs ${currentNode?.exits?.west ? 'bg-[#222] border-[#555] text-white hover:bg-[#a32222]' : 'border-transparent text-gray-700'}`}>W</button>
                                    </div>
                                    <div className="col-start-2 row-start-2 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                    </div>
                                    <div className="col-start-3 row-start-2">
                                        <button onClick={() => handleMove("east")} className={`w-full h-8 flex items-center justify-center border text-xs ${currentNode?.exits?.east ? 'bg-[#222] border-[#555] text-white hover:bg-[#a32222]' : 'border-transparent text-gray-700'}`}>E</button>
                                    </div>
                                    <div className="col-start-2 row-start-3">
                                        <button onClick={() => handleMove("south")} className={`w-full h-8 flex items-center justify-center border text-xs ${currentNode?.exits?.south ? 'bg-[#222] border-[#555] text-white hover:bg-[#a32222]' : 'border-transparent text-gray-700'}`}>S</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom HUD: Description */}
                        <div className="p-6 bg-gradient-to-t from-black via-black/95 to-transparent pt-12">
                            <div className="max-w-3xl mx-auto pointer-events-auto">
                                <div className="bg-[#111]/90 border-l-4 border-[#a32222] p-4 text-[#e5e5e5] text-sm leading-relaxed shadow-2xl backdrop-blur-md">
                                    <p>{currentNode?.description?.replace(/\*\*/g, "") || "The area is dark and silent."}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT: SIDEBAR (Party) */}
                <div className="w-80 bg-[#161313] border-l-2 border-[#333] flex flex-col">
                    {/* TABS */}
                    <div className="flex border-b border-[#333]">
                        <button
                            onClick={() => setActiveTab("party")}
                            className={`flex-1 py-3 text-xs uppercase tracking-widest ${activeTab === 'party' ? 'bg-[#2a2a2a] text-[#c9bca0]' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            Party
                        </button>
                        <button
                            onClick={() => setActiveTab("log")}
                            className={`flex-1 py-3 text-xs uppercase tracking-widest ${activeTab === 'log' ? 'bg-[#2a2a2a] text-[#c9bca0]' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            Log
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === 'party' && (
                            <div className="space-y-4">
                                {PARTY.map((char, i) => (
                                    <div key={i} className="bg-[#0a0a0c] border border-[#333] p-2 flex gap-3 group hover:border-[#a32222] transition-colors cursor-pointer">
                                        <div className="w-12 h-12 bg-black border border-[#444] relative shrink-0">
                                            {/* Portrait Placeholder */}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[#c9bca0] font-bold text-sm truncate">{char.name}</span>
                                                <span className="text-[10px] text-gray-500 uppercase">{char.class}</span>
                                            </div>
                                            {/* BARS */}
                                            <div className="h-1.5 bg-[#222] w-full mb-1">
                                                <div className="h-full bg-[#8a1c1c]" style={{ width: `${(char.hp / char.maxHp) * 100}%` }}></div>
                                            </div>
                                            {char.maxMana > 0 && (
                                                <div className="h-1 bg-[#222] w-full">
                                                    <div className="h-full bg-[#3b82f6]" style={{ width: `${(char.mana / char.maxMana) * 100}%` }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'log' && (
                            <div className="font-mono text-xs text-gray-400 space-y-2">
                                {consoleLog.map((log, i) => (
                                    <div key={i} className={i === consoleLog.length - 1 ? "text-white animate-pulse" : "opacity-60"}>{log}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ACTION GRID (Bottom of Sidebar) */}
                    <div className="h-48 border-t-2 border-[#333] bg-[#111] p-2 grid grid-cols-3 gap-1">
                        <button
                            onClick={startCombat}
                            disabled={!currentNode?.monsters}
                            className={`game-btn bg-[#222] border border-[#444] text-[10px] uppercase font-bold text-gray-400 ${currentNode?.monsters ? 'hover:bg-[#a32222] hover:text-white border-red-900 text-red-500' : 'opacity-50 cursor-not-allowed'}`}
                        >
                            Attack
                        </button>
                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-[#a32222] hover:text-white text-[10px] uppercase font-bold text-gray-400">Defend</button>
                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-blue-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Spell</button>

                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-amber-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Item</button>
                        <button
                            onClick={() => setShowMap(true)}
                            className={`game-btn bg-[#222] border border-[#444] hover:bg-green-900 hover:text-white text-[10px] uppercase font-bold text-gray-400 ${showMap ? 'border-green-500 text-green-500' : ''}`}
                        >
                            Map
                        </button>
                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-purple-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Rest</button>

                        <div className="col-span-3 mt-1 bg-black border border-[#333] p-1 text-[10px] text-center text-gray-600 font-mono">
                            AWAITING COMMAND...
                        </div>
                    </div>
                </div>
            </div>

            {/* GLOBAL CONSOLE (Bottom Strip) */}
            <div className="h-8 bg-black border-t border-[#333] flex items-center px-4 font-mono text-xs text-green-500/80">
                <span className="mr-2 opacity-50">$</span>
                <span className="animate-flicker">{consoleLog[consoleLog.length - 1]}</span>
            </div>
        </div>
    );
}

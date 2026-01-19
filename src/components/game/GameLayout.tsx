"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/context/AudioContext";
import { CAMPAIGN_MAPS, MapNode } from "@/lib/data/maps";

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

    // Derived State
    const currentMap = CAMPAIGN_MAPS.find(m => m.id === currentMapId);
    const currentNode = currentMap?.nodes?.find(n => n.id === currentNodeId);

    // Initial Load & Persistence
    useEffect(() => {
        const saved = localStorage.getItem("hc_visited");
        if (saved) {
            setVisitedNodes(new Set(JSON.parse(saved)));
        }
    }, []);

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
                <div className="flex-1 relative bg-black border-r-2 border-[#333]">
                    {/* SCENE RENDER */}
                    <div className="absolute inset-4 border-4 border-[#2a2a2a] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                        <div className="w-full h-full bg-[#0a0a0c] flex flex-col items-center justify-center relative p-8 text-center">

                            {/* Node Visualization (Text for now, Image later) */}
                            <div className="mb-8">
                                <h2 className="text-2xl text-[#a32222] font-bold mb-2">{currentNode?.label}</h2>
                                <div className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                                    {currentNode?.description?.replace(/\*\*/g, "") || "The area is dark and silent."}
                                </div>
                            </div>

                            {/* Placeholder for 3D View / Art */}
                            <div className="text-[#333] opacity-20 text-9xl absolute bottom-12 z-0">👁️</div>

                            <div className="absolute bottom-4 left-0 w-full text-center text-gray-600 font-mono text-xs z-10">
                                loc: {currentNodeId} [{currentNode?.x}, {currentNode?.y}]
                            </div>
                        </div>

                        {/* COMPASS OVERLAY */}
                        <div className="absolute top-4 right-4 flex flex-col items-center gap-1 opacity-70 z-20">
                            <button
                                onClick={() => handleMove("north")}
                                className={`w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222] ${currentNode?.exits?.north ? 'text-white border-gray-500' : 'opacity-30 cursor-not-allowed'}`}
                            >N</button>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleMove("west")}
                                    className={`w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222] ${currentNode?.exits?.west ? 'text-white border-gray-500' : 'opacity-30 cursor-not-allowed'}`}
                                >W</button>
                                <button
                                    onClick={() => handleMove("south")}
                                    className={`w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222] ${currentNode?.exits?.south ? 'text-white border-gray-500' : 'opacity-30 cursor-not-allowed'}`}
                                >S</button>
                                <button
                                    onClick={() => handleMove("east")}
                                    className={`w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222] ${currentNode?.exits?.east ? 'text-white border-gray-500' : 'opacity-30 cursor-not-allowed'}`}
                                >E</button>
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
                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-[#a32222] hover:text-white text-[10px] uppercase font-bold text-gray-400">Attack</button>
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

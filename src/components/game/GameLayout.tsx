"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/context/AudioContext";
import { Typewriter } from "@/components/ui/Typewriter";
import { CAMPAIGN_MAPS, MapNode } from "@/lib/data/maps";
import { NarrativeEngine } from "@/lib/game/NarrativeEngine";
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
    startingRewards?: any;
}

export default function GameLayout({ onExit, startingRewards }: GameLayoutProps) {
    const { playSfx, playAmbience } = useAudio();
    const [consoleLog, setConsoleLog] = useState<string[]>([
        "> System initialized...",
        "> Rendering Narrative Interface...",
        "> Awaiting input."
    ]);

    useEffect(() => {
        if (startingRewards?.item === 'essence_djinn') {
            setTimeout(() => {
                setConsoleLog(prev => [...prev, "> ALERT: ANOMALOUS ARTIFACT DETECTED.", "> ACQUIRED: ESSENCE OF THE DJINN (+2 PRIM)."]);
                playSfx("/sfx/gain_item.mp3"); // Or generic sfx
            }, 2000);
        }
    }, [startingRewards]);

    const [activeTab, setActiveTab] = useState("party");

    // -- NAVIGATION STATE --
    const [currentMapId, setCurrentMapId] = useState("oakhaven");
    const [currentNodeId, setCurrentNodeId] = useState("market");
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

        // Initial Description
        if (currentNode) {
            const event = NarrativeEngine.describeLocation(currentNode);
            addToLog(event.text);
        }
    }, []);

    // ... (Keyboard useEffect remains mostly same, just ensuring logic aligns)

    // ... (Visited persisted useEffect remains same)

    useEffect(() => {
        // Switch to Dungeon Ambience
        playAmbience("dungeon");
    }, [playAmbience]);

    const addToLog = (msg: string) => {
        setConsoleLog(prev => [...prev.slice(-20), `> ${msg}`]); // Increased log history
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

                // Use Narrative Engine
                const event = NarrativeEngine.describeLocation(targetNode, direction);
                addToLog(event.text);

                playSfx("/sfx/footsteps.mp3");
            } else {
                addToLog(NarrativeEngine.systemMessage(`Error: Path to '${targetNodeId}' blocked.`).text);
            }
        } else {
            addToLog("You cannot go that way.");
            playSfx("/sfx/bump.mp3");
        }
    };

    const startCombat = () => {
        if (!currentNode?.monsters || currentNode.monsters.length === 0) {
            addToLog("No enemies detected here.");
            return;
        }
        setCombatEnemies(currentNode.monsters);
        setInCombat(true);

        const encounter = NarrativeEngine.encounterTrigger(currentNode.monsters);
        addToLog(encounter.text);
        if (encounter.details) addToLog(encounter.details);
    };

    const handleVictory = () => {
        setInCombat(false);
        playAmbience("dungeon");

        const result = NarrativeEngine.combatResult('victory');
        addToLog(result.text);
        if (result.details) addToLog(result.details);
    };

    const handleFlee = () => {
        setInCombat(false);
        playAmbience("dungeon");

        const result = NarrativeEngine.combatResult('flee');
        addToLog(result.text);
        if (result.details) addToLog(result.details);
    };

    if (inCombat) {
        return <CombatLayout enemySlugs={combatEnemies} onVictory={handleVictory} onFlee={handleFlee} />;
    }

    return (
        <div className="game-shell fixed inset-0 z-[1000] bg-black text-[#c9bca0] font-serif overflow-hidden flex flex-col">
            {/* 1. TOP BAR (Status) */}
            <div className="h-12 bg-[#1a1515] border-b-2 border-[#5c1212] flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-[#a32222] font-bold tracking-widest uppercase text-sm">
                        {currentMap?.title || "UNKNOWN REGION"}
                    </span>
                    <span className="text-xs text-gray-600">|</span>
                    <span className="text-amber-700/80 animate-pulse text-xs">TORCH: 84%</span>
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

                                    const isCurrent = node.id === currentNodeId;
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

                        {/* Current Description (Newest) */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6">
                            <span className="text-[#a32222] font-bold tracking-widest text-xs uppercase block mb-2">
                                &gt; {currentNode?.label || "Unknown"}
                            </span>
                            <div className="text-xl text-[#e5e5e5] leading-relaxed font-serif min-h-[3rem]">
                                <Typewriter
                                    key={currentNodeId}
                                    text={currentNode?.description?.replace(/\*\*/g, "") || "The void is silent."}
                                    speed={15}
                                    delay={50}
                                />
                            </div>
                            {/* Exits */}
                            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
                                <span className="text-gray-600">Exits:</span>
                                {currentNode?.exits?.north && <span className="text-white border-b border-white/20 pb-0.5">North</span>}
                                {currentNode?.exits?.south && <span className="text-white border-b border-white/20 pb-0.5">South</span>}
                                {currentNode?.exits?.east && <span className="text-white border-b border-white/20 pb-0.5">East</span>}
                                {currentNode?.exits?.west && <span className="text-white border-b border-white/20 pb-0.5">West</span>}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#222] w-full my-8"></div>

                        {/* Previous History (Fadable) */}
                        <div className="opacity-40 text-sm space-y-4 font-serif">
                            {consoleLog.slice(0, -1).reverse().map((log, i) => (
                                <div key={i} className="text-gray-500 pl-4 border-l border-[#333]">{log.replace("> ", "")}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: SIDEBAR (Party) */}
                <div className="w-80 bg-[#161313] border-l-2 border-[#333] flex flex-col z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
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
            <div className="h-8 bg-black border-t border-[#333] flex items-center px-4 font-mono text-xs text-green-500/80 z-20">
                <span className="mr-2 opacity-50">$</span>
                <span className="animate-flicker">{consoleLog[consoleLog.length - 1]}</span>
            </div>
        </div>
    );
}

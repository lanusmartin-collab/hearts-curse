"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/context/AudioContext";
import DiceRoller from "@/components/ui/DiceRoller"; // Reuse or wrap? For now, we might want a specific game-mode wrapper.

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

    useEffect(() => {
        // Switch to Dungeon Ambience
        playAmbience("dungeon");
    }, [playAmbience]);

    const addToLog = (msg: string) => {
        setConsoleLog(prev => [...prev.slice(-4), `> ${msg}`]);
    };

    return (
        <div className="game-shell fixed inset-0 z-[1000] bg-black text-[#c9bca0] font-serif overflow-hidden flex flex-col">
            {/* 1. TOP BAR (Status / Compass) */}
            <div className="h-12 bg-[#1a1515] border-b-2 border-[#5c1212] flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <span className="text-[#a32222] font-bold tracking-widest">LAYER 1: THE VEINS</span>
                    <span className="text-xs text-gray-500">|</span>
                    <span className="text-amber-600 animate-pulse">TORCH: 84%</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onExit} className="text-xs text-[#a32222] hover:text-red-400 uppercase tracking-widest">[EXIT SIM]</button>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: VIEWPORT (The Eye) */}
                <div className="flex-1 relative bg-black border-r-2 border-[#333]">
                    {/* SCENE RENDER */}
                    <div className="absolute inset-4 border-4 border-[#2a2a2a] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                        <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center relative">
                            {/* Placeholder for 3D View / Art */}
                            <div className="text-[#333] opacity-20 text-9xl">👁️</div>
                            <div className="absolute bottom-4 left-0 w-full text-center text-gray-600 font-mono text-xs">
                                viewport_render: [nodata]
                            </div>
                        </div>

                        {/* COMPASS OVERLAY */}
                        <div className="absolute top-4 right-4 flex flex-col items-center gap-1 opacity-70">
                            <button className="w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222]">N</button>
                            <div className="flex gap-1">
                                <button className="w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222]">W</button>
                                <button className="w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222]">S</button>
                                <button className="w-8 h-8 bg-[#111] border border-[#444] text-[#888] hover:text-white hover:border-[#a32222]">E</button>
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
                        <button className="game-btn bg-[#222] border border-[#444] hover:bg-green-900 hover:text-white text-[10px] uppercase font-bold text-gray-400">Map</button>
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

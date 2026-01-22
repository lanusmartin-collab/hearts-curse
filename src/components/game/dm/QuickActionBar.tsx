"use client";

import React, { useState } from "react";
import { CopyPlus, Swords, Eye, Skull, Coins, ChevronUp, ChevronDown, Dices } from "lucide-react";
import * as LootTables from "@/lib/data/loot-tables";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { useToast } from "@/lib/context/ToastContext";
import FactionManager from "./FactionManager";

interface QuickActionBarProps {
    onSpawnLoot: (item: any) => void;
    onSpawnEncounter: (monsters: string[]) => void;
    currentLocationType?: string;
}

export default function QuickActionBar({ onSpawnLoot, onSpawnEncounter, currentLocationType }: QuickActionBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showFactions, setShowFactions] = useState(false);
    const { addToast } = useToast();

    // --- LOGIC: LOOT GENERATION ---
    const generateLoot = () => {
        const tables = [
            LootTables.MAGIC_ITEMS_A,
            LootTables.MAGIC_ITEMS_B,
            LootTables.MAGIC_ITEMS_F
        ];
        const randomTable = tables[Math.floor(Math.random() * tables.length)];
        const item = randomTable[Math.floor(Math.random() * randomTable.length)];

        onSpawnLoot(item);
        addToast(`Loot Injected: ${item.name}`, "success");
    };

    // --- LOGIC: AMBUSH SPAWN ---
    const spawnAmbush = () => {
        const allSlugs = Object.keys(MONSTERS_2024);
        const count = Math.floor(Math.random() * 2) + 1;
        const enemies = [];
        for (let i = 0; i < count; i++) {
            const randomSlug = allSlugs[Math.floor(Math.random() * allSlugs.length)];
            enemies.push(randomSlug);
        }

        onSpawnEncounter(enemies);
        addToast(`Ambush Triggered! ${count} enemies spawning.`, "error");
    };

    // --- LOGIC: REVEAL (Flavor) ---
    const revealMap = () => {
        addToast("Map Revealed: Fog of War cleared.", "info");
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-2">

            {/* FACTION MANAGER MODAL (Floats to the left of the bar) */}
            {showFactions && (
                <div className="absolute bottom-0 right-16 z-[2001] animate-in slide-in-from-right-10">
                    <FactionManager />
                </div>
            )}

            {/* EXPANDED MENU */}
            {isOpen && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-5 duration-200 mb-2">

                    <button
                        onClick={() => setShowFactions(!showFactions)}
                        className={`flex items-center gap-2 border px-4 py-2 rounded-lg shadow-lg transition-all font-mono text-xs uppercase tracking-wider ${showFactions ? 'bg-purple-900 border-purple-500 text-white' : 'bg-stone-800 border-stone-600 text-gray-300 hover:bg-stone-700'}`}
                    >
                        <Eye size={16} /> Diplomacy
                    </button>

                    <button
                        onClick={generateLoot}
                        className="flex items-center gap-2 bg-amber-900 border border-amber-600 text-amber-100 px-4 py-2 rounded-lg shadow-lg hover:bg-amber-800 transition-all font-mono text-xs uppercase tracking-wider"
                    >
                        <Coins size={16} /> Loot Drop
                    </button>

                    <button
                        onClick={spawnAmbush}
                        className="flex items-center gap-2 bg-red-900 border border-red-600 text-red-100 px-4 py-2 rounded-lg shadow-lg hover:bg-red-800 transition-all font-mono text-xs uppercase tracking-wider"
                    >
                        <Swords size={16} /> Ambush
                    </button>

                    <button
                        onClick={revealMap}
                        className="flex items-center gap-2 bg-blue-900 border border-blue-600 text-blue-100 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition-all font-mono text-xs uppercase tracking-wider"
                    >
                        <Eye size={16} /> Reveal
                    </button>

                </div>
            )}

            {/* TOGGLE BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 z-[2002]
                    ${isOpen ? 'bg-stone-800 border-white rotate-180' : 'bg-gradient-to-br from-red-900 to-red-700 border-red-500 hover:scale-110 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]'}
                `}
            >
                {isOpen ? (
                    <ChevronDown className="text-white" />
                ) : (
                    <div className="relative">
                        <Dices className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" size={28} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                    </div>
                )}
            </button>
            <div className="bg-black/80 px-2 py-1 rounded text-[10px] text-gray-400 font-mono tracking-widest uppercase backdrop-blur-sm border border-[#333]">
                DM Tools
            </div>
        </div>
    );
}

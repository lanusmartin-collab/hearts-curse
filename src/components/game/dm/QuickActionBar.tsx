"use client";

import React, { useState } from "react";
import { CopyPlus, Swords, Eye, Skull, Coins, ChevronUp, ChevronDown } from "lucide-react";
import * as LootTables from "@/lib/data/loot-tables";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { useToast } from "@/lib/context/ToastContext";

interface QuickActionBarProps {
    onSpawnLoot: (item: any) => void;
    onSpawnEncounter: (monsters: string[]) => void;
    currentLocationType?: string;
}

export default function QuickActionBar({ onSpawnLoot, onSpawnEncounter, currentLocationType }: QuickActionBarProps) {
    const [isOpen, setIsOpen] = useState(false);
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
        <div className="fixed bottom-20 right-6 z-[2000] flex flex-col items-end gap-2">

            {/* EXPANDED MENU */}
            {isOpen && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-5 duration-200 mb-2">

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
                    flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-xl transition-all duration-300
                    ${isOpen ? 'bg-stone-800 border-white rotate-180' : 'bg-stone-950 border-[#a32222] hover:scale-110'}
                `}
            >
                {isOpen ? <ChevronDown className="text-white" /> : <img src="/icons/d20_white.svg" className="w-6 h-6 opacity-80" alt="DM" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                {!isOpen && <CopyPlus className="text-[#a32222] absolute" size={20} />}
            </button>
            <div className="bg-black/80 px-2 py-1 rounded text-[10px] text-gray-400 font-mono tracking-widest uppercase backdrop-blur-sm border border-[#333]">
                DM Tools
            </div>
        </div>
    );
}

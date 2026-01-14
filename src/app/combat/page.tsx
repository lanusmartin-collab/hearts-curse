"use client";

import { useState } from "react";
import BattleMap, { CombatToken } from "@/components/combat/BattleMap";
import InitiativeTracker from "@/components/combat/InitiativeTracker";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { Plus, User, Search } from "lucide-react";

export default function CombatPage() {
    const [tokens, setTokens] = useState<CombatToken[]>([
        { id: "p1", label: "Thorin", x: 2, y: 2, color: "#3b82f6", size: 1, hp: 45, maxHp: 45, ac: 18, initiative: 15, conditions: ["Poisoned"] },
        { id: "p2", label: "Elara", x: 3, y: 3, color: "#8b5cf6", size: 1, hp: 32, maxHp: 32, ac: 14, initiative: 12 },
    ]);

    const [currentTurn, setCurrentTurn] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Helpers
    const handleMove = (id: string, newX: number, newY: number) => {
        setTokens(prev => prev.map(t => t.id === id ? { ...t, x: newX, y: newY } : t));
    };

    const handleDelete = (id: string) => {
        setTokens(prev => prev.filter(t => t.id !== id));
    };

    const handleNextTurn = () => {
        setCurrentTurn(prev => (prev + 1) % tokens.length);
    };

    const addMonster = (slug: string) => {
        const monster = MONSTERS_2024[slug];
        if (!monster) return;

        const newToken: CombatToken = {
            id: `${slug}-${Date.now()}`,
            label: monster.name,
            x: 5,
            y: 5,
            color: "#ef4444", // Enemy Red
            size: monster.size === "Large" ? 2 : monster.size === "Huge" ? 3 : monster.size === "Gargantuan" ? 4 : 1,
            image: monster.image,
            hp: monster.hp,
            maxHp: monster.hp,
            ac: monster.ac,
            initiative: Math.floor(Math.random() * 20) + 1 + (monster.stats.dex - 10) / 2 // Simple init roll
        };

        setTokens(prev => [...prev, newToken]);
        setIsAdding(false);
    };

    // Filter monsters for search
    const monsterList = Object.values(MONSTERS_2024).filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10); // Limit results

    return (
        <div className="h-screen flex flex-col bg-stone-950 text-stone-200 overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 border-b border-stone-800 bg-black flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-amber-600 font-bold text-xl tracking-wider">BATTLEMAP V1.0</div>
                    <div className="text-xs text-stone-500 font-mono hidden md:block">GRID: 20x15 • CELL: 50px</div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className={`retro-btn text-xs flex items-center gap-2 ${isAdding ? "bg-stone-700" : "bg-green-700"}`}
                    >
                        <Plus size={14} /> ADD COMBATANT
                    </button>
                    {/* Placeholder for future tools like 'Clear Board' or 'Load Encounter' */}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">

                {/* Main BattleMap Area */}
                <div className="flex-1 bg-stone-900 flex items-center justify-center p-8 overflow-auto">
                    <BattleMap
                        tokens={tokens}
                        onTokenMove={handleMove}
                        rows={15}
                        cols={20}
                        cellSize={50}
                    />
                </div>

                {/* Right Sidebar: Initiative */}
                <div className="w-80 h-full border-l border-stone-800 z-10 shadow-xl">
                    <InitiativeTracker
                        tokens={tokens}
                        currentTurnIndex={currentTurn}
                        onNextTurn={handleNextTurn}
                        onDeleteToken={handleDelete}
                        onUpdateToken={() => { }} // TODO: Implement edit
                    />
                </div>

                {/* "Add Monster" Floating Modal */}
                {isAdding && (
                    <div className="absolute top-4 right-80 mr-4 w-72 bg-stone-800 border border-stone-600 shadow-2xl rounded p-4 z-50 animate-fade-in">
                        <div className="flex items-center bg-stone-900 p-2 rounded border border-stone-700 mb-3">
                            <Search size={16} className="text-stone-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search monsters..."
                                className="bg-transparent border-none outline-none text-sm text-white w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-1">
                            <button
                                onClick={() => {
                                    setTokens(prev => [...prev, {
                                        id: `player-${Date.now()}`,
                                        label: "New Player",
                                        x: 2, y: 2,
                                        color: "#3b82f6",
                                        size: 1,
                                        hp: 10, maxHp: 10, ac: 10,
                                        initiative: Math.floor(Math.random() * 20) + 1
                                    }]);
                                    setIsAdding(false);
                                }}
                                className="w-full text-left p-2 hover:bg-stone-700 rounded flex items-center gap-2 text-blue-400"
                            >
                                <User size={14} /> <span>Generic Player Token</span>
                            </button>
                            <div className="h-px bg-stone-700 my-2" />

                            {monsterList.map(m => (
                                <button
                                    key={m.slug}
                                    onClick={() => addMonster(m.slug || "")}
                                    className="w-full text-left p-2 hover:bg-stone-700 rounded flex justify-between items-center group"
                                >
                                    <span className="font-bold text-stone-300">{m.name}</span>
                                    <span className="text-xs text-stone-500">CR {m.cr}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

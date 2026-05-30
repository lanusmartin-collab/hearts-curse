"use client";

import { useState, useEffect } from "react";
import BattleMap, { CombatToken } from "@/components/combat/BattleMap";
import InitiativeTracker from "@/components/game/combat/InitiativeTracker";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import { Plus, User, Search, Swords } from "lucide-react";

export default function CombatPage() {
    const [tokens, setTokens] = useState<CombatToken[]>([
        { id: "p1", label: "Thorin", x: 2, y: 2, color: "#3b82f6", size: 1, hp: 45, maxHp: 45, ac: 18, initiative: 15, conditions: ["Poisoned"] },
        { id: "p2", label: "Elara", x: 3, y: 3, color: "#8b5cf6", size: 1, hp: 32, maxHp: 32, ac: 14, initiative: 12 },
    ]);

    const [currentTurn, setCurrentTurn] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [queue, setQueue] = useState<any[]>([]);

    // Helper to resolve monster by slug
    const getMonsterBySlug = (slug: string): any => {
        if (MONSTERS_2024[slug]) return MONSTERS_2024[slug];
        try {
            const saved = localStorage.getItem("custom_statblocks");
            if (saved) {
                const parsed = JSON.parse(saved);
                const found = parsed.find((m: any) => {
                    let key = m.slug;
                    if (!key && m.name) {
                        key = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    }
                    return key === slug || m.slug === slug;
                });
                if (found) return found;
            }
        } catch (e) {
            console.error("Failed to parse custom statblocks in combat page", e);
        }
        return null;
    };

    // Load queue from localStorage on mount
    useEffect(() => {
        const savedQueue = localStorage.getItem("combat_tracker_queue");
        if (savedQueue) {
            try {
                setQueue(JSON.parse(savedQueue));
            } catch (e) {
                console.error("Failed to load combat tracker queue", e);
            }
        }
    }, []);

    // Listen for direct monster additions from GlobalDrawers
    useEffect(() => {
        const handleDirectAdd = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { monster, slug } = customEvent.detail;
            if (monster) {
                setTokens(prev => {
                    // Find free coordinates starting at x: 5, y: 5
                    let targetX = 5;
                    let targetY = 5;
                    let foundSpot = false;

                    for (let r = 1; r < 15; r++) {
                        for (let c = 1; c < 20; c++) {
                            const isOccupied = prev.some(t => t.x === c && t.y === r);
                            if (!isOccupied) {
                                targetX = c;
                                targetY = r;
                                foundSpot = true;
                                break;
                            }
                        }
                        if (foundSpot) break;
                    }

                    const size = monster.size === "Large" ? 2 : monster.size === "Huge" ? 3 : monster.size === "Gargantuan" ? 4 : 1;
                    const dex = monster.stats?.dex || 10;
                    const dexMod = Math.floor((dex - 10) / 2);
                    const initRoll = Math.floor(Math.random() * 20) + 1 + dexMod;

                    const baseName = monster.name;
                    const existingCount = prev.filter(t => t.label.startsWith(baseName)).length;
                    const label = existingCount > 0 ? `${baseName} ${existingCount + 1}` : baseName;

                    const newToken: CombatToken = {
                        id: `${slug}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        label,
                        x: targetX,
                        y: targetY,
                        color: "#ef4444",
                        size,
                        image: monster.image,
                        hp: monster.hp || 10,
                        maxHp: monster.hp || 10,
                        ac: monster.ac || 10,
                        initiative: initRoll
                    };

                    return [...prev, newToken];
                });

                // Clear the popped item from local storage queue
                try {
                    const existing = JSON.parse(localStorage.getItem("combat_tracker_queue") || "[]");
                    if (existing.length > 0) {
                        existing.pop();
                        localStorage.setItem("combat_tracker_queue", JSON.stringify(existing));
                    }
                } catch (err) {
                    console.error("Failed to update queue on direct add", err);
                }
            }
        };

        window.addEventListener("add-token-direct", handleDirectAdd);
        return () => window.removeEventListener("add-token-direct", handleDirectAdd);
    }, []);

    // Load queued encounter onto the grid
    const loadQueuedEncounter = () => {
        const newTokens: CombatToken[] = [];
        
        queue.forEach((item, idx) => {
            const monster = getMonsterBySlug(item.slug);
            if (!monster) return;

            let targetX = 5;
            let targetY = 5;
            let foundSpot = false;

            // Search for unoccupied coordinates
            for (let r = 1; r < 15; r++) {
                for (let c = 1; c < 20; c++) {
                    const isOccupied = tokens.some(t => t.x === c && t.y === r) || 
                                       newTokens.some(t => t.x === c && t.y === r);
                    if (!isOccupied) {
                        targetX = c;
                        targetY = r;
                        foundSpot = true;
                        break;
                    }
                }
                if (foundSpot) break;
            }

            const size = monster.size === "Large" ? 2 : monster.size === "Huge" ? 3 : monster.size === "Gargantuan" ? 4 : 1;
            const dex = monster.stats?.dex || 10;
            const dexMod = Math.floor((dex - 10) / 2);
            const initRoll = Math.floor(Math.random() * 20) + 1 + dexMod;

            const baseName = monster.name;
            const existingCount = tokens.filter(t => t.label.startsWith(baseName)).length +
                                  newTokens.filter(t => t.label.startsWith(baseName)).length;
            const label = existingCount > 0 ? `${baseName} ${existingCount + 1}` : baseName;

            newTokens.push({
                id: `${item.slug}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
                label,
                x: targetX,
                y: targetY,
                color: "#ef4444",
                size,
                image: monster.image,
                hp: monster.hp || 10,
                maxHp: monster.hp || 10,
                ac: monster.ac || 10,
                initiative: initRoll
            });
        });

        if (newTokens.length > 0) {
            setTokens(prev => [...prev, ...newTokens]);
        }

        // Wipe queue
        localStorage.removeItem("combat_tracker_queue");
        setQueue([]);
    };

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
        const monster = getMonsterBySlug(slug);
        if (!monster) return;

        const size = monster.size === "Large" ? 2 : monster.size === "Huge" ? 3 : monster.size === "Gargantuan" ? 4 : 1;
        const dex = monster.stats?.dex || 10;
        const dexMod = Math.floor((dex - 10) / 2);
        const initiative = Math.floor(Math.random() * 20) + 1 + dexMod;

        const baseName = monster.name;
        const existingCount = tokens.filter(t => t.label.startsWith(baseName)).length;
        const label = existingCount > 0 ? `${baseName} ${existingCount + 1}` : baseName;

        const newToken: CombatToken = {
            id: `${slug}-${Date.now()}`,
            label,
            x: 5,
            y: 5,
            color: "#ef4444", // Enemy Red
            size,
            image: monster.image,
            hp: monster.hp || 10,
            maxHp: monster.hp || 10,
            ac: monster.ac || 10,
            initiative
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
                <div className="w-80 h-full border-l border-stone-800 z-10 shadow-xl bg-stone-950 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        <InitiativeTracker
                            combatants={tokens.map(t => ({
                                id: t.id,
                                name: t.label,
                                initiative: t.initiative || 0,
                                hp: t.hp,
                                maxHp: t.maxHp,
                                ac: t.ac,
                                conditions: t.conditions || [],
                                type: t.id.startsWith("p") ? "player" : "monster"
                            }))}
                            turnIndex={currentTurn}
                        />
                    </div>

                    {/* Controls (Temporary Placeholder) */}
                    <div className="p-4 flex gap-2 justify-center border-t border-stone-800">
                        <button onClick={handleNextTurn} className="retro-btn bg-stone-800 text-xs w-full py-2 hover:bg-stone-700 transition-colors">NEXT TURN</button>
                    </div>
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

                {/* Queue prompt modal */}
                {queue.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-[#141416] border-2 border-amber-600/80 p-4 rounded-md shadow-2xl max-w-sm z-[100] animate-pulse-slow">
                        <div className="flex items-center gap-2 mb-2 text-amber-500">
                            <Swords size={18} />
                            <h4 className="font-header text-xs uppercase tracking-wider font-bold">Queued Encounter Ready</h4>
                        </div>
                        <p className="text-xs text-stone-400 mb-4 line-clamp-3">
                            Monsters: {queue.map(item => getMonsterBySlug(item.slug)?.name || item.slug).join(", ")}
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    localStorage.removeItem("combat_tracker_queue");
                                    setQueue([]);
                                }}
                                className="text-[10px] font-mono uppercase px-2 py-1 border border-stone-800 text-stone-500 hover:text-white rounded hover:bg-stone-900 transition-colors cursor-pointer"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={loadQueuedEncounter}
                                className="bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] font-mono uppercase px-3 py-1 rounded transition-colors cursor-pointer"
                            >
                                Load to Grid
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

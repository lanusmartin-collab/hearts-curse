"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { useAudio } from "@/lib/context/AudioContext";
import { Typewriter } from "@/components/ui/Typewriter";
import { CAMPAIGN_MAPS, MapNode } from "@/lib/data/maps";
import { NarrativeEngine } from "@/lib/game/NarrativeEngine";
import { SaveManager } from "@/lib/game/SaveManager";
import { SHOPS, ShopItem } from "@/lib/data/shops";
import ShopInterface from "./ShopInterface";
import CombatLayout from "./CombatLayout";
import { Combatant } from "@/types/combat";
import {
    TOWN_DAY_TABLE,
    TOWN_NIGHT_TABLE,
    OAKHAVEN_MINES_TABLE,
    UNDERDARK_TRAVEL_TABLE,
    ARACH_TINILITH_TABLE,
    NETHERIL_RUINS_TABLE,
    SILENT_WARDS_TABLE,
    LIBRARY_WHISPERS_TABLE,
    CATACOMBS_DESPAIR_TABLE,
    HEART_CHAMBER_TABLE,
    OSSUARY_TABLE,
    DWARVEN_RUINS_TABLE,
    MIND_FLAYER_COLONY_TABLE,
    BEHOLDER_LAIR_TABLE,
    SPIRE_TABLE,
    CASTLE_MOURNWATCH_TABLE,
    Encounter
} from "@/lib/data/encounters";

// Placeholder for Party Data
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

const GameLayout = forwardRef<GameLayoutRef, GameLayoutProps>(({ onExit, startingRewards, playerCharacter, initialMapId = "oakhaven", initialNodeId = "market" }, ref) => {
    const { playSfx, playAmbience } = useAudio();
    // Use playerCharacter to override the first slot of the party
    const initialParty = playerCharacter
        ? [
            {
                name: playerCharacter.name,
                class: (playerCharacter.stats?.str || 10) > 14 ? "Warrior" : "Adventurer", // Simple heuristic or pass class name in Combatant
                hp: playerCharacter.hp,
                maxHp: playerCharacter.maxHp,
                mana: 10,
                maxMana: 20,
                img: "/portraits/kaelen.png" // Placeholder or dynamic based on class
            },
            ...PARTY.slice(1) // Keep companions for now? Or solo? Let's keep companions.
        ]
        : PARTY;

    const [partyState, setPartyState] = useState(initialParty);
    const [playerGold, setPlayerGold] = useState(100); // Default starting gold
    const [inventory, setInventory] = useState<ShopItem[]>([]); // Proper inventory state

    const [consoleLog, setConsoleLog] = useState<string[]>([
        "> System initialized...",
        "> Rendering Narrative Interface...",
        "> Awaiting input."
    ]);
    const consoleEndRef = React.useRef<HTMLDivElement>(null);

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
    const [currentMapId, setCurrentMapId] = useState(initialMapId);
    const [currentNodeId, setCurrentNodeId] = useState(initialNodeId);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["market"]));
    const [showMap, setShowMap] = useState(false);

    // Combat State
    const [inCombat, setInCombat] = useState(false);
    const [combatEnemies, setCombatEnemies] = useState<string[]>([]);

    // Shop State
    const [showShop, setShowShop] = useState(false);

    // Derived State
    const currentMap = CAMPAIGN_MAPS.find(m => m.id === currentMapId);
    const currentNode = currentMap?.nodes?.find(n => n.id === currentNodeId);

    // Auto-Close Shop on Move
    useEffect(() => {
        setShowShop(false);
    }, [currentNodeId, currentMapId]);

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

    // ... inside component

    useEffect(() => {
        // Switch to Dungeon Ambience
        playAmbience("dungeon");
    }, [playAmbience]);

    // Expose saveGame via ref
    useImperativeHandle(ref, () => ({
        saveGame: () => {
            if (playerCharacter && currentNodeId) {
                const saveId = `manual_save_${Date.now()}`;
                SaveManager.saveGame(saveId, {
                    id: saveId,
                    timestamp: Date.now(),
                    name: `Manual Save - ${currentNode?.label || "Unknown"}`,
                    version: "2.3",
                    playerCharacter: playerCharacter,
                    currentMapId: currentMapId,
                    currentNodeId: currentNodeId,
                    questState: {}, // TODO: Implement Quest State
                    inventory: inventory,
                    gold: playerGold,
                    playtime: 0 // TODO: Track playtime
                });
                addToLog("Game Saved Successfully.");
                playSfx("/sfx/retro_success.mp3"); // Assume this sfx exists or similar
            }
        }
    }));


    // AUTO-SAVE on Node Change
    useEffect(() => {
        if (playerCharacter && currentNodeId) {
            SaveManager.saveGame("autosave", {
                id: "autosave",
                timestamp: Date.now(),
                name: "Auto Save",
                version: "2.3",
                playerCharacter: playerCharacter,
                currentMapId: currentMapId,
                currentNodeId: currentNodeId,
                questState: {}, // TODO
                inventory: inventory,
                gold: playerGold,
                playtime: 0 // TODO: Track playtime
            });
            // Optional: Small notification or log?
            // addToLog("Game Saved."); // Maybe too spammy
        }
    }, [currentNodeId, currentMapId, playerCharacter, inventory, playerGold]);

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
        // 1. Fixed Encounter? type="encounter" or has monsters list
        if (currentNode?.monsters && currentNode.monsters.length > 0) {
            setCombatEnemies(currentNode.monsters);
            setInCombat(true);

            const encounter = NarrativeEngine.encounterTrigger(currentNode.monsters);
            addToLog(encounter.text);
            if (encounter.details) addToLog(encounter.details);
            return;
        }

        // 2. Random Encounter? Linked via map.encounterTable
        if (currentMap?.encounterTable) {
            let table: Encounter[] = [];
            switch (currentMap.encounterTable) {
                case "mines": table = OAKHAVEN_MINES_TABLE; break;
                case "underdark": table = UNDERDARK_TRAVEL_TABLE; break;
                case "arach": table = ARACH_TINILITH_TABLE; break;
                case "netheril": table = NETHERIL_RUINS_TABLE; break;
                case "silent_wards": table = SILENT_WARDS_TABLE; break;
                case "library": table = LIBRARY_WHISPERS_TABLE; break;
                case "dwarven_ruins": table = DWARVEN_RUINS_TABLE; break;
                case "mind_flayer": table = MIND_FLAYER_COLONY_TABLE; break;
                case "beholder": table = BEHOLDER_LAIR_TABLE; break;
                case "spire": table = SPIRE_TABLE; break;
                case "catacombs": table = CATACOMBS_DESPAIR_TABLE; break;
                case "heart": table = HEART_CHAMBER_TABLE; break;
                case "ossuary": table = OSSUARY_TABLE; break;
                case "castle": table = CASTLE_MOURNWATCH_TABLE; break; // Added castle manually as I missed it in the list but it was in maps.ts
                default: table = TOWN_DAY_TABLE;
            }

            // Simple Roll
            const roll = Math.floor(Math.random() * 20) + 1;
            const event = table.find(e => roll >= e.roll[0] && roll <= e.roll[1]);

            if (event) {
                addToLog(`> Encounter Roll: ${roll} - ${event.name}`);
                addToLog(event.description);
                if (event.monsters && event.monsters.length > 0) {
                    setCombatEnemies(event.monsters);
                    setInCombat(true);
                } else {
                    // Flavor event
                    playSfx("/sfx/magical_effect.mp3");
                }
            } else {
                addToLog("> The shadows are quiet... for now.");
            }
            return;
        }

        addToLog("No enemies detected here.");
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

    const handleBuyItem = (item: ShopItem) => {
        setInventory(prev => [...prev, item]); // Add to inventory
        addToLog(`Purchased: ${item.name} for ${item.cost}gp.`);
        playSfx("/sfx/gain_item.mp3");
    };

    if (inCombat) {
        return <CombatLayout enemySlugs={combatEnemies} playerCharacter={playerCharacter} onVictory={handleVictory} onFlee={handleFlee} />;
    }

    const currentShop = currentNode?.shopId ? SHOPS[currentNode.shopId] : null;

    return (
        <div className="game-shell fixed inset-0 z-[1000] bg-black text-[#c9bca0] font-serif overflow-hidden flex flex-col">

            {/* SHOP MODAL */}
            {showShop && currentShop && (
                <ShopInterface
                    shop={currentShop}
                    playerGold={playerGold}
                    onClose={() => setShowShop(false)}
                    onBuy={(item) => {
                        handleBuyItem(item);
                        setPlayerGold(prev => prev - item.cost);
                    }}
                />
            )}

            {/* 1. TOP BAR (Status) */}
            <div className="h-12 bg-[#1a1515] border-b-2 border-[#5c1212] flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <span className="text-[#a32222] font-bold tracking-widest uppercase text-sm">
                        {currentMap?.title || "UNKNOWN REGION"}
                    </span>
                    <span className="text-xs text-gray-600">|</span>
                    <span className="text-amber-700/80 animate-pulse text-xs">TORCH: 84%</span>
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

                        {/* MAP OVERLAY */}
                        {showMap && (
                            <div className="absolute inset-0 z-50 bg-black/95 flex flex-col p-4 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                                    <h2 className="text-xl uppercase tracking-widest text-[#a32222]">World Map</h2>
                                    <button onClick={() => setShowMap(false)} className="text-gray-500 hover:text-white">[CLOSE]</button>
                                </div>
                                <div className="flex-1 overflow-auto flex justify-center items-center">
                                    {/* Render Maps List or Region Map */}
                                    <div className="grid grid-cols-1 gap-4 max-w-2xl w-full">
                                        {CAMPAIGN_MAPS.map(map => (
                                            <div key={map.id}
                                                onClick={() => {
                                                    if (map.route) {
                                                        if (typeof window !== 'undefined') window.location.href = map.route;
                                                    } else {
                                                        setCurrentMapId(map.id);
                                                        setCurrentNodeId(map.nodes?.[0]?.id || "ent");
                                                        setShowMap(false);
                                                    }
                                                }}
                                                className={`p-4 border border-[#333] hover:border-[#a32222] hover:bg-[#111] cursor-pointer transition-all ${currentMapId === map.id ? 'border-yellow-900 bg-[#1a1500]' : ''}`}
                                            >
                                                <div className="font-bold text-lg">{map.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">{map.description.slice(0, 100)}...</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

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

                                {/* Node Visualizer (If Hex/Square Grid) - Simplified for Text Adventure Feel */}
                                <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end pb-12 pointer-events-none">
                                    <h1 className="text-3xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2 animate-in slide-in-from-bottom-2">
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
                                            onClick={startCombat}
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
                                                onClick={() => {
                                                    const urlParams = new URLSearchParams(currentNode.link?.split('?')[1]);
                                                    const newMapId = urlParams.get('id');
                                                    if (newMapId) {
                                                        const newMap = CAMPAIGN_MAPS.find(m => m.id === newMapId);
                                                        if (newMap && newMap.nodes && newMap.nodes.length > 0) {
                                                            setCurrentMapId(newMapId);
                                                            // Reset to first node or specific entry point if we had one
                                                            setCurrentNodeId(newMap.nodes[0].id);
                                                            addToLog(`Travelled to ${newMap.title}`);
                                                            playSfx("/sfx/door_heavy.mp3"); // Or appropriate transition sound
                                                        }
                                                    }
                                                }}
                                                className="game-btn bg-[#222] border border-cyan-800 text-cyan-500 hover:bg-cyan-900 hover:text-white text-[10px] uppercase font-bold animate-pulse"
                                            >
                                                Enter
                                            </button>
                                        ) : (
                                            <button
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
});

GameLayout.displayName = "GameLayout";

export default GameLayout;

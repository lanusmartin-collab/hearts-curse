"use client";

import { useState, useEffect } from "react";
import { ALL_MONSTERS } from "@/lib/data/monsters_2024";
import DROW_MONSTERS from "@/lib/data/drow_monsters.json";
import { Statblock } from "@/lib/data/statblocks";
import { ShopItem } from "@/lib/data/items";
import { generateNPC, generateLootItem, generateArtifact, GeneratorTheme } from "@/lib/generators";
import StatblockCard from "@/components/ui/StatblockCard";
import { LootCard } from "@/components/ui/LootCard";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
import { NPC_NAMES, NPC_TITLES, NPC_QUIRKS } from "@/lib/data/generator-tables";
import CommandBar from "@/components/ui/CommandBar";
import GeneratorSidebar from "@/components/ui/GeneratorSidebar";

import { Trash2 } from "lucide-react";

type RegistryItem = {
    id: number;
    type: 'npc' | 'monster' | 'loot' | 'artifact';
    name: string;
    data: any;
    timestamp: Date;
};

export default function GeneratorsPage() {
    const [result, setResult] = useState<Statblock | null>(null);
    const [lootItem, setLootItem] = useState<ShopItem | null>(null);
    const [selectedMapId, setSelectedMapId] = useState<string>("oakhaven");
    const [activeTool, setActiveTool] = useState<'npc' | 'monster' | 'loot' | 'artifact' | 'register'>('loot');
    const [isGenerating, setIsGenerating] = useState(false);
    const [registry, setRegistry] = useState<RegistryItem[]>([]);

    // Persistence: Load Registry on Mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('foundry_registry');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Rehydrate dates properly
                    const rehydrated = parsed.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp)
                    }));
                    setRegistry(rehydrated);
                } catch (e) {
                    console.error("Failed to load registry:", e);
                }
            }
        }
    }, []);

    // Persistence: Save Registry on Change
    useEffect(() => {
        if (typeof window !== 'undefined' && registry.length > 0) {
            localStorage.setItem('foundry_registry', JSON.stringify(registry));
        } else if (registry.length === 0 && typeof window !== 'undefined') {
            // Optional: Clear storage if empty, or keep it empty array. 
            // Keeping it avoids 'null' issues but overwrites history if intentional delete.
            localStorage.setItem('foundry_registry', JSON.stringify([]));
        }
    }, [registry]);

    // Helper: Map ID to Theme
    const getTheme = (mapId: string): GeneratorTheme => {
        if (mapId.includes("underdark") || mapId.includes("arach") || mapId.includes("mines") || mapId.includes("tieg")) return "Underdark";
        if (mapId.includes("castle") || mapId.includes("catacombs") || mapId.includes("ossuary") || mapId.includes("heart")) return "Undead";
        if (mapId.includes("library") || mapId.includes("netheril") || mapId.includes("mind") || mapId.includes("beholder")) return "Arcane";
        if (mapId.includes("wards")) return "Construct";
        return "Surface";
    };

    const currentTheme = getTheme(selectedMapId);

    // Maps that enable Artifact/Sentient Item generation naturally
    const HIGH_LEVEL_MAPS = ["mind_flayer", "beholder", "arach", "netheril", "heart_chamber", "catacombs_despair", "ossuary"];
    const isHighLevel = HIGH_LEVEL_MAPS.some(id => selectedMapId.includes(id));

    const addToRegistry = (type: 'npc' | 'monster' | 'loot' | 'artifact', data: any) => {
        const newItem: RegistryItem = {
            id: Date.now(),
            type,
            name: data.name || "Unknown Item",
            data,
            timestamp: new Date()
        };
        setRegistry(prev => [newItem, ...prev]);
    };

    const deleteFromRegistry = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setRegistry(prev => prev.filter(item => item.id !== id));
    };

    const loadFromRegistry = (item: RegistryItem) => {
        setActiveTool(item.type);
        if (item.type === 'loot' || item.type === 'artifact') {
            setLootItem(item.data);
            setResult(null);
        } else {
            setResult(item.data);
            setLootItem(null);
        }
    };

    const handleGenerate = () => {
        setIsGenerating(true);

        // Simulating "Processing" delay for effect
        setTimeout(() => {
            if (activeTool === 'npc') {
                const sb = generateNPC(currentTheme);
                const n = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
                const t = NPC_TITLES[Math.floor(Math.random() * NPC_TITLES.length)];
                sb.name = `${n} ${t}`;
                const q = NPC_QUIRKS[Math.floor(Math.random() * NPC_QUIRKS.length)];
                sb.traits.push({ name: "Quirk", desc: q });
                setResult(sb);
                setLootItem(null);
                addToRegistry('npc', sb);
            } else if (activeTool === 'monster') {
                let pool = [...ALL_MONSTERS];

                // If Underdark/Drow context, inject Drow
                if (currentTheme === "Underdark" || selectedMapId.includes("arach")) {
                    const drowPool = DROW_MONSTERS as unknown as Statblock[];
                    pool = [...pool, ...drowPool];
                }

                const monster = pool[Math.floor(Math.random() * pool.length)];
                setResult(monster);
                setLootItem(null);
                addToRegistry('monster', monster);
            } else if (activeTool === 'loot') {
                const item = generateLootItem(currentTheme, isHighLevel);
                setLootItem(item);
                setResult(null);
                addToRegistry('loot', item);
            } else if (activeTool === 'artifact') {
                const item = generateArtifact(currentTheme);
                setLootItem(item);
                setResult(null);
                addToRegistry('artifact', item);
            }
            setIsGenerating(false);
        }, 600);
    };

    return (
        <div className="retro-container h-screen flex flex-col overflow-hidden bg-[#050505]">
            <CommandBar />

            <div className="flex flex-1 overflow-hidden relative">
                {/* 1. Left Sidebar */}
                <GeneratorSidebar
                    selectedMapId={selectedMapId}
                    onSelectMap={setSelectedMapId}
                    activeTool={activeTool}
                    onSelectTool={(t) => {
                        if (t !== 'register') {
                            setResult(null);
                            setLootItem(null);
                        }
                        setActiveTool(t);
                    }}
                />

                {/* 2. Main Content */}
                <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {/* Header Fixed Area */}
                    <div className="flex justify-between items-end border-b-2 border-[#a32222]/30 p-8 pb-4 shrink-0 bg-[#050505] z-10">
                        <div>
                            <h2 className="text-[#a32222] font-header text-xl tracking-[0.2em]">THE FOUNDRY</h2>
                        </div>

                        {activeTool !== 'register' && (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className={`
                                    px-8 py-3 bg-[#a32222] text-[#e0e0e0] font-header tracking-widest uppercase text-sm
                                    border border-[#ff4444] shadow-[0_0_15px_rgba(163,34,34,0.4)]
                                    hover:bg-[#c42828] hover:shadow-[0_0_25px_rgba(163,34,34,0.6)] hover:scale-105
                                    active:scale-95 transition-all
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {isGenerating ? 'PROCESSING...' : 'GENERATE'}
                            </button>
                        )}
                    </div>

                    {/* Result Display - Relaxed & Scrollable */}
                    <div className="flex-1 overflow-auto custom-scrollbar p-8 flex items-start justify-center">
                        <div className="w-full max-w-5xl min-h-[500px] border border-[#222] bg-[#0a0a0a] p-8 relative shadow-inner flex flex-col items-center">

                            {isGenerating ? (
                                <div className="text-center animate-pulse my-auto">
                                    <div className="text-[#a32222] font-header text-2xl tracking-[0.5em] mb-4">ACCESSING ARCHIVES</div>
                                    <div className="w-64 h-1 bg-[#222] mx-auto rounded overflow-hidden">
                                        <div className="h-full bg-[#a32222] w-1/2 animate-slide-right"></div>
                                    </div>
                                    <div className="font-mono text-[10px] text-[#444] mt-2 uppercase">Please wait...</div>
                                </div>
                            ) : activeTool === 'register' ? (
                                // REGISTER VIEW
                                <div className="w-full flex flex-col gap-2">
                                    {registry.length === 0 ? (
                                        <div className="text-center text-[#444] font-mono mt-10">NO ITEMS IN REGISTER</div>
                                    ) : (
                                        registry.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => loadFromRegistry(item)}
                                                className="group flex flex-col p-4 border border-[#333] bg-[#111] hover:bg-[#1a1a1a] cursor-pointer transition-colors gap-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[10px] font-mono uppercase px-2 py-1 border ${item.type === 'loot' ? 'border-[#ffd700] text-[#ffd700]' :
                                                            item.type === 'artifact' ? 'border-[#ff00ff] text-[#ff00ff]' :
                                                                'border-[#a32222] text-[#a32222]'
                                                            }`}>
                                                            {item.type}
                                                        </span>
                                                        <span className="text-[#ccc] font-medium tracking-wide text-lg">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] text-[#555] font-mono">{item.timestamp.toLocaleTimeString()}</span>
                                                        <button
                                                            onClick={(e) => deleteFromRegistry(item.id, e)}
                                                            className="text-[#444] hover:text-red-500 transition-colors p-2"
                                                            title="Delete from Register"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Details Section */}
                                                {(item.type === 'loot' || item.type === 'artifact') && (
                                                    <div className="pl-[calc(2rem-2px)] border-l border-[#333] ml-2 mt-2 space-y-2">
                                                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
                                                            {item.data.rarity && <span className="text-[#a32222]">{item.data.rarity}</span>}
                                                            {item.data.type && <span className="text-[#666]">// {item.data.type}</span>}
                                                            {item.data.cost && <span className="text-[#444]">// Value: {item.data.cost}</span>}
                                                        </div>

                                                        {item.data.properties && item.data.properties.length > 0 && (
                                                            <div className="text-xs text-[#888] font-mono">
                                                                <span className="text-[#555]">PROPERTIES: </span>
                                                                {item.data.properties.join(", ")}
                                                            </div>
                                                        )}

                                                        {item.data.effect && (
                                                            <div className="text-sm text-[#aaa] font-serif italic leading-relaxed">
                                                                "{item.data.effect}"
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : result ? (
                                <div className="w-full animate-fade-in">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#333] w-full">
                                        <div className="font-mono text-[10px] text-[#666]"></div>
                                        <div className="no-print"><PrintButton /></div>
                                    </div>
                                    {/* Statblock container with min-width to prevent squishing */}
                                    <div className="min-w-[600px] mx-auto">
                                        <StatblockCard data={result} />
                                    </div>
                                </div>
                            ) : lootItem ? (
                                <div className="w-full max-w-lg animate-fade-in relative my-auto">
                                    <div className="absolute -top-10 right-0 no-print z-10">
                                        <PrintButton />
                                    </div>
                                    <LootCard item={lootItem} />
                                </div>
                            ) : (
                                <div className="text-center opacity-20 select-none pointer-events-none my-auto">
                                    <div className="text-6xl mb-4 font-mono text-[#333]">+</div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

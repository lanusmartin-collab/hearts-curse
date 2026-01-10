"use client";

import { useState } from "react";
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

export default function GeneratorsPage() {
    const [result, setResult] = useState<Statblock | null>(null);
    const [lootItem, setLootItem] = useState<ShopItem | null>(null);
    const [selectedMapId, setSelectedMapId] = useState<string>("oakhaven");
    const [activeTool, setActiveTool] = useState<'npc' | 'monster' | 'loot' | 'artifact'>('loot');
    const [isGenerating, setIsGenerating] = useState(false);

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
            } else if (activeTool === 'loot') {
                setLootItem(generateLootItem(currentTheme, isHighLevel));
                setResult(null);
            } else if (activeTool === 'artifact') {
                setLootItem(generateArtifact(currentTheme));
                setResult(null);
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
                    onSelectTool={(t) => { setActiveTool(t); setResult(null); setLootItem(null); }}
                />

                {/* 2. Main Content */}
                <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {/* Header Fixed Area */}
                    <div className="flex justify-between items-end border-b-2 border-[#a32222]/30 p-8 pb-4 shrink-0 bg-[#050505] z-10">
                        <div>
                            <h2 className="text-3xl font-header tracking-wider text-[#e0e0e0] mb-1">
                                {activeTool === 'npc' && 'PERSONA FABRICATOR'}
                                {activeTool === 'monster' && 'ADVERSARY SIMULATOR'}
                                {activeTool === 'loot' && 'TREASURE MATRIX'}
                                {activeTool === 'artifact' && 'RELIC SYNTHESIZER'}
                            </h2>
                            <p className="font-mono text-[10px] text-[#666] uppercase tracking-[0.2em]">
                                Context: <span className="text-[#a32222]">{currentTheme.toUpperCase()}</span> // Source: {selectedMapId.replace(/_/g, " ").toUpperCase()}
                            </p>
                        </div>

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
                            {isGenerating ? 'PROCESSING...' : 'INITIATE SEQUENCE'}
                        </button>
                    </div>

                    {/* Result Display - Relaxed & Scrollable */}
                    <div className="flex-1 overflow-auto custom-scrollbar p-8 flex items-start justify-center">
                        {/* Removed max-w-2xl constraint, added min-width to prevent squish */}
                        <div className="w-full max-w-5xl min-h-[500px] border border-[#222] bg-[#0a0a0a] p-8 relative shadow-inner flex flex-col items-center">

                            {isGenerating ? (
                                <div className="text-center animate-pulse my-auto">
                                    <div className="text-[#a32222] font-header text-2xl tracking-[0.5em] mb-4">ACCESSING ARCHIVES</div>
                                    <div className="w-64 h-1 bg-[#222] mx-auto rounded overflow-hidden">
                                        <div className="h-full bg-[#a32222] w-1/2 animate-slide-right"></div>
                                    </div>
                                    <div className="font-mono text-[10px] text-[#444] mt-2 uppercase">Please wait...</div>
                                </div>
                            ) : result ? (
                                <div className="w-full animate-fade-in">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#333] w-full">
                                        <div className="font-mono text-[10px] text-[#666]">RESULT_OUTPUT_LOG</div>
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
                                    <p className="font-header text-xl tracking-[0.3em] uppercase mb-2">Awaiting Input</p>
                                    <p className="font-mono text-[10px] uppercase tracking-widest">Select Context & Initiate Generation</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

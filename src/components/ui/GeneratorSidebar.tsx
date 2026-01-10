"use client";

import { Map as MapIcon, Box, Skull, User, Sword, Shield, Scroll, Ghost } from "lucide-react";
import { CAMPAIGN_MAPS } from "@/lib/data/maps";

type GeneratorSidebarProps = {
    selectedMapId: string;
    onSelectMap: (id: string) => void;
    activeTool: 'npc' | 'monster' | 'loot' | 'artifact';
    onSelectTool: (tool: 'npc' | 'monster' | 'loot' | 'artifact') => void;
};

export default function GeneratorSidebar({ selectedMapId, onSelectMap, activeTool, onSelectTool }: GeneratorSidebarProps) {

    // Group Maps by Region for better organization
    const regions = {
        "Oakhaven Region": CAMPAIGN_MAPS.filter(m => !m.id.includes("underdark") && !m.id.includes("mind") && !m.id.includes("netheril")),
        "The Underdark": CAMPAIGN_MAPS.filter(m => m.id.includes("underdark") || m.id.includes("arach") || m.id.includes("deep")),
        "Ancient Ruins": CAMPAIGN_MAPS.filter(m => m.id.includes("netheril") || m.id.includes("library") || m.id.includes("crypt")),
    };

    return (
        <div className="grimoire-sidebar w-[300px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#222] bg-[#0c0c0c] h-full shadow-2xl">
            {/* Header */}
            <div className="grimoire-header p-6 border-b border-[#222]">
                <h3 className="grimoire-title text-base text-[#a32222] font-header tracking-[0.25em] mb-2 text-center">
                    THE FOUNDRY
                </h3>
                <p className="text-[#555] font-mono text-[9px] uppercase tracking-widest text-center">fabrication matrix v5.1</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">

                {/* 1. Context Selection */}
                <div className="p-4 border-b border-[#222]">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <MapIcon className="w-3 h-3 text-[#a32222]" />
                        <h4 className="text-[#888] font-header text-xs tracking-widest uppercase">Context Source</h4>
                    </div>

                    <div className="px-2">
                        <div className="relative">
                            <select
                                value={selectedMapId}
                                onChange={(e) => onSelectMap(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] text-[#ccc] text-[10px] font-mono uppercase tracking-wider py-2 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#a32222] transition-colors rounded-none"
                            >
                                {Object.entries(regions).map(([regionName, maps]) => maps.length > 0 && (
                                    <optgroup key={regionName} label={regionName} className="bg-[#111] text-[#a32222] font-header normal-case font-bold">
                                        {maps.map(map => (
                                            <option key={map.id} value={map.id} className="text-[#ccc] bg-[#222] font-mono pl-4">
                                                {map.title}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                                {CAMPAIGN_MAPS.filter(m => !Object.values(regions).flat().includes(m)).length > 0 && (
                                    <optgroup label="Other Locations" className="bg-[#111] text-[#a32222]">
                                        {CAMPAIGN_MAPS.filter(m => !Object.values(regions).flat().includes(m)).map(map => (
                                            <option key={map.id} value={map.id} className="text-[#ccc] bg-[#222]">
                                                {map.title}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                            {/* Custom Arrow Icon */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 6L0 0H10L5 6Z" fill="#666" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Tool Selection */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Box className="w-3 h-3 text-[#a32222]" />
                        <h4 className="text-[#888] font-header text-xs tracking-widest uppercase">Fabrication Type</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <button
                            onClick={() => onSelectTool('loot')}
                            className={`p-3 border flex items-center gap-3 transition-all group ${activeTool === 'loot' ? 'bg-[#1a0505] border-[#a32222] shadow-[0_0_10px_rgba(163,34,34,0.2)]' : 'bg-[#111] border-[#333] hover:border-[#666]'}`}
                        >
                            <div className={`p-2 rounded-full border ${activeTool === 'loot' ? 'bg-[#a32222] border-[#ff4444]' : 'bg-[#222] border-[#444]'}`}>
                                <Shield className={`w-4 h-4 ${activeTool === 'loot' ? 'text-white' : 'text-[#666]'}`} />
                            </div>
                            <div className="text-left">
                                <div className={`font-header text-sm tracking-wider ${activeTool === 'loot' ? 'text-[#e0e0e0] text-shadow-glow' : 'text-[#888]'}`}>TREASURE</div>
                                <div className="text-[9px] text-[#555] font-mono uppercase">Loot & Rewards</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onSelectTool('npc')}
                            className={`p-3 border flex items-center gap-3 transition-all group ${activeTool === 'npc' ? 'bg-[#1a0505] border-[#a32222] shadow-[0_0_10px_rgba(163,34,34,0.2)]' : 'bg-[#111] border-[#333] hover:border-[#666]'}`}
                        >
                            <div className={`p-2 rounded-full border ${activeTool === 'npc' ? 'bg-[#a32222] border-[#ff4444]' : 'bg-[#222] border-[#444]'}`}>
                                <User className={`w-4 h-4 ${activeTool === 'npc' ? 'text-white' : 'text-[#666]'}`} />
                            </div>
                            <div className="text-left">
                                <div className={`font-header text-sm tracking-wider ${activeTool === 'npc' ? 'text-[#e0e0e0] text-shadow-glow' : 'text-[#888]'}`}>CHARACTER</div>
                                <div className="text-[9px] text-[#555] font-mono uppercase">NPC Generator</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onSelectTool('monster')}
                            className={`p-3 border flex items-center gap-3 transition-all group ${activeTool === 'monster' ? 'bg-[#1a0505] border-[#a32222] shadow-[0_0_10px_rgba(163,34,34,0.2)]' : 'bg-[#111] border-[#333] hover:border-[#666]'}`}
                        >
                            <div className={`p-2 rounded-full border ${activeTool === 'monster' ? 'bg-[#a32222] border-[#ff4444]' : 'bg-[#222] border-[#444]'}`}>
                                <Ghost className={`w-4 h-4 ${activeTool === 'monster' ? 'text-white' : 'text-[#666]'}`} />
                            </div>
                            <div className="text-left">
                                <div className={`font-header text-sm tracking-wider ${activeTool === 'monster' ? 'text-[#e0e0e0] text-shadow-glow' : 'text-[#888]'}`}>ADVERSARY</div>
                                <div className="text-[9px] text-[#555] font-mono uppercase">Monster / Foe</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onSelectTool('artifact')}
                            className={`p-3 border flex items-center gap-3 transition-all group ${activeTool === 'artifact' ? 'bg-[#331a00] border-[#ffaa00] shadow-[0_0_10px_rgba(255,170,0,0.2)]' : 'bg-[#111] border-[#333] hover:border-[#666]'}`}
                        >
                            <div className={`p-2 rounded-full border ${activeTool === 'artifact' ? 'bg-[#ffaa00] border-[#ffeebb]' : 'bg-[#222] border-[#444]'}`}>
                                <Scroll className={`w-4 h-4 ${activeTool === 'artifact' ? 'text-black' : 'text-[#666]'}`} />
                            </div>
                            <div className="text-left">
                                <div className={`font-header text-sm tracking-wider ${activeTool === 'artifact' ? 'text-[#ffcc00] text-shadow-glow' : 'text-[#888]'}`}>ARTIFACT</div>
                                <div className="text-[9px] text-[#555] font-mono uppercase">Legendary Item</div>
                            </div>
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer / Status */}
            <div className="p-4 border-t border-[#222] bg-[#080808]">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#444]">
                    <span>SYSTEM STATUS</span>
                    <span className="text-[#a32222] animate-pulse">● ONLINE</span>
                </div>
            </div>
        </div>
    );
}

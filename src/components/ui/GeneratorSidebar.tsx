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

                    <div className="space-y-4">
                        {Object.entries(regions).map(([regionName, maps]) => maps.length > 0 && (
                            <div key={regionName}>
                                <h5 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em] mb-2 pl-2">{regionName}</h5>
                                <div className="space-y-1">
                                    {maps.map(map => (
                                        <button
                                            key={map.id}
                                            onClick={() => onSelectMap(map.id)}
                                            className={`
                                                w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-mono border-l-2 transition-all
                                                ${selectedMapId === map.id
                                                    ? 'border-[#a32222] bg-[#a32222]/10 text-[#e0e0e0]'
                                                    : 'border-transparent text-[#666] hover:text-[#ccc] hover:bg-[#111]'}
                                            `}
                                        >
                                            {map.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {/* Fallback for unassigned maps */}
                        {CAMPAIGN_MAPS.filter(m => !Object.values(regions).flat().includes(m)).length > 0 && (
                            <div className="mt-4">
                                <h5 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em] mb-2 pl-2">Other Locations</h5>
                                {CAMPAIGN_MAPS.filter(m => !Object.values(regions).flat().includes(m)).map(map => (
                                    <button
                                        key={map.id}
                                        onClick={() => onSelectMap(map.id)}
                                        className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-wider font-mono border-l-2 transition-all ${selectedMapId === map.id ? 'border-[#a32222] bg-[#a32222]/10 text-[#e0e0e0]' : 'border-transparent text-[#666] hover:text-[#ccc] hover:bg-[#111]'}`}
                                    >
                                        {map.title}
                                    </button>
                                ))}
                            </div>
                        )}
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

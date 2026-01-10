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
        <div className="grimoire-sidebar w-auto min-w-[200px] max-w-[300px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#222] bg-[#0c0c0c] h-full shadow-2xl">
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

                    <div className="grid grid-cols-1 gap-1">
                        <button
                            onClick={() => onSelectTool('loot')}
                            className={`grimoire-item ${activeTool === 'loot' ? 'active' : ''}`}
                        >
                            <Shield className="w-4 h-4 text-[#666]" />
                            <span>TREASURE</span>
                        </button>

                        <button
                            onClick={() => onSelectTool('npc')}
                            className={`grimoire-item ${activeTool === 'npc' ? 'active' : ''}`}
                        >
                            <User className="w-4 h-4 text-[#666]" />
                            <span>CHARACTER</span>
                        </button>

                        <button
                            onClick={() => onSelectTool('monster')}
                            className={`grimoire-item ${activeTool === 'monster' ? 'active' : ''}`}
                        >
                            <Ghost className="w-4 h-4 text-[#666]" />
                            <span>ADVERSARY</span>
                        </button>

                        <button
                            onClick={() => onSelectTool('artifact')}
                            className={`grimoire-item ${activeTool === 'artifact' ? 'active' : ''}`}
                        >
                            <Scroll className="w-4 h-4 text-[#666]" />
                            <span>ARTIFACT</span>
                        </button>
                    </div>
                </div>

            </div>


        </div>
    );
}

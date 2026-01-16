"use client";

import { Map as MapIcon, Box, Skull, User, Sword, Shield, Scroll, Ghost, ClipboardList, Coins } from "lucide-react";
import { CAMPAIGN_MAPS } from "@/lib/data/maps";

type GeneratorSidebarProps = {
    selectedMapId: string;
    onSelectMap: (id: string) => void;
    activeTool: 'npc' | 'monster' | 'loot' | 'artifact' | 'hoard' | 'register';
    onSelectTool: (tool: 'npc' | 'monster' | 'loot' | 'artifact' | 'hoard' | 'register') => void;
    isOpen?: boolean;
    onClose?: () => void;
};

export default function GeneratorSidebar({ selectedMapId, onSelectMap, activeTool, onSelectTool, isOpen, onClose }: GeneratorSidebarProps) {

    // Group Maps by Region for better organization
    const regions = {
        "Oakhaven Region": CAMPAIGN_MAPS.filter(m => !m.id.includes("underdark") && !m.id.includes("mind") && !m.id.includes("netheril")),
        "The Underdark": CAMPAIGN_MAPS.filter(m => m.id.includes("underdark") || m.id.includes("arach") || m.id.includes("deep")),
        "Ancient Ruins": CAMPAIGN_MAPS.filter(m => m.id.includes("netheril") || m.id.includes("library") || m.id.includes("crypt")),
    };

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm animate-fade-in"
                    onClick={onClose}
                />
            )}

            <div className={`
                grimoire-sidebar w-auto min-w-[200px] max-w-[300px] flex flex-col shrink-0 overflow-hidden 
                bg-[#080808] h-full shadow-[5px_0_30px_rgba(0,0,0,0.8)] border-r border-[#222]
                fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
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
                                className={`grimoire-item animate-heartbeat ${activeTool === 'loot' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                            >
                                <Shield className={`w-4 h-4 ${activeTool === 'loot' ? 'text-[#a32222]' : 'text-[#444]'}`} />
                                <span>TREASURE</span>
                            </button>

                            <button
                                onClick={() => onSelectTool('hoard')}
                                className={`grimoire-item animate-heartbeat ${activeTool === 'hoard' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                                style={{ animationDelay: '0.1s' }}
                            >
                                <Coins className={`w-4 h-4 ${activeTool === 'hoard' ? 'text-[#ffd700]' : 'text-[#444]'}`} />
                                <span>TREASURE HOARD</span>
                            </button>

                            <button
                                onClick={() => onSelectTool('npc')}
                                className={`grimoire-item animate-heartbeat ${activeTool === 'npc' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                                style={{ animationDelay: '0.2s' }}
                            >
                                <User className={`w-4 h-4 ${activeTool === 'npc' ? 'text-[#a32222]' : 'text-[#444]'}`} />
                                <span>CHARACTER</span>
                            </button>

                            <button
                                onClick={() => onSelectTool('monster')}
                                className={`grimoire-item animate-heartbeat ${activeTool === 'monster' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                                style={{ animationDelay: '0.4s' }}
                            >
                                <Ghost className={`w-4 h-4 ${activeTool === 'monster' ? 'text-[#a32222]' : 'text-[#444]'}`} />
                                <span>ADVERSARY</span>
                            </button>

                            <button
                                onClick={() => onSelectTool('artifact')}
                                className={`grimoire-item animate-heartbeat ${activeTool === 'artifact' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                                style={{ animationDelay: '0.6s' }}
                            >
                                <Scroll className={`w-4 h-4 ${activeTool === 'artifact' ? 'text-[#a32222]' : 'text-[#444]'}`} />
                                <span>ARTIFACT</span>
                            </button>

                            <div className="h-px bg-[#222] my-2"></div>

                            <button
                                onClick={() => onSelectTool('register')}
                                className={`grimoire-item animate-heartbeat ${activeTool === 'register' ? 'active !bg-[#1a0505] !border-l-2 !border-[#a32222] !text-[#ddd]' : ''}`}
                                style={{ animationDelay: '0.8s' }}
                            >
                                <ClipboardList className={`w-4 h-4 ${activeTool === 'register' ? 'text-[#a32222]' : 'text-[#444]'}`} />
                                <span>REGISTER</span>
                            </button>
                        </div>
                    </div>

                </div>


            </div>
        </>
    );
}

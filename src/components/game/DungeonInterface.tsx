import React, { useState } from 'react';
import { Shield, Eye, Footprints, Skull, AlertTriangle, Search } from 'lucide-react';
import { MapNode } from '@/lib/data/maps';

interface DungeonInterfaceProps {
    node: MapNode;
    onExplore: () => void;
    onSkillCheck: (skill: string) => void;
    threatLevel?: "low" | "medium" | "high";
    darknessLevel?: "dim" | "dark" | "magical";
}

export default function DungeonInterface({ node, onExplore, onSkillCheck, threatLevel = "medium", darknessLevel = "dim" }: DungeonInterfaceProps) {
    const [actionLog, setActionLog] = useState<string[]>([]);

    // Simulate action result for UI feedback before sending to parent
    const handleAction = (skill: string) => {
        setActionLog(prev => [`> Attempting ${skill}...`, ...prev.slice(0, 3)]);
        onSkillCheck(skill);
    };

    return (
        <div className="h-48 border-t-2 border-[#333] bg-[#0c0a0a] flex flex-col relative overflow-hidden">
            {/* ATMOSPHERE OVERLAY */}
            <div className={`absolute inset-0 pointer-events-none opacity-20 ${threatLevel === 'high' ? 'bg-red-900/20' :
                    threatLevel === 'medium' ? 'bg-yellow-900/10' : ''
                }`}></div>

            <div className="flex h-full">
                {/* LEFT: ACTIONS */}
                <div className="w-2/3 p-2 grid grid-cols-2 gap-2 z-10">
                    <button
                        onClick={() => handleAction('Search')}
                        className="group relative flex items-center justify-center gap-2 border border-[#333] bg-[#111] hover:bg-[#222] hover:border-[#555] transition-all"
                    >
                        <Search className="w-4 h-4 text-blue-500 group-hover:text-blue-400" />
                        <span className="text-xs uppercase font-bold text-gray-400 group-hover:text-white">Search Area (Inv)</span>
                    </button>

                    <button
                        onClick={() => handleAction('Stealth')}
                        className="group relative flex items-center justify-center gap-2 border border-[#333] bg-[#111] hover:bg-[#222] hover:border-[#555] transition-all"
                    >
                        <Footprints className="w-4 h-4 text-green-500 group-hover:text-green-400" />
                        <span className="text-xs uppercase font-bold text-gray-400 group-hover:text-white">Sneak (Stealth)</span>
                    </button>

                    <button
                        onClick={() => handleAction('Disarm')}
                        className="group relative flex items-center justify-center gap-2 border border-[#333] bg-[#111] hover:bg-[#222] hover:border-[#555] transition-all"
                    >
                        <Shield className="w-4 h-4 text-orange-500 group-hover:text-orange-400" />
                        <span className="text-xs uppercase font-bold text-gray-400 group-hover:text-white">Check Traps (Perc)</span>
                    </button>

                    <button
                        onClick={onExplore}
                        className="group relative flex items-center justify-center gap-2 border border-red-900/50 bg-[#1a0505] hover:bg-red-900/20 hover:border-red-500 transition-all shadow-[0_0_10px_rgba(255,0,0,0.1)] hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                    >
                        <Skull className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-xs uppercase font-bold text-red-500 group-hover:text-white">Advance (Risk)</span>
                    </button>
                </div>

                {/* RIGHT: STATUS */}
                <div className="w-1/3 border-l border-[#333] p-3 flex flex-col gap-2 z-10 bg-[#080808]">
                    {/* THREAT METER */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] uppercase text-gray-500 tracking-wider">Threat Level</span>
                            {threatLevel === 'high' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        </div>
                        <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${threatLevel === 'low' ? 'w-1/3 bg-green-700' :
                                    threatLevel === 'medium' ? 'w-2/3 bg-yellow-700' :
                                        'w-full bg-red-600 animate-pulse'
                                }`}></div>
                        </div>
                        <div className="text-[10px] text-right mt-1 font-mono text-gray-400 capitalize">
                            {threatLevel} Alert
                        </div>
                    </div>

                    {/* DARKNESS */}
                    <div className="mt-auto flex items-center gap-2 text-[10px] text-gray-500 border border-[#222] p-1 rounded bg-[#050505]">
                        <Eye className="w-3 h-3" />
                        <span>Vis: {darknessLevel.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

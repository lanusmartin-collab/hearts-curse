"use client";

import React from "react";
import { useGameContext } from "@/lib/context/GameContext";
import { Users, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";

export default function FactionManager() {
    const { factions, setFactionReputation } = useGameContext();

    const FACTION_META: Record<string, { label: string, color: string }> = {
        zhentarim: { label: "The Zhentarim", color: "text-amber-500" },
        thay: { label: "Red Wizards", color: "text-red-600" },
        coalition: { label: "Heroes' Coalition", color: "text-blue-400" },
        drow: { label: "House Baenre", color: "text-purple-400" },
        larloch: { label: "The Shadow Court", color: "text-stone-500" },
    };

    const getStanding = (val: number) => {
        if (val <= 10) return { text: "Nemesis", color: "text-red-700" };
        if (val <= 30) return { text: "Hostile", color: "text-red-500" };
        if (val <= 45) return { text: "Unfriendly", color: "text-orange-500" };
        if (val <= 55) return { text: "Neutral", color: "text-gray-400" };
        if (val <= 70) return { text: "Friendly", color: "text-green-400" };
        if (val <= 90) return { text: "Ally", color: "text-green-500" };
        return { text: "Exalted", color: "text-cyan-400" };
    };

    return (
        <div className="bg-[#111] border border-[#333] p-4 w-80 shadow-2xl rounded-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4 border-b border-[#333] pb-2">
                <Users size={18} className="text-gray-400" />
                <h3 className="text-sm uppercase font-bold text-gray-200 tracking-widest">Faction Politics</h3>
            </div>

            <div className="space-y-6">
                {Object.entries(factions).map(([id, val]) => {
                    const meta = FACTION_META[id] || { label: id, color: "text-gray-500" };
                    const standing = getStanding(val);

                    return (
                        <div key={id} className="space-y-1">
                            {/* Header */}
                            <div className="flex justify-between items-end">
                                <span className={`text-xs font-bold uppercase ${meta.color}`}>{meta.label}</span>
                                <span className={`text-[10px] uppercase font-mono ${standing.color}`}>{standing.text} ({val})</span>
                            </div>

                            {/* Slider Control */}
                            <div className="relative h-6 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={val}
                                    onChange={(e) => setFactionReputation(id, parseInt(e.target.value))}
                                    className="w-full h-1 bg-[#222] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 transition-all"
                                />

                                {/* Market Consequence Indicator */}
                                {id === 'zhentarim' && val < 20 && (
                                    <div className="absolute -right-4 top-0" title="Market Markup: 200%">
                                        <TrendingUp size={12} className="text-red-500 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-2 border-t border-[#333] text-[10px] text-gray-600 font-mono italic text-center">
                *Dragging sliders affects global shop prices and encounter aggression.
            </div>
        </div>
    );
}

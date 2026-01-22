"use client";

import React from "react";
import { Swords, Skull } from "lucide-react";
import { Combatant } from "@/types/combat";

interface InitiativeTrackerProps {
    combatants: Combatant[];
    turnIndex: number;
}

export default function InitiativeTracker({ combatants, turnIndex }: InitiativeTrackerProps) {
    return (
        <div className="h-16 bg-[#111] border-b border-[#333] flex items-center px-6 gap-4 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-2 shrink-0 border-r border-[#333] pr-4">
                <Swords className="text-[#a32222]" />
                <span className="font-bold uppercase tracking-widest text-[#a32222] hidden md:inline">Turn Order</span>
            </div>

            <div className="flex gap-2">
                {combatants.map((c, i) => {
                    const isCurrent = i === turnIndex;
                    const isDead = c.hp <= 0;

                    return (
                        <div
                            key={c.id}
                            className={`
                                relative px-3 py-1 flex flex-col items-center min-w-[80px] border transition-all duration-300
                                ${isCurrent ? 'bg-[#a32222] border-white scale-110 z-10 shadow-[0_0_10px_rgba(163,34,34,0.5)]' : 'bg-[#1a1a1a] border-[#333] opacity-70 scale-100'}
                                ${isDead ? 'grayscale opacity-30' : ''}
                            `}
                        >
                            <span className="text-xs font-bold truncate max-w-[70px]">{c.name}</span>
                            <div className="flex items-center gap-1">
                                {isDead && <Skull className="w-3 h-3 text-gray-500" />}
                                <span className={`text-[10px] ${c.hp < c.maxHp * 0.3 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                    {c.hp > 0 ? `${c.hp} HP` : 'DEAD'}
                                </span>
                            </div>

                            {/* Init Value Tag */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-black border border-[#333] rounded-full text-[8px] flex items-center justify-center text-gray-500">
                                {c.initiative}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

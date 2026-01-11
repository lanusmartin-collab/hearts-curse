"use client";

import React, { useState, useEffect } from 'react';
import { getCurseStage, getRegionalEffect, rollWildMagic } from '@/lib/game/curseLogic';

type Props = {
    currentMapId: string;
    onRoll?: (result: string) => void;
};

export function MechanicsDashboard({ currentMapId, onRoll }: Props) {
    const [days, setDays] = useState(1);
    const [wildMagicResult, setWildMagicResult] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Sync with LocalStorage and CurseTracker
    useEffect(() => {
        const loadDays = () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('curse_days');
                if (saved) setDays(parseInt(saved, 10));
            }
        };
        loadDays(); // Initial load
        window.addEventListener('storage', loadDays);
        window.addEventListener('curse-update', loadDays);
        return () => {
            window.removeEventListener('storage', loadDays);
            window.removeEventListener('curse-update', loadDays);
        };
    }, []);

    const updateDays = (newDays: number) => {
        const val = Math.max(0, newDays);
        setDays(val);
        if (typeof window !== 'undefined') {
            localStorage.setItem('curse_days', val.toString());
            window.dispatchEvent(new Event('curse-update'));
        }
    };

    const curseStage = getCurseStage(days);
    const regionalEffect = getRegionalEffect(currentMapId);

    const handleWildMagic = () => {
        const { roll, result } = rollWildMagic();
        const text = `[Wild Magic Roll: ${roll}] ${result}`;
        setWildMagicResult(text);
        if (onRoll) onRoll(text);
    };

    if (!isExpanded) {
        return (
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="bg-black/80 text-red-500 border border-red-900 px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-red-900/20 transition-all flex items-center gap-2"
                >
                    <span className="animate-pulse">❤️</span> Heart&apos;s Curse: Level {days}
                </button>
            </div>
        );
    }

    return (
        <div className="absolute top-4 left-4 z-50 w-[320px] bg-black/95 border-2 border-red-900 shadow-[0_0_20px_rgba(255,0,0,0.2)] text-gray-300 font-mono text-xs overflow-hidden rounded-sm animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="bg-red-900/20 p-3 flex justify-between items-center border-b border-red-900/50">
                <h3 className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="text-lg">❤️</span> Pathalogy Report
                </h3>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-red-500 hover:text-white"
                >
                    ▼
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Curse Tracker */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="uppercase text-gray-500">Infection Day</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateDays(days - 1)} className="hover:text-white px-1">[-]</button>
                            <span className="text-xl text-white font-bold">{days}</span>
                            <button onClick={() => updateDays(days + 1)} className="hover:text-white px-1">[+]</button>
                        </div>
                    </div>
                    <div className="bg-red-900/10 border border-red-900/30 p-2 rounded">
                        <div className="text-red-400 font-bold mb-1">{curseStage.name}</div>
                        <div className="text-gray-400 italic leading-tight">{curseStage.effect}</div>
                    </div>
                </div>

                {/* Regional Effect */}
                {regionalEffect && (
                    <div>
                        <div className="uppercase text-gray-500 mb-2 border-b border-gray-800 pb-1">Regional Hazard</div>
                        <div className="text-yellow-500 font-bold mb-1">{regionalEffect.title}</div>
                        <div className="text-gray-400 leading-tight mb-3">
                            {regionalEffect.description}
                        </div>

                        {/* Specific Triggers */}
                        {regionalEffect.title.includes("Wild Magic") && (
                            <button
                                onClick={handleWildMagic}
                                className="w-full bg-purple-900/30 border border-purple-500 text-purple-300 py-2 hover:bg-purple-900/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all uppercase tracking-wider"
                            >
                                🎲 Time to Roll
                            </button>
                        )}
                    </div>
                )}

                {/* Roll Result Console */}
                {wildMagicResult && (
                    <div className="mt-4 p-2 bg-black border border-purple-900/50 text-purple-200 font-mono text-[10px] leading-tight break-words">
                        {wildMagicResult}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-900 p-1 text-[10px] text-center text-gray-600 border-t border-gray-800">
                SYSTEM_MONITORING_VITALS...
            </div>
        </div>
    );
}

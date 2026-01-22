"use client";

import React, { useState, useEffect } from "react";
import { Clock, Skull, AlertOctagon } from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";

interface DoomGaugeProps {
    initialStage?: number;
    onStageChange?: (stage: number) => void;
}

export default function DoomGauge({ initialStage = 1, onStageChange }: DoomGaugeProps) {
    const [stage, setStage] = useState(initialStage);
    const { addToast } = useToast();

    const STAGES = [
        { level: 1, name: "The Mist", color: "text-gray-400", border: "border-gray-600", desc: "Passive. Visibility low." },
        { level: 2, name: "The Shadow", color: "text-amber-500", border: "border-amber-600", desc: "Enemies +1 AC. Shadows move." },
        { level: 3, name: "The Erasure", color: "text-red-500", border: "border-red-600", desc: "Enemies +1 ATK. NPCs forget you." },
        { level: 4, name: "The Void", color: "text-purple-500", border: "border-purple-600", desc: "Constant Psychic Dmg. Reality breaks." },
    ];

    const current = STAGES[stage - 1];

    const advanceDoom = () => {
        if (stage < 4) {
            setStage(prev => {
                const next = prev + 1;
                addToast(`DOOM ADVANCED: ${STAGES[next - 1].name}`, "error");
                if (onStageChange) onStageChange(next);
                return next;
            });
        }
    };

    const reduceDoom = () => {
        if (stage > 1) {
            setStage(prev => {
                const next = prev - 1;
                addToast(`DOOM REDUCED: ${STAGES[next - 1].name}`, "info");
                if (onStageChange) onStageChange(next);
                return next;
            });
        }
    };

    return (
        <div className="flex items-center gap-4 bg-black/80 px-4 py-1 border-x border-[#333]">
            {/* LABEL */}
            <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Details</span>
                <span className={`text-[10px] font-mono ${current.color}`}>{current.name}</span>
            </div>

            {/* GAUGE GRAPHIC */}
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(s => (
                    <div
                        key={s}
                        className={`w-2 h-6 rounded-sm transition-all duration-500
                            ${s <= stage ? (s === 4 ? 'bg-purple-600 animate-pulse' : s === 3 ? 'bg-red-600' : 'bg-amber-600') : 'bg-[#222]'}
                        `}
                    />
                ))}
            </div>

            {/* CONTROL BUTTON (DM ONLY) */}
            <button
                onClick={advanceDoom}
                onContextMenu={(e) => { e.preventDefault(); reduceDoom(); }}
                className={`flex items-center justify-center w-8 h-8 rounded border transition-all hover:scale-105 active:scale-95 ${current.border} bg-[#111]`}
                title="Left Click: Advance | Right Click: Reduce"
            >
                {stage === 4 ? <AlertOctagon size={16} className="text-purple-500 animate-spin-slow" /> : <Clock size={16} className={current.color} />}
            </button>
        </div>
    );
}

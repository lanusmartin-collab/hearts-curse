"use client";

import { useState } from "react";
import { AlertTriangle, Ghost, Shield, Zap, Skull, Wind, Thermometer, Droplets, ChevronDown, ChevronUp } from "lucide-react";

type MechanicsWidgetProps = {
    mechanics: string[];
    curseLevel?: "Low" | "Medium" | "High" | "Critical";
    faction?: string;
};

export default function RegionalMechanicsWidget({ mechanics, curseLevel = "Low", faction }: MechanicsWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if ((!mechanics || mechanics.length === 0) && !faction) return null;

    const getCurseColor = (level: string) => {
        switch (level) {
            case "Low": return "text-blue-400";
            case "Medium": return "text-yellow-400";
            case "High": return "text-orange-500";
            case "Critical": return "text-red-600 animate-pulse";
            default: return "text-gray-400";
        }
    };

    const getIcon = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes("magic") || lower.includes("spell")) return <Zap className="w-4 h-4 text-purple-400" />;
        if (lower.includes("fog") || lower.includes("vision")) return <Ghost className="w-4 h-4 text-gray-400" />;
        if (lower.includes("cold") || lower.includes("freeze")) return <Thermometer className="w-4 h-4 text-cyan-400" />;
        if (lower.includes("heat") || lower.includes("fire")) return <Thermometer className="w-4 h-4 text-orange-400" />;
        if (lower.includes("rain") || lower.includes("storm")) return <Droplets className="w-4 h-4 text-blue-400" />;
        if (lower.includes("wind")) return <Wind className="w-4 h-4 text-slate-300" />;
        if (lower.includes("undead") || lower.includes("necro")) return <Skull className="w-4 h-4 text-lime-400" />;
        if (lower.includes("guard") || lower.includes("watch")) return <Shield className="w-4 h-4 text-yellow-400" />;
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    };

    return (
        <div className="fixed top-20 right-6 z-30 w-72 pointer-events-none no-print">
            {/* Header / Toggle Button */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="glass-panel p-2 mb-1 border-l-4 border-red-900 bg-black/90 backdrop-blur-md pointer-events-auto cursor-pointer hover:border-red-500 transition-all shadow-lg rounded"
            >
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${curseLevel === 'Critical' ? 'bg-red-600 animate-ping' : 'bg-green-500'}`}></div>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-gray-300 font-mono font-bold">Regional Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold font-mono ${getCurseColor(curseLevel)}`}>
                            {curseLevel.toUpperCase()}
                        </span>
                        {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                </div>
            </div>

            {/* Mechanics List (Only when expanded) */}
            {isExpanded && (
                <div className="space-y-1.5 pointer-events-auto max-h-[60vh] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                    {mechanics.map((mech, i) => (
                        <div key={i} className="glass-panel p-2 flex gap-2.5 items-start bg-black/95 backdrop-blur-md border-l-2 border-red-900/60 hover:border-red-500 transition-colors shadow-lg rounded">
                            <div className="mt-0.5 shrink-0">
                                {getIcon(mech)}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-mono">
                                {mech}
                            </p>
                        </div>
                    ))}

                    {faction && (
                        <div className="glass-panel p-2 flex gap-2.5 items-center bg-black/95 backdrop-blur-md border-l-2 border-yellow-600/60 shadow-lg rounded">
                            <Shield className="w-4 h-4 text-yellow-500 shrink-0" />
                            <div>
                                <span className="text-[10px] text-gray-500 uppercase block">Controlling Faction</span>
                                <span className="text-xs text-yellow-100 font-bold tracking-wide">{faction}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { AlertTriangle, Ghost, Shield, Zap, Skull, Wind, Thermometer, Droplets } from "lucide-react";

type MechanicsWidgetProps = {
    mechanics: string[];
    curseLevel?: "Low" | "Medium" | "High" | "Critical";
    faction?: string;
};

export default function RegionalMechanicsWidget({ mechanics, curseLevel = "Low", faction }: MechanicsWidgetProps) {
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
        <div className="fixed top-24 left-6 z-40 w-72 pointer-events-none no-print">
            {/* Header / Title */}
            <div className="glass-panel p-1 mb-2 border-l-4 border-red-900 bg-black/80 backdrop-blur-sm pointer-events-auto">
                <div className="flex justify-between items-center px-2 py-1 border-b border-white/10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">Regional Status</span>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${curseLevel === 'Critical' ? 'bg-red-600 animate-ping' : 'bg-green-500'}`}></div>
                    </div>
                </div>

                {/* Curse Intensity */}
                <div className="flex items-center justify-between p-2">
                    <span className="text-xs font-serif text-gray-400 uppercase">Curse Intensity</span>
                    <span className={`text-sm font-bold font-mono ${getCurseColor(curseLevel)}`}>
                        {curseLevel.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Mechanics List */}
            <div className="space-y-2 pointer-events-auto">
                {mechanics.map((mech, i) => (
                    <div key={i} className="glass-panel p-2 flex gap-3 items-start bg-black/60 backdrop-blur-sm border-l-2 border-red-900/50 hover:border-red-500 transition-colors">
                        <div className="mt-1 shrink-0">
                            {getIcon(mech)}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-mono">
                            {mech}
                        </p>
                    </div>
                ))}

                {faction && (
                    <div className="glass-panel p-2 flex gap-3 items-center bg-black/60 backdrop-blur-sm border-l-2 border-yellow-600/50">
                        <Shield className="w-4 h-4 text-yellow-500" />
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase block">Controlling Faction</span>
                            <span className="text-xs text-yellow-100 font-bold tracking-wide">{faction}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


import { Combatant, ALL_CONDITIONS } from "@/types/combat";
import { useState } from "react";
import { Shield, Heart, Skull, Activity, MoreVertical, X, EyeOff, Zap } from "lucide-react";
import StatblockCard from "@/components/ui/StatblockCard";

interface CombatantCardProps {
    data: Combatant;
    onUpdate: (id: string, updates: Partial<Combatant>) => void;
    onRemove: (id: string) => void;
    onInspect: (id: string) => void;
    isActive: boolean;
    isInspected: boolean;
}

export default function CombatantCard({ data, onUpdate, onRemove, onInspect, isActive, isInspected }: CombatantCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showConditions, setShowConditions] = useState(false);

    const hpPercent = Math.min(100, Math.max(0, (data.hp / data.maxHp) * 100));
    const isDead = data.hp <= 0;
    const isBloodied = !isDead && hpPercent <= 50;

    const handleHpChange = (amount: number) => {
        const newHp = Math.min(data.maxHp, Math.max(0, data.hp + amount));
        onUpdate(data.id, { hp: newHp });
    };

    const toggleCondition = (condition: string) => {
        const newConditions = data.conditions.includes(condition)
            ? data.conditions.filter(c => c !== condition)
            : [...data.conditions, condition];
        onUpdate(data.id, { conditions: newConditions });
    };

    return (
        <div className={`
            relative flex flex-col transition-all duration-300 mb-2 overflow-visible
            ${isActive
                ? 'bg-gradient-to-r from-[#1a0505] to-[#0a0a0c] border-[#a32222] shadow-[0_0_20px_rgba(163,34,34,0.4)] border-l-4 z-10 scale-[1.02]'
                : 'bg-[#0a0a0c] border border-[#333] border-l-2 border-l-[#333] hover:border-[#555] opacity-90 hover:opacity-100'}
            ${isInspected ? 'border-r-4 border-r-[#d4af37]' : ''}
            ${isDead ? 'opacity-50 grayscale border-l-[#333]' : ''}
        `}>
            {/* Active Indicator Glow & Beating Heart */}
            {isActive && (
                <>
                    <div className="absolute inset-0 bg-[#a32222]/5 animate-pulse pointer-events-none"></div>
                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#a32222] blur-md animate-pulse rounded-full opacity-60"></div>
                            <Heart
                                fill="#a32222"
                                className="text-[#a32222] w-8 h-8 animate-heartbeat"
                                strokeWidth={0}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Main Bar */}
            <div className={`flex items-center p-3 gap-3 relative z-10 ${isDead ? 'line-through text-[#666]' : ''}`}>

                {/* Initiative Badge (Zap) */}
                <div className={`
                    flex flex-col items-center justify-center w-10 h-10 rounded border-2 shrink-0 transition-colors
                    ${isActive ? "border-[#ffd700] bg-[#2a1a05]" : "border-[#444] bg-[#222]"}
                `}>
                    <input
                        type="number"
                        value={data.initiative}
                        onChange={(e) => onUpdate(data.id, { initiative: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center bg-transparent font-mono text-lg font-bold focus:outline-none ${isActive ? 'text-[#ffd700]' : 'text-[#888]'}`}
                    />
                    {/* Tiny Icon underneath if space allows, or overlay */}
                </div>

                {/* Name & Conditions */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <span className={`font-header tracking-wider text-sm truncate ${isActive ? 'text-[#fff] text-shadow-sm font-bold' : 'text-[#ccc]'}`}>
                            {data.name}
                        </span>
                        {isDead && <Skull size={14} className="text-[#666]" />}
                    </div>

                    {/* Compact Conditions Line */}
                    <div className="flex flex-wrap gap-1 mt-1 min-h-[16px]">
                        {data.conditions.length > 0 ? (
                            data.conditions.map(c => (
                                <span key={c} className="flex items-center gap-0.5 text-[8px] px-1 py-0.5 bg-[#220a0a] border border-[#5c1212] text-[#ff6b6b] rounded-sm uppercase tracking-wider font-mono">
                                    <Skull size={8} /> {c}
                                </span>
                            ))
                        ) : isActive && !isDead ? (
                            <span className="text-[9px] text-[#444] italic">Concentrating...</span>
                        ) : null}
                    </div>
                </div>

                {/* HP & AC Controls */}
                <div className="flex items-center gap-2 shrink-0">

                    {/* Inspect Button */}
                    {data.statblock && (
                        <button
                            onClick={() => onInspect(data.id)}
                            className={`p-1.5 rounded transition-colors ${isInspected ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#666] hover:text-[#d4af37] hover:bg-[#222]'}`}
                            title="Inspect Statblock"
                        >
                            <MoreVertical size={14} />
                        </button>
                    )}

                    {/* AC */}
                    <div className="flex flex-col items-center justify-center group cursor-help w-8" title={`AC: ${data.ac}`}>
                        <Shield size={14} className={`mb-0.5 ${isActive ? 'text-[#4a9eff]' : 'text-[#555] group-hover:text-[#888]'}`} />
                        <span className="text-[9px] font-mono text-[#666] font-bold">{data.ac}</span>
                    </div>

                    {/* HP Mini-Controls */}
                    <div className="flex flex-col items-end gap-0.5 w-16">
                        <div className="flex items-center justify-between w-full bg-[#050505] border border-[#333] rounded-sm overflow-hidden h-5">
                            <button onClick={() => handleHpChange(-1)} className="text-[#666] hover:text-red-500 hover:bg-[#1a0505] px-1.5 h-full text-[10px] transition-colors">-</button>
                            <span className={`text-[10px] font-mono font-bold ${isBloodied ? 'text-orange-500' : isDead ? 'text-red-700' : 'text-green-500'}`}>
                                {data.hp}
                            </span>
                            <button onClick={() => handleHpChange(1)} className="text-[#666] hover:text-green-500 hover:bg-[#051a05] px-1.5 h-full text-[10px] transition-colors">+</button>
                        </div>
                        <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden border border-[#222]">
                            <div
                                className={`h-full transition-all duration-300 ${isBloodied ? 'bg-orange-600' : 'bg-[#2e7d32]'}`}
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-[#222] mx-1"></div>

                    {/* Expand/Delete */}
                    <div className="flex flex-col gap-1">
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1 hover:bg-[#222] rounded transition-colors ${isExpanded ? 'text-[#a32222] bg-[#a32222]/10' : 'text-[#666]'}`}>
                            <Activity size={12} />
                        </button>
                        <button onClick={() => onRemove(data.id)} className="p-1 hover:bg-[#2a0a0a] text-[#444] hover:text-red-500 rounded transition-colors">
                            <X size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Details - Status Effects Manager */}
            {isExpanded && (
                <div className="p-3 border-t border-[#222] bg-[#0c0c0c] animate-slide-down shadow-inner">
                    <div className="text-[9px] text-[#555] font-mono uppercase mb-2">Active Conditions</div>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_CONDITIONS.map(c => (
                            <button
                                key={c}
                                onClick={() => toggleCondition(c)}
                                className={`text-[9px] px-2 py-1 border rounded-sm uppercase tracking-wide transition-all ${data.conditions.includes(c) ? 'bg-[#5c1212] border-[#a32222] text-white shadow-[0_0_5px_rgba(163,34,34,0.4)]' : 'bg-[#111] border-[#333] text-[#666] hover:border-[#555] hover:text-[#999]'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

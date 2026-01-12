import { Combatant, ALL_CONDITIONS } from "@/types/combat";
import { useState } from "react";
import { Shield, Heart, Skull, Activity, MoreVertical, X, EyeOff } from "lucide-react";
import StatblockCard from "@/components/ui/StatblockCard";

interface CombatantCardProps {
    data: Combatant;
    onUpdate: (id: string, updates: Partial<Combatant>) => void;
    onRemove: (id: string) => void;
    isActive: boolean;
}

export default function CombatantCard({ data, onUpdate, onRemove, isActive }: CombatantCardProps) {
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
            relative flex flex-col transition-all duration-300 mb-2 overflow-hidden
            ${isActive
                ? 'bg-gradient-to-r from-[#1a0505] to-[#0a0a0c] border-[#a32222] shadow-[0_0_15px_rgba(163,34,34,0.2)] border-l-4'
                : 'bg-[#0a0a0c] border border-[#333] border-l-2 border-l-[#333] hover:border-[#555]'}
            ${isDead ? 'opacity-50 grayscale border-l-[#333]' : ''}
        `}>
            {/* Active Indicator Glow */}
            {isActive && <div className="absolute inset-0 bg-[#a32222]/5 animate-pulse pointer-events-none"></div>}

            {/* Main Bar */}
            <div className={`flex items-center p-3 gap-4 relative z-10 ${isDead ? 'line-through text-[#666]' : ''}`}>
                {/* Initiative Box */}
                <div className={`flex flex-col items-center justify-center w-12 h-12 border rounded-sm shrink-0 transition-colors ${isActive ? 'bg-[#2a0a0a] border-[#a32222]' : 'bg-[#111] border-[#333]'}`}>
                    <input
                        type="number"
                        value={data.initiative}
                        onChange={(e) => onUpdate(data.id, { initiative: parseInt(e.target.value) || 0 })}
                        className={`w-full h-full text-center bg-transparent font-mono text-xl font-bold focus:outline-none ${isActive ? 'text-[#ff4444]' : 'text-[#888]'}`}
                    />
                </div>

                {/* Name & Conditions */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <span className={`font-header tracking-wider text-base ${isActive ? 'text-[#fff] text-shadow-sm' : 'text-[#ccc]'}`}>
                            {data.name}
                        </span>
                        {isDead && <Skull size={14} className="text-[#666]" />}
                    </div>
                    {data.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {data.conditions.map(c => (
                                <span key={c} className="text-[9px] px-1.5 py-0.5 bg-[#a32222]/20 border border-[#a32222]/50 text-[#ffaaaa] rounded-sm uppercase tracking-wider font-mono">
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* HP & AC */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* AC */}
                    <div className="flex flex-col items-center justify-center group cursor-help" title={`AC: ${data.ac}`}>
                        <Shield size={16} className={`mb-0.5 ${isActive ? 'text-[#a32222]' : 'text-[#555] group-hover:text-[#888]'}`} />
                        <span className="text-[10px] font-mono text-[#666] font-bold">AC {data.ac}</span>
                    </div>

                    {/* HP Controls */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center bg-[#050505] border border-[#333] rounded-sm overflow-hidden">
                            <button onClick={() => handleHpChange(-1)} className="text-[#666] hover:text-red-500 hover:bg-[#1a0505] px-2 py-0.5 text-xs transition-colors">-</button>
                            <span className={`w-10 text-center text-sm font-mono font-bold py-0.5 ${isBloodied ? 'text-orange-500' : isDead ? 'text-red-700' : 'text-green-500'}`}>
                                {data.hp}
                            </span>
                            <button onClick={() => handleHpChange(1)} className="text-[#666] hover:text-green-500 hover:bg-[#051a05] px-2 py-0.5 text-xs transition-colors">+</button>
                        </div>
                        <span className="text-[9px] text-[#444] font-mono">MAX {data.maxHp}</span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-[#222] mx-1"></div>

                    {/* Expand/Menu */}
                    <div className="flex flex-col gap-1">
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1.5 hover:bg-[#222] rounded transition-colors ${isExpanded ? 'text-[#a32222] bg-[#a32222]/10' : 'text-[#666]'}`}>
                            <Activity size={14} />
                        </button>
                        <button onClick={() => onRemove(data.id)} className="p-1.5 hover:bg-[#2a0a0a] text-[#444] hover:text-red-500 rounded transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* HP Bar */}
            <div className="h-1 w-full bg-[#000] relative mt-1">
                <div
                    className={`h-full transition-all duration-500 ${isDead ? 'bg-red-900/50' : isBloodied ? 'bg-orange-600 shadow-[0_0_5px_orange]' : 'bg-[#1e4a1e] shadow-[0_0_5px_green]'}`}
                    style={{ width: `${hpPercent}%` }}
                />
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="p-3 border-t border-[#222] bg-[#0c0c0c] animate-slide-down">
                    {/* Quick Conditions Toggle */}
                    <div className="mb-4">
                        <div className="text-[10px] text-[#555] font-mono uppercase mb-2">STATUS EFFECTS</div>
                        <div className="flex flex-wrap gap-2">
                            {ALL_CONDITIONS.slice(0, 10).map(c => (
                                <button
                                    key={c}
                                    onClick={() => toggleCondition(c)}
                                    className={`text-[10px] px-3 py-1 border rounded-sm uppercase tracking-wide transition-all ${data.conditions.includes(c) ? 'bg-[#a32222] border-[#a32222] text-white shadow-[0_0_10px_rgba(163,34,34,0.4)]' : 'bg-[#000] border-[#333] text-[#666] hover:border-[#666] hover:text-[#bbb]'}`}
                                >
                                    {c}
                                </button>
                            ))}
                            <button onClick={() => setShowConditions(!showConditions)} className="text-[10px] text-[#444] px-2 hover:text-[#a32222] font-mono border border-transparent hover:border-[#333] rounded">
                                {showConditions ? 'SHOW LESS' : 'SHOW ALL...'}
                            </button>
                        </div>
                        {showConditions && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
                                {ALL_CONDITIONS.slice(10).map(c => (
                                    <button
                                        key={c}
                                        onClick={() => toggleCondition(c)}
                                        className={`text-[10px] px-3 py-1 border rounded-sm uppercase tracking-wide transition-all ${data.conditions.includes(c) ? 'bg-[#a32222] border-[#a32222] text-white shadow-[0_0_10px_rgba(163,34,34,0.4)]' : 'bg-[#000] border-[#333] text-[#666] hover:border-[#666] hover:text-[#bbb]'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Statblock View */}
                    {data.statblock && (
                        <div className="mt-2 text-xs">
                            <div className="text-[10px] text-[#555] font-mono uppercase mb-1">STATBLOCK REFERENCE</div>
                            {/* Minimized stat view or full? Let's keep it somewhat compact or full but scaled */}
                            <div className="transform origin-top-left scale-90 opacity-90">
                                <StatblockCard data={data.statblock} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

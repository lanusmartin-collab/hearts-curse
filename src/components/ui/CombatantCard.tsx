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
            relative flex flex-col bg-[#111] border transition-all duration-300 mb-2
            ${isActive ? 'border-[#a32222] shadow-[0_0_10px_rgba(163,34,34,0.3)]' : 'border-[#333] hover:border-[#555]'}
            ${isDead ? 'opacity-60 grayscale' : ''}
        `}>
            {/* Main Bar */}
            <div className="flex items-center p-2 gap-3">
                {/* Initiative Box */}
                <div className="flex flex-col items-center justify-center w-10 h-10 bg-[#0a0a0a] border border-[#333] rounded shrink-0">
                    <input
                        type="number"
                        value={data.initiative}
                        onChange={(e) => onUpdate(data.id, { initiative: parseInt(e.target.value) || 0 })}
                        className="w-full h-full text-center bg-transparent text-[#e0e0e0] font-mono text-lg font-bold focus:outline-none focus:text-[#a32222]"
                    />
                </div>

                {/* Name & Conditions */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`font-bold truncate ${isActive ? 'text-[#a32222]' : 'text-[#e0e0e0]'}`}>
                            {data.name}
                        </span>
                        {isDead && <Skull size={14} className="text-red-600" />}
                        {data.conditions.map(c => (
                            <span key={c} className="text-[9px] px-1 py-0.5 bg-[#333] text-[#ccc] rounded uppercase tracking-wider">
                                {c.slice(0, 3)}
                            </span>
                        ))}
                    </div>
                </div>

                {/* HP & AC */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* AC */}
                    <div className="flex flex-col items-center group cursor-help" title={`AC: ${data.ac}`}>
                        <Shield size={14} className="text-[#666] group-hover:text-[#a32222]" />
                        <span className="text-xs font-mono text-[#888]">{data.ac}</span>
                    </div>

                    {/* HP Controls */}
                    <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#333] rounded px-1">
                        <button onClick={() => handleHpChange(-1)} className="text-[#666] hover:text-red-500 px-1 text-xs">-</button>
                        <span className={`w-8 text-center text-sm font-mono ${isBloodied ? 'text-orange-500' : isDead ? 'text-red-700' : 'text-green-500'}`}>
                            {data.hp}
                        </span>
                        <button onClick={() => handleHpChange(1)} className="text-[#666] hover:text-green-500 px-1 text-xs">+</button>
                    </div>

                    {/* Expand/Menu */}
                    <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1 hover:bg-[#222] rounded ${isExpanded ? 'text-[#a32222]' : 'text-[#666]'}`}>
                        <Activity size={16} />
                    </button>

                    <button onClick={() => onRemove(data.id)} className="p-1 hover:bg-[#222] text-[#444] hover:text-red-500 rounded">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* HP Bar */}
            <div className="h-1 w-full bg-[#111] relative">
                <div
                    className={`h-full transition-all duration-300 ${isDead ? 'bg-red-900' : isBloodied ? 'bg-orange-600' : 'bg-green-700'}`}
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

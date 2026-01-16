import { Combatant, ALL_CONDITIONS } from "@/types/combat";
import { useState } from "react";
import {
    Shield, Skull, Activity, MoreVertical, X, Zap,
    EyeOff, EarOff, MicOff, Ghost, Anchor,
    HeartHandshake, AlertTriangle, AlertOctagon,
    Bed, BrainCircuit, Droplets, Flame, Loader2
} from "lucide-react";

// Map conditions to Lucide icons
const CONDITION_ICONS: Record<string, React.ReactNode> = {
    "blinded": <EyeOff size={10} />,
    "charmed": <HeartHandshake size={10} />,
    "deafened": <EarOff size={10} />,
    "frightened": <AlertTriangle size={10} />,
    "grappled": <Anchor size={10} />,
    "incapacitated": <Activity size={10} />,
    "invisible": <Ghost size={10} />,
    "paralyzed": <Zap size={10} className="rotate-90" />,
    "petrified": <Loader2 size={10} />,
    "poisoned": <Droplets size={10} />,
    "prone": <Bed size={10} />,
    "restrained": <Anchor size={10} />,
    "stunned": <BrainCircuit size={10} />,
    "unconscious": <Skull size={10} />,
    "exhaustion": <AlertOctagon size={10} />,
};

// Fallback icon
const DEFAULT_CONDITION_ICON = <AlertTriangle size={10} />;

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

    // Derived State
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
            {/* Active Indicator Glow */}
            {isActive && <div className="absolute inset-0 bg-[#a32222]/5 animate-pulse pointer-events-none"></div>}

            {/* Main Bar */}
            <div className={`flex items-center p-2 gap-3 relative z-10 ${isDead ? 'line-through text-[#666]' : ''}`}>

                {/* Initiative Badge (Zap) */}
                <div className={`
                    flex flex-col items-center justify-center w-8 h-8 rounded border shrink-0 transition-colors
                    ${isActive ? "border-[#ffd700] bg-[#2a1a05]" : "border-[#333] bg-[#111]"}
                `}>
                    <input
                        type="number"
                        value={data.initiative}
                        onChange={(e) => onUpdate(data.id, { initiative: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center bg-transparent font-mono text-sm font-bold focus:outline-none ${isActive ? 'text-[#ffd700]' : 'text-[#666]'}`}
                    />
                </div>

                {/* Name & Conditions */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        {/* Name with Heartbeat if Active */}
                        <span className={`
                            font-header tracking-wider text-xs truncate select-none block
                            ${isActive ? 'text-[#fff] text-shadow-sm font-bold animate-heartbeat origin-left' : 'text-[#ccc]'}
                        `}>
                            {data.name}
                        </span>
                        {isDead && <Skull size={12} className="text-[#666]" />}
                    </div>

                    {/* Compact Conditions Icons in Main View */}
                    <div className="flex flex-wrap gap-0.5 mt-0.5 min-h-[14px]">
                        {data.conditions.length > 0 ? (
                            data.conditions.map(c => (
                                <span
                                    key={c}
                                    title={c}
                                    className="flex items-center justify-center w-4 h-4 bg-[#220a0a] border border-[#5c1212] text-[#ff6b6b] rounded-[1px] hover:scale-110 transition-transform cursor-help"
                                >
                                    {CONDITION_ICONS[c.toLowerCase()] || <span className="text-[6px]">{c.slice(0, 2)}</span>}
                                </span>
                            ))
                        ) : isActive && !isDead ? (
                            <span className="text-[8px] text-[#444] italic">Focusing...</span>
                        ) : null}
                    </div>
                </div>

                {/* HP & AC Controls */}
                <div className="flex items-center gap-2 shrink-0">

                    {/* Inspect Button */}
                    {data.statblock && (
                        <button
                            onClick={() => onInspect(data.id)}
                            className={`p-1 rounded transition-colors ${isInspected ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#444] hover:text-[#d4af37] hover:bg-[#222]'}`}
                            title="Inspect Statblock"
                        >
                            <MoreVertical size={12} />
                        </button>
                    )}

                    {/* AC */}
                    <div className="flex flex-col items-center justify-center group cursor-help w-6" title={`AC: ${data.ac}`}>
                        <Shield size={12} className={`mb-0.5 ${isActive ? 'text-[#4a9eff]' : 'text-[#444] group-hover:text-[#888]'}`} />
                        <span className="text-[8px] font-mono text-[#555] font-bold">{data.ac}</span>
                    </div>

                    {/* HP Mini-Controls */}
                    <div className="flex flex-col items-end gap-0.5 w-14">
                        <div className="flex items-center justify-between w-full bg-[#050505] border border-[#333] rounded-[1px] overflow-hidden h-4">
                            <button onClick={() => handleHpChange(-1)} className="text-[#666] hover:text-red-500 hover:bg-[#1a0505] px-1 h-full text-[8px] transition-colors">-</button>
                            <span className={`text-[9px] font-mono font-bold ${isBloodied ? 'text-orange-500' : isDead ? 'text-red-700' : 'text-green-500'}`}>
                                {data.hp}
                            </span>
                            <button onClick={() => handleHpChange(1)} className="text-[#666] hover:text-green-500 hover:bg-[#051a05] px-1 h-full text-[8px] transition-colors">+</button>
                        </div>
                        <div className="w-full bg-[#111] h-1 rounded-full overflow-hidden border border-[#222]">
                            <div
                                className={`h-full transition-all duration-300 ${isBloodied ? 'bg-orange-600' : 'bg-[#2e7d32]'}`}
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-[#222] mx-0.5"></div>

                    {/* Expand/Delete */}
                    <div className="flex flex-col gap-0.5">
                        <button onClick={() => setIsExpanded(!isExpanded)} className={`p-0.5 hover:bg-[#222] rounded transition-colors ${isExpanded ? 'text-[#a32222] bg-[#a32222]/10' : 'text-[#444]'}`} title="Manage Conditions">
                            <Activity size={10} />
                        </button>
                        <button onClick={() => onRemove(data.id)} className="p-0.5 hover:bg-[#2a0a0a] text-[#333] hover:text-red-500 rounded transition-colors">
                            <X size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Details - Status Effects Manager */}
            {isExpanded && (
                <div className="p-3 border-t border-[#222] bg-[#0c0c0c] animate-slide-down shadow-inner">
                    <div className="text-[9px] text-[#555] font-mono uppercase mb-2">Toggle Conditions</div>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_CONDITIONS.map(c => (
                            <button
                                key={c}
                                onClick={() => toggleCondition(c)}
                                title={c}
                                className={`
                                    flex items-center justify-center w-8 h-8 rounded-sm transition-all
                                    ${data.conditions.includes(c)
                                        ? 'bg-[#5c1212] border border-[#a32222] text-white shadow-[0_0_5px_rgba(163,34,34,0.4)] scale-110'
                                        : 'bg-[#111] border border-[#333] text-[#444] hover:border-[#555] hover:text-[#888]'}
                                `}
                            >
                                {CONDITION_ICONS[c.toLowerCase()] || <span className="text-[8px]">{c.slice(0, 2)}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

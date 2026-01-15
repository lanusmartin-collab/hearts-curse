"use client";

import { CombatToken } from "./BattleMap";
import { ArrowBigRight, Heart, Shield, Trash2, Zap, Skull, Ghost, AlertTriangle } from "lucide-react";

type InitiativeTrackerProps = {
    tokens: CombatToken[];
    currentTurnIndex: number;
    onNextTurn: () => void;
    onDeleteToken: (id: string) => void;
    onUpdateToken: (id: string, updates: Partial<CombatToken>) => void;
};

export default function InitiativeTracker({
    tokens,
    currentTurnIndex,
    onNextTurn,
    onDeleteToken,
    onUpdateToken
}: InitiativeTrackerProps) {

    // Sort tokens by initiative desc
    const sortedTokens = [...tokens].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));

    // Get active token ID for highlighting
    const activeTokenId = sortedTokens[currentTurnIndex]?.id;

    return (
        <div className="flex flex-col h-full bg-[#f4e8d1] border-l border-[#8b7e66] relative font-serif">
            {/* Header with ancient vibe */}
            <header className="p-4 bg-[#f0e6d2] border-b border-[#8b7e66] flex justify-between items-center shadow-md z-10 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50 pointer-events-none"></div>
                <h2 className="text-xl font-header font-bold text-[#8a1c1c] tracking-widest drop-shadow-none relative z-10">INITIATIVE</h2>
                <div className="text-[10px] font-mono text-[#4a0404] border border-[#8b7e66] px-2 py-1 rounded relative z-10">ROUND 1</div>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#fdfbf7] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 pointer-events-none"></div>
                {sortedTokens.map((token, index) => {
                    const isActive = token.id === activeTokenId;

                    return (
                        <div
                            key={token.id}
                            className={`relative p-3 rounded rounded-tr-xl rounded-bl-xl border transition-all duration-500 ease-in-out group z-10
                                ${isActive
                                    ? "bg-[#e8dcc5] border-[#8a1c1c] shadow-[0_4px_12px_rgba(138,28,28,0.2)] transform scale-102"
                                    : "bg-[#f4e8d1] border-[#d1c4a8] hover:border-[#8b7e66] opacity-90 hover:opacity-100"}`}
                        >
                            {/* Beating Heart Indicator for Active Turn */}
                            {isActive && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#8a1c1c] blur-sm animate-pulse rounded-full opacity-50"></div>
                                        <Heart
                                            fill="#8a1c1c"
                                            className="text-[#8a1c1c] w-6 h-6 animate-[bounce_1s_infinite]"
                                            strokeWidth={0}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                {/* Initiative Badge (Left) */}
                                <div className={`
                                    flex flex-col items-center justify-center w-10 h-10 rounded border
                                    ${isActive ? "border-[#8a1c1c] bg-[#d8ccb5]" : "border-[#c9bca0] bg-[#e6dac3]"}
                                `}>
                                    <span className={`font-header text-lg font-bold ${isActive ? "text-[#8a1c1c]" : "text-[#5d4037]"}`}>
                                        {token.initiative ?? 0}
                                    </span>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-header font-bold truncate tracking-wide text-base ${isActive ? "text-[#4a0404]" : "text-[#2c1a1a]"}`}>
                                        {token.label}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 mt-1">
                                        {/* HP */}
                                        <div className="flex items-center gap-1.5" title="Hit Points">
                                            <Heart size={10} className="text-[#8a1c1c]" fill={isActive ? "#8a1c1c" : "none"} />
                                            <span className="text-xs font-mono font-bold text-[#5d4037]">
                                                {token.hp} <span className="text-[#c9bca0]">/</span> {token.maxHp}
                                            </span>
                                        </div>

                                        {/* AC */}
                                        <div className="flex items-center gap-1.5" title="Armor Class">
                                            <Shield size={10} className="text-[#003366]" />
                                            <span className="text-xs font-mono text-[#5d4037] font-bold">
                                                {token.ac}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conditions Row - Using Icons instead of text */}
                                    <div className="flex flex-wrap gap-1 mt-2 min-h-[16px]">
                                        {token.conditions && token.conditions.length > 0 ? (
                                            token.conditions.map((cond, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-[#2c1a1a] border border-[#5c1212] px-1.5 py-0.5 rounded-[2px] text-[8px] text-[#ffcccc] uppercase tracking-wider">
                                                    <Skull size={8} /> {cond}
                                                </div>
                                            ))
                                        ) : isActive ? (
                                            <span className="text-[9px] text-[#888] italic font-serif">Taking turn...</span>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Delete Action (Hover only) */}
                                <button
                                    onClick={() => onDeleteToken(token.id)}
                                    className="opacity-0 group-hover:opacity-100 text-[#8b7e66] hover:text-[#8a1c1c] transition-colors p-2"
                                    title="Remove from Combat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {tokens.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-[#8b7e66] italic opacity-60">
                        <Ghost size={24} className="mb-2" />
                        <span className="font-serif">No active combatants...</span>
                    </div>
                )}
            </div>

            {/* Next Turn Button */}
            <div className="p-4 bg-[#f0e6d2] border-t border-[#8b7e66] relative z-10">
                <button
                    onClick={onNextTurn}
                    className="w-full py-3 bg-[#8a1c1c] hover:bg-[#a32222] 
                    text-[#f4e8d1] font-header font-bold text-lg rounded-[2px] border border-[#5c1212] shadow-md
                    transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.1em]"
                >
                    Next Turn <ArrowBigRight fill="#f4e8d1" size={20} />
                </button>
            </div>
        </div>
    );
}

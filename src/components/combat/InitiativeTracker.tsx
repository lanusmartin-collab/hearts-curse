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
        <div className="flex flex-col h-full bg-[#0a0a0c] border-l border-[#333] relative">
            {/* Header with ancient vibe */}
            <header className="p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-[#111] border-b border-[#a32222] flex justify-between items-center shadow-lg z-10">
                <h2 className="text-xl font-header font-bold text-[#a32222] tracking-widest drop-shadow-md">INITIATIVE</h2>
                <div className="text-[10px] font-mono text-[#666] border border-[#333] px-2 py-1 rounded">ROUND 1</div>
            </header>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                {sortedTokens.map((token, index) => {
                    const isActive = token.id === activeTokenId;

                    return (
                        <div
                            key={token.id}
                            className={`relative p-3 rounded-tr-xl rounded-bl-xl border-2 transition-all duration-500 ease-in-out group
                                ${isActive
                                    ? "bg-gradient-to-r from-[#1a0505] to-[#0a0a0c] border-[#a32222] transform scale-105 shadow-[0_0_20px_rgba(163,34,34,0.4)] z-10"
                                    : "bg-[#111] border-[#333] hover:border-[#555] opacity-80 hover:opacity-100 scale-100"}`}
                        >
                            {/* Beating Heart Indicator for Active Turn */}
                            {isActive && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#a32222] blur-md animate-pulse rounded-full"></div>
                                        <Heart
                                            fill="#a32222"
                                            className="text-[#a32222] w-8 h-8 animate-[bounce_1s_infinite]"
                                            strokeWidth={0}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                {/* Initiative Badge (Left) */}
                                <div className={`
                                    flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 
                                    ${isActive ? "border-[#ffd700] bg-[#2a1a05]" : "border-[#444] bg-[#222]"}
                                `}>
                                    <Zap size={14} className={isActive ? "text-[#ffd700]" : "text-[#666]"} />
                                    <span className={`font-mono text-xl font-bold ${isActive ? "text-[#ffd700]" : "text-[#888]"}`}>
                                        {token.initiative ?? 0}
                                    </span>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`font-header font-bold truncate tracking-wide ${isActive ? "text-white text-lg" : "text-[#ccc]"}`}>
                                        {token.label}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 mt-1">
                                        {/* HP */}
                                        <div className="flex items-center gap-1.5" title="Hit Points">
                                            <Heart size={12} className="text-[#a32222]" fill={isActive ? "#a32222" : "none"} />
                                            <span className="text-xs font-mono text-[#888]">
                                                {token.hp} <span className="text-[#444]">/</span> {token.maxHp}
                                            </span>
                                        </div>

                                        {/* AC */}
                                        <div className="flex items-center gap-1.5" title="Armor Class">
                                            <Shield size={12} className="text-[#4a9eff]" />
                                            <span className="text-xs font-mono text-[#888] font-bold">
                                                {token.ac}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conditions Row - Using Icons instead of text */}
                                    <div className="flex flex-wrap gap-1 mt-2 min-h-[16px]">
                                        {token.conditions && token.conditions.length > 0 ? (
                                            token.conditions.map((cond, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-[#220a0a] border border-[#5c1212] px-1.5 py-0.5 rounded text-[9px] text-[#ff6b6b] uppercase tracking-wider">
                                                    <Skull size={8} /> {cond}
                                                </div>
                                            ))
                                        ) : isActive ? (
                                            <span className="text-[9px] text-[#444] italic">Concentrating...</span>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Delete Action (Hover only) */}
                                <button
                                    onClick={() => onDeleteToken(token.id)}
                                    className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-[#a32222] transition-colors p-2"
                                    title="Remove from Combat"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {tokens.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-[#444] italic opacity-50">
                        <Ghost size={32} className="mb-2" />
                        <span>The battlefield is silent...</span>
                    </div>
                )}
            </div>

            {/* Next Turn Button */}
            <div className="p-4 bg-[#0a0a0c] border-t border-[#333]">
                <button
                    onClick={onNextTurn}
                    className="w-full py-4 bg-gradient-to-r from-[#5c1212] to-[#8a1c1c] hover:from-[#8a1c1c] hover:to-[#a32222] 
                    text-white font-header font-bold text-lg rounded border border-[#ff4500] shadow-[0_0_15px_rgba(255,69,0,0.3)] 
                    transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                >
                    Next Turn <ArrowBigRight fill="white" />
                </button>
            </div>
        </div>
    );
}

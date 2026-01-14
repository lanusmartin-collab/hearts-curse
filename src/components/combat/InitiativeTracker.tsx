"use client";

import { CombatToken } from "./BattleMap";
import { ArrowBigRight, Heart, Shield, Trash2 } from "lucide-react";

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

    // Helper to check if a sorted token is the current one
    // Note: This logic assumes the parent manages 'currentTurnIndex' based on the sorted list.
    // If the list re-sorts dynamically, the index might point to a different person.
    // For simplicity V1, we just render the list and highlight the one at 'currentTurnIndex'.

    return (
        <div className="flex flex-col h-full bg-stone-900 border-l border-stone-700">
            <header className="p-4 bg-stone-950 border-b border-stone-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-amber-500">INITIATIVE</h2>
                <div className="text-sm text-stone-500">ROUND 1</div>
            </header>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {sortedTokens.map((token, index) => {
                    const isActive = index === currentTurnIndex;
                    return (
                        <div
                            key={token.id}
                            className={`relative p-3 rounded border transition-all flex items-center gap-3
                                ${isActive
                                    ? "bg-amber-900/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                    : "bg-stone-800 border-stone-700 opacity-80"}`}
                        >
                            {isActive && (
                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse">
                                    <ArrowBigRight fill="currentColor" />
                                </div>
                            )}

                            {/* Init Value */}
                            <div className="font-mono text-2xl font-bold w-10 text-center text-stone-400">
                                {token.initiative ?? 0}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="font-bold text-stone-200">{token.label}</div>
                                <div className="text-xs text-stone-500 flex gap-3 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Heart size={10} className="text-red-500" />
                                        {token.hp} / {token.maxHp}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Shield size={10} className="text-blue-500" />
                                        AC {token.ac}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => onDeleteToken(token.id)}
                                className="text-stone-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}

                {tokens.length === 0 && (
                    <div className="text-center text-stone-600 italic mt-10">
                        The battlefield is empty.
                    </div>
                )}
            </div>

            <div className="p-4 bg-stone-950 border-t border-stone-800">
                <button
                    onClick={onNextTurn}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow border border-amber-500 transition-colors uppercase tracking-widest"
                >
                    Next Turn
                </button>
            </div>
        </div>
    );
}

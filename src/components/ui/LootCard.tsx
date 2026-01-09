import React from 'react';
import { ShopItem } from '@/lib/data/items';

type LootCardProps = {
    item: ShopItem;
    onClose?: () => void;
};

const RARITY_THEMES: Record<string, { border: string; text: string; bg: string }> = {
    "Common": { border: "#6b7280", text: "#9ca3af", bg: "rgba(17, 24, 39, 0.5)" }, // Gray
    "Uncommon": { border: "#22c55e", text: "#4ade80", bg: "rgba(20, 83, 45, 0.2)" }, // Green
    "Rare": { border: "#3b82f6", text: "#60a5fa", bg: "rgba(30, 58, 138, 0.2)" }, // Blue
    "Very Rare": { border: "#a855f7", text: "#c084fc", bg: "rgba(88, 28, 135, 0.2)" }, // Purple
    "Legendary": { border: "#eab308", text: "#facc15", bg: "rgba(113, 63, 18, 0.2)" }, // Yellow
    "Artifact": { border: "#f97316", text: "#fb923c", bg: "rgba(124, 45, 18, 0.2)" }, // Orange
    "Unique": { border: "#dc2626", text: "#ef4444", bg: "rgba(127, 29, 29, 0.3)" }, // Red
    "Cursed": { border: "#7f1d1d", text: "#991b1b", bg: "#000000" } // Dark Red/Black
};

export function LootCard({ item, onClose }: LootCardProps) {
    const theme = RARITY_THEMES[item.rarity || "Common"] || RARITY_THEMES["Common"];

    return (
        <div
            className="relative w-full max-w-md p-6 rounded-lg shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-300"
            style={{
                borderColor: theme.border,
                backgroundColor: theme.bg,
                borderWidth: '2px',
                borderStyle: 'solid'
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-2">
                <div>
                    <h2
                        className="text-2xl font-bold font-serif tracking-wide"
                        style={{ color: theme.text }}
                    >
                        {item.name}
                    </h2>
                    <div className="flex gap-2 text-xs uppercase tracking-widest opacity-80 mt-1">
                        <span style={{ color: theme.text }}>{item.rarity}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">{item.type}</span>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Properties / Tags */}
            {item.properties && item.properties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {item.properties.map((prop, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] uppercase bg-black/50 border border-gray-700 rounded text-gray-300">
                            {prop}
                        </span>
                    ))}
                </div>
            )}

            {/* Main Effect */}
            <div className="mb-6 space-y-2">
                <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>Effect</h3>
                <div style={{ background: "rgba(0,0,0,0.6)", padding: "0.75rem", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <p style={{ color: "#fff", fontSize: "0.9rem", lineHeight: "1.5", fontWeight: "300", fontStyle: "italic" }}>
                        {item.effect || "No magical effect discerned."}
                    </p>
                </div>
            </div>

            {/* Flavor Text / Quote */}
            {item.npcQuote && (
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <p className="text-xs italic text-gray-500 font-serif text-center">
                        &quot;{item.npcQuote}&quot;
                    </p>
                </div>
            )}

            {/* Cost / Value (Hidden if Loot) */}
            {item.cost && !item.cost.includes("Loot") && !item.cost.includes("Quest") && (
                <div className="absolute bottom-2 right-4 text-[10px] text-gray-600">
                    Value: {item.cost}
                </div>
            )}
        </div>
    );
}

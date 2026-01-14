"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Coins, AlertTriangle } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

type EconomySettings = {
    inflation: number; // Multiplier (e.g., 1.0, 1.5, 2.0)
    scarcityMode: boolean; // Not used for logic yet, but visual indicator
    notes: string;
};

export default function EconomyControlPanel({ onUpdate }: { onUpdate: (settings: EconomySettings) => void }) {
    const [settings, setSettings] = useState<EconomySettings>({
        inflation: 1.0,
        scarcityMode: false,
        notes: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem('heart_curse_economy');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(parsed);
                onUpdate(parsed);
            } catch (e) { console.error(e); }
        }
    }, []); // Run once on mount to load initial state

    const update = (newSettings: Partial<EconomySettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        onUpdate(updated);
        localStorage.setItem('heart_curse_economy', JSON.stringify(updated));
    };

    return (
        <div className="p-4 bg-[var(--obsidian-base)] border border-[var(--gold-accent)] rounded shadow-lg mb-6 flex flex-wrap items-center gap-6 relative overflow-hidden">
            {/* Background Deco */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--gold-accent)]/10 to-transparent pointer-events-none"></div>

            <div className="flex items-center gap-3 min-w-[200px]">
                <div className="p-3 bg-[var(--obsidian-dark)] border border-[var(--gold-accent)] rounded-full">
                    <Coins className="w-6 h-6 text-[var(--gold-accent)]" />
                </div>
                <div>
                    <h3 className="text-sm font-header tracking-widest text-[var(--gold-accent)] uppercase">Global Economy</h3>
                    <div className="text-xs text-[var(--fg-dim)] font-mono">MARKET CONTROL</div>
                </div>
            </div>

            {/* Inflation Slider */}
            <div className="flex-1 min-w-[250px] flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-[var(--fg-dim)]">
                    <span>Market Stability</span>
                    <span className={settings.inflation > 1.2 ? "text-[var(--scarlet-accent)] animate-pulse" : "text-[var(--gold-accent)]"}>
                        {settings.inflation.toFixed(1)}x Prices
                    </span>
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={settings.inflation}
                    onChange={(e) => update({ inflation: parseFloat(e.target.value) })}
                    className="w-full accent-[var(--gold-accent)] h-1 bg-[var(--glass-border)] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#555] font-mono">
                    <span>Deflation</span>
                    <span>Stable</span>
                    <span>Hyper</span>
                </div>
            </div>

            {/* Scarcity Toggle */}
            <button
                onClick={() => update({ scarcityMode: !settings.scarcityMode })}
                className={`flex items-center gap-2 px-4 py-2 border rounded transition-all duration-300 ${settings.scarcityMode
                    ? 'bg-[var(--scarlet-accent)]/20 border-[var(--scarlet-accent)] text-[var(--scarlet-accent)]'
                    : 'bg-transparent border-[#444] text-[#666] hover:border-[#666]'
                    }`}
            >
                {settings.scarcityMode ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-xs font-bold font-header tracking-widest uppercase">
                    {settings.scarcityMode ? "SCARCITY: HIGH" : "SCARCITY: NORMAL"}
                </span>
            </button>

            {/* Notes / Ticker */}
            <div className="flex-1 min-w-[200px]">
                <input
                    className="w-full bg-transparent border-b border-[#444] text-xs font-mono py-1 px-2 text-[var(--fg-dim)] focus:border-[var(--gold-accent)] outline-none transition-colors"
                    placeholder="Economic Condition Notes..."
                    value={settings.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                />
            </div>

            {settings.inflation >= 2.0 && (
                <div className="absolute top-2 right-2" title="High Inflation Warning">
                    <AlertTriangle className="w-4 h-4 text-[var(--scarlet-accent)] animate-bounce" />
                </div>
            )}
        </div>
    );
}

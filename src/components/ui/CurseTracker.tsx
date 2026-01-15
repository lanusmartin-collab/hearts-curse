"use client";

import { useState, useEffect } from "react";
import { CURSE_MECHANICS } from "@/lib/data/mechanics";
import { Skull, AlertTriangle, TrendingUp, Minus, Plus } from "lucide-react";

export default function CurseTracker({ simpleView = false }: { simpleView?: boolean }) {
    // Initialize state lazily to avoid hydration mismatch, but we need useEffect for actual storage access
    const [days, setDays] = useState(0);

    // Load from local storage on mount and listen for changes
    useEffect(() => {
        const loadDays = () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('curse_days');
                if (saved) setDays(parseInt(saved, 10));
            }
        };

        loadDays();

        // Listen for storage events (updates from other tabs)
        window.addEventListener('storage', loadDays);

        // Custom event for same-tab updates (if any)
        window.addEventListener('curse-update', loadDays);

        return () => {
            window.removeEventListener('storage', loadDays);
            window.removeEventListener('curse-update', loadDays);
        };
    }, []);

    // Save to local storage whenever days changes (wrapped in helper to avoid useEffect loop or race)
    const updateDays = (newDays: number) => {
        const val = Math.max(0, Math.min(21, newDays)); // Cap at 21
        setDays(val);
        if (typeof window !== 'undefined') {
            localStorage.setItem('curse_days', val.toString());
            // Dispatch custom event for immediate same-page update if multiple widgets exist
            window.dispatchEvent(new Event('curse-update'));
        }
    };

    const currentStage = CURSE_MECHANICS.stages
        .slice()
        .reverse()
        .find(s => days >= s.day) || { name: "Latent", effect: "No visible effects... yet." };

    // Derive intensity and label for simple view
    const intensityMap: { [key: string]: number } = {
        "Latent": 0,
        "The Hollow ache": 1,
        "The Fading Color": 2,
        "The Whispering Void": 3,
        "Heart Failure": 4,
    };
    const intensity = intensityMap[currentStage.name] !== undefined ? intensityMap[currentStage.name] : 0;
    const MAX_DAYS = 21;

    // Helper for segment color
    const getSegmentColor = (index: number) => {
        // Stages: 3, 7, 14, 21
        if (index < 3) return "bg-[#333]"; // Latent
        if (index < 7) return "bg-[#e6a23c]"; // Hollow Ache
        if (index < 14) return "bg-[#d47225]"; // Fading Color
        if (index < 20) return "bg-[#a32222]"; // Whispering Void
        return "bg-[#ff0000] animate-pulse shadow-[0_0_10px_red]"; // Critical
    };

    if (simpleView) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                        style={{
                            width: "12px", height: "12px", borderRadius: "50%",
                            background: "var(--scarlet-accent)",
                            boxShadow: "0 0 10px var(--scarlet-accent)",
                            animation: `flicker ${(11 - intensity) * 0.2}s infinite`
                        }}
                    />
                    <span style={{ color: "var(--scarlet-accent)", fontFamily: "var(--font-serif)", fontWeight: "bold", fontSize: "1.1rem" }}>
                        LEVEL {intensity}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[var(--fg-dim)] font-mono">DAY {days}/{MAX_DAYS}</span>
                    <div className="flex gap-[2px] mt-1">
                        {Array.from({ length: MAX_DAYS }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-[2px] h-[6px] ${i < days ? 'bg-[var(--scarlet-accent)]' : 'bg-[#333]'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header / Current Status */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-serif text-[var(--scarlet-accent)]">{currentStage.name}</h3>
                    <p className="text-sm text-[var(--fg-dim)] italic mt-1 max-w-md">{currentStage.effect}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-bold font-mono text-[var(--fg-color)] tracking-tighter">
                        {String(days).padStart(2, '0')}<span className="text-lg text-[var(--fg-dim)]">/{MAX_DAYS}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[var(--fg-dim)] mt-1">Days Elapsed</div>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="relative mb-8">
                <div className="flex gap-1 h-8 w-full">
                    {Array.from({ length: MAX_DAYS }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-300 relative group
                                ${i < days ? getSegmentColor(i) : 'bg-[#1a1a1a] border border-[#333]'}`}
                        >
                            {/* Tooltip for thresholds */}
                            {(i + 1 === 3 || i + 1 === 7 || i + 1 === 14 || i + 1 === 21) && (
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--fg-dim)] opacity-50">
                                    {i + 1}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center bg-[#111] p-2 rounded border border-[#333]">
                <button
                    onClick={() => updateDays(days - 1)}
                    className="p-3 hover:bg-[#222] text-[var(--fg-dim)] hover:text-white rounded transition-colors"
                    title="Decrement Day"
                >
                    <Minus className="w-5 h-5" />
                </button>

                <span className="font-mono text-xs text-[#555] uppercase tracking-widest">
                    Manual Override
                </span>

                <button
                    onClick={() => updateDays(days + 1)}
                    className="p-3 hover:bg-[#222] text-[var(--scarlet-accent)] hover:text-red-400 rounded transition-colors"
                    title="Advance Day"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Warning Section */}
            {days >= 14 && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-red-900/10 border border-red-900/30 rounded animate-pulse-slow">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <div className="text-sm text-red-200/80">
                        <strong className="block text-red-500 uppercase text-xs tracking-widest mb-1">Warning</strong>
                        The veil is thinning. Reality fluctuations detected.
                    </div>
                </div>
            )}
        </div>
    );
}

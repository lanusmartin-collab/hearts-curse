"use client";

import { useState } from "react";
import { CURSE_MECHANICS } from "@/lib/data/mechanics";

export default function CurseTracker({ simpleView = false }: { simpleView?: boolean }) {
    const [days, setDays] = useState(0);

    const currentStage = CURSE_MECHANICS.stages
        .slice()
        .reverse()
        .find(s => days >= s.day) || { name: "Latent", effect: "No visible effects... yet." };

    // Derive intensity and label for simple view
    // Assuming CURSE_MECHANICS.stages might have a 'level' property,
    // or we can derive it from the index/day.
    // For now, let's map currentStage.name to a numeric intensity and use currentStage.name as the label.
    const intensityMap: { [key: string]: number } = {
        "Latent": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "Critical": 4,
        // Add more mappings if CURSE_MECHANICS.stages has more names
    };
    const intensity = intensityMap[currentStage.name] !== undefined ? intensityMap[currentStage.name] : 0;
    const getLabel = (name: string) => name; // The currentStage.name is already the label

    if (simpleView) {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full bg-[var(--scarlet-accent)] animate-pulse shadow-[0_0_10px_var(--scarlet-accent)]"
                        style={{ animationDuration: `${(11 - intensity) * 0.2}s` }}
                    />
                    <span className="text-[var(--scarlet-accent)] font-serif font-bold text-lg">
                        LEVEL {intensity}
                    </span>
                </div>
                <span className="text-xs text-[var(--fg-dim)] uppercase tracking-wider">
                    {getLabel(currentStage.name)}
                </span>
            </div>
        )
    }

    return (
        <div className="retro-border" style={{ textAlign: "center" }}>
            <h2>The Hollow Heart</h2>

            <div style={{ margin: "2rem 0" }}>
                <div style={{ fontSize: "4rem", fontFamily: "var(--font-serif)", color: "var(--accent-color)" }}>
                    DAY {days}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <button onClick={() => setDays(Math.max(0, days - 1))}>[-1 DAY]</button>
                    <button onClick={() => setDays(days + 1)}>[+1 DAY]</button>
                </div>
            </div>

            <div style={{ borderTop: "2px solid var(--border-color)", paddingTop: "1rem" }}>
                <h3 style={{ color: "var(--fg-color)" }}>Current State: {currentStage.name}</h3>
                <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
                    {currentStage.effect}
                </p>
            </div>

            {days >= 21 && (
                <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold", animation: "pulse 1s infinite" }}>
                    ⚠️ CRITICAL FAILURE IMMINENT ⚠️
                </div>
            )}
        </div>
    );
}

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
    const intensityMap: { [key: string]: number } = {
        "Latent": 0,
        "Mild": 1,
        "Moderate": 2,
        "Severe": 3,
        "Critical": 4,
    };
    const intensity = intensityMap[currentStage.name] !== undefined ? intensityMap[currentStage.name] : 0;
    const getLabel = (name: string) => name;

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
                <span style={{ fontSize: "0.75rem", color: "var(--fg-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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

"use client";

import { useState } from "react";
import { CURSE_MECHANICS } from "@/lib/data/mechanics";

export default function CurseTracker() {
    const [days, setDays] = useState(0);

    const currentStage = CURSE_MECHANICS.stages
        .slice()
        .reverse()
        .find(s => days >= s.day) || { name: "Latent", effect: "No visible effects... yet." };

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

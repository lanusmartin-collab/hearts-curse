"use client";

import { ShopItem } from "@/lib/data/items";
import Image from "next/image";

export function LootCard({ item }: { item: ShopItem }) {
    // Helper for rarity colors (AD&D style: subtle metallic inks)
    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case "common": return "#333";
            case "uncommon": return "#1a472a"; // Hunter Green
            case "rare": return "#003366"; // Navy Blue
            case "very rare": return "#4a1c1c"; // Deep Red
            case "legendary": return "#806000"; // Gold/Bronze
            case "artifact": return "#4b0082"; // Indigo
            default: return "#333";
        }
    };

    return (
        <div style={{
            background: `
                linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E"),
                var(--adnd-bg)
            `,
            backgroundColor: "#e8dcd0", // Fallback
            border: "1px solid #8b7355", // Paler brown
            borderRadius: "2px",
            padding: "1.5rem",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2), inset 0 0 30px rgba(139, 69, 19, 0.1)", // Inset for aged look
            position: "relative",
            color: "#2c1a1a", // Deep Ink
            fontFamily: "var(--adnd-font-body)",
            width: "100%",
            maxWidth: "450px",
            margin: "0 auto"
        }}>
            {/* Corner Decorations */}
            <div style={{ position: "absolute", top: "4px", left: "4px", width: "10px", height: "10px", borderTop: "2px solid #5d4037", borderLeft: "2px solid #5d4037" }} />
            <div style={{ position: "absolute", top: "4px", right: "4px", width: "10px", height: "10px", borderTop: "2px solid #5d4037", borderRight: "2px solid #5d4037" }} />
            <div style={{ position: "absolute", bottom: "4px", left: "4px", width: "10px", height: "10px", borderBottom: "2px solid #5d4037", borderLeft: "2px solid #5d4037" }} />
            <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "10px", height: "10px", borderBottom: "2px solid #5d4037", borderRight: "2px solid #5d4037" }} />

            {/* Header */}
            <div style={{ borderBottom: `2px solid ${getRarityColor(item.rarity || "Common")}`, paddingBottom: "0.5rem", marginBottom: "1rem", textAlign: "center" }}>
                <h3 style={{
                    margin: 0,
                    fontFamily: "var(--adnd-font-header)",
                    color: getRarityColor(item.rarity || "Common"),
                    textTransform: "uppercase",
                    fontSize: "1.4rem"
                }}>
                    {item.name}
                </h3>
                <div style={{ fontSize: "0.8rem", fontStyle: "italic", opacity: 0.8, textTransform: "uppercase", marginTop: "0.2rem" }}>
                    {item.rarity} {item.type} {item.attunement || (item.properties && item.properties.some(p => p.toLowerCase().includes("attunement"))) ? "(Requires Attunement)" : ""}
                </div>
            </div>

            {/* Content */}
            <div style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>
                <p>{item.description || item.effect || "No description available."}</p>
            </div>

            {/* Cost & Weight Footer */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(0,0,0,0.05)",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                fontFamily: "var(--font-mono)",
                borderTop: "1px solid #aaa"
            }}>
                <div style={{ fontWeight: "bold" }}>
                    COST: {item.cost}
                </div>
                {item.source && (
                    <div style={{ opacity: 0.6, fontSize: "0.7rem" }}>
                        SRC: {item.source}
                    </div>
                )}
            </div>
        </div>
    );
}

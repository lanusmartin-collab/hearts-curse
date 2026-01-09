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
            background: "var(--adnd-bg)",
            border: "2px solid #5d4037",
            padding: "1.5rem",
            boxShadow: "5px 5px 15px rgba(0,0,0,0.4)",
            position: "relative",
            color: "var(--adnd-ink)",
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

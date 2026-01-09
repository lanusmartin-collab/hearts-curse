"use client";

import { useState } from "react";
import { ALL_MONSTERS } from "@/lib/data/monsters_2024";
import { Statblock } from "@/lib/data/statblocks";
import { ShopItem } from "@/lib/data/items";
import { generateNPC, generateLootItem, generateArtifact, GeneratorTheme } from "@/lib/generators"; // New generators
import StatblockCard from "@/components/ui/StatblockCard";
import { LootCard } from "@/components/ui/LootCard";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
import { NPC_NAMES, NPC_TITLES, NPC_QUIRKS } from "@/lib/data/generator-tables";
import { CAMPAIGN_MAPS } from "@/lib/data/maps";

export default function GeneratorsPage() {
    const [result, setResult] = useState<Statblock | null>(null);
    const [lootItem, setLootItem] = useState<ShopItem | null>(null);
    const [selectedMapId, setSelectedMapId] = useState<string>("oakhaven");

    // Helper: Map ID to Theme
    const getTheme = (mapId: string): GeneratorTheme => {
        if (mapId.includes("underdark") || mapId.includes("arach") || mapId.includes("mines") || mapId.includes("tieg")) return "Underdark";
        if (mapId.includes("castle") || mapId.includes("catacombs") || mapId.includes("ossuary") || mapId.includes("heart")) return "Undead";
        if (mapId.includes("library") || mapId.includes("netheril") || mapId.includes("mind") || mapId.includes("beholder")) return "Arcane";
        if (mapId.includes("wards")) return "Construct";
        return "Surface";
    };

    const currentTheme = getTheme(selectedMapId);

    // Maps that enable Artifact/Sentient Item generation naturally
    const HIGH_LEVEL_MAPS = ["mind_flayer", "beholder", "arach", "netheril", "heart_chamber", "catacombs_despair", "ossuary"];
    const isHighLevel = HIGH_LEVEL_MAPS.some(id => selectedMapId.includes(id));

    const genNPC = () => {
        const sb = generateNPC(currentTheme);
        // Flavor the name
        const n = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
        const t = NPC_TITLES[Math.floor(Math.random() * NPC_TITLES.length)];
        sb.name = `${n} ${t}`;
        // Add quirk
        const q = NPC_QUIRKS[Math.floor(Math.random() * NPC_QUIRKS.length)];
        sb.traits.push({ name: "Quirk", desc: q });

        setResult(sb);
        setLootItem(null);
    };

    const genMonster = () => {
        // Pick random from ALL_MONSTERS
        const monster = ALL_MONSTERS[Math.floor(Math.random() * ALL_MONSTERS.length)];
        setResult(monster);
        setLootItem(null);
    };

    const genLoot = () => {
        // [IMPROVED] Pass IsHighLevel context to allow Artifact drops
        setLootItem(generateLootItem(currentTheme, isHighLevel));
        setResult(null);
    };

    const genArtifact = () => {
        setLootItem(generateArtifact(currentTheme));
        setResult(null);
    };

    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>The Foundry v5.0</h1>
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Fabrication Matrix: {currentTheme} (Artifact Mode Online)</p>
                </div>
                <PrintButton />
            </header>

            {/* Filter Controls */}
            <div className="retro-border no-print" style={{ padding: "1rem", marginBottom: "2rem", background: "rgba(0,0,0,0.2)" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" }}>
                    Source Signal (Map Context)
                </label>
                <select
                    value={selectedMapId}
                    onChange={(e) => setSelectedMapId(e.target.value)}
                    style={{ width: "100%", padding: "0.5rem", background: "black", color: "var(--accent-color)", border: "1px solid #555" }}
                >
                    {CAMPAIGN_MAPS.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem", marginBottom: "2rem" }} className="no-print">
                <button onClick={genNPC}>[NPC]</button>
                <button onClick={genMonster}>[MONSTER]</button>
                <button onClick={genLoot}>[LOOT]</button>
                <button onClick={genArtifact} style={{ color: "orange", borderColor: "orange" }}>[ARTIFACT]</button>
            </div>

            <div className="retro-border" style={{ minHeight: "400px", display: "flex", justifyContent: "center", alignItems: "start", padding: "2rem" }}>
                {result ? (
                    <div className="fade-in" style={{ width: "100%" }}>
                        <h3 style={{ borderBottom: "1px dashed #555", marginBottom: "1rem" }}>Fabrication Result (Bio-Data)</h3>
                        <StatblockCard data={result} />
                    </div>
                ) : lootItem ? (
                    <div className="fade-in" style={{ width: "100%", maxWidth: "500px" }}>
                        <h3 style={{ borderBottom: "1px dashed #555", marginBottom: "1rem", textAlign: "center" }}>Fabrication Result (Artifact)</h3>
                        <LootCard item={lootItem} />
                    </div>
                ) : (
                    <p style={{ opacity: 0.5, paddingTop: "4rem" }}>Select a module to begin fabrication...</p>
                )}
            </div>
        </div>
    );
}

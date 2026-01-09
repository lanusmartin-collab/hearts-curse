"use client";

import { useState } from "react";
import { ALL_MONSTERS } from "@/lib/data/monsters_2024";
import { Statblock } from "@/lib/data/statblocks";
import { ShopItem } from "@/lib/data/items";
import { generateNPC, generateLootItem } from "@/lib/generators"; // New generators
import StatblockCard from "@/components/ui/StatblockCard";
import { LootCard } from "@/components/ui/LootCard"; // New component
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
import { NPC_NAMES, NPC_TITLES, NPC_QUIRKS } from "@/lib/data/generator-tables";

export default function GeneratorsPage() {
    const [result, setResult] = useState<Statblock | null>(null);
    const [lootItem, setLootItem] = useState<ShopItem | null>(null);

    const genNPC = () => {
        const sb = generateNPC();
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
        setLootItem(generateLootItem());
        setResult(null);
    };

    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between" }}>
                <h1>The Foundry v4.0</h1>
                <PrintButton />
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }} className="no-print">
                <button onClick={genNPC}>[GENERATE NPC]</button>
                <button onClick={genMonster}>[GENERATE MONSTER]</button>
                <button onClick={genLoot}>[GENERATE LOOT]</button>
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

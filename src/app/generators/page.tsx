"use client";

import { useState } from "react";
import { NPC_NAMES, NPC_TITLES, NPC_QUIRKS, MONSTER_PREFIXES, MONSTER_ABILITIES, LOOT_TRINKETS } from "@/lib/data/generator-tables";
import { Statblock } from "@/lib/data/statblocks";
import StatblockCard from "@/components/ui/StatblockCard";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";

import { ALL_MONSTERS } from "@/lib/data/monsters_2024";

export default function GeneratorsPage() {
    const [result, setResult] = useState<Statblock | null>(null);
    const [loot, setLoot] = useState("");

    const genNPC = () => {
        const n = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
        const t = NPC_TITLES[Math.floor(Math.random() * NPC_TITLES.length)];
        const q = NPC_QUIRKS[Math.floor(Math.random() * NPC_QUIRKS.length)];

        setResult({
            name: `${n} ${t}`,
            size: "Medium", type: "Humanoid (Cursed)", alignment: "Neutral",
            ac: 10 + Math.floor(Math.random() * 8), armorType: "Scavenged Gear",
            hp: 10 + Math.floor(Math.random() * 50), hitDice: "8d8",
            speed: "30 ft.",
            stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
            saves: "", skills: "", immunities: "", languages: "Common",
            cr: "1/4", xp: 50,
            traits: [{ name: "Quirk", desc: q }],
            actions: [{ name: "Improvised Weapon", desc: "+2 to hit, 1d4 damage." }]
        });
        setLoot("");
    };

    const genMonster = () => {
        // Pick random from ALL_MONSTERS
        const monster = ALL_MONSTERS[Math.floor(Math.random() * ALL_MONSTERS.length)];

        setResult(monster);
        setLoot("");
    };

    const genLoot = () => {
        setLoot(LOOT_TRINKETS[Math.floor(Math.random() * LOOT_TRINKETS.length)]);
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

            <div className="retro-border" style={{ minHeight: "400px" }}>
                {result ? (
                    <div className="fade-in">
                        <h3 style={{ borderBottom: "1px dashed #555", marginBottom: "1rem" }}>Fabrication Result</h3>
                        <StatblockCard data={result} />
                    </div>
                ) : loot ? (
                    <div className="fade-in" style={{ textAlign: "center", paddingTop: "4rem" }}>
                        <h3>Trinket Found</h3>
                        <p style={{ fontSize: "2rem", marginTop: "1rem", color: "var(--accent-color)" }}>{loot}</p>
                    </div>
                ) : (
                    <p style={{ opacity: 0.5, textAlign: "center", paddingTop: "4rem" }}>Select a module to begin fabrication...</p>
                )}
            </div>
        </div>
    );
}

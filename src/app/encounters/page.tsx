"use client";

import { useState } from "react";
import { TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE, SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE, UNDERDARK_TRAVEL_TABLE, Encounter } from "@/lib/data/encounters";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import Link from "next/link";

export default function EncountersPage() {
    const [result, setResult] = useState<Encounter | null>(null);
    const [linkedStatblocks, setLinkedStatblocks] = useState<string[]>([]);
    const [lastRoll, setLastRoll] = useState(0);

    const rollTable = (table: Encounter[]) => {
        const d20 = Math.floor(Math.random() * 20) + 1;
        setLastRoll(d20);

        const match = table.find(e => d20 >= e.roll[0] && d20 <= e.roll[1]);
        const encounter = match || { roll: [0, 0], name: "Silence...", description: "No encounter triggered." };
        setResult(encounter);

        // Load statblocks from the monster list
        if (encounter.monsters) {
            setLinkedStatblocks(encounter.monsters);
        } else {
            setLinkedStatblocks([]);
        }
    };

    const triggerShopAmbush = () => {
        setLastRoll(20);
        const ambush = SHOP_AMBUSH_TABLE[0];
        setResult(ambush);
        setLinkedStatblocks(ambush.monsters || []);
    };

    return (
        <div className="retro-container">
            <Link href="/" className="no-print">{"< BACK_TO_ROOT"}</Link>
            <header style={{ margin: "2rem 0" }}>
                <h1>Encounter Generator</h1>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
                <button className="retro-border" onClick={() => rollTable(TOWN_DAY_TABLE)}>
                    <h3>TOWN (DAY)</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(TOWN_NIGHT_TABLE)}>
                    <h3>TOWN (NIGHT)</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(OUTSKIRTS_TABLE)}>
                    <h3>OUTSKIRTS</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)}>
                    <h3>UNDERDARK TRAVEL</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(SILENT_WARDS_TABLE)}>
                    <h3>DUNGEON: SILENT WARDS</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)}>
                    <h3>DUNGEON: LIBRARY</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={() => rollTable(HEART_CHAMBER_TABLE)}>
                    <h3>DUNGEON: HEART</h3>
                    <p>[INITIATE_SCAN]</p>
                </button>
                <button className="retro-border" onClick={triggerShopAmbush} style={{ borderColor: "red", color: "red" }}>
                    <h3>⚠️ TRIGGER: SHOP BYPASS</h3>
                    <p>[FORCE_AMBUSH]</p>
                </button>
            </div>

            {result && (
                <div className="retro-border pixel-corners" style={{ padding: "2rem", textAlign: "center", animation: "flicker 0.2s" }}>
                    <div style={{ fontSize: "5rem", fontFamily: "var(--font-serif)", color: "var(--accent-color)" }}>
                        {lastRoll}
                    </div>
                    <h2>{result.name}</h2>
                    <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{result.description}</p>

                    {linkedStatblocks.length > 0 && (
                        <div style={{ marginTop: "2rem", textAlign: "left" }}>
                            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>-- THREAT IDENTIFIED --</h3>
                            {linkedStatblocks.map(slug => {
                                const data = MONSTERS_2024[slug];
                                if (!data) return <div key={slug} style={{ color: 'red' }}>ERROR: Statblock for '{slug}' not found.</div>;
                                return (
                                    <div key={slug} style={{ marginBottom: "2rem" }}>
                                        <StatblockCard data={data} key={slug} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

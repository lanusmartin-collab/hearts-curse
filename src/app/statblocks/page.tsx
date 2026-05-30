"use client";

import { useState, useEffect } from "react";
import { STATBLOCKS, Statblock } from "@/lib/data/statblocks";
import { ALL_MONSTERS } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import StatblockGenerator from "@/components/ui/StatblockGenerator";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
// import "./binder.css"; // Moved to globals.css

export default function StatblocksPage() {
    const [search, setSearch] = useState("");
    const [showGenerator, setShowGenerator] = useState(false);
    const [customCreatures, setCustomCreatures] = useState<Statblock[]>([]);

    // Filters
    const [filterType, setFilterType] = useState("All");

    const handleAddMonsterToCombat = (monster: Statblock) => {
        const slug = monster.slug || monster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const existing = JSON.parse(localStorage.getItem("combat_tracker_queue") || "[]");
        const toAdd = { slug, hp: monster.hp || 10, init: 0 };
        localStorage.setItem("combat_tracker_queue", JSON.stringify([...existing, toAdd]));
        alert(`Sent ${monster.name} to Combat Tracker!`);
    };

    useEffect(() => {
        const saved = localStorage.getItem("custom_statblocks");
        if (saved) {
            try {
                let parsed = JSON.parse(saved);

                // CRITICAL FIX: Purge old versions of Larloch
                const initialLength = parsed.length;
                parsed = parsed.filter((c: Statblock) => {
                    if (c.name === "Larloch the Shadow King" && (!c.cr || parseInt(String(c.cr)) < 28)) {
                        console.log("Purging legacy Larloch from cache");
                        return false;
                    }
                    return true;
                });

                if (parsed.length !== initialLength) {
                    localStorage.setItem("custom_statblocks", JSON.stringify(parsed));
                }

                setCustomCreatures(parsed);
            } catch (e) {
                console.error("Failed to parse custom statblocks", e);
            }
        }
    }, []);

    const handleSave = (newCreature: Statblock) => {
        const updated = [...customCreatures, newCreature];
        setCustomCreatures(updated);
        localStorage.setItem("custom_statblocks", JSON.stringify(updated));
        setShowGenerator(false);
    };

    // Combine locally defined STATBLOCKS, imported ALL_MONSTERS, and user CUSTOM_CREATURES.
    // We use a Map to ensure uniqueness by SLUG.
    const combined = new Map<string, Statblock>();

    // 1. Add Legacy Statblocks (Preserve Keys as Slugs)
    Object.entries(STATBLOCKS).forEach(([key, s]) => {
        const slug = s.slug || key;
        combined.set(slug, { ...s, slug });
    });

    // 2. Add New Monsters (Overrides Legacy because ALL_MONSTERS includes Drow/AideDD)
    ALL_MONSTERS.forEach(s => {
        if (s.slug) {
            combined.set(s.slug, s);
        }
    });

    // 3. Add Custom (Overrides Everything)
    customCreatures.forEach(s => {
        let key = s.slug;
        if (!key && s.name) {
            key = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
        // Special Case
        if (s.name === "Larloch the Shadow King") key = "larloch";

        if (key) combined.set(key, s);
    });

    let allCreatures = Array.from(combined.values());

    // HARD FIX: Filter out "Old Larloch" if it somehow persists with a different key
    allCreatures = allCreatures.filter(c => {
        if (!c.type || c.type === "Unknown") return false; // Filter Unknowns
        if (c.name.includes("Larloch") && c.name.includes("Shadow King")) {
            if (!c.cr || parseInt(String(c.cr)) < 28) return false;
        }
        return true;
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Extract unique types for the sidebar
    const allTypes = ["All", ...Array.from(new Set(allCreatures.map(m => {
        if (!m.type) return "Unknown";
        // Normalize "Medium humanoid (dwarf)" -> "Humanoid"
        const mainType = m.type.split(" ")[0].replace(/,/g, "").replace(/\(/g, "");
        return mainType.charAt(0).toUpperCase() + mainType.slice(1);
    }).filter(Boolean))).sort()];

    // Filter Logic
    const filtered = allCreatures.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.type && s.type.toLowerCase().includes(search.toLowerCase()));
        const matchesType = filterType === "All" || (s.type && s.type.toLowerCase().includes(filterType.toLowerCase()));
        return matchesSearch && matchesType;
    });

    const [selectedCreature, setSelectedCreature] = useState<Statblock | null>(null);

    return (
        <div className="adnd-theme" style={{ minHeight: "100vh", padding: "1rem", display: "flex", flexDirection: "column" }}>

            {/* Top Navigation Bar */}
            <header className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 1rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <Link href="/" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>← Back to Campaign</Link>
                    <h1 style={{ margin: 0, fontSize: "1.5rem", borderBottom: "none", textShadow: "none", color: "var(--adnd-ink)" }}>Monstrous Compendium</h1>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setShowGenerator(!showGenerator)} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                        {showGenerator ? "Close Forge" : "Open Forge"}
                    </button>
                    <PrintButton />
                </div>
            </header>

            {showGenerator && (
                <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: 100, background: "rgba(0,0,0,0.8)", padding: "2rem", overflowY: "auto" }}>
                    <div className="retro-container" style={{ background: "var(--bg-color)" }}>
                        <button onClick={() => setShowGenerator(false)} style={{ float: "right" }}>CLOSE</button>
                        <StatblockGenerator onSave={handleSave} />
                    </div>
                </div>
            )}

            {/* Binder Layout */}
            <div className="adnd-binder-grid">

                {/* 1. Tabs / Categories Sidebar */}
                <div className="adnd-binder-sidebar" style={{
                    background: "#2c1a1a",
                    color: "#d7c0a0",
                    overflowY: "auto",
                    borderRight: "2px solid #1a0f0f",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <div style={{ padding: "1rem", borderBottom: "1px solid #444", minWidth: "200px" }}>
                        <input
                            type="text"
                            placeholder="Search Index..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid #555",
                                color: "#f0f0f0",
                                fontSize: "0.9rem"
                            }}
                        />
                    </div>
                    {allTypes.map(t => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            style={{
                                textAlign: "left",
                                border: "none",
                                borderBottom: "1px solid #444",
                                background: filterType === t ? "var(--adnd-bg)" : "transparent",
                                color: filterType === t ? "var(--adnd-ink)" : "#d7c0a0",
                                padding: "0.8rem 1rem",
                                borderRadius: 0,
                                textTransform: "capitalize",
                                fontSize: "0.9rem"
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* 2. Monster List (Index) */}
                <div className="adnd-binder-list" style={{
                    background: "var(--adnd-bg)",
                    overflowY: "auto",
                    borderRight: "1px solid #c9bca0",
                    position: "relative"
                }}>
                    {/* Binder Rings Graphic (Optional) */}
                    <div style={{ position: "absolute", left: "-10px", top: "0", bottom: "0", width: "20px", background: "url('/binder-rings.png') repeat-y" }}></div>

                    {filtered.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedCreature(s)}
                            onMouseEnter={() => !selectedCreature && setSelectedCreature(s)}
                            style={{
                                padding: "0.5rem 1rem",
                                paddingLeft: "1.5rem",
                                borderBottom: "1px dashed #d7c0a0",
                                cursor: "pointer",
                                background: selectedCreature === s ? "rgba(138, 28, 28, 0.1)" : "transparent",
                                fontWeight: selectedCreature === s ? "bold" : "normal",
                                color: "var(--adnd-ink)",
                                fontFamily: "var(--adnd-font-body)",
                                fontSize: "0.9rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <span>{s.name}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="no-print">
                                <span style={{ fontSize: "0.8em", opacity: 0.6 }}>CR {s.cr}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddMonsterToCombat(s);
                                    }}
                                    style={{
                                        background: "var(--scarlet-accent)",
                                        color: "white",
                                        border: "1px solid var(--gold-accent)",
                                        borderRadius: "3px",
                                        padding: "1px 6px",
                                        fontSize: "0.7rem",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        textTransform: "uppercase"
                                    }}
                                    title="Add to Combat Board"
                                >
                                    + Combat
                                </button>
                            </div>
                            <span style={{ fontSize: "0.8em", opacity: 0.6 }} className="print-only">CR {s.cr}</span>
                        </div>
                    ))}
                </div>

                {/* 3. Preview Pane (The Page) */}
                <div className="adnd-binder-preview" style={{
                    background: "#fdf5c9",
                    padding: "2rem",
                    overflowY: "auto",
                    display: "flex",
                    justifyContent: "center",
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')"
                }}>
                    {selectedCreature ? (
                        <div style={{ maxWidth: "800px", width: "100%", transition: "all 0.3s ease", paddingBottom: "5rem" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }} className="no-print">
                                <button
                                    onClick={() => handleAddMonsterToCombat(selectedCreature)}
                                    style={{
                                        background: "var(--scarlet-accent)",
                                        color: "#fff",
                                        border: "1px solid var(--gold-accent)",
                                        padding: "0.5rem 1rem",
                                        fontSize: "0.85rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    ⚔️ Add to Combat Tracker
                                </button>
                            </div>
                            <StatblockCard data={selectedCreature} />
                        </div>
                    ) : (
                        <div style={{ alignSelf: "center", opacity: 0.4, fontStyle: "italic", textAlign: "center" }}>
                            <h3>Select a creature from the index</h3>
                            <p>Or perform a search to filter the archives.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

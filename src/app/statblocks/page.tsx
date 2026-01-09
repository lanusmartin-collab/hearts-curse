"use client";

import { useState, useEffect } from "react";
import { STATBLOCKS, Statblock } from "@/lib/data/statblocks";
import { ALL_MONSTERS } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import StatblockGenerator from "@/components/ui/StatblockGenerator";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";

export default function StatblocksPage() {
    const [search, setSearch] = useState("");
    const [showGenerator, setShowGenerator] = useState(false);
    const [customCreatures, setCustomCreatures] = useState<Statblock[]>([]);

    // Filters
    const [filterType, setFilterType] = useState("All");
    const [filterLetter, setFilterLetter] = useState("All");

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

    // Combine and Deduplicate by Slug
    const combined = new Map<string, Statblock>();

    // 1. Add Legacy Statblocks (Preserve Keys as Slugs)
    Object.entries(STATBLOCKS).forEach(([key, s]) => {
        const slug = s.slug || key;
        combined.set(slug, { ...s, slug });
    });

    // 2. Add New Monsters (Overrides Legacy)
    Object.values(ALL_MONSTERS).forEach(s => {
        if (s.slug) {
            combined.set(s.slug, s);
        }
    });

    // 3. Add Custom (Overrides Everything)
    customCreatures.forEach(s => {
        // Normalize Key: Try slug, then name converted to slug-like string
        let key = s.slug;
        if (!key && s.name) {
            key = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }

        // Special Case: Catch "Larloch the Shadow King" if saved without slug
        if (s.name === "Larloch the Shadow King") key = "larloch";

        if (key) combined.set(key, s);
    });

    let allCreatures = Array.from(combined.values());

    // HARD FIX: Filter out "Old Larloch" if it somehow persists with a different key
    allCreatures = allCreatures.filter(c => {
        // Check for ANY Larloch
        if (c.name.includes("Larloch") && c.name.includes("Shadow King")) {
            // If CR is missing or low, it's garbage
            if (!c.cr || parseInt(String(c.cr)) < 28) return false;
        }
        return true;
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Derive unique types
    const allTypes = ["All", ...Array.from(new Set(allCreatures.map(c => c.type.split(' ')[0].replace(/[\(\)]/g, ''))))].sort();
    const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    const filtered = allCreatures.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.type.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "All" || s.type.includes(filterType);
        const matchesLetter = filterLetter === "All" || s.name.toUpperCase().startsWith(filterLetter);
        return matchesSearch && matchesType && matchesLetter;
    });

    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <h1>Monster Compendium</h1>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setShowGenerator(!showGenerator)}>
                        {showGenerator ? "[CLOSE FORGE]" : "[CREATE CREATURE]"}
                    </button>
                    <PrintButton />
                </div>
            </header>

            {showGenerator && <StatblockGenerator onSave={handleSave} />}

            {/* Filters */}
            <div className="retro-border" style={{ marginBottom: "2rem", padding: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", marginBottom: "1rem" }}>
                    <input
                        type="text"
                        placeholder="Search creatures..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ fontSize: "1.2rem" }}
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ width: "200px" }}
                    >
                        {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* A-Z Bar */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: "center" }}>
                    <button
                        onClick={() => setFilterLetter("All")}
                        style={{
                            padding: "0.2rem 0.5rem",
                            fontSize: "0.8rem",
                            background: filterLetter === "All" ? "var(--header-color)" : "transparent",
                            color: filterLetter === "All" ? "white" : "var(--fg-color)"
                        }}
                    >
                        ALL
                    </button>
                    {alphabet.map(l => (
                        <button
                            key={l}
                            onClick={() => setFilterLetter(l)}
                            style={{
                                padding: "0.2rem 0.5rem",
                                fontSize: "0.8rem",
                                background: filterLetter === l ? "var(--header-color)" : "transparent",
                                color: filterLetter === l ? "white" : "var(--fg-color)"
                            }}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: "grid", gap: "2rem" }}>
                {filtered.map((statblock, i) => (
                    <div key={i} style={{ breakInside: "avoid" }} className="fade-in">
                        <StatblockCard data={statblock} />
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p style={{ textAlign: "center", fontStyle: "italic", padding: "2rem" }}>No creatures found matching query.</p>
                )}
            </div>
        </div>
    );
}

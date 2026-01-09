"use client";

import { useState } from "react";
import { Statblock } from "@/lib/data/statblocks";
import { v4 as uuidv4 } from "uuid";

// Helper to calculate modifiers
const getMod = (score: number) => Math.floor((score - 10) / 2);

export default function StatblockGenerator({ onSave }: { onSave: (sb: Statblock) => void }) {
    const [sb, setSb] = useState<Partial<Statblock>>({
        name: "New Creature",
        size: "Medium",
        type: "Humanoid",
        alignment: "Unaligned",
        ac: 10,
        armorType: "None",
        hp: 10,
        hitDice: "1d8",
        speed: "30 ft.",
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        cr: "0",
        xp: 0,
        traits: [],
        actions: []
    });

    const handleChange = (field: string, value: any) => {
        setSb(prev => ({ ...prev, [field]: value }));
    };

    const handleStatChange = (stat: string, value: number) => {
        setSb(prev => ({
            ...prev,
            stats: { ...prev.stats, [stat]: value } as any
        }));
    };

    const addTrait = () => {
        setSb(prev => ({
            ...prev,
            traits: [...(prev.traits || []), { name: "New Trait", desc: "Description" }]
        }));
    };

    const updateTrait = (index: number, field: "name" | "desc", value: string) => {
        const newTraits = [...(sb.traits || [])];
        newTraits[index][field] = value;
        setSb(prev => ({ ...prev, traits: newTraits }));
    };

    const addAction = () => {
        setSb(prev => ({
            ...prev,
            actions: [...(prev.actions || []), { name: "Attack", desc: "Attack description" }]
        }));
    };

    const updateAction = (index: number, field: "name" | "desc", value: string) => {
        const newActions = [...(sb.actions || [])];
        newActions[index][field] = value;
        setSb(prev => ({ ...prev, actions: newActions }));
    };

    const save = () => {
        if (sb.name && sb.stats) {
            onSave(sb as Statblock);
            alert("Statblock Created!");
        }
    };

    if (!sb.stats) return null;

    return (
        <div className="retro-border" style={{ marginTop: "2rem" }}>
            <h3>Creature Forge (5e 2024 Template)</h3>

            {/* Basic Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <label>Name: <input value={sb.name} onChange={e => handleChange("name", e.target.value)} /></label>
                <label>Type: <input value={sb.type} onChange={e => handleChange("type", e.target.value)} /></label>
                <label>Size: <input value={sb.size} onChange={e => handleChange("size", e.target.value)} /></label>
                <label>Alignment: <input value={sb.alignment} onChange={e => handleChange("alignment", e.target.value)} /></label>
                <label>AC: <input type="number" value={sb.ac} onChange={e => handleChange("ac", parseInt(e.target.value))} /></label>
                <label>HP: <input type="number" value={sb.hp} onChange={e => handleChange("hp", parseInt(e.target.value))} /></label>
                <label>Speed: <input value={sb.speed} onChange={e => handleChange("speed", e.target.value)} /></label>
                <label>CR: <input value={sb.cr} onChange={e => handleChange("cr", e.target.value)} /></label>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {Object.keys(sb.stats).map(stat => (
                    <div key={stat} style={{ textAlign: "center" }}>
                        <div style={{ textTransform: "uppercase", fontSize: "0.8em" }}>{stat}</div>
                        <input
                            type="number"
                            value={(sb.stats as any)[stat]}
                            onChange={e => handleStatChange(stat, parseInt(e.target.value))}
                            style={{ width: "50px", textAlign: "center" }}
                        />
                        <div style={{ fontSize: "0.8em" }}>{getMod((sb.stats as any)[stat])}</div>
                    </div>
                ))}
            </div>

            {/* Dynamic Lists */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                    <h4>Traits <button onClick={addTrait} style={{ fontSize: "0.6em" }}>[+]</button></h4>
                    {sb.traits?.map((t, i) => (
                        <div key={i} style={{ marginBottom: "0.5rem", borderLeft: "2px solid red", paddingLeft: "0.5rem" }}>
                            <input value={t.name} onChange={e => updateTrait(i, "name", e.target.value)} style={{ fontWeight: "bold", width: "100%", marginBottom: "0.2rem" }} />
                            <textarea value={t.desc} onChange={e => updateTrait(i, "desc", e.target.value)} style={{ width: "100%", fontSize: "0.8em" }} />
                        </div>
                    ))}
                </div>
                <div>
                    <h4>Actions <button onClick={addAction} style={{ fontSize: "0.6em" }}>[+]</button></h4>
                    {sb.actions?.map((a, i) => (
                        <div key={i} style={{ marginBottom: "0.5rem", borderLeft: "2px solid red", paddingLeft: "0.5rem" }}>
                            <input value={a.name} onChange={e => updateAction(i, "name", e.target.value)} style={{ fontWeight: "bold", width: "100%", marginBottom: "0.2rem" }} />
                            <textarea value={a.desc} onChange={e => updateAction(i, "desc", e.target.value)} style={{ width: "100%", fontSize: "0.8em" }} />
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={save} style={{ marginTop: "2rem", width: "100%" }}>[SAVE CREATURE TO ARCHIVE]</button>
        </div>
    );
}

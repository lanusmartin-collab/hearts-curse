"use client";

import { useState } from "react";
import { Statblock } from "@/lib/data/statblocks";
import Image from "next/image";
import clsx from "clsx";

export default function StatblockCard({ data }: { data: Statblock }) {
    const [imgError, setImgError] = useState(false);

    const renderTrait = (trait: { name: string, desc: string }) => {
        const isSpellcasting = trait.name.toLowerCase().includes("spellcasting");

        if (!isSpellcasting) {
            return (
                <div style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ fontFamily: "var(--adnd-font-header)", fontSize: "1.1em" }}><em>{trait.name}.</em></strong> <span style={{ whiteSpace: "pre-wrap" }}>{trait.desc}</span>
                </div>
            );
        }

        let desc = trait.desc;
        desc = desc.replace(/:\s*(At will|Cantrips|\d+\/day)/gi, ":\n$1");

        const headerPattern = /((?:Cantrips|At will|\d+[\s\u00A0]*\/[\s\u00A0]*[Dd]ay|\d+(?:st|nd|rd|th)[\s\u00A0]+level).*?:)/gi;

        const parts = desc.split(headerPattern);
        const groups = [];

        for (let i = 1; i < parts.length; i += 2) {
            const header = parts[i];
            const content = parts[i + 1];
            if (header && content) {
                groups.push({ header: header.trim(), content: content.trim() });
            }
        }

        const parseFailed = groups.length === 0;

        if (parseFailed) {
            return (
                <div style={{ marginBottom: "0.5rem" }}>
                    <strong><em>{trait.name}.</em></strong> <span style={{ whiteSpace: "pre-wrap" }}>{trait.desc}</span>
                </div>
            );
        }

        const intro = parts[0].trim();

        return (
            <div style={{ position: 'relative', marginBottom: "0.5rem" }}>
                <strong><em>{trait.name}.</em></strong>

                {intro && (
                    <div style={{ whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}>
                        {intro}
                    </div>
                )}

                <div style={{ marginLeft: "1rem" }}>
                    {groups.map((g, idx) => (
                        <div key={idx} style={{ marginBottom: "0.2rem", textIndent: "-1rem", paddingLeft: "1rem" }}>
                            <strong style={{ color: "var(--scarlet-accent)" }}>{g.header}</strong> {g.content}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            width: "100%",
            padding: "2rem",
            paddingLeft: "2.5rem",
            position: "relative",
            color: "var(--adnd-ink)",
            background: "var(--adnd-bg)",
            boxShadow: "5px 5px 15px rgba(0,0,0,0.5)",
            border: "1px solid #c9bca0",
            fontFamily: "var(--adnd-font-body)",
            lineHeight: "1.4"
        }}>

            {/* Image (Floating Right) */}
            {data.image && !imgError && (
                <div style={{ float: "right", marginLeft: "1.5rem", marginBottom: "1rem", maxWidth: "180px", border: "4px solid #2c1a1a" }}>
                    <Image
                        src={data.image}
                        alt={data.name}
                        width={180}
                        height={180}
                        style={{ display: "block" }}
                        unoptimized
                        onError={() => setImgError(true)}
                    />
                </div>
            )}

            {/* Header */}
            <h2 style={{
                fontFamily: "var(--adnd-font-header)",
                color: "var(--adnd-blue)",
                borderBottom: "2px solid var(--adnd-blue)",
                marginBottom: "0.5rem",
                clear: "none",
                fontSize: "2rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textShadow: "none"
            }}>
                {data.name}
            </h2>
            <div style={{ fontStyle: "italic", marginBottom: "1rem", fontFamily: "var(--adnd-font-body)", fontSize: "1rem", color: "#333" }}>
                {data.size} {data.type}, {data.alignment}
            </div>

            <hr style={{ border: "0", borderTop: "2px solid var(--adnd-ink)", marginBottom: "1rem" }} />

            {/* Core Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", fontSize: "1rem" }}>
                <div>
                    <div><strong>Armor Class</strong> {data.ac} {data.armorType ? `(${data.armorType})` : ""}</div>
                    <div><strong>Hit Points</strong> {data.hp} {data.hitDice ? `(${data.hitDice})` : ""}</div>
                    <div><strong>Speed</strong> {data.speed}</div>
                </div>
                <div>
                    <div><strong>Challenge</strong> {data.cr} {data.xp ? `(${data.xp} XP)` : ""}</div>
                    <div><strong>Proficiency Bonus</strong> +{Math.max(2, Math.floor((Math.max(0, parseInt(data.cr) || 0) - 1) / 4) + 2)}</div>
                    <div><strong>Initiative</strong> {data.initiative !== undefined ? (data.initiative >= 0 ? "+" : "") + data.initiative : ""}</div>
                </div>
            </div>

            {/* Ability Scores Table - Classic Box */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                border: "2px solid #5d4037",
                background: "#f0e6d2",
                padding: "0.75rem",
                marginBottom: "1.5rem",
                textAlign: "center"
            }}>
                {data.stats && Object.entries(data.stats).map(([stat, val]) => (
                    <div key={stat}>
                        <div style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "0.9em", fontFamily: "var(--adnd-font-header)" }}>{stat}</div>
                        <div style={{ fontSize: "1.2rem" }}>{val} <span style={{ fontSize: "0.9rem", color: "#666" }}>({Math.floor((val - 10) / 2) >= 0 ? "+" : ""}{Math.floor((val - 10) / 2)})</span></div>
                    </div>
                ))}
            </div>

            {/* Skills & Saves */}
            <div style={{ marginBottom: "1.5rem", fontSize: "1rem" }}>
                {data.saves && <div><strong>Saving Throws</strong> {data.saves}</div>}
                {data.skills && <div><strong>Skills</strong> {data.skills}</div>}
                {data.immunities && <div><strong>Damage Immunities</strong> {data.immunities}</div>}
                {data.resistances && <div><strong>Damage Resistances</strong> {data.resistances}</div>}
                {data.conditionImmunities && <div><strong>Condition Immunities</strong> {data.conditionImmunities}</div>}
                {data.senses && <div><strong>Senses</strong> {data.senses}</div>}
                {data.languages && <div><strong>Languages</strong> {data.languages}</div>}
            </div>

            <hr style={{ border: "0", borderTop: "2px solid var(--adnd-blue)", marginBottom: "1.5rem", clear: "both" }} />

            {/* Traits */}
            {data.traits && (
                <div style={{ marginBottom: "1.5rem" }}>
                    {data.traits.map((trait, i) => (
                        <div key={i}>{renderTrait(trait)}</div>
                    ))}
                </div>
            )}

            {/* Actions */}
            {data.actions && data.actions.length > 0 && (
                <>
                    <h3 style={{
                        fontFamily: "var(--adnd-font-header)",
                        color: "var(--adnd-blue)",
                        borderBottom: "1px solid var(--adnd-blue)",
                        marginTop: "1.5rem",
                        marginBottom: "1rem",
                        fontSize: "1.4rem",
                        textShadow: "none"
                    }}>Actions</h3>
                    {data.actions.map((action, i) => (
                        <div key={i} style={{ marginBottom: "0.8rem" }}>
                            {renderTrait(action)}
                        </div>
                    ))}
                </>
            )}

            {/* Legendary Actions */}
            {data.legendary && Array.isArray(data.legendary) && data.legendary.length > 0 && (
                <>
                    <h3 style={{
                        fontFamily: "var(--adnd-font-header)",
                        color: "var(--adnd-blue)",
                        borderBottom: "1px solid var(--adnd-blue)",
                        marginTop: "1.5rem",
                        marginBottom: "1rem",
                        fontSize: "1.4rem",
                        textShadow: "none"
                    }}>Legendary Actions</h3>
                    <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                        The {data.name} can take 3 legendary actions...
                    </p>
                    {data.legendary.map((action, i) => (
                        <div key={i} style={{ marginBottom: "0.8rem" }}>
                            <strong>{action.name}.</strong> {action.desc}
                        </div>
                    ))}
                </>
            )}

            {/* Treasure */}
            {data.treasure && (
                <div style={{ marginTop: "1.5rem", borderTop: "2px solid #5d4037", paddingTop: "0.75rem", fontSize: "1rem", background: "rgba(0,0,0,0.05)", padding: "1rem" }}>
                    <strong style={{ fontFamily: "var(--adnd-font-header)", fontSize: "1.1rem" }}>Treasure:</strong> {data.treasure}
                </div>
            )}
        </div>
    );
}

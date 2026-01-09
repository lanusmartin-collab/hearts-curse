import { Statblock } from "@/lib/data/statblocks";
import Image from "next/image";
import clsx from "clsx";

export default function StatblockCard({ data }: { data: Statblock }) {

    const renderTrait = (trait: { name: string, desc: string }) => {
        const isSpellcasting = trait.name.toLowerCase().includes("spellcasting");

        if (!isSpellcasting) {
            return (
                <>
                    <strong><em>{trait.name}.</em></strong> <span style={{ whiteSpace: "pre-wrap" }}>{trait.desc}</span>
                </>
            );
        }

        let desc = trait.desc;
        // 1. Normalize: Inject newlines before known headers if missing or stuck to colon
        desc = desc.replace(/:\s*(At will|Cantrips|\d+\/day)/gi, ":\n$1");

        // 2. Pattern to split by. 
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

        // Fallback: If no groups found (e.g. Mephit with just 1 line), render standard
        if (parseFailed) {
            return (
                <>
                    <strong><em>{trait.name}.</em></strong> <span style={{ whiteSpace: "pre-wrap" }}>{trait.desc}</span>
                </>
            );
        }

        const intro = parts[0].trim();

        return (
            <div style={{ position: 'relative' }}>
                <strong><em>{trait.name}.</em></strong>

                {intro && (
                    <div style={{ whiteSpace: "pre-wrap", marginBottom: "0.5rem" }}>
                        {intro}
                    </div>
                )}

                <div style={{ marginLeft: "1rem" }}>
                    {groups.map((g, idx) => (
                        <div key={idx} style={{ marginBottom: "0.2rem", textIndent: "-1rem", paddingLeft: "1rem" }}>
                            <strong style={{ color: "#8a1c1c" }}>{g.header}</strong> {g.content}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={clsx("retro-border", "statblock-card")} style={{ background: "#fdf5c9", color: "#3e2723", fontFamily: "var(--font-stats)", position: "relative" }}>
            {/* Image (Floating Right) */}
            {data.image && (
                <div style={{ float: "right", marginLeft: "1rem", marginBottom: "1rem", maxWidth: "150px" }}>
                    <Image
                        src={data.image}
                        alt={data.name}
                        width={150}
                        height={150}
                        style={{ width: "100%", height: "auto", borderRadius: "8px", border: "2px solid #8a1c1c", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
                        unoptimized
                    />
                </div>
            )}

            {/* Header */}
            <h2 style={{
                fontFamily: "var(--font-serif)",
                color: "#8a1c1c",
                borderBottom: "2px solid #8a1c1c",
                marginBottom: "0.2rem",
                clear: "none" // Allow header to wrap around float if needed
            }}>
                {data.name}
            </h2>
            <div style={{ fontStyle: "italic", marginBottom: "1rem" }}>
                {data.size} {data.type}, {data.alignment}
            </div>

            {data.description && (
                <div style={{ marginBottom: "1rem", fontStyle: "italic", fontSize: "0.9rem", color: "#666" }}>
                    {data.description}
                </div>
            )}

            <hr style={{ border: "1px solid #8a1c1c", marginBottom: "1rem" }} />

            {/* Core Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <div>
                    <div><strong>Armor Class</strong> {data.ac} {data.armorType ? `(${data.armorType})` : ""}</div>
                    <div><strong>Hit Points</strong> {data.hp} {data.hitDice ? `(${data.hitDice})` : ""}</div>
                    <div><strong>Speed</strong> {data.speed}</div>
                </div>
                <div>
                    <div><strong>CR</strong> {data.cr} {data.xp ? `(${data.xp} XP)` : ""}</div>
                    <div><strong>Proficiency Bonus</strong> +{Math.max(2, Math.floor((Math.max(0, parseInt(data.cr) || 0) - 1) / 4) + 2)}</div>
                    <div><strong>Initiative</strong> {data.initiative !== undefined ? (data.initiative >= 0 ? "+" : "") + data.initiative : ""}</div>
                </div>
            </div>

            {/* Ability Scores */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                background: "rgba(138, 28, 28, 0.1)",
                padding: "0.5rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                textAlign: "center"
            }}>
                {data.stats && Object.entries(data.stats).map(([stat, val]) => (
                    <div key={stat}>
                        <div style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "0.8em" }}>{stat}</div>
                        <div>{val} ({Math.floor((val - 10) / 2) >= 0 ? "+" : ""}{Math.floor((val - 10) / 2)})</div>
                    </div>
                ))}
            </div>

            {/* Skills & Saves */}
            <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                {data.saves && <div><strong>Saving Throws</strong> {data.saves}</div>}
                {data.skills && <div><strong>Skills</strong> {data.skills}</div>}
                {data.immunities && <div><strong>Damage Immunities</strong> {data.immunities}</div>}
                {data.resistances && <div><strong>Damage Resistances</strong> {data.resistances}</div>}
                {data.conditionImmunities && <div><strong>Condition Immunities</strong> {data.conditionImmunities}</div>}
                {data.senses && <div><strong>Senses</strong> {data.senses}</div>}
                {data.languages && <div><strong>Languages</strong> {data.languages}</div>}
            </div>

            <hr style={{ border: "1px solid #8a1c1c", marginBottom: "1rem", clear: "both" }} />

            {/* Traits */}
            {data.traits && data.traits.map((trait, i) => (
                <div key={i} style={{ marginBottom: "0.8rem" }}>
                    {renderTrait(trait)}
                </div>
            ))}

            {/* Actions */}
            {data.actions && data.actions.length > 0 && (
                <>
                    <h3 style={{ borderBottom: "1px solid #5d4037", marginTop: "1rem", fontSize: "1.2rem" }}>Actions</h3>
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
                    <h3 style={{ borderBottom: "1px solid #5d4037", marginTop: "1rem", fontSize: "1.2rem" }}>Legendary Actions</h3>
                    <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
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
                <div style={{ marginTop: "1rem", borderTop: "1px solid #5d4037", paddingTop: "0.5rem", fontSize: "0.9rem" }}>
                    <strong>Treasure:</strong> {data.treasure}
                </div>
            )}
        </div>
    );
}

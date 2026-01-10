import { CAMPAIGN_LORE, FACTIONS } from "@/lib/data/lore";
import PrintButton from "@/components/ui/PrintButton";
import CommandBar from "@/components/ui/CommandBar";

export default function LorePage() {
    return (
        <div className="retro-container">
            <CommandBar />

            <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>The Archives</h1>
                <PrintButton />
            </header>

            <div className="lore-content">
                {CAMPAIGN_LORE.map((section) => (
                    <article key={section.id} style={{ marginBottom: "4rem", breakInside: "avoid" }}>
                        <h2 style={{ fontSize: "1.5rem" }}>{section.title}</h2>
                        <div
                            className="parchment-panel"
                            style={{ whiteSpace: "pre-line" }}
                        >
                            {section.content}
                        </div>
                    </article>
                ))}

                <article style={{ marginBottom: "4rem", breakInside: "avoid" }}>
                    <h2 style={{ fontSize: "1.5rem", color: "var(--accent-color)", textShadow: "0 0 10px var(--accent-glow)" }}>Factions & Alliances</h2>
                    <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                        {FACTIONS.map(faction => (
                            <div key={faction.id} className="retro-border" style={{ position: "relative", overflow: "hidden" }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0, right: 0,
                                    background: "var(--accent-dim)",
                                    color: "#000",
                                    padding: "2px 8px",
                                    fontSize: "0.7rem",
                                    fontWeight: "bold"
                                }}>
                                    {faction.alignment}
                                </div>
                                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{faction.name}</h3>
                                <p style={{ fontSize: "0.9rem", color: "var(--fg-dim)", marginBottom: "1rem" }}>{faction.description}</p>

                                <h4 style={{ fontSize: "0.9rem", color: "var(--accent-color)", marginBottom: "0.2rem" }}>Key Members:</h4>
                                <ul style={{ listStyle: "none", padding: 0, fontSize: "0.9rem" }}>
                                    {faction.members.map(m => (
                                        <li key={m} style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border-color)", marginBottom: "4px" }}>
                                            {m}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontFamily: "var(--font-mono)", opacity: 0.8 }}>
                                    <strong>GOALS:</strong> {faction.goals.join(" • ")}
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}

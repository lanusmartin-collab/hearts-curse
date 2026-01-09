import { PROLOGUE_POWERS, SAFE_HAVEN } from "@/lib/data/mechanics";
import CurseTracker from "@/components/ui/CurseTracker";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";

export default function MechanicsPage() {
    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>System Mechanics</h1>
                <PrintButton />
            </header>

            <div style={{ display: "grid", gap: "3rem" }}>
                {/* Active Curse Tracker */}
                <CurseTracker />

                {/* Prologue Powers */}
                <section>
                    <h2>{PROLOGUE_POWERS.title}</h2>
                    <div className="retro-border">
                        <ul>
                            {PROLOGUE_POWERS.bonuses.map((bonus, i) => (
                                <li key={i} style={{ padding: "0.5rem 0", listStyle: "inside square" }}>{bonus}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Safe Haven */}
                <section>
                    <h2>{SAFE_HAVEN.title}</h2>
                    <div className="retro-border">
                        <p>Access Code: <strong>CANDLEKEEP</strong></p>
                        <ul style={{ marginTop: "1rem" }}>
                            {SAFE_HAVEN.features.map((feat, i) => (
                                <li key={i} style={{ listStyle: "inside '> '" }}>{feat}</li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}

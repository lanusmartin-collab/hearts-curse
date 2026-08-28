"use client";

import { Tablet, Wifi, Zap, CheckCircle2, ShieldCheck, Sparkles, Smartphone, Layers, Maximize2 } from "lucide-react";
import Link from "next/link";

export default function VersionPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--obsidian-base)", color: "var(--fg-color)", padding: "2rem" }}>
            <div className="retro-container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
                
                {/* Header */}
                <div style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.5rem", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <Tablet className="text-[var(--scarlet-accent)]" size={32} />
                        <h1 style={{ margin: 0, fontSize: "2rem", fontFamily: "var(--font-header)", color: "var(--scarlet-accent)", letterSpacing: "0.1em" }}>
                            SYSTEM STATUS & TABLET DIAGNOSTICS
                        </h1>
                    </div>
                    <p style={{ margin: 0, color: "var(--gold-accent)", fontSize: "0.85rem", opacity: 0.85, fontFamily: "var(--font-mono)" }}>
                        HEART&apos;S CURSE // BUILD v1.3.1 (TABLET & MULTI-TOUCH ENHANCED EDITION)
                    </p>
                </div>

                {/* Status Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                    
                    {/* Core Status */}
                    <div className="card" style={{ background: "rgba(10, 10, 12, 0.8)", border: "1px solid var(--glass-border)", padding: "1.5rem", borderRadius: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                            <ShieldCheck className="text-emerald-400" size={20} />
                            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--gold-accent)" }}>Engine Status</h3>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "0.4rem" }}>
                                <span className="text-[#888]">Core Build</span>
                                <span className="font-mono text-emerald-400 font-bold">v1.3.1 Production Ready</span>
                            </li>
                            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "0.4rem" }}>
                                <span className="text-[#888]">Next.js Static Export</span>
                                <span className="font-mono text-emerald-400">Optimized (21 Routes)</span>
                            </li>
                            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #222", paddingBottom: "0.4rem" }}>
                                <span className="text-[#888]">Network Binding</span>
                                <span className="font-mono text-emerald-400">0.0.0.0 (All Interfaces)</span>
                            </li>
                            <li style={{ display: "flex", justifyContent: "space-between" }}>
                                <span className="text-[#888]">PWA Offline Engine</span>
                                <span className="font-mono text-emerald-400">Enabled</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tablet Capabilities */}
                    <div className="card" style={{ background: "rgba(10, 10, 12, 0.8)", border: "1px solid var(--glass-border)", padding: "1.5rem", borderRadius: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                            <Sparkles className="text-[var(--gold-accent)]" size={20} />
                            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--gold-accent)" }}>Tablet & Touch Matrix</h3>
                        </div>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span><strong>Interactive Maps:</strong> Two-finger pinch zoom, pan & on-screen HUD buttons</span>
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span><strong>Combat Battlemap:</strong> Touch token dragging with coordinate clamping</span>
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span><strong>Fate Weaver:</strong> Touch draggable floating d20 dice widget</span>
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                <span><strong>Monster Codex:</strong> Responsive 3-pane & horizontal tablet tabs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* How to Connect Your Tablet Guide */}
                <div style={{ background: "rgba(138, 28, 28, 0.08)", border: "1px solid rgba(138, 28, 28, 0.4)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                        <Wifi className="text-[var(--scarlet-accent)]" size={24} />
                        <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--gold-accent)", fontFamily: "var(--font-header)" }}>
                            HOW TO RUN ON YOUR TABLET (IPAD / ANDROID / SURFACE)
                        </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem", lineHeight: "1.6" }}>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--scarlet-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", flexShrink: 0 }}>1</span>
                            <div>
                                <strong>Connect to Same Wi-Fi:</strong> Ensure your tablet and PC are connected to the same local Wi-Fi router.
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--scarlet-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", flexShrink: 0 }}>2</span>
                            <div>
                                <strong>Launch App on PC:</strong> Double-click <code>start_app.bat</code> in the <code>web-app</code> directory. The command window will automatically output your local IP address (e.g. <code>http://192.168.1.50:3000</code>).
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--scarlet-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", flexShrink: 0 }}>3</span>
                            <div>
                                <strong>Open on Tablet Browser:</strong> Open Safari (on iPad) or Chrome (on Android) and navigate to <code>http://&lt;YOUR_PC_IP&gt;:3000</code>.
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--scarlet-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", flexShrink: 0 }}>4</span>
                            <div>
                                <strong>Install for Full-Screen App Mode (Optional):</strong>
                                <ul style={{ marginLeft: "1.2rem", marginTop: "0.25rem", listStyleType: "disc" }}>
                                    <li><strong>iPad (Safari):</strong> Tap the <em>Share</em> button (box with arrow) &rarr; Select <strong>&quot;Add to Home Screen&quot;</strong>.</li>
                                    <li><strong>Android (Chrome):</strong> Tap the three-dot menu &rarr; Select <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
                    <Link
                        href="/"
                        className="retro-btn"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                        &larr; Return to Sanctum
                    </Link>

                    <Link
                        href="/maps"
                        className="compact-btn"
                    >
                        Test Interactive Map &rarr;
                    </Link>
                </div>

            </div>
        </div>
    );
}


"use client";

import { useState, useRef } from "react";

type Theme = "standard" | "zhentarim" | "drow" | "larloch" | "oakhaven";

const THEMES: Record<Theme, { bg: string, color: string, font: string, seal: string }> = {
    standard: { bg: "#ffffff", color: "#000000", font: "Courier New", seal: "" },
    zhentarim: { bg: "#f5e6c8", color: "#2d3436", font: "Garamond, serif", seal: "/images/seal-zhentarim.png" },
    drow: { bg: "#1a1a1a", color: "#dfe6e9", font: "Verdana, sans-serif", seal: "/images/seal-drow.png" },
    larloch: { bg: "#3e3b3b", color: "#ffeaa7", font: "Impact, sans-serif", seal: "/images/seal-larloch.png" },
    oakhaven: { bg: "#fff0f0", color: "#2c3e50", font: "Georgia, serif", seal: "/images/seal-oakhaven.png" }
};

export default function HandoutEditor() {
    const [text, setText] = useState("To the Heroes of Oakhaven,\n\nWe have been watching you...\n\n- The Black Network");
    const [theme, setTheme] = useState<Theme>("zhentarim");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [customSeal, setCustomSeal] = useState<string | null>(null);

    // File Input Refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const sealInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomSeal(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const currentStyle = THEMES[theme];
    const activeSeal = customSeal || currentStyle.seal;

    return (
        <div style={{ display: "flex", gap: "2rem", minHeight: "100vh", padding: "2rem" }}>

            {/* CONTROLS (Hidden on Print) */}
            <div className="no-print" style={{ width: "300px", background: "#111", padding: "1.5rem", borderRadius: "8px", border: "1px solid #444", color: "white" }}>
                <h2 style={{ color: "var(--accent-color)", marginTop: 0 }}>Fabricator</h2>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#888" }}>FACTION THEME</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        {(Object.keys(THEMES) as Theme[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                style={{
                                    padding: "0.5rem",
                                    border: theme === t ? "1px solid var(--accent-color)" : "1px solid #333",
                                    background: theme === t ? "rgba(0, 255, 65, 0.1)" : "#222",
                                    color: theme === t ? "var(--accent-color)" : "#aaa",
                                    cursor: "pointer",
                                    textTransform: "capitalize"
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#888" }}>CONTENT</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{
                            width: "100%",
                            height: "150px",
                            background: "#222",
                            border: "1px solid #444",
                            color: "white",
                            padding: "0.5rem"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#888" }}>UPLOAD IMAGE (MAP/PROP)</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        style={{ width: "100%", color: "#aaa" }}
                    />
                    {uploadedImage && <button onClick={() => setUploadedImage(null)} style={{ marginTop: "0.5rem", color: "red", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>[CLEAR IMAGE]</button>}
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "#888" }}>UPLOAD CUSTOM SEAL</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={sealInputRef}
                        onChange={handleSealUpload}
                        style={{ width: "100%", color: "#aaa" }}
                    />
                </div>

                <button
                    onClick={handlePrint}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        background: "var(--accent-color)",
                        color: "black",
                        fontWeight: "bold",
                        border: "none",
                        cursor: "pointer",
                        textTransform: "uppercase"
                    }}
                >
                    PRINT DELIVERABLE
                </button>
            </div>

            {/* PREVIEW (This Prints) */}
            <div className="print-area" style={{
                flex: 1,
                background: currentStyle.bg,
                color: currentStyle.color,
                fontFamily: currentStyle.font,
                padding: "3rem",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                position: "relative",
                minHeight: "800px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {/* WAX SEAL (Top Right) */}
                {activeSeal && (
                    <div style={{ position: "absolute", top: "2rem", right: "2rem", width: "120px", height: "120px", opacity: 0.9 }}>
                        <img src={activeSeal} alt="Seal" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }} />
                    </div>
                )}

                {/* CONTENT */}
                {uploadedImage ? (
                    <img
                        src={uploadedImage}
                        alt="Uploaded Prop"
                        style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
                    />
                ) : (
                    <div style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "1.2rem",
                        lineHeight: 1.6,
                        width: "100%",
                        maxWidth: "600px"
                    }}>
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
}

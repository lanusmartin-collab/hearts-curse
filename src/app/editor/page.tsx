"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

type ContentItem = {
    id: string;
    type: "Chapter" | "NPC" | "Location";
    title: string;
    body: string;
    date: string;
};

export default function EditorPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [type, setType] = useState<ContentItem["type"]>("Chapter");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("dm_content");
        if (saved) {
            // eslint-disable-next-line
            setItems(JSON.parse(saved));
        }
    }, []);

    const saveContent = () => {
        if (!title || !body) return;
        const newItem: ContentItem = {
            id: uuidv4(),
            type,
            title,
            body,
            date: new Date().toLocaleString()
        };
        const updated = [newItem, ...items];
        setItems(updated);
        localStorage.setItem("dm_content", JSON.stringify(updated));
        setTitle("");
        setBody("");
    };

    const deleteContent = (id: string) => {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        localStorage.setItem("dm_content", JSON.stringify(updated));
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "campaign_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="retro-container">
            <Link href="/" className="no-print">{"< BACK_TO_ROOT"}</Link>
            <header style={{ margin: "2rem 0" }}>
                <h1>DM&apos;s Notebook</h1>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                {/* Editor Form */}
                <div className="retro-border">
                    <h3>New Entry</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as ContentItem["type"])}
                            style={{ padding: "0.5rem", fontFamily: "var(--font-mono)" }}
                        >
                            <option value="Chapter">Chapter</option>
                            <option value="NPC">NPC</option>
                            <option value="Location">Location</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ padding: "0.5rem", fontFamily: "var(--font-mono)" }}
                        />
                        <textarea
                            placeholder="Content..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={10}
                            style={{ padding: "0.5rem", fontFamily: "var(--font-mono)" }}
                        />
                        <button onClick={saveContent} style={{ padding: "0.5rem", cursor: "pointer", background: "var(--bg-color)", color: "var(--fg-color)", border: "1px solid" }}>
                            [SAVE_TO_DISK]
                        </button>
                    </div>
                </div>

                {/* Saved Items */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3>Saved Files ({items.length})</h3>
                        <button onClick={exportData} style={{ fontSize: "0.8em", textDecoration: "underline", background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer" }}>[EXPORT_JSON]</button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {items.map((item) => (
                            <div key={item.id} className="retro-border">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <strong>[{item.type.toUpperCase()}] {item.title}</strong>
                                    <button onClick={() => deleteContent(item.id)} style={{ color: "var(--error-color)", cursor: "pointer", background: "none", border: "none" }}>[DEL]</button>
                                </div>
                                <div style={{ fontSize: "0.8em", opacity: 0.7, marginBottom: "0.5rem" }}>{item.date}</div>
                                <div style={{ whiteSpace: "pre-wrap" }}>{item.body.substring(0, 100)}...</div>
                            </div>
                        ))}
                        {items.length === 0 && <p style={{ fontStyle: "italic", opacity: 0.5 }}>No data found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

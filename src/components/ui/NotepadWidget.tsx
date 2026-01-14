"use client";

import { useState, useEffect } from "react";
import { PenTool, Save, Trash2 } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

export default function NotepadWidget() {
    const [note, setNote] = useState("");
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('heart_curse_dm_notes');
        if (saved) setNote(saved);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setNote(newVal);
        localStorage.setItem('heart_curse_dm_notes', newVal);
        setLastSaved(new Date().toLocaleTimeString());
    };

    return (
        <DashboardWidget title="DM Notes" subtitle="Scratchpad" icon={PenTool} href="/editor">
            <div className="flex flex-col h-full min-h-[200px]">
                <textarea
                    className="flex-1 w-full bg-[#1a1a1a] border border-[#333] p-3 text-sm font-mono text-[var(--fg-dim)] resize-none outline-none focus:border-[var(--gold-accent)] transition-colors custom-scrollbar"
                    placeholder="Session notes, initiative tracking, quick reminders..."
                    value={note}
                    onChange={handleChange}
                    style={{ minHeight: "150px" }}
                />
                <div className="flex justify-between items-center mt-2 text-[10px] text-[var(--fg-dim)] uppercase tracking-wider">
                    <span className="opacity-50">
                        {lastSaved ? `Saved: ${lastSaved}` : 'Auto-save active'}
                    </span>
                    <button
                        onClick={() => {
                            if (confirm("Clear scratchpad?")) {
                                setNote("");
                                localStorage.removeItem('heart_curse_dm_notes');
                            }
                        }}
                        className="hover:text-[var(--scarlet-accent)] transition-colors"
                    >
                        CLEAR
                    </button>
                </div>
            </div>
        </DashboardWidget>
    );
}

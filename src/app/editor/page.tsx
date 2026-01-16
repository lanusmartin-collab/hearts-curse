"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import CommandBar from "@/components/ui/CommandBar";
import PrintButton from "@/components/ui/PrintButton";
import StatblockGenerator from "@/components/ui/StatblockGenerator";
import StatblockCard from "@/components/ui/StatblockCard";
import { Statblock } from "@/lib/data/statblocks";
import { FileText, Hammer, Save, Trash2, BookOpen, Scroll } from "lucide-react";

type ContentItem = {
    id: string;
    type: "Chapter" | "NPC" | "Location" | "Statblock";
    title: string;
    body: string; // For Statblocks, this will store the JSON stringified data
    date: string;
};

export default function EditorPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [mode, setMode] = useState<"write" | "forge" | "view">("write"); // write=editor, forge=statblock, view=reading

    // Editor State
    const [activeItem, setActiveItem] = useState<ContentItem | null>(null);
    const [editorType, setEditorType] = useState<ContentItem["type"]>("Chapter");
    const [editorTitle, setEditorTitle] = useState("");
    const [editorBody, setEditorBody] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("dm_content");
        if (saved) {
            try { setItems(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
    }, []);

    const saveContent = (type: ContentItem["type"], title: string, bodyContent: string) => {
        if (!title) return;
        const newItem: ContentItem = {
            id: uuidv4(),
            type,
            title,
            body: bodyContent,
            date: new Date().toLocaleString()
        };
        const updated = [newItem, ...items];
        setItems(updated);
        localStorage.setItem("dm_content", JSON.stringify(updated));

        // Reset if saving from basic editor
        if (mode === "write") {
            setEditorTitle("");
            setEditorBody("");
        }

        // Switch to view to see the result
        setActiveItem(newItem);
        setMode("view");
    };

    const deleteContent = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Permanently delete this file?")) return;
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        localStorage.setItem("dm_content", JSON.stringify(updated));
        if (activeItem?.id === id) {
            setActiveItem(null);
            setMode("write");
        }
    };

    const handleStatblockSave = (sb: Statblock) => {
        saveContent("Statblock", sb.name, JSON.stringify(sb));
    };

    const openItem = (item: ContentItem) => {
        setActiveItem(item);
        setMode("view");
    };

    return (
        <div className="retro-container min-h-screen bg-[#0a0a0a] text-[#d4d4d4] flex flex-col">
            <CommandBar />

            {/* Header */}
            <header className="p-6 border-b border-[#333] flex justify-between items-center bg-[#0e0e0e]">
                <div>
                    <h1 className="text-3xl font-header tracking-widest text-[var(--gold-accent)] mb-1">CAMPAIGN ARCHITECT</h1>
                    <p className="text-xs font-mono text-[#666]">WORLD BUILDING & CONTENT SUITE v3.0</p>
                </div>
                <div className="flex gap-4">
                    <PrintButton />
                    <Link href="/" className="no-print text-xs uppercase tracking-widest text-[#666] hover:text-white border border-[#333] px-4 py-2 rounded transition">
                        Return to Sanctum
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - File Browser */}
                <div className="w-80 bg-[#0e0e0e] border-r border-[#333] flex flex-col no-print shrink-0">
                    <div className="p-4 border-b border-[#333] flex gap-2">
                        <button
                            onClick={() => setMode("write")}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border rounded transition-all ${mode === "write" ? "bg-[var(--gold-accent)] text-black border-[var(--gold-accent)]" : "bg-[#111] border-[#333] text-[#666] hover:border-[#666]"}`}
                        >
                            <FileText className="w-4 h-4 mx-auto mb-1" /> NOTEBOOK
                        </button>
                        <button
                            onClick={() => setMode("forge")}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border rounded transition-all ${mode === "forge" ? "bg-[var(--gold-accent)] text-black border-[var(--gold-accent)]" : "bg-[#111] border-[#333] text-[#666] hover:border-[#666]"}`}
                        >
                            <Hammer className="w-4 h-4 mx-auto mb-1" /> FORGE
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        <h3 className="px-2 py-1 text-[10px] font-mono uppercase text-[#444] tracking-widest">Saved Archives</h3>
                        {items.length === 0 && <div className="p-4 text-center text-xs text-[#444] italic">No files found.</div>}
                        {items.map(item => (
                            <div
                                key={item.id}
                                onClick={() => openItem(item)}
                                className={`
                                    p-3 border rounded cursor-pointer group transition-all relative
                                    ${activeItem?.id === item.id
                                        ? "bg-[var(--gold-accent)]/10 border-[var(--gold-accent)] text-[var(--gold-accent)]"
                                        : "bg-[#111] border-[#222] text-[#888] hover:border-[#444] hover:text-[#bbb]"}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-bold text-sm truncate pr-6">{item.title}</div>
                                    <button onClick={(e) => deleteContent(item.id, e)} className="absolute right-2 top-2 p-1 text-[#444] hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-black/30 rounded border border-white/10">{item.type}</span>
                                    <span className="text-[10px] text-white/20">{item.date.split(',')[0]}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t border-[#333] text-[10px] text-[#444] text-center font-mono">
                        LOCAL STORAGE: {JSON.stringify(items).length} BYTES
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8 printable-content relative bg-[url('/img/grid_pattern.png')]">

                    {/* WRITE MODE */}
                    {mode === "write" && (
                        <div className="max-w-3xl mx-auto animate-fade-in">
                            <h2 className="text-xl font-header text-[#666] mb-6 flex items-center gap-2"><Scroll className="w-5 h-5" /> NEW ENTRY</h2>
                            <div className="bg-[#111] border border-[#333] p-6 rounded shadow-xl">
                                <div className="flex gap-4 mb-4">
                                    <select
                                        value={editorType}
                                        onChange={(e) => setEditorType(e.target.value as any)}
                                        className="bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[var(--gold-accent)] focus:border-[var(--gold-accent)] outline-none"
                                    >
                                        <option value="Chapter">Chapter</option>
                                        <option value="NPC">NPC Profile</option>
                                        <option value="Location">Location</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Entry Title"
                                        className="flex-1 bg-[#0a0a0a] border border-[#333] p-2 text-sm text-white focus:border-[var(--gold-accent)] outline-none"
                                        value={editorTitle}
                                        onChange={e => setEditorTitle(e.target.value)}
                                    />
                                </div>
                                <textarea
                                    className="w-full h-[60vh] bg-[#0a0a0a] border border-[#333] p-4 text-[#ccc] font-serif text-lg leading-relaxed resize-none focus:border-[var(--gold-accent)] outline-none"
                                    placeholder="Write your content here..."
                                    value={editorBody}
                                    onChange={e => setEditorBody(e.target.value)}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => saveContent(editorType, editorTitle, editorBody)}
                                        className="bg-[var(--gold-accent)] hover:bg-white text-black font-bold py-2 px-6 rounded uppercase tracking-widest text-sm flex items-center gap-2 transition"
                                    >
                                        <Save className="w-4 h-4" /> Save To Archive
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORGE MODE */}
                    {mode === "forge" && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <h2 className="text-xl font-header text-[#666] mb-6 flex items-center gap-2"><Hammer className="w-5 h-5" /> CREATURE FORGE</h2>
                            <StatblockGenerator onSave={handleStatblockSave} />
                        </div>
                    )}

                    {/* VIEW MODE */}
                    {mode === "view" && activeItem && (
                        <div className="animate-fade-in max-w-[21cm] mx-auto min-h-[29.7cm] bg-[#e3dacb] text-black shadow-2xl overflow-hidden print:shadow-none print:m-0 print:w-full">
                            {/* Decorative Header for 'Pages' */}
                            <div className="h-4 bg-[#b5a685] mb-8 print:hidden" />

                            {/* Watermarks / Texture would go here */}

                            <div className="p-12 print:p-0">
                                {activeItem.type === "Statblock" ? (
                                    <div className="flex justify-center items-start">
                                        <div className="w-full max-w-md transform scale-110 origin-top">
                                            <StatblockCard data={JSON.parse(activeItem.body)} />
                                        </div>
                                    </div>
                                ) : (
                                    <article className="prose prose-p:font-serif prose-headings:font-header max-w-none">
                                        <h1 className="text-4xl font-header border-b-2 border-[#b5a685] pb-2 mb-6 text-[#4a3b2a] uppercase tracking-wider">{activeItem.title}</h1>

                                        <div className="text-sm font-mono text-[#886644] mb-8 uppercase tracking-widest flex justify-between">
                                            <span>Type: {activeItem.type}</span>
                                            <span>Archived: {activeItem.date}</span>
                                        </div>

                                        <div className="columns-1 md:columns-2 gap-8 text-justify leading-relaxed font-serif text-[#2c2c2c] text-lg">
                                            <div className="whitespace-pre-wrap">{activeItem.body}</div>
                                        </div>
                                    </article>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-12 text-center text-[#886644] text-xs font-mono absolute bottom-8 left-0 right-0 print:bottom-4">
                                HEART&apos;S CURSE CAMPAIGN ARCHIVE • {activeItem.id.split('-')[0]}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import CommandBar from "@/components/ui/CommandBar";
import PrintButton from "@/components/ui/PrintButton";
import StatblockGenerator from "@/components/ui/StatblockGenerator";
import SpellEditor from "@/components/ui/SpellEditor";
import ItemEditor from "@/components/ui/ItemEditor";
import StatblockCard from "@/components/ui/StatblockCard";
import { LootCard } from "@/components/ui/LootCard";
import { Statblock } from "@/lib/data/statblocks";
import { Spell } from "@/lib/data/spells";
import { ShopItem } from "@/lib/data/items";
import { FileText, Hammer, Save, Trash2, BookOpen, Scroll, Wand2 } from "lucide-react";
import PremiumGate from "@/components/auth/PremiumGate";

type ContentItem = {
    id: string;
    type: "Chapter" | "NPC" | "Location" | "Statblock" | "Spell" | "Item";
    title: string;
    body: string; // For Statblocks/Spells/Items, this will store the JSON stringified data
    date: string;
};

export default function EditorPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [mode, setMode] = useState<"write" | "forge" | "spell" | "item" | "view">("write"); // Expanded modes

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

    const handleSpellSave = (spell: Spell) => {
        saveContent("Spell", spell.name, JSON.stringify(spell));
        // Also persist to global custom_spells registry
        const savedSpells = JSON.parse(localStorage.getItem('custom_spells') || '[]');
        localStorage.setItem('custom_spells', JSON.stringify([...savedSpells, spell]));
    };

    const handleItemSave = (item: ShopItem) => {
        saveContent("Item", item.name, JSON.stringify(item));
        // Also persist to global custom_items registry
        const savedItems = JSON.parse(localStorage.getItem('custom_items') || '[]');
        localStorage.setItem('custom_items', JSON.stringify([...savedItems, item]));
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

            <PremiumGate feature="Campaign Architect Suite">
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar - File Browser */}
                    <aside className="w-[280px] bg-[#111] border-r border-[#333] flex flex-col shrink-0">
                        <div className="p-4 border-b border-[#333] space-y-2">
                            <button
                                onClick={() => { setActiveItem(null); setMode("write"); }}
                                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-2 border border-transparent hover:border-[#333] transition ${mode === "write" ? "bg-[#222] text-[#e0e0e0]" : "text-[#666]"}`}
                            >
                                <FileText size={14} /> New Chapter
                            </button>
                            <PremiumGate feature="Statblock Forge">
                                <button
                                    onClick={() => { setActiveItem(null); setMode("forge"); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-2 border border-transparent hover:border-[#333] transition ${mode === "forge" ? "bg-[#1a0505] text-[#a32222]" : "text-[#888]"}`}
                                >
                                    <Hammer size={14} /> Monster Forge
                                </button>
                            </PremiumGate>
                            <PremiumGate feature="Spell Inscription">
                                <button
                                    onClick={() => { setActiveItem(null); setMode("spell"); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-2 border border-transparent hover:border-[#333] transition ${mode === "spell" ? "bg-[#0c0c1f] text-[#8888ff]" : "text-[#888]"}`}
                                >
                                    <Wand2 size={14} /> Spell Inscription
                                </button>
                            </PremiumGate>
                            <PremiumGate feature="Item Forge">
                                <button
                                    onClick={() => { setActiveItem(null); setMode("item"); }}
                                    className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest flex items-center gap-2 border border-transparent hover:border-[#333] transition ${mode === "item" ? "bg-[#1f1a0c] text-[#d4af37]" : "text-[#888]"}`}
                                >
                                    <Scroll size={14} /> Item Forge
                                </button>
                            </PremiumGate>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            <h3 className="px-3 py-2 text-[10px] uppercase font-mono text-[#444] tracking-widest">Archive</h3>
                            {items.length === 0 && <div className="px-3 text-xs text-[#333] italic">No archived content...</div>}
                            {items.map(item => (
                                <div key={item.id} className="group flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] cursor-pointer" onClick={() => openItem(item)}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {item.type === "Statblock" ? <Hammer size={12} className="text-[#a32222]" /> :
                                            item.type === "Spell" ? <Wand2 size={12} className="text-[#8888ff]" /> :
                                                item.type === "Item" ? <Scroll size={12} className="text-[#d4af37]" /> :
                                                    <FileText size={12} className="text-[#666]" />}
                                        <span className="text-xs truncate text-[#ccc]">{item.title}</span>
                                    </div>
                                    <button
                                        onClick={(e) => deleteContent(item.id, e)}
                                        className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-[#a32222] transition"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden">
                        {/* Editor/Viewer */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {/* WRITE MODE */}
                            {mode === "write" && (
                                <div className="animate-fade-in max-w-[800px] mx-auto">
                                    <h2 className="text-2xl font-header tracking-widest text-[var(--gold-accent)] mb-6">New Chapter / Entry</h2>
                                    <div className="mb-4">
                                        <label htmlFor="editorType" className="block text-xs font-mono uppercase text-[#666] mb-1">Content Type</label>
                                        <select
                                            id="editorType"
                                            value={editorType}
                                            onChange={(e) => setEditorType(e.target.value as ContentItem["type"])}
                                            className="w-full p-2 bg-[#1a1a1a] border border-[#333] text-[#d4d4d4] text-sm font-mono focus:outline-none focus:border-[var(--gold-accent)]"
                                        >
                                            <option value="Chapter">Chapter</option>
                                            <option value="NPC">NPC</option>
                                            <option value="Location">Location</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="editorTitle" className="block text-xs font-mono uppercase text-[#666] mb-1">Title</label>
                                        <input
                                            id="editorTitle"
                                            type="text"
                                            value={editorTitle}
                                            onChange={(e) => setEditorTitle(e.target.value)}
                                            className="w-full p-2 bg-[#1a1a1a] border border-[#333] text-[#d4d4d4] text-sm font-mono focus:outline-none focus:border-[var(--gold-accent)]"
                                            placeholder="Enter title..."
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="editorBody" className="block text-xs font-mono uppercase text-[#666] mb-1">Content</label>
                                        <textarea
                                            id="editorBody"
                                            value={editorBody}
                                            onChange={(e) => setEditorBody(e.target.value)}
                                            className="w-full h-64 p-2 bg-[#1a1a1a] border border-[#333] text-[#d4d4d4] text-sm font-mono focus:outline-none focus:border-[var(--gold-accent)] resize-y"
                                            placeholder="Write your chapter content here..."
                                        ></textarea>
                                    </div>
                                    <button
                                        onClick={() => saveContent(editorType, editorTitle, editorBody)}
                                        className="px-6 py-2 bg-[var(--gold-accent)] text-[#0a0a0a] font-bold uppercase tracking-widest text-sm hover:bg-[#e0b84f] transition flex items-center gap-2"
                                    >
                                        <Save size={16} /> Save Entry
                                    </button>
                                </div>
                            )}

                            {/* FORGE MODE */}
                            {mode === "forge" && (
                                <PremiumGate feature="Statblock Forge">
                                    <StatblockGenerator onSave={handleStatblockSave} />
                                </PremiumGate>
                            )}

                            {/* SPELL MODE */}
                            {mode === "spell" && (
                                <PremiumGate feature="Spell Inscription">
                                    <SpellEditor onSave={handleSpellSave} />
                                </PremiumGate>
                            )}

                            {/* ITEM MODE */}
                            {mode === "item" && (
                                <PremiumGate feature="Item Forge">
                                    <ItemEditor onSave={handleItemSave} />
                                </PremiumGate>
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
                    </main>
            </PremiumGate>
        </div>
    );
}

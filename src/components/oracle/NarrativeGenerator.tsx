"use client";

import { useState } from "react";
import { AiService } from "@/lib/ai/AiService";
import { Sparkles, RefreshCw, Copy } from "lucide-react";

export default function NarrativeGenerator() {
    const [location, setLocation] = useState("");
    const [keywords, setKeywords] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!location) return;
        setLoading(true);
        try {
            const kwArray = keywords.split(",").map(s => s.trim()).filter(Boolean);
            const response = await AiService.generateDescription({ location, keywords: kwArray });
            setResult(response.text);
        } catch (e) {
            setResult("The Oracle is silent... (Error generating text)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0e0e0e] border border-[#333] p-4 rounded-lg flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#333] pb-2">
                <Sparkles className="text-[var(--gold-accent)]" size={18} />
                <h3 className="font-header text-[var(--gold-accent)] text-lg">Narrative Oracle</h3>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-xs uppercase font-mono text-[#666] mb-1">Generic Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Ancient Crypt, Tavern, Forest Clearing"
                        className="w-full bg-[#1a1a1a] border border-[#333] p-2 text-sm text-[#d4d4d4] focus:border-[var(--gold-accent)] outline-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase font-mono text-[#666] mb-1">Keywords (Comma separated)</label>
                    <input
                        type="text"
                        placeholder="e.g. Fog, Spiders, Blood, Treasure"
                        className="w-full bg-[#1a1a1a] border border-[#333] p-2 text-sm text-[#d4d4d4] focus:border-[var(--gold-accent)] outline-none"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading || !location}
                className="w-full py-2 bg-[var(--gold-accent)] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#e0b84f] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {loading ? "Consulting Spirits..." : "Generate Description"}
            </button>

            {result && (
                <div className="mt-2 bg-[#1a1111] border border-[#442222] p-4 rounded relative animate-fade-in group">
                    <p className="font-serif text-lg leading-relaxed text-[#d4d4d4] italic">
                        "{result}"
                    </p>
                    <button
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="absolute top-2 right-2 text-[#666] hover:text-[#d4d4d4] opacity-0 group-hover:opacity-100 transition"
                        title="Copy to Clipboard"
                    >
                        <Copy size={14} />
                    </button>
                    <div className="text-[10px] text-[#444] font-mono mt-2 text-right uppercase">
                        Source: Mock Oracle
                    </div>
                </div>
            )}
        </div>
    );
}

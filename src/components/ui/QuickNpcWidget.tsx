"use client";

import { useState } from "react";
import { User, Copy, RefreshCw } from "lucide-react";
import DashboardWidget from "./DashboardWidget";
import { generateNPC } from "@/lib/generators"; // Assumes index export or specific file

export default function QuickNpcWidget() {
    // We'll store just one current quick NPC
    const [npc, setNpc] = useState<any>(null);

    const handleGenerate = () => {
        // Generate a random 'Surface' or mixed NPC
        const newNpc = generateNPC("Surface");
        setNpc(newNpc);
    };

    const copyToClipboard = () => {
        if (!npc) return;
        const text = `${npc.name} (${npc.race} ${npc.class})\nAppearance: ${npc.appearance}\nQuirk: ${npc.quirk}`;
        navigator.clipboard.writeText(text);
        alert("NPC copied to clipboard!");
    };

    return (
        <DashboardWidget title="Quick NPC" subtitle="Instant Generator" icon={User} variant="obsidian">
            <div className="flex flex-col h-full gap-4">

                {npc ? (
                    <div className="flex-1 bg-[#1a1a1a] border border-[#333] p-3 rounded flex flex-col gap-2 animate-in fade-in">
                        <div className="flex justify-between items-start border-b border-[#333] pb-2">
                            <div>
                                <div className="font-header text-lg text-[var(--scarlet-accent)]">{npc.name}</div>
                                <div className="text-xs text-gray-500 font-mono uppercase">{npc.race} {npc.class}</div>
                            </div>
                            <button onClick={copyToClipboard} className="text-gray-600 hover:text-[var(--gold-accent)]">
                                <Copy size={14} />
                            </button>
                        </div>
                        <div className="text-sm text-gray-300 italic">
                            "{npc.appearance}"
                        </div>
                        <div className="text-xs text-gray-500 mt-auto pt-2 border-t border-[#333]">
                            <span className="text-[var(--gold-accent)]">Quirk:</span> {npc.quirk}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-[#333] rounded text-gray-600 text-xs font-mono p-4 text-center">
                        NO ACTIVE NPC
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    className="w-full py-2 bg-[#222] hover:bg-[#a32222] border border-[#333] text-gray-300 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} /> Roll NPC
                </button>
            </div>
        </DashboardWidget>
    );
}

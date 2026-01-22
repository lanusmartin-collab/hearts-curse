"use client";

import Link from "next/link";
import NarrativeGenerator from "@/components/oracle/NarrativeGenerator";
import NpcChat from "@/components/oracle/NpcChat";
import CommandBar from "@/components/ui/CommandBar";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function OraclePage() {
    return (
        <div className="retro-container min-h-screen bg-[#0a0a0a] text-[#d4d4d4] flex flex-col">
            <CommandBar />

            <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#0e0e0e]">
                <div>
                    <h1 className="text-3xl font-header tracking-widest text-[var(--gold-accent)] mb-1 flex items-center gap-3">
                        <Sparkles /> THE ORACLE
                    </h1>
                    <p className="text-xs font-mono text-[#666]">AI-POWERED NARRATIVE ENGINE v1.0</p>
                </div>
                <Link href="/" className="text-xs uppercase tracking-widest text-[#666] hover:text-white border border-[#333] px-4 py-2 rounded transition flex items-center gap-2">
                    <ArrowLeft size={14} /> Return to Sanctum
                </Link>
            </div>

            <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Generator */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-bold text-[#b5a685] border-l-4 border-[var(--gold-accent)] pl-2">Room Weaver</h2>
                        </div>
                        <p className="text-sm text-[#888] mb-4">
                            Describe a scene instantly. Provide a location and key elements, and The Oracle will weave a description for you.
                        </p>
                        <NarrativeGenerator />
                    </div>

                    {/* Right Column: Chat */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-bold text-[#b5a685] border-l-4 border-[var(--gold-accent)] pl-2">Soul Speak</h2>
                        </div>
                        <p className="text-sm text-[#888] mb-4">
                            Conversing with the echoes of characters. Improvise dialogue with any NPC.
                        </p>
                        <NpcChat />
                    </div>

                </div>
            </main>
        </div>
    );
}

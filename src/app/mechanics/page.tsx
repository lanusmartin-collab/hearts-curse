"use client";

import { PROLOGUE_POWERS, SAFE_HAVEN, SILENT_WARDS_MECHANIC, WILD_MAGIC_TABLE } from "@/lib/data/mechanics";
import CurseTracker from "@/components/ui/CurseTracker";
import DashboardWidget from "@/components/ui/DashboardWidget";
import PrintButton from "@/components/ui/PrintButton";
import Link from "next/link";
import { Zap, Shield, Skull, Map, ArrowLeft } from "lucide-react";

export default function MechanicsPage() {
    return (
        <div className="retro-container min-h-screen p-8 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-[var(--glass-border)] pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2 no-print">
                        <Link href="/" className="text-xs text-[var(--gold-accent)] uppercase tracking-widest hover:text-white flex items-center gap-1 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Dashboard
                        </Link>
                    </div>
                    <h1 className="text-4xl m-0 leading-none text-[var(--scarlet-accent)]">System Mechanics</h1>
                    <p className="text-xs text-[var(--fg-dim)] mt-2 uppercase tracking-[0.2em]">Game Engine // Heart's Curse v4.0</p>
                </div>
                <div className="no-print"><PrintButton /></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">

                {/* COL 1: The Curse (Primary Mechanic) */}
                <div className="xl:col-span-5 flex flex-col">
                    <DashboardWidget
                        title="The Curse"
                        subtitle="Campaign Timer"
                        icon={Skull}
                        style={{ height: "100%", backgroundImage: "radial-gradient(circle at top right, rgba(138, 28, 28, 0.1), transparent 60%)" }}
                    >
                        <CurseTracker />
                    </DashboardWidget>
                </div>

                {/* COL 2: Regional Effects (Interactive) */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    {/* Silent Wards */}
                    <DashboardWidget title="Silent Wards" subtitle="Labyrinth Mechanics" icon={Map} style={{ borderColor: "#444" }}>
                        <div className="text-sm text-[var(--fg-dim)] mb-4">
                            {SILENT_WARDS_MECHANIC.description}
                        </div>
                        <div className="bg-[#111] border border-[#333] p-4 rounded text-xs font-mono text-gray-400">
                            <strong>TRIGGER:</strong> {SILENT_WARDS_MECHANIC.trigger}
                        </div>
                        <div className="grid grid-cols-1 gap-2 mt-4">
                            {SILENT_WARDS_MECHANIC.table.map((row, i) => (
                                <div key={i} className="flex gap-3 text-xs border-b border-[#222] pb-2 last:border-0">
                                    <span className="text-[var(--gold-accent)] font-bold w-8 shrink-0">{row.d6}</span>
                                    <span className="text-gray-300">{row.effect}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardWidget>

                    {/* Wild Magic */}
                    <DashboardWidget title="Netherese Magic" subtitle="Wild Surge Table" icon={Zap} style={{ borderColor: "rgba(109, 40, 217, 0.4)" }}>
                        <div className="text-sm text-[var(--fg-dim)] mb-4">
                            {WILD_MAGIC_TABLE.description}
                        </div>

                        {/* Simple randomizer button could go here, for now just a link/display */}
                        <div className="h-32 overflow-y-auto custom-scrollbar bg-[#0f0f12] p-2 border border-[#333] rounded">
                            {WILD_MAGIC_TABLE.d100.map((entry, i) => (
                                <div key={i} className="flex justify-between text-[10px] font-mono border-b border-[#222] py-1 text-gray-500 hover:text-white hover:bg-[#222] px-2 transition-colors cursor-default">
                                    <span className="w-10 text-[var(--mystic-accent)]">{entry.roll}</span>
                                    <span>{entry.effect}</span>
                                </div>
                            ))}
                        </div>
                    </DashboardWidget>
                </div>

                {/* COL 3: Reference (Static) */}
                <div className="xl:col-span-3 flex flex-col gap-6">
                    <DashboardWidget title="Prologue Powers" subtitle="Heroic Boons" icon={Shield}>
                        <ul className="space-y-3">
                            {PROLOGUE_POWERS.bonuses.map((bonus, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-[var(--gold-accent)] mt-1">✦</span>
                                    {bonus}
                                </li>
                            ))}
                        </ul>
                    </DashboardWidget>

                    <DashboardWidget title="Safe Haven" subtitle="The Sunken Crypt" icon={Shield} variant="parchment" href="/mechanics/safe-haven">
                        <div className="mb-2 text-sm font-bold text-[#8b1c1c]">ACCESS CODE: CANDLEKEEP</div>
                        <ul className="space-y-1">
                            {SAFE_HAVEN.features.map((feat, i) => (
                                <li key={i} className="text-xs text-[#333] list-disc list-inside">
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </DashboardWidget>
                </div>
            </div>
        </div>
    );
}

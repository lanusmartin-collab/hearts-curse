"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Flame, BedDouble, Lock, RefreshCcw } from "lucide-react";
import DashboardWidget from "@/components/ui/DashboardWidget";

export default function SafeHavenPage() {
    return (
        <div className="retro-container min-h-screen text-[var(--adnd-ink)] bg-[var(--parchment-bg)] flex flex-col items-center">

            <div className="w-full max-w-4xl p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b-2 border-[#8b7e66] pb-4">
                    <Link href="/mechanics" className="flex items-center gap-2 text-[#4a0404] hover:underline font-bold uppercase text-xs tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Return to Mechanics
                    </Link>
                    <h1 className="text-4xl font-serif text-[var(--adnd-blue)] m-0">The Sunken Crypt</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Lore / Description */}
                    <div className="space-y-6">
                        <div className="p-6 border border-[#8b7e66] bg-[#e8e4d9] shadow-lg rounded-sm relative">
                            <div className="absolute -top-3 left-4 bg-[#e8e4d9] px-2 text-[#8b1c1c] font-bold text-xs uppercase tracking-widest">Sanctuary Status</div>
                            <p className="font-serif italic text-lg leading-relaxed text-gray-800">
                                "Here, the heartbeat of the curse slows. The stone walls of Candlekeep's lost archive dampen the screams of the void. For now, you are safe."
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-sm text-[#4a0404]">
                                <Shield className="w-5 h-5" />
                                <span>Curse gain paused while within these walls.</span>
                            </div>
                        </div>

                        <DashboardWidget title="Rest & Recovery" subtitle="Long Rest Actions" icon={BedDouble} variant="parchment">
                            <ul className="space-y-3 text-sm">
                                <li className="flex gap-2">
                                    <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                                    <span><strong>Kindle the Hearth:</strong> Removes 1 level of Exhaustion automatically.</span>
                                </li>
                                <li className="flex gap-2">
                                    <RefreshCcw className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span><strong>Cleansing Ritual:</strong> Reduces Curse Intensity by 1d4 days (Requires 100gp incense).</span>
                                </li>
                            </ul>
                        </DashboardWidget>
                    </div>

                    {/* Interactive Elements / Unlockables */}
                    <div className="space-y-6">

                        <div className="p-1 bg-[#d4cebd] border border-[#8b7e66]">
                            <div className="border border-dashed border-[#8b7e66] p-4 text-center">
                                <h3 className="font-bold text-[#4a0404] uppercase tracking-widest mb-2">The Vault Door</h3>
                                <Lock className="w-12 h-12 text-[#8b7e66] mx-auto mb-2 opacity-50" />
                                <p className="text-xs text-gray-600">Requires <span className="font-bold">Keystone of the First Warden</span> to open.</p>
                                <button className="mt-4 px-4 py-2 bg-[#8b7e66] text-[#e8e4d9] hover:bg-[#4a0404] transition-colors font-bold uppercase text-xs rounded-sm">
                                    Attempt to Open
                                </button>
                            </div>
                        </div>

                        <DashboardWidget title="Stockpile" subtitle="Shared Inventory" icon={Lock} variant="parchment">
                            <div className="h-32 flex items-center justify-center text-gray-500 italic text-sm border border-[#a89f8c] bg-[#e0dbcd] inset-shadow">
                                The stockpile is currently empty.
                            </div>
                        </DashboardWidget>

                    </div>
                </div>

            </div>
        </div>
    );
}

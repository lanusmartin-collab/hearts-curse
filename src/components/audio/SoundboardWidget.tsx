"use client";

import { useAudio } from "@/lib/context/AudioContext";
import DashboardWidget from "@/components/ui/DashboardWidget";
import { Speaker, Zap, Sword, Ghost, ShieldAlert } from "lucide-react";

const SFX_PRESETS = [
    { name: "Dice Roll", file: "/sfx/dice_throw.mp3", icon: null },
    { name: "Settle", file: "/sfx/dice_settle.mp3", icon: null },
    { name: "Click", file: "/sfx/ui_click.mp3", icon: null },
    { name: "Bump", file: "/sfx/bump.mp3", icon: null },
    { name: "Crit Hit", file: "/sfx/holy_crit.mp3", icon: Zap },
    { name: "Glitch", file: "/sfx/glitch_crit.mp3", icon: Ghost },
    { name: "Combat", file: "/sfx/footsteps.mp3", icon: Sword }, // Placeholder
];

export default function SoundboardWidget() {
    const { playSfx, isInitialized } = useAudio();

    return (
        <DashboardWidget title="Soundboard" subtitle="SFX Trigger" icon={Speaker} variant="obsidian">
            {!isInitialized && (
                <div className="text-[10px] text-red-500 mb-2 font-mono uppercase tracking-wide">
                    ⚠️ Audio Engine Offline
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SFX_PRESETS.map((sfx, i) => (
                    <button
                        key={i}
                        onClick={() => playSfx(sfx.file)}
                        disabled={!isInitialized}
                        className={`
                            h-16 flex flex-col items-center justify-center gap-1 bg-[#222] border border-[#333] rounded 
                            hover:bg-[var(--scarlet-accent)] hover:text-white hover:border-white hover:shadow-[0_0_10px_rgba(255,0,0,0.5)]
                            active:scale-95 transition-all text-xs text-gray-400 font-mono uppercase
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {sfx.icon ? <sfx.icon size={16} /> : <span className="text-lg font-bold">FX</span>}
                        <span>{sfx.name}</span>
                    </button>
                ))}
            </div>
        </DashboardWidget>
    );
}

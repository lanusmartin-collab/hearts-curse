"use client";

import { useAudio } from "@/lib/context/AudioContext";
import DashboardWidget from "@/components/ui/DashboardWidget";
import { Sliders, Music, Wind, Volume2 } from "lucide-react";

export default function AmbienceMixer() {
    const {
        volume, setVolume,
        musicVolume, setMusicVolume,
        ambienceVolume, setAmbienceVolume,
        sfxVolume, setSfxVolume,
        playAmbience
    } = useAudio();

    return (
        <DashboardWidget title="Mixer" subtitle="Audio Channels" icon={Sliders} variant="obsidian">
            <div className="space-y-4">

                {/* MASTER */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#a32222] font-bold">
                        <span>Master Output</span>
                        <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-[#a32222] h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="h-[1px] bg-[#333] w-full my-2"></div>

                {/* Music */}
                <div className="grid grid-cols-[24px_1fr_30px] items-center gap-2">
                    <Music size={14} className="text-gray-500" />
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={musicVolume}
                        onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                        className="w-full accent-[var(--gold-accent)] h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-gray-500">{Math.round(musicVolume * 100)}</span>
                </div>

                {/* Ambience */}
                <div className="grid grid-cols-[24px_1fr_30px] items-center gap-2">
                    <Wind size={14} className="text-gray-500" />
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={ambienceVolume}
                        onChange={(e) => setAmbienceVolume(parseFloat(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-gray-500">{Math.round(ambienceVolume * 100)}</span>
                </div>

                {/* SFX */}
                <div className="grid grid-cols-[24px_1fr_30px] items-center gap-2">
                    <Volume2 size={14} className="text-gray-500" />
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={sfxVolume}
                        onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                        className="w-full accent-green-500 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-gray-500">{Math.round(sfxVolume * 100)}</span>
                </div>

                <div className="h-[1px] bg-[#333] w-full my-2"></div>

                {/* Presets */}
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: "safe", label: "Safe", color: "text-green-500", bg: "hover:bg-green-900/20" },
                        { id: "dungeon", label: "Dungeon", color: "text-purple-500", bg: "hover:bg-purple-900/20" },
                        { id: "combat", label: "Combat", color: "text-red-500", bg: "hover:bg-red-900/20" },
                        { id: "boss_battle", label: "Boss", color: "text-orange-500", bg: "hover:bg-orange-900/20" }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => playAmbience(mode.id as any)}
                            className={`
                                flexflex-col items-center justify-center p-2 rounded border border-[#333] transition
                                ${mode.bg} ${mode.color}
                            `}
                        >
                            <span className="text-[10px] uppercase font-bold tracking-wider">{mode.label}</span>
                        </button>
                    ))}
                </div>

            </div>
        </DashboardWidget>
    );
}

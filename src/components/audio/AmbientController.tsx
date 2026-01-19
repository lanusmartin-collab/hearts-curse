"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

// Interface removed as it's no longer needed
// interface AmbientControllerProps {
//   curseLevel: number;
// }

export default function AmbientController() {
    const { isInitialized, initializeAudio, isMuted, toggleMute, ambienceMode } = useAudio();
    const [curseLevel, setCurseLevel] = useState(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Oscillators for the "Hum"
    const lowDroneRef = useRef<OscillatorNode | null>(null);
    const pulseRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    // ... (useEffect for storage sync)

    // ... (useEffect for initialization)

    // Modulate sound based on Curse Level AND Ambience Mode
    useEffect(() => {
        if (!audioCtxRef.current || !lowDroneRef.current || !pulseRef.current || !gainRef.current) return;

        // Intensity calculation (0.0 to 1.0)
        let intensity = Math.min(curseLevel / 21, 1);
        let baseFreq = 55;
        let beatSpeed = 2;

        // MODE OVERRIDES
        switch (ambienceMode) {
            case 'dungeon':
                intensity = Math.max(intensity, 0.5);
                baseFreq = 55 - (intensity * 10);
                beatSpeed = 2 + (intensity * 6);
                break;
            case 'combat':
                intensity = 1.2;
                baseFreq = 45;
                beatSpeed = 15;
                break;
            case 'boss_battle':
                intensity = 1.5;
                baseFreq = 40; // Very deep
                beatSpeed = 20; // Panic inducing
                break;
            case 'ethereal':
                intensity = 0.3;
                baseFreq = 110; // Higher, floaty
                beatSpeed = 0.5; // Very slow
                break;
            case 'library':
                intensity = 0.2;
                baseFreq = 80;
                beatSpeed = 0.2; // Almost static
                break;
            case 'safe':
            default:
                baseFreq = 55 - (intensity * 10);
                beatSpeed = 2 + (intensity * 6);
                break;
        }

        // Apply Transition
        const now = audioCtxRef.current.currentTime;
        lowDroneRef.current.frequency.linearRampToValueAtTime(baseFreq, now + 2);
        pulseRef.current.frequency.linearRampToValueAtTime(baseFreq + beatSpeed, now + 2);

        // Volume Logic (Louder as it gets more cursed/intense)
        const targetVol = isMuted ? 0 : (0.05 + (intensity * 0.15));
        gainRef.current.gain.linearRampToValueAtTime(targetVol, now + 1);

    }, [curseLevel, isMuted, isInitialized, ambienceMode]);

    if (!isInitialized) {
        return (
            <button
                onClick={initializeAudio}
                className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-[var(--scarlet-accent)] text-white font-mono text-xs animate-pulse border border-white"
            >
                [INITIALIZE AUDIO SYSTEMS]
            </button>
        );
    }

    return (
        <button
            onClick={toggleMute}
            className="fixed bottom-4 right-4 z-50 p-2 bg-[var(--obsidian-base)] border border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)] hover:text-black transition-colors"
            title={isMuted ? "Unmute Ambience" : "Mute Ambience"}
        >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
    );
}

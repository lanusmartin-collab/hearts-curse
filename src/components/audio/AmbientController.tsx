"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

// Interface removed as it's no longer needed
// interface AmbientControllerProps {
//   curseLevel: number;
// }

export default function AmbientController() {
    const { isInitialized, initializeAudio, isMuted, toggleMute } = useAudio();
    const [curseLevel, setCurseLevel] = useState(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Oscillators for the "Hum"
    const lowDroneRef = useRef<OscillatorNode | null>(null);
    const pulseRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    // Sync Curse Level with Storage
    useEffect(() => {
        const loadLevel = () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('curse_days');
                if (saved) setCurseLevel(parseInt(saved, 10));
            }
        };
        loadLevel();
        window.addEventListener('storage', loadLevel);
        window.addEventListener('curse-update', loadLevel);
        return () => {
            window.removeEventListener('storage', loadLevel);
            window.removeEventListener('curse-update', loadLevel);
        };
    }, []);

    // Re-run setup when initialized
    useEffect(() => {
        if (!isInitialized || audioCtxRef.current) return;

        // Create Web Audio Context for procedural drone
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.1; // Start quiet
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;

        // 1. Low Drone (55Hz - A1)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.value = 55;
        osc1.start();
        osc1.connect(masterGain);
        lowDroneRef.current = osc1;

        // 2. Pulse (Binaural beat interference)
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 57; // 2Hz difference = 2Hz beat
        osc2.start();
        osc2.connect(masterGain);
        pulseRef.current = osc2;

        return () => {
            ctx.close();
        };
    }, [isInitialized]);

    // Modulate sound based on Curse Level
    useEffect(() => {
        if (!audioCtxRef.current || !lowDroneRef.current || !pulseRef.current || !gainRef.current) return;

        // Intensity calculation (0.0 to 1.0)
        const intensity = Math.min(curseLevel / 21, 1);

        // Pitch Logic
        // Safe: 55Hz (A1) -> Deep, calm
        // Critical: 45Hz (F#1) -> Unsettling, deeper
        const baseFreq = 55 - (intensity * 10);

        // Beat Speed Logic
        // Safe: 2Hz difference (Slow breathe)
        // Critical: 8Hz difference (Fast panic)
        const beatSpeed = 2 + (intensity * 6);

        // Apply Transition
        const now = audioCtxRef.current.currentTime;
        lowDroneRef.current.frequency.linearRampToValueAtTime(baseFreq, now + 2);
        pulseRef.current.frequency.linearRampToValueAtTime(baseFreq + beatSpeed, now + 2);

        // Volume Logic (Louder as it gets more cursed)
        // Muted handled by wrapper isMuted check or gain node
        const targetVol = isMuted ? 0 : (0.05 + (intensity * 0.15));
        gainRef.current.gain.linearRampToValueAtTime(targetVol, now + 1);

    }, [curseLevel, isMuted, isInitialized]);

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

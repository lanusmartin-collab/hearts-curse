"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

// Interface removed as it's no longer needed
// interface AmbientControllerProps {
//   curseLevel: number;
// }

export default function AmbientController() {
    const { isInitialized, initializeAudio, isMuted, toggleMute, ambienceMode, ambienceVolume } = useAudio();
    const [curseLevel, setCurseLevel] = useState(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Oscillators for the "Hum"
    const lowDroneRef = useRef<OscillatorNode | null>(null);
    const pulseRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    // Sync Curse Level
    useEffect(() => {
        const stored = localStorage.getItem("hc_curse_level");
        if (stored) setCurseLevel(parseInt(stored));
    }, []);

    // Initialize Web Audio API for Drone
    useEffect(() => {
        if (!isInitialized) return;
        if (audioCtxRef.current) return;

        try {
            const Ctx = (window.AudioContext || (window as any).webkitAudioContext);
            const ctx = new Ctx();
            audioCtxRef.current = ctx;

            // 1. Low Drone (Sub-bass)
            const lowOsc = ctx.createOscillator();
            lowOsc.type = "sine";
            lowOsc.frequency.value = 40; // Deep rumble

            // 2. Pulse (Subtle interference)
            const pulseOsc = ctx.createOscillator();
            pulseOsc.type = "sine"; // Smooth pulse
            pulseOsc.frequency.value = 41; // 1Hz beat

            // 3. Gain Node (Volume)
            const gainNode = ctx.createGain();
            gainNode.gain.value = 0; // Start silent

            // Connections
            lowOsc.connect(gainNode);
            pulseOsc.connect(gainNode);
            gainNode.connect(ctx.destination);

            // Start
            lowOsc.start();
            pulseOsc.start();

            // Store refs
            lowDroneRef.current = lowOsc;
            pulseRef.current = pulseOsc;
            gainRef.current = gainNode;

            console.log("Ambient Audio Engine Online (Tuned)");
        } catch (e) {
            console.error("Audio Init Failed", e);
        }

        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
                audioCtxRef.current = null;
            }
        };
    }, [isInitialized]);

    // Modulate sound based on Curse Level AND Ambience Mode
    useEffect(() => {
        if (!audioCtxRef.current || !lowDroneRef.current || !pulseRef.current || !gainRef.current) return;

        // Intensity calculation (0.0 to 1.0)
        let intensity = Math.min(curseLevel / 21, 1);
        let baseFreq = 40;
        let beatSpeed = 1;

        // MODE OVERRIDES
        switch (ambienceMode) {
            case 'dungeon':
                intensity = Math.max(intensity, 0.5);
                baseFreq = 35 - (intensity * 5); // Go deeper
                beatSpeed = 1 + (intensity * 3);
                break;
            case 'combat':
                intensity = 1.0;
                baseFreq = 50;
                beatSpeed = 8;
                break;
            case 'boss_battle':
                intensity = 1.2;
                baseFreq = 45;
                beatSpeed = 12;
                break;
            case 'ethereal':
                intensity = 0.3;
                baseFreq = 100; // Ethereal hum
                beatSpeed = 0.5;
                break;
            case 'library':
                intensity = 0.1;
                baseFreq = 60;
                beatSpeed = 0.2;
                break;
            case 'safe':
            default:
                baseFreq = 40 - (intensity * 5);
                beatSpeed = 1 + (intensity * 2);
                break;
        }

        // Apply Transition
        const now = audioCtxRef.current.currentTime;
        lowDroneRef.current.frequency.linearRampToValueAtTime(baseFreq, now + 2);
        pulseRef.current.frequency.linearRampToValueAtTime(baseFreq + beatSpeed, now + 2);

        // Volume Logic (Significantly Reduced)
        // Base volume lowered from 0.05 to 0.02
        const baseVol = 0.02 + (intensity * 0.08);
        const finalVol = isMuted ? 0 : (baseVol * ambienceVolume);

        gainRef.current.gain.linearRampToValueAtTime(finalVol, now + 1);

    }, [curseLevel, isMuted, isInitialized, ambienceMode, ambienceVolume]);

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

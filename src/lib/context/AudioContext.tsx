"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export interface AudioContextType {
    isMuted: boolean;
    volume: number;
    toggleMute: () => void;
    setVolume: (val: number) => void;
    playSfx: (src: string) => void;
    playMusic: (src: string) => void;
    initializeAudio: () => void;
    isInitialized: boolean;
    ambienceMode: "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library";
    playAmbience: (mode: "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library") => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isInitialized, setIsInitialized] = useState(false);
    const [ambienceMode, setAmbienceMode] = useState<"safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library">("safe");

    const sfxRef = useRef<{ [key: string]: Howl }>({});
    const musicRef = useRef<Howl | null>(null);
    const currentMusicSrc = useRef<string | null>(null);

    // Initialize audio context (must be triggered by user interaction)
    const initializeAudio = () => {
        if (!isInitialized) {
            Howler.volume(volume);
            setIsInitialized(true);
            new Howl({ src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAGZGF0YQQAAAAAAA=='] }).play();
        }
    };

    useEffect(() => {
        Howler.mute(isMuted);
    }, [isMuted]);

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]);

    // Quick SFX player (fire and forget)
    const playSfx = (src: string) => {
        if (!isInitialized || isMuted) return;
        if (!sfxRef.current[src]) {
            sfxRef.current[src] = new Howl({ src: [src], volume: 0.8 });
        }
        sfxRef.current[src].play();
    };

    // Music Player with Crossfade
    const playMusic = (src: string) => {
        if (!isInitialized) return;
        if (currentMusicSrc.current === src) return; // Already playing

        // Fade out existing
        if (musicRef.current) {
            const oldMusic = musicRef.current;
            oldMusic.fade(volume * 0.5, 0, 1000);
            setTimeout(() => {
                oldMusic.stop();
                oldMusic.unload();
            }, 1000);
        }

        // Start new
        // Check if it's a placeholder or real file. If real file doesn't exist, this might error. 
        // For now we assume these are valid paths or we handle error.
        const newMusic = new Howl({
            src: [src],
            html5: true, // Streaming for larger files
            loop: true,
            volume: 0
        });

        newMusic.play();
        newMusic.fade(0, volume * 0.5, 2000);

        musicRef.current = newMusic;
        currentMusicSrc.current = src;
    };

    const playAmbience = (mode: "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library") => {
        setAmbienceMode(mode);
    };

    return (
        <AudioContext.Provider value={{ isMuted, volume, toggleMute: () => setIsMuted(!isMuted), setVolume, playSfx, playMusic, initializeAudio, isInitialized, ambienceMode, playAmbience }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        // Return a safe fallback to prevent build errors during static generation
        // or if used outside the provider tree unexpectedly.
        return {
            isMuted: false,
            volume: 0.5,
            toggleMute: () => { },
            setVolume: () => { },
            playSfx: () => { },
            playMusic: () => { },
            initializeAudio: () => { },
            isInitialized: false,
            ambienceMode: "safe" as "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library", // Cast to satisfy type
            playAmbience: () => { }
        };
    }
    return context;
}

"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export interface AudioContextType {
    isMuted: boolean;
    volume: number; // Master
    musicVolume: number;
    sfxVolume: number;
    ambienceVolume: number;
    toggleMute: () => void;
    setVolume: (val: number) => void;
    setMusicVolume: (val: number) => void;
    setSfxVolume: (val: number) => void;
    setAmbienceVolume: (val: number) => void;
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

    const [musicVolume, setMusicVolume] = useState(0.5);
    const [sfxVolume, setSfxVolume] = useState(0.8);
    const [ambienceVolume, setAmbienceVolume] = useState(0.4);

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

    // Update active music volume when channel volume changes
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume(musicVolume);
        }
    }, [musicVolume]);

    // Quick SFX player (fire and forget)
    const playSfx = React.useCallback((src: string) => {
        if (!isInitialized || isMuted) return;
        // Always create new instance for overlap or reuse if cached
        if (!sfxRef.current[src]) {
            sfxRef.current[src] = new Howl({ src: [src] });
        }
        // Update volume before playing
        sfxRef.current[src].volume(sfxVolume);
        sfxRef.current[src].play();
    }, [isInitialized, isMuted, sfxVolume]);

    // Music Player with Crossfade
    const playMusic = React.useCallback((src: string) => {
        if (!isInitialized) return;
        if (currentMusicSrc.current === src) return; // Already playing

        // Fade out existing
        if (musicRef.current) {
            const oldMusic = musicRef.current;
            oldMusic.fade(musicVolume, 0, 1000);
            setTimeout(() => {
                oldMusic.stop();
                oldMusic.unload();
            }, 1000);
        }

        // Start new
        const newMusic = new Howl({
            src: [src],
            html5: true, // Streaming for larger files
            loop: true,
            volume: 0
        });

        newMusic.play();
        newMusic.fade(0, musicVolume, 2000);

        musicRef.current = newMusic;
        currentMusicSrc.current = src;
    }, [isInitialized, musicVolume]);

    const playAmbience = React.useCallback((mode: "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library") => {
        setAmbienceMode(mode);
    }, []);

    return (
        <AudioContext.Provider value={{
            isMuted,
            volume, // Master
            musicVolume,
            sfxVolume,
            ambienceVolume,
            toggleMute: () => setIsMuted(!isMuted),
            setVolume,
            setMusicVolume,
            setSfxVolume,
            setAmbienceVolume,
            playSfx,
            playMusic,
            initializeAudio,
            isInitialized,
            ambienceMode,
            playAmbience
        }}>
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
            musicVolume: 0.5,
            sfxVolume: 0.8,
            ambienceVolume: 0.4,
            toggleMute: () => { },
            setVolume: () => { },
            setMusicVolume: () => { },
            setSfxVolume: () => { },
            setAmbienceVolume: () => { },
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

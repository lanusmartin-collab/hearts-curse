"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
// import { Howl, Howler } from "howler";

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

// MOCKED AUDIO CONTEXT (Audio Disabled by Request)
export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [musicVolume, setMusicVolume] = useState(0.5);
    const [sfxVolume, setSfxVolume] = useState(0.8);
    const [ambienceVolume, setAmbienceVolume] = useState(0.4);
    const [isInitialized, setIsInitialized] = useState(false);
    const [ambienceMode, setAmbienceMode] = useState<"safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library">("safe");

    const toggleMute = () => setIsMuted(prev => !prev);
    const playSfx = (src: string) => { console.log("SFX Play:", src); };
    const playMusic = (src: string) => { console.log("Music Play:", src); };
    const initializeAudio = () => setIsInitialized(true);
    const playAmbience = (mode: "safe" | "dungeon" | "combat" | "boss_battle" | "ethereal" | "library") => {
        setAmbienceMode(mode);
    };

    return (
        <AudioContext.Provider value={{
            isMuted,
            volume,
            musicVolume,
            sfxVolume,
            ambienceVolume,
            toggleMute,
            setVolume,
            setMusicVolume,
            setSfxVolume,
            setAmbienceVolume,
            playSfx,
            playMusic,
            initializeAudio,
            isInitialized,
            ambienceMode: ambienceMode as any,
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

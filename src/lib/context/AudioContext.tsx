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
    // No-op state
    const isMuted = true;
    const volume = 0;
    const musicVolume = 0;
    const sfxVolume = 0;
    const ambienceVolume = 0;
    const isInitialized = false;
    const ambienceMode = "safe";

    // No-op functions
    const toggleMute = () => { };
    const setVolume = () => { };
    const setMusicVolume = () => { };
    const setSfxVolume = () => { };
    const setAmbienceVolume = () => { };
    const playSfx = () => { };
    const playMusic = () => { };
    const initializeAudio = () => { };
    const playAmbience = () => { };

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

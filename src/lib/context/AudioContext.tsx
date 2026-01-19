"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

interface AudioContextType {
    isMuted: boolean;
    volume: number;
    toggleMute: () => void;
    setVolume: (val: number) => void;
    playSfx: (src: string) => void;
    initializeAudio: () => void;
    isInitialized: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isInitialized, setIsInitialized] = useState(false);
    const sfxRef = useRef<{ [key: string]: Howl }>({});

    // Initialize audio context (must be triggered by user interaction)
    const initializeAudio = () => {
        if (!isInitialized) {
            Howler.volume(volume);
            setIsInitialized(true);
            // Play a silent sound to unlock the audio context on mobile/browsers
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

        // In a real app, pre-load these. For now, lazy load.
        if (!sfxRef.current[src]) {
            sfxRef.current[src] = new Howl({
                src: [src],
                volume: 0.8
            });
        }
        sfxRef.current[src].play();
    };

    return (
        <AudioContext.Provider value={{ isMuted, volume, toggleMute: () => setIsMuted(!isMuted), setVolume, playSfx, initializeAudio, isInitialized }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

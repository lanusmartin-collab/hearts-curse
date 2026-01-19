"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type AudioTrack = {
    id: string;
    title: string;
    src: string;
    category: "music" | "ambience" | "sfx";
};

type MusicContextType = {
    currentTrack: AudioTrack | null;
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    playTrack: (track: AudioTrack) => void;
    togglePlay: () => void;
    setVolume: (vol: number) => void; // 0-1
    toggleMute: () => void;
    availableTracks: AudioTrack[];
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const TRACKS: AudioTrack[] = [
    { id: "intro", title: "The Curse (Intro)", src: "/audio/intro.mp3", category: "music" },
    { id: "haven", title: "Oakhaven (Safe)", src: "/audio/haven.mp3", category: "ambience" },
    { id: "exploration", title: "The Void (Explore)", src: "/audio/exploration.mp3", category: "ambience" },
    { id: "combat", title: "The Hunt (Combat)", src: "/audio/combat.mp3", category: "music" },
    { id: "creepy", title: "Whispers (Horror)", src: "/audio/whispers.mp3", category: "ambience" },
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
    // State
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    // Refs for audio element
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;

        // Restore preferences
        const savedVol = localStorage.getItem("heartscurse_music_volume"); // Changed key to avoid conflict
        if (savedVol) setVolumeState(parseFloat(savedVol));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle Playback Chain
    useEffect(() => {
        if (!audioRef.current) return;

        // 1. Update Volume
        audioRef.current.volume = isMuted ? 0 : volume;

        // 2. Handle Source Change
        if (currentTrack && audioRef.current.src !== window.location.origin + currentTrack.src) {
            audioRef.current.src = currentTrack.src;
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn("Audio play blocked/failed:", error);
                        setIsPlaying(false);
                    });
                }
            }
        } else if (currentTrack && audioRef.current.paused && isPlaying) {
            // Resume
            audioRef.current.play().catch(e => console.error("Resume failed", e));
        } else if (!isPlaying && !audioRef.current.paused) {
            // Pause
            audioRef.current.pause();
        }

    }, [currentTrack, isPlaying, volume, isMuted]);

    // Helpers
    const playTrack = (track: AudioTrack) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(prev => !prev);

    const setVolume = (vol: number) => {
        const clamped = Math.max(0, Math.min(1, vol));
        setVolumeState(clamped);
        localStorage.setItem("heartscurse_music_volume", clamped.toString());
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <MusicContext.Provider value={{
            currentTrack,
            isPlaying,
            volume,
            isMuted,
            playTrack,
            togglePlay,
            setVolume,
            toggleMute,
            availableTracks: TRACKS
        }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return context;
}

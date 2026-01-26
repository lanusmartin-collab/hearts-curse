"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// SCRIPT CONFIGURATION
const SCENES = [
    {
        id: 1,
        // duration: 4000, // Duration is now dynamic based on speech
        text: "INITIALIZING...",
        subtext: "System Override In Progress...",
        visual: "code_rain",
        glitch: true,
        speak: null // No speech
    },
    {
        id: 2,
        text: "",
        subtext: "They told you magic was ancient... written on scrolls, buried in tombs.",
        visual: "code_rain",
        glitch: false,
        speak: "They told you magic was ancient... written on scrolls, buried in tombs."
    },
    {
        id: 3,
        text: "",
        subtext: "THEY WERE WRONG. Magic is DATA. And I... have root access.",
        visual: "avatar_reveal",
        glitch: true,
        speak: "They were wrong. Magic is data. And I... have root access."
    },
    {
        id: 4,
        text: "",
        subtext: "I AM THE GLITCH LICH. From the depths of the Cyber Shadowrealm...",
        visual: "avatar_chaos",
        glitch: true,
        speak: "I am the Glitch Lich. From the depths of the Cyber Shadowrealm, I construct worlds where the critical hits tear through the fabric of reality."
    },
    {
        id: 5,
        text: "",
        subtext: "JOIN ME. We're not just playing the game anymore.",
        visual: "avatar_zoom",
        glitch: false,
        speak: "Join me. We're not just playing the game anymore. We're rewriting the source code."
    },
    {
        id: 6,
        text: "",
        subtext: "Session Starts Now. Roll Initiative.",
        visual: "banner",
        glitch: false,
        speak: "Session starts now. Roll initiative."
    }
];

// --- AUDIO ENGINE ---
class LichAudio {
    ctx: AudioContext | null = null;
    rumbleNode: OscillatorNode | null = null;
    rumbleGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContext();
        }
    }

    startDrone() {
        if (!this.ctx) return;

        // Deep Rumble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, this.ctx.currentTime); // 50Hz deep lows

        // Wobble frequency for "breathing" effect
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.2; // Slow pulse
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        filter.type = 'lowpass';
        filter.frequency.value = 120; // Cut off highs

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        gain.gain.setValueAtTime(0, this.ctx.currentTime);

        this.rumbleNode = osc;
        this.rumbleGain = gain;
    }

    rampVolume(val: number) {
        if (this.rumbleGain && this.ctx) {
            this.rumbleGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.5);
        }
    }
}

export default function PromoPage() {
    const [started, setStarted] = useState(false);
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [progress, setProgress] = useState(0);

    const audioRef = useRef<LichAudio | null>(null);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    // SCENE CONTROLLER
    useEffect(() => {
        if (!started || sceneIndex >= SCENES.length) return;

        const scene = SCENES[sceneIndex];

        // AUDIO FX UPDATE
        // If scene is intense (Avatar scenes), boost background drone
        if (audioRef.current) {
            const baseVol = (scene.visual.includes('avatar') || scene.visual === 'banner') ? 0.3 : 0.1;
            audioRef.current.rampVolume(baseVol);
        }

        // HANDLE SPEECH
        if (scene.speak && synth) {
            // Cancel previous
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(scene.speak);

            // LICH VOICE SETTINGS
            const voices = synth.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("David")) || voices.find(v => v.name.includes("Google US English")) || voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.pitch = 0.5; // Very low
            utterance.rate = 0.8; // Slow and deliberate
            utterance.volume = 1.0;

            utterance.onstart = () => {
                setIsSpeaking(true);
                // Boost drone when speaking to simulate resonance
                if (audioRef.current && audioRef.current.rumbleGain && audioRef.current.ctx) {
                    // Add "growl" layer? Just boost current drone
                    audioRef.current.rumbleGain.gain.setTargetAtTime(0.6, audioRef.current.ctx.currentTime, 0.1);
                }
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                // Reduce drone
                if (audioRef.current && audioRef.current.rumbleGain && audioRef.current.ctx) {
                    audioRef.current.rumbleGain.gain.setTargetAtTime(0.2, audioRef.current.ctx.currentTime, 0.5);
                }
                setTimeout(nextScene, 1000); // 1s pause after line
            };

            synth.speak(utterance);
        } else {
            setTimeout(nextScene, 4000);
        }

        return () => {
            if (synth) synth.cancel();
        }

    }, [sceneIndex, started]);

    const nextScene = () => {
        setSceneIndex(prev => prev + 1);
    };

    const startRitual = () => {
        setStarted(true);
        // Init Audio
        audioRef.current = new LichAudio();
        audioRef.current.startDrone();
        if (synth) synth.getVoices();
    };

    const currentScene = SCENES[sceneIndex] || SCENES[SCENES.length - 1];

    if (!started) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono cursor-pointer" onClick={startRitual}>
                <div className="text-center animate-pulse">
                    <h1 className="text-6xl text-red-600 font-bold mb-4 tracking-widest">SYSTEM READY</h1>
                    <button className="px-8 py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black font-bold uppercase tracking-[0.5em] transition-all">
                        CLICK TO INITIATE
                    </button>
                    <p className="mt-4 text-gray-500 text-xs">Enable Audio • Fullscreen Recommended</p>
                </div>
            </div>
        );
    }

    if (sceneIndex >= SCENES.length) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono">
                <div className="text-center">
                    <h1 className="text-4xl mb-4 text-green-500">TRANSMISSION COMPLETE</h1>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 border border-green-500 hover:bg-green-500 hover:text-black">
                        REPLAY SIMULATION
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden font-mono text-white select-none cursor-none">

            {/* BACKGROUND: MATRIX RAIN */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${currentScene.visual === 'banner' ? 'opacity-0' : 'opacity-30'}`}
                style={{
                    backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .3) 25%, rgba(32, 255, 77, .3) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .3) 75%, rgba(32, 255, 77, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .3) 25%, rgba(32, 255, 77, .3) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .3) 75%, rgba(32, 255, 77, .3) 76%, transparent 77%, transparent)",
                    backgroundSize: "40px 40px",
                    animation: "slide-scan 2s linear infinite"
                }}
            />

            {/* SCENE VISUALS */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* SCENE 1 & 2: TEXT FOCUS */}
                {(currentScene.visual === 'code_rain') && (
                    <div className="animate-pulse">
                        <div className="text-9xl text-green-500 font-bold opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            SYSTEM://
                        </div>
                    </div>
                )}

                {/* SCENE 3-5: AVATAR */}
                {(currentScene.visual.includes('avatar')) && (
                    <div className={`
                        relative w-[500px] h-[500px] transition-all duration-1000 origin-bottom
                        ${currentScene.visual === 'avatar_reveal' ? 'opacity-0 animate-in fade-in duration-1000' : 'opacity-100'}
                        ${currentScene.visual === 'avatar_zoom' ? 'scale-150' : 'scale-100'}
                        ${currentScene.glitch ? 'animate-shake' : ''}
                        ${isSpeaking ? 'animate-talking' : ''}
                    `}>
                        <Image
                            src="/marketing/glitch_lich_avatar.png"
                            alt="Avatar"
                            fill
                            className="object-contain drop-shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                        />
                        {/* Glitch Overlay */}
                        {currentScene.glitch && (
                            <div className="absolute inset-0 bg-red-500 Mix-blend-overlay opacity-20 animate-pulse" />
                        )}
                    </div>
                )}

                {/* SCENE 6: BANNER */}
                {currentScene.visual === 'banner' && (
                    <div className="relative w-full h-full animate-in zoom-in duration-1000">
                        <Image
                            src="/marketing/glitch_lich_youtube_banner.png"
                            alt="Banner"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
                            <button className="px-12 py-6 bg-red-600 text-white text-4xl font-bold uppercase tracking-widest animate-pulse shadow-[0_0_50px_red]">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* TEXT OVERLAYS (SUBTITLES - Subtle Now) */}
            <div className="absolute bottom-32 left-0 right-0 text-center space-y-4 px-20">
                {/* Main Headline (If Any) */}
                {currentScene.text && (
                    <h1 className={`text-6xl font-black bg-black/50 backdrop-blur-sm inline-block px-8 py-4 border-l-8 border-red-500 text-white`}>
                        {currentScene.text}
                    </h1>
                )}

                {/* Subtitles (Caption Style) */}
                {currentScene.subtext && (
                    <div>
                        <p className="text-xl text-cyan-400 font-bold bg-black/90 inline-block px-4 py-1 border border-cyan-900/50">
                            {currentScene.subtext}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, SkipForward, Sword } from 'lucide-react';
import { useAudio } from "@/lib/context/AudioContext";

interface NarrativeIntroProps {
    onComplete: () => void;
}

export default function NarrativeIntro({ onComplete }: NarrativeIntroProps) {
    const { playAmbience } = useAudio();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrolledBottom, setScrolledBottom] = useState(false);

    useEffect(() => {
        playAmbience("dungeon"); // Start mood music
    }, [playAmbience]);

    // Check scroll position to show "Continue" button prominently
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            setScrolledBottom(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black text-[#a8a29e] z-[100] font-serif overflow-hidden opacity-0 animate-in fade-in duration-2000">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/textures/parchment_dark.jpg')] bg-cover opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10"></div>

            {/* Scrolling Content */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="relative z-20 h-full overflow-y-auto custom-scrollbar px-6 md:px-0 scroll-smooth"
            >
                <div className="max-w-2xl mx-auto py-24 space-y-16 text-center">

                    {/* Header */}
                    <div className="space-y-4 mb-24 opacity-0 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 fill-mode-forwards">
                        <p className="text-[#a32222] text-sm tracking-[0.5em] uppercase">The Chronicle of the Fall</p>
                        <h1 className="text-4xl md:text-6xl font-bold text-[#d4c391] drop-shadow-md">THE SHADOW KING'S RISE</h1>
                    </div>

                    {/* Story Sections */}
                    <div className="space-y-12 text-lg md:text-xl leading-relaxed text-[#c9bca0]/90">
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-1000 fill-mode-forwards">
                            It began in the Year of the Ageless One. The sky over the Sword Coast turned the color of bruised iron. Birds fell silent. The Weave itself seemed to shiver.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-2000 fill-mode-forwards">
                            Larloch, the Shadow King, Lich-Lord of Warlock's Crypt, has finally moved. Not with armies of bone and steel, but with a curse. A single, silent curse that spreads like frost through the veins of the world.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-3000 fill-mode-forwards">
                            Entire cities have simply... stopped. Their people frozen in the final moments of their lives, trapped in an endless loop of grey memory. Oakhaven was the first to fall. Then Daggerford. Then Waterdeep's outskirts.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-4000 fill-mode-forwards">
                            You are the only one left.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-5000 fill-mode-forwards text-[#a32222] font-bold">
                            Or so you thought.
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-24 pb-48 opacity-0 animate-in zoom-in-95 fade-in duration-1000 delay-[6000ms] fill-mode-forwards">
                        <button
                            onClick={onComplete}
                            className="group relative inline-flex items-center gap-4 px-12 py-4 bg-transparent border border-[#d4c391] hover:bg-[#d4c391] hover:text-black transition-all duration-500"
                        >
                            <Sword className="w-5 h-5 animate-pulse" />
                            <span className="text-xl font-bold uppercase tracking-[0.2em]">Enter the Darkness</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Skip / Scroll Hint */}
            <div className={`absolute bottom-8 right-8 z-30 transition-opacity duration-500 ${scrolledBottom ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex flex-col items-center gap-2 text-[#555] animate-bounce">
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>

            <button
                onClick={onComplete}
                className="absolute top-8 right-8 z-30 text-[10px] text-[#444] hover:text-[#a32222] uppercase tracking-widest transition-colors flex items-center gap-2"
            >
                Start Immediately <SkipForward className="w-3 h-3" />
            </button>
        </div>
    );
}

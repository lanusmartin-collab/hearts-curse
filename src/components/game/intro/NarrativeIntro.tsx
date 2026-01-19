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
                    <div className="space-y-12 text-lg md:text-xl leading-relaxed text-[#c9bca0]/90 text-justify">
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-1000 fill-mode-forwards">
                            The year is 1491 DR, the Year of the Scarlet Witch. The Sword Coast, usually a bustle of trade and intrigue, has fallen into a terrified silence. It began in the high peaks of the Troll Mountains, near the ruins of Warlock's Crypt—the ancient stronghold of Larloch the Shadow King.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-2000 fill-mode-forwards">
                            For centuries, the Netherese lich was content to study his dark arts in isolation, his city a tomb of forgotten magic. But something changed. The Weave itself shuddered three nights ago, and a violet fog began to roll down from the mountains. Where it touched, time simply... stopped.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-3000 fill-mode-forwards">
                            The town of Oakhaven was the first to vanish. Not destroyed, but frozen in a single, greyscale moment. Merchants mid-barter, birds suspended in flight, the river halted as if carved from glass. The "Heart's Curse," the sages are calling it—a stasis field that consumes the soul while preserving the body in an eternal, dreamless slumber.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-4000 fill-mode-forwards">
                            You were there when the fog hit Daggerford. You remember the scream of the militia captain, the cold that bit not just your skin but your very memory. You ran. You fought. But the fog was faster.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-5000 fill-mode-forwards">
                            Now, you stand at the precipice of a different kind of darkness. You clearly remember dying. You remember the cold taking you. And yet, you are here. Not in the frozen ruins of Daggerford, but in a void between worlds, a place of swirling shadows and distant, mocking laughter.
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-6000 fill-mode-forwards">
                            A voice whispers to you from the dark—not the Shadow King's, but something older. Something desperate. "The Heart... find the Heart... or the silence will never end."
                        </p>
                        <p className="opacity-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-7000 fill-mode-forwards text-[#a32222] font-bold text-center mt-12">
                            The Curse has claimed the world. But it has not yet claimed you.
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

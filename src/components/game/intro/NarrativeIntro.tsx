import React, { useState, useEffect } from 'react';
import { Typewriter } from "@/components/ui/Typewriter";
import { ArrowRight, SkipForward } from 'lucide-react';
import { useAudio } from "@/lib/context/AudioContext";

interface NarrativeIntroProps {
    onComplete: () => void;
}

const INTRO_SLIDES = [
    {
        text: "The Year of the Ageless One. The Shadow of Larloch stretches across the Sword Coast.",
        image: "/hearts_curse_hero_v15.png" // Placeholder, reuse hero or specific art
    },
    {
        text: "Heroes from all corners of Faerûn have gathered, drawn by whisper and fate...",
        image: "/hearts_curse_hero_v15.png"
    },
    {
        text: "But the Warlock King is not so easily defied. Darkness falls, and hope flickers like a dying candle.",
        image: "/hearts_curse_hero_v15.png"
    }
];

export default function NarrativeIntro({ onComplete }: NarrativeIntroProps) {
    const [slideIndex, setSlideIndex] = useState(0);
    const { playAmbience } = useAudio();

    useEffect(() => {
        playAmbience("dungeon"); // Start mood music
    }, [playAmbience]);

    const nextSlide = () => {
        if (slideIndex < INTRO_SLIDES.length - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const currentSlide = INTRO_SLIDES[slideIndex];

    return (
        <div className="fixed inset-0 bg-black text-[#c9bca0] z-[100] flex flex-col items-center justify-center p-8 font-serif">
            {/* Background Image with Fade */}
            <div key={slideIndex} className="absolute inset-0 z-0 opacity-30 animate-in fade-in duration-1000">
                {/* Using a div background or Image component if available */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${currentSlide.image}')` }}
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                <div className="min-h-[150px] flex items-center justify-center text-2xl md:text-3xl leading-relaxed drop-shadow-md">
                    <Typewriter
                        key={slideIndex}
                        text={currentSlide.text}
                        speed={30}
                        delay={500}
                    />
                </div>

                <div className="flex justify-center pt-8">
                    <button
                        onClick={nextSlide}
                        className="group flex items-center gap-2 px-8 py-3 bg-[#a32222] text-white hover:bg-[#c42828] transition-all uppercase tracking-widest font-bold text-sm border border-red-900 shadow-[0_0_15px_rgba(163,34,34,0.3)]"
                    >
                        <span>{slideIndex === INTRO_SLIDES.length - 1 ? "Begin Journey" : "Next"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <button
                onClick={onComplete}
                className="absolute bottom-8 right-8 text-xs text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors z-20"
            >
                <SkipForward className="w-3 h-3" /> Skip Intro
            </button>
        </div>
    );
}

import React from 'react';
import Image from 'next/image';
import { Skull, Moon, Save } from 'lucide-react';

interface MainMenuProps {
    onCreateChar: () => void;
    onLoadGame: () => void; // Placeholder
}

export default function MainMenu({ onCreateChar, onLoadGame }: MainMenuProps) {
    return (
        <div className="fixed inset-0 bg-[#050505] text-[#d4c391] z-[100] flex flex-col items-center justify-center font-serif overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Image
                    src="/hearts_curse_hero_v15.png"
                    alt="Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            </div>

            {/* Title Section */}
            <div className="relative z-10 text-center mb-16 animate-in slide-in-from-top-10 duration-1000">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#a32222] drop-shadow-[0_0_25px_rgba(163,34,34,0.6)] animate-pulse-slow">
                    HEART'S CURSE
                </h1>
                <p className="text-[#8b7e66] tracking-[0.5em] text-sm mt-4 uppercase">
                    A Dungeons & Dragons Campaign
                </p>
            </div>

            {/* Menu Buttons */}
            <div className="relative z-10 flex flex-col gap-4 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                <button
                    onClick={onCreateChar}
                    className="group relative px-8 py-4 bg-[#1a0a0a] border border-[#a32222]/50 hover:bg-[#a32222] hover:text-white transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
                    <div className="relative flex items-center justify-center gap-3">
                        <Skull className="w-5 h-5 text-[#ff4444] group-hover:text-white transition-colors" />
                        <span className="text-lg font-bold tracking-[0.2em] uppercase">New Game</span>
                    </div>
                </button>

                <button
                    onClick={onLoadGame}
                    className="group relative px-8 py-4 bg-[#0a0a0a] border border-[#333] hover:border-[#8b7e66] hover:text-white transition-opacity opacity-50 cursor-not-allowed"
                    disabled
                >
                    <div className="relative flex items-center justify-center gap-3">
                        <Save className="w-5 h-5 text-gray-600 group-hover:text-[#d4c391]" />
                        <span className="text-lg font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-[#d4c391]">Load Game</span>
                    </div>
                </button>

                <div className="text-center mt-8 text-xs text-[#555] font-mono hover:text-[#777] cursor-pointer">
                    v2.1.0 // PRE-ALPHA BUILD
                </div>
            </div>
        </div>
    );
}

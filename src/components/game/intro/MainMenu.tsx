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
            <div className="relative z-10 flex flex-col gap-6 w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">

                <button
                    onClick={onCreateChar}
                    className="group relative px-6 py-3 bg-[#0a0505] border-[1px] border-[#a32222] hover:border-[#ff4444] transition-all duration-300 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(163,34,34,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a32222]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                    <div className="relative flex items-center justify-center gap-3">
                        <Skull className="w-4 h-4 text-[#8b7e66] group-hover:text-[#ff4444] transition-colors" />
                        <span className="text-base font-serif font-bold tracking-[0.15em] uppercase text-[#d4c391] group-hover:text-white">New Game</span>
                    </div>
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#d4c391] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#d4c391] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button
                    onClick={onLoadGame}
                    className="group relative px-6 py-3 bg-[#0a0505] border border-[#333] transition-all opacity-60 cursor-not-allowed"
                    disabled
                >
                    <div className="relative flex items-center justify-center gap-3">
                        <Save className="w-4 h-4 text-gray-700" />
                        <span className="text-base font-serif font-bold tracking-[0.15em] uppercase text-gray-600">Load Game</span>
                    </div>
                </button>

                <div className="text-center mt-8 text-[10px] text-[#444] font-mono tracking-widest hover:text-[#a32222] cursor-pointer transition-colors">
                    v2.1.0 // HEART'S CURSE
                </div>
            </div>
        </div>
    );
}

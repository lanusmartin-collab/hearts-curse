import { useState } from 'react';
import Image from 'next/image';
import { Skull, Moon, Save } from 'lucide-react';
import SaveLoadMenu from './SaveLoadMenu';
import { GameSaveData } from '@/lib/game/SaveManager';

interface MainMenuProps {
    onCreateChar: () => void;
    onLoadGame: (save: GameSaveData) => void;
}

export default function MainMenu({ onCreateChar, onLoadGame }: MainMenuProps) {
    const [showLoadMenu, setShowLoadMenu] = useState(false);

    if (showLoadMenu) {
        return (
            <div className="fixed inset-0 bg-[#0a0a0c] z-[100] flex items-center justify-center p-4">
                <Image
                    src="/hearts_curse_hero_v15.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20"
                />
                <div className="relative z-10 w-full max-w-2xl">
                    <SaveLoadMenu
                        onLoad={onLoadGame}
                        onBack={() => setShowLoadMenu(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0c] z-[100] flex flex-col font-serif overflow-hidden">

            {/* Top Half: Hero Image */}
            <div className="relative h-[45%] w-full border-b-[1px] border-[#333]">
                <Image
                    src="/hearts_curse_hero_v15.png"
                    alt="Background"
                    fill
                    className="object-cover object-top"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent opacity-90"></div>

                {/* Title Overlay */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-10 p-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#e5e5e5] drop-shadow-2xl">
                        HEARTS<span className="text-[#a32222]">CURSE</span>
                    </h1>
                    <p className="text-[#888] tracking-[0.4em] text-xs uppercase mt-2 font-mono">
                        The Chronicle of the Fall
                    </p>
                </div>
            </div>

            {/* Bottom Half: Controls */}
            <div className="flex-1 flex flex-col items-center justify-start pt-12 gap-6 bg-[#050505] relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
                {/* Decorative Line */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#a32222] to-transparent mb-4"></div>

                {/* PRO BUTTON STYLE - High Contrast */}
                <button
                    onClick={onCreateChar}
                    className="w-72 py-4 border-2 border-[#8b7e66] hover:border-[#a32222] bg-[#1a1a1a] hover:bg-[#2a1a1a] text-[#e5e5e5] hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold flex items-center justify-center gap-3 shadow-xl group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Skull className="w-4 h-4 text-[#8b7e66] group-hover:text-[#a32222] transition-colors" />
                    New Campaign
                </button>

                <button
                    onClick={() => setShowLoadMenu(true)}
                    className="w-72 py-4 border-2 border-[#444] hover:border-[#a32222] bg-[#1a1a1a] hover:bg-[#2a1a1a] text-[#aaa] hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-sm font-bold flex items-center justify-center gap-3 shadow-xl group relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Save className="w-4 h-4 text-[#555] group-hover:text-[#a32222] transition-colors" />
                    Load Game
                </button>

                <div className="absolute bottom-8 text-[#333] text-[10px] font-mono tracking-widest">
                    BUILD 2.3 // NETHERIL ENGINE
                </div>
            </div>
        </div>
    );
}

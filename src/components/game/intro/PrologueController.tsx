import React, { useState, useEffect } from "react";
import CombatLayout from "@/components/game/CombatLayout";
import { Typewriter } from "@/components/ui/Typewriter";
import { useAudio } from "@/lib/context/AudioContext";
import { Sparkles, Scroll } from "lucide-react";
import { downgradeCharacter } from "@/lib/game/CharacterMechanics";

interface PrologueControllerProps {
    playerCharacter: any; // Combatant
    onComplete: (rewards: any) => void;
}

type PrologueStage = "battle_intro" | "combat" | "wish_scene" | "khelben_scene";

// Mock Larloch Data (if not in JSON yet)
const LARLOCH_SLUG = "larloch_shadow_king";

export default function PrologueController({ playerCharacter, onComplete }: PrologueControllerProps) {
    const [stage, setStage] = useState<PrologueStage>("battle_intro");
    const { playAmbience, playMusic } = useAudio();
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        if (stage === "battle_intro") {
            playMusic("boss_battle"); // Assuming track exists
        } else if (stage === "wish_scene") {
            playAmbience("ethereal");
        } else if (stage === "khelben_scene") {
            playAmbience("library");
        }
    }, [stage, playAmbience, playMusic]);

    // -- STAGE 1: BATTLE INTRO --
    if (stage === "battle_intro") {
        return (
            <div className="fixed inset-0 bg-black text-red-500 flex flex-col items-center justify-center p-8 font-serif z-[100] animate-in fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-widest animate-pulse">THE END OF DAYS</h1>
                <p className="text-xl text-[#d4c391] mb-8 text-center max-w-2xl">
                    Larloch, the Shadow King, has unleashed his final spell. The Weave unravels. You stand amongst the last defenders of Faerûn...
                </p>
                <button
                    onClick={() => setStage("combat")}
                    className="px-8 py-3 bg-[#a32222] text-white hover:bg-black hover:border border-red-500 transition-all uppercase tracking-widest font-bold"
                >
                    Face Destiny
                </button>
            </div>
        );
    }

    // -- STAGE 2: COMBAT (UNWINNABLE) --
    if (stage === "combat") {
        return (
            <CombatLayout
                enemySlugs={[LARLOCH_SLUG]}
                playerCharacter={playerCharacter} // Pass the created character
                onVictory={() => setStage("wish_scene")}
                onFlee={() => setStage("wish_scene")}
                onDefeat={() => setStage("wish_scene")}
            />
        );
    }

    // -- STAGE 3: THE WISH --
    if (stage === "wish_scene") {
        return (
            <div className="fixed inset-0 bg-[#0a0a1a] text-cyan-200 flex flex-col items-center justify-center p-12 font-serif z-[100] animate-in fade-in duration-1000">
                <div className="max-w-3xl text-center space-y-6">
                    <Sparkles className="w-16 h-16 mx-auto text-cyan-400 animate-spin-slow mb-6" />
                    <div className="text-2xl md:text-3xl leading-relaxed drop-shadow-[0_0_10px_cyan]">
                        <Typewriter
                            text="As darkness consumes you, a voice of smokeless fire pierces the void. 'Not like this,' whispers the Djinn. 'I owe you a debt of stars, mortal. One wish. One chance to turn the tide. Wake...'"
                            speed={30}
                            delay={100}
                        />
                    </div>
                    <button
                        onClick={() => setStage("khelben_scene")}
                        className="mt-12 px-8 py-3 bg-transparent border border-cyan-500 text-cyan-100 hover:bg-cyan-900/30 transition-all uppercase tracking-widest font-bold animate-pulse"
                    >
                        Awaken
                    </button>
                </div>
            </div>
        );
    }

    // -- STAGE 4: KHELBEN'S TOWER --
    if (stage === "khelben_scene") {
        return (
            <div className="fixed inset-0 bg-[#1a1515] text-[#d4c391] flex flex-col items-center justify-center p-8 font-serif z-[100] animate-in fade-in duration-1000">
                {/* Background Image Suggestion */}
                <div className="absolute inset-0 bg-[url('/locations/tower.jpg')] bg-cover bg-center opacity-20 pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl bg-[#0a0a0c]/90 border border-[#8b7e66] p-8 md:p-12 shadow-2xl">
                    <h2 className="text-2xl text-[#a32222] font-bold mb-4 flex items-center gap-3">
                        <Scroll className="w-6 h-6" /> Khelben "Blackstaff" Arunsun
                    </h2>

                    <div className="text-lg italic text-[#d4c391]/90 mb-8 leading-relaxed space-y-4">
                        <p>"You are awake. Good. The Djinn's magic was... chaotic, but effective."</p>
                        <p>"We have been given a second chance, but time is short. Take this. It contains the essence needed to anchor your soul to this timeline."</p>
                    </div>

                    <div className="bg-black/50 p-6 border border-[#333] mb-8 flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#222] border border-[#d4c391] flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-cyan-100">Essence of the Djinn</h3>
                            <p className="text-sm text-cyan-100/60">A swirling vial of starlight. Grants +2 to Primary Stat.</p>
                        </div>
                    </div>



                    // ... inside the component ...

                    <button
                        onClick={() => {
                            const downgradedChar = downgradeCharacter(playerCharacter);
                            onComplete({ item: "essence_djinn", updatedCharacter: downgradedChar });
                        }}
                        className="w-full py-4 bg-[#a32222] text-white font-bold uppercase tracking-[0.2em] hover:bg-[#c42828] transition-all border border-red-900"
                    >
                        Accept Destiny & Begin
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

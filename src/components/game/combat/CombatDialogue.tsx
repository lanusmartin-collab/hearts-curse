import React, { useEffect, useState } from 'react';
import { Typewriter } from '@/components/ui/Typewriter';

interface CombatDialogueProps {
    speaker: string;
    text: string;
    isVisible: boolean;
    onComplete?: () => void;
}

export default function CombatDialogue({ speaker, text, isVisible, onComplete }: CombatDialogueProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                if (onComplete) onComplete();
            }, 5000 + (text.length * 50)); // Dynamic duration based on length
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isVisible, text, onComplete]);

    if (!show) return null;

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-black/80 backdrop-blur-md border border-[#a32222] p-6 text-center shadow-[0_0_30px_rgba(163,34,34,0.5)] transform rotate-1">
                <h3 className="text-[#a32222] font-bold uppercase tracking-[0.2em] mb-2 text-lg drop-shadow-md">{speaker}</h3>
                <div className="text-xl font-serif text-[#d4c391] italic leading-relaxed">
                    "{text}"
                </div>
            </div>
        </div>
    );
}

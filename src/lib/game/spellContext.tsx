"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpellContextType {
    isOpen: boolean;
    selectedSpellName: string | null;
    openGrimoire: (spellName?: string) => void;
    closeGrimoire: () => void;
}

const SpellContext = createContext<SpellContextType | undefined>(undefined);

import { useRouter } from 'next/navigation';

export function SpellProvider({ children }: { children: ReactNode }) {
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
    const router = useRouter();

    const openGrimoire = (spellName?: string) => {
        if (spellName) {
            // Redirect to the dedicated page with the spell as a query param
            router.push(`/grimoire?spell=${encodeURIComponent(spellName)}`);
        } else {
            router.push('/grimoire');
        }
    };

    const closeGrimoire = () => {
        // No-op in page mode, or could navigate back
        setSelectedSpellName(null);
    };

    return (
        <SpellContext.Provider value={{ isOpen: false, selectedSpellName, openGrimoire, closeGrimoire }}>
            {children}
        </SpellContext.Provider>
    );
}

export function useGrimoire() {
    const context = useContext(SpellContext);
    if (context === undefined) {
        throw new Error('useGrimoire must be used within a SpellProvider');
    }
    return context;
}

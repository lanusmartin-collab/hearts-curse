"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SpellContextType {
    isOpen: boolean;
    selectedSpellName: string | null;
    openGrimoire: (spellName?: string) => void;
    closeGrimoire: () => void;
}

const SpellContext = createContext<SpellContextType | undefined>(undefined);

export function SpellProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);

    const openGrimoire = (spellName?: string) => {
        if (spellName) setSelectedSpellName(spellName);
        setIsOpen(true);
    };

    const closeGrimoire = () => {
        setIsOpen(false);
        setSelectedSpellName(null);
    };

    return (
        <SpellContext.Provider value={{ isOpen, selectedSpellName, openGrimoire, closeGrimoire }}>
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

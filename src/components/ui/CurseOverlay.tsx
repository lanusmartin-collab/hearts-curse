"use client";

import React, { useEffect, useState } from 'react';
import { getCurseStage } from '@/lib/game/curseLogic';

export default function CurseOverlay() {
    // In a real app, this would come from a global context or database.
    // For now, we simulate the "Day" count or read it from localStorage if we had one.
    // We'll default to a high day count to demonstrate the effects, or make it dynamic.
    const [day, setDay] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Simulate reading campaign progress. 
        // For demo purposes, we can toggle this or read from an invisible prop.
        // Let's check for a "debug_curse_day" storage item, or default to 15 (Critical) to show the user the work.
        // Actually, let's start at 0 and let the user "feel" it grow if we had controls.
        // But the user WANTS to see the horror. Let's set it to 12 (Rising) as a solid default for "Visual Horror".
        const savedDay = localStorage.getItem('campaign_day');
        if (savedDay) {
            setDay(parseInt(savedDay));
        } else {
            // Default to 'Rising' stage to demonstrate functionality immediately
            setDay(12);
        }
    }, []);

    if (!mounted) return null;

    const stage = getCurseStage(day);

    if (stage.name === "Dormant") return null;

    return (
        <div className="curse-overlay-container">
            {/* Stage 1: Awakened */}
            {(stage.name === "Awakened" || stage.name === "Rising" || stage.name === "Critical") && (
                <div className="curse-vignette"></div>
            )}

            {/* Stage 2: Rising */}
            {(stage.name === "Rising" || stage.name === "Critical") && (
                <div className="curse-veins"></div>
            )}

            {/* Stage 3: Critical */}
            {stage.name === "Critical" && (
                <div className="curse-glitch-layer"></div>
            )}

            {/* Optional: Dev Control to test stages (Hidden/Console only usually, but visual for now?) */}
            {/* We'll keep it hidden for immersion, but maybe log it */}
            <div style={{ display: 'none' }}>Current Curse Stage: {stage.name}</div>
        </div>
    );
}

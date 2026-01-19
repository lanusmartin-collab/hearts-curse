"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Combatant } from '@/types/combat';
import Image from 'next/image';

interface TacticalMapProps {
    combatants: Combatant[];
    onMove: (combatantId: string, x: number, y: number) => void;
    activeCombatantId?: string;
    canMove: boolean;
}

const GRID_SIZE = 15; // 15x15 grid
const CELL_SIZE = 50; // pixels

export default function TacticalMap({ combatants, onMove, activeCombatantId, canMove }: TacticalMapProps) {
    const [positions, setPositions] = useState<{ [id: string]: { x: number, y: number } }>({});
    const [selectedToken, setSelectedToken] = useState<string | null>(null);

    // Initial positioning simulation
    useEffect(() => {
        // Place Hero at center bottom
        // Place Larloch at center top
        // Place minions around
        const newPos: any = {};
        combatants.forEach((c, i) => {
            if (c.type === 'player') {
                newPos[c.id] = { x: 7, y: 13 };
            } else if (c.name.includes("Larloch")) {
                newPos[c.id] = { x: 7, y: 2 };
            } else if (c.name.includes("Dracolich")) {
                newPos[c.id] = { x: 7, y: 5 };
            } else {
                newPos[c.id] = { x: (i % 15), y: 4 }; // Scatter logic
            }
        });
        setPositions(newPos);
    }, [combatants.length]); // Only run on init

    const handleClick = (x: number, y: number) => {
        if (!canMove || !activeCombatantId) return;

        // If selecting self (already auto-selected by turn, but just in case)

        // If moving
        if (selectedToken === activeCombatantId) {
            // Calculate distance (Manhattan or Chebyshev? 5e uses non-euclidean 5-5-5 usually, but simplified to max(dx, dy) for diagonals is Chebyshev)
            const current = positions[activeCombatantId];
            if (!current) return;

            const dist = Math.max(Math.abs(current.x - x), Math.abs(current.y - y));
            // Assume speed 30ft = 6 squares
            if (dist <= 6) {
                // ANIMATE
                setPositions(prev => ({ ...prev, [activeCombatantId]: { x, y } }));
                onMove(activeCombatantId, x, y);
                setSelectedToken(null);
            } else {
                alert("Too far!");
            }
        }
    };

    return (
        <div className="relative border-4 border-[#333] shadow-2xl bg-[#111] w-fit mx-auto select-none">
            {/* Grid Layer */}
            <div
                className="grid relative z-10"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    backgroundImage: 'url("/textures/grid_bg.jpg")', // Placeholder
                    backgroundSize: 'cover'
                }}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSelected = selectedToken && positions[selectedToken];
                    // Highlight logic could go here

                    return (
                        <div
                            key={i}
                            onClick={() => handleClick(x, y)}
                            className={`border border-white/5 hover:bg-white/10 transition-colors
                                ${isSelected && Math.max(Math.abs(positions[selectedToken].x - x), Math.abs(positions[selectedToken].y - y)) <= 6 ? 'bg-green-500/20 cursor-pointer' : ''}
                            `}
                        />
                    );
                })}
            </div>

            {/* Token Layer */}
            {combatants.map(c => {
                const pos = positions[c.id];
                if (!pos) return null;

                const isMyTurn = c.id === activeCombatantId;
                const isSelected = selectedToken === c.id;

                return (
                    <div
                        key={c.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isMyTurn && canMove) setSelectedToken(c.id);
                        }}
                        className={`absolute w-[40px] h-[40px] rounded-full z-20 transition-all duration-300 flex items-center justify-center
                            ${isMyTurn ? 'ring-2 ring-yellow-400 scale-110 shadow-[0_0_15px_yellow]' : ''}
                            ${isSelected ? 'ring-4 ring-green-500' : ''}
                            ${c.type === 'player' ? 'bg-blue-600 border-2 border-white' : 'bg-red-900 border-2 border-red-500'}
                        `}
                        style={{
                            left: pos.x * CELL_SIZE + 5,
                            top: pos.y * CELL_SIZE + 5,
                        }}
                    >
                        {/* Avatar / Icon */}
                        {c.type === 'player' ? (
                            <span className="font-bold text-xs text-white">PC</span>
                        ) : (
                            <span className="font-bold text-xs text-red-200">{c.name.substring(0, 2)}</span>
                        )}

                        {/* HP Bar Mini */}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black">
                            <div className="h-full bg-green-500" style={{ width: `${(c.hp / c.maxHp) * 100}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

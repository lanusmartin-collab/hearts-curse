"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Combatant } from '@/types/combat';
import Image from 'next/image';

interface TacticalMapProps {
    combatants: Combatant[];
    onMove: (combatantId: string, x: number, y: number) => void;
    activeCombatantId?: string;
    canMove: boolean;
    aoeMode?: { radius: number, range: number, onConfirm: (x: number, y: number) => void } | null;
}

const GRID_SIZE = 20; // 20x20 grid (100ft x 100ft)
const CELL_SIZE = 40; // Reduced slightly to fit screen better

export default function TacticalMap({ combatants, onMove, activeCombatantId, canMove, aoeMode }: TacticalMapProps) {
    const [positions, setPositions] = useState<{ [id: string]: { x: number, y: number } }>({});
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [hoverPos, setHoverPos] = useState<{ x: number, y: number } | null>(null);

    // Initial positioning simulation
    useEffect(() => {
        // Place Hero at center bottom
        // Place Larloch at center top
        // Place minions around
        const newPos: any = {};
        combatants.forEach((c, i) => {
            if (c.type === 'player') {
                if (!newPos[c.id]) newPos[c.id] = { x: 10, y: 18 };
            } else if (c.name.includes("Larloch")) {
                if (!newPos[c.id]) newPos[c.id] = { x: 10, y: 2 };
            } else if (c.name.includes("Dracolich")) {
                if (!newPos[c.id]) newPos[c.id] = { x: 10, y: 5 };
            } else {
                if (!newPos[c.id]) newPos[c.id] = { x: (i % 20), y: 8 };
            }
        });
        setPositions((prev) => {
            // Merge to preserve movement
            return { ...newPos, ...prev };
        });
    }, [combatants.length]);

    const handleClick = (x: number, y: number) => {
        // AoE Mode
        if (aoeMode) {
            aoeMode.onConfirm(x, y);
            return;
        }

        if (!canMove || !activeCombatantId) return;

        // If moving
        if (selectedToken === activeCombatantId) {
            const current = positions[activeCombatantId];
            if (!current) return;

            const dist = Math.max(Math.abs(current.x - x), Math.abs(current.y - y));
            // Assume speed 30ft = 6 squares
            if (dist <= 6) {
                setPositions(prev => ({ ...prev, [activeCombatantId]: { x, y } }));
                onMove(activeCombatantId, x, y);
                setSelectedToken(null);
            }
        }
    };

    const isHoveredInAoE = (x: number, y: number) => {
        if (!aoeMode || !hoverPos) return false;
        // Euclidean distance for circular AoE
        const dist = Math.sqrt(Math.pow(x - hoverPos.x, 2) + Math.pow(y - hoverPos.y, 2));
        return dist <= (aoeMode.radius / 5); // radius in feet / 5
    };

    return (
        <div
            className="relative border-4 border-[#444] shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#050505] w-fit mx-auto select-none overflow-hidden rounded-md"
            onMouseLeave={() => setHoverPos(null)}
        >
            {/* Grid Layer */}
            <div
                className="grid relative z-10"
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    backgroundImage: 'radial-gradient(circle, #222 1px, transparent 1px)',
                    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                    backgroundColor: '#111'
                }}
            >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSelected = selectedToken && positions[selectedToken];
                    const inAoE = isHoveredInAoE(x, y);

                    const isValidMove = isSelected &&
                        Math.max(Math.abs(positions[selectedToken].x - x), Math.abs(positions[selectedToken].y - y)) <= 6;

                    return (
                        <div
                            key={i}
                            onClick={() => handleClick(x, y)}
                            onMouseEnter={() => setHoverPos({ x, y })}
                            className={`border border-white/5 transition-colors relative
                                ${isValidMove ? 'bg-green-500/10 cursor-pointer hover:bg-green-500/30' : ''}
                                ${inAoE ? 'bg-orange-500/40' : ''}
                                ${aoeMode ? 'cursor-crosshair' : ''}
                            `}
                        >
                            {/* Grid coordinates for debugging/clarity */}
                            {/* <span className="absolute top-0 left-0 text-[8px] text-[#333]">{x},{y}</span> */}
                        </div>
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
                            if (aoeMode) {
                                handleClick(pos.x, pos.y); // Click the square under
                            } else if (isMyTurn && canMove) {
                                setSelectedToken(c.id);
                            }
                        }}
                        className={`absolute w-[36px] h-[36px] rounded-full z-20 transition-all duration-300 flex items-center justify-center shadow-lg
                            ${isMyTurn ? 'ring-2 ring-yellow-400 scale-110 shadow-[0_0_15px_yellow]' : ''}
                            ${isSelected ? 'ring-4 ring-green-500' : ''}
                            ${c.type === 'player' ? 'bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-cyan-300' :
                                c.name.includes("Larloch") ? 'bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500' :
                                    'bg-gradient-to-br from-red-900 to-black border-2 border-red-500'}
                        `}
                        style={{
                            left: pos.x * CELL_SIZE + 2,
                            top: pos.y * CELL_SIZE + 2,
                        }}
                    >
                        {/* Avatar */}
                        {c.type === 'player' ? (
                            <span className="font-bold text-[10px] text-white">HERO</span>
                        ) : (
                            <span className="font-bold text-[10px] text-red-100">{c.name.substring(0, 2).toUpperCase()}</span>
                        )}

                        {/* HP Bar Mini */}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all" style={{ width: `${(c.hp / c.maxHp) * 100}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

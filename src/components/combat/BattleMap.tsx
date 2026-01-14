"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export type CombatToken = {
    id: string;
    label: string;
    x: number; // Grid coordinates (not pixels)
    y: number;
    color: string;
    size: number; // 1 = Medium (5ft), 2 = Large (10ft), etc.
    image?: string;
    hp: number;
    maxHp: number;
    ac: number;
    initiative?: number;
};

type BattleMapProps = {
    tokens: CombatToken[];
    onTokenMove: (id: string, newX: number, newY: number) => void;
    rows?: number;
    cols?: number;
    cellSize?: number;
};

export default function BattleMap({ tokens, onTokenMove, rows = 15, cols = 20, cellSize = 50 }: BattleMapProps) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate map dimensions
    const width = cols * cellSize;
    const height = rows * cellSize;

    const getClientPos = (e: React.MouseEvent | React.TouchEvent) => {
        if ("touches" in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    };

    const handleStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent scroll on touch
        setDraggingId(id);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!draggingId || !containerRef.current) return;

        const { x, y } = getClientPos(e);
        const rect = containerRef.current.getBoundingClientRect();

        // Calculate grid position
        const relX = x - rect.left;
        const relY = y - rect.top;

        const gridX = Math.floor(relX / cellSize);
        const gridY = Math.floor(relY / cellSize);

        // Clamp to bounds
        const clampedX = Math.max(0, Math.min(cols - 1, gridX));
        const clampedY = Math.max(0, Math.min(rows - 1, gridY));

        // Find the token to check size (for bounds clamping on large tokens)
        // For simplicity, we just clamp top-left corner to grid for now.

        onTokenMove(draggingId, clampedX, clampedY);
    };

    const handleEnd = () => {
        setDraggingId(null);
    };

    return (
        <div
            ref={containerRef}
            className="relative border-4 border-stone-800 bg-stone-900 shadow-2xl overflow-hidden cursor-crosshair select-none"
            style={{ width, height }}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            {/* 1. Grid Layer */}
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-20">
                <defs>
                    <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* 2. Background Texture (Optional noise) */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            {/* 3. Token Layer */}
            {tokens.map(token => (
                <div
                    key={token.id}
                    onMouseDown={(e) => handleStart(token.id, e)}
                    onTouchStart={(e) => handleStart(token.id, e)}
                    className="absolute flex items-center justify-center transition-transform hover:z-20 group"
                    style={{
                        width: token.size * cellSize,
                        height: token.size * cellSize,
                        left: token.x * cellSize,
                        top: token.y * cellSize,
                        transition: draggingId === token.id ? "none" : "all 0.1s ease-out",
                        cursor: "grab",
                        zIndex: 10
                    }}
                >
                    {/* Token Visual */}
                    <div
                        className={`relative w-[90%] h-[90%] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] border-2 flex items-center justify-center overflow-hidden
                            ${draggingId === token.id ? "scale-110 shadow-xl ring-2 ring-white" : ""}`}
                        style={{ backgroundColor: token.color, borderColor: token.color }}
                    >
                        {token.image ? (
                            <Image
                                src={token.image}
                                alt={token.label}
                                fill
                                className="object-cover"
                                draggable={false}
                            />
                        ) : (
                            <span className="font-bold text-white drop-shadow-md text-xl">
                                {token.label.substring(0, 2).toUpperCase()}
                            </span>
                        )}

                        {/* HP Bar */}
                        <div className="absolute bottom-1 left-2 right-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${token.hp < token.maxHp / 2 ? "bg-red-500" : "bg-green-500"}`}
                                style={{ width: `${(token.hp / token.maxHp) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 border border-userId-600">
                        {token.label} (AC {token.ac})
                    </div>
                </div>
            ))}
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/lib/context/AudioContext";

type Position = { x: number; y: number };

type DieResult = {
    id: string;
    sides: number;
    val: number | string;
    settled: boolean;
    isCrit?: boolean;
    isCritFail?: boolean;
};

type RollGroup = {
    sides: number;
    count: number;
    results: DieResult[];
};

// SVG Paths for Dice Shapes
const DieShape = ({ sides, val, className, style }: { sides: number, val: string | number, className?: string, style?: React.CSSProperties }) => {
    let path = "";
    const viewBox = "0 0 100 100";

    // Define shapes
    switch (sides) {
        case 4: path = "M50 5 L95 90 L5 90 Z"; break;
        case 6: path = "M10 10 H90 V90 H10 Z"; break;
        case 8: path = "M50 2 L95 50 L50 98 L5 50 Z"; break;
        case 10: path = "M50 2 L90 40 L50 98 L10 40 Z"; break;
        case 12: path = "M50 2 L95 35 L78 90 H22 L5 35 Z"; break;
        case 20: path = "M50 2 L93 25 V75 L50 98 L7 75 V25 Z"; break;
        default: path = "M10 10 H90 V90 H10 Z";
    }

    return (
        <div className={className} style={{ ...style, position: "relative", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", perspective: "500px" }}>
            <div className="die-content" style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}>
                <svg viewBox={viewBox} width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.6))" }}>
                    <path d={path} fill="rgba(20,20,25,0.95)" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <path d={path} fill="url(#shine)" opacity="0.3" style={{ mixBlendMode: 'overlay' }} />
                    <defs>
                        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="die-val" style={{ position: "relative", zIndex: 1, fontWeight: "bold", fontSize: "1rem", top: sides === 4 ? "4px" : (sides === 10 ? "-2px" : "0") }}>{val}</span>
            </div>
        </div>
    );
};

export default function DiceRoller() {
    const { playSfx } = useAudio();
    const [isOpen, setIsOpen] = useState(false);
    const [formula, setFormula] = useState("");
    const [isRolling, setIsRolling] = useState(false);
    const [rollGroups, setRollGroups] = useState<RollGroup[]>([]);
    const [modifier, setModifier] = useState(0);
    const [visorTotal, setVisorTotal] = useState<number | string>("-");
    const [showModifier, setShowModifier] = useState(false);

    // Draggable State - Initial position anchored to bottom right safe zone
    const [position, setPosition] = useState<Position>({ x: 1000, y: 500 }); // Will be reset by useEffect
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const diceTypes = [4, 6, 8, 10, 12, 20];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPos = localStorage.getItem("dicePos");
            if (savedPos) {
                try {
                    const parsed = JSON.parse(savedPos);
                    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                        setPosition(clampPosition(parsed.x, parsed.y));
                        return;
                    }
                } catch (e) { }
            }
            // Default: Bottom Right, safely above stats
            setPosition({ x: window.innerWidth - 380, y: window.innerHeight - 500 });
        }
    }, []);

    const clampPosition = (x: number, y: number) => {
        if (typeof window === 'undefined') return { x, y };
        const maxX = window.innerWidth - 60; // Button width approx
        const maxY = window.innerHeight - 60;
        return {
            x: Math.min(Math.max(10, x), maxX),
            y: Math.min(Math.max(10, y), maxY)
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevent drag if interacting with inputs
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON' && !(e.target as HTMLElement).classList.contains('dice-trigger')) {
            if (!(e.target as HTMLElement).classList.contains('drag-handle')) return;
        }

        e.preventDefault();
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            setPosition({ x: newX, y: newY });
        };
        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                const clamped = clampPosition(position.x, position.y);
                setPosition(clamped);
                localStorage.setItem("dicePos", JSON.stringify(clamped));
            }
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, position]);

    const addToFormula = (sides: number) => {
        if (isRolling) return;
        playSfx("/sfx/ui_click.mp3");
        const regex = new RegExp(`(\\d*)d${sides}$`);
        const match = formula.match(regex);

        if (match) {
            const currentCount = match[1] === "" ? 1 : parseInt(match[1]);
            const newTerm = `${currentCount + 1}d${sides}`;
            setFormula(formula.replace(regex, newTerm));
        } else {
            setFormula(prev => prev ? `${prev} + 1d${sides}` : `1d${sides}`);
        }
    };

    const clear = () => {
        if (isRolling) return;
        setFormula("");
        setRollGroups([]);
        setModifier(0);
        setVisorTotal("-");
        setShowModifier(false);
    };

    const parseFormula = (input: string) => {
        const groups: { sides: number, count: number }[] = [];
        let mod = 0;
        const terms = input.split("+").map(s => s.trim());

        terms.forEach(term => {
            if (term.includes("d")) {
                const [countStr, sidesStr] = term.split("d");
                const count = countStr === "" ? 1 : parseInt(countStr) || 1;
                const sides = parseInt(sidesStr) || 6;
                const existing = groups.find(g => g.sides === sides);
                if (existing) {
                    existing.count += count;
                } else {
                    groups.push({ sides, count });
                }
            } else {
                const val = parseInt(term);
                if (!isNaN(val)) mod += val;
            }
        });
        return { groups, mod };
    };

    const roll = () => {
        if (!formula || isRolling) return;
        const { groups, mod } = parseFormula(formula);
        if (groups.length === 0 && mod === 0) return;

        setIsRolling(true);
        setVisorTotal("...");
        setShowModifier(false);
        setModifier(mod);

        playSfx("/sfx/dice_throw.mp3");

        const initialGroups = groups.map(g => ({
            sides: g.sides,
            count: g.count,
            results: Array.from({ length: g.count }).map((_, i) => ({
                id: `${g.sides}-${i}`,
                sides: g.sides,
                val: "?",
                settled: false
            }))
        }));
        setRollGroups(initialGroups);

        let frame = 0;
        const maxFrames = 25;

        const interval = setInterval(() => {
            frame++;
            setRollGroups(prev => prev.map(g => ({
                ...g,
                results: g.results.map(r => ({
                    ...r,
                    val: Math.floor(Math.random() * r.sides) + 1
                }))
            })));

            if (frame >= maxFrames) {
                clearInterval(interval);
                finishRoll(initialGroups, mod);
            }
        }, 50);
    };

    const finishRoll = (groups: RollGroup[], mod: number) => {
        let diceTotal = 0;
        let hasNat1 = false;
        let hasNat20 = false;

        const finalGroups = groups.map(g => {
            const newResults = g.results.map(r => {
                const val = Math.floor(Math.random() * g.sides) + 1;
                diceTotal += val;

                const isCrit = g.sides === 20 && val === 20;
                const isCritFail = g.sides === 20 && val === 1;

                if (isCrit) hasNat20 = true;
                if (isCritFail) hasNat1 = true;

                return { ...r, val, settled: true, isCrit, isCritFail };
            });
            return { ...g, results: newResults };
        });

        setRollGroups(finalGroups);
        setIsRolling(false);
        setVisorTotal(diceTotal);

        if (hasNat1) {
            document.body.classList.add('animate-shake');
            setTimeout(() => document.body.classList.remove('animate-shake'), 500);
            playSfx("/sfx/glitch_crit.mp3");
        } else if (hasNat20) {
            playSfx("/sfx/holy_crit.mp3");
        } else {
            playSfx("/sfx/dice_settle.mp3");
        }

        if (mod !== 0) {
            setTimeout(() => {
                setShowModifier(true);
                setVisorTotal(diceTotal + mod);
            }, 600);
        }
    };

    return (
        <div className="no-print">
            <style jsx>{`
                .dice-rolling .die-content { 
                    animation: tumble 0.5s linear infinite; 
                }
                
                @keyframes tumble { 
                    0% { transform: rotate3d(1, 1, 1, 0deg); }
                    50% { transform: rotate3d(1, 2, 0, 180deg); }
                    100% { transform: rotate3d(1, 1, 1, 360deg); }
                }

                .crit-success-effect { 
                    filter: drop-shadow(0 0 10px var(--gold-accent));
                    animation: pulse-crit 1s infinite;
                }
                
                .crit-fail-effect {
                    filter: drop-shadow(0 0 10px red);
                    animation: shake-crit 0.4s infinite;
                }
            `}</style>

            {/* Trigger Button - Draggable */}
            {!isOpen && (
                <button
                    onMouseDown={handleMouseDown}
                    onClick={() => !isDragging && setIsOpen(true)}
                    className="dice-trigger arcane-button fixed z-[9000] cursor-grab active:cursor-grabbing"
                    title="Open Dice"
                    style={{ left: position.x, top: position.y, width: '3.5rem', height: '3.5rem' }}
                >
                    <span style={{ fontSize: "2rem", pointerEvents: 'none' }}>🎲</span>
                </button>
            )}

            {/* Panel - Draggable Header */}
            {isOpen && (
                <div
                    className="dice-panel glass-panel animate-slide-up flex flex-col fixed z-[9000]"
                    style={{
                        left: position.x - 280, // Offset to open to Left/Top
                        top: position.y - 300,  // Offset to open upwards
                        width: '320px',
                        zIndex: 9005
                    }}
                >
                    {/* Header */}
                    <div
                        className="p-3 border-b border-[var(--glass-border)] flex justify-between items-center bg-black/60 select-none cursor-move drag-handle"
                        onMouseDown={handleMouseDown}
                    >
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)] flex items-center gap-2 pointer-events-none">
                            <span className="text-lg">🎲</span> Fate & Chance
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white px-2 py-1">✕</button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col gap-4">
                        {/* RESULT VISOR */}
                        <div className="bg-black/80 border border-[var(--glass-border)] rounded-lg p-3 text-center relative h-20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                            <span className={`text-4xl font-serif transition-all ${typeof visorTotal === 'number' ? 'scale-110' : ''} text-[var(--scarlet-accent)]`}>
                                {visorTotal}
                            </span>
                            {showModifier && modifier !== 0 && (
                                <div className="absolute bottom-1 right-2 text-[10px] text-gray-500 font-mono">
                                    {modifier > 0 ? `+${modifier}` : modifier}
                                </div>
                            )}
                        </div>

                        {/* DICE TRAY */}
                        <div className="min-h-[80px] max-h-[140px] overflow-y-auto border border-[var(--glass-border)] bg-black/30 p-2 custom-scrollbar rounded-md">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {rollGroups.flatMap((g) => g.results).map((r, i) => (
                                    <DieShape
                                        key={r.id + i}
                                        sides={r.sides}
                                        val={r.val}
                                        className={`
                                            ${isRolling ? "dice-rolling" : ""}
                                            ${r.settled && r.isCrit ? "crit-success-effect" : ""}
                                            ${r.settled && r.isCritFail ? "crit-fail-effect" : ""}
                                            transition-all duration-300
                                        `}
                                        style={{
                                            color: r.settled && r.isCrit ? 'var(--gold-accent)' : r.settled && r.isCritFail ? '#ff0000' : '#ccc'
                                        }}
                                    />
                                ))}
                            </div>
                            {rollGroups.length === 0 && (
                                <div className="text-center text-[10px] text-gray-600 py-4 tracking-widest uppercase">
                                    Select dice to roll
                                </div>
                            )}
                        </div>

                        {/* CONTROLS */}
                        <div className="flex flex-col gap-3">
                            {/* Input Form */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formula}
                                    onChange={(e) => setFormula(e.target.value)}
                                    placeholder="e.g. 1d20 + 5"
                                    className="flex-1 bg-[#0a0a0a] border border-[#333] text-gray-300 px-3 py-1 font-mono text-xs rounded focus:border-[var(--cardinal-accent)]"
                                />
                                <button onClick={clear} className="px-3 bg-[#111] border border-[#333] text-gray-500 hover:text-white text-xs uppercase rounded">Clr</button>
                            </div>

                            {/* Dice Buttons */}
                            <div className="grid grid-cols-6 gap-1">
                                {diceTypes.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => addToFormula(d)}
                                        disabled={isRolling}
                                        className="py-2 text-[10px] font-mono border border-[#333] bg-[#1a1a1a] text-gray-400 hover:bg-[var(--scarlet-accent)] hover:text-white transition-colors rounded hover:shadow-[0_0_10px_rgba(138,28,28,0.5)]"
                                    >
                                        d{d}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={roll}
                                disabled={isRolling || !formula}
                                className="w-full py-3 bg-[var(--scarlet-accent)] text-white font-bold uppercase tracking-widest text-xs rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_var(--scarlet-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {isRolling ? "ROLLING..." : "ROLL DICE"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

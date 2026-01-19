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
        <div className={className} style={{ ...style, position: "relative", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox={viewBox} width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }}>
                <path d={path} fill="rgba(20,20,20,0.9)" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <span style={{ position: "relative", zIndex: 1, fontWeight: "bold", fontSize: "1.1rem", top: sides === 4 ? "5px" : (sides === 10 ? "-3px" : "0") }}>{val}</span>
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

    // Draggable State
    const [position, setPosition] = useState<Position>({ x: 1000, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const resultsRef = useRef<HTMLDivElement>(null);
    const diceTypes = [4, 6, 8, 10, 12, 20];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPos = localStorage.getItem("dicePos");
            if (savedPos) {
                try {
                    const parsed = JSON.parse(savedPos);
                    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                        setPosition(parsed);
                        return;
                    }
                } catch (e) {
                    // ignore
                }
            }
            setPosition({ x: window.innerWidth - 100, y: 80 });
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
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
            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;
            setPosition({ x: newX, y: newY });
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            localStorage.setItem("dicePos", JSON.stringify(position));
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, position]); // position dependency to keep closure fresh if needed, though dragOffset handles delta

    const addToFormula = (sides: number) => {
        if (isRolling) return;
        playSfx("/sfx/ui_click.mp3"); // TODO: Add real click sound
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

        // Clatter sound
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
        const maxFrames = 20; // 1 second approx

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

                // Crit Logic only for d20
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

        // DOOMSDAY EFFECTS
        if (hasNat1) {
            // Trigger Global Screen Shake via DOM
            document.body.classList.add('animate-shake');
            setTimeout(() => document.body.classList.remove('animate-shake'), 500);
            // Play Glitch Sound
            playSfx("/sfx/glitch_crit.mp3");
        } else if (hasNat20) {
            // Play Holy Sound
            playSfx("/sfx/holy_crit.mp3");
        } else {
            // Normal settle
            playSfx("/sfx/dice_settle.mp3");
        }

        if (mod !== 0) {
            setTimeout(() => {
                setShowModifier(true);
                setVisorTotal(diceTotal + mod);
            }, 600);
        }
    };

    const getPanelPosition = () => {
        if (typeof window === 'undefined') return { left: 10, top: 10 };
        // Simple bounding logic
        let left = position.x - 300;
        let top = position.y;
        if (left < 10) left = position.x + 60; // Flip to right if too close to left edge
        if (left + 360 > window.innerWidth) left = window.innerWidth - 370;

        return { left, top };
    };

    const panelPos = getPanelPosition();

    return (
        <div className="no-print">
            <style jsx>{`
                .dice-rolling { animation: spin 0.2s linear infinite; opacity: 0.7; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .crit-success-text { color: var(--gold-accent); text-shadow: 0 0 10px var(--gold-accent); }
                .crit-fail-text { color: #ff0000; text-shadow: 0 0 5px red; }
            `}</style>
            {!isOpen && (
                <button
                    onClick={() => !isDragging && setIsOpen(true)}
                    onMouseDown={handleMouseDown}
                    className="dice-trigger arcane-button fixed z-[9000]"
                    title="Open Doomsday Dice"
                    style={{ left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <span style={{ fontSize: "28px", pointerEvents: 'none' }}>🎲</span>
                </button>
            )}

            {isOpen && (
                <div
                    className="dice-panel glass-panel animate-slide-up fixed z-[9000]"
                    style={{ left: panelPos.left, top: panelPos.top, width: '360px' }}
                >
                    <div className="p-3 border-b border-[var(--glass-border)] flex justify-between items-center bg-black/40 cursor-grab" onMouseDown={handleMouseDown}>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-[var(--gold-accent)]">Doomsday Dice</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">✕</button>
                    </div>

                    <div className="p-4">
                        {/* RESULT VISOR */}
                        <div className="bg-black/60 border border-[var(--glass-border)] rounded p-4 text-center mb-4 relative min-h-[5rem] flex items-center justify-center">
                            <span className={`text-5xl font-serif transition-all ${rollGroups.some(g => g.results.some(r => r.isCrit)) ? 'crit-success-text' :
                                rollGroups.some(g => g.results.some(r => r.isCritFail)) ? 'crit-fail-text' :
                                    'text-[var(--scarlet-accent)]'
                                }`}>
                                {visorTotal}
                            </span>
                            {showModifier && (
                                <div className="absolute bottom-1 right-2 text-xs text-gray-500 font-mono">
                                    {modifier >= 0 ? "+" : ""}{modifier}
                                </div>
                            )}
                        </div>

                        {/* DICE POOL */}
                        <div className="max-h-[150px] overflow-y-auto mb-4 border border-[var(--glass-border)] bg-black/20 p-2 custom-scrollbar">
                            {rollGroups.map((g, i) => (
                                <div key={i} className="mb-2">
                                    <div className="text-[10px] text-gray-500 font-mono mb-1">{g.count}d{g.sides}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {g.results.map((r, ri) => (
                                            <DieShape
                                                key={ri}
                                                sides={r.sides}
                                                val={r.val}
                                                className={`
                                                    ${isRolling ? "dice-rolling" : ""}
                                                    ${r.isCrit ? "crit-success-effect" : ""}
                                                    ${r.isCritFail ? "crit-fail-effect" : ""}
                                                    text-gray-300
                                                `}
                                                style={{ color: r.isCrit ? 'var(--gold-accent)' : r.isCritFail ? '#ff0000' : 'inherit' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {rollGroups.length === 0 && (
                                <div className="text-center text-xs text-gray-600 py-4 tracking-widest">AWAITING INPUT...</div>
                            )}
                        </div>

                        {/* INPUT */}
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={formula}
                                onChange={(e) => setFormula(e.target.value)}
                                placeholder="2d6 + 5"
                                className="flex-1 bg-[#111] border border-[#333] text-gray-300 px-2 py-1 font-mono text-sm"
                            />
                            <button onClick={clear} className="px-3 bg-[#111] border border-[#333] text-gray-500 hover:text-white">Clr</button>
                        </div>

                        {/* KEYPAD */}
                        <div className="grid grid-cols-6 gap-1 mb-4">
                            {diceTypes.map(d => (
                                <button
                                    key={d}
                                    onClick={() => addToFormula(d)}
                                    disabled={isRolling}
                                    className="py-2 text-xs font-mono border border-[#333] bg-[#1a0a0a] text-gray-400 hover:bg-[var(--scarlet-accent)] hover:text-white transition-colors"
                                >
                                    d{d}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={roll}
                            disabled={isRolling || !formula}
                            className="campaign-btn w-full justify-center"
                        >
                            {isRolling ? "CALCULATING FATE..." : "EXECUTE ROLL"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

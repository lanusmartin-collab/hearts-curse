"use client";

import { useState, useRef, useEffect } from "react";

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
        case 4: // Triangle
            path = "M50 5 L95 90 L5 90 Z";
            break;
        case 6: // Square / Cube
            path = "M10 10 H90 V90 H10 Z";
            break;
        case 8: // Diamond
            path = "M50 2 L95 50 L50 98 L5 50 Z";
            break;
        case 10: // Kite
            path = "M50 2 L90 40 L50 98 L10 40 Z"; // Approximately d10 face
            break;
        case 12: // Pentagon-ish
            path = "M50 2 L95 35 L78 90 H22 L5 35 Z";
            break;
        case 20: // Hexagon (approx for 2D d20)
            path = "M50 2 L93 25 V75 L50 98 L7 75 V25 Z";
            break;
        default:
            path = "M10 10 H90 V90 H10 Z"; // Fallback box
    }

    return (
        <div className={className} style={{ ...style, position: "relative", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox={viewBox} width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }}>
                <path d={path} fill="var(--paper-highlight)" stroke="var(--border-color)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <span style={{ position: "relative", zIndex: 1, fontWeight: "bold", fontSize: "1.1rem", top: sides === 4 ? "5px" : (sides === 10 ? "-3px" : "0") }}>{val}</span>
        </div>
    );
};

type Props = {
    onRollComplete?: (result: { total: number, dice: { sides: number, val: number }[] }) => void;
};

export default function DiceRoller({ onRollComplete }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [formula, setFormula] = useState("");
    const [isRolling, setIsRolling] = useState(false);
    const [rollGroups, setRollGroups] = useState<RollGroup[]>([]);
    const [modifier, setModifier] = useState(0);
    const [visorTotal, setVisorTotal] = useState<number | string>("-");
    const [showModifier, setShowModifier] = useState(false);

    // Draggable State - DEFAULT TO UPPER RIGHT
    const [position, setPosition] = useState<Position>({ x: 1000, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const resultsRef = useRef<HTMLDivElement>(null);
    const diceTypes = [4, 6, 8, 10, 12, 20];

    useEffect(() => {
        const savedPos = localStorage.getItem("dicePos");
        if (savedPos) {
            try {
                const parsed = JSON.parse(savedPos);
                if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
                    setPosition(parsed);
                    return;
                }
            } catch (e) {
                console.error("Failed to parse dice position", e);
            }
        } else {
            // Updated default position logic: Top Right
            setPosition({
                x: window.innerWidth - 100,
                y: 50 // Top padding
            });
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        // Correct offset calculation: distance from mouse to top-left of element
        // Using getBoundingClientRect ensures we account for scroll or other shifts if necessary, 
        // though strictly 'position' is what we are rendering at.
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        // Bounds Checking
        const padding = 10;
        const buttonSize = 60;

        const maxX = window.innerWidth - buttonSize - padding;
        const maxY = window.innerHeight - buttonSize - padding;

        newX = Math.max(padding, Math.min(newX, maxX));
        newY = Math.max(padding, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        localStorage.setItem("dicePos", JSON.stringify(position));
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const animationStyles = `
        @keyframes pixel-spin {
            0% { transform: rotate(0deg) scale(0.9); }
            50% { transform: rotate(180deg) scale(0.8); }
            100% { transform: rotate(360deg) scale(0.9); }
        }
        @keyframes slam {
            0% { transform: scale(1.5); opacity: 0.8; }
            60% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        @keyframes glow-pulse {
            0% { filter: drop-shadow(0 0 2px var(--accent-color)); }
            50% { filter: drop-shadow(0 0 10px var(--accent-color)); }
            100% { filter: drop-shadow(0 0 2px var(--accent-color)); }
        }
        
        .dice-rolling {
            animation: pixel-spin 0.3s linear infinite;
        }
        
        .dice-rolling path {
            fill: #333 !important;
            stroke: #555 !important;
        }

        .dice-settled {
            animation: slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .crit-success path {
            fill: var(--accent-color) !important;
            stroke: #fff !important;
        }
        .crit-success span {
            color: #000 !important;
        }
        .crit-success {
            animation: glow-pulse 1.5s infinite !important;
        }

        .crit-fail path {
            fill: #330000 !important;
            stroke: #ff3333 !important;
        }
        .crit-fail span {
            color: #ff3333 !important;
        }

        .modifier-float {
            animation: flyUp 0.5s ease-out forwards;
        }
        @keyframes flyUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const addToFormula = (sides: number) => {
        if (isRolling) return;
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
        const finalGroups = groups.map(g => {
            const newResults = g.results.map(r => {
                const val = Math.floor(Math.random() * g.sides) + 1;
                diceTotal += val;
                const isCrit = g.sides === 20 && val === 20;
                const isCritFail = g.sides === 20 && val === 1;
                return { ...r, val, settled: true, isCrit, isCritFail };
            });
            return { ...g, results: newResults };
        });

        setRollGroups(finalGroups);
        setIsRolling(false);
        setVisorTotal(diceTotal);

        if (mod !== 0) {
            setTimeout(() => {
                setShowModifier(true);
                setVisorTotal(diceTotal + mod);
            }, 600);
        }

        // Dispatch Global Event for Decoupled Listeners
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('dice-roll-complete', {
                detail: {
                    total: diceTotal + mod,
                    dice: finalGroups.flatMap(g => g.results).map(r => ({ sides: r.sides, val: Number(r.val) }))
                }
            });
            window.dispatchEvent(event);
        }

        if (onRollComplete) {
            // Pass simplified results for triggers
            onRollComplete({
                total: diceTotal + mod,
                dice: finalGroups.flatMap(g => g.results).map(r => ({ sides: r.sides, val: Number(r.val) }))
            });
        }
    };

    // Calculate smart position for panel
    const getPanelPosition = () => {
        const panelWidth = 360;
        const panelHeight = 500; // Estimated max height

        let left = position.x - 300;
        let top = position.y - 400;

        // If off right screen, shift left
        if (typeof window !== 'undefined') {
            if (position.x + 100 > window.innerWidth) {
                left = position.x - panelWidth + 50;
            } else if (left < 10) {
                // Check left edge
                left = 10;
            }

            // Check top edge
            if (top < 10) {
                top = 10;
            } else if (top + panelHeight > window.innerHeight) {
                top = window.innerHeight - panelHeight - 10;
            }
        }

        return { left, top };
    };

    const panelPos = getPanelPosition();

    return (
        <div className="no-print">
            <style>{animationStyles}</style>

            {!isOpen && (
                <button
                    onClick={() => !isDragging && setIsOpen(true)}
                    onMouseDown={handleMouseDown}
                    className="dice-trigger arcane-button"
                    title="Open Fate Weaver (Drag to Move)"
                    style={{
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        bottom: 'auto',
                        right: 'auto',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                        zIndex: 10000 // Ensure always on top
                    }}
                >
                    <span style={{ fontSize: "28px", pointerEvents: 'none' }}>🎲</span>
                </button>
            )}

            {isOpen && (
                <div
                    className="dice-panel glass-panel animate-slide-up"
                    style={{
                        position: 'fixed',
                        left: panelPos.left,
                        top: panelPos.top,
                        bottom: 'auto',
                        right: 'auto',
                        width: '360px',
                        zIndex: 10000
                    }}
                >
                    <div className="p-4" onMouseDown={handleMouseDown} style={{ borderBottom: '1px solid rgba(163,34,34,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, #000, #1a0505)', cursor: 'grab' }}>
                        <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#eecfa1", letterSpacing: "0.2em", textTransform: "uppercase" }}>Fate Weaver</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#666",
                                cursor: "pointer"
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4">
                        <div style={{
                            background: "rgba(0,0,0,0.6)",
                            border: "1px solid #333",
                            borderRadius: "4px",
                            padding: "1rem",
                            textAlign: "center",
                            minHeight: "5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                            position: "relative",
                            marginBottom: "1rem"
                        }}>
                            <span style={{
                                fontSize: "3rem",
                                color: "#a32222",
                                textShadow: "0 0 15px rgba(163,34,34,0.5)",
                                fontFamily: "var(--font-serif)",
                                transition: "all 0.3s"
                            }}>
                                {visorTotal}
                            </span>
                            {showModifier && (
                                <div className="modifier-float" style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    right: "10px",
                                    fontSize: "0.8rem",
                                    color: "#666",
                                    fontFamily: "var(--font-mono)"
                                }}>
                                    {modifier >= 0 ? "+" : ""}{modifier}
                                </div>
                            )}
                        </div>

                        <div ref={resultsRef} className="custom-scrollbar" style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            padding: "4px",
                            marginBottom: "1rem",
                            border: "1px solid #222",
                            background: "rgba(0,0,0,0.3)"
                        }}>
                            {rollGroups.map((g, i) => (
                                <div key={i} style={{ marginBottom: "0.8rem" }}>
                                    <div style={{
                                        fontSize: "0.7rem",
                                        color: "#666",
                                        marginBottom: "4px",
                                        fontFamily: "var(--font-mono)",
                                        textTransform: "uppercase"
                                    }}>
                                        {g.count}d{g.sides}
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {g.results.map((r, ri) => (
                                            <DieShape
                                                key={ri}
                                                sides={r.sides}
                                                val={r.val}
                                                className={
                                                    isRolling
                                                        ? "dice-rolling die-shape"
                                                        : r.isCrit
                                                            ? "dice-settled crit-success die-shape"
                                                            : r.isCritFail
                                                                ? "dice-settled crit-fail die-shape"
                                                                : "dice-settled die-shape"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {rollGroups.length === 0 && (
                                <div style={{ textAlign: "center", color: "#444", fontSize: "0.7rem", letterSpacing: "0.2em", padding: "1rem" }}>
                                    Systems Ready
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <input
                                type="text"
                                value={formula}
                                onChange={(e) => setFormula(e.target.value)}
                                placeholder="e.g. 2d6 + 5"
                                style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.8rem", background: "#111", border: "1px solid #333", color: "#ccc" }}
                            />
                            <button onClick={clear} style={{ minWidth: "30px", padding: 0, border: "1px solid #333", background: "#111", color: "#666" }}>✕</button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px" }}>
                            {diceTypes.map(d => (
                                <button
                                    key={d}
                                    onClick={() => addToFormula(d)}
                                    disabled={isRolling}
                                    style={{
                                        padding: "0.4rem 0",
                                        fontSize: "0.8rem",
                                        fontFamily: "var(--font-mono)",
                                        background: "rgba(255,255,255,0.02)",
                                        border: "1px solid #333",
                                        color: "#888",
                                        transition: "all 0.2s"
                                    }}
                                    className="hover:bg-[#a32222] hover:text-white hover:border-[#a32222]"
                                >
                                    d{d}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={roll}
                            disabled={isRolling || !formula}
                            style={{
                                width: "100%",
                                marginTop: "1rem",
                                padding: "0.8rem",
                                fontSize: "0.9rem",
                                letterSpacing: "0.1em"
                            }}
                            className="arcane-button"
                        >
                            {isRolling ? "CALCULATING..." : "EXECUTE ROLL"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

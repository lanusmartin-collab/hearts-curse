"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MapNode } from "@/lib/data/maps";

type InteractiveMapProps = {
    src: string;
    title: string;
    nodes?: MapNode[];
    onNodeClick?: (node: MapNode) => void;
    gridType?: "hex" | "square" | "none";
    isEditing?: boolean;
    onNodeMove?: (id: string, x: number, y: number) => void;
    onMapClick?: (x: number, y: number) => void;
    partyLocationId?: string | null;
    selectedNodeId?: string | null;
};

export default function InteractiveMap({
    src,
    title,
    nodes = [],
    onNodeClick,
    gridType = "hex",
    isEditing = false,
    onNodeMove,
    onMapClick,
    partyLocationId,
    selectedNodeId
}: InteractiveMapProps) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Touch & Pinch State
    const pinchState = useRef<{ initialDistance: number; initialScale: number } | null>(null);
    const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);

    // Node Dragging State
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const mapImageRef = useRef<HTMLImageElement>(null);

    // Auto-fit initial scale on mount or map change
    useEffect(() => {
        if (containerRef.current) {
            const w = containerRef.current.clientWidth || window.innerWidth;
            const h = containerRef.current.clientHeight || 550;
            const fit = Math.max(0.25, Math.min(1, Math.min((w - 20) / 1024, (h - 20) / 1024)));
            setScale(Math.round(fit * 100) / 100);
            setPos({ x: 0, y: 0 });
        }
    }, [src]);

    const handleWheel = (e: React.WheelEvent) => {
        if (draggingNodeId) return; // Don't zoom while dragging node
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.max(0.2, Math.min(4, Math.round((scale + delta) * 100) / 100));
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        const targetEl = e.target instanceof Element ? e.target : (e.target as Node)?.parentElement;
        if (targetEl?.closest(".map-node")) return;

        setIsDraggingMap(true);
        setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // [EDIT MODE] Handle Node Dragging
        if (isEditing && draggingNodeId && mapImageRef.current) {
            const rect = mapImageRef.current.getBoundingClientRect();
            const rawX = e.clientX - rect.left;
            const rawY = e.clientY - rect.top;

            const percentX = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
            const percentY = Math.max(0, Math.min(100, (rawY / rect.height) * 100));

            if (onNodeMove) {
                onNodeMove(draggingNodeId, percentX, percentY);
            }
            return;
        }

        // Handle Map Panning
        if (!isDraggingMap) return;
        setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isEditing && draggingNodeId) {
            setDraggingNodeId(null);
            return;
        }

        if (isEditing && !draggingNodeId) {
            const targetEl = e.target instanceof Element ? e.target : (e.target as Node)?.parentElement;
            if (targetEl?.closest(".map-node")) return;

            const wasDrag = Math.abs((e.clientX - pos.x) - dragStart.x) > 5 || Math.abs((e.clientY - pos.y) - dragStart.y) > 5;

            if (!wasDrag && onMapClick && mapImageRef.current) {
                const rect = mapImageRef.current.getBoundingClientRect();
                const rawX = e.clientX - rect.left;
                const rawY = e.clientY - rect.top;

                if (rawX >= 0 && rawX <= rect.width && rawY >= 0 && rawY <= rect.height) {
                    const percentX = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
                    const percentY = Math.max(0, Math.min(100, (rawY / rect.height) * 100));
                    onMapClick(percentX, percentY);
                }
            }
        }

        setIsDraggingMap(false);
    };

    // Touch Handlers for Tablets & Mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartPos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

            const targetEl = e.target instanceof Element ? e.target : (e.target as Node)?.parentElement;
            if (targetEl?.closest(".map-node")) return;

            setIsDraggingMap(true);
            setDragStart({ x: touch.clientX - pos.x, y: touch.clientY - pos.y });
        } else if (e.touches.length === 2) {
            // Two finger pinch start
            setIsDraggingMap(false);
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            pinchState.current = { initialDistance: dist, initialScale: scale };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];

            // Node dragging in edit mode
            if (isEditing && draggingNodeId && mapImageRef.current) {
                const rect = mapImageRef.current.getBoundingClientRect();
                const rawX = touch.clientX - rect.left;
                const rawY = touch.clientY - rect.top;

                const percentX = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
                const percentY = Math.max(0, Math.min(100, (rawY / rect.height) * 100));

                if (onNodeMove) {
                    onNodeMove(draggingNodeId, percentX, percentY);
                }
                return;
            }

            // Map panning
            if (isDraggingMap) {
                setPos({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
            }
        } else if (e.touches.length === 2 && pinchState.current) {
            // Pinch-to-zoom
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const newScale = Math.max(
                0.2,
                Math.min(4, Math.round((pinchState.current.initialScale * (dist / pinchState.current.initialDistance)) * 100) / 100)
            );
            setScale(newScale);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isEditing && draggingNodeId) {
            setDraggingNodeId(null);
        }

        if (e.touches.length === 0) {
            pinchState.current = null;
            setIsDraggingMap(false);
        } else if (e.touches.length === 1) {
            pinchState.current = null;
            const touch = e.touches[0];
            setIsDraggingMap(true);
            setDragStart({ x: touch.clientX - pos.x, y: touch.clientY - pos.y });
        }
    };

    const resetView = () => {
        setScale(1);
        setPos({ x: 0, y: 0 });
    };

    const fitToScreen = () => {
        if (containerRef.current) {
            const w = containerRef.current.clientWidth || window.innerWidth;
            const h = containerRef.current.clientHeight || 550;
            const fit = Math.max(0.25, Math.min(1, Math.min((w - 20) / 1024, (h - 20) / 1024)));
            setScale(Math.round(fit * 100) / 100);
            setPos({ x: 0, y: 0 });
        }
    };

    const zoomIn = () => setScale(s => Math.min(4, Math.round((s + 0.15) * 100) / 100));
    const zoomOut = () => setScale(s => Math.max(0.2, Math.round((s - 0.15) * 100) / 100));

    return (
        <div
            ref={containerRef}
            className={`retro-border ${isEditing ? 'border-amber-500' : ''}`}
            style={{
                overflow: "hidden",
                height: "100%",
                minHeight: "480px",
                position: "relative",
                cursor: isEditing ? (draggingNodeId ? "grabbing" : "crosshair") : (isDraggingMap ? "grabbing" : "grab"),
                backgroundColor: "#050505",
                touchAction: "none"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* UI Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 20,
                    background: "rgba(0, 0, 0, 0.85)",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid var(--accent-color)",
                    borderRadius: "4px",
                    color: "var(--fg-color)",
                    boxShadow: "0 0 10px rgba(255, 9, 9, 0.2)",
                    backdropFilter: "blur(4px)",
                    maxWidth: "calc(100% - 20px)"
                }}
            >
                <div className="flex items-center gap-2">
                    <strong style={{ color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.85rem" }}>{title}</strong>
                    {isEditing && <span className="bg-amber-600 text-black text-[10px] px-1 font-bold rounded animate-pulse">EDIT MODE</span>}
                </div>
                <div style={{ fontSize: "0.68em", opacity: 0.8 }}>Scroll/Pinch to Zoom • Drag to Pan • Click Node to Inspect</div>
                <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    <button
                        onClick={zoomIn}
                        title="Zoom In"
                        className="hover:text-amber-400 active:scale-95 transition-all text-sm font-mono font-bold"
                        style={{ border: "1px solid #444", padding: "4px 10px", background: "#111", minWidth: "36px", minHeight: "36px", borderRadius: "3px" }}
                    >
                        +
                    </button>
                    <button
                        onClick={zoomOut}
                        title="Zoom Out"
                        className="hover:text-amber-400 active:scale-95 transition-all text-sm font-mono font-bold"
                        style={{ border: "1px solid #444", padding: "4px 10px", background: "#111", minWidth: "36px", minHeight: "36px", borderRadius: "3px" }}
                    >
                        -
                    </button>
                    <button
                        onClick={fitToScreen}
                        title="Fit Map to Screen"
                        className="hover:text-emerald-400 active:scale-95 transition-all text-[11px] font-mono uppercase font-bold"
                        style={{ border: "1px solid #444", padding: "4px 8px", background: "#111", minHeight: "36px", borderRadius: "3px" }}
                    >
                        Fit ({Math.round(scale * 100)}%)
                    </button>
                    <button
                        onClick={resetView}
                        className="hover:text-red-400 active:scale-95 transition-all text-[11px] font-mono uppercase"
                        style={{ border: "1px solid #444", padding: "4px 8px", background: "#111", minHeight: "36px", borderRadius: "3px" }}
                    >
                        100%
                    </button>
                </div>
            </div>

            {/* Scanline Effect Overlay (Disable in Edit Mode to see better) */}
            {!isEditing && <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
                backgroundSize: "100% 2px, 3px 100%",
                pointerEvents: "none",
                zIndex: 15
            }} />}

            {/* Map Container */}
            <div
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: (isDraggingMap || draggingNodeId) ? "none" : "transform 0.2s ease-out",
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 5
                }}
            >
                <div style={{ position: "relative" }}>
                    <Image
                        ref={mapImageRef} // Ref for coordinate calculation
                        src={src}
                        alt={title}
                        width={1024}
                        height={1024}
                        style={{
                            maxWidth: "none",
                            pointerEvents: "none",
                            filter: isEditing ? "none" : "sepia(0.2) contrast(1.2) brightness(0.8)",
                            boxShadow: "0 0 50px rgba(0,0,0,0.8)"
                        }}
                        draggable={false}
                    />

                    {/* Grid Overlay */}
                    {gridType !== "none" && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                pointerEvents: "none",
                                backgroundImage: gridType === "hex"
                                    ? "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"52\" viewBox=\"0 0 60 52\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15 0 L45 0 L60 26 L45 52 L15 52 L0 26 Z\" fill=\"none\" stroke=\"rgba(255,255,255,0.1)\" stroke-width=\"1\"/></svg>')"
                                    : "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                                backgroundSize: gridType === "hex" ? "60px 52px" : "50px 50px",
                                opacity: 0.4,
                                zIndex: 2
                            }}
                        />
                    )}

                    {/* Interactive Nodes */}
                    {nodes.map((node, index) => {
                        const isSelected = selectedNodeId === node.id;
                        return (
                            <div
                                key={node.id}
                                className={`map-node ${isSelected ? 'selected-node' : ''}`}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    if (isEditing) {
                                        e.preventDefault();
                                        setDraggingNodeId(node.id);
                                    }
                                }}
                                onMouseUp={(e) => {
                                    e.stopPropagation();
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    if (isEditing) {
                                        setDraggingNodeId(node.id);
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (onNodeClick) onNodeClick(node);
                                }}
                                style={{
                                    position: "absolute",
                                    left: `${node.x}%`,
                                    top: `${node.y}%`,
                                    transform: "translate(-50%, -50%)",
                                    zIndex: draggingNodeId === node.id ? 100 : (isSelected ? 50 : 25),
                                    cursor: isEditing ? "grab" : "pointer",
                                    padding: "6px",
                                    userSelect: "none"
                                }}
                            >
                                {/* Selected Ring Highlight */}
                                {isSelected && (
                                    <div style={{
                                        position: "absolute",
                                        top: "-2px", left: "-2px", right: "-2px", bottom: "-2px",
                                        borderRadius: "50%",
                                        border: "2px solid #ffd700",
                                        boxShadow: "0 0 15px #ffd700, inset 0 0 8px #ffd700",
                                        animation: "pulseGold 1.5s infinite",
                                        pointerEvents: "none"
                                    }} />
                                )}

                                {/* Pulse Effect (Only for Boss/Encounter) */}
                                {(!isEditing && (node.type === "boss" || node.type === "encounter")) && (
                                    <div className="pulse-ring" style={{
                                        position: "absolute",
                                        width: "100%", height: "100%",
                                        borderRadius: "50%",
                                        border: `2px solid ${getNodeColor(node.type)}`,
                                        animation: "pulseRed 2s infinite",
                                        pointerEvents: "none"
                                    }} />
                                )}

                                {/* Party Token Indicator */}
                                {partyLocationId === node.id && (
                                    <div style={{
                                        position: "absolute",
                                        top: "-15px", left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "0", height: "0",
                                        borderLeft: "8px solid transparent",
                                        borderRight: "8px solid transparent",
                                        borderTop: "12px solid #3b82f6", // Blue marker
                                        filter: "drop-shadow(0 0 5px #3b82f6)",
                                        animation: "bounceToken 1.5s infinite",
                                        zIndex: 50,
                                        pointerEvents: "none"
                                    }} />
                                )}

                                {/* Icon/Marker */}
                                <div
                                    className="hover:scale-110 active:scale-95 transition-transform"
                                    style={{
                                        width: "26px",
                                        height: "26px",
                                        background: isSelected ? "#2a1e00" : "#000",
                                        border: `2px solid ${isSelected ? "#ffd700" : getNodeColor(node.type)}`,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: isSelected ? "#ffd700" : getNodeColor(node.type),
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        boxShadow: isSelected ? "0 0 15px #ffd700" : `0 0 10px ${getNodeColor(node.type)}`,
                                        position: "relative"
                                    }}
                                >
                                    {getNodeIcon(node.type)}

                                    {/* Number Badge for Print/Ref */}
                                    <div className="node-badge" style={{
                                        position: "absolute",
                                        top: "-8px",
                                        right: "-8px",
                                        background: "white",
                                        color: "black",
                                        borderRadius: "50%",
                                        width: "14px",
                                        height: "14px",
                                        fontSize: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                        border: "1px solid black",
                                        zIndex: 20,
                                        pointerEvents: "none"
                                    }}>
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Label */}
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: isSelected ? "rgba(35, 25, 0, 0.95)" : "rgba(0,0,0,0.85)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    color: isSelected ? "#ffd700" : "#fff",
                                    fontSize: "10px",
                                    fontWeight: isSelected ? "bold" : "normal",
                                    whiteSpace: "nowrap",
                                    marginTop: "4px",
                                    border: isSelected ? "1px solid #ffd700" : "1px solid #333",
                                    pointerEvents: "none",
                                    boxShadow: isSelected ? "0 0 8px rgba(255, 215, 0, 0.4)" : "none"
                                }}>
                                    {node.label}
                                    {isEditing && <span className="text-gray-400 ml-1">({Math.round(node.x)},{Math.round(node.y)})</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulseRed {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                @keyframes pulseGold {
                    0%, 100% { transform: scale(1); opacity: 0.9; }
                    50% { transform: scale(1.3); opacity: 0.4; }
                }
                @keyframes bounceToken {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -5px); }
                }
            `}</style>
        </div>
    );
}

function getNodeColor(type: string): string {
    switch (type) {
        case "boss": return "#ff0000"; // Red
        case "quest": return "#ffd700"; // Gold
        case "loot": return "#00ff00"; // Green
        case "encounter": return "#ff4500"; // Orange
        case "trap": return "#ff00ff"; // Magenta
        case "entrance": return "#00ffff"; // Cyan
        case "dungeon": return "#551a8b"; // Dark Purple
        case "event": return "#ffffff"; // White
        default: return "#00bfff"; // Blue
    }
}

function getNodeIcon(type: string): string {
    switch (type) {
        case "boss": return "☠️";
        case "quest": return "!";
        case "loot": return "$";
        case "encounter": return "⚔️";
        case "trap": return "⚠️";
        case "entrance": return "🚪";
        case "dungeon": return "⛓️";
        case "event": return "✦";
        default: return "i";
    }
}

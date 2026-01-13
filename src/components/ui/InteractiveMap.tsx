"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export type MapNode = {
    id: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    label: string;
    type: "quest" | "encounter" | "boss" | "loot" | "info" | "entrance" | "trap";
    onClick?: () => void;
    status?: "active" | "completed" | "locked";
    description?: string;
    link?: string;
    monsters?: string[];
};

type InteractiveMapProps = {
    src: string;
    title: string;
    nodes?: MapNode[];
    onNodeClick?: (node: MapNode) => void;
    gridType?: "hex" | "square" | "none";
};

export default function InteractiveMap({ src, title, nodes = [], onNodeClick, gridType = "hex" }: InteractiveMapProps) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const newScale = Math.max(0.8, Math.min(4, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if not clicking a node
        if ((e.target as HTMLElement).closest(".map-node")) return;

        setIsDragging(true);
        setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const [lastPinchDist, setLastPinchDist] = useState<number | null>(null);

    const getTouchDistance = (touches: React.TouchList) => {
        if (touches.length < 2) return null;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if ((e.target as HTMLElement).closest(".map-node")) return;

        if (e.touches.length === 2) {
            const dist = getTouchDistance(e.touches);
            setLastPinchDist(dist);
            return;
        }

        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - pos.x, y: touch.clientY - pos.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // Handle Pinch Zoom
        if (e.touches.length === 2) {
            const currentDist = getTouchDistance(e.touches);
            if (lastPinchDist && currentDist) {
                // Determine zoom factor
                const diff = currentDist - lastPinchDist;
                // Sensitivity factor
                const zoomFactor = diff * 0.005;

                const newScale = Math.max(0.6, Math.min(6, scale + zoomFactor));
                setScale(newScale);
                setLastPinchDist(currentDist);
            }
            return;
        }

        // Handle Pan
        if (!isDragging) return;
        const touch = e.touches[0];
        setPos({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setLastPinchDist(null);
    };

    // Reset view helper
    const resetView = () => {
        setScale(1);
        setPos({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            className="retro-border"
            style={{
                overflow: "hidden",
                height: "600px",
                position: "relative",
                cursor: isDragging ? "grabbing" : "grab",
                backgroundColor: "#050505",
                touchAction: "none" // Prevent browser scrolling while dragging map
            }}
        >
            {/* UI Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 20,
                    background: "rgba(0, 0, 0, 0.8)",
                    padding: "0.5rem 1rem",
                    border: "1px solid var(--accent-color)",
                    borderRadius: "4px",
                    color: "var(--fg-color)",
                    boxShadow: "0 0 10px rgba(255, 9, 9, 0.2)"
                }}
            >
                <strong style={{ color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</strong>
                <div style={{ fontSize: "0.7em", opacity: 0.8 }}>Scroll to Zoom • Drag to Pan</div>
                <button
                    onClick={resetView}
                    className="hover:text-red-500 transition-colors"
                    style={{ marginTop: "0.5rem", fontSize: "0.7em", border: "1px solid #333", padding: "2px 6px", background: "#111" }}
                >
                    RESET VIEW
                </button>
            </div>

            {/* Scanline Effect Overlay */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
                backgroundSize: "100% 2px, 3px 100%",
                pointerEvents: "none",
                zIndex: 15
            }} />

            {/* Map Container */}
            <div
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: isDragging ? "none" : "transform 0.2s ease-out",
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                }}
            >
                <div style={{ position: "relative" }}>
                    <Image
                        src={src}
                        alt={title}
                        width={1024}
                        height={1024}
                        style={{
                            maxWidth: "none",
                            pointerEvents: "none",
                            filter: "sepia(0.2) contrast(1.2) brightness(0.8)",
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
                    {nodes.map((node, index) => (
                        <div
                            key={node.id}
                            className="map-node"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onNodeClick) onNodeClick(node);
                            }}
                            style={{
                                position: "absolute",
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                                cursor: "pointer"
                            }}
                        >
                            {/* Pulse Effect */}
                            <div className="pulse-ring" style={{
                                position: "absolute",
                                width: "100%", height: "100%",
                                borderRadius: "50%",
                                border: `2px solid ${getNodeColor(node.type)}`,
                                animation: "pulseRed 2s infinite"
                            }} />

                            {/* Icon/Marker */}
                            <div style={{
                                width: "24px",
                                height: "24px",
                                background: "#000",
                                border: `2px solid ${getNodeColor(node.type)}`,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: getNodeColor(node.type),
                                fontSize: "12px",
                                fontWeight: "bold",
                                boxShadow: `0 0 10px ${getNodeColor(node.type)}`,
                                position: "relative"
                            }}>
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
                                    zIndex: 20
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
                                background: "rgba(0,0,0,0.8)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                color: "#fff",
                                fontSize: "10px",
                                whiteSpace: "nowrap",
                                marginTop: "4px",
                                border: "1px solid #333",
                                pointerEvents: "none"
                            }}>
                                {node.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulseRed {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
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
        default: return "#00bfff"; // Blue
    }
}

function getNodeIcon(type: string): string {
    switch (type) {
        case "boss": return "☠️";
        case "quest": return "!";
        case "loot": return "$";
        case "encounter": return "⚔️";
        default: return "i";
    }
}

"use client";

import { useState } from "react";
import Image from "next/image";

type HexMapProps = {
    src: string;
    title: string;
    gridType?: "hex" | "square";
};

export default function HexMap({ src, title, gridType = "hex" }: HexMapProps) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const newScale = Math.max(0.5, Math.min(3, scale + (e.deltaY > 0 ? -0.1 : 0.1)));
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
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

    return (
        <div className="retro-border" style={{ overflow: "hidden", height: "600px", position: "relative", cursor: isDragging ? "grabbing" : "grab" }}>
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 10,
                    background: "rgba(255, 249, 196, 0.9)",
                    padding: "0.5rem",
                    border: "1px solid #5d4037",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.3)"
                }}
            >
                <strong>{title}</strong>
                <div style={{ fontSize: "0.8em" }}>Scroll to Zoom | Drag to Pan</div>
                <button onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }} style={{ marginTop: "0.5rem", fontSize: "0.8em" }}>
                    [RESET_VIEW]
                </button>
            </div>

            {/* Grid Overlay Simulation aligned with transform */}
            <div
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                    transition: isDragging ? "none" : "transform 0.2s",
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative" // Ensure children position absolute is relative to this
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
                            filter: "sepia(0.3) contrast(1.1)"
                        }}
                        draggable={false}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0, bottom: 0,
                            pointerEvents: "none",
                            backgroundImage: gridType === "hex"
                                ? "url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"52\" viewBox=\"0 0 60 52\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15 0 L45 0 L60 26 L45 52 L15 52 L0 26 Z\" fill=\"none\" stroke=\"rgba(0,0,0,0.3)\" stroke-width=\"1\"/></svg>')"
                                : "linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)",
                            backgroundSize: gridType === "hex" ? "60px 52px" : "50px 50px",
                            opacity: 0.6,
                            zIndex: 2
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


"use client";

import React, { useState, useRef, useEffect } from "react";
import { Move, GripVertical } from "lucide-react";

export interface MapNode {
    id: string;
    x: number;
    y: number;
    title: string;
    type: "safe" | "combat" | "narrative" | "boss";
    description: string;
    connectedTo: string[]; // IDs of connected nodes
}

interface NodeEditorCanvasProps {
    nodes: MapNode[];
    onNodesChange: (nodes: MapNode[]) => void;
    selectedNodeId: string | null;
    onSelectNode: (id: string | null) => void;
}

export default function NodeEditorCanvas({ nodes, onNodesChange, selectedNodeId, onSelectNode }: NodeEditorCanvasProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragNodeId, setDragNodeId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    // Pan state
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        onSelectNode(nodeId);
        setIsDragging(true);
        setDragNodeId(nodeId);
        setDragOffset({
            x: e.clientX - node.x,
            y: e.clientY - node.y
        });
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) { // Left click canvas to deselect (or pan if held?) 
            // actually middle click is usually pan, but let's use space+drag or just background drag
            onSelectNode(null);
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && dragNodeId) {
            const updatedNodes = nodes.map(n => {
                if (n.id === dragNodeId) {
                    return {
                        ...n,
                        x: e.clientX - dragOffset.x,
                        y: e.clientY - dragOffset.y
                    };
                }
                return n;
            });
            onNodesChange(updatedNodes);
        } else if (isPanning) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragNodeId(null);
        setIsPanning(false);
    };

    // Render Connections
    const renderConnections = () => {
        return nodes.flatMap(node =>
            node.connectedTo.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;

                // Simple straight line for now
                return (
                    <line
                        key={`${node.id}-${target.id}`}
                        x1={node.x + 100} // Center of 200px width? No, node width variable.
                        y1={node.y + 40}  // Center height approx
                        x2={target.x + 100}
                        y2={target.y + 40}
                        stroke="#8b7e66"
                        strokeWidth="2"
                        opacity="0.5"
                    />
                );
            })
        );
    };

    return (
        <div
            ref={canvasRef}
            className="w-full h-full bg-[#111] relative overflow-hidden cursor-crosshair"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    backgroundPosition: `${pan.x}px ${pan.y}px`
                }}
            />

            {/* Content Container (Pannable) */}
            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }} className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                    {renderConnections()}
                </svg>

                {nodes.map(node => (
                    <div
                        key={node.id}
                        className={`
                            absolute w-[200px] bg-[#0a0a0a] border pointer-events-auto
                            flex flex-col shadow-lg
                            ${selectedNodeId === node.id ? 'border-[var(--gold-accent)] z-10' : 'border-[#333] z-0'}
                        `}
                        style={{
                            left: node.x,
                            top: node.y,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                    >
                        {/* Header Handle */}
                        <div className={`
                            h-8 flex items-center px-2 gap-2 cursor-grab active:cursor-grabbing border-b border-[#333]
                            ${node.type === 'combat' ? 'bg-[#2a0505]' : node.type === 'safe' ? 'bg-[#0c1f0c]' : 'bg-[#1a1a1a]'}
                        `}>
                            <GripVertical size={14} className="text-[#666]" />
                            <span className="text-[10px] font-mono uppercase tracking-wider truncate text-[#ccc]">
                                {node.title || "Untitled Node"}
                            </span>
                        </div>

                        {/* Body Preview */}
                        <div className="p-2 text-[10px] text-[#666] font-mono h-[60px] overflow-hidden">
                            {node.description || "No description..."}
                        </div>
                    </div>
                ))}
            </div>

            {/* Instructions Overlay */}
            <div className="absolute bottom-4 left-4 text-[10px] text-[#444] font-mono pointer-events-none select-none">
                LMB Drag to move nodes • Drag Canvas to Pan • Selection details on right
            </div>
        </div>
    );
}

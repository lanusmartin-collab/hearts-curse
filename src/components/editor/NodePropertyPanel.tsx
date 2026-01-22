"use client";

import React from "react";
import { MapNode } from "./NodeEditorCanvas";
import { Trash2, Link as LinkIcon, Unlink } from "lucide-react";

interface NodePropertyPanelProps {
    node: MapNode | null;
    allNodes: MapNode[];
    onUpdate: (updated: MapNode) => void;
    onDelete: (id: string) => void;
}

export default function NodePropertyPanel({ node, allNodes, onUpdate, onDelete }: NodePropertyPanelProps) {
    if (!node) {
        return (
            <div className="w-[300px] bg-[#111] border-l border-[#333] p-6 flex items-center justify-center text-[#444] text-xs font-mono uppercase tracking-widest shrink-0">
                No Selection
            </div>
        );
    }

    const handleChange = (field: keyof MapNode, value: any) => {
        onUpdate({ ...node, [field]: value });
    };

    const toggleConnection = (targetId: string) => {
        const isConnected = node.connectedTo.includes(targetId);
        let newConnections;
        if (isConnected) {
            newConnections = node.connectedTo.filter(id => id !== targetId);
        } else {
            newConnections = [...node.connectedTo, targetId];
        }
        onUpdate({ ...node, connectedTo: newConnections });
    };

    return (
        <div className="w-[300px] bg-[#0e0e0e] border-l border-[#333] flex flex-col shrink-0 h-full overflow-hidden">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                <h3 className="text-sm font-header text-[var(--gold-accent)] uppercase tracking-wider">Node Properties</h3>
                <button
                    onClick={() => onDelete(node.id)}
                    className="text-[#666] hover:text-red-500 transition"
                    title="Delete Node"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                {/* Basic Info */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-[10px] uppercase font-mono text-[#666] mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full bg-[#1a1a1a] border border-[#333] p-2 text-xs font-mono text-gray-300 focus:border-[var(--gold-accent)] outline-none"
                            value={node.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-mono text-[#666] mb-1">Type</label>
                        <select
                            className="w-full bg-[#1a1a1a] border border-[#333] p-2 text-xs font-mono text-gray-300 focus:border-[var(--gold-accent)] outline-none"
                            value={node.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            <option value="safe">Safe Haven</option>
                            <option value="combat">Combat / Dungeoneering</option>
                            <option value="narrative">Narrative Event</option>
                            <option value="boss">Boss Arena</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase font-mono text-[#666] mb-1">Description</label>
                        <textarea
                            className="w-full h-32 bg-[#1a1a1a] border border-[#333] p-2 text-xs font-mono text-gray-300 focus:border-[var(--gold-accent)] outline-none resize-none"
                            value={node.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>
                </div>

                {/* Connections Manager */}
                <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-mono text-[#666] mb-1 border-b border-[#333] pb-1">Connections</label>
                    <div className="space-y-1">
                        {allNodes.filter(n => n.id !== node.id).map(target => {
                            const isConnected = node.connectedTo.includes(target.id);
                            return (
                                <button
                                    key={target.id}
                                    onClick={() => toggleConnection(target.id)}
                                    className={`
                                        w-full flex items-center justify-between px-2 py-2 text-xs border
                                        ${isConnected ? 'border-[var(--gold-accent)] bg-[#2a2510] text-[var(--gold-accent)]' : 'border-[#333] bg-[#111] text-[#666] hover:border-[#555]'}
                                    `}
                                >
                                    <span className="truncate flex-1 text-left">{target.title || "Untitled"}</span>
                                    {isConnected ? <Unlink size={12} /> : <LinkIcon size={12} />}
                                </button>
                            );
                        })}
                        {allNodes.length <= 1 && (
                            <div className="text-[10px] text-[#444] italic">Add more nodes to connect...</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

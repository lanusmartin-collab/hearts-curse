"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Skull, Shield, Zap, Eye, Ghost, Trash2, Plus, Upload, Heart, Activity } from "lucide-react";

type PlayerStatus = "Normal" | "Dead" | "Cursed" | "Poisoned" | "Blind" | "Deaf" | "Exhausted" | "Stunned";

type PlayerCharacter = {
    id: string;
    name: string;
    class: string;
    status: PlayerStatus[];
    notes: string;
    files: { name: string; date: string }[];
};

export default function PlayersPage() {
    // Initial data could come from local storage in a real app
    const [players, setPlayers] = useState<PlayerCharacter[]>([
        { id: "1", name: "Valeros", class: "Fighter 5", status: ["Normal"], notes: "Possessed by a ghost?", files: [] }
    ]);
    const [newPlayerName, setNewPlayerName] = useState("");

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        setPlayers([...players, {
            id: Date.now().toString(),
            name: newPlayerName,
            class: "Unknown",
            status: ["Normal"],
            notes: "",
            files: []
        }]);
        setNewPlayerName("");
    };

    const toggleStatus = (playerId: string, status: PlayerStatus) => {
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;

            // Handle "Normal" exclusivity
            if (status === "Normal") return { ...p, status: ["Normal"] };

            const newStatuses = p.status.includes(status)
                ? p.status.filter(s => s !== status)
                : [...p.status.filter(s => s !== "Normal"), status];

            return { ...p, status: newStatuses.length === 0 ? ["Normal"] : newStatuses };
        }));
    };

    const updateNotes = (playerId: string, notes: string) => {
        setPlayers(players.map(p => (p.id === playerId ? { ...p, notes } : p)));
    };

    const handleFileUpload = (playerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            return {
                ...p,
                files: [...p.files, { name: file.name, date: new Date().toLocaleDateString() }]
            };
        }));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', backgroundImage: 'var(--obsidian-texture)', color: '#e0e0e0', paddingBottom: '8rem', position: 'relative' }} className="font-body">
            {/* Overlay for Texture */}
            <div style={{ position: 'fixed', inset: 0, opacity: 0.1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)", pointerEvents: 'none' }}></div>

            <Link href="/" className="no-print" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '12px', color: '#ccc', border: '1px solid #333', padding: '8px 16px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(5, 5, 5, 0.9)', zIndex: 9999, backdropFilter: 'blur(4px)' }} >
                {"< RETURN_ROOT"}
            </Link>

            <div className="max-w-7xl mx-auto pt-24 px-8 relative z-10">
                <header className="flex justify-between items-end mb-16 border-b border-[#a32222] pb-6">
                    <div>
                        <h1 className="text-5xl font-header text-[#a32222] drop-shadow-[0_2px_10px_rgba(163,34,34,0.5)] tracking-wide">
                            SOUL DOSSIERS
                        </h1>
                        <div className="h-1 w-32 bg-[#a32222] mt-2 mb-2"></div>
                        <p className="font-mono text-sm text-[#888] tracking-[0.3em] uppercase flex items-center gap-2">
                            Current Roster // <Activity className="w-4 h-4 text-[#a32222] animate-pulse" /> Live
                        </p>
                    </div>
                </header>

                {/* Recruitment Terminal */}
                <div className="mb-16 p-1 bg-gradient-to-r from-[#1a0505] to-[#050505] border border-[#a32222] shadow-[0_0_20px_rgba(163,34,34,0.1)] max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex items-center">
                        <div className="bg-[#a32222] h-16 w-16 flex items-center justify-center text-black">
                            <Plus className="w-8 h-8" />
                        </div>
                        <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                            placeholder="INITIATE NEW SOUL CONTRACT..."
                            className="flex-1 bg-transparent p-4 text-xl font-header text-[#e0e0e0] placeholder-[#444] outline-none tracking-wider"
                        />
                        <button
                            onClick={addPlayer}
                            className="px-8 py-4 font-mono text-[#a32222] hover:bg-[#a32222] hover:text-black transition-colors uppercase tracking-widest text-sm font-bold border-l border-[#333]"
                        >
                            Confirm
                        </button>
                    </div>
                </div>

                {/* Roster Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {players.map(player => (
                        <div key={player.id} className="relative group bg-[#0a0a0c] border border-[#333] p-8 shadow-2xl transition-all duration-300 hover:border-[#a32222] hover:shadow-[0_0_30px_rgba(163,34,34,0.1)]">
                            {/* Decorative Corners (Retro feel) */}
                            <div className="absolute top-0 left-0 w-2 h-2 bg-[#a32222]"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#a32222]"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#a32222]"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#a32222]"></div>

                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-8 border-b border-[#222] pb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-3xl font-header text-[#e0e0e0]">{player.name}</h2>
                                        {player.status.includes("Dead") && <Skull className="w-6 h-6 text-red-600 animate-pulse" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-[1px] w-8 bg-[#666]"></div>
                                        <input
                                            className="text-sm font-mono text-[#888] bg-transparent border-none uppercase tracking-widest w-full focus:text-[#a32222] outline-none"
                                            defaultValue={player.class}
                                            placeholder="CLASS_UNKNOWN // LEVEL_0"
                                            onChange={(e) => {
                                                setPlayers(players.map(p => (p.id === player.id ? { ...p, class: e.target.value } : p)));
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                                    className="text-[#333] hover:text-[#a32222] transition-colors p-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status System */}
                            <div className="mb-8">
                                <h3 className="text-xs font-mono font-bold uppercase text-[#555] mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Vital Status
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Dead", "Cursed", "Poisoned", "Blind", "Deaf", "Exhausted", "Stunned"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => toggleStatus(player.id, status as PlayerStatus)}
                                            className={`
                                                px-4 py-1.5 border text-xs font-mono uppercase tracking-wider transition-all duration-200
                                                ${player.status.includes(status as PlayerStatus)
                                                    ? 'bg-[#2a0a0a] text-[#ff4444] border-[#a32222] shadow-[0_0_10px_rgba(255,68,68,0.2)]'
                                                    : 'bg-transparent text-[#444] border-[#222] hover:border-[#666] hover:text-[#bbb]'}
                                            `}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => toggleStatus(player.id, "Normal")}
                                        className={`px-4 py-1.5 border text-xs font-mono uppercase tracking-wider transition-all duration-200 ${player.status.includes("Normal") ? 'bg-[#0a2a0a] text-[#44ff44] border-[#22aa22]' : 'hidden'}`}
                                    >
                                        Healthy
                                    </button>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                                {/* Notes */}
                                <div className="md:col-span-3">
                                    <h3 className="text-xs font-mono font-bold uppercase text-[#555] mb-4 tracking-[0.2em] flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> Observations
                                    </h3>
                                    <textarea
                                        className="w-full h-40 bg-[#050505] border border-[#222] p-4 text-sm text-[#aaa] font-serif leading-relaxed resize-none focus:border-[#a32222] focus:shadow-[0_0_15px_rgba(0,0,0,0.5)] outline-none transition-all placeholder-[#333]"
                                        value={player.notes}
                                        onChange={(e) => updateNotes(player.id, e.target.value)}
                                        placeholder="Record strange behaviors, pacts, or sudden alignments shifts..."
                                    />
                                </div>

                                {/* Files */}
                                <div className="md:col-span-2 flex flex-col h-full bg-[#050505] border border-[#222] relative group/files">
                                    <div className="p-3 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#555]">Attachments</span>
                                        <label className="cursor-pointer text-[#555] hover:text-[#a32222] transition-colors">
                                            <Upload className="w-3 h-3" />
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(player.id, e)} />
                                        </label>
                                    </div>
                                    <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                                        {player.files.length === 0 ? (
                                            <div className="h-full flex items-center justify-center">
                                                <span className="text-[10px] font-mono text-[#333] uppercase">No Data</span>
                                            </div>
                                        ) : (
                                            <ul className="space-y-1">
                                                {player.files.map((file, i) => (
                                                    <li key={i} className="bg-[#111] p-2 border-l border-[#a32222] text-[10px] flex justify-between items-center group/item hover:bg-[#1a0505] cursor-pointer transition-colors">
                                                        <span className="text-[#888] font-mono truncate max-w-[80px]">{file.name}</span>
                                                        <span className="text-[#444]">{file.date}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {players.length === 0 && (
                        <div className="col-span-1 xl:col-span-2 text-center py-32 border border-dashed border-[#222] rounded bg-[#0a0a0a]">
                            <Ghost className="w-12 h-12 text-[#222] mx-auto mb-6" />
                            <p className="text-[#444] font-header tracking-widest text-lg uppercase">Archive Empty</p>
                            <p className="text-[#333] font-mono text-xs mt-2">Begin recruitment protocol</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

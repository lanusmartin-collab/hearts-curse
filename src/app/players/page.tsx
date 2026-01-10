"use client";

import { useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/ui/PrintButton";
import { Skull, Shield, Zap, Eye, Ghost, Trash2, Plus, Upload } from "lucide-react";

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

        // Simulation: We just store name/date since we lack backend storage
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            return {
                ...p,
                files: [...p.files, { name: file.name, date: new Date().toLocaleDateString() }]
            };
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#ccc] p-8 pb-32" style={{ backgroundImage: "url('/noise.png')" }}>
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #2a0a0a 0%, #000 80%)" }}></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-[#333] pb-6">
                    <div>
                        <h1 className="text-4xl font-serif text-[#a32222] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">ADVENTURING PARTY</h1>
                        <p className="font-mono text-xs text-[#666] mt-2 tracking-[0.2em] uppercase">ROSTER STATUS // <span className="text-[#a32222] animate-pulse">LIVE FEED</span></p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/" className="px-4 py-2 border border-[#333] hover:border-[#a32222] text-[#666] hover:text-[#a32222] text-xs uppercase tracking-widest transition-colors">
                            Exit Module
                        </Link>
                    </div>
                </header>

                {/* Add Player */}
                <div className="no-print mb-12 p-1 bg-[#111] border border-[#333] flex items-center max-w-lg mx-auto shadow-2xl">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="RECRUIT NEW SOUL..."
                        className="flex-1 bg-transparent p-4 text-[#eee] font-serif placeholder-[#444] outline-none"
                    />
                    <button
                        onClick={addPlayer}
                        className="bg-[#2a0a0a] hover:bg-[#4a0a0a] text-[#a32222] p-4 border-l border-[#333] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {/* Roster */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {players.map(player => (
                        <div key={player.id} className="relative group bg-[#0e0e0e] border border-[#222] p-6 shadow-xl hover:border-[#444] transition-all">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#a32222]/30"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#a32222]/30"></div>

                            {/* Header Image / Name */}
                            <div className="flex justify-between items-start mb-6 border-b border-[#222] pb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-serif text-[#e0e0e0] tracking-wide">{player.name}</h2>
                                        {player.status.includes("Dead") && <Skull className="w-5 h-5 text-red-600" />}
                                    </div>
                                    <input
                                        className="text-xs text-[#666] bg-transparent border-none uppercase tracking-widest w-full focus:text-[#eee] outline-none"
                                        defaultValue={player.class}
                                        placeholder="CLASS / LEVEL"
                                        onChange={(e) => {
                                            setPlayers(players.map(p => (p.id === player.id ? { ...p, class: e.target.value } : p)));
                                        }}
                                    />
                                </div>
                                {/* Delete Button */}
                                <button
                                    onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#444] hover:text-[#a32222] p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Status Toggles */}
                            <div className="mb-6">
                                <h3 className="text-[10px] font-bold uppercase text-[#444] mb-3 tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Conditions
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Dead", "Cursed", "Poisoned", "Blind", "Deaf", "Exhausted", "Stunned"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => toggleStatus(player.id, status as PlayerStatus)}
                                            className={`
                                                text-[10px] px-3 py-1 border transition-all uppercase tracking-wider
                                                ${player.status.includes(status as PlayerStatus)
                                                    ? 'bg-[#2a0a0a] text-[#ff4444] border-[#a32222] shadow-[0_0_10px_rgba(163,34,34,0.3)]'
                                                    : 'bg-[#151515] text-[#555] border-[#333] hover:border-[#555] hover:text-[#888]'}
                                            `}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid Layout for Notes & Files */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Notes Area */}
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase text-[#444] mb-3 tracking-widest flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> Observation Log
                                    </h3>
                                    <textarea
                                        className="w-full h-32 bg-[#080808] border border-[#222] p-3 text-xs font-mono text-[#888] resize-none focus:border-[#444] focus:text-[#ccc] outline-none"
                                        value={player.notes}
                                        onChange={(e) => updateNotes(player.id, e.target.value)}
                                        placeholder="// Enter notes..."
                                    />
                                </div>

                                {/* File Attachment */}
                                <div>
                                    <h3 className="text-[10px] font-bold uppercase text-[#444] mb-3 tracking-widest flex items-center justify-between">
                                        <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Dossier</span>
                                        <label className="cursor-pointer text-[#444] hover:text-[#a32222] transition-colors">
                                            <Upload className="w-3 h-3" />
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(player.id, e)} accept=".pdf,.doc,.docx,.xls,.xlsx" />
                                        </label>
                                    </h3>

                                    <div className="h-32 bg-[#080808] border border-[#222] p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#333]">
                                        {player.files.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-[10px] text-[#333] italic">No records found</div>
                                        ) : (
                                            <ul className="space-y-2">
                                                {player.files.map((file, i) => (
                                                    <li key={i} className="bg-[#111] p-2 border-l-2 border-[#a32222] text-[10px] flex justify-between group/file">
                                                        <span className="text-[#888] truncate max-w-[100px]">{file.name}</span>
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
                        <div className="col-span-1 lg:col-span-2 text-center py-20 border border-dashed border-[#333]">
                            <Ghost className="w-8 h-8 text-[#222] mx-auto mb-4" />
                            <p className="text-[#444] font-serif tracking-widest text-sm">NO SOULS DETECTED</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

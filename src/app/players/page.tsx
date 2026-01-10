"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Skull, Shield, Zap, Eye, Ghost, Trash2, Plus, Upload, Heart, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, ChevronDown, ChevronUp } from "lucide-react";

type PlayerStatus = "Normal" | "Dead" | "Cursed" | "Poisoned" | "Blind" | "Deaf" | "Exhausted" | "Stunned";

type PlayerCharacter = {
    id: string;
    name: string;
    class: string;
    status: PlayerStatus[];
    notes: string;
    files: { name: string; date: string; url?: string; type?: string }[];
};

const STATUS_CONFIG: Record<PlayerStatus, { icon: React.ElementType, color: string, border: string, bg: string }> = {
    Normal: { icon: Heart, color: "#44ff44", border: "#22aa22", bg: "#0a2a0a" },
    Dead: { icon: Skull, color: "#ff4444", border: "#a32222", bg: "#2a0a0a" },
    Cursed: { icon: Ghost, color: "#bf80ff", border: "#8c5bbf", bg: "#1a0a2a" },
    Poisoned: { icon: Biohazard, color: "#44ff88", border: "#22aa55", bg: "#0a1a0a" },
    Blind: { icon: EyeOff, color: "#aaaaaa", border: "#666666", bg: "#111111" },
    Deaf: { icon: MicOff, color: "#aaaaaa", border: "#666666", bg: "#111111" },
    Exhausted: { icon: BatteryLow, color: "#ffaa44", border: "#cc8800", bg: "#2a1a0a" },
    Stunned: { icon: Stars, color: "#ffff44", border: "#aaaa22", bg: "#2a2a0a" }
};

export default function PlayersPage() {
    const [players, setPlayers] = useState<PlayerCharacter[]>([
        { id: "1", name: "Valeros", class: "Fighter 5", status: ["Normal"], notes: "Possessed by a ghost?", files: [] }
    ]);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string, name: string } | null>(null);

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
        setIsAddMenuOpen(false);
    };

    const toggleStatus = (playerId: string, status: PlayerStatus) => {
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;

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

        const fileUrl = URL.createObjectURL(file);

        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            return {
                ...p,
                files: [...p.files, {
                    name: file.name,
                    date: new Date().toLocaleDateString(),
                    url: fileUrl,
                    type: file.type
                }]
            };
        }));
    };

    return (
        <div style={{ minHeight: '100vh', background: '#050505', backgroundImage: 'var(--obsidian-texture)', color: '#e0e0e0', paddingBottom: '8rem', position: 'relative' }} className="font-body">
            {/* Overlay for Texture */}
            <div style={{ position: 'fixed', inset: 0, opacity: 0.1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)", pointerEvents: 'none' }}></div>

            {/* Fix: Increased top padding via style to account for absolute button and clear header */}
            <Link href="/" className="no-print" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '12px', color: '#ccc', border: '1px solid #333', padding: '8px 16px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(5, 5, 5, 0.9)', zIndex: 9999, backdropFilter: 'blur(4px)' }} >
                {"< RETURN_ROOT"}
            </Link>

            <div className="max-w-7xl mx-auto pt-32 px-8 relative z-10">
                <header className="flex justify-between items-end mb-12 border-b border-[#a32222] pb-6">
                    <div>
                        <h1 className="text-5xl font-header text-[#a32222] drop-shadow-[0_2px_10px_rgba(163,34,34,0.5)] tracking-wide">
                            SOUL DOSSIERS
                        </h1>
                        <div className="h-1 w-32 bg-[#a32222] mt-2 mb-2"></div>
                        <p className="font-mono text-sm text-[#888] tracking-[0.3em] uppercase flex items-center gap-2">
                            Current Roster // <Activity className="w-4 h-4 text-[#a32222] animate-pulse" /> Live
                        </p>
                    </div>

                    {/* Compact Add Menu */}
                    <div className="relative">
                        {!isAddMenuOpen ? (
                            <button
                                onClick={() => setIsAddMenuOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-[#333] hover:border-[#a32222] text-[#888] hover:text-[#a32222] transition-colors font-mono text-xs uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" /> Recruit
                            </button>
                        ) : (
                            <div className="absolute right-0 top-0 w-80 bg-[#0a0a0a] border border-[#a32222] p-4 shadow-xl z-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-mono text-[#a32222]">NEW ENTRY</span>
                                    <button onClick={() => setIsAddMenuOpen(false)}><X className="w-4 h-4 text-[#666] hover:text-[#e0e0e0]" /></button>
                                </div>
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                    placeholder="Name..."
                                    className="w-full bg-[#111] border border-[#333] p-2 text-sm text-[#e0e0e0] mb-2 outline-none focus:border-[#a32222]"
                                    autoFocus
                                />
                                <button
                                    onClick={addPlayer}
                                    className="w-full bg-[#a32222] text-black font-bold text-xs uppercase py-2 hover:bg-[#c43333] transition-colors"
                                >
                                    Confirm Recruitment
                                </button>
                            </div>
                        )}
                    </div>
                </header>

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
                                        {/* Primary Status Icon Display */}
                                        <div className="flex gap-2">
                                            {player.status.filter(s => s !== "Normal").map(s => {
                                                const Config = STATUS_CONFIG[s];
                                                return <Config.icon key={s} className="w-5 h-5 animate-pulse" style={{ color: Config.color }} />;
                                            })}
                                        </div>
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

                            {/* Status System with Icons */}
                            <div className="mb-8">
                                <h3 className="text-xs font-mono font-bold uppercase text-[#555] mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Vital Status
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map((status) => {
                                        const Config = STATUS_CONFIG[status];
                                        const isActive = player.status.includes(status);
                                        const Icon = Config.icon;

                                        // Hide "Normal" button if any negative status is active to reduce clutter, or keep it as reset
                                        if (status === "Normal" && player.status.length > 1) return null;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => toggleStatus(player.id, status)}
                                                className={`
                                                    px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2
                                                `}
                                                style={{
                                                    borderColor: isActive ? Config.border : '#333',
                                                    color: isActive ? Config.color : '#666',
                                                    backgroundColor: isActive ? Config.bg : 'transparent',
                                                    boxShadow: isActive ? `0 0 10px ${Config.color}20` : 'none'
                                                }}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {status}
                                            </button>
                                        );
                                    })}
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

                                {/* Files with Preview */}
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
                                                    <li
                                                        key={i}
                                                        className="bg-[#111] p-2 border-l border-[#a32222] text-[10px] flex justify-between items-center group/item hover:bg-[#1a0505] cursor-pointer transition-colors"
                                                        onClick={() => file.url && setPreviewFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText className="w-3 h-3 text-[#666]" />
                                                            <span className="text-[#888] font-mono truncate">{file.name}</span>
                                                        </div>
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

            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-[#111] border border-[#a32222] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl relative">
                        <div className="flex justify-between items-center p-4 border-b border-[#333] bg-[#0a0a0a]">
                            <h3 className="text-[#e0e0e0] font-mono text-sm uppercase tracking-widest">{previewFile.name}</h3>
                            <button onClick={() => setPreviewFile(null)} className="text-[#666] hover:text-[#ff4444]"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 overflow-hidden bg-[#222]">
                            {previewFile.type.startsWith('image/') ? (
                                <img src={previewFile.url} alt="Preview" className="w-full h-full object-contain" />
                            ) : previewFile.type === 'application/pdf' ? (
                                <iframe src={previewFile.url} className="w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#888] font-mono">
                                    PREVIEW NOT AVAILABLE FOR THIS FILE TYPE
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

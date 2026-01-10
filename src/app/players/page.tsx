"use client";

import { useState } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, ChevronRight, User } from "lucide-react";

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
    Normal: { icon: User, color: "#44ff44", border: "#22aa22", bg: "#0a2a0a" },
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
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string, name: string } | null>(null);

    const activePlayer = players.find(p => p.id === selectedPlayerId);

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const newId = Date.now().toString();
        setPlayers([...players, {
            id: newId,
            name: newPlayerName,
            class: "Unknown",
            status: ["Normal"],
            notes: "",
            files: []
        }]);
        setNewPlayerName("");
        setIsAddMenuOpen(false);
        setSelectedPlayerId(newId); // Auto-select new player
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
                files: [...p.files, { name: file.name, date: new Date().toLocaleDateString(), url: fileUrl, type: file.type }]
            };
        }));
    };

    const deleteFile = (playerId: string, fileIdx: number) => {
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            const newFiles = [...p.files];
            newFiles.splice(fileIdx, 1);
            return { ...p, files: newFiles };
        }));
    };

    return (
        <div className="min-h-screen bg-[#050505] font-body relative overflow-hidden flex flex-col">
            {/* Soul-like Fog Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('/noise.png')] z-0"></div>
            <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/80 to-[#050505]"></div>

            <CommandBar />

            <div className="flex-1 flex max-w-[1800px] mx-auto w-full relative z-10 p-6 gap-8 h-[calc(100vh-60px)]">

                {/* LEFT PANEL: ROSTER LIST */}
                <div className="w-1/3 min-w-[300px] flex flex-col border-r border-[#333]/50 pr-6">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-header text-[#e0e0e0] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                Souls
                            </h1>
                            <p className="text-[10px] font-mono text-[#666] uppercase tracking-[0.3em]">
                                Roster Size: {players.length}
                            </p>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                                className="w-8 h-8 flex items-center justify-center border border-[#333] hover:border-[#a32222] text-[#666] hover:text-[#a32222] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            {isAddMenuOpen && (
                                <div className="absolute top-10 right-0 w-64 bg-[#0a0a0a] border border-[#333] p-4 shadow-2xl z-50 animate-slide-up">
                                    <input
                                        type="text"
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                        placeholder="Soul Name..."
                                        className="w-full bg-[#111] border border-[#222] p-2 text-xs text-[#e0e0e0] mb-2 focus:border-[#a32222]"
                                        autoFocus
                                    />
                                    <button onClick={addPlayer} className="w-full bg-[#1a0505] text-[#a32222] border border-[#333] text-[10px] uppercase py-2 hover:bg-[#2a0a0a]">
                                        Recruit
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {players.map(player => {
                            const isDead = player.status.includes("Dead");
                            return (
                                <button
                                    key={player.id}
                                    onClick={() => setSelectedPlayerId(player.id)}
                                    className={`w-full text-left p-4 border transition-all duration-300 group relative overflow-hidden
                                        ${selectedPlayerId === player.id
                                            ? 'bg-gradient-to-r from-[#1a0505] to-transparent border-[#a32222] text-[#e0e0e0]'
                                            : 'bg-[#0a0a0a] border-[#222] text-[#666] hover:border-[#444] hover:text-[#aaa]'}
                                    `}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className={`font-header text-lg tracking-wide ${isDead ? 'text-[#a32222] line-through' : ''}`}>
                                            {player.name}
                                        </span>
                                        {selectedPlayerId === player.id && <Activity className="w-4 h-4 text-[#a32222] animate-pulse" />}
                                    </div>
                                    <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">{player.class}</span>

                                    {/* Bonfire Particle Effect for Selected */}
                                    {selectedPlayerId === player.id && (
                                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#a32222] blur-[40px] opacity-10 rounded-full pointer-events-none"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT PANEL: DETAILS (Soul-like Master Detail) */}
                <div className="flex-1 relative bg-[#0a0a0c] border border-[#222] shadow-2xl overflow-hidden flex flex-col">
                    {activePlayer ? (
                        <div className="h-full flex flex-col p-8 animate-fade-in relative z-10">
                            {/* Decorative Borders */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-[#a32222]/20 rounded-tl-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-[#a32222]/20 rounded-br-3xl pointer-events-none"></div>

                            {/* DETAIL HEADER */}
                            <div className="mb-10 flex justify-between items-start border-b border-[#222] pb-6">
                                <div>
                                    <h2 className="text-5xl font-header text-[#e0e0e0] mb-2 tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                                        {activePlayer.name}
                                    </h2>
                                    <input
                                        className="bg-transparent border-none text-[#666] font-mono text-sm uppercase tracking-[0.2em] w-96 focus:text-[#a32222] outline-none"
                                        value={activePlayer.class}
                                        onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                        placeholder="CLASS / ORIGIN"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            if (confirm("Expel this soul?")) {
                                                setPlayers(players.filter(p => p.id !== activePlayer.id));
                                                setSelectedPlayerId(null);
                                            }
                                        }}
                                        className="text-[#333] hover:text-[#a32222] transition-colors p-2 self-end"
                                        title="Delete Soul"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* STATUS TOGGLES */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-mono text-[#444] uppercase tracking-[0.3em] mb-4">Vital Condition</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                        const config = STATUS_CONFIG[status];
                                        const isActive = activePlayer.status.includes(status);
                                        const Icon = config.icon;
                                        if (status === "Normal" && activePlayer.status.length > 1) return null;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => toggleStatus(activePlayer.id, status)}
                                                className={`
                                                    px-4 py-2 border flex items-center gap-2 transition-all duration-300 uppercase tracking-widest text-[10px] font-mono
                                                `}
                                                style={{
                                                    borderColor: isActive ? config.border : '#222',
                                                    backgroundColor: isActive ? 'rgba(0,0,0,0.6)' : 'transparent',
                                                    color: isActive ? config.color : '#444',
                                                    boxShadow: isActive ? `0 0 15px ${config.color}10` : 'none',
                                                    transform: isActive ? 'translateY(-2px)' : 'none'
                                                }}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CONTENT GRID */}
                            <div className="flex-1 grid grid-cols-2 gap-8 min-h-0">
                                {/* NOTES */}
                                <div className="flex flex-col h-full">
                                    <h3 className="text-[10px] font-mono text-[#444] uppercase tracking-[0.3em] mb-4">Chronicles</h3>
                                    <textarea
                                        className="flex-1 w-full bg-[#050505] border border-[#222] p-4 text-[#aaa] font-serif text-sm leading-7 resize-none focus:border-[#a32222]/50 outline-none custom-scrollbar"
                                        value={activePlayer.notes}
                                        onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                        placeholder="Record the journey..."
                                    />
                                </div>

                                {/* FILE MANAGER */}
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[10px] font-mono text-[#444] uppercase tracking-[0.3em]">Archives</h3>
                                        <label className="cursor-pointer text-[#444] hover:text-[#e0e0e0] transition-colors flex items-center gap-2 text-[10px] uppercase font-mono border border-[#222] px-2 py-1 hover:border-[#666]">
                                            <Upload className="w-3 h-3" /> Upload
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                        </label>
                                    </div>

                                    <div className="flex-1 bg-[#050505] border border-[#222] relative overflow-hidden">
                                        {activePlayer.files.length === 0 ? (
                                            <div className="absolute inset-0 flex items-center justify-center text-[#222] font-header tracking-widest text-2xl uppercase select-none pointer-events-none">
                                                No Records
                                            </div>
                                        ) : (
                                            <div className="p-2 space-y-2 overflow-y-auto h-full custom-scrollbar">
                                                {activePlayer.files.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between text-[11px] font-mono text-[#888] p-3 border border-[#222] hover:bg-[#111] transition-colors group">
                                                        <button
                                                            className="flex-1 text-left flex items-center gap-3 truncate"
                                                            onClick={() => file.url && setPreviewFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                        >
                                                            <FileText className="w-3 h-3 text-[#555]" />
                                                            <span className="truncate group-hover:text-[#e0e0e0] transition-colors">{file.name}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFile(activePlayer.id, i)}
                                                            className="text-[#333] hover:text-[#a32222] px-2"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // EMPTY STATE
                        <div className="h-full flex flex-col items-center justify-center text-[#333] select-none">
                            <Ghost className="w-24 h-24 mb-6 opacity-20" />
                            <h2 className="text-4xl font-header tracking-[0.5em] uppercase mb-4 opacity-40">Select Soul</h2>
                            <p className="font-mono text-xs uppercase tracking-widest opacity-30">Waiting for input...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* FULL SCREEN PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in">
                    <div className="h-12 border-b border-[#222] flex justify-between items-center px-6 bg-[#0a0a0c]">
                        <span className="text-[#666] font-mono text-xs uppercase tracking-widest">{previewFile.name}</span>
                        <button onClick={() => setPreviewFile(null)} className="text-[#666] hover:text-[#e0e0e0] p-2 hover:bg-[#222]">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-hidden flex items-center justify-center">
                        {previewFile.type.startsWith('image/') ? (
                            <img src={previewFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl" />
                        ) : previewFile.type === 'application/pdf' ? (
                            <iframe src={previewFile.url} className="w-full h-full border-none shadow-2xl" />
                        ) : (
                            <div className="text-[#444] font-mono">PREVIEW UNAVAILABLE</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

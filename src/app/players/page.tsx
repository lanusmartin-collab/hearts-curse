"use client";

import { useState } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, User, UserPlus } from "lucide-react";

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
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(players[0]?.id || null);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string, type: string, name: string } | null>(null);

    const activePlayer = players.find(p => p.id === selectedPlayerId);

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const newId = Date.now().toString();
        const newPlayer = {
            id: newId,
            name: newPlayerName,
            class: "Unknown",
            status: ["Normal"] as PlayerStatus[],
            notes: "",
            files: []
        };
        setPlayers([...players, newPlayer]);
        setNewPlayerName("");
        setIsAddMenuOpen(false);
        setSelectedPlayerId(newId);
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
        if (!confirm("Delete this arcane record?")) return;
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            const newFiles = [...p.files];
            newFiles.splice(fileIdx, 1);
            return { ...p, files: newFiles };
        }));
    };

    return (
        <div className="retro-container h-screen flex flex-col overflow-hidden">
            <CommandBar />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Grimoire Style (Matching Maps Page) */}
                <div className="grimoire-sidebar w-[300px] flex flex-col shrink-0 overflow-hidden z-20">
                    <div className="grimoire-header">
                        <h3 className="grimoire-title">Soul Register</h3>
                        <button
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            className="mt-3 text-xs bg-red-900/20 border border-red-900/50 text-red-200 px-4 py-2 rounded hover:bg-red-900/40 transition-colors uppercase tracking-widest w-full flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-3 h-3" /> New Soul
                        </button>

                        {isAddMenuOpen && (
                            <div className="mt-2 p-2 bg-[#050505] border border-[#333] animate-slide-up">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                    placeholder="Name..."
                                    className="w-full bg-[#111] border border-[#333] p-1 text-xs text-[#e0e0e0] mb-2 focus:border-[#a32222]"
                                    autoFocus
                                />
                                <button onClick={addPlayer} className="w-full bg-[#a32222] text-white text-[10px] uppercase py-1">
                                    Confirm
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <div className="grimoire-category">
                            <h4 className="grimoire-cat-header">Active Party</h4>
                            {players.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPlayerId(p.id)}
                                    className={`grimoire-item ${selectedPlayerId === p.id ? 'active' : ''}`}
                                >
                                    <span className={p.status.includes('Dead') ? 'line-through text-red-700' : ''}>{p.name}</span>
                                    {p.status.length > 1 && <span className="text-[9px] ml-auto text-red-500 uppercase">{p.status.find(s => s !== "Normal")}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main View - Description Panel Style */}
                <div className="flex-1 flex flex-col bg-[#1a1a1a] border-l border-[#333] relative overflow-hidden">
                    {/* Background Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/noise.png')] opacity-5"></div>

                    {activePlayer ? (
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10 flex flex-col gap-8">
                            {/* Header Section */}
                            <div className="border-b border-[#333] pb-6 flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-header text-[#e0e0e0] tracking-widest drop-shadow-md mb-2">
                                        {activePlayer.name}
                                    </h1>
                                    <input
                                        className="bg-transparent border-none text-[#888] font-mono text-sm uppercase tracking-[0.2em] w-full focus:text-[#a32222] outline-none p-0"
                                        value={activePlayer.class}
                                        onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                        placeholder="CLASS UNKNOWN"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm("Remove this soul permanently?")) {
                                            setPlayers(players.filter(p => p.id !== activePlayer.id));
                                            setSelectedPlayerId(null);
                                        }
                                    }}
                                    className="text-[#444] hover:text-[#a32222] transition-colors p-2"
                                    title="Delete Soul"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Section */}
                            <div className="bg-[#111] border border-[#333] p-6 shadow-lg">
                                <h3 className="text-red-500 font-bold mb-4 text-xs tracking-widest border-b border-red-900/30 pb-2 flex items-center gap-2">
                                    <Activity className="w-3 h-3" /> VITAL STATUS
                                </h3>
                                <div className="flex flex-wrap gap-2">
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
                                                    px-3 py-1.5 border flex items-center gap-2 transition-all duration-200 uppercase tracking-widest text-[10px] font-mono
                                                `}
                                                style={{
                                                    borderColor: isActive ? config.border : '#333',
                                                    backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                                    color: isActive ? config.color : '#666',
                                                    boxShadow: isActive ? `0 0 10px ${config.color}20` : 'none'
                                                }}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-[400px]">
                                {/* Notes */}
                                <div className="bg-[#111] border border-[#333] p-6 shadow-lg flex flex-col">
                                    <h3 className="text-amber-500 font-bold mb-4 text-xs tracking-widest border-b border-amber-900/30 pb-2 flex items-center gap-2">
                                        <FileText className="w-3 h-3" /> CHRONICLES
                                    </h3>
                                    <textarea
                                        className="flex-1 w-full bg-[#080808] border border-[#222] p-4 text-[#bfbfbf] font-serif text-sm leading-7 resize-none focus:border-[#a32222]/50 outline-none custom-scrollbar"
                                        value={activePlayer.notes}
                                        onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                        placeholder="Record observations, pacts, and inventory..."
                                    />
                                </div>

                                {/* Files */}
                                <div className="bg-[#111] border border-[#333] p-6 shadow-lg flex flex-col">
                                    <div className="flex justify-between items-center mb-4 border-b border-blue-900/30 pb-2">
                                        <h3 className="text-blue-500 font-bold text-xs tracking-widest flex items-center gap-2">
                                            <Upload className="w-3 h-3" /> ARCHIVES
                                        </h3>
                                        <label className="cursor-pointer text-blue-400 hover:text-blue-200 transition-colors text-[10px] uppercase font-mono border border-blue-900/50 px-2 py-1 bg-blue-900/10 hover:bg-blue-900/30">
                                            + Attach File
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                        </label>
                                    </div>

                                    <div className="flex-1 bg-[#080808] border border-[#222] relative overflow-hidden p-2 space-y-2 overflow-y-auto custom-scrollbar">
                                        {activePlayer.files.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-[#333] font-mono text-xs uppercase">
                                                <span>No Documents Found</span>
                                            </div>
                                        ) : (
                                            activePlayer.files.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between text-[11px] font-mono text-[#888] p-3 border border-[#222] hover:bg-[#151515] transition-colors group">
                                                    <button
                                                        className="flex-1 text-left flex items-center gap-3 truncate"
                                                        onClick={() => file.url && setPreviewFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                    >
                                                        <FileText className="w-4 h-4 text-[#555] group-hover:text-blue-500 transition-colors" />
                                                        <span className="truncate group-hover:text-[#ccc] transition-colors">{file.name}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFile(activePlayer.id, i)}
                                                        className="text-[#444] hover:text-red-500 px-2 transition-colors"
                                                        title="Delete Attachment"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#333] select-none">
                            <Ghost className="w-24 h-24 mb-6 opacity-20" />
                            <h2 className="text-2xl font-header tracking-[0.2em] uppercase mb-4 opacity-40">Select a Soul</h2>
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
                    <div className="flex-1 p-8 overflow-hidden flex items-center justify-center">
                        {previewFile.type.startsWith('image/') ? (
                            <img src={previewFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl border border-[#333]" />
                        ) : previewFile.type === 'application/pdf' ? (
                            <iframe src={previewFile.url} className="w-full h-full border border-[#333] shadow-2xl bg-white" />
                        ) : (
                            <div className="text-[#444] font-mono border border-red-900/30 p-4 rounded bg-red-900/10 text-red-500">
                                PREVIEW UNAVAILABLE FOR THIS FILE TYPE
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

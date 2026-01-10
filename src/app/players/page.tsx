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
                {/* Sidebar - Grimoire Style */}
                <div className="grimoire-sidebar w-[300px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#333]">
                    <div className="grimoire-header p-4 border-b border-[#333] bg-[#0c0c0c]">
                        <h3 className="grimoire-title text-base text-[#a32222] font-header tracking-[0.2em] mb-4 text-center border-b border-[#a32222]/30 pb-2">SOUL REGISTER</h3>
                        <button
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            className="text-xs bg-transparent border border-[#444] text-[#888] px-4 py-2 w-full hover:border-[#a32222] hover:text-[#a32222] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-3 h-3" /> New Soul
                        </button>

                        {isAddMenuOpen && (
                            <div className="mt-2 p-3 bg-[#050505] border border-[#a32222]/50 animate-slide-up">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                    placeholder="Soul Name..."
                                    className="w-full bg-[#111] border border-[#333] p-2 text-xs text-[#e0e0e0] mb-2 focus:border-[#a32222] outline-none font-mono"
                                    autoFocus
                                />
                                <button onClick={addPlayer} className="w-full bg-[#a32222] hover:bg-[#c42828] text-white text-[10px] uppercase py-2 tracking-widest font-bold transition-colors">
                                    Confirm Inscription
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-[#080808]">
                        <div className="p-2 space-y-1">
                            {players.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPlayerId(p.id)}
                                    className={`
                                        cursor-pointer p-3 border border-transparent transition-all duration-200 flex items-center justify-between group
                                        ${selectedPlayerId === p.id
                                            ? 'bg-[#1a0505] border-[#a32222]/50 shadow-[inset_0_0_10px_rgba(163,34,34,0.1)]'
                                            : 'hover:bg-[#111] hover:border-[#333]'}
                                    `}
                                >
                                    <div className="flex flex-col">
                                        <span className={`font-header tracking-wider text-sm ${p.status.includes('Dead') ? 'line-through text-red-900' : (selectedPlayerId === p.id ? 'text-[#e0e0e0]' : 'text-[#888]')}`}>
                                            {p.name}
                                        </span>
                                        <span className="text-[9px] font-mono text-[#555] uppercase tracking-widest">{p.class}</span>
                                    </div>
                                    {p.status.length > 1 && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-red-900/20 text-red-500 border border-red-900/30">
                                            {p.status.find(s => s !== "Normal")?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main View - Improved Layout */}
                <div className="flex-1 flex flex-col bg-[#050505] border-l border-[#220000]/20 relative overflow-hidden">
                    {/* Background Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/noise.png')] opacity-5"></div>

                    {activePlayer ? (
                        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                            {/* Header Section - Better Spacing */}
                            <div className="border-b border-[#a32222]/30 pb-8 flex justify-between items-end">
                                <div className="space-y-2">
                                    <h1 className="text-6xl font-header text-[#e0e0e0] tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                                        {activePlayer.name}
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[#444] font-mono text-xs uppercase tracking-widest">Class / Level:</span>
                                        <input
                                            className="bg-transparent border-b border-[#333] text-[#a32222] font-mono text-sm uppercase tracking-[0.2em] w-64 focus:border-[#a32222] outline-none pb-1 transition-colors"
                                            value={activePlayer.class}
                                            onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                            placeholder="CLASS UNKNOWN"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm("Remove this soul permanently?")) {
                                            setPlayers(players.filter(p => p.id !== activePlayer.id));
                                            setSelectedPlayerId(null);
                                        }
                                    }}
                                    className="text-[#444] hover:text-[#a32222] border border-transparent hover:border-[#a32222] p-2 transition-all rounded-sm opacity-50 hover:opacity-100"
                                    title="Exile Soul"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status Section - Grid Layout */}
                            <div className="space-y-4">
                                <h3 className="text-[#666] font-mono text-[10px] tracking-[0.3em] uppercase border-l-2 border-[#333] pl-3">
                                    Vital Condition
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                        const config = STATUS_CONFIG[status];
                                        const isActive = activePlayer.status.includes(status);
                                        const Icon = config.icon;
                                        if (status === "Normal") return null;

                                        return (
                                            <button
                                                key={status}
                                                onClick={() => toggleStatus(activePlayer.id, status)}
                                                className={`
                                                    py-3 px-2 border flex flex-col items-center gap-2 transition-all duration-300 uppercase tracking-widest text-[9px] font-mono group
                                                    ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'}
                                                `}
                                                style={{
                                                    borderColor: isActive ? config.border : '#222',
                                                    backgroundColor: isActive ? `${config.bg}` : '#0a0a0a',
                                                    color: isActive ? config.color : '#555',
                                                    boxShadow: isActive ? `0 4px 15px ${config.color}10` : 'none'
                                                }}
                                            >
                                                <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : 'text-[#333] group-hover:text-[#666]'}`} />
                                                <span className="mt-1">{status}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 flex-1 min-h-[500px]">
                                {/* Notes */}
                                <div className="flex flex-col space-y-4">
                                    <h3 className="text-[#666] font-mono text-[10px] tracking-[0.3em] uppercase border-l-2 border-[#a32222] pl-3">
                                        Chronicles & Inventory
                                    </h3>
                                    <div className="flex-1 bg-[#0a0a0a] border border-[#222] p-1 shadow-inner group focus-within:border-[#a32222]/50 transition-colors">
                                        <textarea
                                            className="w-full h-full bg-[#080808] border border-transparent p-6 text-[#bfbfbf] font-serif text-base leading-8 resize-none outline-none custom-scrollbar selection:bg-[#a32222]/30"
                                            value={activePlayer.notes}
                                            onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                            placeholder="Record observations, pacts, and inventory..."
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>

                                {/* Files */}
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#666] font-mono text-[10px] tracking-[0.3em] uppercase border-l-2 border-blue-900/50 pl-3">
                                            Arcane Archives
                                        </h3>
                                        <label className="cursor-pointer text-blue-400 hover:text-white transition-all text-[10px] uppercase font-mono border border-blue-900/30 px-3 py-1 bg-blue-900/5 hover:bg-blue-900/20 hover:border-blue-500">
                                            + Inscribe Document
                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                        </label>
                                    </div>

                                    <div className="flex-1 bg-[#0a0a0a] border border-[#222] relative overflow-hidden p-4 space-y-3 overflow-y-auto custom-scrollbar">
                                        {activePlayer.files.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-[#333] font-mono text-xs uppercase border-2 border-dashed border-[#1a1a1a] rounded-lg">
                                                <Upload className="w-8 h-8 mb-2 opacity-20" />
                                                <span>No Archives Found</span>
                                            </div>
                                        ) : (
                                            activePlayer.files.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between text-[11px] font-mono text-[#888] p-4 border border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#151515] hover:border-[#333] transition-all group shadow-sm">
                                                    <button
                                                        className="flex-1 text-left flex items-center gap-4 truncate"
                                                        onClick={() => file.url && setPreviewFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                    >
                                                        <div className="p-2 bg-[#050505] border border-[#222] rounded text-[#444] group-hover:text-[#e0e0e0] group-hover:border-[#666] transition-colors">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col truncate">
                                                            <span className="truncate text-[#ccc] font-bold tracking-wide group-hover:text-white transition-colors">{file.name}</span>
                                                            <span className="text-[9px] text-[#555]">{file.date}</span>
                                                        </div>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFile(activePlayer.id, i)}
                                                        className="text-[#333] hover:text-red-500 hover:bg-red-900/10 p-2 rounded transition-all opacity-0 group-hover:opacity-100"
                                                        title="Burn Document"
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
                        <div className="flex-1 flex flex-col items-center justify-center text-[#333] select-none pointer-events-none">
                            <Ghost className="w-32 h-32 mb-8 opacity-10 animate-pulse" />
                            <h2 className="text-3xl font-header tracking-[0.3em] uppercase mb-4 opacity-30 text-[#e0e0e0]">Awaiting Soul Selection</h2>
                            <p className="font-mono text-xs uppercase tracking-widest opacity-20">Access the register to proceed</p>
                        </div>
                    )}
                </div>
            </div>

            {/* FULL SCREEN PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-xl flex flex-col animate-fade-in">
                    <div className="h-16 border-b border-[#222] flex justify-between items-center px-8 bg-[#0a0a0c]">
                        <span className="text-[#888] font-mono text-sm uppercase tracking-[0.2em]">{previewFile.name}</span>
                        <button onClick={() => setPreviewFile(null)} className="text-[#666] hover:text-[#e0e0e0] p-3 border border-transparent hover:border-[#333] rounded transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 p-12 overflow-hidden flex items-center justify-center bg-[#050505]">
                        {previewFile.type.startsWith('image/') ? (
                            <img src={previewFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl border border-[#333]" />
                        ) : previewFile.type === 'application/pdf' ? (
                            <iframe src={previewFile.url} className="w-full h-full border border-[#333] shadow-2xl bg-white" />
                        ) : (
                            <div className="text-[#444] font-mono border border-red-900/30 p-8 rounded bg-red-900/5 text-red-500 flex flex-col items-center gap-4">
                                <Biohazard className="w-12 h-12 opacity-50" />
                                <span className="tracking-widest">PREVIEW CORRUPTED / UNAVAILABLE</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, User, UserPlus, File, Eye, Maximize2, Minimize2, Heart } from "lucide-react";

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
    const [selectedFile, setSelectedFile] = useState<{ url: string, type: string, name: string } | null>(null);
    const [fileFullScreen, setFileFullScreen] = useState(false);

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

            // Handle Normal toggle
            if (status === "Normal") {
                return { ...p, status: ["Normal"] };
            }

            // Remove Normal if adding something else
            let newStatuses = p.status.filter(s => s !== "Normal");

            if (newStatuses.includes(status)) {
                newStatuses = newStatuses.filter(s => s !== status);
            } else {
                newStatuses.push(status);
            }

            // Default back to Normal if empty
            if (newStatuses.length === 0) newStatuses = ["Normal"] as PlayerStatus[];

            return { ...p, status: newStatuses };
        }));
    };

    const updateNotes = (playerId: string, notes: string) => {
        setPlayers(players.map(p => (p.id === playerId ? { ...p, notes } : p)));
    };

    const handleFileUpload = (playerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);
        const fileObj = { name: file.name, date: new Date().toLocaleDateString(), url: fileUrl, type: file.type };
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            return {
                ...p,
                files: [...p.files, fileObj]
            };
        }));
        setSelectedFile({ url: fileUrl, type: file.type, name: file.name });
    };

    const deleteFile = (playerId: string, fileIdx: number) => {
        if (!confirm("Delete this arcane record?")) return;
        setPlayers(players.map(p => {
            if (p.id !== playerId) return p;
            const newFiles = [...p.files];
            newFiles.splice(fileIdx, 1);
            return { ...p, files: newFiles };
        }));
        setSelectedFile(null);
    };

    return (
        <div className="retro-container h-screen flex flex-col overflow-hidden bg-[#050505]">
            <CommandBar />

            <div className="flex flex-1 overflow-hidden relative">
                {/* 1. Sidebar - Soul Register */}
                <div className={`grimoire-sidebar w-[320px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#222] bg-[#0c0c0c] transition-all duration-300 ${fileFullScreen ? '-ml-[320px]' : ''}`}>
                    <div className="grimoire-header p-6 border-b border-[#222]">
                        <h3 className="grimoire-title text-base text-[#a32222] font-header tracking-[0.25em] mb-6 text-center border-b border-[#a32222]/20 pb-2">
                            SOUL REGISTER
                        </h3>

                        {/* Add Player Button */}
                        {!isAddMenuOpen ? (
                            <button
                                onClick={() => setIsAddMenuOpen(true)}
                                className="w-full text-[10px] uppercase tracking-[0.2em] px-4 py-3 border border-[#333] hover:border-[#a32222] text-[#666] hover:text-[#e0e0e0] flex items-center justify-center gap-2 transition-all group active:scale-95"
                            >
                                <Plus className="w-3 h-3 group-hover:text-[#a32222]" /> Register New Soul
                            </button>
                        ) : (
                            <div className="p-3 bg-[#000] border border-[#a32222]/50 animate-slide-up">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                    placeholder="Soul Name..."
                                    className="w-full bg-[#111] border border-[#333] p-2 text-xs text-[#e0e0e0] mb-2 focus:border-[#a32222] outline-none font-mono"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button onClick={addPlayer} className="flex-1 bg-[#a32222] hover:bg-[#c42828] text-white text-[10px] uppercase py-1 tracking-widest font-bold transition-colors">Confirm</button>
                                    <button onClick={() => setIsAddMenuOpen(false)} className="px-3 bg-[#222] hover:bg-[#333] text-[#888] text-[10px]">X</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-[#080808] p-4 space-y-3">
                        {players.map(p => (
                            <button
                                key={p.id}
                                onClick={() => { setSelectedPlayerId(p.id); setSelectedFile(null); setFileFullScreen(false); }}
                                className={`
                                    w-full relative group overflow-hidden border border-[#333] transition-all duration-300 p-3 h-14 flex items-center justify-between
                                    shadow-sm hover:shadow-md active:scale-[0.98]
                                    ${selectedPlayerId === p.id
                                        ? 'bg-[#1a0505] border-[#a32222] shadow-[0_0_15px_rgba(163,34,34,0.3)]'
                                        : 'bg-[#151515] hover:border-[#666] hover:bg-[#222]'}
                                `}
                            >
                                <div className="flex flex-col items-start z-10 pl-2">
                                    <span className={`font-header tracking-wider text-sm ${p.status.includes('Dead') ? 'line-through text-red-900' : (selectedPlayerId === p.id ? 'text-[#ffcccc] text-shadow-glow' : 'text-[#888] group-hover:text-[#ccc]')}`}>
                                        {p.name}
                                    </span>
                                    <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest">{p.class}</span>
                                </div>
                                <div className={`p-2 rounded-full border border-transparent ${selectedPlayerId === p.id ? 'bg-[#a32222]/20' : 'bg-transparent'}`}>
                                    <Heart className={`w-4 h-4 transition-all ${selectedPlayerId === p.id ? 'fill-[#a32222] text-[#a32222] animate-heartbeat' : 'text-[#333] group-hover:text-[#555]'}`} />
                                </div>

                                {selectedPlayerId === p.id && <div className="absolute inset-0 bg-gradient-to-r from-[#a32222]/10 to-transparent pointer-events-none"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Main Content Area */}
                <div className={`flex-1 flex flex-col bg-[#050505] relative overflow-hidden transition-all duration-300 ${fileFullScreen ? '' : 'items-center justify-center'}`}>
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {activePlayer ? (
                        <div className={`flex h-full w-full max-w-[1800px] ${fileFullScreen ? 'p-0' : 'p-8 gap-8 pl-20'}`}> {/* Forced pl-20 for separation */}

                            {/* Left: Character Sheet (25% Width - Smaller as requested) */}
                            {!fileFullScreen && (
                                <div className="w-[28%] min-w-[380px] shrink-0 flex flex-col animate-fade-in shadow-2xl self-center" style={{ height: "92%" }}>
                                    {/* Top Border Decoration */}
                                    <div className="h-2 bg-[#1a1a1a] border-x border-t border-[#333] mx-1"></div>

                                    <div className="flex-1 bg-[#101010] border border-[#333] p-1 flex flex-col relative">

                                        <div className="flex-1 flex flex-col bg-[#0c0c0c] border border-[#1a1a1a] p-6 relative overflow-hidden">
                                            {/* Header */}
                                            <div className="border-b-2 border-[#a32222]/30 pb-4 mb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <input
                                                        className="bg-transparent border-none text-3xl font-header text-[#e0e0e0] tracking-[0.05em] focus:text-[#ff4444] outline-none w-full"
                                                        value={activePlayer.name}
                                                        onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, name: e.target.value } : p))}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Remove this soul permanently?")) {
                                                                setPlayers(players.filter(p => p.id !== activePlayer.id));
                                                                setSelectedPlayerId(null);
                                                            }
                                                        }}
                                                        className="text-[#333] hover:text-[#a32222] transition-colors"
                                                        title="Delete Sheet"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[#555] font-mono text-[10px] uppercase">Class & Level:</span>
                                                    <input
                                                        className="bg-transparent border-b border-[#333] text-[#a32222] font-mono text-xs uppercase tracking-[0.2em] flex-1 focus:border-[#a32222] outline-none"
                                                        value={activePlayer.class}
                                                        onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                                        placeholder="UNKNOWN"
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Grid - 3 Column for better fit */}
                                            <div className="mb-4 bg-[#080808] border border-[#1a1a1a] p-3">
                                                <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.3em] mb-3 text-center border-b border-[#222] pb-1">
                                                    Current Conditions
                                                </h4>
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2"> {/* Responsive Columns */}
                                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                                        const config = STATUS_CONFIG[status];
                                                        const isActive = activePlayer.status.includes(status);

                                                        return (
                                                            <button
                                                                key={status}
                                                                onClick={() => toggleStatus(activePlayer.id, status)}
                                                                className={`
                                                                    flex items-center gap-2 p-1 transition-all group
                                                                    ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100'}
                                                                `}
                                                            >
                                                                <div className={`
                                                                    w-3 h-3 border border-[#444] flex items-center justify-center transition-colors shrink-0
                                                                    ${isActive ? 'bg-[#a32222] border-[#ff4444]' : 'bg-transparent'}
                                                                `}>
                                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                                </div>
                                                                <span className={`text-[9px] font-mono uppercase tracking-wider truncate ${isActive ? 'text-[#e0e0e0]' : 'text-[#666]'}`}>
                                                                    {status}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Notes Area */}
                                            <div className="flex-1 flex flex-col mb-4">
                                                <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.3em] mb-2 pl-1">
                                                    Character Notes
                                                </h4>
                                                <textarea
                                                    className="flex-1 w-full bg-[#080808] border border-[#222] p-4 text-[#bfbfbf] font-serif text-sm leading-6 resize-none outline-none focus:border-[#444] transition-colors custom-scrollbar shadow-inner"
                                                    value={activePlayer.notes}
                                                    onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                                    placeholder="Enter character notes..."
                                                />
                                            </div>

                                            {/* Files List */}
                                            <div className="h-[25%] shrink-0 flex flex-col">
                                                <div className="flex justify-between items-center mb-2 px-1">
                                                    <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.3em]">
                                                        Attached Archives
                                                    </h4>
                                                    <label className="cursor-pointer text-[#666] hover:text-[#a32222] transition-colors text-[9px] uppercase">
                                                        [+ UPLOAD]
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                                    </label>
                                                </div>
                                                <div className="flex-1 bg-[#080808] border border-[#222] p-1 overflow-y-auto custom-scrollbar">
                                                    {activePlayer.files.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => file.url && setSelectedFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                            className={`
                                                                flex items-center justify-between p-2 cursor-pointer border-b border-[#1a1a1a] last:border-0 hover:bg-[#111] group
                                                                ${selectedFile?.url === file.url ? 'bg-[#151515] text-[#e0e0e0]' : 'text-[#666]'}
                                                            `}
                                                        >
                                                            <span className="truncate text-[10px] font-mono w-full">{file.name}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteFile(activePlayer.id, i); }}
                                                                className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-500 ml-2"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* Bottom Border Decoration */}
                                    <div className="h-2 bg-[#1a1a1a] border-x border-b border-[#333] mx-1"></div>
                                </div>
                            )}

                            {/* Right: Document Viewer (70-75% Width) */}
                            <div className={`flex flex-col bg-[#030303] border border-[#222] relative transition-all duration-300 ${fileFullScreen ? 'h-full w-full border-none z-50' : 'flex-1 h-[92%] self-center shadow-2xl'}`}>
                                {selectedFile ? (
                                    <div className="h-full flex flex-col">
                                        <div className="h-10 shrink-0 border-b border-[#222] flex items-center justify-between px-4 bg-[#080808]">
                                            <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest truncate max-w-[300px]">{selectedFile.name}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setFileFullScreen(!fileFullScreen)}
                                                    className="text-[#555] hover:text-[#e0e0e0] p-1.5 hover:bg-[#222] rounded transition-colors"
                                                    title={fileFullScreen ? "Exit Full Screen" : "Maximize View"}
                                                >
                                                    {fileFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => setSelectedFile(null)} className="text-[#555] hover:text-[#e0e0e0] p-1.5 hover:bg-[#222] rounded transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 relative bg-[#050505] flex items-center justify-center overflow-auto p-4 custom-scrollbar">
                                            {selectedFile.type.startsWith('image/') ? (
                                                <img
                                                    src={selectedFile.url}
                                                    alt="Preview"
                                                    className={`shadow-2xl border border-[#222] transition-all duration-300 ${fileFullScreen ? 'h-auto max-w-[90%]' : 'max-h-full max-w-full object-contain'}`}
                                                />
                                            ) : selectedFile.type === 'application/pdf' ? (
                                                <iframe src={selectedFile.url} className="w-full h-full border border-[#222] shadow-2xl bg-white" />
                                            ) : (
                                                <div className="text-[#444] font-mono text-xs uppercase tracking-widest border border-[#222] p-12 text-center opacity-50">
                                                    Format Not Supported
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[#222] select-none">
                                        <FileText className="w-16 h-16 mb-4 opacity-10" />
                                        <div className="text-center">
                                            <h3 className="text-[#444] font-header text-xl tracking-widest mb-1">ARCHIVE VIEWER</h3>
                                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-30 px-8">
                                                Select a document to inspect
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#333] select-none pointer-events-none pl-20"> {/* Fixed separation */}
                            <Ghost className="w-24 h-24 mb-6 opacity-10 animate-float" />
                            <h2 className="text-2xl font-header tracking-[0.3em] uppercase mb-2 opacity-30 text-[#e0e0e0]">Awaiting Soul Selection</h2>
                            <p className="font-mono text-[10px] uppercase tracking-widest opacity-20">Access the register to proceed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

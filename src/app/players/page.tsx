"use client";

import { useState } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, User, UserPlus, File, Eye } from "lucide-react";

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
    // Preview now tracks the file object directly for the embed view
    const [selectedFile, setSelectedFile] = useState<{ url: string, type: string, name: string } | null>(null);

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

        // Auto-select the new file for preview
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

            <div className="flex flex-1 overflow-hidden">
                {/* 1. Sidebar - Grimoire Style */}
                <div className="grimoire-sidebar w-[320px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#222] bg-[#0c0c0c]">
                    <div className="grimoire-header p-6 border-b border-[#222]">
                        <h3 className="grimoire-title text-base text-[#a32222] font-header tracking-[0.25em] mb-4 text-center border-b border-[#a32222]/20 pb-2">
                            SOUL REGISTER
                        </h3>
                        <button
                            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                            className="text-[10px] bg-transparent border border-[#333] text-[#888] px-4 py-3 w-full hover:border-[#a32222] hover:text-[#e0e0e0] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-3 h-3" /> Register New Soul
                        </button>

                        {isAddMenuOpen && (
                            <div className="mt-2 p-3 bg-[#000] border border-[#a32222]/50 animate-slide-up">
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
                                    Confirm
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-[#080808]">
                        <div className="p-3 space-y-2">
                            {players.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => { setSelectedPlayerId(p.id); setSelectedFile(null); }}
                                    className={`
                                        cursor-pointer p-4 border transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                                        ${selectedPlayerId === p.id
                                            ? 'bg-gradient-to-r from-[#1a0505] to-[#0a0a0a] border-[#a32222]/60'
                                            : 'bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333] hover:bg-[#111]'}
                                    `}
                                >
                                    <div className="flex flex-col relative z-10">
                                        <span className={`font-header tracking-wider text-sm transition-colors ${p.status.includes('Dead') ? 'line-through text-red-900' : (selectedPlayerId === p.id ? 'text-[#ffcccc] text-shadow-glow' : 'text-[#888]')}`}>
                                            {p.name}
                                        </span>
                                        <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest mt-1">{p.class}</span>
                                    </div>
                                    {selectedPlayerId === p.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#a32222] shadow-[0_0_10px_#a32222]"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Main Content - Spacious & Organized */}
                <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
                    {/* Background Texture Overlay */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {activePlayer ? (
                        <div className="flex-1 flex flex-col h-full pl-8"> {/* Left Padding to separate from sidebar */}

                            {/* Header & Status Section (Fixed Top) */}
                            <div className="shrink-0 p-8 pb-4 border-b border-[#222] bg-[#050505]/95 backdrop-blur z-10 flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-5xl font-header text-[#e0e0e0] tracking-[0.05em] drop-shadow-md mb-2">
                                            {activePlayer.name}
                                        </h1>
                                        <input
                                            className="bg-transparent border-none text-[#a32222] font-mono text-sm uppercase tracking-[0.2em] w-96 focus:text-[#ff4444] outline-none p-0 transition-colors"
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
                                        className="text-[#333] hover:text-[#a32222] p-2 transition-colors transform hover:scale-110"
                                        title="Exile Soul"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Status Bar - Horizontal Clean Layout */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em]">Condition:</span>
                                    <div className="flex items-center gap-2">
                                        {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                            const config = STATUS_CONFIG[status];
                                            const isActive = activePlayer.status.includes(status);
                                            // Only show 'Normal' if it's the only one, or hide it if we want 'Normal' to be implicit when others are active
                                            if (status === "Normal") return null;

                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => toggleStatus(activePlayer.id, status)}
                                                    className={`
                                                        px-3 py-1 rounded-sm border flex items-center gap-2 transition-all duration-200 uppercase tracking-widest text-[9px] font-mono
                                                        ${isActive
                                                            ? 'border-opacity-100 bg-opacity-20'
                                                            : 'border-transparent bg-transparent opacity-40 hover:opacity-100 hover:border-[#333]'}
                                                    `}
                                                    style={{
                                                        borderColor: isActive ? config.border : undefined,
                                                        backgroundColor: isActive ? config.bg : undefined,
                                                        color: isActive ? config.color : '#666',
                                                    }}
                                                >
                                                    <config.icon className="w-3 h-3" />
                                                    {status}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Main Split Layout: Info vs Document */}
                            <div className="flex-1 flex overflow-hidden">

                                {/* Left Column: Chronicles & Inventory (40%) */}
                                <div className="w-[450px] flex flex-col border-r border-[#222] bg-[#080808]">
                                    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                                        {/* Notes Section */}
                                        <div className="flex flex-col gap-2 shrink-0 h-[40%]">
                                            <h3 className="text-[#666] font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                                <FileText className="w-3 h-3" /> Chronicles
                                            </h3>
                                            <textarea
                                                className="w-full h-full bg-[#0c0c0c] border border-[#222] p-4 text-[#bfbfbf] font-serif text-sm leading-6 resize-none outline-none focus:border-[#444] transition-colors custom-scrollbar"
                                                value={activePlayer.notes}
                                                onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                                placeholder="Notes..."
                                            />
                                        </div>

                                        {/* Files List Section */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[#666] font-mono text-[10px] tracking-[0.3em] uppercase flex items-center gap-2">
                                                    <Upload className="w-3 h-3" /> Archives
                                                </h3>
                                                <label className="cursor-pointer text-[#a32222] hover:text-white transition-colors text-[9px] uppercase font-mono px-2 py-1 border border-[#a32222]/30 hover:bg-[#a32222]">
                                                    + Upload
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                                </label>
                                            </div>

                                            <div className="flex-1 bg-[#0c0c0c] border border-[#222] p-2 space-y-1 overflow-y-auto custom-scrollbar">
                                                {activePlayer.files.length === 0 ? (
                                                    <div className="h-full flex flex-col items-center justify-center text-[#333] text-[10px] font-mono uppercase">
                                                        <span>No Records</span>
                                                    </div>
                                                ) : (
                                                    activePlayer.files.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => file.url && setSelectedFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                            className={`
                                                                flex items-center justify-between p-2 cursor-pointer border transition-all text-[10px] font-mono group
                                                                ${selectedFile?.url === file.url
                                                                    ? 'bg-[#1a1a1a] border-[#444] text-[#e0e0e0]'
                                                                    : 'bg-transparent border-transparent hover:bg-[#111] text-[#888]'}
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <File className="w-3 h-3" />
                                                                <span className="truncate">{file.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteFile(activePlayer.id, i); }}
                                                                className="text-[#333] hover:text-[#a32222] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Document Viewer (60% - Full Height) */}
                                <div className="flex-1 bg-[#050505] flex flex-col relative overflow-hidden">
                                    {selectedFile ? (
                                        <div className="h-full flex flex-col">
                                            <div className="h-8 shrink-0 border-b border-[#222] flex items-center justify-between px-4 bg-[#0a0a0c]">
                                                <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest">{selectedFile.name}</span>
                                                <button onClick={() => setSelectedFile(null)} className="text-[#444] hover:text-[#e0e0e0]">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex-1 relative bg-[#080808] flex items-center justify-center overflow-auto p-4 custom-scrollbar">
                                                {selectedFile.type.startsWith('image/') ? (
                                                    <img src={selectedFile.url} alt="Preview" className="max-w-full h-auto shadow-2xl border border-[#333]" />
                                                ) : selectedFile.type === 'application/pdf' ? (
                                                    <iframe src={selectedFile.url} className="w-full h-full border border-[#333] shadow-2xl bg-white" />
                                                ) : (
                                                    <div className="text-[#555] font-mono text-xs uppercase tracking-widest border border-[#222] p-8">
                                                        Preview Unavailable
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-[#222] select-none">
                                            <Eye className="w-16 h-16 mb-4 opacity-20" />
                                            <span className="font-mono text-xs uppercase tracking-widest opacity-30">Select a document to inspect</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#333] select-none pointer-events-none">
                            <Ghost className="w-32 h-32 mb-8 opacity-10 animate-pulse" />
                            <h2 className="text-3xl font-header tracking-[0.3em] uppercase mb-4 opacity-30 text-[#e0e0e0]">Awaiting Soul Selection</h2>
                            <p className="font-mono text-xs uppercase tracking-widest opacity-20">Select a registered soul from the left</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

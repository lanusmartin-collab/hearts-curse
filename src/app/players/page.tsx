"use client";

import { useState } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, User, UserPlus, File, Eye, Maximize2, Minimize2 } from "lucide-react";

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
                {/* 1. Sidebar - Grimoire Style (Hidden in Full Screen Mode) */}
                <div className={`grimoire-sidebar w-[320px] flex flex-col shrink-0 overflow-hidden z-20 border-r border-[#222] bg-[#0c0c0c] transition-all duration-300 ${fileFullScreen ? '-ml-[320px]' : ''}`}>
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
                                    onClick={() => { setSelectedPlayerId(p.id); setSelectedFile(null); setFileFullScreen(false); }}
                                    className={`
                                        cursor-pointer p-4 border transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                                        ${selectedPlayerId === p.id
                                            ? 'bg-gradient-to-r from-[#1a0505] to-[#0a0a0a] border-[#a32222]/60 shadow-lg'
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

                {/* 2. Main Content */}
                <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {activePlayer ? (
                        <div className={`flex-1 flex h-full ${fileFullScreen ? 'p-0' : 'p-8 pl-16'} transition-all duration-300 gap-8`}>

                            {/* Left Panel: Character Sheet / Scroll (Hidden when File Full Screen) */}
                            {!fileFullScreen && (
                                <div className="w-[500px] shrink-0 flex flex-col gap-6 animate-fade-in">
                                    {/* Scroll/Sheet aesthetic container */}
                                    <div className="retro-border bg-[#101010] p-1 flex flex-col h-full shadow-2xl relative">
                                        {/* Decorative corners could go here */}

                                        <div className="border border-[#333] p-6 flex-1 flex flex-col bg-[#0c0c0c] relative overflow-hidden">
                                            {/* Header */}
                                            <div className="border-b-2 border-[#a32222]/50 pb-4 mb-6">
                                                <input
                                                    className="w-full bg-transparent border-none text-4xl font-header text-[#e0e0e0] tracking-[0.05em] drop-shadow-md focus:text-[#ff4444] outline-none p-0 mb-1"
                                                    value={activePlayer.name}
                                                    onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, name: e.target.value } : p))}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#555] font-mono text-[10px] uppercase">Class:</span>
                                                    <input
                                                        className="bg-transparent border-b border-[#333] text-[#a32222] font-mono text-xs uppercase tracking-[0.2em] flex-1 focus:border-[#a32222] outline-none"
                                                        value={activePlayer.class}
                                                        onChange={(e) => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                                        placeholder="UNKNOWN"
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Grid */}
                                            <div className="mb-8">
                                                <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                    <Activity className="w-3 h-3" /> Vital Status
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                                        const config = STATUS_CONFIG[status];
                                                        const isActive = activePlayer.status.includes(status);
                                                        if (status === "Normal") return null;
                                                        return (
                                                            <button
                                                                key={status}
                                                                onClick={() => toggleStatus(activePlayer.id, status)}
                                                                className={`
                                                                    px-2 py-1.5 border flex items-center gap-2 uppercase tracking-wider text-[9px] font-mono transition-all
                                                                    ${isActive
                                                                        ? 'bg-[#1a0505] border-[#a32222] text-[#ffcccc]'
                                                                        : 'bg-transparent border-[#222] text-[#555] hover:border-[#444]'}
                                                                `}
                                                            >
                                                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse bg-red-500' : 'bg-[#333]'}`}></div>
                                                                {status}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Chronicles (Notes) */}
                                            <div className="flex-1 flex flex-col mb-6">
                                                <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                    <FileText className="w-3 h-3" /> Chronicles
                                                </h4>
                                                <textarea
                                                    className="flex-1 w-full bg-[#080808] border border-[#222] p-4 text-[#aaa] font-serif text-sm leading-6 resize-none outline-none focus:border-[#555] transition-colors custom-scrollbar shadow-inner"
                                                    value={activePlayer.notes}
                                                    onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                                    placeholder="Inscribe notes here..."
                                                />
                                            </div>

                                            {/* File List */}
                                            <div className="h-[150px] shrink-0 flex flex-col">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-[#444] font-mono text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <Upload className="w-3 h-3" /> Archives
                                                    </h4>
                                                    <label className="cursor-pointer text-[#888] hover:text-white transition-colors text-[9px] uppercase font-mono px-2 py-0.5 border border-[#333] hover:bg-[#222]">
                                                        + Upload
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                                    </label>
                                                </div>
                                                <div className="flex-1 bg-[#080808] border border-[#222] p-1 overflow-y-auto custom-scrollbar shadow-inner">
                                                    {activePlayer.files.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => file.url && setSelectedFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                            className={`
                                                                flex items-center justify-between p-2 cursor-pointer border-b border-[#111] last:border-0 hover:bg-[#111] group
                                                                ${selectedFile?.url === file.url ? 'bg-[#151515] text-[#ccc]' : 'text-[#666]'}
                                                            `}
                                                        >
                                                            <div className="flex items-center gap-2 truncate">
                                                                <File className="w-3 h-3" />
                                                                <span className="truncate text-[10px] font-mono">{file.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteFile(activePlayer.id, i); }}
                                                                className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-[#a32222] transition-all"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => {
                                                if (confirm("Remove this soul permanently?")) {
                                                    setPlayers(players.filter(p => p.id !== activePlayer.id));
                                                    setSelectedPlayerId(null);
                                                }
                                            }}
                                            className="text-[#333] hover:text-[#a32222] transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete Sheet
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Right Panel: Document Viewer (Expands) */}
                            <div className={`flex-1 flex flex-col bg-[#030303] border border-[#222] relative transition-all duration-300 ${fileFullScreen ? 'h-full w-full border-none z-50' : 'h-full'}`}>
                                {selectedFile ? (
                                    <div className="h-full flex flex-col">
                                        {/* Toolbar */}
                                        <div className="h-10 shrink-0 border-b border-[#222] flex items-center justify-between px-4 bg-[#080808]">
                                            <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                                                <Eye className="w-3 h-3" /> Viewing: {selectedFile.name}
                                            </span>
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

                                        {/* Content */}
                                        <div className="flex-1 relative bg-[#050505] flex items-center justify-center overflow-auto p-4 custom-scrollbar">
                                            {selectedFile.type.startsWith('image/') ? (
                                                <img
                                                    src={selectedFile.url}
                                                    alt="Preview"
                                                    className={`shadow-2xl border border-[#222] transition-all duration-300 ${fileFullScreen ? 'max-w-none h-auto min-w-[80%] min-h-[90%]' : 'max-w-full max-h-full object-contain'}`}
                                                />
                                            ) : selectedFile.type === 'application/pdf' ? (
                                                <iframe src={selectedFile.url} className="w-full h-full border border-[#222] shadow-2xl bg-white" />
                                            ) : (
                                                <div className="text-[#444] font-mono text-xs uppercase tracking-widest border border-[#222] p-12 text-center opacity-50">
                                                    <p>Format Not Supported</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[#222] select-none">
                                        <div className="w-16 h-16 border-2 border-[#1a1a1a] rounded-full flex items-center justify-center mb-4 opacity-50">
                                            <FileText className="w-6 h-6 opacity-30" />
                                        </div>
                                        <p className="font-mono text-[10px] uppercase tracking-widest opacity-30 text-center px-8">
                                            Select a document from the archives <br />to display it here
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center h-full text-[#333] select-none pointer-events-none pl-[100px]"> {/* Increased Left Padding for Empty State */}
                            <div className="flex flex-col items-center">
                                <Ghost className="w-24 h-24 mb-6 opacity-10 animate-float" />
                                <h2 className="text-2xl font-header tracking-[0.3em] uppercase mb-2 opacity-30 text-[#e0e0e0]">Awaiting Soul Selection</h2>
                                <p className="font-mono text-[10px] uppercase tracking-widest opacity-20">Access the register to proceed</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

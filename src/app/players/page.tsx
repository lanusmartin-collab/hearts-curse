"use client";

import { useState, useEffect } from "react";
import CommandBar from "@/components/ui/CommandBar";
import { Skull, Ghost, Plus, Upload, Activity, Biohazard, EyeOff, MicOff, BatteryLow, Stars, FileText, X, Trash2, User, UserPlus, File, Eye, Maximize2, Minimize2, Heart } from "lucide-react";

type PlayerStatus = "Normal" | "Dead" | "Cursed" | "Poisoned" | "Blind" | "Deaf" | "Exhausted" | "Stunned";

type PlayerCharacter = {
    id: string;
    name: string;
    race: string;
    class: string;
    alignment: string;
    stats: { str: number; dex: number; con: number; int: number; wis: number; cha: number };
    ac: number;
    hp: number;
    maxHp: number;
    speed: string;
    avatarUrl?: string;
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
    const [players, setPlayers] = useState<PlayerCharacter[]>([]);

    // INITIAL LOAD
    useEffect(() => {
        const saved = localStorage.getItem('heart_curse_players');
        if (saved) {
            try {
                setPlayers(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load players", e);
            }
        } else {
            // Default Data
            setPlayers([{
                id: "1",
                name: "Valeros",
                race: "Human",
                class: "Fighter 5",
                alignment: "Neutral Good",
                stats: { str: 16, dex: 14, con: 15, int: 10, wis: 12, cha: 13 },
                ac: 18,
                hp: 44,
                maxHp: 44,
                speed: "30 ft",
                status: ["Normal"],
                notes: "Possessed by a ghost?",
                files: []
            }]);
        }
    }, []);

    // PERSISTENCE
    useEffect(() => {
        if (players.length > 0) {
            localStorage.setItem('heart_curse_players', JSON.stringify(players));
        }
    }, [players]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [newPlayerName, setNewPlayerName] = useState("");
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<{ url: string, type: string, name: string } | null>(null);
    const [fileFullScreen, setFileFullScreen] = useState(false);

    const activePlayer = players.find(p => p.id === selectedPlayerId);

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const newId = Date.now().toString();
        const newPlayer: PlayerCharacter = {
            id: newId,
            name: newPlayerName,
            race: "Unknown",
            class: "Commoner 1",
            alignment: "Unaligned",
            stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
            ac: 10,
            hp: 10,
            maxHp: 10,
            speed: "30 ft",
            status: ["Normal"],
            notes: "",
            files: []
        };
        setPlayers([...players, newPlayer]);
        setNewPlayerName("");
        setIsAddMenuOpen(false);
        setSelectedPlayerId(newId);
    };

    const toggleStatus = (playerId: string, status: PlayerStatus) => {
        setPlayers(prevPlayers => prevPlayers.map(p => {
            if (p.id !== playerId) return p;

            // Ensure we have a valid array copy
            const rawStatus = p.status;
            let currentStatuses: string[] = Array.isArray(rawStatus) ? [...rawStatus] : ["Normal"];

            // Normalize case if needed (though we expect Title Case)
            // Safety: Filter out nulls/undefineds
            currentStatuses = currentStatuses.filter(Boolean);

            // Handle Normal: Clear others
            if (status === "Normal") {
                return { ...p, status: ["Normal"] };
            }

            // Remove Normal if we are setting a condition
            currentStatuses = currentStatuses.filter(s => s !== "Normal");

            if (currentStatuses.includes(status)) {
                // Untoggle
                currentStatuses = currentStatuses.filter(s => s !== status);
            } else {
                // Toggle On
                currentStatuses.push(status);
            }

            // If empty, revert to Normal
            if (currentStatuses.length === 0) {
                currentStatuses = ["Normal"];
            }

            return { ...p, status: currentStatuses as PlayerStatus[] };
        }));
    };

    const updateNotes = (playerId: string, notes: string) => {
        setPlayers(prev => prev.map(p => (p.id === playerId ? { ...p, notes } : p)));
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
                            SOUL REGISTRY
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
                                    w-full relative group overflow-hidden transition-all duration-300 p-3 mb-2 rounded-[2px] border shadow-[2px_2px_5px_rgba(0,0,0,0.2)] hover:-translate-y-0.5
                                    ${selectedPlayerId === p.id
                                        ? 'bg-[#e8dcc5] border-[#8a1c1c] shadow-[0_4px_12px_rgba(138,28,28,0.2)]'
                                        : 'bg-[var(--parchment-bg)] border-[#8b7e66] hover:border-[#a32222]'}
                                `}
                            >
                                <div className="flex items-center justify-between text-xs w-full relative z-10 border-b border-[#a32222]/20 pb-1 mb-1">
                                    <span className={`uppercase tracking-widest font-header text-sm ${(p.status || []).includes('Dead') ? 'line-through text-gray-500 opacity-50' :
                                            (selectedPlayerId === p.id ? 'text-[#8a1c1c] font-bold' : 'text-[#8a1c1c]')
                                        }`}>
                                        {p.name}
                                    </span>
                                    <span className={`font-mono text-[9px] ${selectedPlayerId === p.id ? 'text-[#a32222]' : 'text-[#4a0404]'}`}>
                                        {p.class.split(' ')[0]}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center w-full mt-1 opacity-80">
                                    <div className="flex items-center gap-2 text-[10px] text-[#4a0404] font-bold">
                                        <Heart size={10} className="text-[#8a1c1c]" fill="#8a1c1c" /> {p.hp}/{p.maxHp}
                                    </div>
                                    <div className="text-[8px] uppercase tracking-wider text-[#8a1c1c]">
                                        {(p.status && p.status.length > 0 && p.status[0] !== 'Normal') ? p.status[0] : 'ACTIVE'}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Main Content Area */}
                <div
                    className={`flex-1 flex flex-col bg-[#050505] relative overflow-hidden transition-all duration-300 ${fileFullScreen ? '' : 'items-center justify-center'}`}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedPlayerId(null);
                    }}
                >
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/noise.png')]"></div>

                    {activePlayer ? (
                        <div className={`flex h-full w-full max-w-[1800px] ${fileFullScreen ? 'p-0' : 'p-8 gap-8 pl-20'}`}> {/* Forced pl-20 for separation */}

                            {/* Left: Character Sheet (20% Width - Compact to give Doc Viewer space) */}
                            {!fileFullScreen && (
                                <div className="w-[320px] shrink-0 flex flex-col animate-fade-in shadow-2xl self-center" style={{ height: "92%" }}>
                                    {/* Top Border Decoration */}
                                    <div className="h-2 bg-[#1a1a1a] border-x border-t border-[#333] mx-1"></div>

                                    <div className="flex-1 border border-[#5d4037] p-1 flex flex-col relative bg-[#f0e6d2]" style={{ backgroundColor: '#f0e6d2' }}>

                                        <div className="flex-1 flex flex-col bg-[#f0e6d2] p-6 relative overflow-hidden text-[#1a1a1a]" style={{ backgroundColor: '#f0e6d2', color: '#1a1a1a' }}>
                                            {/* Header Section with Avatar */}
                                            <div className="flex gap-4 border-b-2 border-[#a32222]/30 pb-4 mb-4">
                                                {activePlayer.avatarUrl && (
                                                    <div className="w-24 h-24 shrink-0 border-2 border-[#5d4037] bg-black shadow-lg overflow-hidden relative group">
                                                        <img src={activePlayer.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, avatarUrl: undefined } : p))}
                                                            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                        >
                                                            <X className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <input
                                                            className="bg-transparent border-none text-3xl font-header text-[#7a1c1c] tracking-[0.05em] focus:text-[#a32222] outline-none w-full font-serif font-bold placeholder-[#7a1c1c]/50"
                                                            value={activePlayer.name}
                                                            onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, name: e.target.value } : p))}
                                                            placeholder="NAME"
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Remove this soul permanently?")) {
                                                                    setPlayers(prev => prev.filter(p => p.id !== activePlayer.id));
                                                                    setSelectedPlayerId(null);
                                                                }
                                                            }}
                                                            className="text-[#5d4037] hover:text-[#a32222] transition-colors pt-2"
                                                            title="Delete Sheet"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 text-xs font-serif italic text-[#444] items-center mb-3">
                                                        <input
                                                            className="bg-transparent border-b border-transparent hover:border-[#a32222]/30 focus:border-[#a32222] outline-none w-20 placeholder-[#888]"
                                                            value={activePlayer.race || ""}
                                                            onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, race: e.target.value } : p))}
                                                            placeholder="Race"
                                                        />
                                                        <span>•</span>
                                                        <input
                                                            className="bg-transparent border-b border-transparent hover:border-[#a32222]/30 focus:border-[#a32222] outline-none w-24 placeholder-[#888]"
                                                            value={activePlayer.class || ""}
                                                            onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, class: e.target.value } : p))}
                                                            placeholder="Class"
                                                        />
                                                        <span>•</span>
                                                        <input
                                                            className="bg-transparent border-b border-transparent hover:border-[#a32222]/30 focus:border-[#a32222] outline-none w-24 placeholder-[#888]"
                                                            value={activePlayer.alignment || ""}
                                                            onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, alignment: e.target.value } : p))}
                                                            placeholder="Alignment"
                                                        />
                                                    </div>

                                                    {/* Quick Stats Row: AC, HP, Speed */}
                                                    <div className="flex items-center justify-between gap-2 border-t border-[#a32222]/10 pt-2">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-header text-[9px] uppercase font-bold text-[#a32222]">AC</span>
                                                            <div className="relative w-10 h-10 flex items-center justify-center bg-[url('/shield-outline.png')] bg-contain bg-center bg-no-repeat">
                                                                <input
                                                                    className="w-8 text-center bg-transparent outline-none font-bold text-lg text-[#1a1a1a]"
                                                                    value={activePlayer.ac || 10}
                                                                    type="number"
                                                                    onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, ac: parseInt(e.target.value) || 10 } : p))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center flex-1 mx-2">
                                                            <span className="font-header text-[9px] uppercase font-bold text-[#a32222]">Hit Points</span>
                                                            <div className="flex items-center gap-1 border border-[#a32222] rounded px-2 py-1 bg-white/50 w-full justify-center">
                                                                <Heart className="w-3 h-3 text-[#a32222] fill-[#a32222]" />
                                                                <input
                                                                    className="w-8 text-right bg-transparent outline-none font-bold text-[#1a1a1a]"
                                                                    value={activePlayer.hp || 0}
                                                                    type="number"
                                                                    onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, hp: parseInt(e.target.value) || 0 } : p))}
                                                                />
                                                                <span className="text-[#666]">/</span>
                                                                <input
                                                                    className="w-8 text-left bg-transparent outline-none font-bold text-[#666]"
                                                                    value={activePlayer.maxHp || 0}
                                                                    type="number"
                                                                    onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, maxHp: parseInt(e.target.value) || 0 } : p))}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-header text-[9px] uppercase font-bold text-[#a32222]">Speed</span>
                                                            <input
                                                                className="w-12 text-center border-b border-[#a32222]/20 outline-none font-bold text-[#1a1a1a] bg-transparent"
                                                                value={activePlayer.speed || "30 ft"}
                                                                onChange={(e) => setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, speed: e.target.value } : p))}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ability Scores Grid */}
                                            <div className="grid grid-cols-6 gap-1 mb-4">
                                                {Object.entries(activePlayer.stats || {}).map(([stat, score]) => {
                                                    const mod = Math.floor((score - 10) / 2);
                                                    return (
                                                        <div key={stat} className="flex flex-col items-center bg-[#e6dac3] border border-[#a32222]/30 p-1 rounded relative group">
                                                            <span className="text-[8px] font-bold uppercase text-[#5d4037]">{stat}</span>
                                                            <span className="text-sm font-bold text-[#1a1a1a]">{mod >= 0 ? '+' : ''}{mod}</span>
                                                            <div className="w-6 h-6 rounded-full border border-[#a32222]/20 bg-white flex items-center justify-center absolute -bottom-2 shadow-sm">
                                                                <input
                                                                    className="w-full h-full text-center bg-transparent outline-none text-[8px] font-bold text-[#666]"
                                                                    value={score}
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value) || 10;
                                                                        setPlayers(prev => prev.map(p => p.id === activePlayer.id ? { ...p, stats: { ...p.stats, [stat]: val } } : p));
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mb-4 bg-[#e6dac3] border border-[#c9bca0] p-3 shadow-inner">
                                                <h4 className="text-[#5d4037] font-header text-sm tracking-[0.1em] mb-3 text-center border-b border-[#c9bca0] pb-1 font-bold">
                                                    Current Conditions
                                                </h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                                    {(Object.keys(STATUS_CONFIG) as PlayerStatus[]).map(status => {
                                                        const config = STATUS_CONFIG[status];
                                                        const isActive = (activePlayer.status || []).includes(status);

                                                        return (
                                                            <button
                                                                key={status}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleStatus(activePlayer.id, status);
                                                                }}
                                                                className={`
                                                                    flex items-center gap-2 p-1 transition-all group border border-transparent hover:border-[#a32222]/20
                                                                    ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
                                                                `}
                                                            >
                                                                <div className={`
                                                                    w-3 h-3 border border-[#444] flex items-center justify-center transition-colors shrink-0
                                                                    ${isActive ? 'bg-[#a32222] border-[#ff4444]' : 'bg-transparent'}
                                                                `}>
                                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                                </div>
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isActive ? 'text-[#a32222]' : 'text-[#5d4037]'}`}>
                                                                    {status}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Notes Area */}
                                            <div className="flex-1 flex flex-col mb-4">
                                                <h4 className="text-[#5d4037] font-header text-sm tracking-[0.1em] mb-2 pl-1 font-bold">
                                                    Character Notes
                                                </h4>
                                                <textarea
                                                    className="flex-1 w-full bg-[#fdfbf7] border border-[#c9bca0] p-4 text-[#1a1a1a] font-serif text-base leading-6 resize-none outline-none focus:border-[#a32222] transition-colors custom-scrollbar shadow-inner"
                                                    value={activePlayer.notes}
                                                    onChange={(e) => updateNotes(activePlayer.id, e.target.value)}
                                                    placeholder="Enter character notes..."
                                                />
                                            </div>

                                            {/* Files List */}
                                            <div className="h-[25%] shrink-0 flex flex-col mt-4 border-t border-[#c9bca0] pt-4">
                                                <div className="flex justify-between items-center mb-2 px-1">
                                                    <h4 className="text-[#5d4037] font-header text-sm tracking-[0.1em] font-bold">
                                                        Attached Archives
                                                    </h4>
                                                    <label className="cursor-pointer text-[#a32222] hover:text-[#7a1c1c] transition-colors text-[10px] uppercase font-bold tracking-widest">
                                                        [+ ATTACH]
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(activePlayer.id, e)} />
                                                    </label>
                                                </div>
                                                <div className="flex-1 bg-[#e6dac3] border border-[#c9bca0] p-1 overflow-y-auto custom-scrollbar shadow-inner">
                                                    {activePlayer.files.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => file.url && setSelectedFile({ url: file.url, type: file.type || 'unknown', name: file.name })}
                                                            className={`
                                                                flex items-center justify-between p-2 cursor-pointer border-b border-[#d1c4a8] last:border-0 hover:bg-[#dcd0b8] group
                                                                ${selectedFile?.url === file.url ? 'bg-[#dcd0b8] text-[#333]' : 'text-[#444]'}
                                                            `}
                                                        >
                                                            <span className="truncate text-[10px] font-mono w-full">{file.name}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteFile(activePlayer.id, i); }}
                                                                className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-500 ml-2"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            {file.type?.startsWith("image/") && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPlayers(players.map(p => p.id === activePlayer.id ? { ...p, avatarUrl: file.url } : p));
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-[#a32222] ml-2 text-[8px] font-bold uppercase tracking-wider border border-[#a32222] rounded px-1"
                                                                    title="Set as Portrait"
                                                                >
                                                                    Use as Portrait
                                                                </button>
                                                            )}
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
                            <div className={`flex flex-col bg-[#030303] border border-[#222] relative transition-all duration-300 ${fileFullScreen ? 'h-full w-full border-none z-50' : 'flex-1 min-w-[600px] h-[92%] self-center shadow-2xl'}`}>
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
                                                    className={`shadow-2xl border border-[#222] transition-all duration-300 ${fileFullScreen ? 'h-auto max-w-[90%]' : 'w-[450px] object-contain bg-black'}`}
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
        </div >
    );
}

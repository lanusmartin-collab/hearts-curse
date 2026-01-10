"use client";

import { useState } from "react";
import Link from "next/link";
import PrintButton from "@/components/ui/PrintButton";

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
        { id: "1", name: "Example Hero", class: "Fighter 5", status: ["Normal"], notes: "Possessed by a ghost?", files: [] }
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
        <div className="retro-container min-h-screen">
            <header className="flex justify-between items-center mb-6 pb-4 border-b border-[#3e2723]">
                <h1 className="retro-title text-3xl m-0">ADVENTURING PARTY</h1>
                <div className="flex gap-2">
                    <PrintButton />
                    <Link href="/" className="retro-btn bg-red-900 text-white text-xs px-3 py-1 no-underline hover:bg-red-700">Back to Menu</Link>
                </div>
            </header>

            {/* Add Player */}
            <div className="no-print mb-8 p-4 bg-[#eecfa1] border border-[#3e2723] rounded flex gap-2 w-full max-w-md mx-auto shadow-md">
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter Character Name..."
                    className="flex-1 p-2 bg-[#fdf5c9] border border-[#d7ccc8] font-serif"
                />
                <button
                    onClick={addPlayer}
                    className="retro-btn bg-green-800 text-white hover:bg-green-700"
                >
                    + RECRUIT
                </button>
            </div>

            {/* Roster */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {players.map(player => (
                    <div key={player.id} className="retro-border bg-[#fdf5c9] p-4 relative group">
                        {/* Header Image / Name */}
                        <div className="flex justify-between items-start mb-4 border-b border-[#d7ccc8] pb-2">
                            <div>
                                <h2 className="text-xl font-bold font-serif text-[#3e2723]">{player.name}</h2>
                                <input
                                    className="text-xs text-gray-600 bg-transparent border-none italic w-full focus:bg-white/50"
                                    defaultValue={player.class}
                                    placeholder="Class & Level"
                                    onChange={(e) => {
                                        setPlayers(players.map(p => (p.id === player.id ? { ...p, class: e.target.value } : p)));
                                    }}
                                />
                            </div>
                            {/* Delete Button (Hidden till hover) */}
                            <button
                                onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Status Toggles */}
                        <div className="mb-4">
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Conditions</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Dead", "Cursed", "Poisoned", "Blind", "Deaf", "Exhausted", "Stunned"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => toggleStatus(player.id, status as PlayerStatus)}
                                        className={`
                                            text-[10px] px-2 py-1 rounded border transition-colors uppercase font-bold
                                            ${player.status.includes(status as PlayerStatus)
                                                ? 'bg-red-800 text-white border-red-900 shadow-inner'
                                                : 'bg-white/50 text-gray-500 border-gray-300 hover:bg-white'}
                                        `}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes Area */}
                        <div className="mb-4">
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">DM Notes</h3>
                            <textarea
                                className="w-full h-24 bg-[#fff8e1] border border-[#d7ccc8] p-2 text-sm font-serif resize-none"
                                value={player.notes}
                                onChange={(e) => updateNotes(player.id, e.target.value)}
                                placeholder="Track HP, specific curses, or looting habits..."
                            />
                        </div>

                        {/* File Attachment Simulation */}
                        <div className="mt-4 pt-4 border-t border-[#d7ccc8] border-dashed">
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 flex justify-between items-center">
                                <span>Character Sheet</span>
                                <label className="cursor-pointer text-blue-800 hover:underline text-[10px]">
                                    + Upload
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(player.id, e)} accept=".pdf,.doc,.docx,.xls,.xlsx" />
                                </label>
                            </h3>

                            {player.files.length === 0 ? (
                                <div className="text-xs text-gray-400 italic text-center p-2">No files attached</div>
                            ) : (
                                <ul className="space-y-1">
                                    {player.files.map((file, i) => (
                                        <li key={i} className="flex justify-between items-center bg-white/60 p-1 px-2 rounded text-xs">
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <span className="text-gray-500 text-[9px]">{file.date}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}

                {players.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center text-gray-500 italic p-10 border-2 border-dashed border-[#d7ccc8]">
                        The party is empty. Recruitment required.
                    </div>
                )}
            </div>
        </div>
    );
}

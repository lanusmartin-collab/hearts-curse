import React, { useState, useEffect } from 'react';
import { SaveManager, GameSaveData } from '@/lib/game/SaveManager';
import { Trash2, Play, Clock, ArrowLeft } from 'lucide-react';

interface SaveLoadMenuProps {
    onLoad: (save: GameSaveData) => void;
    onBack: () => void;
}

export default function SaveLoadMenu({ onLoad, onBack }: SaveLoadMenuProps) {
    const [saves, setSaves] = useState<GameSaveData[]>([]);

    useEffect(() => {
        setSaves(SaveManager.getAllSaves());
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this save? This cannot be undone.")) {
            SaveManager.deleteSave(id);
            setSaves(SaveManager.getAllSaves());
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const formatPlaytime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="w-full max-w-2xl bg-black/80 border border-[#8b7e66] p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8 border-b border-[#333] pb-4">
                <h2 className="text-3xl font-serif text-[#d4c391] tracking-widest uppercase">Select Save File</h2>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#888] hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {saves.length === 0 ? (
                    <div className="text-center py-12 text-[#555] italic">
                        No save files found.
                    </div>
                ) : (
                    saves.map((save) => (
                        <div
                            key={save.id}
                            onClick={() => onLoad(save)}
                            className="group relative border border-[#333] bg-[#111]/50 p-6 cursor-pointer hover:border-[#d4c391] hover:bg-[#1a1a20] transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-[#d4c391] group-hover:text-white transition-colors">
                                        {save.name}
                                    </h3>
                                    <div className="text-sm text-[#888] mt-1 flex items-center gap-4">
                                        <span>Level {save.playerCharacter.level || 1} {save.playerCharacter.class}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatPlaytime(save.playtime)}</span>
                                    </div>
                                    <div className="text-xs text-[#555] mt-2 group-hover:text-[#777]">
                                        {formatDate(save.timestamp)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => handleDelete(save.id, e)}
                                        className="p-2 text-[#555] hover:text-red-500 hover:bg-black/50 rounded transition-colors"
                                        title="Delete Save"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center group-hover:border-[#d4c391] group-hover:bg-[#d4c391] group-hover:text-black transition-all">
                                        <Play className="w-4 h-4 ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2, Crosshair } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

type Quest = {
    id: string;
    text: string;
    completed: boolean;
};

export default function QuestTrackerWidget() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [newItem, setNewItem] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem('heart_curse_quests');
        if (saved) {
            try {
                setQuests(JSON.parse(saved));
            } catch (e) { console.error(e); }
        } else {
            // Default seed
            setQuests([
                { id: "1", text: "Investigate the Silent Wards", completed: false },
                { id: "2", text: "Find the key to the Inner Sanctum", completed: false }
            ]);
        }
    }, []);

    const save = (newQuests: Quest[]) => {
        setQuests(newQuests);
        localStorage.setItem('heart_curse_quests', JSON.stringify(newQuests));
    };

    const addQuest = () => {
        if (!newItem.trim()) return;
        save([...quests, { id: Date.now().toString(), text: newItem, completed: false }]);
        setNewItem("");
    };

    const toggle = (id: string) => {
        save(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
    };

    const remove = (id: string) => {
        save(quests.filter(q => q.id !== id));
    };

    return (
        <DashboardWidget title="Active Objectives" subtitle="Quest Log" icon={Crosshair} href="/editor">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 mb-2">
                    <input
                        className="flex-1 bg-transparent border-b border-[var(--glass-border)] text-sm px-1 py-1 outline-none focus:border-[var(--gold-accent)] placeholder-opacity-30 placeholder-white"
                        placeholder="Add objective..."
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                    />
                    <button onClick={addQuest} className="text-[var(--gold-accent)] hover:text-white">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {quests.map(q => (
                        <div key={q.id} className="flex items-start gap-2 group p-1 hover:bg-white/5 rounded">
                            <button
                                onClick={() => toggle(q.id)}
                                className={`mt-0.5 w-3 h-3 border border-[var(--fg-dim)] rounded-sm flex items-center justify-center ${q.completed ? 'bg-[var(--gold-accent)] border-[var(--gold-accent)]' : ''}`}
                            >
                                {q.completed && <CheckSquare className="w-2 h-2 text-black" />}
                            </button>
                            <span className={`flex-1 text-sm ${q.completed ? 'line-through opacity-40' : 'text-[var(--fg-dim)]'}`}>
                                {q.text}
                            </span>
                            <button onClick={() => remove(q.id)} className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-[var(--scarlet-accent)]">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardWidget>
    );
}

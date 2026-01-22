"use client";

import { useState } from "react";
import { useGameContext } from "@/lib/context/GameContext";
import { Scroll, CheckCircle2, Circle } from "lucide-react";

export default function QuestLog() {
    const { quests } = useGameContext();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

    const displayQuests = activeTab === "active" ? quests.activeQuests : quests.completedQuests;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-20 right-4 z-40 bg-[var(--obsidian-base)] border border-[var(--gold-accent)] p-2 rounded-full hover:scale-110 transition-transform shadow-lg group"
                title="Quest Log"
            >
                <Scroll className="w-6 h-6 text-[var(--gold-accent)] group-hover:text-white" />
                {quests.activeQuests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                        {quests.activeQuests.length}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[var(--obsidian-base)] border-2 border-[var(--gold-accent)] shadow-[0_0_25px_rgba(201,188,160,0.2)] flex flex-col max-h-[80vh]">

                {/* HEADER */}
                <div className="p-4 border-b border-[var(--gold-accent)] flex justify-between items-center bg-[#1a1510]">
                    <div className="flex items-center gap-2">
                        <Scroll className="w-6 h-6 text-[var(--gold-accent)]" />
                        <h2 className="text-xl font-serif text-[var(--gold-accent)] tracking-widest">QUEST JOURNAL</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white uppercase text-xs tracking-widest">[CLOSE]</button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-[#333]">
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`flex-1 p-3 text-sm font-bold uppercase tracking-wider ${activeTab === 'active' ? 'bg-[var(--gold-accent)] text-black' : 'text-gray-400 hover:bg-[#222]'}`}
                    >
                        Active ({quests.activeQuests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        className={`flex-1 p-3 text-sm font-bold uppercase tracking-wider ${activeTab === 'completed' ? 'bg-[var(--gold-accent)] text-black' : 'text-gray-400 hover:bg-[#222]'}`}
                    >
                        Completed ({quests.completedQuests.length})
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0c] custom-scrollbar space-y-6">
                    {displayQuests.length === 0 ? (
                        <div className="text-center text-gray-600 italic py-12">
                            {activeTab === 'active' ? "No active quests. Explore the world to find new adventures." : "No completed quests yet."}
                        </div>
                    ) : (
                        displayQuests.map(quest => (
                            <div key={quest.id} className="border border-[#333] bg-[#111] p-4 relative group hover:border-[#555] transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-[#d4c391]">{quest.title}</h3>
                                    {quest.status === 'completed' && <span className="text-xs text-green-500 font-mono border border-green-900 px-2 py-0.5 rounded">COMPLETE</span>}
                                </div>

                                <p className="text-sm text-gray-400 mb-4 italic">"{quest.description}"</p>

                                {quest.givenBy && (
                                    <div className="text-xs text-[#a32222] mb-4 uppercase tracking-widest">Source: {quest.givenBy}</div>
                                )}

                                <div className="space-y-2 pl-4 border-l border-[#333]">
                                    {quest.steps.map(step => (
                                        <div key={step.id} className="flex items-start gap-3">
                                            {step.isCompleted ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-sm ${step.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                                {step.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {quest.rewards && (
                                    <div className="mt-4 pt-4 border-t border-[#222] flex gap-4 text-xs font-mono text-yellow-600/70">
                                        {quest.rewards.gold && <span>+{quest.rewards.gold} GP</span>}
                                        {quest.rewards.xp && <span>+{quest.rewards.xp} XP</span>}
                                        {quest.rewards.items && <span>Item: {quest.rewards.items[0]}</span>}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}

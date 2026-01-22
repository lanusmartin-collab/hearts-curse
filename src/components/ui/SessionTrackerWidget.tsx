"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Hash } from "lucide-react";
import DashboardWidget from "./DashboardWidget";

interface SessionData {
    sessionNumber: number;
    nextSessionDate: string;
    inGameDate: string;
}

export default function SessionTrackerWidget() {
    const [data, setData] = useState<SessionData>({
        sessionNumber: 1,
        nextSessionDate: "",
        inGameDate: "1492 DR, 15th of Flamerule"
    });

    useEffect(() => {
        const saved = localStorage.getItem('hc_session_data');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load session data", e);
            }
        }
    }, []);

    const updateData = (updates: Partial<SessionData>) => {
        const newData = { ...data, ...updates };
        setData(newData);
        localStorage.setItem('hc_session_data', JSON.stringify(newData));
    };

    return (
        <DashboardWidget title="Chronicle" subtitle="Session Tracker" icon={Calendar} variant="obsidian">
            <div className="flex flex-col gap-4">

                {/* Session Counter */}
                <div className="flex items-center justify-between border-b border-[#333] pb-2">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Hash size={16} />
                        <span className="text-xs font-mono uppercase tracking-widest">Session Count</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateData({ sessionNumber: Math.max(1, data.sessionNumber - 1) })}
                            className="text-gray-500 hover:text-white px-2 font-mono"
                        >
                            -
                        </button>
                        <span className="text-xl font-header text-[var(--gold-accent)]">{data.sessionNumber}</span>
                        <button
                            onClick={() => updateData({ sessionNumber: data.sessionNumber + 1 })}
                            className="text-gray-500 hover:text-white px-2 font-mono"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Next Session Date */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Clock size={16} />
                        <span className="text-xs font-mono uppercase tracking-widest">Next Session</span>
                    </div>
                    <input
                        type="datetime-local"
                        value={data.nextSessionDate}
                        onChange={(e) => updateData({ nextSessionDate: e.target.value })}
                        className="bg-[#111] border border-[#333] text-gray-300 text-sm p-2 rounded focus:border-[var(--scarlet-accent)] outline-none font-mono w-full"
                    />
                </div>

                {/* In-Game Date */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={16} />
                        <span className="text-xs font-mono uppercase tracking-widest">In-Game Date</span>
                    </div>
                    <input
                        type="text"
                        value={data.inGameDate}
                        onChange={(e) => updateData({ inGameDate: e.target.value })}
                        placeholder="e.g. 15th of Flamerule, 1492 DR"
                        className="bg-[#111] border border-[#333] text-[var(--gold-accent)] text-sm p-2 rounded focus:border-[var(--gold-accent)] outline-none font-serif w-full"
                    />
                </div>

            </div>
        </DashboardWidget>
    );
}

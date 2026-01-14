"use client";

import { useState, useEffect } from "react";
import { User, Skull, Ghost, Biohazard, EyeOff, MicOff, BatteryLow, Stars, Heart, Shield } from "lucide-react";
import Link from "next/link";
import DashboardWidget from "./DashboardWidget";

type PlayerStatus = "Normal" | "Dead" | "Cursed" | "Poisoned" | "Blind" | "Deaf" | "Exhausted" | "Stunned";

type PlayerCharacter = {
    id: string;
    name: string;
    class: string;
    ac: number;
    hp: number;
    maxHp: number;
    status: PlayerStatus[];
};

const STATUS_ICONS: Record<PlayerStatus, React.ElementType> = {
    Normal: User,
    Dead: Skull,
    Cursed: Ghost,
    Poisoned: Biohazard,
    Blind: EyeOff,
    Deaf: MicOff,
    Exhausted: BatteryLow,
    Stunned: Stars
};

export default function PartyStatusWidget() {
    const [players, setPlayers] = useState<PlayerCharacter[]>([]);

    useEffect(() => {
        // Poll for updates every 2 seconds to keep in sync if tabs switch
        const load = () => {
            const saved = localStorage.getItem('heart_curse_players');
            if (saved) {
                try {
                    setPlayers(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse players", e);
                }
            }
        };
        load();
        const interval = setInterval(load, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardWidget title="Party Status" subtitle="Vitals & Conditions" icon={User} href="/players">
            {players.length === 0 ? (
                <div className="text-center py-4 text-[var(--fg-dim)] text-xs font-mono">
                    NO SOULS REGISTERED
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {players.map(p => {
                        const isDead = p.status.includes("Dead");
                        const hpPercent = (p.hp / p.maxHp) * 100;
                        const statusColor = isDead ? "var(--scarlet-accent)" : (hpPercent < 30 ? "#e6a23c" : "var(--fg-dim)");

                        return (
                            <div key={p.id} className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2 last:border-0">
                                <div className="flex flex-col min-w-0 flex-1 pr-2">
                                    <div className="flex items-baseline justify-between">
                                        <span className={`font-bold text-sm truncate ${isDead ? 'line-through opacity-50' : ''}`} style={{ color: "var(--fg-color)" }}>
                                            {p.name}
                                        </span>
                                        <div className="flex gap-1">
                                            {p.status.filter(s => s !== "Normal").map(s => {
                                                const Icon = STATUS_ICONS[s];
                                                return <Icon key={s} className="w-3 h-3 text-[var(--scarlet-accent)]" title={s} />;
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-mono opacity-80" style={{ color: "var(--fg-dim)" }}>
                                        <Shield className="w-3 h-3" /> {p.ac}
                                        <span className="mx-1">|</span>
                                        <span style={{ color: statusColor }}>{p.hp}/{p.maxHp} HP</span>
                                    </div>
                                    {/* Mini HP Bar */}
                                    <div className="h-1 w-full bg-[#1a1a1a] mt-1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${Math.max(0, Math.min(100, hpPercent))}%`,
                                                backgroundColor: hpPercent < 30 ? "var(--scarlet-accent)" : "var(--gold-accent)"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardWidget>
    );
}

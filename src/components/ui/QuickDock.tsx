"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, Swords, Sparkles, PenTool } from "lucide-react";
import clsx from "clsx";

const DOCK_ITEMS = [
    { href: "/", label: "Sanctum", icon: Home },
    { href: "/maps", label: "Cartography", icon: MapIcon },
    { href: "/encounters", label: "Encounters", icon: Swords },
    { href: "/oracle", label: "Oracle", icon: Sparkles },
    { href: "/editor", label: "Notepad", icon: PenTool },
];

export default function QuickDock() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-[var(--obsidian-base)] border border-[var(--glass-border)] rounded-full px-4 py-2 flex gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-slide-up">
            {DOCK_ITEMS.map(item => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        title={item.label}
                        className={clsx(
                            "group relative p-3 rounded-full transition-all duration-300",
                            isActive ? "bg-[rgba(138,28,28,0.2)] text-[var(--scarlet-accent)]" : "text-[var(--fg-dim)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                        )}
                    >
                        <item.icon size={20} className={clsx("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />

                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>

                        {isActive && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--scarlet-accent)] rounded-full shadow-[0_0_5px_var(--scarlet-accent)]" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

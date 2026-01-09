"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, X, BookOpen, ShoppingBag, Skull, Map,
    Zap, Swords, Hammer, PenTool, FileText, Home
} from "lucide-react";
import clsx from "clsx";
import CurseTracker from "./CurseTracker";

const NAV_ITEMS = [
    { href: "/", label: "Sanctum", icon: Home },
    { href: "/lore", label: "Archives", icon: BookOpen },
    { href: "/shops", label: "The Market", icon: ShoppingBag },
    { href: "/statblocks", label: "Bestiary", icon: Skull },
    { href: "/maps", label: "Cartography", icon: Map },
    { href: "/mechanics", label: "Mechanics", icon: Zap },
    { href: "/encounters", label: "Encounters", icon: Swords },
    { href: "/generators", label: "The Foundry", icon: Hammer },
    { href: "/editor", label: "Notebook", icon: PenTool },
    { href: "/deliverables", label: "Props", icon: FileText },
];

export default function SidebarNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile/Global Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-50 p-3 bg-[var(--obsidian-base)] border border-[var(--glass-border)] rounded-full shadow-[0_0_15px_var(--glass-border)] hover:bg-[var(--scarlet-accent)] transition-all duration-300 group"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6 text-[var(--fg-color)] group-hover:text-black" />
            </button>

            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
                className={clsx(
                    "fixed top-0 left-0 h-full w-[300px] z-[100] transition-transform duration-300 ease-out shadow-[10px_0_30px_rgba(0,0,0,0.8)]",
                    "bg-[var(--obsidian-base)] border-r border-[var(--glass-border)] flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center bg-[var(--obsidian-dark)]">
                    <h2 className="text-xl font-serif text-[var(--scarlet-accent)] m-0 tracking-widest text-shadow-md">
                        HEART'S CURSE
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:text-[var(--scarlet-accent)] transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Nav Items */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 border border-transparent",
                                    isActive
                                        ? "bg-[rgba(138,28,28,0.1)] border-[var(--scarlet-accent)] text-[var(--scarlet-accent)]"
                                        : "hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] text-[var(--fg-dim)]"
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5", isActive ? "text-[var(--scarlet-accent)]" : "text-[var(--fg-dim)]")} />
                                <span className={clsx("font-serif tracking-wide uppercase text-sm", isActive ? "font-bold" : "")}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--scarlet-accent)] shadow-[0_0_5px_var(--scarlet-accent)]" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Curse Tracker Widget */}
                <div className="p-6 border-t border-[var(--glass-border)] bg-[var(--obsidian-dark)]">
                    <div className="mb-2 text-xs uppercase tracking-widest text-[var(--fg-dim)] opacity-70">
                        Regional Threat Level
                    </div>
                    {/* Embedding existing CurseTracker here properly styled */}
                    <div className="p-4 rounded border border-[var(--glass-border)] bg-[var(--obsidian-base)] relative overflow-hidden">
                        <CurseTracker simpleView={true} />
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                    </div>
                    <div className="mt-4 text-[10px] text-center text-[var(--fg-dim)] opacity-30 font-mono">
                        v2.0.4 // NETHER-OS
                    </div>
                </div>
            </div>
        </>
    );
}

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
                style={{
                    position: "fixed",
                    top: "1rem",
                    left: "1rem",
                    zIndex: 50,
                    padding: "0.75rem",
                    background: "var(--obsidian-base)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "50%",
                    boxShadow: "0 0 15px var(--glass-border)",
                    cursor: "pointer",
                    color: "var(--fg-color)"
                }}
                aria-label="Open Menu"
            >
                <Menu style={{ width: "24px", height: "24px" }} />
            </button>

            {/* Backdrop */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(4px)",
                    zIndex: 90,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                    transition: "opacity 0.3s"
                }}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "300px",
                    zIndex: 100,
                    background: "var(--obsidian-base)",
                    borderRight: "1px solid var(--glass-border)",
                    display: "flex",
                    flexDirection: "column",
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-out",
                    boxShadow: "10px 0 30px rgba(0,0,0,0.8)"
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid var(--glass-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--obsidian-dark)"
                }}>
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontFamily: "var(--font-serif)",
                        color: "var(--scarlet-accent)",
                        margin: 0,
                        letterSpacing: "0.1em"
                    }}>
                        HEART'S CURSE
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ border: "none", padding: "0.25rem", color: "inherit", background: "transparent", cursor: "pointer" }}
                    >
                        <X style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>

                {/* Scrollable Nav Items */}
                <nav style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "0.375rem",
                                        transition: "all 0.2s",
                                        border: "1px solid transparent",
                                        background: isActive ? "rgba(138,28,28,0.1)" : "transparent",
                                        borderColor: isActive ? "var(--scarlet-accent)" : "transparent",
                                        color: isActive ? "var(--scarlet-accent)" : "var(--fg-dim)",
                                        textDecoration: "none"
                                    }}
                                >
                                    <item.icon style={{ width: "20px", height: "20px", color: isActive ? "var(--scarlet-accent)" : "var(--fg-dim)" }} />
                                    <span style={{
                                        fontFamily: "var(--font-serif)",
                                        letterSpacing: "0.05em",
                                        fontSize: "0.875rem",
                                        fontWeight: isActive ? "bold" : "normal",
                                        textTransform: "uppercase"
                                    }}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div style={{
                                            marginLeft: "auto",
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background: "var(--scarlet-accent)",
                                            boxShadow: "0 0 5px var(--scarlet-accent)"
                                        }} />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Footer / Curse Tracker Widget */}
                <div style={{
                    padding: "1.5rem",
                    borderTop: "1px solid var(--glass-border)",
                    background: "var(--obsidian-dark)"
                }}>
                    <div style={{ marginBottom: "0.5rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-dim)", opacity: 0.7 }}>
                        Regional Threat Level
                    </div>
                    {/* Embedding existing CurseTracker here properly styled */}
                    <div style={{
                        padding: "1rem",
                        borderRadius: "0.25rem",
                        border: "1px solid var(--glass-border)",
                        background: "var(--obsidian-base)",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <CurseTracker simpleView={true} />
                    </div>
                    <div style={{ marginTop: "1rem", fontSize: "0.6rem", textAlign: "center", color: "var(--fg-dim)", opacity: 0.3, fontFamily: "var(--font-mono)" }}>
                        v2.0.4 // NETHER-OS
                    </div>
                </div>
            </div>
        </>
    );
}

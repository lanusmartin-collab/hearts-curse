"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu, X, BookOpen, ShoppingBag, Skull, Map,
    Zap, Swords, Hammer, PenTool, FileText, Home, Scroll, Download, Activity, Sparkles, ChevronLeft
} from "lucide-react";
import clsx from "clsx";
import CurseTracker from "./CurseTracker";
import { useGrimoire } from "@/lib/game/spellContext";

const NAV_ITEMS = [
    { href: "/", label: "Sanctum", icon: Home },
    { href: "/combat", label: "Battlemap", icon: Activity },
    { href: "/lore", label: "Archives", icon: BookOpen },
    { href: "/grimoire", label: "The Grimoire", icon: Scroll },
    { href: "/shops", label: "The Market", icon: ShoppingBag },
    { href: "/statblocks", label: "Monster Compendium", icon: Skull },
    { href: "/maps", label: "Cartography", icon: Map },
    { href: "/mechanics", label: "Mechanics", icon: Zap },
    { href: "/encounters", label: "Encounters", icon: Swords },
    { href: "/generators", label: "The Foundry", icon: Hammer },
    { href: "/editor", label: "Notebook", icon: PenTool },
    { href: "/deliverables", label: "Props", icon: FileText },
];

export default function SidebarNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const pathname = usePathname();
    const { openGrimoire } = useGrimoire();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportCampaignBackup = () => {
        const backup: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (
                key.startsWith("heart_") ||
                key.startsWith("hc_") ||
                key.startsWith("custom_") ||
                key.startsWith("shop_") ||
                key.startsWith("map_nodes_") ||
                key.startsWith("party_loc_") ||
                key.startsWith("campaign_") ||
                key.startsWith("curse_") ||
                key === "dm_content" ||
                key === "foundry_registry"
            )) {
                const val = localStorage.getItem(key);
                if (val !== null) backup[key] = val;
            }
        }
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `hearts_curse_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const importCampaignBackup = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (
                        key.startsWith("heart_") ||
                        key.startsWith("hc_") ||
                        key.startsWith("custom_") ||
                        key.startsWith("shop_") ||
                        key.startsWith("map_nodes_") ||
                        key.startsWith("party_loc_") ||
                        key.startsWith("campaign_") ||
                        key.startsWith("curse_") ||
                        key === "dm_content" ||
                        key === "foundry_registry"
                    )) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));

                Object.entries(data).forEach(([key, val]) => {
                    localStorage.setItem(key, val as string);
                });

                alert("Campaign successfully restored! Reloading...");
                window.location.reload();
            } catch (err) {
                alert("Failed to parse backup file. Make sure it is a valid JSON campaign package.");
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    const [isEncounters, setIsEncounters] = useState(false);

    useEffect(() => {
        setIsEncounters(pathname === '/encounters');
    }, [pathname]);

    return (
        <div style={{ display: isEncounters ? 'none' : 'block' }}>
            {/* Mobile Header Bar */}
            <div
                className="mobile-header-bar"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4rem",
                    zIndex: 50,
                    background: "var(--obsidian-base)",
                    borderBottom: "1px solid var(--glass-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1rem"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--fg-color)"
                        }}
                        aria-label="Open Menu"
                    >
                        <Menu style={{ width: "28px", height: "28px" }} />
                    </button>
                    <span style={{ fontFamily: "var(--font-header)", color: "var(--scarlet-accent)", letterSpacing: "0.1em", fontSize: "1.1rem" }}>
                        HEART'S CURSE
                    </span>
                </div>
                {/* Quick Access Mobile Header Drawer Tabs */}
                <div id="mobile-header-actions" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab: "bestiary" } }))}
                        className="mobile-header-tool-btn"
                        style={{
                            background: "rgba(138, 28, 28, 0.25)",
                            border: "1px solid rgba(255, 68, 68, 0.4)",
                            color: "#ff8888",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            minHeight: "36px"
                        }}
                        title="Bestiary Codex"
                    >
                        <Skull size={16} />
                        <span className="hidden md:inline font-mono text-[10px] uppercase font-bold">Bestiary</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab: "grimoire" } }))}
                        className="mobile-header-tool-btn"
                        style={{
                            background: "rgba(138, 28, 28, 0.25)",
                            border: "1px solid rgba(255, 68, 68, 0.4)",
                            color: "#ff8888",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            minHeight: "36px"
                        }}
                        title="Spells Grimoire"
                    >
                        <Scroll size={16} />
                        <span className="hidden md:inline font-mono text-[10px] uppercase font-bold">Spells</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab: "encounters" } }))}
                        className="mobile-header-tool-btn"
                        style={{
                            background: "rgba(138, 28, 28, 0.25)",
                            border: "1px solid rgba(255, 68, 68, 0.4)",
                            color: "#ff8888",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            minHeight: "36px"
                        }}
                        title="Encounter Generator"
                    >
                        <Swords size={16} />
                        <span className="hidden md:inline font-mono text-[10px] uppercase font-bold">Encounters</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab: "notepad" } }))}
                        className="mobile-header-tool-btn"
                        style={{
                            background: "rgba(201, 188, 160, 0.15)",
                            border: "1px solid rgba(201, 188, 160, 0.4)",
                            color: "#c9bca0",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            minHeight: "36px"
                        }}
                        title="DM Notes"
                    >
                        <PenTool size={16} />
                        <span className="hidden md:inline font-mono text-[10px] uppercase font-bold">Notes</span>
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab: "oracle" } }))}
                        className="mobile-header-tool-btn"
                        style={{
                            background: "rgba(201, 188, 160, 0.15)",
                            border: "1px solid rgba(201, 188, 160, 0.4)",
                            color: "#c9bca0",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            minHeight: "36px"
                        }}
                        title="AI Oracle"
                    >
                        <Sparkles size={16} />
                        <span className="hidden md:inline font-mono text-[10px] uppercase font-bold">Oracle</span>
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <div
                className="sidebar-backdrop"
                style={{
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none"
                }}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Drawer */}
            <div
                className="sidebar-container"
                style={{
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)"
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
                        className="sidebar-collapse-btn"
                        style={{
                            border: "1px solid rgba(201, 188, 160, 0.3)",
                            borderRadius: "4px",
                            padding: "0.35rem 0.6rem",
                            color: "var(--gold-accent)",
                            background: "rgba(201, 188, 160, 0.1)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            fontFamily: "var(--font-mono)",
                            textTransform: "uppercase"
                        }}
                        title="Collapse Sidebar"
                    >
                        <ChevronLeft style={{ width: "18px", height: "18px" }} />
                        <span>Collapse</span>
                    </button>
                </div>

                {/* Scrollable Nav Items */}
                <nav style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => {
                                        setIsOpen(false);
                                        const drawerTabs: Record<string, string> = {
                                            "/statblocks": "bestiary",
                                            "/grimoire": "grimoire",
                                            "/editor": "notepad",
                                            "/encounters": "encounters"
                                        };
                                        const tab = drawerTabs[item.href];
                                        if (tab) {
                                            e.preventDefault();
                                            window.dispatchEvent(new CustomEvent("open-campaign-drawer", { detail: { tab } }));
                                        }
                                    }}
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
                    {/* Backup & Restore System */}
                    <div style={{
                        marginTop: "1.5rem",
                        display: "flex",
                        gap: "0.5rem",
                    }}>
                        <button
                            onClick={exportCampaignBackup}
                            style={{
                                flex: 1,
                                padding: "0.45rem",
                                background: "rgba(201,188,160,0.05)",
                                border: "1px solid rgba(201,188,160,0.3)",
                                color: "var(--gold-accent)",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                fontFamily: "var(--font-serif)",
                                letterSpacing: "0.05em",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(201,188,160,0.15)";
                                e.currentTarget.style.borderColor = "var(--gold-accent)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(201,188,160,0.05)";
                                e.currentTarget.style.borderColor = "rgba(201,188,160,0.3)";
                            }}
                        >
                            Backup
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                flex: 1,
                                padding: "0.45rem",
                                background: "rgba(201,188,160,0.05)",
                                border: "1px solid rgba(201,188,160,0.3)",
                                color: "var(--gold-accent)",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                fontFamily: "var(--font-serif)",
                                letterSpacing: "0.05em",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(201,188,160,0.15)";
                                e.currentTarget.style.borderColor = "var(--gold-accent)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(201,188,160,0.05)";
                                e.currentTarget.style.borderColor = "rgba(201,188,160,0.3)";
                            }}
                        >
                            Restore
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) importCampaignBackup(file);
                            }}
                            style={{ display: "none" }}
                            accept=".json"
                        />
                    </div>

                    <div style={{ marginTop: "1rem", fontSize: "0.6rem", textAlign: "center", color: "var(--fg-dim)", opacity: 0.3, fontFamily: "var(--font-mono)" }}>
                        v1.2.5 // HEART'S CURSE
                    </div>
                    {deferredPrompt && (
                        <button
                            onClick={handleInstall}
                            style={{
                                marginTop: "1rem",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "0.5rem",
                                background: "rgba(138,28,28,0.2)",
                                border: "1px solid var(--scarlet-accent)",
                                color: "var(--scarlet-accent)",
                                borderRadius: "0.25rem",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                fontFamily: "var(--font-serif)",
                                letterSpacing: "0.05em"
                            }}
                        >
                            <Download style={{ width: "16px", height: "16px" }} />
                            Install App
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

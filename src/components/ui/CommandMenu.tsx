"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
    Laptop,
    Map as MapIcon,
    Skull,
    BookOpen,
    Zap,
    Search,
    Home,
    ShoppingBag,
    Swords,
    Hammer
} from "lucide-react";
import { useAudio } from "@/lib/context/AudioContext";

interface CommandMenuProps {
    onSave?: () => void;
}

export function CommandMenu({ onSave }: CommandMenuProps) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { playSfx } = useAudio();

    // Toggle with Ctrl+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
                playSfx("/sfx/ui_chirp.mp3"); // Placeholder path
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [playSfx]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
        playSfx("/sfx/ui_click.mp3"); // Placeholder path
    }, [playSfx]);

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-[var(--obsidian-base)] border border-[var(--glass-border)] shadow-2xl rounded-lg overflow-hidden z-[9999]"
        // Note: In cmdk v1.0, styling is often done via CSS modules or global styles on [cmdk-root]
        >
            <div className="flex items-center border-b border-[var(--glass-border)] px-3" cmdk-input-wrapper="">
                <Search className="w-5 h-5 text-[var(--fg-dim)] mr-2" />
                <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full bg-transparent border-none outline-none py-4 text-[var(--fg-color)] placeholder:text-[var(--fg-dim)] font-mono text-sm"
                />
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-6 text-center text-sm text-[var(--fg-dim)]">No results found.</Command.Empty>

                <Command.Group heading="Navigation">
                    <Command.Item onSelect={() => runCommand(() => router.push("/"))}>
                        <Home className="mr-2 h-4 w-4" /> Dashboard
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/maps"))}>
                        <MapIcon className="mr-2 h-4 w-4" /> Cartography
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/grimoire"))}>
                        <BookOpen className="mr-2 h-4 w-4" /> Grimoire
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/statblocks"))}>
                        <Skull className="mr-2 h-4 w-4" /> Bestiary
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/mechanics"))}>
                        <Zap className="mr-2 h-4 w-4" /> Mechanics
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/shops"))}>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Black Market
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/encounters"))}>
                        <Swords className="mr-2 h-4 w-4" /> Encounters
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/generators"))}>
                        <Hammer className="mr-2 h-4 w-4" /> Tools
                    </Command.Item>
                </Command.Group>

                <Command.Group heading="Actions">
                    <Command.Item onSelect={() => runCommand(() => alert('Rolling D20... implementation pending'))}>
                        <span className="mr-2">🎲</span> Roll D20
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => {
                        if (onSave) {
                            onSave();
                        } else {
                            alert("Game Auto-Saves on movement.");
                        }
                    })}>
                        <span className="mr-2">💾</span> Save Game
                    </Command.Item>
                </Command.Group>

            </Command.List>

            <div className="border-t border-[var(--glass-border)] py-1 px-2 text-[10px] text-[var(--fg-dim)] flex justify-between">
                <span>Select ↑↓</span>
                <span>Standard // GOD MODE</span>
            </div>
        </Command.Dialog>
    );
}

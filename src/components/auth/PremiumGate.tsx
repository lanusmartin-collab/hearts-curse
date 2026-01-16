"use client";

import { useUser } from "@/lib/auth/userContext";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function PremiumGate({ children, feature }: { children: ReactNode, feature: string }) {
    const { user, isLoading } = useUser();

    if (isLoading) return null; // Or a spinner

    if (user?.isPro) {
        return <>{children}</>;
    }

    return (
        <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded border border-[#333] bg-[#050505] group">
            {/* Blurred Content Preview (Optional, or just hide it) */}
            <div className="absolute inset-0 blur-md opacity-20 pointer-events-none select-none overflow-hidden">
                {/* Can put a fake screenshot here or just let the background texture show */}
                <div className="bg-[url('/img/grid_pattern.png')] w-full h-full"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center bg-gradient-to-b from-transparent to-[#0a0a0a]">
                <div className="bg-[#111] p-4 rounded-full border border-[#333] mb-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500">
                    <Lock className="w-8 h-8 text-[var(--gold-accent)]" />
                </div>

                <h3 className="text-2xl font-header text-white mb-2 tracking-widest">
                    LOCKED FEATURE
                </h3>
                <p className="text-[#888] mb-8 max-w-md">
                    The <span className="text-[var(--gold-accent)]">{feature}</span> is available exclusively to Dungeon Master tier subscribers.
                </p>

                <Link
                    href="/pricing"
                    className="bg-[var(--gold-accent)] hover:bg-white text-black font-bold py-3 px-8 rounded uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(201,188,160,0.2)] hover:shadow-[0_0_30px_rgba(201,188,160,0.4)] transition-all"
                >
                    Upgrade to Unlock
                </Link>
            </div>
        </div>
    );
}

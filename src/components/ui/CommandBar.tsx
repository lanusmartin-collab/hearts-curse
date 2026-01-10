"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CommandBar() {
    return (
        <nav className="sticky-nav no-print flex items-center justify-between px-6 py-3 border-b border-[#a32222]/30 bg-[#0a0a0c]/90 backdrop-blur-md z-50">
            {/* Left Side: System Status / Title */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-[#444] tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a32222] rounded-full animate-pulse shadow-[0_0_5px_#a32222]"></span>
                    <span className="text-[#a32222] font-bold">System Online</span>
                </div>
                <span className="hidden md:inline text-[#333]">|</span>
                <span className="hidden md:inline">Heart's Curse Module</span>
            </div>

            {/* Right Side: Retro Return Button */}
            <Link
                href="/"
                className="retro-btn bg-red-900 text-white text-xs px-4 py-2 no-underline hover:bg-red-700 animate-heartbeat border border-red-950 shadow-[0_4px_0_#3f0000] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wider font-bold"
            >
                Return to the Sanctum
            </Link>
        </nav>
    );
}

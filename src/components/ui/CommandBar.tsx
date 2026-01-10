"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CommandBar() {
    return (
        <nav className="sticky-nav no-print flex items-center justify-between px-6 py-3 border-b border-[#a32222]/30">
            <Link
                href="/"
                className="flex items-center gap-2 text-xs font-mono text-[#888] hover:text-[#e0e0e0] transition-colors uppercase tracking-[0.2em] group"
            >
                <div className="w-6 h-6 border border-[#333] group-hover:border-[#a32222] flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span>Return to Sanctum</span>
            </Link>

            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-[#444] tracking-widest uppercase">
                <span>System: Online</span>
                <span className="w-1 h-1 bg-[#a32222] rounded-full animate-pulse"></span>
            </div>
        </nav>
    );
}

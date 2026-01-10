"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CommandBar() {
    return (
        <nav className="sticky-nav no-print flex items-center justify-end px-6 py-3 border-b border-[#a32222]/30 bg-[#0a0a0c]/90 backdrop-blur-md z-50">
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

import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-[#c9bca0] font-serif p-4 text-center">
            <Ghost size={64} className="text-[#a32222] animate-pulse mb-4" />
            <h1 className="text-4xl font-bold mb-2 text-[#a32222]">404 - LOST IN THE MISTS</h1>
            <p className="text-lg mb-8 max-w-md">
                You have wandered too far. The path you seek does not exist, or has been consumed by the curse.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-[#1a0505] border border-[#5c1212] text-[#c9bca0] hover:bg-[#a32222] hover:text-white transition-all uppercase tracking-widest font-bold"
            >
                Return to Safety
            </Link>
        </div>
    );
}

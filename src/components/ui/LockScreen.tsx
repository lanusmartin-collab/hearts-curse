"use client";
import React, { useState } from "react";
import { Skull, Lock } from "lucide-react";

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);

    const checkPass = () => {
        if (pass.toLowerCase() === "netheril" || pass === "admin") {
            onUnlock();
        } else {
            setError(true);
            setPass("");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#000] z-[9999] flex flex-col items-center justify-center font-serif text-center">
            <div className="mb-8 p-6 border-2 border-[#333] rounded-full bg-[#050505]">
                <Skull className="w-16 h-16 text-[#444] animate-pulse" />
            </div>
            <h1 className="text-3xl text-[#666] uppercase tracking-[0.3em] mb-8 font-bold">Restricted Access</h1>

            <div className="flex flex-col gap-4 w-64">
                <input
                    type="password"
                    value={pass}
                    onChange={(e) => { setPass(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === 'Enter' && checkPass()}
                    placeholder="Enter Passcode..."
                    className="bg-[#111] border border-[#333] p-3 text-center text-white focus:border-[#666] outline-none tracking-widest"
                />
                <button
                    onClick={checkPass}
                    className="px-6 py-3 bg-[#1a1a1a] text-[#888] border border-[#333] hover:bg-[#333] hover:text-white transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                >
                    <Lock className="w-4 h-4" /> Unlock
                </button>
            </div>

            {error && <p className="mt-4 text-red-900 font-mono text-xs uppercase tracking-widest animate-pulse">Access Denied</p>}
        </div>
    );
}

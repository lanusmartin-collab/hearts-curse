"use client";

import { useState } from "react";
import { TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE, SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE, UNDERDARK_TRAVEL_TABLE, OAKHAVEN_MINES_TABLE, NETHERIL_RUINS_TABLE, OSSUARY_TABLE, ARACH_TINILITH_TABLE, Encounter } from "@/lib/data/encounters";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function EncountersPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-black text-[#a32222] font-mono animate-pulse">Initializing Threat Scanners...</div>}>
            <EncountersContent />
        </Suspense>
    );
}

function EncountersContent() {
    const searchParams = useSearchParams();
    const [result, setResult] = useState<Encounter | null>(null);
    const [linkedStatblocks, setLinkedStatblocks] = useState<string[]>([]);
    const [lastRoll, setLastRoll] = useState(0);
    const [isScanning, setIsScanning] = useState(false);

    // Initial Load from URL
    useEffect(() => {
        const rollParam = searchParams.get('roll');
        const nameParam = searchParams.get('name');
        const descParam = searchParams.get('desc');
        const monsterParam = searchParams.get('monsters');

        if (rollParam && nameParam) {
            setLastRoll(parseInt(rollParam));
            setResult({
                roll: [0, 0], // Dummy
                name: nameParam,
                description: descParam || "",
                monsters: monsterParam ? JSON.parse(monsterParam) : []
            });
            if (monsterParam) {
                setLinkedStatblocks(JSON.parse(monsterParam));
            }
        }
    }, [searchParams]);

    const rollTable = (table: Encounter[]) => {
        setIsScanning(true);
        setResult(null);

        // Simulation of "Scanning" delay
        setTimeout(() => {
            const d20 = Math.floor(Math.random() * 20) + 1;
            setLastRoll(d20);
            const match = table.find(e => d20 >= e.roll[0] && d20 <= e.roll[1]);
            const encounter = match || { roll: [0, 0], name: "Sector Clear", description: "No immediate threats detected in range." };

            setResult(encounter);
            setLinkedStatblocks(encounter.monsters || []);
            setIsScanning(false);
        }, 800);
    };

    const triggerShopAmbush = () => {
        setIsScanning(true);
        setTimeout(() => {
            setLastRoll(20);
            const ambush = SHOP_AMBUSH_TABLE[0];
            setResult(ambush);
            setLinkedStatblocks(ambush.monsters || []);
            setIsScanning(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#ccc] p-4 md:p-8 font-sans pb-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #111 1px, #111 2px)" }}></div>
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #1a0505 0%, #000 80%)" }}></div>

            <Link href="/" className="no-print absolute top-6 left-6 text-[10px] text-[#444] hover:text-[#a32222] font-mono tracking-widest border border-[#222] px-3 py-1 bg-black z-20 hover:border-[#a32222] transition-colors">
                {"< RETURN_ROOT"}
            </Link>

            <header className="relative z-10 text-center mb-12 mt-8">
                <h1 className="text-4xl md:text-6xl font-serif text-[#a32222] tracking-widest drop-shadow-[0_0_10px_rgba(163,34,34,0.6)]">THREAT ASSESSMENT</h1>
                <div className="h-[1px] w-32 bg-[#a32222] mx-auto mt-4 mb-2"></div>
                <p className="font-mono text-[10px] text-[#666] tracking-[0.3em] uppercase">Tactical Encounter Generation System // v3.1</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">

                {/* LEFT COLUMN: CONTROLS */}
                <div className="lg:col-span-1 space-y-8">
                    {/* SECTOR 1 */}
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest border-b border-[#222] pb-1">Sector 01: Surface</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ControlButton label="Town (Day)" sub="Standard Patrol" onClick={() => rollTable(TOWN_DAY_TABLE)} />
                            <ControlButton label="Town (Night)" sub="High Alert" onClick={() => rollTable(TOWN_NIGHT_TABLE)} />
                            <ControlButton label="Outskirts" sub="Wilderness" onClick={() => rollTable(OUTSKIRTS_TABLE)} />
                        </div>
                    </div>

                    {/* SECTOR 2 */}
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest border-b border-[#222] pb-1">Sector 02: Deep</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ControlButton label="Mines (Lv 3-5)" sub="Subterranean" onClick={() => rollTable(OAKHAVEN_MINES_TABLE)} />
                            <ControlButton label="Deep Travel" sub="Underdark" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)} />
                            <ControlButton label="Drow City" sub="Arach-Tinilith" onClick={() => rollTable(ARACH_TINILITH_TABLE)} />
                        </div>
                    </div>

                    {/* SECTOR 3 */}
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest border-b border-[#d4af37]/30 pb-1">Sector 03: Restricted</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <ControlButton label="Silent Wards" sub="Hazard" highlight onClick={() => rollTable(SILENT_WARDS_TABLE)} />
                            <ControlButton label="Netheril Void" sub="Arcane" highlight onClick={() => rollTable(NETHERIL_RUINS_TABLE)} />
                            <ControlButton label="Library" sub="Forbidden" highlight onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)} />
                            <ControlButton label="Ossuary" sub="Undead" highlight onClick={() => rollTable(OSSUARY_TABLE)} />
                            <ControlButton label="Heart" sub="Unknown" highlight onClick={() => rollTable(HEART_CHAMBER_TABLE)} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#222]">
                        <button
                            onClick={triggerShopAmbush}
                            className="w-full bg-[#1a0505] border border-[#a32222] text-[#ff4444] p-3 text-xs font-bold uppercase tracking-widest hover:bg-[#a32222] hover:text-black transition-all shadow-[0_0_10px_rgba(163,34,34,0.2)] animate-pulse-slow"
                        >
                            ⚠️ Zhentarim Ambush
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: DISPLAY */}
                <div className="lg:col-span-3">
                    <div className="bg-[#0a0a0a] border border-[#333] min-h-[500px] p-8 relative flex flex-col items-center justify-center text-center shadow-2xl">
                        {/* Corner Decorations */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#a32222]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#a32222]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#a32222]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#a32222]"></div>

                        {!result && !isScanning && (
                            <div className="text-[#333] animate-pulse">
                                <div className="text-6xl mb-4 opacity-20">☢</div>
                                <p className="font-mono text-sm tracking-widest uppercase">Awaiting Sector Selection...</p>
                            </div>
                        )}

                        {isScanning && (
                            <div className="text-[#a32222] font-mono font-bold tracking-widest animate-pulse">
                                [ SYSTEM SCANNING... ]
                                <div className="mt-4 h-1 w-32 bg-[#333] mx-auto overflow-hidden">
                                    <div className="h-full bg-[#a32222] w-1/2 animate-slide-scan"></div>
                                </div>
                            </div>
                        )}

                        {result && !isScanning && (
                            <div className="w-full max-w-2xl animate-in zoom-in-95 duration-300">
                                <div className="font-mono text-[#a32222] text-sm mb-2 tracking-[0.5em] uppercase border-b border-[#a32222]/30 pb-2 inline-block">
                                    Result Analysis // Roll: {lastRoll}
                                </div>
                                <h2 className="text-4xl font-serif text-[#e0e0e0] mb-6 drop-shadow-md">{result.name}</h2>
                                <p className="text-[#888] font-serif text-lg leading-relaxed mb-10 italic">
                                    "{result.description}"
                                </p>

                                {linkedStatblocks.length > 0 ? (
                                    <div className="text-left bg-[#111] border border-[#222] p-6 relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 text-[#a32222] text-[10px] font-bold uppercase tracking-widest border border-[#222]">
                                            Hostiles Detected
                                        </div>
                                        <div className="space-y-8 mt-4">
                                            {linkedStatblocks.map(slug => {
                                                const data = MONSTERS_2024[slug];
                                                if (!data) return <div key={slug} className="text-red-500 font-mono text-xs">Error: {slug} not found</div>;
                                                return <StatblockCard data={data} key={slug} />;
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-[#444] font-mono text-xs uppercase tracking-widest border border-[#222] p-4 inline-block">
                                        No Hostile Signatures Detected
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ControlButton({ label, sub, highlight, onClick }: { label: string, sub: string, highlight?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`
                group relative w-full text-left p-3 border transition-all duration-300 overflow-hidden
                ${highlight
                    ? 'bg-[#1a1205] border-[#d4af37]/30 hover:border-[#d4af37] text-[#eecfa1]'
                    : 'bg-[#0e0e0e] border-[#222] hover:border-[#666] text-[#ccc]'}
            `}
        >
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-all duration-300 ${highlight ? 'border-[#d4af37]' : 'border-[#444] group-hover:border-[#ccc]'}`}></div>
            <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-wider">{label}</div>
                <div className={`text-[9px] uppercase tracking-widest mt-1 ${highlight ? 'text-[#d4af37]/60' : 'text-[#555]'}`}>{sub}</div>
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r ${highlight ? 'from-[#d4af37]/10' : 'from-[#fff]/5'} to-transparent`}></div>
        </button>
    );
}

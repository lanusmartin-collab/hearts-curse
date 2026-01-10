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
    const [viewMode, setViewMode] = useState<'tracker' | 'tables'>('tracker');
    const [activeTable, setActiveTable] = useState<string | null>(null);

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

    const ALL_TABLES_DATA = [
        { id: "town_day", title: "Sector 01: Oakhaven (Day)", table: TOWN_DAY_TABLE },
        { id: "town_night", title: "Sector 01: Oakhaven (Night)", table: TOWN_NIGHT_TABLE },
        { id: "outskirts", title: "Sector 01: Outskirts", table: OUTSKIRTS_TABLE },
        { id: "mines", title: "Sector 02: Mines", table: OAKHAVEN_MINES_TABLE },
        { id: "underdark", title: "Sector 02: Deep Travel", table: UNDERDARK_TRAVEL_TABLE },
        { id: "drow", title: "Sector 02: Drow City", table: ARACH_TINILITH_TABLE },
        { id: "silent", title: "Sector 03: Silent Wards", table: SILENT_WARDS_TABLE },
        { id: "netheril", title: "Sector 03: Netheril Void", table: NETHERIL_RUINS_TABLE },
        { id: "library", title: "Sector 03: Library", table: LIBRARY_WHISPERS_TABLE },
        { id: "heart", title: "Sector 04: Heart Chamber", table: HEART_CHAMBER_TABLE },
        { id: "ossuary", title: "Sector 04: Ossuary", table: OSSUARY_TABLE },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#ccc', fontFamily: 'sans-serif', paddingBottom: '8rem', position: 'relative' }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', inset: 0, opacity: 0.1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)", pointerEvents: 'none' }}></div>

            <Link href="/" className="no-print" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '10px', color: '#666', border: '1px solid #333', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }} >
                {"< RETURN_ROOT"}
            </Link>

            <header className="terminal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', paddingRight: '2rem' }}>
                <div>
                    <h1 className="terminal-title">THREAT ASSESSMENT</h1>
                    <div style={{ height: '1px', width: '100px', background: '#a32222', marginTop: '1rem' }}></div>
                    <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Tactical Encounter Generation System // v3.2</p>
                </div>

                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setViewMode('tracker')}
                        className={`text-xs font-mono uppercase tracking-widest px-4 py-2 border ${viewMode === 'tracker' ? 'bg-[#a32222] text-black border-[#a32222]' : 'text-[#666] border-[#333] hover:text-white'}`}
                    >
                        Battle Tracker
                    </button>
                    <button
                        onClick={() => setViewMode('tables')}
                        className={`text-xs font-mono uppercase tracking-widest px-4 py-2 border ${viewMode === 'tables' ? 'bg-[#a32222] text-black border-[#a32222]' : 'text-[#666] border-[#333] hover:text-white'}`}
                    >
                        Table Viewer
                    </button>
                </div>
            </header>

            {viewMode === 'tracker' ? (
                <div className="terminal-grid">
                    {/* LEFT COLUMN: CONTROLS */}
                    <div className="flex-col gap-4">
                        {/* SECTOR 1 */}
                        <div>
                            <h3 className="section-header">Sector 01: Surface</h3>
                            <ControlButton label="Town (Day)" sub="Standard Patrol" onClick={() => rollTable(TOWN_DAY_TABLE)} />
                            <ControlButton label="Town (Night)" sub="High Alert" onClick={() => rollTable(TOWN_NIGHT_TABLE)} />
                            <ControlButton label="Outskirts" sub="Wilderness" onClick={() => rollTable(OUTSKIRTS_TABLE)} />
                        </div>

                        {/* SECTOR 2 */}
                        <div>
                            <h3 className="section-header">Sector 02: Deep</h3>
                            <ControlButton label="Mines (Lv 3-5)" sub="Subterranean" onClick={() => rollTable(OAKHAVEN_MINES_TABLE)} />
                            <ControlButton label="Deep Travel" sub="Underdark" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)} />
                            <ControlButton label="Drow City" sub="Arach-Tinilith" onClick={() => rollTable(ARACH_TINILITH_TABLE)} />
                        </div>

                        {/* SECTOR 3 */}
                        <div>
                            <h3 className="section-header" style={{ color: '#d4af37', borderColor: '#d4af37' }}>Sector 03: Restricted</h3>
                            <ControlButton label="Silent Wards" sub="Hazard" highlight onClick={() => rollTable(SILENT_WARDS_TABLE)} />
                            <ControlButton label="Netheril Void" sub="Arcane" highlight onClick={() => rollTable(NETHERIL_RUINS_TABLE)} />
                            <ControlButton label="Library" sub="Forbidden" highlight onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)} />
                        </div>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid #222' }}>
                            <button
                                onClick={triggerShopAmbush}
                                style={{
                                    width: '100%',
                                    background: '#1a0505',
                                    border: '1px solid #a32222',
                                    color: '#ff4444',
                                    padding: '12px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}
                                className="animate-pulse-slow"
                            >
                                ⚠️ Zhentarim Ambush
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DISPLAY */}
                    <div className="terminal-display">
                        <div className="corner-dec tl"></div>
                        <div className="corner-dec tr"></div>
                        <div className="corner-dec bl"></div>
                        <div className="corner-dec br"></div>

                        {!result && !isScanning && (
                            <div style={{ textAlign: 'center', opacity: 0.5 }} className="animate-pulse-slow">
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☢</div>
                                <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Awaiting Sector Selection...</p>
                            </div>
                        )}

                        {isScanning && (
                            <div style={{ color: '#a32222', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.2em' }}>
                                [ SYSTEM SCANNING... ]
                                <div style={{ height: '4px', width: '200px', background: '#333', marginTop: '1rem', overflow: 'hidden' }}>
                                    <div className="animate-slide-scan" style={{ height: '100%', width: '50%', background: '#a32222' }}></div>
                                </div>
                            </div>
                        )}

                        {result && !isScanning && (
                            <div className="animate-flicker" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'monospace', color: '#a32222', fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '0.2em', borderBottom: '1px solid #333', display: 'inline-block', paddingBottom: '0.5rem' }}>
                                    Result Analysis // Roll: {lastRoll}
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', color: '#e0e0e0', marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>{result.name}</h2>
                                <p style={{ color: '#888', fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.6' }}>
                                    "{result.description}"
                                </p>

                                {linkedStatblocks.length > 0 ? (
                                    <div style={{ textAlign: 'left', background: '#111', border: '1px solid #222', padding: '1.5rem', position: 'relative', marginTop: '2rem' }}>
                                        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#0a0a0a', padding: '0 10px', color: '#a32222', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #222' }}>
                                            Hostiles Detected
                                        </div>
                                        <div className="flex-col gap-4" style={{ marginTop: '1rem' }}>
                                            {linkedStatblocks.map(slug => {
                                                const data = MONSTERS_2024[slug];
                                                if (!data) return <div key={slug} style={{ color: 'red' }}>Error: {slug} not found</div>;
                                                return <StatblockCard data={data} key={slug} />;
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ border: '1px dashed #333', padding: '1rem', color: '#444', fontFamily: 'monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        No Hostile Signatures Detected
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* TABLE VIEWER MODE */
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar: Table List */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-4 border-b border-[#333] pb-2">Available Datasets</h3>
                            {ALL_TABLES_DATA.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTable(t.id)}
                                    className={`text-left text-xs font-mono uppercase p-3 border transition-colors ${activeTable === t.id ? 'bg-[#111] border-[#a32222] text-[#fff]' : 'border-[#222] text-[#666] hover:border-[#666] hover:text-[#bbb]'}`}
                                >
                                    {t.title}
                                </button>
                            ))}
                        </div>

                        {/* Main Viewing Area */}
                        <div className="col-span-1 md:col-span-3 min-h-[500px] border border-[#333] bg-[#0a0a0a] p-8 relative">
                            {/* Decorative Corners */}
                            <div className="corner-dec tl"></div>
                            <div className="corner-dec tr"></div>
                            <div className="corner-dec bl"></div>
                            <div className="corner-dec br"></div>

                            {activeTable ? (
                                <div>
                                    <h2 className="text-2xl font-serif text-[#e0e0e0] mb-6">
                                        {ALL_TABLES_DATA.find(t => t.id === activeTable)?.title}
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#333] text-[#666]">
                                                    <th className="py-2 w-24">ROLL</th>
                                                    <th className="py-2 w-64">ENCOUNTER</th>
                                                    <th className="py-2">DESCRIPTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#222]">
                                                {ALL_TABLES_DATA.find(t => t.id === activeTable)?.table.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-[#111] transition-colors">
                                                        <td className="py-4 text-[#a32222] font-bold">
                                                            {row.roll[0] === row.roll[1] ? row.roll[0] : `${row.roll[0]}-${row.roll[1]}`}
                                                        </td>
                                                        <td className="py-4 font-bold text-[#ccc] pr-4 align-top">
                                                            {row.name}
                                                            {row.monsters && row.monsters.length > 0 && (
                                                                <div className="text-[10px] text-[#555] mt-1 font-normal uppercase">
                                                                    Threats: {row.monsters.join(', ')}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-4 text-[#888] italic align-top leading-relaxed">
                                                            {row.description}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-[#444] font-mono text-xs uppercase tracking-widest animate-pulse">
                                    Select a dataset to view contents
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ControlButton({ label, sub, highlight, onClick }: { label: string, sub: string, highlight?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`control-btn ${highlight ? 'highlight' : ''}`}
        >
            <span className="control-label">{label}</span>
            <span className="control-sub">{sub}</span>
        </button>
    );
}

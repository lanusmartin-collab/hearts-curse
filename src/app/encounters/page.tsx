"use client";

import { useState } from "react";
import { TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE, SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE, UNDERDARK_TRAVEL_TABLE, OAKHAVEN_MINES_TABLE, NETHERIL_RUINS_TABLE, OSSUARY_TABLE, ARACH_TINILITH_TABLE, CASTLE_MOURNWATCH_TABLE, CATACOMBS_DESPAIR_TABLE, DWARVEN_RUINS_TABLE, MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE, Encounter } from "@/lib/data/encounters";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import Link from "next/link";
import { Combatant, Condition } from "@/types/combat";
import CombatantCard from "@/components/ui/CombatantCard";
import { createCombatantFromStatblock, rollInitiative, sortCombatants } from "@/lib/game/combatUtils";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Plus, RefreshCw, Trash2, Swords, ChevronRight } from "lucide-react";

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

    // Combat State
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [round, setRound] = useState(1);
    const [activeCombatantId, setActiveCombatantId] = useState<string | null>(null);

    // Persistence & Data Loading
    const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
    const [addMode, setAddMode] = useState<'player' | 'monster'>('player');
    const [manualMonster, setManualMonster] = useState({ name: '', init: '', hp: '' });
    const [selectedPlayerId, setSelectedPlayerId] = useState('');

    useEffect(() => {
        // Load Players
        const savedPlayers = localStorage.getItem('heart_curse_players');
        if (savedPlayers) {
            try {
                setAvailablePlayers(JSON.parse(savedPlayers));
            } catch (e) { console.error(e); }
        }

        // Load Combat State
        const savedCombat = localStorage.getItem('heart_curse_combat');
        if (savedCombat) {
            try {
                const data = JSON.parse(savedCombat);
                setCombatants(data.combatants || []);
                setRound(data.round || 1);
            } catch (e) { console.error(e); }
        }
    }, []);

    // Save Combat State
    useEffect(() => {
        if (combatants.length > 0 || round > 1) {
            localStorage.setItem('heart_curse_combat', JSON.stringify({ combatants, round }));
        }
    }, [combatants, round]);

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
            const d20 = Math.floor(Math.random() * 20) + 1;
            setLastRoll(d20);

            // Find match
            const match = SHOP_AMBUSH_TABLE.find(e => d20 >= e.roll[0] && d20 <= e.roll[1]);
            const encounter = match || SHOP_AMBUSH_TABLE[0]; // Fallback

            setResult(encounter);
            setLinkedStatblocks(encounter.monsters || []);
            setIsScanning(false);
        }, 500);
    };

    // --- COMBAT ACTIONS ---

    const engageHostiles = () => {
        if (!linkedStatblocks.length) return;

        const newCombatants: Combatant[] = [];
        const existingCounts: Record<string, number> = {};

        // Calculate counts for naming (Goblin A, Goblin B)
        linkedStatblocks.forEach(slug => {
            existingCounts[slug] = (existingCounts[slug] || 0) + 1;
        });

        // Add them
        let processedCounts: Record<string, number> = {};
        linkedStatblocks.forEach(slug => {
            const data = MONSTERS_2024[slug];
            if (!data) return;

            // Only need one per iteration, but createCombatantFromStatblock handles arrays if we passed a count
            // Since we loop, we pass count=1 but handle naming manually via index or similar?
            // Actually simpler: pass count=1 and handle suffix myself or let util handle it if I pass total count?
            // Let's use the util simply.
            const total = existingCounts[slug];
            const current = (processedCounts[slug] || 0);
            processedCounts[slug] = current + 1;

            const c = createCombatantFromStatblock(data, 1)[0];
            // Fix Name manually if multiple
            if (total > 1) {
                c.name = `${data.name} ${String.fromCharCode(65 + current)}`;
                c.id = c.id + `-${current}`; // Ensure unique ID
            }
            newCombatants.push(c);
        });

        setCombatants(prev => sortCombatants([...prev, ...newCombatants]));
    };

    const addPartyMember = () => {
        if (!selectedPlayerId) return;
        const player = availablePlayers.find(p => p.id === selectedPlayerId);
        if (!player) return;

        // Check if already in combat
        if (combatants.find(c => c.id === player.id)) return;

        const newCombatant: Combatant = {
            id: player.id,
            name: player.name,
            initiative: 0, // Should roll? User request: manual entry or roll. We'll default 0 and let them edit/roll.
            hp: player.hp,
            maxHp: player.maxHp,
            ac: player.ac,
            conditions: [],
            type: 'player'
        };
        setCombatants(prev => sortCombatants([...prev, newCombatant]));
        setSelectedPlayerId('');
    };

    const addManualMonster = () => {
        if (!manualMonster.name) return;
        const init = parseInt(manualMonster.init) || rollInitiative(10);

        // Auto-increment name if exists
        let finalName = manualMonster.name;
        const existingBase = combatants.filter(c => c.name.startsWith(manualMonster.name));
        if (existingBase.length > 0) {
            finalName = `${manualMonster.name} ${existingBase.length + 1}`;
        }

        const newCombatant: Combatant = {
            id: `monster-${Date.now()}-${Math.random()}`, // Ensure unique ID even on fast clicks
            name: finalName,
            initiative: init,
            hp: parseInt(manualMonster.hp) || 10,
            maxHp: parseInt(manualMonster.hp) || 10,
            ac: 10,
            conditions: [],
            type: 'monster'
        };
        setCombatants(prev => sortCombatants([...prev, newCombatant]));
        // Keep inputs for rapid entry, just clear init to encourage reroll? Or keep all for mass add.
        // Keeping all allows rapid "Add 5 Goblins"
    };

    const removeCombatant = (id: string) => {
        setCombatants(prev => prev.filter(c => c.id !== id));
    };

    const updateCombatant = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => {
            const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
            // If initiative changed, should we re-sort? usually yes manually or by trigger.
            // For now, let's NOT auto-sort on every keystroke, only on "Sort" button or round start.
            return updated;
        });
    };

    const rollNPCInitiative = () => {
        setCombatants(prev => {
            const next = prev.map(c => {
                if (c.type !== 'player') {
                    // Re-roll
                    const dex = c.statblock?.stats.dex || 10;
                    return { ...c, initiative: rollInitiative(dex) };
                }
                return c;
            });
            return sortCombatants(next);
        });
    };

    const nextRound = () => {
        setRound(r => r + 1);
        // Clear "reaction" or start of turn logic if we had it
        // Check for conditions that expire? (Not implemented deep logic yet)
    };

    const ALL_TABLES_DATA = [
        { id: "town_day", title: "Sector 01: Oakhaven (Day)", table: TOWN_DAY_TABLE },
        { id: "town_night", title: "Sector 01: Oakhaven (Night)", table: TOWN_NIGHT_TABLE },
        { id: "outskirts", title: "Sector 01: Outskirts", table: OUTSKIRTS_TABLE },
        { id: "ambush", title: "Sector 01: Shop Ambush", table: SHOP_AMBUSH_TABLE },
        { id: "castle", title: "Sector 01.5: Castle Mournwatch", table: CASTLE_MOURNWATCH_TABLE },
        { id: "mines", title: "Sector 02: Mines", table: OAKHAVEN_MINES_TABLE },
        { id: "dwarven", title: "Sector 02: Dwarven Ruins", table: DWARVEN_RUINS_TABLE },
        { id: "underdark", title: "Sector 02: Deep Travel", table: UNDERDARK_TRAVEL_TABLE },
        { id: "mindflayer", title: "Sector 02: Synaptic Deep", table: MIND_FLAYER_COLONY_TABLE },
        { id: "beholder", title: "Sector 02: Eye's Domain", table: BEHOLDER_LAIR_TABLE },
        { id: "drow", title: "Sector 02: Drow City", table: ARACH_TINILITH_TABLE },
        { id: "silent", title: "Sector 03: Silent Wards", table: SILENT_WARDS_TABLE },
        { id: "netheril", title: "Sector 03: Netheril Void", table: NETHERIL_RUINS_TABLE },
        { id: "library", title: "Sector 03: Library", table: LIBRARY_WHISPERS_TABLE },
        { id: "catacombs", title: "Sector 03: Catacombs of Despair", table: CATACOMBS_DESPAIR_TABLE },
        { id: "heart", title: "Sector 04: Heart Chamber", table: HEART_CHAMBER_TABLE },
        { id: "ossuary", title: "Sector 04: Ossuary", table: OSSUARY_TABLE },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#ccc', fontFamily: 'sans-serif', paddingBottom: '8rem', position: 'relative' }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', inset: 0, opacity: 0.1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)", pointerEvents: 'none' }}></div>

            <Link href="/" className="no-print retro-btn bg-red-900 text-white text-xs px-3 py-1 no-underline hover:bg-red-700 animate-heartbeat" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }} >
                BACK TO THE SANCTUM
            </Link>

            <header className="terminal-header relative mb-12">
                <div>
                    <h1 className="terminal-title">THREAT ASSESSMENT</h1>
                    <div className="mx-auto" style={{ height: '1px', width: '100px', background: '#a32222', marginTop: '1rem' }}></div>
                    <p style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '0.5rem' }}>Tactical Encounter Generation System // v3.2</p>
                </div>

                {/* View Toggles */}
                <div className="absolute right-0 bottom-0 flex gap-2">
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
                <div className="terminal-grid" style={{ gridTemplateColumns: '300px minmax(400px, 1fr) 350px' }}>
                    {/* LEFT COLUMN: CONTROLS */}
                    <div className="flex-col gap-4">
                        {/* SECTOR 1 */}
                        <div>
                            <h3 className="section-header">Sector 01: Surface</h3>
                            <ControlButton label="Town (Day)" sub="Standard Patrol" onClick={() => rollTable(TOWN_DAY_TABLE)} />
                            <ControlButton label="Town (Night)" sub="High Alert" onClick={() => rollTable(TOWN_NIGHT_TABLE)} />
                            <ControlButton label="Outskirts" sub="Wilderness" onClick={() => rollTable(OUTSKIRTS_TABLE)} />
                            <ControlButton label="Castle Siege" sub="War Zone" highlight onClick={() => rollTable(CASTLE_MOURNWATCH_TABLE)} />
                        </div>

                        {/* SECTOR 2 */}
                        <div>
                            <h3 className="section-header">Sector 02: Deep</h3>
                            <ControlButton label="Mines (Lv 3-5)" sub="Subterranean" onClick={() => rollTable(OAKHAVEN_MINES_TABLE)} />
                            <ControlButton label="Dwarven Ruins" sub="Tieg Duran" onClick={() => rollTable(DWARVEN_RUINS_TABLE)} />
                            <ControlButton label="Deep Travel" sub="Underdark" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)} />
                            <ControlButton label="Mind Flayer Colony" sub="Psionic" highlight onClick={() => rollTable(MIND_FLAYER_COLONY_TABLE)} />
                            <ControlButton label="Beholder Lair" sub="Anti-Magic" highlight onClick={() => rollTable(BEHOLDER_LAIR_TABLE)} />
                            <ControlButton label="Drow City" sub="Arach-Tinilith" onClick={() => rollTable(ARACH_TINILITH_TABLE)} />
                        </div>

                        {/* SECTOR 3 */}
                        <div>
                            <h3 className="section-header" style={{ color: '#d4af37', borderColor: '#d4af37' }}>Sector 03: Restricted</h3>
                            <ControlButton label="Silent Wards" sub="Hazard" highlight onClick={() => rollTable(SILENT_WARDS_TABLE)} />
                            <ControlButton label="Netheril Void" sub="Arcane" highlight onClick={() => rollTable(NETHERIL_RUINS_TABLE)} />
                            <ControlButton label="Library" sub="Forbidden" highlight onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)} />
                            <ControlButton label="Catacombs" sub="Despair" highlight onClick={() => rollTable(CATACOMBS_DESPAIR_TABLE)} />
                        </div>

                        {/* SECTOR 4 */}
                        <div>
                            <h3 className="section-header" style={{ color: '#ff0000', borderColor: '#ff0000' }}>Sector 04: Nightmare</h3>
                            <ControlButton label="Heart Chamber" sub="Boss Zone" highlight onClick={() => rollTable(HEART_CHAMBER_TABLE)} />
                            <ControlButton label="Ossuary" sub="Undead" highlight onClick={() => rollTable(OSSUARY_TABLE)} />
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

                    {/* MIDDLE COLUMN: RESULT DISPLAY */}
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

                                        {/* ENGAGE BUTTON */}
                                        <div className="mb-4 flex justify-center">
                                            <button
                                                onClick={engageHostiles}
                                                className="flex items-center gap-2 bg-[#a32222] text-white font-mono uppercase text-xs tracking-widest px-4 py-2 hover:bg-red-700 transition-colors shadow-lg"
                                            >
                                                <Swords size={16} />
                                                Update Uplink
                                            </button>
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

                    {/* RIGHT COLUMN: COMBAT TRACKER */}
                    <div className="flex flex-col bg-[#050505] border-l-4 border-double border-[#4a0404] h-full overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-20">
                        {/* Background Texture Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-10" style={{
                            background: `linear-gradient(to left, rgba(0, 0, 0, 0.8), transparent 20%),
                            repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(163, 34, 34, 0.1) 2px)`
                        }}></div>

                        <div className="p-6 bg-gradient-to-b from-[#1a0505] to-[#0a0a0c] border-b border-[#a32222] flex items-center justify-between relative z-20">
                            <div>
                                <h3 className="grimoire-title animate-heartbeat text-sm">INITIATIVE TRACKER</h3>
                                <div className="text-[10px] text-[#888] font-mono mt-1 tracking-widest">ROUND {round}</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { if (confirm('End the current encounter? This will clear all combatants.')) { setCombatants([]); localStorage.removeItem('heart_curse_combat'); } }}
                                    className="campaign-btn danger text-[10px] py-1 px-3"
                                >
                                    END BATTLE
                                </button>
                                <button onClick={rollNPCInitiative} className="p-2 text-[#666] hover:text-[#a32222] hover:bg-[#1a0505] rounded-sm transition-colors border border-transparent hover:border-[#333]" title="Re-roll NPC Initiative">
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-2 custom-scrollbar relative z-20">
                            {combatants.length === 0 ? (
                                <div className="text-center mt-10 opacity-30 text-xs font-mono uppercase tracking-widest text-red-900">
                                    No Active Signals
                                </div>
                            ) : (
                                combatants.map(c => (
                                    <CombatantCard
                                        key={c.id}
                                        data={c}
                                        isActive={activeCombatantId === c.id}
                                        onUpdate={updateCombatant}
                                        onRemove={removeCombatant}
                                    />
                                ))
                            )}

                            {/* ADD ENTITY PANEL */}
                            <div className="mt-4 border-t border-[#333] pt-4 px-3 bg-[#080808]">
                                <div className="flex mb-3 border-b border-[#222]">
                                    <button
                                        onClick={() => setAddMode('player')}
                                        className={`flex-1 text-[10px] uppercase font-bold py-2 border-b-2 transition-colors ${addMode === 'player' ? 'border-[#a32222] text-[#e0e0e0] bg-gradient-to-t from-[#a32222]/10 to-transparent' : 'border-transparent text-[#555] hover:text-[#bbb]'}`}
                                    >
                                        Add Player
                                    </button>
                                    <button
                                        onClick={() => setAddMode('monster')}
                                        className={`flex-1 text-[10px] uppercase font-bold py-2 border-b-2 transition-colors ${addMode === 'monster' ? 'border-[#a32222] text-[#e0e0e0] bg-gradient-to-t from-[#a32222]/10 to-transparent' : 'border-transparent text-[#555] hover:text-[#bbb]'}`}
                                    >
                                        Add Monster
                                    </button>
                                </div>

                                {addMode === 'player' ? (
                                    <div className="flex flex-col gap-3">
                                        <select
                                            value={selectedPlayerId}
                                            onChange={(e) => setSelectedPlayerId(e.target.value)}
                                            className="bg-[#111] border border-[#333] text-[#ccc] text-xs p-2.5 outline-none focus:border-[#a32222] transition-colors"
                                        >
                                            <option value="">-- Select Hero --</option>
                                            {availablePlayers.filter(p => !p.status.includes('Dead')).map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={addPartyMember}
                                            disabled={!selectedPlayerId}
                                            className="campaign-btn primary w-full py-3"
                                        >
                                            Join Battle
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <input
                                            type="text"
                                            placeholder="Monster Name"
                                            value={manualMonster.name}
                                            onChange={e => setManualMonster({ ...manualMonster, name: e.target.value })}
                                            className="bg-[#111] border border-[#333] text-[#ccc] text-xs p-2.5 outline-none focus:border-[#a32222] transition-colors placeholder:text-[#444]"
                                        />
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                placeholder="Init"
                                                value={manualMonster.init}
                                                onChange={e => setManualMonster({ ...manualMonster, init: e.target.value })}
                                                className="bg-[#111] border border-[#333] text-[#ccc] text-xs p-2.5 outline-none focus:border-[#a32222] w-1/2 transition-colors placeholder:text-[#444]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="HP"
                                                value={manualMonster.hp}
                                                onChange={e => setManualMonster({ ...manualMonster, hp: e.target.value })}
                                                className="bg-[#111] border border-[#333] text-[#ccc] text-xs p-2.5 outline-none focus:border-[#a32222] w-1/2 transition-colors placeholder:text-[#444]"
                                            />
                                        </div>
                                        <button
                                            onClick={addManualMonster}
                                            disabled={!manualMonster.name}
                                            className="campaign-btn primary w-full py-3"
                                        >
                                            Add to Battle
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#333] bg-[#050505] relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
                            <button
                                onClick={nextRound}
                                className="campaign-btn w-full py-4 text-sm tracking-[0.2em] shadow-[0_0_20px_rgba(163,34,34,0.2)]"
                            >
                                NEXT ROUND <ChevronRight size={18} />
                            </button>
                        </div>
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

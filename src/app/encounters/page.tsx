"use client";
// Force rebuild

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
    const [inspectedCombatantId, setInspectedCombatantId] = useState<string | null>(null);

    // Combat State
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [previewSlug, setPreviewSlug] = useState<string | null>(null); // New Preview State
    const [round, setRound] = useState(1);
    const [activeCombatantId, setActiveCombatantId] = useState<string | null>(null);
    const [addMode, setAddMode] = useState<'player' | 'monster'>('player');
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [manualMonster, setManualMonster] = useState({ name: '', hp: '', ac: '', initiative: '' });
    const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

    // Load Data
    useEffect(() => {
        // Load Players
        const savedPlayers = localStorage.getItem('heart_curse_players');
        if (savedPlayers) setAvailablePlayers(JSON.parse(savedPlayers));

        // Load Combat State
        const savedCombat = localStorage.getItem('heart_curse_combat');
        if (savedCombat) {
            const data = JSON.parse(savedCombat);
            setCombatants(data.combatants || []);
            setRound(data.round || 1);
            setActiveCombatantId(data.activeCombatantId || null);
        }
    }, []);

    // Save Combat State
    useEffect(() => {
        if (combatants.length > 0) {
            localStorage.setItem('heart_curse_combat', JSON.stringify({
                combatants,
                round,
                activeCombatantId
            }));
        } else {
            // Only clear if explicitly ended? keeping it safe for refresh
            localStorage.setItem('heart_curse_combat', JSON.stringify({
                combatants,
                round,
                activeCombatantId
            }));
        }
    }, [combatants, round, activeCombatantId]);

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
        setInspectedCombatantId(null); // Clear inspection on new scan
        setPreviewSlug(null);

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
        setResult(null);
        setInspectedCombatantId(null); // Clear inspection
        setPreviewSlug(null);
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
        setResult(null); // Clear result once engaged to make room? Or keep for reference?
        setPreviewSlug(null); // Clear any preview
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
        const init = parseInt(manualMonster.initiative) || rollInitiative(10);

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
        if (inspectedCombatantId === id) setInspectedCombatantId(null);
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

    const handleInspect = (id: string) => {
        setPreviewSlug(null);
        if (inspectedCombatantId === id) {
            setInspectedCombatantId(null);
        } else {
            setInspectedCombatantId(id);
        }
    };

    // Get inspected data (Combines Active Combatants AND Preview Slugs)
    const inspectedData = combatants.find(c => c.id === inspectedCombatantId)?.statblock || (previewSlug ? MONSTERS_2024[previewSlug] : null);
    const inspectedName = combatants.find(c => c.id === inspectedCombatantId)?.name || (previewSlug ? MONSTERS_2024[previewSlug]?.name : null);

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
    ];

    return (
        <div className="h-screen flex flex-row bg-[#050505] text-[#ccc] font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)" }}></div>

            <Link href="/" className="no-print campaign-btn danger text-xs px-3 py-1 no-underline fixed top-4 right-4 z-[99999]">
                SANCTUM
            </Link>

            {/* LEFT SIDEBAR: CONTROLS (Fixed Width) */}
            <div className="w-[280px] bg-[#080808] border-r border-[#222] flex flex-col overflow-y-auto custom-scrollbar z-10 shadow-[5px_0_20px_rgba(0,0,0,0.5)] shrink-0">
                <div className="p-4 border-b border-[#333] mb-4">
                    <h1 className="terminal-title text-2xl">HEART'S CURSE</h1>
                    <div className="text-[9px] font-mono text-[#666] tracking-[0.2em] uppercase mt-1">Tactical uplink v3.2</div>
                </div>

                <div className="px-4 pb-8 space-y-6">

                    {/* PARTY MANAGEMENT */}
                    <div>
                        <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-2">Party Deployment</h3>
                        <div className="flex gap-2 mb-2">
                            <div className="relative flex-1">
                                <select
                                    value={selectedPlayerId}
                                    onChange={e => setSelectedPlayerId(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] text-[#ccc] text-xs p-2 appearance-none outline-none focus:border-[#a32222] transition-colors"
                                >
                                    <option value="">Select Operative...</option>
                                    {availablePlayers.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.class})</option>
                                    ))}
                                </select>
                                <div className="absolute right-2 top-2.5 pointer-events-none text-[#666] text-[10px]">▼</div>
                            </div>
                            <button
                                onClick={addPartyMember}
                                disabled={!selectedPlayerId}
                                className="campaign-btn primary text-xs px-3"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* SCANNERS */}
                    <div>
                        <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-2">Sector Scanners</h3>
                        <div className="space-y-1">
                            <ControlButton label="Oakhaven" sub="Town (Day)" onClick={() => rollTable(TOWN_DAY_TABLE)} />
                            <ControlButton label="Oakhaven" sub="Town (Night)" onClick={() => rollTable(TOWN_NIGHT_TABLE)} />
                            <ControlButton label="Outskirts" sub="Wilderness" onClick={() => rollTable(OUTSKIRTS_TABLE)} />
                            <ControlButton label="Mournwatch" sub="Fortress" highlight onClick={() => rollTable(CASTLE_MOURNWATCH_TABLE)} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-2">Deep Systems</h3>
                        <div className="space-y-1">
                            <ControlButton label="Mines" sub="Dungeon" onClick={() => rollTable(OAKHAVEN_MINES_TABLE)} />
                            <ControlButton label="Underdark" sub="Travel" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)} />
                            <ControlButton label="Synaptic" sub="Illithid" onClick={() => rollTable(MIND_FLAYER_COLONY_TABLE)} />
                            <ControlButton label="Arach" sub="Drow City" highlight onClick={() => rollTable(ARACH_TINILITH_TABLE)} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-2">Forbidden Zones</h3>
                        <div className="space-y-1">
                            <ControlButton label="Silent Wards" sub="Hazard" highlight onClick={() => rollTable(SILENT_WARDS_TABLE)} />
                            <ControlButton label="Netheril Void" sub="Arcane" highlight onClick={() => rollTable(NETHERIL_RUINS_TABLE)} />
                            <ControlButton label="Library" sub="Forbidden" highlight onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#333]">
                        <button
                            onClick={triggerShopAmbush}
                            className="w-full bg-[#1a0505] border border-[#a32222] text-[#ff4444] p-3 font-bold uppercase tracking-widest text-xs hover:bg-[#a32222] hover:text-white transition-all shadow-[0_0_10px_rgba(163,34,34,0.3)]"
                        >
                            ⚠️ Zhentarim Ambush
                        </button>
                    </div>

                    {/* MANUAL ENTRY */}
                    <div className="pt-4 border-t border-[#333]">
                        <h3 className="text-[#a32222] font-mono text-xs uppercase tracking-widest mb-2">Simulate Threat</h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Entity Name"
                                value={manualMonster.name}
                                onChange={e => setManualMonster({ ...manualMonster, name: e.target.value })}
                                className="w-full bg-[#111] border border-[#333] text-[#ccc] text-xs p-2 outline-none focus:border-[#a32222] placeholder:text-[#444]"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Init"
                                    value={manualMonster.initiative}
                                    onChange={e => setManualMonster({ ...manualMonster, initiative: e.target.value })}
                                    className="w-1/2 bg-[#111] border border-[#333] text-[#ccc] text-xs p-2 outline-none focus:border-[#a32222] placeholder:text-[#444]"
                                />
                                <input
                                    type="number"
                                    placeholder="HP"
                                    value={manualMonster.hp}
                                    onChange={e => setManualMonster({ ...manualMonster, hp: e.target.value })}
                                    className="w-1/2 bg-[#111] border border-[#333] text-[#ccc] text-xs p-2 outline-none focus:border-[#a32222] placeholder:text-[#444]"
                                />
                            </div>
                            <button
                                onClick={addManualMonster}
                                disabled={!manualMonster.name}
                                className="w-full campaign-btn primary py-2 text-xs"
                            >
                                MANIFEST THREAT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER STAGE: VISUALS / STATS (Flexible) */}
            <div className="flex-1 bg-[#050505] relative overflow-hidden flex flex-col">
                {/* View Toggle */}
                <div className="absolute top-4 right-20 z-20 flex gap-2">
                    <button onClick={() => setViewMode('tracker')} className={`campaign-btn text-[10px] px-3 py-1 ${viewMode === 'tracker' ? 'primary' : ''}`}>Tactical</button>
                    <button onClick={() => setViewMode('tables')} className={`campaign-btn text-[10px] px-3 py-1 ${viewMode === 'tables' ? 'primary' : ''}`}>Compendium</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {/* Decorative Corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#a32222]"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#a32222]"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#a32222]"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#a32222]"></div>

                    {viewMode === 'tables' ? (
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-serif text-[#e0e0e0] mb-6">Encounter Tables</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ALL_TABLES_DATA.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { rollTable(t.table); setViewMode('tracker'); }}
                                        className="p-4 bg-[#111] border border-[#333] hover:border-[#d4af37] text-left transition-all hover:bg-[#1a1a1a]"
                                    >
                                        <div className="font-header text-[#ccc] text-sm">{t.title}</div>
                                        <div className="text-[10px] text-[#666] font-mono mt-1">{t.table.length} Entries</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : inspectedData ? (
                        <div className="w-full max-w-5xl mx-auto animate-slide-up">
                            <div className="flex justify-between items-center mb-6 border-b border-[#a32222] pb-2">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-header text-[#d4af37] tracking-widest drop-shadow-lg">{inspectedName}</h2>
                                    <span className="text-xs bg-[#a32222] text-white px-2 py-0.5 rounded-sm">TARGET LOCK</span>
                                </div>
                                <button onClick={() => { setInspectedCombatantId(null); setPreviewSlug(null); }} className="text-[#666] hover:text-white">CLOSE SCAN</button>
                            </div>
                            <StatblockCard data={inspectedData} />
                        </div>
                    ) : result ? (
                        <div className="w-full max-w-3xl mx-auto text-center mt-12 animate-flicker">
                            <div className="inline-block border-b border-[#a32222] pb-1 mb-4 text-[#a32222] font-mono tracking-[0.2em] text-sm">ENCOUNTER DETECTED // ROLL: {lastRoll}</div>
                            <h2 className="text-5xl font-header text-[#e0e0e0] mb-6 text-shadow-[0_4px_20px_rgba(0,0,0,1)]">{result.name}</h2>
                            <p className="text-lg text-[#888] italic mb-8 leading-relaxed max-w-2xl mx-auto">"{result.description}"</p>

                            {linkedStatblocks.length > 0 && (
                                <div className="bg-[#111] border border-[#333] p-6 max-w-xl mx-auto relative group">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050505] px-4 text-[10px] font-bold text-[#a32222] tracking-widest border border-[#333]">THREAT SIGNATURES</div>
                                    <div className="flex flex-col gap-3 mt-2">
                                        {linkedStatblocks.map(slug => (
                                            <button
                                                key={slug}
                                                onClick={() => setPreviewSlug(slug)}
                                                className="flex justify-between items-center text-sm text-[#ccc] border-b border-[#222] pb-2 last:border-0 w-full hover:bg-[#1a0505] transition-colors p-2 text-left group-hover:border-[#333]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#a32222] opacity-0 group-hover:opacity-100 transition-opacity">👁️</span>
                                                    <span className="group-hover:text-[#d4af37] transition-colors">{MONSTERS_2024[slug]?.name || slug}</span>
                                                </div>
                                                <span className="text-[#666] text-xs">CR {MONSTERS_2024[slug]?.cr}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-center">
                                        <button onClick={engageHostiles} className="campaign-btn primary w-full">INITIATE COMBAT SEQUENCE</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full opacity-20">
                            <div className="text-center">
                                <div className="text-6xl mb-4 text-[#333]">📡</div>
                                <div className="text-xl font-mono tracking-[0.5em] text-[#444] uppercase">System Resting</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: INITIATIVE TRACKER (Vertical) */}
            <div className="w-[380px] h-full bg-[#0c0c0e] border-l-4 border-double border-[#5c1212] relative z-30 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.7)] shrink-0">
                <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-[#333] shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#666] tracking-widest uppercase">ROUND {round}</span>
                            <button onClick={() => setRound(1)} title="Reset" className="text-[#333] hover:text-[#a32222] transition-colors"><RefreshCw size={12} /></button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={nextRound} className="campaign-btn text-[10px] py-1 px-3 tracking-widest">NEXT ROUND <ChevronRight size={10} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-3 custom-scrollbar">
                    {combatants.map(c => (
                        <div key={c.id} className="w-full shrink-0">
                            <CombatantCard
                                data={c}
                                isActive={c.id === activeCombatantId}
                                onUpdate={(id, updates) => setCombatants(prev => prev.map(x => x.id === id ? { ...x, ...updates } : x))}
                                onRemove={id => setCombatants(prev => prev.filter(x => x.id !== id))}
                                onInspect={handleInspect}
                                isInspected={inspectedCombatantId === c.id}
                            />
                        </div>
                    ))}
                    {combatants.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#333] font-mono text-sm tracking-widest italic opacity-50 space-y-4">
                            <div className="text-4xl">⚔️</div>
                            <div>NO ACTIVE HOSTILES</div>
                        </div>
                    )}
                </div>
            </div>
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

"use client";
// Force rebuild

import { useState, useEffect, Suspense } from "react";
import { TOWN_DAY_TABLE, TOWN_NIGHT_TABLE, OUTSKIRTS_TABLE, SHOP_AMBUSH_TABLE, SILENT_WARDS_TABLE, LIBRARY_WHISPERS_TABLE, HEART_CHAMBER_TABLE, UNDERDARK_TRAVEL_TABLE, OAKHAVEN_MINES_TABLE, NETHERIL_RUINS_TABLE, OSSUARY_TABLE, ARACH_TINILITH_TABLE, CASTLE_MOURNWATCH_TABLE, CATACOMBS_DESPAIR_TABLE, DWARVEN_RUINS_TABLE, MIND_FLAYER_COLONY_TABLE, BEHOLDER_LAIR_TABLE, Encounter } from "@/lib/data/encounters";
import { MONSTERS_2024 } from "@/lib/data/monsters_2024";
import StatblockCard from "@/components/ui/StatblockCard";
import Link from "next/link";
import { Combatant, Condition } from "@/types/combat";
import CombatantCard from "@/components/ui/CombatantCard";
import { createCombatantFromStatblock, rollInitiative, sortCombatants } from "@/lib/game/combatUtils";

import { useSearchParams } from "next/navigation";
import { Plus, RefreshCw, Trash2, Swords, ChevronRight } from "lucide-react";

export default function EncountersPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-black text-[var(--accent-red)] font-mono animate-pulse">Initializing Threat Scanners...</div>}>
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
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [manualEntry, setManualEntry] = useState({ name: '', hp: '', initiative: '' });
    const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);

    // Summoning State
    const [summonSearch, setSummonSearch] = useState('');
    const [selectedSummon, setSelectedSummon] = useState<string>('');

    const summonMonster = () => {
        if (!selectedSummon) return;
        const data = MONSTERS_2024[selectedSummon];
        if (!data) return;

        // Auto-increment name if exists
        let finalName = data.name;
        const existingBase = combatants.filter(c => c.name.startsWith(data.name));
        if (existingBase.length > 0) {
            finalName = `${data.name} ${existingBase.length + 1}`;
        }

        const newCombatants = createCombatantFromStatblock(data, 1);
        const c = newCombatants[0];
        c.name = finalName;
        // Ensure unique ID
        c.id = `monster-${Date.now()}-${Math.random()}`;

        setCombatants(prev => sortCombatants([...prev, c]));

        // Reset selection optionally, but keeping it allows multiple adds
    };

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

    // Generic Add Combatant (replaces addManualMonster)
    const addCombatant = (partial?: Partial<Combatant>) => {
        const name = partial?.name || manualEntry.name;
        if (!name) return;

        const init = partial?.initiative ?? (parseInt(manualEntry.initiative) || rollInitiative(10));
        const hp = partial?.hp ?? (parseInt(manualEntry.hp) || 10);

        // Auto-increment name if exists
        let finalName = name;
        const existingBase = combatants.filter(c => c.name.startsWith(name));
        if (existingBase.length > 0) {
            finalName = `${name} ${existingBase.length + 1}`;
        }

        const newCombatant: Combatant = {
            id: `manual-${Date.now()}-${Math.random()}`,
            name: finalName,
            initiative: init,
            hp: hp,
            maxHp: hp,
            ac: 10,
            conditions: [],
            type: 'monster',
            ...partial
        };
        setCombatants(prev => sortCombatants([...prev, newCombatant]));

        // Reset manual entry fields
        if (!partial) {
            setManualEntry({ name: '', hp: '', initiative: '' });
        }
    };

    const removeCombatant = (id: string) => {
        setCombatants(prev => prev.filter(c => c.id !== id));
        if (inspectedCombatantId === id) setInspectedCombatantId(null);
    };

    const updateCombatant = (id: string, updates: Partial<Combatant>) => {
        setCombatants(prev => {
            const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
            return updated;
        });
    };

    const nextTurn = () => {
        if (combatants.length === 0) return;

        const currentIndex = combatants.findIndex(c => c.id === activeCombatantId);
        if (currentIndex === -1 || currentIndex === combatants.length - 1) {
            // End of round or first start
            nextRound(); // This increments round
            setActiveCombatantId(combatants[0].id); // Loop to start
        } else {
            setActiveCombatantId(combatants[currentIndex + 1].id);
        }
    };

    const nextRound = () => {
        setRound(r => r + 1);
        // Ensure we start at top if called manually, typically loop handles this
        if (combatants.length > 0) {
            setActiveCombatantId(combatants[0].id);
        }
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
        <div className="h-screen flex flex-row bg-[var(--obsidian-base)] text-[var(--grim-text)] font-sans overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #222 1px, #222 2px)" }}></div>

            <Link href="/" className="no-print campaign-btn danger text-xs px-3 py-1 no-underline fixed top-4 right-4 z-[99999]">
                SANCTUM
            </Link>

            {/* LEFT SIDEBAR: CONTROLS (Fixed Width) - Grimoire Palette */}
            <div className="w-[280px] bg-[var(--obsidian-secondary)] border-r border-[#333] flex flex-col overflow-y-auto custom-scrollbar z-10 shadow-[5px_0_20px_rgba(0,0,0,0.5)] shrink-0">
                <div className="p-4 border-b border-[#333] mb-4">
                    <h1 className="terminal-title text-2xl">HEART'S CURSE</h1>
                    <div className="text-[9px] font-mono text-[#666] tracking-[0.2em] uppercase mt-1">Tactical uplink v3.2</div>
                </div>

                <div className="px-4 pb-8 space-y-6">

                    {/* PARTY MANAGEMENT */}
                    <div>
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Party Deployment</h3>
                        <div className="flex gap-2 mb-2">
                            <div className="relative flex-1">
                                <select
                                    value={selectedPlayerId}
                                    onChange={e => setSelectedPlayerId(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] text-[var(--grim-text)] text-xs p-2 appearance-none outline-none focus:border-[var(--accent-red)] transition-colors"
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

                    {/* MANUAL ENTRY */}
                    <div>
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Manual Threat</h3>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Entity Name"
                                value={manualEntry.name}
                                onChange={e => setManualEntry(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-[#111] border border-[#333] text-xs p-2 outline-none focus:border-[var(--accent-red)]"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="HP"
                                    value={manualEntry.hp}
                                    onChange={e => setManualEntry(prev => ({ ...prev, hp: e.target.value }))}
                                    className="w-1/2 bg-[#111] border border-[#333] text-xs p-2 outline-none focus:border-[var(--accent-red)]"
                                />
                                <button onClick={() => addCombatant()} disabled={!manualEntry.name} className="campaign-btn primary text-xs flex-1">
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SCANNERS */}
                    <div>
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Sector Scanners</h3>
                        <div className="space-y-1">
                            <ControlButton label="Oakhaven" sub="Town (Day)" onClick={() => rollTable(TOWN_DAY_TABLE)} />
                            <ControlButton label="Oakhaven" sub="Town (Night)" onClick={() => rollTable(TOWN_NIGHT_TABLE)} />
                            <ControlButton label="Outskirts" sub="Wilderness" onClick={() => rollTable(OUTSKIRTS_TABLE)} />
                            <ControlButton label="Mournwatch" sub="Fortress" highlight onClick={() => rollTable(CASTLE_MOURNWATCH_TABLE)} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Deep Systems</h3>
                        <div className="space-y-1">
                            <ControlButton label="Mines" sub="Dungeon" onClick={() => rollTable(OAKHAVEN_MINES_TABLE)} />
                            <ControlButton label="Underdark" sub="Travel" onClick={() => rollTable(UNDERDARK_TRAVEL_TABLE)} />
                            <ControlButton label="Synaptic" sub="Illithid" onClick={() => rollTable(MIND_FLAYER_COLONY_TABLE)} />
                            <ControlButton label="Arach" sub="Drow City" highlight onClick={() => rollTable(ARACH_TINILITH_TABLE)} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Forbidden Zones</h3>
                        <div className="space-y-1">
                            <ControlButton label="Silent Wards" sub="Hazard" highlight onClick={() => rollTable(SILENT_WARDS_TABLE)} />
                            <ControlButton label="Netheril Void" sub="Arcane" highlight onClick={() => rollTable(NETHERIL_RUINS_TABLE)} />
                            <ControlButton label="Library" sub="Forbidden" highlight onClick={() => rollTable(LIBRARY_WHISPERS_TABLE)} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#333]">
                        <button
                            onClick={triggerShopAmbush}
                            className="w-full bg-[#1a0505] border border-[var(--accent-red)] text-[var(--accent-red)] p-3 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent-red)] hover:text-white transition-all shadow-[0_0_10px_rgba(163,34,34,0.3)]"
                        >
                            ⚠️ Zhentarim Ambush
                        </button>
                    </div>

                    {/* SUMMON ENTITY (Integrated Compendium) */}
                    <div className="pt-4 border-t border-[#333]">
                        <h3 className="text-[var(--accent-red)] font-mono text-xs uppercase tracking-widest mb-2">Summon Entity</h3>
                        <div className="space-y-2">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Compendium..."
                                    value={summonSearch}
                                    onChange={e => setSummonSearch(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] text-[#ccc] text-xs p-2 outline-none focus:border-[var(--accent-red)] placeholder:text-[#444]"
                                />
                                {summonSearch && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#0a0a0c] border border-[#333] max-h-40 overflow-y-auto z-50">
                                        {Object.values(MONSTERS_2024)
                                            .filter(m => m.name.toLowerCase().includes(summonSearch.toLowerCase()))
                                            .slice(0, 8)
                                            .map(m => (
                                                <button
                                                    key={m.slug}
                                                    onClick={() => {
                                                        setSummonSearch(m.name);
                                                        setSelectedSummon(m.slug!);
                                                    }}
                                                    className="w-full text-left px-2 py-1 text-xs hover:bg-[var(--accent-red)] hover:text-white text-[#888] flex justify-between"
                                                >
                                                    <span>{m.name}</span>
                                                    <span className="opacity-50">CR {m.cr}</span>
                                                </button>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Stats Preview */}
                            {selectedSummon && MONSTERS_2024[selectedSummon] && (
                                <div className="text-[10px] text-[#666] flex gap-2">
                                    <span>HP: <span className="text-[#ccc]">{MONSTERS_2024[selectedSummon].hp}</span></span>
                                    <span>AC: <span className="text-[#ccc]">{MONSTERS_2024[selectedSummon].ac}</span></span>
                                    <span>Type: <span className="text-[#ccc]">{MONSTERS_2024[selectedSummon].type}</span></span>
                                </div>
                            )}

                            <button
                                onClick={summonMonster}
                                disabled={!selectedSummon}
                                className="w-full campaign-btn primary py-2 text-xs"
                            >
                                MANIFEST THREAT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER STAGE: VISUALS / STATS (Flexible) */}
            <div className="flex-1 bg-[var(--obsidian-base)] relative overflow-hidden flex flex-col">
                {/* View Toggle */}
                <div className="absolute top-4 right-20 z-20 flex gap-2">
                    <button onClick={() => setViewMode('tracker')} className={`campaign-btn text-[10px] px-3 py-1 ${viewMode === 'tracker' ? 'primary' : ''}`}>Tactical</button>
                    <button onClick={() => setViewMode('tables')} className={`campaign-btn text-[10px] px-3 py-1 ${viewMode === 'tables' ? 'primary' : ''}`}>Compendium</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {/* Decorative Corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--accent-red)]"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--accent-red)]"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--accent-red)]"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--accent-red)]"></div>

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
                                        <div className="font-header text-[var(--grim-text)] text-sm">{t.title}</div>
                                        <div className="text-[10px] text-[#666] font-mono mt-1">{t.table.length} Entries</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : inspectedData ? (
                        <div className="w-full max-w-5xl mx-auto animate-slide-up">
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--accent-red)] pb-2">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-header text-[#d4af37] tracking-widest drop-shadow-lg">{inspectedName}</h2>
                                    <span className="text-xs bg-[var(--accent-red)] text-white px-2 py-0.5 rounded-sm">TARGET LOCK</span>
                                </div>
                                <button onClick={() => { setInspectedCombatantId(null); setPreviewSlug(null); }} className="text-[#666] hover:text-white">CLOSE SCAN</button>
                            </div>
                            <StatblockCard data={inspectedData} />
                        </div>
                    ) : result ? (
                        <div className="w-full max-w-3xl mx-auto text-center mt-12 animate-flicker">
                            <div className="inline-block border-b border-[var(--accent-red)] pb-1 mb-4 text-[var(--accent-red)] font-mono tracking-[0.2em] text-sm">ENCOUNTER DETECTED // ROLL: {lastRoll}</div>
                            <h2 className="text-5xl font-header text-[#e0e0e0] mb-6 text-shadow-[0_4px_20px_rgba(0,0,0,1)]">{result.name}</h2>
                            <p className="text-lg text-[#888] italic mb-8 leading-relaxed max-w-2xl mx-auto">"{result.description}"</p>

                            {linkedStatblocks.length > 0 && (
                                <div className="bg-[#111] border border-[#333] p-6 max-w-xl mx-auto relative group">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--obsidian-base)] px-4 text-[10px] font-bold text-[var(--accent-red)] tracking-widest border border-[#333]">THREAT SIGNATURES</div>
                                    <div className="flex flex-col gap-3 mt-2">
                                        {linkedStatblocks.map(slug => (
                                            <button
                                                key={slug}
                                                onClick={() => setPreviewSlug(slug)}
                                                className="flex justify-between items-center text-sm text-[#ccc] border-b border-[#222] pb-2 last:border-0 w-full hover:bg-[#1a0505] transition-colors p-2 text-left group-hover:border-[#333]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[var(--accent-red)] opacity-0 group-hover:opacity-100 transition-opacity">👁️</span>
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
                            <button onClick={() => setRound(1)} title="Reset" className="text-[#333] hover:text-[var(--accent-red)] transition-colors"><RefreshCw size={12} /></button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={nextTurn} className="campaign-btn primary text-[10px] py-1 px-3 tracking-widest">NEXT TURN <ChevronRight size={10} /></button>
                        <button onClick={nextRound} className="campaign-btn text-[10px] py-1 px-3 tracking-widest text-[#666] border-[#333]">ROUND+</button>
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

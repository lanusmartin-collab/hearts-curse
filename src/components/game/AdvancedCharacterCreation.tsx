"use client";

import React, { useState, useMemo } from "react";
import { Dices, Save, Sword, Shield, Crown, Scroll, Ghost, User, BookOpen, Hammer, Heart, Zap, Sparkles } from "lucide-react";
import { Combatant } from "@/types/combat";
import { RACES } from "@/lib/data/races";
import { ALIGNMENTS } from "@/lib/data/alignments";
import { STARTING_EQUIPMENT } from "@/lib/data/equipment";
import { CLASSES } from "@/lib/data/classes";
import { BACKGROUNDS } from "@/lib/data/backgrounds";
import { ALL_SPELLS } from "@/lib/data/spells";

interface AdvancedCharacterCreationProps {
    onComplete: (character: Combatant) => void;
}

const RACIAL_TRAITS: Record<string, string[]> = {
    human: ["+1 to All Stats", "Extra Language"],
    elf: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    dwarf: ["Darkvision", "Dwarven Resilience", "Combat Training", "Stonecunning"],
    tiefling: ["Darkvision", "Hellish Resistance", "Infernal Legacy"]
};

export default function AdvancedCharacterCreation({ onComplete }: AdvancedCharacterCreationProps) {
    // TABS
    const [activeTab, setActiveTab] = useState<'identity' | 'stats' | 'spells' | 'gear'>('identity');

    // IDENTITY
    const [name, setName] = useState("Hero");
    const [raceId, setRaceId] = useState("human");
    const [classId, setClassId] = useState("paladin");
    const [subclassIndex, setSubclassIndex] = useState(0);
    const [backgroundId, setBackgroundId] = useState("noble");
    const [alignment, setAlignment] = useState(ALIGNMENTS[0]);

    // STATS
    const [stats, setStats] = useState({ str: 15, dex: 10, con: 14, int: 10, wis: 12, cha: 14 });
    const [hpMode, setHpMode] = useState<'max' | 'rolled'>('max');
    const [rolledHp, setRolledHp] = useState<number | null>(null);

    // SPELLS
    const [knownSpells, setKnownSpells] = useState<Set<string>>(new Set()); // For Known Casters & Cantrips
    const [preparedSpells, setPreparedSpells] = useState<Set<string>>(new Set()); // For Prepared Casters

    // GEAR
    const [equipment, setEquipment] = useState<Set<string>>(new Set());
    const [customItems, setCustomItems] = useState<{ id: string, name: string, type: 'weapon' | 'armor' | 'gear', stats: string }[]>([]);

    // MOBILE UI STATE
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    // MODAL STATE
    const [showItemForge, setShowItemForge] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState<any>("weapon");
    const [newItemStats, setNewItemStats] = useState("");

    const selectedRace = RACES.find(r => r.id === raceId);
    const selectedClass = CLASSES.find(c => c.id === classId);
    const selectedBackground = BACKGROUNDS.find(b => b.id === backgroundId);

    // -- LOGIC --

    const handleStatChange = (stat: keyof typeof stats, val: string) => {
        const num = parseInt(val) || 0;
        setStats(prev => ({ ...prev, [stat]: Math.min(20, Math.max(0, num)) }));
    };

    const rollStats = () => {
        const roll4d6drop1 = () => {
            const rolls = [0, 0, 0, 0].map(() => Math.ceil(Math.random() * 6)).sort((a, b) => b - a);
            return rolls[0] + rolls[1] + rolls[2];
        };
        setStats({
            str: roll4d6drop1(), dex: roll4d6drop1(), con: roll4d6drop1(),
            int: roll4d6drop1(), wis: roll4d6drop1(), cha: roll4d6drop1()
        });
    };

    const calculateHp = () => {
        const conMod = Math.floor((stats.con - 10) / 2);
        const hitDie = selectedClass?.hp || 10;

        if (hpMode === 'max') {
            return (hitDie + conMod) * 20;
        } else {
            if (rolledHp) return rolledHp;
            return (hitDie + conMod) + ((hitDie / 2 + 1 + conMod) * 19);
        }
    };

    const rollHp = () => {
        const conMod = Math.floor((stats.con - 10) / 2);
        const hitDie = selectedClass?.hp || 10;
        let total = hitDie + conMod;
        for (let i = 2; i <= 20; i++) {
            total += Math.ceil(Math.random() * hitDie) + conMod;
        }
        setRolledHp(total);
        setHpMode('rolled');
    };

    const handleToggleEquip = (itemId: string) => {
        setEquipment(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    };

    const createCustomItem = () => {
        if (!newItemName) return;
        const item = {
            id: `custom-${Date.now()}`,
            name: newItemName,
            type: newItemType,
            stats: newItemStats
        };
        setCustomItems([...customItems, item]);
        setEquipment(prev => new Set(prev).add(item.id));
        setShowItemForge(false);
        setNewItemName("");
        setNewItemStats("");
    };

    // SPELL LOGIC
    const toggleSpell = (spellName: string, isCantrip: boolean) => {
        if (!selectedClass?.spellcasting) return;

        const targetSet = isCantrip ? knownSpells : (selectedClass.spellcasting.type === 'known' ? knownSpells : preparedSpells);
        const setFunction = isCantrip ? setKnownSpells : (selectedClass.spellcasting.type === 'known' ? setKnownSpells : setPreparedSpells);

        // Limits
        // This is a simplified check. Real app would checking against Max Known

        setFunction(prev => {
            const next = new Set(prev);
            if (next.has(spellName)) next.delete(spellName);
            else next.add(spellName);
            return next;
        });
    };

    const availableSpells = useMemo(() => {
        if (!selectedClass?.spellcasting) return [];

        const className = selectedClass.name; // e.g. "Wizard"

        return ALL_SPELLS.filter(s => {
            const classes = s.classes;
            if (Array.isArray(classes)) {
                return classes.some(c => c.toLowerCase() === className.toLowerCase());
            }
            return classes === className;
        });
    }, [selectedClass]);

    // FINISH
    const createCharacterObject = (): Combatant => {
        const hp = calculateHp();
        let ac = 10 + Math.floor((stats.dex - 10) / 2); // Base AC

        // Merge standard and custom items
        const equippedNames = [
            ...Array.from(equipment).map(id => STARTING_EQUIPMENT.find(i => i.id === id)?.name),
            ...customItems.filter(i => equipment.has(i.id)).map(i => i.name)
        ].filter(Boolean) as string[];

        // Compile Spells
        const allMySpells = [...Array.from(knownSpells), ...Array.from(preparedSpells)];

        // Generate Attacks from Equipment
        const weaponAttacks = [
            ...Array.from(equipment).map(id => {
                const std = STARTING_EQUIPMENT.find(i => i.id === id);
                if (std && std.type === 'weapon') {
                    return {
                        name: std.name,
                        bonus: Math.floor((stats.str - 10) / 2) + 6, // Proficiency +6 assumed
                        damage: std.stats?.match(/\d+d\d+/)?.[0] || "1d8",
                        type: 'melee'
                    };
                }
                const cst = customItems.find(i => i.id === id);
                if (cst && cst.type === 'weapon') {
                    return {
                        name: cst.name,
                        bonus: Math.floor((stats.str - 10) / 2) + 6,
                        damage: cst.stats?.match(/\d+d\d+/)?.[0] || "1d8",
                        type: 'melee'
                    };
                }
                return null;
            }).filter(Boolean)
        ];

        const charObj: Combatant = {
            id: `player-${Date.now()}`,
            name,
            type: 'player',
            level: 20,
            race: raceId,
            class: selectedClass?.subclasses ? `${selectedClass.name} (${selectedClass.subclasses[subclassIndex].name})` : classId,
            background: backgroundId,
            alignment,
            equipment: equippedNames,
            hp,
            maxHp: hp,
            ac,
            initiative: Math.floor((stats.dex - 10) / 2),
            conditions: [],
            stats,
            spellSlots: selectedClass?.spellcasting?.slots as any, // Initialize full slots
            preparedSpells: allMySpells,
            resources: {
                action: true,
                bonusAction: true,
                movement: 30, // Default, modify by race later
                reaction: true
            },
            attacks: [
                { name: "Unarmed Strike", bonus: Math.floor((stats.str - 10) / 2) + 6, damage: `1+${Math.floor((stats.str - 10) / 2)}`, type: 'melee', range: '5 ft.' },
                ...weaponAttacks as any[]
            ]
        };

        return charObj;
    };

    const handleFinish = () => {
        onComplete(createCharacterObject());
    };

    const exportCharacter = () => {
        const char = createCharacterObject();
        const blob = new Blob([JSON.stringify(char, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_lvl20.json`;
        a.click();
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0c] text-[#d4c391] z-[100] font-serif overflow-hidden flex flex-col md:flex-row">

            {/* LEFT: Tab Navigation (Bottom Bar on Mobile) */}
            <div className="w-full h-16 md:w-20 md:h-full bg-[#050505] border-t md:border-t-0 md:border-r border-[#333] flex flex-row md:flex-col justify-around md:justify-start items-center md:py-8 gap-0 md:gap-8 order-last md:order-first shrink-0 z-50">
                <button onClick={() => setActiveTab('identity')} className={`p-3 rounded-xl transition-all ${activeTab === 'identity' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <User className="w-6 h-6" />
                </button>
                <button onClick={() => setActiveTab('stats')} className={`p-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <Dices className="w-6 h-6" />
                </button>
                {selectedClass?.spellcasting && (
                    <button onClick={() => setActiveTab('spells')} className={`p-3 rounded-xl transition-all ${activeTab === 'spells' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                        <Sparkles className="w-6 h-6" />
                    </button>
                )}
                <button onClick={() => setActiveTab('gear')} className={`p-3 rounded-xl transition-all ${activeTab === 'gear' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <Sword className="w-6 h-6" />
                </button>

                {/* Mobile Preview Toggle (Only visible on small screens in nav) */}
                <button onClick={() => setShowMobilePreview(!showMobilePreview)} className={`md:hidden p-3 rounded-xl transition-all ${showMobilePreview ? 'bg-[#d4c391] text-black' : 'text-[#444]'}`}>
                    <Scroll className="w-6 h-6" />
                </button>
            </div>

            {/* CENTER: Work Area */}
            <div className="flex-1 bg-[#0a0a0c] p-4 md:p-8 overflow-y-auto custom-scrollbar relative pb-24 md:pb-8">
                <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-8">
                    <h2 className="text-xl md:text-3xl font-bold text-[#a32222] uppercase tracking-widest">
                        {activeTab === 'identity' && "Identity & Origin"}
                        {activeTab === 'stats' && "Ability Scores & Class"}
                        {activeTab === 'spells' && "Grimoire Preparation"}
                        {activeTab === 'gear' && "Arsenal & Equipment"}
                    </h2>
                    {/* Mobile Preview Button Header */}
                    <button onClick={() => setShowMobilePreview(true)} className="md:hidden text-[#d4c391] border border-[#333] p-2 rounded hover:bg-[#222]">
                        <BookOpen className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-w-4xl mx-auto space-y-8 pb-32">

                    {/* IDENTITY TAB */}
                    {activeTab === 'identity' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#666]">Character Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111] border border-[#333] p-4 text-xl text-white focus:border-[#a32222] outline-none" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-[#666]">Race</label>
                                    <select value={raceId} onChange={e => setRaceId(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white">
                                        {RACES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                    <div className="bg-[#111] p-4 text-sm text-[#888] border border-[#222]">
                                        <h4 className="text-[#a32222] font-bold mb-2">Racial Traits</h4>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {RACIAL_TRAITS[raceId]?.map(t => <li key={t}>{t}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-[#666]">Background</label>
                                    <select value={backgroundId} onChange={e => setBackgroundId(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white">
                                        {BACKGROUNDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                    <div className="bg-[#111] p-4 text-sm text-[#888] border border-[#222]">
                                        <h4 className="text-[#a32222] font-bold mb-2">Feature: {selectedBackground?.feature}</h4>
                                        <p className="italic mb-2 text-[#666]">{selectedBackground?.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBackground?.skills.map(s => <span key={s} className="px-2 py-1 bg-[#222] rounded text-xs text-[#ccc]">{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#666]">Alignment</label>
                                <select value={alignment} onChange={e => setAlignment(e.target.value as any)} className="w-full bg-[#111] border border-[#333] p-3 text-white">
                                    {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#666]">Class</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {CLASSES.map(cls => (
                                        <button key={cls.id} onClick={() => { setClassId(cls.id); setSubclassIndex(0); setKnownSpells(new Set()); setPreparedSpells(new Set()); }} className={`p-3 border transition-all flex flex-col items-center gap-1 ${classId === cls.id ? 'bg-[#a32222] border-[#ff4444] text-white' : 'bg-[#111] border-[#333] text-[#666] hover:border-[#666]'}`}>
                                            <span className="font-bold text-sm">{cls.name}</span>
                                            <span className="text-[10px] opacity-60">d{cls.hp} HD</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SUBCLASS SELECTOR */}
                            {selectedClass?.subclasses && (
                                <div className="space-y-2 animate-in fade-in">
                                    <label className="text-xs uppercase tracking-widest text-[#666]">Subclass (Archetype)</label>
                                    <select value={subclassIndex} onChange={e => setSubclassIndex(parseInt(e.target.value))} className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#a32222] outline-none">
                                        {selectedClass.subclasses.map((sub, i) => (
                                            <option key={sub.name} value={i}>{sub.name}</option>
                                        ))}
                                    </select>
                                    <div className="bg-[#111] p-4 text-sm text-[#888] border border-[#222]">
                                        <p className="italic text-[#ccc] mb-2">{selectedClass.subclasses[subclassIndex].description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedClass.subclasses[subclassIndex].features.map(f => (
                                                <span key={f} className="px-2 py-1 bg-[#222] text-[#888] text-xs rounded border border-[#333]">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STATS TAB */}
                    {activeTab === 'stats' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                            {/* Ability Scores */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#222] pb-2">
                                    <h3 className="text-lg font-bold text-[#d4c391]">Ability Scores</h3>
                                    <button onClick={rollStats} className="text-[#a32222] text-sm hover:text-white flex items-center gap-2"><Dices className="w-4 h-4" /> Roll 4d6 (Drop Lowest)</button>
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {(Object.keys(stats) as Array<keyof typeof stats>).map(key => (
                                        <div key={key} className="flex flex-col items-center gap-2 p-4 bg-[#111] border border-[#333]">
                                            <span className="text-xs uppercase text-[#666] font-bold">{key}</span>
                                            <input
                                                type="number" max={20} min={1}
                                                value={stats[key]}
                                                onChange={(e) => handleStatChange(key, e.target.value)}
                                                className="w-12 bg-transparent text-center text-2xl font-bold text-white focus:text-[#a32222] outline-none"
                                            />
                                            <span className="text-xs text-[#444] font-mono">{Math.floor((stats[key] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stats[key] - 10) / 2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Class Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-[#111] p-6 border border-[#333]">
                                    <h4 className="text-[#a32222] font-bold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Class Traits</h4>
                                    <ul className="space-y-2 text-sm text-[#ccc]">
                                        {selectedClass?.traits.map(t => <li key={t} className="flex gap-2"><div className="w-1 h-1 bg-[#555] rounded-full mt-2" />{t}</li>)}
                                        {/* SUBCLASS FEATURES */}
                                        {selectedClass?.subclasses?.[subclassIndex] && (
                                            <>
                                                <li className="mt-4 font-bold text-[#a32222] uppercase text-xs tracking-widest">{selectedClass.subclasses[subclassIndex].name} Traits</li>
                                                {selectedClass.subclasses[subclassIndex].features.map(f => (
                                                    <li key={f} className="flex gap-2"><div className="w-1 h-1 bg-[#a32222] rounded-full mt-2" />{f}</li>
                                                ))}
                                            </>
                                        )}
                                    </ul>
                                </div>
                                <div className="bg-[#111] p-6 border border-[#333]">
                                    <h4 className="text-[#a32222] font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Proficiencies & Saves</h4>
                                    <div className="text-sm text-[#ccc] space-y-4">
                                        <div>
                                            <strong className="text-[#666] text-xs uppercase block mb-1">Saving Throws</strong>
                                            {selectedClass?.saves.join(", ")}
                                        </div>
                                        <div>
                                            <strong className="text-[#666] text-xs uppercase block mb-1">Proficiencies</strong>
                                            {selectedClass?.proficiencies.join(", ")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SPELLS TAB */}
                    {activeTab === 'spells' && selectedClass?.spellcasting && (
                        <div className="animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#d4c391]">Prepare Incantations (Lvl 20 {selectedClass.name})</h3>
                                <div className="text-xs text-[#666]">
                                    <span className="mr-4">Cantrips: {knownSpells.size} / {selectedClass.spellcasting.cantripsKnown}</span>
                                    {selectedClass.spellcasting.type === 'known' ? (
                                        <span>Spells Known: {knownSpells.size} / {selectedClass.spellcasting.spellsKnown}</span>
                                    ) : (
                                        <span>Prepared: {preparedSpells.size} / {Math.floor((stats[selectedClass.spellcasting.ability] - 10) / 2) + 20}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[500px]">
                                {/* AVAILABLE */}
                                <div className="border border-[#333] bg-[#111] flex flex-col h-[400px] md:h-auto">
                                    <div className="p-3 border-b border-[#333] bg-[#050505] font-bold text-sm text-[#888]">Available Spells</div>
                                    <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                                        {(() => {
                                            const grouped: Record<string, typeof availableSpells> = { "Cantrips": [], "Level 1": [], "Level 2": [], "Level 3": [], "Level 4": [], "Level 5": [], "Level 6": [], "Level 7": [], "Level 8": [], "Level 9": [] };

                                            availableSpells.forEach(s => {
                                                const key = (s.level === '0' || s.level === 'Cantrip') ? 'Cantrips' : `Level ${s.level}`;
                                                if (!grouped[key]) grouped[key] = [];
                                                grouped[key].push(s);
                                            });

                                            return Object.entries(grouped).map(([level, spells]) => {
                                                if (spells.length === 0) return null;
                                                return (
                                                    <details key={level} className="mb-2 group" open={level === "Cantrips" || level === "Level 1" || level === "Level 9"}>
                                                        <summary className="font-bold text-[#d4c391] bg-[#1a1a1a] p-2 cursor-pointer hover:bg-[#222] select-none flex items-center justify-between border-l-2 border-transparent group-open:border-[#a32222] transition-all">
                                                            {level} <span className="text-xs text-[#666] bg-[#0a0a0a] px-2 py-0.5 rounded-full">{spells.length}</span>
                                                        </summary>
                                                        <div className="grid grid-cols-1 gap-1 p-2 bg-[#050505]/50">
                                                            {spells.map(spell => {
                                                                const isKnown = knownSpells.has(spell.name) || preparedSpells.has(spell.name);
                                                                const isCantrip = spell.level === "0" || spell.level === "Cantrip";
                                                                return (
                                                                    <div key={spell.name}
                                                                        onClick={() => toggleSpell(spell.name, isCantrip)}
                                                                        className={`p-2 flex justify-between items-center text-sm cursor-pointer hover:bg-[#222] transition-colors ${isKnown ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}
                                                                    >
                                                                        <span className={isKnown ? "text-green-600 font-bold decoration-line-through decoration-green-800" : "text-[#ccc]"}>{spell.name}</span>
                                                                        {isKnown && <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Prepared</span>}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </details>
                                                )
                                            });
                                        })()}
                                    </div>
                                </div>

                                {/* PREPARED */}
                                <div className="border border-[#333] bg-[#1a0505] flex flex-col h-[400px] md:h-auto">
                                    <div className="p-3 border-b border-[#333] bg-[#050505] font-bold text-sm text-[#a32222]">My Grimoire</div>
                                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                                        <div className="text-xs uppercase text-[#666] font-bold mt-2 mb-1 px-2">Cantrips</div>
                                        {Array.from(knownSpells).filter(s => {
                                            const spell = ALL_SPELLS.find(sp => sp.name === s);
                                            return spell && (spell.level === "0" || spell.level === "Cantrip");
                                        }).map(s => (
                                            <div key={s} onClick={() => toggleSpell(s, true)} className="px-2 py-1 text-sm text-[#ccc] hover:bg-[#330000] cursor-pointer flex justify-between">
                                                {s} <Zap className="w-3 h-3 text-yellow-600" />
                                            </div>
                                        ))}

                                        <div className="text-xs uppercase text-[#666] font-bold mt-4 mb-1 px-2">Leveled Spells</div>
                                        {Array.from(selectedClass.spellcasting.type === 'known' ? knownSpells : preparedSpells).filter(s => {
                                            const spell = ALL_SPELLS.find(sp => sp.name === s);
                                            return spell && (spell.level !== "0" && spell.level !== "Cantrip");
                                        }).map(s => (
                                            <div key={s} onClick={() => toggleSpell(s, false)} className="px-2 py-1 text-sm text-[#ccc] hover:bg-[#330000] cursor-pointer flex justify-between">
                                                {s} <span className="text-[10px] font-mono border border-[#444] px-1 rounded">{ALL_SPELLS.find(sp => sp.name === s)?.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GEAR TAB */}
                    {activeTab === 'gear' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[#d4c391]">Loadout</h3>
                                <button onClick={() => setShowItemForge(true)} className="px-4 py-2 border border-[#a32222] text-[#a32222] hover:bg-[#a32222] hover:text-white transition-all text-sm flex items-center gap-2">
                                    <Hammer className="w-4 h-4" /> Forge Custom Item
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <div className="grid grid-cols-1 gap-8 pb-12">
                                    {/* Standard Items Sorted by Type */}
                                    {(['weapon', 'armor', 'gear'] as const).map(type => (
                                        <div key={type}>
                                            <h4 className="text-[#a32222] font-bold uppercase tracking-widest border-b border-[#333] mb-4 pb-2 flex items-center gap-2">
                                                {type === 'weapon' && <Sword className="w-5 h-5" />}
                                                {type === 'armor' && <Shield className="w-5 h-5" />}
                                                {type === 'gear' && <Crown className="w-5 h-5" />}
                                                {type === 'gear' ? 'Wondrous Items & Artifacts' : `${type}s`}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {STARTING_EQUIPMENT.filter(i => i.type === type).map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleToggleEquip(item.id)}
                                                        className={`flex justify-between items-start p-4 cursor-pointer border transition-all hover:scale-[1.02] active:scale-95 ${equipment.has(item.id) ? 'border-[#d4c391] bg-[#1a1818] shadow-lg shadow-[#d4c391]/10' : 'border-[#222] bg-[#111] hover:bg-[#1a1a1a] opacity-80 hover:opacity-100'}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`font-bold block text-sm ${equipment.has(item.id) ? 'text-[#d4c391]' : 'text-[#aaa]'}`}>{item.name}</span>
                                                            <span className="text-xs text-[#555] italic">{item.stats}</span>
                                                        </div>
                                                        {equipment.has(item.id) && <div className="w-3 h-3 bg-[#d4c391] rotate-45 shadow-[0_0_10px_#d4c391]"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Custom Items */}
                                    {customItems.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleToggleEquip(item.id)}
                                            className={`flex justify-between items-center p-4 cursor-pointer border transition-all ${equipment.has(item.id) ? 'border-cyan-500 bg-[#0a1a1a]' : 'border-[#222] bg-[#111] hover:bg-[#1a1a1a]'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 flex items-center justify-center text-cyan-400 font-bold">C</div>
                                                <div>
                                                    <span className="font-bold block text-sm text-cyan-200">{item.name}</span>
                                                    <span className="text-xs text-cyan-400/50">{item.stats}</span>
                                                </div>
                                            </div>
                                            {equipment.has(item.id) && <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>


            </div>

            {/* RIGHT: Character Card Preview (Hidden on mobile unless toggled) */}
            <div className={`
                fixed inset-0 z-[150] bg-[#1a1a1a] overflow-y-auto transition-transform duration-300
                md:static md:w-96 md:bg-[url('/textures/paper_texture.jpg')] md:bg-cover md:inset-auto md:translate-x-0 md:border-l-4 md:border-[#1a1a1a] md:shadow-2xl md:z-auto
                ${showMobilePreview ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full border-2 border-[#1a1a1a] p-6 flex flex-col bg-[#e6dac3] text-[#1a1a1a] min-h-screen md:min-h-0 relative">
                    <button onClick={() => setShowMobilePreview(false)} className="md:hidden absolute top-2 right-2 p-2 bg-black/10 rounded-full">
                        <User className="w-6 h-6" />
                    </button>
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-[#ccc] border-2 border-[#1a1a1a] flex items-center justify-center">
                            <span className="text-4xl">?</span>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase tracking-tighter border-b-2 border-[#1a1a1a] pb-1">{name}</h2>
                            <p className="text-xs font-bold uppercase mt-1">
                                {selectedRace?.name} {selectedClass?.name}
                                {selectedClass?.subclasses && <span className="text-[#a32222]"> [{selectedClass.subclasses[subclassIndex].name}]</span>}
                            </p>
                            <p className="text-xs font-mono mt-1">Lvl 20 • {alignment} • {selectedBackground?.name}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                        <div className="border border-[#1a1a1a] p-1">
                            <span className="block text-[10px] uppercase font-bold">AC</span>
                            <span className="text-xl font-bold">{10 + Math.floor((stats.dex - 10) / 2)}</span>
                        </div>
                        <div className="border border-[#1a1a1a] p-1">
                            <span className="block text-[10px] uppercase font-bold">HP</span>
                            <span className="text-xl font-bold">{calculateHp()}</span>
                        </div>
                        <div className="border border-[#1a1a1a] p-1">
                            <span className="block text-[10px] uppercase font-bold">Init</span>
                            <span className="text-xl font-bold">{Math.floor((stats.dex - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stats.dex - 10) / 2)}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div>
                            <h4 className="font-bold border-b border-[#1a1a1a] mb-1 text-sm">Stats</h4>
                            <div className="grid grid-cols-2 text-xs">
                                {(Object.entries(stats)).map(([k, v]) => (
                                    <div key={k} className="flex justify-between">
                                        <span className="uppercase">{k}:</span>
                                        <span className="font-bold">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {selectedClass?.spellcasting && (
                            <div>
                                <h4 className="font-bold border-b border-[#1a1a1a] mb-1 text-sm">Magic</h4>
                                <div className="text-xs">
                                    <div className="flex justify-between"><span>DC:</span> <strong>{8 + Math.floor((stats[selectedClass.spellcasting.ability] - 10) / 2) + 6}</strong></div>
                                    <div className="flex justify-between"><span>Atk:</span> <strong>+{Math.floor((stats[selectedClass.spellcasting.ability] - 10) / 2) + 6}</strong></div>
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold border-b border-[#1a1a1a] mb-1 text-sm">Equipment</h4>
                            <ul className="text-xs list-disc pl-4">
                                {Array.from(equipment).map(id => {
                                    const item = STARTING_EQUIPMENT.find(i => i.id === id) || customItems.find(i => i.id === id);
                                    return <li key={id}>{item?.name}</li>
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={exportCharacter} className="flex-1 py-3 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors uppercase font-bold text-xs flex items-center justify-center gap-2">
                            <Save className="w-3 h-3" /> Save JSON
                        </button>
                    </div>
                    <button onClick={handleFinish} className="w-full mt-4 py-4 bg-[#8a1c1c] text-[#f4e8d1] font-bold uppercase tracking-widest hover:bg-[#a32222] transition-colors shadow-lg flex items-center justify-center gap-2">
                        <Sword className="w-4 h-4" /> Start Game
                    </button>

                </div>
            </div>

            {/* CUSTOM ITEM FORGE MODAL */}
            {showItemForge && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-[#a32222] p-8 w-full max-w-md shadow-[0_0_50px_rgba(163,34,34,0.3)]">
                        <h3 className="text-2xl font-bold text-[#a32222] mb-6 flex items-center gap-2"><Hammer className="w-6 h-6" /> The Forge</h3>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs uppercase text-[#666]">Item Name</label>
                                <input value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-black border border-[#333] p-3 text-white focus:border-[#a32222] outline-none" placeholder="Ex: Sword of a Thousand Truths" />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-[#666]">Type</label>
                                <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="w-full bg-black border border-[#333] p-3 text-white">
                                    <option value="weapon">Weapon</option>
                                    <option value="armor">Armor</option>
                                    <option value="gear">Wondrous Item</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-[#666]">Stats / Effects</label>
                                <textarea value={newItemStats} onChange={e => setNewItemStats(e.target.value)} className="w-full bg-black border border-[#333] p-3 text-white focus:border-[#a32222] outline-none h-24" placeholder="+3 to hit, deals 2d8 fire damage..." />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowItemForge(false)} className="px-6 py-2 text-[#666] hover:text-white">Cancel</button>
                            <button onClick={createCustomItem} className="px-6 py-2 bg-[#a32222] text-white font-bold uppercase tracking-widest hover:bg-[#c42828]">Forge It</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

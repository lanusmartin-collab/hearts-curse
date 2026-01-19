"use client";

import React, { useState } from "react";
import { Dices, Save, Sword, Shield, Crown, Scroll, Ghost, User, BookOpen, Hammer, Heart, Zap } from "lucide-react";
import { Combatant } from "@/types/combat";
import { RACES } from "@/lib/data/races";
import { ALIGNMENTS } from "@/lib/data/alignments";
import { STARTING_EQUIPMENT } from "@/lib/data/equipment";

interface AdvancedCharacterCreationProps {
    onComplete: (character: Combatant) => void;
}

// EXPANDED DATA MOCKS
const CLASSES = [
    {
        id: 'paladin', name: 'Paladin', hp: 10, ac: 18,
        traits: ['Divine Sense', 'Lay on Hands', 'Fighting Style', 'Divine Smite', 'Extra Attack', 'Aura of Protection'],
        spells: ['Bless', 'Command', 'Cure Wounds', 'Shield of Faith', 'Find Steed', 'Zone of Truth']
    },
    {
        id: 'wizard', name: 'Wizard', hp: 6, ac: 12,
        traits: ['Arcane Recovery', 'Spellcasting', 'Arcane Tradition', 'Spell Mastery', 'Signature Spells'],
        spells: ['Magic Missile', 'Shield', 'Mage Armor', 'Fireball', 'Counterspell', 'Wish', 'Meteor Swarm']
    },
    {
        id: 'rogue', name: 'Rogue', hp: 8, ac: 15,
        traits: ['Sneak Attack', 'Cunning Action', 'Uncanny Dodge', 'Evasion', 'Reliable Talent', 'Elusive'],
        spells: []
    },
    {
        id: 'cleric', name: 'Cleric', hp: 8, ac: 16,
        traits: ['Spellcasting', 'Divine Domain', 'Channel Divinity', 'Destroy Undead', 'Divine Intervention'],
        spells: ['Cure Wounds', 'Guiding Bolt', 'Spiritual Weapon', 'Spirit Guardians', 'Heal', 'True Resurrection']
    },
    {
        id: 'fighter', name: 'Fighter', hp: 10, ac: 17,
        traits: ['Fighting Style', 'Second Wind', 'Action Surge', 'Extra Attack (3)', 'Indomitable'],
        spells: []
    },
];

const RACIAL_TRAITS: Record<string, string[]> = {
    human: ["+1 to All Stats", "Extra Language"],
    elf: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    dwarf: ["Darkvision", "Dwarven Resilience", "Combat Training", "Stonecunning"],
    tiefling: ["Darkvision", "Hellish Resistance", "Infernal Legacy"]
};

export default function AdvancedCharacterCreation({ onComplete }: AdvancedCharacterCreationProps) {
    // TABS
    const [activeTab, setActiveTab] = useState<'identity' | 'stats' | 'gear'>('identity');

    // IDENTITY
    const [name, setName] = useState("Hero");
    const [raceId, setRaceId] = useState("human");
    const [classId, setClassId] = useState("paladin");
    const [alignment, setAlignment] = useState(ALIGNMENTS[0]);

    // STATS
    const [stats, setStats] = useState({ str: 15, dex: 10, con: 14, int: 10, wis: 12, cha: 14 });
    const [hpMode, setHpMode] = useState<'max' | 'rolled'>('max');
    const [rolledHp, setRolledHp] = useState<number | null>(null);

    // GEAR
    const [equipment, setEquipment] = useState<Set<string>>(new Set());
    const [customItems, setCustomItems] = useState<{ id: string, name: string, type: 'weapon' | 'armor' | 'gear', stats: string }[]>([]);

    // MODAL STATE
    const [showItemForge, setShowItemForge] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState<any>("weapon");
    const [newItemStats, setNewItemStats] = useState("");

    const selectedRace = RACES.find(r => r.id === raceId);
    const selectedClass = CLASSES.find(c => c.id === classId);

    // LOGIC
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
            // Level 1: Max + Mod. Levels 2-20: Avg + Mod.
            // Actually user asked for "Max HP if he wants", implying full max for all levels?
            // "set it up to max if he wants". I'll treat this as MAX POSSIBLE HP.
            // Lvl 1: HitDie + Mod. Lvl 2-20: HitDie + Mod.
            return (hitDie + conMod) * 20;
        } else {
            if (rolledHp) return rolledHp;
            return (hitDie + conMod) + ((hitDie / 2 + 1 + conMod) * 19); // Fallback to Average if not rolled
        }
    };

    const rollHp = () => {
        const conMod = Math.floor((stats.con - 10) / 2);
        const hitDie = selectedClass?.hp || 10;
        let total = hitDie + conMod; // Lvl 1 is always max
        for (let i = 2; i <= 20; i++) {
            total += Math.ceil(Math.random() * hitDie) + conMod;
        }
        setRolledHp(total);
        setHpMode('rolled');
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

    const createCharacterObject = (): Combatant => {
        const hp = calculateHp();

        let ac = 10 + Math.floor((stats.dex - 10) / 2);
        if (selectedClass?.ac) ac = selectedClass.ac;

        // Merge standard and custom items
        const equippedNames = [
            ...Array.from(equipment).map(id => STARTING_EQUIPMENT.find(i => i.id === id)?.name),
            ...customItems.filter(i => equipment.has(i.id)).map(i => i.name)
        ].filter(Boolean) as string[];

        return {
            id: `player-${Date.now()}`,
            name,
            type: 'player',
            level: 20,
            race: raceId,
            alignment,
            equipment: equippedNames,
            hp,
            maxHp: hp,
            ac,
            initiative: 0,
            conditions: [],
            stats,
            attacks: [
                { name: "Main Attack", bonus: 11, damage: "2d6+5" }, // Placeholder
                ...(selectedClass?.spells && selectedClass.spells.length > 0 ? [{ name: "Cast Spell", bonus: 0, damage: "Effect" }] : [])
            ]
        };
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
        <div className="fixed inset-0 bg-[#0a0a0c] text-[#d4c391] z-[100] font-serif overflow-hidden flex">

            {/* LEFT: Tab Navigation */}
            <div className="w-20 bg-[#050505] border-r border-[#333] flex flex-col items-center py-8 gap-8">
                <button onClick={() => setActiveTab('identity')} className={`p-3 rounded-xl transition-all ${activeTab === 'identity' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <User className="w-6 h-6" />
                </button>
                <button onClick={() => setActiveTab('stats')} className={`p-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <Dices className="w-6 h-6" />
                </button>
                <button onClick={() => setActiveTab('gear')} className={`p-3 rounded-xl transition-all ${activeTab === 'gear' ? 'bg-[#a32222] text-white shadow-lg shadow-red-900/20' : 'text-[#444] hover:text-[#bbb]'}`}>
                    <Sword className="w-6 h-6" />
                </button>
            </div>

            {/* CENTER: Work Area */}
            <div className="flex-1 bg-[#0a0a0c] p-8 overflow-y-auto custom-scrollbar relative">
                <h2 className="text-3xl font-bold text-[#a32222] mb-8 uppercase tracking-widest border-b border-[#333] pb-4">
                    {activeTab === 'identity' && "Identity & Origin"}
                    {activeTab === 'stats' && "Ability Scores & Class"}
                    {activeTab === 'gear' && "Arsenal & Equipment"}
                </h2>

                <div className="max-w-3xl mx-auto space-y-8 pb-32">

                    {/* IDENTITY TAB */}
                    {activeTab === 'identity' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#666]">Character Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#111] border border-[#333] p-4 text-xl text-white focus:border-[#a32222] outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-[#666]">Race</label>
                                    <select value={raceId} onChange={e => setRaceId(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3">
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
                                    <label className="text-xs uppercase tracking-widest text-[#666]">Alignment</label>
                                    <select value={alignment} onChange={e => setAlignment(e.target.value as any)} className="w-full bg-[#111] border border-[#333] p-3">
                                        {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[#666]">Class</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {CLASSES.map(cls => (
                                        <button key={cls.id} onClick={() => setClassId(cls.id)} className={`p-4 border transition-all flex flex-col items-center gap-2 ${classId === cls.id ? 'bg-[#a32222] border-[#ff4444] text-white' : 'bg-[#111] border-[#333] text-[#666] hover:border-[#666]'}`}>
                                            <span className="font-bold text-sm">{cls.name}</span>
                                            <span className="text-[10px] opacity-60">d{cls.hp} Hit Die</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                                <div className="grid grid-cols-6 gap-4">
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

                            {/* HP Calculator */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#222] pb-2">
                                    <h3 className="text-lg font-bold text-[#d4c391]">Hit Points (Level 20)</h3>
                                </div>
                                <div className="flex items-center gap-8 bg-[#111] p-6 border border-[#333]">
                                    <div className="flex items-center gap-6">
                                        <button onClick={() => setHpMode('max')} className={`px-4 py-2 border ${hpMode === 'max' ? 'bg-[#222] border-[#d4c391] text-[#d4c391]' : 'border-[#333] text-[#444]'}`}>Max HP</button>
                                        <button onClick={rollHp} className={`px-4 py-2 border ${hpMode === 'rolled' ? 'bg-[#222] border-[#d4c391] text-[#d4c391]' : 'border-[#333] text-[#444]'}`}>Roll HP</button>
                                    </div>
                                    <div className="text-4xl font-bold text-white flex items-center gap-2">
                                        <Heart className="w-8 h-8 text-[#a32222] fill-current" />
                                        {calculateHp()} <span className="text-sm text-[#444] font-normal ml-2">Total HP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Class Features */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-[#111] p-6 border border-[#333]">
                                    <h4 className="text-[#a32222] font-bold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Class Traits</h4>
                                    <ul className="space-y-2 text-sm text-[#ccc]">
                                        {selectedClass?.traits.map(t => <li key={t} className="flex gap-2"><div className="w-1 h-1 bg-[#555] rounded-full mt-2" />{t}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-[#111] p-6 border border-[#333]">
                                    <h4 className="text-[#a32222] font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> Spellcasting / Abilities</h4>
                                    {selectedClass?.spells && selectedClass.spells.length > 0 ? (
                                        <ul className="space-y-2 text-sm text-[#ccc]">
                                            {selectedClass.spells.map(s => <li key={s} className="italic text-cyan-100/70">{s}</li>)}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-[#444] italic">This class relies on martial prowess rather than magic.</p>
                                    )}
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
                                {/* Standard Items */}
                                {STARTING_EQUIPMENT.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleEquip(item.id)}
                                        className={`flex justify-between items-center p-4 cursor-pointer border transition-all ${equipment.has(item.id) ? 'border-[#d4c391] bg-[#1a1818]' : 'border-[#222] bg-[#111] hover:bg-[#1a1a1a]'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.type === 'weapon' && <Sword className="w-5 h-5 text-red-500" />}
                                            {item.type === 'armor' && <Shield className="w-5 h-5 text-blue-500" />}
                                            {item.type === 'gear' && <Crown className="w-5 h-5 text-yellow-500" />}
                                            <div>
                                                <span className="font-bold block text-sm">{item.name}</span>
                                                <span className="text-xs text-[#666]">{item.stats}</span>
                                            </div>
                                        </div>
                                        {equipment.has(item.id) && <div className="w-2 h-2 bg-[#d4c391] rounded-full shadow-[0_0_10px_#d4c391]"></div>}
                                    </div>
                                ))}

                                {/* Custom Items */}
                                {customItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleEquip(item.id)}
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
                    )}
                </div>
            </div>

            {/* RIGHT: Character Card Preview */}
            <div className="w-96 bg-[url('/textures/paper_texture.jpg')] bg-cover text-[#1a1a1a] p-8 border-l-4 border-[#1a1a1a] shadow-2xl relative">
                <div className="h-full border-2 border-[#1a1a1a] p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 bg-[#ccc] border-2 border-[#1a1a1a] flex items-center justify-center">
                            <span className="text-4xl">?</span>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase tracking-tighter border-b-2 border-[#1a1a1a] pb-1">{name}</h2>
                            <p className="text-xs font-bold uppercase mt-1">{selectedRace?.name} {selectedClass?.name}</p>
                            <p className="text-xs font-mono mt-1">Lvl 20 • {alignment}</p>
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

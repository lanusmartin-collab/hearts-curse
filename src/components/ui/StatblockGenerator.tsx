"use client";

import { useState } from "react";
import { Statblock } from "@/lib/data/statblocks";
import { Plus, Trash2, Save, Wand2 } from "lucide-react";

// Helper to calculate modifiers
const getMod = (score: number) => Math.floor((score - 10) / 2);

export default function StatblockGenerator({ onSave }: { onSave: (sb: Statblock) => void }) {
    const [sb, setSb] = useState<Partial<Statblock>>({
        name: "New Creature",
        size: "Medium",
        type: "Humanoid",
        alignment: "Unaligned",
        ac: 10,
        armorType: "None",
        hp: 10,
        hitDice: "1d8",
        speed: "30 ft.",
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
        cr: "0",
        xp: 0,
        traits: [],
        actions: []
    });

    const handleChange = (field: string, value: string | number) => {
        setSb(prev => ({ ...prev, [field]: value }));
    };

    const handleStatChange = (stat: string, value: number) => {
        setSb(prev => ({
            ...prev,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stats: { ...prev.stats, [stat]: value } as any
        }));
    };

    const addTrait = () => {
        setSb(prev => ({
            ...prev,
            traits: [...(prev.traits || []), { name: "New Trait", desc: "Description" }]
        }));
    };

    const updateTrait = (index: number, field: "name" | "desc", value: string) => {
        const newTraits = [...(sb.traits || [])];
        newTraits[index][field] = value;
        setSb(prev => ({ ...prev, traits: newTraits }));
    };

    const removeTrait = (index: number) => {
        const newTraits = (sb.traits || []).filter((_, i) => i !== index);
        setSb(prev => ({ ...prev, traits: newTraits }));
    };

    const addAction = () => {
        setSb(prev => ({
            ...prev,
            actions: [...(prev.actions || []), { name: "Attack", desc: "Attack description" }]
        }));
    };

    const updateAction = (index: number, field: "name" | "desc", value: string) => {
        const newActions = [...(sb.actions || [])];
        newActions[index][field] = value;
        setSb(prev => ({ ...prev, actions: newActions }));
    };

    const removeAction = (index: number) => {
        const newActions = (sb.actions || []).filter((_, i) => i !== index);
        setSb(prev => ({ ...prev, actions: newActions }));
    };

    const save = () => {
        if (sb.name && sb.stats) {
            onSave(sb as Statblock);
            // Parent handles UI feedback
        }
    };

    if (!sb.stats) return null;

    const inputClass = "w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[#d4d4d4] focus:border-[var(--gold-accent)] outline-none transition-colors";
    const labelClass = "block text-[10px] font-mono text-[#666] uppercase tracking-wider mb-1";
    const sectionClass = "bg-[#111] border border-[#333] p-4 rounded mb-6";

    return (
        <div className="bg-[#0e0e0e] border border-[#333] p-6 rounded shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
                <h3 className="text-lg font-header text-[var(--gold-accent)] tracking-widest flex items-center gap-2">
                    <Wand2 className="w-4 h-4" /> Creature Forge
                </h3>
                <span className="text-xs font-mono text-[#444]">5E 2024 COMPATIBLE</span>
            </div>

            {/* Basic Info */}
            <div className={sectionClass}>
                <h4 className="text-xs font-bold text-[#888] uppercase mb-4 border-b border-[#222] pb-2">Core Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className={labelClass}>Name</label>
                        <input className={inputClass} value={sb.name} onChange={e => handleChange("name", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Type</label>
                        <input className={inputClass} value={sb.type} onChange={e => handleChange("type", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Size</label>
                        <input className={inputClass} value={sb.size} onChange={e => handleChange("size", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Alignment</label>
                        <input className={inputClass} value={sb.alignment} onChange={e => handleChange("alignment", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Accessory</label>
                        <input className={inputClass} type="text" placeholder="Armor Type" value={sb.armorType} onChange={e => handleChange("armorType", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Armor Class</label>
                        <input className={inputClass} type="number" value={sb.ac} onChange={e => handleChange("ac", parseInt(e.target.value))} />
                    </div>
                    <div>
                        <label className={labelClass}>Hit Points</label>
                        <input className={inputClass} type="number" value={sb.hp} onChange={e => handleChange("hp", parseInt(e.target.value))} />
                    </div>
                    <div>
                        <label className={labelClass}>Hit Dice</label>
                        <input className={inputClass} value={sb.hitDice} onChange={e => handleChange("hitDice", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>Speed</label>
                        <input className={inputClass} value={sb.speed} onChange={e => handleChange("speed", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>CR</label>
                        <input className={inputClass} value={sb.cr} onChange={e => handleChange("cr", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelClass}>XP</label>
                        <input className={inputClass} type="number" value={sb.xp} onChange={e => handleChange("xp", parseInt(e.target.value))} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className={sectionClass}>
                <h4 className="text-xs font-bold text-[#888] uppercase mb-4 border-b border-[#222] pb-2">Ability Scores</h4>
                <div className="flex gap-2 justify-between">
                    {Object.keys(sb.stats).map(stat => (
                        <div key={stat} className="text-center flex-1">
                            <div className="text-[10px] font-bold text-[#666] uppercase mb-1">{stat}</div>
                            <input
                                type="number"
                                className={`${inputClass} text-center font-bold text-lg h-12`}
                                value={(sb.stats as Record<string, number>)[stat]}
                                onChange={e => handleStatChange(stat, parseInt(e.target.value))}
                            />
                            <div className="text-xs text-[var(--gold-accent)] mt-1 font-mono">
                                {getMod((sb.stats as Record<string, number>)[stat]) > 0 ? "+" : ""}
                                {getMod((sb.stats as Record<string, number>)[stat])}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dynamic Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={sectionClass}>
                    <div className="flex justify-between items-center mb-4 border-b border-[#222] pb-2">
                        <h4 className="text-xs font-bold text-[#888] uppercase">Traits & Features</h4>
                        <button onClick={addTrait} className="text-[var(--gold-accent)] hover:text-white transition">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {sb.traits?.map((t, i) => (
                            <div key={i} className="group relative bg-[#0a0a0a] border border-[#222] p-3 rounded hover:border-[#444] transition-colors">
                                <button onClick={() => removeTrait(i)} className="absolute right-2 top-2 text-[#444] hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <input
                                    className="bg-transparent text-[#d4d4d4] font-bold text-sm w-[90%] mb-1 outline-none border-b border-transparent focus:border-[var(--gold-accent)]"
                                    value={t.name}
                                    onChange={e => updateTrait(i, "name", e.target.value)}
                                    placeholder="Trait Name"
                                />
                                <textarea
                                    className="bg-transparent text-[#888] text-xs w-full resize-none outline-none min-h-[60px]"
                                    value={t.desc}
                                    onChange={e => updateTrait(i, "desc", e.target.value)}
                                    placeholder="Trait Description..."
                                />
                            </div>
                        ))}
                        {sb.traits?.length === 0 && <div className="text-center text-xs text-[#333] italic py-4">No traits added.</div>}
                    </div>
                </div>

                <div className={sectionClass}>
                    <div className="flex justify-between items-center mb-4 border-b border-[#222] pb-2">
                        <h4 className="text-xs font-bold text-[#888] uppercase">Actions & Attacks</h4>
                        <button onClick={addAction} className="text-[var(--gold-accent)] hover:text-white transition">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {sb.actions?.map((a, i) => (
                            <div key={i} className="group relative bg-[#0a0a0a] border border-[#222] p-3 rounded hover:border-[#444] transition-colors">
                                <button onClick={() => removeAction(i)} className="absolute right-2 top-2 text-[#444] hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                <input
                                    className="bg-transparent text-[#d4d4d4] font-bold text-sm w-[90%] mb-1 outline-none border-b border-transparent focus:border-[var(--gold-accent)]"
                                    value={a.name}
                                    onChange={e => updateAction(i, "name", e.target.value)}
                                    placeholder="Action Name"
                                />
                                <textarea
                                    className="bg-transparent text-[#888] text-xs w-full resize-none outline-none min-h-[60px]"
                                    value={a.desc}
                                    onChange={e => updateAction(i, "desc", e.target.value)}
                                    placeholder="Action Description..."
                                />
                            </div>
                        ))}
                        {sb.actions?.length === 0 && <div className="text-center text-xs text-[#333] italic py-4">No actions added.</div>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={save}
                    className="bg-[var(--gold-accent)] hover:bg-white text-black font-bold py-3 px-8 rounded uppercase tracking-widest text-sm flex items-center gap-2 transition shadow-lg hover:shadow-gold-glow"
                >
                    <Save className="w-4 h-4" /> Save Creature
                </button>
            </div>
        </div>
    );
}

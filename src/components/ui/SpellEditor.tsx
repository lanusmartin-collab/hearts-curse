"use client";

import { useState, useEffect } from "react";
import { Spell } from "@/lib/data/spells";
import { Save, RefreshCw, Wand2 } from "lucide-react";

export default function SpellEditor({ onSave, initialData }: { onSave: (spell: Spell) => void, initialData?: Spell }) {
    const [spell, setSpell] = useState<Spell>({
        name: "",
        level: "Cantrip",
        school: "Evocation",
        castingTime: "1 action",
        range: "60 feet",
        components: "V, S",
        duration: "Instantaneous",
        description: "",
        classes: ["Wizard"]
    });

    useEffect(() => {
        if (initialData) setSpell(initialData);
    }, [initialData]);

    const handleChange = (field: keyof Spell, value: any) => {
        setSpell(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!spell.name || !spell.description) {
            alert("Name and Description are required.");
            return;
        }
        onSave(spell);
    };

    const schools = ["Abjuration", "Conjuration", "Divination", "Enchantment", "Evocation", "Illusion", "Necromancy", "Transmutation"];
    const levels = ["Cantrip", "1st-level", "2nd-level", "3rd-level", "4th-level", "5th-level", "6th-level", "7th-level", "8th-level", "9th-level"];

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* INPUT FORM */}
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <div className="bg-[#111] p-6 border border-[#333] space-y-4 shadow-lg relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#444]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#444]"></div>

                    <h3 className="text-[#a32222] font-header tracking-widest text-lg border-b border-[#333] pb-2 mb-4 flex items-center gap-2">
                        <Wand2 className="w-5 h-5" /> SPELL INSCRIPTION
                    </h3>

                    {/* Name & Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Spell Name</label>
                            <input
                                type="text"
                                value={spell.name}
                                onChange={e => handleChange("name", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#e0e0e0] focus:border-[#a32222] outline-none font-header tracking-wide"
                                placeholder="e.g. Arcane Thunderbolt"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Level</label>
                            <select
                                value={spell.level}
                                onChange={e => handleChange("level", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none appearance-none"
                            >
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* School & Casting Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">School</label>
                            <select
                                value={spell.school}
                                onChange={e => handleChange("school", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none appearance-none"
                            >
                                {schools.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Casting Time</label>
                            <input
                                type="text"
                                value={spell.castingTime}
                                onChange={e => handleChange("castingTime", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                            />
                        </div>
                    </div>

                    {/* Range, Components, Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Range</label>
                            <input
                                type="text"
                                value={spell.range}
                                onChange={e => handleChange("range", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Components</label>
                            <input
                                type="text"
                                value={spell.components}
                                onChange={e => handleChange("components", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                                placeholder="V, S, M"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Duration</label>
                            <input
                                type="text"
                                value={spell.duration}
                                onChange={e => handleChange("duration", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                            />
                        </div>
                    </div>

                    {/* Classes */}
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Available Classes (Comma sep)</label>
                        <input
                            type="text"
                            value={spell.classes?.join(", ")}
                            onChange={e => handleChange("classes", e.target.value.split(",").map(s => s.trim()))}
                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                            placeholder="Wizard, Sorcerer"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Description (Markdown Supported)</label>
                        <textarea
                            value={spell.description}
                            onChange={e => handleChange("description", e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none min-h-[200px] font-serif leading-relaxed"
                            placeholder="A beam of crackling energy streaks toward a creature within range..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-[#a32222] text-white py-3 font-header tracking-widest hover:bg-[#c42828] transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> SCRIBE SPELL
                    </button>
                </div>
            </div>

            {/* PREVIEW CARD */}
            <div className="w-full lg:w-[400px] shrink-0">
                <div className="sticky top-4">
                    <h4 className="text-center text-[#666] font-mono text-xs uppercase tracking-[0.2em] mb-4">// PREVIEW OUTPUT</h4>

                    <div className="bg-[#f0e6d2] p-6 text-[#1a1a1a] shadow-[0_0_30px_rgba(0,0,0,0.5)] relative font-serif border-y-4 border-[#8b7e66]">
                        <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

                        <h2 className="font-header text-2xl text-[#5c1212] tracking-wide mb-1 leading-none">{spell.name || "Unknown Spell"}</h2>
                        <div className="text-sm italic text-[#444] mb-4 font-serif">
                            {spell.level} {spell.school?.toLowerCase()}
                        </div>

                        <div className="space-y-1 text-sm text-[#2c1a1a] border-b border-[#bfa87a] pb-4 mb-4">
                            <div><strong>Casting Time:</strong> {spell.castingTime}</div>
                            <div><strong>Range:</strong> {spell.range}</div>
                            <div><strong>Components:</strong> {spell.components}</div>
                            <div><strong>Duration:</strong> {spell.duration}</div>
                        </div>

                        <div className="text-sm leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
                            {spell.description || "The ancient runes are fading..."}
                        </div>

                        {spell.classes && spell.classes.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-[#bfa87a] text-xs italic text-[#555]">
                                <strong>Classes:</strong> {spell.classes.join(", ")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

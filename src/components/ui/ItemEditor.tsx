"use client";

import { useState, useEffect } from "react";
import { ShopItem } from "@/lib/data/items";
import { Save, Hammer, Shield, Swords, Sparkles, Scroll } from "lucide-react";
import { LootCard } from "@/components/ui/LootCard"; // Reuse existing card

export default function ItemEditor({ onSave, initialData }: { onSave: (item: ShopItem) => void, initialData?: ShopItem }) {
    const [item, setItem] = useState<ShopItem>({
        name: "",
        type: "Wondrous Item",
        cost: "100 gp",
        rarity: "Common",
        effect: "",
        properties: [],
        lore: ""
    });

    const [propInput, setPropInput] = useState("");

    useEffect(() => {
        if (initialData) setItem(initialData);
    }, [initialData]);

    const handleChange = (field: keyof ShopItem, value: any) => {
        setItem(prev => ({ ...prev, [field]: value }));
    };

    const addProperty = () => {
        if (!propInput) return;
        setItem(prev => ({
            ...prev,
            properties: [...(prev.properties || []), propInput]
        }));
        setPropInput("");
    };

    const removeProperty = (idx: number) => {
        setItem(prev => ({
            ...prev,
            properties: prev.properties?.filter((_, i) => i !== idx)
        }));
    };

    const handleSave = () => {
        if (!item.name || !item.effect) {
            alert("Name and Effect are required.");
            return;
        }
        onSave(item);
    };

    const rarities = ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"];
    const types = ["Weapon", "Armor", "Wondrous Item", "Potion", "Scroll", "Ring", "Rod", "Staff", "Wand"];

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* INPUT FORM */}
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <div className="bg-[#111] p-6 border border-[#333] space-y-4 shadow-lg relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#444]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#444]"></div>

                    <h3 className="text-[#a32222] font-header tracking-widest text-lg border-b border-[#333] pb-2 mb-4 flex items-center gap-2">
                        <Hammer className="w-5 h-5" /> ITEM FORGE
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Item Name</label>
                            <input
                                type="text"
                                value={item.name}
                                onChange={e => handleChange("name", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#e0e0e0] focus:border-[#a32222] outline-none font-header tracking-wide"
                                placeholder="e.g. Blade of the Void"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Rarity</label>
                            <select
                                value={item.rarity}
                                onChange={e => handleChange("rarity", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-noneAppearance-none"
                            >
                                {rarities.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Type</label>
                            <select
                                value={item.type}
                                onChange={e => handleChange("type", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-noneAppearance-none"
                            >
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Cost / Value</label>
                            <input
                                type="text"
                                value={item.cost}
                                onChange={e => handleChange("cost", e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none"
                            />
                        </div>
                    </div>

                    {/* Properties */}
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Properties (Tags)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={propInput}
                                onChange={e => setPropInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addProperty()}
                                className="flex-1 bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none text-xs"
                                placeholder="e.g. Light, Finesse, Attunement"
                            />
                            <button onClick={addProperty} className="bg-[#222] text-[#ccc] px-3 hover:bg-[#333] border border-[#333]">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {item.properties?.map((prop, idx) => (
                                <span key={idx} className="bg-[#1a0505] text-[#a32222] border border-[#330000] px-2 py-1 text-[10px] uppercase tracking-wide flex items-center gap-2">
                                    {prop}
                                    <button onClick={() => removeProperty(idx)} className="hover:text-white">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Effect */}
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Mechanics & Effects</label>
                        <textarea
                            value={item.effect}
                            onChange={e => handleChange("effect", e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#ccc] focus:border-[#a32222] outline-none min-h-[120px] font-serif leading-relaxed"
                            placeholder="Describe what the item does..."
                        />
                    </div>

                    {/* Lore */}
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#666] font-mono block mb-1">Flavor Text / Lore (Optional)</label>
                        <textarea
                            value={item.lore}
                            onChange={e => handleChange("lore", e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-[#888] italic focus:border-[#a32222] outline-none min-h-[80px] font-serif"
                            placeholder="An ancient inscription reads..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-[#a32222] text-white py-3 font-header tracking-widest hover:bg-[#c42828] transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> FORGE ITEM
                    </button>
                </div>
            </div>

            {/* PREVIEW CARD */}
            <div className="w-full lg:w-[400px] shrink-0">
                <div className="sticky top-4 flex flex-col items-center">
                    <h4 className="text-center text-[#666] font-mono text-xs uppercase tracking-[0.2em] mb-4">// PREVIEW OUTPUT</h4>
                    <div className="w-full max-w-sm">
                        <LootCard item={item} />
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { KHELBEN_GIFTS, FIMBLE_INVENTORY, IRON_KNOT_SERVICES, CROW_NEST_INVENTORY, ShopItem, ZHENTARIM_SPECIAL_STOCK } from '@/lib/data/items';
import { generateLootItem, GeneratorTheme } from "@/lib/generators";
import PrintButton from "@/components/ui/PrintButton";

import EconomyControlPanel from "@/components/ui/EconomyControlPanel";
import clsx from 'clsx';
import { Edit2, Plus, RefreshCw, Save, Trash2, X, AlertTriangle } from "lucide-react";
import PremiumGate from "@/components/auth/PremiumGate";

export default function ShopsPage() {
    const [activeTab, setActiveTab] = useState<'khelben' | 'fimble' | 'iron' | 'crow' | 'forge'>('khelben');

    // Local state for inventories
    const [khelbenItems, setKhelbenItems] = useState<ShopItem[]>(KHELBEN_GIFTS);
    const [fimbleItems, setFimbleItems] = useState<ShopItem[]>(FIMBLE_INVENTORY);
    const [ironItems, setIronItems] = useState<ShopItem[]>(IRON_KNOT_SERVICES);
    const [crowItems, setCrowItems] = useState<ShopItem[]>(CROW_NEST_INVENTORY);

    // Global Economy State
    const [economy, setEconomy] = useState({ inflation: 1.0, scarcityMode: false, notes: "" });

    // Load from LocalStorage
    useEffect(() => {
        const load = (key: string, fallback: ShopItem[], setter: (i: ShopItem[]) => void) => {
            const saved = localStorage.getItem(`shop_${key}`);
            if (saved) {
                try {
                    setter(JSON.parse(saved));
                } catch (e) { console.error("Failed to load shop", key); }
            }
        };

        load('khelben', KHELBEN_GIFTS, setKhelbenItems);
        load('fimble', FIMBLE_INVENTORY, setFimbleItems);
        load('iron', IRON_KNOT_SERVICES, setIronItems);
        load('crow', CROW_NEST_INVENTORY, setCrowItems);
    }, []);

    const getCurrentState = () => {
        switch (activeTab) {
            case 'khelben': return { items: khelbenItems, setter: setKhelbenItems, theme: "Arcane" as GeneratorTheme, key: 'khelben' };
            case 'fimble': return { items: fimbleItems, setter: setFimbleItems, theme: "Arcane" as GeneratorTheme, key: 'fimble' };
            case 'iron': return { items: ironItems, setter: setIronItems, theme: "Construct" as GeneratorTheme, key: 'iron' };
            case 'crow': return { items: crowItems, setter: setCrowItems, theme: "Surface" as GeneratorTheme, key: 'crow' };
            default: return { items: [], setter: () => { }, theme: "Surface" as GeneratorTheme, key: 'none' };
        }
    };

    const handleReplace = (index: number) => {
        const { items, setter, theme, key } = getCurrentState();
        const oldItem = items[index];
        const newItem = generateLootItem(theme, false, oldItem.rarity || "Common");

        const newItems = [...items];
        newItems[index] = newItem;
        setter(newItems);
        localStorage.setItem(`shop_${key}`, JSON.stringify(newItems));
    };

    const handleAddItem = (customItem?: ShopItem) => {
        const { items, setter, theme, key } = getCurrentState();
        const newItem = customItem || generateLootItem(theme, false);
        const updated = [...items, newItem];
        setter(updated);
        localStorage.setItem(`shop_${key}`, JSON.stringify(updated));
    };

    const handleEditItem = (index: number, updatedItem: ShopItem) => {
        const { items, setter, key } = getCurrentState();
        const newItems = [...items];
        newItems[index] = updatedItem;
        setter(newItems);
        localStorage.setItem(`shop_${key}`, JSON.stringify(newItems));
    };

    const handleDeleteItem = (index: number) => {
        if (!confirm("Remove this item from stock permanently?")) return;
        const { items, setter, key } = getCurrentState();
        const newItems = items.filter((_, i) => i !== index);
        setter(newItems);
        localStorage.setItem(`shop_${key}`, JSON.stringify(newItems));
    };


    const handleSpecialOrder = () => {
        const item = ZHENTARIM_SPECIAL_STOCK[Math.floor(Math.random() * ZHENTARIM_SPECIAL_STOCK.length)];
        handleAddItem(item);
        alert(`📦 DELIVERY RECEIVED\n\nItem: ${item.name}\nCost: ${item.cost}\n\n"The network provides."`);
    };

    return (
        <div className="retro-container min-h-screen bg-[#0a0a0a] text-[#d4d4d4] p-8">


            <header className="mb-8 flex justify-between items-center border-b border-[#333] pb-4">
                <div>
                    <h1 className="text-3xl font-header tracking-wider text-[var(--gold-accent)] mb-1">THE MARKET <span className="text-xs align-top opacity-50">v2.1</span></h1>
                    <p className="text-xs font-mono text-[#666]">COMMERCE & TRADE LOGISTICS</p>
                </div>
                <PrintButton />
            </header>

            {/* Economy Control */}
            <EconomyControlPanel onUpdate={setEconomy} />

            <div className="no-print flex gap-2 mb-6 flex-wrap">
                {[
                    { id: 'khelben', label: "Khelben's Gifts" },
                    { id: 'fimble', label: "The Gilded Coffer" },
                    { id: 'iron', label: "The Iron Knot" },
                    { id: 'crow', label: "The Crow's Nest" },
                    { id: 'forge', label: "⚒️ THE ARTIFICER'S FORGE" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-all
                            ${activeTab === tab.id
                                ? 'bg-[var(--gold-accent)] text-black border-[var(--gold-accent)] shadow-[0_0_10px_rgba(201,188,160,0.3)]'
                                : 'bg-transparent text-[#666] border-[#333] hover:border-[#666] hover:text-[#aaa]'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="retro-border bg-[#0e0e0e] border border-[#333] p-1 shadow-2xl">
                {activeTab === 'khelben' && <ShopList title="Khelben's Gifts" items={khelbenItems} economy={economy} onReplace={handleReplace} onAdd={(item) => handleAddItem(item)} onEdit={handleEditItem} onDelete={handleDeleteItem} onBatchDelete={(indices) => {
                    const newItems = khelbenItems.filter((_, i) => !indices.includes(i));
                    setKhelbenItems(newItems);
                    localStorage.setItem('shop_khelben', JSON.stringify(newItems));
                }} />}
                {activeTab === 'fimble' && <ShopList title="The Gilded Coffer" items={fimbleItems} economy={economy} onReplace={handleReplace} onAdd={(item) => handleAddItem(item)} onEdit={handleEditItem} onDelete={handleDeleteItem} onBatchDelete={(indices) => {
                    const newItems = fimbleItems.filter((_, i) => !indices.includes(i));
                    setFimbleItems(newItems);
                    localStorage.setItem('shop_fimble', JSON.stringify(newItems));
                }} />}
                {activeTab === 'iron' && <ShopList title="The Iron Knot" items={ironItems} economy={economy} onReplace={handleReplace} onAdd={(item) => handleAddItem(item)} onEdit={handleEditItem} onDelete={handleDeleteItem} onBatchDelete={(indices) => {
                    const newItems = ironItems.filter((_, i) => !indices.includes(i));
                    setIronItems(newItems);
                    localStorage.setItem('shop_iron', JSON.stringify(newItems));
                }} />}

                {activeTab === 'crow' && (
                    <PremiumGate feature="The Black Market">
                        <ShopList title="The Crow's Nest" items={crowItems} economy={economy} onReplace={handleReplace} onAdd={(item) => handleAddItem(item)} onEdit={handleEditItem} onDelete={handleDeleteItem} onBatchDelete={(indices) => {
                            const newItems = crowItems.filter((_, i) => !indices.includes(i));
                            setCrowItems(newItems);
                            localStorage.setItem('shop_crow', JSON.stringify(newItems));
                        }} onAddSpecial={handleSpecialOrder} />
                    </PremiumGate>
                )}
                {activeTab === 'forge' && <CraftingPanel economy={economy} />}
            </div>
        </div>
    );
}

// --- CRAFTING SYSTEM ---
type WorkOrder = {
    id: string;
    item: string;
    cost: number;
    daysRemaining: number;
    status: 'pending' | 'ready';
    notes: string;
};

function CraftingPanel({ economy }: { economy: { inflation: number, scarcityMode: boolean, notes: string } }) {
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const [newOrder, setNewOrder] = useState({ item: "", cost: 500, days: 3, notes: "" });

    useEffect(() => {
        const saved = localStorage.getItem('shop_forge_orders');
        if (saved) setOrders(JSON.parse(saved));
    }, []);

    const updateOrders = (newOrders: WorkOrder[]) => {
        setOrders(newOrders);
        localStorage.setItem('shop_forge_orders', JSON.stringify(newOrders));
    };

    const addOrder = () => {
        if (!newOrder.item) return;
        const order: WorkOrder = {
            id: Date.now().toString(),
            item: newOrder.item,
            cost: Math.ceil(newOrder.cost * economy.inflation),
            daysRemaining: newOrder.days,
            status: 'pending',
            notes: newOrder.notes
        };
        updateOrders([...orders, order]);
        setNewOrder({ item: "", cost: 500, days: 3, notes: "" });
    };

    const advanceDay = () => {
        const updated = orders.map(o => {
            if (o.status === 'ready') return o;
            const newDays = o.daysRemaining - 1;
            return {
                ...o,
                daysRemaining: Math.max(0, newDays),
                status: newDays <= 0 ? 'ready' : 'pending'
            };
        });
        updateOrders(updated as WorkOrder[]);
    };

    const deleteOrder = (id: string) => {
        if (!confirm("Cancel this work order?")) return;
        updateOrders(orders.filter(o => o.id !== id));
    };

    return (
        <div className="p-6 bg-[url('/img/texture_metal.png')] bg-repeat">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-header text-[var(--gold-accent)]">THE ARTIFICER&apos;S FORGE</h2>
                    <p className="text-sm text-[#888] font-mono">CUSTOM COMMISSIONS & REPAIRS</p>
                </div>
                <button
                    onClick={advanceDay}
                    className="flex items-center gap-2 bg-[#222] hover:bg-blue-900 border border-[#444] px-4 py-2 rounded text-blue-200 transition"
                >
                    <RefreshCw className="w-4 h-4" /> ADVANCE DAY
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Orders List */}
                <div className="lg:col-span-2 space-y-4">
                    {orders.length === 0 && <div className="text-center p-8 border border-dashed border-[#444] text-[#666]">No active work orders.</div>}
                    {orders.map(order => (
                        <div key={order.id} className={`relative p-4 border rounded flex justify-between items-center group transition-all ${order.status === 'ready' ? 'bg-green-900/10 border-green-800' : 'bg-[#111] border-[#333]'}`}>
                            <div>
                                <h3 className={`font-bold text-lg ${order.status === 'ready' ? 'text-green-400' : 'text-[#ddd]'}`}>{order.item}</h3>
                                <div className="text-xs font-mono text-[#888]">
                                    Cost: <span className="text-[var(--gold-accent)]">{order.cost} gp</span> • Paid in Full
                                </div>
                                {order.notes && <div className="text-sm text-[#aaa] mt-1 italic">&quot;{order.notes}&quot;</div>}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-xs uppercase tracking-widest text-[#666]">STATUS</div>
                                    <div className={`font-bold text-xl ${order.status === 'ready' ? 'text-green-400 animate-pulse' : 'text-blue-400'}`}>
                                        {order.status === 'ready' ? "READY" : `${order.daysRemaining} DAYS`}
                                    </div>
                                </div>
                                <button onClick={() => deleteOrder(order.id)} className="p-2 text-[#444] hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New Order Form */}
                <div className="bg-[#0a0a0a] border border-[#333] p-6 h-fit rounded shadow-xl">
                    <h3 className="font-header text-[#e0e0e0] mb-4 border-b border-[#333] pb-2">NEW COMMISSION</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-mono text-[#666] uppercase block mb-1">Item Name</label>
                            <input className="w-full bg-[#111] border border-[#444] p-2 text-white outline-none focus:border-[var(--gold-accent)]"
                                value={newOrder.item} onChange={e => setNewOrder({ ...newOrder, item: e.target.value })} placeholder="e.g. +1 Plate Armor" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-mono text-[#666] uppercase block mb-1">Base Cost (gp)</label>
                                <input type="number" className="w-full bg-[#111] border border-[#444] p-2 text-[var(--gold-accent)] outline-none"
                                    value={newOrder.cost} onChange={e => setNewOrder({ ...newOrder, cost: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div>
                                <label className="text-xs font-mono text-[#666] uppercase block mb-1">Lead Time (Days)</label>
                                <input type="number" className="w-full bg-[#111] border border-[#444] p-2 text-blue-300 outline-none"
                                    value={newOrder.days} onChange={e => setNewOrder({ ...newOrder, days: parseInt(e.target.value) || 1 })} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-mono text-[#666] uppercase block mb-1">Notes / Requirements</label>
                            <textarea className="w-full bg-[#111] border border-[#444] p-2 text-[#ccc] h-20 resize-none text-sm outline-none"
                                value={newOrder.notes} onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })} placeholder="Requires Hydra blood..." />
                        </div>

                        <div className="pt-2 text-xs text-[#555] font-mono">
                            Total Estimate: <span className="text-[var(--gold-accent)]">{Math.ceil(newOrder.cost * economy.inflation)} gp</span>
                            {economy.inflation > 1 && <span className="text-red-900 ml-2">(Inf. {economy.inflation}x)</span>}
                        </div>

                        <button onClick={addOrder} className="w-full bg-[var(--gold-accent)] hover:bg-[#fff] text-black font-bold py-3 uppercase tracking-widest text-sm transition">
                            Submit Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShopList({ title, items, economy, onReplace, onAdd, onEdit, onDelete, onBatchDelete, onAddSpecial }: {
    title: string,
    items: ShopItem[],
    economy: { inflation: number, scarcityMode: boolean },
    onReplace: (idx: number) => void,
    onAdd: (item?: ShopItem) => void,
    onEdit: (idx: number, item: ShopItem) => void,
    onDelete: (idx: number) => void,
    onBatchDelete: (indices: number[]) => void,
    onAddSpecial?: () => void
}) {

    const [soldIndices, setSoldIndices] = useState<number[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<ShopItem | null>(null);

    const toggleSold = (index: number) => {
        setSoldIndices(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    };

    const handleRestock = (index: number) => {
        onReplace(index);
        setSoldIndices(prev => prev.filter(i => i !== index));
    };

    const startEdit = (index: number, item: ShopItem) => {
        setEditingIndex(index);
        setEditForm({ ...item });
    };

    const saveEdit = () => {
        if (editingIndex !== null && editForm) {
            onEdit(editingIndex, editForm);
            setEditingIndex(null);
            setEditForm(null);
        }
    };

    // Scarcity Logic: 50% Markup
    const calculatePrice = (baseCost: string): string => {
        const numeric = parseInt(baseCost.replace(/[^0-9]/g, ''));
        if (isNaN(numeric)) return baseCost;

        let multiplier = economy.inflation;
        if (economy.scarcityMode) multiplier *= 1.5;

        const inflated = Math.ceil(numeric * multiplier);

        if (baseCost.includes("gp")) return `${inflated} gp`;
        if (baseCost.includes("sp")) return `${inflated} sp`;
        if (baseCost.includes("cp")) return `${inflated} cp`;
        return `${inflated}`;
    };

    const handleClearSold = () => {
        if (!confirm("Clear all sold items from the list?")) return;
        onBatchDelete(soldIndices);
        setSoldIndices([]);
    };

    // New Item Form State
    const [newItemMode, setNewItemMode] = useState(false);
    const [newItemData, setNewItemData] = useState<ShopItem>({ name: "New Item", cost: "100 gp", rarity: "Common", effect: "Description here.", npcQuote: "" });

    const submitNewItem = () => {
        onAdd(newItemData);
        setNewItemMode(false);
        setNewItemData({ name: "New Item", cost: "100 gp", rarity: "Common", effect: "Description here.", npcQuote: "" });
    };

    // [NEW] Custom Item Import Logic inside ShopList
    const [showImportModal, setShowImportModal] = useState(false);
    const [customItems, setCustomItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('custom_items');
        if (saved) {
            try { setCustomItems(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-end mb-6 border-b border-[#333] pb-4">
                <h2 className="m-0 text-xl text-[#e0e0e0] tracking-wide">{title}</h2>
                <div className="flex gap-2">
                    {soldIndices.length > 0 && (
                        <button
                            onClick={handleClearSold}
                            className="text-xs bg-red-900/20 hover:bg-red-900 text-red-200 border border-red-800 px-3 py-1 rounded transition flex items-center gap-2"
                        >
                            <Trash2 className="w-3 h-3" /> CLEAR SOLD ({soldIndices.length})
                        </button>
                    )}
                    {onAddSpecial && !economy.scarcityMode && (
                        <button
                            onClick={() => {
                                if (confirm("Request special shipment from Zhentarim?")) onAddSpecial();
                            }}
                            className="text-xs bg-purple-900/50 hover:bg-purple-900 text-purple-200 border border-purple-800 px-3 py-1 rounded transition flex items-center gap-2"
                        >
                            <AlertTriangle className="w-3 h-3" /> SPECIAL ORDER
                        </button>
                    )}
                </div>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-left text-xs font-mono uppercase text-[#666] border-b border-[#333]">
                        <th className="pb-3 pl-2 w-[35%]">Item Details</th>
                        <th className="pb-3 w-[15%]">Price <span className="text-[var(--gold-accent)] opacity-50">(Adj)</span></th>
                        <th className="pb-3 w-[35%]">Effect / Lore</th>
                        <th className="pb-3 w-[15%] text-right pr-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {items.map((item, i) => {
                        const isSold = soldIndices.includes(i);
                        const isEditing = editingIndex === i;
                        const adjustedPrice = calculatePrice(item.cost);
                        const priceChanged = adjustedPrice !== item.cost;

                        if (isEditing && editForm) {
                            return (
                                <tr key={i} className="bg-[#1a1a1a] border-b border-[#333]">
                                    <td className="p-3 align-top">
                                        <input className="w-full bg-[#111] border border-[#444] p-1 mb-1 text-white font-bold" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                        <input className="w-full bg-[#111] border border-[#444] p-1 text-xs text-[#aaa]" value={editForm.rarity} onChange={e => setEditForm({ ...editForm, rarity: e.target.value })} placeholder="Rarity" />
                                    </td>
                                    <td className="p-3 align-top">
                                        <input className="w-full bg-[#111] border border-[#444] p-1 text-[var(--gold-accent)]" value={editForm.cost} onChange={e => setEditForm({ ...editForm, cost: e.target.value })} />
                                    </td>
                                    <td className="p-3 align-top">
                                        <textarea className="w-full bg-[#111] border border-[#444] p-1 mb-1 text-xs text-[#ddd] h-16 resize-none" value={editForm.effect} onChange={e => setEditForm({ ...editForm, effect: e.target.value })} />
                                        <input className="w-full bg-[#111] border border-[#444] p-1 text-xs italic text-[#666]" value={editForm.npcQuote || ""} onChange={e => setEditForm({ ...editForm, npcQuote: e.target.value })} placeholder="NPC Quote" />
                                    </td>
                                    <td className="p-3 align-top text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={saveEdit} className="p-1 hover:text-green-500"><Save className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingIndex(null)} className="p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                        return (
                            <tr key={i} className={`border-b border-[#222] hover:bg-[#111] transition-colors group ${isSold ? 'opacity-40 bg-[#0a0000]' : ''}`}>
                                <td className="p-3 align-top">
                                    <div className={`font-bold text-[#e0e0e0] ${isSold ? 'line-through' : ''}`}>{item.name}</div>
                                    <div className="text-xs text-[#666] font-mono">{item.rarity} {item.type}</div>
                                </td>
                                <td className="p-3 align-top">
                                    <div className="font-mono text-[var(--gold-accent)]">
                                        {adjustedPrice}
                                    </div>
                                    {priceChanged && !isSold && (
                                        <div className="text-[10px] text-[#555] line-through decoration-red-900/50 decoration-2">
                                            Base: {item.cost}
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 align-top">
                                    <div className="text-[#ccc] text-xs leading-relaxed mb-1">{item.effect}</div>
                                    {item.npcQuote && <div className="text-[10px] italic text-[#555]">&quot;{item.npcQuote}&quot;</div>}
                                </td>
                                <td className="p-3 align-top text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isSold ? (
                                            <button onClick={() => handleRestock(i)} className="p-1.5 bg-[#222] hover:bg-[var(--gold-accent)] hover:text-black rounded" title="Restock">
                                                <RefreshCw className="w-3 h-3" />
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => toggleSold(i)} className="p-1.5 hover:bg-[#222] rounded text-[#444] hover:text-[#888]" title="Mark Sold">
                                                    <div className="w-3 h-3 border border-current rounded-full" />
                                                </button>
                                                <button onClick={() => startEdit(i, item)} className="p-1.5 hover:bg-[#222] rounded text-[#444] hover:text-[#888]" title="Edit">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => onDelete(i)} className="p-1.5 hover:bg-[#222] rounded text-[#444] hover:text-red-900" title="Delete">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Add Item Area */}
            <div className="mt-8 border-t border-[#333] pt-4">
                {!newItemMode ? (
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onAdd()}
                            className="text-xs uppercase tracking-widest text-[#555] hover:text-[var(--gold-accent)] hover:border-[var(--gold-accent)] border border-[#333] px-6 py-3 rounded transition-all"
                        >
                            + Generate Random Loot
                        </button>

                        <PremiumGate feature="Item Forge">
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="text-xs uppercase tracking-widest text-[#555] hover:text-[#d4af37] hover:border-[#d4af37] border border-[#333] px-6 py-3 rounded transition-all flex items-center gap-2"
                            >
                                <Save size={14} /> Import Custom
                            </button>
                        </PremiumGate>

                        <button
                            onClick={() => setNewItemMode(true)}
                            className="text-xs uppercase tracking-widest text-[#555] hover:text-white hover:border-white border border-[#333] px-6 py-3 rounded transition-all"
                        >
                            + Custom Entry
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#111] border border-[#333] p-4 rounded max-w-2xl mx-auto animate-fade-in">
                        <h3 className="text-xs font-header mb-4 text-[#888]">NEW INVENTORY ENTRY</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <input className="bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[var(--gold-accent)]" placeholder="Item Name" value={newItemData.name} onChange={e => setNewItemData({ ...newItemData, name: e.target.value })} autoFocus />
                            <input className="bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[#aaa]" placeholder="Cost (e.g. 500 gp)" value={newItemData.cost} onChange={e => setNewItemData({ ...newItemData, cost: e.target.value })} />
                            <input className="bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[#aaa]" placeholder="Rarity & Type" value={newItemData.rarity} onChange={e => setNewItemData({ ...newItemData, rarity: e.target.value })} />
                            <input className="bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[#aaa]" placeholder="NPC Quote (Optional)" value={newItemData.npcQuote} onChange={e => setNewItemData({ ...newItemData, npcQuote: e.target.value })} />
                        </div>
                        <textarea className="w-full bg-[#0a0a0a] border border-[#333] p-2 text-sm text-[#ddd] h-20 mb-4 resize-none" placeholder="Item Effect / Description" value={newItemData.effect} onChange={e => setNewItemData({ ...newItemData, effect: e.target.value })} />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setNewItemMode(false)} className="text-xs text-[#666] hover:text-white px-4 py-2">CANCEL</button>
                            <button onClick={submitNewItem} className="bg-[var(--gold-accent)] text-black font-bold text-xs uppercase px-4 py-2 hover:bg-[#fff]">ADD TO STOCK</button>
                        </div>
                    </div>
                )}
            </div>

            {/* IMPORT MODAL */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowImportModal(false)}>
                    <div className="bg-[#111] border border-[#333] w-full max-w-lg p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowImportModal(false)} className="absolute top-4 right-4 text-[#666] hover:text-white"><X size={20} /></button>
                        <h3 className="text-xl font-header text-[#d4af37] mb-4">Import Custom Item</h3>
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2">
                            {customItems.length === 0 && <div className="text-[#666] text-sm italic text-center py-8">No custom items found in the Forge.</div>}
                            {customItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { onAdd(item); setShowImportModal(false); }}
                                    className="w-full text-left p-3 border border-[#222] hover:border-[#d4af37] bg-[#0a0a0a] hover:bg-[#1f1a0c] transition group"
                                >
                                    <div className="font-header text-[#e0e0e0] group-hover:text-[#d4af37]">{item.name}</div>
                                    <div className="text-[10px] text-[#666] uppercase tracking-wider mt-1">{item.rarity} • {item.type}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper for icons if needed later, currently using Lucide in Edit2/Trash2/etc.
// Note: Imports for lucide-react added at top.

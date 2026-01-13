"use client";

import { useState, useEffect } from "react";
import { KHELBEN_GIFTS, FIMBLE_INVENTORY, IRON_KNOT_SERVICES, CROW_NEST_INVENTORY, ShopItem, ZHENTARIM_SPECIAL_STOCK } from '@/lib/data/items';
import { generateLootItem, GeneratorTheme } from "@/lib/generators";
import PrintButton from "@/components/ui/PrintButton";
import CommandBar from "@/components/ui/CommandBar";
import clsx from 'clsx';

export default function ShopsPage() {
    const [activeTab, setActiveTab] = useState<'khelben' | 'fimble' | 'iron' | 'crow'>('khelben');

    // [NEW] Local state for inventories to allow modification
    const [khelbenItems, setKhelbenItems] = useState<ShopItem[]>(KHELBEN_GIFTS);
    const [fimbleItems, setFimbleItems] = useState<ShopItem[]>(FIMBLE_INVENTORY);
    const [ironItems, setIronItems] = useState<ShopItem[]>(IRON_KNOT_SERVICES);
    const [crowItems, setCrowItems] = useState<ShopItem[]>(CROW_NEST_INVENTORY);

    // [NEW] Load from LocalStorage on mount
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
        }
    };

    const handleReplace = (index: number) => {
        const { items, setter, theme, key } = getCurrentState();
        const oldItem = items[index];
        const newItem = generateLootItem(theme, false, oldItem.rarity || "Common");

        const newItems = [...items];
        newItems[index] = newItem;
        setter(newItems);
        // Persist
        localStorage.setItem(`shop_${key}`, JSON.stringify(newItems));
    };

    const handleAddItem = () => {
        const { items, setter, theme, key } = getCurrentState();
        const newItem = generateLootItem(theme, false); // Random rarity
        const updated = [...items, newItem];
        setter(updated);
        localStorage.setItem(`shop_${key}`, JSON.stringify(updated));
    };

    // [NEW] Special Order Logic regarding Zhentarim Stock (Crow's Nest)
    const handleSpecialOrder = () => {
        const item = ZHENTARIM_SPECIAL_STOCK[Math.floor(Math.random() * ZHENTARIM_SPECIAL_STOCK.length)];
        const updated = [...crowItems, item];
        setCrowItems(updated);
        localStorage.setItem('shop_crow', JSON.stringify(updated));
        alert(`📦 DELIVERY RECEIVED\n\nItem: ${item.name}\nCost: ${item.cost}\n\n"The network provides."`);
    };

    return (
        <div className="retro-container">
            <CommandBar />

            <header style={{ marginTop: "2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>The Market <span style={{ fontSize: "0.5em", color: "var(--accent-color)" }}>v2.0</span></h1>
                <PrintButton />
            </header>

            <div className="no-print" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <button onClick={() => setActiveTab('khelben')} className={clsx(activeTab === 'khelben' && "active")}>Khelben&apos;s Gifts</button>
                <button onClick={() => setActiveTab('fimble')} className={clsx(activeTab === 'fimble' && "active")}>The Gilded Coffer</button>
                <button onClick={() => setActiveTab('iron')} className={clsx(activeTab === 'iron' && "active")}>The Iron Knot</button>
                <button onClick={() => setActiveTab('crow')} className={clsx(activeTab === 'crow' && "active")}>The Crow&apos;s Nest</button>
            </div>

            <div className="retro-border">
                {activeTab === 'khelben' && <ShopList title="Khelben's Gifts" items={khelbenItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'fimble' && <ShopList title="The Gilded Coffer" items={fimbleItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'iron' && <ShopList title="The Iron Knot" items={ironItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'crow' && <ShopList title="The Crow's Nest" items={crowItems} onReplace={handleReplace} onAdd={handleAddItem} onAddSpecial={handleSpecialOrder} />}
            </div>
        </div>
    );
}

function ShopList({ title, items, onReplace, onAdd, onAddSpecial }: { title: string, items: ShopItem[], onReplace: (idx: number) => void, onAdd: () => void, onAddSpecial?: () => void }) {

    // [NEW] Local state for "Sold" visualization before replacement
    // Actually, user said: "mark if a item has been sold so that can be replaced"
    // So we'll toggle a visual "sold" state, and if it IS sold, show the "Restock" button.
    const [soldIndices, setSoldIndices] = useState<number[]>([]);

    const toggleSold = (index: number) => {
        if (soldIndices.includes(index)) {
            setSoldIndices(soldIndices.filter(i => i !== index));
        } else {
            setSoldIndices([...soldIndices, index]);
        }
    };

    const handleRestock = (index: number) => {
        onReplace(index);
        setSoldIndices(soldIndices.filter(i => i !== index)); // Reset visual state
    };

    // [NEW] Special Order Handler
    const handleSpecialOrder = () => {
        if (!onAddSpecial) return;
        const confirmBuy = confirm("SPECIAL ORDER REQUEST\n\nThis will tap into the Zhentarim's private reserves.\nAre you sure you want to request a special shipment?");
        if (confirmBuy) {
            onAddSpecial();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-4 border-b border-[#5d4037] pb-2">
                <h2 className="m-0">{title}</h2>
                {title.includes("Crow's Nest") && (
                    <button
                        onClick={handleSpecialOrder}
                        className="text-xs bg-red-900 text-white px-2 py-1 rounded hover:bg-red-700 transition animate-pulse"
                        title="Request illicit goods"
                    >
                        📦 SPECIAL ORDER
                    </button>
                )}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #5d4037" }}>
                        <th style={{ padding: "0.5rem" }}>Item</th>
                        <th style={{ padding: "0.5rem" }}>Cost / Price</th>
                        <th style={{ padding: "0.5rem" }}>Effect / Notes</th>
                        <th className="no-print" style={{ padding: "0.5rem", width: "100px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => {
                        const isSold = soldIndices.includes(i);
                        return (
                            <tr key={i} style={{ borderBottom: "1px solid rgba(93, 64, 55, 0.3)", opacity: isSold ? 0.5 : 1, textDecoration: isSold ? "line-through" : "none" }}>
                                <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                                    <strong>{item.name}</strong>
                                    {item.rarity && <div style={{ fontSize: "0.8em", opacity: 0.7 }}>{item.rarity} {item.type}</div>}
                                    {item.properties && <div style={{ fontSize: "0.8em", opacity: 0.7, fontStyle: "italic", marginTop: "0.2rem" }}>Properties: {item.properties.join(", ")}</div>}
                                </td>
                                <td style={{ padding: "0.5rem", verticalAlign: "top", color: "#8a1c1c" }}>{item.cost}</td>
                                <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                                    {item.effect && <div>{item.effect}</div>}
                                    {item.npcQuote && <div style={{ fontStyle: "italic", marginTop: "0.2rem", opacity: 0.8 }}>&quot;{item.npcQuote}&quot;</div>}
                                </td>
                                <td className="no-print" style={{ padding: "0.5rem", verticalAlign: "top", textDecoration: "none" }}>
                                    {isSold ? (
                                        <button
                                            onClick={() => handleRestock(i)}
                                            style={{ fontSize: "0.7rem", padding: "0.3rem", background: "var(--accent-color)", color: "black", width: "100%" }}
                                        >
                                            RESTOCK
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => toggleSold(i)}
                                            style={{ fontSize: "0.7rem", padding: "0.3rem", borderColor: "#555", color: "#555", width: "100%" }}
                                        >
                                            MARK SOLD
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="no-print" style={{ marginTop: "2rem", textAlign: "center" }}>
                <button
                    onClick={onAdd}
                    className="retro-btn"
                    style={{
                        borderStyle: "dashed",
                        opacity: 0.7,
                        width: "100%",
                        padding: "1rem"
                    }}
                >
                    + ADD RANDOM STOCK
                </button>
            </div>
        </div>
    );
}

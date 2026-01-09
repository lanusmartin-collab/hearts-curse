"use client";

import { useState } from "react";
import { KHELBEN_GIFTS, FIMBLE_INVENTORY, IRON_KNOT_SERVICES, CROW_NEST_INVENTORY, ShopItem } from '@/lib/data/items';
import { generateLootItem, GeneratorTheme } from "@/lib/generators";
import PrintButton from "@/components/ui/PrintButton";
import Link from 'next/link';
import clsx from 'clsx';

export default function ShopsPage() {
    const [activeTab, setActiveTab] = useState<'khelben' | 'fimble' | 'iron' | 'crow'>('khelben');

    // [NEW] Local state for inventories to allow modification
    const [khelbenItems, setKhelbenItems] = useState<ShopItem[]>(KHELBEN_GIFTS);
    const [fimbleItems, setFimbleItems] = useState<ShopItem[]>(FIMBLE_INVENTORY);
    const [ironItems, setIronItems] = useState<ShopItem[]>(IRON_KNOT_SERVICES);
    const [crowItems, setCrowItems] = useState<ShopItem[]>(CROW_NEST_INVENTORY);

    const getCurrentState = () => {
        switch (activeTab) {
            case 'khelben': return { items: khelbenItems, setter: setKhelbenItems, theme: "Arcane" as GeneratorTheme };
            case 'fimble': return { items: fimbleItems, setter: setFimbleItems, theme: "Arcane" as GeneratorTheme };
            case 'iron': return { items: ironItems, setter: setIronItems, theme: "Construct" as GeneratorTheme };
            case 'crow': return { items: crowItems, setter: setCrowItems, theme: "Surface" as GeneratorTheme };
        }
    };

    const handleReplace = (index: number) => {
        const { items, setter, theme } = getCurrentState();
        const oldItem = items[index];
        const newItem = generateLootItem(theme, false, oldItem.rarity || "Common");

        const newItems = [...items];
        newItems[index] = newItem;
        setter(newItems);
    };

    const handleAddItem = () => {
        const { items, setter, theme } = getCurrentState();
        const newItem = generateLootItem(theme, false); // Random rarity
        setter([...items, newItem]);
    };

    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>The Market <span style={{ fontSize: "0.5em", color: "var(--accent-color)" }}>v2.0</span></h1>
                <PrintButton />
            </header>

            <div className="no-print" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <button onClick={() => setActiveTab('khelben')} className={clsx(activeTab === 'khelben' && "active")}>Khelben's Gifts</button>
                <button onClick={() => setActiveTab('fimble')} className={clsx(activeTab === 'fimble' && "active")}>The Gilded Coffer</button>
                <button onClick={() => setActiveTab('iron')} className={clsx(activeTab === 'iron' && "active")}>The Iron Knot</button>
                <button onClick={() => setActiveTab('crow')} className={clsx(activeTab === 'crow' && "active")}>The Crow's Nest</button>
            </div>

            <div className="retro-border">
                {activeTab === 'khelben' && <ShopList title="Khelben's Gifts" items={khelbenItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'fimble' && <ShopList title="The Gilded Coffer" items={fimbleItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'iron' && <ShopList title="The Iron Knot" items={ironItems} onReplace={handleReplace} onAdd={handleAddItem} />}
                {activeTab === 'crow' && <ShopList title="The Crow's Nest" items={crowItems} onReplace={handleReplace} onAdd={handleAddItem} />}
            </div>
        </div>
    );
}

function ShopList({ title, items, onReplace, onAdd }: { title: string, items: any[], onReplace: (idx: number) => void, onAdd: () => void }) {

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
        setSoldIndices(soldIndices.filter(i => i !== index)); // Reset visual state for new item
    };

    return (
        <div>
            <h2 style={{ marginBottom: "1rem", borderBottom: "1px dashed #5d4037" }}>{title}</h2>
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
                                    {item.npcQuote && <div style={{ fontStyle: "italic", marginTop: "0.2rem", opacity: 0.8 }}>"{item.npcQuote}"</div>}
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

"use client";

import { useState } from "react";
import { KHELBEN_GIFTS, FIMBLE_INVENTORY, IRON_KNOT_SERVICES, CROW_NEST_INVENTORY, ShopItem } from '@/lib/data/items';
import PrintButton from "@/components/ui/PrintButton";
import Link from 'next/link';
import clsx from 'clsx';

export default function ShopsPage() {
    const [activeTab, setActiveTab] = useState<'khelben' | 'fimble' | 'iron' | 'crow'>('khelben');

    return (
        <div className="retro-container">
            <div className="no-print" style={{ marginBottom: "2rem" }}>
                <Link href="/">{"< BACK_TO_ROOT"}</Link>
            </div>

            <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>The Market</h1>
                <PrintButton />
            </header>

            <div className="no-print" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <button onClick={() => setActiveTab('khelben')} className={clsx(activeTab === 'khelben' && "active")}>Khelben's Gifts</button>
                <button onClick={() => setActiveTab('fimble')} className={clsx(activeTab === 'fimble' && "active")}>The Gilded Coffer</button>
                <button onClick={() => setActiveTab('iron')} className={clsx(activeTab === 'iron' && "active")}>The Iron Knot</button>
                <button onClick={() => setActiveTab('crow')} className={clsx(activeTab === 'crow' && "active")}>The Crow's Nest</button>
            </div>

            <div className="retro-border">
                {activeTab === 'khelben' && <ShopList title="Khelben's Gifts" items={KHELBEN_GIFTS} />}
                {activeTab === 'fimble' && <ShopList title="The Gilded Coffer" items={FIMBLE_INVENTORY} />}
                {activeTab === 'iron' && <ShopList title="The Iron Knot" items={IRON_KNOT_SERVICES} />}
                {activeTab === 'crow' && <ShopList title="The Crow's Nest" items={CROW_NEST_INVENTORY} />}
            </div>
        </div>
    );
}

function ShopList({ title, items }: { title: string, items: any[] }) {
    return (
        <div>
            <h2 style={{ marginBottom: "1rem", borderBottom: "1px dashed #5d4037" }}>{title}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #5d4037" }}>
                        <th style={{ padding: "0.5rem" }}>Item</th>
                        <th style={{ padding: "0.5rem" }}>Cost / Price</th>
                        <th style={{ padding: "0.5rem" }}>Effect / Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(93, 64, 55, 0.3)" }}>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

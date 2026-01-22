import React, { useState, useEffect, useRef } from 'react';
import { ShopData, ShopItem } from '@/lib/data/shops';
import { X, Coins, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useGameContext } from '@/lib/context/GameContext'; // Add Import

interface ShopInterfaceProps {
    shop: ShopData;
    playerGold: number;
    onClose: () => void;
    onBuy: (item: ShopItem) => void;
}

export default function ShopInterface({ shop, playerGold, onClose, onBuy }: ShopInterfaceProps) {
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    // -- FACTION LOGIC --
    const { factions } = useGameContext();
    const isZhentarimControlled = shop.id === 'crows_nest' || shop.id === 'market';
    // Default to 50 if factions undefined (handling safety)
    const zhentRep = factions?.zhentarim ?? 50;

    // Logic: < 20 Rep = 2.0x Prices. > 80 Rep = 0.8x Prices.
    const priceMultiplier = (isZhentarimControlled && zhentRep < 20) ? 2.0 : (isZhentarimControlled && zhentRep > 80 ? 0.8 : 1.0);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-4xl h-[80vh] bg-[#0a0a0c] border border-[#8b7e66] flex flex-col md:flex-row shadow-2xl overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full border border-gray-700 hover:border-white transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left Panel: Shopkeeper & Atmosphere */}
                <div className="w-full md:w-1/3 bg-[#111] border-r border-[#333] relative flex flex-col">
                    <div className="h-1/2 relative border-b border-[#333]">
                        {/* Placeholder Shop Image if specific one fails, use generic */}
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                            <span className="text-[#333] font-serif italic">Shop Atmosphere</span>
                        </div>
                        {shop.image && (
                            <Image
                                src={shop.image}
                                alt={shop.name}
                                fill
                                className="object-cover opacity-60"
                            />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                            <h2 className="text-2xl font-serif text-[#d4c391]">{shop.name}</h2>
                            <p className="text-sm text-[#888]">{shop.keeper}</p>
                        </div>
                    </div>
                    <div className="p-6 text-[#ccc] font-serif italic text-sm leading-relaxed overflow-y-auto">
                        "{shop.description}"
                    </div>
                </div>

                {/* Right Panel: Inventory */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                    {/* Header */}
                    <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#0f0f0f]">
                        <div className="flex items-center gap-2 text-[#d4c391]">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-bold tracking-widest uppercase text-sm">Wares for Sale</span>

                            {/* PRICING ALERTS */}
                            {priceMultiplier > 1 && <span className="text-[10px] bg-red-900 text-red-100 px-2 py-0.5 rounded animate-pulse">SURGE PRICING (Zhentarim Hostile)</span>}
                            {priceMultiplier < 1 && <span className="text-[10px] bg-green-900 text-green-100 px-2 py-0.5 rounded">ALLY DISCOUNT</span>}
                        </div>
                        <div className="flex items-center gap-2 text-yellow-500 font-mono bg-black/50 px-3 py-1 rounded border border-[#333]">
                            <Coins className="w-4 h-4" />
                            <span>{playerGold} gp</span>
                        </div>
                    </div>

                    {/* Item Grid */}
                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 content-start custom-scrollbar">
                        {shop.inventory.map((item) => {
                            const adjustedCost = Math.ceil(item.cost * priceMultiplier);
                            const canAfford = playerGold >= adjustedCost;
                            const isSoldOut = item.stock <= 0;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => !isSoldOut && setSelectedItem(item)}
                                    disabled={isSoldOut}
                                    className={`
                                        relative group flex flex-col text-left p-4 border transition-all duration-200
                                        ${isSoldOut ? 'border-[#333] bg-[#111] opacity-50 cursor-not-allowed' : 'border-[#333] bg-[#111] hover:bg-[#1a1a1a] hover:border-[#8b7e66] cursor-pointer'}
                                        ${selectedItem?.id === item.id ? 'border-[#d4c391] bg-[#1a1a1a]' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start w-full mb-1">
                                        <span className={`font-bold font-serif ${isSoldOut ? 'text-gray-600 line-through' : 'text-[#e5e5e5]'}`}>
                                            {item.name}
                                        </span>
                                        <div className={`flex items-center gap-1 font-mono text-xs ${canAfford ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {priceMultiplier !== 1 && <span className="text-[9px] line-through opacity-50 mr-1">{item.cost}</span>}
                                            <Coins size={12} />
                                            {adjustedCost} gp
                                        </div>
                                    </div>
                                    <div className="text-xs text-[#888] line-clamp-2 h-8">{item.description}</div>
                                    <div className="mt-3 flex justify-between items-center text-[10px] uppercase tracking-wider text-[#555]">
                                        <span>Type: {item.type}</span>
                                        <span className={item.stock < 3 ? "text-red-400" : ""}>Stock: {item.stock}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer / Action Area */}
                    <div className="h-24 bg-[#111] border-t border-[#333] p-4 flex items-center justify-between">
                        <div className="text-sm text-[#888]">
                            {selectedItem ? (
                                <span>Selected: <span className="text-white font-bold">{selectedItem.name}</span></span>
                            ) : (
                                <span>Select an item to purchase</span>
                            )}
                        </div>
                        <button
                            disabled={!selectedItem || playerGold < Math.ceil((selectedItem?.cost || 0) * priceMultiplier)}
                            onClick={() => {
                                if (selectedItem) {
                                    // Pass original item to handler, handler handles logic? 
                                    // Wait, if we change price visually, actual logic must dedup logic or pass modified cost. 
                                    // useGameLogic.handleBuyItem checks item.cost. 
                                    // We should probably modify the item passed to onBuy or handle logic in onBuy.
                                    // Since onBuy is passed from GameLayout -> useGameLogic, let's clone item with new cost.
                                    onBuy({ ...selectedItem, cost: Math.ceil(selectedItem.cost * priceMultiplier) });
                                }
                            }}
                            className={`
                                px-6 py-3 font-bold uppercase tracking-widest text-sm transition-all
                                ${!selectedItem || playerGold < Math.ceil((selectedItem?.cost || 0) * priceMultiplier)
                                    ? 'bg-[#222] text-[#555] cursor-not-allowed'
                                    : 'bg-[#8b7e66] hover:bg-[#a32222] text-black hover:text-white shadow-[0_0_15px_rgba(139,126,102,0.3)]'}
                            `}
                        >
                            {selectedItem && playerGold < Math.ceil(selectedItem.cost * priceMultiplier) ? "Insufficient Gold" : "Purchase"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

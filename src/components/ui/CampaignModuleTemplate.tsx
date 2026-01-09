import React, { useState } from 'react';
import Image from 'next/image';
import { CAMPAIGN_MAPS } from '@/lib/data/maps';
import { CAMPAIGN_LORE } from '@/lib/data/lore';
import { ALL_MONSTERS } from '@/lib/data/monsters_2024';
import { ITEMS, KHELBEN_GIFTS, FIMBLE_INVENTORY, CROW_NEST_INVENTORY, IRON_KNOT_SERVICES, CAMPAIGN_UNIQUE_ITEMS } from '@/lib/data/items';
import { CURSE_MECHANICS, PROLOGUE_POWERS, SAFE_HAVEN } from '@/lib/data/mechanics';
import { ITEMS as MAGIC_ITEMS_LIST } from '@/lib/data/items'; // Aggregate

type CampaignModuleTemplateProps = {
    onClose: () => void;
};

const FLAVOR_QUOTES: Record<string, { text: string; author: string }> = {
    intro: { text: "The curse is not a disease. It is a debt.", author: "Acererak the Eternal" },
    ch1: { text: "We dug too deep, and found only our own graves.", author: "Foreman's Log, Final Entry" },
    ch2: { text: "Silence is heavy here. It presses against your ears like deep water.", author: "Khelben Arunsun" },
    ch3: { text: "Knowledge is the only treasure that kills you for finding it.", author: "Rhaugilath the Ageless" },
    ch4: { text: "The heart of the world is broken. I intend to stop the bleeding.", author: "Vez'nan the Deceiver" },
    bestiary: { text: "They are not monsters. They are merely the hungry children of the void.", author: "Xylantropy" },
    shops: { text: "Gold? No, I deal in years. How many do you have left?", author: "Fimble Futterly" }
};

export default function CampaignModuleTemplate({ onClose }: CampaignModuleTemplateProps) {
    const [printMode, setPrintMode] = useState<'full' | 'intro' | 'adventure' | 'bestiary' | 'shops' | 'mechanics'>('full');

    const handlePrint = (mode: typeof printMode) => {
        setPrintMode(mode);
        // Small delay to allow state to propagate before printing
        setTimeout(() => window.print(), 100);
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto text-black font-serif print:static print:overflow-visible print:h-auto print:bg-white text-justify leading-snug">
            {/* Toolbar - No Print */}
            <div className="no-print fixed top-0 left-0 w-full bg-black text-white p-2 flex justify-between items-center shadow-lg z-50 text-xs md:text-sm">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <span className="font-bold text-accent uppercase tracking-widest hidden md:inline mr-4">AD&D Campaign Book</span>

                    <div className="flex bg-gray-900 rounded p-1 gap-1">
                        <button onClick={() => handlePrint('full')} className={`px-3 py-1 rounded transition-colors ${printMode === 'full' ? 'bg-accent text-black font-bold' : 'hover:bg-gray-700'}`}>FULL BOOK</button>
                        <button onClick={() => handlePrint('intro')} className={`px-3 py-1 rounded transition-colors ${printMode === 'intro' ? 'bg-accent text-black font-bold' : 'hover:bg-gray-700'}`}>INTRO</button>
                        <button onClick={() => handlePrint('adventure')} className={`px-3 py-1 rounded transition-colors ${printMode === 'adventure' ? 'bg-accent text-black font-bold' : 'hover:bg-gray-700'}`}>ADVENTURES</button>
                        <button onClick={() => handlePrint('bestiary')} className={`px-3 py-1 rounded transition-colors ${printMode === 'bestiary' ? 'bg-accent text-black font-bold' : 'hover:bg-gray-700'}`}>BESTIARY</button>
                        <button onClick={() => handlePrint('shops')} className={`px-3 py-1 rounded transition-colors ${printMode === 'shops' ? 'bg-accent text-black font-bold' : 'hover:bg-gray-700'}`}>SHOPS</button>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white underline ml-4 whitespace-nowrap"
                >
                    Close Viewer
                </button>
            </div>

            {/* Book Content Container */}
            <div className="max-w-[816px] mx-auto bg-white min-h-screen pt-20 pb-12 px-12 shadow-2xl print:shadow-none print:pt-0 print:mx-0 print:w-full print:max-w-none print:px-8">

                {/* COVER PAGE (Only in Full Mode) */}
                <div className={`print-cover-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black text-white border-8 border-yellow-600 rounded-lg mb-8 print:border-none print:rounded-none ${printMode !== 'full' ? 'print:hidden' : ''}`}>
                    <Image
                        src="/cover_art_v8.png"
                        alt="Heart's Curse Campaign Cover"
                        fill
                        className="object-cover opacity-80 grayscale contrast-125"
                        priority
                    />
                    <div className="absolute top-16 left-0 w-full text-center z-10">
                        <h1 className="text-8xl font-extrabold text-[#d4af37] drop-shadow-[0_5px_5px_rgba(0,0,0,1)] font-serif tracking-tight print:text-black print:text-6xl print:drop-shadow-none" style={{ fontFamily: 'var(--adnd-font-header)' }}>HEART&apos;S CURSE</h1>
                        <p className="text-2xl text-[#e8dcc5] mt-4 tracking-[0.5em] uppercase font-bold drop-shadow-md print:text-black print:bg-white/90 print:inline-block print:px-4 print:border-2 print:border-black">Advanced Dungeons & Dragons</p>
                    </div>
                    <div className="absolute bottom-16 z-10 bg-black/80 px-8 py-2 border-2 border-[#d4af37] print:border-black print:bg-white print:text-black">
                        <p className="text-[#d4af37] print:text-black font-bold uppercase tracking-widest">Campaign Module HC-1</p>
                    </div>
                </div>

                {/* TABLE OF CONTENTS */}
                <div className={`break-after-page page-break mb-12 ${printMode !== 'full' ? 'print:hidden' : ''}`}>
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-6 mt-12 font-serif text-center">Table of Contents</h2>
                    <ul className="columns-2 gap-8 space-y-2 text-sm font-medium font-serif">
                        <li><strong>Introduction:</strong> The Curse of Oakhaven</li>
                        {CAMPAIGN_MAPS.map((map, idx) => (
                            <li key={idx}><strong>Chapter {idx + 1}:</strong> {map.title}</li>
                        ))}
                        <li><strong>Appendix A:</strong> Monster Compendium</li>
                        <li><strong>Appendix B:</strong> Magic Items & Artifacts</li>
                        <li><strong>Appendix C:</strong> Mercantile Ledger</li>
                        <li><strong>Appendix D:</strong> Global Mechanics</li>
                    </ul>
                </div>

                {/* --- INTRO & LORE --- */}
                <div className={printMode !== 'full' && printMode !== 'intro' ? 'print:hidden' : ''}>
                    <div className="columns-2 gap-8 text-justify text-sm mb-12 break-inside-avoid">
                        <h2 className="text-3xl font-bold uppercase border-b-2 border-black mb-4 column-span-all font-serif">Introduction</h2>

                        <div className="break-inside-avoid mb-6 p-4 bg-gray-100 border-l-4 border-black italic shadow-inner">
                            &quot;{FLAVOR_QUOTES.intro.text}&quot;
                            <div className="text-right mt-2 text-xs font-bold not-italic">— {FLAVOR_QUOTES.intro.author}</div>
                        </div>

                        {CAMPAIGN_LORE.map((section) => (
                            <div key={section.id} className="mb-6 break-inside-avoid">
                                <h3 className="font-bold uppercase text-lg mb-1 font-serif text-[#8a1c1c]">{section.title}</h3>
                                <p className="indent-4 mb-2 whitespace-pre-wrap">{section.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="break-after-page page-break"></div>
                </div>

                {/* --- ADVENTURES SECTION --- */}
                <div className={printMode !== 'full' && printMode !== 'adventure' ? 'print:hidden' : ''}>
                    {CAMPAIGN_MAPS.map((mapData, index) => (
                        <div key={mapData.id} className="break-after-page page-break">
                            <div className="border-b-4 border-black mb-8 pb-2 mt-8">
                                <h2 className="text-4xl font-extrabold uppercase tracking-tight font-serif">Chapter {index + 1}: {mapData.title}</h2>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="italic text-lg text-gray-600">Level {mapData.id.toUpperCase().substring(0, 3)}</span>
                                </div>
                            </div>

                            <div className="columns-2 gap-8 text-justify text-sm">
                                {/* Flavor Text */}
                                {index < 4 && (
                                    <div className="break-inside-avoid mb-6 p-3 border-y-2 border-black text-center font-bold italic font-serif bg-gray-50">
                                        {FLAVOR_QUOTES[`ch${index + 1}`]?.text}
                                    </div>
                                )}

                                {/* Boxed Text (Read Aloud) */}
                                <div className="break-inside-avoid bg-gray-100 border-2 border-black p-4 mb-6 shadow-sm font-serif italic text-sm">
                                    <p>{mapData.description.replace(/\*\*/g, '')}</p>
                                </div>

                                {mapData.mechanics && mapData.mechanics.length > 0 && (
                                    <div className="break-inside-avoid mb-6 border border-black p-3">
                                        <h3 className="font-bold uppercase border-b border-black mb-2 text-md font-serif bg-black text-white px-2 inline-block">Dungeon Features</h3>
                                        <ul className="list-disc pl-4 space-y-1 mt-2">
                                            {mapData.mechanics.map((mech, i) => (
                                                <li key={i}>{mech}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="break-inside-avoid w-full mb-8 border-2 border-black relative grayscale contrast-125">
                                    <Image
                                        src={mapData.imagePath}
                                        alt="Dungeon Map"
                                        width={800}
                                        height={600}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white px-2 border-t border-l border-black text-xs font-bold">MAP {index + 1}</div>
                                </div>

                                <h3 className="break-inside-avoid font-bold uppercase border-b-2 border-black mb-4 text-xl mt-8 column-span-all font-serif text-[#003366]">Encounter Key</h3>

                                {mapData.nodes?.map((node, i) => (
                                    <div key={i} className="break-inside-avoid mb-6">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-bold text-lg font-serif">{i + 1}. {node.label}</span>
                                            <span className="text-xs uppercase font-bold text-gray-500">[{node.type}]</span>
                                        </div>
                                        <p className="indent-4">{node.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- BESTIARY SECTION --- */}
                <div className={`${printMode !== 'full' && printMode !== 'bestiary' ? 'print:hidden' : ''} break-after-page page-break`}>
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12 font-serif text-center">Appendix A: Monster Compendium</h2>

                    <div className="break-inside-avoid mb-6 p-4 bg-gray-100 border-l-4 border-black italic shadow-inner column-span-all">
                        &quot;{FLAVOR_QUOTES.bestiary.text}&quot;
                        <div className="text-right mt-2 text-xs font-bold not-italic">— {FLAVOR_QUOTES.bestiary.author}</div>
                    </div>

                    <div className="columns-2 gap-8">
                        {ALL_MONSTERS.slice().sort((a, b) => a.name.localeCompare(b.name)).map((stat, i) => (
                            <div key={i} className="break-inside-avoid border-2 border-black p-4 mb-6 bg-white text-xs shadow-sm">
                                <h3 className="font-bold text-xl uppercase mb-1 font-serif text-[#003366]">{stat.name}</h3>
                                <div className="border-b border-black mb-2 pb-1 italic font-serif">{stat.size} {stat.type}, {stat.alignment}</div>

                                {stat.image && (
                                    <div className="mb-3 border border-black grayscale contrast-125 opacity-90 relative h-32 w-full overflow-hidden">
                                        {/* Fallback handled by Next/Image automatically if configured, avoiding complex onError logic for print view */}
                                        <Image
                                            src={stat.image}
                                            alt={stat.name}
                                            fill
                                            className="object-cover object-top"
                                            sizes="200px"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                                    <div><strong>AC:</strong> {stat.ac} ({stat.armorType})</div>
                                    <div><strong>HP:</strong> {stat.hp} ({stat.hitDice})</div>
                                    <div className="col-span-2"><strong>Speed:</strong> {stat.speed}</div>
                                </div>
                                <div className="border-t border-b border-black py-1 mb-2 grid grid-cols-6 gap-1 text-center font-bold bg-gray-50">
                                    <div>STR<br />{stat.stats.str}</div>
                                    <div>DEX<br />{stat.stats.dex}</div>
                                    <div>CON<br />{stat.stats.con}</div>
                                    <div>INT<br />{stat.stats.int}</div>
                                    <div>WIS<br />{stat.stats.wis}</div>
                                    <div>CHA<br />{stat.stats.cha}</div>
                                </div>

                                <div className="space-y-2 mt-2">
                                    {(stat.traits || []).map((trait, t) => (
                                        <div key={t}>
                                            <span className="font-bold italic">{trait.name}.</span> {trait.desc}
                                        </div>
                                    ))}
                                </div>

                                {stat.actions && stat.actions.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-black">
                                        <h4 className="font-bold uppercase text-sm mb-1 font-serif bg-black text-white px-1 inline-block">Actions</h4>
                                        {stat.actions.map((act, a) => (
                                            <div key={a} className="mb-1">
                                                <span className="font-bold italic">{act.name}.</span> {act.desc}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MERCANTILE LEDGER --- */}
                <div className={`${printMode !== 'full' && printMode !== 'shops' ? 'print:hidden' : ''} break-after-page page-break`}>
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12 font-serif text-center">Appendix C: Mercantile Ledger</h2>

                    <div className="break-inside-avoid mb-8 p-4 bg-gray-100 border-l-4 border-black italic shadow-inner">
                        &quot;{FLAVOR_QUOTES.shops.text}&quot;
                        <div className="text-right mt-2 text-xs font-bold not-italic">— {FLAVOR_QUOTES.shops.author}</div>
                    </div>

                    <div className="columns-2 gap-8 text-sm">
                        {/* Fimble's Shop */}
                        <div className="break-inside-avoid border-2 border-black p-4 mb-6">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-3">Fimble&apos;s Wondrous Wares</h3>
                            <p className="italic mb-3 text-xs">Located in the Marketplace. Currency: Memories & Lifeforce.</p>
                            {FIMBLE_INVENTORY.map((item, i) => (
                                <div key={i} className="mb-3 pb-2 border-b border-gray-300 last:border-0">
                                    <div className="font-bold uppercase flex justify-between">
                                        <span>{item.name}</span>
                                        <span className="text-xs">{item.rarity}</span>
                                    </div>
                                    <div className="text-xs italic text-gray-700">Cost: {item.cost}</div>
                                    <p className="text-xs mt-1">{item.effect}</p>
                                    <p className="text-[10px] mt-1 italic text-gray-500">&quot;{item.npcQuote}&quot;</p>
                                </div>
                            ))}
                        </div>

                        {/* Iron Knot */}
                        <div className="break-inside-avoid border-2 border-black p-4 mb-6">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-3">The Iron Knot Forge</h3>
                            <p className="italic mb-3 text-xs">Located in the Dwarven District. Master Smith: Kaelen.</p>
                            {IRON_KNOT_SERVICES.map((item, i) => (
                                <div key={i} className="mb-3 pb-2 border-b border-gray-300 last:border-0">
                                    <div className="font-bold uppercase">
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="text-xs italic text-gray-700">Cost: {item.cost}</div>
                                    <p className="text-xs mt-1">{item.effect}</p>
                                </div>
                            ))}
                        </div>

                        {/* Crow's Nest */}
                        <div className="break-inside-avoid border-2 border-black p-4 mb-6">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-3">The Crow&apos;s Nest</h3>
                            <p className="italic mb-3 text-xs">Black Market (Thieves Guild). Ask for 'The Crow'.</p>
                            {CROW_NEST_INVENTORY.map((item, i) => (
                                <div key={i} className="mb-3 pb-2 border-b border-gray-300 last:border-0">
                                    <div className="font-bold uppercase flex justify-between">
                                        <span>{item.name}</span>
                                        <span className="text-xs">{item.rarity}</span>
                                    </div>
                                    <div className="text-xs italic text-gray-700">Cost: {item.cost}</div>
                                    <p className="text-xs mt-1">{item.effect}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- MAGIC ITEMS ALL --- */}
                <div className={`${printMode !== 'full' && printMode !== 'shops' ? 'print:hidden' : ''} break-after-page page-break`}>
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12 font-serif text-center">Appendix B: Magic Items Registry</h2>
                    <div className="columns-2 gap-8">
                        {CAMPAIGN_UNIQUE_ITEMS.map((item, i) => (
                            <div key={i} className="break-inside-avoid border border-black p-3 mb-4 bg-white text-xs shadow-sm">
                                <h3 className="font-bold text-md uppercase mb-1 font-serif">{item.name}</h3>
                                <div className="border-b border-black mb-1 pb-1 italic text-[10px]">{item.rarity || "Common"} {item.type}</div>
                                <p className="leading-snug">{item.description || item.effect}</p>
                                <div className="mt-1 text-right font-bold text-[10px]">Source: {item.cost}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MECHANICS SECTION --- */}
                <div className={`${printMode !== 'full' && printMode !== 'mechanics' ? 'print:hidden' : ''} break-after-page page-break`}>
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12 font-serif text-center">Appendix D: Global Mechanics</h2>

                    <div className="mb-8 break-inside-avoid border-2 border-black p-6">
                        <h3 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 font-serif">The Curse System</h3>
                        <p className="mb-4">{CURSE_MECHANICS.description}</p>
                        <div className="grid grid-cols-1 gap-2">
                            {CURSE_MECHANICS.stages.map(stage => (
                                <div key={stage.name} className="flex gap-4 border-b border-gray-300 pb-2">
                                    <strong className="w-32 shrink-0">Day {stage.day}+: {stage.name}</strong>
                                    <em className="text-gray-800">{stage.effect}</em>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 break-inside-avoid border border-black p-4">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-2 font-serif">{PROLOGUE_POWERS.title}</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                {PROLOGUE_POWERS.bonuses.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </div>
                        <div className="flex-1 break-inside-avoid border border-black p-4">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-2 font-serif">{SAFE_HAVEN.title}</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                {SAFE_HAVEN.features.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="no-print mt-12 pt-8 border-t border-gray-300 text-center text-gray-400 text-sm">
                    Generated by Antigravity V2 // Heart&apos;s Curse Application // AD&D 2e Print Module
                </div>
            </div>

            <style jsx global>{`
                /* Cover Page Print Optimizations */
                .print-cover-container {
                    break-after: page;
                    page-break-after: always;
                    height: 100vh;
                    width: 100%;
                    position: relative;
                    background-color: white !important; /* Save ink */
                    color: black !important;
                    border: 4px solid black !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .page-break {
                    page-break-after: always;
                    break-after: page;
                }

                @media print {
                    @page {
                        margin: 0.5in;
                        size: letter;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        font-family: 'Times New Roman', serif; /* Classic Print Font */
                    }
                    /* Ensure containers fill page but keep safe text margin */
                    .max-w-[816px] {
                        max-width: none !important;
                        width: 100% !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                    /* Columns formatting */
                    .columns-2 {
                        column-count: 2;
                        column-gap: 0.5in;
                    }
                    /* Text sizing updates */
                    .text-sm {
                        font-size: 9pt; /* Standard 2e print size */
                        line-height: 1.1;
                    }
                    .text-xs {
                        font-size: 8pt;
                    }
                    .leading-snug {
                        line-height: 1.15;
                    }
                    
                    /* Hide non-printable elements */
                    .no-print { display: none !important; }
                    
                    /* Force Backgrounds for Boxed Text */
                    .bg-gray-100 {
                        background-color: #f3f4f6 !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </div >
    );
}

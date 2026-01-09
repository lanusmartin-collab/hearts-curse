import React from 'react';
import Image from 'next/image';
import { CAMPAIGN_MAPS } from '@/lib/data/maps';
import { CAMPAIGN_LORE } from '@/lib/data/lore';
import { ALL_MONSTERS } from '@/lib/data/monsters_2024';
import { ITEMS } from '@/lib/data/items';
import { CURSE_MECHANICS, PROLOGUE_POWERS, SAFE_HAVEN } from '@/lib/data/mechanics';

type CampaignModuleTemplateProps = {
    onClose: () => void;
};

export default function CampaignModuleTemplate({ onClose }: CampaignModuleTemplateProps) {
    return (
        <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto text-black font-serif print:static print:overflow-visible print:h-auto print:bg-white">
            {/* Toolbar - No Print */}
            <div className="no-print fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center shadow-lg z-50">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-accent uppercase tracking-widest">Campaign Book Mode (Full PDF)</span>
                    <button
                        onClick={() => window.print()}
                        className="bg-accent px-4 py-2 rounded text-black font-bold hover:bg-white transition-colors"
                    >
                        PRINT / SAVE FULL BOOK
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white underline"
                >
                    Close Viewer
                </button>
            </div>

            {/* Book Content Container */}
            <div className="max-w-[816px] mx-auto bg-white min-h-screen pt-24 pb-12 px-12 shadow-2xl print:shadow-none print:pt-0 print:mx-0 print:w-full print:max-w-none">

                {/* COVER PAGE */}
                <div className="print-cover-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black text-white border-8 border-yellow-600 rounded-lg mb-8 print:border-none print:rounded-none">
                    <Image
                        src="/cover_art_v8.png"
                        alt="Heart's Curse Campaign Cover"
                        fill
                        className="object-cover opacity-90"
                        priority
                    />
                    <div className="absolute top-12 left-0 w-full text-center z-10">
                        <h1 className="text-8xl font-extrabold text-yellow-500 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] font-serif tracking-tight print:text-6xl">HEART&apos;S CURSE</h1>
                        <p className="text-2xl text-yellow-200 mt-4 tracking-[0.5em] uppercase font-bold drop-shadow-md print:text-black print:bg-white/80 print:inline-block print:px-2">Advanced Dungeons & Dragons</p>
                    </div>
                    <div className="absolute bottom-12 z-10 bg-black/80 px-8 py-2 border border-yellow-600 pt-30">
                        <p className="text-yellow-500 font-bold uppercase tracking-widest">A Campaign for Levels 10-20</p>
                    </div>
                </div>

                {/* TABLE OF CONTENTS */}
                <div className="break-after-page page-break mb-12">
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-6">Table of Contents</h2>
                    <ul className="columns-2 gap-8 space-y-2 text-sm font-medium">
                        <li><strong>Introduction:</strong> The Curse of Oakhaven</li>
                        {CAMPAIGN_MAPS.map((map, idx) => (
                            <li key={idx}><strong>Chapter {idx + 1}:</strong> {map.title}</li>
                        ))}
                        <li><strong>Appendix A:</strong> Monster Compendium</li>
                        <li><strong>Appendix B:</strong> Magic Items & Artifacts</li>
                        <li><strong>Appendix C:</strong> Factions & Lore</li>
                        <li><strong>Appendix D:</strong> Global Mechanics</li>
                    </ul>
                </div>

                {/* --- LORE SECTION --- */}
                <div className="columns-2 gap-8 text-justify leading-relaxed text-sm mb-12 break-inside-avoid">
                    <h2 className="text-3xl font-bold uppercase border-b-2 border-black mb-4 column-span-all">Introduction</h2>

                    {CAMPAIGN_LORE.map((section) => (
                        <div key={section.id} className="mb-6 break-inside-avoid">
                            <h3 className="font-bold uppercase text-lg">{section.title}</h3>
                            <p className="indent-4 mb-2 whitespace-pre-wrap">{section.content}</p>
                        </div>
                    ))}
                </div>

                <div className="break-after-page page-break"></div>

                {/* --- ADVENTURES SECTION --- */}
                {CAMPAIGN_MAPS.map((mapData, index) => (
                    <div key={mapData.id} className="break-after-page page-break">
                        <div className="border-b-4 border-black mb-8 pb-2 mt-8">
                            <h2 className="text-4xl font-extrabold uppercase tracking-tight">Chapter {index + 1}: {mapData.title}</h2>
                            <div className="flex justify-between items-end mt-2">
                                <span className="italic text-lg text-gray-600">Level {mapData.id.toUpperCase().substring(0, 3)}</span>
                            </div>
                        </div>

                        <div className="columns-2 gap-8 text-justify leading-relaxed text-sm">
                            <div className="break-inside-avoid bg-gray-100 border-2 border-black p-4 mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                                <p className="italic font-serif">{mapData.description.replace(/\*\*/g, '')}</p>
                            </div>

                            {mapData.mechanics && mapData.mechanics.length > 0 && (
                                <div className="break-inside-avoid mb-6">
                                    <h3 className="font-bold uppercase border-b-2 border-black mb-2 text-lg">Dungeon Features</h3>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {mapData.mechanics.map((mech, i) => (
                                            <li key={i}>{mech}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="break-inside-avoid w-full mb-8 border border-black relative grayscale contrast-125">
                                <Image
                                    src={mapData.imagePath}
                                    alt="Dungeon Map"
                                    width={800}
                                    height={600}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>

                            <h3 className="break-inside-avoid font-bold uppercase border-b-2 border-black mb-4 text-xl mt-8 column-span-all">Encounter Key</h3>

                            {mapData.nodes?.map((node, i) => (
                                <div key={i} className="break-inside-avoid mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-lg">{i + 1}. {node.label}</span>
                                        <span className="text-xs uppercase font-bold text-gray-500">[{node.type}]</span>
                                    </div>
                                    <p className="indent-4">{node.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* --- BESTIARY SECTION --- */}
                <div className="break-after-page page-break">
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12">Appendix A: Monster Compendium</h2>
                    <div className="columns-2 gap-8">
                        {ALL_MONSTERS.sort((a, b) => a.name.localeCompare(b.name)).map((stat, i) => (
                            <div key={i} className="break-inside-avoid border-2 border-black p-4 mb-6 bg-white text-xs">
                                <h3 className="font-bold text-xl uppercase mb-1">{stat.name}</h3>
                                <div className="border-b border-black mb-2 pb-1 italic">{stat.size} {stat.type}, {stat.alignment}</div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                                    <div><strong>AC:</strong> {stat.ac}</div>
                                    <div><strong>HP:</strong> {stat.hp}</div>
                                    <div className="col-span-2"><strong>Speed:</strong> {stat.speed}</div>
                                </div>
                                <div className="border-t border-black pt-1 mb-2 grid grid-cols-6 gap-1 text-center font-bold">
                                    <div>STR<br />{stat.stats.str}</div>
                                    <div>DEX<br />{stat.stats.dex}</div>
                                    <div>CON<br />{stat.stats.con}</div>
                                    <div>INT<br />{stat.stats.int}</div>
                                    <div>WIS<br />{stat.stats.wis}</div>
                                    <div>CHA<br />{stat.stats.cha}</div>
                                </div>

                                <div className="space-y-2 mt-2">
                                    {stat.traits.map((trait, t) => (
                                        <div key={t}>
                                            <span className="font-bold italic">{trait.name}.</span> {trait.desc}
                                        </div>
                                    ))}
                                </div>

                                {stat.actions.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-black">
                                        <h4 className="font-bold uppercase text-sm mb-1">Actions</h4>
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

                {/* --- ITEMS SECTION --- */}
                <div className="break-after-page page-break">
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12">Appendix B: Magic Items & Artifacts</h2>
                    <div className="columns-2 gap-8">
                        {ITEMS.map((item, i) => (
                            <div key={i} className="break-inside-avoid border border-black p-4 mb-4 bg-white text-xs shadow-sm">
                                <h3 className="font-bold text-lg uppercase mb-1">{item.name}</h3>
                                <div className="border-b border-black mb-2 pb-1 italic">{item.rarity || "Common"} {item.type}</div>
                                <p className="leading-snug">{item.description || item.effect}</p>
                                <div className="mt-2 text-right font-bold">{item.cost}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MECHANICS SECTION --- */}
                <div className="break-after-page page-break">
                    <h2 className="text-4xl font-bold uppercase border-b-4 border-black mb-8 mt-12">Appendix D: Global Mechanics</h2>

                    <div className="mb-8 break-inside-avoid">
                        <h3 className="text-2xl font-bold uppercase border-b-2 border-black mb-4">The Curse System</h3>
                        <p className="mb-4">{CURSE_MECHANICS.description}</p>
                        <div className="grid grid-cols-1 gap-4">
                            {CURSE_MECHANICS.stages.map(stage => (
                                <div key={stage.name} className="border border-black p-2">
                                    <strong>Day {stage.day}+: {stage.name}</strong> - <em>{stage.effect}</em>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div className="flex-1 break-inside-avoid">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-2">{PROLOGUE_POWERS.title}</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                {PROLOGUE_POWERS.bonuses.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                        </div>
                        <div className="flex-1 break-inside-avoid">
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-2">{SAFE_HAVEN.title}</h3>
                            <ul className="list-disc pl-4 space-y-1">
                                {SAFE_HAVEN.features.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="no-print mt-12 pt-8 border-t border-gray-300 text-center text-gray-400 text-sm">
                    Generated by Antigravity V2 // Heart&apos;s Curse Application
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
                    background-color: black !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .page-break {
                    page-break-after: always;
                    break-after: page;
                }

                @media print {
                    @page {
                        margin: 0;
                        size: letter;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    /* Ensure containers fill page but keep safe text margin */
                    .max-w-\[816px\] {
                        max-width: none !important;
                        width: 100% !important;
                        padding: 0 0.5in !important; /* Safety gutter for text */
                    }
                    /* Columns formatting */
                    .columns-2 {
                        column-count: 2;
                        column-gap: 2rem;
                    }
                    /* Text sizing updates */
                    .text-sm {
                        font-size: 10pt; /* Standard 2e print size */
                    }
                    .text-xs {
                        font-size: 8pt;
                    }
                    /* Fix Cover Image Aspect Ratio for Print */
                    img {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div >
    );
}

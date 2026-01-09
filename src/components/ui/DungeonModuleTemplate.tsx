import React from 'react';
import Image from 'next/image';
import { CampaignMap } from '@/lib/data/maps';

type DungeonModuleTemplateProps = {
    mapData: CampaignMap;
    onClose: () => void;
};

export default function DungeonModuleTemplate({ mapData, onClose }: DungeonModuleTemplateProps) {
    return (
        <div className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto text-black font-serif">
            {/* Toolbar - No Print */}
            <div className="no-print fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center shadow-lg z-50">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-accent uppercase tracking-widest">Compendium Mode (AD&D 2e Style)</span>
                    <button
                        onClick={() => window.print()}
                        className="bg-accent px-4 py-2 rounded text-black font-bold hover:bg-white transition-colors"
                    >
                        PRINT / SAVE PDF
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

                {/* 2e Header Style */}
                <div className="border-b-4 border-black mb-8 pb-2">
                    <h1 className="text-5xl font-extrabold uppercase tracking-tight">{mapData.title}</h1>
                    <div className="flex justify-between items-end mt-2">
                        <span className="italic text-lg text-gray-600">Advanced Dungeons & Dragons</span>
                        <span className="font-bold text-xl">Level {mapData.id.toUpperCase().substring(0, 3)}</span>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="columns-2 gap-8 text-justify leading-relaxed text-sm">
                    {/* Intro Boxed Text */}
                    <div className="break-inside-avoid bg-gray-100 border-2 border-black p-4 mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        <p className="italic font-serif">{mapData.description.replace(/\*\*/g, '')}</p>
                    </div>

                    {/* Regional Mechanics */}
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

                    {/* Quest Guide - DM Only / Guide */}
                    {mapData.questGuide && (
                        <div className="break-inside-avoid mb-6 bg-yellow-50 border border-yellow-200 p-4">
                            <h3 className="font-bold uppercase border-b-2 border-yellow-400 mb-2 text-lg text-yellow-900">Quest Guide & Secrets</h3>
                            <p className="italic text-gray-800">{mapData.questGuide.replace(/\*\*/g, '')}</p>
                        </div>
                    )}

                    {/* The Map Image - Full Width in Print? No, usually fitted. */}
                    <div className="break-inside-avoid w-full mb-8 border border-black relative grayscale contrast-125">
                        {/* We render the map image here simply */}
                        <Image
                            src={mapData.imagePath}
                            alt="Dungeon Map"
                            width={800}
                            height={600}
                            className="w-full h-auto"
                        />
                        {/* Note: We rely on the printed reference numbers on the map being handled by the visual map in the app, 
                             HTML printing of the map with overlaid divs is tricky. For this specific 'Book Mode', 
                             we might just show the raw image and let the key descriptions do the work, 
                             OR we assume the user printed the map separately. 
                             
                             However, to be helpful, let's list the keys clearly.
                        */}
                    </div>

                    {/* Node Descriptions */}
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

                {/* Footer */}
                <div className="no-print mt-12 pt-8 border-t border-gray-300 text-center text-gray-400 text-sm">
                    Generated by Antigravity V2 // TSR Style Module Generator
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0.5in; size: letter; }
                    body { background: white; }
                    .columns-2 { column-count: 2; }
                }
            `}</style>
        </div>
    );
}

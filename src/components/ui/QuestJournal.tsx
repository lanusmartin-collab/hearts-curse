"use client";

import React, { useState } from 'react';

type JournalTab = 'quests' | 'rumors' | 'lore';

export default function QuestJournal({ onClose }: { onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<JournalTab>('quests');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="relative w-[800px] h-[600px] bg-[#e3d5b8] shadow-2xl rounded-sm overflow-hidden flex"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                    boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 0 100px rgba(60,40,20,0.2)'
                }}
            >
                {/* Book Binding */}
                <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-[#5c4033] to-[#3e2723] z-10 shadow-inner"></div>

                {/* Left Page */}
                <div className="flex-1 p-8 pr-12 font-serif text-[#2c1810]">
                    <h2 className="text-3xl font-bold mb-6 font-handwriting border-b-2 border-[#2c1810]/20 pb-2">
                        Journal of the Heart
                    </h2>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('quests')}
                            className={`px-3 py-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'quests' ? 'border-[#8a1c1c] text-[#8a1c1c]' : 'border-transparent text-gray-600'}`}
                        >
                            Quests
                        </button>
                        <button
                            onClick={() => setActiveTab('rumors')}
                            className={`px-3 py-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'rumors' ? 'border-[#8a1c1c] text-[#8a1c1c]' : 'border-transparent text-gray-600'}`}
                        >
                            Rumors
                        </button>
                        <button
                            onClick={() => setActiveTab('lore')}
                            className={`px-3 py-1 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'lore' ? 'border-[#8a1c1c] text-[#8a1c1c]' : 'border-transparent text-gray-600'}`}
                        >
                            Lore
                        </button>
                    </div>

                    <div className="space-y-4 font-handwriting text-lg h-full overflow-y-auto custom-scrollbar pr-2">
                        {activeTab === 'quests' && (
                            <>
                                <div className="mb-4">
                                    <h3 className="font-bold text-xl text-[#8a1c1c]">Stop the Heart's Curse</h3>
                                    <p className="opacity-80">The beating grows louder effectively every day. We must find the source in the Netherese Ruins.</p>
                                    <div className="mt-2 text-sm text-[#8a1c1c] font-sans font-bold">[MAIN OBJECTIVE]</div>
                                </div>
                                <div className="mb-4 opacity-60">
                                    <h3 className="font-bold text-xl line-through">Establish a Base</h3>
                                    <p>Oakhaven has been secured, for now.</p>
                                </div>
                            </>
                        )}
                        {activeTab === 'rumors' && (
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The Zhentarim are smuggling *something* out of the mines.</li>
                                <li>Old man Corvus says the fog eats memories.</li>
                                <li>Don't look at the moon when it's red.</li>
                            </ul>
                        )}
                        {activeTab === 'lore' && (
                            <div className="space-y-4">
                                <p><strong>The Silent Wards:</strong> A prison for things that should not exist. The silence is not natural; it is enforced.</p>
                                <p><strong>Netheril:</strong> Their hubris broke the world. We are just living in the shards.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Page */}
                <div className="flex-1 p-8 pl-12 font-handwriting text-lg text-[#2c1810] relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#8a1c1c] hover:scale-110 transition-transform font-bold text-xl"
                    >
                        ✕
                    </button>

                    <div className="h-full flex flex-col justify-center items-center opacity-40 select-none pointer-events-none">
                        <div className="w-48 h-48 border-4 border-dashed border-[#2c1810] rounded-full flex items-center justify-center rotate-12">
                            <span className="text-2xl font-bold uppercase text-center">Department of<br />Misinformation</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

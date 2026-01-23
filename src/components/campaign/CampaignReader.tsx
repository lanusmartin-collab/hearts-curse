"use client";

import { useState } from "react";
import { CAMPAIGN_CONTENT, Chapter, Section } from "@/lib/data/campaign_content";
import { BookOpen, ChevronRight, X, Menu } from "lucide-react";

// Simple Markdown Parser Component
const MarkdownRenderer = ({ content }: { content: string }) => {
    const lines = content.split('\n');

    return (
        <div className="space-y-4 text-[#d4d4d4] leading-relaxed font-serif">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />; // Spacer

                // Headers
                if (line.startsWith('# '))
                    return <h1 key={i} className="text-3xl font-header text-[var(--gold-accent)] mt-8 mb-4 border-b border-[#333] pb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## '))
                    return <h2 key={i} className="text-xl font-bold text-[#b5a685] mt-6 mb-2">{line.replace('## ', '')}</h2>;

                // Blockquote (Read Aloud)
                if (line.startsWith('> ')) {
                    return (
                        <div key={i} className="bg-[#1a1111] border-l-4 border-[var(--scarlet-accent)] p-4 my-4 italic text-[#ccc]">
                            {line.replace('> ', '')}
                        </div>
                    );
                }

                // Bullets
                if (line.trim().startsWith('* ')) {
                    return (
                        <li key={i} className="ml-6 list-disc text-[#b0b0b0]">
                            {parseInline(line.replace('* ', ''))}
                        </li>
                    );
                }

                return <p key={i}>{parseInline(line)}</p>;
            })}
        </div>
    );
};

// Helper to parse **bold**
const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export default function CampaignReader({ onClose }: { onClose: () => void }) {
    const [activeChapterId, setActiveChapterId] = useState<string>(CAMPAIGN_CONTENT[0].id);
    const [activeSectionId, setActiveSectionId] = useState<string>(CAMPAIGN_CONTENT[0].sections[0].id);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const currentChapter = CAMPAIGN_CONTENT.find(c => c.id === activeChapterId);
    const currentSection = currentChapter?.sections.find(s => s.id === activeSectionId);

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col md:flex-row text-[#d4d4d4]">

            {/* Header (Mobile) */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-[#333] bg-[#0e0e0e]">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[var(--gold-accent)]">
                    <Menu />
                </button>
                <span className="font-header tracking-widest">TOME OF KNOWLEDGE</span>
                <button onClick={onClose} className="text-[#666]">
                    <X />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className={`
                ${sidebarOpen ? 'flex' : 'hidden'} md:flex
                flex-col w-full md:w-80 bg-[#0e0e0e] border-r border-[#333] h-full
            `}>
                <div className="hidden md:flex items-center justify-between p-6 border-b border-[#333]">
                    <div className="flex items-center gap-2 text-[var(--gold-accent)]">
                        <BookOpen size={20} />
                        <span className="font-header tracking-widest text-lg">THE TOME</span>
                    </div>
                    <button onClick={onClose} className="text-[#666] hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {CAMPAIGN_CONTENT.map(chapter => (
                        <div key={chapter.id}>
                            <div
                                className={`text-xs font-bold uppercase tracking-wider mb-2 ${activeChapterId === chapter.id ? 'text-[var(--gold-accent)]' : 'text-[#666]'}`}
                            >
                                {chapter.title}
                            </div>
                            <div className="space-y-1 pl-2 border-l border-[#333]">
                                {chapter.sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveChapterId(chapter.id);
                                            setActiveSectionId(section.id);
                                            // Close sidebar on mobile on select
                                            if (window.innerWidth < 768) setSidebarOpen(false);
                                        }}
                                        className={`
                                            block w-full text-left text-sm py-1 px-3 rounded transition
                                            ${activeSectionId === section.id && activeChapterId === chapter.id
                                                ? 'bg-[#222] text-white'
                                                : 'text-[#888] hover:text-[#bbb] hover:bg-[#1a1a1a]'}
                                        `}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] relative custom-scrollbar">
                <div className="max-w-3xl mx-auto p-8 md:p-12 min-h-screen bg-[#0a0a0a] shadow-2xl border-x border-[#1a1a1a]">
                    {currentSection ? (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#666] mb-8 font-mono">
                                <span>{currentChapter?.title}</span>
                                <ChevronRight size={12} />
                                <span className="text-[var(--gold-accent)]">{currentSection.title}</span>
                            </div>

                            <MarkdownRenderer content={currentSection.content} />

                            <div className="mt-16 pt-8 border-t border-[#333] flex justify-between text-xs text-[#444] font-mono">
                                <span>HEART'S CURSE CAMPAIGN</span>
                                <span>PAGE {activeSectionId.toUpperCase()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[#666]">
                            Select a chapter to begin reading...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

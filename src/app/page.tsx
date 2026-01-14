"use client";
import { useState } from "react";
import Image from "next/image";
import {
  BookOpen, ShoppingBag, Skull, Map,
  Zap, Swords, Hammer, PenTool, FileText
} from "lucide-react";
import DashboardWidget from "@/components/ui/DashboardWidget";
import CurseTracker from "@/components/ui/CurseTracker";
import CampaignModuleTemplate from "@/components/ui/CampaignModuleTemplate";
import PartyStatusWidget from "@/components/ui/PartyStatusWidget";
import NotepadWidget from "@/components/ui/NotepadWidget";
import QuestTrackerWidget from "@/components/ui/QuestTrackerWidget";

export default function Home() {
  const [viewMode, setViewMode] = useState<"home" | "book">("home");

  if (viewMode === "book") {
    return <CampaignModuleTemplate onClose={() => setViewMode("home")} />;
  }

  return (
    <div className="retro-container min-h-screen flex flex-col p-8">

      {/* HEADER SECTION */}
      <header className="campaign-header mb-8 flex flex-col md:flex-row justify-between items-end border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-16 h-16">
              <div className="animate-pulse-slow absolute inset-0 border border-[var(--scarlet-accent)] rounded-full opacity-50 blur-md"></div>
              <Image
                src="/hearts_curse_hero_v15.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(163,34,34,0.5)]"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="campaign-title-glitch text-5xl m-0 leading-none" data-text="HEART'S CURSE">
                HEART&apos;S CURSE
              </h1>
              <p className="campaign-subtitle text-xs tracking-[0.4em] text-[var(--gold-accent)] opacity-80 mt-1">
                <span className="animate-flicker text-[var(--scarlet-accent)]">● LIVE</span> // DM COMMAND CENTER
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action: Open PDF Book */}
        <button
          onClick={() => setViewMode("book")}
          className="group relative px-6 py-2 bg-black/40 border border-[var(--gold-accent)] text-[var(--gold-accent)] font-serif uppercase text-xs tracking-widest hover:bg-[var(--gold-accent)] hover:text-black transition-all"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Campaign Module</span>
          </div>
        </button>
      </header>

      {/* DASHBOARD GRID - 3 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">

        {/* LEFT COLUMN: Vitals (3 Cols) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <PartyStatusWidget />

          {/* Curse Widget */}
          <DashboardWidget title="Threat System" subtitle="Regional Effect" href="/mechanics" style={{ borderColor: "rgba(138, 28, 28, 0.5)" }}>
            <CurseTracker simpleView={true} />
            <div className="mt-4 text-xs text-[var(--fg-dim)] italic border-t border-[var(--glass-border)] pt-2">
              "The shadows lengthen with every passing day..."
            </div>
          </DashboardWidget>
        </div>

        {/* MIDDLE COLUMN: Operations (6 Cols) */}
        <div className="xl:col-span-6 flex flex-col gap-6">

          {/* Quest / Objectives */}
          <QuestTrackerWidget />

          {/* Main Nav Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grimoire Widget (Promoted) */}
            <DashboardWidget
              title="The Grimoire"
              subtitle="Spell Database"
              icon={BookOpen}
              href="/grimoire"
              style={{
                borderColor: "#a32222",
                backgroundImage: "linear-gradient(to bottom, rgba(16,16,20,0.9), rgba(16,16,20,0.8)), url('https://www.transparenttextures.com/patterns/aged-paper.png')"
              }}
            >
              <p className="text-sm text-[var(--gold-accent)] opacity-90">Full library of incantations. Now with advanced search & filtering.</p>
            </DashboardWidget>

            {/* Market */}
            <DashboardWidget
              title="Black Market"
              subtitle="Shops & Items"
              icon={ShoppingBag}
              href="/shops"
              style={{
                backgroundImage: "linear-gradient(to bottom, rgba(16,16,20,0.95), rgba(16,16,20,0.8)), url('/market-bg-pattern.png')",
                backgroundSize: "cover"
              }}
            >
              <p className="text-sm text-[var(--fg-dim)]">Manage inventory for Korgul, Fimble, and locally sourced goods.</p>
            </DashboardWidget>
          </div>

          {/* Cartography */}
          <DashboardWidget title="Cartography" subtitle="Tactical Maps" icon={Map} href="/maps">
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex justify-between text-xs border-b border-[var(--glass-border)] pb-2">
                <span className="text-[var(--fg-color)]">SILENT WARDS</span>
                <span className="text-[var(--gold-accent)] animate-pulse">ACTIVE</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[var(--glass-border)] pb-2 opacity-70">
                <span>BEHOLDER LAIR</span>
                <span>MAPPED</span>
              </div>
              <div className="flex justify-between text-xs opacity-40">
                <span>HEART CHAMBER</span>
                <span>UNKNOWN</span>
              </div>
            </div>
          </DashboardWidget>

          {/* Quick Stats: Monster Compendium */}
          <DashboardWidget title="Monster Compendium" subtitle="Bestiary" icon={Skull} href="/statblocks">
            <div className="flex items-center gap-4">
              <div className="bg-[#1a0505] p-3 rounded border border-[var(--scarlet-accent)]">
                <Skull className="w-6 h-6 text-[var(--scarlet-accent)]" />
              </div>
              <div>
                <div className="font-bold text-[var(--fg-color)] text-lg">100+ ENTRIES</div>
                <div className="text-[var(--fg-dim)] text-xs">Recently Added: Acererak</div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* RIGHT COLUMN: Tools (3 Cols) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <NotepadWidget />

          <div className="grid grid-cols-2 gap-4">
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" className="aspect-square flex flex-col justify-center text-center" />
            <DashboardWidget title="Archive" subtitle="Lore" icon={FileText} href="/lore" className="aspect-square flex flex-col justify-center text-center" />
            <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" className="aspect-square flex flex-col justify-center text-center" />
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" className="aspect-square flex flex-col justify-center text-center" />
          </div>

          <DashboardWidget title="Print Lab" subtitle="Physical Handouts" icon={FileText} href="/deliverables">
            <p className="text-xs text-[var(--fg-dim)]">Generate print-ready assets.</p>
          </DashboardWidget>

          <footer className="mt-auto text-center opacity-40 font-mono text-[10px] pt-4 text-[var(--fg-dim)]">
            v1.4.0 // HEART'S CURSE
          </footer>
        </div>
      </div>
    </div>
  );
}

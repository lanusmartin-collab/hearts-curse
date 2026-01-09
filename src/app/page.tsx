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

export default function Home() {
  const [viewMode, setViewMode] = useState<"home" | "book">("home");

  if (viewMode === "book") {
    return <CampaignModuleTemplate onClose={() => setViewMode("home")} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pt-20 max-w-[1600px] mx-auto">

      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b border-[var(--glass-border)] pb-6 relative">
        <div className="flex-1">
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--scarlet-accent)] mb-2 tracking-tighter"
            style={{ textShadow: "0 0 30px rgba(138, 28, 28, 0.6)" }}>
            HEART&apos;S CURSE
          </h1>
          <p className="font-mono text-[var(--fg-dim)] tracking-[0.3em] uppercase text-sm md:text-base">
            Campaign Manager <span className="text-[var(--mystic-accent)]">v2.0 // NETHER-OS</span>
          </p>
        </div>

        {/* Quick Action: Open PDF Book */}
        <button
          onClick={() => setViewMode("book")}
          className="group relative px-6 py-3 overflow-hidden rounded bg-[var(--obsidian-base)] border border-[var(--gold-accent)]/50 hover:border-[var(--gold-accent)] transition-all"
        >
          <div className="absolute inset-0 bg-[var(--gold-accent)]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 font-serif text-[var(--gold-accent)] uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Open Campaign Book
          </span>
        </button>
      </header>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Status & Quick Stats (4 col) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Curse Widget */}
          <DashboardWidget title="Threat System" subtitle="Regional Effect" className="border-[var(--scarlet-accent)]/30">
            <CurseTracker simpleView={true} />
            <div className="mt-4 text-xs text-[var(--fg-dim)] italic border-t border-[var(--glass-border)] pt-2">
              "The shadows lengthen with every passing day..."
            </div>
          </DashboardWidget>

          {/* Quick Nav: Archives */}
          <DashboardWidget title="The Archives" subtitle="Lore & History" icon={BookOpen} href="/lore">
            <div className="text-sm opacity-80 mb-2">Access decrypted Netherese texts and campaign timeline.</div>
            <div className="h-1 w-full bg-[var(--glass-border)] rounded overflow-hidden">
              <div className="h-full bg-[var(--mystic-accent)] w-3/4" />
            </div>
            <div className="text-[10px] text-right mt-1 font-mono text-[var(--mystic-accent)]">DATABANK: 75% DECRYPTED</div>
          </DashboardWidget>

          {/* Quick Nav: Bestiary */}
          <DashboardWidget title="Bestiary" subtitle="Monster Compendium" icon={Skull} href="/statblocks">
            <div className="flex items-center gap-3">
              <div className="bg-[var(--ink-color)] p-2 rounded border border-[var(--glass-border)]">
                <Skull className="w-8 h-8 text-[var(--scarlet-accent)]" />
              </div>
              <div className="text-sm">
                <div className="font-bold text-[var(--fg-color)]">100+ ENTRIES</div>
                <div className="text-[var(--fg-dim)] text-xs">Recently Added: Acererak</div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* MIDDLE COLUMN: Primary Navigation (4 col) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Market */}
          <DashboardWidget title="Black Market" subtitle="Shops & Items" icon={ShoppingBag} href="/shops" className="h-[180px]">
            <div className="h-full bg-[url('/market-bg-pattern.png')] bg-cover bg-center opacity-40 mix-blend-overlay absolute inset-0" />
            <p className="relative z-10 text-sm">Manage inventory for Korgul, Fimble, and local vendors.</p>
          </DashboardWidget>

          {/* Cartography */}
          <DashboardWidget title="Cartography" subtitle="Tactical Maps" icon={Map} href="/maps" className="h-[180px]">
            <div className="relative z-10 space-y-2">
              <div className="flex justify-between text-xs border-b border-[var(--glass-border)] pb-1">
                <span>SILENT WARDS</span>
                <span className="text-[var(--gold-accent)]">ACTIVE</span>
              </div>
              <div className="flex justify-between text-xs border-b border-[var(--glass-border)] pb-1 opacity-60">
                <span>BEHOLDER LAIR</span>
                <span>MAPPED</span>
              </div>
              <div className="flex justify-between text-xs opacity-40">
                <span>HEART CHAMBER</span>
                <span>UNKNOWN</span>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* RIGHT COLUMN: Tools & Utils (4 col) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" className="aspect-square flex flex-col justify-center text-center">
            </DashboardWidget>
            <DashboardWidget title="Editor" subtitle="Notes" icon={PenTool} href="/editor" className="aspect-square flex flex-col justify-center text-center">
            </DashboardWidget>
            <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" className="aspect-square flex flex-col justify-center text-center">
            </DashboardWidget>
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" className="aspect-square flex flex-col justify-center text-center">
            </DashboardWidget>
          </div>

          <DashboardWidget title="Print Lab" subtitle="Physical Handouts" icon={FileText} href="/deliverables">
            <p className="text-xs text-[var(--fg-dim)]">Generate print-ready assets for player handouts.</p>
          </DashboardWidget>
        </div>

      </div>

      <footer className="mt-12 text-center opacity-30 font-mono text-xs border-t border-[var(--glass-border)] pt-8">
        SYSTEM STATUS: STABLE // CONNECTION: SECURE // SHADOWNET: ONLINE
      </footer>
    </div>
  );
}

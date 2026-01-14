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
    <div style={{ minHeight: "100vh", padding: "2rem", paddingTop: "5rem", maxWidth: "1800px", margin: "0 auto" }}>

      {/* HEADER SECTION */}
      <header className="campaign-header mb-8 flex justify-between items-end border-b border-[var(--glass-border)] pb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-12 h-12">
              <div className="animate-pulse-slow absolute inset-0 border border-[var(--scarlet-accent)] rounded-full opacity-50 blur-md"></div>
              <Image
                src="/hearts_curse_hero_v15.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(163,34,34,0.5)]"
              />
            </div>
            <h1 className="campaign-title-glitch text-4xl m-0" data-text="HEART'S CURSE">
              HEART&apos;S CURSE
            </h1>
          </div>
          <p className="campaign-subtitle text-xs tracking-[0.3em] text-[var(--gold-accent)] opacity-80 pl-16">
            <span className="animate-flicker text-[var(--scarlet-accent)]">● LIVE</span> // DM COMMAND CENTER // SESSION 4
          </p>
        </div>

        {/* Quick Action: Open PDF Book */}
        <button
          onClick={() => setViewMode("book")}
          style={{
            position: "relative",
            padding: "0.5rem 1rem",
            background: "rgba(0,0,0,0.4)",
            border: "1px solid var(--gold-accent)",
            color: "var(--gold-accent)",
            fontFamily: "var(--font-serif)",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem"
          }}
          className="hover:bg-[var(--gold-accent)] hover:text-black transition-colors"
        >
          <BookOpen style={{ width: "14px", height: "14px" }} /> Campaign Module
        </button>
      </header>

      {/* DASHBOARD GRID - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)]">

        {/* LEFT COLUMN: Vitals (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
          <PartyStatusWidget />

          {/* Curse Widget */}
          <DashboardWidget title="Threat System" subtitle="Regional Effect" style={{ borderColor: "rgba(138, 28, 28, 0.3)" }} href="/mechanics">
            <CurseTracker simpleView={true} />
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--fg-dim)", fontStyle: "italic", borderTop: "1px solid var(--glass-border)", paddingTop: "0.5rem" }}>
              "The shadows lengthen with every passing day..."
            </div>
          </DashboardWidget>
        </div>

        {/* MIDDLE COLUMN: Operations (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-6 h-full overflow-y-auto px-2 custom-scrollbar">

          {/* Quest / Objectives */}
          <QuestTrackerWidget />

          {/* Main Nav Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Grimoire Widget (Promoted) */}
            <DashboardWidget title="The Grimoire" subtitle="Spell Database" icon={BookOpen} href="/grimoire" style={{ borderColor: "#a32222", backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}>
              <p style={{ fontSize: "0.75rem", color: "#d7c0a0" }}>Full library of incantations. Now with advanced search & filtering.</p>
            </DashboardWidget>

            {/* Market */}
            <DashboardWidget title="Black Market" subtitle="Shops & Items" icon={ShoppingBag} href="/shops" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/market-bg-pattern.png')", backgroundSize: "cover", backgroundBlendMode: "overlay" }}>
              <p style={{ position: "relative", zIndex: 10, fontSize: "0.875rem" }}>Manage inventory for Korgul, Fimble, and locally sourced goods.</p>
            </DashboardWidget>
          </div>

          {/* Cartography */}
          <DashboardWidget title="Cartography" subtitle="Tactical Maps" icon={Map} href="/maps" style={{ minHeight: "180px" }}>
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.25rem" }}>
                <span>SILENT WARDS</span>
                <span style={{ color: "var(--gold-accent)" }}>ACTIVE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.25rem", opacity: 0.6 }}>
                <span>BEHOLDER LAIR</span>
                <span>MAPPED</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", opacity: 0.4 }}>
                <span>HEART CHAMBER</span>
                <span>UNKNOWN</span>
              </div>
            </div>
          </DashboardWidget>

          {/* Quick Stats: Monster Compendium */}
          <DashboardWidget title="Monster Compendium" subtitle="Bestiary" icon={Skull} href="/statblocks">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ background: "var(--ink-color)", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--glass-border)" }}>
                <Skull style={{ width: "24px", height: "24px", color: "var(--scarlet-accent)" }} />
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "var(--fg-color)" }}>100+ ENTRIES</div>
                <div style={{ color: "var(--fg-dim)", fontSize: "0.75rem" }}>Recently Added: Acererak</div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* RIGHT COLUMN: Tools (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto pl-2 custom-scrollbar">
          <NotepadWidget />

          <div className="grid grid-cols-2 gap-2">
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Archive" subtitle="Lore" icon={FileText} href="/lore" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
          </div>

          <DashboardWidget title="Print Lab" subtitle="Physical Handouts" icon={FileText} href="/deliverables">
            <p style={{ fontSize: "0.75rem", color: "var(--fg-dim)" }}>Generate print-ready assets.</p>
          </DashboardWidget>

          <footer style={{ marginTop: "auto", textAlign: "center", opacity: 0.5, fontFamily: "var(--font-mono)", fontSize: "0.65rem", paddingTop: "1rem", color: "var(--adnd-blue)" }}>
            v1.4.0 // HEART'S CURSE
          </footer>
        </div>
      </div>
    </div>
  );
}

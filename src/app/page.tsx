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
import { AudioProvider } from "@/lib/context/AudioContext";
import AmbientController from "@/components/audio/AmbientController";
import { CommandMenu } from "@/components/ui/CommandMenu";

import GameLayout from "@/components/game/GameLayout";

// INTRO COMPONENTS
import NarrativeIntro from "@/components/game/intro/NarrativeIntro";
import MainMenu from "@/components/game/intro/MainMenu";
import CharacterCreation from "@/components/game/CharacterCreation";
import PrologueController from "@/components/game/intro/PrologueController";

export default function Home() {
  // GAME STATE MANAGEMENT
  // "home" = Dashboard (Default)
  // "book" = Campaign Module PDF View
  // "intro_narrative" = Scrolling text / context
  // "main_menu" = New Game / Load Game
  // "char_creation" = Select Class
  // "prologue" = Larloch Fight -> Wish -> Tower
  // "game" = Actual Dungeon Crawl
  const [viewMode, setViewMode] = useState<"home" | "book" | "intro_narrative" | "main_menu" | "char_creation" | "prologue" | "game">("home");

  // Player State passed to GameLayout
  const [playerClass, setPlayerClass] = useState<string>("warrior");
  const [startingRewards, setStartingRewards] = useState<any>(null);

  // -- STATE HANDLERS --

  if (viewMode === "intro_narrative") {
    return <NarrativeIntro onComplete={() => setViewMode("main_menu")} />;
  }

  if (viewMode === "main_menu") {
    return (
      <MainMenu
        onCreateChar={() => setViewMode("char_creation")}
        onLoadGame={() => alert("Save system not implemented yet.")}
      />
    );
  }

  if (viewMode === "char_creation") {
    // We'll need to import CharacterCreation. Assuming it exists in components/game
    return (
      <CharacterCreation
        onComplete={(cls) => {
          setPlayerClass(cls);
          setViewMode("prologue");
        }}
      />
    );
  }

  if (viewMode === "prologue") {
    return (
      <PrologueController
        playerClass={playerClass}
        onComplete={(rewards) => {
          setStartingRewards(rewards);
          setViewMode("game");
        }}
      />
    );
  }

  if (viewMode === "game") {
    return (
      <GameLayout
        onExit={() => setViewMode("home")}
      // We might want to pass playerClass/rewards here later
      />
    );
  }

  if (viewMode === "book") {
    return <CampaignModuleTemplate onClose={() => setViewMode("home")} />;
  }

  return (
    <div className="retro-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AmbientController />
      <CommandMenu />

      {/* HEADER SECTION */}
      <header className="campaign-header" style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.5rem" }}>
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <div className="relative w-full max-w-[24rem] aspect-square" style={{ position: "relative", width: "24rem", height: "24rem" }}>
              <div className="animate-pulse-hero absolute inset-0 border border-[var(--scarlet-accent)] rounded-full opacity-50 blur-md"></div>
              <Image
                src="/hearts_curse_hero_v15.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(163,34,34,0.5)]"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="campaign-title-glitch text-4xl md:text-5xl m-0 leading-none" data-text="HEART'S CURSE">
                HEART&apos;S CURSE
              </h1>
              <p className="campaign-subtitle text-xs tracking-[0.4em] text-[var(--gold-accent)] opacity-80 mt-1">
                <span className="animate-flicker text-[var(--scarlet-accent)]">● ONLINE</span> // DM COMMAND CENTER
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-2 md:mb-0">
          {/* GAME MODE TOGGLE -> Launches Intro Flow now */}
          <button
            onClick={() => setViewMode("intro_narrative")}
            className="group relative px-6 py-2 bg-[#4a0a0a] border-2 border-[#ff3333] text-[#ffaaaa] font-serif uppercase text-xs tracking-widest hover:bg-[#ff3333] hover:text-white transition-all flex items-center gap-2 shrink-0 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]"
          >
            <Skull className="w-5 h-5" /> <span className="font-bold">ENTER DUNGEON</span>
          </button>

          {/* Quick Action: Open PDF Book */}
          <button
            onClick={() => setViewMode("book")}
            className="group relative px-6 py-2 bg-[var(--obsidian-base)] border border-[rgba(201,188,160,0.5)] text-[var(--gold-accent)] font-serif uppercase text-xs tracking-widest hover:bg-[var(--gold-accent)] hover:text-black transition-all flex items-center gap-2 shrink-0"
          >
            <BookOpen className="w-4 h-4" /> <span>Open Campaign Module</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", flex: 1 }}>

        {/* LEFT COLUMN: Status & Quick Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Curse Widget - Now clickable to mechanics */}
          <DashboardWidget title="Threat System" subtitle="Regional Effect" variant="safe-haven" href="/mechanics">
            <CurseTracker simpleView={true} />
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4a0404", fontStyle: "italic", borderTop: "1px solid #8b7e66", paddingTop: "0.5rem" }}>
              "The shadows lengthen with every passing day..."
            </div>
          </DashboardWidget>

          {/* Quick Nav: Archives */}
          <DashboardWidget title="The Archives" subtitle="Lore & History" icon={BookOpen} href="/lore" variant="safe-haven">
            <div style={{ fontSize: "0.875rem", opacity: 0.8, marginBottom: "0.5rem" }}>Access decrypted Netherese texts and campaign timeline.</div>
            <div style={{ height: "4px", width: "100%", background: "#8b7e66", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--scarlet-accent)", width: "75%" }} />
            </div>
            <div style={{ fontSize: "0.6rem", textAlign: "right", marginTop: "0.25rem", fontFamily: "var(--font-mono)", color: "var(--scarlet-accent)" }}>DATABANK: 75% DECRYPTED</div>
          </DashboardWidget>

          {/* Quick Nav: Bestiary -> Monster Compendium */}
          <DashboardWidget title="Monster Compendium" subtitle="Bestiary" icon={Skull} href="/statblocks" variant="safe-haven">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ background: "rgba(138, 28, 28, 0.1)", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #8b7e66" }}>
                <Skull style={{ width: "32px", height: "32px", color: "var(--scarlet-accent)" }} />
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#4a0404" }}>100+ ENTRIES</div>
                <div style={{ color: "#8a1c1c", fontSize: "0.75rem" }}>Recently Added: Acererak</div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* MIDDLE COLUMN: Primary Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Grimoire Widget (Promoted) */}
          <DashboardWidget title="The Grimoire" subtitle="Spell Database" icon={BookOpen} href="/grimoire" variant="safe-haven" style={{ backgroundImage: "linear-gradient(rgba(244, 232, 209, 0.9), rgba(244, 232, 209, 0.9)), url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}>
            <p style={{ fontSize: "0.75rem", color: "#4a0404" }}>Full library of incantations. Now with advanced search & filtering.</p>
          </DashboardWidget>

          <DashboardWidget title="Black Market" subtitle="Shops & Items" icon={ShoppingBag} href="/shops" variant="safe-haven" style={{ minHeight: "180px", backgroundImage: "radial-gradient(circle at center, rgba(30,30,35,0.8) 0%, rgba(10,10,12,0.95) 100%), repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)", backgroundSize: "cover", backgroundBlendMode: "overlay" }}>
            {/* Retaining dark bg for black market contrast, or should it change? keeping for now but ensure text pops */}
            <p style={{ position: "relative", zIndex: 10, fontSize: "0.875rem", color: "var(--gold-accent)" }}>Manage inventory for Korgul, Fimble, and local vendors.</p>
          </DashboardWidget>

          {/* Cartography */}
          <DashboardWidget title="Cartography" subtitle="Tactical Maps" icon={Map} href="/maps" variant="safe-haven" style={{ minHeight: "180px" }}>
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px solid #8b7e66", paddingBottom: "0.25rem" }}>
                <span>SILENT WARDS</span>
                <span style={{ color: "var(--scarlet-accent)", fontWeight: "bold" }}>ACTIVE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", borderBottom: "1px solid #8b7e66", paddingBottom: "0.25rem", opacity: 0.8 }}>
                <span>BEHOLDER LAIR</span>
                <span>MAPPED</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", opacity: 0.6 }}>
                <span>HEART CHAMBER</span>
                <span>UNKNOWN</span>
              </div>
            </div>
          </DashboardWidget>

          {/* GAME MODE LAUNCHER - Updates to Intro Flow */}
          <button
            onClick={() => setViewMode("intro_narrative")}
            className="group relative w-full h-32 bg-[#2a0a0a] border-2 border-[#ff3333] hover:bg-[#4a0a0a] transition-all flex flex-col items-center justify-center gap-2 overflow-hidden shadow-[0_0_20px_rgba(163,34,34,0.3)] hover:shadow-[0_0_30px_rgba(255,50,50,0.6)]"
          >
            <div className="absolute inset-0 bg-[url('/hearts_curse_hero_v15.png')] bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity blur-[2px]"></div>
            <Skull className="w-8 h-8 text-[#ffaaaa] animate-pulse relative z-10" />
            <span className="text-[#ffaaaa] font-bold text-lg tracking-widest uppercase relative z-10 group-hover:text-white group-hover:scale-105 transition-all">
              Enter The Dungeon
            </span>
            <span className="text-[10px] text-[#ffaaaa]/70 font-mono relative z-10">
              [ START CAMPAIGN ]
            </span>
          </button>
        </div>

        {/* RIGHT COLUMN: Tools & Utils */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Architect" subtitle="Arcanist's Quill" icon={PenTool} href="/editor" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            {/* [NEW] Players Link in Tools Grid */}
            <PartyStatusWidget />
            {/* [NEW] Store Link */}
            <DashboardWidget title="Store" subtitle="Upgrade" icon={ShoppingBag} href="/pricing" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", border: "1px solid var(--gold-accent)" }} />
          </div>

          <DashboardWidget title="Print Lab" subtitle="Physical Handouts" icon={FileText} href="/deliverables" variant="safe-haven">
            <p style={{ fontSize: "0.75rem", color: "#8a1c1c" }}>Generate print-ready assets for player handouts.</p>
          </DashboardWidget>

          <footer style={{ marginTop: "auto", textAlign: "center", opacity: 0.4, fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--fg-dim)" }}>
            HEART'S CURSE // SESSION 25 (BUILD 2.1)
          </footer>
        </div>

      </div>
    </div>
  );
}

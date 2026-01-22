"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import {
  BookOpen, ShoppingBag, Skull, Map,
  Zap, Swords, Hammer, PenTool, FileText, Sparkles
} from "lucide-react";
import DashboardWidget from "@/components/ui/DashboardWidget";
import CurseTracker from "@/components/ui/CurseTracker";
import PartyStatusWidget from "@/components/ui/PartyStatusWidget";
import AmbientController from "@/components/audio/AmbientController";
import { CommandMenu } from "@/components/ui/CommandMenu";
import QuestLog from "@/components/ui/QuestLog";
import NotepadWidget from "@/components/ui/NotepadWidget";
import SessionTrackerWidget from "@/components/ui/SessionTrackerWidget";
import QuickNpcWidget from "@/components/ui/QuickNpcWidget";
import SoundboardWidget from "@/components/audio/SoundboardWidget";
import AmbienceMixer from "@/components/audio/AmbienceMixer";

import GameLayout from "@/components/game/GameLayout";

// INTRO COMPONENTS
import NarrativeIntro from "@/components/game/intro/NarrativeIntro";
import MainMenu from "@/components/game/intro/MainMenu";
import AdvancedCharacterCreation from "@/components/game/AdvancedCharacterCreation";
import PrologueController from "@/components/game/intro/PrologueController";
import WorldMap from "@/components/game/intro/WorldMap";
// import LockScreen from "@/components/ui/LockScreen"; // Keep import if we revert
import { GameContextProvider, useGameContext } from "@/lib/context/GameContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import ToastContainer from "@/components/ui/ToastContainer";

// --- GAME CONTROLLER ---
// This component consumes the context and manages the top-level view switching
function GameController() {
  const {
    viewMode,
    setViewMode,
    playerCharacter,
    setPlayerCharacter,
    navigateTo,
    saveGame
  } = useGameContext();

  const [startingRewards, setStartingRewards] = useState<any>(null);

  // Ref to GameLayout no longer strictly needed for save if logic moves to context,
  // but GameLayout has internal state (logs, turn order) we might want to trigger save on.
  // For now, we'll keep the manual save trigger via ref if strictly needed, or just rely on Context save.
  // Context save is a placeholder right now, so let's stick to the ref approach for the "Command Menu" save button for safety,
  // OR update CommandMenu to use Context. Let's keep existing behavior for safety first.
  const gameRef = useRef<any>(null);

  const handleSave = () => {
    // If GameLayout exposes save, call it
    if (gameRef.current?.saveGame) {
      gameRef.current.saveGame();
    } else {
      // Fallback context save
      saveGame("manual_save");
    }
  };

  // -- VIEW ROUTING --

  if (viewMode === "intro_narrative") {
    return <NarrativeIntro onComplete={() => setViewMode("main_menu")} />;
  }

  if (viewMode === "main_menu") {
    return (
      <MainMenu
        onCreateChar={() => setViewMode("char_creation")}
        onLoadGame={(savedGame) => {
          // RESTORE STATE via Context
          setPlayerCharacter(savedGame.playerCharacter);
          navigateTo(savedGame.currentMapId, savedGame.currentNodeId);
          // TODO: inventory restoration could happen here or in Context loadGame
          setViewMode("game");
        }}
      />
    );
  }

  if (viewMode === "char_creation") {
    return (
      <AdvancedCharacterCreation
        onComplete={(character) => {
          setPlayerCharacter(character);
          setViewMode("world_map"); // Navigate to Map instead of straight to Prologue
        }}
      />
    );
  }

  if (viewMode === "world_map") {
    return (
      <WorldMap
        onSelectLocation={(locId: string) => {
          if (locId === "heart_chamber") setViewMode("prologue");
          if (locId === "underdark") {
            // Direct travel
            navigateTo("oakhaven_mines", "ent");
            setViewMode("game");
          }
        }}
      />
    );
  }

  if (viewMode === "prologue") {
    return (
      <PrologueController
        playerCharacter={playerCharacter}
        onComplete={(data) => {
          if (data.updatedCharacter) {
            setPlayerCharacter(data.updatedCharacter);
          }
          setStartingRewards(data);
          // Post-Prologue: Go to Oakhaven by default
          navigateTo("oakhaven", "market");
          setViewMode("game");
        }}
      />
    );
  }

  if (viewMode === "game") {
    return (
      <GameLayout
        ref={gameRef}
        onExit={() => setViewMode("home")}
        startingRewards={startingRewards}
        // playerCharacter, mapId, nodeId are now pulled from Context inside GameLayout!
        // We can pass them as props if GameLayout isn't updated yet, but the plan is to update GameLayout next.
        // For safe transition, we will likely NOT pass them as props if GameLayout consumes context.
        // But for this step, let's assume GameLayout still accepts them until we refactor it in the next step.
        // Wait, if I redeploy this page.tsx BEFORE GameLayout is updated, it might break if I don't pass props.
        // I should pass props for now as "compatibility" layer or just refactor GameLayout immediately after.
        // Let's pass them for now to be safe, but GameLayout will ignore them once updated.
        playerCharacter={playerCharacter}
      // initialMapId={currentMapId} // These don't change dynamically in the old prop model, they were "initial". 
      // GameLayout handled its own state. This is tricky.
      // If GameLayout manages its own state, and we want to control it via Context, 
      // GameLayout needs to basically "sync" or "consume" context.
      // I will update GameLayout next, so let's just render it.
      />
    );
  }

  // "home" / "book" (handled in DASHBOARD below)
  // Actually "book" was just a view mode. 
  // If viewMode is "book", what happens? In original code:
  // if (viewMode === "book") return ... wait, original code didn't hold "book" as a full screen return?
  // Ah, looking at original code:
  // 30:   // "book" = Campaign Module PDF View
  // But there was no `if (viewMode === "book")` block in the component body returning a different component!
  // It seems "book" might have been handled contextually or missing?
  // Checking original file... 
  // Line 27: const [viewMode, setViewMode] ...
  // Line 187: onClick={() => setViewMode("book")}
  // Line 152: return ( ... DASHBOARD ... )
  // So "book" mode effectively rendered the Dashboard?
  // Wait, I might have missed it in `read_file`.
  // Let's look at `view_file` output from Step 10.
  // Lines 69-148 handle special modes.
  // Then Line 152 starts the Dashboard return.
  // So if viewMode was "book", it fell through to the Dashboard?
  // That seems like a bug in the original code or "book" just meant "Show Dashboard but maybe open a PDF?" 
  // but there's no conditional for book in the dashboard.
  // Oh, wait. `CampaignModuleTemplate` import is there but unused in the snippet I saw?
  // Re-reading Step 10... Line 10: import CampaignModuleTemplate...
  // I don't see it used in the JSX.
  // Maybe it was deleted or I missed it.
  // Regardless, I will handle "book" mode by showing a placeholder or the dashboard for now.
  // If the user wants a Book view, I should probably add it.
  // For now, let's keep the Dashboard as the default "base" view.

  return (
    <div className="retro-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AmbientController />
      <QuestLog />
      <CommandMenu onSave={handleSave} />

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
          {/* Quick Action: Open PDF Book */}
          {/* TODO: Implement actual Book View */}
          <button
            onClick={() => setViewMode("main_menu")}
            className="group relative px-6 py-2 bg-[var(--obsidian-base)] border border-[var(--scarlet-accent)] text-[var(--scarlet-accent)] font-serif uppercase text-xs tracking-widest hover:bg-[var(--scarlet-accent)] hover:text-white transition-all flex items-center gap-2 shrink-0 animate-pulse"
          >
            <Swords className="w-4 h-4" /> <span>ENTER SIMULATION</span>
          </button>
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
          <DashboardWidget title="Threat System" subtitle="Regional Effect" variant="safe-haven" href="/mechanics">
            <CurseTracker simpleView={true} />
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4a0404", fontStyle: "italic", borderTop: "1px solid #8b7e66", paddingTop: "0.5rem" }}>
              &quot;The shadows lengthen with every passing day...&quot;
            </div>
          </DashboardWidget>

          <DashboardWidget title="The Archives" subtitle="Lore & History" icon={BookOpen} href="/lore" variant="safe-haven">
            <div style={{ fontSize: "0.875rem", opacity: 0.8, marginBottom: "0.5rem" }}>Access decrypted Netherese texts and campaign timeline.</div>
            <div style={{ height: "4px", width: "100%", background: "#8b7e66", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--scarlet-accent)", width: "75%" }} />
            </div>
            <div style={{ fontSize: "0.6rem", textAlign: "right", marginTop: "0.25rem", fontFamily: "var(--font-mono)", color: "var(--scarlet-accent)" }}>DATABANK: 75% DECRYPTED</div>
          </DashboardWidget>

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <PartyStatusWidget />
          </div>
          <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" variant="safe-haven" />
        </div>

        {/* MIDDLE COLUMN: Primary Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <DashboardWidget title="The Grimoire" subtitle="Spell Database" icon={BookOpen} href="/grimoire" variant="safe-haven" style={{ backgroundImage: "linear-gradient(rgba(244, 232, 209, 0.9), rgba(244, 232, 209, 0.9)), url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}>
            <p style={{ fontSize: "0.75rem", color: "#4a0404" }}>Full library of incantations. Now with advanced search & filtering.</p>
          </DashboardWidget>

          <DashboardWidget title="Black Market" subtitle="Shops & Items" icon={ShoppingBag} href="/shops" variant="safe-haven" style={{ minHeight: "180px", backgroundImage: "radial-gradient(circle at center, rgba(30,30,35,0.8) 0%, rgba(10,10,12,0.95) 100%), repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)", backgroundSize: "cover", backgroundBlendMode: "overlay" }}>
            <p style={{ position: "relative", zIndex: 10, fontSize: "0.875rem", color: "var(--gold-accent)" }}>Manage inventory for Korgul, Fimble, and local vendors.</p>
          </DashboardWidget>

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Architect" subtitle="Arcanist's Quill" icon={PenTool} href="/editor" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Store" subtitle="Upgrade" icon={ShoppingBag} href="/pricing" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", border: "1px solid var(--gold-accent)" }} />
            <DashboardWidget title="Print Lab" subtitle="Handouts" icon={FileText} href="/deliverables" variant="safe-haven" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
          </div>

        </div>

        {/* RIGHT COLUMN: DM Tools & Utilities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* 1. Session Tracker */}
          <SessionTrackerWidget />

          {/* 1.5. The Oracle (New) */}
          <DashboardWidget title="The Oracle" subtitle="AI Narrative Engine" icon={Sparkles} href="/oracle" variant="safe-haven" style={{ border: "1px solid var(--gold-accent)", background: "linear-gradient(to right, #1a0b2e, #0e0e0e)" }}>
            <p style={{ fontSize: "0.75rem", color: "#b5a685" }}>Consult the spirits for room descriptions and NPC dialogue.</p>
          </DashboardWidget>

          {/* 2. Quick NPC */}
          <QuickNpcWidget />

          {/* 3. Notepad */}
          <NotepadWidget />

          {/* 4. Audio Engine */}
          <AmbienceMixer />
          <SoundboardWidget />



          <footer style={{ marginTop: "auto", textAlign: "center", opacity: 0.4, fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--fg-dim)" }}>
            HEART'S CURSE // SESSION 25 (BUILD 3.1 - DM DASHBOARD)
          </footer>
        </div>

      </div>
    </div>
  );
}

// MAIN ENTRY POINT
export default function Home() {
  return (
    <ToastProvider>
      <GameContextProvider>
        <GameController />
        <ToastContainer />
      </GameContextProvider>
    </ToastProvider>
  );
}

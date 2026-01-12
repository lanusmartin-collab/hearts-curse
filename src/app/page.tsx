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
    <div style={{ minHeight: "100vh", padding: "2rem", paddingTop: "5rem", maxWidth: "1600px", margin: "0 auto" }}>

      {/* HEADER SECTION */}
      <header className="campaign-header">
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "2rem", display: "inline-block", position: "relative" }}>
            <div className="animate-pulse-slow" style={{ position: "absolute", inset: "-10px", border: "1px solid rgba(163,34,34,0.3)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            <Image
              src="/hearts_curse_hero_v15.png"
              alt="Heart's Curse Cover Art"
              width={800}
              height={300}
              style={{ maxWidth: "100%", height: "auto", display: "block", objectFit: "contain", position: "relative", zIndex: 10, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))" }}
              priority
            />
          </div>
          <h1 className="campaign-title-glitch" data-text="HEART'S CURSE">
            HEART&apos;S CURSE
          </h1>
          <p className="campaign-subtitle">
            <span className="animate-flicker">● ONLINE</span>
            Campaign Manager v1.3
          </p>
        </div>

        {/* Quick Action: Open PDF Book */}
        <button
          onClick={() => setViewMode("book")}
          style={{
            position: "relative",
            padding: "0.75rem 1.5rem",
            background: "var(--obsidian-base)",
            border: "1px solid rgba(201,188,160,0.5)",
            color: "var(--gold-accent)",
            fontFamily: "var(--font-serif)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <BookOpen style={{ width: "16px", height: "16px" }} /> Open Campaign Module
        </button>
      </header>

      {/* DASHBOARD GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>

        {/* LEFT COLUMN: Status & Quick Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Curse Widget - Now clickable to mechanics */}
          <DashboardWidget title="Threat System" subtitle="Regional Effect" style={{ borderColor: "rgba(138, 28, 28, 0.3)" }} href="/mechanics">
            <CurseTracker simpleView={true} />
            <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--fg-dim)", fontStyle: "italic", borderTop: "1px solid var(--glass-border)", paddingTop: "0.5rem" }}>
              "The shadows lengthen with every passing day..."
            </div>
          </DashboardWidget>

          {/* Quick Nav: Archives */}
          <DashboardWidget title="The Archives" subtitle="Lore & History" icon={BookOpen} href="/lore">
            <div style={{ fontSize: "0.875rem", opacity: 0.8, marginBottom: "0.5rem" }}>Access decrypted Netherese texts and campaign timeline.</div>
            <div style={{ height: "4px", width: "100%", background: "var(--glass-border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--mystic-accent)", width: "75%" }} />
            </div>
            <div style={{ fontSize: "0.6rem", textAlign: "right", marginTop: "0.25rem", fontFamily: "var(--font-mono)", color: "var(--mystic-accent)" }}>DATABANK: 75% DECRYPTED</div>
          </DashboardWidget>

          {/* Quick Nav: Bestiary -> Monster Compendium */}
          <DashboardWidget title="Monster Compendium" subtitle="Bestiary" icon={Skull} href="/statblocks">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ background: "var(--ink-color)", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--glass-border)" }}>
                <Skull style={{ width: "32px", height: "32px", color: "var(--scarlet-accent)" }} />
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "var(--fg-color)" }}>100+ ENTRIES</div>
                <div style={{ color: "var(--fg-dim)", fontSize: "0.75rem" }}>Recently Added: Acererak</div>
              </div>
            </div>
          </DashboardWidget>
        </div>

        {/* MIDDLE COLUMN: Primary Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Grimoire Widget (Promoted) */}
          <DashboardWidget title="The Grimoire" subtitle="Spell Database" icon={BookOpen} href="/grimoire" style={{ borderColor: "#a32222", backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://www.transparenttextures.com/patterns/aged-paper.png')" }}>
            <p style={{ fontSize: "0.75rem", color: "#d7c0a0" }}>Full library of incantations. Now with advanced search & filtering.</p>
          </DashboardWidget>

          {/* Market */}
          <DashboardWidget title="Black Market" subtitle="Shops & Items" icon={ShoppingBag} href="/shops" style={{ minHeight: "180px", backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/market-bg-pattern.png')", backgroundSize: "cover", backgroundBlendMode: "overlay" }}>
            <p style={{ position: "relative", zIndex: 10, fontSize: "0.875rem" }}>Manage inventory for Korgul, Fimble, and local vendors.</p>
          </DashboardWidget>

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
        </div>

        {/* RIGHT COLUMN: Tools & Utils */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <DashboardWidget title="Tools" subtitle="Foundry" icon={Hammer} href="/generators" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Editor" subtitle="Notes" icon={PenTool} href="/editor" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Rules" subtitle="Mechanics" icon={Zap} href="/mechanics" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            <DashboardWidget title="Fight" subtitle="Encounter" icon={Swords} href="/encounters" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
            {/* [NEW] Players Link in Tools Grid */}
            <DashboardWidget title="Party" subtitle="Players" icon={FileText} href="/players" style={{ aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }} />
          </div>

          <DashboardWidget title="Print Lab" subtitle="Physical Handouts" icon={FileText} href="/deliverables">
            <p style={{ fontSize: "0.75rem", color: "var(--fg-dim)" }}>Generate print-ready assets for player handouts.</p>
          </DashboardWidget>


        </div>

      </div>

      <footer style={{ marginTop: "3rem", textAlign: "center", opacity: 0.8, fontFamily: "var(--font-mono)", fontSize: "0.75rem", borderTop: "1px solid var(--glass-border)", paddingTop: "2rem", color: "var(--adnd-blue)" }}>
        HEART'S CURSE CAMPAIGN MANAGER // v1.3.1 (Grimoire Patch)
      </footer>
    </div>
  );
}

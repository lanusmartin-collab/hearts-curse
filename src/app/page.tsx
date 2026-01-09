"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CampaignModuleTemplate from "@/components/ui/CampaignModuleTemplate";

export default function Home() {
  const [viewMode, setViewMode] = useState<"home" | "book">("home");

  if (viewMode === "book") {
    return <CampaignModuleTemplate onClose={() => setViewMode("home")} />;
  }

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "4vh" }}>
      <header style={{ marginBottom: "3rem" }}>

        {/* Cover Art Display */}
        <div className="relative w-[350px] mx-auto mb-6 rounded-lg overflow-hidden border-4 border-[var(--accent-dim)] shadow-[0_0_30px_var(--accent-glow)] group cursor-pointer transition-transform hover:scale-105" onClick={() => setViewMode("book")}>
          <Image
            src="/cover_art_v8.png"
            alt="Heart's Curse Campaign Cover"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-bold uppercase tracking-widest border-2 border-white px-4 py-2 bg-black/50">Open Book</span>
          </div>
        </div>

        <h1 style={{
          fontSize: "5rem",
          marginBottom: "0.5rem",
          textShadow: "0 0 20px var(--accent-color), 3px 3px 0px #000"
        }}>
          Heart's Curse
        </h1>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.2rem",
          letterSpacing: "0.3em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "2rem"
        }}>
          Campaign Manager <span style={{ color: "var(--accent-color)" }}>v2.0</span>
        </div>

        <button
          onClick={() => setViewMode("book")}
          className="retro-btn bg-[var(--accent-dim)] text-white px-8 py-3 rounded text-lg hover:bg-[var(--accent-color)] border border-[var(--accent-color)] shadow-[0_0_15px_var(--accent-glow)] mb-8"
        >
          📖 Open Campaign Book (PDF View)
        </button>
      </header>



      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
        padding: "0 1rem"
      }}>
        <Link href="/lore" className="card">
          <h2>Archives</h2>
          <p style={{ color: "var(--fg-dim)" }}>Lore & History</p>
        </Link>

        <Link href="/shops" className="card">
          <h2>The Market</h2>
          <p style={{ color: "var(--fg-dim)" }}>Shops & Items</p>
        </Link>

        <Link href="/statblocks" className="card" style={{ borderColor: "var(--accent-dim)" }}>
          <h2 style={{ textShadow: "0 0 10px var(--accent-color)" }}>Monster Compendium</h2>
          <p style={{ color: "var(--accent-color)" }}>Creature Stats</p>
        </Link>

        <Link href="/maps" className="card">
          <h2>Cartography</h2>
          <p style={{ color: "var(--fg-dim)" }}>Tactical Views</p>
        </Link>

        <Link href="/mechanics" className="card">
          <h2>Mechanics</h2>
          <p style={{ color: "var(--fg-dim)" }}>Curse & Powers</p>
        </Link>

        <Link href="/encounters" className="card">
          <h2>Encounters</h2>
          <p style={{ color: "var(--fg-dim)" }}>Values Generator</p>
        </Link>

        <Link href="/generators" className="card">
          <h2>The Foundry</h2>
          <p style={{ color: "var(--fg-dim)" }}>Procedural Tools</p>
        </Link>

        <Link href="/editor" className="card">
          <h2>Notebook</h2>
          <p style={{ color: "var(--fg-dim)" }}>DM Editor</p>
        </Link>

        <Link href="/deliverables" className="card" style={{ borderColor: "orange" }}>
          <h2>Prop Fabricator</h2>
          <p style={{ color: "orange" }}>Printable Handouts</p>
        </Link>
      </div>

      <footer style={{ marginTop: "6rem", opacity: 0.4, fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
        SYSTEM READY. CURSE ACTIVE.
      </footer>
    </div >
  );
}

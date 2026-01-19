# HEART'S CURSE // DM COMMAND CENTER

> "Survive the Curse. Manage the Heart. All in one tab."

![Heart's Curse Hero](/hearts_curse_hero_v15.png)

## Overview

**Heart's Curse** is a specialized Virtual Tabletop (VTT) dashboard designed for high-stakes, darker D&D 5e campaigns. Unlike generic VTTs, this application focuses on specific narrative mechanics: a ticking clock (The Curse), resource scarcity, and atmospheric immersion.

It acts as a "Second Screen" for the Dungeon Master, providing quick access to lore, monster stat blocks, and the relentless progression of the campaign's central threat.

## Features

### 🩸 The Curse Tracker
A visual representation of the party's doom.
-   **Dynamic States:** progresses from *Latent* to *Critical* (Level 21).
-   **Visual Feedback:** The UI "glitches" and reddens as the curse intensifies.
-   **Mechanics Integration:** Hover over stages to see daily effects (e.g., "Cannot regain Hit Dice").

### 🗺️ The Spire Map
Interactive cartography for the mega-dungeon.
-   **Fog of War:** Click nodes to reveal them.
-   **Status Indicators:** Mark zones as "Safe", "Hostile", or "Cleared".
-   **DM Tools:** Edit nodes on the fly during the session.

### 📜 The Grimoire & Archives
-   **Spell Database:** Complete 5e spell list with search and filtering.
-   **Lore Bank:** Decrypted Netherese texts and campaign timeline.
-   **Monster Compendium:** Fast reference for custom and standard creatures.

## Getting Started

### Prerequisites
-   Node.js 18+
-   npm / yarn / pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/lanusmartin-collab/hearts-curse.git
    cd hearts-curse/web-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Aesthetics & Design
The UI is built with a **"Neon Dark Fantasy"** aesthetic in mind.
-   **Font:** *Geist* (Tech) + *Cinzel* (Fantasy).
-   **Palette:** Obsidian, Scarlet, and Gold.
-   **Animations:** CSS-based heartbeats, CRT flickers, and glitch effects.

## Media Assets
Run the app to see the live "Glitch" effects, or check the `walkthrough.md` for the captured trailer.

---
*Built for the "Heart's Curse" Campaign. Do not distribute to players under penalty of [DATA EXPUNGED].*

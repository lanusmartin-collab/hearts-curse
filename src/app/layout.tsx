import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals_v2.css";
import DiceRoller from "@/components/ui/DiceRoller";

import SidebarNav from "@/components/ui/SidebarNav";
import GlobalDrawers from "@/components/ui/GlobalDrawers";
import CurseOverlay from "@/components/ui/CurseOverlay";

export const metadata: Metadata = {
  title: {
    template: "%s | Heart's Curse",
    default: "Heart's Curse Campaign Manager",
  },
  description: "A specialized D&D 5e Campaign Manager for the Heart's Curse adventure. Manage curses, track quests, and survive the darkness.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Heart's Curse",
  },
  openGraph: {
    title: "Heart's Curse Campaign Manager",
    description: "Survive the Curse. Manage the Heart. All in one tab.",
    siteName: "Heart's Curse",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heart's Curse Campaign Manager",
    description: "Survive the Curse. Manage the Heart. All in one tab.",
  },
};

import { AudioProvider } from "@/lib/context/AudioContext";
import { MusicProvider } from "@/components/providers/MusicProvider";
import { SpellProvider } from "@/lib/game/spellContext";
import ShadowCaster from "@/components/ui/ShadowCaster";

import { UserProvider } from "@/lib/auth/userContext";
import { GameContextProvider } from "@/lib/context/GameContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import ToastContainer from "@/components/ui/ToastContainer";
import { CommandMenu } from "@/components/ui/CommandMenu";
import QuickDock from "@/components/ui/QuickDock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Merriweather (Serif) + Inter (Sans) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;600&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {/* NOTE: If we wanted strict 'Stranger Things' we'd try to find a Benguiat substitute, but Merriweather 900 is a decent 'Classic Serif' fallback freely available */}
      </head>
      <body>
        <Suspense fallback={<div style={{ color: "white", padding: "20px" }}>Loading System...</div>}>
          <UserProvider>
            <ToastProvider>
              <GameContextProvider>
                <AudioProvider>
                  <SpellProvider>
                    <MusicProvider>
                      <CurseOverlay />
                      <div className="noise-overlay"></div>
                      <SidebarNav />
                      <GlobalDrawers />
                      <main className="pt-16 pb-20 lg:pt-0 lg:pl-72">{children}</main>
                      <ShadowCaster />
                      <DiceRoller />
                      <CommandMenu />
                      <QuickDock />
                      <ToastContainer />
                      {/* GrimoireModal removed - migrated to /grimoire */}
                    </MusicProvider>
                  </SpellProvider>
                </AudioProvider>
              </GameContextProvider>
            </ToastProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}

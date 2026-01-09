import type { Metadata } from "next";
import "./globals.css";
import DiceRoller from "@/components/ui/DiceRoller";

import SidebarNav from "@/components/ui/SidebarNav";

export const metadata: Metadata = {
  title: "Heart's Curse Campaign",
  description: "DM Tools for the Heart's Curse adventure.",
  manifest: "/manifest.json",
};

import { AudioProvider } from "@/components/providers/AudioProvider";
import ShadowCaster from "@/components/ui/ShadowCaster";

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
        <AudioProvider>
          <div className="noise-overlay"></div>
          <SidebarNav />
          <main>{children}</main>
          <ShadowCaster />
          <DiceRoller />
        </AudioProvider>
      </body>
    </html>
  );
}

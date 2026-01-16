"use client";

import { useUser } from "@/lib/auth/userContext";
import { useState } from "react";
import PricingCard from "@/components/ui/PricingCard";
import CommandBar from "@/components/ui/CommandBar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PricingPage() {
    const { user, upgradeToPro, logout } = useUser();

    return (
        <div className="retro-container min-h-screen bg-[#050505] text-[#d4d4d4] flex flex-col">
            <CommandBar />

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[url('/img/grid_pattern.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#a32222]/10 to-transparent pointer-events-none"></div>

                <div className="relative z-10 max-w-6xl w-full">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#666] hover:text-white mb-8 transition-colors uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Return to Sanctum
                        </Link>

                        <h1 className="text-4xl md:text-6xl font-header text-white mb-4 tracking-widest">
                            CHOOSE YOUR <span className="text-[var(--gold-accent)]">DESTINY</span>
                        </h1>
                        <p className="text-[#888] text-lg max-w-2xl mx-auto font-serif">
                            Unlock the full power of the Campaign Architect. Forge worlds, command monsters, and master the arcane.
                        </p>
                    </div>

                    {/* Pricing Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">

                        {/* Free Tier */}
                        <PricingCard
                            title="ADVENTURER"
                            price="Free"
                            description="For players and casual exploration."
                            variant="free"
                            buttonText={user?.isPro ? "Downgrade" : "Current Plan"}
                            onAction={() => logout()} // Reset to "Guest" effectively
                            features={[
                                { text: "Access to Public Lore", included: true },
                                { text: "View Maps (Read Only)", included: true },
                                { text: "Basic Curse Tracker", included: true },
                                { text: "Campaign Editor", included: false },
                                { text: "Creature Forge", included: false },
                                { text: "Unlimited Saves", included: false },
                            ]}
                        />

                        {/* Pro Tier */}
                        <PricingCard
                            title="DUNGEON MASTER"
                            price="$19.99"
                            description="One-time payment. Lifetime access to the Campaign Architect. Yours to keep forever."
                            variant="pro"
                            isPopular={true}
                            buttonText={user?.isPro ? "Already Active" : "Upgrade Now"}
                            onAction={() => {
                                if (!user?.isPro) {
                                    window.open("https://heartscurse.lemonsqueezy.com/checkout/buy/77235259-5cbb-4553-a9e8-33cab92be665", "_blank");
                                }
                            }}
                            features={[
                                { text: "Access to Public Lore", included: true },
                                { text: "View Maps (Read Only)", included: true },
                                { text: "Basic Curse Tracker", included: true },
                                { text: "Campaign Editor Access", included: true },
                                { text: "Creature Forge Tool", included: true },
                                { text: "Unlimited Cloud Saves", included: true },
                                { text: "Priority Support from Netheril", included: true },
                            ]}
                        />
                    </div>

                    {/* License Key Activation */}
                    <div className="mt-12 max-w-md mx-auto text-center border-t border-[#222] pt-8">
                        <h4 className="text-[#666] text-sm uppercase tracking-widest mb-4">Already obtained a license?</h4>
                        <LicenseActivator />
                    </div>

                    <div className="mt-16 text-center text-xs text-[#444] font-mono">
                        SECURED BY IRON BANK OF BALDUR'S GATE • CANCEL ANYTIME
                    </div>
                </div>
            </div>
        </div>
    );
}

function LicenseActivator() {
    const { activateLicense, user } = useUser();
    const [key, setKey] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    if (user?.isPro) return <div className="text-[var(--gold-accent)] font-mono text-xs">License Active</div>;

    const handleActivate = async () => {
        if (!key) return;
        setStatus("loading");
        const success = await activateLicense(key.trim());
        setStatus(success ? "success" : "error");
        if (success) {
            alert("License Activated! Welcome back.");
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-[#111] border border-[#333] text-white px-4 py-2 font-mono text-sm flex-1 focus:border-[var(--gold-accent)] outline-none"
            />
            <button
                onClick={handleActivate}
                disabled={status === "loading"}
                className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 text-xs font-header tracking-widest border border-[#333]"
            >
                {status === "loading" ? "..." : "ACTIVATE"}
            </button>
        </div>
    );
}

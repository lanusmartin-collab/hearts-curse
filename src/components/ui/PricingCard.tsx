"use client";

import { Check, X } from "lucide-react";

type PricingFeature = {
    text: string;
    included: boolean;
};

type PricingCardProps = {
    title: string;
    price: string;
    description: string;
    features: PricingFeature[];
    isPopular?: boolean;
    buttonText: string;
    onAction: () => void;
    variant: "free" | "pro";
};

export default function PricingCard({
    title,
    price,
    description,
    features,
    isPopular,
    buttonText,
    onAction,
    variant
}: PricingCardProps) {
    const isPro = variant === "pro";

    return (
        <div className={`
            relative p-6 rounded-lg border flex flex-col h-full transition-all duration-300
            ${isPro
                ? "bg-[#0e0e0e] border-[var(--gold-accent)] shadow-[0_0_30px_rgba(201,188,160,0.15)] scale-105 z-10"
                : "bg-[#050505] border-[#333] hover:border-[#666]"}
        `}>
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold-accent)] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Best Value
                </div>
            )}

            <div className="mb-6 text-center">
                <h3 className={`text-xl font-header tracking-widest mb-2 ${isPro ? "text-[var(--gold-accent)]" : "text-white"}`}>
                    {title}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white">{price}</span>
                    <span className="text-sm text-[#666]">{price === "Free" ? "" : ""}</span>
                </div>
                <p className="text-xs text-[#888] mt-2 font-mono">{description}</p>
            </div>

            <div className="flex-1 space-y-3 mb-8">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                        {feature.included ? (
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${isPro ? "text-[var(--gold-accent)]" : "text-[#444]"}`} />
                        ) : (
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-[#222]" />
                        )}
                        <span className={feature.included ? "text-[#ccc]" : "text-[#444]"}>{feature.text}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={onAction}
                className={`
                    w-full py-3 rounded text-sm font-bold uppercase tracking-widest transition-all
                    ${isPro
                        ? "bg-[var(--gold-accent)] hover:bg-white text-black shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        : "bg-[#222] hover:bg-[#333] text-[#888] hover:text-white border border-[#333]"}
                `}
            >
                {buttonText}
            </button>
        </div>
    );
}

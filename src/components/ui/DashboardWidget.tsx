"use client";

import Link from "next/link";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface DashboardWidgetProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    href?: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export default function DashboardWidget({
    title,
    subtitle,
    icon: Icon,
    href,
    children,
    className,
    style,
    onClick
}: DashboardWidgetProps) {
    const content = (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>
                <div>
                    <h3 style={{ fontSize: "1.125rem", fontFamily: "var(--font-serif)", color: "var(--scarlet-accent)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, textShadow: "0 0 5px rgba(0,0,0,0.5)" }}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p style={{ fontSize: "0.75rem", color: "var(--fg-dim)", fontFamily: "var(--font-mono)", textTransform: "uppercase", opacity: 0.7, margin: 0 }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && <Icon style={{ width: "24px", height: "24px", color: "var(--mystic-accent)", opacity: 0.8 }} />}
            </div>
            <div style={{ color: "var(--fg-color)" }}>
                {children}
            </div>
        </>
    );

    const containerStyle: React.CSSProperties = {
        position: "relative",
        overflow: "hidden",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        transition: "all 0.3s",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(10px)",
        display: "block",
        cursor: (href || onClick) ? "pointer" : "default",
        ...style
    };

    if (href) {
        return (
            <Link href={href} className={clsx("card", className)} style={containerStyle}>
                {content}
            </Link>
        );
    }

    return (
        <div className={clsx("card", className)} style={containerStyle} onClick={onClick}>
            {content}
        </div>
    );
}

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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", borderBottom: "2px solid var(--adnd-blue)", paddingBottom: "0.5rem" }}>
                <div>
                    <h3 style={{ fontSize: "1.25rem", fontFamily: "var(--adnd-font-header)", color: "var(--adnd-blue)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p style={{ fontSize: "0.8rem", color: "#333", fontFamily: "var(--adnd-font-body)", fontStyle: "italic", opacity: 0.9, margin: 0 }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && <Icon style={{ width: "24px", height: "24px", color: "var(--adnd-ink)", opacity: 0.7 }} />}
            </div>
            <div style={{ color: "var(--adnd-ink)", fontFamily: "var(--adnd-font-body)" }}>
                {children}
            </div>
        </>
    );

    const containerStyle: React.CSSProperties = {
        position: "relative",
        overflow: "hidden",
        padding: "1.5rem",
        transition: "all 0.3s",
        background: "var(--adnd-bg)", // Parchment
        border: "1px solid #8b7e66",   // Darker parchment border
        boxShadow: "5px 5px 10px rgba(0,0,0,0.3)", // Solid shadow, no glow
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

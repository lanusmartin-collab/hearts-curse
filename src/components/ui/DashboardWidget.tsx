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
    onClick,
    variant = 'obsidian' // New Default: Dark Theme
}: DashboardWidgetProps & { variant?: 'parchment' | 'obsidian' | 'glass' | 'safe-haven' }) {

    // Theme Colors based on variant
    const isDark = variant === 'obsidian' || variant === 'glass';
    const bgColor = variant === 'parchment' ? 'var(--adnd-bg)' : (variant === 'safe-haven' ? 'var(--parchment-bg)' : (variant === 'obsidian' ? '#111' : 'rgba(10,10,12,0.6)'));
    const borderColor = (variant === 'parchment' || variant === 'safe-haven') ? '#8b7e66' : '#333';
    const titleColor = variant === 'parchment' ? 'var(--adnd-blue)' : (variant === 'safe-haven' ? 'var(--scarlet-accent)' : 'var(--scarlet-accent)');
    const textColor = variant === 'parchment' ? 'var(--adnd-ink)' : (variant === 'safe-haven' ? '#4a0404' : 'var(--fg-color)');
    const dimColor = variant === 'parchment' ? '#333' : (variant === 'safe-haven' ? '#8a1c1c' : 'var(--fg-dim)');

    const content = (
        <>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                borderBottom: `2px solid ${(variant === 'parchment') ? 'var(--adnd-blue)' : ((variant === 'safe-haven') ? 'var(--scarlet-accent)' : 'rgba(163,34,34,0.3)')}`,
                paddingBottom: "0.5rem"
            }}>
                <div>
                    <h3 className="title-heartbeat" style={{
                        fontSize: "1.25rem",
                        fontFamily: isDark ? "var(--font-header)" : "var(--adnd-font-header)",
                        color: titleColor,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        margin: 0,
                        textShadow: isDark ? "0 0 10px rgba(163,34,34,0.3)" : "none"
                    }}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p style={{
                            fontSize: "0.8rem",
                            color: dimColor,
                            fontFamily: isDark ? "var(--font-mono)" : "var(--adnd-font-body)",
                            fontStyle: isDark ? "normal" : "italic",
                            opacity: 0.8,
                            margin: 0,
                            textTransform: isDark ? "uppercase" : "none",
                            letterSpacing: isDark ? "0.1em" : "0"
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && <Icon style={{ width: "24px", height: "24px", color: isDark ? "var(--fg-dim)" : "var(--adnd-ink)", opacity: 0.7 }} />}
            </div>
            <div style={{ color: textColor, fontFamily: isDark ? "var(--font-body)" : "var(--adnd-font-body)" }}>
                {children}
            </div>
        </>
    );

    const containerStyle: React.CSSProperties = {
        position: "relative",
        overflow: "hidden",
        padding: "1.5rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "5px 5px 10px rgba(0,0,0,0.3)",
        backdropFilter: variant === 'glass' ? "blur(12px)" : "none",
        display: "block",
        cursor: (href || onClick) ? "pointer" : "default",
        ...style
    };

    if (href) {
        return (
            <Link href={href} className={clsx("group", className)} style={containerStyle}>
                {content}
                {/* Hover Glow Effect for Dark Variants */}
                {isDark && (
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--scarlet-accent)] transition-all duration-300 pointer-events-none opacity-50" />
                )}
            </Link>
        );
    }

    return (
        <div className={clsx("group", className)} style={containerStyle} onClick={onClick}>
            {content}
            {isDark && onClick && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--scarlet-accent)] transition-all duration-300 pointer-events-none opacity-50" />
            )}
        </div>
    );
}

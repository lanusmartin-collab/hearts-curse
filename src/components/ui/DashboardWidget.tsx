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
    onClick?: () => void;
}

export default function DashboardWidget({
    title,
    subtitle,
    icon: Icon,
    href,
    children,
    className,
    onClick
}: DashboardWidgetProps) {
    const content = (
        <>
            <div className="flex items-center justify-between mb-4 border-b border-[var(--glass-border)] pb-2">
                <div>
                    <h3 className="text-lg font-serif text-[var(--scarlet-accent)] uppercase tracking-wider m-0 text-shadow-sm">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-[var(--fg-dim)] font-mono uppercase opacity-70">
                            {subtitle}
                        </p>
                    )}
                </div>
                {Icon && <Icon className="w-6 h-6 text-[var(--mystic-accent)] opacity-80" />}
            </div>
            <div className="text-[var(--fg-color)]">
                {children}
            </div>
        </>
    );

    const containerClasses = clsx(
        "relative overflow-hidden p-6 rounded-lg transition-all duration-300 group",
        "bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md",
        "hover:border-[var(--mystic-accent)] hover:shadow-[0_0_20px_rgba(109,40,217,0.2)]",
        className
    );

    if (href) {
        return (
            <Link href={href} className={containerClasses}>
                {content}
                {/* Hover Highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--mystic-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
        );
    }

    return (
        <div className={containerClasses} onClick={onClick}>
            {content}
        </div>
    );
}

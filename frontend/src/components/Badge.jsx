import React from 'react';
import clsx from 'clsx';

const toneStyles = {
    glass: {
        primary: `
            border-primary/15
            bg-primary/[0.08]
            text-primary
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(59,130,246,0.08)]
        `,
        accent: `
            border-accent/15
            bg-accent/[0.08]
            text-accent
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(251,146,60,0.08)]
        `,
        urgent: `
            border-red-400/15
            bg-red-400/[0.08]
            text-red-500
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(248,113,113,0.08)]
        `,
        success: `
            border-emerald-400/15
            bg-emerald-400/[0.08]
            text-emerald-600
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(52,211,153,0.08)]
        `,
        warning: `
            border-amber-400/15
            bg-amber-400/[0.08]
            text-amber-600
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(251,191,36,0.08)]
        `,
        default: `
            border-border/80
            bg-surface/70
            text-text-primary
            backdrop-blur-xl
            shadow-[0_4px_20px_rgba(15,23,42,0.04)]
        `,
    },

    soft: {
        primary: `
            bg-primary/10
            text-primary
            border-primary/10
        `,
        accent: `
            bg-accent/10
            text-accent
            border-accent/10
        `,
        urgent: `
            bg-red-500/10
            text-red-500
            border-red-500/10
        `,
        success: `
            bg-emerald-500/10
            text-emerald-600
            border-emerald-500/10
        `,
        warning: `
            bg-amber-500/10
            text-amber-700
            border-amber-500/10
        `,
        default: `
            bg-muted
            text-text-primary
            border-border
        `,
    },

    dark: {
        primary: `
        bg-slate-800/80
        text-white
        border-slate-700
    `,

        accent: `
        bg-sky-950/80
        text-sky-300
        border-sky-800
    `,

        urgent: `
        bg-red-950/80
        text-red-300
        border-red-900
    `,

        success: `
        bg-emerald-950/80
        text-emerald-300
        border-emerald-900
    `,

        warning: `
        bg-amber-950/80
        text-amber-300
        border-amber-900
    `,

        default: `
        bg-zinc-800/80
        text-zinc-300
        border-zinc-700
    `,
    },
    solid: {
        primary: `
            bg-primary
            text-white
            border-primary
            shadow-[0_8px_24px_rgba(59,130,246,0.18)]
        `,
        accent: `
            bg-accent
            text-white
            border-accent
            shadow-[0_8px_24px_rgba(251,146,60,0.18)]
        `,
        urgent: `
            bg-red-500
            text-white
            border-red-500
            shadow-[0_8px_24px_rgba(239,68,68,0.18)]
        `,
        success: `
            bg-emerald-500
            text-white
            border-emerald-500
            shadow-[0_8px_24px_rgba(16,185,129,0.18)]
        `,
        warning: `
            bg-amber-400
            text-black
            border-amber-400
            shadow-[0_8px_24px_rgba(251,191,36,0.18)]
        `,
        default: `
            bg-text-primary
            text-white
            border-text-primary
            shadow-[0_8px_24px_rgba(15,23,42,0.16)]
        `,
         white: `
            bg-surface
            text-text-primary
            border-text-primary
            shadow-[0_8px_24px_rgba(15,23,42,0.16)]
        `,
    },
};

const sizeStyles = {
    sm: `
        px-2.5 py-1
        text-[11px]
        gap-1.5
        rounded-full
    `,
    md: `
        px-3.5 py-1.5
        text-xs
        gap-2
        rounded-full
    `,
    lg: `
        px-4 py-2
        text-sm
        gap-2.5
        rounded-full
    `,
};

const Badge = ({
    children,
    icon: Icon,

    variant = 'default',
    tone = 'glass',
    size = 'md',

    dot = false,
    pulse = false,

    className = '',
}) => {
    // ✅ SAFE FALLBACK FIX (IMPORTANT)
    const toneGroup = toneStyles[tone] || toneStyles.glass;

    const toneClass =
        toneGroup[variant] || toneGroup.default || toneStyles.glass.default;

    return (
        <div
            className={clsx(
                `
                    inline-flex items-center justify-center
                    whitespace-nowrap
                    border
                    font-semibold tracking-[0.01em]
                    transition-all duration-300
                    select-none
                `,
                toneClass,
                sizeStyles[size],
                className,
            )}
        >
            {/* DOT */}
            {dot && (
                <span className="relative flex h-2 w-2 shrink-0">
                    <span
                        className={clsx(
                            `
                                absolute inline-flex
                                h-full w-full rounded-full
                                bg-current opacity-75
                            `,
                            pulse && 'animate-ping',
                        )}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
            )}

            {/* ICON */}
            {Icon && !dot && (
                <Icon
                    className="shrink-0"
                    size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15}
                    strokeWidth={2.2}
                />
            )}

            {/* LABEL */}
            <span className="leading-none">{children}</span>
        </div>
    );
};

export default Badge;

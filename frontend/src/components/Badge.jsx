import React from 'react';

import clsx from 'clsx';

const toneStyles = {
    glass: {
        primary: `
            border-primary/20
            bg-primary/[0.07]
            text-primary
        `,
        accent: `
            border-accent/20
            bg-accent/[0.08]
            text-accent
        `,
        urgent: `
            border-error/20
            bg-error/[0.07]
            text-error
        `,
        success: `
            border-success/20
            bg-success/[0.07]
            text-success
        `,
        warning: `
            border-highlight/25
            bg-highlight/[0.09]
            text-warning
        `,
        default: `
            border-border
            bg-surface-soft
            text-text-primary
        `,
    },

    soft: {
        primary: `
            border-primary/15
            bg-primary/[0.055]
            text-primary
        `,
        accent: `
            border-accent/15
            bg-accent/[0.065]
            text-accent
        `,
        urgent: `
            border-error/15
            bg-error/[0.055]
            text-error
        `,
        success: `
            border-success/15
            bg-success/[0.055]
            text-success
        `,
        warning: `
            border-highlight/20
            bg-highlight/[0.075]
            text-warning
        `,
        default: `
            border-border
            bg-background-alt
            text-text-secondary
        `,
    },

    dark: {
        primary: `
            border-primary-deep
            bg-primary-deep
            text-text-on-dark
        `,
        accent: `
            border-accent-hover
            bg-accent-hover
            text-white
        `,
        urgent: `
            border-error
            bg-error
            text-white
        `,
        success: `
            border-success
            bg-success
            text-white
        `,
        warning: `
            border-highlight
            bg-highlight
            text-text-primary
        `,
        default: `
            border-text-primary
            bg-text-primary
            text-text-on-dark
        `,
    },

    solid: {
        primary: `
            border-primary
            bg-primary
            text-white
        `,
        accent: `
            border-accent
            bg-accent
            text-white
        `,
        urgent: `
            border-error
            bg-error
            text-white
        `,
        success: `
            border-success
            bg-success
            text-white
        `,
        warning: `
            border-highlight
            bg-highlight
            text-text-primary
        `,
        default: `
            border-text-primary
            bg-text-primary
            text-white
        `,
        white: `
            border-border
            bg-surface
            text-text-primary
        `,
    },
};

const sizeStyles = {
    sm: `
        h-7
        px-3
        text-[11px]
        gap-1.5
        rounded-full
    `,

    md: `
        h-9
        px-4
        text-sm
        gap-2
        rounded-full
    `,

    lg: `
        h-11
        px-5
        text-[15px]
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
    const toneGroup = toneStyles[tone] || toneStyles.glass;

    const toneClass =
        toneGroup[variant] || toneGroup.default || toneStyles.glass.default;

    return (
        <div
            className={clsx(
                `
                    inline-flex
                    items-center
                    justify-center
                    max-w-full
                    whitespace-nowrap
                    shrink-0

                    border

                    font-medium
                    leading-none
                    tracking-[0.005em]

                    select-none
                    transition-colors
                    duration-200
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
                                absolute
                                inset-0
                                rounded-full
                                bg-current
                                opacity-35
                            `,
                            pulse && 'animate-ping',
                        )}
                    />

                    <span className="relative h-2 w-2 rounded-full bg-current" />
                </span>
            )}

            {/* ICON */}
            {Icon && !dot && (
                <Icon
                    className={clsx(
                        'shrink-0',
                        size === 'sm' && 'size-3.5',
                        size === 'md' && 'size-4',
                        size === 'lg' && 'size-4.5',
                    )}
                    strokeWidth={2.1}
                />
            )}

            {/* LABEL */}
            <span className="truncate">{children}</span>
        </div>
    );
};

export default Badge;

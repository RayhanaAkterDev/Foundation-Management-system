import React from 'react';

import { Link } from 'react-router-dom';

function Button({
    children,
    to,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const baseStyles = `
        group
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-lg
        font-sans
        font-medium
        tracking-[-0.01em]
        whitespace-nowrap
        transition-all
        duration-200
        ease-out
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-45
    `;

    const sizes = {
        sm: `
            min-h-9
            px-3.5
            text-[13px]
        `,

        md: `
            min-h-11
            px-[18px]
            text-sm
        `,

        lg: `
            min-h-[46px]
            px-6
            text-[15px]
        `,
    };

    const variants = {
        primary: `
            bg-primary
            text-white
            shadow-[0_1px_2px_rgba(8,60,54,0.12)]
            hover:bg-primary-hover
            hover:shadow-[0_5px_14px_rgba(8,60,54,0.14)]
            active:translate-y-px
            focus-visible:ring-primary/30

            before:absolute
            before:inset-x-0
            before:top-0
            before:h-px
            before:bg-white/20

            after:absolute
            after:inset-0
            after:bg-white/[0.04]
            after:opacity-0
            after:transition-opacity
            after:duration-200
            hover:after:opacity-100
        `,

        accent: `
            bg-accent
            text-white
            shadow-[0_1px_2px_rgba(180,93,72,0.12)]
            hover:bg-accent-hover
            hover:shadow-[0_5px_14px_rgba(180,93,72,0.15)]
            active:translate-y-px
            focus-visible:ring-accent/30

            before:absolute
            before:inset-x-0
            before:top-0
            before:h-px
            before:bg-white/20

            after:absolute
            after:inset-0
            after:bg-white/[0.05]
            after:opacity-0
            after:transition-opacity
            after:duration-200
            hover:after:opacity-100
        `,

        outline: `
            border
            border-border-strong
            bg-surface
            text-text-primary
            shadow-[0_1px_1px_rgba(23,35,33,0.03)]
            hover:border-primary-muted
            hover:bg-primary-soft
            hover:text-primary-deep
            active:translate-y-px
            focus-visible:ring-primary/25
        `,

        ghost: `
            bg-transparent
            text-text-secondary
            hover:bg-background-alt
            hover:text-primary
            active:translate-y-px
            focus-visible:ring-primary/20
        `,
    };

    const classes = `
        ${baseStyles}
        ${sizes[size] || sizes.md}
        ${variants[variant] || variants.primary}
        ${className}
    `;

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                <span className="relative z-10 inline-flex items-center gap-2">
                    {children}
                </span>
            </Link>
        );
    }

    return (
        <button type={type} disabled={disabled} className={classes} {...props}>
            <span className="relative z-10 inline-flex items-center gap-2">
                {children}
            </span>
        </button>
    );
}

export default Button;

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
        tracking-normal
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
            text-white!
            shadow-none
            hover:bg-primary-hover

            active:translate-y-px
            focus-visible:ring-primary/30

        `,

        accent: `
            bg-accent
            text-white!
            shadow-none
            hover:bg-accent-hover

            active:translate-y-px
            focus-visible:ring-accent/30

        `,

        outline: `
            border
            border-border-strong
            bg-surface
            text-text-primary
            shadow-none
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

        editorial: `
            overflow-visible
            rounded-none
            bg-transparent
            px-0
            text-text-primary
            shadow-none
            hover:text-primary
            active:translate-y-px
            focus-visible:ring-primary/20
            after:absolute
            after:bottom-1
            after:left-0
            after:h-px
            after:w-full
            after:origin-left
            after:scale-x-0
            after:bg-primary
            after:transition-transform
            after:duration-200
            hover:after:scale-x-100
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

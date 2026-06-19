import React from 'react';
import { Link } from 'react-router-dom';

function Button({
    children,

    to,

    variant = 'primary',
    size = 'md',

    className = '',

    disabled = false,

    ...props
}) {
    const baseStyles = `
        inline-flex items-center justify-center gap-2

        rounded-xl

        font-jost

        transition-all duration-200 ease-out

        whitespace-nowrap

        active:scale-[0.98]

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2

        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:active:scale-100
    `;

    const sizes = {
        sm: 'px-3 py-2 text-sm',

        md: 'px-5 py-2.5 text-[15px]',

        lg: 'px-6 py-3 text-base',
    };

    const variants = {
        primary: `
            bg-primary
            text-white

            hover:bg-primary-hover

            hover:shadow-sm

            focus-visible:ring-primary/40
        `,

        accent: `
            bg-gradient-to-r
            from-amber-500
            to-orange-500

            text-background
            font-semibold!

            hover:from-amber-600
            hover:to-orange-600

            shadow-sm
            hover:shadow-md

            focus-visible:ring-amber-400/40
        `,

        outline: `
            border
            border-border

            bg-background

            text-text-primary

            font-medium

            hover:border-primary/30

            focus-visible:ring-primary/30
        `,

        ghost: `
            bg-transparent

            text-text-primary

            hover:bg-black/5

            focus-visible:ring-primary/20
        `,
    };

    const classes = `
        ${baseStyles}
        ${sizes[size]}
        ${variants[variant]}
        ${className}
        cursor-pointer
    `;

    // Internal navigation

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    // Normal button

    return (
        <button
            type="button"
            disabled={disabled}
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;

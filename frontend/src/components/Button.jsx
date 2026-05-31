import React from 'react';

function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const baseStyles = `
        inline-flex items-center justify-center gap-2
        rounded-xl
        font-medium
        transition-all duration-200 ease-out
        whitespace-nowrap
        active:scale-[0.98]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    `;

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-5 py-2.5 text-[15px]',
        lg: 'px-6 py-3 text-base',
    };

    const variants = {
        primary: `
            bg-primary text-white
            hover:bg-primary-hover
            hover:shadow-sm
            focus-visible:ring-primary/40
        `,

        accent: `
    bg-gradient-to-r from-amber-500 to-orange-500
    text-background font-semibold!
    hover:from-amber-600 hover:to-orange-600
    shadow-sm hover:shadow-md
    transition-all duration-200
    focus-visible:ring-amber-400/40
`,

        outline: `
            border border-border
            bg-transparent text-text-primary
            hover:bg-background
            hover:border-primary/30
            focus-visible:ring-primary/30
        `,

        ghost: `
            bg-transparent text-text-primary
            hover:bg-black/5
            focus-visible:ring-primary/20
        `,
    };

    return (
        <button
            disabled={disabled}
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className} cursor-pointer`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;

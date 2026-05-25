import React from 'react';

function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}) {
    const baseStyles = `
        inline-flex items-center justify-center gap-2
        rounded-lg
        px-5 py-2.5
        text-[15px] font-medium
        transition-all duration-200
        cursor-pointer
        whitespace-nowrap
        active:scale-[0.98]
    `;

    const variants = {
        primary: `
            bg-primary text-white
            hover:bg-primary-hover
            hover:shadow-sm
        `,

        outline: `
            border border-border
            bg-transparent text-text-primary
            hover:bg-background
            hover:border-accent/30
        `,
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
import React from 'react';

function Button({
    children,
    variant = 'primary',
    className = '',
}) {
    const baseStyles = `
        inline-flex items-center justify-center gap-2
        rounded-xl
        px-6 py-3.5
        text-base font-medium
        transition-all duration-300
        cursor-pointer
        whitespace-nowrap
    `;

    const variants = {

        primary: `
            bg-primary text-white
            hover:-translate-y-0.5
            hover:bg-primary-hover
        `,

        outline: `
            border border-border
            bg-white text-primary
            hover:border-accent/30
            hover:text-accent
            hover:bg-accent/5
        `,
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
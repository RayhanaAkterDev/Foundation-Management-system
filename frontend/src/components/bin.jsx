import React from 'react';

const toneStyles = {
    glass: {
        base: 'bg-white/10 backdrop-blur-md border-white/20 shadow-sm',

        urgent: 'text-red-400',
        primary: 'text-primary',
        accent: 'text-accent',
        success: 'text-green-400',
        warning: 'text-yellow-400',
        default: 'text-white',
    },

    soft: {
        base: 'bg-white/15 border-white/20',

        urgent: 'text-red-500',
        primary: 'text-primary',
        accent: 'text-accent',
        success: 'text-green-500',
        warning: 'text-yellow-600',
        default: 'text-text-primary',
    },

    dark: {
        base: 'bg-black/50 backdrop-blur-md border-white/20',

        urgent: 'text-red-300',
        primary: 'text-white',
        accent: 'text-white',
        success: 'text-white',
        warning: 'text-white',
        default: 'text-white',
    },

    solid: {
        base: '',

        urgent: 'bg-red-500 text-white border-transparent',
        primary: 'bg-primary text-white border-transparent',
        accent: 'bg-accent text-white border-transparent',
        success: 'bg-green-500 text-white border-transparent',
        warning: 'bg-yellow-500 text-black border-transparent',
        default: 'bg-gray-800 text-white border-transparent',
    },
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
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

    return (
        <div
            className={`
                inline-flex items-center gap-2
                font-semibold
                border
                rounded-full
                whitespace-nowrap
                transition-all duration-300

                ${toneGroup.base}
                ${toneGroup[variant] || toneGroup.default}
                ${sizeStyles[size]}

                ${className}
            `}
        >
            {dot && (
                <span className="relative flex h-2 w-2">
                    <span
                        className={`
                            absolute inline-flex h-full w-full rounded-full opacity-75 bg-current
                            ${pulse ? 'animate-ping' : ''}
                        `}
                    />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
            )}

            {Icon && !dot && (
                <Icon className="shrink-0" size={16} strokeWidth={2.2} />
            )}

            <span className="leading-none">{children}</span>
        </div>
    );
};

export default Badge;
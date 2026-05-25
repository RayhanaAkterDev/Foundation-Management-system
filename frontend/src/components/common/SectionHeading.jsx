import React from 'react';

const wrapperStyles = {
    base: 'w-full flex flex-col',
};

const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-6 lg:gap-7',
};

const badgeStyles = {
    base: `
        flex items-center gap-2
        text-[clamp(0.75rem,0.8vw,0.95rem)]
        font-semibold
        text-primary
    `,
};

/* IMPROVED FLUID TYPOGRAPHY */

const headingStyles = {
    hero: `
        text-[clamp(1.9rem,5vw,4rem)]
        font-bold
        leading-[1.08]
        tracking-[-0.03em]
    `,

    section: `
        text-[clamp(1.6rem,3vw,3rem)]
        font-bold
        leading-[1.12]
        tracking-[-0.025em]
    `,

    sub: `
        text-[clamp(1.15rem,1.8vw,1.8rem)]
        font-semibold
        leading-snug
    `,

    card: `
        text-[clamp(1rem,1.3vw,1.3rem)]
        font-semibold
        leading-snug
    `,
};

const descriptionStyles = {
    hero: `
        text-[clamp(1rem,1.25vw,1.15rem)]
        text-text-secondary
        leading-[1.7]
        max-w-full lg:max-w-xl
    `,

    section: `
        text-[clamp(0.96rem,1.05vw,1.1rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full lg:max-w-2xl
    `,

    sub: `
        text-[clamp(0.95rem,1vw,1.05rem)]
        text-text-secondary
        leading-[1.7]
    `,

    card: `
        text-[clamp(0.92rem,0.95vw,1rem)]
        text-text-secondary
        leading-[1.65]
    `,
};

const SectionHeading = ({
    badge,
    badgeIcon: BadgeIcon,
    title,
    description,
    headingTag: HeadingTag = 'h2', // eslint-disable-line no-unused-vars
    align = 'center',
    gap = 'md',
    headingSize = 'section',
    descriptionSize = 'section',
    wrapperClass = '',
    badgeClass = '',
    headingClass = '',
    descriptionClass = '',
}) => {
    return (
        <div
            className={`
                ${wrapperStyles.base}
                ${
                    align === 'center'
                        ? 'items-center text-center'
                        : 'items-start text-left'
                }
                ${gapStyles[gap]}
                ${wrapperClass}
            `}
        >
            {/* Badge */}
            {badge && (
                <p className={`${badgeStyles.base} ${badgeClass}`}>
                    {BadgeIcon && (
                        <BadgeIcon
                            className="text-current shrink-0"
                            strokeWidth={3}
                        />
                    )}
                    <span>{badge}</span>
                </p>
            )}

            {/* Heading */}
            <HeadingTag
                className={`
                    ${headingStyles[headingSize]}
                    ${headingClass}
                `}
            >
                {title}
            </HeadingTag>

            {/* Description */}
            {description && (
                <p
                    className={`
                        ${descriptionStyles[descriptionSize]}
                        ${descriptionClass}
                    `}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;

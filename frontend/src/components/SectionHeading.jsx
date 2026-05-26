import React from 'react';

const wrapperStyles = {
    base: 'w-full flex flex-col',
};

const alignStyles = {
    center: 'items-center text-center',
    left: 'items-start text-left',
};

const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-6 lg:gap-7',
};

/* BADGE */
const badgeBase = `
    inline-flex items-center gap-2
    text-[clamp(0.75rem,0.85vw,0.95rem)]
    font-semibold
    text-primary
`;

/* HEADINGS (UPDATED SYSTEM) */
const headingStyles = {
    hero: `
        text-[clamp(1.7rem,3vw,2.8rem)]
        font-bold
        leading-[1.2]
        tracking-[-0.03em]
    `,

    pageHero: `
        text-[clamp(1.6rem,2.6vw,2.4rem)]
        font-bold
        leading-[1.2]
        tracking-[-0.025em]
    `,

    section: `
        text-[clamp(1.4rem,2vw,2rem)]
        font-bold
        leading-[1.15]
        tracking-[-0.02em]
    `,

    sub: `
        text-[clamp(1.1rem,1.5vw,1.4rem)]
        font-semibold
        leading-snug
    `,

    card: `
        text-[clamp(1rem,1.2vw,1.2rem)]
        font-semibold
        leading-snug
    `,
};

/* DESCRIPTION (kept balanced) */
const descriptionStyles = {
    hero: `
        text-[clamp(0.98rem,1.1vw,1.1rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full lg:max-w-2xl
    `,

    pageHero: `
        text-[clamp(0.95rem,1.05vw,1.05rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full lg:max-w-2xl
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

    maxWidth = 'default',

    wrapperClass = '',
    badgeClass = '',
    headingClass = '',
    descriptionClass = '',
}) => {
    return (
        <div
            className={`
                ${wrapperStyles.base}
                ${alignStyles[align]}
                ${gapStyles[gap]}
                ${wrapperClass}
            `}
        >
            {/* BADGE */}
            {badge && (
                <div className={`${badgeBase} ${badgeClass}`}>
                    {BadgeIcon && (
                        <BadgeIcon
                            className="text-current shrink-0"
                            strokeWidth={3}
                        />
                    )}
                    <span>{badge}</span>
                </div>
            )}

            {/* TITLE */}
            <HeadingTag
                className={`
                    ${headingStyles[headingSize]}
                    ${headingClass}
                `}
            >
                {title}
            </HeadingTag>

            {/* DESCRIPTION */}
            {description && (
                <p
                    className={`
                        ${descriptionStyles[descriptionSize]}
                        ${descriptionClass}
                        ${
                            maxWidth === 'narrow'
                                ? 'lg:max-w-xl'
                                : maxWidth === 'wide'
                                  ? 'lg:max-w-3xl'
                                  : ''
                        }
                    `}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
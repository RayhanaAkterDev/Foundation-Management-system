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
    font-medium
    text-primary
`;

/* HEADINGS */
const headingStyles = {
    hero: `
        text-[clamp(2.2rem,4vw,3.4rem)]
        font-bold
        leading-[1.25]
        tracking-[-0.045em]
    `,

    sectionHero: `
        text-[clamp(1.85rem,3vw,2.6rem)]
        font-bold
        leading-[1.1]
        tracking-[-0.04em]
    `,

    section: `
        text-[clamp(1.4rem,2vw,1.9rem)]
        font-semibold
        leading-[1.25]
        tracking-[-0.02em]
    `,

    sub: `
        text-[clamp(1.1rem,1.4vw,1.3rem)]
        font-semibold
        leading-[1.35]
        tracking-[-0.01em]
    `,

    card: `
        text-[clamp(1rem,1.15vw,1.2rem)]
        font-semibold
        leading-[1.4]
        tracking-[-0.01em]
    `,
};

/* DESCRIPTION */
const descriptionStyles = {
    hero: `
        text-[clamp(1rem,1.15vw,1.15rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full lg:max-w-2xl
    `,

    sectionHero: `
        text-[clamp(0.98rem,1.1vw,1.1rem)]
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
    badges,
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
            {/* BADGE */}
            {(badge || badges) && (
                <div className="flex flex-wrap items-center gap-3">
                    {/* SINGLE BADGE */}
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

                    {/* MULTIPLE BADGES */}
                    {badges?.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={index}
                                className={`${badgeBase} ${item.className || ''}`}
                            >
                                {Icon && (
                                    <Icon
                                        className="text-current shrink-0"
                                        strokeWidth={3}
                                    />
                                )}

                                <span>{item.label}</span>
                            </div>
                        );
                    })}
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

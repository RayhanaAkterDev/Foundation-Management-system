import React from 'react';

const wrapperStyles = {
    base: 'flex flex-col',
};

const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-6 lg:gap-7',
};

const badgeStyles = {
    base: 'flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary',
};

/* FLUID TYPOGRAPHY */

const headingStyles = {
    hero: `
        text-[clamp(2.1rem,3vw,3.8rem)]
        font-bold
        leading-[1.08]
        tracking-[-0.025em]
    `,

    section: `
        text-[clamp(1.6rem,2.2vw,2.8rem)]
        font-bold
        leading-[1.15]
        tracking-[-0.02em]
    `,

    sub: `
        text-[clamp(1.15rem,1.4vw,1.7rem)]
        font-semibold
        leading-snug
    `,

    card: `
        text-[clamp(1rem,1vw,1.15rem)]
        font-semibold
        leading-snug
    `,
};

const descriptionStyles = {
    hero: `
        text-[clamp(1rem,1.2vw,1.125rem)]
        text-text-secondary
        leading-relaxed
        max-w-full lg:max-w-xl
    `,

    section: `
        text-[clamp(0.95rem,1vw,1.05rem)]
        text-text-secondary
        leading-relaxed
        max-w-full lg:max-w-2xl
    `,

    sub: `
        text-sm
        text-text-secondary
        leading-relaxed
    `,

    card: `
        text-sm
        text-text-secondary
        leading-relaxed
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
            {/* BADGE */}
            {badge && (
                <p className={`${badgeStyles.base} ${badgeClass}`}>
                    {BadgeIcon && (
                        <BadgeIcon className="text-current" strokeWidth={3} />
                    )}

                    <span>{badge}</span>
                </p>
            )}

            {/* HEADING */}
            <HeadingTag
                className={`capitalize ${headingStyles[headingSize]} ${headingClass}`}
            >
                {title}
            </HeadingTag>

            {/* DESCRIPTION */}
            {description && (
                <p
                    className={`${descriptionStyles[descriptionSize]} ${descriptionClass}`}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;

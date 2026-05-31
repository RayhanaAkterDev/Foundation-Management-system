import React from 'react';
import Badge from '@/components/Badge';

const wrapperStyles = {
    base: 'w-full flex flex-col',
};

const alignStyles = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right',
};

const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2 sm:gap-3 lg:gap-4',
    md: 'gap-3 sm:gap-4 lg:gap-5',
    lg: 'gap-4 sm:gap-6 lg:gap-7',
};

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
    badgeIcon: BadgeIcon, // eslint-disable-line no-unused-vars

    title,
    description,

    headingTag: HeadingTag = 'h2', // eslint-disable-line no-unused-vars

    align = 'center',
    gap = 'md',

    headingSize = 'section',
    descriptionSize = 'section',

    maxWidth = 'default',

    wrapperClass = '',
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
                <div className="flex flex-wrap items-center gap-3">
                    {typeof badge === 'object' ? (
                        <Badge
                            variant={badge.variant || 'default'}
                            tone={badge.tone || 'soft'}
                            icon={badge.icon}
                            size={badge.size || 'sm'}
                            dot={badge.dot}
                            pulse={badge.pulse}
                        >
                            {badge.label}
                        </Badge>
                    ) : (
                        /* STRING fallback (OLD SUPPORT) */
                        <Badge variant="primary" tone="soft" size="sm">
                            {badge}
                        </Badge>
                    )}

                    {/* MULTIPLE BADGES */}
                    {badges?.map((item, index) => (
                        <Badge
                            key={index}
                            variant={item.variant || 'default'}
                            tone={item.tone || 'soft'}
                            icon={item.icon}
                            size="sm"
                            dot={item.dot}
                            pulse={item.pulse}
                        >
                            {item.label}
                        </Badge>
                    ))}
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

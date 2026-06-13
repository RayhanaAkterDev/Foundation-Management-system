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

/* RESPONSIVE GAP SYSTEM */
const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1 sm:gap-2',
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-3 sm:gap-4 md:gap-5',
    lg: 'gap-4 sm:gap-5 md:gap-6 lg:gap-7',
};

/* HEADINGS */
const headingStyles = {
    hero: `
        text-[clamp(2.5rem,8vw,3.6rem)]
        font-bold
        leading-[1.15]
        tracking-[-0.045em]
    `,
    sectionHero: `
        text-[clamp(2rem,3.5vw,2.8rem)]
        font-bold
        leading-[1.12]
        tracking-[-0.04em]
    `,
    section: `
        text-[clamp(1.5rem,2.2vw,2rem)]
        font-semibold
        leading-[1.2]
        tracking-[-0.02em]
    `,
    sub: `
        text-[clamp(1.15rem,1.5vw,1.35rem)]
        font-semibold
        leading-[1.35]
        tracking-[-0.01em]
    `,
    card: `
        text-[clamp(1.05rem,1.2vw,1.2rem)]
        font-semibold
        leading-[1.4]
        tracking-[-0.01em]
    `,
};

/* DESCRIPTION */
const descriptionStyles = {
    hero: `
        text-[clamp(1rem,1.2vw,1.2rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl
    `,
    sectionHero: `
        text-[clamp(1rem,1.15vw,1.12rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl
    `,
    section: `
        text-[clamp(1rem,1.08vw,1.1rem)]
        text-text-secondary
        leading-[1.75]
        max-w-full sm:max-w-lg lg:max-w-2xl
    `,
    sub: `
        text-[clamp(0.98rem,1vw,1.05rem)]
        text-text-secondary
        leading-[1.7]
        max-w-full sm:max-w-lg
    `,
    card: `
        text-[clamp(0.95rem,0.95vw,1rem)]
        text-text-secondary
        leading-[1.65]
        max-w-full
    `,
};

const SectionHeading = ({
    badge,
    badges,

    title,
    description,

    // eslint-disable-next-line no-unused-vars
    headingTag: HeadingTag = 'h2',

    align = 'center',
    gap = 'md',

    headingSize = 'section',
    descriptionSize = 'section',

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
            {/* BADGE GROUP */}
            {(badge || badges) && (
                <div className="flex flex-wrap items-start sm:items-center gap-2 sm:gap-3">
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
                        badge && (
                            <Badge variant="primary" tone="soft" size="sm">
                                {badge}
                            </Badge>
                        )
                    )}

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
                    `}
                >
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;

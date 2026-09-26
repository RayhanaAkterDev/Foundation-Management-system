import React from 'react';

import Badge from '@/components/Badge';

const wrapperStyles = {
    base: 'flex w-full flex-col',
};

const alignStyles = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right',
};

/* =================================
   RESPONSIVE GAP SYSTEM
================================= */

const gapStyles = {
    none: 'gap-0',

    xs: `
        gap-1.5
        sm:gap-2
    `,

    sm: `
        gap-2
        sm:gap-3
    `,

    md: `
        gap-3
        sm:gap-4
        lg:gap-4
        xl:gap-5
    `,

    lg: `
        gap-4
        sm:gap-5
        lg:gap-5
        xl:gap-6
    `,
};

/* =================================
   HEADING STYLES

   Mobile → comfortable
   lg laptop → controlled
   xl desktop → spacious

   Warm neutral typography with
   minimal negative tracking for
   better Bengali readability.
================================= */

const headingStyles = {
    hero: `
        text-[2rem]
        sm:text-[2.4rem]
        md:text-[2.8rem]
        lg:text-[3.15rem]
        xl:text-[3.8rem]
        font-bold
        leading-[1.2]
        sm:leading-[1.18]
        lg:leading-[1.16]
        text-text-primary
        tracking-[-0.01em]
        sm:tracking-[-0.012em]
        lg:tracking-[-0.015em]
        max-w-full
    `,

    sectionHero: `
        text-[1.85rem]
        sm:text-[2.1rem]
        md:text-[2.45rem]
        lg:text-[2.7rem]
        xl:text-[3.15rem]
        font-bold
        leading-[1.24]
        sm:leading-[1.2]
        lg:leading-[1.18]
        text-text-primary
        tracking-[-0.008em]
        sm:tracking-[-0.01em]
        lg:tracking-[-0.012em]
        max-w-full
    `,

    section: `
        text-[1.5rem]
        sm:text-[1.65rem]
        md:text-[1.85rem]
        lg:text-[2rem]
        xl:text-[2.15rem]
        font-semibold
        leading-[1.3]
        text-text-primary
        tracking-[-0.005em]
    `,

    sub: `
        text-lg
        sm:text-xl
        lg:text-[1.2rem]
        xl:text-[1.3rem]
        font-semibold
        leading-[1.45]
        text-text-primary
    `,

    card: `
        text-base
        sm:text-[1.05rem]
        font-semibold
        leading-[1.5]
        text-text-primary
    `,
};

/* =================================
   DESCRIPTION STYLES

   Uses secondary text rather than
   muted text so descriptions remain
   readable on warm ivory backgrounds.
================================= */

const descriptionStyles = {
    hero: `
        text-[0.95rem]
        sm:text-base
        lg:text-[1.05rem]
        xl:text-[1.1rem]
        text-text-body
        leading-[1.8]
        sm:leading-[1.85]
        lg:leading-[1.8]
        max-w-full
        sm:max-w-xl
        lg:max-w-xl
        xl:max-w-2xl
    `,

    sectionHero: `
        text-[0.95rem]
        sm:text-base
        lg:text-[1.05rem]
        xl:text-[1.1rem]
        text-text-body
        leading-[1.8]
        sm:leading-[1.85]
        lg:leading-[1.8]
        max-w-full
        sm:max-w-xl
        lg:max-w-xl
        xl:max-w-2xl
    `,

    section: `
        text-[0.95rem]
        sm:text-base
        lg:text-[1rem]
        text-text-body
        leading-[1.8]
        max-w-full
        sm:max-w-lg
        lg:max-w-xl
    `,

    sub: `
        text-sm
        sm:text-[0.95rem]
        lg:text-base
        text-text-secondary
        leading-[1.75]
        max-w-full
        sm:max-w-lg
    `,

    card: `
        text-sm
        sm:text-[0.95rem]
        text-text-secondary
        leading-[1.75]
        max-w-full
    `,
};

const SectionHeading = ({
    badge,
    badges,
    title,
    description,
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
            {/* =================================
                BADGES
            ================================= */}

            {(badge || badges) && (
                <div
                    className="
                        flex
                        w-full
                        flex-wrap
                        items-center
                        gap-2
                        sm:w-auto
                        sm:gap-2.5
                        lg:gap-2
                        xl:gap-3
                    "
                >
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

            {/* =================================
                TITLE
            ================================= */}

            <HeadingTag
                className={`
                    ${headingStyles[headingSize]}
                    ${headingClass}
                `}
            >
                {title}
            </HeadingTag>

            {/* =================================
                DESCRIPTION
            ================================= */}

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

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
        text-[2.25rem]
        sm:text-[2.65rem]
        md:text-[2.9rem]
        lg:text-[3rem]
        xl:text-[3.35rem]
        font-medium!
        leading-[1.14]
        sm:leading-[1.12]
        lg:leading-[1.1]
        text-text-primary
        tracking-[-0.012em]
        sm:tracking-[-0.016em]
        max-w-full
    `,

    sectionHero: `
        text-[1.9rem]
        sm:text-[2.2rem]
        md:text-[2.5rem]
        lg:text-[2.65rem]
        xl:text-[3.15rem]
        font-medium!
        leading-[1.24]
        sm:leading-[1.2]
        lg:leading-[1.16]
        text-text-primary
        tracking-[-0.006em]
        sm:tracking-[-0.009em]
        lg:tracking-[-0.012em]
        max-w-full
    `,

    section: `
        text-[1.5rem]
        sm:text-[1.7rem]
        md:text-[1.9rem]
        lg:text-[2rem]
        xl:text-[2.2rem]
        font-medium!
        leading-[1.3]
        text-text-primary
        tracking-[-0.004em]
    `,

    sub: `
        text-lg
        sm:text-xl
        lg:text-[1.2rem]
        xl:text-[1.3rem]
        font-medium!
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
        text-[0.98rem]
        sm:text-[1.05rem]
        lg:text-[1rem]
        xl:text-[1.08rem]
        text-text-body
        leading-[1.8]
        sm:leading-[1.85]
        lg:leading-[1.8]
        max-w-full
        sm:max-w-xl
        lg:max-w-lg
        xl:max-w-xl
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
    treatment = 'default',
    lang,
    wrapperClass = '',
    headingClass = '',
    descriptionClass = '',
}) => {
    const isEditorial = treatment === 'editorial';

    return (
        <div
            lang={lang}
            className={`
                ${wrapperStyles.base}
                ${alignStyles[align]}
                ${isEditorial ? 'gap-0' : gapStyles[gap]}
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
                            shape={isEditorial ? 'label' : 'pill'}
                        >
                            {badge.label}
                        </Badge>
                    ) : (
                        badge && (
                            <Badge
                                variant="primary"
                                tone="soft"
                                size="sm"
                                shape={isEditorial ? 'label' : 'pill'}
                            >
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
                            shape={isEditorial ? 'label' : 'pill'}
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
                    ${isEditorial ? 'font-medium! !leading-[1.2]' : ''}
                    ${isEditorial && (badge || badges) ? 'mt-4 sm:mt-5' : ''}
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
                        ${isEditorial ? 'mt-4 sm:mt-5' : ''}
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

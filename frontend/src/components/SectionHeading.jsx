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

    xs: `
        gap-1
        sm:gap-2
    `,

    sm: `
        gap-2
        sm:gap-3
    `,

    md: `
        gap-3
        sm:gap-4
        md:gap-5
    `,

    lg: `
        gap-4
        sm:gap-5
        md:gap-6
    `,
};

/* HEADINGS */
const headingStyles = {
    hero: `
        text-[2rem]
        sm:text-[2.5rem]
        md:text-[3rem]
        lg:text-[3.75rem]
        xl:text-[4.25rem]

        font-bold

        leading-[1.1]
        md:leading-[1.12]

        tracking-[-0.03em]
        md:tracking-[-0.045em]

        max-w-full
        sm:max-w-3xl
        lg:max-w-4xl
    `,

    sectionHero: `
        text-[1.85rem]
        sm:text-4xl
        md:text-[2.6rem]
        lg:text-[3rem]

        font-bold

        leading-[1.12]

        tracking-[-0.03em]

        max-w-full
        sm:max-w-3xl
    `,

    section: `
        text-[1.5rem]
        sm:text-[1.7rem]
        md:text-[1.9rem]
        lg:text-[2.1rem]

        font-semibold

        leading-[1.2]

        tracking-[-0.02em]
    `,

    sub: `
        text-lg
        sm:text-xl
        lg:text-[1.35rem]

        font-semibold

        leading-[1.35]

        tracking-[-0.01em]
    `,

    card: `
        text-base
        sm:text-lg

        font-semibold

        leading-[1.4]

        tracking-[-0.01em]
    `,
};

/* DESCRIPTION */
const descriptionStyles = {
    hero: `
        text-sm
        sm:text-base
        lg:text-lg

        text-text-secondary

        leading-[1.7]
        sm:leading-[1.75]

        max-w-full
        sm:max-w-xl
        lg:max-w-2xl
        xl:max-w-3xl
    `,

    sectionHero: `
        text-sm
        sm:text-base
        lg:text-[1.1rem]

        text-text-secondary

        leading-[1.7]
        sm:leading-[1.75]

        max-w-full
        sm:max-w-xl
        lg:max-w-2xl
        xl:max-w-3xl
    `,

    section: `
        text-sm
        sm:text-base

        text-text-secondary

        leading-[1.7]

        max-w-full
        sm:max-w-lg
        lg:max-w-2xl
    `,

    sub: `
        text-sm
        sm:text-[0.98rem]

        text-text-secondary

        leading-[1.7]

        max-w-full
        sm:max-w-lg
    `,

    card: `
        text-sm

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

            <HeadingTag
                className={`
                    ${headingStyles[headingSize]}
                    ${headingClass}
                `}
            >
                {title}
            </HeadingTag>

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

import React from 'react';

/* ================= WRAPPER ================= */

const wrapperStyles = {
    base: 'flex flex-col',
};

/* ================= ALIGN ================= */

const alignStyles = {
    left: 'items-start text-left',
    center: 'items-center text-center',
};

/* ================= GAP ================= */

const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
};

/* ================= BADGE ================= */

const badgeStyles = {
    base: 'flex items-center gap-2 text-sm font-semibold text-primary',
};

/* ================= HEADING ================= */

const headingStyles = {
    hero: 'text-3xl sm:text-5xl font-bold leading-tight',
    section: 'text-2xl sm:text-4xl font-bold leading-snug',
    sub: 'text-xl sm:text-2xl font-semibold leading-snug',
    card: 'text-lg font-semibold leading-snug',
};

/* ================= DESCRIPTION ================= */

const descriptionStyles = {
    hero: 'text-base md:text-lg text-text-secondary',
    section: 'text-base text-text-secondary',
    sub: 'text-sm text-text-secondary',
    card: 'text-sm text-text-secondary',
};

const SectionHeading = ({
    /* content */
    badge,
    badgeIcon: BadgeIcon,
    title,
    description,

    /* semantic */
    headingTag: HeadingTag = 'h2', // eslint-disable-line no-unused-vars

    /* structure */
    align = 'center',
    gap = 'md',

    /* typography */
    headingSize = 'section',
    descriptionSize = 'section',

    /* custom overrides */
    wrapperClass = '',
    badgeClass = '',
    headingClass = '',
    descriptionClass = '',
}) => {
    return (
        <div
            className={`${wrapperStyles.base}
                ${alignStyles[align]}
                ${gapStyles[gap]}
                ${wrapperClass}
            `}
        >
            {/* badge */}
            {badge && (
                <p
                    className={`${badgeStyles.base}
                        ${badgeClass}
                    `}
                >
                    {BadgeIcon && (
                        <BadgeIcon
                            aria-hidden="true"
                            className="text-current"
                        />
                    )}

                    <span>{badge}</span>
                </p>
            )}

            {/* heading */}
            <HeadingTag
                className={`capitalize
                    ${headingStyles[headingSize]}
                    ${headingClass}
                `}
            >
                {title}
            </HeadingTag>

            {/* description */}
            {description && (
                <p
                    className={`w-5/6
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

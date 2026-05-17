import React from 'react';
import Button from '../../components/common/Button';

const wrapperStyles = {
    hero: 'flex flex-col gap-4',
    section: 'flex flex-col gap-1.5',
};

const alignStyles = {
    hero: 'lg:items-start lg:text-left items-center text-center',
    section: 'items-center text-center',
};

const headingStyles = {
    hero: 'hero-heading',
    section: 'section-heading',
};

const descriptionStyles = {
    hero: 'hero-description',
    section: 'section-description',
};

const SectionHeading = ({
    badge,
    badgeIcon: BadgeIcon,
    title,
    description,
    headingTag: HeadingTag = 'h2', // eslint-disable-line no-unused-vars
    variant = 'section',
}) => {
    return (
        <div className={`${wrapperStyles[variant]} ${alignStyles[variant]}`}>
            {/* badge */}
            {badge && (
                <p className="flex items-center gap-2 text-sm text-primary-hover">
                    {BadgeIcon && (
                        <BadgeIcon
                            aria-hidden="true"
                            className="text-primary"
                        />
                    )}
                    <span>{badge}</span>
                </p>
            )}

            {/* heading */}
            <HeadingTag className={headingStyles[variant]}>{title}</HeadingTag>

            {/* description */}
            {description && (
                <p className={descriptionStyles[variant]}>{description}</p>
            )}
        </div>
    );
};

export default SectionHeading;

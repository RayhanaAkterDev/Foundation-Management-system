import React from 'react';
import {
    TbArrowNarrowDown,
    TbHeartHandshake,
    TbEyeSearch,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

const chips = [
    {
        text: 'Human-Centered',
        icon: 'heart',
    },
    {
        text: 'Transparent',
        icon: 'search',
    },
    {
        text: 'Trustworthy',
        icon: 'shield',
    },
    {
        text: 'Community Driven',
        icon: 'users',
    },
];

const renderIcon = (icon) => {
    switch (icon) {
        case 'heart':
            return <TbHeartHandshake size={18} className="text-primary" />;

        case 'search':
            return <TbEyeSearch size={18} className="text-primary" />;

        case 'shield':
            return <TbShieldCheck size={18} className="text-primary" />;

        case 'users':
            return <TbUsers size={18} className="text-primary" />;

        default:
            return null;
    }
};

const HowItWorksPageHero = () => {
    return (
        <section className="section-gap mt-24 bg-surface">
            <div className="container-width">
                <Motion variant="fadeUp">
                    <SectionHeading
                        gap="lg"
                        title="Turning urgent needs into verified support"
                        headingSize="hero"
                        description="Stand For People helps people in need connect with trusted donors and volunteers through a transparent and accountable support system."
                        descriptionSize="hero"
                    />
                </Motion>

                <Motion
                    variant="fadeUp"
                    className="
                        mt-12
                        flex
                        flex-wrap
                        justify-center
                        gap-3
                        max-w-5xl
                        mx-auto
                    "
                >
                    {chips.map(({ icon, text }) => (
                        <div
                            key={text}
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-2xl
                                bg-surface
                                border border-border
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-primary/20
                                hover:shadow-md
                            "
                        >
                            <div
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-primary/8
                                    border border-primary/10
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                    transition-colors
                                    duration-300
                                    group-hover:bg-primary/12
                                "
                            >
                                {renderIcon(icon)}
                            </div>

                            <span
                                className="
                                    text-sm
                                    font-medium
                                    whitespace-nowrap
                                    text-text-primary
                                "
                            >
                                {text}
                            </span>
                        </div>
                    ))}
                </Motion>

                <Motion className="mt-10 flex justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <TbArrowNarrowDown
                            size={18}
                            className="animate-bounce text-primary"
                        />

                        <span className="text-xs sm:text-sm text-text-secondary">
                            Scroll to explore the system
                        </span>
                    </div>
                </Motion>
            </div>
        </section>
    );
};

export default HowItWorksPageHero;

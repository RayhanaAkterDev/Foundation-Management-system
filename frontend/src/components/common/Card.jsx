import React from 'react';
import Button from './Button';
import aboutPurposeCards from '../../data/cards/aboutPurposeCards';
import { HiArrowSmRight } from 'react-icons/hi';

const Card = () => {
    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
            {aboutPurposeCards.map((item, index) => {
                const Icon = item.icon;
                const isAccent = index === 1;

                return (
                    <div
                        key={item.title}
                        className={`
    group relative overflow-hidden
    rounded-3xl

    border border-primary/10
    border-t-4 border-t-primary/60

    px-8 py-8
    min-h-72.5

    transition-transform duration-300 ease-out
    hover:-translate-y-1

    shadow-md
    will-change-transform

    ${isAccent ? 'bg-primary/10' : 'bg-white'}
`}
                    >
                        {/* watermark */}
                        <div className="absolute right-4 bottom-4 text-primary/8 pointer-events-none">
                            <Icon size={120} />
                        </div>

                        <div className="relative z-10 flex h-full flex-col max-w-[84%]">
                            {/* icon */}
                            <div
                                className={`
                                    flex h-14 w-14 items-center justify-center
                                    rounded-2xl shadow-md
                                    ${
                                        isAccent
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                    }
                                `}
                            >
                                <Icon size={22} />
                            </div>

                            {/* title */}
                            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary">
                                {item.title}
                            </h3>

                            {/* description */}
                            <p className="mt-4 text-base leading-relaxed text-text-secondary">
                                {item.description}
                            </p>

                            {/* CTA */}
                            <div className="mt-auto pt-6">
                                <Button
                                    variant="ghost"
                                    className="
                                        group/cta relative px-0 font-medium
                                        text-primary hover:text-primary-hover
                                        inline-flex items-center
                                        transition-colors duration-200
                                    "
                                >
                                    <span className="relative inline-flex items-center">
                                        {item.cta}
                                        <HiArrowSmRight className="ml-1" />

                                        {/* underline */}
                                        <span
                                            className="
                                                absolute left-0 -bottom-1
                                                h-0.5
                                                w-1/3
                                                bg-primary
                                                origin-left
                                                transition-all duration-300 ease-out
                                                group-hover/cta:w-full
                                            "
                                        />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Card;

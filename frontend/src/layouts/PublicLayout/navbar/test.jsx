import React from 'react';
import Card from '../common/Card';

const AboutPurposeSection = () => {
    return (
        <section className="section-gap border border-primary/10 ">
            <div className="container-width">
                {/* Main Purpose Block */}
                <div className="px-10">
                    <h2 className="text-3xl font-semibold text-text-primary">
                        Why CareLink Exists
                    </h2>

                    <p className="mt-4 text-text-secondary leading-relaxed max-w-3xl">
                        CareLink is built to make support more transparent,
                        direct, and human. Every feature exists to ensure help
                        reaches the right people at the right time.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-8">
                    <Card />
                </div>
            </div>
        </section>
    );
};

export default AboutPurposeSection;

// ================================

import React from 'react';
import Button from './Button';
import aboutPurposeCards from '../../data/cards/aboutPurposeCards';
import { HiArrowSmRight } from 'react-icons/hi';

const Card = () => {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {aboutPurposeCards.map((item, index) => {
                const Icon = item.icon;

                const isAccent = index === 1;
                // 👆 only ONE card gets accent (Impact Stories)

                return (
                    <div
                        key={item.title}
                        className={`
                            rounded-3xl border p-8 lg:p-10
                            transition-all duration-300
                            hover:-translate-y-1 hover:shadow-md
                            ${
                                isAccent
                                    ? 'border-primary/25 bg-primary-hover/20'
                                    : 'border-border bg-surface'
                            }
                        `}
                    >
                        {/* icon */}
                        <div
                            className={`
                                h-12 w-12 rounded-2xl flex items-center justify-center
                                transition-all duration-300
                                ${
                                    isAccent
                                        ? 'bg-primary text-white'
                                        : 'bg-primary/10 text-primary'
                                }
                            `}
                        >
                            <Icon size={24} />
                        </div>

                        {/* title */}
                        <h3 className="mt-5 text-2xl font-semibold text-primary-hover">
                            {item.title}
                        </h3>

                        {/* description */}
                        <p className="mt-4 text-text-secondary leading-relaxed">
                            {item.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-6 flex justify-end">
                            <Button
                                variant="ghost"
                                className="px-0 text-primary-hover"
                            >
                                {item.cta}
                                <HiArrowSmRight />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Card;

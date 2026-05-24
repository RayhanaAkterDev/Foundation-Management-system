import React from 'react';
import Button from './Button';
import aboutPurposeCards from '../../data/cards/aboutPurposeCards';
import { HiArrowSmRight } from 'react-icons/hi';

const Card = () => {
    return (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8">
            {aboutPurposeCards.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="
                            group relative overflow-hidden
                            rounded-3xl bg-white

                            border border-primary/10
                            border-t-4 border-t-primary/60

                            p-5 sm:p-6 lg:p-8

                            min-h-72.5 sm:min-h-80

                            transition-all duration-300 ease-out
                            hover:-translate-y-1 hover:shadow-lg
                            hover:bg-primary/2
                        "
                    >
                        {/* watermark */}
                        <div className="absolute right-3 bottom-3 text-primary/5 pointer-events-none">
                            <Icon className="size-20 sm:size-24 lg:size-28" />
                        </div>

                        <div className="relative z-10 flex h-full flex-col max-w-full sm:max-w-[88%]">

                            {/* icon */}
                            <div className="flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 text-primary">
                                <Icon className="size-5 sm:size-5.5" />
                            </div>

                            {/* title */}
                            <h3 className="mt-4 sm:mt-5 text-[clamp(1.2rem,1rem+1vw,1.6rem)] leading-[1.15] font-semibold tracking-tight text-text-primary">
                                {item.title}
                            </h3>

                            {/* description */}
                            <p className="mt-3 text-[clamp(0.95rem,0.9rem+0.2vw,1rem)] leading-relaxed text-text-secondary">
                                {item.description}
                            </p>

                            {/* CTA */}
                            <div className="mt-5 sm:mt-6 pt-1">
                                <Button
                                    variant="ghost"
                                    className="group/cta relative inline-flex items-center px-0 font-medium text-primary hover:text-primary-hover"
                                >
                                    <span className="relative inline-flex items-center">
                                        {item.cta}
                                        <HiArrowSmRight className="ml-1" />

                                        <span className="absolute left-0 -bottom-1 h-0.5 w-1/3 bg-primary/70 origin-left transition-all duration-300 group-hover/cta:w-full" />
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
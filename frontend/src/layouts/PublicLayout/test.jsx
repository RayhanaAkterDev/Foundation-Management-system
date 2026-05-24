import React from 'react';
import aboutPurposeCards from '../../data/cards/aboutPurposeCards';
import { HiArrowSmRight } from 'react-icons/hi';

const Card = () => {
    return (
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-7 md:grid-cols-2">
            {aboutPurposeCards.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="
                            group relative cursor-pointer overflow-hidden
                            rounded-3xl
                            bg-white
                            border border-primary/10
                            p-6 sm:p-7 lg:p-8
                            transition-all duration-500 ease-out
                            hover:-translate-y-2
                            hover:shadow-[0_20px_45px_-18px_rgba(52,168,83,0.18)]
                            hover:border-primary/20
                            hover:bg-white
                        "
                    >
                        {/* soft hover glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

                        {/* watermark icon */}
                        <div className="absolute right-4 bottom-4 text-primary/[0.05] pointer-events-none transition-all duration-500 group-hover:text-primary/[0.09] group-hover:scale-105">
                            <Icon className="size-24 sm:size-28 lg:size-32" />
                        </div>

                        {/* top row */}
                        <div className="relative flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15">
                                <Icon className="size-5" />
                            </div>

                            <HiArrowSmRight
                                className="
                                    text-primary/40
                                    group-hover:text-primary
                                    group-hover:translate-x-1
                                    transition-all duration-300
                                "
                                size={20}
                            />
                        </div>

                        {/* title */}
                        <h3 className="relative mt-5 text-xl sm:text-2xl font-semibold text-text-primary">
                            {item.title}
                        </h3>

                        {/* description */}
                        <p className="relative mt-3 text-sm sm:text-base leading-relaxed text-text-secondary">
                            {item.description}
                        </p>

                        {/* CTA */}
                        <div className="relative mt-6 flex items-center gap-2 text-primary font-medium">
                            <span className="relative">
                                {item.cta}
                                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                            </span>

                            <HiArrowSmRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Card;
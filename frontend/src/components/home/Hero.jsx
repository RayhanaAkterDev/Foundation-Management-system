import React from 'react';
import Button from '../../components/common/Button';

// icons
import {
    TbHeartFilled,
    TbHeart,
    TbUsersGroup,
    TbHeartHandshake,
} from 'react-icons/tb';

import { HiArrowSmRight } from 'react-icons/hi';

// image
import heroIllustration from '../../assets/images/home/heroIllustration.png';

// stats data
const stats = [
    {
        icon: TbUsersGroup,
        value: '25K+',
        label: 'Lives Impacted',
    },
    {
        icon: TbHeartHandshake,
        value: '8K+',
        label: 'Volunteers',
    },
    {
        icon: TbHeart,
        value: '120+',
        label: 'Communities',
    },
];

const Hero = () => {
    return (
        <section
            aria-labelledby="hero-heading"
            className="bg-[#FCFBFD] bg-cover bg-center bg-no-repeat lg:bg-heroDesktop"
        >
            <div className="container-wrapper py-20 md:py-24 lg:py-28">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    {/* text content */}
                    <div className="flex flex-col gap-4 items-center text-center lg:items-start lg:text-left">
                        {/* badge */}
                        <p className="flex items-center gap-2 text-sm text-text-secondary">
                            <TbHeartFilled
                                aria-hidden="true"
                                className="text-primary"
                            />
                            Together, we create real change
                        </p>

                        {/* heading */}
                        <h1
                            id="hero-heading"
                            className="text-2xl font-bold leading-tight sm:text-5xl md:text-6xl"
                        >
                            Connecting{' '}
                            <span className="text-primary">care</span>
                            <span className="block">
                                and changing{' '}
                                <span className="text-accent">lives</span>
                            </span>
                        </h1>

                        {/* description */}
                        <p className="max-w-xl text-base text-text-secondary sm:text-lg">
                            A platform where kindness becomes action{' '}
                            <span className="block">
                                through smart donation and volunteer
                                coordination.
                            </span>
                        </p>

                        {/* CTA buttons */}
                        <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                            <Button>
                                <TbHeartFilled aria-hidden="true" />
                                Donate Now
                            </Button>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                Learn More
                                <HiArrowSmRight aria-hidden="true" />
                            </Button>
                        </div>

                        {/* stats */}
                        <div className="mt-10">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    const isMiddle = index === 1;

                                    return (
                                        <div
                                            key={stat.label}
                                            className={`
                        flex items-center gap-5 py-5
                        ${index !== stats.length - 1 ? 'md:border-r md:border-border' : ''}
                        ${index !== 0 ? 'md:pl-4' : ''}
                        ${index !== stats.length - 1 ? 'md:pr-4' : ''}
                    `}
                                        >
                                            {/* icon */}
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-full transition
                            ${isMiddle ? 'bg-orange-100' : 'bg-primary/10'}
                        `}
                                            >
                                                <Icon
                                                    size={28}
                                                    className={
                                                        isMiddle
                                                            ? 'text-orange-500'
                                                            : 'text-primary'
                                                    }
                                                />
                                            </div>

                                            {/* text */}
                                            <div className="flex flex-col leading-tight">
                                                <h3
                                                    className={`text-xl md:text-2xl font-bold tracking-tight
                                ${isMiddle ? 'text-orange-500' : 'text-text-primary'}
                            `}
                                                >
                                                    {stat.value}
                                                </h3>

                                                <p
                                                    className={`text-sm font-medium mt-0.5 text-text-secondary`}
                                                >
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* mobile / tablet illustration */}
                    <div className="lg:hidden">
                        <img
                            src={heroIllustration}
                            alt="People collaborating to support donation and volunteer efforts"
                            className="mx-auto w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

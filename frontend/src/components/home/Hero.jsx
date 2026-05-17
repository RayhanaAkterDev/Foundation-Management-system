import React from 'react';
import Button from '../common/Button';
import StatCard from '../common/StatCard';
import SectionHeading from '../common/SectionHeading';
import heroIllustration from '../../assets/images/home/heroIllustration.png';

// icons
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

const Hero = () => {
    return (
        <section
            aria-labelledby="hero-heading"
            className="bg-[#FCFBFD] bg-cover bg-bottom bg-no-repeat lg:bg-heroDesktop section-gap pt-20"
        >
            <div className="container-width">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    {/* text content */}
                    <div className="">
                        <SectionHeading
                            variant="hero"
                            headingTag="h1"
                            badge="Together, we create real change"
                            badgeIcon={TbHeartFilled}
                            title={
                                <>
                                    Connecting{' '}
                                    <span className="text-primary">care</span>
                                    <span className="block">
                                        and changing{' '}
                                        <span className="text-accent">
                                            lives
                                        </span>
                                    </span>
                                </>
                            }
                            description={
                                <>
                                    A platform where kindness becomes action
                                    <span className="block">
                                        through smart donation and volunteer
                                        coordination.
                                    </span>
                                </>
                            }
                        />

                        {/* CTA buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-start items-start">
                            <Button className="w-full sm:w-auto">
                                <TbHeartFilled />
                                Donate Now
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Learn More
                                <HiArrowSmRight className="mt-0.5" />
                            </Button>
                        </div>

                        {/* stats */}
                        <StatCard />
                    </div>

                    {/* mobile / tablet illustration */}
                    <div className="block lg:hidden">
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

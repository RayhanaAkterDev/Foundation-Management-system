import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { TbWorld } from 'react-icons/tb';
import SectionHeading from '@/components/SectionHeading';

const BrowseCTA = () => {
    return (
        <section className="relative section-gap overflow-hidden">
            {/* subtle directional background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
                <div className="absolute -bottom-32 -right-25 w-100 h-100 bg-primary/10 blur-3xl rounded-full" />
            </div>

            <div className="container-width relative z-10">
                {/* centered minimal header */}
                <div className="text-center max-w-2xl mx-auto">
                    <TbWorld className="mx-auto text-4xl text-primary mb-5 opacity-90" />

                    <SectionHeading
                        title="Explore all verified campaigns"
                        headingSize="sectionHero"
                        description="Search, filter, and discover real needs — everything is structured for clarity and trust."
                        descriptionSize="hero"
                    />
                </div>

                {/* split CTA row (different feel than cards) */}
                <div className="mt-14 flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link to="/campaigns">
                        <Button className="px-10 py-3 text-base">
                            Enter Campaign Explorer
                        </Button>
                    </Link>

                    <Link to="/campaigns?filter=urgent">
                        <button className="text-sm text-muted hover:text-primary transition">
                            View urgent needs →
                        </button>
                    </Link>
                </div>

                {/* subtle trust line */}
                <p className="text-center text-xs text-muted mt-6">
                    Transparent listings • Verified requests • Real-time updates
                </p>
            </div>
        </section>
    );
};

export default BrowseCTA;

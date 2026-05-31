import React from 'react';
import Button from '@/components/Button';

const TrustBanner = () => {
    return (
        <div
            className="h-full
                rounded-4xl
                border border-border
                bg-surface
                p-6 md:p-10
                flex flex-col justify-center
                gap-6
            "
        >
            <div>
                <span className="text-xs uppercase tracking-[0.25em] text-primary">
                    Take Action
                </span>

                <h3 className="mt-3 text-xl md:text-2xl lg:text-3xl font-semibold">
                    Help someone today with confidence
                </h3>

                <p className="mt-3 text-sm md:text-base text-text-secondary max-w-xl">
                    Every verified request and impact update ensures
                    transparency in how support is delivered.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full ">
                <Button className="w-full sm:w-auto" variant="accent">
                    Donate Now
                </Button>

                <Button className="w-full sm:w-auto" variant="outline">
                    Join as Volunteer
                </Button>
            </div>
        </div>
    );
};

export default TrustBanner;

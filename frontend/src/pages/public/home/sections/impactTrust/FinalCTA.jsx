import React from 'react';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

const FinalCTA = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-end pt-8 md:pt-10 lg:pt-12">
            {/* Left content */}
            <div className="md:col-span-7">
                <p className="mb-3 text-sm text-text-secondary">
                    Every request is verified before support is delivered
                </p>

                <SectionHeading
                    align="left"
                    gap="sm"
                    title="Ready to help someone real today?"
                    headingClass="text-primary"
                    description="Your support goes directly to verified individuals and communities in need. No intermediaries. No uncertainty."
                />
            </div>

            {/* Right actions */}
            <div className="md:col-span-5 flex md:justify-end">
                <div className="flex flex-col sm:flex-row md:flex-col gap-4 w-full md:w-auto">
                    <Button size="lg" className="w-full md:w-auto">
                        Browse Causes
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full md:w-auto"
                    >
                        Make a Donation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FinalCTA;

import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';

import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

const BePartOfChange = () => {
    return (
        <div className="container-width py-24 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
                <SectionHeading
                    gap="md"
                    align="center"
                    badge="Join the movement"
                    badgeClass="badge-primary"
                    title={
                        <>
                            Together, we can bring hope
                            <br className="hidden md:block" /> to communities
                            that need it most
                        </>
                    }
                    description="Every donation, volunteer effort, and shared act of kindness helps someone feel seen, supported, and cared for."
                />

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button className="w-full sm:w-auto">
                        <TbHeartFilled />
                        Donate Now
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        Join as Volunteer
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>

                {/* trust text */}
                <p className="mt-8 text-sm italic text-primary-hover">
                    Every contribution helps build stronger and more
                    compassionate communities.
                </p>
            </div>
        </div>
    );
};

export default BePartOfChange;

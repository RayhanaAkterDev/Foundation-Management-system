import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

const BePartOfChange = () => {
    return (
        <section className="section-gap">
            <div className="container-width">
                <SectionHeading
                    gap="sm"
                    align="left"
                    title="Be part of the Change"
                    headingClass="text-primary"
                    description="Your support today can create a better tomorrow. Join us in building stronger, kinder communities"
                />

                {/* cta buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-start items-start mt-8">
                    <Button className="w-full sm:w-auto">
                        Donate Now
                        <TbHeartFilled />
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        Join as Volunteer
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default BePartOfChange;

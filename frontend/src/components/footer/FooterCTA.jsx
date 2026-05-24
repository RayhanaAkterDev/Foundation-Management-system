import React from 'react';
import {
    TbFlameFilled,
    TbHeartFilled,
    TbHomeHeart,
    TbUsers,
    TbCalendarEvent,
    TbHeartHandshake,
} from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';
import Button from '../../components/common/Button';

const FooterCTA = () => {
    return (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-5">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />

                    <p className="text-sm font-medium tracking-[0.14em] text-accent">
                        CARELINK COMMUNITY
                    </p>
                </div>

                <h3 className="max-w-xl text-[2rem] font-semibold leading-tight tracking-tight text-primary">
                    Help organizations create coordinated and meaningful
                    community impact.
                </h3>

                <p className="max-w-2xl text-[15.5px] leading-[1.75] text-text-secondary">
                    Organize donations, volunteers, and campaigns through one
                    structured platform built for modern foundations and social
                    initiatives.
                </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Button className="w-full sm:w-auto">
                    <TbHeartFilled size={18} />
                    Donate Now
                </Button>

                <Button variant="outline" className="w-full sm:w-auto">
                    Learn More
                    <HiArrowSmRight className="mt-0.5" />
                </Button>
            </div>
        </div>
    );
};

export default FooterCTA;

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
import Button from '../frontend/src/components/common/Button';

const FooterCTA = () => {
    return (
       <div className="border-t border-border/40 pt-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

                    <div className="max-w-2xl space-y-3">
                        <h3 className="text-xl font-semibold text-primary">
                            Be part of coordinated community impact.
                        </h3>

                        <p className="text-text-secondary text-[15px] leading-[1.7]">
                            Join CareLink as a donor, volunteer, or organization and help turn scattered efforts into real outcomes.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button>
                            <TbHeartFilled size={18} />
                            Join Mission
                        </Button>

                        <Button variant="outline">
                            Learn More
                        </Button>
                    </div>

                </div>
    );
};

export default FooterCTA;

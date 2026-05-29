import React from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';
import Button from '@/components/Button';

const DonationCard = () => {
    return (
        <div className="relative mx-auto -mt-24 lg:absolute lg:-bottom-14 lg:right-10 lg:mt-0 lg:w-110">
            <div className="rounded-4xl border border-border bg-surface/95 p-8 shadow-2xl backdrop-blur-xl">
                {/* progress */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-sm font-medium text-text-secondary">
                            Campaign Progress
                        </p>

                        <h3 className="mt-4 text-5xl font-bold tracking-tight text-primary">
                            $12.5K
                        </h3>

                        <p className="mt-2 text-text-secondary">
                            raised of $20,000 goal
                        </p>
                    </div>

                    <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center">
                        <h4 className="text-2xl font-bold text-primary">62%</h4>
                        <p className="mt-1 text-xs text-text-secondary">
                            funded
                        </p>
                    </div>
                </div>

                {/* progress bar */}
                <div className="mt-8">
                    <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                        <div className="h-full w-[62%] rounded-full bg-primary" />
                    </div>

                    <p className="mt-4 text-sm text-text-secondary leading-6">
                        5 days left to deliver emergency food, clean water, and
                        medical supplies.
                    </p>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Button className="w-full sm:flex-1">
                        <TbHeartFilled />
                        Donate Now
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        View
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>

                {/* trust strip */}
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-sm text-text-secondary">
                    <span>Verified requests</span>
                    <span>$1.2M distributed</span>
                    <span>Avg response: 2h</span>
                </div>
            </div>
        </div>
    );
};

export default DonationCard;

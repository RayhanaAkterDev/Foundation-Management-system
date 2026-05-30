import React from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';
import Button from '@/components/Button';
import Motion from '@/components/motion/Motion';
import ProgressBar from './ProgressBar';
import WaveProgressIndicator from './WaveProgressIndicator/WaveProgressIndicator';

const DonationCard = () => {
    return (
        <Motion
            variant="softLift"
            className="relative mx-auto -mt-24 lg:absolute lg:-bottom-14 lg:right-10 lg:mt-0 lg:w-110"
            transition={{
                duration: 0.6,
            }}
            whileHover={{
                y: -5,
            }}
        >
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

                    {/* water progress indicator */}
                    <WaveProgressIndicator />
                </div>

                {/* progress bar */}
                <ProgressBar value={62} />

                {/* CTA */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Button className="w-full sm:flex-1">
                        <TbHeartFilled />
                        Donate Now
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        View Details
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>

                {/* trust strip */}
                <Motion variant="fadeIn">
                    <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-sm text-text-secondary">
                        <span>Verified requests</span>
                        <span>$1.2M distributed</span>
                        <span>Avg response: 2h</span>
                    </div>
                </Motion>
            </div>
        </Motion>
    );
};

export default DonationCard;

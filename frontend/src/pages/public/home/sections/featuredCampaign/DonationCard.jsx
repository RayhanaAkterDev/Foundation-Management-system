import React from 'react';
import {
    TbHeartFilled,
    TbCalendar,
    TbMapPin,
    TbUsers,
    TbShieldCheck,
} from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Motion from '@/components/motion/Motion';

import ProgressBar from './ProgressBar';
import WaveProgressIndicator from './WaveProgressIndicator/WaveProgressIndicator';

const DonationCard = ({ campaign }) => {
    // fallback ONLY (unchanged design)
    const data = campaign || {
        id: 101,
        location: 'Khulna',
        daysLeft: 5,
        raised: 12500,
        progress: 62,
        targetAmount: 20000,
        supporters: 132,
        urgency: 'urgent',
    };

    const isUrgent = data.urgency === 'urgent' || data.urgency === 'critical';

    return (
        <Motion
            variant="softLift"
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="
                relative mx-auto w-full
                md:max-w-md
                z-20

                md:absolute md:-bottom-25 xl:-bottom-15 md:right-10 xl:right-20
            "
        >
            <div
                className="
                    overflow-hidden
                    rounded-[30px]
                    border border-white/60
                    bg-white/95
                    backdrop-blur-2xl
                    shadow-[0_35px_120px_-40px_rgba(15,23,42,0.55)]

                    p-4 sm:p-5 md:p-6
                "
            >
                {/* STATUS */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="urgent" tone="soft" dot pulse>
                            {isUrgent ? 'Urgent' : 'Active'}
                        </Badge>

                        <Badge variant="primary" tone="soft" icon={TbMapPin}>
                            {data.location}
                        </Badge>
                    </div>

                    <Badge
                        variant="default"
                        tone="soft"
                        icon={TbCalendar}
                        className="border-none text-text-secondary"
                    >
                        {data.daysLeft} Days Left
                    </Badge>
                </div>

                {/* FUNDING */}
                <div className="mt-6 sm:mt-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-text-secondary">
                                Relief Fund
                            </p>

                            <h2 className="mt-1 sm:mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
                                ৳{data.raised?.toLocaleString()}
                            </h2>

                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-text-secondary">
                                Raised for emergency relief
                            </p>
                        </div>

                        <div className="hidden xs:block sm:scale-90">
                            <WaveProgressIndicator value={data.progress || 0} />
                        </div>
                    </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-4 sm:mt-5">
                    <div className="mb-2 flex items-center justify-between text-[10px] sm:text-xs text-text-secondary">
                        <span>Funding Progress</span>
                        <span className="font-semibold text-primary">
                            {data.progress}% Reached
                        </span>
                    </div>

                    <ProgressBar value={data.progress || 0} />

                    <p className="mt-2 text-[10px] sm:text-xs text-text-secondary">
                        Goal: ৳{data.targetAmount?.toLocaleString()}
                    </p>
                </div>

                {/* IMPACT */}
                <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <TbUsers size={18} className="shrink-0 text-primary" />

                        <span className="text-sm font-medium text-text-primary">
                            {data.supporters} Families Supported
                        </span>
                    </div>

                    <span className="text-[11px] sm:text-xs font-medium text-primary">
                        Ongoing Relief
                    </span>
                </div>

                {/* CTA */}
                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                    <Link to={`/donate/${data.id}`} className="flex-1">
                        <Button className="w-full justify-center">
                            <TbHeartFilled />
                            Donate Now
                        </Button>
                    </Link>

                    {/* ONLY FIX: correct route */}
                    <Link to={`/campaign/${data.id}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full justify-center"
                        >
                            View Details
                            <HiArrowSmRight className="mt-0.5" />
                        </Button>
                    </Link>
                </div>

                {/* TRUST */}
                <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-[10px] sm:text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                        <TbShieldCheck size={14} />
                        <span>Verified</span>
                    </div>

                    <span>•</span>
                    <span>Live Updates</span>
                    <span>•</span>
                    <span>Transparent Tracking</span>
                </div>
            </div>
        </Motion>
    );
};

export default DonationCard;

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import {
    TbClock,
    TbHeartHandshake,
    TbLockCheck,
    TbShieldCheckFilled,
    TbShare,
    TbUsers,
} from 'react-icons/tb';

const DonationSidebar = ({ campaign, organizer }) => {
    const percent = Math.min(100, Math.max(0, campaign?.progress || 0));

    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (percent / 100) * circumference;

    return (
        <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
                {/* HERO */}
                <div className="relative overflow-hidden bg-primary text-white">
                    <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-white/5" />

                    <div className="relative p-8">
                        <h3 className="text-xl font-semibold">
                            Make a Difference Today
                        </h3>

                        <p className="mt-2 text-sm text-white/75 leading-relaxed">
                            Your support helps deliver food, relief, and
                            emergency aid.
                        </p>

                        {/* PROGRESS */}
                        <div className="mt-7 flex justify-center">
                            <div className="relative h-36 w-36">
                                <svg
                                    className="h-full w-full -rotate-90"
                                    viewBox="0 0 140 140"
                                >
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        fill="none"
                                        stroke="rgba(255,255,255,.18)"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">
                                        {percent}%
                                    </span>
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                                        Funded
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AMOUNT */}
                        <div className="mt-6 text-center">
                            <div className="text-5xl font-black tracking-tight">
                                ${campaign?.raised?.toLocaleString() || 0}
                            </div>

                            <div className="mt-2 text-sm text-white/75">
                                raised of $
                                {campaign?.targetAmount?.toLocaleString() || 0}
                            </div>
                        </div>

                        {/* META */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <TbUsers size={16} />
                                <span>
                                    {campaign?.supporters || 0} supporters
                                </span>
                            </div>

                            <div className="h-4 w-px bg-white/20" />

                            <div className="flex items-center gap-2">
                                <TbClock size={16} />
                                <span>{campaign?.daysLeft || 0} days left</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DONATION */}
                <div className="p-8 pt-0">
                    <button className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
                        <TbShare size={16} />
                        Share Campaign
                    </button>

                    {/* CTA */}
                    <Link to={`/donate/${campaign.id}`}>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-5 h-14 w-full text-base font-bold"
                        >
                            Donate Now
                        </Button>
                    </Link>

                    <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                        <TbLockCheck size={16} />
                        Secure encrypted payment processing
                    </div>
                </div>

                {/* TRUST */}
                <div className="border-t border-border p-8">
                    <h4 className="mb-4 text-lg font-bold">Trust & Safety</h4>

                    <div className="space-y-4 text-sm text-text-secondary">
                        <div className="flex items-start gap-3">
                            <TbShieldCheckFilled className="mt-0.5 text-primary" />
                            <span>Verified campaign with fraud checks.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbLockCheck className="mt-0.5 text-primary" />
                            <span>End-to-end encrypted payments.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbHeartHandshake className="mt-0.5 text-primary" />
                            <span>Funds go directly to relief operations.</span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-5 text-xs text-text-secondary">
                        Organized by{' '}
                        <span className="font-medium text-text-primary">
                            {organizer?.name || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DonationSidebar;

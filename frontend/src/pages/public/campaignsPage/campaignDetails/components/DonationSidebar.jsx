import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbClock,
    TbHeartHandshake,
    TbLockCheck,
    TbShare,
    TbShieldCheckFilled,
    TbUsers,
    TbArrowUpRight,
} from 'react-icons/tb';

const bn = (value) => Number(value || 0).toLocaleString('bn-BD');

const DonationSidebar = ({ campaign, organizer }) => {
    const raised = Number(campaign?.raised || 0);
    const target = Number(campaign?.targetAmount || 0);
    const percent =
        target > 0
            ? Math.min(100, Math.max(0, (raised / target) * 100))
            : Math.min(100, Math.max(0, Number(campaign?.progress || 0)));
    const supporters = Number(campaign?.supporters || 0);
    const daysLeft = Number(campaign?.daysLeft || 0);

    const shareCampaign = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: campaign?.title || 'মানবিক উদ্যোগ',
                    url,
                });
                return;
            } catch (error) {
                if (error?.name === 'AbortError') return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error('লিংক কপি করা যায়নি:', error);
        }
    };

    return (
        <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-background-alt/60 p-5 sm:p-7 lg:p-6 xl:p-8">
                <div className="flex items-center justify-between gap-3">
                    <span className="font-bengali text-xs font-semibold text-primary">
                        অনুদান সংগ্রহের অগ্রগতি
                    </span>
                    <span className="font-bengali text-sm font-semibold text-primary">
                        {bn(Math.round(percent))}%
                    </span>
                </div>

                <div className="mt-7">
                    <p className="font-bengali text-xs text-text-secondary">
                        এখন পর্যন্ত সংগ্রহ হয়েছে
                    </p>
                    <strong className="mt-2 block break-words text-[clamp(2rem,3vw,2.9rem)] font-semibold leading-tight tracking-tight text-text-primary">
                        ৳{bn(raised)}
                    </strong>
                    <p className="mt-3 font-bengali text-sm text-text-secondary">
                        লক্ষ্যমাত্রা{' '}
                        <span className="font-semibold text-text-primary">
                            ৳{bn(target)}
                        </span>
                    </p>
                </div>

                <div
                    className="mt-6 h-1.5 overflow-hidden bg-border"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percent)}
                    aria-label="অনুদান সংগ্রহের অগ্রগতি"
                >
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 border-y border-border py-5">
                    <div className="min-w-0 border-r border-border pr-3">
                        <TbUsers size={21} className="text-primary" />
                        <strong className="mt-3 block text-2xl text-text-primary">
                            {bn(supporters)}
                        </strong>
                        <span className="mt-1 block font-bengali text-xs text-text-secondary">
                            সহায়তাকারী
                        </span>
                    </div>
                    <div className="min-w-0 pl-2">
                        <TbClock size={21} className="text-accent" />
                        <strong className="mt-3 block text-2xl text-text-primary">
                            {bn(daysLeft)}
                        </strong>
                        <span className="mt-1 block font-bengali text-xs text-text-secondary">
                            দিন বাকি
                        </span>
                    </div>
                </div>

                <p className="mt-6 font-bengali text-sm leading-7 text-text-secondary">
                    আপনার সহায়তা এই উদ্যোগের প্রয়োজনীয় কাজ এগিয়ে নিতে সাহায্য
                    করবে।
                </p>
                <Link
                    to={`/donate/${campaign.id}`}
                    className="group mt-5 flex min-h-13 w-full items-center justify-center gap-3 bg-primary px-4 font-bengali text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                    এখনই সহায়তা করুন
                    <TbArrowUpRight
                        size={20}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </Link>
                <p className="mt-3 flex items-center justify-center gap-2 font-bengali text-xs text-text-muted">
                    <TbLockCheck size={16} className="text-primary" /> নিরাপদ
                    পেমেন্ট প্রক্রিয়া
                </p>
                <button
                    type="button"
                    onClick={shareCampaign}
                    className="mx-auto mt-5 flex items-center gap-2 font-bengali text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
                >
                    <TbShare size={17} /> উদ্যোগটি শেয়ার করুন
                </button>
            </div>

            <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-accent" />
                    <h3 className="font-bengali text-sm font-semibold text-text-primary">
                        স্বচ্ছতা ও নিরাপত্তা
                    </h3>
                </div>
                <div className="mt-5 space-y-4 font-bengali text-sm leading-6 text-text-secondary">
                    <p className="flex items-start gap-3">
                        <TbShieldCheckFilled
                            size={19}
                            className="mt-0.5 shrink-0 text-primary"
                        />{' '}
                        উদ্যোগের তথ্য যাচাই করে সহায়তা করুন
                    </p>
                    <p className="flex items-start gap-3">
                        <TbLockCheck
                            size={19}
                            className="mt-0.5 shrink-0 text-primary"
                        />{' '}
                        নিরাপদ পেমেন্ট গেটওয়ে
                    </p>
                    <p className="flex items-start gap-3">
                        <TbHeartHandshake
                            size={19}
                            className="mt-0.5 shrink-0 text-primary"
                        />{' '}
                        আপনার সহায়তা মানবিক কার্যক্রমে অবদান রাখে
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
                <span className="font-bengali text-xs text-text-muted">
                    উদ্যোগ পরিচালনায়
                </span>
                <div className="mt-2 flex items-center gap-2">
                    <strong className="font-bengali text-sm font-semibold text-text-primary">
                        {organizer?.name || 'Stand For People'}
                    </strong>
                    {organizer?.verified && (
                        <TbShieldCheckFilled
                            size={17}
                            className="text-primary"
                            aria-label="যাচাইকৃত আয়োজক"
                        />
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DonationSidebar;

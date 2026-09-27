import { Link } from 'react-router-dom';

import { HiArrowSmRight, HiOutlineLocationMarker } from 'react-icons/hi';

import { FiClock, FiUsers } from 'react-icons/fi';

import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

export default function CampaignCard({ campaign }) {
    const imageUrl =
        campaign.image || campaign.cover_image || defaultCampaignImage;

    const raisedAmount = Number(
        campaign.raised ?? campaign.collected_amount ?? 0,
    );

    const progressPercent = Number(campaign.progress ?? 0);

    const supporterCount = Number(campaign.supporters ?? 0);

    const descriptionText =
        campaign.shortDescription || campaign.description || '';

    const location = campaign.location || campaign.district || '';

    const safeProgress = Math.min(100, Math.max(0, progressPercent));

    return (
        <Link to={`/campaign/${campaign.id}`} className="group block h-full">
            <article className="relative h-full">
                {/* IMAGE FRAME */}
                <div className="relative overflow-hidden">
                    <div className="aspect-[1.08/1] overflow-hidden bg-background-alt">
                        <img
                            src={imageUrl}
                            alt={campaign.title || 'Campaign'}
                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = defaultCampaignImage;
                            }}
                        />
                    </div>

                    {/* IMAGE TONE */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* CATEGORY */}
                    {campaign.category && (
                        <div className="absolute left-6 top-6">
                            <span className="font-bengali text-[10px] font-medium tracking-wide text-white">
                                {campaign.category}
                            </span>
                        </div>
                    )}

                    {/* DAYS */}
                    {campaign.daysLeft != null && (
                        <div className="absolute right-6 top-6 flex items-center gap-2 text-white">
                            <FiClock className="text-[12px]" />

                            <span className="font-bengali text-[10px]">
                                {campaign.daysLeft > 0
                                    ? `${campaign.daysLeft} দিন বাকি`
                                    : 'আজ শেষ'}
                            </span>
                        </div>
                    )}

                    {/* IMAGE INDEX */}
                    <div className="absolute bottom-5 left-6">
                        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/70">
                            Stand For People
                        </span>
                    </div>
                </div>

                {/* FLOATING SHEET */}
                <div className="relative z-10 -mt-12 ml-5 mr-5 bg-surface px-6 pb-6 pt-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                    {/* LOCATION */}
                    {location && (
                        <div className="mb-4 flex items-center gap-1.5">
                            <HiOutlineLocationMarker className="text-[14px] text-primary" />

                            <span className="font-bengali text-[10px] text-text-muted">
                                {location}
                            </span>
                        </div>
                    )}

                    {/* TITLE */}
                    <h3 className="font-bengali text-[22px] font-semibold leading-[1.48] tracking-[-0.025em] text-text-primary">
                        {campaign.title}
                    </h3>

                    {/* DESCRIPTION */}
                    {descriptionText && (
                        <p className="mt-3 line-clamp-2 max-w-[95%] font-bengali text-[12px] leading-[1.9] text-text-secondary">
                            {descriptionText}
                        </p>
                    )}

                    {/* DIVIDER */}
                    <div className="my-6 h-px bg-border" />

                    {/* FUNDING ROW */}
                    <div className="grid grid-cols-[1fr_auto] gap-5">
                        <div>
                            <span className="font-bengali text-[9px] uppercase tracking-[0.08em] text-text-muted">
                                সংগ্রহ হয়েছে
                            </span>

                            <div className="mt-1 text-[21px] font-semibold tracking-[-0.025em] text-text-primary">
                                ৳{raisedAmount.toLocaleString()}
                            </div>
                        </div>

                        <div className="border-l border-border pl-5">
                            <span className="font-bengali text-[9px] text-text-muted">
                                সহায়তাকারী
                            </span>

                            <div className="mt-1 flex items-center gap-1.5">
                                <FiUsers className="text-[12px] text-primary" />

                                <span className="text-[16px] font-semibold text-text-primary">
                                    {supporterCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <span className="font-bengali text-[10px] text-text-muted">
                                সহায়তার অগ্রগতি
                            </span>

                            <span className="text-[11px] font-semibold text-primary">
                                {safeProgress}%
                            </span>
                        </div>

                        <div className="mt-2 h-[3px] bg-background-alt">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{
                                    width: `${safeProgress}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* ACTION */}
                    <div className="mt-6 flex items-center justify-between">
                        <span className="font-bengali text-[11px] font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">
                            এই উদ্যোগ সম্পর্কে জানুন
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center bg-primary text-white transition-transform duration-300 group-hover:translate-x-1">
                            <HiArrowSmRight className="text-[17px]" />
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

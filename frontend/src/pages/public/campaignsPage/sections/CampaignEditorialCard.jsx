import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, HeartHandshake, MapPin } from 'lucide-react';
import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

const bn = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);
const money = (value) => `৳${bn(Number(value || 0).toLocaleString('en-BD'))}`;
const imageOf = (c) =>
    c.cover_image_url ||
    c.cover_image ||
    c.banner_url ||
    c.banner ||
    c.image_url ||
    c.image ||
    defaultCampaignImage;
const descriptionOf = (c) =>
    c.shortDescription || c.short_description || c.description || '';

function CampaignPhoto({ campaign, className = '' }) {
    return (
        <img
            src={imageOf(campaign)}
            alt={campaign.title || 'মানবিক উদ্যোগ'}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className}`}
            onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultCampaignImage;
            }}
        />
    );
}

function CampaignFunding({ raised, goal, progress, dark = false }) {
    return (
        <div>
            <div className="flex items-end justify-between gap-3">
                <div>
                    <p
                        className={`font-bengali text-xs ${dark ? 'text-white/65' : 'text-text-secondary'}`}
                    >
                        সংগৃহীত সহায়তা
                    </p>
                    <p
                        className={`mt-1 text-xl font-semibold ${dark ? 'text-white' : 'text-text-primary'}`}
                    >
                        {money(raised)}
                    </p>
                </div>
                {goal > 0 && (
                    <div className="text-right">
                        <p
                            className={`font-bengali text-xs ${dark ? 'text-white/65' : 'text-text-secondary'}`}
                        >
                            লক্ষ্যমাত্রা
                        </p>
                        <p
                            className={`mt-1 text-sm font-semibold ${dark ? 'text-white/90' : 'text-text-primary'}`}
                        >
                            {money(goal)}
                        </p>
                    </div>
                )}
            </div>
            {progress !== null && (
                <div className="mt-4">
                    <div
                        role="progressbar"
                        aria-label="অনুদানের অগ্রগতি"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                        className={`h-1.5 overflow-hidden rounded-full ${dark ? 'bg-white/20' : 'bg-[#dce7e2]'}`}
                    >
                        <div
                            className={`h-full rounded-full ${dark ? 'bg-[#fbbf24]' : 'bg-primary'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p
                        className={`mt-2 font-bengali text-xs ${dark ? 'text-white/70' : 'text-text-secondary'}`}
                    >
                        {bn(progress)}% সংগ্রহ হয়েছে
                    </p>
                </div>
            )}
        </div>
    );
}

export default function CampaignEditorialCard({
    campaign,
    index = 0,
    variant = 'featured',
}) {
    const raised = Number(campaign.raised ?? campaign.collected_amount ?? 0);
    const goal = Number(
        campaign.goal ??
            campaign.target ??
            campaign.target_amount ??
            campaign.goal_amount ??
            0,
    );
    const progress =
        goal > 0
            ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100)))
            : null;
    const description = descriptionOf(campaign);
    const location = campaign.location || campaign.district || '';
    const days = campaign.daysLeft ?? null;
    const href = `/campaign/${campaign.id}`;

    // Featured: magazine-style horizontal story. No traditional image-on-top campaign card.
    if (variant === 'featured')
        return (
            <Link
                to={href}
                className="group block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
                <article className="grid h-full min-h-[310px] min-w-0 overflow-hidden border border-[#dce5e1] bg-white transition-colors hover:border-primary/40 sm:grid-cols-[42%_58%]">
                    <div className="relative min-h-[210px] overflow-hidden bg-[#dce7e2] sm:min-h-full">
                        <CampaignPhoto campaign={campaign} />
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-5 pt-16">
                            {location && (
                                <span className="flex items-center gap-1.5 font-bengali text-xs text-white">
                                    <MapPin size={13} />
                                    {location}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col px-5 py-6 sm:px-6 sm:py-7">
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-bengali text-xs font-semibold text-primary">
                                {campaign.category || 'নির্বাচিত উদ্যোগ'}
                            </span>
                            <span className="font-bengali text-xs text-text-muted">
                                {bn(String(index + 1).padStart(2, '0'))}
                            </span>
                        </div>
                        <h3 className="mt-4 line-clamp-3 font-bengali text-xl font-semibold leading-[1.5] text-text-primary transition-colors group-hover:text-primary sm:text-[22px]">
                            {campaign.title}
                        </h3>
                        {description && (
                            <p className="mt-3 line-clamp-2 font-bengali text-[13px] leading-6 text-text-secondary">
                                {description}
                            </p>
                        )}
                        <div className="mt-auto pt-6">
                            <CampaignFunding
                                raised={raised}
                                goal={goal}
                                progress={progress}
                            />
                            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                                <span className="font-bengali text-sm font-semibold text-primary">
                                    উদ্যোগটি দেখুন
                                </span>
                                <ArrowUpRight
                                    size={19}
                                    className="text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );

    // Urgent: dark, compact response brief with image on the side, not a card grid clone.
    if (variant === 'urgent')
        return (
            <Link
                to={href}
                className="group block h-full min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
                <article className="flex h-full min-w-0 flex-col overflow-hidden bg-[#153f3b] text-white transition-colors hover:bg-[#194c46]">
                    <div className="grid min-h-[190px] grid-cols-[1fr_39%] sm:min-h-[205px]">
                        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
                            <div className="flex items-center gap-2 font-bengali text-xs font-semibold text-[#ffd08a]">
                                <Clock3 size={15} />
                                {days == null
                                    ? 'দ্রুত সহায়তা প্রয়োজন'
                                    : days > 0
                                      ? `আর ${bn(days)} দিন বাকি`
                                      : 'জরুরি সহায়তা'}
                            </div>
                            <h3 className="mt-5 line-clamp-4 font-bengali text-xl font-semibold leading-[1.5] text-white sm:text-[23px]">
                                {campaign.title}
                            </h3>
                            <p className="mt-4 font-bengali text-xs text-white/65">
                                {campaign.category || 'মানবিক সহায়তা'}
                            </p>
                        </div>
                        <div className="relative overflow-hidden bg-[#235b51]">
                            <CampaignPhoto campaign={campaign} />
                            <div className="absolute inset-0 bg-[#153f3b]/10" />
                        </div>
                    </div>
                    <div className="mt-auto border-t border-white/15 px-5 py-5 sm:px-6">
                        <CampaignFunding
                            raised={raised}
                            goal={goal}
                            progress={progress}
                            dark
                        />
                        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                            <span className="flex items-center gap-2 font-bengali text-sm font-semibold text-white">
                                <HeartHandshake size={17} /> পাশে দাঁড়ান
                            </span>
                            <ArrowUpRight
                                size={20}
                                className="text-[#ffd08a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                            />
                        </div>
                    </div>
                </article>
            </Link>
        );

    // Donate hub: compact image-left list item, distinct from both standalone pages.
    return (
        <Link
            to={href}
            className="group block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
            <article className="grid min-w-0 grid-cols-[112px_minmax(0,1fr)] gap-4 border-b border-border py-5 sm:grid-cols-[135px_minmax(0,1fr)] sm:gap-5">
                <div className="aspect-square overflow-hidden bg-[#e3ebe6]">
                    <CampaignPhoto campaign={campaign} />
                </div>
                <div className="flex min-w-0 flex-col justify-between">
                    <div>
                        <p className="font-bengali text-xs font-semibold text-primary">
                            {campaign.category || 'নির্বাচিত উদ্যোগ'}
                        </p>
                        <h3 className="mt-2 line-clamp-2 font-bengali text-[16px] font-semibold leading-6 text-text-primary group-hover:text-primary">
                            {campaign.title}
                        </h3>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-text-primary">
                            {money(raised)}
                        </span>
                        <ArrowUpRight
                            size={17}
                            className="shrink-0 text-primary"
                        />
                    </div>
                    {progress !== null && (
                        <div className="mt-2 h-1 overflow-hidden bg-[#e0eae5]">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

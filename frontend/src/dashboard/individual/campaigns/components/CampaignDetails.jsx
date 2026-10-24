import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    HandHeart,
    HeartHandshake,
    ImageOff,
    MapPin,
    ShieldCheck,
    Target,
    UsersRound,
} from 'lucide-react';

import { apiRequest } from '@/api/client';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';

import DonationModal from './DonationModal/DonationModal';

const BASE = '/individual/dashboard/campaigns';

const money = (value) =>
    `৳${Math.max(0, Number(value) || 0).toLocaleString('en-BD')}`;

const date = (value) => {
    if (!value) return 'Not specified';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Not specified';

    return parsed.toLocaleDateString('en-BD', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const display = (value, fallback = 'Not specified') => {
    if (value == null || value === '') return fallback;
    return String(value);
};

const categoryName = (category) =>
    typeof category === 'string'
        ? category
        : category?.name || 'Humanitarian campaign';

const getImage = (campaign) =>
    campaign?.cover_photo ||
    campaign?.cover_image_url ||
    campaign?.cover_image ||
    campaign?.banner ||
    campaign?.image_url ||
    campaign?.image ||
    campaign?.photo ||
    null;

function DetailItem({ icon: Icon, label, value }) {
    return (
        <div className="flex min-w-0 items-start gap-3 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#202B38] text-[#9CACBE]">
                <Icon size={17} strokeWidth={1.7} />
            </span>

            <div className="min-w-0">
                <p className="font-sans! text-[11px] text-[#8795A5]!">
                    {label}
                </p>
                <p className="mt-1 wrap-break-word font-sans! text-[13px] font-medium! leading-6 text-[#E1E8EF]!">
                    {display(value)}
                </p>
            </div>
        </div>
    );
}

function CampaignHero({ campaign, onDonate }) {
    const [imageFailed, setImageFailed] = useState(false);
    const image = getImage(campaign);

    return (
        <section className="overflow-hidden rounded-[9px] border border-[#303A47] bg-[#151C25]">
            <div className="relative isolate flex min-h-[290px] flex-col justify-end overflow-hidden bg-[#202B38] sm:min-h-[360px] lg:min-h-[420px]">
                {image && !imageFailed ? (
                    <img
                        src={image}
                        alt={campaign.title || 'Campaign cover'}
                        onError={() => setImageFailed(true)}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageOff
                            size={40}
                            strokeWidth={1.3}
                            className="text-[#8191A2]"
                        />
                    </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080D14] via-[#080D14]/65 to-[#080D14]/10" />

                <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-5 sm:p-7">
                    <span className="max-w-[70%] truncate rounded-[4px] border border-white/20 bg-[#10161F]/75 px-3 py-1.5 font-sans! text-[11px] font-medium! text-white! backdrop-blur-sm">
                        {categoryName(campaign.category)}
                    </span>

                    <div className="[&_span]:border-white/20! [&_span]:bg-[#10161F]/75! [&_span]:text-white!">
                        <StatusBadge status={campaign.status} />
                    </div>
                </div>

                <div className="relative z-10 max-w-[850px] px-5 pb-7 pt-24 sm:px-8 sm:pb-9">
                    <p className="mb-3 font-sans! text-[11px] font-semibold! uppercase tracking-[0.16em] text-[#C4D8D5]!">
                        Stand For People / Campaign
                    </p>

                    <h1 className="font-sans! text-[24px] font-semibold! leading-[1.4] tracking-[-0.025em] text-white! sm:text-[30px] lg:text-[35px]">
                        {campaign.title || 'Untitled campaign'}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[#D1DBE5]">
                        {campaign.location && (
                            <span className="flex items-center gap-2 font-sans! text-[12px] text-[#D1DBE5]!">
                                <MapPin size={14} />
                                {campaign.location}
                            </span>
                        )}

                        {campaign.end_date && (
                            <span className="flex items-center gap-2 font-sans! text-[12px] text-[#D1DBE5]!">
                                <CalendarDays size={14} />
                                Ends {date(campaign.end_date)}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onDonate}
                        className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-[5px] bg-[#D5E1E8] px-5 py-3 font-sans! text-[12px] font-semibold! text-[#17232F]! transition-colors hover:bg-white"
                    >
                        <HandHeart size={17} />
                        Donate to this campaign
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}

function FundingPanel({ campaign, onDonate }) {
    const target = Math.max(Number(campaign.target_amount) || 0, 0);
    const raised = Math.max(Number(campaign.collected_amount) || 0, 0);
    const remaining = Math.max(target - raised, 0);
    const percentage =
        target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;

    return (
        <section className="overflow-hidden rounded-[8px] border border-[#344150] bg-[#19232D]">
            <div className="px-5 pt-6 pb-5 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                    <p className="font-sans! text-[11px] font-semibold! uppercase tracking-[0.12em] text-[#A5C6BB]!">
                        Fundraising progress
                    </p>
                    <Target size={18} className="text-[#9DB8B1]" />
                </div>

                <p className="mt-6 font-sans! text-[12px] text-[#9BAABB]!">
                    Total raised
                </p>

                <p className="mt-1 font-sans! text-[30px] font-semibold! tracking-tight text-[#F0F4F8]!">
                    {money(raised)}
                </p>

                <p className="mt-1 font-sans! text-[12px] text-[#9BAABB]!">
                    of {money(target)} funding goal
                </p>

                <div
                    className="mt-6 h-[8px] overflow-hidden rounded-full bg-[#344352]"
                    role="progressbar"
                    aria-label="Campaign funding progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                >
                    <div
                        className="h-full rounded-full bg-[#8ABDAC] transition-[width] duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="font-sans! text-[12px] font-semibold! text-[#B2D7C9]!">
                        {percentage}% funded
                    </span>

                    <span className="font-sans! text-[11px] text-[#A2B0BE]!">
                        {target <= 0
                            ? 'No funding target'
                            : remaining > 0
                              ? `${money(remaining)} remaining`
                              : 'Goal achieved'}
                    </span>
                </div>
            </div>

            <div className="border-t border-[#344150] bg-[#151C25] px-5 py-5 sm:px-6">
                <p className="font-sans! text-[15px] font-semibold! text-[#EEF1F5]!">
                    Make a difference today
                </p>

                <p className="mt-2 font-sans! text-[12px] leading-[1.8] text-[#A2B0BE]!">
                    Your contribution helps support this campaign and the
                    communities it serves.
                </p>

                <button
                    type="button"
                    onClick={onDonate}
                    className="mt-5 flex min-h-[49px] w-full items-center justify-between gap-3 rounded-[6px] bg-[#D5E1E8] px-4 py-3 font-sans! text-[12px] font-semibold! text-[#17232F]! transition-colors hover:bg-[#F0F5F8]"
                >
                    <span className="flex items-center gap-2">
                        <HandHeart size={17} />
                        Donate now
                    </span>
                    <ArrowRight size={17} />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-[#A4C5B9]" />
                    <span className="font-sans! text-[10px] text-[#93A3B4]!">
                        Secure checkout through SSLCOMMERZ
                    </span>
                </div>
            </div>
        </section>
    );
}

function CampaignInformation({ campaign }) {
    const organization =
        campaign.organization?.name || campaign.organization_name || null;

    return (
        <section className="rounded-[8px] border border-[#303A47] bg-[#151C25] px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#253442] text-[#B5C6D6]">
                    <UsersRound size={18} />
                </span>

                <div>
                    <h2 className="font-sans! text-[16px] font-semibold! text-[#EEF1F5]!">
                        Campaign information
                    </h2>
                    <p className="mt-1 font-sans! text-[11px] text-[#91A0B0]!">
                        Details about this initiative
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 divide-y divide-[#303A47] sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
                <DetailItem
                    icon={HeartHandshake}
                    label="Category"
                    value={categoryName(campaign.category)}
                />
                <DetailItem
                    icon={MapPin}
                    label="Location"
                    value={campaign.location || campaign.district}
                />
                <DetailItem
                    icon={CalendarDays}
                    label="Campaign started"
                    value={date(campaign.start_date)}
                />
                <DetailItem
                    icon={Clock3}
                    label="Campaign deadline"
                    value={
                        campaign.end_date
                            ? date(campaign.end_date)
                            : 'No fixed deadline'
                    }
                />
                {organization && (
                    <DetailItem
                        icon={UsersRound}
                        label="Organized by"
                        value={organization}
                    />
                )}
                {campaign.affected_areas && (
                    <DetailItem
                        icon={MapPin}
                        label="Affected areas"
                        value={campaign.affected_areas}
                    />
                )}
            </div>
        </section>
    );
}

function CampaignAbout({ campaign }) {
    return (
        <section className="min-w-0 rounded-[8px] border border-[#303A47] bg-[#151C25] px-5 py-7 sm:px-8 sm:py-9">
            <div className="flex items-center gap-3">
                <span className="h-6 w-[3px] rounded-full bg-[#91BCAF]" />
                <div>
                    <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.14em] text-[#91BCAF]!">
                        The cause
                    </p>
                    <h2 className="mt-1 font-sans! text-[21px] font-semibold! tracking-tight text-[#EEF1F5]!">
                        About this campaign
                    </h2>
                </div>
            </div>

            <div className="mt-7 max-w-[850px]">
                <p className="wrap-break-word whitespace-pre-line font-sans! text-[14px] leading-[2] text-[#C5D0DB]!">
                    {campaign.description ||
                        'No campaign description has been provided.'}
                </p>
            </div>
        </section>
    );
}

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState({
        loading: true,
        error: '',
        campaign: null,
    });
    const [retryKey, setRetryKey] = useState(0);
    const [donationOpen, setDonationOpen] = useState(false);

    useEffect(() => {
        let active = true;

        const loadCampaign = async () => {
            try {
                const response = await apiRequest('/campaigns');

                if (!active) return;

                const records = Array.isArray(response?.campaigns)
                    ? response.campaigns
                    : [];

                const selected = records.find(
                    (item) => String(item.id) === String(id),
                );

                setState({
                    loading: false,
                    error: '',
                    campaign: selected || null,
                });
            } catch (error) {
                if (!active) return;

                setState({
                    loading: false,
                    error: error?.message || 'Unable to load campaign details.',
                    campaign: null,
                });
            }
        };

        loadCampaign();

        return () => {
            active = false;
        };
    }, [id, retryKey]);

    const retry = () => {
        setState({
            loading: true,
            error: '',
            campaign: null,
        });
        setRetryKey((current) => current + 1);
    };

    const { campaign, loading, error } = state;

    const header = (
        <PageHeader
            title="Campaign details"
            subtitle="Learn about this campaign, explore its progress, and support the cause."
            action={
                <button
                    type="button"
                    onClick={() => navigate(BASE)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-[5px] border border-[#343E4B] bg-[#151C25] px-4 font-sans! text-[12px] font-medium! text-[#C8D2DD]! transition-colors hover:bg-[#202B38]"
                >
                    <ArrowLeft size={15} />
                    Back to campaigns
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10">
                {header}
                <LoadingUI
                    variant="page"
                    title="Loading campaign details..."
                    description="Retrieving the campaign information."
                />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-w-0 space-y-6 pb-10">
                {header}
                <LoadingError
                    title={
                        error ? 'Unable to load campaign' : 'Campaign not found'
                    }
                    message={
                        error ||
                        'This campaign may have been removed or is no longer available.'
                    }
                    onRetry={retry}
                />
            </div>
        );
    }

    return (
        <>
            <div className="min-w-0 space-y-6 pb-10">
                {header}

                <CampaignHero
                    key={campaign.id}
                    campaign={campaign}
                    onDonate={() => setDonationOpen(true)}
                />

                <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_365px]">
                    <main className="min-w-0 space-y-6">
                        <CampaignAbout campaign={campaign} />
                        <CampaignInformation campaign={campaign} />
                    </main>

                    <aside className="min-w-0 space-y-5 lg:sticky lg:top-6">
                        <FundingPanel
                            campaign={campaign}
                            onDonate={() => setDonationOpen(true)}
                        />

                        <div className="flex items-start gap-3 rounded-[7px] border border-[#303A47] bg-[#111821] px-4 py-4">
                            <CheckCircle2
                                size={17}
                                className="mt-0.5 shrink-0 text-[#9BBFB3]"
                            />
                            <p className="font-sans! text-[11px] leading-[1.8] text-[#9BAABB]!">
                                Review the campaign information before donating.
                                Payments are completed through the secure
                                payment gateway.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {donationOpen && (
                <DonationModal
                    campaign={campaign}
                    onClose={() => setDonationOpen(false)}
                />
            )}
        </>
    );
};

export default CampaignDetails;

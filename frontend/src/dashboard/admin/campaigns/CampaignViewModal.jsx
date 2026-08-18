import React from 'react';
import {
    X,
    MapPin,
    Tag,
    FileText,
    Hash,
    ShieldCheck,
    RefreshCw,
    CalendarDays,
    Building2,
    Target,
    Wallet,
    Globe2,
    Layers3,
    HeartHandshake,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const CampaignViewModal = ({ campaign, loading, error, onClose }) => {
    if (!campaign && !loading && !error) {
        return null;
    }

    // --------------------------------
    // Helpers
    // --------------------------------

    const formatDate = (date, includeTime = false) => {
        if (!date) {
            return 'Not provided';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Not provided';
        }

        return parsedDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(includeTime && {
                hour: 'numeric',
                minute: '2-digit',
            }),
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }

        return String(value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatMoney = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }

        return `৳${Number(value).toLocaleString()}`;
    };

    const getCampaignTypeLabel = (type) => {
        switch (type) {
            case 'local_help_request':
                return 'Local Help Request';

            case 'state_campaign':
                return 'State Campaign';

            case 'global_situation':
                return 'Global Situation';

            default:
                return formatValue(type);
        }
    };

    const getOrganizerName = () => {
        if (campaign?.organization?.name) {
            return campaign.organization.name;
        }

        if (campaign?.type === 'global_situation') {
            return 'Stand For People';
        }

        return 'Not assigned';
    };

    const getProgressPercentage = () => {
        const target = Number(campaign?.target_amount || 0);
        const collected = Number(campaign?.collected_amount || 0);

        if (!target || target <= 0) {
            return 0;
        }

        return Math.min((collected / target) * 100, 100);
    };

    const progressPercentage = getProgressPercentage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-[5px] sm:p-5">
            {/* Overlay */}

            <div
                className="absolute inset-0"
                onClick={!loading ? onClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.25)]">
                {/* --------------------------------
                    Header
                -------------------------------- */}

                <div className="relative shrink-0 overflow-hidden border-b border-border bg-white px-6 py-5 sm:px-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-teal-400 to-primary/30" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all hover:border-border hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="pr-12">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
                                <HeartHandshake size={17} strokeWidth={1.9} />
                            </span>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                    Campaign
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Campaign overview
                                </p>
                            </div>
                        </div>

                        <h2 className="mt-4 max-w-3xl text-[22px] font-bold leading-7 tracking-tight text-slate-900">
                            {campaign?.title || 'Campaign details'}
                        </h2>

                        {campaign && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {campaign.status && (
                                    <StatusBadge status={campaign.status} />
                                )}

                                {campaign.type && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600 ring-1 ring-inset ring-slate-200">
                                            <Globe2 size={12} />

                                            {getCampaignTypeLabel(
                                                campaign.type,
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --------------------------------
                    Content
                -------------------------------- */}

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#f1f6f5]">
                    {/* Loading */}

                    {loading && (
                        <div className="flex min-h-80 flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                            </div>

                            <p className="text-sm font-semibold text-text-primary">
                                Loading campaign...
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {/* Error */}

                    {!loading && error && (
                        <div className="mx-6 my-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:mx-7">
                            <p className="text-sm font-semibold text-red-700">
                                Unable to load this campaign
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Content */}

                    {!loading && !error && campaign && (
                        <div className="mx-auto max-w-5xl">
                            {/* Campaign identity */}

                            <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <MetaCard
                                        icon={Tag}
                                        label="Category"
                                        value={formatValue(campaign.category)}
                                        accent="primary"
                                    />

                                    <MetaCard
                                        icon={Building2}
                                        label="Organizer"
                                        value={getOrganizerName()}
                                        accent="organization"
                                    />

                                    <MetaCard
                                        icon={MapPin}
                                        label="Location"
                                        value={
                                            campaign.location ||
                                            campaign.district ||
                                            'Not specified'
                                        }
                                        accent="location"
                                    />

                                    <MetaCard
                                        icon={Hash}
                                        label="Campaign ID"
                                        value={campaign.id || 'Not provided'}
                                        accent="neutral"
                                    />
                                </div>
                            </div>

                            {/* Funding overview */}

                            <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Target size={14} />
                                    </span>

                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                        Fundraising overview
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <FundingCard
                                        icon={Target}
                                        label="Target amount"
                                        value={formatMoney(
                                            campaign.target_amount,
                                        )}
                                    />

                                    <FundingCard
                                        icon={Wallet}
                                        label="Collected"
                                        value={formatMoney(
                                            campaign.collected_amount || 0,
                                        )}
                                    />

                                    <FundingCard
                                        icon={RefreshCw}
                                        label="Progress"
                                        value={`${Math.round(
                                            progressPercentage,
                                        )}%`}
                                    />
                                </div>

                                {/* Progress */}

                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            Fundraising progress
                                        </span>

                                        <span className="text-xs font-bold text-primary">
                                            {Math.round(progressPercentage)}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{
                                                width: `${progressPercentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Main content */}

                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_270px]">
                                <main className="bg-white px-6 py-7 sm:px-8 sm:py-8 lg:border-r lg:border-slate-200">
                                    {/* Description */}

                                    <div className="max-w-2xl">
                                        <div className="mb-5 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <FileText size={14} />
                                                </span>

                                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                                    Campaign details
                                                </span>
                                            </div>

                                            <span className="hidden rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-400 sm:inline-flex">
                                                Full description
                                            </span>
                                        </div>

                                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/70 px-5 py-5 shadow-sm sm:px-6 sm:py-6">
                                            <div className="absolute left-0 top-0 h-full w-1 bg-primary/70" />

                                            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
                                                {campaign.description ||
                                                    'No description provided.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional information */}

                                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <InfoCard
                                            icon={Layers3}
                                            label="Scope"
                                            value={formatValue(campaign.scope)}
                                        />

                                        <InfoCard
                                            icon={MapPin}
                                            label="Affected areas"
                                            value={
                                                campaign.affected_areas ||
                                                'Not provided'
                                            }
                                        />

                                        <InfoCard
                                            icon={Globe2}
                                            label="Campaign type"
                                            value={getCampaignTypeLabel(
                                                campaign.type,
                                            )}
                                        />

                                        <InfoCard
                                            icon={FileText}
                                            label="Related help request"
                                            value={
                                                campaign.help_request_id
                                                    ? `Request #${campaign.help_request_id}`
                                                    : 'Not linked'
                                            }
                                        />
                                    </div>

                                    {/* Verification note */}

                                    {campaign.verification_note && (
                                        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
                                            <div className="flex items-start gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                                    <ShieldCheck size={14} />
                                                </span>

                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                                                        Verification note
                                                    </p>

                                                    <p className="mt-1.5 text-sm leading-6 text-amber-800">
                                                        {
                                                            campaign.verification_note
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </main>

                                {/* Side information */}

                                <aside className="bg-[#f8faf9] px-6 py-7 sm:px-8 lg:px-6">
                                    {/* Current state */}

                                    <div className="mb-8">
                                        <SideHeading
                                            title="Current state"
                                            icon={ShieldCheck}
                                        />

                                        <div className="mt-4 space-y-2.5">
                                            {campaign.status && (
                                                <SideStatus
                                                    icon={RefreshCw}
                                                    label="Status"
                                                    value={
                                                        <StatusBadge
                                                            status={
                                                                campaign.status
                                                            }
                                                        />
                                                    }
                                                />
                                            )}

                                            <SideStatus
                                                icon={Building2}
                                                label="Organizer"
                                                value={
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {getOrganizerName()}
                                                    </span>
                                                }
                                            />

                                            <SideStatus
                                                icon={Tag}
                                                label="Category"
                                                value={
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {formatValue(
                                                            campaign.category,
                                                        )}
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Timeline */}

                                    <div>
                                        <SideHeading
                                            title="Timeline"
                                            icon={CalendarDays}
                                        />

                                        <div className="relative mt-5 pl-5">
                                            <div className="absolute bottom-3 left-1 top-2 w-px bg-linear-to-b from-primary/60 via-slate-200 to-transparent" />

                                            <TimelineItem
                                                label="Created"
                                                value={formatDate(
                                                    campaign.created_at,
                                                    true,
                                                )}
                                                active
                                            />

                                            {campaign.proposal_date && (
                                                <TimelineItem
                                                    label="Proposal submitted"
                                                    value={formatDate(
                                                        campaign.proposal_date,
                                                        true,
                                                    )}
                                                />
                                            )}

                                            {campaign.verified_at && (
                                                <TimelineItem
                                                    label="Verified"
                                                    value={formatDate(
                                                        campaign.verified_at,
                                                        true,
                                                    )}
                                                    active
                                                />
                                            )}

                                            {campaign.start_date && (
                                                <TimelineItem
                                                    label="Campaign started"
                                                    value={formatDate(
                                                        campaign.start_date,
                                                        true,
                                                    )}
                                                    active
                                                />
                                            )}

                                            {campaign.end_date && (
                                                <TimelineItem
                                                    label="Campaign ended"
                                                    value={formatDate(
                                                        campaign.end_date,
                                                        true,
                                                    )}
                                                    last
                                                    active
                                                />
                                            )}

                                            {!campaign.end_date && (
                                                <TimelineItem
                                                    label="Last updated"
                                                    value={formatDate(
                                                        campaign.updated_at,
                                                        true,
                                                    )}
                                                    last
                                                />
                                            )}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}

                <div className="flex shrink-0 items-center justify-between border-t border-border bg-white px-6 py-4 sm:px-7">
                    <p className="hidden text-xs text-slate-400 sm:block">
                        Campaign details
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

// --------------------------------
// Meta Card
// --------------------------------

const MetaCard = ({ icon: Icon, label, value, accent }) => {
    const styles = {
        primary: {
            wrapper:
                'border-teal-100 bg-linear-to-br from-teal-50/80 to-white',
            icon: 'bg-teal-100 text-teal-700',
            label: 'text-teal-600',
            value: 'text-slate-800',
        },

        organization: {
            wrapper:
                'border-violet-100 bg-linear-to-br from-violet-50/70 to-white',
            icon: 'bg-violet-100 text-violet-700',
            label: 'text-violet-600',
            value: 'text-slate-800',
        },

        location: {
            wrapper: 'border-sky-100 bg-linear-to-br from-sky-50/70 to-white',
            icon: 'bg-sky-100 text-sky-700',
            label: 'text-sky-600',
            value: 'text-slate-800',
        },

        neutral: {
            wrapper: 'border-slate-200 bg-slate-50/70',
            icon: 'bg-white text-slate-400 ring-1 ring-slate-200',
            label: 'text-slate-400',
            value: 'text-slate-700',
        },
    };

    const style = styles[accent] || styles.neutral;

    return (
        <div
            className={`min-w-0 rounded-xl border px-3.5 py-3 ${style.wrapper}`}
        >
            <div className="flex items-center gap-2.5">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
                >
                    <Icon size={14} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                    <p
                        className={`text-[9px] font-bold uppercase tracking-widest ${style.label}`}
                    >
                        {label}
                    </p>

                    <p
                        className={`mt-0.5 truncate text-xs font-bold ${style.value}`}
                        title={String(value)}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --------------------------------
// Funding Card
// --------------------------------

const FundingCard = ({ icon: Icon, label, value }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200">
                    <Icon size={14} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --------------------------------
// Info Card
// --------------------------------

const InfoCard = ({ icon: Icon, label, value }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={14} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --------------------------------
// Side Heading
// --------------------------------

const SideHeading = ({ title, icon: Icon }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={13} strokeWidth={1.9} />
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {title}
            </p>
        </div>
    );
};

// --------------------------------
// Side Status
// --------------------------------

const SideStatus = ({ icon: Icon, label, value }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 ring-1 ring-slate-200">
                    <Icon size={14} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                    </p>

                    <div className="mt-1.5">{value}</div>
                </div>
            </div>
        </div>
    );
};

// --------------------------------
// Timeline Item
// --------------------------------

const TimelineItem = ({ label, value, last = false, active = false }) => {
    return (
        <div className={`relative ${last ? '' : 'pb-6'}`}>
            <span
                className={`absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                    active
                        ? 'border-primary bg-primary shadow-[0_0_0_3px_rgba(15,118,110,0.12)]'
                        : 'border-slate-300 bg-[#f8faf9]'
                }`}
            />

            <p
                className={`text-[9px] font-bold uppercase tracking-[0.08em] ${
                    active ? 'text-primary' : 'text-slate-400'
                }`}
            >
                {label}
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                {value}
            </p>
        </div>
    );
};

export default CampaignViewModal;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronRight,
    Clock3,
    Copy,
    CreditCard,
    Hash,
    Mail,
    MapPin,
    Phone,
    RotateCcw,
    Tag,
    UserRound,
    WalletCards,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { apiRequest } from '@/api/client';

/* =========================================================
   HELPERS
========================================================= */

const getDonationId = (d) => d?.id ?? d?.donation_id ?? null;

const getDonorId = (d) =>
    d?.user?.id ?? d?.donor?.id ?? d?.user_id ?? d?.donor_id ?? null;

const getCampaignId = (d) => d?.campaign?.id ?? d?.campaign_id ?? null;

const getTransactionId = (d) =>
    d?.transaction_id ??
    d?.transactionId ??
    d?.tran_id ??
    d?.transaction ??
    null;

function getText(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return value.name ?? value.title ?? value.label ?? '—';
    }

    return String(value);
}

function getLabel(value) {
    const valueText = getText(value);

    if (valueText === '—') return valueText;

    return valueText
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getAmount(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const number = Number(value);

    if (!Number.isFinite(number)) return '—';

    return `৳${number.toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    })}`;
}

function getDateTime(value) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function normalizeDonation(response) {
    const root = response?.data ?? response;

    if (!root || typeof root !== 'object' || Array.isArray(root)) {
        return null;
    }

    const donation = root.donation ?? root;

    return donation && typeof donation === 'object' && !Array.isArray(donation)
        ? donation
        : null;
}

function getDonationList(response) {
    const root = response?.data ?? response;

    if (Array.isArray(root)) return root;
    if (Array.isArray(root?.donations)) return root.donations;
    if (Array.isArray(root?.data)) return root.data;

    return [];
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SectionLabel({ children, icon: Icon }) {
    return (
        <div className="flex items-center gap-2.5">
            {Icon && (
                <Icon
                    size={15}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#8C9AAA]"
                />
            )}

            <h2 className="!m-0 !font-sans !text-[14px] !font-semibold !text-[#D9E1EA]">
                {children}
            </h2>
        </div>
    );
}

function Field({ label, value, icon: Icon }) {
    return (
        <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] text-[#8796A7]">
                {Icon && <Icon size={13} strokeWidth={1.7} />}
                {label}
            </div>

            <div className="mt-1.5 min-w-0 break-words text-[13px] font-medium leading-6 text-[#D2DCE7]">
                {value ?? '—'}
            </div>
        </div>
    );
}

function Avatar({ name, photo }) {
    const [failed, setFailed] = useState(false);

    const initials = String(name || 'D')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#3A4655] bg-[#25313D] text-[14px] font-semibold text-[#DFE7EF]">
            {photo && !failed ? (
                <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                initials
            )}
        </div>
    );
}

function InlineLink({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-8 shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#AEBCCB] transition-colors hover:text-[#EEF2F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#738398]"
        >
            {children}
            <ArrowUpRight size={14} />
        </button>
    );
}

/* =========================================================
   COMPACT CONTRIBUTION HEADER
========================================================= */

function ContributionHeader({ donation }) {
    const id = getDonationId(donation);

    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const date = donation.created_at ?? donation.createdAt;

    return (
        <section className="min-w-0 border-b border-[#303A47] pb-7">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[12px] font-medium text-[#97A6B6]">
                            Donation #{id ?? '—'}
                        </span>

                        {status && <StatusBadge status={status} />}
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h2 className="!m-0 !font-sans !text-[40px] !font-semibold !leading-[1.15] !tracking-[-0.045em] !text-[#E5EBF2] sm:!text-[48px]">
                            {getAmount(donation.amount)}
                        </h2>

                        <span className="text-[13px] text-[#93A2B2]">
                            Contribution amount
                        </span>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-[12px] text-[#9BA9B9] sm:pb-2">
                    <CalendarDays size={14} strokeWidth={1.7} />
                    {getDateTime(date)}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   CONNECTED CONTRIBUTION FLOW
========================================================= */

function ContributionFlow({ donation, onViewDonor, onViewCampaign }) {
    const donor = donation.user ?? donation.donor ?? {};
    const campaign = donation.campaign ?? {};

    const donorId = getDonorId(donation);
    const campaignId = getCampaignId(donation);

    const donorName =
        donor.name ??
        donation.donor_name ??
        donation.donorName ??
        'Guest donor';

    const donorEmail =
        donor.email ?? donation.donor_email ?? donation.donorEmail;

    const donorPhone =
        donor.phone ?? donation.donor_phone ?? donation.donorPhone;

    const donorPhoto = donor.photo ?? donor.avatar ?? donor.profile_photo;

    const campaignTitle =
        campaign.title ??
        campaign.name ??
        donation.campaign_title ??
        donation.campaignTitle ??
        'Campaign unavailable';

    const campaignDescription =
        campaign.description ??
        campaign.details ??
        campaign.campaign_description ??
        campaign.campaignDescription ??
        donation.campaign_description ??
        donation.campaignDescription ??
        '';

    const category = campaign.category ?? donation.campaign_category;

    const location =
        campaign.location ??
        campaign.district ??
        campaign.address ??
        donation.campaign_location;

    const hasDescription =
        typeof campaignDescription === 'string' &&
        campaignDescription.trim().length > 0;

    return (
        <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3">
                <SectionLabel icon={UserRound}>
                    Contribution overview
                </SectionLabel>

                <span className="hidden text-[12px] text-[#8796A7] sm:block">
                    Donor and supported campaign
                </span>
            </div>

            <div className="grid min-w-0 grid-cols-1 border border-[#303A47] bg-[#151C25] lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1.15fr)]">
                {/* DONOR */}
                <div className="min-w-0 px-5 py-6 sm:px-6">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <p className="text-[12px] font-medium text-[#92A1B1]">
                            From donor
                        </p>

                        {donorId != null && (
                            <InlineLink onClick={onViewDonor}>
                                View profile
                            </InlineLink>
                        )}
                    </div>

                    <div className="mt-5 flex min-w-0 items-center gap-3.5">
                        <Avatar name={donorName} photo={donorPhoto} />

                        <div className="min-w-0">
                            <h3 className="!m-0 break-words !font-sans !text-[16px] !font-semibold !text-[#E1E8F0]">
                                {donorName}
                            </h3>

                            <p className="mt-1 text-[12px] text-[#8D9CAC]">
                                {donorId != null
                                    ? 'Registered donor'
                                    : 'Guest donor'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3.5 border-t border-[#29333F] pt-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <Mail
                                size={14}
                                className="mt-1 shrink-0 text-[#8A99AA]"
                            />

                            <span className="min-w-0 break-words text-[13px] leading-6 text-[#C5D1DD]">
                                {getText(donorEmail)}
                            </span>
                        </div>

                        {donorPhone && (
                            <div className="flex min-w-0 items-start gap-3">
                                <Phone
                                    size={14}
                                    className="mt-1 shrink-0 text-[#8A99AA]"
                                />

                                <span className="min-w-0 break-words text-[13px] text-[#C5D1DD]">
                                    {getText(donorPhone)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATIONSHIP INDICATOR */}
                <div className="flex items-center justify-center border-y border-[#303A47] bg-[#191F29] py-3 lg:border-x lg:border-y-0">
                    <div className="flex items-center gap-2 lg:flex-col">
                        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8998A8]">
                            Supports
                        </span>

                        <ChevronRight
                            size={18}
                            strokeWidth={1.7}
                            className="rotate-90 text-[#A5B4C3] lg:rotate-0"
                        />
                    </div>
                </div>

                {/* CAMPAIGN */}
                <div className="min-w-0 px-5 py-6 sm:px-6">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <p className="text-[12px] font-medium text-[#92A1B1]">
                            To campaign
                        </p>

                        {campaignId != null && (
                            <InlineLink onClick={onViewCampaign}>
                                View campaign
                            </InlineLink>
                        )}
                    </div>

                    <h3 className="!mt-5 !mb-0 break-words !font-sans !text-[19px] !font-semibold !leading-[1.4] !tracking-[-0.025em] !text-[#E1E8F0]">
                        {campaignTitle}
                    </h3>

                    {hasDescription && (
                        <p className="mt-2.5 whitespace-pre-line break-words text-[13px] leading-6 text-[#AAB8C7]">
                            {campaignDescription.trim()}
                        </p>
                    )}

                    <div className="mt-5 grid min-w-0 grid-cols-2 gap-4 border-t border-[#29333F] pt-4 sm:grid-cols-3">
                        <Field
                            icon={Tag}
                            label="Category"
                            value={getText(category)}
                        />

                        <Field
                            icon={MapPin}
                            label="Location"
                            value={getText(location)}
                        />

                        <Field
                            icon={Hash}
                            label="Campaign ID"
                            value={campaignId != null ? `#${campaignId}` : '—'}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   TRANSACTION DETAILS
========================================================= */

function TransactionDetails({ donation }) {
    const method = donation.payment_method ?? donation.paymentMethod;

    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const currency = donation.currency ?? 'BDT';
    const transaction = getTransactionId(donation);

    const [copied, setCopied] = useState(false);

    const copyReference = async () => {
        if (!transaction || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(String(transaction));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <section className="min-w-0">
            <div className="mb-5">
                <SectionLabel icon={CreditCard}>
                    Transaction details
                </SectionLabel>
            </div>

            <div className="min-w-0 border-y border-[#303A47]">
                <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-5 py-5 sm:grid-cols-3">
                    <Field
                        icon={WalletCards}
                        label="Payment method"
                        value={getLabel(method)}
                    />

                    <Field
                        icon={CreditCard}
                        label="Payment status"
                        value={getLabel(status)}
                    />

                    <Field
                        icon={Hash}
                        label="Currency"
                        value={String(currency).toUpperCase()}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-3 border-t border-[#29333F] py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-[12px] text-[#8998A9]">
                            Transaction reference
                        </p>

                        <p className="mt-1.5 break-all font-mono text-[12px] leading-6 text-[#CBD6E1]">
                            {getText(transaction)}
                        </p>
                    </div>

                    {transaction && (
                        <button
                            type="button"
                            onClick={copyReference}
                            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 self-start border border-[#35404E] px-3 text-[12px] font-medium text-[#B9C7D5] transition-colors hover:bg-[#202A35] hover:text-white sm:self-auto"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy reference'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   RECORD FOOTER
========================================================= */

function RecordFooter({ donation }) {
    const created = donation.created_at ?? donation.createdAt;

    const updated = donation.updated_at ?? donation.updatedAt;

    return (
        <footer className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#303A47] pt-5 text-[12px] text-[#8998A8]">
            <span className="inline-flex items-center gap-2">
                <Clock3 size={14} />
                Created:{' '}
                <span className="text-[#B6C3D0]">{getDateTime(created)}</span>
            </span>

            <span className="inline-flex items-center gap-2">
                <RotateCcw size={13} />
                Last updated:{' '}
                <span className="text-[#B6C3D0]">{getDateTime(updated)}</span>
            </span>
        </footer>
    );
}

/* =========================================================
   DONOR MESSAGE
========================================================= */

function DonorMessage({ note }) {
    if (typeof note !== 'string' || !note.trim()) {
        return null;
    }

    return (
        <section className="min-w-0 border-t border-[#303A47] pt-5">
            <SectionLabel icon={Mail}>Donor message</SectionLabel>

            <p className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-7 text-[#B2BFCD]">
                {note.trim()}
            </p>
        </section>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DonationDetails() {
    const { donationId } = useParams();
    const navigate = useNavigate();

    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadDonation() {
            setLoading(true);
            setError('');
            setDonation(null);

            try {
                if (!donationId) {
                    throw new Error('Donation ID is missing.');
                }

                let result = null;

                try {
                    const response = await apiRequest(
                        `/admin/donations/${encodeURIComponent(donationId)}`,
                    );

                    result = normalizeDonation(response);

                    if (
                        result &&
                        getDonationId(result) != null &&
                        String(getDonationId(result)) !== String(donationId)
                    ) {
                        result = null;
                    }
                } catch (err) {
                    const status = err?.status ?? err?.response?.status;

                    const message = String(err?.message ?? '').toLowerCase();

                    const canFallback =
                        status === 404 ||
                        status === 405 ||
                        message.includes('not found') ||
                        message.includes('404');

                    if (!canFallback) throw err;
                }

                if (!result) {
                    const response = await apiRequest('/admin/donations');

                    result =
                        getDonationList(response).find(
                            (item) =>
                                String(getDonationId(item)) ===
                                String(donationId),
                        ) ?? null;
                }

                if (!result) {
                    throw new Error(
                        'Donation record not found or unavailable.',
                    );
                }

                if (!cancelled) {
                    setDonation(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message || 'Unable to load donation details.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDonation();

        return () => {
            cancelled = true;
        };
    }, [donationId, retryKey]);

    const donorId = getDonorId(donation);
    const campaignId = getCampaignId(donation);

    const goToDonor = () => {
        if (donorId == null) return;

        navigate(`/admin/dashboard/users/${encodeURIComponent(donorId)}`);
    };

    const goToCampaign = () => {
        if (campaignId == null) return;

        navigate(
            `/admin/dashboard/campaigns/${encodeURIComponent(campaignId)}`,
        );
    };

    return (
        <main className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Donation Details"
                subtitle="Contribution, donor and campaign information."
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/donations')}
                        className="inline-flex min-h-9 items-center gap-2 border border-[#35404E] px-3.5 text-[12px] font-medium text-[#C3CDD8] transition-colors hover:bg-[#202A35] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748B]"
                    >
                        <ArrowLeft size={14} />
                        All Donations
                    </button>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading donation details..."
                    description="Retrieving contribution information."
                />
            ) : error ? (
                <div className="space-y-4">
                    <LoadingError
                        title="Unable to load donation details"
                        message={error}
                    />

                    <button
                        type="button"
                        onClick={() => setRetryKey((key) => key + 1)}
                        className="inline-flex min-h-9 items-center gap-2 border border-[#35404E] px-3.5 text-[12px] text-[#D6DFE9] hover:bg-[#202A35]"
                    >
                        <RotateCcw size={14} />
                        Try again
                    </button>
                </div>
            ) : donation ? (
                <div className="min-w-0 space-y-8">
                    <ContributionHeader donation={donation} />

                    <ContributionFlow
                        donation={donation}
                        onViewDonor={goToDonor}
                        onViewCampaign={goToCampaign}
                    />

                    <TransactionDetails donation={donation} />

                    <DonorMessage note={donation.note ?? donation.message} />

                    <RecordFooter donation={donation} />
                </div>
            ) : (
                <div className="border-t border-[#303A47] py-12 text-center text-[13px] text-[#9AA6B5]">
                    Donation information is unavailable.
                </div>
            )}
        </main>
    );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CreditCard,
    FileText,
    Hash,
    Mail,
    MapPin,
    Phone,
    RotateCcw,
    Tag,
    UserRound,
    Wallet,
    Clock3,
    Building2,
    Copy,
    Check,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { apiRequest } from '@/api/client';

/* =========================================
   DATA HELPERS
========================================= */

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

const display = (value) => {
    if (value === null || value === undefined || value === '') return '—';

    if (typeof value === 'object')
        return value.name ?? value.title ?? value.label ?? '—';

    return String(value);
};

const formatLabel = (value) => {
    const text = display(value);
    if (text === '—') return text;

    return text
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') return '—';

    const amount = Number(value);
    if (!Number.isFinite(amount)) return '—';

    return `৳${amount.toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value) => {
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
};

const normalizeDonation = (response) => {
    const root = response?.data ?? response;
    if (!root || typeof root !== 'object' || Array.isArray(root)) return null;

    const donation = root.donation ?? root;

    return donation && typeof donation === 'object' && !Array.isArray(donation)
        ? donation
        : null;
};

const getDonationList = (response) => {
    const root = response?.data ?? response;

    if (Array.isArray(root)) return root;
    if (Array.isArray(root?.donations)) return root.donations;
    if (Array.isArray(root?.data)) return root.data;

    return [];
};

/* =========================================
   SHARED LOCAL UI
========================================= */

function SectionTitle({ icon: Icon, title, action }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#92A2B3]"
                />
                <h2 className="!m-0 !font-sans !text-[15px] !font-semibold !tracking-[-0.015em] !text-[#DDE5ED]">
                    {title}
                </h2>
            </div>
            {action}
        </div>
    );
}

function ActionLink({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-9 items-center gap-1.5 text-[12px] font-medium text-[#AEBCCB] transition-colors hover:text-[#F0F3F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#738398]"
        >
            {children}
            <ArrowUpRight size={14} strokeWidth={1.8} />
        </button>
    );
}

function DetailRow({ label, value, mono = false, last = false }) {
    return (
        <div
            className={`grid min-w-0 grid-cols-1 gap-1.5 py-3.5 sm:grid-cols-[125px_minmax(0,1fr)] sm:gap-5 ${
                last ? '' : 'border-b border-[#29313C]'
            }`}
        >
            <span className="text-[12px] leading-5 text-[#8E9BAA]">
                {label}
            </span>
            <span
                className={`min-w-0 break-words text-[12px] leading-5 text-[#D2DBE5] sm:text-right ${
                    mono ? 'break-all font-mono text-[11px]' : 'font-medium'
                }`}
            >
                {value ?? '—'}
            </span>
        </div>
    );
}

function InfoField({ icon: Icon, label, value }) {
    return (
        <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#8B9AAA]">
                {Icon && <Icon size={14} strokeWidth={1.7} />}
                <span className="text-[12px]">{label}</span>
            </div>
            <p className="mt-2 min-w-0 break-words text-[13px] font-medium leading-6 text-[#D7E0EA]">
                {display(value)}
            </p>
        </div>
    );
}

function DonorAvatar({ name, photo }) {
    const [failed, setFailed] = useState(false);

    const initials = String(name || 'D')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#3A4655] bg-[#26313E] text-[14px] font-semibold text-[#E1E8F0]">
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

/* =========================================
   CONTRIBUTION SUMMARY
========================================= */

function ContributionSummary({ donation }) {
    const id = getDonationId(donation);
    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const method = donation.payment_method ?? donation.paymentMethod;

    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(250px,0.65fr)]">
                <div className="min-w-0 px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[12px] font-medium text-[#A1AFBE]">
                            Donation #{id ?? '—'}
                        </span>
                        {status && <StatusBadge status={status} />}
                    </div>

                    <p className="mt-5 text-[12px] font-medium text-[#9BA9B8]">
                        Total contribution
                    </p>

                    <p className="mt-1.5 break-words text-[38px] font-semibold leading-[1.15] tracking-[-0.045em] text-[#E7EDF4] sm:text-[45px]">
                        {formatAmount(donation.amount)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[12px] text-[#A5B2C0]">
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays size={14} strokeWidth={1.7} />
                            {formatDate(
                                donation.created_at ?? donation.createdAt,
                            )}
                        </span>

                        {method && (
                            <span className="inline-flex items-center gap-2">
                                <Wallet size={14} strokeWidth={1.7} />
                                {formatLabel(method)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex min-w-0 flex-col justify-center border-t border-[#303946] bg-[#19212B] px-5 py-5 sm:px-7 lg:border-l lg:border-t-0 lg:px-7">
                    <div className="flex items-center gap-2.5">
                        <CreditCard
                            size={17}
                            strokeWidth={1.7}
                            className="text-[#9AABBB]"
                        />
                        <span className="text-[13px] font-semibold text-[#D6DFE8]">
                            Transaction reference
                        </span>
                    </div>

                    <p className="mt-3 break-all font-mono text-[12px] leading-6 text-[#C0CCDA]">
                        {display(getTransactionId(donation))}
                    </p>
                </div>
            </div>
        </section>
    );
}

/* =========================================
   DONOR INFORMATION
========================================= */

function DonorSection({ donation, onViewDonor }) {
    const donor = donation.user ?? donation.donor ?? {};
    const donorId = getDonorId(donation);

    const name =
        donor.name ??
        donation.donor_name ??
        donation.donorName ??
        'Guest donor';

    const email = donor.email ?? donation.donor_email ?? donation.donorEmail;

    const phone = donor.phone ?? donation.donor_phone ?? donation.donorPhone;

    const photo = donor.photo ?? donor.avatar ?? donor.profile_photo;

    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="border-b border-[#29333F] px-5 py-4 sm:px-6">
                <SectionTitle
                    icon={UserRound}
                    title="Donor information"
                    action={
                        donorId != null ? (
                            <ActionLink onClick={onViewDonor}>
                                View profile
                            </ActionLink>
                        ) : null
                    }
                />
            </div>

            <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex min-w-0 items-center gap-3.5">
                    <DonorAvatar name={name} photo={photo} />

                    <div className="min-w-0">
                        <h3 className="!m-0 break-words !font-sans !text-[16px] !font-semibold !text-[#E2E8F0]">
                            {name}
                        </h3>
                        <p className="mt-1 text-[12px] text-[#92A0B0]">
                            {donorId != null
                                ? 'Registered donor'
                                : 'Guest donor'}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-x-6 gap-y-5 border-t border-[#29333F] pt-5 sm:grid-cols-2">
                    <InfoField
                        icon={Mail}
                        label="Email address"
                        value={email}
                    />
                    <InfoField
                        icon={Phone}
                        label="Phone number"
                        value={phone}
                    />
                </div>
            </div>
        </section>
    );
}

/* =========================================
   SUPPORTED CAMPAIGN
========================================= */

function CampaignSection({ donation, onViewCampaign }) {
    const campaign = donation.campaign ?? {};
    const campaignId = getCampaignId(donation);

    const title =
        campaign.title ??
        campaign.name ??
        donation.campaign_title ??
        donation.campaignTitle ??
        'Campaign unavailable';

    const description =
        campaign.description ??
        campaign.details ??
        campaign.campaign_description ??
        campaign.campaignDescription ??
        donation.campaign_description ??
        donation.campaignDescription ??
        '';

    const organization =
        campaign.organization?.name ??
        campaign.organization_name ??
        donation.organization_name;

    const category = campaign.category ?? donation.campaign_category;

    const location =
        campaign.location ??
        campaign.district ??
        campaign.address ??
        donation.campaign_location;

    const hasDescription =
        typeof description === 'string' && description.trim().length > 0;

    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="border-b border-[#29333F] px-5 py-4 sm:px-6">
                <SectionTitle
                    icon={Building2}
                    title="Supported campaign"
                    action={
                        campaignId != null ? (
                            <ActionLink onClick={onViewCampaign}>
                                View campaign
                            </ActionLink>
                        ) : null
                    }
                />
            </div>

            <div className="min-w-0 px-5 py-5 sm:px-6 sm:py-6">
                <h3 className="!m-0 break-words !font-sans !text-[19px] !font-semibold !leading-[1.4] !tracking-[-0.025em] !text-[#E1E8F0] sm:!text-[21px]">
                    {title}
                </h3>

                {organization && (
                    <p className="mt-2 text-[12px] leading-5 text-[#94A3B4]">
                        Organized by{' '}
                        <span className="font-medium text-[#C9D5E0]">
                            {organization}
                        </span>
                    </p>
                )}

                {hasDescription && (
                    <p className="mt-4 whitespace-pre-line break-words text-[13px] leading-[1.85] text-[#A9B7C6]">
                        {description.trim()}
                    </p>
                )}

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-x-5 gap-y-5 border-t border-[#29333F] pt-5 sm:grid-cols-3">
                    <InfoField icon={Tag} label="Category" value={category} />
                    <InfoField
                        icon={MapPin}
                        label="Location"
                        value={location}
                    />
                    <InfoField
                        icon={Hash}
                        label="Campaign ID"
                        value={campaignId != null ? `#${campaignId}` : '—'}
                    />
                </div>
            </div>
        </section>
    );
}

/* =========================================
   PAYMENT INFORMATION
========================================= */

function PaymentSection({ donation }) {
    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const method = donation.payment_method ?? donation.paymentMethod;

    const currency = donation.currency ?? 'BDT';

    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="border-b border-[#29333F] px-5 py-4 sm:px-6">
                <SectionTitle icon={CreditCard} title="Payment information" />
            </div>

            <div className="px-5 py-2 sm:px-6">
                <DetailRow label="Payment status" value={formatLabel(status)} />
                <DetailRow label="Payment method" value={formatLabel(method)} />
                <DetailRow
                    label="Currency"
                    value={String(currency).toUpperCase()}
                    last
                />
            </div>
        </section>
    );
}

/* =========================================
   RECORD INFORMATION
========================================= */

function RecordSection({ donation }) {
    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="border-b border-[#29333F] px-5 py-4 sm:px-6">
                <SectionTitle icon={Clock3} title="Record history" />
            </div>

            <div className="px-5 py-2 sm:px-6">
                <DetailRow
                    label="Created"
                    value={formatDate(
                        donation.created_at ?? donation.createdAt,
                    )}
                />
                <DetailRow
                    label="Last updated"
                    value={formatDate(
                        donation.updated_at ?? donation.updatedAt,
                    )}
                    last
                />
            </div>
        </section>
    );
}

/* =========================================
   DONOR MESSAGE
========================================= */

function DonorNote({ note }) {
    if (typeof note !== 'string' || !note.trim()) return null;

    return (
        <section className="min-w-0 overflow-hidden border border-[#303946] bg-[#151C25]">
            <div className="border-b border-[#29333F] px-5 py-4 sm:px-6">
                <SectionTitle icon={FileText} title="Donor message" />
            </div>

            <p className="whitespace-pre-wrap break-words px-5 py-5 text-[13px] leading-7 text-[#B4C0CD] sm:px-6">
                {note.trim()}
            </p>
        </section>
    );
}

/* =========================================
   MAIN PAGE
========================================= */

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
                subtitle="Contribution, donor and payment information."
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
                        className="inline-flex min-h-9 items-center gap-2 border border-[#35404E] px-3.5 text-[12px] text-[#D6DFE9] transition-colors hover:bg-[#202A35]"
                    >
                        <RotateCcw size={14} />
                        Try again
                    </button>
                </div>
            ) : donation ? (
                <div className="min-w-0 space-y-5">
                    <ContributionSummary donation={donation} />

                    <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.85fr)]">
                        <div className="min-w-0 space-y-5">
                            <DonorSection
                                donation={donation}
                                onViewDonor={goToDonor}
                            />

                            <CampaignSection
                                donation={donation}
                                onViewCampaign={goToCampaign}
                            />

                            <DonorNote
                                note={donation.note ?? donation.message}
                            />
                        </div>

                        <aside className="min-w-0 space-y-5">
                            <PaymentSection donation={donation} />
                            <RecordSection donation={donation} />
                        </aside>
                    </div>
                </div>
            ) : (
                <div className="border border-[#303946] bg-[#151C25] px-5 py-12 text-center text-[13px] text-[#9AA6B5]">
                    Donation information is unavailable.
                </div>
            )}
        </main>
    );
}

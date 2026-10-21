import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Check,
    Clock3,
    Copy,
    CreditCard,
    FileText,
    Hash,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Tag,
    UserRound,
    Wallet,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import { apiRequest } from '@/api/client';

/* =========================================================
   DATA UTILITIES
========================================================= */

const donationIdOf = (d) => d?.id ?? d?.donation_id;

const donorIdOf = (d) =>
    d?.user?.id ?? d?.donor?.id ?? d?.user_id ?? d?.donor_id;

const campaignIdOf = (d) => d?.campaign?.id ?? d?.campaign_id;

const transactionOf = (d) =>
    d?.transaction_id ?? d?.transactionId ?? d?.tran_id ?? d?.transaction;

function display(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return value.name ?? value.title ?? value.label ?? '—';
    }

    return String(value);
}

function label(value) {
    const text = display(value);

    if (text === '—') return text;

    return text
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function amount(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const number = Number(value);

    if (!Number.isFinite(number)) return '—';

    return `৳${number.toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    })}`;
}

function dateTime(value) {
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
    const result = root?.donation ?? root;

    return result && typeof result === 'object' && !Array.isArray(result)
        ? result
        : null;
}

function donationList(response) {
    const root = response?.data ?? response;

    if (Array.isArray(root)) return root;
    if (Array.isArray(root?.donations)) return root.donations;
    if (Array.isArray(root?.data)) return root.data;

    return [];
}

/* =========================================================
   REUSABLE DISPLAY COMPONENTS
========================================================= */

function SectionHeading({ icon: Icon, title, action }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={17}
                    strokeWidth={1.6}
                    className="shrink-0 text-[#8E9CAD]"
                />

                <h2 className="!m-0 !font-sans !text-[15px] !font-semibold !tracking-[-0.015em] !text-[#DDE5ED]">
                    {title}
                </h2>
            </div>

            {action}
        </div>
    );
}

function RecordLink({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 text-[12px] font-medium text-[#AAB9C8] transition-colors hover:text-[#E7EDF3]"
        >
            {children}
            <ArrowUpRight size={14} strokeWidth={1.7} />
        </button>
    );
}

function DetailField({ icon: Icon, label: title, value }) {
    return (
        <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#8C9BAB]">
                {Icon && <Icon size={14} strokeWidth={1.6} />}

                <span className="text-[12px]">{title}</span>
            </div>

            <p className="mt-2 min-w-0 break-words text-[13px] font-medium leading-6 text-[#CCD6E0]">
                {display(value)}
            </p>
        </div>
    );
}

function PaymentRow({ title, value, last = false }) {
    return (
        <div
            className={`flex min-w-0 items-start justify-between gap-5 py-4 ${
                last ? '' : 'border-b border-[#29323E]'
            }`}
        >
            <span className="shrink-0 text-[12px] leading-5 text-[#8D9BAB]">
                {title}
            </span>

            <span className="min-w-0 break-words text-right text-[13px] font-medium leading-5 text-[#D0DAE5]">
                {display(value)}
            </span>
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
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#3A4655] bg-[#26313E] text-[14px] font-semibold text-[#E0E8F0]">
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

/* =========================================================
   DONATION SUMMARY
========================================================= */

function DonationSummary({ donation }) {
    const id = donationIdOf(donation);

    const created = donation.created_at ?? donation.createdAt;

    const method = donation.payment_method ?? donation.paymentMethod;

    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const hasStatus =
        status !== null && status !== undefined && String(status).trim() !== '';

    return (
        <section className="min-w-0 border-b border-[#303A47] pb-6">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[12px] font-medium text-[#95A4B4]">
                            DONATION / {id != null ? `#${id}` : '—'}
                        </span>

                        {hasStatus && (
                            <span className="border border-[#35404E] bg-[#202832] px-2.5 py-1 text-[11px] font-medium text-[#C4D0DC]">
                                {label(status)}
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h2 className="!m-0 !font-sans !text-[40px] !font-semibold !leading-[1.1] !tracking-[-0.045em] !text-[#E5EBF2] sm:!text-[48px]">
                            {amount(donation.amount)}
                        </h2>

                        <span className="text-[13px] text-[#92A1B1]">
                            Total contribution
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-1 text-[12px] text-[#9BAABA]">
                    <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} strokeWidth={1.6} />
                        {dateTime(created)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                        <Wallet size={14} strokeWidth={1.6} />
                        {label(method)}
                    </span>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   DONOR SECTION
========================================================= */

function DonorSection({ donation, onViewDonor }) {
    const donor = donation.user ?? donation.donor ?? {};
    const donorId = donorIdOf(donation);

    const name =
        donor.name ??
        donation.donor_name ??
        donation.donorName ??
        'Guest donor';

    const email = donor.email ?? donation.donor_email ?? donation.donorEmail;

    const phone = donor.phone ?? donation.donor_phone ?? donation.donorPhone;

    const photo = donor.photo ?? donor.avatar ?? donor.profile_photo;

    return (
        <section className="min-w-0">
            <SectionHeading
                icon={UserRound}
                title="Donor information"
                action={
                    donorId != null ? (
                        <RecordLink onClick={onViewDonor}>
                            View donor
                        </RecordLink>
                    ) : null
                }
            />

            <div className="mt-5 flex min-w-0 items-center gap-3.5">
                <Avatar name={name} photo={photo} />

                <div className="min-w-0">
                    <h3 className="!m-0 break-words !font-sans !text-[16px] !font-semibold !text-[#E0E7EF]">
                        {name}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#8E9CAC]">
                        {donorId != null ? 'Registered donor' : 'Guest donor'}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 border-t border-[#29323E] pt-5 sm:grid-cols-2">
                <DetailField icon={Mail} label="Email address" value={email} />

                <DetailField icon={Phone} label="Phone number" value={phone} />
            </div>
        </section>
    );
}

/* =========================================================
   CAMPAIGN SECTION
========================================================= */

function CampaignSection({ donation, onViewCampaign }) {
    const campaign = donation.campaign ?? {};
    const campaignId = campaignIdOf(donation);

    const title =
        campaign.title ??
        campaign.name ??
        donation.campaign_title ??
        donation.campaignTitle ??
        'Campaign unavailable';

    const category = campaign.category ?? donation.campaign_category;

    const location =
        campaign.location ??
        campaign.district ??
        campaign.address ??
        donation.campaign_location;

    const description =
        campaign.short_description ??
        campaign.shortDescription ??
        campaign.description ??
        donation.campaign_description ??
        '';

    const image =
        campaign.cover_image ?? campaign.image ?? campaign.thumbnail ?? null;

    const [imageFailed, setImageFailed] = useState(false);

    return (
        <section className="min-w-0">
            <SectionHeading
                icon={FileText}
                title="Supported campaign"
                action={
                    campaignId != null ? (
                        <RecordLink onClick={onViewCampaign}>
                            View campaign
                        </RecordLink>
                    ) : null
                }
            />

            <div className="mt-5 flex min-w-0 items-start gap-4">
                {image && !imageFailed && (
                    <img
                        src={image}
                        alt=""
                        className="h-[88px] w-[110px] shrink-0 border border-[#35404E] object-cover"
                        onError={() => setImageFailed(true)}
                    />
                )}

                <div className="min-w-0 flex-1">
                    <h3 className="!m-0 break-words !font-sans !text-[17px] !font-semibold !leading-[1.4] !tracking-[-0.02em] !text-[#DFE7EF]">
                        {title}
                    </h3>

                    {typeof description === 'string' && description.trim() && (
                        <p className="mt-2 line-clamp-2 break-words text-[13px] leading-6 text-[#9EADBC]">
                            {description.trim()}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-2 gap-5 border-t border-[#29323E] pt-5 sm:grid-cols-3">
                <DetailField icon={Tag} label="Category" value={category} />

                <DetailField icon={MapPin} label="Location" value={location} />

                <DetailField
                    icon={Hash}
                    label="Campaign ID"
                    value={campaignId != null ? `#${campaignId}` : '—'}
                />
            </div>
        </section>
    );
}

/* =========================================================
   PAYMENT DETAILS
========================================================= */

function PaymentDetails({ donation }) {
    const method = donation.payment_method ?? donation.paymentMethod;

    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const currency = donation.currency ?? 'BDT';
    const transaction = transactionOf(donation);

    const [copied, setCopied] = useState(false);

    async function copyReference() {
        if (!transaction || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(String(transaction));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <section className="min-w-0 border border-[#303A47] bg-[#151C25]">
            <div className="border-b border-[#29323E] px-5 py-4 sm:px-6">
                <SectionHeading icon={CreditCard} title="Payment details" />
            </div>

            <div className="px-5 py-1 sm:px-6">
                <PaymentRow title="Payment method" value={label(method)} />

                <PaymentRow title="Payment status" value={label(status)} />

                <PaymentRow
                    title="Currency"
                    value={String(currency).toUpperCase()}
                    last
                />
            </div>

            <div className="border-t border-[#29323E] px-5 py-5 sm:px-6">
                <p className="text-[12px] text-[#8D9BAB]">
                    Transaction reference
                </p>

                <div className="mt-3 flex min-w-0 items-center gap-3 border border-[#35404E] bg-[#191F29] px-3.5 py-3">
                    <span className="min-w-0 flex-1 break-all font-mono text-[11px] leading-5 text-[#CBD6E1]">
                        {display(transaction)}
                    </span>

                    {transaction && (
                        <button
                            type="button"
                            onClick={copyReference}
                            aria-label="Copy transaction reference"
                            title="Copy transaction reference"
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#A8B6C5] transition-colors hover:bg-[#26313D] hover:text-white"
                        >
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   RECORD ACTIVITY
========================================================= */

function RecordActivity({ donation }) {
    const created = donation.created_at ?? donation.createdAt;

    const updated = donation.updated_at ?? donation.updatedAt;

    return (
        <section className="min-w-0">
            <SectionHeading icon={Clock3} title="Record activity" />

            <div className="mt-4 space-y-0 border-t border-[#29323E]">
                <PaymentRow title="Created" value={dateTime(created)} />

                <PaymentRow
                    title="Last updated"
                    value={dateTime(updated)}
                    last
                />
            </div>
        </section>
    );
}

/* =========================================================
   OPTIONAL MESSAGE
========================================================= */

function DonorMessage({ note }) {
    if (typeof note !== 'string' || !note.trim()) {
        return null;
    }

    return (
        <section className="min-w-0 border-t border-[#303A47] pt-6">
            <SectionHeading icon={Mail} title="Donor message" />

            <p className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-7 text-[#ADBBC9]">
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
                        donationIdOf(result) != null &&
                        String(donationIdOf(result)) !== String(donationId)
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
                        donationList(response).find(
                            (item) =>
                                String(donationIdOf(item)) ===
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

    const donorId = donorIdOf(donation);
    const campaignId = campaignIdOf(donation);

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
                subtitle="Contribution, donor and transaction information."
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/donations')}
                        className="inline-flex min-h-9 items-center gap-2 border border-[#35404E] px-3.5 text-[12px] font-medium text-[#C3CDD8] transition-colors hover:bg-[#202A35] hover:text-white"
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
                        <RefreshCw size={14} />
                        Try again
                    </button>
                </div>
            ) : donation ? (
                <div className="min-w-0">
                    <DonationSummary donation={donation} />

                    <div className="mt-7 grid min-w-0 grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.65fr)] xl:gap-9">
                        {/* PRIMARY INFORMATION */}
                        <div className="min-w-0 space-y-7">
                            <DonorSection
                                donation={donation}
                                onViewDonor={goToDonor}
                            />

                            <div className="border-t border-[#303A47]" />

                            <CampaignSection
                                donation={donation}
                                onViewCampaign={goToCampaign}
                            />
                        </div>

                        {/* PAYMENT & RECORD INFORMATION */}
                        <div className="min-w-0 space-y-6">
                            <PaymentDetails donation={donation} />

                            <RecordActivity donation={donation} />
                        </div>
                    </div>

                    <div className="mt-8">
                        <DonorMessage
                            note={donation.note ?? donation.message}
                        />
                    </div>
                </div>
            ) : (
                <div className="border-t border-[#303A47] py-12 text-center text-[13px] text-[#9AA6B5]">
                    Donation information is unavailable.
                </div>
            )}
        </main>
    );
}

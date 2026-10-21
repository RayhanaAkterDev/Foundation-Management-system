import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Check,
    Copy,
    CreditCard,
    FileText,
    Heart,
    Mail,
    ReceiptText,
    RotateCcw,
    UserRound,
    WalletCards,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { apiRequest } from '@/api/client';

// ============================================================
// HELPERS
// ============================================================

const donationIdOf = (donation) =>
    donation?.id ?? donation?.donation_id ?? null;

const donorIdOf = (donation) =>
    donation?.user?.id ??
    donation?.donor?.id ??
    donation?.user_id ??
    donation?.donor_id ??
    null;

const campaignIdOf = (donation) =>
    donation?.campaign?.id ?? donation?.campaign_id ?? null;

const transactionOf = (donation) =>
    donation?.transaction_id ??
    donation?.transactionId ??
    donation?.tran_id ??
    donation?.transaction ??
    null;

const paymentReceivedOf = (donation) =>
    donation?.payment_received_at ??
    donation?.paymentReceivedAt ??
    donation?.paid_at ??
    donation?.paidAt ??
    donation?.payment_date ??
    donation?.paymentDate ??
    donation?.received_at ??
    donation?.receivedAt ??
    donation?.created_at ??
    donation?.createdAt ??
    null;

const text = (value) => {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return value.name ?? value.title ?? value.label ?? '—';
    }

    return String(value);
};

const label = (value) => {
    const result = text(value);

    if (result === '—') return result;

    return result
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
};

const money = (value, currency = 'BDT') => {
    if (
        value === null ||
        value === undefined ||
        value === '' ||
        !Number.isFinite(Number(value))
    ) {
        return '—';
    }

    const formatted = Number(value).toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    });

    return String(currency).toUpperCase() === 'BDT'
        ? `৳${formatted}`
        : `${formatted} ${String(currency).toUpperCase()}`;
};

const formatDate = (value) => {
    if (!value || Number.isNaN(new Date(value).getTime())) {
        return '—';
    }

    return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const normalizeDonation = (response) => {
    const root = response?.data ?? response;

    if (!root || typeof root !== 'object' || Array.isArray(root)) {
        return null;
    }

    const donation = root.donation ?? root;

    return donation && typeof donation === 'object' && !Array.isArray(donation)
        ? donation
        : null;
};

const donationList = (response) => {
    const root = response?.data ?? response;

    if (Array.isArray(root)) return root;
    if (Array.isArray(root?.donations)) return root.donations;
    if (Array.isArray(root?.data)) return root.data;

    return [];
};

// ============================================================
// SHARED STYLES
// ============================================================

const panelClass =
    'min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]';

const sectionTitleClass =
    '!m-0 !font-sans !text-[15px] !font-semibold !tracking-[-0.015em] !text-[#EEF1F5]';

// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({ icon: Icon, title, action }) {
    return (
        <div
            className="
                -mx-5 -mt-5 mb-4
                flex min-h-15 flex-wrap
                items-center justify-between
                gap-x-4 gap-y-2
                border-b border-[#29323E]
                bg-[#171E28]
                px-5 py-3.5
                sm:-mx-6 sm:-mt-6
                sm:mb-5 sm:px-6
            "
        >
            <div className="flex min-w-0 items-center gap-3">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#92AAA9]"
                />

                <h2 className={sectionTitleClass}>{title}</h2>
            </div>

            {action}
        </div>
    );
}

// ============================================================
// TEXT ACTION
// ============================================================

function TextAction({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                inline-flex shrink-0
                items-center gap-1
                text-[12px] font-medium
                !text-[#9BCBC2]
                transition-colors
                hover:!text-[#D4F1EA]
            "
        >
            {children}
            <ArrowUpRight size={14} />
        </button>
    );
}

// ============================================================
// COPY BUTTON
// ============================================================

function CopyButton({ value }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (value == null || value === '—') return;

        try {
            if (!navigator.clipboard?.writeText) return;

            await navigator.clipboard.writeText(String(value));
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={value == null || value === '—'}
            title={copied ? 'Copied' : 'Copy reference'}
            aria-label={copied ? 'Copied reference' : 'Copy reference'}
            className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                border border-[#343E4B]
                bg-[#151C25]
                text-[#9BA9B9]
                transition-colors
                hover:border-[#53716D]
                hover:bg-[#1B2B2B]
                hover:text-[#B8E4DA]
                disabled:cursor-not-allowed
                disabled:opacity-35
            "
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
    );
}

// ============================================================
// PAYMENT ROW
// ============================================================

function PaymentRow({ name, value, mono = false, action, last = false }) {
    return (
        <div
            className={`
                grid min-w-0 gap-1.5 py-3.5
                sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1.2fr)]
                sm:items-center sm:gap-5
                ${last ? '' : 'border-b border-[#252D38]'}
            `}
        >
            <dt className="text-[12px] !text-[#8792A1]">{name}</dt>

            <dd className="!m-0 flex min-w-0 items-center gap-2">
                <span
                    className={`
                        min-w-0 flex-1
                        wrap-break-word
                        text-[12px] font-medium
                        !text-[#DCE4ED]
                        ${mono ? 'font-mono break-all' : ''}
                    `}
                >
                    {value === undefined || value === null || value === ''
                        ? '—'
                        : value}
                </span>

                {action}
            </dd>
        </div>
    );
}

// ============================================================
// DONATION SUMMARY
// ============================================================

function DonationSummary({ donation }) {
    const id = donationIdOf(donation);

    const status =
        donation.payment_status ?? donation.paymentStatus ?? donation.status;

    const paymentMethod = donation.payment_method ?? donation.paymentMethod;

    const currency = donation.currency ?? 'BDT';

    return (
        <section className="min-w-0 pb-5 sm:pb-6">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className="
                            text-[11px] font-semibold
                            uppercase tracking-[0.12em]
                            !text-[#8792A1]
                        "
                    >
                        Donation #{text(id)}
                    </span>

                    {status != null && status !== '' && (
                        <StatusBadge status={status} />
                    )}
                </div>

                <div
                    className="
                        mt-3 flex flex-wrap
                        items-baseline gap-x-4 gap-y-1.5
                    "
                >
                    <p
                        className="
                            !m-0 !font-sans
                            !text-[35px] !font-semibold
                            !leading-tight
                            !tracking-[-0.04em]
                            !text-[#EEF1F5]
                            sm:!text-[40px]
                        "
                    >
                        {money(donation.amount, currency)}
                    </p>

                    <span className="text-[12px] !text-[#8792A1]">
                        {String(currency).toUpperCase()}
                    </span>
                </div>
            </div>

            <div
                className="
                    mt-6 flex min-w-0 flex-wrap
                    items-center gap-x-6 gap-y-3
                    sm:pb-2
                "
            >
                <div className="flex min-w-0 items-center gap-2">
                    <CreditCard size={14} className="shrink-0 text-[#8EA7A6]" />

                    <span className="wrap-break-word text-[12px] !text-[#B8C5D2]">
                        {label(paymentMethod)}
                    </span>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// PAYMENT DETAILS
// ============================================================

function PaymentDetails({ donation }) {
    const transaction = transactionOf(donation);

    const paymentMethod = donation.payment_method ?? donation.paymentMethod;

    const receivedAt = paymentReceivedOf(donation);

    return (
        <section
            className={`
                ${panelClass}
                px-5 py-5
                sm:px-6 sm:py-6
            `}
        >
            <SectionHeading icon={CreditCard} title="Payment details" />

            <dl className="mt-1">
                <PaymentRow
                    name="Donation ID"
                    value={`#${text(donationIdOf(donation))}`}
                />

                <PaymentRow
                    name="Payment method"
                    value={label(paymentMethod)}
                />

                <PaymentRow
                    name="Currency"
                    value={String(donation.currency ?? 'BDT').toUpperCase()}
                />

                <PaymentRow
                    name="Payment received"
                    value={formatDate(receivedAt)}
                />

                <PaymentRow
                    name="Transaction reference"
                    mono
                    value={text(transaction)}
                    action={
                        transaction != null ? (
                            <CopyButton value={transaction} />
                        ) : null
                    }
                    last
                />
            </dl>
        </section>
    );
}

// ============================================================
// DONOR INFORMATION
// ============================================================

function DonorInformation({ donation, onView }) {
    const donor = donation.user ?? donation.donor ?? {};

    const name =
        donor.name ??
        donation.donor_name ??
        donation.donorName ??
        'Guest donor';

    const email = donor.email ?? donation.donor_email ?? donation.donorEmail;

    const photo = donor.photo ?? donor.avatar ?? donor.profile_photo;

    const donorId = donorIdOf(donation);

    const [failed, setFailed] = useState(false);

    const initials = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <section className="min-w-0">
            <SectionHeading
                icon={UserRound}
                title="Donor information"
                action={
                    donorId != null ? (
                        <TextAction onClick={onView}>View profile</TextAction>
                    ) : null
                }
            />

            <div className="flex min-w-0 items-center gap-3.5 py-3">
                <div
                    className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        overflow-hidden
                        border border-[#34414D]
                        bg-[#1B2934]
                        text-[13px] font-semibold
                        text-[#B8DAD4]
                    "
                >
                    {photo && !failed ? (
                        <img
                            src={photo}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={() => setFailed(true)}
                        />
                    ) : (
                        initials || 'D'
                    )}
                </div>

                <div className="min-w-0">
                    <h3
                        className="
                            !m-0 wrap-break-word
                            !font-sans !text-[13px]
                            !font-semibold !text-[#EEF1F5]
                        "
                    >
                        {name}
                    </h3>

                    <p className="mt-1 text-[11px] !text-[#8792A1]">
                        {donorId != null ? 'Registered donor' : 'Guest donor'}
                    </p>
                </div>
            </div>

            <div
                className="
                    mt-2 flex min-w-0 items-start gap-2.5
                    border-t border-[#252D38] pt-3.5
                "
            >
                <Mail size={14} className="mt-0.5 shrink-0 text-[#8792A1]" />

                <span className="min-w-0 break-all text-[12px] !text-[#B8C5D2]">
                    {text(email)}
                </span>
            </div>
        </section>
    );
}

// ============================================================
// CAMPAIGN INFORMATION
// ============================================================

function CampaignInformation({ donation, onView }) {
    const campaign = donation.campaign ?? {};

    const name =
        campaign.title ??
        campaign.name ??
        donation.campaign_title ??
        donation.campaignTitle ??
        'Campaign unavailable';

    const image = campaign.cover_image ?? campaign.image ?? campaign.thumbnail;

    const campaignId = campaignIdOf(donation);

    const [failed, setFailed] = useState(false);

    return (
        <section className="min-w-0">
            <div
                className="
                    flex flex-wrap items-center
                    justify-between gap-3
                "
            >
                <div className="flex min-w-0 items-center gap-2.5">
                    <Heart
                        size={15}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#92AAA9]"
                    />

                    <h3
                        className="
                            !m-0 !font-sans
                            !text-[13px] !font-semibold
                            !text-[#DCE5EE]
                        "
                    >
                        Supported campaign
                    </h3>
                </div>

                {campaignId != null && (
                    <TextAction onClick={onView}>View campaign</TextAction>
                )}
            </div>

            <div className="mt-4 flex min-w-0 items-center gap-3.5">
                {image && !failed ? (
                    <img
                        src={image}
                        alt=""
                        className="
                            h-14 w-18 shrink-0
                            border border-[#303B48]
                            object-cover
                        "
                        onError={() => setFailed(true)}
                    />
                ) : (
                    <div
                        className="
                            flex h-14 w-18 shrink-0
                            items-center justify-center
                            border border-[#303B48]
                            bg-[#19232D]
                            text-[#799A99]
                        "
                    >
                        <WalletCards size={20} strokeWidth={1.5} />
                    </div>
                )}

                <div className="min-w-0">
                    <h4
                        className="
                            !m-0 wrap-break-word
                            !font-sans !text-[13px]
                            !font-semibold !leading-5
                            !text-[#EEF1F5]
                        "
                    >
                        {name}
                    </h4>

                    <p className="mt-1 text-[11px] !text-[#8792A1]">
                        {campaignId == null
                            ? 'Campaign ID unavailable'
                            : `Campaign #${campaignId}`}
                    </p>
                </div>
            </div>
        </section>
    );
}

// ============================================================
// RELATED INFORMATION
// ============================================================

function RelatedInformation({ donation, onViewDonor, onViewCampaign }) {
    return (
        <aside
            className={`
                ${panelClass}
                px-5 py-5
                sm:px-6 sm:py-6
            `}
        >
            <DonorInformation donation={donation} onView={onViewDonor} />

            <div className="my-6 border-t border-[#29323E]" />

            <CampaignInformation donation={donation} onView={onViewCampaign} />
        </aside>
    );
}

// ============================================================
// DONOR MESSAGE
// ============================================================

function DonorMessage({ message }) {
    if (typeof message !== 'string' || !message.trim()) {
        return null;
    }

    return (
        <section
            className={`
                ${panelClass}
                px-5 py-5
                sm:px-6 sm:py-6
            `}
        >
            <SectionHeading icon={FileText} title="Donor message" />

            <div className="flex items-start gap-3 pt-2">
                <div
                    className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        border border-[#34414D]
                        bg-[#19242E]
                        text-[#9BCBC2]
                    "
                >
                    <Heart size={15} />
                </div>

                <p
                    className="
                        min-w-0 whitespace-pre-wrap
                        wrap-break-word
                        text-[13px] leading-6
                        !text-[#C0CCD8]
                    "
                >
                    {message.trim()}
                </p>
            </div>
        </section>
    );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function DonationDetails() {
    const { donationId } = useParams();
    const navigate = useNavigate();

    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryKey, setRetryKey] = useState(0);

    // --------------------------------------------------------
    // FETCH DONATION
    // --------------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');
            setDonation(null);

            try {
                if (!donationId) {
                    throw new Error('Donation ID is missing.');
                }

                let result = null;

                try {
                    result = normalizeDonation(
                        await apiRequest(
                            `/admin/donations/${encodeURIComponent(
                                donationId,
                            )}`,
                        ),
                    );

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

                    if (!canFallback) {
                        throw err;
                    }
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

        load();

        return () => {
            cancelled = true;
        };
    }, [donationId, retryKey]);

    // --------------------------------------------------------
    // NAVIGATION
    // --------------------------------------------------------

    const donorId = donorIdOf(donation);
    const campaignId = campaignIdOf(donation);

    const viewDonor = () => {
        if (donorId == null) return;

        navigate(`/admin/dashboard/users/${encodeURIComponent(donorId)}`);
    };

    const viewCampaign = () => {
        if (campaignId == null) return;

        navigate(
            `/admin/dashboard/campaigns/${encodeURIComponent(campaignId)}`,
        );
    };

    const goBack = () => {
        navigate('/admin/dashboard/donations');
    };

    const note = donation?.note ?? donation?.message;

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
        <main className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Donation Details"
                subtitle="Contribution and transaction information."
                action={
                    <button
                        type="button"
                        onClick={goBack}
                        className="
                            inline-flex min-h-10
                            items-center gap-2
                            border border-[#343E4B]
                            px-4 text-[12px]
                            font-medium !text-[#C3CDD8]
                            transition-colors
                            hover:border-[#506071]
                            hover:bg-[#202A35]
                            hover:!text-white
                        "
                    >
                        <ArrowLeft size={15} />
                        Back To Donations
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
                        className="
                            inline-flex min-h-10
                            items-center gap-2
                            border border-[#343E4B]
                            px-4 text-[12px]
                            !text-[#D6DFE9]
                            transition-colors
                            hover:bg-[#202A35]
                        "
                    >
                        <RotateCcw size={14} />
                        Try again
                    </button>
                </div>
            ) : donation ? (
                <div className="min-w-0 space-y-6">
                    <DonationSummary donation={donation} />

                    <div
                        className="
                            grid min-w-0
                            grid-cols-1
                            items-start gap-5
                            xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.85fr)]
                        "
                    >
                        <div className="min-w-0 space-y-5">
                            <PaymentDetails donation={donation} />
                            <DonorMessage message={note} />
                        </div>

                        <RelatedInformation
                            donation={donation}
                            onViewDonor={viewDonor}
                            onViewCampaign={viewCampaign}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className="
                        border border-[#29323E]
                        bg-[#0E1219]
                        px-6 py-12
                        text-center
                    "
                >
                    <ReceiptText size={24} className="mx-auto text-[#8792A1]" />

                    <p className="mt-4 text-[13px] !text-[#AAB3BF]">
                        Donation information is unavailable.
                    </p>
                </div>
            )}
        </main>
    );
}

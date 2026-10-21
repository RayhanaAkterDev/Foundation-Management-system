import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    Building2,
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

const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) return '—';

    return `৳${amount.toLocaleString('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

const formatDateTime = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString('en-BD', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

const formatLabel = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const textOf = (value) => {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return value.name || value.title || value.label || '—';
    }

    return String(value);
};

const getDonationId = (donation) =>
    donation?.id ?? donation?.donation_id ?? null;

const getDonorId = (donation) =>
    donation?.user?.id ??
    donation?.donor?.id ??
    donation?.user_id ??
    donation?.donor_id ??
    null;

const getCampaignId = (donation) =>
    donation?.campaign?.id ?? donation?.campaign_id ?? null;

const getTransactionId = (donation) =>
    donation?.transaction_id ||
    donation?.transactionId ||
    donation?.tran_id ||
    donation?.transaction ||
    null;

const normalizeDonation = (response) => {
    if (!response || typeof response !== 'object') {
        return null;
    }

    const root = response?.data ?? response;

    if (!root || typeof root !== 'object' || Array.isArray(root)) {
        return null;
    }

    const donation = root.donation ?? root.data?.donation ?? root;

    if (!donation || typeof donation !== 'object' || Array.isArray(donation)) {
        return null;
    }

    return donation;
};

const getDonationList = (response) => {
    if (Array.isArray(response)) return response;

    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.donations)) return data.donations;
    if (Array.isArray(data?.data)) return data.data;

    return [];
};

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ icon: Icon, title, action }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#29323E] pb-4">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#91A1B2]"
                />

                <h2 className="m-0! font-sans! text-[15px]! font-semibold! tracking-[-0.015em]! text-[#DDE5EE]!">
                    {title}
                </h2>
            </div>

            {action}
        </div>
    );
}

/* =========================================================
   DETAIL LINK
========================================================= */

function DetailLink({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                inline-flex min-h-9 shrink-0 items-center gap-1.5
                border border-[#35404E] bg-[#19222D]
                px-3 text-[12px] font-medium
                text-[#BFCBD8] transition-colors
                hover:border-[#4B596A] hover:bg-[#222E3B]
                hover:text-[#EEF1F5]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#4B596A]
            "
        >
            {children}
            <ArrowUpRight size={13} strokeWidth={1.8} />
        </button>
    );
}

/* =========================================================
   SHARED SECTION
========================================================= */

function DetailSection({ children, className = '' }) {
    return (
        <section
            className={`
                min-w-0 border border-[#29323E]
                bg-[#0E1219] px-5 py-5
                sm:px-6 sm:py-6
                ${className}
            `}
        >
            {children}
        </section>
    );
}

/* =========================================================
   DONOR AVATAR
========================================================= */

function DonorAvatar({ name, photo }) {
    const [failedPhoto, setFailedPhoto] = useState(null);

    const initials = String(name || 'D')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-[#394656] bg-[#222E3B] text-[15px] font-semibold text-[#D9E2EB]">
            {photo && failedPhoto !== photo ? (
                <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setFailedPhoto(photo)}
                />
            ) : (
                initials || <UserRound size={20} />
            )}
        </div>
    );
}

/* =========================================================
   INFORMATION FIELD
========================================================= */

function InfoField({ icon: Icon, label, value }) {
    const displayValue =
        value === null || value === undefined || value === '' ? '—' : value;

    return (
        <div className="min-w-0 py-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#8290A1]">
                {Icon && (
                    <Icon size={13} strokeWidth={1.7} className="shrink-0" />
                )}

                <span>{label}</span>
            </div>

            <div className="mt-1.5 min-w-0 break-words text-[13px] font-medium leading-6 text-[#D6DFE9]">
                {displayValue}
            </div>
        </div>
    );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({ label, value, last = false }) {
    return (
        <div
            className={`
                grid min-w-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]
                items-start gap-3 py-3.5
                ${last ? '' : 'border-b border-[#27313D]'}
            `}
        >
            <span className="text-[12px] leading-5 text-[#8997A8]">
                {label}
            </span>

            <div className="min-w-0 break-words text-right text-[12px] font-medium leading-5 text-[#CDD7E2]">
                {value === null || value === undefined || value === ''
                    ? '—'
                    : value}
            </div>
        </div>
    );
}

/* =========================================================
   DONATION SUMMARY
========================================================= */

function DonationSummary({
    donation,
    donationId,
    createdAt,
    paymentMethod,
    paymentStatus,
}) {
    const id = getDonationId(donation) ?? donationId;

    return (
        <section className="relative min-w-0 overflow-hidden border border-[#29323E] bg-[#101720]">
            <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[2px] bg-[#72869A]"
            />

            <div className="flex min-w-0 flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8999AA]">
                            Donation amount
                        </span>

                        <span className="text-[12px] text-[#77889A]">
                            Donation #{id ?? '—'}
                        </span>
                    </div>

                    <div className="mt-2 break-words text-[32px] font-semibold leading-tight tracking-[-0.035em] text-[#E7EDF4] sm:text-[36px]">
                        {formatAmount(donation.amount)}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#9AA8B8]">
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays size={14} strokeWidth={1.7} />
                            {formatDateTime(createdAt)}
                        </span>

                        {paymentMethod && (
                            <span className="inline-flex items-center gap-2">
                                <WalletCards size={14} strokeWidth={1.7} />
                                {formatLabel(paymentMethod)}
                            </span>
                        )}
                    </div>
                </div>

                {paymentStatus && (
                    <div className="shrink-0 self-start lg:self-center">
                        <StatusBadge status={paymentStatus} />
                    </div>
                )}
            </div>
        </section>
    );
}

/* =========================================================
   DONOR INFORMATION
========================================================= */

function DonorInformation({
    donorName,
    donorPhoto,
    registeredDonor,
    donorEmail,
    donorPhone,
    donorId,
    onViewDonor,
}) {
    return (
        <DetailSection>
            <SectionHeader
                icon={UserRound}
                title="Donor information"
                action={
                    donorId != null ? (
                        <DetailLink onClick={onViewDonor}>
                            View profile
                        </DetailLink>
                    ) : null
                }
            />

            <div className="flex min-w-0 items-center gap-3.5 border-b border-[#29323E] py-5">
                <DonorAvatar name={donorName} photo={donorPhoto} />

                <div className="min-w-0">
                    <h3 className="m-0! break-words font-sans! text-[16px]! font-semibold! text-[#E1E8F0]!">
                        {donorName}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#91A0B0]">
                        {registeredDonor ? 'Registered donor' : 'Guest donor'}
                    </p>
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2">
                <InfoField
                    icon={Mail}
                    label="Email address"
                    value={donorEmail}
                />

                <InfoField
                    icon={Phone}
                    label="Phone number"
                    value={donorPhone}
                />
            </div>
        </DetailSection>
    );
}

/* =========================================================
   CAMPAIGN INFORMATION
========================================================= */

function CampaignInformation({
    campaignTitle,
    campaignId,
    campaignCategory,
    campaignLocation,
    campaignDescription,
    organization,
    onViewCampaign,
}) {
    const hasDescription =
        typeof campaignDescription === 'string' &&
        campaignDescription.trim().length > 0;

    return (
        <DetailSection>
            <SectionHeader
                icon={Building2}
                title="Supported campaign"
                action={
                    campaignId != null ? (
                        <DetailLink onClick={onViewCampaign}>
                            View campaign
                        </DetailLink>
                    ) : null
                }
            />

            <div className="min-w-0 border-b border-[#29323E] py-5">
                <h3 className="m-0! break-words font-sans! text-[17px]! font-semibold! leading-7! tracking-[-0.02em]! text-[#E3EAF2]!">
                    {campaignTitle}
                </h3>

                {organization && (
                    <p className="mt-2 break-words text-[12px] leading-5 text-[#91A0B0]">
                        Organized by {organization}
                    </p>
                )}

                <div className="mt-5">
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#8290A1]">
                        <FileText size={13} strokeWidth={1.7} />
                        Campaign description
                    </div>

                    {hasDescription ? (
                        <p className="mt-2 whitespace-pre-line break-words text-[13px] leading-7 text-[#B9C5D2]">
                            {campaignDescription.trim()}
                        </p>
                    ) : (
                        <p className="mt-2 text-[13px] italic leading-6 text-[#748294]">
                            No campaign description is available.
                        </p>
                    )}
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-x-6 sm:grid-cols-3">
                <InfoField
                    icon={Hash}
                    label="Campaign ID"
                    value={campaignId != null ? `#${campaignId}` : '—'}
                />

                <InfoField
                    icon={Tag}
                    label="Category"
                    value={textOf(campaignCategory)}
                />

                <InfoField
                    icon={MapPin}
                    label="Location"
                    value={textOf(campaignLocation)}
                />
            </div>
        </DetailSection>
    );
}

/* =========================================================
   PAYMENT DETAILS
========================================================= */

function PaymentOverview({ donation, transactionId }) {
    const currency = donation.currency
        ? String(donation.currency).toUpperCase()
        : 'BDT';

    return (
        <DetailSection>
            <SectionHeader icon={CreditCard} title="Payment details" />

            <div className="pt-1">
                <DetailRow
                    label="Transaction ID"
                    value={
                        transactionId ? (
                            <span className="break-all font-mono text-[11px]">
                                {textOf(transactionId)}
                            </span>
                        ) : (
                            '—'
                        )
                    }
                />

                <DetailRow label="Currency" value={currency} last />
            </div>
        </DetailSection>
    );
}

/* =========================================================
   DONATION RECORD
========================================================= */

function DonationRecord({ createdAt, updatedAt }) {
    return (
        <DetailSection>
            <SectionHeader icon={FileText} title="Record history" />

            <div className="pt-1">
                <DetailRow
                    label="Created on"
                    value={formatDateTime(createdAt)}
                />

                <DetailRow
                    label="Last updated"
                    value={formatDateTime(updatedAt)}
                    last
                />
            </div>
        </DetailSection>
    );
}

/* =========================================================
   DONOR NOTE
========================================================= */

function DonorNote({ note }) {
    if (!note) return null;

    return (
        <DetailSection>
            <SectionHeader icon={FileText} title="Donor note" />

            <p className="mt-4 whitespace-pre-wrap break-words text-[13px] leading-7 text-[#B9C5D2]">
                {note}
            </p>
        </DetailSection>
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

    /* -----------------------------------------------------
       LOAD DONATION
    ----------------------------------------------------- */

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
                } catch (detailError) {
                    const status =
                        detailError?.status ?? detailError?.response?.status;

                    const message = String(
                        detailError?.message ?? '',
                    ).toLowerCase();

                    const endpointUnavailable =
                        status === 404 ||
                        status === 405 ||
                        message.includes('404') ||
                        message.includes('not found') ||
                        message.includes('route not found');

                    if (!endpointUnavailable) {
                        throw detailError;
                    }
                }

                if (!result) {
                    const response = await apiRequest('/admin/donations');
                    const donations = getDonationList(response);

                    result =
                        donations.find(
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
                        err?.message || 'Unable to load donation information.',
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

    /* -----------------------------------------------------
       DERIVED INFORMATION
    ----------------------------------------------------- */

    const donor = donation?.user || donation?.donor || null;
    const campaign = donation?.campaign || null;

    const donorId = getDonorId(donation);
    const campaignId = getCampaignId(donation);

    const donorName =
        donor?.name ||
        donation?.donor_name ||
        donation?.donorName ||
        'Guest donor';

    const donorEmail =
        donor?.email || donation?.donor_email || donation?.donorEmail || null;

    const donorPhone =
        donor?.phone || donation?.donor_phone || donation?.donorPhone || null;

    const donorPhoto = donor?.photo || donor?.avatar || null;

    const campaignTitle =
        campaign?.title ||
        campaign?.name ||
        donation?.campaign_title ||
        donation?.campaignTitle ||
        'Campaign unavailable';

    const campaignCategory =
        campaign?.category ?? donation?.campaign_category ?? null;

    const campaignLocation =
        campaign?.location ||
        campaign?.district ||
        campaign?.address ||
        donation?.campaign_location ||
        null;

    const campaignDescription =
        campaign?.description ||
        campaign?.details ||
        campaign?.campaign_description ||
        donation?.campaign_description ||
        donation?.campaignDescription ||
        null;

    const organization =
        campaign?.organization?.name ||
        campaign?.organization_name ||
        donation?.organization_name ||
        null;

    const paymentMethod =
        donation?.payment_method || donation?.paymentMethod || null;

    const paymentStatus =
        donation?.payment_status ||
        donation?.paymentStatus ||
        donation?.status ||
        null;

    const transactionId = getTransactionId(donation);

    const createdAt = donation?.created_at || donation?.createdAt || null;

    const updatedAt = donation?.updated_at || donation?.updatedAt || null;

    const note = donation?.note || donation?.message || null;
    const registeredDonor = donorId != null;

    /* -----------------------------------------------------
       NAVIGATION
    ----------------------------------------------------- */

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

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <main className="min-w-0 space-y-5 pb-10 font-sans">
            <PageHeader
                title="Donation Details"
                subtitle="Review the contribution, donor, campaign and transaction."
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/donations')}
                        className="
                            inline-flex min-h-10 shrink-0
                            items-center justify-center gap-2
                            border border-[#343E4B]
                            bg-transparent px-3.5
                            text-[12px] font-medium
                            text-[#B8C2CF] transition-colors
                            hover:border-[#4B596A]
                            hover:bg-[#1C232D]
                            hover:text-[#F1F5F9]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#4B596A]
                        "
                    >
                        <ArrowLeft size={15} strokeWidth={1.8} />
                        All Donations
                    </button>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading donation details..."
                    description="Retrieving contribution and transaction information."
                />
            ) : error ? (
                <div className="space-y-4">
                    <LoadingError
                        title="Unable to load donation details"
                        message={error}
                    />

                    <button
                        type="button"
                        onClick={() => setRetryKey((current) => current + 1)}
                        className="
                            inline-flex min-h-9 items-center gap-2
                            border border-[#35404E]
                            bg-[#151C25] px-3
                            text-[12px] text-[#D7E0EA]
                            transition-colors hover:bg-[#1C2631]
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#4B596A]
                        "
                    >
                        <RotateCcw size={14} />
                        Try again
                    </button>
                </div>
            ) : donation ? (
                <div className="min-w-0 space-y-5">
                    {/* Primary donation information */}

                    <DonationSummary
                        donation={donation}
                        donationId={donationId}
                        createdAt={createdAt}
                        paymentMethod={paymentMethod}
                        paymentStatus={paymentStatus}
                    />

                    {/* Donor and campaign first, supporting details second */}

                    <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
                        <div className="min-w-0 space-y-5">
                            <DonorInformation
                                donorName={donorName}
                                donorPhoto={donorPhoto}
                                registeredDonor={registeredDonor}
                                donorEmail={donorEmail}
                                donorPhone={donorPhone}
                                donorId={donorId}
                                onViewDonor={goToDonor}
                            />

                            <CampaignInformation
                                campaignTitle={campaignTitle}
                                campaignId={campaignId}
                                campaignCategory={campaignCategory}
                                campaignLocation={campaignLocation}
                                campaignDescription={campaignDescription}
                                organization={organization}
                                onViewCampaign={goToCampaign}
                            />
                        </div>

                        <div className="min-w-0 space-y-5">
                            <PaymentOverview
                                donation={donation}
                                transactionId={transactionId}
                            />

                            <DonationRecord
                                createdAt={createdAt}
                                updatedAt={updatedAt}
                            />
                        </div>
                    </div>

                    <DonorNote note={note} />
                </div>
            ) : (
                <div className="border border-[#29323E] bg-[#0E1219] px-6 py-12 text-center text-[13px] text-[#9AA6B5]">
                    Donation information is unavailable.
                </div>
            )}
        </main>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye, HandCoins, CreditCard, CalendarDays } from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';

/* ==========================================================================
   HELPERS
============================================================================ */

const money = (value) =>
    `৳${Number(value || 0).toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    })}`;

const donorName = (donation) =>
    donation?.user?.name ||
    donation?.donor?.name ||
    donation?.donor_name ||
    'Guest donor';

const donorEmail = (donation) =>
    donation?.user?.email ||
    donation?.donor?.email ||
    donation?.donor_email ||
    'Guest donation';

const campaignName = (donation) =>
    donation?.campaign?.title ||
    donation?.campaign?.name ||
    donation?.campaign_title ||
    'Campaign unavailable';

const paymentName = (donation) =>
    String(
        donation?.payment_method || donation?.paymentMethod || 'Not specified',
    )
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-BD', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
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

/* ==========================================================================
   DONOR AVATAR
============================================================================ */

const DonorAvatar = ({ donation, mobile = false }) => {
    const [failedPhoto, setFailedPhoto] = useState(null);

    const person = donation?.user || donation?.donor;

    const photo =
        typeof person?.photo === 'string' && person.photo.trim()
            ? person.photo.trim()
            : null;

    const showPhoto = Boolean(photo) && failedPhoto !== photo;

    const initial = donorName(donation).trim().charAt(0).toUpperCase() || 'D';

    return (
        <div
            className={`
                flex shrink-0 items-center justify-center
                overflow-hidden border border-[#29323E]
                bg-[#151B24]
                ${mobile ? 'h-10 w-10' : 'h-8 w-8'}
            `}
        >
            {showPhoto ? (
                <img
                    src={photo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedPhoto(photo)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span
                    className={`
                        font-semibold! uppercase text-[#B8C0CA]
                        ${mobile ? 'text-[12px]' : 'text-[10px]'}
                    `}
                >
                    {initial}
                </span>
            )}
        </div>
    );
};

/* ==========================================================================
   MOBILE DONATION ROW
============================================================================ */

const MobileDonationRow = ({
    donation,
    onViewDonation,
    onViewDonor,
    onViewCampaign,
}) => {
    const hasDonor = getDonorId(donation) != null;
    const hasCampaign = getCampaignId(donation) != null;
    const hasDonation = getDonationId(donation) != null;

    return (
        <article
            className="
                border-b border-[#202832]
                bg-[#0E1219] px-4 py-4
                transition-colors duration-150
                last:border-b-0
                hover:bg-[#111720]
            "
        >
            {/* DONOR AND AMOUNT */}

            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <DonorAvatar donation={donation} mobile />

                    <div className="min-w-0 flex-1">
                        <button
                            type="button"
                            disabled={!hasDonor}
                            onClick={() => onViewDonor(donation)}
                            title={donorName(donation)}
                            className="
                                block max-w-full truncate
                                text-left text-[13px]
                                font-semibold! text-[#EEF1F5]
                                transition-colors
                                enabled:hover:text-white
                                disabled:cursor-default
                                focus:outline-none focus:ring-0
                            "
                        >
                            {donorName(donation)}
                        </button>

                        <p
                            title={donorEmail(donation)}
                            className="
                                mt-0.5 truncate
                                text-[11px] text-[#7F8A99]
                            "
                        >
                            {donorEmail(donation)}
                        </p>
                    </div>
                </div>

                <span
                    className="
                        shrink-0 whitespace-nowrap
                        text-[13px] font-semibold!
                        tabular-nums text-[#EEF1F5]
                    "
                >
                    {money(donation.amount)}
                </span>
            </div>

            {/* CAMPAIGN */}

            <div className="mt-3 ml-[52px] min-w-0">
                <button
                    type="button"
                    disabled={!hasCampaign}
                    onClick={() => onViewCampaign(donation)}
                    title={campaignName(donation)}
                    className="
                        block max-w-full truncate
                        text-left text-[12px]
                        font-medium! text-[#B8C0CA]
                        transition-colors
                        enabled:hover:text-[#EEF1F5]
                        disabled:cursor-default
                        focus:outline-none focus:ring-0
                    "
                >
                    {campaignName(donation)}
                </button>
            </div>

            {/* PAYMENT AND DATE */}

            <div
                className="
                    mt-3 ml-[52px]
                    flex flex-wrap items-center
                    gap-x-4 gap-y-2
                    border-t border-[#1B232D]
                    pt-3
                "
            >
                <span
                    className="
                        inline-flex min-w-0 items-center
                        gap-1.5 text-[11px] text-[#8792A1]
                    "
                >
                    <CreditCard
                        size={13}
                        strokeWidth={1.7}
                        className="shrink-0"
                    />

                    <span className="truncate">{paymentName(donation)}</span>
                </span>

                <span
                    className="
                        inline-flex items-center gap-1.5
                        whitespace-nowrap
                        text-[11px] text-[#8792A1]
                    "
                >
                    <CalendarDays size={13} strokeWidth={1.7} />

                    {formatDate(donation.created_at || donation.createdAt)}
                </span>
            </div>

            {/* VIEW ACTION */}

            <div
                className="
                    mt-3 ml-[52px]
                    border-t border-[#1B232D]
                    pt-3
                "
            >
                <button
                    type="button"
                    disabled={!hasDonation}
                    onClick={() => onViewDonation(donation)}
                    className="
                        inline-flex h-8 items-center gap-2
                        border border-[#29323E]
                        bg-[#151B24] px-3
                        text-[11px] font-medium!
                        text-[#AEB7C3]
                        transition-colors duration-150
                        hover:border-[#394555]
                        hover:bg-[#1A222D]
                        hover:text-[#EEF1F5]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        focus:outline-none focus:ring-0
                    "
                >
                    <Eye size={13} strokeWidth={1.8} />
                    View donation
                </button>
            </div>
        </article>
    );
};

/* ==========================================================================
   DONATION TABLE
============================================================================ */

const DonationTable = ({ rows = [], onSort, getSortIcon, resultCount }) => {
    const navigate = useNavigate();

    /* ----------------------------------------------------------------------
       NAVIGATION HANDLERS
    ---------------------------------------------------------------------- */

    const handleViewDonation = (donation) => {
        const donationId = getDonationId(donation);

        if (donationId == null) return;

        navigate(
            `/admin/dashboard/donations/${encodeURIComponent(donationId)}`,
        );
    };

    const handleViewDonor = (donation) => {
        const donorId = getDonorId(donation);

        if (donorId == null) return;

        navigate(`/admin/dashboard/users/${encodeURIComponent(donorId)}`);
    };

    const handleViewCampaign = (donation) => {
        const campaignId = getCampaignId(donation);

        if (campaignId == null) return;

        navigate(
            `/admin/dashboard/campaigns/${encodeURIComponent(campaignId)}`,
        );
    };

    /* ----------------------------------------------------------------------
       TABLE COLUMNS
    ---------------------------------------------------------------------- */

    const columns = [
        /* SERIAL NUMBER */

        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',

            render: (value) => (
                <span
                    className="
                        text-[11px] font-medium!
                        tabular-nums text-[#697586]
                    "
                >
                    {String(value).padStart(2, '0')}
                </span>
            ),
        },

        /* DONOR */

        {
            key: 'donorName',
            header: 'Donor',
            sortable: true,
            sortKey: 'donor',
            width: 'minmax(190px, 1.4fr)',

            render: (_, donation) => {
                const hasDonor = getDonorId(donation) != null;

                return (
                    <div
                        className="
                            flex min-w-0 max-w-[260px]
                            items-center gap-3
                        "
                    >
                        <DonorAvatar donation={donation} />

                        <div className="min-w-0">
                            <button
                                type="button"
                                disabled={!hasDonor}
                                onClick={() => handleViewDonor(donation)}
                                title={donorName(donation)}
                                className="
                                    block max-w-full truncate
                                    text-left text-[12px]
                                    font-semibold! leading-5
                                    text-[#EEF1F5]
                                    transition-colors duration-150
                                    enabled:hover:text-white
                                    disabled:cursor-default
                                    focus:outline-none focus:ring-0
                                "
                            >
                                {donorName(donation)}
                            </button>

                            <p
                                title={donorEmail(donation)}
                                className="
                                    mt-0.5 truncate
                                    text-[10px] leading-4
                                    text-[#697586]
                                "
                            >
                                {donorEmail(donation)}
                            </p>
                        </div>
                    </div>
                );
            },
        },

        /* CAMPAIGN */

        {
            key: 'campaignName',
            header: 'Campaign',
            sortable: true,
            sortKey: 'campaign',
            width: 'minmax(190px, 1.5fr)',

            render: (_, donation) => {
                const hasCampaign = getCampaignId(donation) != null;

                return (
                    <button
                        type="button"
                        disabled={!hasCampaign}
                        onClick={() => handleViewCampaign(donation)}
                        title={campaignName(donation)}
                        className="
                            block max-w-full truncate
                            text-left text-[11px]
                            font-medium! leading-5
                            text-[#B8C0CA]
                            transition-colors duration-150
                            enabled:hover:text-[#EEF1F5]
                            disabled:cursor-default
                            focus:outline-none focus:ring-0
                        "
                    >
                        {campaignName(donation)}
                    </button>
                );
            },
        },

        /* AMOUNT */

        {
            key: 'amount',
            header: 'Amount',
            sortable: true,
            sortKey: 'amount',
            width: 'minmax(100px, 0.7fr)',

            render: (_, donation) => (
                <span
                    className="
                        whitespace-nowrap
                        text-[12px] font-semibold!
                        tabular-nums text-[#EEF1F5]
                    "
                >
                    {money(donation.amount)}
                </span>
            ),
        },

        /* PAYMENT METHOD */

        {
            key: 'paymentName',
            header: 'Payment',
            sortable: true,
            sortKey: 'payment',
            width: 'minmax(130px, 0.85fr)',

            render: (_, donation) => (
                <span
                    title={paymentName(donation)}
                    className="
                        block max-w-full truncate
                        text-[11px] font-medium!
                        text-[#AEB7C3]
                    "
                >
                    {paymentName(donation)}
                </span>
            ),
        },

        /* DATE */

        {
            key: 'created_at',
            header: 'Date',
            sortable: true,
            sortKey: 'created_at',
            width: 'minmax(115px, 0.7fr)',

            render: (_, donation) => (
                <span
                    className="
                        whitespace-nowrap
                        text-[11px] font-medium!
                        text-[#8792A1]
                    "
                >
                    {formatDate(donation.created_at || donation.createdAt)}
                </span>
            ),
        },

        /* ACTIONS */

        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '78px',

            render: (_, donation) => {
                const hasDonation = getDonationId(donation) != null;

                return (
                    <button
                        type="button"
                        title="View donation"
                        aria-label={`View donation from ${donorName(donation)}`}
                        disabled={!hasDonation}
                        onClick={() => handleViewDonation(donation)}
                        className="
                            inline-flex h-7 w-7
                            shrink-0 items-center justify-center
                            border border-transparent
                            bg-transparent
                            text-[#8792A1]
                            transition-colors duration-150
                            hover:border-[#303A47]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]
                            focus:outline-none focus:ring-0
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <Eye size={14} strokeWidth={1.8} />
                    </button>
                );
            },
        },
    ];

    /* ----------------------------------------------------------------------
       MOBILE EMPTY STATE
    ---------------------------------------------------------------------- */

    const mobileEmptyState = (
        <div
            className="
                flex min-h-[260px]
                items-center justify-center
                bg-[#0E1219]
                px-6 py-10
            "
        >
            <div className="text-center">
                <div
                    className="
                        mx-auto flex h-10 w-10
                        items-center justify-center
                        border border-[#29323E]
                        bg-[#151B24]
                    "
                >
                    <HandCoins
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#697586]"
                    />
                </div>

                <p
                    className="
                        mt-3 text-[13px]
                        font-semibold! text-[#EEF1F5]
                    "
                >
                    No donations found
                </p>

                <p
                    className="
                        mt-1 text-[11px]
                        leading-5 text-[#697586]
                    "
                >
                    Try changing your search or filters.
                </p>
            </div>
        </div>
    );

    /* ----------------------------------------------------------------------
       RENDER
    ---------------------------------------------------------------------- */

    return (
        <>
            {/* MOBILE DONATION DIRECTORY */}

            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? mobileEmptyState
                    : rows.map((donation, index) => (
                          <MobileDonationRow
                              key={getDonationId(donation) ?? index}
                              donation={donation}
                              onViewDonation={handleViewDonation}
                              onViewDonor={handleViewDonor}
                              onViewCampaign={handleViewCampaign}
                          />
                      ))}
            </div>

            {/* DESKTOP — SHARED DATA TABLE */}

            <div
                className="
                    hidden min-w-0
                    bg-[#0E1219]
                    lg:block
                "
            >
                <DataTable
                    columns={columns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: HandCoins,
                        title: 'No donations found',
                        message: 'Try changing your search or payment filter.',
                    }}
                />
            </div>
        </>
    );
};

export default DonationTable;

import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import DonationSummary from './components/DonationSummary';
import DonationTable from './components/DonationTable';
import DonationFilters from './components/DonationFilters';
import DonationPagination from './components/DonationPagination';

import { apiRequest } from '@/api/client';

const PER_PAGE = 25;

const getDonorName = (d) =>
    d?.user?.name || d?.donor?.name || d?.donor_name || 'Guest donor';

const getCampaignName = (d) =>
    d?.campaign?.title ||
    d?.campaign?.name ||
    d?.campaign_title ||
    'Campaign unavailable';

const getPaymentMethod = (d) =>
    String(d?.payment_method || d?.paymentMethod || 'Not specified')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

const getTimestamp = (d) =>
    new Date(d?.created_at || d?.createdAt || 0).getTime() || 0;

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retry, setRetry] = useState(0);

    const [search, setSearch] = useState('');
    const [method, setMethod] = useState('all');

    const [sort, setSort] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [page, setPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // LOAD DONATIONS

    useEffect(() => {
        let active = true;

        const loadDonations = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await apiRequest('/admin/donations');

                const data = Array.isArray(response)
                    ? response
                    : response?.donations || response?.data || [];

                if (active) {
                    setDonations(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (active) {
                    setError(err?.message || 'Unable to load donations.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadDonations();

        return () => {
            active = false;
        };
    }, [retry]);

    // SUMMARY — UNCHANGED

    const summary = useMemo(() => {
        const totalAmount = donations.reduce((sum, d) => {
            const amount = Number(d.amount);
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);

        return {
            totalAmount,
            totalDonations: donations.length,
            averageDonation: donations.length
                ? totalAmount / donations.length
                : 0,
        };
    }, [donations]);

    // FILTER AND SORT

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = donations.filter((d) => {
            const fields = [
                getDonorName(d),
                d?.user?.email,
                d?.donor?.email,
                d?.donor_email,
                getCampaignName(d),
                getPaymentMethod(d),
                d?.transaction_id,
                d?.transactionId,
                d?.id,
            ];

            const matchesMethod =
                method === 'all' || getPaymentMethod(d) === method;

            const matchesSearch =
                !query ||
                fields.some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(query),
                );

            return matchesMethod && matchesSearch;
        });

        if (!sort.key || !sort.direction) return result;

        const getSortValue = (d) => {
            switch (sort.key) {
                case 'donor':
                    return getDonorName(d);
                case 'campaign':
                    return getCampaignName(d);
                case 'payment':
                    return getPaymentMethod(d);
                case 'amount':
                    return Number(d.amount) || 0;
                default:
                    return getTimestamp(d);
            }
        };

        return result.sort((a, b) => {
            const first = getSortValue(a);
            const second = getSortValue(b);

            const comparison =
                typeof first === 'number'
                    ? first - second
                    : String(first).localeCompare(String(second));

            return comparison * (sort.direction === 'asc' ? 1 : -1);
        });
    }, [donations, search, method, sort]);

    // PAGINATION

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

    const currentPage = Math.min(page, totalPages);

    const rows = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;

        return filtered
            .slice(start, start + PER_PAGE)
            .map((donation, index) => ({
                ...donation,
                serialNumber: start + index + 1,
            }));
    }, [filtered, currentPage]);

    // HANDLERS

    const handleSort = (key) => {
        setSort((current) => {
            if (current.key !== key) {
                return { key, direction: 'asc' };
            }

            if (current.direction === 'asc') {
                return { key, direction: 'desc' };
            }

            return { key: null, direction: null };
        });

        setPage(1);
    };

    const getSortIcon = (key) => {
        if (sort.key !== key || !sort.direction) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        return sort.direction === 'asc' ? (
            <ArrowUp size={14} strokeWidth={2} />
        ) : (
            <ArrowDown size={14} strokeWidth={2} />
        );
    };

    const changeMethod = (value) => {
        setMethod(value);
        setPage(1);
        setMobileFiltersOpen(false);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch('');
        setPage(1);
    };

    const exportCSV = () => {
        if (!filtered.length) return;

        const records = [
            [
                'Donor',
                'Email',
                'Campaign',
                'Amount',
                'Payment',
                'Date',
                'Transaction ID',
            ],
            ...filtered.map((d) => [
                getDonorName(d),
                d?.user?.email || d?.donor?.email || d?.donor_email || '',
                getCampaignName(d),
                d.amount,
                getPaymentMethod(d),
                d.created_at || d.createdAt || '',
                d.transaction_id || d.transactionId || '',
            ]),
        ];

        const csv = records
            .map((row) =>
                row
                    .map(
                        (value) =>
                            `"${String(value ?? '').replace(/"/g, '""')}"`,
                    )
                    .join(','),
            )
            .join('\r\n');

        const url = URL.createObjectURL(
            new Blob(['\uFEFF', csv], {
                type: 'text/csv;charset=utf-8',
            }),
        );

        const link = document.createElement('a');
        link.href = url;
        link.download = 'stand-for-people-donations.csv';

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const filters = (
        <DonationFilters
            donations={donations}
            method={method}
            onMethodChange={changeMethod}
            onClear={() => changeMethod('all')}
        />
    );

    return (
        <>
            <div className="min-w-0 space-y-12 pb-8 lg:space-y-14">
                {/* PAGE HEADER */}

                <PageHeader
                    title="Donations"
                    subtitle="Monitor contributions and funds received through the platform."
                    action={
                        !loading &&
                        !error && (
                            <button
                                type="button"
                                disabled={!filtered.length}
                                onClick={exportCSV}
                                className="
                  group inline-flex h-10 items-center
                  justify-center gap-2
                  border border-[#343E4B]
                  bg-transparent px-3.5
                  text-[12px] font-medium!
                  text-[#B8C2CF]
                  transition-colors duration-150
                  hover:border-[#4B596A]
                  hover:bg-[#1C232D]
                  hover:text-[#EEF1F5]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#697586]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                            >
                                <Download
                                    size={15}
                                    strokeWidth={1.8}
                                    className="text-[#8492A3] group-hover:text-[#D5DDE6]"
                                />
                                Export CSV
                            </button>
                        )
                    }
                />

                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading donations..."
                        description="Retrieving donation records."
                    />
                ) : error ? (
                    <div className="space-y-4">
                        <LoadingError
                            title="Unable to load donations"
                            message={error}
                        />

                        <button
                            type="button"
                            onClick={() => setRetry((n) => n + 1)}
                            className="border border-[#343E4B] px-4 py-2 text-[12px] text-[#EEF1F5]"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* DONATION OVERVIEW */}

                        <section>
                            <h2 className="mb-5 font-sans! text-[18px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                                Donation overview
                            </h2>

                            <DonationSummary summary={summary} />
                        </section>

                        {/* DONATION DIRECTORY */}

                        <section className="min-w-0 pt-1 lg:pt-2">
                            <div className="pb-5 sm:pb-6">
                                <h2 className="font-sans! text-[20px] font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!">
                                    Donation Directory
                                </h2>

                                <p className="mt-2 max-w-xl font-sans! text-[12px] leading-[1.65] text-[#8792A1]">
                                    Browse contributions and payment
                                    information.
                                </p>
                            </div>

                            {/* MOBILE FILTER TRIGGER */}

                            <div className="mb-5 xl:hidden">
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="
                    flex h-10 w-full items-center
                    justify-between
                    border border-[#252D38]
                    bg-[#0E1219] px-3.5
                    text-[11px] font-medium!
                    text-[#AEB7C3]
                    transition-colors
                    hover:border-[#35404E]
                    hover:bg-[#151B24]
                  "
                                >
                                    <span className="flex items-center gap-2">
                                        <SlidersHorizontal
                                            size={14}
                                            strokeWidth={1.8}
                                        />
                                        Filters
                                    </span>

                                    {method !== 'all' && (
                                        <span className="bg-[#1D2632] px-2 py-0.5 text-[10px] text-[#EEF1F5]">
                                            1
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* USERS-STYLE WORKSPACE */}

                            <div
                                className="
    grid min-w-0 gap-6
    xl:h-[650px]
    xl:grid-cols-[minmax(0,1fr)_300px]
    xl:items-stretch xl:gap-7
    2xl:grid-cols-[minmax(0,1fr)_320px]
  "
                            >
                                {/* TABLE PANEL */}

                                <div className="relative min-h-0 min-w-0 xl:h-full">
                                    <div
                                        className="
    flex min-h-[520px] min-w-0
    flex-col overflow-hidden
    border border-[#252D38]
    bg-[#0E1219]
    xl:h-full xl:min-h-0
  "
                                    >
                                        {/* EXACT USERS SEARCH TOOLBAR */}

                                        <div
                                            className="
                        shrink-0 border-b
                        border-[#252D38]
                        bg-[#1A222D]
                        px-4 py-3.5 sm:px-5
                      "
                                        >
                                            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="relative">
                                                        <Search
                                                            size={15}
                                                            strokeWidth={1.8}
                                                            className="
                                pointer-events-none
                                absolute left-3 top-1/2
                                -translate-y-1/2
                                text-[#697586]
                              "
                                                        />

                                                        <input
                                                            type="text"
                                                            value={search}
                                                            onChange={
                                                                handleSearchChange
                                                            }
                                                            placeholder="Search donor, campaign or transaction"
                                                            className="
                                h-10 w-full
                                border border-[#29323E]
                                bg-[#0A0E14]
                                pl-9 pr-16
                                font-sans!
                                text-[12px] font-medium!
                                text-[#EEF1F5]
                                outline-none
                                transition-colors duration-150
                                placeholder:text-[#5E6978]
                                hover:border-[#394553]
                                focus:border-[#4B5869]
                                focus:ring-0
                              "
                                                        />

                                                        {search && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    handleClearSearch
                                                                }
                                                                className="
                                  absolute right-3 top-1/2
                                  -translate-y-1/2
                                  font-sans!
                                  text-[9px] font-semibold!
                                  uppercase tracking-[0.08em]
                                  text-[#788493]
                                  transition-colors
                                  hover:text-[#EEF1F5]
                                  focus:outline-none
                                  focus:ring-0
                                "
                                                            >
                                                                Clear
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-4">
                                                    <span className="hidden h-7 w-px bg-[#303A47] lg:block" />

                                                    <p className="font-sans! text-[11px] font-medium! text-[#AAB3BF]">
                                                        {filtered.length}{' '}
                                                        {filtered.length === 1
                                                            ? 'result'
                                                            : 'results'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TABLE */}

                                        <div
                                            className="
                        min-h-0 min-w-0 flex-1
                        overflow-auto bg-[#0E1219]
                        [&::-webkit-scrollbar]:h-1.5
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-track]:bg-[#0A0E14]
                        [&::-webkit-scrollbar-thumb]:bg-[#303A47]
                        hover:[&::-webkit-scrollbar-thumb]:bg-[#465261]
                      "
                                        >
                                            <DonationTable
                                                rows={rows}
                                                resultCount={filtered.length}
                                                onSort={handleSort}
                                                getSortIcon={getSortIcon}
                                            />
                                        </div>

                                        {/* PAGINATION */}

                                        <div className="shrink-0 border-t border-[#252D38]">
                                            <DonationPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalItems={filtered.length}
                                                itemsPerPage={PER_PAGE}
                                                onPageChange={setPage}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* FILTER SIDEBAR */}

                                <div
                                    className="
    hidden min-h-0 min-w-0
    overflow-y-auto
    border border-[#252D38]
    bg-[#0E1219]
    xl:block xl:h-full
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-thumb]:bg-[#303A47]
  "
                                >
                                    {filters}
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* MOBILE FILTER DRAWER */}

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="absolute inset-0 bg-black/70"
                    />

                    <div className="absolute inset-y-0 right-0 w-[min(340px,90vw)] overflow-y-auto border-l border-[#29323E] bg-[#0E1219]">
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            aria-label="Close filters"
                            className="absolute right-4 top-5 z-10 text-[#AEB7C3] hover:text-white"
                        >
                            <X size={18} />
                        </button>

                        {filters}
                    </div>
                </div>
            )}
        </>
    );
};

export default Donations;

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    HandCoins,
    Search,
    X,
    SlidersHorizontal,
    CalendarDays,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';

import DonationSummary from './components/DonationSummary';
import DonationTable from './components/DonationTable';
import DonationFilters from './components/DonationFilters';
import DonationPagination from './components/DonationPagination';

import { getMyDonations } from './api/donationApi';

const PER_PAGE = 25;

const campaignName = (donation) =>
    donation?.campaign?.title || donation?.campaign?.name || 'Campaign';

const paymentName = (donation) =>
    String(
        donation?.payment_method || donation?.paymentMethod || 'Not specified',
    )
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const donationTime = (donation) =>
    new Date(donation?.created_at || 0).getTime() || 0;

const formatAmount = (amount) => {
    const value = Number(amount || 0);

    if (!Number.isFinite(value)) {
        return '0';
    }

    return value.toLocaleString('en-BD');
};

const formatDate = (date) => {
    if (!date) {
        return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

function RecentContribution({ donation }) {
    if (!donation) {
        return null;
    }

    return (
        <section className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
                <h2 className="font-sans! text-[18px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                    Recent contribution
                </h2>
            </div>

            <div className="min-w-0 border border-[#29323E] bg-[#151C25]">
                <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center border border-[#34404C] bg-[#202C39] text-[#B6C9DC]">
                            <HandCoins size={20} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] font-medium! uppercase tracking-[0.08em] text-[#8792A1]">
                                Most recent contribution
                            </p>

                            <h3 className="mt-2 break-words font-sans! text-[16px] font-semibold! leading-6 text-[#EEF1F5]!">
                                {campaignName(donation)}
                            </h3>

                            <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-[#94A2B2]">
                                <CalendarDays
                                    size={14}
                                    strokeWidth={1.8}
                                    className="shrink-0"
                                />

                                {formatDate(donation.created_at)}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[#29323E] pt-4 sm:pl-16 lg:shrink-0 lg:border-t-0 lg:pt-0 lg:pl-0">
                        <div>
                            <p className="text-[11px] text-[#8792A1]">
                                Amount contributed
                            </p>

                            <p className="mt-1 whitespace-nowrap font-sans! text-[20px] font-semibold! tabular-nums text-[#EEF1F5]!">
                                ৳{formatAmount(donation.amount)}
                            </p>
                        </div>

                        <StatusBadge status={donation.status || 'completed'} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function MyDonations() {
    const [donations, setDonations] = useState([]);

    const [summary, setSummary] = useState({
        totalDonated: 0,
        donationCount: 0,
        lastDonation: '—',
    });

    const [loadState, setLoadState] = useState({
        loading: true,
        error: '',
        key: -1,
    });

    const [retryKey, setRetryKey] = useState(0);

    const [search, setSearch] = useState('');
    const [method, setMethod] = useState('all');
    const [status, setStatus] = useState('all');

    const [sort, setSort] = useState({
        key: 'created_at',
        direction: 'desc',
    });

    const [page, setPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadDonations() {
            try {
                const response = await getMyDonations();

                if (!active) return;

                const donationData = Array.isArray(response?.donations)
                    ? response.donations
                    : [];

                setDonations(donationData);

                setSummary({
                    totalDonated: Number(response?.summary?.totalDonated || 0),
                    donationCount: Number(
                        response?.summary?.donationCount || 0,
                    ),
                    lastDonation: response?.summary?.lastDonation || '—',
                });

                setLoadState({
                    loading: false,
                    error: '',
                    key: retryKey,
                });
            } catch (err) {
                console.error('Failed to load donations:', err);

                if (active) {
                    setLoadState({
                        loading: false,
                        error: 'Unable to load your donation history. Please try again.',
                        key: retryKey,
                    });
                }
            }
        }

        loadDonations();

        return () => {
            active = false;
        };
    }, [retryKey]);

    const loading = loadState.loading || loadState.key !== retryKey;

    const error = loadState.error;

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = donations.filter((donation) => {
            const matchesSearch =
                !query ||
                [
                    campaignName(donation),
                    donation?.id,
                    donation?.transaction_id,
                    donation?.transactionId,
                    paymentName(donation),
                    donation?.status || 'completed',
                ].some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(query),
                );

            const matchesMethod =
                method === 'all' || paymentName(donation) === method;

            const matchesStatus =
                status === 'all' ||
                String(donation?.status || 'completed').toLowerCase() ===
                    status;

            return matchesSearch && matchesMethod && matchesStatus;
        });

        if (!sort.key || !sort.direction) {
            return result;
        }

        const sortValue = (donation) => {
            switch (sort.key) {
                case 'campaign':
                    return campaignName(donation);

                case 'amount':
                    return Number(donation.amount) || 0;

                case 'status':
                    return donation.status || 'completed';

                default:
                    return donationTime(donation);
            }
        };

        return result.sort((a, b) => {
            const first = sortValue(a);
            const second = sortValue(b);

            const comparison =
                typeof first === 'number'
                    ? first - second
                    : String(first).localeCompare(String(second));

            return comparison * (sort.direction === 'asc' ? 1 : -1);
        });
    }, [donations, search, method, status, sort]);

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

    const latestDonation = donations[0];

    const activeFilterCount =
        Number(method !== 'all') + Number(status !== 'all');

    const changeMethod = (value) => {
        setMethod(value);
        setPage(1);
    };

    const changeStatus = (value) => {
        setStatus(value);
        setPage(1);
    };

    const clearFilters = () => {
        setMethod('all');
        setStatus('all');
        setPage(1);
    };

    const handleSort = (key) => {
        setSort((current) => {
            if (current.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            if (current.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            return {
                key: null,
                direction: null,
            };
        });

        setPage(1);
    };

    const handleRetry = () => {
        setRetryKey((current) => current + 1);
    };

    const filters = (
        <DonationFilters
            donations={donations}
            method={method}
            onMethodChange={changeMethod}
            status={status}
            onStatusChange={changeStatus}
            onClear={clearFilters}
        />
    );

    return (
        <div className="min-w-0 space-y-12 pb-8 lg:space-y-14">
            <PageHeader
                title="My Donations"
                subtitle="Review your contributions and the campaigns you have supported."
                action={
                    <Link
                        to="/individual/dashboard/campaigns"
                        className="group inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-3.5 text-[12px] font-medium! text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5]"
                    >
                        <HandCoins size={15} strokeWidth={1.8} />
                        Donate now
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading donations..."
                    description="Retrieving your donation records."
                />
            ) : error ? (
                <LoadingError
                    title="Unable to load donations"
                    message={error}
                    onRetry={handleRetry}
                />
            ) : (
                <>
                    <section>
                        <h2 className="mb-5 font-sans! text-[18px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                            Donation overview
                        </h2>

                        <DonationSummary summary={summary} />
                    </section>

                    {latestDonation && (
                        <RecentContribution donation={latestDonation} />
                    )}

                    <section className="min-w-0 pt-1 lg:pt-2">
                        <div className="pb-5 sm:pb-6">
                            <h2 className="font-sans! text-[20px] font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!">
                                Donation Directory
                            </h2>

                            <p className="mt-2 max-w-xl font-sans! text-[12px] leading-[1.65] text-[#8792A1]">
                                Browse your contributions and payment
                                information.
                            </p>
                        </div>

                        <div className="mb-5 xl:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="flex h-10 w-full items-center justify-between border border-[#252D38] bg-[#0E1219] px-3.5 text-[11px] font-medium! text-[#AEB7C3] hover:border-[#35404E] hover:bg-[#151B24]"
                            >
                                <span className="flex items-center gap-2">
                                    <SlidersHorizontal size={14} />
                                    Filters
                                </span>

                                {activeFilterCount > 0 && (
                                    <span className="bg-[#1D2632] px-2 py-0.5 text-[10px] text-[#EEF1F5]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="grid min-w-0 gap-6 xl:h-[650px] xl:grid-cols-[minmax(0,1fr)_300px] xl:items-stretch xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="relative min-h-0 min-w-0 xl:h-full">
                                <div className="flex min-h-[520px] min-w-0 flex-col overflow-hidden border border-[#252D38] bg-[#0E1219] xl:h-full xl:min-h-0">
                                    <div className="shrink-0 border-b border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:px-5">
                                        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="relative min-w-0 flex-1">
                                                <Search
                                                    size={15}
                                                    strokeWidth={1.8}
                                                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#697586]"
                                                />

                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(event) => {
                                                        setSearch(
                                                            event.target.value,
                                                        );
                                                        setPage(1);
                                                    }}
                                                    placeholder="Search campaign, payment or transaction"
                                                    aria-label="Search donations"
                                                    className="h-10 w-full border border-[#29323E] bg-[#0A0E14] pr-16 pl-9 font-sans! text-[12px] font-medium! text-[#EEF1F5] outline-none transition-colors placeholder:text-[#5E6978] hover:border-[#394553] focus:border-[#4B5869] focus:ring-0"
                                                />

                                                {search && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearch('');
                                                            setPage(1);
                                                        }}
                                                        className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 px-2 py-1 text-[10px] text-[#8792A1] hover:text-[#EEF1F5]"
                                                    >
                                                        <X size={12} />
                                                        Clear
                                                    </button>
                                                )}
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

                                    <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#0E1219] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0A0E14] [&::-webkit-scrollbar-thumb]:bg-[#303A47]">
                                        <DonationTable
                                            rows={rows}
                                            onSort={handleSort}
                                            sort={sort}
                                        />
                                    </div>

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

                            <div className="hidden min-h-0 min-w-0 overflow-y-auto border border-[#252D38] bg-[#0E1219] xl:block xl:h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#303A47]">
                                {filters}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {mobileFiltersOpen && !loading && !error && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    <button
                        type="button"
                        aria-label="Close filters"
                        className="absolute inset-0 bg-black/70"
                        onClick={() => setMobileFiltersOpen(false)}
                    />

                    <div className="absolute inset-y-0 right-0 flex w-[min(340px,90vw)] flex-col border-l border-[#303A47] bg-[#0E1219] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#303A47] px-4 py-3">
                            <span className="text-[13px] font-semibold! text-[#EEF1F5]">
                                Donation filters
                            </span>

                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                aria-label="Close filters"
                                className="p-2 text-[#8792A1] hover:text-[#EEF1F5]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {filters}
                        </div>

                        <div className="border-t border-[#303A47] p-4">
                            <button
                                type="button"
                                onClick={() => setMobileFiltersOpen(false)}
                                className="h-10 w-full border border-[#46566A] bg-[#263343] text-[12px] font-medium! text-[#EEF1F5]"
                            >
                                Show {filtered.length} results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

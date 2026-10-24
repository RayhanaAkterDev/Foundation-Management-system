import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    CalendarDays,
    HandCoins,
} from 'lucide-react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

const money = (value) => `৳${Number(value || 0).toLocaleString('en-BD')}`;

const campaignName = (donation) =>
    donation?.campaign?.title || donation?.campaign?.name || 'Campaign';

const formatDate = (date) => {
    if (!date) return '—';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return '—';

    return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

function MobileDonationRow({ donation }) {
    return (
        <article className="border-b border-[#202832] bg-[#0E1219] px-4 py-4 last:border-b-0">
            <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] text-[#697586]">
                        #{String(donation.serialNumber).padStart(2, '0')}
                    </p>

                    <h3 className="break-words text-[13px] font-semibold! leading-5 text-[#EEF1F5]">
                        {campaignName(donation)}
                    </h3>
                </div>

                <p className="shrink-0 whitespace-nowrap text-[13px] font-semibold! tabular-nums text-[#EEF1F5]">
                    {money(donation.amount)}
                </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#1B232D] pt-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#8792A1]">
                    <CalendarDays size={13} strokeWidth={1.7} />
                    {formatDate(donation.created_at)}
                </span>

                <StatusBadge status={donation.status || 'completed'} />
            </div>
        </article>
    );
}

export default function DonationTable({ rows = [], onSort, sort }) {
    const sortIcon = (key) => {
        if (sort.key !== key || !sort.direction) {
            return <ChevronsUpDown size={13} strokeWidth={1.8} />;
        }

        return sort.direction === 'asc' ? (
            <ArrowUp size={13} strokeWidth={1.8} />
        ) : (
            <ArrowDown size={13} strokeWidth={1.8} />
        );
    };

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',
            render: (value) => (
                <span className="text-[11px] font-medium! tabular-nums text-[#697586]">
                    {String(value).padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'campaign',
            header: 'Campaign',
            sortable: true,
            sortKey: 'campaign',
            width: 'minmax(190px, 1.5fr)',
            render: (_, donation) => (
                <span
                    title={campaignName(donation)}
                    className="block max-w-[340px] truncate text-[12px] font-semibold! leading-5 text-[#EEF1F5]"
                >
                    {campaignName(donation)}
                </span>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            sortable: true,
            sortKey: 'amount',
            width: 'minmax(110px, 0.8fr)',
            render: (_, donation) => (
                <span className="whitespace-nowrap text-[12px] font-semibold! tabular-nums text-[#EEF1F5]">
                    {money(donation.amount)}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Date',
            sortable: true,
            sortKey: 'created_at',
            width: 'minmax(130px, 0.85fr)',
            render: (_, donation) => (
                <span className="whitespace-nowrap text-[11px] font-medium! text-[#8792A1]">
                    {formatDate(donation.created_at)}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(115px, 0.8fr)',
            render: (_, donation) => (
                <StatusBadge status={donation.status || 'completed'} />
            ),
        },
    ];

    const emptyState = (
        <div className="flex min-h-[260px] items-center justify-center bg-[#0E1219] px-6 py-10">
            <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center border border-[#29323E] bg-[#151B24]">
                    <HandCoins
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#697586]"
                    />
                </div>

                <p className="mt-3 text-[13px] font-semibold! text-[#EEF1F5]">
                    No donations found
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#697586]">
                    Try changing your search or filters.
                </p>
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? emptyState
                    : rows.map((donation, index) => (
                          <MobileDonationRow
                              key={donation.id ?? index}
                              donation={donation}
                          />
                      ))}
            </div>

            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
                <DataTable
                    columns={columns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={sortIcon}
                    resizableColumns
                    empty={{
                        icon: HandCoins,
                        title: 'No donations found',
                        message: 'Try changing your search or filters.',
                    }}
                />
            </div>
        </>
    );
}

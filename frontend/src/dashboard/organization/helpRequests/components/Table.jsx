import React from 'react';
import { ArrowUpRight, ClipboardList, Eye, MapPin } from 'lucide-react';
import DataTable from '@/components/dashboard/DataTable';
import LoadingUI from '@/components/dashboard/LoadingUI';

const STATUS_STYLES = {
    withdrawal: [
        'Withdrawal requested',
        'border-[#443723] bg-[#241E15] text-[#D0AA70]',
    ],
    pending: ['Needs response', 'border-[#443723] bg-[#241E15] text-[#D0AA70]'],
    assigned: ['Assigned', 'border-[#303F55] bg-[#1B2637] text-[#91A9CC]'],
    verified: ['Verified', 'border-[#294438] bg-[#14231D] text-[#8EC5A3]'],
    active: ['In progress', 'border-[#3D3A57] bg-[#222136] text-[#B4ADD9]'],
    in_progress: [
        'In progress',
        'border-[#3D3A57] bg-[#222136] text-[#B4ADD9]',
    ],
    completed: ['Completed', 'border-[#294438] bg-[#14231D] text-[#8EC5A3]'],
    rejected: ['Declined', 'border-[#493038] bg-[#281A1F] text-[#D1959B]'],
};

const PRIORITY_STYLES = {
    low: 'text-[#8EC5A3]',
    normal: 'text-[#AEB7C3]',
    medium: 'text-[#B4ADD9]',
    high: 'text-[#D0AA70]',
    urgent: 'text-[#E3A06E]',
    critical: 'text-[#E19A9F]',
};

const titleCase = (value) =>
    String(value ?? '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getCategory = (request) =>
    request?.category || request?.rawHelpRequest?.category || '—';

const getDistrict = (request) =>
    request?.district || request?.rawHelpRequest?.district || '—';

const getPriority = (request) =>
    String(
        request?.urgency ||
            request?.priority ||
            request?.rawHelpRequest?.urgency ||
            'normal',
    ).toLowerCase();

const getStatus = (request) => {
    if (request?.withdrawalStatus === 'pending') return 'withdrawal';

    const assignment = String(
        request?.rawAssignment?.status || request?.assignmentStatus || '',
    ).toLowerCase();

    const help = String(
        request?.rawHelpRequest?.status || request?.helpRequestStatus || '',
    ).toLowerCase();

    if (assignment === 'pending') return 'pending';
    if (assignment === 'rejected') return 'rejected';

    if (assignment === 'accepted' || assignment === 'assigned') {
        if (help === 'completed') return 'completed';
        if (help === 'in_progress' || help === 'in-progress')
            return 'in_progress';
        return 'assigned';
    }

    if (help === 'completed') return 'completed';
    if (help === 'in_progress' || help === 'in-progress') return 'in_progress';

    const fallback = String(request?.status || '').toLowerCase();

    if (fallback === 'accepted') return 'assigned';
    if (fallback === 'in_progress' || fallback === 'in-progress') {
        return 'in_progress';
    }

    return fallback || 'pending';
};

function RequestIdentity({ request }) {
    return (
        <div className="min-w-0">
            <p
                title={request?.title || ''}
                className="truncate text-[12px] font-semibold! leading-5 text-[#EEF1F5]"
            >
                {request?.title || 'Untitled request'}
            </p>
        </div>
    );
}

function CategoryCell({ request }) {
    const category = getCategory(request);

    return (
        <span
            title={category}
            className="block truncate text-[11px] font-medium text-[#B8C2CF]"
        >
            {titleCase(category)}
        </span>
    );
}

function DistrictCell({ request }) {
    const district = getDistrict(request);

    return (
        <span
            title={district}
            className="inline-flex max-w-full min-w-0 items-center gap-1.5 text-[11px] text-[#AEB7C3]"
        >
            <MapPin
                size={12}
                strokeWidth={1.7}
                className="shrink-0 text-[#697586]"
            />
            <span className="truncate">{district}</span>
        </span>
    );
}

function PriorityCell({ request }) {
    const priority = getPriority(request);

    return (
        <span
            className={`text-[11px] font-medium ${
                PRIORITY_STYLES[priority] || PRIORITY_STYLES.normal
            }`}
        >
            {titleCase(priority)}
        </span>
    );
}

function StatusCell({ request, statusConfig }) {
    const status = getStatus(request);

    const [defaultLabel, classes] = STATUS_STYLES[status] || [
        titleCase(status),
        'border-[#343E4B] bg-[#1A222D] text-[#AEB7C3]',
    ];

    const label =
        status === 'withdrawal'
            ? defaultLabel
            : statusConfig?.[status]?.label || defaultLabel;

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-1 text-[10px] font-medium ${classes}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}

function RowActions({ request, onOpenCase }) {
    return (
        <div className="flex items-center justify-end gap-0.5 whitespace-nowrap">
            <button
                type="button"
                onClick={() => onOpenCase?.(request)}
                title="View case"
                aria-label={`View ${request?.title || 'help request'}`}
                className="inline-flex h-7 items-center justify-center gap-1.5 border border-transparent bg-transparent px-2 text-[11px] font-medium text-[#8792A1] transition-colors duration-150 hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5]"
            >
                <Eye size={14} strokeWidth={1.8} />
                <span className="hidden 2xl:inline">View</span>
                <ArrowUpRight
                    size={12}
                    strokeWidth={1.8}
                    className="hidden 2xl:inline"
                />
            </button>
        </div>
    );
}

function MobileRequestRow({ request, statusConfig, onOpenCase }) {
    return (
        <article className="border-b border-[#202832] bg-[#0E1219] px-4 py-4 last:border-b-0">
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <RequestIdentity request={request} />
                </div>
                <StatusCell request={request} statusConfig={statusConfig} />
            </div>

            <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 border-t border-[#202832] pt-3">
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-medium text-[#697586]">
                        Category
                    </p>
                    <CategoryCell request={request} />
                </div>
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-medium text-[#697586]">
                        District
                    </p>
                    <DistrictCell request={request} />
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#202832] pt-3">
                <div className="flex items-center gap-3">
                    <PriorityCell request={request} />
                </div>
                <RowActions request={request} onOpenCase={onOpenCase} />
            </div>
        </article>
    );
}

export default function Table({
    requests = [],
    filteredRequests,
    loading = false,
    statusConfig = {},
    onOpenCase,
    onClearFilters,
    search = '',
    onSort,
    getSortIcon,
    resultCount,
}) {
    const rows = Array.isArray(filteredRequests)
        ? filteredRequests
        : Array.isArray(requests)
          ? requests
          : [];

    const enhancedColumns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',
            render: (value) => (
                <span className="text-[11px] font-medium! tabular-nums text-[#697586]">
                    {String(value ?? '—').padStart(2, '0')}
                </span>
            ),
        },
        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
            width: 'minmax(210px,1.7fr)',
            render: (_, row) => <RequestIdentity request={row} />,
        },
        {
            key: 'category',
            header: 'Category',
            sortable: true,
            sortKey: 'category',
            width: 'minmax(135px,1fr)',
            render: (_, row) => <CategoryCell request={row} />,
        },
        {
            key: 'district',
            header: 'District',
            sortable: true,
            sortKey: 'district',
            width: 'minmax(120px,.9fr)',
            render: (_, row) => <DistrictCell request={row} />,
        },
        {
            key: 'priority',
            header: 'Urgency',
            sortable: true,
            sortKey: 'priority',
            width: 'minmax(95px,.6fr)',
            render: (_, row) => <PriorityCell request={row} />,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: 'minmax(125px,.8fr)',
            render: (_, row) => (
                <StatusCell request={row} statusConfig={statusConfig} />
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '100px',
            render: (_, row) => (
                <RowActions request={row} onOpenCase={onOpenCase} />
            ),
        },
    ];

    if (loading) {
        return <LoadingUI variant="section" title="Loading help requests..." />;
    }

    const emptyState = (
        <div className="flex min-h-65 flex-col items-center justify-center bg-[#0E1219] px-6 py-10 text-center">
            <ClipboardList
                size={21}
                strokeWidth={1.5}
                className="text-[#697586]"
            />
            <p className="mt-3 text-[13px] font-semibold! text-[#EEF1F5]">
                No help requests found
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#697586]">
                {search
                    ? 'No requests match your search.'
                    : 'Try changing your search or filter options.'}
            </p>
            {onClearFilters && (
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-3 text-[11px] font-medium text-[#B8C2CF] transition-colors hover:text-[#EEF1F5]"
                >
                    Clear filters
                </button>
            )}
        </div>
    );

    return (
        <>
            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? emptyState
                    : rows.map((request, index) => (
                          <MobileRequestRow
                              key={request.assignmentId ?? request.id ?? index}
                              request={request}
                              statusConfig={statusConfig}
                              onOpenCase={onOpenCase}
                          />
                      ))}
            </div>

            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
                    empty={{
                        icon: ClipboardList,
                        title: 'No help requests found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </>
    );
}

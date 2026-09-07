import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Pencil,
    Trash2,
    ArrowUpRight,
} from 'lucide-react';

import {
    STATUS_STYLES,
    URGENCY_STYLES,
} from '../constants/helpRequestConstants';

    const createHelpRequestColumns = ({
    handleViewOrganization,
    handleView,
    handleEdit,
    handleDelete,
    deleteLoading,
}) => [
        {
            key: 'title',
            header: 'Help Request',
            sortable: true,
            sortKey: 'title',
            width: '35%',
            render: (value, row) => {
                const urgency =
                    URGENCY_STYLES[row.urgency] || URGENCY_STYLES.normal;

                return (
                    <div className="min-w-0 py-5 pr-8">
                        <p className="truncate text-[15px] font-medium underline leading-5.5 tracking-[-0.01em] text-text-primary">
                            {value || 'Untitled help request'}
                        </p>

                        <p className="mt-1.5 line-clamp-2 text-[12px] font-normal leading-5 text-text-secondary">
                            {row.description || 'No description provided.'}
                        </p>

                        <div className="mt-3 flex min-w-0 items-center gap-2 text-[11px]">
                            {row.category && (
                                <>
                                    <span className="truncate font-semibold capitalize text-primary">
                                        {row.category}
                                    </span>
                                </>
                            )}

                            <span
                                className={`inline-flex items-center gap-1.5 ${urgency.text}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${urgency.dot}`}
                                />

                                <span className="text-[10px] font-semibold">
                                    {row.urgencyLabel}
                                </span>
                            </span>
                        </div>

                        <div className="truncate font-medium text-text-secondary">
                            {row.locationName || 'Location not specified'}

                            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                            <span className="text-[10px] underline tracking-wide ml-2 font-semibold text-text-secondary/80">
                                {row.formattedCreatedDate}
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'statusLabel',
            header: 'Status',
            sortable: true,
            sortKey: 'status',
            width: '10%',
            render: (value, row) => {
                const status = STATUS_STYLES[row.status] || {
                    dot: 'bg-slate-400',
                    text: 'text-text-secondary',
                    background: 'bg-slate-50',
                };

                return (
                    <div className="py-5">
                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                px-3
                                py-2
                                ${status.background}
                            `}
                        >
                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                            />

                            <span
                                className={`
                                    text-[12px]
                                    font-semibold
                                    ${status.text}
                                `}
                            >
                                {value}
                            </span>
                        </span>
                    </div>
                );
            },
        },

        {
            key: 'assignmentInfo',
            header: 'Assigned',
            sortable: true,
            sortKey: 'assignmentInfo',
            width: '12%',
            render: (value, row) => {
                if (value?.state === 'pending') {
                    return (
                        <div className="py-5">
                            <div className="flex items-center gap-2.5">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />

                                <div className="min-w-0">
                                    <p className="text-[12px] font-semibold text-text-secondary">
                                        Awaiting response
                                    </p>

                                    <p className="mt-0.5 text-[10px] font-medium text-text-secondary/55">
                                        Organization assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }

                if (value?.state === 'accepted') {
                    return (
                        <div className="py-5">
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewOrganization(value, row)
                                }
                                disabled={
                                    !value.currentAssignment?.organization
                                }
                                className="
                                    group
                                    min-w-0
                                    max-w-60
                                    text-left
                                    disabled:cursor-default
                                "
                            >
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />

                                    <p
                                        className="
                                            truncate
                                            text-[13px]
                                            font-semibold
                                            leading-5
                                            text-text-primary
                                            transition-colors
                                            duration-200
                                            group-hover:text-primary
                                        "
                                    >
                                        {value.label}
                                    </p>
                                </div>

                                <p
                                    className="
                                        mt-1
                                        pl-4.5
                                        text-[10px]
                                        font-medium
                                        text-text-secondary/60
                                        transition-colors
                                        duration-200
                                        group-hover:text-primary/70
                                    "
                                >
                                    View organization
                                </p>
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="py-5">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-slate-300" />

                            <span className="text-[12px] font-medium text-text-secondary/70">
                                Not assigned
                            </span>
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            width: '24%',
            render: (_, row) => {
                const canEdit = row.status === 'pending';
                const canDelete = row.status === 'pending';

                return (
                    <div className="flex items-center justify-end gap-1 py-5">
                        <button
                            type="button"
                            onClick={() => handleView(row)}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                px-3
                                py-2
                                text-[11px]
                                font-semibold
                                text-text-secondary
                                transition-colors
                                duration-200
                                hover:bg-slate-100
                                hover:text-text-primary
                            "
                        >
                            <ArrowUpRight size={14} strokeWidth={1.8} />
                            <span>View</span>
                        </button>

                        {canEdit && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row)}
                                disabled={deleteLoading}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-[11px]
                                    font-semibold
                                    text-text-secondary
                                    transition-colors
                                    duration-200
                                    hover:bg-primary/6
                                    hover:text-primary
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                                <span>Edit</span>
                            </button>
                        )}

                        {canDelete && (
                            <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                disabled={deleteLoading}
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-[11px]
                                    font-semibold
                                    text-red-500
                                    transition-colors
                                    duration-200
                                    hover:bg-red-50
                                    hover:text-red-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <Trash2 size={14} strokeWidth={1.8} />
                                <span>Delete</span>
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

export default createHelpRequestColumns;

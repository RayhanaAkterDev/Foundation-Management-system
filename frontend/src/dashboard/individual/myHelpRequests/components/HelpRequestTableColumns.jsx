import { Pencil, Trash2, ArrowUpRight } from 'lucide-react';

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
                    {/* Title */}
                    <div className="flex min-w-0 items-baseline gap-2">
                        <p className="min-w-0 truncate text-[14px] font-semibold leading-5 tracking-[-0.01em] text-text-primary">
                            {value || 'Untitled help request'}
                        </p>

                        <span className="shrink-0 text-[10px] font-medium tracking-wide text-text-secondary/50">
                            {row.formattedCreatedDate}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="mt-1.5 line-clamp-2 max-w-[560px] text-[12px] font-normal leading-[1.65] text-text-secondary/85">
                        {row.description || 'No description provided.'}
                    </p>

                    {/* Category + Urgency */}
                    <div className="mt-3 flex min-w-0 items-center gap-2.5 text-[11px]">
                        {row.category && (
                            <>
                                <span className="max-w-[150px] truncate font-semibold capitalize text-primary">
                                    {row.category}
                                </span>

                                <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300/80" />
                            </>
                        )}

                        <span
                            className={`inline-flex items-center gap-1.5 ${urgency.text}`}
                        >
                            <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${urgency.dot}`}
                            />

                            <span className="text-[10px] font-semibold tracking-[0.01em]">
                                {row.urgencyLabel}
                            </span>
                        </span>
                    </div>

                    {/* Location */}
                    <div className="mt-2.5 flex min-w-0 items-center text-[11px] font-medium leading-4 text-text-secondary/70">
                        <span className="min-w-0 truncate">
                            {row.address && (
                                <>
                                    {row.address}

                                    <span className="mx-1.5 inline-block h-0.5 w-0.5 shrink-0 rounded-full bg-slate-300 align-middle" />
                                </>
                            )}

                            {row.locationName || 'Location not specified'}
                        </span>
                    </div>
                </div>
            );
        },
    },

    // =========================================================
    // STATUS
    // =========================================================

    {
        key: 'statusLabel',
        header: 'Status',
        sortable: true,
        sortKey: 'status',
        width: '10%',
        render: (value, row) => {
            const status = STATUS_STYLES[row.status] || {
                text: 'text-text-secondary',
                background: 'bg-slate-50',
            };

            return (
                <div className="py-5">
                    <span
                        className={`
                            inline-flex
                            items-center
                            rounded-md
                            border
                            border-slate-200/70
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-semibold
                            tracking-wide
                            ${status.background}
                            ${status.text}
                        `}
                    >
                        {value}
                    </span>
                </div>
            );
        },
    },

    // =========================================================
    // ASSIGNED
    // =========================================================

    {
        key: 'assignmentInfo',
        header: 'Assigned',
        sortable: true,
        sortKey: 'assignmentInfo',
        width: '16%',
        render: (value, row) => {
            /*
             * Assignment is waiting for an organization response.
             */
            if (value?.state === 'pending') {
                return (
                    <div className="py-5">
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold leading-4 text-text-secondary">
                                Awaiting response
                            </p>

                            <p className="mt-1 text-[10px] font-medium leading-4 text-text-secondary/50">
                                Organization assignment
                            </p>
                        </div>
                    </div>
                );
            }

            /*
             * Organization has been assigned.
             *
             * Both "assigned" and "accepted" are valid assignment
             * states in the backend, and both have an organization
             * that should be displayed here.
             */
            if (value?.state === 'assigned' || value?.state === 'accepted') {
                const organization = value?.currentAssignment?.organization;

                const organizationName =
                    organization?.name ||
                    value?.label ||
                    'Organization assigned';

                return (
                    <div className="py-5">
                        <button
                            type="button"
                            onClick={() => handleViewOrganization(value, row)}
                            disabled={!organization}
                            className="
                                group
                                min-w-0
                                max-w-60
                                text-left
                                disabled:cursor-default
                            "
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <p
                                    className="
                                        relative
                                        truncate
                                        text-[12px]
                                        font-semibold
                                        leading-5
                                        text-text-primary
                                        transition-colors
                                        duration-200
                                        group-hover:text-primary
                                        after:absolute
                                        after:bottom-[-1px]
                                        after:left-0
                                        after:h-[2px]
                                        after:w-full
                                        after:origin-left
                                        after:scale-x-0
                                        after:rounded-full
                                        after:bg-primary/70
                                        after:transition-transform
                                        after:duration-300
                                        after:ease-out
                                        group-hover:after:scale-x-100
                                    "
                                >
                                    {organizationName}
                                </p>

                                <ArrowUpRight
                                    size={12}
                                    strokeWidth={1.8}
                                    className="
                                        shrink-0
                                        text-text-secondary/35
                                        transition-all
                                        duration-200
                                        group-hover:translate-x-0.5
                                        group-hover:-translate-y-0.5
                                        group-hover:text-primary
                                    "
                                />
                            </div>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-medium
                                    leading-4
                                    text-text-secondary/50
                                    transition-colors
                                    duration-200
                                    group-hover:text-primary/70
                                "
                            >
                                {value?.state === 'accepted'
                                    ? 'Organization accepted'
                                    : 'Assigned organization'}
                            </p>
                        </button>
                    </div>
                );
            }

            /*
             * No current organization assignment.
             *
             * This also covers withdrawn/rejected assignments because
             * getAssignmentInfo() intentionally treats those as
             * not currently assigned.
             */
            return (
                <div className="py-5">
                    <span className="text-[11px] font-medium text-text-secondary/55">
                        Not assigned
                    </span>
                </div>
            );
        },
    },

    // =========================================================
    // ACTIONS
    // =========================================================

    {
        key: 'actions',
        header: 'Action',
        align: 'right',
        width: '24%',
        render: (_, row) => {
            const canEdit = row.status === 'pending';
            const canDelete = row.status === 'pending';

            return (
                <div className="flex items-center justify-end gap-0.5 py-5">
                    {/* View */}
                    <button
                        type="button"
                        onClick={() => handleView(row)}
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-md
                            px-2.5
                            py-1.5
                            text-[11px]
                            font-semibold
                            text-text-secondary
                            transition-all
                            duration-200
                            hover:bg-slate-100/80
                            hover:text-text-primary
                        "
                    >
                        <ArrowUpRight size={14} strokeWidth={1.8} />

                        <span>View</span>
                    </button>

                    {/* Edit */}
                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => handleEdit(row)}
                            disabled={deleteLoading}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-md
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-semibold
                                text-text-secondary
                                transition-all
                                duration-200
                                hover:bg-primary/5
                                hover:text-primary
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Pencil size={13} strokeWidth={1.8} />

                            <span>Edit</span>
                        </button>
                    )}

                    {/* Delete */}
                    {canDelete && (
                        <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            disabled={deleteLoading}
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-md
                                px-2.5
                                py-1.5
                                text-[11px]
                                font-semibold
                                text-text-secondary/70
                                transition-all
                                duration-200
                                hover:bg-slate-100
                                hover:text-red-500
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Trash2 size={13} strokeWidth={1.8} />

                            <span>Delete</span>
                        </button>
                    )}
                </div>
            );
        },
    },
];

export default createHelpRequestColumns;

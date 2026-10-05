import React from 'react';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    Building2,
    ChevronRight,
    Eye,
    Pencil,
    ShieldCheck,
    Trash2,
} from 'lucide-react';

/* ==========================================================================
   ORGANIZATION IDENTITY
============================================================================ */

const OrganizationIdentity = ({ row, value }) => {
    const name = value || row?.name || 'Unnamed organization';
    const email = row?.contactEmail || '';

    /*
     * Organization photo comes from users.photo.
     *
     * Supports:
     * - row.photo
     * - row.user.photo
     *
     * If no photo exists:
     * - show initials from organization name
     * - otherwise show Building2 icon
     */

    const photo = row?.photo || row?.user?.photo || '';

    const initials =
        name !== 'Unnamed organization'
            ? name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join('')
            : '';

    return (
        <div className="flex min-w-0 items-center gap-2.5">
            {/* ============================================================
                ORGANIZATION PHOTO / MARK
            ============================================================ */}

            <div
                className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    border
                    border-[#29323E]
                    bg-[#151B24]
                    text-[#8792A1]
                "
            >
                {photo ? (
                    <img
                        src={photo}
                        alt={`${name} logo`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none';
                        }}
                    />
                ) : initials ? (
                    <span
                        className="
                            select-none
                            text-[8px]
                            font-semibold!
                            uppercase
                            tracking-wide
                            text-[#C7CED8]
                        "
                    >
                        {initials}
                    </span>
                ) : (
                    <Building2 size={12} strokeWidth={1.7} />
                )}
            </div>

            {/* ============================================================
                ORGANIZATION INFO
            ============================================================ */}

            <div className="min-w-0 flex-1">
                <p
                    title={name}
                    className="
                        truncate
                        text-[12px]
                        font-semibold!
                        leading-4
                        text-[#EEF1F5]
                    "
                >
                    {name}
                </p>

                {email && (
                    <p
                        title={email}
                        className="
                            mt-0.5
                            truncate
                            text-[10px]
                            leading-4
                            text-[#697586]
                        "
                    >
                        {email}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
   MOBILE ORGANIZATION AVATAR
============================================================================ */

const MobileOrganizationAvatar = ({ row }) => {
    const name = row?.name || 'Unnamed organization';
    const photo = row?.photo || row?.user?.photo || '';

    const initials =
        name !== 'Unnamed organization'
            ? name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join('')
            : '';

    return (
        <div
            className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                overflow-hidden
                border
                border-[#29323E]
                bg-[#151B24]
                text-[#8792A1]
            "
        >
            {photo ? (
                <img
                    src={photo}
                    alt=""
                    className="block h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                        event.currentTarget.style.display = 'none';
                    }}
                />
            ) : initials ? (
                <span
                    className="
                        select-none
                        text-[11px]
                        font-semibold!
                        uppercase
                        tracking-wide
                        text-[#C7CED8]
                    "
                >
                    {initials}
                </span>
            ) : (
                <Building2 size={16} strokeWidth={1.7} />
            )}
        </div>
    );
};

/* ==========================================================================
   MOBILE ORGANIZATION ROW
============================================================================ */

const MobileOrganizationRow = ({ row, onView, onReview, onEdit, onDelete }) => {
    const name = row?.name || 'Unnamed organization';
    const email = row?.contactEmail || '';

    return (
        <article
            className="
                border-b
                border-[#202832]
                bg-[#0E1219]
                px-4
                py-4
                transition-colors
                duration-150
                last:border-b-0
                hover:bg-[#111720]
            "
        >
            {/* =============================================================
                PRIMARY ORGANIZATION INFO
            ============================================================== */}

            <div className="flex min-w-0 items-start gap-3">
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    aria-label={`View ${name}`}
                    className="
                        flex
                        min-w-0
                        flex-1
                        items-center
                        gap-3
                        text-left
                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <MobileOrganizationAvatar row={row} />

                    <div className="min-w-0 flex-1">
                        <p
                            title={name}
                            className="
                                truncate
                                text-[14px]
                                font-semibold!
                                leading-5
                                text-[#F1F3F6]
                            "
                        >
                            {name}
                        </p>

                        <p
                            title={email || ''}
                            className="
                                mt-0.5
                                truncate
                                text-[12px]
                                leading-[18px]
                                text-[#7F8A99]
                            "
                        >
                            {email || 'No contact email'}
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    title="View organization"
                    aria-label={`View ${name}`}
                    className="
                        -mr-1
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[#29323E]
                        bg-[#151B24]
                        text-[#AEB7C3]
                        transition-[background-color,border-color,color]
                        duration-150
                        hover:border-[#394555]
                        hover:bg-[#1A222D]
                        hover:text-[#EEF1F5]
                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <ChevronRight size={16} strokeWidth={1.8} />
                </button>
            </div>

            {/* =============================================================
                TYPE + VERIFICATION
            ============================================================== */}

            <div
                className="
                    mt-3
                    ml-[52px]
                    flex
                    min-w-0
                    flex-wrap
                    items-center
                    gap-x-2
                    gap-y-2
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        max-w-[170px]
                        items-center
                        gap-1.5
                        text-[#AEB7C3]
                    "
                >
                    <Building2
                        size={13}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#737F8F]"
                    />

                    <span
                        title={row.organization_type || 'Not specified'}
                        className="
                            truncate
                            text-[11px]
                            font-medium!
                            capitalize
                            leading-4
                        "
                    >
                        {row.organization_type || 'Not specified'}
                    </span>
                </div>

                <span
                    aria-hidden="true"
                    className="
                        h-1
                        w-1
                        shrink-0
                        rounded-full
                        bg-[#36404C]
                    "
                />

                <div className="shrink-0">
                    <StatusBadge status={row.verification_status} />
                </div>
            </div>

            {/* =============================================================
                REGISTRATION INFORMATION
            ============================================================== */}

            <div
                className="
                    mt-3
                    ml-[52px]
                    grid
                    min-w-0
                    grid-cols-2
                    gap-x-4
                    border-t
                    border-[#1B232D]
                    pt-3
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            text-[10px]
                            font-medium!
                            uppercase
                            tracking-[0.06em]
                            text-[#5F6B7A]
                        "
                    >
                        Registration
                    </p>

                    <p
                        title={row.registration_number || '—'}
                        className="
                            mt-1
                            truncate
                            text-[11px]
                            font-medium!
                            tabular-nums
                            text-[#AEB7C3]
                        "
                    >
                        {row.registration_number || '—'}
                    </p>
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            text-[10px]
                            font-medium!
                            uppercase
                            tracking-[0.06em]
                            text-[#5F6B7A]
                        "
                    >
                        Registered
                    </p>

                    <p
                        title={row.registeredDate || '—'}
                        className="
                            mt-1
                            truncate
                            text-[11px]
                            font-medium!
                            text-[#AEB7C3]
                        "
                    >
                        {row.registeredDate || '—'}
                    </p>
                </div>
            </div>

            {/* =============================================================
                ACTIONS
            ============================================================== */}

            <div
                className="
                    mt-3
                    ml-[52px]
                    flex
                    min-w-0
                    items-center
                    gap-1.5
                "
            >
                {/* REVIEW */}

                {row.verification_status === 'pending' && (
                    <button
                        type="button"
                        onClick={() => onReview(row)}
                        title="Review organization"
                        aria-label="Review organization"
                        className="
                            inline-flex
                            h-8
                            items-center
                            justify-center
                            gap-1.5
                            border
                            border-[#493D27]
                            bg-[#241E15]
                            px-2.5
                            text-[11px]
                            font-medium!
                            text-[#D8B979]
                            transition-[background-color,border-color,color]
                            duration-150
                            hover:border-[#594A30]
                            hover:bg-[#2A2218]
                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <ShieldCheck size={13} strokeWidth={1.8} />
                        Review
                    </button>
                )}

                {/* EDIT */}

                {row.verification_status !== 'rejected' && (
                    <button
                        type="button"
                        onClick={() => onEdit(row.id)}
                        title="Edit organization"
                        aria-label={`Edit ${name}`}
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-[#29323E]
                            bg-[#151B24]
                            text-[#8792A1]
                            transition-[background-color,border-color,color]
                            duration-150
                            hover:border-[#394555]
                            hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]
                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <Pencil size={13} strokeWidth={1.8} />
                    </button>
                )}

                {/* DELETE */}

                <button
                    type="button"
                    onClick={() => onDelete(row)}
                    title="Delete organization"
                    aria-label={`Delete ${name}`}
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-transparent
                        bg-transparent
                        text-[#B4777E]
                        transition-[background-color,border-color,color]
                        duration-150
                        hover:border-[#493038]
                        hover:bg-[#281A1F]
                        hover:text-[#E1A0A6]
                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <Trash2 size={14} strokeWidth={1.8} />
                </button>
            </div>
        </article>
    );
};

/* ==========================================================================
   TABLE
============================================================================ */

const Table = ({
    columns,
    rows,
    onSort,
    getSortIcon,
    resultCount,
    onView,
    onReview,
    onEdit,
    onDelete,
}) => {
    const enhancedColumns = columns.map((column) => {
        /* ==================================================================
           SERIAL NUMBER
        ================================================================== */

        if (column.key === 'serialNumber') {
            return {
                ...column,

                render: (value) => (
                    <span
                        className="
                            block
                            whitespace-nowrap
                            text-[11px]
                            font-medium!
                            tabular-nums
                            text-[#788596]
                        "
                    >
                        {String(value).padStart(2, '0')}
                    </span>
                ),
            };
        }

        /* ==================================================================
           ORGANIZATION
        ================================================================== */

        if (column.key === 'name') {
            return {
                ...column,

                render: (value, row) => (
                    <OrganizationIdentity row={row} value={value} />
                ),
            };
        }

        /* ==================================================================
           REGISTRATION NUMBER
        ================================================================== */

        if (column.key === 'registration_number') {
            return {
                ...column,

                render: (value) => (
                    <span
                        title={value || '—'}
                        className="
                            block
                            min-w-0
                            truncate
                            text-[11px]
                            font-medium!
                            tabular-nums
                            text-[#8792A1]
                        "
                    >
                        {value || '—'}
                    </span>
                ),
            };
        }

        /* ==================================================================
           ORGANIZATION TYPE
        ================================================================== */

        if (column.key === 'organization_type') {
            return {
                ...column,

                render: (value) => (
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2
                        "
                    >
                        <Building2
                            size={13}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#697586]"
                        />

                        <span
                            title={value || 'Not specified'}
                            className="
                                min-w-0
                                truncate
                                text-[11px]
                                font-medium!
                                capitalize
                                text-[#D4D9E0]
                            "
                        >
                            {value || 'Not specified'}
                        </span>
                    </div>
                ),
            };
        }

        /* ==================================================================
           VERIFICATION
        ================================================================== */

        if (column.key === 'verification_status') {
            return {
                ...column,

                render: (value) => (
                    <div className="whitespace-nowrap">
                        <StatusBadge status={value} />
                    </div>
                ),
            };
        }

        /* ==================================================================
           REGISTERED DATE
        ================================================================== */

        if (column.key === 'registeredDate') {
            return {
                ...column,

                render: (value) => (
                    <span
                        className="
                            whitespace-nowrap
                            text-[11px]
                            font-medium!
                            text-[#AEB7C3]
                        "
                    >
                        {value || '—'}
                    </span>
                ),
            };
        }

        /* ==================================================================
           ACTIONS
        ================================================================== */

        if (column.key === 'actions') {
            return {
                ...column,

                render: (_, row) => (
                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-0.5
                            whitespace-nowrap
                        "
                    >
                        {/* REVIEW */}

                        {row.verification_status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => onReview(row)}
                                title="Review organization"
                                aria-label="Review organization"
                                className="
                                    inline-flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-transparent
                                    bg-transparent
                                    text-[#A58B5E]
                                    transition-[background-color,border-color,color]
                                    duration-150
                                    hover:border-[#493D27]
                                    hover:bg-[#241E15]
                                    hover:text-[#D8B979]
                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <ShieldCheck size={14} strokeWidth={1.8} />
                            </button>
                        )}

                        {/* VIEW */}

                        <button
                            type="button"
                            onClick={() => onView(row.id)}
                            title="View organization"
                            aria-label="View organization"
                            className="
                                inline-flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-transparent
                                bg-transparent
                                text-[#8792A1]
                                transition-[background-color,border-color,color]
                                duration-150
                                hover:border-[#303A47]
                                hover:bg-[#1A222D]
                                hover:text-[#EEF1F5]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <Eye size={14} strokeWidth={1.8} />
                        </button>

                        {/* EDIT */}

                        {row.verification_status !== 'rejected' && (
                            <button
                                type="button"
                                onClick={() => onEdit(row.id)}
                                title="Edit organization"
                                aria-label="Edit organization"
                                className="
                                    inline-flex
                                    h-7
                                    w-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-transparent
                                    bg-transparent
                                    text-[#8792A1]
                                    transition-[background-color,border-color,color]
                                    duration-150
                                    hover:border-[#303A47]
                                    hover:bg-[#1A222D]
                                    hover:text-[#EEF1F5]
                                    focus:outline-none
                                    focus:ring-0
                                "
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                            </button>
                        )}

                        {/* DELETE */}

                        <button
                            type="button"
                            onClick={() => onDelete(row)}
                            title="Delete organization"
                            aria-label="Delete organization"
                            className="
                                inline-flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                border
                                border-transparent
                                bg-transparent
                                text-[#B4777E]
                                transition-[background-color,border-color,color]
                                duration-150
                                hover:border-[#493038]
                                hover:bg-[#281A1F]
                                hover:text-[#E1A0A6]
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <Trash2 size={14} strokeWidth={1.8} />
                        </button>
                    </div>
                ),
            };
        }

        return column;
    });

    /* ======================================================================
       MOBILE EMPTY STATE
    ====================================================================== */

    const mobileEmptyState = (
        <div
            className="
                flex
                min-h-65
                items-center
                justify-center
                bg-[#0E1219]
                px-6
                py-10
            "
        >
            <div className="text-center">
                <div
                    className="
                        mx-auto
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        border
                        border-[#29323E]
                        bg-[#151B24]
                    "
                >
                    <Building2
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#697586]"
                    />
                </div>

                <p
                    className="
                        mt-3
                        text-[13px]
                        font-semibold!
                        text-[#EEF1F5]
                    "
                >
                    No organizations found
                </p>

                <p
                    className="
                        mx-auto
                        mt-1
                        max-w-57.5
                        text-[11px]
                        leading-5
                        text-[#697586]
                    "
                >
                    Try changing your search or filter options.
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* ============================================================
                MOBILE ORGANIZATION DIRECTORY
            ============================================================ */}

            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? mobileEmptyState
                    : rows.map((row) => (
                          <MobileOrganizationRow
                              key={row.id}
                              row={row}
                              onView={onView}
                              onReview={onReview}
                              onEdit={onEdit}
                              onDelete={onDelete}
                          />
                      ))}
            </div>

            {/* ============================================================
                TABLET + DESKTOP TABLE
            ============================================================ */}

            <div
                className="
                    hidden
                    min-w-0
                    bg-[#0E1219]
                    lg:block
                "
            >
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    empty={{
                        icon: Building2,
                        title: 'No organizations found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </>
    );
};

export default Table;

import React, { useState } from 'react';

import DataTable from '@/components/dashboard/DataTable';

import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    Users,
    Eye,
    Trash2,
    CheckCircle2,
    CircleAlert,
    ShieldCheck,
    Building2,
    UserRound,
    Mail,
    ChevronRight,
} from 'lucide-react';

/* ==========================================================================
   HELPERS
============================================================================ */

const getVerificationState = (row) => {
    const verifiedAt = row?.email_verified_at ?? row?.emailVerifiedAt ?? null;

    const verifiedValue = row?.email_verified ?? row?.emailVerified ?? null;

    const isVerified =
        Boolean(verifiedAt) ||
        verifiedValue === true ||
        verifiedValue === 1 ||
        verifiedValue === '1' ||
        verifiedValue === 'verified';

    const method = row?.verification_method ?? row?.verificationMethod ?? null;

    const methodLabel = method
        ? String(method)
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase())
        : null;

    return {
        isVerified,
        methodLabel,
    };
};

const getRoleLabel = (role) => {
    if (role === 'admin') {
        return 'Administrator';
    }

    if (role === 'organization') {
        return 'Organization';
    }

    if (role === 'individual') {
        return 'Individual';
    }

    return role || 'Unknown';
};

/* ==========================================================================
   ROLE ICON
============================================================================ */

const RoleIcon = ({ role, size = 14, strokeWidth = 1.7, className = '' }) => {
    if (role === 'admin') {
        return (
            <ShieldCheck
                size={size}
                strokeWidth={strokeWidth}
                className={className}
            />
        );
    }

    if (role === 'organization') {
        return (
            <Building2
                size={size}
                strokeWidth={strokeWidth}
                className={className}
            />
        );
    }

    return (
        <UserRound
            size={size}
            strokeWidth={strokeWidth}
            className={className}
        />
    );
};

/* ==========================================================================
   USER AVATAR
============================================================================ */

const UserAvatar = ({ row, size = 'default' }) => {
    const [failedPhoto, setFailedPhoto] = useState(null);

    /*
     * `photo` belongs directly to the users table.
     *
     * This is the single source we use for the user's identity image,
     * regardless of whether the user is an individual, organization,
     * or admin.
     */
    const photo =
        typeof row?.photo === 'string' && row.photo.trim()
            ? row.photo.trim()
            : null;

    /*
     * Only hide the image when this exact photo URL has failed.
     *
     * This avoids using an effect to reset state when rows change.
     */
    const showImage = Boolean(photo) && failedPhoto !== photo;

    const dimensionClass = size === 'mobile' ? 'h-10 w-10' : 'h-8 w-8';

    const textClass = size === 'mobile' ? 'text-[12px]' : 'text-[10px]';

    const initial = row?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div
            className={`
                relative
                ${dimensionClass}
                shrink-0
                overflow-hidden
                border
                border-[#404754]
                bg-[#272B34]
            `}
        >
            {showImage ? (
                <img
                    src={photo}
                    alt=""
                    className="
                        block
                        h-full
                        w-full
                        object-cover
                    "
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedPhoto(photo)}
                />
            ) : (
                <div
                    className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                    "
                >
                    <span
                        className={`
                            ${textClass}
                            font-semibold
                            uppercase
                            text-[#C3C7CF]
                        `}
                    >
                        {initial}
                    </span>
                </div>
            )}
        </div>
    );
};

/* ==========================================================================
   VERIFICATION
============================================================================ */

const VerificationState = ({ row, compact = false }) => {
    const { isVerified, methodLabel } = getVerificationState(row);

    return (
        <div
            className={`
                flex
                min-w-0
                items-center
                ${compact ? 'gap-1.5' : 'gap-2'}
            `}
        >
            <span
                className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    ${compact ? 'h-5 w-5' : 'h-6 w-6'}
                    ${isVerified ? 'bg-[#24332F]' : 'bg-[#382F24]'}
                `}
            >
                {isVerified ? (
                    <CheckCircle2
                        size={compact ? 12 : 13}
                        strokeWidth={2}
                        className="text-[#7DB7A3]"
                    />
                ) : (
                    <CircleAlert
                        size={compact ? 12 : 13}
                        strokeWidth={2}
                        className="text-[#D5A35E]"
                    />
                )}
            </span>

            <div className="min-w-0">
                <p
                    className={`
                        truncate
                        font-medium
                        leading-4
                        ${compact ? 'text-[10px]' : 'text-[11px]'}
                        ${isVerified ? 'text-[#A9CDBF]' : 'text-[#E0B77D]'}
                    `}
                >
                    {isVerified ? 'Verified' : 'Unverified'}
                </p>

                {!compact && (
                    <p
                        className="
                            mt-0.5
                            max-w-32.5
                            truncate
                            text-[10px]
                            leading-4
                            text-[#6F7785]
                        "
                    >
                        {isVerified
                            ? methodLabel || 'Email'
                            : methodLabel || 'Verification pending'}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
   ROW ACTIONS
============================================================================ */

const RowActions = ({ row, onView, onDelete, mobile = false }) => {
    if (mobile) {
        return (
            <div className="flex shrink-0 items-center gap-1">
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    aria-label={`View ${row.name || 'user'}`}
                    title="View details"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        border
                        border-[#343944]
                        bg-[#272B34]
                        text-[#C3C7CF]
                        transition-colors
                        hover:border-[#515866]
                        hover:bg-[#303641]
                        hover:text-[#F1F2F4]
                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <ChevronRight size={16} strokeWidth={1.8} />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(row)}
                    aria-label={`Delete ${row.name || 'user'}`}
                    title="Delete user"
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        border
                        border-transparent
                        text-[#A86E76]
                        transition-colors
                        hover:border-[#5A343B]
                        hover:bg-[#38272C]
                        hover:text-[#E9A1A8]
                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <Trash2 size={15} strokeWidth={1.8} />
                </button>
            </div>
        );
    }

    return (
        <div
            className="
                flex
                items-center
                justify-end
                gap-1
            "
        >
            <button
                type="button"
                onClick={() => onView(row.id)}
                title="View details"
                aria-label="View details"
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-transparent
                    text-[#9299A6]
                    transition-colors
                    hover:border-[#404754]
                    hover:bg-[#303641]
                    hover:text-[#F1F2F4]
                    focus:outline-none
                    focus:ring-0
                "
            >
                <Eye size={15} strokeWidth={1.8} />
            </button>

            <button
                type="button"
                onClick={() => onDelete(row)}
                title="Delete"
                aria-label="Delete"
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-transparent
                    text-[#A86E76]
                    transition-colors
                    hover:border-[#5A343B]
                    hover:bg-[#38272C]
                    hover:text-[#E9A1A8]
                    focus:outline-none
                    focus:ring-0
                "
            >
                <Trash2 size={14} strokeWidth={1.8} />
            </button>
        </div>
    );
};

/* ==========================================================================
   MOBILE USER ROW
============================================================================ */

const MobileUserRow = ({ row, onView, onDelete }) => {
    return (
        <article
            className="
                border-b
                border-[#343944]
                bg-[#22252D]
                px-4
                py-4
                transition-colors
                last:border-b-0
            "
        >
            {/* =============================================================
                USER IDENTITY
            ============================================================= */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    className="
                        min-w-0
                        flex-1
                        text-left
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <UserAvatar row={row} size="mobile" />

                        <div className="min-w-0">
                            <p
                                className="
                                    truncate
                                    text-[13px]
                                    font-semibold
                                    leading-5
                                    text-[#F1F2F4]
                                "
                            >
                                {row.name || 'Unnamed user'}
                            </p>

                            <div
                                className="
                                    mt-0.5
                                    flex
                                    min-w-0
                                    items-center
                                    gap-1.5
                                "
                            >
                                <Mail
                                    size={11}
                                    strokeWidth={1.8}
                                    className="
                                        shrink-0
                                        text-[#6F7785]
                                    "
                                />

                                <p
                                    className="
                                        truncate
                                        text-[10px]
                                        text-[#9299A6]
                                    "
                                >
                                    {row.email || '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </button>

                <RowActions
                    row={row}
                    onView={onView}
                    onDelete={onDelete}
                    mobile
                />
            </div>

            {/* =============================================================
                USER META
            ============================================================= */}

            <div
                className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-x-4
                    gap-y-3
                    border-t
                    border-[#343944]
                    pt-3
                "
            >
                {/* Role */}

                <div className="min-w-0">
                    <p
                        className="
                            mb-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#6F7785]
                        "
                    >
                        Role
                    </p>

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-1.5
                        "
                    >
                        <RoleIcon
                            role={row.role}
                            size={13}
                            strokeWidth={1.8}
                            className="
                                shrink-0
                                text-[#9299A6]
                            "
                        />

                        <span
                            className="
                                truncate
                                text-[11px]
                                font-medium
                                text-[#C3C7CF]
                            "
                        >
                            {getRoleLabel(row.role)}
                        </span>
                    </div>
                </div>

                {/* Status */}

                <div className="min-w-0">
                    <p
                        className="
                            mb-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#6F7785]
                        "
                    >
                        Status
                    </p>

                    <StatusBadge status={row.status} />
                </div>

                {/* Verification */}

                <div
                    className="
                        col-span-2
                        min-w-0
                    "
                >
                    <p
                        className="
                            mb-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#6F7785]
                        "
                    >
                        Email verification
                    </p>

                    <VerificationState row={row} compact />
                </div>
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
    onDelete,
}) => {
    const enhancedColumns = columns
        .filter((column) => column.key !== 'email')
        .map((column) => {
            /* ==========================================================
               SERIAL NUMBER
            ========================================================== */

            if (column.key === 'serialNumber') {
                return {
                    ...column,
                    render: (value) => (
                        <span
                            className="
                                text-[11px]
                                font-medium
                                tabular-nums
                                text-[#6F7785]
                            "
                        >
                            {String(value).padStart(2, '0')}
                        </span>
                    ),
                };
            }

            /* ==========================================================
               USER
            ========================================================== */

            if (column.key === 'name') {
                return {
                    ...column,
                    header: 'User',
                    render: (value, row) => (
                        <div
                            className="
                                flex
                                min-w-0
                                max-w-70
                                items-center
                                gap-3
                            "
                        >
                            <UserAvatar row={row} />

                            <div className="min-w-0">
                                <button
                                    type="button"
                                    onClick={() => onView(row.id)}
                                    title={value || 'Unnamed user'}
                                    className="
                                        block
                                        max-w-full
                                        truncate
                                        text-left
                                        text-[12px]
                                        font-semibold
                                        leading-5
                                        text-[#F1F2F4]
                                        transition-colors
                                        hover:text-white
                                        focus:outline-none
                                        focus:ring-0
                                    "
                                >
                                    {value || 'Unnamed user'}
                                </button>

                                {row.email && (
                                    <p
                                        title={row.email}
                                        className="
                                            mt-0.5
                                            truncate
                                            text-[10px]
                                            leading-4
                                            text-[#6F7785]
                                        "
                                    >
                                        {row.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    ),
                };
            }

            /* ==========================================================
               ROLE
            ========================================================== */

            if (column.key === 'role') {
                return {
                    ...column,
                    render: (value) => (
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                whitespace-nowrap
                            "
                        >
                            <RoleIcon
                                role={value}
                                size={14}
                                strokeWidth={1.7}
                                className="
                                    shrink-0
                                    text-[#9299A6]
                                "
                            />

                            <span
                                className="
                                    text-[11px]
                                    font-medium
                                    text-[#C3C7CF]
                                "
                            >
                                {getRoleLabel(value)}
                            </span>
                        </div>
                    ),
                };
            }

            /* ==========================================================
               STATUS
            ========================================================== */

            if (column.key === 'status') {
                return {
                    ...column,
                    render: (value) => (
                        <div className="whitespace-nowrap">
                            <StatusBadge status={value} />
                        </div>
                    ),
                };
            }

            /* ==========================================================
               EMAIL VERIFICATION
            ========================================================== */

            if (
                column.key === 'emailVerification' ||
                column.key === 'email_verified_at' ||
                column.key === 'emailVerified'
            ) {
                return {
                    ...column,
                    render: (_, row) => <VerificationState row={row} />,
                };
            }

            /* ==========================================================
               ACTIONS
            ========================================================== */

            if (column.key === 'actions') {
                return {
                    ...column,
                    render: (_, row) => (
                        <RowActions
                            row={row}
                            onView={onView}
                            onDelete={onDelete}
                        />
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
                        border-[#343944]
                        bg-[#272B34]
                    "
                >
                    <Users
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#6F7785]"
                    />
                </div>

                <p
                    className="
                        mt-3
                        text-[13px]
                        font-semibold
                        text-[#F1F2F4]
                    "
                >
                    No users found
                </p>

                <p
                    className="
                        mx-auto
                        mt-1
                        max-w-57.5
                        text-[11px]
                        leading-5
                        text-[#6F7785]
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
                MOBILE DIRECTORY
            ============================================================ */}

            <div className="sm:hidden">
                {rows.length === 0
                    ? mobileEmptyState
                    : rows.map((row) => (
                          <MobileUserRow
                              key={row.id}
                              row={row}
                              onView={onView}
                              onDelete={onDelete}
                          />
                      ))}
            </div>

            {/* ============================================================
                TABLET + DESKTOP TABLE
            ============================================================ */}

            <div className="hidden sm:block">
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    empty={{
                        icon: Users,
                        title: 'No users found',
                        message: 'Try changing your search or filter options.',
                    }}
                />
            </div>
        </>
    );
};

export default Table;

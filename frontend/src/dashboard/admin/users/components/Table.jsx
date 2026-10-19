import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DataTable from '@/components/dashboard/DataTable';

import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    Users,
    Eye,
    Pencil,
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
     * This remains the single source for the user's identity image,
     * regardless of whether the account belongs to an individual,
     * organization, or administrator.
     */

    const photo =
        typeof row?.photo === 'string' && row.photo.trim()
            ? row.photo.trim()
            : null;

    /*
     * Only hide the image when this exact URL failed.
     * This avoids requiring an effect to reset the failed state.
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
                border-[#29323E]
                bg-[#151B24]
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
                            font-semibold!
                            uppercase
                            text-[#B8C0CA]
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
    const { isVerified } = getVerificationState(row);

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
                    ${
                        isVerified
                            ? 'border border-[#294438] bg-[#14231D]'
                            : 'border border-[#443723] bg-[#241E15]'
                    }
                `}
            >
                {isVerified ? (
                    <CheckCircle2
                        size={compact ? 12 : 13}
                        strokeWidth={2}
                        className="text-[#8EC5A3]"
                    />
                ) : (
                    <CircleAlert
                        size={compact ? 12 : 13}
                        strokeWidth={2}
                        className="text-[#D0AA70]"
                    />
                )}
            </span>

            <div className="min-w-0">
                <p
                    className={`
                        truncate
                        font-medium!
                        leading-4
                        ${compact ? 'text-[10px]' : 'text-[11px]'}
                        ${isVerified ? 'text-[#8EC5A3]' : 'text-[#D0AA70]'}
                    `}
                >
                    {isVerified ? 'Verified' : 'Unverified'}
                </p>

                {/* {!compact && (
                    <p
                        className="
                            mt-0.5
                            max-w-32.5
                            truncate
                            text-[10px]
                            leading-4
                            text-[#697586]
                        "
                    >
                        {isVerified
                            ? methodLabel || 'Email'
                            : methodLabel || 'Verification pending'}
                    </p>
                )} */}
            </div>
        </div>
    );
};

/* ==========================================================================
   ROW ACTIONS
============================================================================ */

const RowActions = ({ row, onView, onEdit, onDelete }) => (
    <div className="flex items-center justify-end gap-0.5 whitespace-nowrap">
        {[
            {
                label: 'View',
                Icon: Eye,
                action: () => onView(row.id),
                danger: false,
            },
            {
                label: 'Edit',
                Icon: Pencil,
                action: () => onEdit(row.id),
                danger: false,
            },
            {
                label: 'Delete',
                Icon: Trash2,
                action: () => onDelete(row),
                danger: true,
            },
        ].map(({ label, Icon, action, danger }) => (
            <button
                key={label}
                type="button"
                onClick={action}
                title={`${label} user`}
                aria-label={`${label} ${row.name || 'user'}`}
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center border border-transparent bg-transparent transition-[background-color,border-color,color] duration-150 focus:outline-none focus:ring-0 ${
                    danger
                        ? 'text-[#B4777E] hover:border-[#493038] hover:bg-[#281A1F] hover:text-[#E1A0A6]'
                        : 'text-[#8792A1] hover:border-[#303A47] hover:bg-[#1A222D] hover:text-[#EEF1F5]'
                }`}
            >
                <Icon size={14} strokeWidth={1.8} />
            </button>
        ))}
    </div>
);

const MobileUserRow = ({ row, onView, onEdit, onDelete }) => {
    const { isVerified, methodLabel } = getVerificationState(row);

    return (
        <article
            className="
                group
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
                PRIMARY USER INFO
            ============================================================== */}

            <div className="flex min-w-0 items-start gap-3">
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    aria-label={`View ${row.name || 'user'}`}
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
                    <UserAvatar row={row} size="mobile" />

                    <div className="min-w-0 flex-1">
                        <p
                            title={row.name || 'Unnamed user'}
                            className="
                                truncate
                                text-[14px]
                                font-semibold!
                                leading-5
                                text-[#F1F3F6]
                            "
                        >
                            {row.name || 'Unnamed user'}
                        </p>

                        <p
                            title={row.email || ''}
                            className="
                                mt-0.5
                                truncate
                                text-[12px]
                                leading-[18px]
                                text-[#7F8A99]
                            "
                        >
                            {row.email || 'No email address'}
                        </p>
                    </div>
                </button>
            </div>

            {/* =============================================================
                META
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
                {/* ROLE */}

                <div
                    className="
                        inline-flex
                        min-w-0
                        max-w-[150px]
                        items-center
                        gap-1.5
                        text-[#AEB7C3]
                    "
                >
                    <RoleIcon
                        role={row.role}
                        size={13}
                        strokeWidth={1.8}
                        className="shrink-0 text-[#737F8F]"
                    />

                    <span
                        className="
                            truncate
                            text-[11px]
                            font-medium!
                            leading-4
                        "
                    >
                        {getRoleLabel(row.role)}
                    </span>
                </div>

                {/* SEPARATOR */}

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

                {/* STATUS */}

                <div className="min-w-0 shrink-0">
                    <StatusBadge status={row.status} />
                </div>
            </div>

            {/* =============================================================
                VERIFICATION
            ============================================================== */}

            <div
                className="
                    mt-3
                    ml-[52px]
                    flex
                    min-w-0
                    items-center
                    gap-2
                    border-t
                    border-[#1B232D]
                    pt-2.5
                "
            >
                <span
                    className={`
                        flex
                        h-[18px]
                        w-[18px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                            isVerified
                                ? 'bg-[#16251E] text-[#8EC5A3]'
                                : 'bg-[#271F15] text-[#D0AA70]'
                        }
                    `}
                >
                    {isVerified ? (
                        <CheckCircle2 size={11} strokeWidth={2.1} />
                    ) : (
                        <CircleAlert size={11} strokeWidth={2.1} />
                    )}
                </span>

                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    <span
                        className={`
                            shrink-0
                            text-[11px]
                            font-medium!
                            leading-4
                            ${isVerified ? 'text-[#8EC5A3]' : 'text-[#D0AA70]'}
                        `}
                    >
                        {isVerified ? 'Verified' : 'Not verified'}
                    </span>

                    <span
                        aria-hidden="true"
                        className="text-[10px] text-[#3D4856]"
                    >
                        •
                    </span>

                    <span
                        title={
                            isVerified
                                ? methodLabel || 'Email verification'
                                : 'Email verification required'
                        }
                        className="
                            min-w-0
                            truncate
                            text-[10px]
                            leading-4
                            text-[#697586]
                        "
                    >
                        {isVerified
                            ? methodLabel || 'Email verification'
                            : 'Email verification required'}
                    </span>
                </div>
            </div>
            {/* ACTIONS — aligned with the Organizations mobile table */}
            <div
                className="mt-3 ml-[52px] flex min-w-0 items-center gap-2
                    border-t
                    border-[#1B232D] pt-4"
            >
                {[
                    { label: 'View', Icon: Eye, action: () => onView(row.id) },
                    {
                        label: 'Edit',
                        Icon: Pencil,
                        action: () => onEdit(row.id),
                    },
                ].map(({ label, Icon, action }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={action}
                        aria-label={`${label} ${row.name || 'user'}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 border border-[#29323E] bg-[#151B24] px-2.5 text-[11px] font-medium! text-[#AEB7C3] transition-colors duration-150 hover:border-[#394555] hover:bg-[#1A222D] hover:text-[#EEF1F5] focus:outline-none focus:ring-0"
                    >
                        <Icon size={13} strokeWidth={1.8} />
                        {label}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => onDelete(row)}
                    title="Delete user"
                    aria-label={`Delete ${row.name || 'user'}`}
                    className="
        inline-flex ml-auto h-8 items-center justify-center
        gap-1.5 border border-[#493038]
        bg-[#241A1E] px-2.5
        text-[11px] font-medium! text-[#D1959B]
        transition-colors duration-150
        hover:border-[#69404A]
        hover:bg-[#302025]
        hover:text-[#F0B0B6]
        focus:outline-none focus:ring-0
    "
                >
                    <Trash2 size={13} strokeWidth={1.8} />
                    Delete
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
    onDelete,
}) => {
    const navigate = useNavigate();
    const handleEdit = (id) => {
        navigate(`/admin/dashboard/users/${id}/edit`);
    };

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
                                font-medium!
                                tabular-nums
                                text-[#697586]
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
                                        font-semibold!
                                        leading-5
                                        text-[#EEF1F5]
                                        transition-colors
                                        duration-150
                                        hover:text-[#FFFFFF]
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
                                            text-[#697586]
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
                                    text-[#8792A1]
                                "
                            />

                            <span
                                className="
                                    text-[11px]
                                    font-medium!
                                    text-[#B8C0CA]
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
                            onEdit={handleEdit}
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
                    <Users
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
                    No users found
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
                MOBILE DIRECTORY
            ============================================================ */}

            <div
                className="
                    bg-[#0E1219]
                    lg:hidden
                "
            >
                {rows.length === 0
                    ? mobileEmptyState
                    : rows.map((row) => (
                          <MobileUserRow
                              key={row.id}
                              row={row}
                              onView={onView}
                              onEdit={handleEdit}
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
                    resizableColumns
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

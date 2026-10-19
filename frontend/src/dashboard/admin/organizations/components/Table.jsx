import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import { Building2, Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react';

/* ==========================================================================
   ORGANIZATION ACCOUNT STATUS
============================================================================ */

const getOrganizationUserStatus = (row) => {
    const status = row?.user?.status ?? row?.status;

    if (!status) return '';

    return String(status).trim().toLowerCase();
};

/* ==========================================================================
   ORGANIZATION IDENTITY
============================================================================ */

const OrganizationIdentity = ({ row, value, onView }) => {
    const [failedPhoto, setFailedPhoto] = useState(null);
    const name = value || row?.name || 'Unnamed organization';
    const email = row?.contactEmail || '';

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
        <div className="flex min-w-0 items-center gap-3">
            <div
                className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    overflow-hidden border border-[#29323E]
                    bg-[#151B24] text-[#8792A1]
                "
            >
                {photo && failedPhoto !== photo ? (
                    <img
                        src={photo}
                        alt={`${name} logo`}
                        className="h-full w-full object-cover"
                        onError={() => {
                            setFailedPhoto(photo);
                        }}
                    />
                ) : initials ? (
                    <span
                        className="
                            select-none text-[8px] font-semibold!
                            uppercase tracking-wide text-[#C7CED8]
                        "
                    >
                        {initials}
                    </span>
                ) : (
                    <Building2 size={12} strokeWidth={1.7} />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    title={name}
                    className="
                        truncate text-[12px] font-semibold!
                        leading-4 text-[#EEF1F5]
                    "
                >
                    {name}
                </button>

                {email && (
                    <p
                        title={email}
                        className="
                            mt-0.5 truncate text-[10px]
                            leading-4 text-[#697586]
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
    const [failedPhoto, setFailedPhoto] = useState(null);
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
                flex h-10 w-10 shrink-0 items-center justify-center
                overflow-hidden border border-[#29323E]
                bg-[#151B24] text-[#8792A1]
            "
        >
            {photo && failedPhoto !== photo ? (
                <img
                    src={photo}
                    alt=""
                    className="block h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                        setFailedPhoto(photo);
                    }}
                />
            ) : initials ? (
                <span
                    className="
                        select-none text-[11px] font-semibold!
                        uppercase tracking-wide text-[#C7CED8]
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
    const userStatus = getOrganizationUserStatus(row);

    return (
        <article
            className="
                border-b border-[#202832] bg-[#0E1219]
                px-4 py-4 transition-colors duration-150
                last:border-b-0 hover:bg-[#111720]
            "
        >
            {/* ORGANIZATION INFORMATION */}

            <div className="flex min-w-0 items-start gap-3">
                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    aria-label={`View ${name}`}
                    className="
                        flex min-w-0 flex-1 items-center gap-3
                        text-left focus:outline-none focus:ring-0
                    "
                >
                    <MobileOrganizationAvatar row={row} />

                    <div className="min-w-0 flex-1">
                        <p
                            title={name}
                            className="
                                truncate text-[14px] font-semibold!
                                leading-5 text-[#F1F3F6]
                            "
                        >
                            {name}
                        </p>

                        <p
                            title={email}
                            className="
                                mt-0.5 truncate text-[12px]
                                leading-4.5 text-[#7F8A99]
                            "
                        >
                            {email || 'No contact email'}
                        </p>
                    </div>
                </button>
            </div>

            {/* TYPE AND VERIFICATION STATUS */}

            <div
                className="
                    mt-3 ml-13 flex min-w-0 flex-wrap
                    items-center gap-x-2 gap-y-2
                "
            >
                <div
                    className="
                        flex min-w-0 max-w-42.5 items-center
                        gap-1.5 text-[#AEB7C3]
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
                            truncate text-[11px] font-medium!
                            capitalize leading-4
                        "
                    >
                        {row.organization_type || 'Not specified'}
                    </span>
                </div>

                <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full bg-[#36404C]"
                />

                <div className="shrink-0">
                    <StatusBadge status={row.verification_status} />
                </div>
            </div>

            {/* USER ACCOUNT STATUS */}

            <div
                className="
                    mt-3 ml-13 flex min-w-0 flex-wrap
                    items-center justify-between gap-2
                    border-t border-[#1B232D] pt-2.5
                "
            >
                <span
                    className="
                        text-[10px] font-medium! uppercase
                        tracking-[0.06em] text-[#5F6B7A]
                    "
                >
                    User Status
                </span>

                {userStatus ? (
                    <StatusBadge status={userStatus} />
                ) : (
                    <span className="text-[11px] text-[#697586]">
                        Not available
                    </span>
                )}
            </div>

            {/* REGISTRATION INFORMATION */}

            <div
                className="
                    mt-3 ml-13 flex min-w-0 items-start
                    justify-between gap-4 border-t border-[#1B232D] pt-3
                "
            >
                <div className="min-w-0 flex-1">
                    <p
                        className="
                            text-[10px] font-medium! uppercase
                            tracking-[0.06em] text-[#5F6B7A]
                        "
                    >
                        Registration
                    </p>

                    <p
                        title={row.registration_number || '—'}
                        className="
                            mt-1 truncate text-[11px] font-medium!
                            tabular-nums text-[#AEB7C3]
                        "
                    >
                        {row.registration_number || '—'}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p
                        className="
                            text-[10px] font-medium! uppercase
                            tracking-[0.06em] text-[#5F6B7A]
                        "
                    >
                        Registered
                    </p>

                    <p
                        title={row.registeredDate || '—'}
                        className="
                            mt-1 truncate text-[11px] font-medium!
                            text-[#AEB7C3]
                        "
                    >
                        {row.registeredDate || '—'}
                    </p>
                </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-3 ml-13 flex min-w-0 flex-wrap items-center gap-2">
                {row.verification_status === 'pending' && (
                    <button
                        type="button"
                        onClick={() => onReview(row)}
                        title="Review organization"
                        aria-label={`Review ${name}`}
                        className="
                            inline-flex h-8 items-center justify-center
                            gap-1.5 border border-[#493D27]
                            bg-[#241E15] px-2.5 text-[11px]
                            font-medium! text-[#D8B979]
                            transition-colors duration-150
                            hover:border-[#594A30] hover:bg-[#2A2218]
                            focus:outline-none focus:ring-0
                        "
                    >
                        <ShieldCheck size={13} strokeWidth={1.8} />
                        Review
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onView(row.id)}
                    title="View organization"
                    aria-label={`View ${name}`}
                    className="
                        inline-flex h-8 items-center justify-center
                        gap-1.5 border border-[#29323E]
                        bg-[#151B24] px-2.5 text-[11px]
                        font-medium! text-[#AEB7C3]
                        transition-colors duration-150
                        hover:border-[#394555] hover:bg-[#1A222D]
                        hover:text-[#EEF1F5]
                        focus:outline-none focus:ring-0
                    "
                >
                    <Eye size={13} strokeWidth={1.8} />
                    View
                </button>

                {row.verification_status !== 'rejected' && (
                    <button
                        type="button"
                        onClick={() => onEdit(row.id)}
                        title="Edit organization"
                        aria-label={`Edit ${name}`}
                        className="
                            inline-flex h-8 items-center justify-center
                            gap-1.5 border border-[#29323E]
                            bg-[#151B24] px-2.5 text-[11px]
                            font-medium! text-[#AEB7C3]
                            transition-colors duration-150
                            hover:border-[#394555] hover:bg-[#1A222D]
                            hover:text-[#EEF1F5]
                            focus:outline-none focus:ring-0
                        "
                    >
                        <Pencil size={13} strokeWidth={1.8} />
                        Edit
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onDelete(row)}
                    title="Delete organization"
                    aria-label={`Delete ${name}`}
                    className="
                        ml-auto inline-flex h-8 w-8 shrink-0
                        items-center justify-center border
                        border-transparent bg-transparent
                        text-[#B4777E] transition-colors
                        duration-150 hover:border-[#493038]
                        hover:bg-[#281A1F] hover:text-[#E1A0A6]
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
    onReview,
    onEdit,
    onDelete,
}) => {
    /*
     * Keep View and Edit on separate routes.
     * The parent may provide handlers; otherwise, use the default routes.
     */

    const navigate = useNavigate();

    const handleView = (id) => {
        if (onView) {
            onView(id);
        } else {
            navigate(`/admin/dashboard/organizations/${id}`);
        }
    };

    const handleEdit = (id) => {
        if (onEdit) {
            onEdit(id);
        } else {
            navigate(`/admin/dashboard/organizations/${id}/edit`);
        }
    };

    /*
     * Ensure the account-status column has a visible header.
     * This fixes a blank header when the parent supplies a column
     * with key="status" but no label/title.
     */

    const columnsWithAccountStatus = columns.map((column) => {
        if (column.key === 'status') {
            return {
                ...column,
                header: 'Account Status',
                label: column.label || 'Account Status',
                title: column.title || 'Account Status',
                width: column.width || 'minmax(115px, 0.9fr)',
            };
        }

        return column;
    });

    const enhancedColumns = columnsWithAccountStatus.map((column) => {
        /* SERIAL NUMBER */

        if (column.key === 'serialNumber') {
            return {
                ...column,
                render: (value) => (
                    <span
                        className="
                            block whitespace-nowrap text-[11px]
                            font-medium! tabular-nums text-[#788596]
                        "
                    >
                        {String(value).padStart(2, '0')}
                    </span>
                ),
            };
        }

        /* ORGANIZATION */

        if (column.key === 'name') {
            return {
                ...column,
                render: (value, row) => (
                    <OrganizationIdentity
                        row={row}
                        value={value}
                        onView={handleView}
                    />
                ),
            };
        }

        /* REGISTRATION NUMBER */

        if (column.key === 'registration_number') {
            return {
                ...column,
                render: (value) => (
                    <span
                        title={value || '—'}
                        className="
                            block min-w-0 truncate text-[11px]
                            font-medium! tabular-nums text-[#8792A1]
                        "
                    >
                        {value || '—'}
                    </span>
                ),
            };
        }

        /* ORGANIZATION TYPE */

        if (column.key === 'organization_type') {
            return {
                ...column,
                render: (value) => (
                    <div className="flex min-w-0 items-center gap-2">
                        <Building2
                            size={13}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#697586]"
                        />

                        <span
                            title={value || 'Not specified'}
                            className="
                                min-w-0 truncate text-[11px]
                                font-medium! capitalize text-[#D4D9E0]
                            "
                        >
                            {value || 'Not specified'}
                        </span>
                    </div>
                ),
            };
        }

        /* VERIFICATION STATUS */

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

        /* USER ACCOUNT STATUS */

        if (column.key === 'status') {
            return {
                ...column,
                header: 'Account Status',
                label: column.label || 'Account Status',
                title: column.title || 'Account Status',
                width: column.width || 'minmax(115px, 0.9fr)',

                render: (value, row) => {
                    const userStatus =
                        getOrganizationUserStatus(row) ||
                        (typeof value === 'string'
                            ? value.trim().toLowerCase()
                            : '');

                    return (
                        <div className="whitespace-nowrap">
                            {userStatus ? (
                                <StatusBadge status={userStatus} />
                            ) : (
                                <span className="text-[11px] text-[#697586]">
                                    —
                                </span>
                            )}
                        </div>
                    );
                },
            };
        }

        /* REGISTERED DATE */

        if (column.key === 'registeredDate') {
            return {
                ...column,
                render: (value) => (
                    <span
                        className="
                            whitespace-nowrap text-[11px]
                            font-medium! text-[#AEB7C3]
                        "
                    >
                        {value || '—'}
                    </span>
                ),
            };
        }

        /* ACTIONS */

        if (column.key === 'actions') {
            return {
                ...column,
                render: (_, row) => (
                    <div
                        className="
                            flex items-center justify-end gap-0.5
                            whitespace-nowrap
                        "
                    >
                        {row.verification_status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => onReview(row)}
                                title="Review organization"
                                aria-label="Review organization"
                                className="
                                    inline-flex h-7 w-7 shrink-0
                                    items-center justify-center border
                                    border-transparent bg-transparent
                                    text-[#A58B5E]
                                    transition-[background-color,border-color,color]
                                    duration-150 hover:border-[#493D27]
                                    hover:bg-[#241E15] hover:text-[#D8B979]
                                    focus:outline-none focus:ring-0
                                "
                            >
                                <ShieldCheck size={14} strokeWidth={1.8} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => handleView(row.id)}
                            title="View organization"
                            aria-label={`View ${row.name || 'organization'}`}
                            className="
                                inline-flex h-7 w-7 shrink-0
                                items-center justify-center border
                                border-transparent bg-transparent
                                text-[#8792A1]
                                transition-[background-color,border-color,color]
                                duration-150 hover:border-[#303A47]
                                hover:bg-[#1A222D] hover:text-[#EEF1F5]
                                focus:outline-none focus:ring-0
                            "
                        >
                            <Eye size={14} strokeWidth={1.8} />
                        </button>

                        {row.verification_status !== 'rejected' && (
                            <button
                                type="button"
                                onClick={() => handleEdit(row.id)}
                                title="Edit organization"
                                aria-label={`Edit ${row.name || 'organization'}`}
                                className="
                                    inline-flex h-7 w-7 shrink-0
                                    items-center justify-center border
                                    border-transparent bg-transparent
                                    text-[#8792A1]
                                    transition-[background-color,border-color,color]
                                    duration-150 hover:border-[#303A47]
                                    hover:bg-[#1A222D] hover:text-[#EEF1F5]
                                    focus:outline-none focus:ring-0
                                "
                            >
                                <Pencil size={14} strokeWidth={1.8} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => onDelete(row)}
                            title="Delete organization"
                            aria-label={`Delete ${row.name || 'organization'}`}
                            className="
                                inline-flex h-7 w-7 shrink-0
                                items-center justify-center border
                                border-transparent bg-transparent
                                text-[#B4777E]
                                transition-[background-color,border-color,color]
                                duration-150 hover:border-[#493038]
                                hover:bg-[#281A1F] hover:text-[#E1A0A6]
                                focus:outline-none focus:ring-0
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

    /* MOBILE EMPTY STATE */

    const mobileEmptyState = (
        <div
            className="
                flex min-h-65 items-center justify-center
                bg-[#0E1219] px-6 py-10
            "
        >
            <div className="text-center">
                <div
                    className="
                        mx-auto flex h-10 w-10 items-center
                        justify-center border border-[#29323E]
                        bg-[#151B24]
                    "
                >
                    <Building2
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#697586]"
                    />
                </div>

                <p className="mt-3 text-[13px] font-semibold! text-[#EEF1F5]">
                    No organizations found
                </p>

                <p
                    className="
                        mx-auto mt-1 max-w-57.5 text-[11px]
                        leading-5 text-[#697586]
                    "
                >
                    Try changing your search or filter options.
                </p>
            </div>
        </div>
    );

    return (
        <>
            {/* MOBILE ORGANIZATION DIRECTORY */}

            <div className="bg-[#0E1219] lg:hidden">
                {rows.length === 0
                    ? mobileEmptyState
                    : rows.map((row) => (
                          <MobileOrganizationRow
                              key={row.id}
                              row={row}
                              onView={handleView}
                              onReview={onReview}
                              onEdit={handleEdit}
                              onDelete={onDelete}
                          />
                      ))}
            </div>

            {/* TABLET + DESKTOP TABLE */}

            <div className="hidden min-w-0 bg-[#0E1219] lg:block">
                <DataTable
                    columns={enhancedColumns}
                    rows={rows}
                    onSort={onSort}
                    getSortIcon={getSortIcon}
                    resultCount={resultCount}
                    resizableColumns
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

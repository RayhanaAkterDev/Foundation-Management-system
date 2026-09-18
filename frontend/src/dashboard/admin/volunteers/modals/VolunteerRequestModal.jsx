import React, { useMemo, useState } from 'react';

import { Check, Search, Send, UserRound, X } from 'lucide-react';

const VolunteerRequestModal = ({
    open,
    users = [],
    selectedUsers = [],
    loading = false,
    submitting = false,
    error = '',
    onClose,
    onToggleUser,
    onSubmit,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return users;
        }

        return users.filter((user) => {
            const name = user.name?.toLowerCase() || '';
            const email = user.email?.toLowerCase() || '';
            const district = user.district?.toLowerCase() || '';

            return (
                name.includes(search) ||
                email.includes(search) ||
                district.includes(search)
            );
        });
    }, [users, searchTerm]);

    const allVisibleSelected =
        filteredUsers.length > 0 &&
        filteredUsers.every((user) => selectedUsers.includes(user.id));

    const handleClose = () => {
        if (submitting) {
            return;
        }

        setSearchTerm('');
        onClose();
    };

    const handleSelectAll = () => {
        if (filteredUsers.length === 0) {
            return;
        }

        if (allVisibleSelected) {
            filteredUsers.forEach((user) => {
                if (selectedUsers.includes(user.id)) {
                    onToggleUser(user.id);
                }
            });

            return;
        }

        filteredUsers.forEach((user) => {
            if (!selectedUsers.includes(user.id)) {
                onToggleUser(user.id);
            }
        });
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-[2px]
            "
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="
                    flex
                    max-h-[min(720px,calc(100vh-32px))]
                    w-full
                    max-w-2xl
                    flex-col
                    overflow-hidden
                    border
                    border-border
                    bg-white
                    shadow-2xl
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="volunteer-request-title"
            >
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="shrink-0 border-b border-border px-6 py-5 sm:px-7">
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    bg-primary/10
                                    text-primary
                                "
                            >
                                <Send size={18} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    id="volunteer-request-title"
                                    className="
                                        font-fraunces
                                        text-[23px]
                                        font-semibold
                                        leading-tight
                                        tracking-tight
                                        text-text-primary
                                    "
                                >
                                    Invite volunteers
                                </h2>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-lg
                                        text-[12px]
                                        leading-5
                                        text-text-secondary
                                    "
                                >
                                    Select registered individuals and send them
                                    an invitation to join the volunteer network.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            aria-label="Close"
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                text-text-secondary
                                transition-colors
                                hover:bg-background-alt
                                hover:text-text-primary
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <X size={18} strokeWidth={1.8} />
                        </button>
                    </div>
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="px-6 py-5 sm:px-7">
                        {/* Search */}

                        <div className="relative">
                            <Search
                                size={16}
                                strokeWidth={1.8}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-text-secondary
                                "
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search by name, email or district"
                                disabled={loading || submitting}
                                className="
                                    h-10
                                    w-full
                                    border
                                    border-border
                                    bg-background
                                    pl-10
                                    pr-4
                                    text-[13px]
                                    font-medium
                                    text-text-primary
                                    outline-none
                                    transition-colors
                                    placeholder:text-text-secondary/65
                                    hover:border-text-secondary/30
                                    focus:border-primary/50
                                    focus:bg-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />
                        </div>

                        {/* Selection toolbar */}

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                gap-4
                                border-y
                                border-border
                                py-3
                            "
                        >
                            <div>
                                <p className="text-xs font-semibold text-text-primary">
                                    {selectedUsers.length} selected
                                </p>

                                <p className="mt-0.5 text-[11px] text-text-secondary">
                                    {filteredUsers.length}{' '}
                                    {filteredUsers.length === 1
                                        ? 'eligible user'
                                        : 'eligible users'}{' '}
                                    shown
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSelectAll}
                                disabled={
                                    loading ||
                                    submitting ||
                                    filteredUsers.length === 0
                                }
                                className="
                                    shrink-0
                                    text-[11px]
                                    font-semibold
                                    text-primary
                                    transition-colors
                                    hover:text-primary-hover
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                {allVisibleSelected
                                    ? 'Clear selection'
                                    : 'Select all'}
                            </button>
                        </div>

                        {/* Error */}

                        {error && (
                            <div
                                className="
                                    mt-4
                                    border-l-4
                                    border-red-500
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-xs
                                    leading-5
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Loading */}

                        {loading && (
                            <div className="flex min-h-55 items-center justify-center">
                                <div className="text-center">
                                    <div
                                        className="
                                            mx-auto
                                            mb-3
                                            h-7
                                            w-7
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-border
                                            border-t-primary
                                        "
                                    />

                                    <p className="text-xs font-semibold text-text-primary">
                                        Loading eligible users...
                                    </p>

                                    <p className="mt-1 text-[11px] text-text-secondary">
                                        Retrieving registered individuals who
                                        can be invited.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* User list */}

                        {!loading && filteredUsers.length > 0 && (
                            <div className="mt-3 divide-y divide-border border-b border-border">
                                {filteredUsers.map((user) => {
                                    const selected = selectedUsers.includes(
                                        user.id,
                                    );

                                    return (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() =>
                                                onToggleUser(user.id)
                                            }
                                            disabled={submitting}
                                            className={`
                                                group
                                                flex
                                                w-full
                                                items-center
                                                gap-3.5
                                                px-2
                                                py-3.5
                                                text-left
                                                transition-colors
                                                hover:bg-background
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                                ${
                                                    selected
                                                        ? 'bg-primary/[0.035]'
                                                        : ''
                                                }
                                            `}
                                        >
                                            {/* Checkbox */}

                                            <span
                                                className={`
                                                    flex
                                                    h-5
                                                    w-5
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    border
                                                    transition-all
                                                    ${
                                                        selected
                                                            ? 'border-primary bg-primary text-white'
                                                            : 'border-slate-300 bg-white text-transparent group-hover:border-primary/50'
                                                    }
                                                `}
                                            >
                                                <Check
                                                    size={13}
                                                    strokeWidth={2.5}
                                                />
                                            </span>

                                            {/* Avatar */}

                                            <span
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    bg-background-alt
                                                    text-text-secondary
                                                "
                                            >
                                                <UserRound
                                                    size={17}
                                                    strokeWidth={1.7}
                                                />
                                            </span>

                                            {/* User details */}

                                            <span className="min-w-0 flex-1">
                                                <span
                                                    className="
                                                        block
                                                        truncate
                                                        text-[13px]
                                                        font-semibold
                                                        text-text-primary
                                                    "
                                                >
                                                    {user.name ||
                                                        'Unnamed user'}
                                                </span>

                                                <span
                                                    className="
                                                        mt-0.5
                                                        block
                                                        truncate
                                                        text-[11px]
                                                        text-text-secondary
                                                    "
                                                >
                                                    {user.email ||
                                                        'No email available'}
                                                </span>
                                            </span>

                                            {/* User metadata */}

                                            <span
                                                className="
                                                    hidden
                                                    shrink-0
                                                    text-right
                                                    sm:block
                                                "
                                            >
                                                <span
                                                    className="
                                                        block
                                                        text-[9px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-text-secondary
                                                    "
                                                >
                                                    District
                                                </span>

                                                <span
                                                    className="
                                                        mt-0.5
                                                        block
                                                        max-w-28
                                                        truncate
                                                        text-[11px]
                                                        font-medium
                                                        text-text-primary
                                                    "
                                                >
                                                    {user.district ||
                                                        'Not provided'}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Empty state */}

                        {!loading && filteredUsers.length === 0 && (
                            <div
                                className="
                                        flex
                                        min-h-55
                                        items-center
                                        justify-center
                                        border-b
                                        border-border
                                    "
                            >
                                <div className="max-w-sm text-center">
                                    <div
                                        className="
                                                mx-auto
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                bg-background-alt
                                                text-text-secondary
                                            "
                                    >
                                        <UserRound
                                            size={18}
                                            strokeWidth={1.7}
                                        />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-text-primary">
                                        {searchTerm
                                            ? 'No matching users'
                                            : 'No eligible users'}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                        {searchTerm
                                            ? 'Try a different name, email or district.'
                                            : 'There are currently no registered individuals available to receive a volunteer invitation.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div
                    className="
                        shrink-0
                        border-t
                        border-border
                        bg-background
                        px-6
                        py-4
                        sm:px-7
                    "
                >
                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div className="min-w-0">
                            {selectedUsers.length > 0 ? (
                                <p className="text-xs text-text-secondary">
                                    <span className="font-semibold text-text-primary">
                                        {selectedUsers.length}
                                    </span>{' '}
                                    {selectedUsers.length === 1
                                        ? 'person'
                                        : 'people'}{' '}
                                    will receive a volunteer invitation.
                                </p>
                            ) : (
                                <p className="text-xs text-text-secondary">
                                    Select one or more people to continue.
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={submitting}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    border
                                    border-border
                                    bg-white
                                    px-4
                                    text-xs
                                    font-semibold
                                    text-text-secondary
                                    transition-colors
                                    hover:border-text-secondary/30
                                    hover:bg-background-alt
                                    hover:text-text-primary
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={
                                    submitting || selectedUsers.length === 0
                                }
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-primary
                                    px-4
                                    text-xs
                                    font-semibold
                                    text-white
                                    shadow-sm
                                    transition-all
                                    hover:bg-primary-hover
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                {submitting ? (
                                    <>
                                        <span
                                            className="
                                                h-3.5
                                                w-3.5
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-white/40
                                                border-t-white
                                            "
                                        />

                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} strokeWidth={2} />

                                        <span>
                                            Send
                                            {selectedUsers.length > 0
                                                ? ` ${selectedUsers.length}`
                                                : ''}{' '}
                                            Request
                                            {selectedUsers.length !== 1
                                                ? 's'
                                                : ''}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerRequestModal;

import React, { useEffect, useMemo, useState } from 'react';
import {
    AlertCircle,
    Check,
    LoaderCircle,
    Search,
    Send,
    Users,
    X,
} from 'lucide-react';

const initial = (name) =>
    String(name || '?')
        .trim()
        .charAt(0)
        .toUpperCase();

function Avatar({ user }) {
    const [failed, setFailed] = useState(false);
    const photo = user.photo || user.avatar;

    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-[#303A47] bg-[#1A222D] text-[12px] font-semibold text-[#B9C5D2]">
            {photo && !failed ? (
                <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setFailed(true)}
                />
            ) : (
                initial(user.name)
            )}
        </span>
    );
}

export default function VolunteerRequestModal({
    open,
    users = [],
    selectedUsers = [],
    loading = false,
    submitting = false,
    error = '',
    onClose,
    onToggleUser,
    onSubmit,
}) {
    const [search, setSearch] = useState('');
    const selected = useMemo(() => new Set(selectedUsers), [selectedUsers]);
    const visible = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) =>
            [user.name, user.email, user.district].some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(query),
            ),
        );
    }, [users, search]);

    const allSelected =
        visible.length > 0 && visible.every((user) => selected.has(user.id));
    const count = selectedUsers.length;

    const close = () => {
        if (submitting) return;
        setSearch('');
        onClose?.();
    };

    const toggleVisible = () => {
        if (loading || submitting) return;
        visible.forEach((user) => {
            if (selected.has(user.id) === allSelected) onToggleUser?.(user.id);
        });
    };

    useEffect(() => {
        if (!open) return undefined;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !submitting) {
                setSearch('');
                onClose?.();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previous;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, submitting, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05080D]/80 p-2.5 backdrop-blur-[2px] sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) close();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="invite-volunteers-title"
                className="flex max-h-[calc(100dvh-20px)] w-full max-w-[640px] flex-col overflow-hidden border border-[#303A47] bg-[#0E1219] shadow-[0_24px_70px_rgba(0,0,0,.45)] sm:max-h-[min(680px,calc(100dvh-40px))]"
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#29323E] px-4 py-4 sm:px-6 sm:py-5">
                    <div className="min-w-0">
                        <h2
                            id="invite-volunteers-title"
                            className="font-sans! text-[18px] font-semibold! tracking-[-0.02em] text-[#E5EAF0]!"
                        >
                            Invite volunteers
                        </h2>
                        <p className="mt-1 font-sans! text-[12px] leading-5 text-[#8792A1]!">
                            Choose registered individuals to invite.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        disabled={submitting}
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-[#8792A1] transition-colors hover:bg-[#1A222D] hover:text-[#E5EAF0] disabled:opacity-40"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Search + selection */}
                <div className="shrink-0 border-b border-[#29323E] bg-[#121821] px-4 py-3 sm:px-6 sm:py-4">
                    <div className="relative">
                        <Search
                            size={15}
                            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#788697]"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            disabled={loading || submitting}
                            placeholder="Search name, email or district"
                            aria-label="Search eligible individuals"
                            className="h-9 w-full border border-[#303A47] bg-[#0A0F16] pr-3 pl-9 font-sans! text-[12px] text-[#E0E6EE]! outline-none placeholder:text-[#697586]! hover:border-[#485565] focus:border-[#718095]! focus:ring-0! disabled:opacity-50"
                        />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <p className="font-sans! text-[11px] text-[#8996A6]!">
                            <span className="font-medium text-[#BFC8D3]">
                                {visible.length}
                            </span>{' '}
                            eligible
                            <span className="mx-2 text-[#4D5968]">·</span>
                            <span className="font-medium text-[#BFC8D3]">
                                {count}
                            </span>{' '}
                            selected
                        </p>
                        <button
                            type="button"
                            onClick={toggleVisible}
                            disabled={loading || submitting || !visible.length}
                            className="font-sans! text-[11px] font-medium! text-[#BBC8D7]! hover:text-[#F1F5F9]! disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {allSelected
                                ? 'Deselect visible'
                                : 'Select all visible'}
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#0E1219]">
                    {error && (
                        <div
                            role="alert"
                            className="mx-4 mt-3 flex items-start gap-2 border border-[#55343A] bg-[#281A20] px-3 py-2.5 text-[12px] leading-5 text-[#E1B0B4] sm:mx-6"
                        >
                            <AlertCircle
                                size={15}
                                className="mt-0.5 shrink-0"
                            />{' '}
                            {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="flex min-h-44 flex-col items-center justify-center gap-3 px-4 py-8 text-[#A9B5C3]">
                            <LoaderCircle size={23} className="animate-spin" />
                            <p className="text-[12px]">
                                Loading eligible individuals...
                            </p>
                        </div>
                    ) : !visible.length ? (
                        <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center">
                            <Users
                                size={22}
                                strokeWidth={1.5}
                                className="text-[#8290A0]"
                            />
                            <p className="mt-3 text-[13px] font-semibold text-[#D5DEE8]">
                                {search
                                    ? 'No matching individuals'
                                    : 'No eligible individuals'}
                            </p>
                            <p className="mt-1 max-w-xs text-[12px] leading-5 text-[#8792A1]">
                                {search
                                    ? 'Try a different search term.'
                                    : 'No registered individuals are available to invite.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#252D38]">
                            {visible.map((user) => {
                                const checked = selected.has(user.id);
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => onToggleUser?.(user.id)}
                                        disabled={submitting}
                                        aria-pressed={checked}
                                        className={`group flex w-full min-w-0 items-center gap-3 px-4 py-2.5 text-left transition-colors sm:px-6 ${checked ? 'bg-[#1A2430] hover:bg-[#202B38]' : 'hover:bg-[#151C25]'} disabled:cursor-not-allowed disabled:opacity-50`}
                                    >
                                        <span
                                            className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center border ${checked ? 'border-[#98A8BA] bg-[#98A8BA] text-[#0E1219]' : 'border-[#556273] bg-[#111821] text-transparent group-hover:border-[#8998AA]'}`}
                                        >
                                            <Check
                                                size={12}
                                                strokeWidth={2.5}
                                            />
                                        </span>
                                        <Avatar user={user} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-sans! text-[12px] font-semibold! text-[#DCE3EB]!">
                                                {user.name ||
                                                    'Unnamed individual'}
                                            </span>
                                            <span className="mt-0.5 block truncate font-sans! text-[11px] text-[#8996A6]!">
                                                {user.email ||
                                                    'No email available'}
                                            </span>
                                        </span>
                                        {user.district && (
                                            <span
                                                className="hidden max-w-[125px] shrink-0 truncate text-right font-sans! text-[11px] text-[#9CA9B9]! sm:block"
                                                title={user.district}
                                            >
                                                {user.district}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#29323E] bg-[#121821] px-4 py-3 sm:px-6 sm:py-4">
                    <span className="font-sans! text-[11px] text-[#8996A6]!">
                        {count
                            ? `${count} ${count === 1 ? 'person' : 'people'} selected`
                            : 'No one selected'}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={close}
                            disabled={submitting}
                            className="inline-flex h-9 items-center justify-center border border-[#394555] px-3.5 font-sans! text-[12px] font-medium! text-[#BBC6D3]! transition-colors hover:bg-[#1C2530] hover:text-[#EEF1F5]! disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading || submitting || count === 0}
                            className="inline-flex h-9 min-w-[120px] items-center justify-center gap-2 border border-[#465363] bg-[#354253] px-3.5 font-sans! text-[12px] font-semibold! text-white! transition-colors hover:bg-[#405166] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {submitting ? (
                                <>
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />{' '}
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={13} /> Send{' '}
                                    {count ? `${count} ` : ''}
                                    {count === 1 ? 'Request' : 'Requests'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

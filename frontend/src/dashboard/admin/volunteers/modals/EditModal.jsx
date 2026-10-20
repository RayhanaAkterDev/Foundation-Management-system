// src/pages/Admin/Volunteers/modals/EditModal.jsx
import React, { useState } from 'react';
import {
    Check,
    CheckCircle2,
    Loader2,
    ShieldAlert,
    UserRound,
    X,
} from 'lucide-react';

const OPTIONS = [
    {
        value: 'active',
        label: 'Active',
        detail: 'Can receive new campaign assignments.',
        icon: CheckCircle2,
        color: 'text-[#9DB9A8]',
    },
    {
        value: 'inactive',
        label: 'Inactive',
        detail: 'Cannot receive new assignments for now.',
        icon: UserRound,
        color: 'text-[#9DAAB9]',
    },
    {
        value: 'suspended',
        label: 'Suspended',
        detail: 'Access to volunteer assignments is restricted.',
        icon: ShieldAlert,
        color: 'text-[#C7A0A4]',
    },
];

function EditModalContent({
    volunteer,
    loading = false,
    saving = false,
    error = '',
    onClose,
    onSave,
}) {
    const originalStatus = volunteer?.status || 'inactive';
    const [status, setStatus] = useState(originalStatus);
    const name =
        volunteer?.user?.name ||
        volunteer?.name ||
        volunteer?.volunteerName ||
        'Unknown volunteer';
    const email =
        volunteer?.user?.email || volunteer?.email || 'No email available';
    const photo =
        volunteer?.user?.photo ||
        volunteer?.user?.avatar ||
        volunteer?.photo ||
        null;
    const changed = status !== originalStatus;

    const submit = async (event) => {
        event.preventDefault();
        if (!volunteer?.id || saving || loading || !changed) return;
        await onSave?.(status);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#05070A]/80 px-3 py-4 backdrop-blur-[2px] sm:px-5 sm:py-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="volunteer-edit-title"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !saving)
                    onClose?.();
            }}
        >
            <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-[520px] min-w-0 flex-col overflow-hidden border border-[#343E4B] bg-[#0E1219] shadow-[0_24px_90px_rgba(0,0,0,0.6)] sm:max-h-[calc(100dvh-64px)]">
                {/* Header: same hierarchy and neutrals as Users dashboard */}
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#252D38] bg-[#151C25] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="min-w-0">
                        <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.14em] text-[#8792A1]!">
                            VOLUNTEER MANAGEMENT
                        </p>
                        <h2
                            id="volunteer-edit-title"
                            className="mt-2 font-sans! text-[21px] font-semibold! leading-tight tracking-[-0.025em] text-[#EEF1F5]! sm:text-[23px]"
                        >
                            Edit volunteer status
                        </h2>
                        <p className="mt-2 font-sans! text-[12px] leading-[1.6] text-[#A4AFBD]!">
                            Manage this volunteer's membership status.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close modal"
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#343E4B] bg-[#0E1219] text-[#AAB5C3] transition-colors hover:border-[#4B596A] hover:bg-[#202A35] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">
                        <Loader2
                            size={24}
                            className="animate-spin text-[#AAB5C3]"
                        />
                        <p className="mt-3 font-sans! text-[13px] font-medium! text-[#D5DDE7]!">
                            Loading volunteer...
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#343E4B_#0E1219] [scrollbar-width:thin]">
                            {/* Identity: compact and no redundant status badge */}
                            <div className="flex min-w-0 items-center gap-3.5 border-b border-[#252D38] bg-[#191F29] px-5 py-4 sm:px-6">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#394555] bg-[#242E3A] font-sans! text-[15px] font-semibold! text-[#DDE5EF]!">
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-sans! text-[14px] font-semibold! text-[#E5EAF0]!">
                                        {name}
                                    </p>
                                    <p className="mt-1 truncate font-sans! text-[12px] text-[#9AA6B5]!">
                                        {email}
                                    </p>
                                </div>
                                <span className="shrink-0 border border-[#36414E] bg-[#121821] px-2.5 py-1 font-sans! text-[11px] font-medium! capitalize text-[#AAB5C3]!">
                                    {originalStatus}
                                </span>
                            </div>

                            <div className="px-5 py-5 sm:px-6 sm:py-6">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="font-sans! text-[13px] font-semibold! text-[#D5DDE7]!">
                                        Membership status
                                    </h3>
                                    <span className="font-sans! text-[11px] text-[#8792A1]!">
                                        Choose a status
                                    </span>
                                </div>
                                <div className="overflow-hidden border border-[#29323E] bg-[#0E1219]">
                                    {OPTIONS.map((option, index) => {
                                        const Icon = option.icon;
                                        const selected =
                                            status === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                disabled={saving}
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    setStatus(option.value)
                                                }
                                                className={`flex w-full min-w-0 items-center gap-3 px-3.5 py-3.5 text-left transition-colors sm:px-4 ${index > 0 ? 'border-t border-[#29323E]' : ''} ${selected ? 'bg-[#202A35]' : 'bg-[#0E1219] hover:bg-[#171F29]'} disabled:cursor-not-allowed disabled:opacity-50`}
                                            >
                                                <span
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center border ${selected ? 'border-[#4B596A] bg-[#2A3542]' : 'border-[#303A47] bg-[#171F29]'}`}
                                                >
                                                    <Icon
                                                        size={17}
                                                        strokeWidth={1.7}
                                                        className={option.color}
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-sans! text-[13px] font-semibold! text-[#DCE3EC]!">
                                                        {option.label}
                                                    </span>
                                                    <span className="mt-0.5 block font-sans! text-[11px] leading-[1.55] text-[#8E9BAA]!">
                                                        {option.detail}
                                                    </span>
                                                </span>
                                                <span
                                                    className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#B8C6D5] bg-[#B8C6D5] text-[#0E1219]' : 'border-[#586779] bg-transparent'}`}
                                                >
                                                    {selected && (
                                                        <Check
                                                            size={12}
                                                            strokeWidth={2.5}
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {error && (
                                    <div
                                        role="alert"
                                        className="mt-4 border border-[#694149] bg-[#38272C] px-3.5 py-3 font-sans! text-[12px] leading-relaxed text-[#E8B8C0]!"
                                    >
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-[#29323E] bg-[#151C25] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="inline-flex h-10 w-full items-center justify-center border border-[#343E4B] bg-transparent px-4 font-sans! text-[12px] font-medium! text-[#B8C2CF]! transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    loading ||
                                    !volunteer?.id ||
                                    !changed
                                }
                                className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[#0F766E] bg-[#0F766E] px-4 font-sans! text-[12px] font-semibold! text-white! transition-colors hover:border-[#115E59] hover:bg-[#115E59] disabled:cursor-not-allowed disabled:border-[#343E4B] disabled:bg-[#26303B] disabled:text-[#7F8B99]! sm:w-auto"
                            >
                                {saving ? (
                                    <Loader2
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Check size={15} strokeWidth={2} />
                                )}
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function EditModal({ open, volunteer, ...props }) {
    if (!open) return null;
    // Remount the content when switching volunteers to reset the draft status.
    return (
        <EditModalContent
            key={volunteer?.id ?? 'new'}
            volunteer={volunteer}
            {...props}
        />
    );
}

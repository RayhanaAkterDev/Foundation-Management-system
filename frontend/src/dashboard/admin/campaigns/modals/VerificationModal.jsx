import { useId, useState } from 'react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    CircleX,
    FileText,
    LoaderCircle,
    ShieldCheck,
    X,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const DECISIONS = [
    {
        value: 'active',
        title: 'Approve',
        description: 'Enable fundraising',
        Icon: CheckCircle2,
    },
    {
        value: 'rejected',
        title: 'Reject',
        description: 'Decline campaign',
        Icon: CircleX,
    },
];

function DecisionOption({ option, selected, disabled, name, onChange }) {
    const Icon = option.Icon;

    return (
        <label
            className={[
                'group relative flex min-w-0 cursor-pointer items-center gap-3',
                'rounded-md border px-3.5 py-3.5 transition-colors',
                selected
                    ? 'border-[#8097B4] bg-[#222F40]'
                    : 'border-[#354252] bg-[#171F29] hover:border-[#52657B] hover:bg-[#1C2733]',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                'focus-within:ring-2 focus-within:ring-[#8097B4]/40',
            ].join(' ')}
        >
            <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={disabled}
                onChange={onChange}
                className="sr-only"
            />

            <Icon
                size={20}
                strokeWidth={1.8}
                className={
                    selected
                        ? 'shrink-0 text-[#CBDCF0]'
                        : 'shrink-0 text-[#91A1B4]'
                }
            />

            <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-5 text-[#EEF1F5]!">
                    {option.title}
                </span>

                <span className="mt-0.5 block text-[11px] leading-4 text-[#97A5B5]!">
                    {option.description}
                </span>
            </span>

            <span
                aria-hidden="true"
                className={[
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                    selected
                        ? 'border-[#C0D2E9] bg-[#C0D2E9] text-[#1A293A]'
                        : 'border-[#6E7D90] bg-transparent text-transparent',
                ].join(' ')}
            >
                <Check size={12} strokeWidth={3} />
            </span>
        </label>
    );
}

export default function VerificationModal({
    campaign,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) {
    const titleId = useId();
    const noteId = useId();
    const decisionName = useId();

    const [decision, setDecision] = useState('');
    const [note, setNote] = useState('');
    const [noteExpanded, setNoteExpanded] = useState(false);

    if (!campaign) return null;

    const currentStatus = campaign.status || 'unknown';
    const canVerify = currentStatus === 'unverified';
    const isRejecting = decision === 'rejected';
    const isApproving = decision === 'active';
    const noteMissing = isRejecting && !note.trim();

    const canSubmit =
        canVerify &&
        Boolean(decision) &&
        !noteMissing &&
        !loading &&
        Boolean(onConfirm);

    const showNote = isRejecting || noteExpanded;

    const closeModal = () => {
        if (loading) return;

        setDecision('');
        setNote('');
        setNoteExpanded(false);
        onClose?.();
    };

    const submitDecision = (event) => {
        event.preventDefault();

        if (!canSubmit) return;

        onConfirm({
            status: decision,
            verification_note: note.trim() || null,
        });
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-[#05070A]/80 p-3 backdrop-blur-[3px] sm:p-5"
            style={{
                fontFamily: "'Poppins', 'Noto Sans Bengali', sans-serif",
            }}
        >
            <button
                type="button"
                aria-label="Close verification modal"
                onClick={closeModal}
                disabled={loading}
                className="absolute inset-0 cursor-default"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-135 flex-col overflow-hidden rounded-lg border border-[#354252] bg-[#121922] shadow-[0_28px_80px_rgba(0,0,0,0.5)] sm:max-h-[90dvh]"
            >
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#303A47] px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#253244] text-[#BFD0E5]">
                            <ShieldCheck size={18} strokeWidth={1.8} />
                        </span>

                        <h2
                            id={titleId}
                            className="m-0 text-[17px] leading-6 font-semibold text-[#EEF1F5]!"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            Verify campaign
                        </h2>
                    </div>

                    <button
                        type="button"
                        aria-label="Close"
                        onClick={closeModal}
                        disabled={loading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#9DABBC] transition-colors hover:bg-[#263241] hover:text-white disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </header>

                <form
                    onSubmit={submitDecision}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto">
                        <div className="px-5 py-5 sm:px-6">
                            {/* Campaign reference */}
                            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-[#303A47] pb-5">
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 text-[11px] font-medium tracking-[0.08em] text-[#8493A6]! uppercase">
                                        Campaign
                                    </p>

                                    <p
                                        className="m-0 mt-1.5 line-clamp-2 text-[13px] leading-6 font-medium text-[#E7EDF5]!"
                                        style={{
                                            fontFamily:
                                                "'Poppins', 'Noto Sans Bengali', sans-serif",
                                        }}
                                    >
                                        {campaign.title || 'Untitled campaign'}
                                    </p>
                                </div>

                                <StatusBadge status={currentStatus} />
                            </div>

                            {!canVerify && (
                                <div
                                    role="alert"
                                    className="mt-4 flex items-start gap-2.5 rounded-md border border-[#665037] bg-[#332A20] px-3.5 py-3"
                                >
                                    <AlertCircle
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#E4BD83]"
                                    />

                                    <p className="m-0 text-[12px] leading-5 text-[#E0C59B]!">
                                        Only unverified campaigns can be
                                        approved or rejected.
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-4 flex items-start gap-2.5 rounded-md border border-[#59343B] bg-[#38272C] px-3.5 py-3"
                                >
                                    <AlertCircle
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#E9A6AF]"
                                    />

                                    <p className="m-0 text-[12px] leading-5 text-[#E9A6AF]!">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Decision */}
                            <fieldset
                                disabled={loading || !canVerify}
                                className="m-0 mt-5 min-w-0 border-0 p-0"
                            >
                                <legend
                                    className="mb-3 p-0 text-[13px] font-semibold text-[#EEF1F5]!"
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                    }}
                                >
                                    Decision
                                </legend>

                                <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                                    {DECISIONS.map((option) => (
                                        <DecisionOption
                                            key={option.value}
                                            option={option}
                                            name={decisionName}
                                            selected={decision === option.value}
                                            disabled={loading || !canVerify}
                                            onChange={() =>
                                                setDecision(option.value)
                                            }
                                        />
                                    ))}
                                </div>
                            </fieldset>

                            {/* Context-sensitive note */}
                            <div className="mt-5">
                                {isRejecting ? (
                                    <div>
                                        <div className="mb-2.5 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor={noteId}
                                                className="text-[13px] font-semibold text-[#EEF1F5]!"
                                            >
                                                Rejection reason
                                            </label>

                                            <span className="text-[12px] text-[#DCA4AC]">
                                                Required
                                            </span>
                                        </div>

                                        <textarea
                                            id={noteId}
                                            rows={3}
                                            value={note}
                                            onChange={(event) =>
                                                setNote(event.target.value)
                                            }
                                            disabled={loading || !canVerify}
                                            required
                                            placeholder="Explain why the campaign is being rejected..."
                                            className="block min-h-24 w-full resize-y rounded-md border border-[#435266] bg-[#0E141D] px-3.5 py-3 text-[13px] leading-6 text-[#EEF1F5]! outline-none placeholder:text-[#78889B]! focus:border-[#8097B4] disabled:opacity-50"
                                        />

                                        {noteMissing && (
                                            <p className="m-0 mt-2 text-[12px] text-[#DCA4AC]!">
                                                A reason is required for
                                                rejection.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            disabled={loading || !canVerify}
                                            onClick={() =>
                                                setNoteExpanded(
                                                    (value) => !value,
                                                )
                                            }
                                            aria-expanded={noteExpanded}
                                            className="flex w-full items-center justify-between gap-3 rounded-md border border-[#303D4C] bg-[#161F29] px-3.5 py-3 text-left transition-colors hover:bg-[#1D2936] disabled:opacity-50"
                                        >
                                            <span className="flex min-w-0 items-center gap-2.5">
                                                <FileText
                                                    size={16}
                                                    className="shrink-0 text-[#9DAFC3]"
                                                />

                                                <span className="text-[13px] font-medium text-[#DCE5F0]!">
                                                    Verification note
                                                </span>

                                                <span className="text-[11px] text-[#8797AA]">
                                                    Optional
                                                </span>
                                            </span>

                                            <span className="text-[12px] text-[#A8B8CB]">
                                                {noteExpanded ? 'Hide' : 'Add'}
                                            </span>
                                        </button>

                                        {showNote && (
                                            <textarea
                                                id={noteId}
                                                rows={3}
                                                value={note}
                                                onChange={(event) =>
                                                    setNote(event.target.value)
                                                }
                                                disabled={loading || !canVerify}
                                                placeholder="Add a note about this decision..."
                                                className="mt-3 block min-h-24 w-full resize-y rounded-md border border-[#435266] bg-[#0E141D] px-3.5 py-3 text-[13px] leading-6 text-[#EEF1F5]! outline-none placeholder:text-[#78889B]! focus:border-[#8097B4] disabled:opacity-50"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-[#303A47] bg-[#19222D] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-[#405064] px-5 text-[13px] font-medium text-[#D0DAE6] transition-colors hover:bg-[#2D3A49] hover:text-white disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={[
                                'inline-flex h-10 items-center justify-center gap-2 rounded-md px-5',
                                'text-[13px] font-semibold text-white transition-colors',
                                'disabled:cursor-not-allowed disabled:opacity-40',
                                isRejecting
                                    ? 'bg-[#96515C] hover:bg-[#854651]'
                                    : 'bg-[#607B9C] hover:bg-[#718CAB]',
                            ].join(' ')}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Processing...
                                </>
                            ) : isRejecting ? (
                                'Reject campaign'
                            ) : isApproving ? (
                                'Approve campaign'
                            ) : (
                                'Confirm decision'
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}

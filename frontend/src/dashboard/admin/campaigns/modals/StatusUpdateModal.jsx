import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Info, X } from 'lucide-react';

const StatusUpdateModal = ({
    campaign,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const allowedStatuses = ['completed', 'cancelled'];

    const [selectedStatus, setSelectedStatus] = useState('completed');

    if (!campaign) {
        return null;
    }

    const currentStatus = String(campaign.status || '').toLowerCase();
    const isActive = currentStatus === 'active';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading || !isActive || !selectedStatus) {
            return;
        }

        await onConfirm({
            status: selectedStatus,
        });
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-150 flex items-center justify-center bg-[#05080D]/80 px-4 py-6 backdrop-blur-[3px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="campaign-status-modal-title"
                className="flex max-h-[calc(100dvh-32px)] w-full max-w-[510px] flex-col overflow-hidden rounded-xl border border-[#34404D] bg-[#151C25] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            >
                {/* Header */}
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#29323E] px-5 py-5 sm:px-6">
                    <div className="min-w-0">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#8EA0B4]">
                            Campaign management
                        </p>

                        <h2
                            id="campaign-status-modal-title"
                            className="m-0 text-[19px] font-semibold tracking-[-0.025em] !text-[#EEF1F5] font-display"
                        >
                            Update campaign status
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close modal"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-[#8F9CAD] transition-colors hover:border-[#34404D] hover:bg-[#202A35] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {/* Campaign information */}
                    <div className="border-b border-[#29323E] bg-[#1A222D] px-5 py-4 sm:px-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] !text-[#8291A3]">
                                    Selected campaign
                                </p>

                                <p
                                    title={campaign.title}
                                    className="m-0 text-[13px] font-semibold leading-[1.7] !text-[#E5EBF3]"
                                    style={{
                                        fontFamily:
                                            "'Poppins', 'Noto Sans Bengali', sans-serif",
                                    }}
                                >
                                    {campaign.title || 'Untitled campaign'}
                                </p>
                            </div>

                            <span
                                className={`inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 text-[10px] font-semibold capitalize ${
                                    isActive
                                        ? 'border-[#345043] bg-[#20362C] text-[#9BCFB0]'
                                        : 'border-[#3B4552] bg-[#252E39] text-[#B3BFCD]'
                                }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {currentStatus.replace(/_/g, ' ') || 'unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Non-active warning */}
                    {!isActive && (
                        <div className="mx-5 mt-5 flex items-start gap-3 rounded-md border border-[#665037] bg-[#30271D] px-4 py-3.5 sm:mx-6">
                            <AlertCircle
                                size={17}
                                strokeWidth={1.8}
                                className="mt-0.5 shrink-0 text-[#E0B678]"
                            />

                            <div className="min-w-0">
                                <p className="m-0 text-[12px] font-semibold !text-[#E8C998]">
                                    This campaign cannot be updated
                                </p>

                                <p className="mb-0 mt-1 text-[11px] leading-[1.8] !text-[#C6AE8B]">
                                    Only campaigns with the backend status{' '}
                                    <strong className="font-semibold text-[#F0D4A7]">
                                        active
                                    </strong>{' '}
                                    can be changed to{' '}
                                    <strong className="font-semibold text-[#F0D4A7]">
                                        completed
                                    </strong>{' '}
                                    or{' '}
                                    <strong className="font-semibold text-[#F0D4A7]">
                                        cancelled
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>
                    )}

                    <form
                        id="campaign-status-update-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                            {/* New status */}
                            <div>
                                <label
                                    htmlFor="campaign-status"
                                    className="mb-2 block text-[12px] font-semibold !text-[#DCE4ED]"
                                >
                                    New status
                                </label>

                                <div className="relative">
                                    <select
                                        id="campaign-status"
                                        value={selectedStatus}
                                        onChange={(event) =>
                                            setSelectedStatus(
                                                event.target.value,
                                            )
                                        }
                                        disabled={loading || !isActive}
                                        className="h-11 w-full appearance-none rounded-md border border-[#34404D] bg-[#10161E] px-3.5 pr-10 text-[12px] font-medium !text-[#E3EAF3] outline-none transition-colors hover:border-[#4B5A6B] focus:border-[#7890A8] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {allowedStatuses.map((status) => (
                                            <option
                                                key={status}
                                                value={status}
                                                className="bg-[#151C25] text-[#EEF1F5]"
                                            >
                                                {status === 'completed'
                                                    ? 'Completed'
                                                    : 'Cancelled'}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F9CAD]"
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2.5 rounded-md border border-[#704047] bg-[#342126] px-3.5 py-3"
                                >
                                    <AlertCircle
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#E9A3AC]"
                                    />

                                    <p className="m-0 text-[11px] leading-[1.7] !text-[#F0B5BC]">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Important notice */}
                            {isActive && (
                                <div className="flex items-start gap-3 rounded-md border border-[#34404D] bg-[#1B2632] px-3.5 py-3.5">
                                    {selectedStatus === 'completed' ? (
                                        <CheckCircle2
                                            size={16}
                                            strokeWidth={1.8}
                                            className="mt-0.5 shrink-0 text-[#9BCFB0]"
                                        />
                                    ) : (
                                        <Info
                                            size={16}
                                            strokeWidth={1.8}
                                            className="mt-0.5 shrink-0 text-[#D6B47C]"
                                        />
                                    )}

                                    <p className="m-0 text-[11px] leading-[1.8] !text-[#A4B2C3]">
                                        <span className="font-semibold text-[#E3EAF3]">
                                            Important:
                                        </span>{' '}
                                        Once this campaign is marked{' '}
                                        <span className="font-semibold text-[#E3EAF3]">
                                            {selectedStatus}
                                        </span>
                                        , it will no longer be editable.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 border-t border-[#29323E] bg-[#151C25] px-5 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-[#34404D] bg-[#1B242E] px-4 text-[12px] font-medium !text-[#C7D1DE] transition-colors hover:border-[#526276] hover:bg-[#25313F] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="campaign-status-update-form"
                        disabled={loading || !isActive || !selectedStatus}
                        className={`inline-flex h-10 min-w-[135px] items-center justify-center rounded-md border px-4 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            selectedStatus === 'cancelled'
                                ? 'border-[#75464A] bg-[#633238] text-[#F4D8DA] hover:bg-[#784047]'
                                : 'border-[#416B5D] bg-[#275344] text-[#D8F0E3] hover:bg-[#326653]'
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;

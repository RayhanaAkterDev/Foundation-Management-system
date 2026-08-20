import React, { useState } from 'react';
import { X } from 'lucide-react';

const CampaignStatusUpdateModal = ({
    campaign,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const allowedStatuses = ['completed', 'cancelled'];

    const [selectedStatus, setSelectedStatus] = useState('completed');
    const [statusNote, setStatusNote] = useState('');

    if (!campaign) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedStatus) {
            return;
        }

        await onConfirm({
            status: selectedStatus,
            status_note: statusNote.trim() || null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* =================================================
                    Header
                ================================================= */}

                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Campaign status
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-text-primary">
                            Update campaign status
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Mark this active campaign as completed or cancelled.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* =================================================
                    Campaign information
                ================================================= */}

                <div className="border-b border-border bg-background-alt px-6 py-4">
                    <p className="text-sm font-semibold text-text-primary">
                        {campaign.title || 'Untitled campaign'}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-text-secondary">
                            Current status:
                        </span>

                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold capitalize text-text-secondary">
                            {String(campaign.status || '').replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {/* =================================================
                    Form
                ================================================= */}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 px-6 py-6">
                        {/* Status */}

                        <div>
                            <label
                                htmlFor="campaign-status"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                New status
                            </label>

                            <select
                                id="campaign-status"
                                value={selectedStatus}
                                onChange={(event) =>
                                    setSelectedStatus(event.target.value)
                                }
                                disabled={loading}
                                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:bg-background-alt"
                            >
                                {allowedStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status === 'completed'
                                            ? 'Completed'
                                            : 'Cancelled'}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-2 text-xs leading-5 text-text-secondary">
                                An active campaign can only be moved to
                                completed or cancelled.
                            </p>
                        </div>

                        {/* Status note */}

                        <div>
                            <label
                                htmlFor="campaign-status-note"
                                className="mb-2 block text-sm font-semibold text-text-primary"
                            >
                                Status note
                                <span className="ml-1 font-normal text-text-secondary">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="campaign-status-note"
                                value={statusNote}
                                onChange={(event) =>
                                    setStatusNote(event.target.value)
                                }
                                disabled={loading}
                                rows={4}
                                placeholder={
                                    selectedStatus === 'completed'
                                        ? 'Add a short note about why the campaign is being marked completed...'
                                        : 'Add a short note explaining why the campaign is being cancelled...'
                                }
                                className="w-full resize-none rounded-lg border border-border bg-white px-3 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary disabled:cursor-not-allowed disabled:bg-background-alt"
                            />
                        </div>

                        {/* Error */}

                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Warning */}

                        <div className="rounded-lg border border-border bg-background-alt px-4 py-3">
                            <p className="text-xs leading-5 text-text-secondary">
                                <span className="font-semibold text-text-primary">
                                    Important:
                                </span>{' '}
                                Once a campaign is marked{' '}
                                <span className="font-semibold">
                                    {selectedStatus}
                                </span>
                                , it will no longer be editable.
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        Footer
                    ================================================= */}

                    <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !selectedStatus}
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignStatusUpdateModal;

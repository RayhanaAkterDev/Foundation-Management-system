import React from 'react';
import {
    X,
    MapPin,
    CalendarDays,
    User,
    Mail,
    Phone,
    Tag,
    Clock3,
} from 'lucide-react';

const HelpRequestViewModal = ({ request, loading, error, onClose }) => {
    if (!request && !loading && !error) {
        return null;
    }

    const requester = request?.user;

    const formatDate = (date) => {
        if (!date) return '—';

        return new Date(date).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatStatus = (status) => {
        if (!status) return '—';

        return status
            .replaceAll('_', ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Help request
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Request details
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
                    {loading && (
                        <div className="flex min-h-60 items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                                <p className="text-sm font-semibold text-text-primary">
                                    Loading request...
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading && !error && request && (
                        <div className="space-y-6">
                            {/* Request overview */}
                            <div className="border border-border bg-background-alt p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-text-secondary">
                                            Request title
                                        </p>

                                        <h3 className="mt-1 text-base font-bold text-text-primary">
                                            {request.title ||
                                                request.subject ||
                                                'Help Request'}
                                        </h3>
                                    </div>

                                    <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold capitalize text-primary">
                                        {formatStatus(
                                            request.status ||
                                                request.verification_status,
                                        )}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <InfoItem
                                        icon={Tag}
                                        label="Category"
                                        value={request.category || '—'}
                                    />

                                    <InfoItem
                                        icon={Clock3}
                                        label="Priority"
                                        value={request.priority || '—'}
                                    />

                                    <InfoItem
                                        icon={MapPin}
                                        label="Location"
                                        value={
                                            request.location ||
                                            request.address ||
                                            '—'
                                        }
                                    />

                                    <InfoItem
                                        icon={CalendarDays}
                                        label="Submitted"
                                        value={formatDate(request.created_at)}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                                    Request information
                                </p>

                                <div className="mt-3 border border-border bg-white p-5">
                                    <p className="whitespace-pre-line text-sm leading-6 text-text-secondary">
                                        {request.description ||
                                            request.details ||
                                            'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Requester */}
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                                    Requester
                                </p>

                                <div className="mt-3 grid grid-cols-1 gap-4 border border-border p-5 sm:grid-cols-2">
                                    <InfoItem
                                        icon={User}
                                        label="Name"
                                        value={
                                            requester?.name ||
                                            request.requester_name ||
                                            '—'
                                        }
                                    />

                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={
                                            requester?.email ||
                                            request.requester_email ||
                                            '—'
                                        }
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Phone"
                                        value={
                                            requester?.phone ||
                                            request.phone ||
                                            '—'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
            <Icon size={15} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
            <p className="text-[11px] font-medium text-text-secondary">
                {label}
            </p>

            <p className="mt-0.5 wrap-break-word text-sm font-semibold text-text-primary">
                {value}
            </p>
        </div>
    </div>
);

export default HelpRequestViewModal;

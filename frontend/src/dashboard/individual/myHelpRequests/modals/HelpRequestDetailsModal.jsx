import React from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    X,
    XCircle,
} from 'lucide-react';

const getStatusInfo = (status) => {
    switch (status) {
        case 'verified':
            return {
                label: 'Verified',
                icon: CheckCircle2,
                className: 'bg-green-50 text-green-700',
                description: 'Your help request has been verified by SP Admin.',
            };

        case 'rejected':
            return {
                label: 'Rejected',
                icon: XCircle,
                className: 'bg-red-50 text-red-700',
                description: 'Your help request was rejected by SP Admin.',
            };

        case 'pending':
        default:
            return {
                label: 'Pending Review',
                icon: Clock3,
                className: 'bg-amber-50 text-amber-700',
                description:
                    'Your help request is waiting for review by SP Admin.',
            };
    }
};

const getUrgencyLabel = (urgency) => {
    const labels = {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        critical: 'Critical',
    };

    return labels[urgency] || urgency || 'Normal';
};

const getUrgencyClass = (urgency) => {
    const classes = {
        low: 'bg-gray-100 text-gray-600',
        normal: 'bg-blue-50 text-blue-600',
        high: 'bg-orange-50 text-orange-600',
        critical: 'bg-red-50 text-red-600',
    };

    return classes[urgency] || classes.normal;
};

const formatDate = (date) => {
    if (!date) {
        return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
            {label}
        </p>

        <p className="text-sm text-text-primary">{value || '—'}</p>
    </div>
);

const HelpRequestDetailModal = ({ isOpen, request, onClose }) => {
    if (!isOpen || !request) {
        return null;
    }

    const statusInfo = getStatusInfo(request.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />

                            <span className="text-xs font-medium text-text-secondary">
                                Help Request #{request.id}
                            </span>
                        </div>

                        <h2 className="font-['Fraunces'] text-xl font-semibold text-text-primary">
                            {request.title}
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Submitted on {formatDate(request.created_at)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-6 py-6">
                    <div className="space-y-6">
                        {/* Status */}
                        <div
                            className={`rounded-xl px-4 py-3 ${statusInfo.className}`}
                        >
                            <div className="flex items-start gap-3">
                                <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />

                                <div>
                                    <p className="text-sm font-semibold">
                                        {statusInfo.label}
                                    </p>

                                    <p className="mt-0.5 text-xs opacity-80">
                                        {statusInfo.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <section>
                            <h3 className="mb-4 text-sm font-semibold text-text-primary">
                                Request Information
                            </h3>

                            <div className="grid gap-5 rounded-xl border border-border bg-background-alt/30 p-4 sm:grid-cols-2">
                                <DetailItem
                                    label="Category"
                                    value={request.category}
                                />

                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                        Urgency
                                    </p>

                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getUrgencyClass(
                                            request.urgency,
                                        )}`}
                                    >
                                        {getUrgencyLabel(request.urgency)}
                                    </span>
                                </div>

                                <DetailItem
                                    label="Submitted"
                                    value={formatDate(
                                        request.created_at ||
                                            request.submittedDate,
                                    )}
                                />

                                {request.updated_at && (
                                    <DetailItem
                                        label="Last Updated"
                                        value={formatDate(request.updated_at)}
                                    />
                                )}
                            </div>
                        </section>

                        {/* Location */}
                        <section>
                            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
                                <MapPin className="h-4 w-4 text-primary" />
                                Location
                            </h3>

                            <div className="rounded-xl border border-border bg-background-alt/30 p-4">
                                <DetailItem
                                    label="District"
                                    value={request.district}
                                />

                                {request.address && (
                                    <div className="mt-4 border-t border-border pt-4">
                                        <DetailItem
                                            label="Address"
                                            value={request.address}
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="mb-4 text-sm font-semibold text-text-primary">
                                Description
                            </h3>

                            <div className="rounded-xl border border-border bg-background-alt/30 p-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-text-primary">
                                    {request.description || '—'}
                                </p>
                            </div>
                        </section>

                        {/* Verification Note */}
                        {request.verificationNote && (
                            <section>
                                <h3 className="mb-4 text-sm font-semibold text-text-primary">
                                    Admin Note
                                </h3>

                                <div
                                    className={`rounded-xl border p-4 ${
                                        request.status === 'rejected'
                                            ? 'border-red-200 bg-red-50'
                                            : 'border-green-200 bg-green-50'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-6 text-text-primary">
                                        {request.verificationNote}
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Campaign placeholder */}
                        {request.status === 'verified' && (
                            <section>
                                <div className="rounded-xl border border-dashed border-border bg-background-alt/30 p-4">
                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary" />

                                        <div>
                                            <p className="text-sm font-medium text-text-primary">
                                                Campaign
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                Your verified help request will
                                                be connected to an SP campaign.
                                                Campaign details and the public
                                                campaign link will appear here
                                                once that integration is
                                                available.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestDetailModal;

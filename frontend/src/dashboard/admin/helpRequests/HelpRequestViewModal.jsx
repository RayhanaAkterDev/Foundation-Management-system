import React from 'react';
import {
    X,
    MapPin,
    Tag,
    Clock3,
    FileText,
    Hash,
    ShieldCheck,
    RefreshCw,
    CalendarDays,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const HelpRequestViewModal = ({ request, loading, error, onClose }) => {
    if (!request && !loading && !error) {
        return null;
    }

    const formatDate = (date, includeTime = false) => {
        if (!date) {
            return 'Not provided';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Not provided';
        }

        return parsedDate.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            ...(includeTime && {
                hour: 'numeric',
                minute: '2-digit',
            }),
        });
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'Not provided';
        }

        return String(value)
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getUrgencyStyle = (urgency) => {
        if (!urgency) {
            return {
                wrapper: 'bg-slate-50 border-slate-200',
                icon: 'bg-white text-slate-400',
                text: 'text-slate-600',
            };
        }

        const normalized = String(urgency).toLowerCase();

        if (
            normalized.includes('critical') ||
            normalized.includes('emergency')
        ) {
            return {
                wrapper: 'bg-red-50 border-red-200',
                icon: 'bg-red-100 text-red-600',
                text: 'text-red-700',
            };
        }

        if (normalized.includes('high')) {
            return {
                wrapper: 'bg-orange-50 border-orange-200',
                icon: 'bg-orange-100 text-orange-600',
                text: 'text-orange-700',
            };
        }

        if (normalized.includes('medium')) {
            return {
                wrapper: 'bg-amber-50 border-amber-200',
                icon: 'bg-amber-100 text-amber-600',
                text: 'text-amber-700',
            };
        }

        if (normalized.includes('low')) {
            return {
                wrapper: 'bg-emerald-50 border-emerald-200',
                icon: 'bg-emerald-100 text-emerald-600',
                text: 'text-emerald-700',
            };
        }

        return {
            wrapper: 'bg-slate-50 border-slate-200',
            icon: 'bg-white text-slate-400',
            text: 'text-slate-600',
        };
    };

    const urgencyStyle = getUrgencyStyle(request?.urgency);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-[5px] sm:p-5">
            <div
                className="absolute inset-0"
                onClick={!loading ? onClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.25)]">
                {/* Header */}
                <div className="relative shrink-0 overflow-hidden border-b border-border bg-white px-6 py-5 sm:px-7">
                    {/* Subtle accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-teal-400 to-primary/30" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all hover:border-border hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="pr-12">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
                                <FileText size={17} strokeWidth={1.9} />
                            </span>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                    Help request
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                    Request overview
                                </p>
                            </div>
                        </div>

                        <h2 className="mt-4 max-w-2xl text-[22px] font-bold leading-7 tracking-tight text-slate-900">
                            {request?.title || 'Request details'}
                        </h2>

                        {request && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {request.status && (
                                    <StatusBadge status={request.status} />
                                )}

                                {request.verification_status && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                            <ShieldCheck size={13} />
                                            {formatValue(
                                                request.verification_status,
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-[#f1f6f5]">
                    {loading && (
                        <div className="flex min-h-80 flex-col items-center justify-center text-center">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                            </div>

                            <p className="text-sm font-semibold text-text-primary">
                                Loading request...
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="mx-6 my-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:mx-7">
                            <p className="text-sm font-semibold text-red-700">
                                Unable to load this request
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading && !error && request && (
                        <div className="mx-auto max-w-4xl">
                            {/* Request identity strip */}
                            <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <MetaCard
                                        icon={Tag}
                                        label="Category"
                                        value={formatValue(request.category)}
                                        accent="primary"
                                    />

                                    <MetaCard
                                        icon={Clock3}
                                        label="Urgency"
                                        value={formatValue(request.urgency)}
                                        accent="urgency"
                                        urgencyStyle={urgencyStyle}
                                    />

                                    <MetaCard
                                        icon={MapPin}
                                        label="Location"
                                        value={
                                            request.location ||
                                            request.address ||
                                            'Not provided'
                                        }
                                        accent="location"
                                    />

                                    <MetaCard
                                        icon={Hash}
                                        label="Request ID"
                                        value={request.id || 'Not provided'}
                                        accent="neutral"
                                    />
                                </div>
                            </div>

                            {/* Main reading area */}
                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px]">
                                {/* Description */}
                                <main className="bg-white px-6 py-7 sm:px-8 sm:py-8 lg:border-r lg:border-slate-200">
                                    <div className="max-w-2xl">
                                        <div className="mb-5 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <FileText size={14} />
                                                </span>

                                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                                    Request details
                                                </span>
                                            </div>

                                            <span className="hidden rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-400 sm:inline-flex">
                                                Full description
                                            </span>
                                        </div>

                                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/70 px-5 py-5 shadow-sm sm:px-6 sm:py-6">
                                            <div className="absolute left-0 top-0 h-full w-1 bg-primary/70" />

                                            <p className="whitespace-pre-line text-[15px] leading-8 text-slate-700">
                                                {request.description ||
                                                    request.details ||
                                                    'No description provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </main>

                                {/* Side information */}
                                <aside className="bg-[#f8faf9] px-6 py-7 sm:px-8 lg:px-6">
                                    {/* Current State */}
                                    {(request.status ||
                                        request.verification_status) && (
                                        <div className="mb-8">
                                            <SideHeading
                                                title="Current state"
                                                icon={ShieldCheck}
                                            />

                                            <div className="mt-4 space-y-2.5">
                                                {request.status && (
                                                    <SideStatus
                                                        icon={RefreshCw}
                                                        label="Status"
                                                        value={
                                                            <StatusBadge
                                                                status={
                                                                    request.status
                                                                }
                                                            />
                                                        }
                                                    />
                                                )}

                                                {request.verification_status && (
                                                    <SideStatus
                                                        icon={ShieldCheck}
                                                        label="Verification"
                                                        value={
                                                            <StatusBadge
                                                                status={
                                                                    request.verification_status
                                                                }
                                                            />
                                                        }
                                                        success
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div>
                                        <SideHeading
                                            title="Timeline"
                                            icon={CalendarDays}
                                        />

                                        <div className="relative mt-5 pl-5">
                                            <div className="absolute bottom-3 left-1 top-2 w-px bg-linear-to-b from-primary/60 via-slate-200 to-transparent" />

                                            <TimelineItem
                                                label="Submitted"
                                                value={formatDate(
                                                    request.created_at,
                                                    true,
                                                )}
                                                active
                                            />

                                            <TimelineItem
                                                label="Last updated"
                                                value={formatDate(
                                                    request.updated_at,
                                                    true,
                                                )}
                                            />

                                            {request.verified_at && (
                                                <TimelineItem
                                                    label="Verified"
                                                    value={formatDate(
                                                        request.verified_at,
                                                        true,
                                                    )}
                                                    last
                                                    active
                                                />
                                            )}
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 items-center justify-between border-t border-border bg-white px-6 py-4 sm:px-7">
                    <p className="hidden text-xs text-slate-400 sm:block">
                        Help request details
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetaCard = ({ icon: Icon, label, value, accent, urgencyStyle }) => {
    const styles = {
        primary: {
            wrapper: 'border-teal-100 bg-linear-to-br from-teal-50/80 to-white',
            icon: 'bg-teal-100 text-teal-700',
            label: 'text-teal-600',
            value: 'text-slate-800',
        },

        urgency: {
            wrapper: urgencyStyle?.wrapper || 'border-slate-200 bg-white',
            icon: urgencyStyle?.icon || 'bg-slate-100 text-slate-500',
            label: urgencyStyle?.text || 'text-slate-500',
            value: urgencyStyle?.text || 'text-slate-800',
        },

        location: {
            wrapper: 'border-sky-100 bg-linear-to-br from-sky-50/70 to-white',
            icon: 'bg-sky-100 text-sky-700',
            label: 'text-sky-600',
            value: 'text-slate-800',
        },

        neutral: {
            wrapper: 'border-slate-200 bg-slate-50/70',
            icon: 'bg-white text-slate-400 ring-1 ring-slate-200',
            label: 'text-slate-400',
            value: 'text-slate-700',
        },
    };

    const style = styles[accent] || styles.neutral;

    return (
        <div
            className={`min-w-0 rounded-xl border px-3.5 py-3 ${style.wrapper}`}
        >
            <div className="flex items-center gap-2.5">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
                >
                    <Icon size={14} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                    <p
                        className={`text-[9px] font-bold uppercase tracking-widest ${style.label}`}
                    >
                        {label}
                    </p>

                    <p
                        className={`mt-0.5 truncate text-xs font-bold ${style.value}`}
                        title={value}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

const SideHeading = ({ title, icon: Icon }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={13} strokeWidth={1.9} />
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                {title}
            </p>
        </div>
    );
};

const SideStatus = ({ icon: Icon, label, value, success = false }) => {
    return (
        <div
            className={`rounded-xl border px-3 py-3 ${
                success
                    ? 'border-emerald-100 bg-emerald-50/60'
                    : 'border-slate-200 bg-white'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        success
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-50 text-slate-400 ring-1 ring-slate-200'
                    }`}
                >
                    <Icon size={14} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                    </p>

                    <div className="mt-1.5">{value}</div>
                </div>
            </div>
        </div>
    );
};

const TimelineItem = ({ label, value, last = false, active = false }) => {
    return (
        <div className={`relative ${last ? '' : 'pb-6'}`}>
            <span
                className={`absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                    active
                        ? 'border-primary bg-primary shadow-[0_0_0_3px_rgba(15,118,110,0.12)]'
                        : 'border-slate-300 bg-[#f8faf9]'
                }`}
            />

            <p
                className={`text-[9px] font-bold uppercase tracking-[0.08em] ${
                    active ? 'text-primary' : 'text-slate-400'
                }`}
            >
                {label}
            </p>

            <p className="mt-1 text-xs font-medium leading-5 text-slate-600">
                {value}
            </p>
        </div>
    );
};

export default HelpRequestViewModal;

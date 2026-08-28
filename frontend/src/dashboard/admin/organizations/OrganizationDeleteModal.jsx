import React from 'react';

import { AlertTriangle, X, Building2, Trash2 } from 'lucide-react';

const OrganizationDeleteModal = ({
    organization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    if (!organization) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-[3px]">
            <div className="w-full max-w-130 overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_-25px_rgba(15,23,42,0.5)]">
                {/* Top warning area */}
                <div className="relative overflow-hidden bg-[#fff8f6] px-7 pb-7 pt-8 sm:px-8">
                    {/* Decorative shape */}
                    <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-red-100/60" />
                    <div className="absolute -right-2 -top-8 h-24 w-24 rounded-full border-18 border-red-100/50" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="
                            absolute right-5 top-5 z-10
                            flex h-8 w-8 items-center justify-center
                            rounded-lg
                            text-slate-400
                            transition-colors
                            hover:bg-white
                            hover:text-slate-700
                            disabled:pointer-events-none
                            disabled:opacity-40
                        "
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>

                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <Trash2 size={21} strokeWidth={1.8} />
                        </div>

                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-red-600">
                            Destructive action
                        </p>

                        <h2 className="mt-2 text-[27px] font-semibold tracking-[-0.04em] text-slate-950">
                            Delete organization?
                        </h2>

                        <p className="mt-2.5 max-w-105 text-[13px] leading-[1.7] text-slate-600">
                            This will permanently remove the organization and
                            its associated information.
                        </p>
                    </div>
                </div>

                {/* Main content */}
                <div className="px-7 py-7 sm:px-8">
                    {/* Organization being deleted */}
                    <div>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                            Organization to delete
                        </p>

                        <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200/80">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                                <Building2 size={20} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-[14px] font-semibold text-slate-900">
                                    {organization.name}
                                </p>

                                <p className="mt-1 truncate text-[12px] text-slate-500">
                                    {organization.user?.email ||
                                        organization.email ||
                                        'No email available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact */}
                    <div className="mt-7">
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                What will be removed
                            </p>

                            <span className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="mt-4">
                            <p className="text-[12.5px] leading-6 text-slate-600">
                                Deleting this organization will remove its{' '}
                                <span className="font-semibold text-slate-800">
                                    profile and details
                                </span>{' '}
                                along with{' '}
                                <span className="font-semibold text-slate-800">
                                    associated information
                                </span>
                                .
                            </p>

                            <p className="mt-2 text-[11.5px] leading-5 text-slate-400">
                                This information cannot be recovered after
                                deletion.
                            </p>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                            <AlertTriangle
                                className="mt-0.5 shrink-0 text-red-600"
                                size={16}
                                strokeWidth={2}
                            />

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-red-700">
                                    Unable to delete
                                </p>

                                <p className="mt-1 text-[12px] leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-7 py-5 sm:px-8">
                    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                h-10.5 rounded-lg
                                border border-slate-200
                                bg-white px-5
                                text-[12.5px] font-semibold text-slate-600
                                transition-all duration-200
                                hover:border-slate-300
                                hover:bg-slate-50
                                hover:text-slate-900
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >
                            Keep organization
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="
                                inline-flex h-10.5 min-w-36.25
                                items-center justify-center gap-2
                                rounded-lg
                                bg-[#b42318]
                                px-5
                                text-[12.5px] font-semibold text-white
                                shadow-sm
                                transition-all duration-200
                                hover:bg-[#9f1d14]
                                hover:shadow-[0_4px_12px_rgba(180,35,24,0.2)]
                                active:scale-[0.985]
                                disabled:pointer-events-none
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} strokeWidth={2} />
                                    Delete permanently
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDeleteModal;

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const HelpRequestDeleteModal = ({
    request,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    if (!request) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                className="absolute inset-0"
                onClick={() => {
                    if (!loading) {
                        onClose();
                    }
                }}
            />

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <AlertTriangle size={19} strokeWidth={1.8} />
                        </div>

                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-600">
                                Danger zone
                            </p>

                            <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                                Delete help request
                            </h2>
                        </div>
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
                <div className="px-6 py-5">
                    <p className="text-sm leading-6 text-text-secondary">
                        Are you sure you want to delete this help request? This
                        action cannot be undone.
                    </p>

                    <div className="mt-4 border border-border bg-background-alt px-4 py-3">
                        <p className="text-xs font-medium text-text-secondary">
                            Request
                        </p>

                        <p className="mt-1 text-sm font-bold text-text-primary">
                            {request.title || request.subject || 'Help Request'}
                        </p>

                        {request.requester_name || request.user?.name ? (
                            <p className="mt-1 text-xs text-text-secondary">
                                {request.requester_name || request.user?.name}
                            </p>
                        ) : null}
                    </div>

                    {error && (
                        <div className="mt-4 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 border-t border-border bg-background-alt px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}

                        {loading ? 'Deleting...' : 'Delete Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestDeleteModal;

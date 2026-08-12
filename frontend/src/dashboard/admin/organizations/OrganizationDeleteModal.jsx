import React from 'react';
import { AlertTriangle, X, Building2 } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Delete Organization
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            This action cannot be undone.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                    <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-red-800">
                                Are you sure you want to delete this
                                organization?
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                The organization and its associated information
                                may no longer be available.
                            </p>
                        </div>
                    </div>

                    {/* Organization information */}
                    <div className="rounded-xl border border-border p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
                                <Building2 size={17} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-text-primary">
                                    {organization.name}
                                </p>

                                <p className="mt-1 truncate text-sm text-text-secondary">
                                    {organization.user?.email ||
                                        organization.email ||
                                        '—'}
                                </p>

                                <p className="mt-1 text-xs capitalize text-text-secondary">
                                    {organization.organization_type ||
                                        'Organization'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex min-w-32 items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Deleting...' : 'Delete Organization'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDeleteModal;

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

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
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <AlertTriangle size={19} />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-background-alt disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <h2 className="text-lg font-bold text-text-primary">
                        Delete organization?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        You are about to delete{' '}
                        <span className="font-semibold text-text-primary">
                            {organization.name}
                        </span>
                        . This action cannot be undone.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-border bg-background-alt/30 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary hover:bg-background-alt disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Deleting...' : 'Delete organization'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDeleteModal;

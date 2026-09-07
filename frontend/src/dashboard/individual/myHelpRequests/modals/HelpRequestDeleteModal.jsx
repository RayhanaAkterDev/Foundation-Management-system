import React from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

const HelpRequestDeleteModal = ({
    isOpen,
    request,
    deleting = false,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !request) {
        return null;
    }

    const handleClose = () => {
        if (deleting) {
            return;
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <AlertTriangle
                                className="h-5 w-5"
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <h2 className="font-['Fraunces'] text-xl font-semibold text-text-primary">
                                Delete Help Request
                            </h2>

                            <p className="mt-0.5 text-sm text-[#6b7280]">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={deleting}
                        className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close delete confirmation"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-sm leading-6 text-[#4b5563]">
                        Are you sure you want to delete this help request?
                    </p>

                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                        <p className="text-xs leading-5 text-red-600">
                            Once deleted, this help request and its submitted
                            information will be permanently removed.
                        </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                            Request
                        </p>

                        <p className="mt-1 text-sm font-medium text-text-primary">
                            {request.title}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={deleting}
                        className="inline-flex h-10 items-center rounded-xl border border-[#e5e7eb] px-5 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#eef3f6] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Request
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestDeleteModal;

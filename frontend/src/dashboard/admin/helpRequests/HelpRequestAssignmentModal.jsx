import React, { useMemo, useState } from 'react';
import { X, Building2, ClipboardCheck } from 'lucide-react';

const HelpRequestAssignmentModal = ({
    request,
    ngos = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const initialNgo = useMemo(() => {
        if (!request) {
            return '';
        }

        return (
            request.assignment?.organization_id || request.organization_id || ''
        );
    }, [request]);

    const [selectedNgo, setSelectedNgo] = useState(initialNgo);
    const [assignmentNote, setAssignmentNote] = useState('');

    if (!request) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedNgo) {
            return;
        }

        onConfirm({
            organization_id: selectedNgo,
            assignment_note: assignmentNote.trim() || null,
        });
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Help request
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Assign organization
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Assign this verified request to an organization for
                            further assistance.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Request summary */}
                <div className="border-b border-border bg-background px-6 py-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <ClipboardCheck size={18} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                                Request
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-text-primary">
                                {request.title || 'Help request'}
                            </p>

                            {request.category && (
                                <p className="mt-0.5 text-xs text-text-secondary">
                                    {request.category}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Organization */}
                        <div>
                            <label
                                htmlFor="help-request-organization"
                                className="mb-2 block text-xs font-semibold text-text-primary"
                            >
                                Assign organization
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <Building2
                                    size={17}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <select
                                    id="help-request-organization"
                                    value={selectedNgo}
                                    onChange={(event) =>
                                        setSelectedNgo(event.target.value)
                                    }
                                    disabled={loading}
                                    required
                                    className="h-11 w-full appearance-none rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                >
                                    <option value="">
                                        Select an organization
                                    </option>

                                    {ngos.map((ngo) => (
                                        <option key={ngo.id} value={ngo.id}>
                                            {ngo.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {ngos.length === 0 && (
                                <p className="mt-2 text-xs text-text-secondary">
                                    No verified organizations are currently
                                    available for assignment.
                                </p>
                            )}
                        </div>

                        {/* Assignment note */}
                        <div>
                            <label
                                htmlFor="assignment-note"
                                className="mb-2 block text-xs font-semibold text-text-primary"
                            >
                                Assignment note
                                <span className="ml-1 font-normal text-text-secondary">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="assignment-note"
                                value={assignmentNote}
                                onChange={(event) =>
                                    setAssignmentNote(event.target.value)
                                }
                                disabled={loading}
                                rows={4}
                                placeholder="Add any relevant instructions or context for the assigned organization..."
                                className="w-full resize-none rounded-lg border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-border bg-surface-soft px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !selectedNgo}
                            className="inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}

                            {loading ? 'Assigning...' : 'Assign organization'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestAssignmentModal;

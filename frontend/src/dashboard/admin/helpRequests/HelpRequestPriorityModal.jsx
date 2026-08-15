import React, { useState } from 'react';
import { X } from 'lucide-react';

const PRIORITIES = [
    {
        value: 'critical',
        label: 'Critical',
        description: 'Requires immediate attention and urgent coordination.',
    },
    {
        value: 'high',
        label: 'High',
        description: 'Should be handled as soon as possible.',
    },
    {
        value: 'normal',
        label: 'Normal',
        description: 'Can be handled through the normal assistance workflow.',
    },
    {
        value: 'low',
        label: 'Low',
        description: 'Can be handled after higher-priority requests.',
    },
];

const HelpRequestPriorityModal = ({
    request,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const [priority, setPriority] = useState(
        request?.urgency || request?.priority || 'normal',
    );

    if (!request) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!priority || loading) {
            return;
        }

        onConfirm(priority);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Help Request
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-text-primary">
                            Set Priority
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Set the priority level for this verified help
                            request.
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

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {/* Request information */}
                        <div className="rounded-lg bg-background-alt px-4 py-3">
                            <p className="text-xs font-semibold text-text-secondary">
                                Request
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                                {request.title || 'Untitled request'}
                            </p>
                        </div>

                        {/* Priority options */}
                        <div>
                            <p className="mb-3 text-sm font-semibold text-text-primary">
                                Select priority
                            </p>

                            <div className="space-y-2">
                                {PRIORITIES.map((item) => {
                                    const selected = priority === item.value;

                                    return (
                                        <label
                                            key={item.value}
                                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                                selected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:bg-background-alt'
                                            } ${
                                                loading
                                                    ? 'cursor-not-allowed opacity-70'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={item.value}
                                                checked={selected}
                                                onChange={(event) =>
                                                    setPriority(
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={loading}
                                                className="mt-1 accent-primary"
                                            />

                                            <span>
                                                <span className="block text-sm font-semibold text-text-primary">
                                                    {item.label}
                                                </span>

                                                <span className="mt-0.5 block text-xs leading-5 text-text-secondary">
                                                    {item.description}
                                                </span>
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
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
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !priority}
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Set Priority'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestPriorityModal;

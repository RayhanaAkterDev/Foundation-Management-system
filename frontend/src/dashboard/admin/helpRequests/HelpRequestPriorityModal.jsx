import React, { useState } from 'react';
import {
    X,
    Check,
    AlertOctagon,
    ArrowUp,
    Minus,
    ArrowDown,
} from 'lucide-react';

const PRIORITIES = [
    {
        value: 'critical',
        label: 'Critical',
        description: 'Requires immediate attention and urgent coordination.',
        icon: AlertOctagon,
        color: {
            soft: 'bg-red-50',
            icon: 'bg-red-100 text-red-600',
            selectedIcon: 'bg-red-600 text-white',
            border: 'border-red-300',
            ring: 'ring-red-100',
            accent: 'bg-red-500',
            text: 'text-red-600',
        },
    },
    {
        value: 'high',
        label: 'High',
        description: 'Should be handled as soon as possible.',
        icon: ArrowUp,
        color: {
            soft: 'bg-orange-50',
            icon: 'bg-orange-100 text-orange-600',
            selectedIcon: 'bg-orange-500 text-white',
            border: 'border-orange-300',
            ring: 'ring-orange-100',
            accent: 'bg-orange-500',
            text: 'text-orange-600',
        },
    },
    {
        value: 'normal',
        label: 'Normal',
        description: 'Can be handled through the normal assistance workflow.',
        icon: Minus,
        color: {
            soft: 'bg-teal-50',
            icon: 'bg-teal-100 text-teal-600',
            selectedIcon: 'bg-primary text-white',
            border: 'border-teal-300',
            ring: 'ring-teal-100',
            accent: 'bg-primary',
            text: 'text-primary',
        },
    },
    {
        value: 'low',
        label: 'Low',
        description: 'Can be handled after higher-priority requests.',
        icon: ArrowDown,
        color: {
            soft: 'bg-slate-50',
            icon: 'bg-slate-100 text-slate-500',
            selectedIcon: 'bg-slate-600 text-white',
            border: 'border-slate-300',
            ring: 'ring-slate-100',
            accent: 'bg-slate-500',
            text: 'text-slate-600',
        },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[5px] sm:p-6">
            <div
                className="absolute inset-0"
                onClick={!loading ? onClose : undefined}
            />

            <div className="relative z-10 flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
                {/* Header */}
                <div className="relative shrink-0 px-6 pb-6 pt-6 sm:px-7 sm:pt-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="pr-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                            Help Request
                        </p>

                        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
                            Set priority
                        </h2>

                        <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                            Choose how urgently this request should be handled
                            within the assistance workflow.
                        </p>
                    </div>
                </div>

                {/* Request */}
                <div className="mx-6 border-y border-slate-100 py-5 sm:mx-7">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Request being updated
                    </p>

                    <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">
                        {request.title || 'Untitled request'}
                    </p>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto"
                >
                    <div className="bg-[#f4f8f8] px-5 py-6 sm:px-7">
                        <div className="mb-4">
                            <p className="text-xs font-bold text-slate-900">
                                Choose priority
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Select the level that best reflects the urgency
                                of this request.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {PRIORITIES.map((item) => {
                                const selected = priority === item.value;
                                const Icon = item.icon;

                                return (
                                    <label
                                        key={item.value}
                                        className={`relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-200 ${
                                            selected
                                                ? `${item.color.border} ring-2 ${item.color.ring}`
                                                : 'border-slate-200 hover:border-slate-300'
                                        } ${
                                            loading
                                                ? 'cursor-not-allowed opacity-60'
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={item.value}
                                            checked={selected}
                                            onChange={(event) =>
                                                setPriority(event.target.value)
                                            }
                                            disabled={loading}
                                            className="sr-only"
                                        />

                                        {/* Top */}
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                                                    selected
                                                        ? item.color
                                                              .selectedIcon
                                                        : item.color.icon
                                                }`}
                                            >
                                                <Icon
                                                    size={18}
                                                    strokeWidth={2}
                                                />
                                            </span>

                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                                                    selected
                                                        ? `${item.color.border} ${item.color.selectedIcon}`
                                                        : 'border-slate-300 bg-white'
                                                }`}
                                            >
                                                {selected && (
                                                    <Check
                                                        size={12}
                                                        strokeWidth={3}
                                                        className="text-white"
                                                    />
                                                )}
                                            </span>
                                        </div>

                                        {/* Text */}
                                        <div className="mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {item.label}
                                                </span>

                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${item.color.accent}`}
                                                />
                                            </div>

                                            <span className="mt-1.5 block text-[11px] leading-5 text-slate-500">
                                                {item.description}
                                            </span>
                                        </div>

                                        {/* Selected accent */}
                                        <span
                                            className={`absolute bottom-0 left-0 right-0 h-[3px] transition-opacity ${
                                                item.color.accent
                                            } ${
                                                selected
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    </label>
                                );
                            })}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-xs font-semibold leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4 sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !priority}
                            className="inline-flex h-10 min-w-[108px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
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

import React from 'react';
import { X, Mail, Calendar, Shield, UserRound } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

const UserViewModal = ({ user, loading, error, onClose }) => {
    if (!loading && !user && !error) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/10">
                {/* Header */}
                <div className="relative px-6 pb-5 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                        User profile
                    </p>

                    <h2 className="mt-1.5 pr-12 text-xl font-semibold tracking-tight text-text-primary">
                        {user ? user.name : 'User Details'}
                    </h2>

                    {user && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm capitalize text-text-secondary">
                                {user.role === 'admin'
                                    ? 'Administrator'
                                    : user.role}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-border" />

                            <StatusBadge status={user.status} />
                        </div>
                    )}

                    {!user && !loading && error && (
                        <p className="mt-1 text-sm text-text-secondary">
                            Unable to load this account
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {loading && (
                        <div className="flex min-h-48 flex-col items-center justify-center text-center">
                            <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

                            <p className="text-sm font-medium text-text-primary">
                                Loading user details...
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {user && !loading && (
                        <div className="space-y-5">
                            {/* Identity */}
                            <div className="flex items-center gap-4 rounded-xl bg-background-alt/60 px-4 py-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserRound size={22} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary">
                                        Account holder
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="divide-y divide-border rounded-xl border border-border">
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Mail size={17} strokeWidth={1.8} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Email address
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-text-primary">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Shield size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Account role
                                        </p>

                                        <p className="mt-1 text-sm font-medium capitalize text-text-primary">
                                            {user.role === 'admin'
                                                ? 'Administrator'
                                                : user.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Calendar size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Member since
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Shield size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Account status
                                        </p>

                                        <div className="mt-1">
                                            <StatusBadge status={user.status} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-hover"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserViewModal;

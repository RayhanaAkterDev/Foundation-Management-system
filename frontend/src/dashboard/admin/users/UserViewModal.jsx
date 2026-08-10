import React from 'react';
import { X, Mail, Calendar, Shield, UserRound } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

const UserViewModal = ({ user, loading, error, onClose }) => {
    if (!loading && !user && !error) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            User Details
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            View information about this user.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="py-8 text-center text-sm text-text-secondary">
                            Loading user details...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {user && !loading && (
                        <div className="space-y-5">
                            {/* User identity */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserRound size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-text-primary">
                                        {user.name}
                                    </h3>

                                    <p className="text-sm capitalize text-text-secondary">
                                        {user.role}
                                    </p>
                                </div>
                            </div>

                            {/* User information */}
                            <div className="divide-y divide-border rounded-xl border border-border">
                                <div className="flex items-center gap-3 p-4">
                                    <Mail
                                        size={18}
                                        className="text-text-secondary"
                                    />

                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Email
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4">
                                    <Shield
                                        size={18}
                                        className="text-text-secondary"
                                    />

                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Role
                                        </p>

                                        <p className="mt-1 text-sm font-medium capitalize text-text-primary">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4">
                                    <Calendar
                                        size={18}
                                        className="text-text-secondary"
                                    />

                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Joined
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4">
                                    <div className="h-4.5 w-4.5" />

                                    <div>
                                        <p className="text-xs text-text-secondary">
                                            Email Status
                                        </p>

                                        <div className="mt-1">
                                            <StatusBadge
                                                status={
                                                    user.email_verified_at
                                                        ? 'active'
                                                        : 'pending'
                                                }
                                            />
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
                        className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserViewModal;

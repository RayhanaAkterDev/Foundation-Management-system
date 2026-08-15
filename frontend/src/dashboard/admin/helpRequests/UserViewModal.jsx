import React from 'react';
import {
    X,
    Mail,
    Calendar,
    Shield,
    UserRound,
    Phone,
    MapPin,
    Home,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const UserViewModal = ({ user, loading, error, onClose }) => {
    if (!loading && !user && !error) {
        return null;
    }

    const individualProfile = user?.individual_profile;

    const formatRole = (role) => {
        if (!role) {
            return 'Not provided';
        }

        if (role === 'admin') {
            return 'Administrator';
        }

        return role
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatDate = (date) => {
        if (!date) {
            return 'Not provided';
        }

        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[4px]">
            <div className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
                {/* =========================================================
                    HEADER
                ========================================================= */}
                <div className="relative shrink-0 overflow-hidden bg-[#eef8f6] px-7 pb-7 pt-6">
                    <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                    <div className="pointer-events-none absolute bottom-[-70px] left-[38%] h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/70 text-slate-500 backdrop-blur transition hover:bg-white hover:text-slate-800"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="relative flex items-center gap-4 pr-12">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-primary/10">
                            <UserRound size={22} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                User profile
                            </p>

                            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                                {user ? user.name : 'User Details'}
                            </h2>

                            {user && (
                                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-medium text-slate-500">
                                        {formatRole(user.role)}
                                    </span>

                                    {user.status && (
                                        <>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <StatusBadge status={user.status} />
                                        </>
                                    )}
                                </div>
                            )}

                            {!user && !loading && error && (
                                <p className="mt-1 text-sm text-slate-500">
                                    Unable to load this account
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    BODY
                ========================================================= */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                    {loading && (
                        <div className="flex min-h-64 flex-col items-center justify-center text-center">
                            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />

                            <p className="text-sm font-semibold text-slate-800">
                                Loading user details...
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="m-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                            <p className="text-sm font-semibold text-red-700">
                                Unable to load account
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {user && !loading && (
                        <div className="grid md:grid-cols-[250px_1fr]">
                            {/* =================================================
                                LEFT PROFILE RAIL
                            ================================================= */}
                            <aside className="border-b border-slate-100 bg-[#f8faf9] px-6 py-7 md:border-b-0 md:border-r">
                                <div className="flex flex-col">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-primary/10 text-primary">
                                        <UserRound
                                            size={34}
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <h3 className="mt-5 text-base font-bold text-slate-900">
                                        {user.name}
                                    </h3>

                                    <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                                        {user.email || 'No email available'}
                                    </p>

                                    <div className="mt-6 h-px bg-slate-200" />

                                    <div className="mt-6 space-y-5">
                                        <RailItem
                                            label="Role"
                                            value={formatRole(user.role)}
                                            icon={Shield}
                                        />

                                        {user.status && (
                                            <RailItem
                                                label="Status"
                                                value={
                                                    <StatusBadge
                                                        status={user.status}
                                                    />
                                                }
                                                icon={Shield}
                                            />
                                        )}

                                        <RailItem
                                            label="Member since"
                                            value={formatDate(user.created_at)}
                                            icon={Calendar}
                                        />
                                    </div>
                                </div>
                            </aside>

                            {/* =================================================
                                RIGHT INFORMATION CANVAS
                            ================================================= */}
                            <main className="px-6 py-7 sm:px-8">
                                {/* Contact */}
                                <div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                                Contact
                                            </p>

                                            <h3 className="mt-1 text-base font-bold text-slate-900">
                                                Contact information
                                            </h3>
                                        </div>

                                        <Mail
                                            size={20}
                                            strokeWidth={1.5}
                                            className="text-slate-200"
                                        />
                                    </div>

                                    <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                        <OpenField
                                            icon={Mail}
                                            label="Email address"
                                            value={user.email || 'Not provided'}
                                        />

                                        <OpenField
                                            icon={Phone}
                                            label="Phone number"
                                            value={
                                                individualProfile?.phone ||
                                                'Not provided'
                                            }
                                        />

                                        <OpenField
                                            icon={MapPin}
                                            label="District"
                                            value={
                                                individualProfile?.district ||
                                                'Not provided'
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="my-8 h-px bg-slate-100" />

                                {/* Personal */}
                                <div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600">
                                                Personal
                                            </p>

                                            <h3 className="mt-1 text-base font-bold text-slate-900">
                                                Personal information
                                            </h3>
                                        </div>

                                        <UserRound
                                            size={20}
                                            strokeWidth={1.5}
                                            className="text-slate-200"
                                        />
                                    </div>

                                    <div className="mt-6 space-y-6">
                                        <OpenField
                                            icon={Home}
                                            label="Address"
                                            value={
                                                individualProfile?.address ||
                                                'Not provided'
                                            }
                                            wide
                                        />

                                        <OpenField
                                            icon={Calendar}
                                            label="Date of birth"
                                            value={formatDate(
                                                individualProfile?.date_of_birth,
                                            )}
                                        />
                                    </div>
                                </div>
                            </main>
                        </div>
                    )}
                </div>

                {/* =========================================================
                    FOOTER
                ========================================================= */}
                <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

/* =============================================================
   LEFT RAIL ITEM
============================================================= */

const RailItem = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80">
                <Icon size={14} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {label}
                </p>

                <div className="mt-1 text-xs font-semibold text-slate-700">
                    {value}
                </div>
            </div>
        </div>
    );
};

/* =============================================================
   OPEN INFORMATION FIELD
============================================================= */

const OpenField = ({ icon: Icon, label, value, wide = false }) => {
    return (
        <div className={`${wide ? 'max-w-full' : ''}`}>
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <Icon size={15} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1.5 break-words text-sm font-medium leading-5 text-slate-700">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserViewModal;

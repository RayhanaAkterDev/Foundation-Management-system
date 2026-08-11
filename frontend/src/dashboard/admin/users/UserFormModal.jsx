import React, { useState } from 'react';
import {
    X,
    UserRound,
    Mail,
    LockKeyhole,
    ShieldCheck,
    CircleCheck,
} from 'lucide-react';

const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'active',
};

const getInitialForm = (mode, user) => {
    if (mode === 'edit' && user) {
        return {
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || '',
            status: user.status || 'active',
        };
    }

    return EMPTY_FORM;
};

const UserFormModal = ({
    mode = 'add',
    open,
    loading,
    error,
    fieldErrors,
    onClose,
    onSubmit,
    user = null,
}) => {
    const isEdit = mode === 'edit';

    const [form, setForm] = useState(() => getInitialForm(mode, user));

    if (!open) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit(form);
    };

    const title = isEdit ? 'Edit User' : 'Add New User';

    const description = isEdit
        ? 'Update account information and access settings.'
        : 'Create a new account for the platform.';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
            <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="border-b border-border bg-background-alt/40 px-6 py-5 sm:px-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                {isEdit ? (
                                    <UserRound size={19} strokeWidth={1.9} />
                                ) : (
                                    <UserRound size={19} strokeWidth={1.9} />
                                )}
                            </div>

                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-text-primary sm:text-lg">
                                    {title}
                                </h2>

                                <p className="mt-1 max-w-md text-xs leading-5 text-text-secondary sm:text-sm">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-white hover:text-text-primary hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="overflow-y-auto px-6 py-6 sm:px-7">
                        {/* General Error */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                                <p className="text-sm leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Account Information */}
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        Account Information
                                    </h3>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Basic information for this user account.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="user-form-name"
                                            className="mb-2 block text-xs font-semibold text-text-primary"
                                        >
                                            Full Name
                                        </label>

                                        <div className="relative">
                                            <UserRound
                                                size={17}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                            />

                                            <input
                                                id="user-form-name"
                                                name="name"
                                                type="text"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Enter full name"
                                                disabled={loading}
                                                className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/70 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                            />
                                        </div>

                                        {fieldErrors?.name && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {fieldErrors.name[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="user-form-email"
                                            className="mb-2 block text-xs font-semibold text-text-primary"
                                        >
                                            Email Address
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={17}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                            />

                                            <input
                                                id="user-form-email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="Enter email address"
                                                disabled={loading}
                                                className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/70 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                            />
                                        </div>

                                        {fieldErrors?.email && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {fieldErrors.email[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label
                                            htmlFor="user-form-password"
                                            className="mb-2 block text-xs font-semibold text-text-primary"
                                        >
                                            Password
                                        </label>

                                        <div className="relative">
                                            <LockKeyhole
                                                size={17}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                            />

                                            <input
                                                id="user-form-password"
                                                name="password"
                                                type="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder={
                                                    isEdit
                                                        ? 'Leave blank to keep current password'
                                                        : 'Minimum 8 characters'
                                                }
                                                disabled={loading}
                                                className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/70 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                            />
                                        </div>

                                        {fieldErrors?.password && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {fieldErrors.password[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Access Settings */}
                            <div className="border-t border-border pt-6">
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        Access Settings
                                    </h3>

                                    <p className="mt-1 text-xs text-text-secondary">
                                        Define the user's role and account
                                        status.
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Role */}
                                    <div>
                                        <label
                                            htmlFor="user-form-role"
                                            className="mb-2 block text-xs font-semibold text-text-primary"
                                        >
                                            Role
                                        </label>

                                        <div className="relative">
                                            <ShieldCheck
                                                size={17}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                            />

                                            <select
                                                id="user-form-role"
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className="h-11 w-full appearance-none rounded-xl border border-border bg-white pl-10 pr-9 text-sm text-text-primary outline-none transition-all hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                            >
                                                <option value="">
                                                    Select a role
                                                </option>

                                                <option value="individual">
                                                    Individual
                                                </option>

                                                <option value="organization">
                                                    Organization
                                                </option>

                                                <option value="admin">
                                                    Administrator
                                                </option>
                                            </select>

                                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                                                ▾
                                            </span>
                                        </div>

                                        {fieldErrors?.role && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {fieldErrors.role[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label
                                            htmlFor="user-form-status"
                                            className="mb-2 block text-xs font-semibold text-text-primary"
                                        >
                                            Account Status
                                        </label>

                                        <div className="relative">
                                            <CircleCheck
                                                size={17}
                                                strokeWidth={1.8}
                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                            />

                                            <select
                                                id="user-form-status"
                                                name="status"
                                                value={form.status}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className="h-11 w-full appearance-none rounded-xl border border-border bg-white pl-10 pr-9 text-sm capitalize text-text-primary outline-none transition-all hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-background-alt"
                                            >
                                                <option value="active">
                                                    Active
                                                </option>

                                                <option value="inactive">
                                                    Inactive
                                                </option>

                                                <option value="suspended">
                                                    Suspended
                                                </option>
                                            </select>

                                            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                                                ▾
                                            </span>
                                        </div>

                                        {fieldErrors?.status && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {fieldErrors.status[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-border bg-background-alt/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <p className="hidden text-xs text-text-secondary sm:block">
                            {isEdit
                                ? 'Changes will be applied immediately.'
                                : 'All required information must be provided.'}
                        </p>

                        <div className="flex w-full gap-2.5 sm:w-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="h-10 flex-1 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-all hover:border-border hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-10 min-w-32 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                            >
                                {loading
                                    ? isEdit
                                        ? 'Saving...'
                                        : 'Creating...'
                                    : isEdit
                                      ? 'Save Changes'
                                      : 'Create User'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    role: '',
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
    const [form, setForm] = useState(EMPTY_FORM);

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (!open) {
            return;
        }

        if (isEdit && user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                password: '',
                role: user.role || '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [open, isEdit, user]);

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

    const title = isEdit ? 'Edit User' : 'Add User';

    const description = isEdit
        ? 'Update this user account.'
        : 'Create a new user account.';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            {title}
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            {description}
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 p-6">
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="user-form-name"
                                className="mb-2 block text-sm font-medium text-text-primary"
                            >
                                Name
                            </label>

                            <input
                                id="user-form-name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                disabled={loading}
                                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />

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
                                className="mb-2 block text-sm font-medium text-text-primary"
                            >
                                Email
                            </label>

                            <input
                                id="user-form-email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                disabled={loading}
                                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />

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
                                className="mb-2 block text-sm font-medium text-text-primary"
                            >
                                Password
                            </label>

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
                                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            />

                            {fieldErrors?.password && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {fieldErrors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="user-form-role"
                                className="mb-2 block text-sm font-medium text-text-primary"
                            >
                                Role
                            </label>

                            <select
                                id="user-form-role"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                disabled={loading}
                                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-background-alt"
                            >
                                <option value="">Select a role</option>

                                <option value="individual">Individual</option>

                                <option value="organization">
                                    Organization
                                </option>

                                <option value="admin">Administrator</option>
                            </select>

                            {fieldErrors?.role && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {fieldErrors.role[0]}
                                </p>
                            )}
                        </div>
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
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-w-30 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

import React, { useState } from 'react';
import { Building2, X } from 'lucide-react';

const getInitialForm = (organization) => ({
    name: organization?.name || '',
    organization_type: organization?.organization_type || '',
    registration_number: organization?.registration_number || '',
    phone: organization?.phone || '',
    website: organization?.website || '',
    address: organization?.address || '',
    mission: organization?.mission || '',
    focus_areas: organization?.focus_areas || '',
    communities_served: organization?.communities_served || '',
    team_size: organization?.team_size ?? '',
    primary_activities: organization?.primary_activities || '',
    verification_status: organization?.verification_status || 'pending',
});

const OrganizationFormModal = ({
    open,
    mode = 'add',
    organization = null,
    loading = false,
    error = '',
    fieldErrors = {},
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState(() => getInitialForm(organization));

    if (!open) {
        return null;
    }

    const isEdit = mode === 'edit';

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            ...form,
            team_size: form.team_size === '' ? null : Number(form.team_size),
        });
    };

    const getFieldError = (field) => {
        const value = fieldErrors?.[field];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value || '';
    };

    const inputClass = (field) =>
        `h-10 w-full rounded-lg border bg-white px-3 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 ${
            getFieldError(field)
                ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10'
                : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/8'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Building2 size={19} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                {isEdit
                                    ? 'Edit Organization'
                                    : 'Add Organization'}
                            </h2>

                            <p className="mt-0.5 text-xs text-text-secondary">
                                {isEdit
                                    ? 'Update organization information and verification status.'
                                    : 'Create an organization profile for the platform.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="overflow-y-auto px-6 py-5">
                        {/* General Information */}
                        <div>
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-text-primary">
                                    Organization Information
                                </h3>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Basic information about the organization.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Organization Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter organization name"
                                        className={inputClass('name')}
                                        disabled={loading}
                                    />

                                    {getFieldError('name') && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {getFieldError('name')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Organization Type
                                    </label>

                                    <input
                                        type="text"
                                        name="organization_type"
                                        value={form.organization_type}
                                        onChange={handleChange}
                                        placeholder="NGO, Foundation, Charity..."
                                        className={inputClass(
                                            'organization_type',
                                        )}
                                        disabled={loading}
                                    />

                                    {getFieldError('organization_type') && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {getFieldError('organization_type')}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Registration Number
                                    </label>

                                    <input
                                        type="text"
                                        name="registration_number"
                                        value={form.registration_number}
                                        onChange={handleChange}
                                        placeholder="Registration number"
                                        className={inputClass(
                                            'registration_number',
                                        )}
                                        disabled={loading}
                                    />

                                    {getFieldError('registration_number') && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {getFieldError(
                                                'registration_number',
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Contact phone"
                                        className={inputClass('phone')}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Website
                                    </label>

                                    <input
                                        type="url"
                                        name="website"
                                        value={form.website}
                                        onChange={handleChange}
                                        placeholder="https://example.org"
                                        className={inputClass('website')}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Organization address"
                                        rows={2}
                                        className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/8"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mission & Activities */}
                        <div className="mt-7 border-t border-border pt-6">
                            <div className="mb-4">
                                <h3 className="text-sm font-bold text-text-primary">
                                    Mission & Activities
                                </h3>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Describe the organization's focus and
                                    activities.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Mission
                                    </label>

                                    <textarea
                                        name="mission"
                                        value={form.mission}
                                        onChange={handleChange}
                                        placeholder="Describe the organization's mission..."
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/8"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                            Focus Areas
                                        </label>

                                        <textarea
                                            name="focus_areas"
                                            value={form.focus_areas}
                                            onChange={handleChange}
                                            placeholder="Education, healthcare, poverty..."
                                            rows={3}
                                            className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/8"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                            Communities Served
                                        </label>

                                        <textarea
                                            name="communities_served"
                                            value={form.communities_served}
                                            onChange={handleChange}
                                            placeholder="Communities or groups served..."
                                            rows={3}
                                            className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/8"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                            Team Size
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name="team_size"
                                            value={form.team_size}
                                            onChange={handleChange}
                                            placeholder="Number of team members"
                                            className={inputClass('team_size')}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                            Verification Status
                                        </label>

                                        <select
                                            name="verification_status"
                                            value={form.verification_status}
                                            onChange={handleChange}
                                            className={inputClass(
                                                'verification_status',
                                            )}
                                            disabled={loading}
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="verified">
                                                Verified
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Primary Activities
                                    </label>

                                    <textarea
                                        name="primary_activities"
                                        value={form.primary_activities}
                                        onChange={handleChange}
                                        placeholder="Describe the organization's primary activities..."
                                        rows={3}
                                        className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-secondary/60 focus:border-primary focus:ring-4 focus:ring-primary/8"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Server Error */}
                        {error && (
                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-background-alt/30 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-10 min-w-32 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? 'Saving...'
                                : isEdit
                                  ? 'Save Changes'
                                  : 'Create Organization'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationFormModal;

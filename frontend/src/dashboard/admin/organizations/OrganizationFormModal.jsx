import React, { useState } from 'react';
import {
    X,
    Building2,
    Phone,
    Globe,
    MapPin,
    FileText,
    Mail,
} from 'lucide-react';

const getInitialForm = (mode, organization) => {
    if (mode === 'edit' && organization) {
        return {
            name: organization.name || '',
            email: organization.user?.email || organization.email || '',
            organization_type: organization.organization_type || '',
            registration_number: organization.registration_number || '',
            phone: organization.phone || '',
            website: organization.website || '',
            address: organization.address || '',
        };
    }

    return {
        name: '',
        email: '',
        organization_type: '',
        registration_number: '',
        phone: '',
        website: '',
        address: '',
    };
};

const FormField = ({
    label,
    name,
    placeholder,
    icon: Icon,
    required = false,
    type = 'text',
    value,
    onChange,
    disabled,
    error,
}) => {
    const inputClass = `
        h-10 w-full rounded-lg border bg-white px-3.5 text-sm
        text-text-primary outline-none transition-colors
        placeholder:text-text-secondary/60
        ${
            error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/8'
                : 'border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/8'
        }
    `;

    return (
        <div>
            <label
                htmlFor={name}
                className="mb-1.5 block text-xs font-semibold text-text-primary"
            >
                {label}

                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <div className="relative">
                <Icon
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${inputClass} pl-10`}
                />
            </div>

            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
    );
};

const OrganizationFormModal = ({
    mode = 'add',
    open,
    loading,
    fieldErrors = {},
    organization = null,
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState(() => getInitialForm(mode, organization));

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
            name: form.name,
            email: form.email,
            organization_type: form.organization_type,
            registration_number: form.registration_number,
            phone: form.phone,
            website: form.website,
            address: form.address,
        });
    };

    const getFieldError = (field) => {
        const value = fieldErrors?.[field];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value || '';
    };

    const inputClass = (field) => `
        h-10 w-full rounded-lg border bg-white px-3.5 text-sm
        text-text-primary outline-none transition-colors
        placeholder:text-text-secondary/60
        ${
            getFieldError(field)
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/8'
                : 'border-border focus:border-primary/40 focus:ring-4 focus:ring-primary/8'
        }
    `;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/10">
                {/* Header */}
                <div className="relative border-b border-border px-6 pb-5 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                        Organization management
                    </p>

                    <h2 className="mt-1.5 pr-12 text-xl font-semibold tracking-tight text-text-primary">
                        {isEdit ? 'Edit Organization' : 'Add Organization'}
                    </h2>

                    <p className="mt-1.5 max-w-lg text-sm text-text-secondary">
                        {isEdit
                            ? 'Update the organization’s basic information below.'
                            : 'Add the organization’s basic information. Verification will remain pending until the organization completes its profile.'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                        {/* Organization Information */}
                        <section>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Building2 size={18} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-text-primary">
                                        Organization information
                                    </h3>

                                    <p className="mt-0.5 text-xs text-text-secondary">
                                        Enter the organization’s basic details.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5 rounded-xl border border-border p-5">
                                {/* Organization Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block text-xs font-semibold text-text-primary"
                                    >
                                        Organization name
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <Building2
                                            size={16}
                                            strokeWidth={1.8}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                        />

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter organization name"
                                            disabled={loading}
                                            className={`${inputClass(
                                                'name',
                                            )} pl-10`}
                                        />
                                    </div>

                                    {getFieldError('name') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('name')}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <FormField
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    placeholder="organization@example.org"
                                    icon={Mail}
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    error={getFieldError('email')}
                                />

                                {/* Organization Type + Registration Number */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="organization_type"
                                            className="mb-1.5 block text-xs font-semibold text-text-primary"
                                        >
                                            Organization type
                                        </label>

                                        <select
                                            id="organization_type"
                                            name="organization_type"
                                            value={form.organization_type}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className={`${inputClass(
                                                'organization_type',
                                            )} appearance-none`}
                                        >
                                            <option value="">
                                                Select organization type
                                            </option>

                                            <option value="NGO">NGO</option>

                                            <option value="Non-profit">
                                                Non-profit
                                            </option>

                                            <option value="Charity">
                                                Charity
                                            </option>

                                            <option value="Foundation">
                                                Foundation
                                            </option>

                                            <option value="Community Organization">
                                                Community Organization
                                            </option>

                                            <option value="Other">Other</option>
                                        </select>

                                        {getFieldError('organization_type') && (
                                            <p className="mt-1.5 text-xs text-red-600">
                                                {getFieldError(
                                                    'organization_type',
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <FormField
                                        label="Registration number"
                                        name="registration_number"
                                        placeholder="Registration number"
                                        icon={FileText}
                                        value={form.registration_number}
                                        onChange={handleChange}
                                        disabled={loading}
                                        error={getFieldError(
                                            'registration_number',
                                        )}
                                    />
                                </div>

                                {/* Phone + Website */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <FormField
                                        label="Phone number"
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone number"
                                        icon={Phone}
                                        value={form.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                        error={getFieldError('phone')}
                                    />

                                    <FormField
                                        label="Website"
                                        name="website"
                                        type="url"
                                        placeholder="https://example.org"
                                        icon={Globe}
                                        value={form.website}
                                        onChange={handleChange}
                                        disabled={loading}
                                        error={getFieldError('website')}
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="mb-1.5 block text-xs font-semibold text-text-primary"
                                    >
                                        Address
                                    </label>

                                    <div className="relative">
                                        <MapPin
                                            size={16}
                                            strokeWidth={1.8}
                                            className="pointer-events-none absolute left-3.5 top-3 text-text-secondary"
                                        />

                                        <textarea
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Enter organization address"
                                            disabled={loading}
                                            rows={3}
                                            className={`${inputClass(
                                                'address',
                                            )} h-auto min-h-20 resize-none py-2.5 pl-10`}
                                        />
                                    </div>

                                    {getFieldError('address') && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {getFieldError('address')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Verification Note */}
                        {!isEdit && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                                <div className="mt-0.5 shrink-0 text-amber-600">
                                    <FileText size={17} strokeWidth={1.8} />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-amber-900">
                                        Verification will remain pending
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-800">
                                        The organization must complete its
                                        additional profile information before an
                                        administrator can verify it.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-w-32 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? isEdit
                                    ? 'Saving...'
                                    : 'Adding...'
                                : isEdit
                                  ? 'Save Changes'
                                  : 'Add Organization'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationFormModal;

import React, { useState } from 'react';

import { Loader2, X } from 'lucide-react';

import { updateHelpRequest } from './helpRequestAPI';

const emptyForm = {
    title: '',
    description: '',
    category: '',
    district: '',
    address: '',
    urgency: 'normal',
};

const categories = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

const getFormFromRequest = (request) => {
    if (!request) {
        return emptyForm;
    }

    return {
        title: request.title ?? '',
        description: request.description ?? '',
        category: request.category ?? '',
        district: request.district ?? '',
        address: request.address ?? '',
        urgency: request.urgency ?? 'normal',
    };
};

const getFieldError = (error) => {
    if (Array.isArray(error)) {
        return error[0] || '';
    }

    return error || '';
};

const inputClass = (hasError) =>
    `w-full rounded-xl border px-3 text-sm outline-none transition ${
        hasError
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
    }`;

const HelpRequestEditModal = ({ isOpen, request, onClose, onSuccess }) => {
    /*
     * The parent component should provide:
     *
     * key={editingRequest?.id || 'edit-help-request'}
     *
     * This ensures a fresh form is created whenever a different
     * help request is opened.
     */
    const [form, setForm] = useState(() => getFormFromRequest(request));

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !request) {
        return null;
    }

    /*
     * Only pending requests can be edited.
     */
    if (request.status !== 'pending') {
        return null;
    }

    const originalForm = getFormFromRequest(request);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: '',
            }));
        }

        if (submitError) {
            setSubmitError('');
        }
    };

    /*
     * Validate only fields that were actually changed.
     */
    const validateChangedFields = (changedFields) => {
        const validationErrors = {};

        if (
            Object.prototype.hasOwnProperty.call(changedFields, 'title') &&
            !changedFields.title
        ) {
            validationErrors.title = 'Request title cannot be empty.';
        }

        if (
            Object.prototype.hasOwnProperty.call(
                changedFields,
                'description',
            ) &&
            !changedFields.description
        ) {
            validationErrors.description = 'Description cannot be empty.';
        }

        if (
            Object.prototype.hasOwnProperty.call(changedFields, 'category') &&
            !changedFields.category
        ) {
            validationErrors.category = 'Please select a category.';
        }

        if (
            Object.prototype.hasOwnProperty.call(changedFields, 'district') &&
            !changedFields.district
        ) {
            validationErrors.district = 'District cannot be empty.';
        }

        if (
            Object.prototype.hasOwnProperty.call(changedFields, 'urgency') &&
            !changedFields.urgency
        ) {
            validationErrors.urgency = 'Please select an urgency level.';
        }

        return validationErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        setSubmitError('');
        setErrors({});

        /*
         * Build a PATCH payload containing ONLY the fields
         * that were actually changed.
         */
        const changedFields = {};

        if (form.title !== originalForm.title) {
            changedFields.title = form.title.trim();
        }

        if (form.description !== originalForm.description) {
            changedFields.description = form.description.trim();
        }

        if (form.category !== originalForm.category) {
            changedFields.category = form.category;
        }

        if (form.district !== originalForm.district) {
            changedFields.district = form.district.trim();
        }

        if (form.address !== originalForm.address) {
            changedFields.address = form.address.trim() || null;
        }

        if (form.urgency !== originalForm.urgency) {
            changedFields.urgency = form.urgency;
        }

        /*
         * Nothing changed.
         */
        if (Object.keys(changedFields).length === 0) {
            setSubmitError('No changes were made.');
            return;
        }

        /*
         * Validate only the changed fields.
         */
        const validationErrors = validateChangedFields(changedFields);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);

            const response = await updateHelpRequest(request.id, changedFields);

            const updatedRequest =
                response?.help_request || response?.data || response;

            if (onSuccess) {
                onSuccess(updatedRequest);
            }
        } catch (error) {
            if (error?.errors && typeof error.errors === 'object') {
                setErrors(error.errors);
            }

            setSubmitError(
                error?.message || 'Failed to update the help request.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) {
            return;
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                        <h2 className="font-['Fraunces'] text-xl font-semibold text-text-primary">
                            Edit Help Request
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Update any information you need before SP Admin
                            reviews your request.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {/* General Error */}
                        {submitError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {submitError}
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="edit-help-request-title"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Request Title
                            </label>

                            <input
                                id="edit-help-request-title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                disabled={submitting}
                                placeholder="e.g. School supplies for my children"
                                className={`h-11 ${inputClass(errors.title)}`}
                            />

                            {errors.title && (
                                <p className="text-xs text-red-500">
                                    {getFieldError(errors.title)}
                                </p>
                            )}
                        </div>

                        {/* Category + Urgency */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Category */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="edit-help-request-category"
                                    className="block text-sm font-medium text-text-primary"
                                >
                                    Category
                                </label>

                                <select
                                    id="edit-help-request-category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    className={`h-11 bg-white ${inputClass(
                                        errors.category,
                                    )}`}
                                >
                                    <option value="">Select category</option>

                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                {errors.category && (
                                    <p className="text-xs text-red-500">
                                        {getFieldError(errors.category)}
                                    </p>
                                )}
                            </div>

                            {/* Urgency */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="edit-help-request-urgency"
                                    className="block text-sm font-medium text-text-primary"
                                >
                                    Urgency
                                </label>

                                <select
                                    id="edit-help-request-urgency"
                                    name="urgency"
                                    value={form.urgency}
                                    onChange={handleChange}
                                    disabled={submitting}
                                    className={`h-11 bg-white ${inputClass(
                                        errors.urgency,
                                    )}`}
                                >
                                    {urgencyOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.urgency && (
                                    <p className="text-xs text-red-500">
                                        {getFieldError(errors.urgency)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* District */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="edit-help-request-district"
                                className="block text-sm font-medium text-text-primary"
                            >
                                District
                            </label>

                            <input
                                id="edit-help-request-district"
                                name="district"
                                type="text"
                                value={form.district}
                                onChange={handleChange}
                                disabled={submitting}
                                placeholder="e.g. Dhaka"
                                className={`h-11 ${inputClass(
                                    errors.district,
                                )}`}
                            />

                            {errors.district && (
                                <p className="text-xs text-red-500">
                                    {getFieldError(errors.district)}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="edit-help-request-address"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Address
                                <span className="ml-1 text-xs font-normal text-[#9ca3af]">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="edit-help-request-address"
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={handleChange}
                                disabled={submitting}
                                placeholder="Enter your address or relevant location"
                                className={`h-11 ${inputClass(errors.address)}`}
                            />

                            {errors.address && (
                                <p className="text-xs text-red-500">
                                    {getFieldError(errors.address)}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="edit-help-request-description"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Description
                            </label>

                            <textarea
                                id="edit-help-request-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                disabled={submitting}
                                placeholder="Please describe your situation and what kind of help you need..."
                                className={`resize-none py-2.5 ${inputClass(
                                    errors.description,
                                )}`}
                            />

                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {getFieldError(errors.description)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-medium text-text-secondary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {submitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestEditModal;

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

import { createHelpRequest } from './helpRequestAPI';

const initialForm = {
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

const HelpRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) {
        return null;
    }

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

    const validate = () => {
        const newErrors = {};

        if (!form.title.trim()) {
            newErrors.title = 'Request title is required.';
        }

        if (!form.description.trim()) {
            newErrors.description = 'Please describe the assistance you need.';
        }

        if (!form.category) {
            newErrors.category = 'Please select a category.';
        }

        if (!form.district.trim()) {
            newErrors.district = 'District is required.';
        }

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError('');
            setErrors({});

            const response = await createHelpRequest({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                district: form.district.trim(),
                address: form.address.trim() || null,
                urgency: form.urgency,
            });

            /*
             * Tell the parent that the request was successfully
             * created so it can refresh the table.
             */
            if (onSuccess) {
                onSuccess(response.help_request);
            }

            setForm(initialForm);
            onClose();
        } catch (error) {
            if (error.errors && typeof error.errors === 'object') {
                setErrors(error.errors);
            }

            setSubmitError(
                error.message || 'Failed to submit the help request.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (submitting) {
            return;
        }

        setForm(initialForm);
        setErrors({});
        setSubmitError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
                    <div>
                        <h2 className="font-['Fraunces'] text-xl font-semibold text-text-primary">
                            Submit a Help Request
                        </h2>

                        <p className="mt-1 text-sm text-[#6b7280]">
                            Tell us what kind of assistance you need.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="rounded-lg p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        {submitError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {submitError}
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="help-request-title"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Request Title
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="help-request-title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. School supplies for my children"
                                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition ${
                                    errors.title
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                        : 'border-[#e5e7eb] focus:border-primary focus:ring-2 focus:ring-primary/20'
                                }`}
                            />

                            {errors.title && (
                                <p className="text-xs text-red-500">
                                    {Array.isArray(errors.title)
                                        ? errors.title[0]
                                        : errors.title}
                                </p>
                            )}
                        </div>

                        {/* Category + Urgency */}
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="help-request-category"
                                    className="block text-sm font-medium text-text-primary"
                                >
                                    Category
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="help-request-category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition ${
                                        errors.category
                                            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                            : 'border-[#e5e7eb] focus:border-primary focus:ring-2 focus:ring-primary/20'
                                    }`}
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
                                        {Array.isArray(errors.category)
                                            ? errors.category[0]
                                            : errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="help-request-urgency"
                                    className="block text-sm font-medium text-text-primary"
                                >
                                    Urgency
                                </label>

                                <select
                                    id="help-request-urgency"
                                    name="urgency"
                                    value={form.urgency}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                            </div>
                        </div>

                        {/* District */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="help-request-district"
                                className="block text-sm font-medium text-text-primary"
                            >
                                District
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <input
                                id="help-request-district"
                                name="district"
                                type="text"
                                value={form.district}
                                onChange={handleChange}
                                placeholder="e.g. Dhaka"
                                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition ${
                                    errors.district
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                        : 'border-[#e5e7eb] focus:border-primary focus:ring-2 focus:ring-primary/20'
                                }`}
                            />

                            {errors.district && (
                                <p className="text-xs text-red-500">
                                    {Array.isArray(errors.district)
                                        ? errors.district[0]
                                        : errors.district}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="help-request-address"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Address
                                <span className="ml-1 text-xs font-normal text-[#9ca3af]">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="help-request-address"
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter your address or relevant location"
                                className="h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />

                            {errors.address && (
                                <p className="text-xs text-red-500">
                                    {Array.isArray(errors.address)
                                        ? errors.address[0]
                                        : errors.address}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="help-request-description"
                                className="block text-sm font-medium text-text-primary"
                            >
                                Description
                                <span className="ml-1 text-red-500">*</span>
                            </label>

                            <textarea
                                id="help-request-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Please describe your situation and what kind of help you need..."
                                className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                                    errors.description
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                        : 'border-[#e5e7eb] focus:border-primary focus:ring-2 focus:ring-primary/20'
                                }`}
                            />

                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {Array.isArray(errors.description)
                                        ? errors.description[0]
                                        : errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                            className="inline-flex h-10 items-center rounded-xl border border-[#e5e7eb] px-5 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#eef3f6] disabled:cursor-not-allowed disabled:opacity-50"
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

                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestModal;

import React, { useState } from 'react';
import {
    Loader2,
    X,
    MapPin,
    FileText,
    AlertCircle,
    ChevronDown,
} from 'lucide-react';

import { updateHelpRequest } from '../api/helpRequestAPI';

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
    `w-full rounded-[13px] border px-3.5 text-sm outline-none transition-all ${
        hasError
            ? 'border-red-300 bg-red-50/50 text-text-primary focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-[#dce5e3] bg-[#f8faf9] text-text-primary hover:border-[#cbd7d4] focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
    }`;

const HelpRequestEditModal = ({ isOpen, request, onClose, onSuccess }) => {
    /*
     * Parent should provide:
     *
     * key={editingRequest?.id || 'edit-help-request'}
     *
     * This ensures a fresh form is created whenever a
     * different help request is opened.
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
         * Build a PATCH payload containing ONLY fields
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-3 py-3 backdrop-blur-[5px] sm:px-4 sm:py-5">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* =====================================================
                MODAL
            ====================================================== */}
            <div className="relative z-10 flex max-h-[96vh] w-full max-w-[780px] flex-col overflow-hidden rounded-[18px] border-0 bg-background shadow-[0_35px_100px_rgba(2,30,27,0.28)] sm:max-h-[94vh] sm:rounded-[22px]">
                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="relative shrink-0 overflow-hidden bg-primary">
                    {/* Decorative background */}
                    <div className="absolute right-[-75px] top-[-100px] h-[260px] w-[260px] rounded-full border-[42px] border-white/[0.035]" />
                    <div className="absolute bottom-[-130px] left-[38%] h-[220px] w-[220px] rounded-full border-[34px] border-white/[0.025]" />

                    <div className="relative px-4 pb-5 pt-5 sm:px-8 sm:pb-7 sm:pt-7">
                        <div className="flex items-start justify-between gap-3 sm:gap-5">
                            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white/10 ring-1 ring-white/10 sm:h-12 sm:w-12 sm:rounded-[15px]">
                                    <FileText className="h-[18px] w-[18px] text-white sm:h-[20px] sm:w-[20px]" />
                                </div>

                                <div className="min-w-0 py-0.5 sm:py-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/55 sm:text-[10px] sm:tracking-[0.16em]">
                                            Help request
                                        </span>

                                        <span className="h-1 w-1 rounded-full bg-white/25" />

                                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white/75 ring-1 ring-white/[0.08] sm:px-2.5 sm:py-1 sm:text-[9px] sm:tracking-[0.1em]">
                                            Pending
                                        </span>
                                    </div>

                                    <h2 className="font-['Fraunces'] text-[23px] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[29px]">
                                        Edit help request
                                    </h2>

                                    <p className="mt-2 max-w-[530px] text-[11px] leading-4 text-white/65 sm:mt-2.5 sm:text-[13px] sm:leading-5">
                                        Update your request details before it is
                                        reviewed and processed.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={submitting}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.08] text-white/60 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.14] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 sm:rounded-xl"
                                aria-label="Close modal"
                            >
                                <X className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    FORM
                ================================================== */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="px-4 py-5 sm:px-8 sm:py-7">
                            <div className="space-y-6 sm:space-y-7">
                                {/* =================================================
                                    ERROR
                                ================================================== */}
                                {submitError && (
                                    <div className="flex items-start gap-2.5 rounded-[13px] border border-red-200 bg-red-50 px-3.5 py-3 sm:gap-3 sm:rounded-[14px] sm:px-4 sm:py-3.5">
                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-red-700 sm:text-[12px]">
                                                Unable to save changes
                                            </p>

                                            <p className="mt-0.5 break-words text-[11px] leading-5 text-red-600 sm:text-[12px]">
                                                {submitError}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    SECTION 01
                                ================================================== */}
                                <section>
                                    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
                                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white">
                                                01
                                            </span>

                                            <div className="min-w-0">
                                                <h3 className="text-[12px] font-bold text-text-primary sm:text-[13px]">
                                                    Request details
                                                </h3>

                                                <p className="mt-0.5 text-[10px] text-[#8a9691] sm:text-[11px]">
                                                    Describe what you need help
                                                    with.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-[0.1em] text-[#9aa5a1] sm:block">
                                            Required information
                                        </span>
                                    </div>

                                    <div className="rounded-[15px] border border-[#e2e9e6] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.035)] sm:rounded-[17px] sm:p-5">
                                        {/* Title */}
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="edit-help-request-title"
                                                className="flex items-center justify-between gap-3 text-[11px] font-bold text-text-primary sm:text-[12px]"
                                            >
                                                <span>
                                                    Request title
                                                    <span className="ml-1 text-primary">
                                                        *
                                                    </span>
                                                </span>

                                                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#a0aaa6] sm:text-[9px]">
                                                    Required
                                                </span>
                                            </label>

                                            <input
                                                id="edit-help-request-title"
                                                name="title"
                                                type="text"
                                                value={form.title}
                                                onChange={handleChange}
                                                disabled={submitting}
                                                placeholder="e.g. School supplies for my children"
                                                className={`h-11 sm:h-[47px] ${inputClass(
                                                    errors.title,
                                                )}`}
                                            />

                                            {errors.title && (
                                                <p className="text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                    {getFieldError(
                                                        errors.title,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* Category / Urgency */}
                                        <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 md:grid-cols-2">
                                            {/* Category */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="edit-help-request-category"
                                                    className="text-[11px] font-bold text-text-primary sm:text-[12px]"
                                                >
                                                    Category
                                                    <span className="ml-1 text-primary">
                                                        *
                                                    </span>
                                                </label>

                                                <div className="relative">
                                                    <select
                                                        id="edit-help-request-category"
                                                        name="category"
                                                        value={form.category}
                                                        onChange={handleChange}
                                                        disabled={submitting}
                                                        className={`h-11 appearance-none pr-10 sm:h-[47px] ${inputClass(
                                                            errors.category,
                                                        )}`}
                                                    >
                                                        <option value="">
                                                            Select category
                                                        </option>

                                                        {categories.map(
                                                            (category) => (
                                                                <option
                                                                    key={
                                                                        category
                                                                    }
                                                                    value={
                                                                        category
                                                                    }
                                                                >
                                                                    {category}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#899590]" />
                                                </div>

                                                {errors.category && (
                                                    <p className="text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                        {getFieldError(
                                                            errors.category,
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Urgency */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="edit-help-request-urgency"
                                                    className="text-[11px] font-bold text-text-primary sm:text-[12px]"
                                                >
                                                    Urgency
                                                    <span className="ml-1 text-primary">
                                                        *
                                                    </span>
                                                </label>

                                                <div className="relative">
                                                    <select
                                                        id="edit-help-request-urgency"
                                                        name="urgency"
                                                        value={form.urgency}
                                                        onChange={handleChange}
                                                        disabled={submitting}
                                                        className={`h-11 appearance-none pr-10 sm:h-[47px] ${inputClass(
                                                            errors.urgency,
                                                        )}`}
                                                    >
                                                        {urgencyOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#899590]" />
                                                </div>

                                                {errors.urgency && (
                                                    <p className="text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                        {getFieldError(
                                                            errors.urgency,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* =================================================
                                    SECTION 02
                                ================================================== */}
                                <section>
                                    <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e6efed] text-[10px] font-bold text-primary">
                                            02
                                        </span>

                                        <div className="min-w-0">
                                            <h3 className="text-[12px] font-bold text-text-primary sm:text-[13px]">
                                                Location
                                            </h3>

                                            <p className="mt-0.5 text-[10px] text-[#8a9691] sm:text-[11px]">
                                                Tell us where assistance is
                                                needed.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[15px] border border-[#e2e9e6] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.035)] sm:rounded-[17px] sm:p-5">
                                        <div className="mb-4 flex items-center gap-2.5 border-b border-[#edf1ef] pb-3.5 sm:mb-5 sm:gap-3 sm:pb-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                                                <MapPin className="h-[15px] w-[15px]" />
                                            </div>

                                            <p className="text-[10px] leading-4 text-[#78847f] sm:text-[11px]">
                                                A general location helps
                                                coordinators understand where
                                                support is required.
                                            </p>
                                        </div>

                                        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                                            {/* District */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="edit-help-request-district"
                                                    className="text-[11px] font-bold text-text-primary sm:text-[12px]"
                                                >
                                                    District
                                                    <span className="ml-1 text-primary">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    id="edit-help-request-district"
                                                    name="district"
                                                    type="text"
                                                    value={form.district}
                                                    onChange={handleChange}
                                                    disabled={submitting}
                                                    placeholder="e.g. Dhaka"
                                                    className={`h-11 sm:h-[47px] ${inputClass(
                                                        errors.district,
                                                    )}`}
                                                />

                                                {errors.district && (
                                                    <p className="text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                        {getFieldError(
                                                            errors.district,
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Address */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="edit-help-request-address"
                                                    className="flex items-center gap-2 text-[11px] font-bold text-text-primary sm:text-[12px]"
                                                >
                                                    Address
                                                    <span className="text-[9px] font-medium text-[#9ba5a1] sm:text-[10px]">
                                                        Optional
                                                    </span>
                                                </label>

                                                <input
                                                    id="edit-help-request-address"
                                                    name="address"
                                                    type="text"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    disabled={submitting}
                                                    placeholder="Specific location"
                                                    className={`h-11 sm:h-[47px] ${inputClass(
                                                        errors.address,
                                                    )}`}
                                                />

                                                {errors.address && (
                                                    <p className="text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                        {getFieldError(
                                                            errors.address,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* =================================================
                                    SECTION 03
                                ================================================== */}
                                <section>
                                    <div className="mb-4 flex items-center gap-2.5 sm:mb-5 sm:gap-3">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e6efed] text-[10px] font-bold text-primary">
                                            03
                                        </span>

                                        <div className="min-w-0">
                                            <h3 className="text-[12px] font-bold text-text-primary sm:text-[13px]">
                                                Your situation
                                            </h3>

                                            <p className="mt-0.5 text-[10px] text-[#8a9691] sm:text-[11px]">
                                                Give coordinators the context
                                                they need.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[15px] border border-[#e2e9e6] bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.035)] sm:rounded-[17px] sm:p-5">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor="edit-help-request-description"
                                                className="flex items-center gap-2 text-[11px] font-bold text-text-primary sm:text-[12px]"
                                            >
                                                <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                                                Description
                                                <span className="text-primary">
                                                    *
                                                </span>
                                            </label>

                                            <span className="shrink-0 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#a0aaa6] sm:text-[9px]">
                                                Required
                                            </span>
                                        </div>

                                        <textarea
                                            id="edit-help-request-description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={6}
                                            disabled={submitting}
                                            placeholder="Please describe your situation and what kind of help you need..."
                                            className={`min-h-[135px] w-full resize-none rounded-[13px] border bg-[#f8faf9] px-3.5 py-3 text-[12px] leading-6 text-text-primary placeholder:text-[#a0aaa6] outline-none transition-all sm:min-h-[145px] sm:text-[13px] ${
                                                errors.description
                                                    ? 'border-red-300 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100'
                                                    : 'border-[#dce5e3] focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                                            }`}
                                        />

                                        {errors.description && (
                                            <p className="mt-2 text-[10px] font-medium text-red-500 sm:text-[11px]">
                                                {getFieldError(
                                                    errors.description,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
                        FOOTER
                    ====================================================== */}
                    <div className="shrink-0 border-t border-[#dfe7e4] bg-white px-4 py-3.5 sm:px-8 sm:py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="hidden min-w-0 items-center gap-2 sm:flex">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                                <p className="truncate text-[10px] font-medium text-[#87938e]">
                                    Only the fields you changed will be updated.
                                </p>
                            </div>

                            <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-2.5">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="inline-flex h-10 flex-1 items-center justify-center rounded-[11px] px-3 text-[11px] font-semibold text-[#697570] transition-all hover:bg-[#f3f6f5] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-4 sm:text-[12px]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[11px] bg-primary px-4 text-[11px] font-bold text-white shadow-[0_5px_16px_rgba(15,118,110,0.2)] transition-all hover:bg-primary-hover hover:shadow-[0_7px_20px_rgba(15,118,110,0.26)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5 sm:text-[12px]"
                                >
                                    {submitting && (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    )}

                                    {submitting
                                        ? 'Saving Changes...'
                                        : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HelpRequestEditModal;

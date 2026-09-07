import React, { useState } from 'react';
import {
    X,
    Loader2,
    MapPin,
    AlertCircle,
    FileText,
    ChevronDown,
} from 'lucide-react';

import logo from '@/assets/shared/footerLogo.png';
import { createHelpRequest } from '../api/helpRequestAPI';

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

const urgencyConfig = {
    low: {
        dot: 'bg-slate-400',
        text: 'text-slate-700',
        background: 'bg-slate-50',
        border: 'border-slate-200',
    },
    normal: {
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        background: 'bg-amber-50',
        border: 'border-amber-200',
    },
    high: {
        dot: 'bg-orange-500',
        text: 'text-orange-700',
        background: 'bg-orange-50',
        border: 'border-orange-200',
    },
    critical: {
        dot: 'bg-red-500',
        text: 'text-red-700',
        background: 'bg-red-50',
        border: 'border-red-200',
    },
};

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

    const getErrorMessage = (error) => {
        if (!error) {
            return '';
        }

        return Array.isArray(error) ? error[0] : error;
    };

    const selectedUrgency = urgencyConfig[form.urgency];

    const inputBase =
        'w-full rounded-xl border bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400';

    const inputNormal =
        'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10';

    const inputError =
        'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100';

    const getInputClass = (hasError = false, additional = '') =>
        `${inputBase} ${additional} ${hasError ? inputError : inputNormal}`;

    return (
        <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-hidden bg-slate-800/60 px-2 py-2 backdrop-blur-md sm:px-4 sm:py-4 md:px-5 md:py-6">
            {/* BACKDROP */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* MODAL */}
            <div className="relative z-10 flex h-full max-h-[96dvh] w-full max-w-240 min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] sm:h-auto sm:max-h-[94dvh] sm:rounded-3xl">
                {/* =====================================================
                    LEFT PANEL
                ====================================================== */}
                <aside className="relative hidden shrink-0 overflow-hidden bg-primary lg:block">
                    {/* Decorative circles */}
                    <div className="absolute -right-28 -top-28 h-87.5 w-87.5 rounded-full border border-white/[0.07]" />
                    <div className="absolute -right-10 top-16 h-45 w-45 rounded-full border border-white/[0.05]" />
                    <div className="absolute -bottom-40 -left-40 h-97.5 w-97.5 rounded-full border border-white/[0.05]" />

                    <div className="relative flex h-full flex-col px-8 py-8">
                        {/* BRAND */}
                        <div className="flex items-center gap-3">
                            <div className="flex w-12 shrink-0 items-center justify-center rounded-xl">
                                <img
                                    src={logo}
                                    alt="SP"
                                    className="h-auto w-full object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                                    Stand For People
                                </p>

                                <p className="mt-0.5 text-[10px] text-white/40">
                                    Community support
                                </p>
                            </div>
                        </div>

                        {/* CENTER CONTENT */}
                        <div className="my-auto py-8">
                            <div className="mb-5 flex items-center gap-2">
                                <span className="h-px w-6 bg-accent" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                                    Request assistance
                                </span>
                            </div>

                            <h2 className="text-[clamp(32px,3vw,39px)] font-semibold leading-[1.03] tracking-[-0.045em] text-white">
                                Let us know
                                <br />
                                what you
                                <br />
                                <span className="text-accent">need.</span>
                            </h2>

                            <p className="mt-6 max-w-[220px] text-[12px] leading-6 text-white/50">
                                Tell us what is happening and what kind of
                                support would make a difference.
                            </p>

                            <div className="mt-8 border-l border-accent/40 pl-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/65">
                                    Your information matters
                                </p>

                                <p className="mt-1.5 max-w-[215px] text-[10px] leading-5 text-white/35">
                                    Clear and accurate details help us
                                    understand your request better.
                                </p>
                            </div>
                        </div>

                        {/* BOTTOM */}
                        <div className="border-t border-white/10 pt-5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                                <span className="text-[9px] font-medium text-white/40">
                                    Community assistance request
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* =====================================================
                    RIGHT SIDE
                ====================================================== */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f8f7]">
                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <header className="relative shrink-0 border-b border-slate-200/80 bg-white">
                        <div className="absolute right-0 top-0 h-full w-[42%] bg-gradient-to-l from-primary/[0.055] to-transparent" />

                        <div className="relative px-4 py-5 sm:px-6 sm:py-6 md:px-9 md:py-7">
                            <div className="flex items-start justify-between gap-3 sm:gap-5">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-2.5 flex flex-wrap items-center gap-2 sm:mb-3">
                                        <span className="inline-flex h-6 items-center rounded-md bg-primary/[0.07] px-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-primary">
                                            New request
                                        </span>

                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                        <span className="text-[10px] text-slate-400">
                                            Community assistance
                                        </span>
                                    </div>

                                    <h3 className="text-[21px] font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[25px] md:text-[29px]">
                                        Tell us about your situation
                                    </h3>

                                    <p className="mt-2 max-w-[600px] text-[11px] leading-5 text-slate-500 sm:text-[12px]">
                                        Share the details below so we can
                                        understand your needs and determine the
                                        right kind of support.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                                    aria-label="Close modal"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:mt-5 sm:pt-3.5">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                                    <span className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                        Required information
                                    </span>
                                </div>

                                <span className="shrink-0 text-[9px] text-slate-400">
                                    * Required
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* =================================================
                        FORM
                    ================================================== */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        {/* FORM CONTENT */}
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-9 md:py-7">
                                {/* SUBMIT ERROR */}
                                {submitError && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 sm:mb-6 sm:px-4">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-red-800">
                                                Unable to submit request
                                            </p>

                                            <p className="mt-0.5 break-words text-[11px] leading-5 text-red-600">
                                                {submitError}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    SECTION 01 — REQUEST DETAILS
                                ================================================== */}
                                <section>
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                01
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Request details
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    What kind of assistance is
                                                    needed?
                                                </p>
                                            </div>
                                        </div>

                                        <span className="hidden shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] text-primary/40 sm:block">
                                            Details
                                        </span>
                                    </div>

                                    {/* TITLE */}
                                    <div className="mt-5">
                                        <label
                                            htmlFor="help-request-title"
                                            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                        >
                                            Request title
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="help-request-title"
                                            name="title"
                                            type="text"
                                            value={form.title}
                                            onChange={handleChange}
                                            placeholder="Briefly describe what help is needed"
                                            className={getInputClass(
                                                errors.title,
                                                'h-[50px] sm:h-[54px]',
                                            )}
                                        />

                                        {errors.title && (
                                            <p className="mt-1.5 text-[10px] font-medium text-red-500">
                                                {getErrorMessage(errors.title)}
                                            </p>
                                        )}
                                    </div>

                                    {/* CATEGORY + URGENCY */}
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        {/* CATEGORY */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="help-request-category"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Category
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">
                                                <select
                                                    id="help-request-category"
                                                    name="category"
                                                    value={form.category}
                                                    onChange={handleChange}
                                                    className={`${getInputClass(
                                                        errors.category,
                                                        'h-[50px] appearance-none pr-10 sm:h-[54px]',
                                                    )}`}
                                                >
                                                    <option value="">
                                                        Select category
                                                    </option>

                                                    {categories.map(
                                                        (category) => (
                                                            <option
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            </div>

                                            {errors.category && (
                                                <p className="mt-1.5 text-[10px] font-medium text-red-500">
                                                    {getErrorMessage(
                                                        errors.category,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* URGENCY */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="help-request-urgency"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Urgency
                                            </label>

                                            <div
                                                className={`relative overflow-hidden rounded-xl border ${selectedUrgency.border} ${selectedUrgency.background}`}
                                            >
                                                <span
                                                    className={`absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${selectedUrgency.dot}`}
                                                />

                                                <select
                                                    id="help-request-urgency"
                                                    name="urgency"
                                                    value={form.urgency}
                                                    onChange={handleChange}
                                                    className={`h-[50px] w-full appearance-none bg-transparent px-4 pl-10 pr-10 text-[13px] font-bold outline-none sm:h-[54px] ${selectedUrgency.text}`}
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
                                                                {option.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* =================================================
                                    SECTION 02 — LOCATION
                                ================================================== */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-surface">
                                                02
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Location
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Where is assistance needed?
                                                </p>
                                            </div>
                                        </div>

                                        <MapPin className="h-4 w-4 shrink-0 text-accent" />
                                    </div>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {/* DISTRICT */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="help-request-district"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                District
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                id="help-request-district"
                                                name="district"
                                                type="text"
                                                value={form.district}
                                                onChange={handleChange}
                                                placeholder="e.g. Dhaka"
                                                className={getInputClass(
                                                    errors.district,
                                                    'h-[50px] sm:h-[54px]',
                                                )}
                                            />

                                            {errors.district && (
                                                <p className="mt-1.5 text-[10px] font-medium text-red-500">
                                                    {getErrorMessage(
                                                        errors.district,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* ADDRESS */}
                                        <div className="min-w-0">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <label
                                                    htmlFor="help-request-address"
                                                    className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                                >
                                                    Address
                                                </label>

                                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.07em] text-slate-400">
                                                    Optional
                                                </span>
                                            </div>

                                            <input
                                                id="help-request-address"
                                                name="address"
                                                type="text"
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder="Enter relevant location"
                                                className={getInputClass(
                                                    false,
                                                    'h-[50px] sm:h-[54px]',
                                                )}
                                            />

                                            {errors.address && (
                                                <p className="mt-1.5 text-[10px] font-medium text-red-500">
                                                    {getErrorMessage(
                                                        errors.address,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* =================================================
                                    SECTION 03 — SITUATION
                                ================================================== */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                03
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Your situation
                                                </h4>

                                                <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                                                    Explain what happened and
                                                    what support is needed.
                                                </p>
                                            </div>
                                        </div>

                                        <FileText className="h-4 w-4 shrink-0 text-primary/45" />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor="help-request-description"
                                                className="text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Description
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <span className="hidden shrink-0 text-[9px] text-slate-400 sm:block">
                                                Be as specific as possible
                                            </span>
                                        </div>

                                        <textarea
                                            id="help-request-description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Please describe your situation and what kind of help you need..."
                                            className={getInputClass(
                                                errors.description,
                                                'min-h-[140px] resize-none px-4 py-4 text-[13px] leading-6 sm:min-h-[155px]',
                                            )}
                                        />

                                        {errors.description ? (
                                            <p className="mt-1.5 text-[10px] font-medium text-red-500">
                                                {getErrorMessage(
                                                    errors.description,
                                                )}
                                            </p>
                                        ) : (
                                            <div className="mt-2 flex items-start gap-2">
                                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />

                                                <p className="text-[10px] leading-4 text-slate-400">
                                                    Include details that may
                                                    help us understand your
                                                    situation.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================== */}
                        <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-9">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:mt-0" />

                                    <p className="text-[10px] leading-4 text-slate-400">
                                        Your request will be reviewed after
                                        submission.
                                    </p>
                                </div>

                                <div className="flex w-full gap-2.5 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={submitting}
                                        className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-6"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(15,118,110,0.16)] transition-all hover:bg-primary-hover hover:shadow-[0_8px_22px_rgba(15,118,110,0.22)] focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[165px] sm:flex-none sm:px-7"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Request'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestModal;

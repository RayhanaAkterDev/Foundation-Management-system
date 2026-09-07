import React, { useState } from 'react';
import {
    X,
    Loader2,
    MapPin,
    AlertCircle,
    FileText,
    ChevronDown,
} from 'lucide-react';
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
        if (!error) return '';
        return Array.isArray(error) ? error[0] : error;
    };

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

    const selectedUrgency = urgencyConfig[form.urgency];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-md sm:px-5 sm:py-6">
            {/* BACKDROP */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* MODAL */}
            <div className="relative z-10 flex max-h-[95vh] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
                {/* =================================================
                    LEFT SIDEBAR
                ================================================== */}
                <aside className="relative hidden w-[330px] shrink-0 overflow-hidden bg-primary lg:block">
                    {/* Decorative shapes */}
                    <div className="absolute -right-28 -top-24 h-[360px] w-[360px] rounded-full border border-white/[0.08]" />
                    <div className="absolute -right-10 top-10 h-[190px] w-[190px] rounded-full border border-white/[0.06]" />
                    <div className="absolute -bottom-40 -left-36 h-[390px] w-[390px] rounded-full border border-white/[0.06]" />
                    <div className="absolute bottom-16 right-[-80px] h-[180px] w-[180px] rounded-full bg-accent/[0.04] blur-3xl" />

                    <div className="relative flex h-full flex-col px-9 py-9">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary shadow-[0_8px_20px_rgba(245,158,11,0.18)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-current" />
                            </div>

                            <div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">
                                    Stand For People
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-white/45">
                                    Community support
                                </p>
                            </div>
                        </div>

                        {/* Main message */}
                        <div className="my-auto">
                            <div className="mb-5 flex items-center gap-2">
                                <span className="h-px w-7 bg-accent" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
                                    Request assistance
                                </span>
                            </div>

                            <h2 className="text-[43px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                                Let us know
                                <br />
                                what you
                                <br />
                                <span className="text-accent">need.</span>
                            </h2>

                            <p className="mt-7 max-w-[235px] text-[13px] leading-6 text-white/55">
                                Tell us what is happening and what kind of
                                support would make a difference.
                            </p>

                            {/* Small reassurance */}
                            <div className="mt-9 flex items-start gap-3 border-l border-accent/40 pl-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                                        Your information matters
                                    </p>

                                    <p className="mt-1.5 text-[11px] leading-5 text-white/40">
                                        Clear and accurate details help us
                                        understand your request better.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="border-t border-white/10 pt-5">
                            <div className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                <span className="text-[10px] font-medium text-white/45">
                                    Community assistance request
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* =================================================
                    RIGHT SIDE
                ================================================== */}
                <div className="flex min-w-0 flex-1 flex-col bg-[#f4f7f6]">
                    {/* =================================================
                        HEADER
                    ================================================== */}
                    <header className="relative shrink-0 overflow-hidden border-b border-slate-200/80 bg-white">
                        <div className="absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-primary/[0.06] via-primary/[0.025] to-transparent" />

                        <div className="absolute right-12 top-0 h-[3px] w-20 bg-accent" />

                        <div className="relative px-7 pb-7 pt-7 sm:px-10 sm:pb-8 sm:pt-8">
                            <div className="flex items-start justify-between gap-6">
                                <div className="min-w-0">
                                    {/* Eyebrow */}
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <span className="inline-flex h-6 items-center rounded-md bg-primary/[0.08] px-2.5 text-[9px] font-extrabold uppercase tracking-[0.17em] text-primary">
                                            New request
                                        </span>

                                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                                        <span className="text-[10px] font-medium text-slate-400">
                                            Community assistance
                                        </span>
                                    </div>

                                    <h3 className="max-w-[680px] text-[27px] font-bold leading-[1.1] tracking-[-0.04em] text-slate-950 sm:text-[31px]">
                                        Tell us about your situation
                                    </h3>

                                    <p className="mt-2.5 max-w-[610px] text-[13px] leading-5 text-slate-500">
                                        Share the details below so we can
                                        understand your needs and determine the
                                        right kind of support.
                                    </p>
                                </div>

                                {/* Close */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Close modal"
                                >
                                    <X className="h-[17px] w-[17px]" />
                                </button>
                            </div>

                            {/* Header bottom information */}
                            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                        Required information
                                    </span>
                                </div>

                                <span className="text-[10px] text-slate-400">
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
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        {/* FORM CONTENT */}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div className="px-6 py-7 sm:px-10 sm:py-8">
                                {/* SUBMIT ERROR */}
                                {submitError && (
                                    <div className="mb-7 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-red-800">
                                                Unable to submit request
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-red-600">
                                                {submitError}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* =================================================
                                    SECTION 01
                                ================================================== */}
                                <section>
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[10px] font-extrabold text-white">
                                                01
                                            </span>

                                            <div>
                                                <h4 className="text-[14px] font-bold text-slate-900">
                                                    Request details
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    What kind of assistance is
                                                    needed?
                                                </p>
                                            </div>
                                        </div>

                                        <span className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-primary/45 sm:block">
                                            Details
                                        </span>
                                    </div>

                                    {/* TITLE */}
                                    <div className="mt-6">
                                        <label
                                            htmlFor="help-request-title"
                                            className="mb-2 block text-[11px] font-bold text-slate-600"
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
                                            className={`h-[58px] w-full rounded-xl border bg-white px-4 text-[14px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 ${
                                                errors.title
                                                    ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                                    : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                            }`}
                                        />

                                        {errors.title && (
                                            <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                                {getErrorMessage(errors.title)}
                                            </p>
                                        )}
                                    </div>

                                    {/* CATEGORY + URGENCY */}
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        {/* CATEGORY */}
                                        <div>
                                            <label
                                                htmlFor="help-request-category"
                                                className="mb-2 block text-[11px] font-bold text-slate-600"
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
                                                    className={`h-[58px] w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-[13px] font-medium text-slate-700 outline-none transition-all ${
                                                        errors.category
                                                            ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                                            : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                                    }`}
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
                                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                                    {getErrorMessage(
                                                        errors.category,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* URGENCY */}
                                        <div>
                                            <label
                                                htmlFor="help-request-urgency"
                                                className="mb-2 block text-[11px] font-bold text-slate-600"
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
                                                    className={`h-[58px] w-full appearance-none bg-transparent px-4 pl-10 pr-10 text-[13px] font-bold outline-none ${selectedUrgency.text}`}
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
                                <section className="mt-9">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-[10px] font-extrabold text-primary">
                                                02
                                            </span>

                                            <div>
                                                <h4 className="text-[14px] font-bold text-slate-900">
                                                    Location
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Where is assistance needed?
                                                </p>
                                            </div>
                                        </div>

                                        <MapPin className="h-[17px] w-[17px] text-accent" />
                                    </div>

                                    {/* LOCATION FIELDS */}
                                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                                        {/* DISTRICT */}
                                        <div>
                                            <label
                                                htmlFor="help-request-district"
                                                className="mb-2 block text-[11px] font-bold text-slate-600"
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
                                                className={`h-[58px] w-full rounded-xl border bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 ${
                                                    errors.district
                                                        ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                                }`}
                                            />

                                            {errors.district && (
                                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                                    {getErrorMessage(
                                                        errors.district,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* ADDRESS */}
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <label
                                                    htmlFor="help-request-address"
                                                    className="text-[11px] font-bold text-slate-600"
                                                >
                                                    Address
                                                </label>

                                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-400">
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
                                                className="h-[58px] w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                            />

                                            {errors.address && (
                                                <p className="mt-1.5 text-[11px] font-medium text-red-500">
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
                                <section className="mt-9">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[10px] font-extrabold text-white">
                                                03
                                            </span>

                                            <div>
                                                <h4 className="text-[14px] font-bold text-slate-900">
                                                    Your situation
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Explain what happened and
                                                    what support is needed.
                                                </p>
                                            </div>
                                        </div>

                                        <FileText className="h-[17px] w-[17px] text-primary/50" />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="mt-6">
                                        <label
                                            htmlFor="help-request-description"
                                            className="mb-2 block text-[11px] font-bold text-slate-600"
                                        >
                                            Description
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <textarea
                                            id="help-request-description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            rows={7}
                                            placeholder="Please describe your situation and what kind of help you need..."
                                            className={`min-h-[175px] w-full resize-none rounded-xl border bg-white px-4 py-4 text-[13px] leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 ${
                                                errors.description
                                                    ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                                    : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10'
                                            }`}
                                        />

                                        {errors.description ? (
                                            <p className="mt-1.5 text-[11px] font-medium text-red-500">
                                                {getErrorMessage(
                                                    errors.description,
                                                )}
                                            </p>
                                        ) : (
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="h-1 w-1 rounded-full bg-accent" />

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
                        <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 sm:px-10">
                            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                                    <p className="text-[10px] font-medium text-slate-400">
                                        Your request will be reviewed after
                                        submission.
                                    </p>
                                </div>

                                <div className="flex w-full gap-3 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={submitting}
                                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-6 text-[13px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex h-11 min-w-[175px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[13px] font-bold text-white shadow-[0_7px_20px_rgba(15,118,110,0.18)] transition-all hover:bg-primary-hover hover:shadow-[0_9px_26px_rgba(15,118,110,0.25)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
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

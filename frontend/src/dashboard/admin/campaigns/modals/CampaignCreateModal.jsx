import React, { useState } from 'react';

import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    FileText,
    ImagePlus,
    MapPin,
    Target,
    X,
} from 'lucide-react';

const INITIAL_FORM = {
    title: '',
    description: '',
    category: '',
    scope: 'global',
    district: '',
    location: '',
    affected_areas: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    cover_image: null,
};

const CATEGORIES = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

const CampaignCreateModal = ({
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [validationError, setValidationError] = useState('');

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
        setValidationError('');
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0] || null;

        setForm((current) => ({
            ...current,
            cover_image: file,
        }));

        setValidationError('');
    };

    const validate = () => {
        if (!form.title.trim()) {
            return 'Campaign title is required.';
        }

        if (!form.description.trim()) {
            return 'Campaign description is required.';
        }

        if (!form.category) {
            return 'Please select a campaign category.';
        }

        if (!form.location.trim()) {
            return 'Campaign location is required.';
        }

        if (!form.target_amount) {
            return 'Target amount is required.';
        }

        const targetAmount = Number(form.target_amount);

        if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
            return 'Target amount must be greater than zero.';
        }

        if (form.start_date && form.end_date) {
            const start = new Date(form.start_date);
            const end = new Date(form.end_date);

            if (end < start) {
                return 'End date cannot be earlier than the start date.';
            }
        }

        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationMessage = validate();

        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        setValidationError('');

        await onConfirm?.({
            type: 'global_situation',
            help_request_id: null,
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            scope: 'global',
            district: form.district.trim(),
            location: form.location.trim(),
            affected_areas: form.affected_areas.trim(),
            target_amount: form.target_amount,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            cover_image: form.cover_image,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-hidden bg-slate-800/60 px-2 py-2 backdrop-blur-md sm:px-4 sm:py-4 md:px-5 md:py-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 flex h-full max-h-[96dvh] w-full max-w-240 min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] sm:h-auto sm:max-h-[94dvh] sm:rounded-3xl">
                {/* Left panel */}
                <aside className="relative hidden shrink-0 overflow-hidden bg-primary lg:block lg:w-64 xl:w-72">
                    {/* Decorative circles */}
                    <div className="absolute -right-28 -top-28 h-87.5 w-87.5 rounded-full border border-white/7" />
                    <div className="absolute -right-10 top-16 h-45 w-45 rounded-full border border-white/5" />
                    <div className="absolute -bottom-40 -left-40 h-97.5 w-97.5 rounded-full border border-white/5" />

                    <div className="relative flex h-full flex-col px-8 py-8">
                        {/* Brand */}
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white">
                                Stand For People
                            </p>

                            <p className="mt-1 text-[10px] text-white/40">
                                Humanitarian coordination
                            </p>
                        </div>

                        {/* Center content */}
                        <div className="my-auto py-8">
                            <div className="mb-5 flex items-center gap-2">
                                <span className="h-px w-6 bg-accent" />

                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                                    Global response
                                </span>
                            </div>

                            <h2 className="text-[clamp(32px,3vw,39px)] font-semibold leading-[1.03] tracking-[-0.045em] text-white">
                                Respond to
                                <br />
                                situations
                                <br />
                                <span className="text-accent">
                                    that matter.
                                </span>
                            </h2>

                            <p className="mt-6 max-w-55 text-[12px] leading-6 text-white/50">
                                Create a coordinated campaign for a
                                humanitarian situation that affects communities
                                beyond an individual help request.
                            </p>

                            <div className="mt-8 border-l border-accent/40 pl-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/65">
                                    Global campaign
                                </p>

                                <p className="mt-1.5 max-w-53.75 text-[10px] leading-5 text-white/35">
                                    This campaign will enter the administration
                                    verification workflow after creation.
                                </p>
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="border-t border-white/10 pt-5">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

                                <span className="text-[9px] font-medium text-white/40">
                                    Global humanitarian campaign
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right side */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f6f8f7]">
                    {/* Header */}
                    <header className="relative shrink-0 border-b border-slate-200/80 bg-white">
                        <div className="absolute right-0 top-0 h-full w-[42%] bg-linear-to-l from-primary/5.5 to-transparent" />

                        <div className="relative px-4 py-5 sm:px-6 sm:py-6 md:px-9 md:py-7">
                            <div className="flex items-start justify-between gap-3 sm:gap-5">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-2.5 flex flex-wrap items-center gap-2 sm:mb-3">
                                        <span className="inline-flex h-6 items-center rounded-md bg-primary/7 px-2.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-primary">
                                            New campaign
                                        </span>

                                        <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                        <span className="text-[10px] text-slate-400">
                                            Global situation
                                        </span>
                                    </div>

                                    <h3 className="text-[21px] font-bold leading-tight tracking-[-0.035em] text-slate-950 sm:text-[25px] md:text-[29px]">
                                        Create a global campaign
                                    </h3>

                                    <p className="mt-2 max-w-150 text-[11px] leading-5 text-slate-500 sm:text-[12px]">
                                        Provide the details needed to coordinate
                                        a response to a wider humanitarian
                                        situation.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
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
                                        Campaign information
                                    </span>
                                </div>

                                <span className="shrink-0 text-[9px] text-slate-400">
                                    * Required
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        {/* Form content */}
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-9 md:py-7">
                                {/* Error */}
                                {(validationError || error) && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 sm:mb-6 sm:px-4">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-red-800">
                                                Unable to create campaign
                                            </p>

                                            <p className="mt-0.5 wrap-break-word text-[11px] leading-5 text-red-600">
                                                {validationError || error}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Section 01 */}
                                <section>
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                01
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Campaign details
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Define the global
                                                    humanitarian response.
                                                </p>
                                            </div>
                                        </div>

                                        <Target className="h-4 w-4 shrink-0 text-accent" />
                                    </div>

                                    {/* Title */}
                                    <div className="mt-5">
                                        <label
                                            htmlFor="campaign-title"
                                            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                        >
                                            Campaign title
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="campaign-title"
                                            type="text"
                                            value={form.title}
                                            onChange={(event) =>
                                                updateField(
                                                    'title',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Enter a clear campaign title"
                                            disabled={loading}
                                            className="h-12.5 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                        />
                                    </div>

                                    {/* Category + Scope */}
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        {/* Category */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-category"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Category
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">
                                                <select
                                                    id="campaign-category"
                                                    value={form.category}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'category',
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className="h-12.5 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                                >
                                                    <option value="">
                                                        Select category
                                                    </option>

                                                    {CATEGORIES.map(
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
                                        </div>

                                        {/* Scope */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-scope"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Scope
                                            </label>

                                            <div className="relative">
                                                <select
                                                    id="campaign-scope"
                                                    value="global"
                                                    disabled
                                                    className="h-12.5 w-full cursor-not-allowed appearance-none rounded-xl border border-primary/20 bg-primary/4.5 px-4 pr-10 text-[13px] font-bold capitalize text-primary outline-none sm:h-13.5"
                                                >
                                                    <option value="global">
                                                        Global
                                                    </option>
                                                </select>

                                                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor="campaign-description"
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
                                            id="campaign-description"
                                            value={form.description}
                                            onChange={(event) =>
                                                updateField(
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            rows={6}
                                            placeholder="Describe the humanitarian situation, affected communities, and the intended response..."
                                            disabled={loading}
                                            className="min-h-35 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-[13px] font-medium leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:min-h-38.75"
                                        />

                                        <div className="mt-2 flex items-start gap-2">
                                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />

                                            <p className="text-[10px] leading-4 text-slate-400">
                                                Include enough context to help
                                                people understand why the
                                                campaign is needed.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 02 */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                02
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Location & impact
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Define where the situation
                                                    is affecting communities.
                                                </p>
                                            </div>
                                        </div>

                                        <MapPin className="h-4 w-4 shrink-0 text-accent" />
                                    </div>

                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {/* District */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-district"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                District
                                            </label>

                                            <input
                                                id="campaign-district"
                                                type="text"
                                                value={form.district}
                                                onChange={(event) =>
                                                    updateField(
                                                        'district',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Multiple districts"
                                                disabled={loading}
                                                className="h-12.5 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                            />
                                        </div>

                                        {/* Location */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-location"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Location
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <input
                                                    id="campaign-location"
                                                    type="text"
                                                    value={form.location}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'location',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Affected region or area"
                                                    disabled={loading}
                                                    className="h-12.5 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Affected Areas */}
                                    <div className="mt-4">
                                        <label
                                            htmlFor="campaign-affected-areas"
                                            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                        >
                                            Affected areas
                                        </label>

                                        <textarea
                                            id="campaign-affected-areas"
                                            value={form.affected_areas}
                                            onChange={(event) =>
                                                updateField(
                                                    'affected_areas',
                                                    event.target.value,
                                                )
                                            }
                                            rows={3}
                                            placeholder="Describe the affected communities, regions, or areas..."
                                            disabled={loading}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-4 text-[13px] font-medium leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                        />
                                    </div>
                                </section>

                                {/* Section 03 */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                03
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Funding & schedule
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Set the campaign target and
                                                    response period.
                                                </p>
                                            </div>
                                        </div>

                                        <CalendarDays className="h-4 w-4 shrink-0 text-primary/45" />
                                    </div>

                                    {/* Target amount */}
                                    <div className="mt-5">
                                        <label
                                            htmlFor="campaign-target"
                                            className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                        >
                                            Target amount
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="campaign-target"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.target_amount}
                                            onChange={(event) =>
                                                updateField(
                                                    'target_amount',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Enter fundraising target"
                                            disabled={loading}
                                            className="h-12.5 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                        />
                                    </div>

                                    {/* Dates */}
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        {/* Start date */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-start-date"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                Start date
                                            </label>

                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <input
                                                    id="campaign-start-date"
                                                    type="date"
                                                    value={form.start_date}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'start_date',
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className="h-12.5 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[13px] font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                                />
                                            </div>
                                        </div>

                                        {/* End date */}
                                        <div className="min-w-0">
                                            <label
                                                htmlFor="campaign-end-date"
                                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.03em] text-slate-600"
                                            >
                                                End date
                                            </label>

                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <input
                                                    id="campaign-end-date"
                                                    type="date"
                                                    value={form.end_date}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'end_date',
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={loading}
                                                    className="h-12.5 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[13px] font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-13.5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 04 */}
                                <section className="mt-8">
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[9px] font-extrabold text-white">
                                                04
                                            </span>

                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold text-slate-900">
                                                    Campaign image
                                                </h4>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    Add an optional visual for
                                                    the campaign.
                                                </p>
                                            </div>
                                        </div>

                                        <ImagePlus className="h-4 w-4 shrink-0 text-primary/45" />
                                    </div>

                                    <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 transition-all hover:border-primary/40 hover:bg-primary/2">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                            <ImagePlus size={18} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[12px] font-semibold text-slate-700">
                                                {form.cover_image
                                                    ? form.cover_image.name
                                                    : 'Choose a cover image'}
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                JPG, PNG or WebP
                                            </p>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            disabled={loading}
                                            className="hidden"
                                        />
                                    </label>
                                </section>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-9">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-start gap-2.5 sm:items-center">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:mt-0" />

                                    <p className="text-[10px] leading-4 text-slate-400">
                                        The campaign will be created as
                                        unverified and require admin
                                        verification.
                                    </p>
                                </div>

                                <div className="flex w-full gap-2.5 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-6"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(15,118,110,0.16)] transition-all hover:bg-primary-hover hover:shadow-[0_8px_22px_rgba(15,118,110,0.22)] focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-41.25 sm:flex-none sm:px-7"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="h-4 w-4" />
                                                Create Campaign
                                            </>
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

export default CampaignCreateModal;
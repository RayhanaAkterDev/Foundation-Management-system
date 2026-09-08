import React, { useEffect, useMemo, useState } from 'react';

import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    FileText,
    Loader2,
    MapPin,
    Target,
    X,
} from 'lucide-react';

import { apiRequest } from '@/api/client';
import { fetchAssignments } from '@/dashboard/organization/helpRequests/helpRequestApi';

const initialForm = {
    type: 'local_case',
    help_request_id: '',
    title: '',
    description: '',
    category: '',
    scope: '',
    district: '',
    location: '',
    affected_areas: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    cover_image: null,
};

const CAMPAIGN_TYPES = [
    {
        value: 'local_case',
        label: 'Local case',
        description:
            'Create a campaign connected to a help request assigned to your organization.',
    },
    {
        value: 'organization_proposed',
        label: 'Organization proposed',
        description:
            'Propose a campaign based on your organization’s own initiative.',
    },
];

const CampaignCreateModal = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState(initialForm);
    const [assignments, setAssignments] = useState([]);
    const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHelpRequestOpen, setIsHelpRequestOpen] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!open) {
            return;
        }

        let cancelled = false;

        const loadAssignments = async () => {
            setIsLoadingAssignments(true);
            setError('');

            try {
                const response = await fetchAssignments();

                if (cancelled) {
                    return;
                }

                const items = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                      ? response.data
                      : Array.isArray(response?.assignments)
                        ? response.assignments
                        : [];

                const normalized = items.map((assignment) => {
                    const helpRequest =
                        assignment?.help_request ||
                        assignment?.helpRequest ||
                        null;

                    return {
                        assignmentId:
                            assignment?.id ?? assignment?.assignment_id ?? null,

                        status: String(assignment?.status || '')
                            .trim()
                            .toLowerCase(),

                        helpRequestId:
                            assignment?.help_request_id ??
                            helpRequest?.id ??
                            null,

                        helpRequest,

                        rawAssignment: assignment,
                    };
                });

                setAssignments(normalized);
            } catch (requestError) {
                if (!cancelled) {
                    setAssignments([]);
                    setError(
                        requestError?.message ||
                            'Unable to load eligible help requests.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingAssignments(false);
                }
            }
        };

        loadAssignments();

        return () => {
            cancelled = true;
        };
    }, [open]);

    const usableAssignments = useMemo(() => {
        return assignments.filter(
            (assignment) =>
                assignment.status === 'accepted' &&
                assignment.helpRequestId !== null &&
                assignment.helpRequestId !== undefined &&
                String(assignment.helpRequestId).trim() !== '',
        );
    }, [assignments]);

    const selectedAssignment = useMemo(() => {
        if (!form.help_request_id) {
            return null;
        }

        return (
            usableAssignments.find(
                (assignment) =>
                    String(assignment.helpRequestId) ===
                    String(form.help_request_id),
            ) || null
        );
    }, [form.help_request_id, usableAssignments]);

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        setForm(initialForm);
        setError('');
        setFieldErrors({});
        setIsHelpRequestOpen(false);

        onClose?.();
    };

    const handleFieldChange = (event) => {
        const { name, value, files } = event.target;

        setForm((current) => ({
            ...current,
            [name]: name === 'cover_image' ? files?.[0] || null : value,
        }));

        setFieldErrors((current) => {
            if (!current[name]) {
                return current;
            }

            const next = { ...current };
            delete next[name];
            return next;
        });

        if (error) {
            setError('');
        }
    };

    const handleTypeChange = (type) => {
        setForm((current) => ({
            ...current,
            type,
            help_request_id:
                type === 'local_case' ? current.help_request_id : '',
        }));

        setIsHelpRequestOpen(false);
        setError('');
        setFieldErrors({});
    };

    const handleHelpRequestSelect = (assignment) => {
        const helpRequest = assignment.helpRequest;

        setForm((current) => ({
            ...current,
            help_request_id: assignment.helpRequestId || '',
            title: current.title || helpRequest?.title || '',
            description: current.description || helpRequest?.description || '',
            category: current.category || helpRequest?.category || '',
            district: current.district || helpRequest?.district || '',
            location:
                current.location ||
                helpRequest?.location ||
                helpRequest?.address ||
                '',
        }));

        setIsHelpRequestOpen(false);

        setFieldErrors((current) => {
            if (!current.help_request_id) {
                return current;
            }

            const next = { ...current };
            delete next.help_request_id;
            return next;
        });

        setError('');
    };

    const validateForm = () => {
        const errors = {};

        if (!form.type) {
            errors.type = 'Campaign type is required.';
        }

        if (form.type === 'local_case' && !form.help_request_id) {
            errors.help_request_id = 'Please select an eligible help request.';
        }

        if (!form.title.trim()) {
            errors.title = 'Campaign title is required.';
        }

        if (!form.description.trim()) {
            errors.description = 'Campaign description is required.';
        }

        if (!form.category.trim()) {
            errors.category = 'Campaign category is required.';
        }

        if (!form.scope.trim()) {
            errors.scope = 'Campaign scope is required.';
        }

        if (!form.location.trim()) {
            errors.location = 'Campaign location is required.';
        }

        if (!form.target_amount) {
            errors.target_amount = 'Target amount is required.';
        } else if (Number(form.target_amount) <= 0) {
            errors.target_amount = 'Target amount must be greater than zero.';
        }

        if (!form.start_date) {
            errors.start_date = 'Start date is required.';
        }

        if (!form.end_date) {
            errors.end_date = 'End date is required.';
        }

        if (form.start_date && form.end_date) {
            const startDate = new Date(form.start_date);
            const endDate = new Date(form.end_date);

            if (endDate < startDate) {
                errors.end_date =
                    'End date cannot be earlier than the start date.';
            }
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setError('');

        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('type', form.type);
            formData.append('title', form.title.trim());
            formData.append('description', form.description.trim());
            formData.append('category', form.category.trim());
            formData.append('scope', form.scope.trim());
            formData.append('location', form.location.trim());
            formData.append('target_amount', String(form.target_amount));
            formData.append('start_date', form.start_date);
            formData.append('end_date', form.end_date);

            if (form.district.trim()) {
                formData.append('district', form.district.trim());
            }

            if (form.affected_areas.trim()) {
                formData.append('affected_areas', form.affected_areas.trim());
            }

            if (form.type === 'local_case' && form.help_request_id) {
                formData.append(
                    'help_request_id',
                    String(form.help_request_id),
                );
            }

            if (form.cover_image) {
                formData.append('cover_image', form.cover_image);
            }

            await apiRequest('/campaigns', {
                method: 'POST',
                body: formData,
            });

            setForm(initialForm);
            setError('');
            setFieldErrors({});
            setIsHelpRequestOpen(false);

            onCreated?.();
        } catch (requestError) {
            setError(requestError?.message || 'Unable to create the campaign.');

            setFieldErrors(requestError?.errors || {});
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-4 sm:px-6">
                    <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Target className="h-4.5 w-4.5" />
                            </span>

                            <div className="min-w-0">
                                <h2 className="truncate text-base font-bold text-text-primary">
                                    Create campaign
                                </h2>

                                <p className="mt-0.5 text-xs text-text-secondary">
                                    Submit a campaign for admin verification.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto"
                >
                    <div className="space-y-6 px-5 py-5 sm:px-6">
                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                                <p className="text-xs leading-5 text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <section className="space-y-3">
                            <div>
                                <h3 className="text-sm font-bold text-text-primary">
                                    Campaign type
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-text-secondary">
                                    Choose how this campaign is being created.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {CAMPAIGN_TYPES.map((type) => {
                                    const selected = form.type === type.value;

                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() =>
                                                handleTypeChange(type.value)
                                            }
                                            className={`rounded-xl border p-4 text-left transition-colors ${
                                                selected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border bg-white hover:border-primary/40 hover:bg-surface'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span
                                                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                                        selected
                                                            ? 'border-primary'
                                                            : 'border-gray-300'
                                                    }`}
                                                >
                                                    {selected && (
                                                        <span className="h-2 w-2 rounded-full bg-primary" />
                                                    )}
                                                </span>

                                                <div>
                                                    <p className="text-sm font-semibold text-text-primary">
                                                        {type.label}
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                                        {type.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {form.type === 'local_case' && (
                            <section className="space-y-3">
                                <div>
                                    <label className="text-sm font-bold text-text-primary">
                                        Help request
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                        Select a help request currently accepted
                                        by your organization.
                                    </p>
                                </div>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsHelpRequestOpen(
                                                (current) => !current,
                                            )
                                        }
                                        disabled={
                                            isLoadingAssignments || isSubmitting
                                        }
                                        className={`flex min-h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm transition-colors ${
                                            fieldErrors.help_request_id
                                                ? 'border-red-300'
                                                : 'border-border hover:border-primary/40'
                                        } disabled:cursor-not-allowed disabled:bg-surface`}
                                    >
                                        <span
                                            className={
                                                selectedAssignment
                                                    ? 'truncate text-text-primary'
                                                    : 'truncate text-text-secondary'
                                            }
                                        >
                                            {isLoadingAssignments
                                                ? 'Loading eligible help requests...'
                                                : selectedAssignment
                                                      ?.helpRequest?.title ||
                                                  'Select a help request'}
                                        </span>

                                        {isLoadingAssignments ? (
                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-text-secondary" />
                                        ) : (
                                            <ChevronDown
                                                className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${
                                                    isHelpRequestOpen
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        )}
                                    </button>

                                    {isHelpRequestOpen &&
                                        !isLoadingAssignments && (
                                            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-xl">
                                                {usableAssignments.length ===
                                                0 ? (
                                                    <div className="px-3 py-6 text-center">
                                                        <FileText className="mx-auto h-5 w-5 text-text-secondary" />

                                                        <p className="mt-2 text-xs font-medium text-text-primary">
                                                            No eligible help
                                                            requests
                                                        </p>

                                                        <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                                                            Only help requests
                                                            currently accepted
                                                            by your organization
                                                            can be connected to
                                                            a new local
                                                            campaign.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    usableAssignments.map(
                                                        (assignment) => (
                                                            <button
                                                                key={
                                                                    assignment.assignmentId ||
                                                                    assignment.helpRequestId
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleHelpRequestSelect(
                                                                        assignment,
                                                                    )
                                                                }
                                                                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface ${
                                                                    String(
                                                                        form.help_request_id,
                                                                    ) ===
                                                                    String(
                                                                        assignment.helpRequestId,
                                                                    )
                                                                        ? 'bg-primary/5'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-text-secondary">
                                                                    <FileText className="h-4 w-4" />
                                                                </span>

                                                                <span className="min-w-0">
                                                                    <span className="block truncate text-xs font-semibold text-text-primary">
                                                                        {assignment
                                                                            .helpRequest
                                                                            ?.title ||
                                                                            `Help request #${assignment.helpRequestId}`}
                                                                    </span>

                                                                    <span className="mt-0.5 block text-[11px] text-text-secondary">
                                                                        HR ID: #
                                                                        {
                                                                            assignment.helpRequestId
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </button>
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>

                                {fieldErrors.help_request_id && (
                                    <p className="text-xs text-red-600">
                                        {Array.isArray(
                                            fieldErrors.help_request_id,
                                        )
                                            ? fieldErrors.help_request_id[0]
                                            : fieldErrors.help_request_id}
                                    </p>
                                )}
                            </section>
                        )}

                        <section className="grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="campaign-title"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Campaign title
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="campaign-title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleFieldChange}
                                    placeholder="Enter campaign title"
                                    className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                        fieldErrors.title
                                            ? 'border-red-300'
                                            : 'border-border'
                                    }`}
                                />

                                {fieldErrors.title && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.title)
                                            ? fieldErrors.title[0]
                                            : fieldErrors.title}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="campaign-description"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Description
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <textarea
                                    id="campaign-description"
                                    name="description"
                                    rows={4}
                                    value={form.description}
                                    onChange={handleFieldChange}
                                    placeholder="Describe the campaign and the impact it aims to create"
                                    className={`mt-2 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm leading-6 text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                        fieldErrors.description
                                            ? 'border-red-300'
                                            : 'border-border'
                                    }`}
                                />

                                {fieldErrors.description && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.description)
                                            ? fieldErrors.description[0]
                                            : fieldErrors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-category"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Category
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="campaign-category"
                                    name="category"
                                    type="text"
                                    value={form.category}
                                    onChange={handleFieldChange}
                                    placeholder="e.g. Medical"
                                    className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                        fieldErrors.category
                                            ? 'border-red-300'
                                            : 'border-border'
                                    }`}
                                />

                                {fieldErrors.category && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.category)
                                            ? fieldErrors.category[0]
                                            : fieldErrors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-scope"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Scope
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="campaign-scope"
                                    name="scope"
                                    type="text"
                                    value={form.scope}
                                    onChange={handleFieldChange}
                                    placeholder="e.g. Local"
                                    className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                        fieldErrors.scope
                                            ? 'border-red-300'
                                            : 'border-border'
                                    }`}
                                />

                                {fieldErrors.scope && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.scope)
                                            ? fieldErrors.scope[0]
                                            : fieldErrors.scope}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-district"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    District
                                </label>

                                <input
                                    id="campaign-district"
                                    name="district"
                                    type="text"
                                    value={form.district}
                                    onChange={handleFieldChange}
                                    placeholder="Enter district"
                                    className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-location"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Location
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <div className="relative mt-2">
                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                                    <input
                                        id="campaign-location"
                                        name="location"
                                        type="text"
                                        value={form.location}
                                        onChange={handleFieldChange}
                                        placeholder="Enter location"
                                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                            fieldErrors.location
                                                ? 'border-red-300'
                                                : 'border-border'
                                        }`}
                                    />
                                </div>

                                {fieldErrors.location && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.location)
                                            ? fieldErrors.location[0]
                                            : fieldErrors.location}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="campaign-affected-areas"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Affected areas
                                </label>

                                <input
                                    id="campaign-affected-areas"
                                    name="affected_areas"
                                    type="text"
                                    value={form.affected_areas}
                                    onChange={handleFieldChange}
                                    placeholder="List affected areas"
                                    className="mt-2 h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-target"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Target amount
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <input
                                    id="campaign-target"
                                    name="target_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.target_amount}
                                    onChange={handleFieldChange}
                                    placeholder="0.00"
                                    className={`mt-2 h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                        fieldErrors.target_amount
                                            ? 'border-red-300'
                                            : 'border-border'
                                    }`}
                                />

                                {fieldErrors.target_amount && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(
                                            fieldErrors.target_amount,
                                        )
                                            ? fieldErrors.target_amount[0]
                                            : fieldErrors.target_amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-cover-image"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Cover image
                                </label>

                                <input
                                    id="campaign-cover-image"
                                    name="cover_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFieldChange}
                                    className="mt-2 block h-11 w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-text-primary"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-start-date"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Start date
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <div className="relative mt-2">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                                    <input
                                        id="campaign-start-date"
                                        name="start_date"
                                        type="date"
                                        value={form.start_date}
                                        onChange={handleFieldChange}
                                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                            fieldErrors.start_date
                                                ? 'border-red-300'
                                                : 'border-border'
                                        }`}
                                    />
                                </div>

                                {fieldErrors.start_date && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.start_date)
                                            ? fieldErrors.start_date[0]
                                            : fieldErrors.start_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-end-date"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    End date
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <div className="relative mt-2">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                                    <input
                                        id="campaign-end-date"
                                        name="end_date"
                                        type="date"
                                        value={form.end_date}
                                        onChange={handleFieldChange}
                                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 ${
                                            fieldErrors.end_date
                                                ? 'border-red-300'
                                                : 'border-border'
                                        }`}
                                    />
                                </div>

                                {fieldErrors.end_date && (
                                    <p className="mt-1.5 text-xs text-red-600">
                                        {Array.isArray(fieldErrors.end_date)
                                            ? fieldErrors.end_date[0]
                                            : fieldErrors.end_date}
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-3 border-t border-border bg-white px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="h-10 rounded-xl border border-border px-4 text-sm font-semibold text-text-primary transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {isSubmitting ? 'Creating...' : 'Create campaign'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignCreateModal;

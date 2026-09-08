import React, { useEffect, useMemo, useState } from 'react';

import {
    AlertCircle,
    CalendarDays,
    ChevronDown,
    FileText,
    ImagePlus,
    Loader2,
    MapPin,
    Search,
    X,
} from 'lucide-react';

import { apiRequest } from '@/api/client';
import { fetchAssignments } from '../../helpRequests/helpRequestApi';

const initialForm = {
    type: 'local_case',
    title: '',
    description: '',
    category: '',
    scope: '',
    district: '',
    location: '',
    target_amount: '',
    start_date: '',
    end_date: '',
    help_request_id: '',
    cover_image: null,
};

const getAssignmentStatus = (assignment) =>
    String(
        assignment?.status ??
            assignment?.assignment_status ??
            assignment?.assignmentStatus ??
            '',
    )
        .trim()
        .toLowerCase();

const getHelpRequestData = (assignment) => {
    const rawHelpRequest =
        assignment?.help_request ||
        assignment?.helpRequest ||
        assignment?.rawHelpRequest ||
        assignment?.request ||
        {};

    const id =
        rawHelpRequest?.id ??
        assignment?.help_request_id ??
        assignment?.helpRequestId ??
        assignment?.rawAssignment?.help_request_id ??
        assignment?.rawAssignment?.helpRequestId ??
        '';

    return {
        id,
        title:
            rawHelpRequest?.title ??
            assignment?.title ??
            assignment?.rawAssignment?.help_request?.title ??
            assignment?.rawAssignment?.helpRequest?.title ??
            '',
        description:
            rawHelpRequest?.description ?? assignment?.description ?? '',
        category: rawHelpRequest?.category ?? assignment?.category ?? '',
        district: rawHelpRequest?.district ?? assignment?.district ?? '',
        location: rawHelpRequest?.location ?? assignment?.location ?? '',
    };
};

const normalizeAssignments = (response) => {
    const source = Array.isArray(response)
        ? response
        : Array.isArray(response?.assignments)
          ? response.assignments
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.assignments)
              ? response.data.assignments
              : [];

    return source
        .map((assignment) => {
            const helpRequest = getHelpRequestData(assignment);

            return {
                assignmentId: assignment?.id ?? '',
                status: getAssignmentStatus(assignment),
                helpRequest,
                rawAssignment: assignment,
            };
        })
        .filter((assignment) => assignment.helpRequest.id);
};

const CampaignCreateModal = ({ open, onClose, onCreated }) => {
    const [form, setForm] = useState(initialForm);
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(false);
    const [assignmentsError, setAssignmentsError] = useState('');
    const [search, setSearch] = useState('');
    const [isHelpRequestOpen, setIsHelpRequestOpen] = useState(false);
    const [selectedHelpRequest, setSelectedHelpRequest] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        let cancelled = false;

        const loadAssignments = async () => {
            setLoadingAssignments(true);
            setAssignmentsError('');

            try {
                const response = await fetchAssignments();

                if (cancelled) {
                    return;
                }

                setAssignments(normalizeAssignments(response));
            } catch (error) {
                if (!cancelled) {
                    setAssignments([]);
                    setAssignmentsError(
                        error?.message ||
                            'Unable to load connected help requests.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingAssignments(false);
                }
            }
        };

        loadAssignments();

        return () => {
            cancelled = true;
        };
    }, [open]);

    const usableAssignments = useMemo(() => {
        return assignments.filter((assignment) =>
            ['accepted'].includes(assignment.status),
        );
    }, [assignments]);

    const filteredHelpRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return usableAssignments;
        }

        return usableAssignments.filter((assignment) => {
            const helpRequest = assignment.helpRequest;

            return [
                helpRequest.title,
                helpRequest.id,
                helpRequest.category,
                helpRequest.district,
                helpRequest.location,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query);
        });
    }, [search, usableAssignments]);

    const resetForm = () => {
        setForm(initialForm);
        setSearch('');
        setIsHelpRequestOpen(false);
        setSelectedHelpRequest(null);
        setErrors({});
        setSubmitError('');
    };

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        resetForm();
        onClose?.();
    };

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: '',
        }));

        setSubmitError('');
    };

    const handleHelpRequestSelect = (assignment) => {
        const helpRequest = assignment.helpRequest;

        setSelectedHelpRequest(helpRequest);

        setForm((current) => ({
            ...current,
            help_request_id: helpRequest.id,
            description: helpRequest.description || '',
            category: helpRequest.category || '',
            district: helpRequest.district || '',
            location: helpRequest.location || '',
        }));

        setSearch('');
        setIsHelpRequestOpen(false);

        setErrors((current) => ({
            ...current,
            help_request_id: '',
        }));

        setSubmitError('');
    };

    const handleChangeHelpRequest = () => {
        setSelectedHelpRequest(null);

        setForm((current) => ({
            ...current,
            help_request_id: '',
            description: '',
            category: '',
            district: '',
            location: '',
        }));

        setSearch('');
        setIsHelpRequestOpen(true);
    };

    const handleCoverImageChange = (event) => {
        const file = event.target.files?.[0] || null;

        updateField('cover_image', file);
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.help_request_id) {
            nextErrors.help_request_id =
                'Please select a connected help request.';
        }

        if (!form.title.trim()) {
            nextErrors.title = 'Campaign title is required.';
        }

        if (!form.target_amount) {
            nextErrors.target_amount = 'Target amount is required.';
        } else if (Number(form.target_amount) <= 0) {
            nextErrors.target_amount = 'Target amount must be greater than 0.';
        }

        if (!form.start_date) {
            nextErrors.start_date = 'Start date is required.';
        }

        if (!form.end_date) {
            nextErrors.end_date = 'End date is required.';
        }

        if (
            form.start_date &&
            form.end_date &&
            form.end_date < form.start_date
        ) {
            nextErrors.end_date = 'End date must be after the start date.';
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const formData = new FormData();

            formData.append('type', 'local_case');
            formData.append('title', form.title.trim());
            formData.append('description', form.description.trim());
            formData.append('category', form.category);
            formData.append('district', form.district);
            formData.append('location', form.location);
            formData.append('target_amount', String(form.target_amount));
            formData.append('start_date', form.start_date);
            formData.append('end_date', form.end_date);
            formData.append('help_request_id', String(form.help_request_id));

            if (form.cover_image) {
                formData.append('cover_image', form.cover_image);
            }

            const data = await apiRequest('/campaigns', {
                method: 'POST',
                body: formData,
            });

            onCreated?.(data);

            resetForm();
            onClose?.();
        } catch (error) {
            setSubmitError(error?.message || 'Failed to create campaign.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={handleClose}
            />

            <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold tracking-tight text-text-primary">
                            Create campaign
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Create a campaign connected to one of your accepted
                            help requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-slate-100 hover:text-text-primary"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto"
                >
                    <div className="space-y-6 px-6 py-6">
                        {submitError && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                                <p className="text-xs leading-5 text-red-700">
                                    {submitError}
                                </p>
                            </div>
                        )}

                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-text-primary">
                                    Connected help request
                                </h3>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Select the help request this campaign will
                                    support.
                                </p>
                            </div>

                            <div className="relative">
                                {selectedHelpRequest ? (
                                    <div className="rounded-xl border border-border bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
                                                    <FileText className="h-4 w-4 text-text-secondary" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-text-primary">
                                                        {
                                                            selectedHelpRequest.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        HR ID: #
                                                        {selectedHelpRequest.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleChangeHelpRequest
                                                }
                                                className="shrink-0 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-3">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                                    Category
                                                </p>

                                                <p className="mt-1 truncate text-xs font-medium text-text-primary">
                                                    {selectedHelpRequest.category ||
                                                        'Not specified'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                                    District
                                                </p>

                                                <p className="mt-1 truncate text-xs font-medium text-text-primary">
                                                    {selectedHelpRequest.district ||
                                                        'Not specified'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                                                    Location
                                                </p>

                                                <p className="mt-1 truncate text-xs font-medium text-text-primary">
                                                    {selectedHelpRequest.location ||
                                                        'Not specified'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className={`flex h-11 items-center rounded-xl border bg-white transition-colors ${
                                                errors.help_request_id
                                                    ? 'border-red-300'
                                                    : 'border-border focus-within:border-primary'
                                            }`}
                                        >
                                            <Search className="ml-3 h-4 w-4 shrink-0 text-text-muted" />

                                            <input
                                                type="text"
                                                value={search}
                                                onFocus={() =>
                                                    setIsHelpRequestOpen(true)
                                                }
                                                onChange={(event) => {
                                                    setSearch(
                                                        event.target.value,
                                                    );
                                                    setIsHelpRequestOpen(true);
                                                }}
                                                placeholder={
                                                    loadingAssignments
                                                        ? 'Loading help requests...'
                                                        : 'Search help requests...'
                                                }
                                                disabled={loadingAssignments}
                                                className="min-w-0 flex-1 bg-transparent px-3 text-xs text-text-primary outline-none placeholder:text-text-muted disabled:cursor-not-allowed"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsHelpRequestOpen(
                                                        (current) => !current,
                                                    )
                                                }
                                                disabled={loadingAssignments}
                                                className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary disabled:cursor-not-allowed"
                                            >
                                                {loadingAssignments ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-transform ${
                                                            isHelpRequestOpen
                                                                ? 'rotate-180'
                                                                : ''
                                                        }`}
                                                    />
                                                )}
                                            </button>
                                        </div>

                                        {isHelpRequestOpen && (
                                            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-72 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-xl">
                                                {assignmentsError ? (
                                                    <div className="px-3 py-4 text-center text-xs text-red-600">
                                                        {assignmentsError}
                                                    </div>
                                                ) : loadingAssignments ? (
                                                    <div className="flex items-center justify-center gap-2 px-3 py-6 text-xs text-text-secondary">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Loading help requests...
                                                    </div>
                                                ) : filteredHelpRequests.length ===
                                                  0 ? (
                                                    <div className="px-3 py-6 text-center text-xs text-text-secondary">
                                                        No connected help
                                                        requests found.
                                                    </div>
                                                ) : (
                                                    filteredHelpRequests.map(
                                                        (assignment) => {
                                                            const helpRequest =
                                                                assignment.helpRequest;

                                                            return (
                                                                <button
                                                                    key={`${assignment.assignmentId}-${helpRequest.id}`}
                                                                    type="button"
                                                                    onMouseDown={(
                                                                        event,
                                                                    ) =>
                                                                        event.preventDefault()
                                                                    }
                                                                    onClick={() =>
                                                                        handleHelpRequestSelect(
                                                                            assignment,
                                                                        )
                                                                    }
                                                                    className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-slate-50"
                                                                >
                                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
                                                                        <FileText className="h-4 w-4 text-text-secondary" />
                                                                    </div>

                                                                    <div className="min-w-0">
                                                                        <p className="truncate text-xs font-semibold text-text-primary">
                                                                            {
                                                                                helpRequest.title
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-[11px] text-text-secondary">
                                                                            HR
                                                                            ID:
                                                                            #
                                                                            {
                                                                                helpRequest.id
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        },
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {errors.help_request_id && (
                                    <p className="mt-1.5 text-[11px] text-red-600">
                                        {errors.help_request_id}
                                    </p>
                                )}
                            </div>
                        </section>

                        <div className="h-px bg-border" />

                        <section className="space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-text-primary">
                                    Campaign details
                                </h3>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Add the campaign-specific information.
                                </p>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                    Campaign title
                                </label>

                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(event) =>
                                        updateField('title', event.target.value)
                                    }
                                    placeholder="Enter campaign title"
                                    className={`h-11 w-full rounded-xl border bg-white px-3 text-xs text-text-primary outline-none transition-colors placeholder:text-text-muted ${
                                        errors.title
                                            ? 'border-red-300 focus:border-red-400'
                                            : 'border-border focus:border-primary'
                                    }`}
                                />

                                {errors.title && (
                                    <p className="mt-1.5 text-[11px] text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                    Description
                                </label>

                                <textarea
                                    value={form.description}
                                    readOnly
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-border bg-slate-50 px-3 py-3 text-xs leading-5 text-text-secondary outline-none"
                                />

                                <p className="mt-1.5 text-[10px] text-text-muted">
                                    This description comes from the connected
                                    help request.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        value={form.category}
                                        readOnly
                                        placeholder="Selected from help request"
                                        className="h-11 w-full rounded-xl border border-border bg-slate-50 px-3 text-xs text-text-secondary outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        District
                                    </label>

                                    <input
                                        type="text"
                                        value={form.district}
                                        readOnly
                                        placeholder="Selected from help request"
                                        className="h-11 w-full rounded-xl border border-border bg-slate-50 px-3 text-xs text-text-secondary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                    Location
                                </label>

                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                                    <input
                                        type="text"
                                        value={form.location}
                                        readOnly
                                        placeholder="Selected from help request"
                                        className="h-11 w-full rounded-xl border border-border bg-slate-50 pl-9 pr-3 text-xs text-text-secondary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                    Target amount
                                </label>

                                <input
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
                                    placeholder="Enter target amount"
                                    className={`h-11 w-full rounded-xl border bg-white px-3 text-xs text-text-primary outline-none transition-colors placeholder:text-text-muted ${
                                        errors.target_amount
                                            ? 'border-red-300 focus:border-red-400'
                                            : 'border-border focus:border-primary'
                                    }`}
                                />

                                {errors.target_amount && (
                                    <p className="mt-1.5 text-[11px] text-red-600">
                                        {errors.target_amount}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        Start date
                                    </label>

                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                                        <input
                                            type="date"
                                            value={form.start_date}
                                            onChange={(event) =>
                                                updateField(
                                                    'start_date',
                                                    event.target.value,
                                                )
                                            }
                                            className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-text-primary outline-none transition-colors ${
                                                errors.start_date
                                                    ? 'border-red-300 focus:border-red-400'
                                                    : 'border-border focus:border-primary'
                                            }`}
                                        />
                                    </div>

                                    {errors.start_date && (
                                        <p className="mt-1.5 text-[11px] text-red-600">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                        End date
                                    </label>

                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                                        <input
                                            type="date"
                                            value={form.end_date}
                                            onChange={(event) =>
                                                updateField(
                                                    'end_date',
                                                    event.target.value,
                                                )
                                            }
                                            className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-xs text-text-primary outline-none transition-colors ${
                                                errors.end_date
                                                    ? 'border-red-300 focus:border-red-400'
                                                    : 'border-border focus:border-primary'
                                            }`}
                                        />
                                    </div>

                                    {errors.end_date && (
                                        <p className="mt-1.5 text-[11px] text-red-600">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                                    Cover image
                                </label>

                                <label className="flex min-h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 px-4 transition-colors hover:border-primary hover:bg-slate-100">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                        className="hidden"
                                    />

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white">
                                            <ImagePlus className="h-4 w-4 text-text-secondary" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-text-primary">
                                                {form.cover_image
                                                    ? form.cover_image.name
                                                    : 'Upload cover image'}
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-text-muted">
                                                PNG, JPG or JPEG
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-3 border-t border-border bg-white px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="h-10 rounded-xl border border-border px-4 text-xs font-semibold text-text-secondary transition-colors hover:bg-slate-50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
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

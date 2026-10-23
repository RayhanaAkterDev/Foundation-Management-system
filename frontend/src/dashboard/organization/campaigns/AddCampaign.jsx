import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CalendarDays,
    FileText,
    ImagePlus,
    MapPin,
    Megaphone,
    Target,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import { apiRequest } from '@/api/client';
import { fetchAssignments } from '@/dashboard/organization/helpRequests/api/helpRequestApi';

const BASE = '/organization/dashboard/campaigns';
const CATEGORIES = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];
const EMPTY = {
    type: 'local_case',
    title: '',
    description: '',
    category: '',
    district: '',
    location: '',
    affected_areas: '',
    target_amount: '',
    start_date: '',
    duration_type: 'fixed',
    end_date: '',
    cover_image: null,
    help_request_id: '',
};
const SELECT =
    'mt-2 h-11 w-full min-w-0 border border-[#343E4B] bg-[#151C25] px-3.5 text-sm text-[#EEF1F5] outline-none focus:border-[#71849A] scheme-dark';
const LABEL = 'block text-[13px] font-medium text-[#B8C5D3]';
const HEADING = 'm-0! font-sans! text-[15px]! font-semibold! text-[#EEF1F5]!';

function PreviewImage({ file }) {
    const imageRef = useRef(null);
    useEffect(() => {
        if (!(file instanceof File)) return undefined;
        const url = URL.createObjectURL(file);
        if (imageRef.current) imageRef.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [file]);
    return file instanceof File ? (
        <img
            ref={imageRef}
            alt="Campaign cover"
            className="h-full w-full object-cover"
        />
    ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#8792A1]">
            <ImagePlus size={28} />
            <span className="text-xs">Cover image preview</span>
        </div>
    );
}

function PreviewItem({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-3 border-b border-[#303A47] py-4 last:border-0">
            <Icon size={16} className="mt-0.5 shrink-0 text-[#9BA9B9]" />
            <div className="min-w-0">
                <p className="m-0! text-xs text-[#91A0B0]">{label}</p>
                <p className="mt-1 mb-0! wrap-break-word text-[13px] font-medium text-[#E4EAF1]">
                    {value || 'Not set'}
                </p>
            </div>
        </div>
    );
}

function FieldError({ errors, name }) {
    const value = errors?.[name];
    if (!value) return null;
    return (
        <p role="alert" className="mt-1.5 text-xs text-[#F0A6B0]">
            {Array.isArray(value) ? value[0] : String(value)}
        </p>
    );
}

function RadioChoice({ checked, title, description, onClick, disabled }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={onClick}
            className={`flex min-h-19 items-start gap-3 border px-4 py-3.5 text-left transition-colors disabled:opacity-50 ${checked ? 'border-[#8397AC] bg-[#253343]' : 'border-[#343E4B] bg-[#151C25] hover:bg-[#1E2834]'}`}
        >
            <span
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${checked ? 'border-[#B8C7D8]' : 'border-[#778697]'}`}
            >
                {checked && (
                    <span className="size-2 rounded-full bg-[#B8C7D8]" />
                )}
            </span>
            <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-[#EEF1F5]">
                    {title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#A2AFBE]">
                    {description}
                </span>
            </span>
        </button>
    );
}

function fromRequest(id, request) {
    return {
        ...EMPTY,
        help_request_id: String(id ?? ''),
        title: request?.title || '',
        description: request?.description || '',
        category: request?.category || '',
        district: request?.district || '',
        location: request?.location || request?.address || '',
    };
}

export default function AddCampaign() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialId = location.state?.helpRequestId ?? null;
    const [form, setForm] = useState(() =>
        initialId == null ? { ...EMPTY } : fromRequest(initialId),
    );
    const [assignments, setAssignments] = useState([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [assignmentError, setAssignmentError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                const response = await fetchAssignments();
                if (!active) return;
                const items = Array.isArray(response)
                    ? response
                    : Array.isArray(response?.data)
                      ? response.data
                      : Array.isArray(response?.assignments)
                        ? response.assignments
                        : [];
                const normalized = items.map((item) => ({
                    assignmentId: item?.id ?? item?.assignment_id,
                    status: String(item?.status || '')
                        .trim()
                        .toLowerCase(),
                    helpRequest:
                        item?.help_request || item?.helpRequest || null,
                    helpRequestId:
                        item?.help_request_id ??
                        item?.help_request?.id ??
                        item?.helpRequest?.id ??
                        null,
                }));
                setAssignments(normalized);
                setAssignmentError('');
                if (initialId != null) {
                    const selected = normalized.find(
                        (item) =>
                            String(item.helpRequestId) === String(initialId),
                    );
                    setForm((current) =>
                        current.help_request_id === String(initialId) &&
                        !current.title
                            ? fromRequest(initialId, selected?.helpRequest)
                            : current,
                    );
                }
            } catch (error) {
                if (active)
                    setAssignmentError(
                        error?.message ||
                            'Unable to load eligible help requests.',
                    );
            } finally {
                if (active) setLoadingAssignments(false);
            }
        }
        load();
        return () => {
            active = false;
        };
    }, [initialId, reloadKey]);

    const eligible = useMemo(
        () =>
            assignments.filter(
                (item) =>
                    item.status === 'accepted' &&
                    String(item.helpRequest?.status || '').toLowerCase() ===
                        'verified' &&
                    item.helpRequestId != null &&
                    !item.helpRequest?.campaign_id &&
                    !item.helpRequest?.campaignId &&
                    !item.helpRequest?.campaign,
            ),
        [assignments],
    );
    const update = (name, value) => {
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: undefined }));
        setSubmitError('');
    };
    const change = (event) => {
        const { name, value, files } = event.target;
        update(name, name === 'cover_image' ? files?.[0] || null : value);
    };
    const chooseRequest = (id) => {
        const item = assignments.find(
            (entry) => String(entry.helpRequestId) === String(id),
        );
        setForm(fromRequest(id, item?.helpRequest));
        setErrors({});
        setSubmitError('');
    };
    const chooseType = (type) => {
        if (form.type === type) return;
        setForm({ ...EMPTY, type });
        setErrors({});
        setSubmitError('');
    };
    const validate = () => {
        const next = {};
        if (form.type === 'local_case' && !form.help_request_id)
            next.help_request_id = 'Select an eligible help request.';
        for (const key of [
            'title',
            'description',
            'category',
            'location',
            'start_date',
        ])
            if (!String(form[key] || '').trim())
                next[key] = `${key.replaceAll('_', ' ')} is required.`;
        if (
            !Number.isFinite(Number(form.target_amount)) ||
            Number(form.target_amount) <= 0
        )
            next.target_amount = 'Enter an amount greater than zero.';
        if (form.duration_type === 'fixed') {
            if (!form.end_date) next.end_date = 'End date is required.';
            else if (form.start_date && form.end_date < form.start_date)
                next.end_date = 'End date cannot be earlier than start date.';
        }
        return next;
    };
    const submit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const body = new FormData();
            for (const key of [
                'type',
                'title',
                'description',
                'category',
                'district',
                'location',
                'affected_areas',
                'target_amount',
                'start_date',
            ]) {
                const value = String(form[key] || '').trim();
                if (
                    value ||
                    [
                        'type',
                        'title',
                        'description',
                        'category',
                        'target_amount',
                        'start_date',
                    ].includes(key)
                )
                    body.append(key, value);
            }
            body.append(
                'end_date',
                form.duration_type === 'fixed' ? form.end_date : '',
            );
            if (form.type === 'local_case' && form.help_request_id)
                body.append('help_request_id', String(form.help_request_id));
            if (form.cover_image instanceof File)
                body.append('cover_image', form.cover_image);
            await apiRequest('/campaigns', { method: 'POST', body });
            setSuccess(true);
        } catch (error) {
            setSubmitError(error?.message || 'Unable to create campaign.');
            setErrors(error?.errors || {});
        } finally {
            setSubmitting(false);
        }
    };
    const field = (name, label, props = {}) => {
        const { wrapperClass, ...inputProps } = props;
        return (
            <div className={wrapperClass || ''}>
                <DashboardInput
                    id={`org-${name}`}
                    name={name}
                    label={label}
                    value={form[name]}
                    onChange={change}
                    disabled={submitting}
                    invalid={Boolean(errors[name])}
                    {...inputProps}
                />
                <FieldError errors={errors} name={name} />
            </div>
        );
    };
    const amount = Number(form.target_amount);
    const schedule =
        form.duration_type === 'open'
            ? 'Open-ended'
            : form.start_date || form.end_date
              ? `${form.start_date || 'Start not set'} → ${form.end_date || 'End not set'}`
              : 'Dates not set';

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Add campaign"
                subtitle="Create a fundraising campaign for your organization."
                action={
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => navigate(BASE)}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-xs font-medium text-[#C4CDD8] hover:bg-[#202A35] disabled:opacity-50"
                    >
                        <ArrowLeft size={15} />
                        All campaigns
                    </button>
                }
            />
            <div className="grid min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] lg:h-185 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
                <aside className="min-w-0 border-b border-[#303A47] bg-[#19222D] lg:overflow-y-auto lg:border-r lg:border-b-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="px-5 py-6 sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center border border-[#3B4857] bg-[#253242] text-[#C1CDD8]">
                                <Megaphone size={17} />
                            </span>
                            <div>
                                <h2 className={HEADING}>Campaign preview</h2>
                                <p className="mt-1 mb-0! text-xs text-[#91A0B0]">
                                    Live information preview
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 aspect-video overflow-hidden border border-[#465363] bg-[#111821]">
                            <PreviewImage file={form.cover_image} />
                        </div>
                        <p className="mt-5 mb-0! text-[11px] font-semibold uppercase tracking-wider text-[#91A0B0]">
                            {form.type === 'local_case'
                                ? 'Local case'
                                : 'Organization proposed'}
                        </p>
                        <h3 className="mt-2 mb-0! wrap-break-word font-sans! text-[18px]! font-semibold! leading-snug text-[#EEF1F5]!">
                            {form.title.trim() || 'Your campaign title'}
                        </h3>
                        <p className="mt-2 mb-0! text-[13px] text-[#AAB8C7]">
                            {form.category || 'Category not selected'}
                        </p>
                        <div className="mt-5 border-t border-[#34404D]">
                            <PreviewItem
                                icon={MapPin}
                                label="Location"
                                value={form.location}
                            />
                            <PreviewItem
                                icon={Target}
                                label="Funding target"
                                value={
                                    Number.isFinite(amount) && amount > 0
                                        ? `৳${amount.toLocaleString('en-BD')}`
                                        : 'Not set'
                                }
                            />
                            <PreviewItem
                                icon={CalendarDays}
                                label="Campaign schedule"
                                value={schedule}
                            />
                            {form.type === 'local_case' && (
                                <PreviewItem
                                    icon={FileText}
                                    label="Connected help request"
                                    value={
                                        form.help_request_id
                                            ? `#${form.help_request_id}`
                                            : 'Not selected'
                                    }
                                />
                            )}
                        </div>
                    </div>
                </aside>
                <main className="flex min-h-0 min-w-0 flex-col">
                    <form
                        onSubmit={submit}
                        noValidate
                        className="flex min-h-0 flex-1 flex-col"
                    >
                        <div className="min-h-0 flex-1 lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="border-b border-[#303A47] bg-[#151C25] px-5 py-5 sm:px-7">
                                <h2 className="m-0! font-sans! text-[16px]! font-semibold! text-[#EEF1F5]!">
                                    Campaign information
                                </h2>
                                <p className="mt-1 mb-0! text-xs text-[#91A0B0]">
                                    Complete the details to submit your
                                    proposal.
                                </p>
                            </div>
                            <div className="space-y-8 px-5 py-7 sm:px-7">
                                {submitError && (
                                    <LoadingError
                                        title="Unable to create campaign"
                                        message={submitError}
                                    />
                                )}
                                <section>
                                    <h3 className={HEADING}>Campaign source</h3>
                                    <div
                                        role="radiogroup"
                                        aria-label="Campaign source"
                                        className="mt-4 grid gap-3 sm:grid-cols-2"
                                    >
                                        <RadioChoice
                                            checked={form.type === 'local_case'}
                                            title="Local case"
                                            description="Connect an accepted help request."
                                            disabled={submitting}
                                            onClick={() =>
                                                chooseType('local_case')
                                            }
                                        />
                                        <RadioChoice
                                            checked={
                                                form.type ===
                                                'organization_proposed'
                                            }
                                            title="Organization proposed"
                                            description="Create your own fundraising initiative."
                                            disabled={submitting}
                                            onClick={() =>
                                                chooseType(
                                                    'organization_proposed',
                                                )
                                            }
                                        />
                                    </div>
                                </section>
                                {form.type === 'local_case' && (
                                    <section className="border-t border-[#303A47] pt-7">
                                        <h3 className={HEADING}>
                                            Connect a help request
                                        </h3>
                                        <p className="mt-1 mb-4 text-xs text-[#91A0B0]">
                                            Choose a verified request accepted
                                            by your organization.
                                        </p>
                                        {loadingAssignments ? (
                                            <LoadingUI
                                                variant="section"
                                                title="Loading eligible help requests..."
                                            />
                                        ) : assignmentError ? (
                                            <div className="space-y-3">
                                                <LoadingError
                                                    title="Unable to load help requests"
                                                    message={assignmentError}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLoadingAssignments(
                                                            true,
                                                        );
                                                        setAssignmentError('');
                                                        setReloadKey(
                                                            (key) => key + 1,
                                                        );
                                                    }}
                                                    className="border border-[#343E4B] px-4 py-2 text-xs text-[#EEF1F5] hover:bg-[#202A35]"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <label
                                                    htmlFor="org-help-request"
                                                    className={LABEL}
                                                >
                                                    Help request *
                                                </label>
                                                <select
                                                    id="org-help-request"
                                                    value={form.help_request_id}
                                                    disabled={submitting}
                                                    onChange={(event) =>
                                                        chooseRequest(
                                                            event.target.value,
                                                        )
                                                    }
                                                    aria-invalid={Boolean(
                                                        errors.help_request_id,
                                                    )}
                                                    className={SELECT}
                                                >
                                                    <option value="">
                                                        Select a help request
                                                    </option>
                                                    {eligible.map((item) => (
                                                        <option
                                                            key={
                                                                item.assignmentId ??
                                                                item.helpRequestId
                                                            }
                                                            value={String(
                                                                item.helpRequestId,
                                                            )}
                                                        >
                                                            {item.helpRequest
                                                                ?.title ||
                                                                `Help request #${item.helpRequestId}`}
                                                        </option>
                                                    ))}
                                                    {form.help_request_id &&
                                                        !eligible.some(
                                                            (item) =>
                                                                String(
                                                                    item.helpRequestId,
                                                                ) ===
                                                                String(
                                                                    form.help_request_id,
                                                                ),
                                                        ) && (
                                                            <option
                                                                value={
                                                                    form.help_request_id
                                                                }
                                                            >
                                                                Help request #
                                                                {
                                                                    form.help_request_id
                                                                }{' '}
                                                                (preselected)
                                                            </option>
                                                        )}
                                                </select>
                                                <FieldError
                                                    errors={errors}
                                                    name="help_request_id"
                                                />
                                                {!eligible.length && (
                                                    <p className="mt-3 text-xs text-[#91A0B0]">
                                                        No eligible help
                                                        requests are currently
                                                        available.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </section>
                                )}
                                <section className="border-t border-[#303A47] pt-7">
                                    <h3 className={HEADING}>
                                        Campaign details
                                    </h3>
                                    <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                        {field('title', 'Campaign title', {
                                            requiredMark: true,
                                            placeholder:
                                                'Give your campaign a clear title',
                                            wrapperClass: 'sm:col-span-2',
                                        })}
                                        {field('description', 'Description', {
                                            as: 'textarea',
                                            rows: 5,
                                            requiredMark: true,
                                            placeholder:
                                                'Describe the need and expected impact',
                                            wrapperClass: 'sm:col-span-2',
                                        })}
                                        <div>
                                            <label
                                                htmlFor="org-category"
                                                className={LABEL}
                                            >
                                                Category *
                                            </label>
                                            <select
                                                id="org-category"
                                                name="category"
                                                value={form.category}
                                                onChange={change}
                                                disabled={submitting}
                                                aria-invalid={Boolean(
                                                    errors.category,
                                                )}
                                                className={SELECT}
                                            >
                                                <option value="">
                                                    Select category
                                                </option>
                                                {CATEGORIES.map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
                                                    >
                                                        {item}
                                                    </option>
                                                ))}
                                            </select>
                                            <FieldError
                                                errors={errors}
                                                name="category"
                                            />
                                        </div>
                                        {field('district', 'District', {
                                            placeholder: 'District',
                                        })}
                                        {field('location', 'Location', {
                                            requiredMark: true,
                                            leftIcon: MapPin,
                                            placeholder: 'Campaign location',
                                        })}
                                        {field(
                                            'affected_areas',
                                            'Affected areas',
                                            { placeholder: 'Affected areas' },
                                        )}
                                    </div>
                                </section>
                                <section className="border-t border-[#303A47] pt-7">
                                    <h3 className={HEADING}>
                                        Funding & timeline
                                    </h3>
                                    <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                        {field(
                                            'target_amount',
                                            'Target amount (৳)',
                                            {
                                                type: 'number',
                                                min: '0',
                                                step: '0.01',
                                                requiredMark: true,
                                                placeholder: '0.00',
                                            },
                                        )}
                                        <div>
                                            <label
                                                htmlFor="org-cover"
                                                className={LABEL}
                                            >
                                                Cover image
                                            </label>
                                            <input
                                                id="org-cover"
                                                name="cover_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={change}
                                                disabled={submitting}
                                                className="mt-2 block h-11 w-full min-w-0 border border-[#343E4B] bg-[#151C25] px-2 py-2 text-xs text-[#AAB3BF] file:mr-3 file:border-0 file:bg-[#253242] file:px-3 file:py-1 file:text-xs file:text-[#EEF1F5]"
                                            />
                                            <FieldError
                                                errors={errors}
                                                name="cover_image"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <p className={LABEL}>
                                                Campaign duration
                                            </p>
                                            <div
                                                role="radiogroup"
                                                aria-label="Campaign duration"
                                                className="mt-2 grid gap-3 sm:grid-cols-2"
                                            >
                                                <RadioChoice
                                                    checked={
                                                        form.duration_type ===
                                                        'fixed'
                                                    }
                                                    title="Set an end date"
                                                    description="Close fundraising on a planned date."
                                                    disabled={submitting}
                                                    onClick={() =>
                                                        update(
                                                            'duration_type',
                                                            'fixed',
                                                        )
                                                    }
                                                />
                                                <RadioChoice
                                                    checked={
                                                        form.duration_type ===
                                                        'open'
                                                    }
                                                    title="Open-ended"
                                                    description="Continue until the campaign is closed."
                                                    disabled={submitting}
                                                    onClick={() => {
                                                        setForm((current) => ({
                                                            ...current,
                                                            duration_type:
                                                                'open',
                                                            end_date: '',
                                                        }));
                                                        setErrors(
                                                            (current) => ({
                                                                ...current,
                                                                end_date:
                                                                    undefined,
                                                            }),
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {field('start_date', 'Start date', {
                                            type: 'date',
                                            requiredMark: true,
                                            className: 'scheme-dark',
                                        })}
                                        {form.duration_type === 'fixed' &&
                                            field('end_date', 'End date', {
                                                type: 'date',
                                                min:
                                                    form.start_date ||
                                                    undefined,
                                                requiredMark: true,
                                                className: 'scheme-dark',
                                            })}
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-[#303A47] bg-[#151C25] px-5 py-4 sm:px-7">
                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() => navigate(BASE)}
                                className="h-10 border border-[#343E4B] px-4 text-xs font-medium text-[#C4CDD8] hover:bg-[#202A35] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    (form.type === 'local_case' &&
                                        loadingAssignments)
                                }
                                className="inline-flex min-h-10 min-w-35 items-center justify-center border border-[#46576A] bg-[#253242] px-5 text-xs font-semibold text-[#EEF1F5] hover:bg-[#304154] disabled:opacity-60"
                            >
                                {submitting ? (
                                    <LoadingUI
                                        variant="button"
                                        title="Creating campaign..."
                                    />
                                ) : (
                                    'Create campaign'
                                )}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <SuccessDialog
                open={success}
                title="Campaign created"
                message="Campaign created successfully."
                onClose={() => {
                    setSuccess(false);
                    navigate(BASE, { replace: true });
                }}
            />
        </div>
    );
}

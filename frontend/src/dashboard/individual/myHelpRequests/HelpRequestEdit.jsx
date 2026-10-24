import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    AlertCircle,
    FileText,
    ClipboardList,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { getMyHelpRequests, updateHelpRequest } from './api/helpRequestAPI';

import { normalizeHelpRequests } from './utils/helpRequestUtils';

const BASE = '/individual/dashboard/help-requests';

const fields = [
    'title',
    'description',
    'category',
    'district',
    'address',
    'urgency',
];

const categories = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

const urgencies = ['low', 'normal', 'high', 'critical'];

const getForm = (request) =>
    Object.fromEntries(
        fields.map((field) => [
            field,
            request?.[field] ?? (field === 'urgency' ? 'normal' : ''),
        ]),
    );

const control =
    'w-full min-w-0 border border-[#35404E] bg-[#0E1219] px-3.5 py-3 text-[13px] text-[#EEF1F5] outline-none placeholder:text-[#697586] focus:border-[#718096] disabled:opacity-50';

const inputControl =
    'w-full min-w-0 border-0 bg-transparent px-3.5 py-3 text-[13px] text-[#EEF1F5] outline-none placeholder:text-[#697586] focus:outline-none disabled:opacity-50';

function Field({ name, label, children, error, wrapped = false }) {
    const errorMessage = Array.isArray(error) ? error[0] : error;

    return (
        <div className="space-y-2">
            <label
                htmlFor={`help-edit-${name}`}
                className="block text-[13px] font-medium text-[#C3CFDD]"
            >
                {label}
            </label>

            {wrapped ? (
                <div
                    className={`border bg-[#151B23] transition-colors focus-within:border-[#637489] ${
                        error ? 'border-[#86545E]' : 'border-[#35404E]'
                    }`}
                >
                    {children}
                </div>
            ) : (
                children
            )}

            {errorMessage && (
                <p className="text-[12px] text-red-400">{errorMessage}</p>
            )}
        </div>
    );
}

function EditForm({
    request,
    form,
    errors,
    submitError,
    submitting,
    onChange,
    onSave,
    onCancel,
}) {
    return (
        <form
            onSubmit={onSave}
            className="w-full border border-[#303A47] bg-[#1A212B]"
        >
            <div className="border-b border-[#303A47] bg-[#202A36] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center border border-[#354456] bg-[#293747] text-[#B9C8D9]">
                        <FileText size={17} />
                    </span>

                    <div>
                        <h2 className="text-[17px] font-semibold! text-[#EEF1F5]!">
                            Request information
                        </h2>

                        <p className="mt-1.5 text-[12px] text-[#8792A1]">
                            Request #{request.id} · Pending review
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
                <div className="flex items-start gap-3 border-b border-[#303A47] pb-5">
                    <ClipboardList
                        size={18}
                        className="mt-0.5 shrink-0 text-[#AAB7C7]"
                    />

                    <div>
                        <h3 className="text-[14px] font-semibold! text-[#EEF1F5]!">
                            Request details
                        </h3>

                        <p className="mt-1 text-[12px] text-[#A0ADBD]">
                            Update the information submitted with your request.
                        </p>
                    </div>
                </div>

                {submitError && (
                    <div
                        role="alert"
                        className="flex gap-3 border border-red-900/50 bg-red-950/20 p-4 text-[12px] text-red-300"
                    >
                        <AlertCircle size={17} className="shrink-0" />

                        <span>{submitError}</span>
                    </div>
                )}

                <Field
                    name="title"
                    label="Request title"
                    error={errors.title}
                    wrapped
                >
                    <DashboardInput
                        id="help-edit-title"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        disabled={submitting}
                        className={inputControl}
                    />
                </Field>

                <Field
                    name="description"
                    label="Description"
                    error={errors.description}
                    wrapped
                >
                    <textarea
                        id="help-edit-description"
                        name="description"
                        rows={6}
                        value={form.description}
                        onChange={onChange}
                        disabled={submitting}
                        className={`${inputControl} resize-y`}
                    />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                        name="category"
                        label="Category"
                        error={errors.category}
                    >
                        <select
                            id="help-edit-category"
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            disabled={submitting}
                            className={control}
                        >
                            <option value="">Select category</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        name="urgency"
                        label="Urgency"
                        error={errors.urgency}
                    >
                        <select
                            id="help-edit-urgency"
                            name="urgency"
                            value={form.urgency}
                            onChange={onChange}
                            disabled={submitting}
                            className={control}
                        >
                            {urgencies.map((item) => (
                                <option key={item} value={item}>
                                    {item.charAt(0).toUpperCase() +
                                        item.slice(1)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        name="district"
                        label="District"
                        error={errors.district}
                        wrapped
                    >
                        <DashboardInput
                            id="help-edit-district"
                            name="district"
                            value={form.district}
                            onChange={onChange}
                            disabled={submitting}
                            className={control}
                        />
                    </Field>

                    <Field
                        name="address"
                        label="Address (optional)"
                        error={errors.address}
                        wrapped
                    >
                        <DashboardInput
                            id="help-edit-address"
                            name="address"
                            value={form.address}
                            onChange={onChange}
                            disabled={submitting}
                            className={control}
                        />
                    </Field>
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#303A47] bg-[#202A36] px-5 py-4 sm:px-7">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onCancel}
                    className="h-10 border border-[#343E4B] px-5 text-[12px] text-[#B8C2CF] disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-10 items-center gap-2 border border-[#46566A] bg-[#263343] px-5 text-[12px] font-medium text-[#EEF1F5] hover:bg-[#304155] disabled:opacity-50"
                >
                    <Save size={15} />

                    {submitting ? 'Saving...' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}

export default function HelpRequestEdit() {
    const params = useParams();
    const navigate = useNavigate();

    const id =
        params.id ??
        params.requestId ??
        params.helpRequestId ??
        params.help_request_id;

    const [reloadKey, setReloadKey] = useState(0);

    const [requestState, setRequestState] = useState({
        requestId: null,
        reloadKey: -1,
        request: null,
        form: null,
        loading: true,
        error: '',
    });

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadRequest() {
            try {
                if (id === null || id === undefined) {
                    throw new Error('Invalid help request ID.');
                }

                const response = await getMyHelpRequests();

                const items = normalizeHelpRequests(
                    response?.help_requests ||
                        response?.helpRequests ||
                        response?.data ||
                        [],
                );

                const found =
                    items.find((item) => String(item.id) === String(id)) ||
                    null;

                if (!found) {
                    throw new Error('This request could not be found.');
                }

                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: found,
                        form: getForm(found),
                        loading: false,
                        error: '',
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: null,
                        form: null,
                        loading: false,
                        error: err?.message || 'Unable to load this request.',
                    });
                }
            }
        }

        loadRequest();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const loading =
        requestState.loading ||
        requestState.requestId !== id ||
        requestState.reloadKey !== reloadKey;

    const { request, form, error } = requestState;

    const handleRetry = () => {
        setErrors({});
        setSubmitError('');
        setReloadKey((current) => current + 1);
    };

    const handleBack = () => {
        navigate(`${BASE}/${id}`);
    };

    const change = (event) => {
        const { name, value } = event.target;

        setRequestState((current) => ({
            ...current,
            form: {
                ...current.form,
                [name]: value,
            },
        }));

        setErrors((current) => ({
            ...current,
            [name]: '',
        }));

        setSubmitError('');
    };

    const save = async (event) => {
        event.preventDefault();

        if (submitting || !request || !form || request.status !== 'pending') {
            return;
        }

        const original = getForm(request);
        const changed = {};

        fields.forEach((field) => {
            const value =
                typeof form[field] === 'string'
                    ? form[field].trim()
                    : form[field];

            if (value !== original[field]) {
                changed[field] = field === 'address' ? value || null : value;
            }
        });

        if (!Object.keys(changed).length) {
            setSubmitError('No changes were made.');
            return;
        }

        const nextErrors = {};

        ['title', 'description', 'category', 'district', 'urgency'].forEach(
            (field) => {
                if (Object.hasOwn(changed, field) && !changed[field]) {
                    nextErrors[field] = 'This field cannot be empty.';
                }
            },
        );

        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError('');
            setErrors({});

            await updateHelpRequest(request.id, changed);

            setSaved(true);
        } catch (err) {
            if (err?.errors && typeof err.errors === 'object') {
                setErrors(err.errors);
            }

            setSubmitError(err?.message || 'Failed to update your request.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setSaved(false);

        navigate(`${BASE}/${id}`, {
            replace: true,
        });
    };

    const header = (
        <PageHeader
            title="Edit Help Request"
            subtitle="Update your request before it is reviewed."
            action={
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] text-[#EEF1F5] hover:bg-[#1A222D]"
                >
                    <ArrowLeft size={15} />
                    Request details
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading request for editing..."
                    description="Retrieving your help request information."
                />
            </div>
        );
    }

    if (error || !request || !form) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingError
                    title="Unable to edit request"
                    message={error || 'This request could not be found.'}
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    if (request.status !== 'pending') {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingError
                    title="Editing unavailable"
                    message="Only pending help requests can be edited."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-7">
            {header}

            <EditForm
                request={request}
                form={form}
                errors={errors}
                submitError={submitError}
                submitting={submitting}
                onChange={change}
                onSave={save}
                onCancel={handleBack}
            />

            <SuccessDialog
                open={saved}
                title="Request updated"
                message="Your help request was updated successfully."
                onClose={handleSuccessClose}
            />
        </div>
    );
}

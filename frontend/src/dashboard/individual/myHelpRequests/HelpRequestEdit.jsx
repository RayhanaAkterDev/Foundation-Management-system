import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    AlertCircle,
    FileText,
    MapPin,
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
const getForm = (r) =>
    Object.fromEntries(
        fields.map((field) => [
            field,
            r?.[field] ?? (field === 'urgency' ? 'normal' : ''),
        ]),
    );
const control =
    'w-full min-w-0 border border-[#35404E] bg-[#0E1219] px-3.5 py-3 text-[13px] text-[#EEF1F5] outline-none placeholder:text-[#697586] focus:border-[#718096] disabled:opacity-50';

export default function HelpRequestEdit() {
    const params = useParams();
    const id =
        params.id ??
        params.requestId ??
        params.helpRequestId ??
        params.help_request_id;
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
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
                if (active) {
                    setRequest(found);
                    setForm(found ? getForm(found) : null);
                }
            } catch (err) {
                if (active)
                    setError(err?.message || 'Unable to load this request.');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => {
            active = false;
        };
    }, [id]);
    const change = (event) => {
        const { name, value } = event.target;
        setForm((old) => ({ ...old, [name]: value }));
        setErrors((old) => ({ ...old, [name]: '' }));
        setSubmitError('');
    };
    const save = async (event) => {
        event.preventDefault();
        if (submitting || request?.status !== 'pending') return;
        const original = getForm(request);
        const changed = {};
        fields.forEach((field) => {
            const value =
                typeof form[field] === 'string'
                    ? form[field].trim()
                    : form[field];
            if (value !== original[field])
                changed[field] = field === 'address' ? value || null : value;
        });
        if (!Object.keys(changed).length) {
            setSubmitError('No changes were made.');
            return;
        }
        const nextErrors = {};
        ['title', 'description', 'category', 'district', 'urgency'].forEach(
            (field) => {
                if (Object.hasOwn(changed, field) && !changed[field])
                    nextErrors[field] = 'This field cannot be empty.';
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
            if (err?.errors && typeof err.errors === 'object')
                setErrors(err.errors);
            setSubmitError(err?.message || 'Failed to update your request.');
        } finally {
            setSubmitting(false);
        }
    };
    const header = (
        <PageHeader
            title="Edit Help Request"
            subtitle="Update your request before it is reviewed."
            action={
                <button
                    type="button"
                    onClick={() => navigate(`${BASE}/${id}`)}
                    className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] text-[#EEF1F5] hover:bg-[#1A222D]"
                >
                    <ArrowLeft size={15} /> Request details
                </button>
            }
        />
    );
    if (loading || error || !request)
        return (
            <div className="space-y-8">
                {header}
                {loading ? (
                    <LoadingUI variant="page" title="Loading request..." />
                ) : (
                    <LoadingError
                        title="Unable to edit request"
                        message={error || 'This request could not be found.'}
                    />
                )}
            </div>
        );
    if (request.status !== 'pending')
        return (
            <div className="space-y-8">
                {header}
                <LoadingError
                    title="Editing unavailable"
                    message="Only pending help requests can be edited."
                />
            </div>
        );
    const field = (name, label, input) => (
        <div className="space-y-2">
            <label
                htmlFor={`help-edit-${name}`}
                className="block text-[13px] font-medium text-[#C3CFDD]"
            >
                {label}
            </label>
            {['title', 'description', 'district', 'address'].includes(name) ? (
                <div
                    className={`border bg-[#151B23] transition-colors focus-within:border-[#637489] ${errors[name] ? 'border-[#86545E]' : 'border-[#35404E]'}`}
                >
                    {input}
                </div>
            ) : (
                input
            )}
            {errors[name] && (
                <p className="text-[12px] text-red-400">
                    {Array.isArray(errors[name])
                        ? errors[name][0]
                        : errors[name]}
                </p>
            )}
        </div>
    );
    return (
        <div className="space-y-6 lg:space-y-7">
            {header}
            <form
                onSubmit={save}
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
                                Update the information submitted with your
                                request.
                            </p>
                        </div>
                    </div>
                    {submitError && (
                        <div className="flex gap-3 border border-red-900/50 bg-red-950/20 p-4 text-[12px] text-red-300">
                            <AlertCircle size={17} className="shrink-0" />
                            {submitError}
                        </div>
                    )}
                    {field(
                        'title',
                        'Request title',
                        <input
                            id="help-edit-title"
                            name="title"
                            value={form.title}
                            onChange={change}
                            disabled={submitting}
                            className=""
                        />,
                    )}
                    {field(
                        'description',
                        'Description',
                        <textarea
                            id="help-edit-description"
                            name="description"
                            rows={6}
                            value={form.description}
                            onChange={change}
                            disabled={submitting}
                            className="resize-y"
                        />,
                    )}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {field(
                            'category',
                            'Category',
                            <select
                                id="help-edit-category"
                                name="category"
                                value={form.category}
                                onChange={change}
                                disabled={submitting}
                                className={control}
                            >
                                <option value="">Select category</option>
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>,
                        )}
                        {field(
                            'urgency',
                            'Urgency',
                            <select
                                id="help-edit-urgency"
                                name="urgency"
                                value={form.urgency}
                                onChange={change}
                                disabled={submitting}
                                className={control}
                            >
                                {urgencies.map((item) => (
                                    <option key={item} value={item}>
                                        {item.charAt(0).toUpperCase() +
                                            item.slice(1)}
                                    </option>
                                ))}
                            </select>,
                        )}
                        {field(
                            'district',
                            'District',
                            <input
                                id="help-edit-district"
                                name="district"
                                value={form.district}
                                onChange={change}
                                disabled={submitting}
                                className={control}
                            />,
                        )}
                        {field(
                            'address',
                            'Address (optional)',
                            <input
                                id="help-edit-address"
                                name="address"
                                value={form.address}
                                onChange={change}
                                disabled={submitting}
                                className={control}
                            />,
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap justify-end gap-3 border-t border-[#303A47] bg-[#202A36] px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={() => navigate(`${BASE}/${id}`)}
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
            <SuccessDialog
                open={saved}
                title="Request updated"
                message="Your help request was updated successfully."
                onClose={() => {
                    setSaved(false);
                    navigate(`${BASE}/${id}`, { replace: true });
                }}
            />
        </div>
    );
}

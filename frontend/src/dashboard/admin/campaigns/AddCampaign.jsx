import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Check,
    ChevronDown,
    FileImage,
    ImagePlus,
    MapPin,
    Target,
    X,
    AlertCircle,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import { createCampaign } from './api/campaignsAPI';

const CATEGORIES = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

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
    duration_type: 'fixed',
    end_date: '',
    cover_image: null,
};

const fieldClass =
    'h-11 w-full min-w-0 border border-[#343E4B] bg-[#151C25] px-3.5 text-[14px] text-[#EEF1F5] outline-none transition-colors placeholder:text-[#647184] hover:border-[#485463] focus:border-[#7E8D9F] disabled:opacity-50';
const labelClass = 'mb-2 block text-[13px] font-medium text-[#C4CDD8]';

function Field({ label, required, children }) {
    return (
        <div className="min-w-0">
            <label className={labelClass}>
                {label}
                {required && <span className="ml-1 text-[#E7A29E]">*</span>}
            </label>
            {children}
        </div>
    );
}

function Section({ number, title, description, icon: Icon, children }) {
    return (
        <section className="border border-[#29323E] bg-[#0E1219]">
            <div className="flex items-start gap-3 border-b border-[#29323E] bg-[#151C25] px-5 py-4 sm:px-6">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-[#394655] text-[11px] font-semibold tabular-nums text-[#B8C5D4]">
                    {number}
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-[16px] font-semibold text-[#EEF1F5]">
                        {title}
                    </h2>
                    <p className="mt-1 text-[13px] leading-5 text-[#8792A1]">
                        {description}
                    </p>
                </div>
                <Icon
                    size={17}
                    className="mt-1 shrink-0 text-[#8792A1]"
                    strokeWidth={1.7}
                />
            </div>
            <div className="space-y-5 p-5 sm:p-6">{children}</div>
        </section>
    );
}

export default function AddCampaign() {
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleCoverImageChange = (event) => {
        const file = event.target.files?.[0] || null;
        setPreview(file ? URL.createObjectURL(file) : '');
        update('cover_image', file);
    };

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError('');
    };

    const validate = () => {
        if (!form.title.trim()) return 'Campaign title is required.';
        if (!form.description.trim())
            return 'Campaign description is required.';
        if (!form.category) return 'Please select a campaign category.';
        if (!form.location.trim()) return 'Campaign location is required.';
        if (!form.target_amount) return 'Target amount is required.';
        if (
            !Number.isFinite(Number(form.target_amount)) ||
            Number(form.target_amount) <= 0
        )
            return 'Target amount must be greater than zero.';
        if (
            form.duration_type === 'fixed' &&
            form.start_date &&
            form.end_date &&
            form.end_date < form.start_date
        )
            return 'End date cannot be earlier than the start date.';
        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const message = validate();
        if (message) {
            setError(message);
            return;
        }
        setLoading(true);
        setError('');
        try {
            await createCampaign({
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
                end_date:
                    form.duration_type === 'fixed'
                        ? form.end_date || null
                        : null,
                cover_image: form.cover_image,
            });
            setSuccess(true);
        } catch (err) {
            setError(err?.message || 'Campaign creation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-8 sm:space-y-7">
            <PageHeader
                title="Add campaign"
                subtitle="Create a global humanitarian fundraising campaign."
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/campaigns')}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[13px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#202A36]"
                    >
                        <ArrowLeft size={16} /> All campaigns
                    </button>
                }
            />

            <form
                onSubmit={handleSubmit}
                className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-start"
            >
                <div className="min-w-0 space-y-5">
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 border border-[#6B393C] bg-[#302024] px-4 py-3 text-[13px] leading-5 text-[#F0B5B7]"
                        >
                            <AlertCircle
                                size={17}
                                className="mt-0.5 shrink-0"
                            />{' '}
                            {error}
                        </div>
                    )}
                    <Section
                        number="01"
                        title="Campaign details"
                        description="Basic information that identifies the campaign."
                        icon={Target}
                    >
                        <Field label="Campaign title" required>
                            <input
                                aria-label="Campaign title"
                                className={fieldClass}
                                value={form.title}
                                disabled={loading}
                                onChange={(e) =>
                                    update('title', e.target.value)
                                }
                                placeholder="Enter campaign title"
                            />
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Category" required>
                                <div className="relative">
                                    <select
                                        aria-label="Category"
                                        className={`${fieldClass} appearance-none pr-10`}
                                        value={form.category}
                                        disabled={loading}
                                        onChange={(e) =>
                                            update('category', e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select category
                                        </option>
                                        {CATEGORIES.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={16}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792A1]"
                                    />
                                </div>
                            </Field>
                            <Field label="Campaign scope">
                                <div className="flex h-11 items-center border border-[#343E4B] bg-[#1B232E] px-3.5 text-[14px] text-[#C4CDD8]">
                                    Global
                                </div>
                            </Field>
                        </div>
                        <Field label="Description" required>
                            <textarea
                                aria-label="Description"
                                rows={6}
                                className={`${fieldClass} h-auto min-h-36 resize-y py-3 leading-6`}
                                value={form.description}
                                disabled={loading}
                                onChange={(e) =>
                                    update('description', e.target.value)
                                }
                                placeholder="Describe the humanitarian situation and intended response..."
                            />
                        </Field>
                    </Section>

                    <Section
                        number="02"
                        title="Location & impact"
                        description="Identify the regions and communities this campaign supports."
                        icon={MapPin}
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="District">
                                <input
                                    aria-label="District"
                                    className={fieldClass}
                                    value={form.district}
                                    disabled={loading}
                                    onChange={(e) =>
                                        update('district', e.target.value)
                                    }
                                    placeholder="e.g. Multiple districts"
                                />
                            </Field>
                            <Field label="Location" required>
                                <input
                                    aria-label="Location"
                                    className={fieldClass}
                                    value={form.location}
                                    disabled={loading}
                                    onChange={(e) =>
                                        update('location', e.target.value)
                                    }
                                    placeholder="Affected region or area"
                                />
                            </Field>
                        </div>
                        <Field label="Affected areas">
                            <textarea
                                aria-label="Affected areas"
                                rows={3}
                                className={`${fieldClass} h-auto min-h-24 resize-y py-3 leading-6`}
                                value={form.affected_areas}
                                disabled={loading}
                                onChange={(e) =>
                                    update('affected_areas', e.target.value)
                                }
                                placeholder="Describe affected communities or areas..."
                            />
                        </Field>
                    </Section>

                    <Section
                        number="03"
                        title="Funding & schedule"
                        description="Set the fundraising target and campaign duration."
                        icon={CalendarDays}
                    >
                        <Field label="Target amount (BDT)" required>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#8792A1]">
                                    ৳
                                </span>
                                <input
                                    aria-label="Target amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={`${fieldClass} pl-9`}
                                    value={form.target_amount}
                                    disabled={loading}
                                    onChange={(e) =>
                                        update('target_amount', e.target.value)
                                    }
                                    placeholder="Enter fundraising target"
                                />
                            </div>
                        </Field>
                        <Field label="Campaign duration">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    {
                                        value: 'fixed',
                                        label: 'Set an end date',
                                        description:
                                            'Closes on a planned date.',
                                    },
                                    {
                                        value: 'open',
                                        label: 'Open-ended',
                                        description:
                                            'Remains open until closed.',
                                    },
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        disabled={loading}
                                        aria-pressed={
                                            form.duration_type === item.value
                                        }
                                        onClick={() => {
                                            update('duration_type', item.value);
                                            if (item.value === 'open')
                                                update('end_date', '');
                                        }}
                                        className={`flex items-start justify-between gap-3 border p-3.5 text-left transition-colors ${form.duration_type === item.value ? 'border-[#718096] bg-[#1E2936]' : 'border-[#343E4B] bg-[#151C25] hover:border-[#526071]'}`}
                                    >
                                        <span>
                                            <span className="block text-[13px] font-semibold text-[#EEF1F5]">
                                                {item.label}
                                            </span>
                                            <span className="mt-1 block text-[12px] text-[#8792A1]">
                                                {item.description}
                                            </span>
                                        </span>
                                        {form.duration_type === item.value && (
                                            <Check
                                                size={15}
                                                className="shrink-0 text-[#B8C5D4]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Field>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Start date">
                                <input
                                    aria-label="Start date"
                                    type="date"
                                    className={fieldClass}
                                    value={form.start_date}
                                    disabled={loading}
                                    onChange={(e) =>
                                        update('start_date', e.target.value)
                                    }
                                />
                            </Field>
                            {form.duration_type === 'fixed' && (
                                <Field label="End date">
                                    <input
                                        aria-label="End date"
                                        type="date"
                                        min={form.start_date || undefined}
                                        className={fieldClass}
                                        value={form.end_date}
                                        disabled={loading}
                                        onChange={(e) =>
                                            update('end_date', e.target.value)
                                        }
                                    />
                                </Field>
                            )}
                        </div>
                    </Section>
                </div>

                <aside className="min-w-0 space-y-5 xl:sticky xl:top-5">
                    <section className="border border-[#29323E] bg-[#0E1219]">
                        <div className="flex items-center gap-2 border-b border-[#29323E] bg-[#151C25] px-4 py-4">
                            <FileImage size={17} className="text-[#8792A1]" />
                            <h2 className="text-[15px] font-semibold text-[#EEF1F5]">
                                Campaign cover
                            </h2>
                        </div>
                        <div className="p-4">
                            {form.cover_image && preview ? (
                                <div className="relative mb-3 aspect-16/10 overflow-hidden border border-[#343E4B] bg-[#151C25]">
                                    <img
                                        src={preview}
                                        alt="Campaign cover preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Remove cover image"
                                        disabled={loading}
                                        onClick={() => {
                                            update('cover_image', null);
                                            setPreview('');
                                        }}
                                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-[#0E1219]/90 text-white hover:bg-[#253142]"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-3 flex aspect-16/10 items-center justify-center border border-dashed border-[#3B4655] bg-[#151C25]">
                                    <ImagePlus
                                        size={28}
                                        className="text-[#6C7989]"
                                    />
                                </div>
                            )}
                            <label className="flex min-h-10 cursor-pointer items-center justify-center gap-2 border border-[#3B4655] px-3 py-2 text-[13px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#1A222D]">
                                <ImagePlus size={16} />{' '}
                                {form.cover_image
                                    ? 'Change image'
                                    : 'Choose image'}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    disabled={loading}
                                    onChange={handleCoverImageChange}
                                />
                            </label>
                            <p className="mt-2 break-all text-[12px] leading-5 text-[#8792A1]">
                                {form.cover_image?.name || 'JPG, PNG or WebP'}
                            </p>
                        </div>
                    </section>
                    <section className="border border-[#29323E] bg-[#0E1219] p-4">
                        <h2 className="text-[14px] font-semibold text-[#EEF1F5]">
                            Create campaign
                        </h2>
                        <p className="mt-1.5 text-[12px] leading-5 text-[#8792A1]">
                            Review the campaign details before submitting.
                        </p>
                        <div className="mt-5 flex flex-col gap-2.5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#2C3B4D] px-4 text-[13px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#394B60] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? 'Creating campaign...'
                                    : 'Create campaign'}{' '}
                                {!loading && <ArrowRight size={16} />}
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    navigate('/admin/dashboard/campaigns')
                                }
                                className="h-10 w-full border border-[#343E4B] text-[13px] font-medium text-[#B8C2CF] transition-colors hover:bg-[#1A222D] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </section>
                </aside>
            </form>
            <SuccessDialog
                open={success}
                title="Campaign created"
                message="Campaign created successfully."
                onClose={() => {
                    setSuccess(false);
                    navigate('/admin/dashboard/campaigns');
                }}
            />
        </div>
    );
}

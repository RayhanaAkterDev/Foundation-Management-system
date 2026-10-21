import { useState } from 'react';
import { ArrowLeft, Save, FileText, MapPin } from 'lucide-react';
import LoadingError from '@/components/dashboard/LoadingError';
import LoadingUI from '@/components/dashboard/LoadingUI';

const CATEGORIES = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

const URGENCY_LEVELS = [
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

const inputClass = `
    w-full min-w-0 border border-[#343E4B]
    bg-[#151C25] px-3.5 py-3
    text-[13px] text-[#DCE3EC]
    outline-none transition-colors
    placeholder:text-[#697586]
    hover:border-[#455160]
    focus:border-[#64748B]
    focus:ring-0
    disabled:cursor-not-allowed
    disabled:opacity-50
`;

function Field({ label, children, required = false }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 block text-[12px] font-medium text-[#AEB7C3]">
                {label}
                {required && <span className="ml-1 text-[#CDA38C]">*</span>}
            </label>
            {children}
        </div>
    );
}

function Section({ icon: Icon, title, children }) {
    return (
        <section className="border border-[#29323E] bg-[#0E1219]">
            <div className="flex items-center gap-3 border-b border-[#29323E] px-5 py-4 sm:px-6">
                <Icon size={17} strokeWidth={1.7} className="text-[#8792A1]" />
                <h2 className="text-[15px] font-semibold text-[#E5EAF0]!">
                    {title}
                </h2>
            </div>
            <div className="grid gap-5 p-5 sm:p-6">{children}</div>
        </section>
    );
}

export default function HelpRequestEditView({
    request,
    saving = false,
    error = '',
    onSave,
    onCancel,
}) {
    const [form, setForm] = useState({
        title: request.title ?? '',
        description: request.description ?? '',
        category:
            CATEGORIES.find(
                (item) =>
                    item.toLowerCase() ===
                    String(request.category || '').toLowerCase(),
            ) ||
            request.category ||
            '',
        urgency: ['normal', 'high', 'critical'].includes(
            String(request.urgency ?? request.priority).toLowerCase(),
        )
            ? String(request.urgency ?? request.priority).toLowerCase()
            : 'normal',
        district: request.district ?? '',
        address: request.address ?? '',
    });

    const [validationError, setValidationError] = useState('');

    const update = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
        setValidationError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (saving) return;

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            urgency: form.urgency,
            district: form.district.trim(),
            address: form.address.trim() || null,
        };

        if (!payload.title) {
            setValidationError('Request title is required.');
            return;
        }

        if (!payload.description) {
            setValidationError('Description is required.');
            return;
        }

        if (!payload.category) {
            setValidationError('Please select a category.');
            return;
        }

        if (!payload.urgency) {
            setValidationError('Please select an urgency level.');
            return;
        }

        if (!payload.district) {
            setValidationError('District is required.');
            return;
        }

        onSave?.(payload);
    };

    return (
        <main className="min-w-0 space-y-6 pb-8">
            <header className="border-b border-[#29323E] pb-5">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#8792A1] hover:text-[#EEF1F5] disabled:opacity-50"
                >
                    <ArrowLeft size={15} />
                    Back to request
                </button>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="mb-2 text-[11px] text-[#8792A1]">
                            Help request #{request.id}
                        </p>
                        <h1 className="text-[24px] font-semibold tracking-tight text-[#EEF1F5]!">
                            Edit help request
                        </h1>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                {(validationError || error) && (
                    <LoadingError
                        title={
                            validationError
                                ? 'Check request information'
                                : 'Unable to save help request'
                        }
                        message={validationError || error}
                    />
                )}

                {saving && (
                    <LoadingUI
                        title="Saving help request..."
                        description="Please wait while your changes are saved."
                    />
                )}

                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <Section icon={FileText} title="Request information">
                        <Field label="Request title" required>
                            <input
                                type="text"
                                maxLength={255}
                                value={form.title}
                                disabled={saving}
                                onChange={(event) =>
                                    update('title', event.target.value)
                                }
                                className={`${inputClass} h-11`}
                            />
                        </Field>

                        <Field label="Description" required>
                            <textarea
                                rows={9}
                                value={form.description}
                                disabled={saving}
                                onChange={(event) =>
                                    update('description', event.target.value)
                                }
                                className={`${inputClass} resize-y leading-6`}
                            />
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Category" required>
                                <select
                                    value={form.category}
                                    disabled={saving}
                                    onChange={(event) =>
                                        update('category', event.target.value)
                                    }
                                    className={`${inputClass} h-11 py-0`}
                                >
                                    <option value="">Select category</option>
                                    {form.category &&
                                        !CATEGORIES.includes(form.category) && (
                                            <option value={form.category}>
                                                {form.category}
                                            </option>
                                        )}
                                    {CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Urgency" required>
                                <select
                                    value={form.urgency}
                                    disabled={saving}
                                    onChange={(event) =>
                                        update('urgency', event.target.value)
                                    }
                                    className={`${inputClass} h-11 py-0`}
                                >
                                    {URGENCY_LEVELS.map((level) => (
                                        <option
                                            key={level.value}
                                            value={level.value}
                                        >
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    <Section icon={MapPin} title="Location">
                        <Field label="District" required>
                            <input
                                type="text"
                                maxLength={255}
                                value={form.district}
                                disabled={saving}
                                onChange={(event) =>
                                    update('district', event.target.value)
                                }
                                className={`${inputClass} h-11`}
                            />
                        </Field>

                        <Field label="Address">
                            <textarea
                                rows={5}
                                maxLength={1000}
                                value={form.address}
                                disabled={saving}
                                onChange={(event) =>
                                    update('address', event.target.value)
                                }
                                className={`${inputClass} resize-y leading-6`}
                            />
                        </Field>
                    </Section>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#29323E] pt-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="h-10 border border-[#343E4B] px-5 text-[12px] font-medium text-[#AEB7C3] hover:bg-[#1A222D] disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-10 items-center justify-center gap-2 border border-[#465365] bg-[#263343] px-5 text-[12px] font-semibold text-[#EEF1F5] hover:bg-[#344457] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={15} />
                        {saving ? 'Saving changes...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </main>
    );
}

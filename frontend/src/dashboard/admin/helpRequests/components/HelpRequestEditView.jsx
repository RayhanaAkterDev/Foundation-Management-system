import { useState } from 'react';
import {
    FileText,
    MapPin,
    Save,
    LoaderCircle,
    AlertCircle,
} from 'lucide-react';

import DashboardInput from '@/components/dashboard/DashboardInput';

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

const SELECT_CLASS = `
    block h-11 w-full min-w-0
    appearance-auto rounded-[4px]

    border border-[#29313D]
    bg-[#151B23]
    px-3.5

    font-sans text-[14px] font-normal
    text-[#D8DEE7]

    shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]
    outline-none

    transition-[background-color,border-color,box-shadow]
    duration-150

    hover:border-[#3C4654]
    hover:bg-[#171E27]

    focus:border-[#637489]
    focus:bg-[#1A222D]
    focus:ring-0

    disabled:cursor-not-allowed
    disabled:opacity-50
`;

function PanelHeading({ icon: Icon, title }) {
    return (
        <div className="flex min-h-15 items-center gap-3 border-b border-[#303A47] bg-[#1B2531] px-5 sm:px-6">
            <span className="flex size-8 shrink-0 items-center justify-center border border-[#3A495B] bg-[#263545] text-[#B9C8D8]">
                <Icon size={16} strokeWidth={1.8} />
            </span>

            <h2 className="m-0! font-sans! text-[14px]! font-semibold! text-[#EEF1F5]!">
                {title}
            </h2>
        </div>
    );
}

function SelectField({
    id,
    name,
    label,
    value,
    onChange,
    disabled,
    options,
    placeholder,
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="mb-[7px] block font-sans! text-[13px] font-medium! leading-5 text-[#9BA7B6]!"
            >
                {label}
                <span aria-hidden="true" className="ml-1 text-[#8793A2]!">
                    *
                </span>
            </label>

            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required
                className={SELECT_CLASS}
            >
                {placeholder && <option value="">{placeholder}</option>}

                {value && !options.some((option) => option.value === value) && (
                    <option value={value}>{value}</option>
                )}

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
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
        urgency: String(
            request.urgency ?? request.priority ?? 'normal',
        ).toLowerCase(),
        district: request.district ?? '',
        address: request.address ?? request.location ?? '',
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

    const categoryOptions = CATEGORIES.map((category) => ({
        value: category,
        label: category,
    }));

    return (
        <form onSubmit={handleSubmit} className="min-w-0 space-y-5 font-sans">
            {(validationError || error) && (
                <div
                    role="alert"
                    className="flex items-start gap-3 border border-[#66434A] bg-[#2C2027] px-4 py-3 text-[13px] leading-6 text-[#E9B9BE]"
                >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />

                    <span>{validationError || error}</span>
                </div>
            )}

            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219]">
                    <PanelHeading icon={FileText} title="Request information" />

                    <div className="space-y-6 px-5 py-6 sm:px-6">
                        <DashboardInput
                            id="help-request-title"
                            name="title"
                            label="Request title"
                            required
                            requiredMark
                            maxLength={255}
                            value={form.title}
                            disabled={saving}
                            placeholder="Enter request title"
                            onChange={(event) =>
                                update('title', event.target.value)
                            }
                        />

                        <DashboardInput
                            as="textarea"
                            id="help-request-description"
                            name="description"
                            label="Description"
                            required
                            requiredMark
                            rows={6}
                            value={form.description}
                            disabled={saving}
                            placeholder="Describe the assistance required"
                            onChange={(event) =>
                                update('description', event.target.value)
                            }
                            className="min-h-40 leading-7"
                        />

                        <div className="grid min-w-0 gap-5 border-t border-[#2C3643] pt-6 sm:grid-cols-2">
                            <SelectField
                                id="help-request-category"
                                name="category"
                                label="Category"
                                value={form.category}
                                disabled={saving}
                                options={categoryOptions}
                                placeholder="Select category"
                                onChange={(event) =>
                                    update('category', event.target.value)
                                }
                            />

                            <SelectField
                                id="help-request-urgency"
                                name="urgency"
                                label="Urgency"
                                value={form.urgency}
                                disabled={saving}
                                options={URGENCY_LEVELS}
                                onChange={(event) =>
                                    update('urgency', event.target.value)
                                }
                            />
                        </div>
                    </div>
                </section>

                <aside className="min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] h-[546px]">
                    <PanelHeading icon={MapPin} title="Location" />

                    <div className="space-y-6 px-5 py-6 sm:px-6">
                        <DashboardInput
                            id="help-request-district"
                            name="district"
                            label="District"
                            required
                            requiredMark
                            maxLength={255}
                            value={form.district}
                            disabled={saving}
                            placeholder="Enter district"
                            onChange={(event) =>
                                update('district', event.target.value)
                            }
                        />

                        <DashboardInput
                            as="textarea"
                            id="help-request-address"
                            name="address"
                            label="Address"
                            rows={12}
                            maxLength={1000}
                            value={form.address}
                            disabled={saving}
                            placeholder="Enter detailed address"
                            onChange={(event) =>
                                update('address', event.target.value)
                            }
                            className="min-h-28"
                        />
                    </div>
                </aside>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#303A47] pt-5 sm:flex-row sm:items-center sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="inline-flex min-h-10 items-center justify-center border border-[#343E4B] bg-[#151C25] px-5 text-[13px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#202A35] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#586678] bg-[#2B3949] px-5 text-[13px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#37495D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <Save size={15} />
                    )}

                    {saving ? 'Saving changes...' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}

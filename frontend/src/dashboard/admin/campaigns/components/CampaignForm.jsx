import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    ArrowLeft,
    FileText,
    ImagePlus,
    MapPin,
    Target,
    Trash2,
    Upload,
} from 'lucide-react';

import DashboardInput from '@/components/dashboard/DashboardInput';
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

const HIDE_SCROLLBAR =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

function toDate(value) {
    if (!value) return '';
    return String(value).slice(0, 10);
}

function initialValues(campaign = {}) {
    return {
        title: campaign.title || '',
        category: campaign.category || '',
        description: campaign.description || '',
        district: campaign.district || '',
        location: campaign.location || '',
        affected_areas: campaign.affected_areas || '',
        target_amount: String(campaign.target_amount ?? ''),
        start_date: toDate(campaign.start_date),
        end_date: toDate(campaign.end_date),
        duration_type: campaign.id && !campaign.end_date ? 'open' : 'fixed',
    };
}

function getExistingCover(campaign) {
    const image =
        campaign?.cover_image_url ||
        campaign?.cover_image ||
        campaign?.image_url ||
        campaign?.image ||
        '';

    return typeof image === 'string' ? image : '';
}

function Section({ icon: Icon, title, description, children }) {
    return (
        <section className="min-w-0">
            <div className="flex items-start gap-3 pb-1">
                <Icon
                    size={18}
                    strokeWidth={1.65}
                    className="mt-0.5 shrink-0 text-[#9AABBC]"
                />
                <div className="min-w-0">
                    <h2 className="m-0! font-sans! text-[15px]! font-semibold! text-[#EEF1F5]!">
                        {title}
                    </h2>
                    <p className="mt-1 mb-0! text-[12px] leading-5 text-[#91A0B1]">
                        {description}
                    </p>
                </div>
            </div>
            <div className="mt-8 space-y-7">{children}</div>
        </section>
    );
}

function TextareaField({
    id,
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
    disabled,
    required,
    showRequired,
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={id}
                className="mb-1.5 block text-[12px] font-medium text-[#C4CDD8]"
            >
                {label}
                {required && showRequired && (
                    <span className="ml-1 text-[#D99A9F]">*</span>
                )}
            </label>

            <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className="block w-full min-w-0 resize-y border border-[#343E4B] bg-[#151C25] px-3.5 py-2.5 text-[13px] leading-6 text-[#EEF1F5] outline-none transition-colors placeholder:text-[#697586] focus:border-[#8792A1] disabled:opacity-50"
            />
        </div>
    );
}

function DurationOption({ title, description, selected, onClick, disabled }) {
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={onClick}
            className={`flex min-h-17 min-w-0 items-center justify-between gap-3 border px-3.5 py-3 text-left transition-colors disabled:opacity-50 ${
                selected
                    ? 'border-[#64758A] bg-[#222E3D]'
                    : 'border-[#343E4B] bg-[#151C25] hover:bg-[#1D2835]'
            }`}
        >
            <div className="min-w-0">
                <p className="m-0! text-[12px] font-semibold text-[#E8EDF3]">
                    {title}
                </p>
                <p className="mt-1 mb-0! text-[11px] leading-4 text-[#8792A1]">
                    {description}
                </p>
            </div>

            <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    selected ? 'border-[#B7C5D3]' : 'border-[#5B697A]'
                }`}
            >
                {selected && (
                    <span className="h-2 w-2 rounded-full bg-[#B7C5D3]" />
                )}
            </span>
        </button>
    );
}

export default function CampaignForm({
    mode = 'add',
    campaign,
    loading = false,
    error = '',
    onSubmit,
    onCancel,
    onValuesChange,
    onCoverChange,
}) {
    const isEdit = mode === 'edit';

    const [form, setForm] = useState(() => initialValues(campaign));
    const [coverFile, setCoverFile] = useState(null);
    const [coverUrl, setCoverUrl] = useState('');
    const [coverRemoved, setCoverRemoved] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const scrollRef = useRef(null);
    const tabs = [
        { label: 'Campaign information', icon: FileText },
        { label: 'Location & impact', icon: MapPin },
        { label: 'Funding & schedule', icon: Target },
    ];
    const switchTab = (index) => {
        setActiveTab(index);
        setValidationError('');
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fileInputRef = useRef(null);
    const existingCover = getExistingCover(campaign);

    const hasCover =
        Boolean(coverFile) || (!coverRemoved && Boolean(existingCover));

    useEffect(() => {
        return () => {
            if (coverUrl) URL.revokeObjectURL(coverUrl);
        };
    }, [coverUrl]);

    const update = (field, value) => {
        const next = { ...form, [field]: value };
        setForm(next);
        setValidationError('');
        onValuesChange?.(next);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setValidationError('Choose a JPG, PNG or WebP image.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setValidationError('The image must be 5 MB or smaller.');
            return;
        }

        const url = URL.createObjectURL(file);

        setCoverFile(file);
        setCoverUrl(url);
        setCoverRemoved(false);
        setValidationError('');

        onCoverChange?.({
            file,
            removed: false,
            previewUrl: url,
        });
    };

    const removeCover = () => {
        setCoverFile(null);
        setCoverUrl('');
        setCoverRemoved(true);
        setValidationError('');

        onCoverChange?.({
            file: null,
            removed: true,
            previewUrl: '',
        });
    };

    const input = (name, label, options = {}) => (
        <DashboardInput
            id={`campaign-${mode}-${name}`}
            name={name}
            label={label}
            type={options.type || 'text'}
            value={form[name]}
            placeholder={options.placeholder}
            required={Boolean(options.required)}
            requiredMark={!isEdit && Boolean(options.required)}
            disabled={loading}
            onChange={(event) => update(name, event.target.value)}
        />
    );

    const submit = (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            setValidationError('Campaign title is required.');
            setActiveTab(0);
            return;
        }

        if (!form.category) {
            setValidationError('Select a campaign category.');
            setActiveTab(0);
            return;
        }

        if (!form.description.trim()) {
            setValidationError('Campaign description is required.');
            setActiveTab(0);
            return;
        }

        if (!form.location.trim()) {
            setValidationError('Campaign location is required.');
            setActiveTab(1);
            return;
        }

        const target = Number(form.target_amount);

        if (!Number.isFinite(target) || target <= 0) {
            setValidationError('Enter a valid funding target.');
            setActiveTab(2);
            return;
        }

        if (
            form.duration_type === 'fixed' &&
            form.start_date &&
            form.end_date &&
            form.end_date < form.start_date
        ) {
            setValidationError('End date cannot be before start date.');
            setActiveTab(2);
            return;
        }

        setValidationError('');

        const payload = {
            title: form.title.trim(),
            category: form.category,
            description: form.description.trim(),
            district: form.district.trim(),
            location: form.location.trim(),
            affected_areas: form.affected_areas.trim(),
            target_amount: form.target_amount,
            start_date: form.start_date || null,
            end_date:
                form.duration_type === 'fixed' ? form.end_date || null : null,
        };

        if (coverFile) {
            payload.cover_image = coverFile;
        } else if (coverRemoved) {
            payload.cover_image = null;
        }

        onSubmit?.(payload);
    };

    return (
        <form
            onSubmit={submit}
            noValidate
            className="flex min-h-0 min-w-0 flex-col lg:h-full"
        >
            <div
                ref={scrollRef}
                className={`min-h-0 min-w-0 flex-1 px-5 py-6 sm:px-7 sm:py-7 lg:overflow-y-auto lg:overscroll-contain xl:px-9 ${HIDE_SCROLLBAR}`}
            >
                {(error || validationError) && (
                    <div
                        role="alert"
                        className="mb-7 border border-[#75464C] bg-[#322126] px-4 py-3 text-[12px] leading-5 text-[#F0C5C8]"
                    >
                        {validationError || error}
                    </div>
                )}

                <nav
                    className="mb-12 border-b border-[#303A47]"
                    aria-label="Campaign form sections"
                >
                    <div
                        className="flex min-w-0 gap-5 sm:gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        role="tablist"
                    >
                        {tabs.map(({ label }, index) => (
                            <button
                                key={label}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === index}
                                disabled={loading}
                                onClick={() => switchTab(index)}
                                className={`relative flex shrink-0 items-center gap-2 pb-3 pt-1 text-left transition-colors disabled:opacity-50 ${activeTab === index ? 'text-[#EDF2F7]' : 'text-[#8493A5] hover:text-[#C9D4DF]'}`}
                            >
                                <span
                                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${activeTab === index ? 'border-[#7F95AA] bg-[#283646] text-[#EDF2F7]' : 'border-[#3B4654] text-[#8493A5]'}`}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] font-medium sm:text-[12px]">
                                    {label}
                                </span>
                                {activeTab === index && (
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#A9BBCB]" />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>
                <div className="space-y-11">
                    {activeTab === 0 && (
                        <>
                            <Section
                                icon={ImagePlus}
                                title="Campaign cover"
                                description="Choose an image for your campaign preview."
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 border border-[#343E4B] bg-[#141B24] px-4 py-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#3C4856] bg-[#202B37] text-[#AFC0D0]">
                                            <ImagePlus size={18} />
                                        </span>

                                        <div className="min-w-0">
                                            <p className="m-0! truncate text-[12px] font-medium text-[#E5EBF2]">
                                                {coverFile?.name ||
                                                    (hasCover
                                                        ? 'Campaign cover selected'
                                                        : 'No cover image selected')}
                                            </p>

                                            <p className="mt-1 mb-0! text-[11px] text-[#8792A1]">
                                                JPG, PNG or WebP · Maximum 5 MB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="inline-flex h-9 items-center gap-2 border border-[#526174] bg-[#253242] px-3.5 text-[12px] font-medium text-[#E3EAF1] hover:bg-[#304052] disabled:opacity-50"
                                        >
                                            <Upload size={14} />
                                            {hasCover
                                                ? 'Replace image'
                                                : 'Choose image'}
                                        </button>

                                        {hasCover && (
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={removeCover}
                                                className="inline-flex h-9 items-center gap-2 border border-[#394655] px-3 text-[12px] text-[#B9C4D1] hover:bg-[#25303C]"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        disabled={loading}
                                        onChange={handleFileChange}
                                        className="sr-only"
                                        aria-label="Choose campaign cover"
                                    />
                                </div>
                            </Section>

                            <div className="my-12 border-t border-[#293440]" />

                            <Section
                                icon={FileText}
                                title="Basic details"
                                description="Enter the information people will see on your campaign."
                            >
                                {input('title', 'Campaign title', {
                                    required: true,
                                    placeholder: 'Enter campaign title',
                                })}

                                <div className="grid min-w-0 gap-x-6 gap-y-7 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <label
                                            htmlFor={`campaign-${mode}-category`}
                                            className="mb-1.5 block text-[12px] font-medium text-[#C4CDD8]"
                                        >
                                            Category
                                            {!isEdit && (
                                                <span className="ml-1 text-[#D99A9F]">
                                                    *
                                                </span>
                                            )}
                                        </label>

                                        <select
                                            id={`campaign-${mode}-category`}
                                            value={form.category}
                                            required
                                            disabled={loading}
                                            onChange={(event) =>
                                                update(
                                                    'category',
                                                    event.target.value,
                                                )
                                            }
                                            className="h-11 w-full border border-[#343E4B] bg-[#151C25] px-3.5 text-[13px] text-[#EEF1F5] outline-none focus:border-[#8792A1]"
                                        >
                                            <option value="">
                                                Select category
                                            </option>

                                            {form.category &&
                                                !CATEGORIES.includes(
                                                    form.category,
                                                ) && (
                                                    <option
                                                        value={form.category}
                                                    >
                                                        {form.category}
                                                    </option>
                                                )}

                                            {CATEGORIES.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-2 text-[12px] font-medium text-[#C4CDD8]">
                                            Campaign scope
                                        </p>

                                        <div className="flex h-11 items-center border border-[#303A47] bg-[#1C2632] px-3.5 text-[13px] text-[#B8C5D4]">
                                            {isEdit
                                                ? String(
                                                      campaign?.type ||
                                                          'global_situation',
                                                  )
                                                      .replace(/_/g, ' ')
                                                      .replace(/\b\w/g, (c) =>
                                                          c.toUpperCase(),
                                                      )
                                                : 'Global'}
                                        </div>
                                    </div>
                                </div>

                                <TextareaField
                                    id={`campaign-${mode}-description`}
                                    label="Description"
                                    value={form.description}
                                    onChange={(event) =>
                                        update(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Describe the humanitarian situation and intended response..."
                                    rows={10}
                                    required
                                    showRequired={!isEdit}
                                    disabled={loading}
                                />
                            </Section>
                        </>
                    )}
                    {activeTab === 1 && (
                        <>
                            <Section
                                icon={MapPin}
                                title="Where help is needed"
                                description="Specify the location and communities this campaign supports."
                            >
                                <div className="grid min-w-0 gap-x-6 gap-y-7 sm:grid-cols-2">
                                    {input('district', 'District', {
                                        placeholder: 'Enter district',
                                    })}

                                    {input('location', 'Location', {
                                        required: true,
                                        placeholder: 'Affected region or area',
                                    })}
                                </div>

                                <TextareaField
                                    id={`campaign-${mode}-areas`}
                                    label="Affected areas"
                                    value={form.affected_areas}
                                    onChange={(event) =>
                                        update(
                                            'affected_areas',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Describe affected communities or areas..."
                                    rows={10}
                                    disabled={loading}
                                />
                            </Section>
                        </>
                    )}
                    {activeTab === 2 && (
                        <>
                            <Section
                                icon={Target}
                                title="Goal and timeline"
                                description="Set the fundraising goal and campaign dates."
                            >
                                {input('target_amount', 'Target amount (BDT)', {
                                    type: 'number',
                                    required: true,
                                    placeholder: 'Enter fundraising target',
                                })}

                                <div>
                                    <p className="mb-2.5 text-[12px] font-medium text-[#C4CDD8]">
                                        Campaign duration
                                    </p>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <DurationOption
                                            title="Set an end date"
                                            description="Closes on a planned date."
                                            selected={
                                                form.duration_type === 'fixed'
                                            }
                                            disabled={loading}
                                            onClick={() =>
                                                update('duration_type', 'fixed')
                                            }
                                        />

                                        <DurationOption
                                            title="Open-ended"
                                            description="Remains open until closed."
                                            selected={
                                                form.duration_type === 'open'
                                            }
                                            disabled={loading}
                                            onClick={() =>
                                                update('duration_type', 'open')
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid min-w-0 gap-x-6 gap-y-7 sm:grid-cols-2">
                                    {input('start_date', 'Start date', {
                                        type: 'date',
                                    })}

                                    {form.duration_type === 'fixed' &&
                                        input('end_date', 'End date', {
                                            type: 'date',
                                        })}
                                </div>
                            </Section>
                        </>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#303A47] bg-[#111821] px-5 py-4 sm:flex-row sm:justify-end sm:px-7 xl:px-9">
                <div className="flex flex-1 items-center justify-between gap-2 sm:justify-start">
                    <span className="hidden text-[11px] text-[#8792A1] sm:inline">
                        Section {activeTab + 1} of 3
                    </span>
                    <div className="flex gap-2 sm:ml-4">
                        {activeTab > 0 && (
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => switchTab(activeTab - 1)}
                                className="inline-flex h-10 items-center gap-1.5 border border-[#343E4B] px-3 text-[12px] text-[#C4CDD8] hover:bg-[#202A35]"
                            >
                                <ArrowLeft size={14} /> Previous
                            </button>
                        )}
                        {activeTab < 2 && (
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => switchTab(activeTab + 1)}
                                className="inline-flex h-10 items-center gap-1.5 border border-[#465568] bg-[#1C2835] px-3 text-[12px] text-[#DCE5EE] hover:bg-[#263647]"
                            >
                                Next <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    disabled={loading}
                    onClick={onCancel}
                    className="h-10 border border-[#343E4B] px-5 text-[12px] font-medium text-[#B8C2CF] hover:bg-[#202A35] disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center gap-2 border border-[#586678] bg-[#2B3949] px-5 text-[12px] font-semibold text-[#EEF1F5] hover:bg-[#37495D] disabled:opacity-50"
                >
                    {loading ? (
                        <LoadingUI
                            variant="button"
                            title={
                                isEdit
                                    ? 'Saving changes...'
                                    : 'Creating campaign...'
                            }
                            className="text-[12px] text-[#EEF1F5]"
                        />
                    ) : (
                        <>
                            {isEdit ? 'Save changes' : 'Create campaign'}
                            <ArrowRight size={15} />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

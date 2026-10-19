import React, { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    ImagePlus,
    Camera,
    Mail,
    Phone,
    Globe,
    ChevronDown,
    Save,
    Upload,
    Users,
    Target,
    BriefcaseBusiness,
    FileCheck2,
    AlertCircle,
} from 'lucide-react';
import {
    focusAreaOptions,
    communityOptions,
    teamSizeOptions,
    activityOptions,
    toArray,
    getStatusLabel,
} from '../utils/orgProfileUtils';

const sections = [
    { id: 'information', label: 'Basic information', icon: Building2 },
    { id: 'verification', label: 'Organization details', icon: FileCheck2 },
    { id: 'mission', label: 'Mission & purpose', icon: Target },
    { id: 'communities', label: 'Focus & communities', icon: Users },
    { id: 'team', label: 'Team & activities', icon: BriefcaseBusiness },
    { id: 'appearance', label: 'Organization banner', icon: ImagePlus },
];
const organizationTypes = [
    'NGO',
    'Non-profit',
    'Charity',
    'Foundation',
    'Community Organization',
    'Other',
];
const fieldStyle =
    'block h-[48px] w-full min-w-0 appearance-none rounded-none border border-[#343E4B] bg-[#1A222D] pl-10 pr-3.5 font-sans text-[14px] font-medium !text-[#DCE4ED] caret-[#DCE4ED] placeholder:!text-[#697586] outline-none transition-colors duration-150 hover:border-[#4B596A] focus:border-[#0F766E] focus:bg-[#1A222D] focus:ring-1 focus:ring-[#0F766E]/25 disabled:cursor-not-allowed disabled:opacity-50';
const labelStyle = 'mb-2 block text-[13px] font-medium !text-[#B8C0CA]';
const secondaryButtonClass =
    'inline-flex min-h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-4 text-[13px] font-medium !text-[#B8C0CA] transition-colors hover:border-[#4B596A] hover:bg-[#1A222D] hover:!text-[#EEF1F5] disabled:opacity-50';
const primaryButtonClass =
    'inline-flex min-h-10 items-center justify-center gap-2.5 border border-[#0F766E] bg-[#0F766E] px-5 text-[13px] font-semibold !text-white transition-colors hover:bg-[#115E59] disabled:opacity-50';

function Field({
    label,
    name,
    value,
    onChange,
    icon: Icon,
    className = '',
    required = false,
    disabled = false,
    ...props
}) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label htmlFor={`org-${name}`} className={labelStyle}>
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[#697586]"
                    />
                )}
                <input
                    {...props}
                    id={`org-${name}`}
                    name={name}
                    value={value ?? ''}
                    required={required}
                    disabled={disabled}
                    onChange={(event) => onChange(name, event.target.value)}
                    className={fieldStyle}
                />
            </div>
        </div>
    );
}
function Heading({ title, description }) {
    return (
        <div className="mb-7 border-b border-[#252D38] pb-5 sm:mb-8 sm:pb-6">
            <div className="flex items-start gap-3.5">
                <span className="mt-1 h-8 w-[3px] shrink-0 bg-[#0F766E]" />
                <div className="min-w-0">
                    <h3 className="m-0 text-[26px] font-semibold leading-[1.15] tracking-[-0.04em] !text-[#EEF1F5] sm:text-[30px]">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-2 max-w-lg text-[13px] leading-[1.7] !text-[#8792A1]">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Choices({ options, value, onChange, disabled = false }) {
    const selected = toArray(value);
    const known = new Set(options.map((option) => option.value));
    const all = [
        ...selected
            .filter((item) => !known.has(item))
            .map((item) => ({ value: item, label: item })),
        ...options,
    ];

    return (
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {all.map((option) => {
                const active = selected.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={disabled}
                        aria-pressed={active}
                        onClick={() =>
                            onChange(
                                active
                                    ? selected.filter(
                                          (item) => item !== option.value,
                                      )
                                    : [...selected, option.value],
                            )
                        }
                        className={`flex min-h-[48px] min-w-0 items-center gap-3 border px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50 ${
                            active
                                ? 'border-[#35424D] bg-[#1D2832]'
                                : 'border-[#252D38] bg-[#141B24] hover:border-[#3E4B59] hover:bg-[#1A242F]'
                        }`}
                    >
                        <span
                            className={`flex size-[17px] shrink-0 items-center justify-center border transition-colors ${
                                active
                                    ? 'border-[#0F766E] bg-[#0F766E] !text-white'
                                    : 'border-[#536070] bg-[#111820]'
                            }`}
                        >
                            {active && <Check size={12} strokeWidth={2.7} />}
                        </span>
                        <span
                            className={`min-w-0 break-words text-[13px] font-medium leading-5 ${active ? '!text-[#E2E8EE]' : '!text-[#A7B3C0]'}`}
                        >
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function ImageControl({
    field,
    label,
    image,
    pendingImage,
    uploadingImage,
    onUploadImage,
}) {
    const [failed, setFailed] = useState(false);
    const source = pendingImage?.preview || image;
    const banner = field === 'banner';
    const uploading = uploadingImage === field;
    return (
        <div className="min-w-0">
            <h4 className="mb-3 text-[13px] font-medium !text-[#B8C0CA]">
                {label}
            </h4>
            <div
                className={`flex items-center justify-center overflow-hidden border border-[#343E4B] bg-[#1A222D] ${banner ? 'aspect-[3/1] w-full min-h-[160px]' : 'h-[190px]'}`}
            >
                {source && !failed ? (
                    <img
                        key={source}
                        src={source}
                        alt={label}
                        onError={() => setFailed(true)}
                        onLoad={() => setFailed(false)}
                        className={
                            banner
                                ? 'h-full w-full object-contain'
                                : 'h-[136px] w-[136px] object-contain'
                        }
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 !text-[#8792A1]">
                        <ImagePlus size={26} strokeWidth={1.5} />
                        <span className="text-[12px]">
                            {banner ? 'No cover image' : 'No logo uploaded'}
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] !text-[#8792A1]">
                    JPG, PNG or WebP · Max 5 MB
                </p>
                <label
                    className={`inline-flex min-h-10 cursor-pointer items-center gap-2 border border-[#343E4B] bg-[#1A222D] px-4 text-[12px] font-medium !text-[#B8C0CA] transition-colors hover:border-[#4B596A] hover:bg-[#202A35] ${uploadingImage ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <Upload size={15} />
                    {uploading
                        ? 'Uploading...'
                        : source
                          ? 'Replace image'
                          : 'Upload image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={Boolean(uploadingImage)}
                        className="sr-only"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFailed(false);
                                onUploadImage(field, file);
                            }
                            e.target.value = '';
                        }}
                    />
                </label>
            </div>
            {pendingImage && (
                <p
                    role="status"
                    className="mt-3 flex items-center gap-2 text-[12px] !text-[#B8C0CA]"
                >
                    <Check size={14} className="text-[#2DD4BF]" />
                    Ready to apply when you save changes.
                </p>
            )}
        </div>
    );
}

export default function OrgProfileEdit({
    form,
    profile,
    saving,
    onChange,
    onSave,
    onCancel,
    onUploadImage,
    uploadingImage,
    pendingImages,
    imageUploadError,
    imageUploadSuccess,
}) {
    const [activeSection, setActiveSection] = useState('information');
    const busy = saving || Boolean(uploadingImage);
    const logo =
        pendingImages?.photo?.preview || profile?.photo || profile?.user?.photo;
    const sectionProps = { onChange };

    const [logoError, setLogoError] = useState(false);
    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogoError(false);
            onUploadImage('photo', file);
        }
        event.target.value = '';
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!busy) onSave(event);
    };
    return (
        <div className="min-w-0 pb-8 font-sans">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="mb-2 text-[12px] font-medium !text-[#8792A1]">
                        Organization{' '}
                        <span className="mx-2.5 text-[#343E4B]">/</span> Edit
                        profile
                    </p>
                    <h2 className="m-0 text-[28px] font-semibold leading-tight tracking-[-0.035em] !text-[#EEF1F5] sm:text-[31px]">
                        Edit profile
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={busy}
                    className={`${secondaryButtonClass} self-start sm:self-auto`}
                >
                    <ArrowLeft size={15} />
                    Back to profile
                </button>
            </div>
            <form
                onSubmit={handleSubmit}
                className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219] lg:h-[626px]"
            >
                <div className="grid min-w-0 grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="flex min-w-0 flex-col border-b border-[#252D38] bg-[#151C25] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <div className="px-5 pb-6 pt-7 sm:px-6 lg:pt-8">
                            <div className="flex min-w-0 flex-col gap-4">
                                <div className="relative shrink-0">
                                    <div className="flex size-28 items-center justify-center overflow-hidden border border-[#343E4B] bg-[#1A222D] text-[#EEF1F5]">
                                        {logo && !logoError ? (
                                            <img
                                                key={logo}
                                                src={logo}
                                                alt="Organization logo"
                                                className="size-full object-cover"
                                                onError={() =>
                                                    setLogoError(true)
                                                }
                                                onLoad={() =>
                                                    setLogoError(false)
                                                }
                                            />
                                        ) : (
                                            <Building2
                                                size={32}
                                                strokeWidth={1.5}
                                            />
                                        )}
                                    </div>
                                    <label
                                        title="Change organization logo"
                                        className={`absolute -bottom-1.5 left-21.5 flex size-8 cursor-pointer items-center justify-center border-2 border-[#151C25] bg-[#0F766E] !text-white transition-colors hover:bg-[#115E59] ${busy ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        <Camera size={14} />
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            disabled={busy}
                                            className="sr-only"
                                            aria-label="Change organization logo"
                                            onChange={handleLogoChange}
                                        />
                                    </label>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="mt-2 break-words text-[18px] font-semibold leading-snug !text-[#EEF1F5]">
                                        {form.name?.trim() ||
                                            'Your organization'}
                                    </h3>
                                    <p className="mt-1.5 break-all text-[12px] font-medium !text-[#B8C0CA]">
                                        {form.email || 'No email address'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-[#252D38] pt-5">
                                <label
                                    className={`inline-flex min-h-9 cursor-pointer items-center gap-2 border border-[#343E4B] bg-[#1A222D] px-3.5 text-[12px] font-medium !text-[#B8C0CA] transition-colors hover:bg-[#202A35] ${busy ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <Camera size={14} />
                                    {uploadingImage === 'photo'
                                        ? 'Uploading...'
                                        : logo
                                          ? 'Change logo'
                                          : 'Upload logo'}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        disabled={busy}
                                        className="sr-only"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                                <p className="mt-2.5 text-[11px] !text-[#697586]">
                                    JPG, PNG or WebP · Max 5 MB
                                </p>
                                {pendingImages?.photo && (
                                    <p className="mt-3 flex items-center gap-2 text-[12px] !text-[#B8C0CA]">
                                        <Check
                                            size={14}
                                            className="text-[#2DD4BF]"
                                        />
                                        Photo selected. Save to apply.
                                    </p>
                                )}
                            </div>
                        </div>
                        <nav
                            aria-label="Profile editor sections"
                            className="mt-auto border-t border-[#252D38] px-4 py-5 sm:px-5 lg:px-4 lg:py-6"
                        >
                            <p className="mb-3 px-2 text-[11px] font-semibold tracking-[0.11em] !text-[#697586]">
                                PROFILE SETTINGS
                            </p>
                            <div className="relative lg:hidden">
                                <select
                                    value={activeSection}
                                    onChange={(e) =>
                                        setActiveSection(e.target.value)
                                    }
                                    aria-label="Choose profile section"
                                    className="h-11 w-full appearance-none border border-[#343E4B] bg-[#1A222D] px-3.5 pr-10 text-[13px] font-medium !text-[#B8C0CA] outline-none focus:border-[#0F766E]"
                                >
                                    {sections.map((section) => (
                                        <option
                                            key={section.id}
                                            value={section.id}
                                        >
                                            {section.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8792A1]"
                                />
                            </div>
                            <div className="hidden space-y-1 lg:block">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const active = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveSection(section.id)
                                            }
                                            aria-current={
                                                active ? 'step' : undefined
                                            }
                                            className={`group relative flex min-h-[45px] w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${active ? 'bg-[#1A222D] !text-[#EEF1F5]' : '!text-[#8792A1] hover:bg-[#1A222D] hover:!text-[#B8C0CA]'}`}
                                        >
                                            {active && (
                                                <span className="absolute inset-y-2 left-0 w-[2px] bg-[#0F766E]" />
                                            )}
                                            <Icon
                                                size={17}
                                                strokeWidth={1.7}
                                                className={
                                                    active
                                                        ? '!text-[#2DD4BF]'
                                                        : '!text-[#697586]'
                                                }
                                            />
                                            <span className="min-w-0 text-[13px] font-medium leading-5">
                                                {section.label}
                                            </span>
                                            {active && (
                                                <span className="ml-auto size-1.5 shrink-0 bg-[#0F766E]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </aside>
                    <div className="flex min-w-0 flex-col bg-[#0E1219] lg:h-full lg:min-h-0">
                        <div className="min-w-0 flex-1 px-5 py-7 sm:px-7 sm:py-8 lg:overflow-y-auto lg:px-8 lg:py-9 xl:px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {activeSection === 'information' && (
                                <section>
                                    <Heading
                                        title="Basic information"
                                        description="The contact and identity details displayed on your organization profile."
                                    />
                                    <div className="grid min-w-0 gap-x-6 gap-y-6 sm:grid-cols-2">
                                        <Field
                                            label="Organization name"
                                            name="name"
                                            icon={Building2}
                                            className="sm:col-span-1"
                                            disabled={busy}
                                            value={form.name}
                                            required
                                            autoComplete="organization"
                                            placeholder="Organization name"
                                            {...sectionProps}
                                        />
                                        <Field
                                            label="Contact email"
                                            name="email"
                                            icon={Mail}
                                            disabled={busy}
                                            type="email"
                                            value={form.email}
                                            required
                                            autoComplete="email"
                                            placeholder="contact@example.org"
                                            {...sectionProps}
                                        />
                                        <Field
                                            label="Phone number"
                                            name="phone"
                                            icon={Phone}
                                            disabled={busy}
                                            type="tel"
                                            inputMode="numeric"
                                            value={form.phone}
                                            minLength={11}
                                            maxLength={11}
                                            pattern="01[0-9]{9}"
                                            title="Enter exactly 11 digits starting with 01"
                                            placeholder="01XXXXXXXXX"
                                            onChange={(name, value) =>
                                                onChange(
                                                    name,
                                                    value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 11),
                                                )
                                            }
                                        />
                                        <Field
                                            label="Website"
                                            name="website"
                                            icon={Globe}
                                            disabled={busy}
                                            type="url"
                                            value={form.website}
                                            placeholder="https://example.org"
                                            pattern="https?://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(:[0-9]{1,5})?(/[^\s]*)?"
                                            title="Enter a valid URL starting with http:// or https://"
                                            {...sectionProps}
                                        />
                                        <div className="min-w-0 sm:col-span-2">
                                            <label
                                                htmlFor="org-address"
                                                className={labelStyle}
                                            >
                                                Address
                                            </label>
                                            <textarea
                                                id="org-address"
                                                rows={3}
                                                value={form.address ?? ''}
                                                onChange={(e) =>
                                                    onChange(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter your office address"
                                                className={`${fieldStyle} !h-auto min-h-[110px] resize-y py-3.5 !pl-4 leading-6`}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}
                            {activeSection === 'verification' && (
                                <section>
                                    <Heading
                                        title="Organization details"
                                        description="Your organization classification and official account record."
                                    />
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <p className={labelStyle}>
                                            Organization type
                                        </p>
                                        <span className="text-[12px] !text-[#788797]">
                                            Choose one
                                        </span>
                                    </div>
                                    <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                                        {organizationTypes.map((type) => {
                                            const selected =
                                                (form.organization_type ??
                                                    profile?.organization_type ??
                                                    '') === type;
                                            return (
                                                <label
                                                    key={type}
                                                    className={`flex min-h-[54px] min-w-0 cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${
                                                        selected
                                                            ? 'border-[#3B4B58] bg-[#1E2934]'
                                                            : 'border-[#252D38] bg-[#141B24] hover:border-[#465464] hover:bg-[#1B2530]'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="organization_type"
                                                        value={type}
                                                        checked={selected}
                                                        onChange={() =>
                                                            onChange(
                                                                'organization_type',
                                                                type,
                                                            )
                                                        }
                                                        disabled={busy}
                                                        className="sr-only peer"
                                                    />
                                                    <span
                                                        className={`flex size-[17px] shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#0F766E]' : 'border-[#536070]'}`}
                                                    >
                                                        {selected && (
                                                            <span className="size-[7px] rounded-full bg-[#2DD4BF]" />
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`min-w-0 break-words text-[13px] font-medium ${selected ? '!text-[#E5EBF1]' : '!text-[#AAB7C4]'}`}
                                                    >
                                                        {type}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-8 border-t border-[#252D38] pt-6">
                                        <p className="mb-5 text-[13px] font-medium !text-[#C5CFDA]">
                                            Official record
                                        </p>
                                        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                                            <div className="min-w-0">
                                                <dt className="text-[12px] !text-[#8792A1]">
                                                    Registration number
                                                </dt>
                                                <dd className="mt-2 break-all text-[14px] font-medium !text-[#D5DEE7]">
                                                    {profile?.registration_number ||
                                                        'Not provided'}
                                                </dd>
                                            </div>
                                            <div className="min-w-0">
                                                <dt className="text-[12px] !text-[#8792A1]">
                                                    Verification status
                                                </dt>
                                                <dd className="mt-2 flex items-center gap-2 text-[14px] font-medium !text-[#D5DEE7]">
                                                    <FileCheck2
                                                        size={16}
                                                        className="shrink-0 !text-[#8792A1]"
                                                    />
                                                    {getStatusLabel(
                                                        profile?.verification_status,
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                        <p className="mt-5 text-[12px] leading-5 !text-[#788797]">
                                            Registration and verification
                                            details are managed by the platform.
                                        </p>
                                    </div>
                                </section>
                            )}
                            {activeSection === 'mission' && (
                                <section>
                                    <Heading
                                        title="Mission & purpose"
                                        description="Explain what your organization does and the impact it aims to make."
                                    />
                                    <label
                                        htmlFor="org-mission"
                                        className={labelStyle}
                                    >
                                        Mission statement
                                    </label>
                                    <textarea
                                        id="org-mission"
                                        rows={8}
                                        value={form.mission ?? ''}
                                        onChange={(e) =>
                                            onChange('mission', e.target.value)
                                        }
                                        placeholder="Describe your organization's mission..."
                                        className={`${fieldStyle} !h-auto min-h-[220px] resize-y py-4 leading-7 !pl-4`}
                                    />
                                </section>
                            )}
                            {activeSection === 'communities' && (
                                <section>
                                    <Heading
                                        title="Focus & communities"
                                        description="Choose the causes you work on and the people your organization serves."
                                    />
                                    <div className="space-y-8">
                                        <div className="min-w-0">
                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-[15px] font-semibold !text-[#D3DDE7]">
                                                    Focus areas
                                                </h4>
                                                <span className="text-[12px] tabular-nums !text-[#90A0B0]">
                                                    {
                                                        toArray(
                                                            form.focus_areas,
                                                        ).length
                                                    }{' '}
                                                    selected
                                                </span>
                                            </div>
                                            <Choices
                                                options={focusAreaOptions}
                                                disabled={busy}
                                                value={form.focus_areas}
                                                onChange={(v) =>
                                                    onChange('focus_areas', v)
                                                }
                                            />
                                        </div>
                                        <div className="min-w-0 border-t border-[#252D38] pt-8">
                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                                <h4 className="text-[15px] font-semibold !text-[#D3DDE7]">
                                                    Communities served
                                                </h4>
                                                <span className="text-[12px] tabular-nums !text-[#90A0B0]">
                                                    {
                                                        toArray(
                                                            form.communities_served,
                                                        ).length
                                                    }{' '}
                                                    selected
                                                </span>
                                            </div>
                                            <Choices
                                                options={communityOptions}
                                                disabled={busy}
                                                value={form.communities_served}
                                                onChange={(v) =>
                                                    onChange(
                                                        'communities_served',
                                                        v,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}
                            {activeSection === 'team' && (
                                <section>
                                    <Heading
                                        title="Team & activities"
                                        description="Describe the people behind your work and the activities you carry out."
                                    />
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <p className={labelStyle}>Team size</p>
                                        <span className="text-[12px] !text-[#788797]">
                                            Select your range
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-5">
                                        {teamSizeOptions.map((option) => {
                                            const active =
                                                form.team_size === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    disabled={busy}
                                                    aria-pressed={active}
                                                    onClick={() =>
                                                        onChange(
                                                            'team_size',
                                                            active
                                                                ? ''
                                                                : option.value,
                                                        )
                                                    }
                                                    className={`flex min-h-[50px] min-w-0 items-center justify-center gap-2 border px-2 py-2 text-center text-[13px] font-medium transition-colors disabled:opacity-50 ${
                                                        active
                                                            ? 'border-[#3B4B58] bg-[#1E2934] !text-[#E5EBF1]'
                                                            : 'border-[#252D38] bg-[#141B24] !text-[#AAB7C4] hover:border-[#465464] hover:bg-[#1B2530]'
                                                    }`}
                                                >
                                                    {active && (
                                                        <Check
                                                            size={14}
                                                            className="shrink-0 !text-[#2DD4BF]"
                                                        />
                                                    )}
                                                    <span>{option.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-8 border-t border-[#252D38] pt-7">
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <p className={labelStyle}>
                                                Primary activities
                                            </p>
                                            <span className="text-[12px] tabular-nums !text-[#788797]">
                                                {
                                                    toArray(
                                                        form.primary_activities,
                                                    ).length
                                                }{' '}
                                                selected
                                            </span>
                                        </div>
                                        <Choices
                                            options={activityOptions}
                                            value={form.primary_activities}
                                            disabled={busy}
                                            onChange={(v) =>
                                                onChange(
                                                    'primary_activities',
                                                    v,
                                                )
                                            }
                                        />
                                    </div>
                                </section>
                            )}
                            {activeSection === 'appearance' && (
                                <section>
                                    <Heading
                                        title="Organization banner"
                                        description="Update the cover image displayed on your organization's public profile."
                                    />
                                    <div className="w-full min-w-0">
                                        <ImageControl
                                            field="banner"
                                            label="Cover banner"
                                            image={profile?.banner || ''}
                                            pendingImage={pendingImages?.banner}
                                            uploadingImage={uploadingImage}
                                            onUploadImage={onUploadImage}
                                        />
                                        <p className="mt-5 text-[12px] leading-6 !text-[#8792A1]">
                                            Use a wide, high-quality image that
                                            represents your organization's work.
                                            Recommended: a wide landscape
                                            banner.
                                        </p>
                                    </div>
                                </section>
                            )}
                            {(imageUploadError ||
                                imageUploadSuccess ||
                                uploadingImage) && (
                                <div
                                    className="mt-6 space-y-2"
                                    aria-live="polite"
                                >
                                    {uploadingImage && (
                                        <p className="text-[12px] !text-[#AAB7C4]">
                                            Uploading{' '}
                                            {uploadingImage === 'photo'
                                                ? 'logo'
                                                : 'banner'}
                                            ...
                                        </p>
                                    )}
                                    {imageUploadError && (
                                        <p
                                            role="alert"
                                            className="flex items-center gap-2 text-[12px] text-red-300"
                                        >
                                            <AlertCircle size={15} />
                                            {imageUploadError}
                                        </p>
                                    )}
                                    {imageUploadSuccess && (
                                        <p className="flex items-center gap-2 text-[12px] !text-[#AAB7C4]">
                                            <CheckCircle2 size={15} />
                                            {imageUploadSuccess}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <footer className="mt-auto flex shrink-0 flex-col-reverse gap-3 border-t border-[#252D38] bg-[#151C25] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8 xl:px-10">
                            <p className="hidden text-[12px] !text-[#697586] sm:block">
                                Make sure your details are up to date.
                            </p>
                            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={onCancel}
                                    className={secondaryButtonClass}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={busy}
                                    className={primaryButtonClass}
                                >
                                    <Save size={15} />
                                    {saving
                                        ? 'Saving changes...'
                                        : 'Save changes'}
                                </button>
                            </div>
                        </footer>
                    </div>
                </div>
            </form>
        </div>
    );
}

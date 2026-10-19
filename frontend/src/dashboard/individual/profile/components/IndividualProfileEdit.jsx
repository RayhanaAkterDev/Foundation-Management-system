import React, { useState } from 'react';

import {
    ArrowLeft,
    CalendarDays,
    Camera,
    Check,
    ChevronDown,
    HeartHandshake,
    Mail,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    UserRound,
} from 'lucide-react';

/* =========================================================
   OPTIONS
========================================================= */

const PARTICIPATION_OPTIONS = [
    {
        value: 'volunteer',
        label: 'Volunteer',
        description: 'Contribute time and skills',
        icon: HeartHandshake,
    },
    {
        value: 'donor',
        label: 'Donor',
        description: 'Support meaningful causes',
        icon: Sparkles,
    },
    {
        value: 'hr',
        label: 'Help Requester',
        description: 'Request assistance',
        icon: ShieldCheck,
    },
];

const CATEGORY_OPTIONS = [
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'food-assistance', label: 'Food Assistance' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'livelihood', label: 'Livelihood' },
    { value: 'disaster-relief', label: 'Disaster Relief' },
    { value: 'water-sanitation', label: 'Water & Sanitation' },
    { value: 'child-support', label: 'Child Support' },
    { value: 'women-support', label: 'Women Support' },
    { value: 'disability-support', label: 'Disability Support' },
    { value: 'emergency-relief', label: 'Emergency Relief' },
    { value: 'other', label: 'Other Causes' },
];

const SECTIONS = [
    {
        id: 'details',
        label: 'Personal details',
        eyebrow: 'YOUR INFORMATION',
        title: 'Personal details',
        description: 'Manage your name and contact information.',
        icon: UserRound,
    },
    {
        id: 'location',
        label: 'Location',
        eyebrow: 'YOUR LOCATION',
        title: 'Location details',
        description: 'Update the location associated with your profile.',
        icon: MapPin,
    },
    {
        id: 'preferences',
        label: 'Participation',
        eyebrow: 'YOUR INVOLVEMENT',
        title: 'Participation',
        description: 'Choose how you want to contribute or receive support.',
        icon: HeartHandshake,
    },
    {
        id: 'causes',
        label: 'Causes of interest',
        eyebrow: 'YOUR INTERESTS',
        title: 'Causes of interest',
        description: 'Select the causes you would like to support.',
        icon: SlidersHorizontal,
    },
];

/* =========================================================
   SHARED STYLES — MATCH ADMIN INPUT UI
========================================================= */

const inputClass = `
    block h-[48px] w-full min-w-0
    appearance-none rounded-none
    border border-[#343E4B]
    bg-[#1A222D]
    pl-10 pr-3.5
    font-sans text-[14px] font-medium!
    !text-[#DCE4ED]
    caret-[#DCE4ED]
    outline-none
    placeholder:!text-[#697586]
    transition-colors duration-150
    hover:border-[#4B596A]
    focus:border-[#0F766E]
    focus:bg-[#1A222D]
    focus:ring-1 focus:ring-[#0F766E]/25
    disabled:cursor-not-allowed
    disabled:opacity-50
`;

const secondaryButtonClass = `
    inline-flex min-h-10 items-center justify-center
    gap-2 border border-[#343E4B]
    bg-transparent px-4
    text-[13px] font-medium! !text-[#B8C0CA]
    transition-colors duration-150
    hover:border-[#4B596A]
    hover:bg-[#1A222D]
    hover:!text-[#EEF1F5]
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-[#0F766E]
    disabled:cursor-not-allowed
    disabled:opacity-50
`;

const primaryButtonClass = `
    inline-flex min-h-10 items-center justify-center
    gap-2.5 border border-[#0F766E]
    bg-[#0F766E] px-5
    text-[13px] font-semibold! !text-white
    transition-colors duration-150
    hover:border-[#115E59]
    hover:bg-[#115E59]
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-[#0F766E]
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[#151C25]
    disabled:cursor-not-allowed
    disabled:opacity-50
`;

/* =========================================================
   HELPERS
========================================================= */

function toArray(value) {
    if (Array.isArray(value)) return value;

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Fall back to delimiter parsing.
        }

        return value
            .split(/[,;|]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

/* =========================================================
   FORM FIELD — MATCH ADMIN PROFILE EDITOR
========================================================= */

function Field({
    label,
    name,
    value,
    onChange,
    icon: Icon,
    className = '',
    hint,
    required = false,
    disabled = false,
    ...props
}) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label
                htmlFor={`individual-${name}`}
                className="
                    mb-2 block text-[13px]
                    font-medium! !text-[#B8C0CA]
                "
            >
                {label}

                {required && <span className="ml-1 !text-[#E5A083]">*</span>}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className="
                            pointer-events-none absolute
                            left-3.5 top-1/2
                            -translate-y-1/2
                            !text-[#697586]
                        "
                    />
                )}

                <input
                    {...props}
                    id={`individual-${name}`}
                    name={name}
                    value={value ?? ''}
                    required={required}
                    disabled={disabled}
                    onChange={(event) => onChange(name, event.target.value)}
                    className={inputClass}
                />
            </div>

            {hint && (
                <p className="mt-2 text-[12px] leading-5 !text-[#8792A1]">
                    {hint}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ title, description }) {
    return (
        <div className="mb-7 border-b border-[#252D38] pb-5 sm:mb-8 sm:pb-6">
            <div className="flex items-start gap-3.5">
                <span className="mt-1 h-8 w-[3px] shrink-0 bg-[#0F766E]" />

                <div className="min-w-0">
                    <h3 className="m-0 text-[26px] font-semibold! leading-[1.15] tracking-[-0.04em] text-[#EEF1F5]! sm:text-[30px]">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-2 max-w-lg text-[13px] leading-[1.7] text-[#8792A1]">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PARTICIPATION OPTION
========================================================= */

function ParticipationChoice({ option, selected, onClick, disabled }) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={selected}
            className={`
                group relative flex min-w-0
                items-start gap-3.5 border p-4
                text-left transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0F766E]
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                    selected
                        ? 'border-[#0F766E] bg-[#1A292A]'
                        : 'border-[#252D38] bg-[#151C25] hover:border-[#4B596A] hover:bg-[#1A222D]'
                }
            `}
        >
            <span
                className={`
                    flex size-10 shrink-0
                    items-center justify-center border
                    ${
                        selected
                            ? 'border-[#285A56] bg-[#134E4A] !text-[#BCE9E2]'
                            : 'border-[#343E4B] bg-[#1A222D] !text-[#9AA6B5]'
                    }
                `}
            >
                <Icon size={19} strokeWidth={1.7} />
            </span>

            <span className="min-w-0 flex-1 pt-0.5">
                <span className="block text-[14px] font-semibold! !text-[#EEF1F5]">
                    {option.label}
                </span>

                <span className="mt-1 block text-[12px] leading-5 !text-[#8792A1]">
                    {option.description}
                </span>
            </span>

            <span
                className={`
                    mt-1 flex size-[18px] shrink-0
                    items-center justify-center border
                    ${
                        selected
                            ? 'border-[#0F766E] bg-[#0F766E] !text-white'
                            : 'border-[#4B596A]'
                    }
                `}
            >
                {selected && <Check size={12} strokeWidth={3} />}
            </span>
        </button>
    );
}

/* =========================================================
   CAUSE OPTION
========================================================= */

function CauseChoice({ option, selected, onClick, disabled }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={selected}
            className={`
                flex min-h-[46px] min-w-0
                items-center justify-between gap-3
                border px-3.5 py-2.5 text-left
                transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0F766E]
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${
                    selected
                        ? 'border-[#0F766E] bg-[#1A292A]'
                        : 'border-[#252D38] bg-[#151C25] hover:border-[#4B596A] hover:bg-[#1A222D]'
                }
            `}
        >
            <span
                className={`
                    min-w-0 text-[13px]
                    font-medium! leading-5
                    ${selected ? '!text-[#EEF1F5]' : '!text-[#B8C0CA]'}
                `}
            >
                {option.label}
            </span>

            <span
                className={`
                    flex size-[17px] shrink-0
                    items-center justify-center border
                    ${
                        selected
                            ? 'border-[#0F766E] bg-[#0F766E] !text-white'
                            : 'border-[#4B596A]'
                    }
                `}
            >
                {selected && <Check size={11} strokeWidth={3} />}
            </span>
        </button>
    );
}

/* =========================================================
   PROFILE IDENTITY
========================================================= */

function ProfileIdentity({
    form,
    photoPreview,
    uploadingPhoto,
    busy,
    onPhotoUpload,
}) {
    const [photoError, setPhotoError] = useState(false);

    const savedPhoto = typeof form.photo === 'string' ? form.photo.trim() : '';

    const photo = photoPreview || savedPhoto;
    const hasPhoto = Boolean(photo) && !photoError;

    const initial = form.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (file && onPhotoUpload) {
            setPhotoError(false);
            onPhotoUpload(file);
        }

        event.target.value = '';
    };

    return (
        <div className="px-5 pb-6 pt-7 sm:px-6 lg:px-6 lg:pt-8">
            <div className="flex min-w-0 flex-col gap-4">
                <div className="relative shrink-0">
                    <div
                        className="
                            flex size-28 items-center justify-center
                            overflow-hidden border border-[#343E4B]
                            bg-[#1A222D] text-[30px] font-semibold!
                            !text-[#EEF1F5]
                        "
                    >
                        {hasPhoto ? (
                            <img
                                key={photo}
                                src={photo}
                                alt="Profile"
                                className="size-full object-cover"
                                onError={() => setPhotoError(true)}
                                onLoad={() => setPhotoError(false)}
                            />
                        ) : (
                            <span>{initial}</span>
                        )}
                    </div>

                    <label
                        title="Change profile photo"
                        className={`
                            absolute -bottom-1.5 left-21.5
                            flex size-8 cursor-pointer items-center
                            justify-center border-2 border-[#151C25]
                            bg-[#0F766E] !text-white
                            transition-colors hover:bg-[#115E59]
                            ${busy ? 'pointer-events-none opacity-50' : ''}
                        `}
                    >
                        <Camera size={14} strokeWidth={1.8} />

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={busy}
                            onChange={handleFileChange}
                            className="sr-only"
                            aria-label="Change profile photo"
                        />
                    </label>
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="mt-2 break-words text-[18px] font-semibold! leading-snug !text-[#EEF1F5]">
                        {form.name?.trim() || 'Your profile'}
                    </h3>

                    <p className="mt-1.5 break-all text-[12px] font-medium! !text-[#B8C0CA]">
                        {form.email || 'No email address'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-[#252D38] pt-5">
                <label
                    className={`
                        inline-flex min-h-9 cursor-pointer
                        items-center justify-center gap-2
                        border border-[#343E4B] bg-[#1A222D]
                        px-3.5 text-[12px] font-medium! !text-[#B8C0CA]
                        transition-colors hover:border-[#4B596A]
                        hover:bg-[#202A35] hover:!text-[#EEF1F5]
                        ${busy ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <Camera size={14} strokeWidth={1.8} />

                    {uploadingPhoto
                        ? 'Uploading...'
                        : photo
                          ? 'Change photo'
                          : 'Upload photo'}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy}
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                </label>

                <p className="mt-2.5 text-[11px] !text-[#697586]">
                    JPG, PNG or WebP
                </p>

                {photoPreview && !uploadingPhoto && (
                    <p
                        role="status"
                        className="mt-3 flex items-center gap-2 text-[12px] !text-[#B8C0CA]"
                    >
                        <Check size={14} className="!text-[#0F766E]" />
                        Photo selected. Save to apply.
                    </p>
                )}

                {uploadingPhoto && (
                    <p
                        role="status"
                        className="mt-3 text-[12px] !text-[#B8C0CA]"
                    >
                        Preparing your photo...
                    </p>
                )}
            </div>
        </div>
    );
}

/* =========================================================
   EDITOR NAVIGATION
========================================================= */

function EditorNavigation({ activeSection, onSectionChange }) {
    return (
        <nav
            aria-label="Profile editor sections"
            className="border-t border-[#252D38] px-4 py-5 sm:px-5 lg:px-4 lg:py-6"
        >
            <p className="mb-3 px-2 text-[11px] font-semibold! tracking-[0.11em] !text-[#697586]">
                PROFILE SETTINGS
            </p>

            <div className="relative lg:hidden">
                <select
                    value={activeSection}
                    onChange={(event) => onSectionChange(event.target.value)}
                    aria-label="Choose profile section"
                    className="
                        h-11 w-full appearance-none border
                        border-[#343E4B] bg-[#1A222D]
                        px-3.5 pr-10 text-[13px] font-medium!
                        !text-[#B8C0CA] outline-none
                        focus:border-[#0F766E]
                    "
                >
                    {SECTIONS.map((section) => (
                        <option key={section.id} value={section.id}>
                            {section.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={16}
                    className="
                        pointer-events-none absolute right-3.5
                        top-1/2 -translate-y-1/2 text-[#8792A1]
                    "
                />
            </div>

            <div className="hidden space-y-1 lg:block">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const active = section.id === activeSection;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSectionChange(section.id)}
                            aria-current={active ? 'step' : undefined}
                            className={`
                                group relative flex min-h-[45px] w-full
                                items-center gap-3 px-3 py-2.5
                                text-left transition-colors duration-150
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-[#0F766E]
                                ${
                                    active
                                        ? 'bg-[#1A222D] !text-[#EEF1F5]'
                                        : '!text-[#8792A1] hover:bg-[#1A222D] hover:!text-[#B8C0CA]'
                                }
                            `}
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

                            <span className="min-w-0 text-[13px] font-medium! leading-5">
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
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IndividualProfileEdit({
    form,
    saving,
    uploadingPhoto = false,
    photoPreview = '',
    onPhotoUpload,
    onChange,
    onSave,
    onCancel,
}) {
    const [activeSection, setActiveSection] = useState('details');

    const busy = saving || uploadingPhoto;

    const currentSection =
        SECTIONS.find((section) => section.id === activeSection) || SECTIONS[0];

    const participationPreferences = toArray(form.participation_preferences);

    const categoryPreferences = toArray(form.category_preferences);

    const togglePreference = (field, currentValues, value) => {
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        onChange(field, nextValues);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!busy) {
            onSave(event);
        }
    };

    return (
        <div className="min-w-0 pb-8 font-sans">
            {/* PAGE HEADING */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="mb-2 text-[12px] font-medium! !text-[#8792A1]">
                        Individual
                        <span className="mx-2.5 text-[#343E4B]">/</span>
                        Edit profile
                    </p>

                    <h2 className="m-0 text-[28px] font-semibold! leading-tight tracking-[-0.035em] !text-[#EEF1F5] sm:text-[31px]">
                        Edit profile
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={busy}
                    className={`${secondaryButtonClass} self-start sm:self-auto`}
                >
                    <ArrowLeft size={15} strokeWidth={1.8} />
                    Back to profile
                </button>
            </div>

            {/* FIXED-HEIGHT EDITOR */}

            <form
                onSubmit={handleSubmit}
                className="
                    min-w-0 overflow-hidden
                    border border-[#252D38]
                    bg-[#0E1219]
                    lg:h-[626px]
                "
            >
                <div
                    className="
                        grid min-w-0 grid-cols-1 items-stretch
                        lg:h-full lg:min-h-0
                        lg:grid-cols-[270px_minmax(0,1fr)]
                        xl:grid-cols-[300px_minmax(0,1fr)]
                    "
                >
                    {/* LEFT SIDEBAR */}

                    <aside
                        className="
                            flex min-w-0 flex-col
                            border-b border-[#252D38]
                            bg-[#151C25]
                            lg:h-full lg:min-h-0
                            lg:overflow-y-auto
                            lg:border-b-0 lg:border-r
                        "
                    >
                        <ProfileIdentity
                            form={form}
                            photoPreview={photoPreview}
                            uploadingPhoto={uploadingPhoto}
                            busy={busy}
                            onPhotoUpload={onPhotoUpload}
                        />

                        <div className="mt-auto">
                            <EditorNavigation
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            />
                        </div>
                    </aside>

                    {/* RIGHT EDITOR PANEL */}

                    <div className="flex min-w-0 flex-col bg-[#0E1219] lg:h-full lg:min-h-0">
                        {/* ONLY THIS AREA SCROLLS */}

                        <div
                            className="
                                min-w-0 flex-1 px-5 py-7
                                sm:px-7 sm:py-8
                                lg:overflow-y-auto
                                lg:px-8 lg:py-9 xl:px-10
                            "
                        >
                            <SectionHeading
                                title={currentSection.title}
                                description={currentSection.description}
                            />

                            {/* PERSONAL DETAILS */}

                            <section
                                hidden={activeSection !== 'details'}
                                aria-label="Personal details"
                            >
                                <div className="grid min-w-0 gap-x-6 gap-y-6 sm:grid-cols-2 xl:gap-x-8">
                                    <Field
                                        label="Full name"
                                        name="name"
                                        icon={UserRound}
                                        type="text"
                                        value={form.name}
                                        onChange={onChange}
                                        required
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        disabled={busy}
                                        className="sm:col-span-2"
                                    />

                                    <Field
                                        label="Email address"
                                        name="email"
                                        icon={Mail}
                                        type="email"
                                        value={form.email}
                                        onChange={onChange}
                                        required
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        disabled={busy}
                                    />

                                    <Field
                                        label="Phone number"
                                        name="phone"
                                        icon={Phone}
                                        type="tel"
                                        inputMode="numeric"
                                        value={form.phone}
                                        onChange={(name, value) =>
                                            onChange(
                                                name,
                                                value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 11),
                                            )
                                        }
                                        placeholder="01XXXXXXXXX"
                                        minLength={11}
                                        maxLength={11}
                                        pattern="01[0-9]{9}"
                                        title="Enter exactly 11 digits starting with 01"
                                        autoComplete="tel"
                                        disabled={busy}
                                    />

                                    <Field
                                        label="Date of birth"
                                        name="date_of_birth"
                                        icon={CalendarDays}
                                        type="date"
                                        max={new Date()
                                            .toISOString()
                                            .slice(0, 10)}
                                        value={form.date_of_birth}
                                        onChange={onChange}
                                        disabled={busy}
                                        className="sm:col-span-2"
                                    />
                                </div>

                                <div className="mt-7 flex items-start gap-3 border-t border-[#252D38] pt-5">
                                    <ShieldCheck
                                        size={17}
                                        strokeWidth={1.7}
                                        className="mt-0.5 shrink-0 !text-[#8792A1]"
                                    />

                                    <p className="text-[12px] leading-6 !text-[#8792A1]">
                                        Changing your email address may require
                                        verification and signing in again.
                                    </p>
                                </div>
                            </section>

                            {/* LOCATION */}

                            <section
                                hidden={activeSection !== 'location'}
                                aria-label="Location"
                            >
                                <div className="max-w-2xl space-y-6">
                                    <Field
                                        label="District"
                                        name="district"
                                        icon={MapPin}
                                        value={form.district}
                                        onChange={onChange}
                                        placeholder="Enter your district"
                                        autoComplete="address-level2"
                                        disabled={busy}
                                    />

                                    <div>
                                        <label
                                            htmlFor="individual-address"
                                            className="
                                                mb-2 block text-[13px]
                                                font-medium! !text-[#B8C0CA]
                                            "
                                        >
                                            Address
                                        </label>

                                        <div className="relative">
                                            <MapPin
                                                size={16}
                                                strokeWidth={1.7}
                                                className="
                                                    pointer-events-none absolute
                                                    left-3.5 top-4
                                                    !text-[#697586]
                                                "
                                            />

                                            <textarea
                                                id="individual-address"
                                                name="address"
                                                rows={4}
                                                value={form.address ?? ''}
                                                onChange={(event) =>
                                                    onChange(
                                                        'address',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Enter your address"
                                                disabled={busy}
                                                className={`
                                                    ${inputClass}
                                                    !h-auto min-h-[124px]
                                                    resize-y !py-3.5
                                                    leading-6
                                                `}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* PARTICIPATION */}

                            <section
                                hidden={activeSection !== 'preferences'}
                                aria-label="Participation"
                            >
                                <div className="grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                    {PARTICIPATION_OPTIONS.map((option) => (
                                        <ParticipationChoice
                                            key={option.value}
                                            option={option}
                                            disabled={busy}
                                            selected={participationPreferences.includes(
                                                option.value,
                                            )}
                                            onClick={() =>
                                                togglePreference(
                                                    'participation_preferences',
                                                    participationPreferences,
                                                    option.value,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* CAUSES OF INTEREST */}

                            <section
                                hidden={activeSection !== 'causes'}
                                aria-label="Causes of interest"
                            >
                                <div className="grid min-w-0 gap-2.5 sm:grid-cols-2 2xl:grid-cols-3">
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <CauseChoice
                                            key={option.value}
                                            option={option}
                                            disabled={busy}
                                            selected={categoryPreferences.includes(
                                                option.value,
                                            )}
                                            onClick={() =>
                                                togglePreference(
                                                    'category_preferences',
                                                    categoryPreferences,
                                                    option.value,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* STATIONARY FOOTER */}

                        <div
                            className="
                                mt-auto shrink-0 flex flex-col-reverse gap-3
                                border-t border-[#252D38]
                                bg-[#151C25] px-5 py-4
                                sm:flex-row sm:items-center
                                sm:justify-between sm:px-7
                                lg:px-8 xl:px-10
                            "
                        >
                            <p className="hidden text-[12px] !text-[#697586] sm:block">
                                Make sure your details are up to date.
                            </p>

                            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={busy}
                                    className={secondaryButtonClass}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={busy}
                                    className={primaryButtonClass}
                                >
                                    <Save size={15} strokeWidth={1.8} />

                                    {saving
                                        ? 'Saving changes...'
                                        : 'Save changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

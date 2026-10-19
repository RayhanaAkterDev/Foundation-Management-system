import React, { useState } from 'react';

import {
    ArrowLeft,
    CalendarDays,
    Camera,
    Check,
    CheckCircle2,
    ChevronRight,
    HeartHandshake,
    ImagePlus,
    MapPin,
    Save,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Upload,
    UserRound,
} from 'lucide-react';

/* =========================================================
   DESIGN SYSTEM
========================================================= */

const UI = {
    surface: '#111720',
    content: '#0E1219',
    raised: '#171E27',
    raisedHover: '#202A35',
    border: '#303A47',
    borderStrong: '#465364',
    text: '#DDE4EC',
    muted: '#9AA6B5',
};

/*
 * Explicitly reset browser and global CSS focus styles.
 * Focus changes are limited to the intended dashboard colors.
 */
const inputClass = `
    peer block h-[52px] w-full min-w-0
    appearance-none
    rounded-none
    border-0 border-b border-[#3B4654]
    bg-[#171E27]
    px-4 pt-4 pb-2
    text-[14px] font-medium
    !text-[#DCE4ED]
    shadow-none
    outline-none
    ring-0
    transition-[background-color,border-color]
    duration-200

    placeholder:!text-[#738191]

    hover:bg-[#1C2530]
    hover:border-[#627285]

    focus:!border-b-[#A4B5C6]
    focus:!bg-[#202A35]
    focus:!outline-none
    focus:!shadow-none
    focus:!ring-0
    focus:!ring-offset-0

    focus-visible:!outline-none
    focus-visible:!shadow-none
    focus-visible:!ring-0
    focus-visible:!ring-offset-0

    disabled:cursor-not-allowed
    disabled:opacity-50
`;

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
        icon: UserRound,
        number: '01',
    },
    {
        id: 'location',
        label: 'Location',
        icon: MapPin,
        number: '02',
    },
    {
        id: 'preferences',
        label: 'Participation',
        icon: HeartHandshake,
        number: '03',
    },
    {
        id: 'causes',
        label: 'Causes of interest',
        icon: SlidersHorizontal,
        number: '04',
    },
];

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
            // Fall through to delimiter parsing.
        }

        return value
            .split(/[,;|]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function formatMemberSince(value) {
    if (!value) return 'Not available';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Not available';
    }

    return date.toLocaleDateString('en-BD', {
        month: 'short',
        year: 'numeric',
    });
}

/* =========================================================
   FORM FIELD
========================================================= */

function Field({
    label,
    name,
    value,
    onChange,
    className = '',
    hint,
    ...props
}) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label
                htmlFor={`individual-${name}`}
                className="
                    mb-2.5 flex items-center gap-1
                    text-[13px] font-medium
                    !text-[#B3BFCC]
                "
            >
                {label}

                {props.required && <span className="!text-[#E79B75]">*</span>}
            </label>

            <input
                id={`individual-${name}`}
                name={name}
                value={value ?? ''}
                onChange={(event) => onChange(name, event.target.value)}
                className={inputClass}
                {...props}
            />

            {hint && <p className="mt-2 text-[12px] !text-[#8794A4]">{hint}</p>}
        </div>
    );
}

/* =========================================================
   EDITOR SECTION HEADER
========================================================= */

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mb-9">
            <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[#8294A6]" />

                <span
                    className="
                        text-[11px] font-semibold
                        uppercase tracking-[0.12em]
                        !text-[#A3B0BE]
                    "
                >
                    {eyebrow}
                </span>
            </div>

            <h3
                className="
                    text-[24px] font-semibold
                    leading-tight tracking-[-0.025em]
                    !text-[#E1E7EE]
                    sm:text-[28px]
                "
            >
                {title}
            </h3>

            {description && (
                <p
                    className="
                        mt-3 max-w-xl
                        text-[13px] leading-6
                        !text-[#9BA8B7]
                    "
                >
                    {description}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   PARTICIPATION CARD
========================================================= */

function ParticipationChoice({ option, selected, onClick }) {
    const Icon = option.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`
                group relative flex min-w-0
                flex-col items-start
                border p-5 text-left
                transition-[border-color,background-color]
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#91A4B8]
                ${
                    selected
                        ? 'border-[#718396] bg-[#25313D]'
                        : 'border-[#35404C] bg-[#171E27] hover:border-[#526071] hover:bg-[#202A35]'
                }
            `}
        >
            <div className="flex w-full items-start justify-between">
                <span
                    className={`
                        flex size-11
                        items-center justify-center
                        border
                        ${
                            selected
                                ? 'border-[#5B6D7E] bg-[#354555] !text-[#D5E0EA]'
                                : 'border-[#354454] bg-[#202A35] !text-[#91A2B3]'
                        }
                    `}
                >
                    <Icon size={20} strokeWidth={1.6} />
                </span>

                <span
                    className={`
                        flex size-5
                        items-center justify-center
                        border
                        ${
                            selected
                                ? 'border-[#B5C2D0] bg-[#B5C2D0] !text-[#111720]'
                                : 'border-[#69798A] bg-transparent'
                        }
                    `}
                >
                    {selected && <Check size={13} strokeWidth={3} />}
                </span>
            </div>

            <span className="mt-5 text-[15px] font-semibold !text-[#DCE4ED]">
                {option.label}
            </span>

            <span className="mt-1.5 text-[12px] leading-5 !text-[#9AA8B7]">
                {option.description}
            </span>
        </button>
    );
}

/* =========================================================
   CAUSE CHOICE
========================================================= */

function CauseChoice({ option, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`
                group flex min-h-[52px]
                min-w-0 items-center
                justify-between gap-3
                border px-4 py-3
                text-left
                transition-[border-color,background-color]
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#91A4B8]
                ${
                    selected
                        ? 'border-[#718396] bg-[#25313D]'
                        : 'border-[#35404C] bg-[#171E27] hover:border-[#526071] hover:bg-[#202A35]'
                }
            `}
        >
            <span
                className={`
                    text-[13px] font-medium leading-5
                    ${selected ? '!text-[#E1E8F0]' : '!text-[#B6C2CE]'}
                `}
            >
                {option.label}
            </span>

            <span
                className={`
                    flex size-[19px] shrink-0
                    items-center justify-center border
                    ${
                        selected
                            ? 'border-[#B5C2D0] bg-[#B5C2D0] !text-[#111720]'
                            : 'border-[#647487] bg-[#111720]'
                    }
                `}
            >
                {selected && <Check size={12} strokeWidth={3} />}
            </span>
        </button>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IndividualProfileEdit({
    form,
    memberSince,
    saving,
    uploadingPhoto = false,
    photoPreview = '',
    onPhotoUpload,
    onChange,
    onSave,
    onCancel,
}) {
    const [photoPreviewError, setPhotoPreviewError] = useState(false);
    const [activeSection, setActiveSection] = useState('details');

    const participationPreferences = toArray(form.participation_preferences);

    const categoryPreferences = toArray(form.category_preferences);

    // Preview is local and temporary; it must not update form.photo.
    const savedPhoto = typeof form.photo === 'string' ? form.photo.trim() : '';

    const photo = photoPreview || savedPhoto;
    const hasPhoto = Boolean(photo) && !photoPreviewError;
    const busy = saving || uploadingPhoto;
    const joinedText = formatMemberSince(memberSince);

    const currentSection =
        SECTIONS.find((section) => section.id === activeSection) || SECTIONS[0];

    const togglePreference = (field, currentValues, value) => {
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        onChange(field, nextValues);
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (file && onPhotoUpload) {
            setPhotoPreviewError(false);
            onPhotoUpload(file);
        }

        // Allows selecting the same file again.
        event.target.value = '';
    };

    return (
        <div className="min-w-0 pb-8 font-sans !text-[#D3DCE5]">
            <form onSubmit={onSave} className="min-w-0">
                {/* PROFILE MASTHEAD */}

                <div className="border border-[#343F4D] bg-[#111720]">
                    <div
                        className="
                            flex flex-col gap-6
                            px-5 py-6
                            sm:px-8 sm:py-7
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div className="flex min-w-0 items-center gap-5">
                            <div className="relative shrink-0">
                                <div
                                    className="
                                        flex size-[82px]
                                        items-center justify-center
                                        overflow-hidden
                                        border border-[#465364]
                                        bg-[#273240]
                                        sm:size-[94px]
                                    "
                                >
                                    {hasPhoto ? (
                                        <img
                                            src={photo}
                                            alt="Profile preview"
                                            className="size-full object-cover"
                                            onError={() =>
                                                setPhotoPreviewError(true)
                                            }
                                            onLoad={() =>
                                                setPhotoPreviewError(false)
                                            }
                                        />
                                    ) : (
                                        <ImagePlus
                                            size={31}
                                            strokeWidth={1.4}
                                            className="!text-[#AAB5C2]"
                                        />
                                    )}
                                </div>

                                <span
                                    className="
                                        absolute -bottom-1.5 -right-1.5
                                        flex size-8
                                        items-center justify-center
                                        border-[3px] border-[#111720]
                                        bg-[#465261]
                                        !text-[#E3EAF1]
                                    "
                                >
                                    <Camera size={14} />
                                </span>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[12px] font-medium !text-[#9FAEBD]">
                                    Editing profile
                                </p>

                                <h2
                                    className="
                                        mt-1.5 break-words
                                        text-[23px] font-semibold
                                        leading-tight tracking-[-0.02em]
                                        !text-[#E1E7EE]
                                        sm:text-[27px]
                                    "
                                >
                                    {form.name?.trim() || 'Your profile'}
                                </h2>

                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                                    <span className="inline-flex items-center gap-1.5 text-[12px] !text-[#A7B5C3]">
                                        <UserRound size={14} />
                                        Individual account
                                    </span>

                                    <span className="inline-flex items-center gap-1.5 text-[12px] !text-[#A7B5C3]">
                                        <CalendarDays size={14} />
                                        Member since {joinedText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <label
                                htmlFor="individual-photo"
                                aria-disabled={busy}
                                className={`
                                    inline-flex min-h-11
                                    cursor-pointer
                                    items-center justify-center gap-2.5
                                    border border-[#3C4856]
                                    bg-[#202A35] px-4
                                    text-[13px] font-semibold
                                    !text-[#DFE6EE]
                                    transition-colors duration-200
                                    hover:border-[#657789]
                                    hover:bg-[#2A3643]
                                    ${
                                        busy
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                `}
                            >
                                <Upload size={15} strokeWidth={1.8} />

                                {uploadingPhoto
                                    ? 'Uploading...'
                                    : photoPreview || savedPhoto
                                      ? 'Change photo'
                                      : 'Upload photo'}
                            </label>

                            <input
                                id="individual-photo"
                                name="photo"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={busy}
                                onChange={handleFileChange}
                                className="sr-only"
                            />
                        </div>
                    </div>

                    {uploadingPhoto && (
                        <p
                            role="status"
                            className="px-5 pb-4 text-[12px] !text-[#A6B3C1] sm:px-8"
                        >
                            Preparing your profile photo. Please wait...
                        </p>
                    )}

                    {photoPreview && !uploadingPhoto && (
                        <p
                            role="status"
                            className="px-5 pb-4 text-[12px] !text-[#A6B3C1] sm:px-8"
                        >
                            Photo selected. Save changes to apply it.
                        </p>
                    )}
                </div>

                {/* TWO-COLUMN EDITOR */}

                <div
                    className="
                        mt-5 grid min-w-0
                        items-stretch gap-4
                        lg:h-[620px]
                        lg:grid-cols-[258px_minmax(0,1fr)]
                        lg:gap-5
                        xl:grid-cols-[278px_minmax(0,1fr)]
                    "
                >
                    {/* LEFT NAVIGATION */}

                    <nav
                        aria-label="Profile editor sections"
                        className="
                            flex min-w-0 flex-col overflow-hidden
                            border border-[#343F4D] bg-[#111720]
                            lg:h-full lg:min-h-0
                        "
                    >
                        <div className="hidden border-b border-[#303A47] px-5 py-5 lg:block">
                            <h3 className="mt-2 text-[17px] font-semibold !text-[#DDE4EC]">
                                Edit information
                            </h3>
                        </div>

                        <div
                            className="
                                flex min-w-0 gap-1 overflow-x-auto p-2
                                lg:min-h-0 lg:flex-col lg:gap-1
                                lg:overflow-y-auto lg:overflow-x-hidden
                                lg:p-3
                            "
                        >
                            {SECTIONS.map((section) => {
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
                                        className={`
                                            group relative flex min-h-[52px]
                                            shrink-0 items-center gap-3
                                            px-3.5 py-3 text-left
                                            transition-[background-color,color]
                                            duration-200
                                            focus:outline-none
                                            focus:ring-0
                                            focus-visible:outline-none
                                            focus-visible:ring-0
                                            lg:w-full lg:min-h-[62px]
                                            ${
                                                active
                                                    ? 'bg-[#273440]'
                                                    : 'hover:bg-[#1D2731]'
                                            }
                                        `}
                                    >
                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="
                                                    absolute bottom-0 left-3 right-3
                                                    h-[2px] bg-[#A1B2C3]
                                                    lg:inset-y-2 lg:left-0
                                                    lg:right-auto lg:h-auto lg:w-[3px]
                                                "
                                            />
                                        )}

                                        <span
                                            className={`
                                                flex size-9 shrink-0
                                                items-center justify-center
                                                ${
                                                    active
                                                        ? 'bg-[#3A4B5C] !text-[#D6E0EA]'
                                                        : 'bg-[#202A35] !text-[#91A1B1]'
                                                }
                                            `}
                                        >
                                            <Icon size={17} strokeWidth={1.8} />
                                        </span>

                                        <span className="min-w-0">
                                            <span
                                                className={`
                                                    block whitespace-nowrap
                                                    text-[13px] font-semibold
                                                    ${
                                                        active
                                                            ? '!text-[#E1E8F0]'
                                                            : '!text-[#AAB7C5] group-hover:!text-[#D0D9E2]'
                                                    }
                                                `}
                                            >
                                                {section.label}
                                            </span>

                                            <span className="mt-1 hidden text-[11px] !text-[#7F90A1] lg:block">
                                                Section {section.number}
                                            </span>
                                        </span>

                                        <ChevronRight
                                            size={15}
                                            className={`
                                                ml-auto hidden shrink-0 lg:block
                                                ${
                                                    active
                                                        ? '!text-[#B8C6D4]'
                                                        : '!text-[#647184] opacity-0 group-hover:opacity-100'
                                                }
                                            `}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-auto hidden border-t border-[#303A47] px-5 py-5 lg:block">
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    size={17}
                                    className="mt-0.5 shrink-0 !text-[#8FA5B8]"
                                />

                                <p className="text-[12px] leading-5 !text-[#9AA8B7]">
                                    Save your changes when you finish editing.
                                </p>
                            </div>
                        </div>
                    </nav>

                    {/* RIGHT CONTENT */}

                    <div
                        className="
                            flex min-h-[500px] min-w-0 flex-col
                            overflow-hidden border border-[#303A47]
                            bg-[#0E1219]
                            lg:h-full lg:min-h-0
                        "
                    >
                        <div
                            className="
                                flex shrink-0 items-center justify-between gap-4
                                border-b border-[#303A47]
                                px-5 py-4 sm:px-8
                            "
                        >
                            <span className="text-[12px] font-medium !text-[#A9B6C4]">
                                {currentSection.label}
                            </span>

                            <span className="text-[12px] font-medium tabular-nums !text-[#8797A8]">
                                {currentSection.number} / 04
                            </span>
                        </div>

                        <div
                            className="
                                min-w-0 flex-1 px-5 py-8
                                sm:px-8 sm:py-10 xl:px-10
                                lg:min-h-0 lg:overflow-y-auto
                                lg:overscroll-contain
                                lg:[scrollbar-width:thin]
                                lg:[scrollbar-color:#465364_transparent]
                            "
                        >
                            {/* PERSONAL DETAILS */}

                            {activeSection === 'details' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Account identity"
                                        title="Personal details"
                                        description="Keep your personal information accurate and up to date."
                                    />

                                    <div className="grid min-w-0 gap-x-7 gap-y-7 sm:grid-cols-2 xl:gap-x-10">
                                        <Field
                                            label="Full name"
                                            name="name"
                                            value={form.name}
                                            onChange={onChange}
                                            required
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                        />

                                        <Field
                                            label="Email address"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={onChange}
                                            required
                                            placeholder="name@example.com"
                                            autoComplete="email"
                                        />

                                        <Field
                                            label="Phone number"
                                            name="phone"
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
                                        />

                                        <Field
                                            label="Date of birth"
                                            name="date_of_birth"
                                            type="date"
                                            max={new Date()
                                                .toISOString()
                                                .slice(0, 10)}
                                            value={form.date_of_birth}
                                            onChange={onChange}
                                        />
                                    </div>

                                    {/* SECURITY NOTE */}

                                    <div
                                        className="flex items-start
                                                                        gap-3
                                                                        pt-8
                                                                    "
                                    >
                                        <ShieldCheck
                                            size={17}
                                            strokeWidth={1.7}
                                            className="
                                                                            mt-0.5 shrink-0
                                                                            !text-[#94A9BC]
                                                                        "
                                        />

                                        <p
                                            className="
                                                                            text-[12px] leading-6
                                                                            !text-[#A0AFBE]
                                                                        "
                                        >
                                            Changing your email address may
                                            require verification and signing in
                                            again.
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* LOCATION */}

                            {activeSection === 'location' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Where you're based"
                                        title="Location details"
                                        description="Manage the location associated with your profile."
                                    />

                                    <div className="max-w-3xl space-y-7">
                                        <Field
                                            label="District"
                                            name="district"
                                            value={form.district}
                                            onChange={onChange}
                                            placeholder="Enter your district"
                                            autoComplete="address-level2"
                                        />

                                        <div>
                                            <label
                                                htmlFor="individual-address"
                                                className="mb-2.5 block text-[13px] font-medium !text-[#B3BFCC]"
                                            >
                                                Address
                                            </label>

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
                                                className={`
                                                    ${inputClass}
                                                    !h-auto min-h-[130px]
                                                    resize-y !py-4 leading-6
                                                `}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* PARTICIPATION */}

                            {activeSection === 'preferences' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Your involvement"
                                        title="Participation"
                                        description="Choose how you want to take part in humanitarian activities."
                                    />

                                    <div className="grid min-w-0 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                                        {PARTICIPATION_OPTIONS.map((option) => (
                                            <ParticipationChoice
                                                key={option.value}
                                                option={option}
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
                            )}

                            {/* CAUSES */}

                            {activeSection === 'causes' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Your interests"
                                        title="Causes of interest"
                                        description="Select the areas you care about most."
                                    />

                                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <CauseChoice
                                                key={option.value}
                                                option={option}
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
                            )}
                        </div>

                        {/* FOOTER ACTIONS */}

                        <div
                            className="
                                mt-auto flex shrink-0 flex-col-reverse gap-3
                                border-t border-[#303A47] bg-[#151B24]
                                px-5 py-5
                                sm:flex-row sm:items-center sm:justify-end
                                sm:px-8
                            "
                        >
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={busy}
                                className="
                                    inline-flex min-h-11 items-center justify-center gap-2.5
                                    border border-[#3C4856] bg-[#202A35] px-5
                                    text-[13px] font-semibold !text-[#DFE6EE]
                                    shadow-none outline-none ring-0
                                    transition-colors duration-200
                                    hover:border-[#657789] hover:bg-[#2A3643]
                                    focus:outline-none focus:ring-0
                                    focus-visible:outline-none focus-visible:ring-0
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <ArrowLeft size={15} strokeWidth={1.8} />
                                Back to profile
                            </button>

                            <button
                                type="submit"
                                disabled={busy}
                                className="
                                    inline-flex min-h-11 items-center justify-center gap-2.5
                                    border border-[#667789] bg-[#414E5D] px-6
                                    text-[13px] font-semibold !text-[#EDF2F7]
                                    shadow-none outline-none ring-0
                                    transition-colors duration-200
                                    hover:border-[#8493A6] hover:bg-[#586678]
                                    focus:outline-none focus:ring-0
                                    focus-visible:outline-none focus-visible:ring-0
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <Save size={16} strokeWidth={1.8} />
                                {saving ? 'Saving changes...' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

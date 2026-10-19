import React, { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronRight,
    ImagePlus,
    MapPin,
    Save,
    ShieldCheck,
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

const inputClass = `
    peer block h-[52px] w-full min-w-0 appearance-none
    rounded-none border-0 border-b border-[#3B4654]
    bg-[#171E27] px-4 pt-4 pb-2
    text-[14px] font-medium !text-[#DCE4ED]
    shadow-none outline-none ring-0
    transition-[background-color,border-color] duration-200
    placeholder:!text-[#738191]
    hover:bg-[#1C2530] hover:border-[#627285]
    focus:!border-b-[#A4B5C6] focus:!bg-[#202A35]
    focus:!outline-none focus:!shadow-none focus:!ring-0
    focus:!ring-offset-0 focus-visible:!outline-none
    focus-visible:!shadow-none focus-visible:!ring-0
    disabled:cursor-not-allowed disabled:opacity-50
`;

const panelClass = 'border border-[#343F4D] bg-[#111720]';

const SECTIONS = [
    {
        id: 'information',
        label: 'Organization information',
        icon: Building2,
        number: '01',
    },
    { id: 'mission', label: 'Mission and purpose', icon: Target, number: '02' },
    {
        id: 'communities',
        label: 'Work and communities',
        icon: Users,
        number: '03',
    },
    {
        id: 'team',
        label: 'Team and activities',
        icon: BriefcaseBusiness,
        number: '04',
    },
    {
        id: 'verification',
        label: 'Organization details',
        icon: FileCheck2,
        number: '05',
    },
];

function formatMemberSince(value) {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';
    return date.toLocaleDateString('en-BD', {
        month: 'short',
        year: 'numeric',
    });
}

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
                htmlFor={`organization-${name}`}
                className="mb-2.5 flex items-center gap-1 text-[13px] font-medium !text-[#B3BFCC]"
            >
                {label}
                {props.required && <span className="!text-[#E79B75]">*</span>}
            </label>
            <input
                id={`organization-${name}`}
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

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="mb-9">
            <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[#8294A6]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] !text-[#A3B0BE]">
                    {eyebrow}
                </span>
            </div>
            <h3 className="text-[24px] font-semibold leading-tight tracking-[-0.025em] !text-[#E1E7EE] sm:text-[28px]">
                {title}
            </h3>
            {description && (
                <p className="mt-3 max-w-xl text-[13px] leading-6 !text-[#9BA8B7]">
                    {description}
                </p>
            )}
        </div>
    );
}

function ChoiceGrid({ options, value, onChange }) {
    const selected = toArray(value);
    const known = new Set(options.map((option) => option.value));
    const all = [
        ...selected
            .filter((item) => !known.has(item))
            .map((item) => ({ value: item, label: item })),
        ...options,
    ];

    return (
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {all.map((option) => {
                const active = selected.includes(option.value);
                return (
                    <button
                        key={option.value}
                        type="button"
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
                        className={`group flex min-h-[52px] min-w-0 items-center justify-between gap-3 border px-4 py-3 text-left transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#91A4B8] ${
                            active
                                ? 'border-[#718396] bg-[#25313D]'
                                : 'border-[#35404C] bg-[#171E27] hover:border-[#526071] hover:bg-[#202A35]'
                        }`}
                    >
                        <span
                            className={`text-[13px] font-medium leading-5 ${active ? '!text-[#E1E8F0]' : '!text-[#B6C2CE]'}`}
                        >
                            {option.label}
                        </span>
                        <span
                            className={`flex size-[19px] shrink-0 items-center justify-center border ${
                                active
                                    ? 'border-[#B5C2D0] bg-[#B5C2D0] !text-[#111720]'
                                    : 'border-[#647487] bg-[#111720]'
                            }`}
                        >
                            {active && <Check size={12} strokeWidth={3} />}
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
    const [imageError, setImageError] = useState(false);
    const busy = Boolean(uploadingImage);
    const isBanner = field === 'banner';
    const displayedImage = pendingImage?.preview || image;
    const showImage = Boolean(displayedImage) && !imageError;

    return (
        <div className="min-w-0">
            <p className="mb-3 text-[13px] font-medium !text-[#B3BFCC]">
                {label}
            </p>
            <div
                className={`relative flex overflow-hidden border border-[#465364] bg-[#171E27] ${isBanner ? 'h-[150px]' : 'h-[150px] items-center justify-center'}`}
            >
                {showImage ? (
                    <img
                        src={displayedImage}
                        alt={label}
                        className={
                            isBanner
                                ? 'h-full w-full object-cover'
                                : 'm-auto size-[104px] object-cover'
                        }
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 !text-[#8F9EAE]">
                        {isBanner ? (
                            <ImagePlus size={25} strokeWidth={1.5} />
                        ) : (
                            <Building2 size={31} strokeWidth={1.4} />
                        )}
                        <span className="text-[11px]">
                            {isBanner
                                ? 'No cover banner'
                                : 'No organization logo'}
                        </span>
                    </div>
                )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] !text-[#8794A4]">
                    JPG, PNG, WebP · Max 5 MB
                </span>
                <label
                    className={`inline-flex min-h-10 items-center gap-2 border border-[#3C4856] bg-[#202A35] px-3.5 text-[13px] font-semibold !text-[#DFE6EE] transition-colors duration-200 ${
                        busy
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'cursor-pointer hover:border-[#657789] hover:bg-[#2A3643]'
                    }`}
                >
                    <Upload size={15} strokeWidth={1.8} />
                    {uploadingImage === field
                        ? 'Uploading...'
                        : pendingImage
                          ? 'Change image'
                          : 'Choose image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={busy}
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                setImageError(false);
                                onUploadImage(field, file);
                            }
                            event.target.value = '';
                        }}
                    />
                </label>
            </div>
            {pendingImage && (
                <p className="mt-2 text-[12px] !text-[#A6B3C1]">
                    Image selected. Save changes to apply it.
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
    const currentSection =
        SECTIONS.find((section) => section.id === activeSection) || SECTIONS[0];
    const organizationName = form.name?.trim() || 'Your organization';
    const memberSince = formatMemberSince(
        profile?.created_at || profile?.user?.created_at,
    );

    return (
        <div className="min-w-0 pb-8 font-sans !text-[#D3DCE5]">
            <form onSubmit={onSave} className="min-w-0">
                {/* PROFILE MASTHEAD */}
                <div className={panelClass}>
                    <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-5">
                            <div className="relative size-[82px] shrink-0 overflow-hidden border border-[#465364] bg-[#273240] sm:size-[94px]">
                                {pendingImages?.photo?.preview ||
                                profile?.photo ||
                                profile?.user?.photo ? (
                                    <img
                                        src={
                                            pendingImages?.photo?.preview ||
                                            profile?.photo ||
                                            profile?.user?.photo
                                        }
                                        alt="Organization logo preview"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center !text-[#AAB5C2]">
                                        <Building2
                                            size={34}
                                            strokeWidth={1.4}
                                        />
                                    </div>
                                )}
                                <span className="absolute bottom-1 right-1 flex size-6 items-center justify-center border-2 border-[#111720] bg-[#465261] !text-[#E3EAF1]">
                                    <ImagePlus size={12} />
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12px] font-medium !text-[#9FAEBD]">
                                    Organization profile
                                </p>
                                <h2 className="mt-1.5 break-words text-[23px] font-semibold leading-tight tracking-[-0.02em] !text-[#E1E7EE] sm:text-[27px]">
                                    {organizationName}
                                </h2>
                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                                    <span className="inline-flex items-center gap-1.5 text-[12px] !text-[#A7B5C3]">
                                        <Building2 size={14} />
                                        Organization account
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-[12px] !text-[#A7B5C3]">
                                        <CalendarDays size={14} />
                                        Member since {memberSince}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={busy}
                                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#3C4856] bg-[#171E27] px-4 text-[13px] font-semibold !text-[#C5CFD9] transition-colors hover:border-[#657789] hover:bg-[#202A35] disabled:opacity-50"
                            >
                                <ArrowLeft size={15} />
                                Back to profile
                            </button>
                        </div>
                    </div>

                    {(uploadingImage ||
                        imageUploadError ||
                        imageUploadSuccess ||
                        pendingImages?.photo ||
                        pendingImages?.banner) && (
                        <div className="border-t border-[#303A47] px-5 py-3 sm:px-8">
                            {uploadingImage && (
                                <p
                                    role="status"
                                    className="text-[12px] !text-[#A6B3C1]"
                                >
                                    Uploading{' '}
                                    {uploadingImage === 'photo'
                                        ? 'organization logo'
                                        : 'cover banner'}
                                    ...
                                </p>
                            )}
                            {pendingImages?.photo && !uploadingImage && (
                                <p className="text-[12px] !text-[#A6B3C1]">
                                    Logo selected. Save changes to apply it.
                                </p>
                            )}
                            {pendingImages?.banner && !uploadingImage && (
                                <p className="text-[12px] !text-[#A6B3C1]">
                                    Cover banner selected. Save changes to apply
                                    it.
                                </p>
                            )}
                            {imageUploadError && (
                                <p
                                    role="alert"
                                    className="mt-1 flex items-center gap-2 text-[12px] text-red-300"
                                >
                                    <AlertCircle size={15} /> {imageUploadError}
                                </p>
                            )}
                            {imageUploadSuccess && (
                                <p
                                    role="status"
                                    className="mt-1 flex items-center gap-2 text-[12px] !text-[#A6B3C1]"
                                >
                                    <CheckCircle2 size={15} />{' '}
                                    {imageUploadSuccess}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* TWO-COLUMN EDITOR */}
                <div className="mt-5 grid min-w-0 items-stretch gap-4 lg:h-[660px] lg:grid-cols-[258px_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[278px_minmax(0,1fr)]">
                    <nav
                        aria-label="Organization profile editor sections"
                        className="flex min-w-0 flex-col overflow-hidden border border-[#343F4D] bg-[#111720] lg:h-full lg:min-h-0"
                    >
                        <div className="hidden border-b border-[#303A47] px-5 py-5 lg:block">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#8797A8]">
                                Profile settings
                            </p>
                            <h3 className="mt-2 text-[17px] font-semibold !text-[#DDE4EC]">
                                Edit information
                            </h3>
                        </div>
                        <div className="flex min-w-0 gap-1 overflow-x-auto p-2 lg:min-h-0 lg:flex-col lg:gap-1 lg:overflow-y-auto lg:overflow-x-hidden lg:p-3">
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
                                        className={`group relative flex min-h-[52px] shrink-0 items-center gap-3 px-3.5 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#91A4B8] lg:w-full lg:min-h-[62px] ${
                                            active
                                                ? 'bg-[#273440]'
                                                : 'hover:bg-[#1D2731]'
                                        }`}
                                    >
                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#A1B2C3] lg:inset-y-2 lg:left-0 lg:right-auto lg:h-auto lg:w-[3px]"
                                            />
                                        )}
                                        <span
                                            className={`flex size-9 shrink-0 items-center justify-center ${
                                                active
                                                    ? 'bg-[#3A4B5C] !text-[#D6E0EA]'
                                                    : 'bg-[#202A35] !text-[#91A1B1]'
                                            }`}
                                        >
                                            <Icon size={17} strokeWidth={1.8} />
                                        </span>
                                        <span className="min-w-0">
                                            <span
                                                className={`block whitespace-nowrap text-[13px] font-semibold ${
                                                    active
                                                        ? '!text-[#E1E8F0]'
                                                        : '!text-[#AAB7C5] group-hover:!text-[#D0D9E2]'
                                                }`}
                                            >
                                                {section.label}
                                            </span>
                                            <span className="mt-1 hidden text-[11px] !text-[#7F90A1] lg:block">
                                                Section {section.number}
                                            </span>
                                        </span>
                                        <ChevronRight
                                            size={15}
                                            className={`ml-auto hidden shrink-0 lg:block ${
                                                active
                                                    ? '!text-[#B8C6D4]'
                                                    : '!text-[#647184] opacity-0 group-hover:opacity-100'
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-auto hidden border-t border-[#303A47] px-5 py-5 lg:block">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    size={17}
                                    className="mt-0.5 shrink-0 !text-[#8FA5B8]"
                                />
                                <p className="text-[12px] leading-5 !text-[#9AA8B7]">
                                    Review your organization details, then save
                                    your changes.
                                </p>
                            </div>
                        </div>
                    </nav>

                    <div className="flex min-h-[500px] min-w-0 flex-col overflow-hidden border border-[#303A47] bg-[#0E1219] lg:h-full lg:min-h-0">
                        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#303A47] px-5 py-4 sm:px-8">
                            <span className="text-[12px] font-medium !text-[#A9B6C4]">
                                {currentSection.label}
                            </span>
                            <span className="text-[12px] font-medium tabular-nums !text-[#8797A8]">
                                {currentSection.number} / 05
                            </span>
                        </div>
                        <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 xl:px-10 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-width:thin] lg:[scrollbar-color:#465364_transparent]">
                            {activeSection === 'information' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Organization identity"
                                        title="Organization information"
                                        description="Keep your organization's contact details accurate and up to date."
                                    />
                                    <div className="grid min-w-0 gap-x-7 gap-y-7 sm:grid-cols-2 xl:gap-x-10">
                                        <Field
                                            label="Organization name"
                                            name="name"
                                            value={form.name}
                                            onChange={onChange}
                                            required
                                            placeholder="Enter organization name"
                                            autoComplete="organization"
                                        />
                                        <Field
                                            label="Contact email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={onChange}
                                            required
                                            placeholder="contact@example.org"
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
                                            minLength={11}
                                            maxLength={11}
                                            pattern="01[0-9]{9}"
                                            title="Enter exactly 11 digits starting with 01"
                                            placeholder="01XXXXXXXXX"
                                            autoComplete="tel"
                                        />
                                        <Field
                                            label="Website"
                                            name="website"
                                            type="url"
                                            value={form.website}
                                            onChange={onChange}
                                            placeholder="https://example.org"
                                            pattern="https?://[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(:[0-9]{1,5})?(/[^\\s]*)?"
                                            title="Enter a valid URL starting with http:// or https://"
                                        />
                                        <div className="min-w-0 sm:col-span-2">
                                            <label
                                                htmlFor="organization-address"
                                                className="mb-2.5 block text-[13px] font-medium !text-[#B3BFCC]"
                                            >
                                                Office address
                                            </label>
                                            <textarea
                                                id="organization-address"
                                                rows={3}
                                                value={form.address ?? ''}
                                                onChange={(event) =>
                                                    onChange(
                                                        'address',
                                                        event.target.value,
                                                    )
                                                }
                                                className={`${inputClass} h-auto min-h-[100px] resize-y pt-3 leading-6`}
                                                placeholder="Enter your office address"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-start gap-3">
                                        <ShieldCheck
                                            size={17}
                                            strokeWidth={1.7}
                                            className="mt-0.5 shrink-0 !text-[#94A9BC]"
                                        />
                                        <p className="text-[12px] leading-6 !text-[#A0AFBE]">
                                            Changes to contact information may
                                            require review or verification.
                                        </p>
                                    </div>
                                </section>
                            )}

                            {activeSection === 'mission' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Purpose and impact"
                                        title="Mission and purpose"
                                        description="Explain what your organization exists to do and the change it aims to create."
                                    />
                                    <label
                                        htmlFor="organization-mission"
                                        className="mb-2.5 block text-[13px] font-medium !text-[#B3BFCC]"
                                    >
                                        Mission statement
                                    </label>
                                    <textarea
                                        id="organization-mission"
                                        rows={7}
                                        value={form.mission ?? ''}
                                        onChange={(event) =>
                                            onChange(
                                                'mission',
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClass} h-auto min-h-[190px] resize-y pt-3 leading-7`}
                                        placeholder="Describe your organization's mission..."
                                    />
                                </section>
                            )}

                            {activeSection === 'communities' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Who and what you support"
                                        title="Work and communities"
                                        description="Select the causes your organization focuses on and the communities it serves."
                                    />
                                    <div className="grid min-w-0 gap-9 xl:grid-cols-2 xl:gap-10">
                                        <div className="min-w-0">
                                            <h4 className="mb-3 text-[13px] font-semibold !text-[#B3BFCC]">
                                                Focus areas
                                            </h4>
                                            <ChoiceGrid
                                                options={focusAreaOptions}
                                                value={form.focus_areas}
                                                onChange={(value) =>
                                                    onChange(
                                                        'focus_areas',
                                                        value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="mb-3 text-[13px] font-semibold !text-[#B3BFCC]">
                                                Communities served
                                            </h4>
                                            <ChoiceGrid
                                                options={communityOptions}
                                                value={form.communities_served}
                                                onChange={(value) =>
                                                    onChange(
                                                        'communities_served',
                                                        value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeSection === 'team' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="People and delivery"
                                        title="Team and activities"
                                        description="Share your organization's team size and the activities it regularly carries out."
                                    />
                                    <div>
                                        <h4 className="mb-3 text-[13px] font-semibold !text-[#B3BFCC]">
                                            Team size
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {teamSizeOptions.map((option) => {
                                                const active =
                                                    form.team_size ===
                                                    option.value;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        aria-pressed={active}
                                                        onClick={() =>
                                                            onChange(
                                                                'team_size',
                                                                active
                                                                    ? ''
                                                                    : option.value,
                                                            )
                                                        }
                                                        className={`min-h-10 border px-4 text-[13px] font-medium transition-colors ${
                                                            active
                                                                ? 'border-[#718396] bg-[#25313D] !text-[#E1E8F0]'
                                                                : 'border-[#35404C] bg-[#171E27] !text-[#B6C2CE] hover:border-[#526071] hover:bg-[#202A35]'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-9 border-t border-[#29323E] pt-7">
                                        <h4 className="mb-3 text-[13px] font-semibold !text-[#B3BFCC]">
                                            Primary activities
                                        </h4>
                                        <ChoiceGrid
                                            options={activityOptions}
                                            value={form.primary_activities}
                                            onChange={(value) =>
                                                onChange(
                                                    'primary_activities',
                                                    value,
                                                )
                                            }
                                        />
                                    </div>
                                </section>
                            )}

                            {activeSection === 'verification' && (
                                <section>
                                    <SectionHeading
                                        eyebrow="Organization record"
                                        title="Organization details"
                                        description="Update the organization type below. The registration number and verification status are managed by the platform and cannot be edited here."
                                    />
                                    <div className="space-y-7">
                                        <Field
                                            label="Organization type"
                                            name="organization_type"
                                            value={
                                                form.organization_type ??
                                                profile?.organization_type ??
                                                ''
                                            }
                                            onChange={onChange}
                                            placeholder="e.g. Non-profit organization"
                                            autoComplete="organization-title"
                                        />

                                        <div className="border-y border-[#303A47] py-5">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[12px] !text-[#8797A8]">
                                                        Registration number
                                                    </p>
                                                    <p className="mt-1 break-words text-[14px] font-medium !text-[#E1E7EE]">
                                                        {profile?.registration_number ||
                                                            'Not provided'}
                                                    </p>
                                                    <p className="mt-2 text-[12px] !text-[#7F8D9D]">
                                                        Read-only · assigned by
                                                        the platform
                                                        administrator
                                                    </p>
                                                </div>
                                                <FileCheck2
                                                    size={18}
                                                    className="hidden shrink-0 !text-[#91A4B8] sm:block"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[12px] !text-[#8797A8]">
                                                    Verification status
                                                </p>
                                                <p className="mt-1 text-[14px] font-medium !text-[#E1E7EE]">
                                                    {getStatusLabel(
                                                        profile?.verification_status,
                                                    )}
                                                </p>
                                            </div>
                                            <CheckCircle2
                                                size={18}
                                                className="hidden !text-[#91A4B8] sm:block"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-start gap-3">
                                        <ShieldCheck
                                            size={17}
                                            className="mt-0.5 shrink-0 !text-[#94A9BC]"
                                        />
                                        <p className="text-[12px] leading-6 !text-[#9AA8B7]">
                                            The organization type is editable.
                                            Registration number and verification
                                            status remain read-only.
                                        </p>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="mt-5 flex flex-col-reverse justify-end gap-3 border border-[#303A47] bg-[#111720] px-5 py-4 sm:flex-row sm:px-7">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className="inline-flex min-h-11 items-center justify-center border border-[#394555] px-5 text-[13px] font-semibold !text-[#B8C0CA] transition-colors hover:bg-[#1A222D] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={busy}
                        className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#667789] bg-[#465261] px-6 text-[13px] font-semibold !text-white transition-colors hover:bg-[#586678] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving
                            ? uploadingImage
                                ? `Uploading ${uploadingImage === 'photo' ? 'logo' : 'banner'}...`
                                : 'Saving changes...'
                            : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

import React from 'react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ImagePlus,
    Upload,
    Save,
    X,
    ArrowLeft,
    Building2,
} from 'lucide-react';

import {
    focusAreaOptions,
    communityOptions,
    teamSizeOptions,
    activityOptions,
    toArray,
    getStatusLabel,
} from '../utils/orgProfileUtils';

/* =========================================================
   STYLES
========================================================= */

const inputClass = `
    w-full min-w-0 border border-[#343944] bg-[#191D23]
    px-4 py-3 text-[14px] leading-6 text-[#F1F2F4]!
    outline-none transition-colors duration-150
    placeholder:text-[#69717D]
    hover:border-[#505864]
    focus:border-[#75828F]
    focus:ring-0
    disabled:cursor-not-allowed disabled:opacity-50
`;

const labelClass = 'mb-2 block text-[14px] font-medium text-[#CDD2DA]';

const panelClass = 'border border-[#303640] bg-[#20252D]';

/* =========================================================
   FORM FIELD
========================================================= */

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    required = false,
    autoComplete,
    ...props
}) {
    return (
        <div className="min-w-0">
            <label className={labelClass} htmlFor={name}>
                {label}
                {required && <span className="ml-1 text-[#DFA57F]">*</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ''}
                onChange={(event) => onChange(name, event.target.value)}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                className={inputClass}
                {...props}
            />
        </div>
    );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeading({ number, title, description }) {
    return (
        <div className="mb-6 flex items-start gap-4">
            <span
                className="
                    flex h-9 w-9 shrink-0 items-center justify-center
                    border border-[#3B424D] bg-[#292F38]
                    text-[13px] font-semibold text-[#AEB7C3]
                "
            >
                {number}
            </span>

            <div className="min-w-0">
                <h2 className="text-[17px] font-semibold text-[#F1F2F4]!">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-[14px] leading-6 text-[#939CAA]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

/* =========================================================
   IMAGE UPLOADER

   IMPORTANT FIELD MAPPING:
   - Organization logo  -> photo
   - Organization banner -> banner

   The field value is passed unchanged to the parent handler.
========================================================= */

function ImageUploader({
    field,
    title,
    description,
    imageUrl,
    uploadingImage,
    onUploadImage,
    variant = 'logo',
}) {
    const uploading = uploadingImage === field;
    const disabled = Boolean(uploadingImage);
    const isBanner = field === 'banner' && variant === 'banner';

    const inputId = `organization-image-${field}`;

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            event.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            event.target.value = '';
            return;
        }

        // Pass the uploader's exact field to the parent handler.
        onUploadImage?.(field, file);

        event.target.value = '';
    };

    return (
        <div className="min-w-0">
            <div className="mb-3">
                <h3 className="text-[15px] font-semibold text-[#E8EBF0]!">
                    {title}
                </h3>

                <p className="mt-1 text-[13px] leading-5 text-[#939CAA]">
                    {description}
                </p>
            </div>

            <div
                className={`
                    relative overflow-hidden border border-[#39414B]
                    bg-[#171C23]
                    ${isBanner ? 'h-44 sm:h-52' : 'h-44 sm:h-52'}
                `}
            >
                {isBanner ? (
                    imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Organization banner"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-[#7F8997]">
                            <ImagePlus size={30} strokeWidth={1.4} />
                            <span className="text-[13px]">
                                No banner uploaded
                            </span>
                        </div>
                    )
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div
                            className="
                                flex h-28 w-28 items-center justify-center
                                overflow-hidden border border-[#414B57]
                                bg-[#292F38]
                            "
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Organization logo"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2
                                    size={36}
                                    strokeWidth={1.4}
                                    className="text-[#8E9AA8]"
                                />
                            )}
                        </div>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#10141B]/80">
                        <div className="flex items-center gap-3 text-[14px] text-white">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Uploading...
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12px] text-[#858F9D]">
                    JPG, PNG or WebP · Max 5 MB
                </p>

                <label
                    htmlFor={inputId}
                    className={`
                        inline-flex min-h-10 items-center justify-center
                        gap-2 border border-[#49525F] bg-[#292F38]
                        px-4 py-2 text-[13px] font-medium text-[#E1E5EB]
                        transition-colors
                        ${
                            disabled
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:border-[#697584] hover:bg-[#343B46]'
                        }
                    `}
                >
                    <Upload size={15} />

                    {uploading
                        ? 'Uploading...'
                        : imageUrl
                          ? 'Change image'
                          : 'Upload image'}

                    <input
                        id={inputId}
                        name={field}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={disabled}
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
}

/* =========================================================
   MULTI SELECT
========================================================= */

function MultiSelect({ options, value, onChange }) {
    const selected = toArray(value);
    const known = new Set(options.map((item) => item.value));

    const legacy = selected
        .filter((item) => !known.has(item))
        .map((item) => ({
            value: item,
            label: item,
        }));

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...legacy, ...options].map((option) => {
                const active = selected.includes(option.value);

                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                            const next = active
                                ? selected.filter(
                                      (item) => item !== option.value,
                                  )
                                : [...selected, option.value];

                            onChange(next);
                        }}
                        className={`
                            flex min-w-0 items-center gap-3 border
                            px-3.5 py-3 text-left transition-colors
                            ${
                                active
                                    ? 'border-[#627C77] bg-[#293D39]'
                                    : 'border-[#39414B] bg-[#191D23] hover:border-[#626C79] hover:bg-[#292F38]'
                            }
                        `}
                    >
                        <span
                            className={`
                                flex h-5 w-5 shrink-0 items-center
                                justify-center border
                                ${
                                    active
                                        ? 'border-[#84A99E] bg-[#587F73] text-white'
                                        : 'border-[#596370] bg-[#252B34] text-transparent'
                                }
                            `}
                        >
                            <Check size={13} strokeWidth={2.5} />
                        </span>

                        <span
                            className={`
                                min-w-0 text-[14px] leading-6
                                ${active ? 'text-[#E0EEE9]' : 'text-[#C7CED8]'}
                            `}
                        >
                            {option.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* =========================================================
   READ ONLY DETAIL
========================================================= */

function ReadOnlyDetail({ label, value }) {
    return (
        <div className="min-w-0 border-b border-[#343B45] py-3 last:border-0">
            <p className="text-[13px] text-[#929BA8]">{label}</p>

            <p className="mt-1 break-words text-[14px] font-medium text-[#E1E5EB]">
                {value || 'Not provided'}
            </p>
        </div>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function OrgProfileEdit({
    form,
    profile,
    saving,
    onChange,
    onSave,
    onCancel,
    onUploadImage,
    uploadingImage,
    imageUploadError,
    imageUploadSuccess,
}) {
    // Logo belongs to users.photo, NOT organizations.banner.
    const logoUrl = profile?.photo ?? profile?.user?.photo ?? null;

    // Banner belongs exclusively to organizations.banner.
    const bannerUrl = profile?.banner ?? null;

    return (
        <div className="space-y-6 pb-8">
            {/* TOP HEADER */}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#F1F2F4]!">
                        Edit organization information
                    </h2>

                    <p className="mt-1 text-[14px] text-[#939CAA]">
                        Update your profile information and visual identity.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving || Boolean(uploadingImage)}
                    className="
                        inline-flex min-h-10 items-center gap-2
                        border border-[#414955] px-4 py-2
                        text-[13px] font-medium text-[#CDD4DD]
                        transition-colors hover:bg-[#2A3039]
                        disabled:opacity-50
                    "
                >
                    <ArrowLeft size={15} />
                    Back to profile
                </button>
            </div>

            {/* VISUAL IDENTITY */}

            <section className={`${panelClass} p-5 sm:p-7`}>
                <SectionHeading
                    number="01"
                    title="Visual identity"
                    description="Manage your organization's logo and banner."
                />

                {imageUploadError && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-3 border border-red-900/50 bg-red-950/25 p-4 text-[14px] text-red-300"
                    >
                        <AlertCircle size={18} className="shrink-0" />
                        {imageUploadError}
                    </div>
                )}

                {imageUploadSuccess && (
                    <div
                        role="status"
                        className="mb-5 flex items-start gap-3 border border-[#426456] bg-[#24382F] p-4 text-[14px] text-[#BCE1D1]"
                    >
                        <CheckCircle2 size={18} className="shrink-0" />
                        {imageUploadSuccess}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                    {/* users.photo -> users folder */}

                    <ImageUploader
                        field="photo"
                        title="Organization logo"
                        description="The logo displayed across your profile."
                        imageUrl={logoUrl}
                        uploadingImage={uploadingImage}
                        onUploadImage={onUploadImage}
                        variant="logo"
                    />

                    {/* organizations.banner -> organizations folder */}

                    <ImageUploader
                        field="banner"
                        title="Profile banner"
                        description="The cover image displayed behind your identity."
                        imageUrl={bannerUrl}
                        uploadingImage={uploadingImage}
                        onUploadImage={onUploadImage}
                        variant="banner"
                    />
                </div>
            </section>

            {/* PROFILE FORM */}

            <form onSubmit={onSave} className="space-y-6">
                {/* BASIC INFORMATION */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="02"
                        title="Basic information"
                        description="Your organization's official contact information."
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field
                            label="Organization name"
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Organization name"
                            required
                        />

                        <Field
                            label="Contact email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="contact@example.org"
                            required
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
                                    value.replace(/\D/g, '').slice(0, 11),
                                )
                            }
                            placeholder="01XXXXXXXXX"
                            minLength={11}
                            maxLength={11}
                            pattern="01[0-9]{9}"
                            title="Enter exactly 11 digits starting with 01"
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

                        <div className="md:col-span-2">
                            <label className={labelClass} htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                rows={3}
                                value={form.address ?? ''}
                                onChange={(event) =>
                                    onChange('address', event.target.value)
                                }
                                placeholder="Organization address"
                                className={`${inputClass} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                {/* MISSION */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="03"
                        title="Mission and purpose"
                        description="Describe the humanitarian purpose of your organization."
                    />

                    <label className={labelClass} htmlFor="mission">
                        Mission statement
                    </label>

                    <textarea
                        id="mission"
                        rows={5}
                        value={form.mission ?? ''}
                        onChange={(event) =>
                            onChange('mission', event.target.value)
                        }
                        placeholder="Describe your organization's mission..."
                        className={`${inputClass} resize-y leading-7`}
                    />
                </section>

                {/* FOCUS AREAS */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="04"
                        title="Focus areas"
                        description="Select the fields your organization actively works in."
                    />

                    <MultiSelect
                        options={focusAreaOptions}
                        value={form.focus_areas}
                        onChange={(value) => onChange('focus_areas', value)}
                    />
                </section>

                {/* COMMUNITIES */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="05"
                        title="Communities served"
                        description="Identify the communities your organization supports."
                    />

                    <MultiSelect
                        options={communityOptions}
                        value={form.communities_served}
                        onChange={(value) =>
                            onChange('communities_served', value)
                        }
                    />
                </section>

                {/* ORGANIZATION ACTIVITIES */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="06"
                        title="Organization activities"
                        description="Manage your team size and primary activities."
                    />

                    <div className="mb-7">
                        <p className={labelClass}>Team size</p>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                            {teamSizeOptions.map((option) => {
                                const active = form.team_size === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() =>
                                            onChange(
                                                'team_size',
                                                active ? '' : option.value,
                                            )
                                        }
                                        className={`
                                            min-h-12 border px-3 py-3
                                            text-[14px] font-medium transition-colors
                                            ${
                                                active
                                                    ? 'border-[#627C77] bg-[#293D39] text-[#E0EEE9]'
                                                    : 'border-[#39414B] bg-[#191D23] text-[#C7CED8] hover:border-[#626C79] hover:bg-[#292F38]'
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-[#343B45] pt-6">
                        <p className={labelClass}>Primary activities</p>

                        <MultiSelect
                            options={activityOptions}
                            value={form.primary_activities}
                            onChange={(value) =>
                                onChange('primary_activities', value)
                            }
                        />
                    </div>
                </section>

                {/* VERIFICATION */}

                <section className={`${panelClass} p-5 sm:p-7`}>
                    <SectionHeading
                        number="07"
                        title="Verification information"
                        description="These details are managed by the platform."
                    />

                    <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                        <ReadOnlyDetail
                            label="Registration number"
                            value={profile?.registration_number}
                        />

                        <ReadOnlyDetail
                            label="Organization type"
                            value={profile?.organization_type}
                        />

                        <ReadOnlyDetail
                            label="Verification status"
                            value={getStatusLabel(profile?.verification_status)}
                        />
                    </div>
                </section>

                {/* ACTIONS */}

                <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-[#343B45] pt-6 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving || Boolean(uploadingImage)}
                        className="
                            inline-flex min-h-11 items-center justify-center
                            gap-2 border border-[#414955] px-5 py-3
                            text-[14px] font-medium text-[#CDD4DD]
                            transition-colors hover:bg-[#2A3039]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <X size={16} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving || Boolean(uploadingImage)}
                        className="
                            inline-flex min-h-11 items-center justify-center
                            gap-2 bg-[#0F6258] px-6 py-3
                            text-[14px] font-semibold text-white
                            transition-colors hover:bg-[#0B5149]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <Save size={16} />
                        {saving ? 'Saving changes...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

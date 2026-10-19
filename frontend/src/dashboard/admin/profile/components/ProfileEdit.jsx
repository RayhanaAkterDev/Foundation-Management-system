import React, { useState } from 'react';

import {
    ArrowLeft,
    Camera,
    Check,
    Mail,
    Phone,
    Save,
    UserRound,
} from 'lucide-react';

/* =========================================================
   FIELD
========================================================= */

const inputClass = `
  block h-[52px] w-full min-w-0
  appearance-none rounded-none
  border border-[#343F4D]
  bg-[#171E27]
  px-4 pl-11
  font-sans text-[14px] font-medium
  !text-[#CDD6E0]
  caret-[#CDD6E0]
  !outline-none !ring-0 !shadow-none
  transition-[background-color,border-color] duration-200
  placeholder:!text-[#718092]
  hover:border-[#506073]
  hover:bg-[#1B2530]
  focus:border-[#718398]
  focus:bg-[#1B2530]
  focus:!outline-none focus:!ring-0 focus:!shadow-none
  focus-visible:!outline-none focus-visible:!ring-0
  disabled:cursor-not-allowed disabled:opacity-50
`;

function EditField({
    id,
    label,
    icon: Icon,
    value,
    onChange,
    className = '',
    ...props
}) {
    return (
        <div className={`min-w-0 ${className}`}>
            <label
                htmlFor={id}
                className="mb-2.5 block text-[13px] font-medium !text-[#AAB6C4]"
            >
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8796A7]"
                />

                <input
                    {...props}
                    id={id}
                    value={value ?? ''}
                    onChange={onChange}
                    className={inputClass}
                />
            </div>
        </div>
    );
}

/* =========================================================
   PROFILE EDIT
========================================================= */

export default function ProfileEdit({
    form,
    profile,
    pendingPhoto,
    saving,
    onChange,
    onPhotoSelect,
    onSave,
    onCancel,
}) {
    const [imageError, setImageError] = useState(false);

    const displayedPhoto = pendingPhoto?.preview || profile?.photo || '';

    const hasPhoto = Boolean(displayedPhoto) && !imageError;

    const initial = form.name?.trim()?.charAt(0)?.toUpperCase() || 'A';

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave();
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            setImageError(false);
            onPhotoSelect(file);
        }

        event.target.value = '';
    };

    return (
        <div className="min-w-0 pb-8 font-sans">
            {/* PAGE HEADING */}

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <p className="mb-2 text-[12px] font-medium !text-[#8897A9]">
                        Administrator
                        <span className="mx-2.5 text-[#526071]">/</span>
                        Edit profile
                    </p>

                    <h2 className="m-0 font-sans text-[27px] font-semibold leading-tight tracking-[-0.025em] !text-[#DCE3EB] sm:text-[30px]">
                        Edit profile
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="
            inline-flex h-10 shrink-0 items-center
            justify-center gap-2 self-start
            border border-[#354150]
            bg-[#171E27] px-4
            text-[12px] font-medium text-[#B9C5D1]
            transition-colors duration-200
            hover:border-[#657588]
            hover:bg-[#222D39]
            hover:text-[#E0E6ED]
            focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
            sm:self-auto
          "
                >
                    <ArrowLeft size={15} strokeWidth={1.8} />
                    Back to profile
                </button>
            </div>

            {/* EDIT WORKSPACE */}

            <form
                onSubmit={handleSubmit}
                className="
          min-w-0 overflow-hidden
          border border-[#303A47]
          bg-[#111720]
        "
            >
                <div className="grid min-w-0 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
                    {/* LEFT PROFILE PANEL */}

                    <aside
                        className="
              flex min-w-0 flex-col
              border-b border-[#303A47]
              bg-[#151C25]
              lg:border-b-0 lg:border-r
            "
                    >
                        <div className="flex flex-1 flex-col px-6 py-8 sm:px-8 lg:px-7 lg:py-9">
                            {/* PHOTO */}

                            <div className="flex items-start gap-5 lg:block">
                                <div className="relative shrink-0">
                                    <div
                                        className="
                      flex size-[104px] items-center justify-center
                      overflow-hidden border border-[#455364]
                      bg-[#252F3B]
                      text-[35px] font-semibold !text-[#DCE3EB]
                    "
                                    >
                                        {hasPhoto ? (
                                            <img
                                                key={displayedPhoto}
                                                src={displayedPhoto}
                                                alt="Administrator profile"
                                                className="size-full object-cover"
                                                onError={() =>
                                                    setImageError(true)
                                                }
                                                onLoad={() =>
                                                    setImageError(false)
                                                }
                                            />
                                        ) : (
                                            initial
                                        )}
                                    </div>

                                    <label
                                        className={`
                      absolute -bottom-2 left-20
                      flex size-9 cursor-pointer
                      items-center justify-center
                      border-[3px] border-[#151C25]
                      bg-[#465666] text-[#E0E7EF]
                      transition-colors
                      hover:bg-[#627488]
                      ${saving ? 'pointer-events-none opacity-50' : ''}
                    `}
                                        title="Change profile photo"
                                        aria-label="Change profile photo"
                                    >
                                        <Camera size={16} strokeWidth={1.8} />

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            disabled={saving}
                                            className="sr-only"
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                </div>

                                {/* MOBILE IDENTITY */}

                                <div className="min-w-0 pt-1 lg:hidden">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] !text-[#91A0B1]">
                                        Administrator
                                    </p>

                                    <h3 className="m-0 mt-2 break-words text-[19px] font-semibold !text-[#D9E1EA]">
                                        {form.name?.trim() || 'Administrator'}
                                    </h3>

                                    <p className="mt-2 break-all text-[12px] leading-5 !text-[#94A3B4]">
                                        {form.email || 'No email address'}
                                    </p>
                                </div>
                            </div>

                            {/* DESKTOP IDENTITY */}

                            <div className="mt-8 hidden min-w-0 lg:block">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] !text-[#91A0B1]">
                                    Administrator
                                </p>

                                <h3 className="m-0 mt-2 break-words font-sans text-[21px] font-semibold leading-snug !text-[#D9E1EA]">
                                    {form.name?.trim() || 'Administrator'}
                                </h3>

                                <p className="mt-2 break-all text-[12px] leading-5 !text-[#94A3B4]">
                                    {form.email || 'No email address'}
                                </p>
                            </div>

                            {/* PHOTO ACTION */}

                            <div className="mt-8 border-t border-[#303A47] pt-6">
                                <label
                                    className={`
                    inline-flex min-h-10 cursor-pointer
                    items-center justify-center gap-2.5
                    border border-[#465363]
                    bg-[#202A35] px-4
                    text-[12px] font-medium text-[#C7D2DE]
                    transition-colors duration-200
                    hover:border-[#748497]
                    hover:bg-[#2B3745]
                    ${saving ? 'pointer-events-none opacity-50' : ''}
                  `}
                                >
                                    <Camera size={15} strokeWidth={1.8} />

                                    {pendingPhoto
                                        ? 'Change selected photo'
                                        : 'Change photo'}

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        disabled={saving}
                                        className="sr-only"
                                        onChange={handlePhotoChange}
                                    />
                                </label>

                                <p className="mt-3 text-[11px] leading-5 !text-[#8796A7]">
                                    JPG, PNG or WebP · Max 5 MB
                                </p>

                                {pendingPhoto && (
                                    <div
                                        role="status"
                                        className="mt-4 flex items-start gap-2"
                                    >
                                        <Check
                                            size={15}
                                            strokeWidth={2}
                                            className="mt-0.5 shrink-0 text-[#AFC0D0]"
                                        />

                                        <p className="text-[12px] leading-5 !text-[#B5C2CF]">
                                            New photo selected. Save to apply.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT FORM PANEL */}

                    <div className="flex min-w-0 flex-col bg-[#111720]">
                        <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
                            {/* FORM HEADING */}

                            <div className="mb-9 border-b border-[#303A47] pb-7">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] !text-[#8FA0B2]">
                                    Account settings
                                </p>

                                <h3 className="m-0 font-sans text-[23px] font-semibold leading-tight tracking-[-0.02em] !text-[#D9E1EA] sm:text-[25px]">
                                    Personal details
                                </h3>

                                <p className="mt-2 text-[13px] leading-6 !text-[#94A3B4]">
                                    Update your administrator account
                                    information.
                                </p>
                            </div>

                            {/* FORM FIELDS */}

                            <div className="w-full min-w-0">
                                <div className="grid w-full min-w-0 grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2">
                                    <EditField
                                        id="admin-name"
                                        label="Full name"
                                        icon={UserRound}
                                        type="text"
                                        value={form.name}
                                        onChange={(event) =>
                                            onChange('name', event.target.value)
                                        }
                                        placeholder="Enter full name"
                                        autoComplete="name"
                                        required
                                        disabled={saving}
                                        className="w-full md:col-span-2"
                                    />

                                    <EditField
                                        id="admin-email"
                                        label="Email address"
                                        icon={Mail}
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            onChange(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Enter email address"
                                        autoComplete="email"
                                        required
                                        disabled={saving}
                                        className="w-full"
                                    />

                                    <EditField
                                        id="admin-phone"
                                        label="Phone number"
                                        icon={Phone}
                                        type="tel"
                                        inputMode="numeric"
                                        value={form.phone}
                                        onChange={(event) =>
                                            onChange(
                                                'phone',
                                                event.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 11),
                                            )
                                        }
                                        placeholder="01XXXXXXXXX"
                                        autoComplete="tel"
                                        maxLength={11}
                                        pattern="01[0-9]{9}"
                                        title="Enter exactly 11 digits starting with 01"
                                        disabled={saving}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FORM ACTIONS */}

                        <div
                            className="
                mt-auto flex flex-col-reverse gap-3
                border-t border-[#303A47]
                bg-[#151C25]
                px-5 py-5
                sm:flex-row sm:items-center sm:justify-end
                sm:px-8 xl:px-12
              "
                        >
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={saving}
                                className="
                  inline-flex min-h-11 items-center justify-center
                  border border-[#3A4756]
                  bg-transparent px-6
                  text-[13px] font-medium text-[#B7C4D0]
                  transition-colors duration-200
                  hover:border-[#627588]
                  hover:bg-[#222D39]
                  hover:text-[#E1E8EF]
                  focus:outline-none
                  disabled:cursor-not-allowed disabled:opacity-50
                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="
                  inline-flex min-h-11 items-center justify-center
                  gap-2.5
                  border border-[#687C90]
                  bg-[#465666] px-6
                  text-[13px] font-semibold text-[#F0F4F8]
                  transition-colors duration-200
                  hover:border-[#8B9FB2]
                  hover:bg-[#586B7D]
                  focus:outline-none
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

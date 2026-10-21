import React, { useState } from 'react';
import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';

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

function EditField({ icon: Icon, className = '', ...props }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <DashboardInput leftIcon={Icon} {...props} />
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
                    <p className="mb-2 text-[12px] font-medium !text-[#8792A1]">
                        Administrator
                        <span className="mx-2.5 text-[#343E4B]">/</span>
                        Edit profile
                    </p>

                    <h2 className="m-0 font-sans text-[28px] font-semibold leading-tight tracking-[-0.035em] !text-[#EEF1F5] sm:text-[31px]">
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
                        border border-[#343E4B]
                        bg-transparent px-4
                        text-[13px] font-medium !text-[#B8C0CA]
                        transition-colors duration-150
                        hover:border-[#4B596A]
                        hover:bg-[#1A222D]
                        hover:!text-[#EEF1F5]
                        focus-visible:outline-none
                        focus-visible:ring-2 focus-visible:ring-[#0F766E]
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
                    border border-[#252D38]
                    bg-[#0E1219]
                "
            >
                <div className="grid min-w-0 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
                    {/* LEFT PROFILE PANEL */}
                    <aside
                        className="
        flex min-w-0 flex-col
        border-b border-[#252D38]
        bg-[#151C25]
        lg:border-b-0 lg:border-r
    "
                    >
                        <div
                            className="
            flex flex-1 flex-col
            px-4 py-5
            sm:px-6 sm:py-7
            lg:px-6 lg:py-8
            xl:px-7 xl:py-9
        "
                        >
                            {/* PROFILE IDENTITY */}
                            <div
                                className="
                flex min-w-0 items-center gap-4
                sm:gap-5
                lg:flex-col lg:items-start lg:gap-0
            "
                            >
                                {/* PROFILE PHOTO */}
                                <div className="relative shrink-0">
                                    <div
                                        className="
                        flex size-23 items-center justify-center
                        overflow-hidden
                        border border-[#343E4B]
                        bg-[#1A222D]
                        text-[27px] font-semibold text-[#EEF1F5]
                        sm:size-[112px] sm:text-[31px]
                        lg:size-[128px] lg:text-[34px]
                        xl:size-[144px]
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

                                    {/* PHOTO UPLOAD SHORTCUT */}
                                    <label
                                        className={`
                        absolute -bottom-1.5 -right-1.5
                        flex size-9 cursor-pointer items-center justify-center
                        border-[3px] border-[#151C25]
                        bg-[#0F766E] text-white
                        transition-colors duration-150
                        hover:bg-[#115E59]
                        focus-within:outline
                        focus-within:outline-2
                        focus-within:outline-[#2DD4BF]
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

                                {/* IDENTITY DETAILS */}
                                <div
                                    className="
                    min-w-0 flex-1
                    lg:mt-6 lg:w-full lg:flex-none
                "
                                >
                                    <p
                                        className="
                        mb-1.5 text-[10px] font-semibold uppercase
                        tracking-[0.14em] text-[#8290A1]
                    "
                                    >
                                        Administrator
                                    </p>

                                    <h3
                                        className="
                        m-0 break-words text-[17px] font-semibold
                        leading-snug text-[#EEF1F5]!
                        sm:text-[19px]
                        lg:text-[20px]
                        xl:text-[21px]
                    "
                                    >
                                        {form.name?.trim() || 'Administrator'}
                                    </h3>

                                    <p
                                        className="
                        mt-2 min-w-0 break-all
                        text-[11px] leading-[1.7] text-[#A7B1BE]
                        sm:text-[12px]
                    "
                                    >
                                        {form.email || 'No email address'}
                                    </p>
                                </div>
                            </div>

                            {/* PHOTO SETTINGS */}
                            <div
                                className="
                mt-6 border-t border-[#252D38] pt-5
                sm:mt-7 sm:pt-6
                lg:mt-8
            "
                            >
                                <p className="mb-3 text-[12px] font-medium text-[#D5DBE3]">
                                    Profile photo
                                </p>

                                <label
                                    className={`
                    flex min-h-10 w-full cursor-pointer
                    items-center justify-center gap-2
                    border border-[#343E4B]
                    bg-[#1A222D] px-3 py-2
                    text-center text-[12px] font-medium text-[#C4CCD6]
                    transition-colors duration-150
                    hover:border-[#4B596A]
                    hover:bg-[#202A35]
                    hover:text-[#EEF1F5]
                    sm:w-fit sm:min-w-[170px] sm:px-4
                    ${saving ? 'pointer-events-none opacity-50' : ''}
                `}
                                >
                                    <Camera
                                        size={15}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {pendingPhoto
                                            ? 'Change selected photo'
                                            : 'Change photo'}
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        disabled={saving}
                                        className="sr-only"
                                        onChange={handlePhotoChange}
                                    />
                                </label>

                                <p className="mt-3 text-[11px] leading-5 text-[#8792A1]">
                                    JPG, PNG or WebP. Maximum file size: 5 MB.
                                </p>

                                {/* PENDING PHOTO STATUS */}
                                {pendingPhoto && (
                                    <div
                                        role="status"
                                        className="
                        mt-4 flex items-start gap-2
                        border-l-2 border-[#2DD4BF]
                        bg-[#102A2B] px-3 py-3
                    "
                                    >
                                        <Check
                                            size={15}
                                            strokeWidth={2}
                                            className="mt-0.5 shrink-0 text-[#2DD4BF]"
                                        />

                                        <p className="text-[12px] leading-5 text-[#C5D8D8]">
                                            New photo selected. Save your
                                            changes to apply it.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* DESKTOP SPACING */}
                            <div className="hidden flex-1 lg:block" />
                        </div>
                    </aside>

                    {/* RIGHT FORM PANEL */}

                    <div className="flex min-w-0 flex-col bg-[#0E1219]">
                        <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-12">
                            {/* FORM HEADING */}

                            <div className="mb-9 border-b border-[#252D38] pb-7">
                                <div className="flex items-start gap-3.5">
                                    <span className="mt-1 h-8 w-[3px] shrink-0 bg-[#0F766E]" />

                                    <div className="min-w-0">
                                        <h3 className="m-0 text-[26px] font-semibold leading-[1.15] tracking-[-0.04em] !text-[#EEF1F5] sm:text-[30px]">
                                            Personal details
                                        </h3>

                                        <p className="mt-2 max-w-lg text-[13px] leading-[1.7] !text-[#8792A1]">
                                            Update your administrator account
                                            information.
                                        </p>
                                    </div>
                                </div>
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
                                border-t border-[#252D38]
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
                                    border border-[#343E4B]
                                    bg-transparent px-6
                                    text-[13px] font-medium !text-[#B8C0CA]
                                    transition-colors duration-150
                                    hover:border-[#4B596A]
                                    hover:bg-[#1A222D]
                                    hover:!text-[#EEF1F5]
                                    focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-[#0F766E]
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
                                    border border-[#0F766E]
                                    bg-[#0F766E] px-6
                                    text-[13px] font-semibold !text-white
                                    transition-colors duration-150
                                    hover:border-[#115E59]
                                    hover:bg-[#115E59]
                                    focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-[#0F766E]
                                    disabled:cursor-not-allowed disabled:opacity-50
                                "
                            >
                                <Save size={16} strokeWidth={1.8} />

                                {saving ? (
                                    <LoadingUI
                                        variant="button"
                                        title="Saving changes..."
                                    />
                                ) : (
                                    'Save changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

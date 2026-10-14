// src/dashboard/admin/organizations/modals/VerificationModal.jsx

import React, { useState } from 'react';

import { Check, CheckCircle2, Clock3, X, XCircle } from 'lucide-react';

const VerificationModal = ({
    organization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    /* ============================================================
       CURRENT STATUS / LOCAL SELECTION

       Hooks must always run before any conditional return.
    ============================================================ */

    const currentStatus = organization?.verification_status || 'pending';

    const [selectedStatus, setSelectedStatus] = useState(
        () => organization?.verification_status || 'pending',
    );

    /* ============================================================
       EARLY RETURN
    ============================================================ */

    if (!organization) {
        return null;
    }

    /* ============================================================
       STATE HELPERS
    ============================================================ */

    const isVerified = currentStatus === 'verified';

    const hasChanged = selectedStatus !== currentStatus;

    /* ============================================================
       ORGANIZATION DATA
    ============================================================ */

    const initials =
        organization.name
            ?.split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase() || 'OR';

    const email =
        organization.user?.email || organization.email || 'No email available';

    const photo =
        organization.photo ||
        organization.logo ||
        organization.organization_logo ||
        organization.user?.photo ||
        '';

    /* ============================================================
       STATUS OPTIONS
    ============================================================ */

    const options = [
        {
            status: 'verified',
            label: 'Verify',
            description: 'Mark as a verified organization',
            icon: CheckCircle2,

            tone: {
                icon: 'text-[#83B995]',
                iconBg: 'bg-[#18251E]',
                badge: 'text-[#8FC2A1]!',
                badgeBg: 'bg-[#18251E]',
                selectedBorder: 'border-[#385844]',
                selectedBg: 'bg-[#141C18]',
                accent: 'bg-[#6FA58A]',
            },
        },
        {
            status: 'pending',
            label: 'Keep pending',
            description: 'Leave the organization under review',
            icon: Clock3,

            tone: {
                icon: 'text-[#C09A5B]',
                iconBg: 'bg-[#241F16]',
                badge: 'text-[#CBA866]!',
                badgeBg: 'bg-[#241F16]',
                selectedBorder: 'border-[#55482F]',
                selectedBg: 'bg-[#191711]',
                accent: 'bg-[#B58D4D]',
            },
        },
        {
            status: 'rejected',
            label: 'Reject',
            description: 'Decline organization verification',
            icon: XCircle,

            tone: {
                icon: 'text-[#C96870]',
                iconBg: 'bg-[#24191C]',
                badge: 'text-[#D47B83]!',
                badgeBg: 'bg-[#24191C]',
                selectedBorder: 'border-[#56373D]',
                selectedBg: 'bg-[#1A1416]',
                accent: 'bg-[#B96069]',
            },
        },
    ];

    /* ============================================================
       SELECT STATUS

       Selecting an option only changes the local UI state.
       It does NOT update the organization.
    ============================================================ */

    const handleSelect = (status) => {
        if (loading) {
            return;
        }

        /*
         * Keep existing protection:
         * verified organizations cannot be downgraded here.
         */
        if (isVerified && status !== 'verified') {
            return;
        }

        setSelectedStatus(status);
    };

    /* ============================================================
       SUBMIT

       Actual update only happens here.
    ============================================================ */

    const handleSubmit = () => {
        if (loading || !hasChanged) {
            return;
        }

        onConfirm(selectedStatus);
    };

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-title"
            className="
                fixed
                inset-0
                z-110

                flex
                items-center
                justify-center

                overflow-y-auto

                bg-[#05070A]/80

                px-4
                py-6

                backdrop-blur-[3px]
            "
        >
            <div
                className="
                    relative
                    my-auto
                    w-full
                    max-w-110

                    overflow-hidden

                    rounded-xl

                    border
                    border-[#2A313B]

                    bg-[#0E1219]

                    shadow-[0_28px_80px_rgba(0,0,0,0.58)]
                "
            >
                <div
                    className="
                        px-5
                        pb-5
                        pt-5

                        sm:px-6
                        sm:pb-6
                        sm:pt-6
                    "
                >
                    {/* =================================================
                        ORGANIZATION IDENTITY
                    ================================================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3

                            pr-10
                        "
                    >
                        {/* Avatar / Logo */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden

                                rounded-lg

                                border
                                border-[#303A47]

                                bg-[#171D25]

                                font-sans!
                                text-[11px]
                                font-semibold!

                                text-[#DCE1E7]!
                            "
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt=""
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            'none';
                                    }}
                                />
                            ) : (
                                initials
                            )}
                        </div>

                        {/* Organization details */}

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate

                                    font-sans!
                                    text-[12.5px]
                                    font-semibold!
                                    leading-5

                                    text-[#E8ECF0]!
                                "
                            >
                                {organization.name || 'Unnamed organization'}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    truncate

                                    font-sans!
                                    text-[10.5px]
                                    font-normal!

                                    text-[#697586]!
                                "
                            >
                                {email}
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        CLOSE BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="
                            absolute
                            right-4
                            top-4

                            flex
                            h-8
                            w-8
                            items-center
                            justify-center

                            rounded-md

                            text-[#697586]

                            transition-colors
                            duration-150

                            hover:bg-[#181E27]
                            hover:text-[#EEF1F5]

                            disabled:pointer-events-none
                            disabled:opacity-40

                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <X size={17} strokeWidth={1.8} />
                    </button>

                    {/* =================================================
                        HEADING
                    ================================================== */}

                    <div className="mt-6">
                        <p
                            className="
                                font-sans!
                                text-[10px]
                                font-semibold!
                                uppercase
                                tracking-[0.14em]

                                text-[#697586]!
                            "
                        >
                            Verification
                        </p>

                        <h2
                            id="verification-title"
                            className="
                                mt-1.5

                                font-sans!
                                text-[18px]
                                font-semibold!
                                leading-[1.35]
                                tracking-[-0.015em]

                                text-[#EEF1F5]!
                            "
                        >
                            Choose a verification status
                        </h2>

                        <p
                            className="
                                mt-1.5

                                font-sans!
                                text-[11.5px]
                                font-normal!
                                leading-[1.6]

                                text-[#7B8694]!
                            "
                        >
                            Select a status, then submit to apply the change.
                        </p>
                    </div>

                    {/* =================================================
                        STATUS OPTIONS
                    ================================================== */}

                    <div
                        className="
                            mt-4

                            overflow-hidden

                            rounded-lg

                            border
                            border-[#29323E]

                            bg-[#10151C]
                        "
                    >
                        {options.map((option, index) => {
                            const Icon = option.icon;

                            /*
                             * selected:
                             * Temporary status selected by admin.
                             *
                             * current:
                             * Actual organization status from backend.
                             */
                            const selected = selectedStatus === option.status;

                            const current = currentStatus === option.status;

                            const blocked =
                                isVerified && option.status !== 'verified';

                            return (
                                <button
                                    key={option.status}
                                    type="button"
                                    disabled={loading || blocked}
                                    onClick={() => handleSelect(option.status)}
                                    className={`
                                        group
                                        relative

                                        flex
                                        w-full
                                        min-w-0
                                        items-center
                                        gap-3.5

                                        px-4
                                        py-3.5

                                        text-left

                                        transition-[background-color,opacity]
                                        duration-150

                                        focus:outline-none
                                        focus:ring-0

                                        ${
                                            index !== 0
                                                ? `
                                                    border-t
                                                    border-[#252D38]
                                                `
                                                : ''
                                        }

                                        ${
                                            selected
                                                ? option.tone.selectedBg
                                                : `
                                                    bg-transparent

                                                    hover:bg-[#141A21]
                                                `
                                        }

                                        ${
                                            blocked
                                                ? `
                                                    cursor-not-allowed
                                                    opacity-30
                                                `
                                                : `
                                                    cursor-pointer
                                                `
                                        }

                                        ${
                                            loading
                                                ? `
                                                    cursor-not-allowed
                                                    opacity-50
                                                `
                                                : ''
                                        }
                                    `}
                                >
                                    {/* =================================
                                        SELECTED ACCENT
                                    ================================== */}

                                    {selected && (
                                        <span
                                            className={`
                                                absolute
                                                bottom-2.5
                                                left-0
                                                top-2.5

                                                w-0.5

                                                rounded-r-full

                                                ${option.tone.accent}
                                            `}
                                        />
                                    )}

                                    {/* =================================
                                        STATUS ICON
                                    ================================== */}

                                    <div
                                        className={`
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-md

                                            ${option.tone.iconBg}
                                            ${option.tone.icon}
                                        `}
                                    >
                                        <Icon size={14} strokeWidth={1.8} />
                                    </div>

                                    {/* =================================
                                        STATUS INFORMATION
                                    ================================== */}

                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            "
                                        >
                                            <p
                                                className="
                                                    font-sans!
                                                    text-[11.5px]
                                                    font-semibold!

                                                    text-[#DCE1E7]!
                                                "
                                            >
                                                {option.label}
                                            </p>

                                            {/* Actual backend status */}

                                            {current && (
                                                <span
                                                    className="
                                                        rounded

                                                        bg-[#1B222B]

                                                        px-1.5
                                                        py-0.5

                                                        font-sans!
                                                        text-[7.5px]
                                                        font-semibold!
                                                        uppercase
                                                        tracking-widest

                                                        text-[#697586]!
                                                    "
                                                >
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        <p
                                            className="
                                                mt-0.5

                                                font-sans!
                                                text-[9.5px]
                                                font-normal!
                                                leading-4

                                                text-[#697586]!
                                            "
                                        >
                                            {blocked
                                                ? 'Unavailable for a verified organization'
                                                : option.description}
                                        </p>
                                    </div>

                                    {/* =================================
                                        SELECTION INDICATOR
                                    ================================== */}

                                    <span
                                        className={`
                                            flex
                                            h-4.5
                                            w-4.5
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-full

                                            border

                                            transition-[border-color,color]
                                            duration-150

                                            ${
                                                selected
                                                    ? `
                                                        ${option.tone.selectedBorder}
                                                        ${option.tone.icon}
                                                    `
                                                    : `
                                                        border-[#3A4553]
                                                        text-transparent

                                                        group-hover:border-[#596676]
                                                    `
                                            }
                                        `}
                                    >
                                        {selected && (
                                            <Check size={9} strokeWidth={2.6} />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* =================================================
                        VERIFIED LOCK MESSAGE
                    ================================================== */}

                    {isVerified && (
                        <p
                            className="
                                mt-3

                                font-sans!
                                text-[9.5px]
                                font-normal!
                                leading-[1.6]

                                text-[#697586]!
                            "
                        >
                            Verified organizations cannot be moved back to
                            pending or rejected from here.
                        </p>
                    )}

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="
                                mt-3.5

                                rounded-md

                                border
                                border-[#493038]

                                bg-[#21171A]

                                px-3
                                py-2.5
                            "
                        >
                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-medium!
                                    leading-[1.6]

                                    text-[#D07880]!
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        className="
                            mt-5

                            flex
                            items-center
                            justify-end
                            gap-2.5

                            border-t
                            border-[#252D38]

                            pt-4
                        "
                    >
                        {/* Cancel */}

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                inline-flex
                                h-9
                                items-center
                                justify-center

                                rounded-lg

                                border
                                border-[#303A47]

                                bg-transparent

                                px-4

                                font-sans!
                                text-[10.5px]
                                font-semibold!

                                text-[#AEB7C3]!

                                transition-[background-color,border-color,color]
                                duration-150

                                hover:border-[#3C4755]
                                hover:bg-[#151B24]
                                hover:text-[#EEF1F5]!

                                disabled:pointer-events-none
                                disabled:opacity-40

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            Cancel
                        </button>

                        {/* Submit */}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !hasChanged}
                            className="
                                inline-flex
                                h-9
                                min-w-23
                                items-center
                                justify-center
                                gap-2

                                rounded-lg

                                border
                                border-[#465261]

                                bg-[#EEF1F5]

                                px-4

                                font-sans!
                                text-[10.5px]
                                font-semibold!

                                text-[#11161D]!

                                transition-[background-color,border-color,color,opacity]
                                duration-150

                                hover:border-white
                                hover:bg-white

                                disabled:cursor-not-allowed
                                disabled:border-[#29323E]
                                disabled:bg-[#181E27]
                                disabled:text-[#56616E]!
                                disabled:opacity-100

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            {loading && (
                                <span
                                    className="
                                        h-3
                                        w-3

                                        animate-spin
                                        rounded-full

                                        border
                                        border-[#56616E]
                                        border-t-[#11161D]
                                    "
                                />
                            )}

                            {loading ? 'Updating' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;

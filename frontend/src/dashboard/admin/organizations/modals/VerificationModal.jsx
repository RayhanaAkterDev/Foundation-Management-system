// src/dashboard/admin/organizations/modals/VerificationModal.jsx

import React from 'react';

import {
    Check,
    CircleCheck,
    CircleX,
    Clock3,
    ShieldCheck,
    X,
} from 'lucide-react';

const VerificationModal = ({
    organization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    if (!organization) {
        return null;
    }

    const initials =
        organization.name
            ?.split(/\s+/)
            .filter(Boolean)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'OR';

    const email =
        organization.user?.email || organization.email || 'No email available';

    const formatType = (type) => {
        if (!type) {
            return 'Organization';
        }

        return type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const currentStatus = organization.verification_status || 'pending';

    const isVerified = currentStatus === 'verified';

    const hasRegistrationNumber = Boolean(organization.registration_number);

    const options = [
        {
            status: 'verified',
            label: 'Verified',
            helper: hasRegistrationNumber
                ? 'Already verified'
                : 'Approve & issue number',
            icon: CircleCheck,
            active: 'border-[#41614D] bg-[#19251E] text-[#8BB79A]',
            iconActive: 'bg-[#25372C] text-[#8BB79A]',
            dot: 'bg-[#75A184]',
        },
        {
            status: 'pending',
            label: 'Pending',
            helper: 'Keep for review',
            icon: Clock3,
            active: 'border-[#594B32] bg-[#241F17] text-[#C7A467]',
            iconActive: 'bg-[#342C20] text-[#C7A467]',
            dot: 'bg-[#C09A5B]',
        },
        {
            status: 'rejected',
            label: 'Rejected',
            helper: 'Decline',
            icon: CircleX,
            active: 'border-[#5C3940] bg-[#261B1E] text-[#D17B83]',
            iconActive: 'bg-[#38262A] text-[#D17B83]',
            dot: 'bg-[#C2636C]',
        },
    ];

    const currentOption =
        options.find((option) => option.status === currentStatus) || options[1];

    const handleConfirm = (status) => {
        /*
         * A verified organization cannot be moved to another
         * verification state through this modal.
         *
         * Type changes are handled through the organization edit
         * flow and automatically require re-verification.
         */
        if (isVerified && status !== 'verified') {
            return;
        }

        /*
         * Clicking the current verified state is also unnecessary.
         * The button is disabled below, but keep this guard here
         * as an additional UI-level protection.
         */
        if (status === currentStatus) {
            return;
        }

        onConfirm(status);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-60
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-[#05070A]/80
                p-4
                backdrop-blur-[3px]
                sm:p-6
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-title"
        >
            <div
                className="
                    relative
                    my-auto
                    w-full
                    max-w-125
                    border
                    border-[#303A47]
                    bg-[#0E1219]
                    shadow-[0_30px_80px_rgba(0,0,0,0.5)]
                "
            >
                {/* =====================================================
                    TOP
                ====================================================== */}

                <div
                    className="
                        px-5
                        pt-5
                        pb-4
                        sm:px-6
                        sm:pt-6
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-start
                                gap-3
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-[#303A47]
                                    bg-[#151B24]
                                    text-[#98A3AF]
                                "
                            >
                                <ShieldCheck size={16} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#65717E]
                                    "
                                >
                                    Verification
                                </p>

                                <h2
                                    id="verification-title"
                                    className="
                                        mt-1
                                        text-[16px]
                                        font-semibold!
                                        leading-6
                                        text-[#EEF1F5]!
                                    "
                                >
                                    Review organization
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-[11.5px]
                                        leading-5
                                        text-[#75808D]
                                    "
                                >
                                    Choose the appropriate verification outcome.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close"
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                text-[#65717E]
                                transition-colors
                                hover:bg-[#151B24]
                                hover:text-[#DCE1E7]
                                disabled:pointer-events-none
                                disabled:opacity-40
                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <X size={16} strokeWidth={1.8} />
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    ORGANIZATION
                ====================================================== */}

                <div
                    className="
                        mx-5
                        border-y
                        border-[#252D38]
                        py-4
                        sm:mx-6
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                bg-[#151B24]
                                text-[11.5px]
                                font-semibold!
                                text-[#C1C8D0]
                            "
                        >
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    truncate
                                    text-[12.5px]
                                    font-semibold!
                                    text-[#DCE1E7]
                                "
                            >
                                {organization.name}
                            </p>

                            <div
                                className="
                                    mt-1
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2
                                "
                            >
                                <p
                                    className="
                                        min-w-0
                                        truncate
                                        text-[10.5px]
                                        text-[#65717E]
                                    "
                                >
                                    {email}
                                </p>

                                <span
                                    className="
                                        text-[#394451]
                                    "
                                >
                                    •
                                </span>

                                <span
                                    className="
                                        hidden
                                        shrink-0
                                        text-[10.5px]
                                        text-[#65717E]
                                        sm:block
                                    "
                                >
                                    {formatType(organization.organization_type)}
                                </span>
                            </div>
                        </div>

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className={`
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    ${currentOption.dot}
                                `}
                            />

                            <span
                                className="
                                    text-[10.5px]
                                    font-medium!
                                    text-[#8A95A2]
                                "
                            >
                                {currentOption.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    DECISION
                ====================================================== */}

                <div
                    className="
                        px-5
                        py-5
                        sm:px-6
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[11.5px]
                                    font-semibold!
                                    text-[#C8CFD7]
                                "
                            >
                                Verification status
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10.5px]
                                    text-[#65717E]
                                "
                            >
                                {isVerified
                                    ? 'This organization is already verified.'
                                    : 'Select one outcome'}
                            </p>
                        </div>

                        {loading && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-[10px]
                                    text-[#65717E]
                                "
                            >
                                <span
                                    className="
                                        h-3
                                        w-3
                                        animate-spin
                                        rounded-full
                                        border
                                        border-[#465261]
                                        border-t-[#B7C0CA]
                                    "
                                />
                                Updating
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        VERIFIED INFORMATION
                    ================================================== */}

                    {isVerified && (
                        <div
                            className="
                                mt-3.5
                                border-l-2
                                border-[#41614D]
                                bg-[#19251E]
                                px-3
                                py-2.5
                            "
                        >
                            <p
                                className="
                                    text-[10.5px]
                                    font-semibold!
                                    leading-5
                                    text-[#8BB79A]
                                "
                            >
                                Organization already verified
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[9.5px]
                                    leading-5
                                    text-[#758C7E]
                                "
                            >
                                {hasRegistrationNumber
                                    ? `Registration number ${organization.registration_number} is already active.`
                                    : 'This organization is verified, but no registration number is currently recorded.'}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[9.5px]
                                    leading-5
                                    text-[#758C7E]
                                "
                            >
                                To change the organization type, use the
                                organization edit process. That will require
                                re-verification and issuance of a new
                                registration number.
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        REGISTRATION INFORMATION
                    ================================================== */}

                    {!isVerified && currentStatus !== 'verified' && (
                        <div
                            className="
                                    mt-3.5
                                    border-l-2
                                    border-[#41614D]
                                    bg-[#151E19]
                                    px-3
                                    py-2.5
                                "
                        >
                            <p
                                className="
                                        text-[10.5px]
                                        font-semibold!
                                        leading-5
                                        text-[#8BB79A]
                                    "
                            >
                                Verification will issue an SP registration
                                number
                            </p>

                            <p
                                className="
                                        mt-0.5
                                        text-[9.5px]
                                        leading-5
                                        text-[#758C7E]
                                    "
                            >
                                When approved, the next available global
                                registration sequence will be assigned using the
                                current organization type.
                            </p>
                        </div>
                    )}

                    {/* =================================================
                        SEGMENTED DECISION
                    ================================================== */}

                    <div
                        className="
                            mt-3.5
                            grid
                            grid-cols-1
                            border
                            border-[#303A47]
                            bg-[#0A0E14]
                            sm:grid-cols-3
                        "
                    >
                        {options.map((option, index) => {
                            const Icon = option.icon;

                            const active = currentStatus === option.status;

                            /*
                             * Verified organizations cannot be moved
                             * to pending/rejected from this modal.
                             */
                            const blocked =
                                isVerified && option.status !== 'verified';

                            const disabled = loading || active || blocked;

                            return (
                                <button
                                    key={option.status}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleConfirm(option.status)}
                                    className={`
                                        group
                                        relative
                                        flex
                                        min-w-0
                                        items-center
                                        gap-2.5
                                        px-3
                                        py-3
                                        text-left
                                        transition-colors
                                        duration-150
                                        focus:outline-none
                                        focus:ring-0
                                        sm:flex-col
                                        sm:items-start
                                        sm:gap-2
                                        sm:px-3.5
                                        sm:py-3.5

                                        ${
                                            index > 0
                                                ? `
                                                    border-t
                                                    border-[#303A47]
                                                    sm:border-t-0
                                                    sm:border-l
                                                `
                                                : ''
                                        }

                                        ${
                                            active
                                                ? option.active
                                                : blocked
                                                  ? `
                                                        cursor-not-allowed
                                                        opacity-35
                                                        text-[#4B5562]
                                                    `
                                                  : `
                                                        text-[#788491]
                                                        hover:bg-[#151B24]
                                                        hover:text-[#D3D9DF]
                                                    `
                                        }

                                        ${
                                            loading
                                                ? 'cursor-not-allowed opacity-50'
                                                : active
                                                  ? 'cursor-default'
                                                  : blocked
                                                    ? 'cursor-not-allowed'
                                                    : 'cursor-pointer'
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            gap-2
                                        "
                                    >
                                        <div
                                            className={`
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center

                                                ${
                                                    active
                                                        ? option.iconActive
                                                        : `
                                                            bg-[#151B24]
                                                            text-[#687482]
                                                            group-hover:text-[#AEB7C3]
                                                        `
                                                }
                                            `}
                                        >
                                            <Icon size={14} strokeWidth={1.8} />
                                        </div>

                                        {active && (
                                            <Check
                                                size={13}
                                                strokeWidth={2.2}
                                                className="
                                                    text-current
                                                "
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-[11.5px]
                                                font-semibold!
                                            "
                                        >
                                            {option.label}
                                        </p>

                                        <p
                                            className={`
                                                mt-0.5
                                                text-[9.5px]

                                                ${
                                                    active
                                                        ? 'text-current opacity-65'
                                                        : blocked
                                                          ? 'text-[#4B5562]'
                                                          : 'text-[#56616E]'
                                                }
                                            `}
                                        >
                                            {active
                                                ? 'Current status'
                                                : blocked
                                                  ? 'Not available'
                                                  : option.helper}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div
                            role="alert"
                            className="
                                mt-3.5
                                border-l-2
                                border-[#A8444D]
                                bg-[#21171A]
                                px-3
                                py-2.5
                            "
                        >
                            <p
                                className="
                                    text-[10.5px]
                                    font-medium!
                                    leading-5
                                    text-[#D07880]
                                "
                            >
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* =====================================================
                    FOOTER
                ====================================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-[#252D38]
                        bg-[#0C1016]
                        px-5
                        py-3
                        sm:px-6
                    "
                >
                    <p
                        className="
                            hidden
                            text-[9.5px]
                            text-[#56616E]
                            sm:block
                        "
                    >
                        Status changes are applied immediately.
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            ml-auto
                            h-8.5
                            px-3.5
                            text-[10.5px]
                            font-semibold!
                            text-[#8F9AA6]
                            transition-colors
                            hover:bg-[#151B24]
                            hover:text-[#EEF1F5]
                            disabled:pointer-events-none
                            disabled:opacity-50
                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;

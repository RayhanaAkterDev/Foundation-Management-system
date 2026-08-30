import React from 'react';

import {
    X,
    Check,
    CircleCheck,
    CircleX,
    Clock3,
    Building2,
} from 'lucide-react';

const OrganizationVerificationModal = ({
    organization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    if (!organization) {
        return null;
    }

    const options = [
        {
            status: 'verified',
            label: 'Verified',
            icon: CircleCheck,
        },
        {
            status: 'pending',
            label: 'Pending',
            icon: Clock3,
        },
        {
            status: 'rejected',
            label: 'Rejected',
            icon: CircleX,
        },
    ];

    const formatType = (type) => {
        if (!type) {
            return 'Type not specified';
        }

        return type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const currentStatus =
        organization.verification_status?.charAt(0).toUpperCase() +
            organization.verification_status?.slice(1) || 'Unknown';

    const statusStyle = {
        verified: {
            dot: 'bg-emerald-400',
            text: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            iconBg: 'bg-emerald-100',
            iconText: 'text-emerald-700',
            check: 'bg-emerald-600',
        },

        pending: {
            dot: 'bg-accent',
            text: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            iconBg: 'bg-amber-100',
            iconText: 'text-amber-700',
            check: 'bg-accent',
        },

        rejected: {
            dot: 'bg-rose-400',
            text: 'text-rose-700',
            bg: 'bg-rose-50',
            border: 'border-rose-200',
            iconBg: 'bg-rose-100',
            iconText: 'text-rose-700',
            check: 'bg-rose-600',
        },
    };

    const currentStyle = statusStyle[organization.verification_status] || {
        dot: 'bg-slate-400',
        text: 'text-text-secondary',
        bg: 'bg-background-alt',
        border: 'border-slate-200',
        iconBg: 'bg-background-alt',
        iconText: 'text-text-secondary',
        check: 'bg-slate-500',
    };

    return (
        <div
            className="
                fixed inset-0 z-60
                flex items-center justify-center
                overflow-y-auto
                bg-slate-950/60
                px-3
                py-3
                backdrop-blur-[2px]
                sm:px-5
                sm:py-6
            "
        >
            <div
                className="
                    relative
                    my-auto
                    grid
                    w-full
                    max-w-190
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200/90
                    bg-background
                    shadow-[0_28px_70px_-24px_rgba(15,23,42,0.48)]
                    sm:rounded-2xl
                    sm:grid-cols-[0.88fr_1.12fr]
                "
            >
                {/* =========================================================
                    CLOSE
                ========================================================== */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close verification modal"
                    className="
                        absolute
                        right-3
                        top-3
                        z-30
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-200/80
                        bg-white/95
                        text-slate-500
                        shadow-sm
                        transition-all
                        duration-200
                        hover:border-slate-300
                        hover:bg-white
                        hover:text-slate-800
                        disabled:pointer-events-none
                        disabled:opacity-40
                        sm:right-5
                        sm:top-5
                    "
                >
                    <X size={15} strokeWidth={1.8} />
                </button>

                {/* =========================================================
                    LEFT — ORGANIZATION
                ========================================================== */}
                <section
                    className="
                        relative
                        flex
                        min-h-0
                        flex-col
                        overflow-hidden
                        bg-primary-hover
                        px-5
                        py-6
                        sm:min-h-135
                        sm:px-8
                        sm:py-9
                        md:px-9
                        md:py-10
                    "
                >
                    {/* Background detail */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-56
                            w-56
                            rounded-full
                            border
                            border-white/5.5
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-28
                            -left-20
                            h-56
                            w-56
                            rounded-full
                            border
                            border-white/4
                        "
                    />

                    {/* Section label */}
                    <div className="relative flex items-center gap-3">
                        <span className="h-px w-5 shrink-0 bg-white/30" />

                        <p
                            className="
                                font-jost
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-white/50
                            "
                        >
                            Organization
                        </p>
                    </div>

                    {/* Organization identity */}
                    <div
                        className="
                            relative
                            mt-9
                            sm:mt-14
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-[10px]
                                bg-white
                                text-primary-hover
                                shadow-[0_10px_25px_-16px_rgba(0,0,0,0.65)]
                                sm:h-14
                                sm:w-14
                            "
                        >
                            <Building2
                                size={21}
                                strokeWidth={1.6}
                                className="sm:h-5.75 sm:w-5.75"
                            />
                        </div>

                        <h2
                            className="
                                mt-5
                                max-w-full
                                wrap-break-word
                                font-fraunces
                                text-[25px]
                                font-semibold
                                leading-[1.05]
                                tracking-[-0.035em]
                                text-white
                                sm:mt-7
                                sm:max-w-72
                                sm:text-[32px]
                            "
                        >
                            {organization.name}
                        </h2>

                        <p
                            className="
                                mt-2.5
                                font-jost
                                text-[8.5px]
                                font-semibold
                                uppercase
                                tracking-widest
                                text-white/45
                                sm:mt-3
                                sm:text-[9px]
                            "
                        >
                            {formatType(organization.organization_type)}
                        </p>
                    </div>

                    {/* Current status */}
                    <div
                        className="
                            relative
                            mt-9
                            sm:mt-auto
                            sm:pt-16
                        "
                    >
                        <div className="flex items-center gap-3">
                            <p
                                className="
                                    whitespace-nowrap
                                    font-jost
                                    text-[7.5px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-white/40
                                    sm:text-[8px]
                                "
                            >
                                Current status
                            </p>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div
                            className="
                                mt-2.5
                                flex
                                items-center
                                justify-between
                                rounded-lg
                                border
                                border-white/10
                                bg-black/8
                                px-3
                                py-2.5
                                sm:mt-3
                                sm:px-3.5
                                sm:py-3
                            "
                        >
                            <div className="flex min-w-0 items-center gap-2.5">
                                <span
                                    className={`
                                        h-1.75
                                        w-1.75
                                        shrink-0
                                        rounded-full
                                        ${currentStyle.dot}
                                    `}
                                />

                                <span
                                    className="
                                        truncate
                                        font-jost
                                        text-[9.5px]
                                        font-semibold
                                        text-white
                                        sm:text-[10px]
                                    "
                                >
                                    {currentStatus}
                                </span>
                            </div>

                            <span
                                className="
                                    ml-3
                                    shrink-0
                                    font-jost
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-white/25
                                "
                            >
                                Review
                            </span>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    RIGHT — DECISION
                ========================================================== */}
                <section
                    className="
                        flex
                        min-h-0
                        flex-col
                        bg-surface-soft
                        px-5
                        py-7
                        sm:min-h-135
                        sm:px-8
                        sm:py-9
                        md:px-9
                        md:py-10
                    "
                >
                    <div className="flex-1">
                        {/* Section label */}
                        <div className="flex items-center gap-3">
                            <span className="h-px w-5 shrink-0 bg-primary/40" />

                            <p
                                className="
                                    font-jost
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.22em]
                                    text-primary
                                "
                            >
                                Decision
                            </p>
                        </div>

                        {/* Heading */}
                        <h3
                            className="
                                mt-4
                                max-w-full
                                font-fraunces
                                text-[27px]
                                font-semibold
                                leading-[1.06]
                                tracking-[-0.04em]
                                text-text-primary
                                sm:mt-5
                                sm:max-w-115
                                sm:text-[33px]
                            "
                        >
                            Choose
                            <br />
                            verification
                            <br />
                            outcome
                        </h3>

                        {/* Description */}
                        <p
                            className="
                                mt-4
                                max-w-full
                                text-[10.5px]
                                leading-[1.65]
                                text-text-secondary
                                sm:mt-4
                                sm:max-w-105
                                sm:text-[11.5px]
                            "
                        >
                            Select the status that best represents the outcome
                            of your organization review.
                        </p>

                        {/* =================================================
                            OPTIONS
                        ================================================== */}
                        <div
                            className="
                                mt-7
                                sm:mt-9
                            "
                        >
                            <div
                                className="
                                    grid
                                    grid-cols-3
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-surface
                                    sm:rounded-xl
                                "
                            >
                                {options.map((option, index) => {
                                    const Icon = option.icon;

                                    const active =
                                        organization.verification_status ===
                                        option.status;

                                    const isVerified =
                                        option.status === 'verified';

                                    const isPending =
                                        option.status === 'pending';

                                    const isRejected =
                                        option.status === 'rejected';

                                    return (
                                        <button
                                            key={option.status}
                                            type="button"
                                            disabled={loading || active}
                                            onClick={() =>
                                                onConfirm(option.status)
                                            }
                                            className={`
                                                group
                                                relative
                                                flex
                                                min-w-0
                                                flex-col
                                                items-center
                                                justify-center
                                                gap-2
                                                px-1.5
                                                py-4
                                                transition-all
                                                duration-200
                                                sm:gap-2.5
                                                sm:px-2
                                                sm:py-5.5
                                                cursor-pointer
                                                ${
                                                    index > 0
                                                        ? 'border-l border-slate-200'
                                                        : ''
                                                }
                                                ${
                                                    active && isVerified
                                                        ? 'bg-emerald-50/75 text-emerald-700'
                                                        : active && isPending
                                                          ? 'bg-amber-50/75 text-amber-700'
                                                          : active && isRejected
                                                            ? 'bg-rose-50/75 text-rose-700'
                                                            : 'bg-surface text-text-secondary hover:bg-background-alt hover:text-text-primary'
                                                }
                                                disabled:cursor-default
                                            `}
                                        >
                                            {/* Active indicator */}
                                            {active && (
                                                <span
                                                    className={`
                                                        absolute
                                                        right-1.5
                                                        top-1.5
                                                        flex
                                                        h-3.5
                                                        w-3.5
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        text-white
                                                        sm:right-2
                                                        sm:top-2
                                                        sm:h-4
                                                        sm:w-4
                                                        ${
                                                            isVerified
                                                                ? 'bg-emerald-600'
                                                                : isPending
                                                                  ? 'bg-accent'
                                                                  : 'bg-rose-600'
                                                        }
                                                    `}
                                                >
                                                    <Check
                                                        size={7}
                                                        strokeWidth={3}
                                                        className="sm:h-2 sm:w-2"
                                                    />
                                                </span>
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    transition-all
                                                    duration-200
                                                    sm:h-10
                                                    sm:w-10
                                                    ${
                                                        active && isVerified
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : active &&
                                                                isPending
                                                              ? 'bg-amber-100 text-amber-700'
                                                              : active &&
                                                                  isRejected
                                                                ? 'bg-rose-100 text-rose-700'
                                                                : 'bg-background-alt text-text-secondary group-hover:bg-background group-hover:text-primary'
                                                    }
                                                `}
                                            >
                                                <Icon
                                                    size={16}
                                                    strokeWidth={
                                                        active ? 2 : 1.65
                                                    }
                                                    className="sm:h-4.25 sm:w-4.25"
                                                />
                                            </div>

                                            {/* Label */}
                                            <span
                                                className={`
                                                    truncate
                                                    text-[9px]
                                                    font-semibold
                                                    sm:text-[10.5px]
                                                    ${
                                                        active
                                                            ? 'text-current'
                                                            : 'text-text-secondary group-hover:text-text-primary'
                                                    }
                                                `}
                                            >
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Helper text */}
                        <p
                            className="
                                mt-3
                                max-w-full
                                text-[9px]
                                leading-4
                                text-text-secondary
                                sm:mt-5
                                sm:text-[10px]
                            "
                        >
                            The selected verification status will be applied
                            immediately.
                        </p>

                        {/* =================================================
                            ERROR
                        ================================================== */}
                        {error && (
                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-rose-200
                                    bg-rose-50/80
                                    px-3
                                    py-2.5
                                    sm:mt-5
                                    sm:px-4
                                    sm:py-3
                                "
                            >
                                <div className="flex items-start gap-2.5 sm:gap-3">
                                    <div
                                        className="
                                            flex
                                            h-6.5
                                            w-6.5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-md
                                            bg-rose-100
                                            text-rose-600
                                            sm:h-7
                                            sm:w-7
                                        "
                                    >
                                        <CircleX
                                            size={13}
                                            strokeWidth={2}
                                            className="sm:h-3.5 sm:w-3.5"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="
                                                text-[9.5px]
                                                font-bold
                                                text-rose-800
                                                sm:text-[10.5px]
                                            "
                                        >
                                            Unable to update verification
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                wrap-break-word
                                                text-[9px]
                                                leading-4
                                                text-rose-700
                                                sm:text-[10px]
                                            "
                                        >
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =====================================================
                        FOOTER
                    ====================================================== */}
                    <div
                        className="
                            mt-7
                            flex
                            items-center
                            justify-between
                            gap-3
                            border-t
                            border-slate-200
                            pt-3.5
                            sm:mt-9
                            sm:gap-4
                            sm:pt-5
                        "
                    >
                        <p
                            className="
                                hidden
                                text-[9.5px]
                                font-medium
                                leading-4
                                text-text-secondary
                                xs:block
                            "
                        >
                            Review carefully before changing the status.
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                ml-auto
                                rounded-lg
                                px-3
                                py-2
                                text-[10px]
                                font-semibold
                                text-text-secondary
                                transition-all
                                duration-200
                                hover:bg-background
                                hover:text-text-primary
                                disabled:pointer-events-none
                                disabled:opacity-50
                                sm:px-4
                                sm:text-[10.5px]
                                cursor-pointer
                            "
                        >
                            Cancel
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrganizationVerificationModal;

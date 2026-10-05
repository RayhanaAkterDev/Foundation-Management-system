// src/dashboard/admin/organizations/components/EditOrganizationView.jsx

import React from 'react';

import { Building2, FileText, Info, Mail, ShieldCheck } from 'lucide-react';

import OrganizationForm from './OrganizationForm';

import { formatType } from '../utils/organizationDetailsUtils';

/* ==========================================================================
   INFO ROW
============================================================================ */

const InfoRow = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex min-w-0 items-start gap-3">
            <div
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center

                    border
                    border-[#29323E]

                    bg-[#151B24]

                    text-[#697586]
                "
            >
                <Icon size={13} strokeWidth={1.65} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p
                    className="
                        font-sans!
                        text-[8.5px]
                        font-semibold!
                        uppercase
                        tracking-[0.13em]

                        text-[#5E6978]!
                    "
                >
                    {label}
                </p>

                <p
                    className={`
                        mt-1.5
                        wrap-break-word

                        font-sans!
                        text-[10.5px]
                        font-medium!
                        leading-5

                        ${value ? 'text-[#AEB7C3]!' : 'text-[#5E6978]!'}
                    `}
                >
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
};

/* ==========================================================================
   STATUS
============================================================================ */

const VerificationStatus = ({ status }) => {
    const normalizedStatus = String(status || 'pending').toLowerCase();

    const config = {
        verified: {
            dot: 'bg-[#6FA58A]',
            text: 'text-[#9FC4AF]!',
            label: 'Verified',
        },

        pending: {
            dot: 'bg-[#C09558]',
            text: 'text-[#D5B37F]!',
            label: 'Pending review',
        },

        rejected: {
            dot: 'bg-[#B86D73]',
            text: 'text-[#D99A9F]!',
            label: 'Rejected',
        },
    };

    const current = config[normalizedStatus] || config.pending;

    return (
        <div className="flex items-center gap-2">
            <span
                className={`
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full

                    ${current.dot}
                `}
            />

            <span
                className={`
                    font-sans!
                    text-[10.5px]
                    font-medium!

                    ${current.text}
                `}
            >
                {current.label}
            </span>
        </div>
    );
};

/* ==========================================================================
   EDIT ORGANIZATION VIEW
============================================================================ */

const EditOrganizationView = ({
    organization,
    saving = false,
    saveError = '',
    fieldErrors = {},
    onSubmit,
    onCancel,
}) => {
    if (!organization) {
        return null;
    }

    const name = organization.name || 'Unnamed organization';

    const email = organization.user?.email || organization.email || '';

    const organizationType = organization.organization_type
        ? formatType(organization.organization_type)
        : '';

    const registrationNumber = organization.registration_number || '';

    const verificationStatus = organization.verification_status || 'pending';

    const photo =
        organization.photo ||
        organization.logo ||
        organization.organization_logo ||
        organization.user?.photo ||
        '';

    const initials =
        name !== 'Unnamed organization'
            ? name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) => word.charAt(0).toUpperCase())
                  .join('')
            : '';

    return (
        <div
            className="
                grid
                min-w-0
                grid-cols-1
                gap-5

                lg:grid-cols-[270px_minmax(0,1fr)]
                lg:items-start
                lg:gap-6

                xl:grid-cols-[290px_minmax(0,1fr)]
                xl:gap-7
            "
        >
            {/* =============================================================
                LEFT SIDEBAR
            ============================================================== */}

            <aside
                className="
                    min-w-0

                    border
                    border-[#252D38]

                    bg-[#0E1219]

                    lg:sticky
                    lg:top-6
                "
            >
                {/* =========================================================
                    ORGANIZATION IDENTITY
                ========================================================== */}

                <div
                    className="
                        border-b
                        border-[#252D38]

                        px-5
                        py-6

                        sm:px-6

                        lg:px-5
                        lg:py-7

                        xl:px-6
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            gap-4

                            lg:block
                        "
                    >
                        {/* LOGO / AVATAR */}

                        <div className="shrink-0">
                            <div
                                className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    overflow-hidden

                                    border
                                    border-[#303A47]

                                    bg-[#151B24]

                                    text-[#8792A1]

                                    lg:h-16
                                    lg:w-16
                                "
                            >
                                {photo ? (
                                    <img
                                        src={photo}
                                        alt=""
                                        className="
                                            block
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                'none';
                                        }}
                                    />
                                ) : initials ? (
                                    <span
                                        className="
                                            select-none

                                            font-sans!
                                            text-[17px]
                                            font-semibold!
                                            uppercase

                                            text-[#C7CED8]!

                                            lg:text-[19px]
                                        "
                                    >
                                        {initials}
                                    </span>
                                ) : (
                                    <Building2 size={21} strokeWidth={1.6} />
                                )}
                            </div>
                        </div>

                        {/* IDENTITY */}

                        <div
                            className="
                                min-w-0
                                flex-1

                                lg:mt-5
                            "
                        >
                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.16em]

                                    text-[#697586]!
                                "
                            >
                                Editing organization
                            </p>

                            <h2
                                title={name}
                                className="
                                    mt-2
                                    wrap-break-word

                                    font-sans!
                                    text-[16px]
                                    font-semibold!
                                    leading-[1.4]
                                    tracking-[-0.015em]

                                    text-[#EEF1F5]!

                                    sm:text-[17px]
                                "
                            >
                                {name}
                            </h2>

                            <div className="mt-2.5">
                                <VerificationStatus
                                    status={verificationStatus}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    CURRENT INFORMATION
                ========================================================== */}

                <div
                    className="
                        px-5
                        py-6

                        sm:px-6

                        lg:px-5
                        lg:py-7

                        xl:px-6
                    "
                >
                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <Info
                            size={13}
                            strokeWidth={1.7}
                            className="text-[#697586]"
                        />

                        <p
                            className="
                                font-sans!
                                text-[9px]
                                font-semibold!
                                uppercase
                                tracking-[0.14em]

                                text-[#697586]!
                            "
                        >
                            Current profile
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5

                            sm:grid-cols-3

                            lg:grid-cols-1
                        "
                    >
                        <InfoRow
                            icon={Building2}
                            label="Organization type"
                            value={organizationType}
                        />

                        <InfoRow icon={Mail} label="Email" value={email} />

                        <InfoRow
                            icon={FileText}
                            label="Registration"
                            value={registrationNumber}
                        />
                    </div>
                </div>

                {/* =========================================================
                    VERIFICATION NOTE
                ========================================================== */}

                <div
                    className="
                        border-t
                        border-[#252D38]

                        bg-[#121821]

                        px-5
                        py-5

                        sm:px-6

                        lg:px-5

                        xl:px-6
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >
                        <ShieldCheck
                            size={15}
                            strokeWidth={1.7}
                            className="
                                mt-0.5
                                shrink-0

                                text-[#697586]
                            "
                        />

                        <div className="min-w-0">
                            <p
                                className="
                                    font-sans!
                                    text-[10.5px]
                                    font-semibold!

                                    text-[#B8C0CA]!
                                "
                            >
                                Verification status
                            </p>

                            <div className="mt-2">
                                <VerificationStatus
                                    status={verificationStatus}
                                />
                            </div>

                            <p
                                className="
                                    mt-2

                                    font-sans!
                                    text-[10.5px]
                                    font-normal!
                                    leading-[1.65]

                                    text-[#697586]!
                                "
                            >
                                Editing profile information does not
                                automatically change the organization&apos;s
                                verification status.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* =============================================================
                RIGHT FORM
            ============================================================== */}

            <main
                className="
                    min-w-0

                    border
                    border-[#252D38]

                    bg-[#0E1219]
                "
            >
                {/* =========================================================
                    FORM HEADER
                ========================================================== */}

                <div
                    className="
                        border-b
                        border-[#252D38]

                        px-5
                        py-6

                        sm:px-7
                        sm:py-7

                        lg:px-9
                        lg:py-8

                        xl:px-11
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3.5
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

                                text-[#8792A1]
                            "
                        >
                            <Building2 size={16} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.16em]

                                    text-[#697586]!
                                "
                            >
                                Profile editor
                            </p>

                            <h2
                                className="
                                    mt-1.5

                                    font-sans!
                                    text-[16px]
                                    font-semibold!
                                    leading-6
                                    tracking-[-0.015em]

                                    text-[#EEF1F5]!

                                    sm:text-[17px]
                                "
                            >
                                Edit organization information
                            </h2>

                            <p
                                className="
                                    mt-1.5
                                    max-w-2xl

                                    font-sans!
                                    text-[11px]
                                    font-normal!
                                    leading-[1.7]

                                    text-[#697586]!
                                "
                            >
                                Update the organization&apos;s identity,
                                registration and contact information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    FORM
                ========================================================== */}

                <div
                    className="
                        min-w-0

                        px-5
                        py-7

                        sm:px-7
                        sm:py-8

                        lg:px-9
                        lg:py-9

                        xl:px-11
                        xl:py-10
                    "
                >
                    <OrganizationForm
                        key={organization.id}
                        mode="edit"
                        organization={organization}
                        loading={saving}
                        error={saveError}
                        fieldErrors={fieldErrors}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                </div>
            </main>
        </div>
    );
};

export default EditOrganizationView;

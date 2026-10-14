// src/dashboard/admin/organizations/components/EditOrganizationView.jsx

import React from 'react';

import { Building2, Mail, PencilLine, ShieldCheck } from 'lucide-react';

import OrganizationForm from './OrganizationForm';

import { formatType } from '../utils/organizationDetailsUtils';

/* ============================================================
   HELPERS
============================================================ */

const formatVerificationStatus = (status) => {
    if (!status) {
        return 'Pending review';
    }

    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === 'verified') {
        return 'Verified';
    }

    if (normalizedStatus === 'pending') {
        return 'Pending review';
    }

    if (normalizedStatus === 'rejected') {
        return 'Rejected';
    }

    return String(status)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getVerificationDot = (status) => {
    const normalizedStatus = String(status || 'pending').toLowerCase();

    if (normalizedStatus === 'verified') {
        return 'bg-[#6FA58A]';
    }

    if (normalizedStatus === 'rejected') {
        return 'bg-[#B86D73]';
    }

    return 'bg-[#C09558]';
};

/* ============================================================
   EDIT ORGANIZATION VIEW
============================================================ */

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
        : 'Organization';

    const verificationStatus = organization.verification_status || 'pending';

    const verificationLabel = formatVerificationStatus(verificationStatus);

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
        <div className="w-full font-sans!">
            <section
                className="
                    overflow-hidden
                    border
                    border-[#252D38]
                    bg-[#0E1219]
                "
            >
                <div
                    className="
                        grid
                        lg:grid-cols-[270px_minmax(0,1fr)]
                        xl:grid-cols-[290px_minmax(0,1fr)]
                    "
                >
                    {/* =================================================
                        EDIT ORGANIZATION SIDEBAR
                    ================================================== */}

                    <aside
                        className="
                            relative
                            overflow-hidden
                            border-b
                            border-[#252D38]
                            bg-[#0E1219]

                            lg:border-r
                            lg:border-b-0
                        "
                    >
                        {/* Accent */}

                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                top-0
                                left-0

                                h-[2px]
                                w-full

                                bg-[#465261]

                                lg:h-full
                                lg:w-[2px]
                            "
                        />

                        <div
                            className="
                                flex
                                h-full
                                flex-col

                                px-5
                                py-5

                                sm:px-6
                                sm:py-6

                                lg:min-h-[640px]
                                lg:px-7
                                lg:py-8

                                xl:px-8
                                xl:py-9
                            "
                        >
                            {/* =========================================
                                EDIT CONTEXT
                            ========================================== */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            shrink-0
                                            items-center
                                            justify-center

                                            border
                                            border-[#303A47]

                                            bg-[#151B24]

                                            text-[#8792A1]
                                        "
                                    >
                                        <PencilLine
                                            size={12}
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    <span
                                        className="
                                            font-sans!
                                            text-[8.5px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#8792A1]!

                                            sm:text-[9px]
                                        "
                                    >
                                        Editing
                                    </span>
                                </div>

                                <span
                                    className="
                                        shrink-0

                                        font-sans!
                                        text-[8.5px]
                                        font-medium!
                                        uppercase
                                        tracking-[0.1em]

                                        text-[#5E6978]!

                                        sm:text-[9px]
                                    "
                                >
                                    {organizationType}
                                </span>
                            </div>

                            {/* =========================================
                                ORGANIZATION IDENTITY
                            ========================================== */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    min-w-0
                                    items-center
                                    gap-4

                                    sm:mt-7

                                    lg:mt-8
                                    lg:block
                                "
                            >
                                {/* Logo */}

                                <div
                                    className="
                                        relative
                                        flex

                                        h-[58px]
                                        w-[58px]
                                        shrink-0

                                        items-center
                                        justify-center
                                        overflow-hidden

                                        border
                                        border-[#303A47]

                                        bg-[#151B24]

                                        font-sans!
                                        text-[17px]
                                        font-semibold!
                                        uppercase

                                        text-[#DCE1E7]!

                                        sm:h-[62px]
                                        sm:w-[62px]
                                        sm:text-[18px]

                                        lg:h-[68px]
                                        lg:w-[68px]
                                        lg:text-[19px]
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
                                        initials
                                    ) : (
                                        <Building2
                                            size={23}
                                            strokeWidth={1.55}
                                        />
                                    )}

                                    {/* Edit indicator */}

                                    <span
                                        className="
                                            absolute
                                            -right-[5px]
                                            -bottom-[5px]

                                            flex
                                            h-5
                                            w-5
                                            items-center
                                            justify-center

                                            border-[3px]
                                            border-[#0E1219]

                                            bg-[#1D2632]

                                            text-[#AEB7C3]
                                        "
                                    >
                                        <PencilLine size={8} strokeWidth={2} />
                                    </span>
                                </div>

                                {/* Identity */}

                                <div
                                    className="
                                        min-w-0
                                        flex-1

                                        lg:mt-5
                                    "
                                >
                                    <h2
                                        title={name}
                                        className="
                                            truncate

                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-[1.35]
                                            tracking-[-0.02em]

                                            text-[#EEF1F5]!

                                            sm:text-[17px]

                                            lg:whitespace-normal
                                            lg:text-[19px]
                                        "
                                    >
                                        {name}
                                    </h2>

                                    <div
                                        className="
                                            mt-1.5
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2

                                            lg:mt-2
                                        "
                                    >
                                        <Mail
                                            size={12}
                                            strokeWidth={1.7}
                                            className="
                                                shrink-0
                                                text-[#697586]
                                            "
                                        />

                                        <p
                                            title={email}
                                            className="
                                                min-w-0
                                                truncate

                                                font-sans!
                                                text-[10.5px]
                                                font-normal!
                                                leading-5

                                                text-[#8792A1]!

                                                sm:text-[11px]
                                            "
                                        >
                                            {email || 'No email provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =========================================
                                VERIFICATION INFORMATION
                            ========================================== */}

                            <div
                                className="
                                    mt-6
                                    border-t
                                    border-[#252D38]
                                    pt-5

                                    sm:mt-7
                                    sm:pt-6

                                    lg:mt-8
                                    lg:pt-7
                                "
                            >
                                <p
                                    className="
                                        font-sans!
                                        text-[8.5px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.14em]

                                        text-[#697586]!

                                        sm:text-[9px]
                                    "
                                >
                                    Verification
                                </p>

                                <div
                                    className="
                                        mt-3.5
                                        flex
                                        items-center
                                        justify-between
                                        gap-4

                                        sm:mt-4
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2.5
                                        "
                                    >
                                        <span
                                            className={`
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full

                                                ${getVerificationDot(
                                                    verificationStatus,
                                                )}
                                            `}
                                        />

                                        <span
                                            className="
                                                truncate

                                                font-sans!
                                                text-[11px]
                                                font-medium!

                                                text-[#B8C0CA]!

                                                sm:text-[11.5px]
                                            "
                                        >
                                            {verificationLabel}
                                        </span>
                                    </div>

                                    <span
                                        className="
                                            shrink-0

                                            font-sans!
                                            text-[8px]
                                            font-medium!
                                            uppercase
                                            tracking-[0.11em]

                                            text-[#5E6978]!

                                            sm:text-[8.5px]
                                        "
                                    >
                                        Current
                                    </span>
                                </div>
                            </div>

                            {/* =========================================
                                SIDEBAR FOOTER
                            ========================================== */}

                            <div
                                className="
                                    mt-6
                                    border-t
                                    border-[#252D38]
                                    pt-4

                                    sm:mt-7
                                    sm:pt-5

                                    lg:mt-auto
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-2.5
                                    "
                                >
                                    <ShieldCheck
                                        size={13}
                                        strokeWidth={1.7}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[#697586]
                                        "
                                    />

                                    <span
                                        className="
                                            font-sans!
                                            text-[9px]
                                            font-normal!
                                            leading-[1.6]

                                            text-[#5E6978]!

                                            sm:text-[9.5px]
                                        "
                                    >
                                        Editing profile information does not
                                        automatically change the
                                        organization&apos;s verification status.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =================================================
                        EDIT WORKSPACE
                    ================================================== */}

                    <main
                        className="
                            min-w-0

                            bg-[#151A21]

                            px-5
                            py-6

                            sm:px-6
                            sm:py-7

                            lg:px-9
                            lg:py-9

                            xl:px-10
                            xl:py-10

                            2xl:px-11
                        "
                    >
                        <div className="mx-auto w-full">
                            {/* =========================================
                                WORKSPACE HEADER
                            ========================================== */}

                            <div
                                className="
                                    mb-7
                                    flex
                                    flex-col
                                    gap-3

                                    border-b
                                    border-[#252D38]
                                    pb-5

                                    sm:mb-8
                                    sm:pb-6

                                    md:flex-row
                                    md:items-end
                                    md:justify-between
                                    md:gap-8

                                    lg:mb-9
                                    lg:pb-7
                                "
                            >
                                <div className="min-w-0">
                                    <p
                                        className="
                                            font-sans!
                                            text-[8.5px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.16em]

                                            text-[#697586]!

                                            sm:text-[9px]
                                        "
                                    >
                                        Organization settings
                                    </p>

                                    <h3
                                        className="
                                            mt-1.5

                                            font-sans!
                                            text-[16px]
                                            font-semibold!
                                            leading-[1.35]
                                            tracking-[-0.02em]

                                            text-[#EEF1F5]!

                                            sm:text-[17px]

                                            lg:mt-2
                                            lg:text-[18px]
                                        "
                                    >
                                        Edit organization information
                                    </h3>
                                </div>

                                <p
                                    className="
                                        max-w-[380px]

                                        font-sans!
                                        text-[10px]
                                        font-normal!
                                        leading-[1.65]

                                        text-[#697586]!

                                        sm:text-[10.5px]

                                        md:text-right

                                        lg:text-[11px]
                                    "
                                >
                                    Update organization identity, contact
                                    details and profile information.
                                </p>
                            </div>

                            {/* =========================================
                                FORM
                            ========================================== */}

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
            </section>
        </div>
    );
};

export default EditOrganizationView;

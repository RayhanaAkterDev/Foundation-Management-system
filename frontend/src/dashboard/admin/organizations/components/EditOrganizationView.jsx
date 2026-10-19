import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

import OrganizationForm from './OrganizationForm';
import { formatType } from '../utils/organizationDetailsUtils';

/* ==========================================================================
   HELPERS
============================================================================ */

const formatVerificationStatus = (status) => {
    const normalized = String(status || 'pending').toLowerCase();

    if (normalized === 'pending') {
        return 'Pending review';
    }

    return normalized
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getVerificationDot = (status) => {
    switch (String(status || 'pending').toLowerCase()) {
        case 'verified':
            return 'bg-[#6FA58A]';

        case 'rejected':
            return 'bg-[#B86D73]';

        default:
            return 'bg-[#C09558]';
    }
};

/* ==========================================================================
   PREVIEW DETAIL
============================================================================ */

const PreviewDetail = ({ label, value, muted = false }) => (
    <div className="min-w-0">
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
            {label}
        </p>

        <p
            title={value}
            className={`
                mt-1.5 min-w-0 truncate

                font-sans!
                text-[12px]
                font-medium!

                ${muted ? 'text-[#5E6978]!' : 'text-[#B8C0CA]!'}
            `}
        >
            {value}
        </p>
    </div>
);

/* ==========================================================================
   ORGANIZATION AVATAR

   Declared outside EditOrganizationView to comply with
   react-hooks/static-components.
============================================================================ */

const OrganizationAvatar = ({
    photo,
    initial,
    failedPhoto,
    onPhotoError,
    compact = false,
}) => {
    const showPhoto = Boolean(photo && failedPhoto !== photo);

    return (
        <div
            className={`
                flex shrink-0
                items-center justify-center
                overflow-hidden

                border border-[#394555]
                bg-[#1A222D]

                font-sans!
                font-semibold!
                text-[#EEF1F5]

                ${compact ? 'h-11 w-11 text-[15px]' : 'h-17 w-17 text-[20px]'}
            `}
        >
            {showPhoto ? (
                <img
                    src={photo}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => onPhotoError(photo)}
                />
            ) : initial ? (
                <span>{initial}</span>
            ) : (
                <Building2
                    size={compact ? 19 : 22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            )}
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
    const [failedPhoto, setFailedPhoto] = useState(null);

    if (!organization) {
        return null;
    }

    /* ======================================================================
       ORGANIZATION DATA
    ====================================================================== */

    const name = organization.name?.trim() || 'Unnamed organization';

    const initial = organization.name?.trim()?.charAt(0)?.toUpperCase();

    const email = organization.user?.email || organization.email || '';

    const phone = organization.phone || '';

    const website = organization.website || '';

    const organizationType = organization.organization_type
        ? formatType(organization.organization_type)
        : 'Organization';

    const verificationStatus = organization.verification_status || 'pending';

    const verificationLabel = formatVerificationStatus(verificationStatus);

    const photoCandidate =
        organization.photo ||
        organization.logo ||
        organization.organization_logo ||
        organization.user?.photo;

    const photo =
        typeof photoCandidate === 'string' && photoCandidate.trim()
            ? photoCandidate.trim()
            : null;

    /* ======================================================================
       UI
    ====================================================================== */

    return (
        <div className="@container w-full min-w-0 font-sans!">
            <section
                className="
                    min-w-0
                    overflow-hidden

                    border border-[#303A47]
                    bg-[#0E1219]
                "
            >
                <div
                    className="
                        grid min-w-0

                        @6xl:grid-cols-[290px_minmax(0,1fr)]
                        @7xl:grid-cols-[310px_minmax(0,1fr)]
                    "
                >
                    {/* =====================================================
                        COMPACT ORGANIZATION HEADER
                    ===================================================== */}

                    <div
                        className="
                            min-w-0

                            border-b border-[#252D38]
                            bg-[#141B24]

                            px-4 py-4
                            sm:px-6

                            @6xl:hidden
                        "
                    >
                        <div
                            className="
                                flex min-w-0
                                items-center gap-3
                                sm:gap-4
                            "
                        >
                            <OrganizationAvatar
                                compact
                                photo={photo}
                                initial={initial}
                                failedPhoto={failedPhoto}
                                onPhotoError={setFailedPhoto}
                            />

                            <div className="min-w-0 flex-1">
                                <p
                                    title={name}
                                    className="
                                        truncate

                                        font-sans!
                                        text-[14px]
                                        font-semibold!
                                        text-[#DCE2EA]!
                                    "
                                >
                                    {name}
                                </p>

                                <div
                                    className="
                                        mt-1 flex min-w-0
                                        items-center gap-1.5

                                        font-sans!
                                        text-[11px]
                                        text-[#8792A1]!
                                    "
                                >
                                    <Building2
                                        size={12}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                        aria-hidden="true"
                                    />

                                    <span className="truncate">
                                        {organizationType}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="
                                            mx-1
                                            text-[#455160]!
                                        "
                                    >
                                        ·
                                    </span>

                                    <span className="truncate">
                                        {verificationLabel}
                                    </span>
                                </div>
                            </div>

                            <span
                                title={email}
                                className="
                                    hidden max-w-[35%]
                                    truncate text-right

                                    font-sans!
                                    text-[11px]
                                    text-[#8792A1]!

                                    sm:block
                                "
                            >
                                {email || 'No email'}
                            </span>
                        </div>
                    </div>

                    {/* =====================================================
                        DESKTOP PREVIEW SIDEBAR
                    ===================================================== */}

                    <aside
                        className="
                            hidden min-w-0

                            border-[#252D38]
                            bg-[#141B24]

                            @6xl:block
                            @6xl:border-r
                        "
                    >
                        <div
                            className="
                                flex h-full min-h-130
                                min-w-0 flex-col

                                px-6 py-7
                                xl:px-7 xl:py-8
                            "
                        >
                            {/* PREVIEW LABEL */}

                            <div
                                className="
                                    flex items-center gap-3
                                "
                            >
                                <span
                                    aria-hidden="true"
                                    className="
                                        h-0.5 w-4 shrink-0
                                        bg-[#697586]
                                    "
                                />

                                <p
                                    className="
                                        font-sans!
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#8792A1]!
                                    "
                                >
                                    Organization preview
                                </p>
                            </div>

                            {/* ORGANIZATION IDENTITY */}

                            <div className="mt-10 min-w-0">
                                <OrganizationAvatar
                                    photo={photo}
                                    initial={initial}
                                    failedPhoto={failedPhoto}
                                    onPhotoError={setFailedPhoto}
                                />

                                <h2
                                    title={name}
                                    className="
                                        mt-5 min-w-0
                                        wrap-break-word

                                        font-sans!
                                        text-[17px]
                                        font-semibold!
                                        leading-[1.4]
                                        text-[#EEF1F5]!
                                    "
                                >
                                    {name}
                                </h2>

                                <div
                                    className="
                                        mt-2 flex min-w-0
                                        items-center gap-2

                                        text-[#AAB3BF]
                                    "
                                >
                                    <Building2
                                        size={14}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                        aria-hidden="true"
                                    />

                                    <span
                                        className="
                                            truncate

                                            font-sans!
                                            text-[12px]
                                            font-medium!
                                        "
                                    >
                                        {organizationType}
                                    </span>
                                </div>
                            </div>

                            {/* CONTACT DETAILS */}

                            <div
                                className="
                                    mt-9 space-y-6

                                    border-t border-[#252D38]
                                    pt-7
                                "
                            >
                                <PreviewDetail
                                    label="Email"
                                    value={email || 'Not provided'}
                                    muted={!email}
                                />

                                <PreviewDetail
                                    label="Phone"
                                    value={phone || 'Not provided'}
                                    muted={!phone}
                                />

                                <PreviewDetail
                                    label="Website"
                                    value={website || 'Not provided'}
                                    muted={!website}
                                />
                            </div>

                            {/* VERIFICATION STATUS */}

                            <div
                                className="
                                    mt-auto

                                    border-t border-[#252D38]
                                    pt-6
                                "
                            >
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
                                    Verification status
                                </p>

                                <div
                                    className="
                                        mt-3 flex
                                        items-center gap-2.5
                                    "
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`
                                            h-1.5 w-1.5
                                            shrink-0 rounded-full

                                            ${getVerificationDot(
                                                verificationStatus,
                                            )}
                                        `}
                                    />

                                    <span
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-medium!
                                            text-[#B8C0CA]!
                                        "
                                    >
                                        {verificationLabel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* =====================================================
                        FORM WORKSPACE
                    ===================================================== */}

                    <main
                        className="
                            min-w-0
                            bg-[#0E1219]
                        "
                    >
                        <div
                            className="
                                min-w-0

                                px-4 py-7
                                sm:px-8 sm:py-9
                                lg:px-9 lg:py-10
                                xl:px-10
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
            </section>
        </div>
    );
};

export default EditOrganizationView;

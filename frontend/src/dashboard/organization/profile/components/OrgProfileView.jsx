import React, { useState } from 'react';

import {
    ArrowUpRight,
    Building2,
    BriefcaseBusiness,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    Target,
    Users,
} from 'lucide-react';

/* =========================================================
   DATA HELPERS
========================================================= */

const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== '';

const firstValue = (...values) => values.find((value) => hasValue(value));

const readable = (value) => {
    if (!hasValue(value)) return 'Not provided';

    return String(value)
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getList = (value) => {
    if (!value) return [];

    const items = Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? value.split(/[,;\n]/)
          : [value];

    return items
        .map((item) => {
            if (typeof item === 'string') return item.trim();

            if (item && typeof item === 'object') {
                return (
                    firstValue(
                        item.label,
                        item.name,
                        item.title,
                        item.value,
                        item.slug,
                    ) || ''
                );
            }

            return String(item ?? '');
        })
        .filter(Boolean);
};

const textValue = (value) => (hasValue(value) ? String(value) : 'Not provided');

/* =========================================================
   PRESENTATION COMPONENTS
========================================================= */

function SectionHeading({ title }) {
    return (
        <h3 className="m-0 mb-6 text-[19px] font-semibold leading-snug tracking-[-0.02em] !text-[#DCE3EA]">
            {title}
        </h3>
    );
}

function FactRow({ icon: Icon, label, value, href, external }) {
    const provided = hasValue(value);
    const content = textValue(value);

    return (
        <div className="grid min-w-0 grid-cols-1 gap-1.5 py-3 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-5">
            <div className="flex min-w-0 items-start gap-2.5">
                <Icon
                    size={15}
                    strokeWidth={1.7}
                    className="mt-0.5 shrink-0 text-[#7D8C9E]"
                />

                <span className="text-[12px] leading-6 !text-[#91A0B0]">
                    {label}
                </span>
            </div>

            <div className="min-w-0">
                {href && provided ? (
                    <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="inline-flex max-w-full items-start gap-1.5 break-all text-[13px] font-medium leading-6 !text-[#D4DEE8] transition-colors hover:!text-white"
                    >
                        {content}

                        {external && (
                            <ArrowUpRight size={14} className="mt-1 shrink-0" />
                        )}
                    </a>
                ) : (
                    <p
                        className={`min-w-0 break-words text-[13px] leading-6 ${
                            provided ? '!text-[#D2DCE6]' : '!text-[#718194]'
                        }`}
                    >
                        {content}
                    </p>
                )}
            </div>
        </div>
    );
}

function PlainList({ items }) {
    const values = getList(items);

    if (!values.length) {
        return (
            <p className="text-[13px] leading-6 !text-[#78899B]">
                Not provided
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-x-7 gap-y-3 sm:grid-cols-2">
            {values.map((item, index) => (
                <div
                    key={`${item}-${index}`}
                    className="flex min-w-0 items-start gap-3"
                >
                    <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#71869A]" />

                    <span className="min-w-0 break-words text-[13px] leading-6 !text-[#CBD6E1]">
                        {readable(item)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function VerificationStatus({ status }) {
    const normalized = String(status || 'pending').toLowerCase();

    const verified = ['verified', 'approved', 'active'].includes(normalized);

    const rejected = ['rejected', 'declined'].includes(normalized);

    const classes = verified
        ? 'border-[#3C5246] bg-[#1C2923] text-[#B3D0BC]'
        : rejected
          ? 'border-[#563A40] bg-[#2C2025] text-[#DDA8AC]'
          : 'border-[#554836] bg-[#2D281F] text-[#D8BE92]';

    const dot = verified
        ? 'bg-[#91B9A0]'
        : rejected
          ? 'bg-[#D79AA2]'
          : 'bg-[#D2B27D]';

    return (
        <span
            className={`inline-flex items-center gap-2 border px-3 py-2 text-[12px] font-medium ${classes}`}
        >
            <span className={`size-1.5 rounded-full ${dot}`} />

            {readable(status || 'Pending verification')}
        </span>
    );
}

/* =========================================================
   ORGANIZATION PROFILE VIEW
========================================================= */

export default function OrgProfileView({ profile = {}, onEdit }) {
    const [imageError, setImageError] = useState(false);

    const organization = profile.organization || profile;

    const name =
        firstValue(
            organization.organization_name,
            organization.name,
            organization.org_name,
            profile.organization_name,
            profile.name,
        ) || 'Organization name unavailable';

    const logo = firstValue(
        organization.logo,
        organization.photo,
        organization.avatar,
        organization.organization_logo,
        profile.logo,
        profile.photo,
    );

    const verification = firstValue(
        organization.verification_status,
        profile.verification_status,
        'pending',
    );

    const registrationNumber = firstValue(
        organization.registration_number,
        organization.registration_no,
        organization.registration_id,
        profile.registration_number,
        profile.registration_no,
    );

    const organizationType = firstValue(
        organization.organization_type,
        organization.type,
        organization.category,
        profile.organization_type,
    );

    const mission = firstValue(
        organization.mission,
        organization.mission_statement,
        organization.purpose,
        organization.description,
        profile.mission,
        profile.mission_statement,
        profile.purpose,
        profile.description,
    );

    const focusAreas = firstValue(
        organization.focus_areas,
        organization.areas_of_focus,
        organization.categories,
        organization.focus_categories,
        profile.focus_areas,
        profile.areas_of_focus,
        profile.categories,
    );

    const communities = firstValue(
        organization.communities_served,
        organization.target_communities,
        organization.beneficiaries,
        profile.communities_served,
        profile.target_communities,
        profile.beneficiaries,
    );

    const teamSize = firstValue(
        organization.team_size,
        organization.employee_count,
        organization.number_of_members,
        profile.team_size,
    );

    const activities = firstValue(
        organization.primary_activities,
        organization.activities,
        organization.services,
        organization.programs,
        profile.primary_activities,
        profile.activities,
        profile.services,
    );

    const email = firstValue(
        organization.email,
        organization.contact_email,
        profile.email,
        profile.contact_email,
    );

    const phone = firstValue(
        organization.phone,
        organization.contact_phone,
        organization.mobile,
        profile.phone,
        profile.contact_phone,
    );

    const website = firstValue(
        organization.website,
        organization.website_url,
        organization.url,
        profile.website,
        profile.website_url,
    );

    const address = firstValue(
        organization.address,
        organization.office_address,
        organization.location,
        profile.address,
        profile.office_address,
    );

    const district = firstValue(
        organization.district,
        organization.city,
        profile.district,
        profile.city,
    );

    const websiteHref =
        typeof website === 'string' && website.trim()
            ? /^https?:\/\//i.test(website)
                ? website
                : `https://${website}`
            : undefined;

    return (
        <div className="min-w-0 pb-8 font-sans">
            <div className="overflow-hidden border border-[#303A47] bg-[#111720]">
                {/* =================================================
            ORGANIZATION HEADER
        ================================================= */}

                <header className="border-b border-[#303A47] px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
                            {/* ORGANIZATION LOGO */}

                            <div className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden border border-[#455364] bg-[#222D39] sm:size-[108px]">
                                {logo && !imageError ? (
                                    <img
                                        src={logo}
                                        alt={`${name} logo`}
                                        className="size-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <Building2
                                        size={37}
                                        strokeWidth={1.4}
                                        className="text-[#A5B4C3]"
                                    />
                                )}
                            </div>

                            {/* ORGANIZATION IDENTITY */}

                            <div className="min-w-0">
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.13em] !text-[#91A0B1]">
                                    Organization profile
                                </p>

                                <h2 className="m-0 break-words text-[25px] font-semibold leading-tight tracking-[-0.025em] !text-[#E0E7EE] sm:text-[32px]">
                                    {name}
                                </h2>

                                {hasValue(organizationType) && (
                                    <p className="mt-2 text-[13px] !text-[#9BAAB9]">
                                        {readable(organizationType)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* EDIT BUTTON */}

                        {onEdit && (
                            <button
                                type="button"
                                onClick={onEdit}
                                className="
                  inline-flex h-11 shrink-0 items-center
                  justify-center gap-2.5 self-start
                  border border-[#687C90]
                  bg-[#465666] px-5
                  text-[13px] font-semibold text-[#F0F4F8]
                  transition-colors duration-200
                  hover:border-[#8B9FB2]
                  hover:bg-[#586B7D]
                  focus:outline-none
                  lg:self-auto
                "
                            >
                                <Pencil size={16} strokeWidth={1.8} />
                                Edit profile
                            </button>
                        )}
                    </div>

                    {/* STATUS & REGISTRATION */}

                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[#303A47] pt-6">
                        <VerificationStatus status={verification} />

                        {hasValue(registrationNumber) && (
                            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="text-[12px] !text-[#8796A7]">
                                    Registration number
                                </span>

                                <span className="break-all text-[13px] font-medium !text-[#CED8E2]">
                                    {registrationNumber}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* =================================================
            MAIN CONTENT
        ================================================= */}

                <div className="grid min-w-0 grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
                    {/* ===============================================
              LEFT COLUMN
          =============================================== */}

                    <div className="min-w-0 px-5 py-9 sm:px-8 xl:border-r xl:border-[#303A47] xl:px-10 xl:py-10">
                        {/* ABOUT */}

                        <section>
                            <SectionHeading title="About the organization" />

                            <p className="mb-3 text-[12px] font-medium !text-[#92A2B2]">
                                Mission & purpose
                            </p>

                            <p className="whitespace-pre-line text-[14px] leading-[1.95] !text-[#CDD7E1]">
                                {textValue(mission)}
                            </p>
                        </section>

                        {/* SECTION DIVIDER */}

                        <div className="my-10 border-t border-[#293440]" />

                        {/* IMPACT */}

                        <section>
                            <SectionHeading title="Areas of impact" />

                            <div className="space-y-8">
                                <div>
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <Target
                                            size={17}
                                            strokeWidth={1.7}
                                            className="text-[#90A0B1]"
                                        />

                                        <h4 className="m-0 text-[14px] font-medium !text-[#D7E0E9]">
                                            Focus areas
                                        </h4>
                                    </div>

                                    <PlainList items={focusAreas} />
                                </div>

                                <div>
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <Users
                                            size={17}
                                            strokeWidth={1.7}
                                            className="text-[#90A0B1]"
                                        />

                                        <h4 className="m-0 text-[14px] font-medium !text-[#D7E0E9]">
                                            Communities served
                                        </h4>
                                    </div>

                                    <PlainList items={communities} />
                                </div>
                            </div>
                        </section>

                        {/* SECTION DIVIDER */}

                        <div className="my-10 border-t border-[#293440]" />

                        {/* OPERATIONS */}

                        <section>
                            <SectionHeading title="Organization operations" />

                            <div className="space-y-7">
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2.5">
                                        <Users
                                            size={16}
                                            strokeWidth={1.7}
                                            className="text-[#90A0B1]"
                                        />

                                        <span className="text-[13px] !text-[#92A2B2]">
                                            Team size
                                        </span>
                                    </div>

                                    <span className="text-[14px] font-medium !text-[#D6E0E9]">
                                        {textValue(teamSize)}
                                    </span>
                                </div>

                                <div>
                                    <div className="mb-4 flex items-center gap-2.5">
                                        <BriefcaseBusiness
                                            size={17}
                                            strokeWidth={1.7}
                                            className="text-[#90A0B1]"
                                        />

                                        <h4 className="m-0 text-[14px] font-medium !text-[#D7E0E9]">
                                            Primary activities
                                        </h4>
                                    </div>

                                    <PlainList items={activities} />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ===============================================
              RIGHT COLUMN
          =============================================== */}

                    <div className="min-w-0 border-t border-[#303A47] bg-[#151C25] px-5 py-9 sm:px-8 xl:border-t-0 xl:px-9 xl:py-10">
                        {/* ORGANIZATION DETAILS */}

                        <section>
                            <SectionHeading title="Organization details" />

                            <FactRow
                                icon={Building2}
                                label="Organization type"
                                value={readable(organizationType)}
                            />
                        </section>

                        {/* SECTION DIVIDER */}

                        <div className="my-9 border-t border-[#303A47]" />

                        {/* CONTACT INFORMATION */}

                        <section>
                            <SectionHeading title="Contact information" />

                            <div className="space-y-1">
                                <FactRow
                                    icon={Mail}
                                    label="Email"
                                    value={email}
                                    href={email ? `mailto:${email}` : undefined}
                                />

                                <FactRow
                                    icon={Phone}
                                    label="Phone"
                                    value={phone}
                                    href={phone ? `tel:${phone}` : undefined}
                                />

                                <FactRow
                                    icon={Globe}
                                    label="Website"
                                    value={website}
                                    href={websiteHref}
                                    external
                                />

                                <FactRow
                                    icon={MapPin}
                                    label="Office address"
                                    value={address}
                                />

                                <FactRow
                                    icon={MapPin}
                                    label="District / city"
                                    value={district}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

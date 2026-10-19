import React, { useState } from 'react';
import {
    ArrowUpRight,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    FileText,
    Globe,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    Target,
    Users,
} from 'lucide-react';

const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== '';
const firstValue = (...values) => values.find(hasValue);
const textValue = (value) => (hasValue(value) ? String(value) : 'Not provided');
const readable = (value) =>
    hasValue(value)
        ? String(value)
              .replace(/[-_]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Not provided';

function getList(value) {
    if (!hasValue(value)) return [];
    let normalized = value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                normalized = JSON.parse(trimmed);
            } catch {
                normalized = trimmed;
            }
        }
    }
    const items = Array.isArray(normalized)
        ? normalized
        : typeof normalized === 'string'
          ? normalized.split(/[,;\n|]/)
          : normalized && typeof normalized === 'object'
            ? Object.entries(normalized)
                  .filter(([, enabled]) => enabled === true || enabled === 1)
                  .map(([key]) => key)
            : [normalized];
    return items
        .map((item) => {
            if (typeof item === 'string') return item.trim();
            if (item && typeof item === 'object') {
                return String(
                    firstValue(
                        item.label,
                        item.name,
                        item.title,
                        item.value,
                        item.slug,
                    ) || '',
                ).trim();
            }
            return String(item ?? '').trim();
        })
        .filter(Boolean);
}

function SectionHeader({ title, description, action }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
            <div className="min-w-0">
                <h3 className="text-[16px] font-semibold leading-6 !text-[#E3E8EF]">
                    {title}
                </h3>
                {description && (
                    <p className="mt-0.5 text-[12px] leading-5 !text-[#929EAD]">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

function InformationRow({
    icon: Icon,
    label,
    value,
    href,
    external = false,
    last = false,
}) {
    const provided = hasValue(value);
    return (
        <div
            className={`group grid min-w-0 grid-cols-1 gap-1.5 py-3.5 sm:grid-cols-[175px_minmax(0,1fr)] sm:items-center sm:gap-5 ${last ? '' : 'border-b border-[#252E39]'}`}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#879B8D] transition-colors group-hover:text-[#B1C0B7]">
                    <Icon size={16} strokeWidth={1.7} />
                </span>
                <span className="text-[13px] font-medium !text-[#A4AFBC]">
                    {label}
                </span>
            </div>
            {provided && href ? (
                <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="inline-flex min-w-0 items-center gap-2 break-all text-[14px] font-medium leading-6 !text-[#D9E0E9] hover:!text-[#B9D6C8]"
                >
                    <span className="min-w-0">{String(value)}</span>
                    {external && (
                        <ArrowUpRight size={14} className="shrink-0" />
                    )}
                </a>
            ) : (
                <p
                    className={`min-w-0 whitespace-pre-wrap break-words text-[14px] leading-6 ${provided ? 'font-medium !text-[#D9E0E9]' : '!text-[#7F8A99]'}`}
                >
                    {textValue(value)}
                </p>
            )}
        </div>
    );
}

function VerificationStatus({ status }) {
    const normalized = String(status || 'pending')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ');
    const verified = ['verified', 'approved', 'active'].includes(normalized);
    const rejected = ['rejected', 'declined', 'suspended', 'blocked'].includes(
        normalized,
    );
    const Icon = verified ? BadgeCheck : ShieldCheck;
    const color = verified
        ? '!text-[#B9D8C8]'
        : rejected
          ? '!text-[#E8B5B5]'
          : '!text-[#E4D0A7]';
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${color}`}
        >
            <Icon size={15} strokeWidth={1.8} />
            {readable(status || 'Pending verification')}
        </span>
    );
}

function ListSection({ title, icon: Icon, items }) {
    const values = getList(items);
    return (
        <section className="min-w-0">
            <div className="mb-3 flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#29323E] bg-[#151C25] text-[#879B8D]">
                    <Icon size={16} strokeWidth={1.7} />
                </span>
                <h4 className="text-[14px] font-semibold !text-[#DCE3EB]">
                    {title}
                </h4>
                <span className="ml-auto border border-[#343D49] px-1.5 py-0.5 text-[11px] tabular-nums !text-[#AEBAC7]">
                    {values.length}
                </span>
            </div>
            <div className="border-t border-[#29323E]">
                {values.length ? (
                    <ul className="divide-y divide-[#29323E]">
                        {values.map((item, index) => (
                            <li
                                key={`${item}-${index}`}
                                className="flex min-w-0 items-start gap-3 py-3"
                            >
                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#879B8D]" />
                                <span className="min-w-0 break-words text-[13px] leading-6 !text-[#C9D3DE]">
                                    {readable(item)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="py-4 text-[12px] !text-[#8792A1]">
                        Not provided
                    </p>
                )}
            </div>
        </section>
    );
}

export default function OrgProfileView({ profile = {}, onEdit }) {
    const [logoError, setLogoError] = useState(false);
    const [bannerError, setBannerError] = useState(false);
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
    const banner = firstValue(
        organization.banner,
        organization.banner_image,
        organization.banner_url,
        organization.cover_image,
        organization.cover_photo,
        organization.organization_banner,
        profile.banner,
        profile.banner_image,
        profile.banner_url,
        profile.cover_image,
        profile.cover_photo,
        profile.organization_banner,
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
    const websiteHref =
        typeof website === 'string' && website.trim()
            ? /^https?:\/\//i.test(website)
                ? website
                : `https://${website}`
            : undefined;

    return (
        <div className="w-full min-w-0 pb-8 font-sans !text-[#DDE4ED]">
            {/* FULL-WIDTH ORGANIZATION BANNER */}
            <section className="relative isolate mb-5 flex min-h-[230px] w-full min-w-0 items-end overflow-hidden border border-[#29323E] bg-[#1A2530] sm:min-h-[280px] lg:min-h-[320px]">
                {banner && !bannerError ? (
                    <img
                        src={banner}
                        alt={`${name} banner`}
                        loading="lazy"
                        onError={() => setBannerError(true)}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#202B36]" />
                )}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0A1018]/95 via-[#0A1018]/65 to-[#0A1018]/20"
                />
                <div className="relative z-10 w-full px-5 pb-6 pt-16 sm:px-8 sm:pb-8 lg:px-10 lg:pb-9">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-7 bg-[#A7C2B0]" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#BDCEC5]">
                            Our mission
                        </span>
                    </div>
                    <p
                        className={`max-w-[850px] whitespace-pre-line break-words text-[16px] leading-[1.8] sm:text-[18px] ${hasValue(mission) ? '!text-[#EDF0F3]' : '!text-[#ADB7C2]'}`}
                    >
                        {textValue(mission)}
                    </p>
                </div>
            </section>

            {/* IDENTITY + INFORMATION */}
            <div className="grid min-w-0 items-stretch gap-5 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="flex min-w-0">
                    <section className="flex w-full min-w-0 flex-col overflow-hidden border border-[#343D49] bg-[#111720]">
                        <div className="relative isolate flex min-h-[300px] flex-1 items-center justify-center overflow-hidden bg-[#222B36] sm:min-h-[350px] lg:min-h-[370px]">
                            {logo && !logoError ? (
                                <img
                                    src={logo}
                                    alt={`${name} logo`}
                                    loading="lazy"
                                    onError={() => setLogoError(true)}
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#293442]">
                                    <div className="flex h-36 w-36 items-center justify-center border border-[#596878] bg-[#222B36]">
                                        <Building2
                                            size={68}
                                            strokeWidth={1.15}
                                            className="text-[#B6C3D1]"
                                        />
                                    </div>
                                </div>
                            )}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-b from-[#090D13]/20 via-transparent via-[35%] to-[#090D13]/95"
                            />
                            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 sm:px-6">
                                <span className="mb-3 inline-flex border border-white/20 bg-[#111720]/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#D5DDE6]">
                                    Organization
                                </span>
                                <h2 className="break-words text-[25px] font-semibold leading-[1.3] !text-white sm:text-[28px]">
                                    {name}
                                </h2>
                                {hasValue(organizationType) && (
                                    <p className="mt-2 text-[13px] !text-[#D0D8E1]">
                                        {readable(organizationType)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#36404D] bg-[#1B232E] px-5 py-5 sm:px-6">
                            <span className="text-[11px] font-medium uppercase tracking-[0.1em] !text-[#AAB6C4]">
                                Verification status
                            </span>
                            <VerificationStatus status={verification} />
                        </div>
                    </section>
                </aside>

                <section className="flex min-w-0 flex-col overflow-hidden border border-[#29323E] bg-[#0E1219]">
                    <SectionHeader
                        title="Organization information"
                        description="Registration, location and contact details"
                        action={
                            onEdit && (
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    aria-label="Edit organization profile"
                                    className="group inline-flex h-11 shrink-0 items-center justify-center gap-3 border border-[#3C4856] bg-[#202A35] pl-3 pr-4 text-[13px] font-semibold !text-[#DFE6EE] transition-colors hover:border-[#657789] hover:bg-[#2A3643] hover:!text-[#F1F4F7] active:bg-[#1B242E] sm:pl-3.5 sm:pr-5"
                                >
                                    <Pencil
                                        size={15}
                                        strokeWidth={1.8}
                                        className="shrink-0 text-[#A7B8C8]"
                                    />
                                    <span className="whitespace-nowrap">
                                        Edit profile
                                    </span>
                                    <ArrowUpRight
                                        size={15}
                                        strokeWidth={1.8}
                                        className="hidden shrink-0 text-[#8F9EAE] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
                                    />
                                </button>
                            )
                        }
                    />
                    <div className="mx-5 border-t border-[#29323E] sm:mx-7" />
                    <div className="flex-1 px-5 sm:px-7">
                        <InformationRow
                            icon={Building2}
                            label="Organization name"
                            value={name}
                        />
                        <InformationRow
                            icon={BriefcaseBusiness}
                            label="Organization type"
                            value={readable(organizationType)}
                        />
                        <InformationRow
                            icon={FileText}
                            label="Registration number"
                            value={registrationNumber}
                        />
                        <InformationRow
                            icon={MapPin}
                            label="Address"
                            value={address}
                        />
                        <InformationRow
                            icon={Mail}
                            label="Email address"
                            value={email}
                            href={
                                hasValue(email) ? `mailto:${email}` : undefined
                            }
                        />
                        <InformationRow
                            icon={Phone}
                            label="Phone number"
                            value={phone}
                            href={hasValue(phone) ? `tel:${phone}` : undefined}
                        />
                        <InformationRow
                            icon={Globe}
                            label="Website"
                            value={website}
                            href={websiteHref}
                            external
                            last
                        />
                    </div>
                </section>
            </div>

            {/* IMPACT & OPERATIONS — ONE COHESIVE PROFILE SECTION */}
            <section className="mt-5 min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219] sm:mt-6">
                <div className="px-5 pt-6 pb-5 sm:px-7 sm:pt-7">
                    <h3 className="text-[17px] font-semibold !text-[#E3E8EF]">
                        Our work & impact
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 !text-[#929EAD]">
                        What we focus on, who we serve, and how we work
                    </p>
                </div>

                <div className="mx-5 border-t border-[#29323E] sm:mx-7" />

                {[
                    {
                        label: 'Focus areas',
                        Icon: Target,
                        items: getList(focusAreas),
                    },
                    {
                        label: 'Communities served',
                        Icon: Users,
                        items: getList(communities),
                    },
                    {
                        label: 'Primary activities',
                        Icon: BriefcaseBusiness,
                        items: getList(activities),
                    },
                ].map(({ label, Icon, items }, index) => (
                    <div
                        key={label}
                        className={`mx-5 min-w-0 py-5 sm:mx-7 sm:py-6 ${index > 0 ? 'border-t border-[#252E39]' : ''}`}
                    >
                        <div className="grid min-w-0 gap-3 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8">
                            <div className="flex items-center gap-3 self-start md:pt-1">
                                <Icon
                                    size={17}
                                    strokeWidth={1.6}
                                    className="shrink-0 text-[#8B9AA8]"
                                />
                                <h4 className="text-[14px] font-medium !text-[#AAB6C4]">
                                    {label}
                                </h4>
                            </div>
                            <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-2">
                                {items.length ? (
                                    items.map((item, i) => (
                                        <span
                                            key={`${item}-${i}`}
                                            className="inline-flex max-w-full items-center gap-3 text-[14px] leading-6 !text-[#D7DEE7]"
                                        >
                                            {i > 0 && (
                                                <span
                                                    aria-hidden="true"
                                                    className="h-3 w-px shrink-0 bg-[#3B4653]"
                                                />
                                            )}
                                            <span className="break-words">
                                                {readable(item)}
                                            </span>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[14px] !text-[#8792A1]">
                                        Not provided
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="border-t border-[#29323E] bg-[#151C25] px-5 py-4 sm:px-7">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <div className="flex items-center gap-3">
                            <Users
                                size={17}
                                strokeWidth={1.6}
                                className="text-[#8B9AA8]"
                            />
                            <span className="text-[14px] font-medium !text-[#AAB6C4]">
                                Organization team size
                            </span>
                        </div>
                        <span className="text-[17px] font-semibold tabular-nums !text-[#DCE3EA]">
                            {textValue(teamSize)}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}

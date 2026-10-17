import React from 'react';
import {
    Building2,
    Globe,
    Mail,
    MapPin,
    Phone,
    Pencil,
    Users,
    Target,
    HandHeart,
    ShieldCheck,
    ImagePlus,
} from 'lucide-react';

const sectionClass = 'border border-[#2b3836] bg-[#15201e]';

function formatValue(value) {
    if (Array.isArray(value)) {
        return value.length ? value.join(', ') : '';
    }

    if (value === null || value === undefined) {
        return '';
    }

    return String(value).trim();
}

function Detail({ icon: Icon, label, value, href }) {
    const displayValue = formatValue(value);

    return (
        <div className="flex min-w-0 items-start gap-3 py-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#34413f] bg-[#1b2a27] text-[#a5c9bd]">
                <Icon size={17} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[#82918d]">{label}</p>

                {displayValue ? (
                    href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block break-words text-sm leading-6 text-[#c8e6dc] underline decoration-[#426b60] underline-offset-4 transition hover:text-white"
                        >
                            {displayValue}
                        </a>
                    ) : (
                        <p className="mt-1 break-words text-sm leading-6 text-[#d6dfdc]">
                            {displayValue}
                        </p>
                    )
                ) : (
                    <p className="mt-1 text-sm text-[#657570]">Not provided</p>
                )}
            </div>
        </div>
    );
}

function TagList({ title, items }) {
    const values = Array.isArray(items)
        ? items.map(formatValue).filter(Boolean)
        : typeof items === 'string'
          ? items
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
          : [];

    return (
        <div>
            <h3 className="text-sm font-medium text-[#cbd5d1]">{title}</h3>

            {values.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {values.map((item, index) => (
                        <span
                            key={`${item}-${index}`}
                            className="border border-[#344d45] bg-[#1a2b26] px-3 py-1.5 text-xs leading-5 text-[#c4ded3]"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-2 text-sm text-[#657570]">
                    No information added yet.
                </p>
            )}
        </div>
    );
}

function StatusLabel({ status }) {
    const value = formatValue(status) || 'pending';
    const normalized = value.toLowerCase();

    const isVerified = normalized === 'verified';
    const isRejected = normalized === 'rejected';

    const statusClass = isVerified
        ? 'border-[#315b4e] bg-[#19312c] text-[#b9e5d7]'
        : isRejected
          ? 'border-red-900/60 bg-red-950/30 text-red-300'
          : 'border-[#574b36] bg-[#2b271e] text-[#e5c99a]';

    return (
        <span
            className={`inline-flex items-center border px-3 py-1.5 text-xs font-medium capitalize ${statusClass}`}
        >
            {value.replaceAll('_', ' ')}
        </span>
    );
}

export default function OrgProfileView({ profile, onEdit }) {
    const logoUrl = profile?.photo ?? profile?.user?.photo ?? null;
    const bannerUrl = profile?.banner ?? null;

    const name = profile?.name || 'Your organization';
    const email = profile?.email ?? profile?.user?.email ?? '';
    const phone = profile?.phone ?? profile?.user?.phone ?? '';
    const website = profile?.website ?? '';

    return (
        <div className="space-y-6">
            {/* Organization identity */}
            <section className={`${sectionClass} overflow-hidden`}>
                <div className="relative">
                    <div className="h-40 overflow-hidden bg-[#20332f] sm:h-52 lg:h-60">
                        {bannerUrl ? (
                            <img
                                src={bannerUrl}
                                alt={`${name} banner`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-r from-[#142521] via-[#203b33] to-[#28483d]">
                                <div className="flex items-center gap-3 text-[#a5c9bd]">
                                    <ImagePlus size={22} />
                                    <span className="text-sm">
                                        Organization banner
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="-mt-10 flex min-w-0 items-end gap-4 sm:-mt-12">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border-4 border-[#15201e] bg-[#20332f] sm:h-24 sm:w-24">
                                    {logoUrl ? (
                                        <img
                                            src={logoUrl}
                                            alt={`${name} logo`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Building2
                                            size={32}
                                            strokeWidth={1.4}
                                            className="text-[#a5c9bd]"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 pb-1">
                                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#91a09b]">
                                        Organization profile
                                    </p>

                                    <h2 className="mt-1 break-words text-xl font-semibold leading-tight text-[#edf3f1]! sm:text-2xl">
                                        {name}
                                    </h2>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onEdit}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start border border-[#426b60] px-4 py-2.5 text-sm font-medium text-[#c9e9df] transition hover:bg-[#19312c] sm:self-auto"
                            >
                                <Pencil size={15} />
                                Edit profile
                            </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#2b3836] pt-4">
                            <StatusLabel
                                status={profile?.verification_status}
                            />

                            {profile?.registration_number && (
                                <span className="text-xs text-[#91a09b]">
                                    Registration no.{' '}
                                    <span className="font-medium text-[#cbd5d1]">
                                        {profile.registration_number}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact information */}
            <section className={sectionClass}>
                <div className="border-b border-[#2b3836] px-5 py-5 sm:px-6">
                    <h2 className="text-base font-semibold text-[#edf3f1]!">
                        Contact information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[#91a09b]">
                        The main contact details for your organization.
                    </p>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[#2b3836] px-5 sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 sm:px-6">
                    <div>
                        <Detail
                            icon={Mail}
                            label="Contact email"
                            value={email}
                            href={email ? `mailto:${email}` : undefined}
                        />

                        <Detail
                            icon={Phone}
                            label="Phone number"
                            value={phone}
                            href={phone ? `tel:${phone}` : undefined}
                        />
                    </div>

                    <div>
                        <Detail
                            icon={Globe}
                            label="Website"
                            value={website}
                            href={
                                website
                                    ? /^https?:\/\//i.test(website)
                                        ? website
                                        : `https://${website}`
                                    : undefined
                            }
                        />

                        <Detail
                            icon={MapPin}
                            label="Address"
                            value={profile?.address}
                        />
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className={sectionClass}>
                <div className="border-b border-[#2b3836] px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center border border-[#344d45] bg-[#1a2b26] text-[#a5c9bd]">
                            <Target size={18} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#edf3f1]!">
                                Mission and purpose
                            </h2>
                            <p className="mt-1 text-sm text-[#91a09b]">
                                What your organization works to achieve.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                    {profile?.mission ? (
                        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#cbd5d1]">
                            {profile.mission}
                        </p>
                    ) : (
                        <p className="text-sm leading-6 text-[#657570]">
                            No mission statement added yet.
                        </p>
                    )}
                </div>
            </section>

            {/* Focus areas and communities */}
            <section className={sectionClass}>
                <div className="border-b border-[#2b3836] px-5 py-5 sm:px-6">
                    <h2 className="text-base font-semibold text-[#edf3f1]!">
                        Areas of impact
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-[#91a09b]">
                        The issues you address and the people you serve.
                    </p>
                </div>

                <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                    <TagList title="Focus areas" items={profile?.focus_areas} />

                    <div className="border-t border-[#2b3836]" />

                    <TagList
                        title="Communities served"
                        items={profile?.communities_served}
                    />
                </div>
            </section>

            {/* Organization details */}
            <section className={sectionClass}>
                <div className="border-b border-[#2b3836] px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center border border-[#344d45] bg-[#1a2b26] text-[#a5c9bd]">
                            <HandHeart size={18} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#edf3f1]!">
                                Organization details
                            </h2>
                            <p className="mt-1 text-sm text-[#91a09b]">
                                Team and operational information.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                    <Detail
                        icon={Users}
                        label="Team size"
                        value={profile?.team_size}
                    />

                    <div className="border-t border-[#2b3836]" />

                    <TagList
                        title="Primary activities"
                        items={profile?.primary_activities}
                    />
                </div>
            </section>

            {/* Verification details */}
            <section className={sectionClass}>
                <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#344d45] bg-[#1a2b26] text-[#a5c9bd]">
                        <ShieldCheck size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold text-[#edf3f1]!">
                            Verification
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-[#91a09b]">
                            Your organization’s verification status and
                            registration details.
                        </p>

                        <div className="mt-4">
                            <StatusLabel
                                status={profile?.verification_status}
                            />
                        </div>

                        <p className="mt-3 break-words text-sm leading-6 text-[#cbd5d1]">
                            Registration number:{' '}
                            <span className="text-[#edf3f1]!">
                                {profile?.registration_number || 'Not assigned'}
                            </span>
                        </p>

                        <p className="mt-3 text-xs leading-5 text-[#82918d]">
                            Verification and registration details are managed by
                            the platform administrator.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

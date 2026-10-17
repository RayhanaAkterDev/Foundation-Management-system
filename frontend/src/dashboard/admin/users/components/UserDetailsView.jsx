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
    ShieldCheck,
    ImagePlus,
    ArrowUpRight,
} from 'lucide-react';

const surface = 'border border-[#252D38] bg-[#0E1219]';
const heading = 'font-sans! text-[19px] font-semibold! text-[#EEF1F5]!';

function SectionTitle({ title }) {
    return (
        <div className="mb-7 flex items-center gap-5">
            <h2 className={heading}>{title}</h2>
            <span className="h-px min-w-0 flex-1 bg-[#29323E]" />
        </div>
    );
}

function Detail({ icon: Icon, label, value, href }) {
    const present =
        value !== null && value !== undefined && String(value).trim() !== '';
    return (
        <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#29323E] bg-[#151B24] text-[#8792A1]">
                <Icon size={16} strokeWidth={1.7} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
                <p className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.09em] text-[#8792A1]!">
                    {label}
                </p>
                {present && href ? (
                    <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={
                            href.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                        }
                        className="mt-1.5 inline-flex max-w-full items-start gap-1 break-all font-sans! text-[14px] font-medium! leading-6 text-[#C8D0DB]! underline decoration-[#465261] underline-offset-4 transition-colors hover:text-[#EEF1F5]!"
                    >
                        {value}
                        {href.startsWith('http') && (
                            <ArrowUpRight size={13} className="mt-1 shrink-0" />
                        )}
                    </a>
                ) : (
                    <p
                        className={`mt-1.5 break-words font-sans! text-[14px] leading-6 ${present ? 'font-medium! text-[#B8C0CA]!' : 'text-[#697586]!'}`}
                    >
                        {present ? value : 'Not provided'}
                    </p>
                )}
            </div>
        </div>
    );
}

function Tags({ items }) {
    const values = Array.isArray(items)
        ? items
        : typeof items === 'string'
          ? items.split(',')
          : [];
    const clean = values
        .map((item) => String(item ?? '').trim())
        .filter(Boolean);
    return clean.length ? (
        <div className="flex flex-wrap gap-2">
            {clean.map((item, index) => (
                <span
                    key={`${item}-${index}`}
                    className="border border-[#303A47] bg-[#151B24] px-3 py-1.5 font-sans! text-[13px] font-medium! text-[#AEB7C3]!"
                >
                    {item.replaceAll('_', ' ')}
                </span>
            ))}
        </div>
    ) : (
        <p className="font-sans! text-[14px] text-[#697586]!">Not provided</p>
    );
}

function ListField({ label, items }) {
    return (
        <div className="min-w-0">
            <p className="mb-3 font-sans! text-[12px] font-semibold! uppercase tracking-[0.09em] text-[#8792A1]!">
                {label}
            </p>
            <Tags items={items} />
        </div>
    );
}

function Status({ status }) {
    const value = String(status || 'pending').toLowerCase();
    const tone =
        value === 'verified'
            ? 'bg-[#8493A6] text-[#C2CBD6]!'
            : value === 'rejected'
              ? 'bg-[#CE7777] text-[#E5A0A0]!'
              : 'bg-[#C09558] text-[#D5B37F]!';
    return (
        <span
            className={`inline-flex items-center gap-2 font-sans! text-[13px] font-medium! ${tone.split(' ').slice(1).join(' ')}`}
        >
            <span className={`h-2 w-2 rounded-full ${tone.split(' ')[0]}`} />
            {value.replaceAll('_', ' ').replace(/^./, (c) => c.toUpperCase())}
        </span>
    );
}

export default function OrgProfileView({ profile, onEdit }) {
    const name = profile?.name || 'Your organization';
    const logo = profile?.photo ?? profile?.user?.photo;
    const banner = profile?.banner;
    const email = profile?.email ?? profile?.user?.email;
    const phone = profile?.phone ?? profile?.user?.phone;
    const website = profile?.website;
    const websiteHref = website
        ? /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`
        : undefined;

    return (
        <div className="space-y-5 pb-8 font-sans!">
            <section className={`${surface} overflow-hidden`}>
                <div className="relative h-40 overflow-hidden bg-[#151B24] sm:h-52 lg:h-56">
                    {banner ? (
                        <img
                            src={banner}
                            alt={`${name} banner`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center gap-3 text-[#697586]">
                            <ImagePlus size={22} strokeWidth={1.5} />
                            <span className="text-[14px]">
                                No banner uploaded
                            </span>
                        </div>
                    )}
                </div>
                <div className="px-5 pb-6 sm:px-7 lg:px-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="-mt-9 flex min-w-0 items-end gap-4 sm:-mt-11 sm:gap-5">
                            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border-4 border-[#0E1219] bg-[#1A222D] sm:h-24 sm:w-24">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={`${name} logo`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Building2
                                        size={30}
                                        className="text-[#8792A1]"
                                    />
                                )}
                            </div>
                            <div className="min-w-0 pb-1">
                                <p className="mb-1 font-sans! text-[12px] font-semibold! uppercase tracking-[0.12em] text-[#8792A1]!">
                                    Organization
                                </p>
                                <h2 className="break-words font-sans! text-[21px] font-semibold! leading-tight text-[#EEF1F5]! sm:text-[25px]">
                                    {name}
                                </h2>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start border border-[#303A47] bg-[#0E1219] px-4 py-2 font-sans! text-[13px] font-medium! text-[#EEF1F5]! transition-colors hover:border-[#586678] hover:bg-[#1A222D] sm:self-auto"
                        >
                            <Pencil size={15} />
                            Edit profile
                        </button>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#29323E] pt-5">
                        <Status status={profile?.verification_status} />
                        {profile?.registration_number && (
                            <p className="min-w-0 break-all font-sans! text-[13px] text-[#8792A1]!">
                                Registration no.{' '}
                                <span className="font-medium! text-[#B8C0CA]!">
                                    {profile.registration_number}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className={`${surface} px-5 py-7 sm:px-7 lg:px-9 lg:py-9`}>
                <SectionTitle title="Contact information" />
                <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    <Detail
                        icon={Mail}
                        label="Contact email"
                        value={email}
                        href={email ? `mailto:${email}` : undefined}
                    />
                    <Detail
                        icon={Globe}
                        label="Website"
                        value={website}
                        href={websiteHref}
                    />
                    <Detail
                        icon={Phone}
                        label="Phone number"
                        value={phone}
                        href={phone ? `tel:${phone}` : undefined}
                    />
                    <Detail
                        icon={MapPin}
                        label="Address"
                        value={profile?.address}
                    />
                </div>
            </section>

            <section className={`${surface} px-5 py-7 sm:px-7 lg:px-9 lg:py-9`}>
                <SectionTitle title="Mission and impact" />
                <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
                    <div className="min-w-0">
                        <div className="mb-4 flex items-center gap-3 text-[#8792A1]">
                            <Target size={17} />
                            <span className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.09em]">
                                Our mission
                            </span>
                        </div>
                        <p className="whitespace-pre-wrap break-words font-sans! text-[14px] leading-7 text-[#B8C0CA]!">
                            {profile?.mission ||
                                'No mission statement added yet.'}
                        </p>
                    </div>
                    <div className="min-w-0 space-y-7 border-t border-[#29323E] pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                        <ListField
                            label="Focus areas"
                            items={profile?.focus_areas}
                        />
                        <div className="h-px bg-[#29323E]" />
                        <ListField
                            label="Communities served"
                            items={profile?.communities_served}
                        />
                    </div>
                </div>
            </section>

            <section className={`${surface} px-5 py-7 sm:px-7 lg:px-9 lg:py-9`}>
                <SectionTitle title="Organization details" />
                <div className="grid gap-8 lg:grid-cols-[minmax(180px,0.5fr)_minmax(0,1.5fr)] lg:gap-12">
                    <Detail
                        icon={Users}
                        label="Team size"
                        value={profile?.team_size}
                    />
                    <ListField
                        label="Primary activities"
                        items={profile?.primary_activities}
                    />
                </div>
                <div className="mt-8 flex items-start gap-3 border-t border-[#29323E] pt-6">
                    <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-[#8792A1]"
                    />
                    <p className="font-sans! text-[13px] leading-6 text-[#8792A1]!">
                        Verification and registration information is managed by
                        the platform administrator.
                    </p>
                </div>
            </section>
        </div>
    );
}

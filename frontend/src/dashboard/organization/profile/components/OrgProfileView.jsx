import React from 'react';
import {
    Building2,
    Pencil,
    Mail,
    Phone,
    Globe,
    MapPin,
    ArrowUpRight,
    ShieldCheck,
    Users,
    Target,
} from 'lucide-react';

const panel = 'border border-[#252D38] bg-[#0E1219]';
const list = (value) =>
    (Array.isArray(value)
        ? value
        : typeof value === 'string'
          ? value.split(',')
          : []
    )
        .map((v) => String(v).trim())
        .filter(Boolean);
const readable = (value) => String(value || '').replaceAll('_', ' ');

function Items({ values }) {
    const items = list(values);
    return items.length ? (
        <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
                <span
                    key={`${item}-${i}`}
                    className="border border-[#303A47] bg-[#151B24] px-3 py-1.5 text-[13px] text-[#B8C0CA]"
                >
                    {readable(item)}
                </span>
            ))}
        </div>
    ) : (
        <p className="text-[14px] text-[#697586]">Not provided</p>
    );
}
function Contact({ icon: Icon, label, value, href }) {
    return (
        <div className="flex min-w-0 gap-3 py-4 first:pt-0 last:pb-0">
            <Icon
                size={18}
                className="mt-0.5 shrink-0 text-[#8792A1]"
                strokeWidth={1.7}
            />
            <div className="min-w-0">
                <p className="text-[13px] text-[#8792A1]">{label}</p>
                {href && value ? (
                    <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={
                            href.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                        }
                        className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-[14px] font-medium text-[#EEF1F5] hover:underline"
                    >
                        {value}
                        {href.startsWith('http') && <ArrowUpRight size={13} />}
                    </a>
                ) : (
                    <p className="mt-1 break-words text-[14px] font-medium text-[#EEF1F5]">
                        {value || 'Not provided'}
                    </p>
                )}
            </div>
        </div>
    );
}
function Heading({ children, icon: Icon }) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <Icon size={18} className="text-[#8792A1]" />
            <h3 className="text-[17px] font-semibold text-[#EEF1F5]">
                {children}
            </h3>
        </div>
    );
}
export default function OrgProfileView({ profile, onEdit }) {
    const name = profile?.name || 'Your organization';
    const logo = profile?.photo ?? profile?.user?.photo;
    const email = profile?.email ?? profile?.user?.email;
    const phone = profile?.phone ?? profile?.user?.phone;
    const website = profile?.website;
    const websiteHref = website
        ? /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`
        : undefined;
    const status = readable(profile?.verification_status || 'pending');
    return (
        <div className="space-y-5 pb-8 font-sans">
            <section className={`${panel} overflow-hidden`}>
                <div className="relative h-36 bg-[#151B24] sm:h-44 lg:h-48">
                    {profile?.banner ? (
                        <img
                            src={profile.banner}
                            alt={`${name} banner`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[14px] text-[#697586]">
                            Organization cover image
                        </div>
                    )}
                </div>
                <div className="px-5 pb-6 sm:px-7 lg:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex min-w-0 items-end gap-4">
                            <div className="-mt-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border-4 border-[#0E1219] bg-[#1A222D] sm:h-28 sm:w-28">
                                {logo ? (
                                    <img
                                        src={logo}
                                        alt={`${name} logo`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Building2
                                        size={34}
                                        className="text-[#8792A1]"
                                    />
                                )}
                            </div>
                            <div className="min-w-0 pb-1">
                                <p className="mb-1 text-[13px] text-[#8792A1]">
                                    Organization profile
                                </p>
                                <h2 className="break-words text-[23px] font-semibold leading-tight text-[#EEF1F5] sm:text-[27px]">
                                    {name}
                                </h2>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start border border-[#414B57] bg-[#20252D] px-5 text-[14px] font-medium text-[#EEF1F5] transition-colors hover:border-[#697584] hover:bg-[#2A3039] sm:self-auto"
                        >
                            <Pencil size={16} />
                            Edit profile
                        </button>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-[#29323E] pt-4 text-[13px]">
                        <span className="inline-flex items-center gap-2 text-[#B8C0CA]">
                            <ShieldCheck size={16} className="text-[#8792A1]" />
                            Verification:{' '}
                            <strong className="font-medium text-[#EEF1F5]">
                                {status}
                            </strong>
                        </span>
                        {profile?.registration_number && (
                            <span className="text-[#8792A1]">
                                Registration:{' '}
                                <span className="text-[#B8C0CA]">
                                    {profile.registration_number}
                                </span>
                            </span>
                        )}
                        {profile?.organization_type && (
                            <span className="text-[#8792A1]">
                                Type:{' '}
                                <span className="text-[#B8C0CA]">
                                    {readable(profile.organization_type)}
                                </span>
                            </span>
                        )}
                    </div>
                </div>
            </section>
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
                <div className="min-w-0 space-y-5">
                    <section className={`${panel} p-5 sm:p-7 lg:p-8`}>
                        <Heading icon={Target}>Mission and purpose</Heading>
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-[#B8C0CA]">
                            {profile?.mission ||
                                'Your organization has not added a mission statement yet.'}
                        </p>
                        <div className="mt-7 grid gap-7 border-t border-[#29323E] pt-6 md:grid-cols-2">
                            <div>
                                <h4 className="mb-3 text-[14px] font-semibold text-[#EEF1F5]">
                                    Focus areas
                                </h4>
                                <Items values={profile?.focus_areas} />
                            </div>
                            <div>
                                <h4 className="mb-3 text-[14px] font-semibold text-[#EEF1F5]">
                                    Communities served
                                </h4>
                                <Items values={profile?.communities_served} />
                            </div>
                        </div>
                    </section>
                    <section className={`${panel} p-5 sm:p-7 lg:p-8`}>
                        <Heading icon={Users}>Organization operations</Heading>
                        <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
                            <div>
                                <p className="mb-2 text-[13px] text-[#8792A1]">
                                    Team size
                                </p>
                                <p className="text-[16px] font-medium text-[#EEF1F5]">
                                    {readable(profile?.team_size) ||
                                        'Not provided'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-3 text-[13px] text-[#8792A1]">
                                    Primary activities
                                </p>
                                <Items values={profile?.primary_activities} />
                            </div>
                        </div>
                    </section>
                </div>
                <aside className={`${panel} min-w-0 p-5 sm:p-7`}>
                    <h3 className="mb-5 text-[17px] font-semibold text-[#EEF1F5]">
                        Contact information
                    </h3>
                    <div className="divide-y divide-[#29323E]">
                        <Contact
                            icon={Mail}
                            label="Email address"
                            value={email}
                            href={email ? `mailto:${email}` : undefined}
                        />
                        <Contact
                            icon={Phone}
                            label="Phone number"
                            value={phone}
                            href={phone ? `tel:${phone}` : undefined}
                        />
                        <Contact
                            icon={Globe}
                            label="Website"
                            value={website}
                            href={websiteHref}
                        />
                        <Contact
                            icon={MapPin}
                            label="Office address"
                            value={profile?.address}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}

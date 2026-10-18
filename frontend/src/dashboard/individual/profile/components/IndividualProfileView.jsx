import React from 'react';
import {
    ArrowUpRight,
    CalendarDays,
    Mail,
    MapPin,
    Pencil,
    Phone,
    UserRound,
} from 'lucide-react';

const panel = 'border border-[#252D38] bg-[#0E1219]';
const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== '';

function InfoLine({ icon: Icon, label, value, href }) {
    return (
        <div className="grid min-w-0 gap-2 border-b border-[#29323E] py-5 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
            <div className="flex items-center gap-2.5 text-[13px] text-[#8792A1]">
                <Icon size={16} strokeWidth={1.7} className="shrink-0" />
                <span>{label}</span>
            </div>
            {hasValue(value) && href ? (
                <a
                    href={href}
                    className="inline-flex min-w-0 items-start gap-1.5 break-all text-[14px] font-medium text-[#D6DBE1] underline decoration-[#465261] underline-offset-4 transition-colors hover:text-[#EEF1F5]"
                >
                    {value}
                    {href.startsWith('http') && <ArrowUpRight size={14} />}
                </a>
            ) : (
                <p
                    className={`min-w-0 break-words text-[14px] leading-6 ${hasValue(value) ? 'text-[#D6DBE1]' : 'text-[#697586]'}`}
                >
                    {hasValue(value) ? value : 'Not provided'}
                </p>
            )}
        </div>
    );
}

export default function IndividualProfileView({
    profile,
    memberSince,
    onEdit,
}) {
    const name = profile?.name?.trim() || 'Your profile';
    const initial = name.charAt(0).toUpperCase();
    const photo = profile?.photo || profile?.avatar || null;
    const joined = memberSince ? new Date(memberSince) : null;
    const joinedText =
        joined && !Number.isNaN(joined.getTime())
            ? joined.toLocaleDateString('en-BD', {
                  month: 'long',
                  year: 'numeric',
              })
            : 'Not available';
    const dob = profile?.date_of_birth
        ? new Date(`${profile.date_of_birth.slice(0, 10)}T00:00:00`)
        : null;
    const dobText =
        dob && !Number.isNaN(dob.getTime())
            ? dob.toLocaleDateString('en-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
              })
            : '';

    return (
        <div className="space-y-5 pb-8 font-sans">
            <section className={`${panel} overflow-hidden`}>
                <div className="h-2 bg-[#303A47]" />
                <div className="flex flex-col gap-6 px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-[#394555] bg-[#20252D] text-[28px] font-semibold text-[#EEF1F5] sm:h-24 sm:w-24">
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                initial
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="mb-1.5 text-[13px] font-medium text-[#8792A1]">
                                Personal account
                            </p>
                            <h2 className="break-words text-[23px] font-semibold leading-tight text-[#EEF1F5] sm:text-[28px]">
                                {name}
                            </h2>
                            <p className="mt-2 break-all text-[14px] text-[#AEB7C3]">
                                {profile?.email || 'No email added'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start border border-[#414B57] bg-[#20252D] px-5 text-[14px] font-medium text-[#EEF1F5] transition-colors hover:border-[#697584] hover:bg-[#2A3039] lg:self-center"
                    >
                        <Pencil size={16} /> Edit profile
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[#29323E] bg-[#151B24] px-5 py-4 text-[13px] text-[#AEB7C3] sm:px-8">
                    <span className="inline-flex items-center gap-2">
                        <UserRound size={15} /> Individual member
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <CalendarDays size={15} /> Member since {joinedText}
                    </span>
                </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)] xl:items-start">
                <section
                    className={`${panel} min-w-0 px-5 py-6 sm:px-8 sm:py-8`}
                >
                    <div className="mb-4 border-b border-[#29323E] pb-5">
                        <h3 className="text-[19px] font-semibold text-[#EEF1F5]">
                            Personal information
                        </h3>
                        <p className="mt-1 text-[14px] text-[#8792A1]">
                            Your account and contact details
                        </p>
                    </div>
                    <InfoLine
                        icon={UserRound}
                        label="Full name"
                        value={profile?.name}
                    />
                    <InfoLine
                        icon={Mail}
                        label="Email address"
                        value={profile?.email}
                        href={
                            profile?.email
                                ? `mailto:${profile.email}`
                                : undefined
                        }
                    />
                    <InfoLine
                        icon={Phone}
                        label="Phone number"
                        value={profile?.phone}
                        href={
                            profile?.phone ? `tel:${profile.phone}` : undefined
                        }
                    />
                    <InfoLine
                        icon={CalendarDays}
                        label="Date of birth"
                        value={dobText}
                    />
                </section>
                <section
                    className={`${panel} min-w-0 px-5 py-6 sm:px-7 sm:py-8`}
                >
                    <div className="mb-4 border-b border-[#29323E] pb-5">
                        <h3 className="text-[19px] font-semibold text-[#EEF1F5]">
                            Location
                        </h3>
                        <p className="mt-1 text-[14px] text-[#8792A1]">
                            Your registered location
                        </p>
                    </div>
                    <div className="space-y-6 py-2">
                        <div>
                            <p className="mb-2 text-[13px] text-[#8792A1]">
                                District
                            </p>
                            <p className="break-words text-[14px] leading-6 text-[#D6DBE1]">
                                {profile?.district || 'Not provided'}
                            </p>
                        </div>
                        <div className="border-t border-[#29323E] pt-6">
                            <p className="mb-2 flex items-center gap-2 text-[13px] text-[#8792A1]">
                                <MapPin size={15} /> Address
                            </p>
                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-[#D6DBE1]">
                                {profile?.address || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// src/pages/Admin/Users/components/EditUserView.jsx
import React, { useState } from 'react';
import { Building2, UserCog, UserRound } from 'lucide-react';
import UserForm from './UserForm';

const ROLE_META = {
    individual: { label: 'Individual', icon: UserRound },
    organization: { label: 'Organization', icon: Building2 },
    admin: { label: 'Administrator', icon: UserCog },
};

const formatStatus = (value) =>
    String(value || 'Unknown')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const PreviewDetail = ({ label, value, muted = false }) => (
    <div className="min-w-0">
        <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.14em] text-[#697586]!">
            {label}
        </p>
        <p
            title={value}
            className={`mt-1.5 min-w-0 truncate font-sans! text-[12px] font-medium! ${muted ? 'text-[#5E6978]!' : 'text-[#B8C0CA]!'}`}
        >
            {value}
        </p>
    </div>
);

const EditUserView = ({
    user,
    saving,
    saveError,
    fieldErrors,
    onSubmit,
    onCancel,
}) => {
    const [failedPhoto, setFailedPhoto] = useState(null);

    if (!user) return null;

    const role = ROLE_META[user.role] || { label: 'User', icon: UserRound };
    const RoleIcon = role.icon;
    const name = user.name?.trim() || 'Unnamed user';
    const initial = user.name?.trim()?.charAt(0)?.toUpperCase();
    const photo =
        typeof user.photo === 'string' && user.photo.trim()
            ? user.photo.trim()
            : null;
    const status = formatStatus(user.status);

    return (
        <div className="@container w-full min-w-0 font-sans!">
            <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219]">
                <div className="grid min-w-0 @6xl:grid-cols-[290px_minmax(0,1fr)] @7xl:grid-cols-[310px_minmax(0,1fr)]">
                    {/* COMPACT USER HEADER — replaces the sidebar below the wide-container breakpoint */}
                    <div className="min-w-0 border-b border-[#252D38] bg-[#141B24] px-4 py-4 sm:px-6 @6xl:hidden">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#303A47] bg-[#1A222D] text-[15px] font-semibold text-[#DCE2EA]">
                                {photo && failedPhoto !== photo ? (
                                    <img
                                        src={photo}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={() => setFailedPhoto(photo)}
                                    />
                                ) : initial ? (
                                    initial
                                ) : (
                                    <UserRound size={19} strokeWidth={1.6} />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p
                                    className="truncate text-[14px] font-semibold text-[#DCE2EA]"
                                    title={name}
                                >
                                    {name}
                                </p>
                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-[#8792A1]">
                                    <RoleIcon
                                        size={12}
                                        className="shrink-0"
                                        strokeWidth={1.7}
                                    />
                                    <span className="truncate">
                                        {role.label}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="mx-1 text-[#455160]"
                                    >
                                        ·
                                    </span>
                                    <span className="truncate">{status}</span>
                                </div>
                            </div>
                            <span
                                className="hidden max-w-[35%] truncate text-right text-[11px] text-[#8792A1] sm:block"
                                title={user.email || ''}
                            >
                                {user.email || 'No email'}
                            </span>
                        </div>
                    </div>

                    {/* Same preview language and breakpoint as Add User. */}
                    <aside className="hidden min-w-0 border-[#252D38] bg-[#141B24] @6xl:block @6xl:border-r">
                        <div className="flex h-full min-h-[520px] min-w-0 flex-col px-6 py-7 xl:px-7 xl:py-8">
                            <div className="flex items-center gap-3">
                                <span
                                    aria-hidden="true"
                                    className="h-[2px] w-4 shrink-0 bg-[#697586]"
                                />
                                <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.16em] text-[#8792A1]!">
                                    User preview
                                </p>
                            </div>

                            <div className="mt-10 min-w-0">
                                <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden border border-[#394555] bg-[#1A222D] text-[20px] font-semibold! text-[#EEF1F5]">
                                    {photo && failedPhoto !== photo ? (
                                        <img
                                            src={photo}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            onError={() =>
                                                setFailedPhoto(photo)
                                            }
                                        />
                                    ) : initial ? (
                                        initial
                                    ) : (
                                        <UserRound
                                            size={22}
                                            strokeWidth={1.5}
                                        />
                                    )}
                                </div>
                                <h2 className="mt-5 min-w-0 wrap-break-word font-sans! text-[17px] font-semibold! leading-[1.4] text-[#EEF1F5]!">
                                    {name}
                                </h2>
                                <div className="mt-2 flex min-w-0 items-center gap-2 text-[#AAB3BF]">
                                    <RoleIcon
                                        size={14}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                    />
                                    <span className="truncate font-sans! text-[12px] font-medium!">
                                        {role.label}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-9 space-y-6 border-t border-[#252D38] pt-7">
                                <PreviewDetail
                                    label="Email"
                                    value={user.email || 'Not provided'}
                                    muted={!user.email}
                                />
                                <PreviewDetail
                                    label="Phone"
                                    value={user.phone || 'Not provided'}
                                    muted={!user.phone}
                                />
                            </div>

                            <div className="mt-auto border-t border-[#252D38] pt-6">
                                <p className="font-sans! text-[10px] font-semibold! uppercase tracking-[0.14em] text-[#697586]!">
                                    Account status
                                </p>
                                <div className="mt-3 flex items-center gap-2.5">
                                    <span
                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                            user.status === 'active'
                                                ? 'bg-[#6FA58A]'
                                                : user.status === 'suspended'
                                                  ? 'bg-[#B88963]'
                                                  : 'bg-[#697586]'
                                        }`}
                                    />
                                    <span className="font-sans! text-[12px] font-medium! text-[#B8C0CA]!">
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="min-w-0 bg-[#0E1219]">
                        <div className="min-w-0 px-4 py-7 sm:px-8 sm:py-9 lg:px-9 lg:py-10 xl:px-10">
                            <UserForm
                                mode="edit"
                                user={user}
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

export default EditUserView;

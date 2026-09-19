import React, { useState } from 'react';

import {
    ShieldCheck,
    MailCheck,
    UserRound,
    LockKeyhole,
    Building2,
    CircleUserRound,
    CheckCircle2,
    Info,
    ChevronRight,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

// ============================================================
// SETTING ROW
// ============================================================

const SettingRow = ({ icon: Icon, label, description, children }) => (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
        <div className="flex min-w-0 items-start gap-3.5">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef6f5] text-primary">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
                <h3 className="text-[13px] font-semibold text-text-primary">
                    {label}
                </h3>

                <p className="mt-1 max-w-2xl text-[12px] leading-5 text-text-secondary">
                    {description}
                </p>
            </div>
        </div>

        <div className="shrink-0">{children}</div>
    </div>
);

// ============================================================
// STATUS
// ============================================================

const StatusBadge = ({ children, tone = 'green' }) => {
    const styles = {
        green: 'bg-[#edf8f3] text-[#167653]',
        amber: 'bg-[#fff7e8] text-[#a16207]',
        slate: 'bg-[#f1f5f9] text-[#475569]',
    };

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                ${styles[tone]}
            `}
        >
            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${
                        tone === 'green'
                            ? 'bg-[#22a06b]'
                            : tone === 'amber'
                              ? 'bg-[#d99a16]'
                              : 'bg-[#94a3b8]'
                    }
                `}
            />

            {children}
        </span>
    );
};

// ============================================================
// ACTION BUTTON
// ============================================================

const ActionButton = ({ children, onClick, icon: Icon = ChevronRight }) => (
    <button
        type="button"
        onClick={onClick}
        className="
            inline-flex
            h-9
            items-center
            gap-2
            rounded-lg
            border
            border-[#dfe5e8]
            bg-white
            px-3.5
            text-[11px]
            font-semibold
            text-text-primary
            transition-colors
            hover:border-primary/25
            hover:bg-[#f5f9f8]
        "
    >
        {children}

        <Icon className="h-3.5 w-3.5 text-text-secondary" strokeWidth={1.8} />
    </button>
);

// ============================================================
// SETTINGS
// ============================================================

const Settings = () => {
    const [emailVerification, setEmailVerification] = useState(true);

    return (
        <div className="space-y-5">
            <PageHeader
                title="Settings"
                subtitle="Manage your administrator account and review platform configuration."
            />

            {/* ========================================================
                PLATFORM
            ======================================================== */}

            <section className="overflow-hidden rounded-xl border border-[#e3e8eb] bg-white">
                <div className="border-b border-[#e3e8eb] px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="font-['Fraunces'] text-[17px] font-semibold text-text-primary">
                                Platform
                            </h2>

                            <p className="mt-0.5 text-[11px] text-text-secondary">
                                Core settings and verification policies for
                                Stand For People.
                            </p>
                        </div>

                        <StatusBadge>Platform active</StatusBadge>
                    </div>
                </div>

                <div className="divide-y divide-[#e9edef]">
                    <SettingRow
                        icon={MailCheck}
                        label="Email Verification"
                        description="New accounts must verify their email address before they can sign in to the platform."
                    >
                        <button
                            type="button"
                            role="switch"
                            aria-checked={emailVerification}
                            onClick={() =>
                                setEmailVerification(!emailVerification)
                            }
                            className={`
                                relative
                                inline-flex
                                h-6
                                w-11
                                items-center
                                rounded-full
                                transition-colors
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary/20
                                ${
                                    emailVerification
                                        ? 'bg-primary'
                                        : 'bg-[#cbd5e1]'
                                }
                            `}
                        >
                            <span
                                className={`
                                    inline-block
                                    h-4
                                    w-4
                                    transform
                                    rounded-full
                                    bg-white
                                    shadow-sm
                                    transition-transform
                                    ${
                                        emailVerification
                                            ? 'translate-x-6'
                                            : 'translate-x-1'
                                    }
                                `}
                            />
                        </button>
                    </SettingRow>

                    <SettingRow
                        icon={Building2}
                        label="Organization Verification"
                        description="Organization accounts are reviewed by an administrator before they become active on the platform."
                    >
                        <StatusBadge>Manual review</StatusBadge>
                    </SettingRow>

                    <SettingRow
                        icon={UserRound}
                        label="User Roles"
                        description="The platform currently supports Individual, Organization, and Admin accounts."
                    >
                        <span className="text-[11px] font-medium text-text-secondary">
                            3 roles
                        </span>
                    </SettingRow>

                    <SettingRow
                        icon={ShieldCheck}
                        label="Account Status"
                        description="Administrators can control whether user accounts are active or inactive through User Management."
                    >
                        <ActionButton
                            onClick={() =>
                                (window.location.href =
                                    '/admin/dashboard/users')
                            }
                        >
                            Manage users
                        </ActionButton>
                    </SettingRow>
                </div>
            </section>

            {/* ========================================================
                ADMIN ACCOUNT
            ======================================================== */}

            <section className="overflow-hidden rounded-xl border border-[#e3e8eb] bg-white">
                <div className="border-b border-[#e3e8eb] px-6 py-4">
                    <div>
                        <h2 className="font-['Fraunces'] text-[17px] font-semibold text-text-primary">
                            Administrator Account
                        </h2>

                        <p className="mt-0.5 text-[11px] text-text-secondary">
                            Manage your administrator profile and account
                            security.
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-[#e9edef]">
                    <SettingRow
                        icon={CircleUserRound}
                        label="Profile"
                        description="Review and update the information associated with your administrator account."
                    >
                        <ActionButton
                            onClick={() =>
                                (window.location.href =
                                    '/admin/dashboard/profile')
                            }
                        >
                            View profile
                        </ActionButton>
                    </SettingRow>

                    <SettingRow
                        icon={LockKeyhole}
                        label="Password"
                        description="Change your administrator password to keep your account secure."
                    >
                        <ActionButton
                            onClick={() =>
                                (window.location.href =
                                    '/admin/dashboard/security')
                            }
                        >
                            Change password
                        </ActionButton>
                    </SettingRow>
                </div>
            </section>

            {/* ========================================================
                SYSTEM INFORMATION
            ======================================================== */}

            <section className="overflow-hidden rounded-xl border border-[#e3e8eb] bg-white">
                <div className="border-b border-[#e3e8eb] px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <Info
                            className="h-4 w-4 text-text-secondary"
                            strokeWidth={1.8}
                        />

                        <div>
                            <h2 className="font-['Fraunces'] text-[17px] font-semibold text-text-primary">
                                System Information
                            </h2>

                            <p className="mt-0.5 text-[11px] text-text-secondary">
                                Current platform status and configuration
                                information.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[#e9edef] md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="px-6 py-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                            Platform
                        </p>

                        <p className="mt-1.5 text-[13px] font-semibold text-text-primary">
                            Stand For People
                        </p>
                    </div>

                    <div className="px-6 py-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                            Environment
                        </p>

                        <div className="mt-1.5">
                            <StatusBadge>Production</StatusBadge>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                            Verification
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] font-semibold text-[#167653]">
                            <CheckCircle2
                                className="h-3.5 w-3.5"
                                strokeWidth={2}
                            />
                            Email verification enabled
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
                NOTE
            ======================================================== */}

            <div
                className="
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-[#e4e9ec]
                    bg-[#f8fafb]
                    px-5
                    py-4
                "
            >
                <Info
                    className="
                        mt-0.5
                        h-4
                        w-4
                        shrink-0
                        text-text-secondary
                    "
                    strokeWidth={1.8}
                />

                <p className="text-[11px] leading-5 text-text-secondary">
                    Platform-wide configuration changes should only be made when
                    the corresponding backend policy is implemented. User,
                    organization, campaign, donation, volunteer, and
                    help-request workflows are managed from their respective
                    administration pages.
                </p>
            </div>
        </div>
    );
};

export default Settings;

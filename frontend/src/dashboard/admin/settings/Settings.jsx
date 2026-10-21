import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowUpRight,
    Building2,
    Check,
    CircleUserRound,
    Info,
    LockKeyhole,
    MailCheck,
    Server,
    ShieldCheck,
    UsersRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

const TABS = [
    { id: 'platform', label: 'Platform', icon: ShieldCheck },
    { id: 'account', label: 'My account', icon: CircleUserRound },
    { id: 'system', label: 'System', icon: Server },
];

const SYSTEM_INFO = [
    ['Platform', 'Stand For People'],
    ['Account types', 'Individual, Organization, Admin'],
    ['Email verification', 'Configured as enabled'],
    ['Environment', 'Not connected to deployment data'],
];

function SectionTitle({ title, description }) {
    return (
        <div className="mb-5 sm:mb-6">
            <h2 className="!font-sans !text-lg !font-semibold !leading-snug !tracking-[-0.02em] !text-[#EEF1F5] sm:!text-[19px]">
                {title}
            </h2>

            <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#8792A1] sm:text-[13px] sm:leading-6">
                {description}
            </p>
        </div>
    );
}

function Row({ icon: Icon, title, description, children }) {
    return (
        <div className="flex min-w-0 flex-col gap-3.5 border-b border-[#252D38] px-4 py-4 last:border-b-0 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-[#1A222D] text-[#A8B5C4] sm:h-10 sm:w-10">
                    <Icon size={17} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="!font-sans !text-[13px] !font-semibold !leading-5 !text-[#E0E7EF] sm:!text-[14px] sm:!leading-6">
                        {title}
                    </h3>

                    <p className="mt-1 max-w-[590px] break-words text-[12px] leading-[1.7] text-[#8792A1] sm:text-[13px]">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex min-w-0 items-center pl-12 sm:pl-[54px] md:shrink-0 md:pl-0">
                {children}
            </div>
        </div>
    );
}

function Status({ children, enabled = false }) {
    return (
        <span
            className={`inline-flex max-w-full items-center gap-2 text-[12px] font-medium ${
                enabled ? 'text-[#91C3B3]' : 'text-[#B0BBC9]'
            }`}
        >
            {enabled ? (
                <Check size={15} strokeWidth={2} className="shrink-0" />
            ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8D9BAA]" />
            )}

            <span className="break-words">{children}</span>
        </span>
    );
}

function Action({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex min-h-10 max-w-full items-center justify-center gap-2 border border-[#343E4B] bg-[#1A222D] px-3 text-center text-[12px] font-medium text-[#D8E0E9] transition-colors hover:border-[#4B596A] hover:bg-[#222C38] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1219] active:bg-[#252F3C] sm:px-3.5"
        >
            <span>{children}</span>
            <ArrowUpRight size={14} strokeWidth={1.8} className="shrink-0" />
        </button>
    );
}

function SettingsTabs({ tab, setTab }) {
    return (
        <div
            className="grid grid-cols-3 gap-1 overflow-hidden border-b border-[#303A47] sm:flex sm:gap-1"
            role="tablist"
            aria-label="Settings sections"
        >
            {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = tab === id;

                return (
                    <button
                        key={id}
                        id={`settings-tab-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`settings-panel-${id}`}
                        onClick={() => setTab(id)}
                        className={`relative flex min-w-0 min-h-12 items-center justify-center gap-1.5 px-1.5 py-2 text-center text-[11px] font-medium transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F766E] sm:min-h-12 sm:min-w-[120px] sm:justify-start sm:gap-2.5 sm:px-5 sm:text-[12px] ${
                            isActive
                                ? 'bg-[#1A222D] text-[#EEF1F5] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-[#0F766E]'
                                : 'text-[#8792A1] hover:bg-[#1A222D]/60 hover:text-[#D7E0EA]'
                        }`}
                    >
                        <Icon
                            size={16}
                            strokeWidth={1.8}
                            className="shrink-0"
                        />

                        <span className="truncate">{label}</span>
                    </button>
                );
            })}
        </div>
    );
}

function InfoNote({ children }) {
    return (
        <div className="mt-4 flex min-w-0 items-start gap-2.5 text-[#8792A1] sm:mt-5">
            <Info size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />

            <p className="min-w-0 max-w-3xl text-[12px] leading-[1.7] sm:text-[13px]">
                {children}
            </p>
        </div>
    );
}

function SettingsPanel({ tab, navigate }) {
    if (tab === 'platform') {
        return (
            <section aria-labelledby="platform-heading">
                <SectionTitle
                    title="Platform policies"
                    description="Account verification, approval, and access management."
                />

                <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                    <Row
                        icon={MailCheck}
                        title="Email verification"
                        description="New accounts must verify their email address before signing in."
                    >
                        <Status enabled>Enabled</Status>
                    </Row>

                    <Row
                        icon={Building2}
                        title="Organization approval"
                        description="Organization registrations are reviewed by an administrator before activation."
                    >
                        <Status>Manual review</Status>
                    </Row>

                    <Row
                        icon={UsersRound}
                        title="Account roles"
                        description="Individual, organization, and administrator access levels."
                    >
                        <span className="text-[12px] font-medium text-[#C7D1DD]">
                            3 roles
                        </span>
                    </Row>

                    <Row
                        icon={ShieldCheck}
                        title="User access"
                        description="Manage registered accounts, status, and permissions."
                    >
                        <Action
                            onClick={() => navigate('/admin/dashboard/users')}
                        >
                            Manage users
                        </Action>
                    </Row>
                </div>

                <InfoNote>
                    These policies are displayed for reference. Changing their
                    enforcement requires a connected backend settings API.
                </InfoNote>
            </section>
        );
    }

    if (tab === 'account') {
        return (
            <section aria-labelledby="account-heading">
                <SectionTitle
                    title="Administrator account"
                    description="Your profile and sign-in security."
                />

                <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                    <Row
                        icon={CircleUserRound}
                        title="Profile information"
                        description="Review and update your administrator profile details."
                    >
                        <Action
                            onClick={() => navigate('/admin/dashboard/profile')}
                        >
                            View profile
                        </Action>
                    </Row>

                    <Row
                        icon={LockKeyhole}
                        title="Password & security"
                        description="Manage your password and account security."
                    >
                        <Action
                            onClick={() =>
                                navigate('/admin/dashboard/security')
                            }
                        >
                            Security settings
                        </Action>
                    </Row>
                </div>
            </section>
        );
    }

    return (
        <section aria-labelledby="system-heading">
            <SectionTitle
                title="System information"
                description="Reference information for the administration workspace."
            />

            <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                {SYSTEM_INFO.map(([label, value]) => (
                    <div
                        key={label}
                        className="flex min-w-0 flex-col gap-1.5 border-b border-[#252D38] px-4 py-4 last:border-b-0 sm:px-5 md:flex-row md:items-start md:justify-between md:gap-6 md:px-6"
                    >
                        <span className="shrink-0 text-[12px] text-[#8792A1]">
                            {label}
                        </span>

                        <span className="min-w-0 break-words text-[12px] font-medium leading-5 text-[#D8E0E9] md:max-w-[65%] md:text-right">
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            <InfoNote>
                Live environment and policy data should come from your backend
                configuration.
            </InfoNote>
        </section>
    );
}

export default function Settings() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('platform');

    return (
        <div className="min-w-0 w-full space-y-6 font-sans sm:space-y-8 lg:space-y-10">
            <PageHeader
                title="Settings"
                subtitle="Manage your account and review platform configuration."
            />

            <div className="min-w-0">
                <SettingsTabs tab={tab} setTab={setTab} />

                <div
                    className="min-w-0 pt-6 sm:pt-8"
                    id={`settings-panel-${tab}`}
                    role="tabpanel"
                    aria-labelledby={`settings-tab-${tab}`}
                    tabIndex={0}
                >
                    <SettingsPanel tab={tab} navigate={navigate} />
                </div>
            </div>
        </div>
    );
}

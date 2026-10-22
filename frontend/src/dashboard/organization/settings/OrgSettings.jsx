import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowUpRight,
    Building2,
    CircleUserRound,
    ClipboardList,
    FileText,
    HandHeart,
    Info,
    LockKeyhole,
    Megaphone,
    ShieldCheck,
    UsersRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

const BASE_PATH = '/organization/dashboard';

const TABS = [
    {
        id: 'organization',
        label: 'Organization',
        icon: Building2,
    },
    {
        id: 'account',
        label: 'My account',
        icon: CircleUserRound,
    },
    {
        id: 'workspace',
        label: 'Workspace',
        icon: ShieldCheck,
    },
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

function SettingRow({ icon: Icon, title, description, children }) {
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

            {children && (
                <div className="flex min-w-0 items-center pl-12 sm:pl-[54px] md:shrink-0 md:pl-0">
                    {children}
                </div>
            )}
        </div>
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

function Status({ children, enabled = false }) {
    return (
        <span
            className={`inline-flex max-w-full items-center gap-2 text-[12px] font-medium ${
                enabled ? 'text-[#91C3B3]' : 'text-[#B0BBC9]'
            }`}
        >
            {enabled ? (
                <ShieldCheck size={15} strokeWidth={1.8} className="shrink-0" />
            ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8D9BAA]" />
            )}

            <span className="break-words">{children}</span>
        </span>
    );
}

function SettingsTabs({ tab, setTab }) {
    return (
        <div
            className="grid grid-cols-3 gap-1 overflow-hidden border-b border-[#303A47] sm:flex sm:gap-1"
            role="tablist"
            aria-label="Organization settings sections"
        >
            {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = tab === id;

                return (
                    <button
                        key={id}
                        id={`org-settings-tab-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`org-settings-panel-${id}`}
                        onClick={() => setTab(id)}
                        className={`relative flex min-h-12 min-w-0 items-center justify-center gap-1.5 px-1.5 py-2 text-center text-[11px] font-medium transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F766E] sm:min-w-[120px] sm:justify-start sm:gap-2.5 sm:px-5 sm:text-[12px] ${
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
    if (tab === 'organization') {
        return (
            <section aria-labelledby="org-settings-tab-organization">
                <SectionTitle
                    title="Organization management"
                    description="Manage your organization information and coordinate its activities across the platform."
                />

                <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                    <SettingRow
                        icon={Building2}
                        title="Organization profile"
                        description="Review your organization's identity, contact information, mission, and public profile."
                    >
                        <Action
                            onClick={() => navigate(`${BASE_PATH}/profile`)}
                        >
                            Manage profile
                        </Action>
                    </SettingRow>

                    <SettingRow
                        icon={Megaphone}
                        title="Campaign management"
                        description="Manage fundraising campaigns, track progress, and review campaign information."
                    >
                        <Action
                            onClick={() => navigate(`${BASE_PATH}/campaigns`)}
                        >
                            View campaigns
                        </Action>
                    </SettingRow>

                    <SettingRow
                        icon={HandHeart}
                        title="Help requests"
                        description="Review assigned requests, coordinate assistance, and track their progress."
                    >
                        <Action
                            onClick={() =>
                                navigate(`${BASE_PATH}/help-requests`)
                            }
                        >
                            View requests
                        </Action>
                    </SettingRow>

                    <SettingRow
                        icon={UsersRound}
                        title="Volunteer coordination"
                        description="Review volunteer participation and coordinate support for organization activities."
                    >
                        <Action
                            onClick={() => navigate(`${BASE_PATH}/volunteers`)}
                        >
                            View volunteers
                        </Action>
                    </SettingRow>
                </div>

                <InfoNote>
                    Organization details and activities are managed through
                    their respective dashboard sections. Some changes may
                    require administrator review or approval.
                </InfoNote>
            </section>
        );
    }

    if (tab === 'account') {
        return (
            <section aria-labelledby="org-settings-tab-account">
                <SectionTitle
                    title="Account preferences"
                    description="Manage your account information and sign-in security."
                />

                <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                    <SettingRow
                        icon={CircleUserRound}
                        title="Account profile"
                        description="Review the account details associated with your organization dashboard."
                    >
                        <Action
                            onClick={() => navigate(`${BASE_PATH}/profile`)}
                        >
                            View profile
                        </Action>
                    </SettingRow>

                    <SettingRow
                        icon={LockKeyhole}
                        title="Password & security"
                        description="Update your password and manage the security of your organization account."
                    >
                        <Action
                            onClick={() => navigate(`${BASE_PATH}/security`)}
                        >
                            Security settings
                        </Action>
                    </SettingRow>
                </div>

                <InfoNote>
                    Keep your account credentials secure and ensure that only
                    authorized representatives have access to your organization
                    dashboard.
                </InfoNote>
            </section>
        );
    }

    return (
        <section aria-labelledby="org-settings-tab-workspace">
            <SectionTitle
                title="Workspace information"
                description="Reference information about your organization's workspace and platform access."
            />

            <div className="overflow-hidden border border-[#252D38] bg-[#0E1219]">
                <SettingRow
                    icon={Building2}
                    title="Platform"
                    description="Your organization operates within the Stand For People humanitarian coordination platform."
                >
                    <span className="text-[12px] font-medium text-[#C7D1DD]">
                        Stand For People
                    </span>
                </SettingRow>

                <SettingRow
                    icon={CircleUserRound}
                    title="Account type"
                    description="Your workspace is designed for registered organization accounts."
                >
                    <Status enabled>Organization</Status>
                </SettingRow>

                <SettingRow
                    icon={ShieldCheck}
                    title="Access permissions"
                    description="Available dashboard features are determined by your assigned account role and backend permissions."
                >
                    <Status>Role-based</Status>
                </SettingRow>

                <SettingRow
                    icon={ClipboardList}
                    title="Organization review"
                    description="Organization verification and approval are managed by platform administrators."
                >
                    <span className="text-[12px] font-medium text-[#C7D1DD]">
                        Admin managed
                    </span>
                </SettingRow>

                <SettingRow
                    icon={FileText}
                    title="Platform policies"
                    description="Review the terms and privacy information that govern the use of the platform."
                >
                    <Action onClick={() => navigate('/terms')}>
                        View terms
                    </Action>
                </SettingRow>
            </div>

            <InfoNote>
                This section provides general workspace information. Live
                verification status, account permissions, and
                organization-specific configuration must be retrieved from the
                backend before they can be displayed accurately.
            </InfoNote>
        </section>
    );
}

export default function OrgSettings() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('organization');

    return (
        <div className="min-w-0 w-full space-y-6 font-sans sm:space-y-8 lg:space-y-10">
            <PageHeader
                title="Settings"
                subtitle="Manage your organization account and workspace preferences."
            />

            <div className="min-w-0">
                <SettingsTabs tab={tab} setTab={setTab} />

                <div
                    id={`org-settings-panel-${tab}`}
                    role="tabpanel"
                    aria-labelledby={`org-settings-tab-${tab}`}
                    tabIndex={0}
                    className="min-w-0 pt-6 sm:pt-8"
                >
                    <SettingsPanel tab={tab} navigate={navigate} />
                </div>
            </div>
        </div>
    );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    AlertTriangle,
    CalendarDays,
    Clock3,
    FileText,
    ImageOff,
    MapPin,
    Megaphone,
    Star,
    Target,
    UsersRound,
    UserRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import {
    fetchCampaigns,
    fetchCampaignVolunteerAssignments,
} from './api/campaignsAPI';

const ROUTE = '/admin/dashboard/campaigns';

const panel = 'min-w-0 border border-[#303A47] bg-[#171D26]';

const statusStyles = {
    active: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    unverified: 'border-[#685B40] bg-[#342F23] text-[#E4D0A0]',
    completed: 'border-[#46586D] bg-[#253242] text-[#C0D0E1]',
    rejected: 'border-[#75464C] bg-[#322126] text-[#E9B8BD]',
    cancelled: 'border-[#515967] bg-[#292E37] text-[#C2CAD5]',
};

const assignmentStatusStyles = {
    assigned: 'border-[#46586D] bg-[#253242] text-[#C0D0E1]',
    accepted: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    in_progress: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    completed: 'border-[#46586D] bg-[#253242] text-[#C0D0E1]',
    rejected: 'border-[#75464C] bg-[#322126] text-[#E9B8BD]',
    withdrawn: 'border-[#515967] bg-[#292E37] text-[#C2CAD5]',
    withdrawal_requested: 'border-[#685B40] bg-[#342F23] text-[#E4D0A0]',
};

const priorityLabels = {
    1: 'Low',
    2: 'Normal',
    3: 'High',
    4: 'Critical',
};

function text(value, fallback = 'Not provided') {
    if (value === null || value === undefined) return fallback;

    return String(value).trim() || fallback;
}

function label(value) {
    return text(value, 'Not specified')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function money(value) {
    const number = Number(value);

    return `৳${(Number.isFinite(number) ? number : 0).toLocaleString('en-BD', {
        maximumFractionDigits: 2,
    })}`;
}

function date(value, withTime = false) {
    if (!value) return 'Not set';

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return String(value);

    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };

    if (withTime) {
        Object.assign(options, {
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    return parsed.toLocaleString('en-GB', options);
}

function collectedAmount(campaign) {
    const amount = Number(
        campaign?.collected_amount ??
            campaign?.raised_amount ??
            campaign?.amount_raised ??
            campaign?.total_donations ??
            0,
    );

    return Number.isFinite(amount) ? Math.max(0, amount) : 0;
}

function cover(campaign) {
    const value =
        campaign?.cover_image_url ||
        campaign?.cover_image ||
        campaign?.image_url ||
        campaign?.image;

    return typeof value === 'string' ? value : '';
}

function getOrganization(campaign) {
    const organization = campaign?.organization;

    const organizationId =
        campaign?.organization_id ?? organization?.id ?? null;

    const organizationName =
        organization?.name || campaign?.organization_name || null;

    return {
        id: organizationId,
        name: organizationName,
        isLinked: organizationId !== null || Boolean(organizationName),
    };
}

function getHelpRequestId(campaign) {
    return (
        campaign?.help_request_id ??
        campaign?.helpRequest?.id ??
        campaign?.help_request?.id ??
        null
    );
}

function Info({ title, value, className = '' }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <dt className="text-[12px] font-medium text-[#8796A8]">{title}</dt>

            <dd className="mt-1.5 mb-0 wrap-break-word whitespace-pre-wrap text-[13px] leading-6 text-[#E6EBF2]">
                {text(value)}
            </dd>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 border-b border-[#344150] bg-[#202B38] px-5 py-4 sm:px-7 sm:py-5">
            <span className="flex size-8 shrink-0 items-center justify-center border border-[#3A495B] bg-[#273646] text-[#C3D0DE]">
                <Icon size={16} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
                <h2 className="m-0! font-sans! text-[14px]! font-semibold! leading-5 text-[#EEF1F5]!">
                    {title}
                </h2>

                {subtitle && (
                    <p className="mt-1 mb-0! text-[12px] leading-5 text-[#9AAABD]">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function ClassificationBadges({ campaign }) {
    const isFeatured = Boolean(campaign.is_featured);
    const isUrgent = Boolean(campaign.is_urgent);
    const priority = Number(campaign.urgency_priority) || 2;

    return (
        <div
            aria-label="Campaign classification"
            className="flex flex-wrap items-center gap-2"
        >
            <span
                className={`inline-flex min-h-8 items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium ${
                    isFeatured
                        ? 'border-[#685B40] bg-[#342F23] text-[#E4D0A0]'
                        : 'border-[#394553] bg-[#202833] text-[#9BA8B8]'
                }`}
            >
                <Star size={12} />
                {isFeatured ? 'Featured' : 'Not featured'}
            </span>

            <span
                className={`inline-flex min-h-8 items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium ${
                    isUrgent
                        ? 'border-[#75464C] bg-[#322126] text-[#E9B8BD]'
                        : 'border-[#394553] bg-[#202833] text-[#9BA8B8]'
                }`}
            >
                <AlertTriangle size={12} />
                {isUrgent ? 'Urgent' : 'Not urgent'}
            </span>

            {isUrgent && (
                <span className="inline-flex min-h-8 items-center border border-[#46586D] bg-[#253242] px-2.5 py-1 text-[11px] font-medium text-[#C0D0E1]">
                    Priority: {priorityLabels[priority] || 'Normal'}
                </span>
            )}
        </div>
    );
}

function Identity({ campaign }) {
    const [imageFailed, setImageFailed] = useState(false);

    const image = cover(campaign);

    const status = String(
        campaign.status || campaign.verification_status || 'unverified',
    ).toLowerCase();

    return (
        <section className={`${panel} overflow-hidden`}>
            <div className="relative h-44 overflow-hidden bg-[#10161F] sm:h-56 lg:h-64">
                {image && !imageFailed ? (
                    <img
                        src={image}
                        alt={`${text(campaign.title, 'Campaign')} cover`}
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-cover object-center"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[#77889A]">
                        <ImageOff size={19} />
                        No campaign cover
                    </div>
                )}
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[11px] font-medium ${
                            statusStyles[status] || statusStyles.cancelled
                        }`}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                        {label(status)}
                    </span>

                    {campaign.category && (
                        <span className="border border-[#354252] bg-[#202B37] px-2.5 py-1 text-[11px] text-[#C3CFDA]">
                            {label(campaign.category)}
                        </span>
                    )}

                    {campaign.is_featured && (
                        <span className="inline-flex items-center gap-1.5 border border-[#685B40] bg-[#342F23] px-2.5 py-1 text-[11px] text-[#E4D0A0]">
                            <Star size={12} />
                            Featured
                        </span>
                    )}

                    {campaign.is_urgent && (
                        <span className="inline-flex items-center gap-1.5 border border-[#75464C] bg-[#322126] px-2.5 py-1 text-[11px] text-[#E9B8BD]">
                            <AlertTriangle size={12} />
                            Urgent
                        </span>
                    )}
                </div>

                <h1 className="mt-3 mb-0! wrap-break-word font-sans! text-[20px]! font-semibold! leading-[1.45] tracking-[-0.02em] text-[#F0F3F7]! sm:text-[25px]!">
                    {text(campaign.title, 'Untitled campaign')}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#AAB8C7]">
                    <span className="inline-flex items-center gap-2">
                        <Megaphone size={14} />
                        {label(campaign.scope || 'global')}
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-2">
                        <MapPin size={14} className="shrink-0" />
                        <span className="wrap-break-word">
                            {text(campaign.location, 'Location not set')}
                        </span>
                    </span>

                    <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} />
                        Created {date(campaign.created_at)}
                    </span>
                </div>
            </div>
        </section>
    );
}

function MainInformation({ campaign }) {
    return (
        <section className="min-w-0 overflow-hidden border border-[#354354] bg-[#1A222D]">
            <SectionHeader
                icon={FileText}
                title="About this campaign"
                subtitle="Purpose and intended humanitarian impact"
            />

            <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="m-0! wrap-break-word whitespace-pre-line text-[14px] leading-[1.95] text-[#D4DDE7]">
                    {text(
                        campaign.description,
                        'No campaign description has been added.',
                    )}
                </p>

                <div className="mt-7 border-t border-[#344150] pt-6">
                    <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E8EDF3]!">
                        Campaign information
                    </h3>

                    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        <Info
                            title="Category"
                            value={label(campaign.category)}
                        />
                        <Info
                            title="Campaign type"
                            value={label(campaign.type || 'global_situation')}
                        />
                        <Info
                            title="Campaign scope"
                            value={label(campaign.scope || 'global')}
                        />
                        <Info title="Campaign ID" value={campaign.id} />
                    </dl>
                </div>

                <div className="mt-7 border-t border-[#344150] pt-6">
                    <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E8EDF3]!">
                        Location & affected communities
                    </h3>

                    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        <Info title="Location" value={campaign.location} />
                        <Info title="District" value={campaign.district} />
                        <Info
                            title="Affected areas"
                            value={campaign.affected_areas}
                            className="sm:col-span-2"
                        />
                    </dl>
                </div>
            </div>
        </section>
    );
}

function Funding({ campaign }) {
    const target = Math.max(0, Number(campaign.target_amount) || 0);
    const raised = collectedAmount(campaign);

    const percent = target > 0 ? Math.min(100, (raised / target) * 100) : 0;
    const remaining = Math.max(0, target - raised);

    return (
        <section className="min-w-0 overflow-hidden border border-[#354354] bg-[#171E27]">
            <SectionHeader
                icon={Target}
                title="Funding overview"
                subtitle="Funding goal, progress & dates"
            />

            <div className="bg-[#0E1219] px-5 py-6 sm:px-6">
                <p className="m-0! text-[12px] text-[#94A3B4]">
                    Fundraising target
                </p>

                <p className="mt-1 mb-0! wrap-break-word text-[27px] font-semibold tracking-tight text-[#F0F3F7]">
                    {money(target)}
                </p>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <p className="m-0! text-[12px] text-[#94A3B4]">
                            Collected so far
                        </p>
                        <p className="mt-1 mb-0! text-[17px] font-semibold text-[#E7EDF4]">
                            {money(raised)}
                        </p>
                    </div>

                    <span className="text-[14px] font-semibold text-[#A8C8BD]">
                        {percent.toFixed(1)}%
                    </span>
                </div>

                <div
                    className="mt-3 h-2 overflow-hidden bg-[#303A47]"
                    role="progressbar"
                    aria-label="Funding progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percent)}
                >
                    <div
                        className="h-full bg-[#8BB4A7] transition-[width]"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-3 flex flex-wrap justify-end gap-2 text-[12px] text-[#91A0B0]">
                    <span>{money(remaining)} remaining</span>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#303A47] pt-5 text-[12px]">
                    <span className="text-[#9EADBD]">Funding status</span>
                    <span className="text-right font-medium text-[#E2EAF1]">
                        {target > 0 && raised >= target
                            ? 'Target reached'
                            : raised > 0
                              ? 'In progress'
                              : 'Awaiting donations'}
                    </span>
                </div>

                <div className="mt-5 border-t border-[#303A47] pt-5">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E8EDF3]!">
                            Campaign schedule
                        </h3>
                        <span className="text-[11px] text-[#9DADBF]">
                            {campaign.end_date
                                ? 'Fixed end date'
                                : 'Open-ended'}
                        </span>
                    </div>

                    <dl className="mt-4 flex items-start justify-between gap-4">
                        <Info
                            title="Start date"
                            value={date(campaign.start_date)}
                            className="flex-1"
                        />
                        <Info
                            title="End date"
                            value={
                                campaign.end_date
                                    ? date(campaign.end_date)
                                    : 'No end date'
                            }
                            className="flex-1 text-right"
                        />
                    </dl>
                </div>
            </div>
        </section>
    );
}

function Organization({ campaign, navigate }) {
    const organization = getOrganization(campaign);
    const helpRequestId = getHelpRequestId(campaign);

    const referenceLink =
        'inline-flex max-w-full items-center gap-1.5 text-left text-[#C3D4E5] underline decoration-[#70869C] underline-offset-4 transition-colors hover:text-white hover:decoration-white';

    return (
        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#171E27]">
            <SectionHeader
                icon={UsersRound}
                title="Organization & references"
                subtitle="Linked organization and related records"
            />

            <dl className="grid grid-cols-1 gap-y-6 bg-[#0E1219] px-5 py-6 sm:px-7">
                <div className="min-w-0">
                    <dt className="text-[12px] font-medium text-[#8796A8]">
                        Organization
                    </dt>
                    <dd className="mt-1.5 mb-0 wrap-break-word whitespace-pre-wrap text-[13px] leading-6 text-[#E6EBF2]">
                        {organization.name ? (
                            organization.id != null ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/dashboard/organizations/${organization.id}`,
                                        )
                                    }
                                    className={referenceLink}
                                >
                                    <span className="wrap-break-word">
                                        {organization.name}
                                    </span>
                                    <ArrowUpRight
                                        size={13}
                                        className="shrink-0"
                                    />
                                </button>
                            ) : (
                                organization.name
                            )
                        ) : organization.isLinked ? (
                            'Organization name unavailable'
                        ) : (
                            'No organization linked'
                        )}
                    </dd>
                </div>

                <div className="min-w-0">
                    <dt className="text-[12px] font-medium text-[#8796A8]">
                        Related help request
                    </dt>
                    <dd className="mt-1.5 mb-0 wrap-break-word whitespace-pre-wrap text-[13px] leading-6 text-[#E6EBF2]">
                        {helpRequestId != null ? (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/dashboard/help-requests/${helpRequestId}`,
                                    )
                                }
                                className={referenceLink}
                            >
                                Request #{helpRequestId}
                                <ArrowUpRight size={13} className="shrink-0" />
                            </button>
                        ) : (
                            'No related help request'
                        )}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

function ConnectedVolunteers({ campaignId, navigate }) {
    const [state, setState] = useState({
        loading: true,
        error: '',
        assignments: [],
    });

    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let active = true;

        fetchCampaignVolunteerAssignments(campaignId)
            .then((response) => {
                if (!active) return;

                const records = Array.isArray(response)
                    ? response
                    : (response?.assignments ??
                      response?.data?.assignments ??
                      []);

                setState({
                    loading: false,
                    error: '',
                    assignments: Array.isArray(records) ? records : [],
                });
            })
            .catch((error) => {
                if (!active) return;

                setState({
                    loading: false,
                    error:
                        error?.message ||
                        'Unable to load connected volunteers.',
                    assignments: [],
                });
            });

        return () => {
            active = false;
        };
    }, [campaignId, retryKey]);

    return (
        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#171E27]">
            <SectionHeader
                icon={UsersRound}
                title="Connected volunteers"
                subtitle="Volunteers assigned to this campaign"
            />

            <div className="bg-[#0E1219]">
                {state.loading ? (
                    <div className="flex items-center gap-3 px-5 py-6 text-[13px] text-[#AAB8C7]">
                        <span className="size-4 animate-spin rounded-full border-2 border-[#526273] border-t-[#C3D4E5]" />
                        Loading volunteers...
                    </div>
                ) : state.error ? (
                    <div className="px-5 py-5">
                        <p className="m-0! text-[13px] leading-6 text-[#E5B5B9]">
                            {state.error}
                        </p>
                        <button
                            type="button"
                            onClick={() => setRetryKey((value) => value + 1)}
                            className="mt-3 text-[12px] font-medium text-[#C3D4E5] underline underline-offset-4 transition-colors hover:text-white"
                        >
                            Try again
                        </button>
                    </div>
                ) : state.assignments.length === 0 ? (
                    <div className="px-5 py-7 text-center">
                        <UsersRound
                            size={23}
                            strokeWidth={1.5}
                            className="mx-auto text-[#667789]"
                        />
                        <p className="mt-3 mb-1! text-[13px] font-medium text-[#D5DEE8]">
                            No volunteers assigned
                        </p>
                        <p className="m-0! text-[12px] leading-5 text-[#8999AA]">
                            Assigned volunteers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#303A47]">
                        <div className="px-5 py-3">
                            <p className="m-0! text-[12px] text-[#9DADBD]">
                                {state.assignments.length}{' '}
                                {state.assignments.length === 1
                                    ? 'assignment'
                                    : 'assignments'}
                            </p>
                        </div>

                        {state.assignments.map((assignment) => {
                            const volunteer = assignment.volunteer;
                            const volunteerId =
                                assignment.volunteer_id ??
                                volunteer?.id ??
                                null;

                            const assignmentStatus = String(
                                assignment.status || 'unknown',
                            ).toLowerCase();

                            return (
                                <div
                                    key={assignment.id}
                                    className="min-w-0 px-5 py-4 transition-colors hover:bg-[#151C25]"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center border border-[#354252] bg-[#202B37] text-[#B7C5D4]">
                                            <UserRound size={17} />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    {volunteer?.name ? (
                                                        volunteerId != null ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/dashboard/users/${volunteerId}`,
                                                                    )
                                                                }
                                                                className="inline-flex max-w-full items-center gap-1.5 text-left text-[13px] font-medium text-[#E6EBF2] transition-colors hover:text-white"
                                                            >
                                                                <span className="wrap-break-word">
                                                                    {
                                                                        volunteer.name
                                                                    }
                                                                </span>
                                                                <ArrowUpRight
                                                                    size={13}
                                                                    className="shrink-0 text-[#9AAABD]"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <p className="m-0! wrap-break-word text-[13px] font-medium text-[#E6EBF2]">
                                                                {volunteer.name}
                                                            </p>
                                                        )
                                                    ) : (
                                                        <p className="m-0! text-[13px] font-medium text-[#E6EBF2]">
                                                            Volunteer
                                                            {volunteerId != null
                                                                ? ` #${volunteerId}`
                                                                : ''}
                                                        </p>
                                                    )}
                                                </div>

                                                <span
                                                    className={`inline-flex shrink-0 items-center border px-2 py-1 text-[10px] font-medium ${
                                                        assignmentStatusStyles[
                                                            assignmentStatus
                                                        ] ||
                                                        'border-[#515967] bg-[#292E37] text-[#C2CAD5]'
                                                    }`}
                                                >
                                                    {label(assignmentStatus)}
                                                </span>
                                            </div>

                                            {volunteer?.email && (
                                                <p className="mt-1 mb-0! wrap-break-word text-[12px] leading-5 text-[#9DADBD]">
                                                    {volunteer.email}
                                                </p>
                                            )}

                                            {volunteer?.phone && (
                                                <p className="mt-0.5 mb-0! text-[12px] leading-5 text-[#9DADBD]">
                                                    {volunteer.phone}
                                                </p>
                                            )}

                                            {volunteer?.status && (
                                                <p className="mt-2 mb-0! text-[11px] text-[#77889A]">
                                                    Account:{' '}
                                                    {label(volunteer.status)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function History({ campaign }) {
    return (
        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#171E27]">
            <SectionHeader
                icon={Clock3}
                title="Record history"
                subtitle="Creation and last modification"
            />

            <dl className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-1">
                <Info title="Created" value={date(campaign.created_at, true)} />
                <Info
                    title="Last updated"
                    value={date(campaign.updated_at, true)}
                />
            </dl>
        </section>
    );
}

export default function CampaignDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [state, setState] = useState({
        loading: true,
        error: '',
        campaigns: [],
    });

    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let active = true;

        fetchCampaigns()
            .then((response) => {
                if (!active) return;

                const records = Array.isArray(response)
                    ? response
                    : (response?.data ?? response?.campaigns ?? []);

                setState({
                    loading: false,
                    error: '',
                    campaigns: Array.isArray(records) ? records : [],
                });
            })
            .catch((error) => {
                if (!active) return;

                setState({
                    loading: false,
                    error: error?.message || 'Unable to load campaign details.',
                    campaigns: [],
                });
            });

        return () => {
            active = false;
        };
    }, [retryKey]);

    const campaign = useMemo(
        () => state.campaigns.find((item) => String(item.id) === String(id)),
        [state.campaigns, id],
    );

    const back = useCallback(() => {
        if (location.state?.fromVolunteer) {
            navigate(-1);
        } else {
            navigate(ROUTE);
        }
    }, [location.state, navigate]);

    const retry = () => {
        setState({
            loading: true,
            error: '',
            campaigns: [],
        });

        setRetryKey((value) => value + 1);
    };

    const header = (
        <PageHeader
            title="Campaign details"
            subtitle="Review campaign information, location, schedule and funding."
            action={
                <div className="flex flex-col items-stretch gap-3">
                    {campaign && <ClassificationBadges campaign={campaign} />}

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={back}
                            className="inline-flex min-h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[12px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#202A35]"
                        >
                            <ArrowLeft size={15} />
                            Back to campaigns
                        </button>

                        {campaign?.id != null && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`${ROUTE}/${campaign.id}/edit`)
                                }
                                className="inline-flex min-h-10 items-center gap-2 border border-[#586678] bg-[#2B3949] px-4 text-[12px] font-medium text-[#EEF1F5] transition-colors hover:bg-[#37495D]"
                            >
                                Edit campaign
                                <ArrowUpRight size={15} />
                            </button>
                        )}
                    </div>
                </div>
            }
        />
    );

    if (state.loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10">
                {header}
                <LoadingUI
                    variant="page"
                    title="Loading campaign details..."
                    description="Please wait while we retrieve the campaign information."
                />
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="min-w-0 space-y-6">
                {header}
                <LoadingError
                    title="Unable to load campaign"
                    message={state.error}
                    onRetry={retry}
                />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-w-0 space-y-6">
                {header}
                <LoadingError
                    title="Campaign not found"
                    message="This campaign may have been removed or is no longer available."
                    onRetry={retry}
                />
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            {header}

            <Identity key={campaign.id} campaign={campaign} />

            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_380px]">
                <main className="min-w-0 space-y-5">
                    <MainInformation campaign={campaign} />
                    <History campaign={campaign} />
                </main>

                <aside className="min-w-0 space-y-5">
                    <Funding campaign={campaign} />

                    <Organization campaign={campaign} navigate={navigate} />

                    <ConnectedVolunteers
                        campaignId={campaign.id}
                        navigate={navigate}
                    />
                </aside>
            </div>
        </div>
    );
}

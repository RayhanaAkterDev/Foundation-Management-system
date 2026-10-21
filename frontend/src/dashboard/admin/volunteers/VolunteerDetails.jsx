import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    CircleAlert,
    Mail,
    MapPin,
    Phone,
    BriefcaseBusiness,
    UserRound,
    FileText,
    Search,
    SlidersHorizontal,
    ChevronDown,
    Layers3,
    RotateCcw,
    ShieldCheck,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';
import DataTable from '@/components/dashboard/DataTable';
import UsersPagination from '../users/components/Pagination';
import DashboardInput from '@/components/dashboard/DashboardInput';
import { fetchVolunteerDetails } from './api/volunteerApi';

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          });
};

const normalizeResponse = (response) => {
    if (!response || typeof response !== 'object') {
        return { volunteer: null, assignments: [] };
    }
    const root =
        response.data &&
        typeof response.data === 'object' &&
        !Array.isArray(response.data)
            ? response.data
            : response;
    const volunteer =
        root.volunteer && typeof root.volunteer === 'object'
            ? root.volunteer
            : root;
    const assignments =
        root.assignments ??
        root.campaign_assignments ??
        root.campaign_volunteer_assignments ??
        root.campaignVolunteerAssignments ??
        volunteer.assignments ??
        volunteer.campaign_assignments ??
        volunteer.campaign_volunteer_assignments ??
        volunteer.campaignVolunteerAssignments ??
        [];
    return {
        volunteer,
        assignments: Array.isArray(assignments) ? assignments : [],
    };
};

const availabilityLabel = (value) => {
    if (value === true || value === 1 || value === '1') return 'Available';
    if (value === false || value === 0 || value === '0') return 'Unavailable';
    const normalized = String(value ?? '')
        .trim()
        .toLowerCase();
    if (['available', 'yes', 'true'].includes(normalized)) return 'Available';
    if (['unavailable', 'no', 'false'].includes(normalized))
        return 'Unavailable';
    return 'Not specified';
};

const getCampaignId = (item) =>
    item?.campaign?.id ?? item?.campaign_id ?? item?.campaignId ?? null;

const getCampaignTitle = (item) =>
    item?.campaign?.title ??
    item?.campaign?.name ??
    item?.campaign?.campaign_title ??
    item?.campaign?.campaign_name ??
    item?.campaign_title ??
    item?.campaign_name ??
    (getCampaignId(item) != null
        ? `Campaign #${getCampaignId(item)}`
        : 'Campaign details unavailable');

function Field({ icon: Icon, label, value, wide = false }) {
    return (
        <div className={`min-w-0 py-4 ${wide ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-[11px] font-medium! uppercase tracking-[0.075em] text-[#8290A1]!">
                <Icon size={14} strokeWidth={1.7} className="shrink-0" />
                {label}
            </div>
            <p className="mt-2 wrap-break-word text-[14px] font-medium! leading-6 text-[#DCE4ED]!">
                {value || '—'}
            </p>
        </div>
    );
}

function SectionTitle({ icon: Icon, title, extra }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#29323E] pb-4">
            <div className="flex min-w-0 items-center gap-3">
                <Icon
                    size={18}
                    strokeWidth={1.65}
                    className="shrink-0 text-[#93A3B5]"
                />
                <h2 className="text-[17px] font-semibold! tracking-tight text-[#E6ECF3]! sm:text-[18px]">
                    {title}
                </h2>
            </div>
            {extra}
        </div>
    );
}

function SelectFilter({
    label,
    value,
    options,
    onChange,
    allLabel,
    setCampaignPage,
}) {
    const labelOf = (value) =>
        value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const selectClass =
        'h-10 w-full min-w-0 appearance-none border border-[#35404E] bg-[#151C25] px-3 pr-9 text-[12px] text-[#DCE5EF] outline-none transition-colors hover:border-[#526173] focus:border-[#8190A3]';
    return (
        <div className="border-t border-[#29323E] px-4 py-5 sm:px-5">
            <label className="mb-3 block text-[10px] font-semibold! uppercase tracking-[0.08em] text-[#91A0B2]!">
                {label}
            </label>
            <div className="relative">
                <select
                    aria-label={label}
                    value={value}
                    onChange={(event) => {
                        onChange(event.target.value);
                        setCampaignPage(1);
                    }}
                    className={selectClass}
                >
                    <option value="all">{allLabel}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {labelOf(option)}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8999AA]"
                />
            </div>
        </div>
    );
}

function CampaignFilters({
    campaignFiltersActive,
    resetCampaignFilters,
    campaignStatusFilter,
    campaignTypeFilter,
    campaignCategoryFilter,
    campaignOrganizationFilter,
    campaignRows,
    campaignTypes,
    campaignCategories,
    campaignOrganizations,
    setCampaignStatusFilter,
    setCampaignTypeFilter,
    setCampaignCategoryFilter,
    setCampaignOrganizationFilter,
    setCampaignPage,
}) {
    const statuses = [
        'all',
        'unverified',
        'active',
        'in_progress',
        'pending',
        'completed',
        'rejected',
        'cancelled',
    ];
    const statusCounts = Object.fromEntries(
        statuses.map((status) => [
            status,
            status === 'all'
                ? campaignRows.length
                : campaignRows.filter(
                      (row) =>
                          String(row.status ?? '')
                              .toLowerCase()
                              .replace(/[\s-]+/g, '_') === status,
                  ).length,
        ]),
    );
    // Keep unexpected API statuses visible rather than silently hiding them.
    const extraStatuses = [
        ...new Set(
            campaignRows.map((row) =>
                String(row.status ?? 'unknown')
                    .toLowerCase()
                    .replace(/[\s-]+/g, '_'),
            ),
        ),
    ].filter((status) => !statuses.includes(status));
    const allStatuses = [...statuses, ...extraStatuses];
    const labelOf = (value) =>
        value === 'all'
            ? 'All Campaigns'
            : value
                  .replace(/[_-]+/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
    return (
        <aside className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[#29323E] bg-[#1A222D] px-5">
                <h3 className="text-[15px] font-semibold! text-[#E7EDF4]!">
                    Filter
                </h3>
                {campaignFiltersActive && (
                    <button
                        type="button"
                        onClick={resetCampaignFilters}
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#A7B4C3] hover:text-[#EEF1F5]"
                    >
                        <RotateCcw size={13} /> Reset
                    </button>
                )}
            </div>
            <div className="px-3 py-4 sm:px-4">
                <p className="mb-3 px-2 text-[10px] font-semibold! uppercase tracking-[0.08em] text-[#91A0B2]!">
                    Campaign status
                </p>
                <div className="space-y-1">
                    {allStatuses.map((status, index) => {
                        const selected = campaignStatusFilter === status;
                        const count =
                            statusCounts[status] ??
                            campaignRows.filter(
                                (row) =>
                                    String(row.status ?? '')
                                        .toLowerCase()
                                        .replace(/[\s-]+/g, '_') === status,
                            ).length;
                        return (
                            <button
                                key={status}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => {
                                    setCampaignStatusFilter(status);
                                    setCampaignPage(1);
                                }}
                                className={`group flex min-h-10 w-full items-center gap-2.5 border-l-2 px-2.5 text-left transition-colors ${selected ? 'border-[#8FA3B8] bg-[#1B2531]' : 'border-transparent hover:bg-[#161F29]'}`}
                            >
                                <span
                                    className={`flex h-6 min-w-6 shrink-0 items-center justify-center bg-[#202D3A] px-1 text-[10px] tabular-nums ${selected ? 'text-[#DCE8F3]' : 'text-[#8E9EAF]'}`}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span
                                    className={`min-w-0 flex-1 truncate text-[12px] ${selected ? 'font-semibold! text-[#EEF1F5]!' : 'font-medium! text-[#9AA8B9]! group-hover:text-[#DCE5EF]!'}`}
                                >
                                    {labelOf(status)}
                                </span>
                                <span
                                    className={`shrink-0 text-[11px] tabular-nums ${selected ? 'font-semibold! text-[#E1E9F2]' : 'text-[#7E8C9E]'}`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <SelectFilter
                setCampaignPage={setCampaignPage}
                label="Campaign type"
                value={campaignTypeFilter}
                options={campaignTypes}
                onChange={setCampaignTypeFilter}
                allLabel="All campaign types"
            />
            <SelectFilter
                setCampaignPage={setCampaignPage}
                label="Category"
                value={campaignCategoryFilter}
                options={campaignCategories}
                onChange={setCampaignCategoryFilter}
                allLabel="All categories"
            />
            <SelectFilter
                setCampaignPage={setCampaignPage}
                label="Organization"
                value={campaignOrganizationFilter}
                options={campaignOrganizations}
                onChange={setCampaignOrganizationFilter}
                allLabel="All organizations"
            />
        </aside>
    );
}

export default function VolunteerDetails() {
    const params = useParams();
    const id =
        params.id ??
        params.volunteerId ??
        params.volunteer_id ??
        Object.values(params)[0];
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        volunteer: null,
        assignments: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [failedPhoto, setFailedPhoto] = useState(null);
    const [campaignPage, setCampaignPage] = useState(1);
    const [campaignSearch, setCampaignSearch] = useState('');
    const [campaignStatusFilter, setCampaignStatusFilter] = useState('all');
    const [campaignTypeFilter, setCampaignTypeFilter] = useState('all');
    const [campaignCategoryFilter, setCampaignCategoryFilter] = useState('all');
    const [campaignOrganizationFilter, setCampaignOrganizationFilter] =
        useState('all');
    const [mobileCampaignFiltersOpen, setMobileCampaignFiltersOpen] =
        useState(false);
    const [campaignSort, setCampaignSort] = useState({
        key: 'assigned',
        direction: 'desc',
    });

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError('');
            try {
                if (!id) throw new Error('Volunteer ID is missing.');
                const result = await fetchVolunteerDetails(id);
                if (!cancelled) setDetails(normalizeResponse(result));
            } catch (err) {
                if (!cancelled)
                    setError(
                        err?.message || 'Unable to load volunteer information.',
                    );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const volunteer = details.volunteer;
    const user = volunteer?.user || {};
    const name = user.name || volunteer?.name || 'Unnamed volunteer';
    const email = user.email || volunteer?.email || 'No email address';
    const photo = user.photo || volunteer?.photo;
    const availability = availabilityLabel(
        volunteer?.availability ?? user.availability,
    );
    const rawSkills = volunteer?.skills;
    const skills = Array.isArray(rawSkills)
        ? rawSkills
        : typeof rawSkills === 'string'
          ? rawSkills
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
          : [];

    const campaignRows = details.assignments.map((assignment, index) => {
        const campaign = assignment.campaign || {};
        const category = campaign.category || assignment.category;
        const organization =
            campaign.organization ||
            campaign.organisation ||
            assignment.organization ||
            assignment.organisation;
        const campaignType =
            campaign.type ||
            campaign.campaign_type ||
            assignment.campaign_type ||
            assignment.type;
        const textOf = (value) => {
            if (typeof value === 'string' || typeof value === 'number')
                return String(value);
            if (value && typeof value === 'object')
                return value.name || value.title || value.label || '—';
            return '—';
        };
        return {
            id: assignment.id ?? `assignment-${index}`,
            campaignId: getCampaignId(assignment),
            campaignName: getCampaignTitle(assignment),
            campaignType: textOf(campaignType),
            category: textOf(category),
            organization: textOf(organization?.organization || organization),
            assigned: formatDate(
                assignment.assigned_at || assignment.created_at,
            ),
            assignedTimestamp:
                new Date(
                    assignment.assigned_at || assignment.created_at || 0,
                ).getTime() || 0,
            status: assignment.status || 'unknown',
        };
    });
    /* CAMPAIGN HISTORY FILTERS */

    const campaignTypes = [
        ...new Set(
            campaignRows
                .map((row) => row.campaignType)
                .filter((value) => value !== '—'),
        ),
    ].sort();
    const campaignCategories = [
        ...new Set(
            campaignRows
                .map((row) => row.category)
                .filter((value) => value !== '—'),
        ),
    ].sort();
    const campaignOrganizations = [
        ...new Set(
            campaignRows
                .map((row) => row.organization)
                .filter((value) => value !== '—'),
        ),
    ].sort();

    const filteredCampaignRows = campaignRows.filter((row) => {
        const query = campaignSearch.trim().toLowerCase();
        const matchesSearch =
            !query ||
            [
                row.campaignName,
                row.campaignType,
                row.category,
                row.organization,
            ].some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(query),
            );
        return (
            matchesSearch &&
            (campaignStatusFilter === 'all' ||
                String(row.status)
                    .toLowerCase()
                    .replace(/[\s-]+/g, '_') === campaignStatusFilter) &&
            (campaignTypeFilter === 'all' ||
                row.campaignType === campaignTypeFilter) &&
            (campaignCategoryFilter === 'all' ||
                row.category === campaignCategoryFilter) &&
            (campaignOrganizationFilter === 'all' ||
                row.organization === campaignOrganizationFilter)
        );
    });

    const resetCampaignFilters = () => {
        setCampaignSearch('');
        setCampaignStatusFilter('all');
        setCampaignTypeFilter('all');
        setCampaignCategoryFilter('all');
        setCampaignOrganizationFilter('all');
        setCampaignPage(1);
    };

    const campaignFiltersActive =
        campaignStatusFilter !== 'all' ||
        campaignTypeFilter !== 'all' ||
        campaignCategoryFilter !== 'all' ||
        campaignOrganizationFilter !== 'all' ||
        campaignSearch.trim() !== '';

    const sortedCampaignRows = [...filteredCampaignRows].sort((a, b) => {
        const av =
            campaignSort.key === 'assigned'
                ? a.assignedTimestamp
                : String(a[campaignSort.key] ?? '').toLowerCase();
        const bv =
            campaignSort.key === 'assigned'
                ? b.assignedTimestamp
                : String(b[campaignSort.key] ?? '').toLowerCase();
        const comparison =
            typeof av === 'number'
                ? av - bv
                : String(av).localeCompare(String(bv));
        return campaignSort.direction === 'asc' ? comparison : -comparison;
    });
    const campaignPageSize = 25;
    const campaignTotalPages = Math.max(
        1,
        Math.ceil(sortedCampaignRows.length / campaignPageSize),
    );
    const currentCampaignPage = Math.min(campaignPage, campaignTotalPages);
    const paginatedCampaignRows = sortedCampaignRows.slice(
        (currentCampaignPage - 1) * campaignPageSize,
        currentCampaignPage * campaignPageSize,
    );
    const toggleCampaignSort = (key) => {
        setCampaignSort((previous) => ({
            key,
            direction:
                previous.key === key && previous.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
        setCampaignPage(1);
    };
    const displayCampaignRows = paginatedCampaignRows.map((row, index) => ({
        ...row,
        serialNumber: (currentCampaignPage - 1) * campaignPageSize + index + 1,
    }));

    const campaignColumns = [
        {
            key: 'campaignName',
            header: 'Campaign',
            sortable: true,
            width: 'minmax(210px, 2fr)',
            render: (value) => (
                <div className="min-w-0">
                    <p
                        className="truncate text-[12px] font-semibold! text-[#E3EAF2]!"
                        title={value}
                    >
                        {value}
                    </p>
                </div>
            ),
        },
        {
            key: 'campaignType',
            sortable: true,
            header: 'Type',
            width: 'minmax(115px, 0.8fr)',
            render: (value) => (
                <span className="text-[12px] text-[#B9C4D0]">{value}</span>
            ),
        },
        {
            key: 'category',
            sortable: true,
            header: 'Category',
            width: 'minmax(120px, 0.9fr)',
            render: (value) => (
                <span className="text-[12px] text-[#B9C4D0]">{value}</span>
            ),
        },
        {
            key: 'organization',
            sortable: true,
            header: 'Connected org',
            width: 'minmax(160px, 1.2fr)',
            render: (value) => (
                <span
                    className="block truncate text-[12px] text-[#B9C4D0]"
                    title={value}
                >
                    {value}
                </span>
            ),
        },
        {
            key: 'assigned',
            sortable: true,
            header: 'Assigned',
            width: 'minmax(120px, 0.8fr)',
            render: (value) => (
                <span className="whitespace-nowrap text-[12px] text-[#B9C4D0]">
                    {value}
                </span>
            ),
        },
        {
            key: 'status',
            sortable: true,
            header: 'Status',
            width: 'minmax(125px, 0.8fr)',
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            width: '95px',
            render: (_, row) =>
                row.campaignId != null ? (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/dashboard/campaigns/${encodeURIComponent(row.campaignId)}`,
                            )
                        }
                        className="inline-flex h-8 items-center gap-1.5 border border-[#35404E] px-2.5 text-[11px] font-medium! text-[#C6D0DC]! transition-colors hover:bg-[#1D2733] hover:text-[#EEF1F5]"
                    >
                        View <ArrowUpRight size={13} />
                    </button>
                ) : (
                    <span className="text-[#697586]">—</span>
                ),
        },
    ];

    return (
        <main className="min-w-0 space-y-10 pb-10 font-sans lg:space-y-12">
            {/* Shared dashboard heading — same component as Users and Volunteers */}
            <PageHeader
                title="Volunteer Details"
                subtitle="Membership information and campaign participation."
                action={
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/volunteers')}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-3.5 font-sans text-[12px] font-medium text-[#B8C2CF] transition-colors duration-150 hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#F1F5F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B596A]"
                    >
                        <ArrowLeft size={15} strokeWidth={1.8} />
                        All Volunteers
                    </button>
                }
            />

            {loading ? (
                <LoadingUI
                    variant="page"
                    title="Loading volunteer details..."
                    description="Retrieving volunteer profile and campaign history."
                />
            ) : error ? (
                <LoadingError
                    title="Unable to load volunteer details"
                    message={error}
                />
            ) : !volunteer ? (
                <div className="border border-[#29323E] bg-[#0E1219] px-6 py-12 text-center text-[#9AA6B5]!">
                    Volunteer information is unavailable.
                </div>
            ) : (
                <div className="space-y-6 sm:space-y-7">
                    {/* IDENTITY STRIP */}
                    <section className="relative overflow-hidden border border-[#29323E] bg-[#101720]">
                        <div
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-0.75 bg-[#75879B]"
                        />
                        <div className="flex min-w-0 flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-[#394656] bg-[#222E3B] text-[23px] font-semibold! text-[#D9E2EB]! sm:h-18 sm:w-18">
                                    {photo && failedPhoto !== photo ? (
                                        <img
                                            src={photo}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            onError={() =>
                                                setFailedPhoto(photo)
                                            }
                                        />
                                    ) : (
                                        name.trim().charAt(0).toUpperCase() ||
                                        'V'
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="mb-1 text-[10px] font-semibold! uppercase tracking-[0.12em] text-[#8292A4]!">
                                        Volunteer member
                                    </p>
                                    <h2 className="wrap-break-word text-[21px] font-semibold! tracking-tight text-[#E9EEF4]! sm:text-[25px]">
                                        {name}
                                    </h2>
                                    <p className="mt-1.5 flex min-w-0 items-center gap-2 break-all text-[12px] text-[#9BA8B8]! sm:text-[13px]">
                                        <Mail size={14} className="shrink-0" />{' '}
                                        {email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                <StatusBadge
                                    status={volunteer.status || 'inactive'}
                                />
                                <span className="inline-flex min-h-8 items-center gap-2 border border-[#35404E] bg-[#1A222D] px-3 text-[12px] text-[#B5C0CD]!">
                                    {availability === 'Available' ? (
                                        <CheckCircle2
                                            size={14}
                                            className="text-[#8DB8A4]"
                                        />
                                    ) : (
                                        <CircleAlert
                                            size={14}
                                            className="text-[#94A1B1]"
                                        />
                                    )}
                                    {availability}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* PROFILE & MEMBERSHIP */}
                    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)]">
                        <section className="min-w-0 border border-[#29323E] bg-[#0E1219] px-5 py-5 sm:px-7 sm:py-6">
                            <SectionTitle
                                icon={UserRound}
                                title="Personal information"
                            />
                            <div className="mt-3 grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                                <Field
                                    icon={UserRound}
                                    label="Full name"
                                    value={name}
                                />
                                <Field
                                    icon={Mail}
                                    label="Email address"
                                    value={email}
                                />
                                <Field
                                    icon={Phone}
                                    label="Phone number"
                                    value={volunteer.phone || user.phone}
                                />
                                <Field
                                    icon={MapPin}
                                    label="District"
                                    value={volunteer.district || user.district}
                                />
                                <Field
                                    icon={MapPin}
                                    label="Address"
                                    value={volunteer.address || user.address}
                                    wide
                                />
                            </div>
                            <div className="mt-3 border-t border-[#29323E] pt-5">
                                <div className="flex items-center gap-2.5">
                                    <BriefcaseBusiness
                                        size={16}
                                        strokeWidth={1.7}
                                        className="text-[#93A3B5]"
                                    />
                                    <h3 className="text-[14px] font-semibold! text-[#DCE4ED]!">
                                        Skills & capabilities
                                    </h3>
                                </div>
                                {skills.length ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="border border-[#35404E] bg-[#1A222D] px-3 py-1.5 text-[12px] text-[#C9D3DF]!"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-3 text-[13px] text-[#91A0B1]!">
                                        No skills have been added.
                                    </p>
                                )}
                            </div>
                        </section>
                        <aside className="min-w-0 border border-[#29323E] bg-[#0E1219] px-5 py-5 sm:px-6 sm:py-6">
                            <SectionTitle
                                icon={ShieldCheck}
                                title="Membership"
                            />
                            <div className="divide-y divide-[#27313D]">
                                <div className="flex items-center justify-between gap-3 py-4">
                                    <span className="text-[12px] text-[#92A0B0]!">
                                        Member status
                                    </span>
                                    <StatusBadge
                                        status={volunteer.status || 'inactive'}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-3 py-4">
                                    <span className="text-[12px] text-[#92A0B0]!">
                                        Availability
                                    </span>
                                    <span className="text-right text-[12px] font-medium! text-[#D7E0EA]!">
                                        {availability}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-4">
                                    <span className="text-[12px] text-[#92A0B0]!">
                                        Joined
                                    </span>
                                    <span className="text-right text-[12px] font-medium! text-[#D7E0EA]!">
                                        {formatDate(volunteer.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-4">
                                    <span className="text-[12px] text-[#92A0B0]!">
                                        Last updated
                                    </span>
                                    <span className="text-right text-[12px] font-medium! text-[#D7E0EA]!">
                                        {formatDate(volunteer.updated_at)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 pt-4">
                                    <span className="text-[12px] text-[#92A0B0]!">
                                        Campaigns
                                    </span>
                                    <span className="text-[17px] font-semibold! tabular-nums text-[#E7EDF4]!">
                                        {details.assignments.length}
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* CAMPAIGN HISTORY — SAME DIRECTORY / FILTER SIDEBAR STRUCTURE AS USERS */}
                    <section className="min-w-0 mt-12">
                        <div className="my-6 flex flex-wrap items-end justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="font-sans! text-[20px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                                    Campaign history
                                </h2>
                                <p className="mt-1.5 text-[12px] text-[#8792A1]">
                                    Campaign assignments and participation
                                    status.
                                </p>
                            </div>
                            <span className="text-[12px] text-[#96A4B4]!">
                                {campaignRows.length}{' '}
                                {campaignRows.length === 1
                                    ? 'assignment'
                                    : 'assignments'}
                            </span>
                        </div>

                        <div
                            className={`grid min-w-0 gap-5 ${campaignRows.length > 0 ? 'xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_300px]' : ''} xl:items-start`}
                        >
                            <div className="flex min-w-0 flex-col overflow-hidden border border-[#29323E] bg-[#0E1219]">
                                {campaignRows.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-3 border-b border-[#29323E] bg-[#1A222D] px-4 py-3 sm:flex-nowrap sm:px-5">
                                        <div className="min-w-0 flex-1">
                                            <DashboardInput
                                                type="search"
                                                variant="default"
                                                leftIcon={Search}
                                                value={campaignSearch}
                                                onChange={(event) => {
                                                    setCampaignSearch(
                                                        event.target.value,
                                                    );
                                                    setCampaignPage(1);
                                                }}
                                                placeholder="Search campaigns, type, category or organization"
                                                aria-label="Search campaign history"
                                                className="h-10! border-[#303A47]! bg-[#0E1219]! text-[12px]! focus:border-[#4B596A]! focus:ring-0!"
                                            />
                                        </div>
                                        <span className="shrink-0 border-l border-[#35404E] pl-3 text-[11px] tabular-nums text-[#A8B5C4]!">
                                            {filteredCampaignRows.length}{' '}
                                            results
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMobileCampaignFiltersOpen(
                                                    (open) => !open,
                                                )
                                            }
                                            className="inline-flex h-10 items-center gap-2 border border-[#35404E] px-3 text-[12px] text-[#B9C5D2] xl:hidden"
                                        >
                                            <SlidersHorizontal size={14} />{' '}
                                            Filters
                                        </button>
                                    </div>
                                )}
                                {campaignRows.length > 0 &&
                                    mobileCampaignFiltersOpen && (
                                        <div className="border-b border-[#29323E] xl:hidden">
                                            <CampaignFilters
                                                campaignFiltersActive={
                                                    campaignFiltersActive
                                                }
                                                resetCampaignFilters={
                                                    resetCampaignFilters
                                                }
                                                campaignStatusFilter={
                                                    campaignStatusFilter
                                                }
                                                campaignTypeFilter={
                                                    campaignTypeFilter
                                                }
                                                campaignCategoryFilter={
                                                    campaignCategoryFilter
                                                }
                                                campaignOrganizationFilter={
                                                    campaignOrganizationFilter
                                                }
                                                campaignRows={campaignRows}
                                                campaignTypes={campaignTypes}
                                                campaignCategories={
                                                    campaignCategories
                                                }
                                                campaignOrganizations={
                                                    campaignOrganizations
                                                }
                                                setCampaignStatusFilter={
                                                    setCampaignStatusFilter
                                                }
                                                setCampaignTypeFilter={
                                                    setCampaignTypeFilter
                                                }
                                                setCampaignCategoryFilter={
                                                    setCampaignCategoryFilter
                                                }
                                                setCampaignOrganizationFilter={
                                                    setCampaignOrganizationFilter
                                                }
                                                setCampaignPage={
                                                    setCampaignPage
                                                }
                                            />
                                        </div>
                                    )}
                                {campaignRows.length === 0 ? (
                                    <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
                                        <FileText
                                            size={19}
                                            strokeWidth={1.5}
                                            className="text-[#728094]"
                                        />
                                        <p className="text-[13px] font-medium text-[#D5DEE9]">
                                            No campaign assignments yet
                                        </p>
                                        <p className="text-[12px] text-[#8792A1]">
                                            This volunteer has not been assigned
                                            to a campaign.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="min-w-0">
                                        <DataTable
                                            columns={campaignColumns}
                                            onSort={toggleCampaignSort}
                                            getSortIcon={(key) =>
                                                campaignSort.key === key
                                                    ? campaignSort.direction ===
                                                      'asc'
                                                        ? '↑'
                                                        : '↓'
                                                    : '↕'
                                            }
                                            rows={displayCampaignRows}
                                            resultCount={
                                                filteredCampaignRows.length
                                            }
                                            resizableColumns
                                            empty={{
                                                icon: FileText,
                                                title: 'No campaigns found',
                                                message:
                                                    'Try adjusting the search or filters.',
                                            }}
                                        />
                                    </div>
                                )}
                                {campaignRows.length > 0 && (
                                    <div className="mt-auto border-t border-[#29323E]">
                                        <UsersPagination
                                            currentPage={currentCampaignPage}
                                            totalPages={campaignTotalPages}
                                            totalItems={
                                                filteredCampaignRows.length
                                            }
                                            itemsPerPage={campaignPageSize}
                                            onPageChange={setCampaignPage}
                                        />
                                    </div>
                                )}
                            </div>
                            {campaignRows.length > 0 && (
                                <aside className="hidden min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219] xl:block">
                                    <CampaignFilters
                                        campaignFiltersActive={
                                            campaignFiltersActive
                                        }
                                        resetCampaignFilters={
                                            resetCampaignFilters
                                        }
                                        campaignStatusFilter={
                                            campaignStatusFilter
                                        }
                                        campaignTypeFilter={campaignTypeFilter}
                                        campaignCategoryFilter={
                                            campaignCategoryFilter
                                        }
                                        campaignOrganizationFilter={
                                            campaignOrganizationFilter
                                        }
                                        campaignRows={campaignRows}
                                        campaignTypes={campaignTypes}
                                        campaignCategories={campaignCategories}
                                        campaignOrganizations={
                                            campaignOrganizations
                                        }
                                        setCampaignStatusFilter={
                                            setCampaignStatusFilter
                                        }
                                        setCampaignTypeFilter={
                                            setCampaignTypeFilter
                                        }
                                        setCampaignCategoryFilter={
                                            setCampaignCategoryFilter
                                        }
                                        setCampaignOrganizationFilter={
                                            setCampaignOrganizationFilter
                                        }
                                        setCampaignPage={setCampaignPage}
                                    />
                                </aside>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

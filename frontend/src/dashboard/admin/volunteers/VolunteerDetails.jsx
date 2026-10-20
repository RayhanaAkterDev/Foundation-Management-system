import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Mail,
    MapPin,
    Phone,
    BriefcaseBusiness,
    UserRound,
    Activity,
    FileText,
    RefreshCw,
} from 'lucide-react';

import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import StatusBadge from '@/components/dashboard/StatusBadge';
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
    if (!response || typeof response !== 'object')
        return { volunteer: null, assignments: [] };
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

const Detail = ({ icon: Icon, label, children }) => (
    <div className="min-w-0 border-b border-[#222B36] py-4 last:border-b-0 sm:py-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#788698]">
            <Icon size={14} strokeWidth={1.7} /> {label}
        </div>
        <div className="wrap-break-word text-[14px] font-medium text-[#DCE2EA]">
            {children || '—'}
        </div>
    </div>
);

const SectionHeading = ({ eyebrow, title, aside }) => (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#29323E] pb-4">
        <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8290A1]">
                {eyebrow}
            </p>
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#E6EBF1]">
                {title}
            </h2>
        </div>
        {aside}
    </div>
);

export default function VolunteerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState({
        volunteer: null,
        assignments: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                if (!id) throw new Error('Volunteer ID is missing.');
                const response = await fetchVolunteerDetails(id);
                if (!cancelled) setDetails(normalizeResponse(response));
            } catch (err) {
                if (!cancelled)
                    setError(
                        err?.message || 'Unable to load volunteer information.',
                    );
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const volunteer = details.volunteer;
    const user = volunteer?.user || {};
    const name = user.name || volunteer?.name || 'Unnamed volunteer';
    const email = user.email || volunteer?.email || 'No email address';
    const photo = user.photo || volunteer?.photo;
    const [failedPhoto, setFailedPhoto] = useState(null);
    const availability = availabilityLabel(
        volunteer?.availability ?? user.availability,
    );
    const rawSkills = volunteer?.skills;
    const skills = Array.isArray(rawSkills)
        ? rawSkills
        : typeof rawSkills === 'string'
          ? rawSkills
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean)
          : [];

    return (
        <div className="min-w-0 space-y-8 pb-10 font-sans lg:space-y-10">
            <header className="border-b border-[#29323E] pb-6 sm:pb-8">
                <button
                    type="button"
                    onClick={() => navigate('/admin/dashboard/volunteers')}
                    className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#94A0AE] transition-colors hover:text-[#EEF1F5]"
                >
                    <ArrowLeft size={15} /> All Volunteers
                </button>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-[32px] leading-tight tracking-[-0.035em] text-[#EEF1F5] sm:text-[42px]">
                            Volunteer Details
                        </h1>
                        <p className="mt-2 text-[13px] text-[#97A3B2]">
                            Profile information and campaign participation
                            history.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setReloadKey((v) => v + 1)}
                        disabled={loading}
                        className="inline-flex h-9 items-center gap-2 border border-[#343E4B] px-3 text-[12px] font-medium text-[#BAC4D0] hover:bg-[#1A222D] disabled:opacity-50"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </header>

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
                <div className="border border-[#29323E] bg-[#0E1219] px-6 py-12 text-center text-[#9AA6B5]">
                    Volunteer information is unavailable.
                </div>
            ) : (
                <>
                    <section className="border border-[#29323E] bg-[#0E1219]">
                        <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-[#394454] bg-[#1C2632] text-[19px] font-semibold text-[#D8E0E9] sm:h-16 sm:w-16">
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
                                    <h2 className="wrap-break-word text-[19px] font-semibold text-[#E6EBF1] sm:text-[22px]">
                                        {name}
                                    </h2>
                                    <p className="mt-1 flex min-w-0 items-center gap-2 break-all text-[12px] text-[#93A0B0]">
                                        <Mail size={14} className="shrink-0" />{' '}
                                        {email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge
                                    status={volunteer.status || 'inactive'}
                                />
                                <span className="inline-flex items-center gap-2 border border-[#29323E] bg-[#151C25] px-3 py-1.5 text-[12px] text-[#AAB6C5]">
                                    {availability === 'Available' ? (
                                        <CheckCircle2
                                            size={14}
                                            className="text-[#8EC5A3]"
                                        />
                                    ) : (
                                        <CircleAlert size={14} />
                                    )}
                                    {availability}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="min-w-0 border border-[#29323E] bg-[#0E1219] p-5 sm:p-7">
                        <SectionHeading
                            eyebrow="Profile"
                            title="Basic Information"
                        />
                        <div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">
                            <Detail icon={UserRound} label="Full Name">
                                {name}
                            </Detail>
                            <Detail icon={Mail} label="Email">
                                {email}
                            </Detail>
                            <Detail icon={Phone} label="Phone">
                                {volunteer.phone || user.phone}
                            </Detail>
                            <Detail icon={MapPin} label="District">
                                {volunteer.district || user.district}
                            </Detail>
                            <Detail icon={MapPin} label="Address">
                                {volunteer.address || user.address}
                            </Detail>
                            <Detail icon={CalendarDays} label="Joined">
                                {formatDate(volunteer.created_at)}
                            </Detail>
                        </div>
                    </section>

                    <section className="min-w-0 border border-[#29323E] bg-[#0E1219] p-5 sm:p-7">
                        <SectionHeading eyebrow="Capabilities" title="Skills" />
                        {skills.length ? (
                            <div className="flex flex-wrap gap-2 pt-5">
                                {skills.map((skill, index) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className="inline-flex items-center gap-2 border border-[#303B48] bg-[#151C25] px-3 py-2 text-[12px] text-[#C8D1DC]"
                                    >
                                        <BriefcaseBusiness
                                            size={14}
                                            className="text-[#8494A6]"
                                        />{' '}
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="pt-5 text-[13px] text-[#8792A1]">
                                No skills have been added.
                            </p>
                        )}
                    </section>

                    <section className="min-w-0 border border-[#29323E] bg-[#0E1219] p-5 sm:p-7">
                        <SectionHeading
                            eyebrow="Activity"
                            title="Campaign History"
                            aside={
                                <span className="text-[12px] text-[#8792A1]">
                                    {details.assignments.length}{' '}
                                    {details.assignments.length === 1
                                        ? 'assignment'
                                        : 'assignments'}
                                </span>
                            }
                        />
                        {!details.assignments.length ? (
                            <div className="py-12 text-center">
                                <Activity
                                    size={23}
                                    className="mx-auto text-[#687789]"
                                />
                                <p className="mt-3 text-[14px] font-medium text-[#D6DEE8]">
                                    No campaign history
                                </p>
                                <p className="mt-1 text-[12px] text-[#8792A1]">
                                    This volunteer has not been assigned to a
                                    campaign yet.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 overflow-hidden border border-[#29323E]">
                                <div className="hidden grid-cols-[minmax(0,1fr)_150px_140px_120px] gap-4 border-b border-[#29323E] bg-[#1A222D] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8290A1] md:grid">
                                    <span>Campaign</span>
                                    <span>Assigned</span>
                                    <span>Status</span>
                                    <span className="text-right">Action</span>
                                </div>
                                {details.assignments.map(
                                    (assignment, index) => {
                                        const campaignId =
                                            getCampaignId(assignment);
                                        const assigned =
                                            assignment.assigned_at ||
                                            assignment.created_at;
                                        return (
                                            <div
                                                key={
                                                    assignment.id ??
                                                    `${campaignId ?? 'unknown'}-${index}`
                                                }
                                                className="grid gap-3 border-b border-[#252D38] px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_150px_140px_120px] md:items-center md:gap-4"
                                            >
                                                <div className="min-w-0">
                                                    <p className="flex items-start gap-2 wrap-break-word text-[13px] font-semibold text-[#DEE5ED]">
                                                        <FileText
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#8998AA]"
                                                        />{' '}
                                                        {getCampaignTitle(
                                                            assignment,
                                                        )}
                                                    </p>
                                                    {campaignId != null && (
                                                        <p className="mt-1 pl-5.75 text-[11px] text-[#788698]">
                                                            Campaign #
                                                            {campaignId}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-[12px] text-[#B3BECA]">
                                                    <span className="mr-2 text-[#788698] md:hidden">
                                                        Assigned:
                                                    </span>
                                                    {formatDate(assigned)}
                                                </div>
                                                <div>
                                                    <StatusBadge
                                                        status={
                                                            assignment.status ||
                                                            'unknown'
                                                        }
                                                    />
                                                </div>
                                                <div className="md:text-right">
                                                    {campaignId != null ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/dashboard/campaigns/${encodeURIComponent(campaignId)}`,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 border border-[#35404E] px-2.5 py-2 text-[11px] font-medium text-[#C4CED9] hover:bg-[#1A222D] hover:text-white"
                                                        >
                                                            View{' '}
                                                            <ArrowUpRight
                                                                size={13}
                                                            />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] text-[#697586]">
                                                            Unavailable
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4 border-t border-[#29323E] pt-6 sm:grid-cols-3">
                        <Detail icon={CheckCircle2} label="Volunteer Status">
                            {String(volunteer.status || 'unknown').replaceAll(
                                '_',
                                ' ',
                            )}
                        </Detail>
                        <Detail icon={CircleAlert} label="Availability">
                            {availability}
                        </Detail>
                        <Detail icon={Clock3} label="Last Updated">
                            {formatDate(volunteer.updated_at)}
                        </Detail>
                    </section>
                </>
            )}
        </div>
    );
}

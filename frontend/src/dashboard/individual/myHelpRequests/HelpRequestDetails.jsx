import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Pencil,
    CalendarDays,
    MapPin,
    FileText,
    ClipboardList, Building2, Clock3,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import { getMyHelpRequests } from './api/helpRequestAPI';
import {
    normalizeHelpRequests,
    getAssignmentInfo,
    getStatusLabel,
    getUrgencyLabel,
} from './utils/helpRequestUtils';

const BASE = '/individual/dashboard/help-requests';
const formatDate = (value) =>
    value && !Number.isNaN(new Date(value).getTime())
        ? new Date(value).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : '—';
const Info = ({ label, value }) => (
    <div className="grid gap-1 border-b border-[#303A47] py-3 sm:grid-cols-1">
        <dt className="text-[12px] text-[#A0ADBD]">{label}</dt>
        <dd className="min-w-0 break-words text-[13px] font-medium text-[#EEF1F5]">
            {value || '—'}
        </dd>
    </div>
);

export default function HelpRequestDetails() {
    const params = useParams();
    const id =
        params.id ??
        params.requestId ??
        params.helpRequestId ??
        params.help_request_id;
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                setError('');
                const response = await getMyHelpRequests();
                const items = normalizeHelpRequests(
                    response?.help_requests ||
                        response?.helpRequests ||
                        response?.data ||
                        [],
                );
                if (active)
                    setRequest(
                        items.find((item) => String(item.id) === String(id)) ||
                            null,
                    );
            } catch (err) {
                if (active)
                    setError(err?.message || 'Unable to load this request.');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => {
            active = false;
        };
    }, [id]);
    const assignment = request
        ? getAssignmentInfo(request)?.currentAssignment
        : null;
    const organization = assignment?.organization;
    const organizationName =
        organization?.name ||
        organization?.organization_name ||
        request?.organization?.name ||
        'Not assigned';
    const back = () => navigate(BASE);
    const header = (
        <PageHeader
            title="Help Request Details"
            subtitle="Review your submitted request and its current progress."
            action={
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={back}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-[12px] text-[#DCE3EC] hover:bg-[#1A222D]"
                    >
                        <ArrowLeft size={15} /> Back to requests
                    </button>

                </div>
            }
        />
    );
    if (loading || error || !request)
        return (
            <div className="space-y-8">
                {header}
                {loading ? (
                    <LoadingUI
                        variant="page"
                        title="Loading request details..."
                    />
                ) : (
                    <LoadingError
                        title={
                            error
                                ? 'Unable to load request'
                                : 'Request not found'
                        }
                        message={
                            error ||
                            'This request was not found among your submissions.'
                        }
                    />
                )}
            </div>
        );
    const assignments = Array.isArray(request.assignments) ? request.assignments : [];
    const statusTone = {
        pending: 'border-[#51412A] bg-[#292116] text-[#D9B77D]',
        verified: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
        completed: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
        rejected: 'border-[#57343D] bg-[#2C1D23] text-[#D9A0A8]',
        in_progress: 'border-[#45415C] bg-[#252339] text-[#C4BCE7]',
    };
    const pill = statusTone[request.status] || 'border-[#394656] bg-[#263343] text-[#C8D2DF]';
    const sectionHeader = (Icon, title, subtitle) => (
        <div className="flex items-center gap-3 border-b border-[#303A47] bg-[#202A36] px-5 py-4 sm:px-6">
            <span className="flex size-9 shrink-0 items-center justify-center border border-[#354456] bg-[#293747] text-[#B9C8D9]"><Icon size={17}/></span>
            <div className="min-w-0"><h3 className="text-[14px] font-semibold! text-[#EEF1F5]!">{title}</h3>
                {subtitle && <p className="mt-1 text-[12px] text-[#A0ADBD]">{subtitle}</p>}</div>
        </div>
    );
    return (
        <div className="space-y-6 lg:space-y-7">
            {header}
            <section className="flex flex-col gap-5 border border-[#303A47] bg-[#1A212B] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <span className="hidden size-12 shrink-0 items-center justify-center border border-[#394758] bg-[#263343] text-[#B7C7D8] sm:flex"><FileText size={22}/></span>
                    <div className="min-w-0">
                        <p className="mb-2 text-[12px] text-[#A0ADBD]">Help request #{request.id}</p>
                        <h2 className="break-words text-[20px] font-semibold! leading-snug text-[#EEF1F5]! sm:text-[24px]">{request.title}</h2>
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#AAB7C7]">
                            <span className="inline-flex items-center gap-2"><MapPin size={14}/>{request.district || 'Location unavailable'}</span>
                            <span className="inline-flex items-center gap-2"><CalendarDays size={14}/>{formatDate(request.created_at)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className={`inline-flex items-center gap-2 border px-3 py-2 text-[12px] font-semibold ${pill}`}><span className="size-1.5 rounded-full bg-current"/>{getStatusLabel(request.status)}</span>
                    {request.status === 'pending' && <button type="button" onClick={() => navigate(`${BASE}/${id}/edit`)} className="inline-flex h-9 items-center gap-2 border border-[#46566A] bg-[#263343] px-3 text-[12px] font-medium text-[#EEF1F5] hover:bg-[#304155]"><Pencil size={14}/> Edit request</button>}
                </div>
            </section>
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
                <main className="min-w-0 space-y-5">
                    <section className="border border-[#303A47] bg-[#1A212B]">
                        {sectionHeader(FileText, 'About this request', 'Request details and assistance requirements')}
                        <div className="px-5 py-5 sm:px-6 sm:py-6">
                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-[#D2DAE4]">{request.description || 'No description provided.'}</p>
                            <div className="mt-6 border-t border-[#303A47] pt-5">
                                <h4 className="mb-3 text-[13px] font-semibold! text-[#EEF1F5]!">Request information</h4>
                                <dl className="grid gap-x-8 sm:grid-cols-2">
                                    <Info label="Category" value={request.category}/>
                                    <Info label="Urgency" value={getUrgencyLabel(request.urgency)}/>
                                    <Info label="District" value={request.district}/>
                                    <Info label="Request ID" value={String(request.id)}/>
                                    <Info label="Address" value={request.address}/>
                                </dl>
                            </div>
                        </div>
                    </section>
                    {assignments.length > 0 && <section className="border border-[#303A47] bg-[#1A212B]">
                        {sectionHeader(Building2, 'Assignment history', 'Organizations connected to this request')}
                        <div className="divide-y divide-[#303A47]">
                            {assignments.map((item, index) => <div key={item.id ?? index} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                                <div className="min-w-0"><p className="break-words text-[13px] font-semibold! text-[#EEF1F5]!">{item.organization?.name || item.organization?.organization_name || 'Organization'}</p><p className="mt-1 text-[12px] text-[#A0ADBD]">{formatDate(item.created_at)}{item.id ? ` · Assignment #${item.id}` : ''}</p></div>
                                <span className="border border-[#394758] bg-[#263343] px-2.5 py-1 text-[11px] capitalize text-[#C8D2DF]">{String(item.status || 'Pending').replaceAll('_',' ')}</span>
                            </div>)}
                        </div>
                    </section>}
                </main>
                <aside className="min-w-0 space-y-5">
                    <section className="border border-[#303A47] bg-[#1A212B]">
                        {sectionHeader(ClipboardList, 'Request overview', 'Current request classification')}
                        <dl className="px-5 py-2">
                            <Info label="Status" value={getStatusLabel(request.status)}/>
                            <Info label="Category" value={request.category}/>
                            <Info label="Urgency" value={getUrgencyLabel(request.urgency)}/>
                            <Info label="Assigned organization" value={organizationName}/>
                        </dl>
                    </section>
                    <section className="border border-[#303A47] bg-[#1A212B]">
                        {sectionHeader(Clock3, 'Record history', 'Submission and last modification')}
                        <div className="space-y-5 px-5 py-5">
                            <div><p className="text-[12px] text-[#A0ADBD]">Submitted</p><p className="mt-1 text-[13px] text-[#EEF1F5]">{formatDate(request.created_at)}</p></div>
                            <div><p className="text-[12px] text-[#A0ADBD]">Last updated</p><p className="mt-1 text-[13px] text-[#EEF1F5]">{formatDate(request.updated_at)}</p></div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

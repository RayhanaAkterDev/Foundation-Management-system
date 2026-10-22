import { useEffect, useId, useState } from 'react';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    ClipboardList,
    FileText,
    MapPin,
    Pencil,
    Save,
    UserRound,
    X,
    XCircle,
} from 'lucide-react';

const CATEGORIES = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Clothing',
    'Clean Water',
    'Other',
];

const PRIORITIES = ['low', 'normal', 'high', 'critical', 'urgent'];

const formatLabel = (value) =>
    String(value || 'Unknown')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getAssignmentStatus = (request) =>
    String(
        request?.assignmentStatus ??
            request?.rawAssignment?.status ??
            request?.status ??
            '',
    ).toLowerCase();

const getRequestStatus = (request) =>
    String(
        request?.helpRequestStatus ??
            request?.rawHelpRequest?.status ??
            request?.status ??
            '',
    ).toLowerCase();

const isProgressStatus = (status) =>
    ['active', 'in_progress', 'in-progress'].includes(status);

const isRejected = (status) =>
    ['rejected', 'declined', 'cancelled', 'canceled'].includes(status);

const getStage = (request) => {
    const assignment = getAssignmentStatus(request);
    const status = getRequestStatus(request);

    if (isRejected(assignment)) return 'rejected';

    if (['completed', 'resolved'].includes(status)) {
        return 'completed';
    }

    if (isProgressStatus(status)) {
        return 'active';
    }

    if (assignment === 'accepted') {
        return 'accepted';
    }

    return 'assigned';
};

const buttonBase =
    'inline-flex min-h-10 items-center justify-center gap-2 border px-4 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButton = `${buttonBase} border-[#35404D] bg-[#151C25] text-[#C4CDD8] hover:bg-[#222D39] hover:text-white`;

const primaryButton = `${buttonBase} border-[#52677E] bg-[#304257] text-[#EEF1F5] hover:bg-[#3A526C]`;

const selectClass =
    'h-11 w-full border border-[#35404D] bg-[#10161F] px-3 text-[13px] text-[#EEF1F5] outline-none focus:border-[#829AB5]';

function StatusBadge({ status }) {
    const value = String(status || '').toLowerCase();

    const colors = isRejected(value)
        ? 'border-[#65404A] bg-[#322229] text-[#E7ABB5]'
        : ['completed', 'resolved', 'verified'].includes(value)
          ? 'border-[#315A4E] bg-[#1B332D] text-[#90D3B7]'
          : ['accepted', 'active', 'in_progress'].includes(value)
            ? 'border-[#40546C] bg-[#213044] text-[#BDD2EA]'
            : 'border-[#604B30] bg-[#30271D] text-[#E4C18B]';

    return (
        <span
            className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-medium ${colors}`}
        >
            {formatLabel(status)}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const value = String(priority || 'normal').toLowerCase();

    const colors = ['urgent', 'critical'].includes(value)
        ? 'border-[#70434B] bg-[#332229] text-[#E7A7B1]'
        : value === 'high'
          ? 'border-[#604B30] bg-[#30271D] text-[#E4C18B]'
          : value === 'low'
            ? 'border-[#354B44] bg-[#1B2B26] text-[#A8C9B4]'
            : 'border-[#3B4655] bg-[#222B36] text-[#B9C4D1]';

    return (
        <span
            className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-medium ${colors}`}
        >
            {formatLabel(priority || 'normal')} priority
        </span>
    );
}

function SectionTitle({ icon: Icon, children, action }) {
    return (
        <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="flex min-w-0 items-center gap-2.5 text-[14px] font-semibold text-[#EEF1F5]!">
                <Icon
                    size={17}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#9FB1C6]"
                />
                {children}
            </h3>

            {action}
        </div>
    );
}

function InformationRow({ label, children }) {
    return (
        <div className="grid grid-cols-[125px_minmax(0,1fr)] items-center gap-5 border-b border-[#2B3542] py-4.5 last:border-b-0 sm:grid-cols-[175px_minmax(0,1fr)] sm:gap-6 sm:py-5">
            <dt className="text-[13px] leading-6 text-[#91A0B2]">{label}</dt>

            <dd className="min-w-0 wrap-break-word text-[13px] font-medium leading-6 text-[#E6EDF5]">
                {children === undefined || children === null || children === ''
                    ? 'Not provided'
                    : children}
            </dd>
        </div>
    );
}

const WORKFLOW = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'active', label: 'In progress' },
    { key: 'completed', label: 'Completed' },
];

function SupportWorkflow({ request }) {
    const stage = getStage(request);
    const currentIndex = WORKFLOW.findIndex((item) => item.key === stage);

    const messages = {
        assigned: 'Awaiting a response from your organization.',
        accepted: 'The assignment has been accepted.',
        active: 'Your organization is providing support.',
        completed: 'Support has been completed.',
    };

    return (
        <section className="border-t border-[#303A47] pt-7 sm:pt-8">
            <SectionTitle icon={Activity}>Support progress</SectionTitle>

            {stage === 'rejected' ? (
                <div className="flex items-start gap-3 border-l-2 border-[#A56B75] bg-[#261D24] px-4 py-4">
                    <XCircle
                        size={19}
                        className="mt-0.5 shrink-0 text-[#DFA7B0]"
                    />

                    <div>
                        <p className="text-[13px] font-semibold text-[#F0D6DA]">
                            Assignment declined
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[#C9A7AD]">
                            This organization is not actively handling the
                            request.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="border border-[#303A47] bg-[#121923]">
                    <div className="flex items-start gap-3 border-b border-[#303A47] px-4 py-4 sm:px-5 sm:py-5">
                        <span className="flex size-9 shrink-0 items-center justify-center border border-[#40556D] bg-[#26374B] text-[#B9CEE5]">
                            {stage === 'completed' ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Activity size={18} />
                            )}
                        </span>

                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#EEF1F5]">
                                {formatLabel(
                                    stage === 'active' ? 'In progress' : stage,
                                )}
                            </p>

                            <p className="mt-1.5 text-[12px] leading-5 text-[#9DADBF]">
                                {messages[stage]}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 px-3 py-6 sm:px-5 sm:py-7">
                        {WORKFLOW.map((item, index) => {
                            const complete = index < currentIndex;
                            const current = index === currentIndex;

                            return (
                                <div
                                    key={item.key}
                                    className="relative min-w-0 text-center"
                                    aria-current={current ? 'step' : undefined}
                                >
                                    {index > 0 && (
                                        <div
                                            className={`absolute right-1/2 top-3.75 h-px w-full ${
                                                index <= currentIndex
                                                    ? 'bg-[#7089A4]'
                                                    : 'bg-[#344150]'
                                            }`}
                                        />
                                    )}

                                    <span
                                        className={`relative z-10 mx-auto flex size-7.75 items-center justify-center rounded-full border text-[11px] font-semibold ${
                                            complete
                                                ? 'border-[#637F9A] bg-[#304559] text-[#D8E5F2]'
                                                : current
                                                  ? 'border-[#91ABC7] bg-[#3A5571] text-white'
                                                  : 'border-[#3A4655] bg-[#151C25] text-[#78889B]'
                                        }`}
                                    >
                                        {complete ? (
                                            <Check size={15} />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>

                                    <p
                                        className={`mt-2.5 px-0.5 text-[11px] leading-4 ${
                                            current
                                                ? 'font-semibold text-[#EEF1F5]'
                                                : complete
                                                  ? 'text-[#B9C7D7]'
                                                  : 'text-[#78889B]'
                                        }`}
                                    >
                                        {item.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

function EditCasePanel({
    request,
    onUpdateAssignment,
    actionLoading,
    onCancel,
}) {
    const [category, setCategory] = useState(request.category || '');
    const [urgency, setUrgency] = useState(request.urgency || 'normal');
    const [error, setError] = useState('');

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');

        if (!request.assignmentId) {
            setError('Assignment information is missing.');
            return;
        }

        if (!category.trim()) {
            setError('Please select a category.');
            return;
        }

        if (!onUpdateAssignment) {
            setError('The update action is unavailable.');
            return;
        }

        try {
            const success = await onUpdateAssignment(request.assignmentId, {
                category: category.trim(),
                urgency,
            });

            if (success) {
                onCancel();
            } else {
                setError('Unable to update this case.');
            }
        } catch (err) {
            setError(err?.message || 'Unable to update this case.');
        }
    };

    return (
        <form
            onSubmit={handleSave}
            className="space-y-5 border border-[#303A47] bg-[#151C25] p-4 sm:p-5"
        >
            <div>
                <label
                    htmlFor="case-category"
                    className="mb-2 block text-[13px] font-medium text-[#C2CDDA]"
                >
                    Category
                </label>

                <select
                    id="case-category"
                    className={selectClass}
                    value={category}
                    disabled={actionLoading}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="">Select category</option>

                    {category && !CATEGORIES.includes(category) && (
                        <option value={category}>{category}</option>
                    )}

                    {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="case-priority"
                    className="mb-2 block text-[13px] font-medium text-[#C2CDDA]"
                >
                    Priority
                </label>

                <select
                    id="case-priority"
                    className={selectClass}
                    value={urgency}
                    disabled={actionLoading}
                    onChange={(event) => setUrgency(event.target.value)}
                >
                    {PRIORITIES.map((item) => (
                        <option key={item} value={item}>
                            {formatLabel(item)}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p
                    role="alert"
                    className="flex gap-2 border border-[#69404A] bg-[#302027] px-3 py-3 text-[12px] leading-5 text-[#DFA7B0]"
                >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    className={secondaryButton}
                    disabled={actionLoading}
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={primaryButton}
                    disabled={actionLoading}
                >
                    <Save size={15} />
                    {actionLoading ? 'Saving...' : 'Save changes'}
                </button>
            </div>
        </form>
    );
}

export default function CaseReviewDrawer({
    request,
    onClose,
    onAction,
    onStartSupport,
    actionLoading = false,
    onUpdateAssignment,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const titleId = useId();

    useEffect(() => {
        if (!request) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !actionLoading) {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [request, actionLoading, onClose]);

    if (!request) return null;

    const assignment = getAssignmentStatus(request);
    const lifecycle = getRequestStatus(request);

    const rejected = isRejected(assignment);
    const pending = assignment === 'pending';

    const canEdit =
        !rejected &&
        (['accepted', 'assigned'].includes(assignment) ||
            isProgressStatus(lifecycle));

    const canStartSupport =
        !rejected &&
        ['accepted', 'assigned'].includes(assignment) &&
        lifecycle === 'verified';

    const requesterName =
        request.requesterName ||
        request.requester?.name ||
        request.individual ||
        'Unknown requester';

    const location =
        request.address ||
        request.requesterAddress ||
        request.district ||
        'Location not provided';

    const displayStatus = assignment || lifecycle;

    const close = () => {
        if (actionLoading) return;

        setIsEditing(false);
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 font-sans">
            <button
                type="button"
                aria-label="Close case review"
                onClick={close}
                disabled={actionLoading}
                className="absolute inset-0 bg-[#05080D]/75 backdrop-blur-[2px]"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="absolute inset-y-0 right-0 flex w-full max-w-160 flex-col overflow-hidden border-l border-[#303A47] bg-[#0E1219] shadow-[-20px_0_65px_rgba(0,0,0,0.45)]"
            >
                {/* Drawer header */}
                <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#303A47] bg-[#151C25] px-5 py-4 sm:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center border border-[#354354] bg-[#202C39] text-[#B6C6D7]">
                            <BriefcaseBusiness size={18} />
                        </span>

                        <div>
                            <h2
                                id={titleId}
                                className="text-[15px] font-semibold text-[#EEF1F5]!"
                            >
                                Case review
                            </h2>

                            <p className="mt-1 font-mono text-[11px] text-[#91A0B2]">
                                #{request.id ?? request.assignmentId ?? '—'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Close drawer"
                        onClick={close}
                        disabled={actionLoading}
                        className="flex size-9 items-center justify-center text-[#9BAABD] transition-colors hover:bg-[#26313D] hover:text-white disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </header>

                {/* Scrollable content */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:#354354_transparent] scrollbar-thin">
                    {/* Request identity */}
                    <section className="border-b border-[#303A47] bg-[#151C25] px-5 py-6 sm:px-8 sm:py-7">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={displayStatus} />
                            <PriorityBadge priority={request.urgency} />
                        </div>

                        <h1 className="mt-4 wrap-break-word text-[20px] font-semibold leading-snug tracking-tight text-[#EEF1F5]! sm:text-[23px]">
                            {request.title || 'Help request'}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12px] text-[#AAB8C9]">
                            <span className="inline-flex items-center gap-2">
                                <UserRound size={15} />
                                {requesterName}
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <MapPin size={15} />
                                {location}
                            </span>
                        </div>
                    </section>

                    {/* Single-column content */}
                    <div className="space-y-9 px-5 py-7 sm:space-y-10 sm:px-8 sm:py-8">
                        {/* About request */}
                        <section>
                            <SectionTitle icon={FileText}>
                                About this request
                            </SectionTitle>

                            <p className="max-w-[58ch] whitespace-pre-wrap wrap-break-word text-[14px] leading-8 text-[#C1CCD8]">
                                {request.description ||
                                    'No additional description was provided for this request.'}
                            </p>
                        </section>

                        {/* Case information */}
                        <section className="border-t border-[#303A47] pt-7 sm:pt-8">
                            <SectionTitle
                                icon={ClipboardList}
                                action={
                                    canEdit &&
                                    !isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#B9CDE2] transition-colors hover:text-white"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>
                                    )
                                }
                            >
                                Case information
                            </SectionTitle>

                            {isEditing ? (
                                <EditCasePanel
                                    key={request.assignmentId}
                                    request={request}
                                    onUpdateAssignment={onUpdateAssignment}
                                    actionLoading={actionLoading}
                                    onCancel={() => setIsEditing(false)}
                                />
                            ) : (
                                <dl>
                                    <InformationRow label="Category">
                                        {request.category}
                                    </InformationRow>

                                    <InformationRow label="District">
                                        {request.district}
                                    </InformationRow>

                                    <InformationRow label="Priority">
                                        <PriorityBadge
                                            priority={request.urgency}
                                        />
                                    </InformationRow>

                                    <InformationRow label="Support type">
                                        {request.supportType ||
                                            request.resourceType}
                                    </InformationRow>

                                    <InformationRow label="Received">
                                        {request.createdAt ||
                                            request.submittedAt}
                                    </InformationRow>

                                    {request.peopleAffected != null && (
                                        <InformationRow label="People affected">
                                            {request.peopleAffected}
                                        </InformationRow>
                                    )}
                                </dl>
                            )}
                        </section>

                        {/* Support progress */}
                        <SupportWorkflow request={request} />
                    </div>
                </div>

                {/* Fixed footer */}
                <footer className="shrink-0 border-t border-[#303A47] bg-[#151C25] px-5 py-3.5 sm:px-8 sm:py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={close}
                            disabled={actionLoading}
                            className={secondaryButton}
                        >
                            Close
                        </button>

                        <div className="flex flex-wrap justify-end gap-2">
                            {pending && (
                                <>
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            onAction?.(request, 'reject')
                                        }
                                        className={secondaryButton}
                                    >
                                        Decline
                                    </button>

                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() =>
                                            onAction?.(request, 'accept')
                                        }
                                        className={primaryButton}
                                    >
                                        <Check size={15} />
                                        {actionLoading
                                            ? 'Processing...'
                                            : 'Accept assignment'}
                                    </button>
                                </>
                            )}

                            {canStartSupport && (
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={() => onStartSupport?.(request)}
                                    className={primaryButton}
                                >
                                    <ArrowRight size={15} />
                                    Start support
                                </button>
                            )}
                        </div>
                    </div>
                </footer>
            </aside>
        </div>
    );
}

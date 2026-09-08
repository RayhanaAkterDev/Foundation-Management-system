import { useState } from 'react';

import {
    Activity,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    ChevronRight,
    Clock3,
    FileText,
    MapPin,
    MessageSquareText,
    Pencil,
    RotateCcw,
    Save,
    ShieldCheck,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { formatCurrency } from './helpRequestUtils';
import UrgencyBadge from './UrgencyBadge';

const categories = [
    'Education',
    'Healthcare',
    'Food Assistance',
    'Shelter',
    'Livelihood',
    'Disaster Relief',
    'Other',
];

const getProgressLabel = (status) => {
    if (status === 'completed') return 'Completed';
    if (status === 'active') return 'In progress';
    if (status === 'assigned') return 'Assigned';

    return 'Not started';
};

const getProgressSteps = (status) => {
    const stages = ['pending', 'assigned', 'active', 'completed'];

    return stages.map((stage) => ({
        key: stage,
        label:
            stage === 'pending'
                ? 'Received'
                : stage === 'assigned'
                  ? 'Assigned'
                  : stage === 'active'
                    ? 'Support'
                    : 'Completed',
        active: stages.indexOf(stage) <= stages.indexOf(status),
        current: stage === status,
    }));
};

// =========================================================
// EDIT CLASSIFICATION
// =========================================================

const EditCasePanel = ({
    request,
    onUpdateAssignment,
    actionLoading,
    onCancel,
}) => {
    const [category, setCategory] = useState(request.category || '');
    const [urgency, setUrgency] = useState(request.urgency || 'normal');
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');

        if (!request.assignmentId) {
            setError(
                'Assignment information is missing. Please refresh the page and try again.',
            );
            return;
        }

        if (!onUpdateAssignment) {
            setError(
                'Update function is not available. Please refresh the page and try again.',
            );
            return;
        }

        const trimmedCategory = category.trim();

        if (!trimmedCategory) {
            setError('Please select a category.');
            return;
        }

        if (!['low', 'normal', 'high', 'critical'].includes(urgency)) {
            setError('Please select a valid priority.');
            return;
        }

        const fields = {
            category: trimmedCategory,
            urgency,
        };

        console.log('Organization case update:', {
            assignmentId: request.assignmentId,
            fields,
            currentStatus: request.status,
        });

        try {
            const success = await onUpdateAssignment(
                request.assignmentId,
                fields,
            );

            console.log('Organization case update result:', success);

            if (!success) {
                setError(
                    'The case could not be updated. Please check the error message and try again.',
                );
                return;
            }

            onCancel();
        } catch (err) {
            console.error('Case update failed:', err);

            setError(
                err?.message ||
                    'The case could not be updated. Please try again.',
            );
        }
    };

    return (
        <div className="mt-5 border border-[#cfdedb] bg-[#f7faf9]">
            <div className="flex items-center justify-between border-b border-[#dbe5e2] px-5 py-4">
                <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                        Edit classification
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-[#34484d]">
                        Update how this case is categorized
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-7 w-7 items-center justify-center text-[#8b999d] transition hover:bg-white hover:text-[#34484d]"
                >
                    <X className="h-3.5 w-3.5" strokeWidth={1.7} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5">
                <div>
                    <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.14em] text-[#7f8d91]">
                        Category
                    </label>

                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-10 w-full appearance-none border border-[#d3dfdd] bg-white px-3 pr-8 text-[11px] font-medium text-[#35494e] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                        >
                            <option value="">Select category</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#879599]" />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.14em] text-[#7f8d91]">
                        Priority
                    </label>

                    <div className="relative">
                        <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="h-10 w-full appearance-none border border-[#d3dfdd] bg-white px-3 pr-8 text-[11px] font-medium capitalize text-[#35494e] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                        >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>

                        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#879599]" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="border-t border-[#eadedb] bg-[#fbf8f7] px-5 py-3 text-[10px] leading-5 text-[#805c55]">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-2 border-t border-[#dbe5e2] bg-white px-5 py-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-9 px-4 text-[10px] font-semibold text-[#69787c] transition hover:bg-[#f4f7f6]"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={actionLoading}
                    className="flex h-9 items-center gap-2 bg-[#0f766e] px-4 text-[10px] font-bold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {actionLoading ? (
                        <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Save className="h-3.5 w-3.5" />
                    )}
                    Save changes
                </button>
            </div>
        </div>
    );
};

// =========================================================
// STATUS NOTICE
// =========================================================

const StatusNotice = ({ type }) => {
    if (type === 'withdrawal') {
        return (
            <div className="mb-8 border-l-[3px] border-[#b18b43] bg-[#faf7ef] px-5 py-4">
                <div className="flex items-start gap-3">
                    <Clock3
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#967b45]"
                        strokeWidth={1.6}
                    />

                    <div>
                        <p className="text-[11px] font-semibold text-[#5f5033]">
                            Withdrawal request under review
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#857455]">
                            Administration is reviewing the request. This
                            assignment remains active until a decision is made.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'pending') {
        return (
            <div className="mb-8 border-l-[3px] border-[#0f766e] bg-[#f3f8f7] px-5 py-4">
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]"
                        strokeWidth={1.6}
                    />

                    <div>
                        <p className="text-[11px] font-semibold text-[#29464a]">
                            This assignment needs your decision
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#78898d]">
                            Review the case information before accepting or
                            declining the assignment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'active') {
        return (
            <div className="mb-8 border-l-[3px] border-[#0f766e] bg-[#f3f8f7] px-5 py-4">
                <div className="flex items-start gap-3">
                    <Activity
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]"
                        strokeWidth={1.6}
                    />

                    <div>
                        <p className="text-[11px] font-semibold text-[#29464a]">
                            Support is currently active
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#78898d]">
                            Your organization is currently handling this case.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// =========================================================
// FACT
// =========================================================

const CaseFact = ({ label, value, accent = false }) => (
    <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#89969a]">
            {label}
        </p>

        <p
            className={`mt-2 truncate text-[12px] font-semibold ${
                accent ? 'text-[#0f766e]' : 'text-[#30464c]'
            }`}
        >
            {value || 'Not provided'}
        </p>
    </div>
);

// =========================================================
// COMMAND ACTION
// =========================================================

const CommandAction = ({
    icon: Icon,
    title,
    description,
    onClick,
    danger = false,
    disabled = false,
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="group flex w-full items-center gap-4 border-t border-[#dfe6e5] px-5 py-4 text-left transition hover:bg-[#f8faf9] disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Icon
            className={`h-4 w-4 shrink-0 ${
                danger ? 'text-[#8d716a]' : 'text-[#0f766e]'
            }`}
            strokeWidth={1.5}
        />

        <div className="min-w-0 flex-1">
            <p
                className={`text-[11px] font-semibold ${
                    danger ? 'text-[#725b55]' : 'text-[#33494e]'
                }`}
            >
                {title}
            </p>

            <p className="mt-1 text-[9px] leading-5 text-[#8a979b]">
                {description}
            </p>
        </div>

        <ChevronRight
            className="h-4 w-4 shrink-0 text-[#a3afb2] transition group-hover:translate-x-0.5"
            strokeWidth={1.5}
        />
    </button>
);

// =========================================================
// ACTION FOOTER
// =========================================================

const DrawerFooter = ({ request, onClose, onAction, actionLoading }) => {
    const withdrawalPending = request.withdrawalStatus === 'pending';

    if (withdrawalPending) {
        return (
            <div className="flex items-center justify-between border-t border-[#d8e1e2] bg-white px-7 py-4">
                <div>
                    <p className="text-[9px] font-medium text-[#8b989c]">
                        Awaiting administration
                    </p>

                    <p className="mt-0.5 text-[8px] text-[#a0abad]">
                        Assignment remains active
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 border border-[#d2ddde] px-5 text-[10px] font-semibold text-[#43565c] transition hover:bg-[#f6f8f8]"
                >
                    Close
                </button>
            </div>
        );
    }

    if (request.status === 'pending') {
        return (
            <div className="flex items-center justify-between border-t border-[#d8e1e2] bg-white px-7 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 px-3 text-[10px] font-semibold text-[#68777c] transition hover:bg-[#f4f7f7]"
                >
                    Close
                </button>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onAction('decline')}
                        disabled={actionLoading}
                        className="h-9 border border-[#d3ddde] px-5 text-[10px] font-semibold text-[#59696f] transition hover:bg-[#f7f9f9] disabled:opacity-50"
                    >
                        Decline
                    </button>

                    <button
                        type="button"
                        onClick={() => onAction('accept')}
                        disabled={actionLoading}
                        className="flex h-9 items-center gap-2 bg-[#0f766e] px-5 text-[10px] font-bold text-white transition hover:bg-[#115e59] disabled:opacity-50"
                    >
                        <Check className="h-3.5 w-3.5" />
                        Accept assignment
                    </button>
                </div>
            </div>
        );
    }

    if (request.status === 'assigned') {
        return (
            <div className="flex items-center justify-between border-t border-[#d8e1e2] bg-white px-7 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 px-3 text-[10px] font-semibold text-[#68777c] transition hover:bg-[#f4f7f7]"
                >
                    Close
                </button>

                <button
                    type="button"
                    onClick={() => onAction('start')}
                    disabled={actionLoading}
                    className="flex h-9 items-center gap-2 bg-[#0f766e] px-5 text-[10px] font-bold text-white transition hover:bg-[#115e59] disabled:opacity-50"
                >
                    Start support
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        );
    }

    if (request.status === 'active') {
        return (
            <div className="flex items-center justify-between border-t border-[#d8e1e2] bg-white px-7 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 px-3 text-[10px] font-semibold text-[#68777c] transition hover:bg-[#f4f7f7]"
                >
                    Close
                </button>

                <button
                    type="button"
                    onClick={() => onAction('complete')}
                    disabled={actionLoading}
                    className="flex h-9 items-center gap-2 bg-[#0f766e] px-5 text-[10px] font-bold text-white transition hover:bg-[#115e59] disabled:opacity-50"
                >
                    <Check className="h-3.5 w-3.5" />
                    Mark completed
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-end border-t border-[#d8e1e2] bg-white px-7 py-4">
            <button
                type="button"
                onClick={onClose}
                className="h-9 border border-[#d2ddde] px-5 text-[10px] font-semibold text-[#43565c] transition hover:bg-[#f6f8f8]"
            >
                Close
            </button>
        </div>
    );
};

// =========================================================
// MAIN DRAWER
// =========================================================

const CaseReviewDrawer = ({
    request,
    onClose,
    onAction,
    actionLoading,
    statusConfig,
    onUpdateAssignment,
    onRequestWithdrawal,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!request) return null;

    const config = statusConfig[request.status] || statusConfig.pending;

    const withdrawalPending = request.withdrawalStatus === 'pending';

    const canEdit =
        !withdrawalPending &&
        (request.status === 'active' || request.status === 'assigned');

    const canRequestWithdrawal =
        !withdrawalPending &&
        (request.status === 'assigned' || request.status === 'active');

    const handleClose = () => {
        setIsEditing(false);
        onClose();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const amount =
        request.amountNeeded || request.amount
            ? formatCurrency(request.amountNeeded || request.amount)
            : null;

    const requesterName =
        request.requesterName || request.requester?.name || 'Unknown requester';

    const requesterLocation =
        request.address ||
        request.requesterAddress ||
        request.district ||
        'Location not provided';

    const progress = Math.min(request.progress || 0, 100);

    const progressSteps = getProgressSteps(request.status);

    return (
        <div className="fixed inset-0 z-50">
            {/* BACKDROP */}
            <button
                type="button"
                aria-label="Close case review"
                onClick={handleClose}
                className="absolute inset-0 h-full w-full cursor-default bg-[#0d2024]/55 backdrop-blur-[3px]"
            />

            {/* DRAWER */}
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-[760px] flex-col bg-[#f5f7f6] shadow-[-30px_0_80px_rgba(8,30,34,0.22)]">
                {/* =====================================================
                    TOP CHROME
                ===================================================== */}
                <header className="shrink-0 border-b border-[#31494c] bg-[#172f34] text-white">
                    <div className="flex h-14 items-center justify-between px-7">
                        <div className="flex items-center gap-3">
                            <BriefcaseBusiness
                                className="h-4 w-4 text-[#8fc0b9]"
                                strokeWidth={1.5}
                            />

                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#91b6b2]">
                                    Organization workspace
                                </span>

                                <span className="h-1 w-1 rounded-full bg-[#6e8f8c]" />

                                <span className="text-[8px] text-white/40">
                                    Case review
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex h-8 w-8 items-center justify-center text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                        >
                            <X className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                    </div>
                </header>

                {/* =====================================================
                    SCROLL CONTENT
                ===================================================== */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {/* =================================================
                        CASE IDENTITY
                    ================================================= */}
                    <section className="bg-[#172f34] px-7 pb-8 pt-3 text-white">
                        <div className="flex items-start justify-between gap-7">
                            <div className="min-w-0">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="font-mono text-[9px] tracking-[0.1em] text-[#9ab8b5]">
                                        CASE #{request.id}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-[#648a86]" />

                                    <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8ca9a6]">
                                        {config?.label || request.status}
                                    </span>
                                </div>

                                <h1 className="max-w-[570px] text-[28px] font-semibold leading-[1.18] tracking-[-0.04em]">
                                    {request.title}
                                </h1>

                                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-1.5 text-[9px] text-white/45">
                                        <Clock3
                                            className="h-3 w-3"
                                            strokeWidth={1.5}
                                        />
                                        {request.createdAt ||
                                            request.submittedAt ||
                                            'Date not provided'}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[9px] text-white/45">
                                        <MapPin
                                            className="h-3 w-3"
                                            strokeWidth={1.5}
                                        />
                                        {request.district ||
                                            'Location not provided'}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-1">
                                <UrgencyBadge urgency={request.urgency} dark />
                            </div>
                        </div>

                        {withdrawalPending && (
                            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[9px] font-medium text-[#d7c28d]">
                                <Clock3
                                    className="h-3.5 w-3.5"
                                    strokeWidth={1.5}
                                />
                                Withdrawal request pending
                            </div>
                        )}
                    </section>

                    {/* =================================================
                        MAIN DOSSIER
                    ================================================= */}
                    <main className="px-7 py-7">
                        <StatusNotice
                            type={
                                withdrawalPending
                                    ? 'withdrawal'
                                    : request.status === 'pending'
                                      ? 'pending'
                                      : request.status === 'active'
                                        ? 'active'
                                        : null
                            }
                        />

                        {/* =============================================
                            KEY FACTS STRIP
                        ============================================= */}
                        <section className="border-y border-[#d9e2e1] bg-white">
                            <div className="grid grid-cols-4 divide-x divide-[#e0e6e5] px-5 py-5">
                                <CaseFact
                                    label="Amount needed"
                                    value={amount}
                                    accent
                                />

                                <div className="pl-5">
                                    <CaseFact
                                        label="People affected"
                                        value={
                                            request.peopleAffected ||
                                            request.beneficiaries
                                        }
                                    />
                                </div>

                                <div className="pl-5">
                                    <CaseFact
                                        label="Category"
                                        value={request.category}
                                    />
                                </div>

                                <div className="pl-5">
                                    <CaseFact
                                        label="Support"
                                        value={
                                            request.supportType ||
                                            request.resourceType
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 border-t border-[#e0e6e5] px-5 py-4">
                                <CaseFact
                                    label="District"
                                    value={request.district}
                                />

                                <div className="border-l border-[#e0e6e5] pl-5">
                                    <CaseFact
                                        label="Received"
                                        value={
                                            request.createdAt ||
                                            request.submittedAt
                                        }
                                    />
                                </div>

                                <div className="border-l border-[#e0e6e5] pl-5">
                                    <CaseFact
                                        label="Current status"
                                        value={config?.label || request.status}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* =============================================
                            REQUEST NARRATIVE
                        ============================================= */}
                        <section className="mt-10">
                            <div className="mb-4 flex items-end justify-between">
                                <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        Request narrative
                                    </p>

                                    <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.025em] text-[#253a40]">
                                        What the requester needs
                                    </h2>
                                </div>

                                <FileText
                                    className="h-4 w-4 text-[#a1adaf]"
                                    strokeWidth={1.5}
                                />
                            </div>

                            <div className="relative border-y border-[#d9e2e1] bg-white px-7 py-7">
                                <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#0f766e]" />

                                <p className="max-w-[620px] text-[13px] leading-[1.9] text-[#465a60]">
                                    {request.description ||
                                        'No additional description was provided for this request.'}
                                </p>
                            </div>
                        </section>

                        {/* =============================================
                            PEOPLE + INTERNAL CONTEXT
                        ============================================= */}
                        <section className="mt-10">
                            <div className="mb-4">
                                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                    Case context
                                </p>

                                <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.025em] text-[#253a40]">
                                    People & administration
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-px border border-[#d9e2e1] bg-[#d9e2e1]">
                                {/* REQUESTER */}
                                <div className="bg-white p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#89969a]">
                                            Requester
                                        </p>

                                        <UserRound
                                            className="h-3.5 w-3.5 text-[#9eaaad]"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#2d4248]">
                                        {requesterName}
                                    </p>

                                    <div className="mt-3 flex items-start gap-2 text-[9px] leading-5 text-[#879499]">
                                        <MapPin
                                            className="mt-0.5 h-3 w-3 shrink-0"
                                            strokeWidth={1.5}
                                        />

                                        <span>{requesterLocation}</span>
                                    </div>
                                </div>

                                {/* ADMINISTRATION */}
                                <div className="bg-[#f8faf9] p-5">
                                    <div className="mb-5 flex items-center justify-between">
                                        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#89969a]">
                                            Assignment note
                                        </p>

                                        <ShieldCheck
                                            className="h-3.5 w-3.5 text-[#0f766e]"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <p className="text-[10px] leading-6 text-[#68787d]">
                                        {request.assignmentNote ||
                                            request.note ||
                                            'No additional administrative note has been provided.'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* =============================================
                            CLASSIFICATION
                        ============================================= */}
                        {canEdit && (
                            <section className="mt-10">
                                <div className="mb-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                            Case controls
                                        </p>

                                        <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.025em] text-[#253a40]">
                                            Classification
                                        </h2>
                                    </div>

                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="flex h-8 items-center gap-1.5 border border-[#cfdcda] bg-white px-3 text-[9px] font-bold text-[#35615b] transition hover:border-[#a8c3be] hover:bg-[#f6faf8]"
                                        >
                                            <Pencil className="h-3 w-3" />
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div className="flex items-center border-y border-[#d9e2e1] bg-white">
                                        <div className="flex-1 px-5 py-5">
                                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8a979b]">
                                                Category
                                            </p>

                                            <p className="mt-2 text-[11px] font-semibold text-[#33484d]">
                                                {request.category ||
                                                    'Not provided'}
                                            </p>
                                        </div>

                                        <div className="h-10 w-px bg-[#e0e6e5]" />

                                        <div className="flex-1 px-5 py-5">
                                            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8a979b]">
                                                Priority
                                            </p>

                                            <p className="mt-2 text-[11px] font-semibold capitalize text-[#33484d]">
                                                {request.urgency || 'Normal'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <EditCasePanel
                                        request={request}
                                        onUpdateAssignment={onUpdateAssignment}
                                        actionLoading={actionLoading}
                                        onCancel={handleCancelEdit}
                                    />
                                )}
                            </section>
                        )}

                        {/* =============================================
                            PROGRESS
                        ============================================= */}
                        {(request.status === 'active' ||
                            request.status === 'assigned' ||
                            request.status === 'completed' ||
                            withdrawalPending) && (
                            <section className="mt-10">
                                <div className="mb-5 flex items-end justify-between">
                                    <div>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                            Case lifecycle
                                        </p>

                                        <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.025em] text-[#253a40]">
                                            Support progress
                                        </h2>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[24px] font-semibold tracking-[-0.04em] text-[#273c42]">
                                            {progress}%
                                        </p>

                                        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9aa5a9]">
                                            {getProgressLabel(request.status)}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-y border-[#d9e2e1] bg-white px-6 py-7">
                                    <div className="relative">
                                        {/* LINE */}
                                        <div className="absolute left-2 right-2 top-[7px] h-px bg-[#dce5e3]" />

                                        <div
                                            className="absolute left-2 top-[7px] h-px bg-[#0f766e] transition-all duration-500"
                                            style={{
                                                width: `${
                                                    request.status ===
                                                    'completed'
                                                        ? '100%'
                                                        : request.status ===
                                                            'active'
                                                          ? '66%'
                                                          : request.status ===
                                                              'assigned'
                                                            ? '33%'
                                                            : '0%'
                                                }`,
                                            }}
                                        />

                                        {/* STEPS */}
                                        <div className="relative grid grid-cols-4">
                                            {progressSteps.map((step) => (
                                                <div
                                                    key={step.key}
                                                    className="flex flex-col"
                                                >
                                                    <div
                                                        className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border ${
                                                            step.active
                                                                ? 'border-[#0f766e] bg-[#0f766e]'
                                                                : 'border-[#ccd9d7] bg-white'
                                                        }`}
                                                    >
                                                        {step.active &&
                                                            !step.current && (
                                                                <Check
                                                                    className="h-2.5 w-2.5 text-white"
                                                                    strokeWidth={
                                                                        2.2
                                                                    }
                                                                />
                                                            )}

                                                        {step.current && (
                                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                        )}
                                                    </div>

                                                    <p
                                                        className={`mt-3 text-[9px] font-semibold ${
                                                            step.current
                                                                ? 'text-[#31545a]'
                                                                : step.active
                                                                  ? 'text-[#66787d]'
                                                                  : 'text-[#a1abad]'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* =============================================
                            MANAGEMENT COMMANDS
                        ============================================= */}
                        {canRequestWithdrawal && (
                            <section className="mt-10">
                                <div className="mb-4">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                                        Assignment controls
                                    </p>

                                    <h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.025em] text-[#253a40]">
                                        Manage support
                                    </h2>
                                </div>

                                <div className="border-y border-[#d9e2e1] bg-white">
                                    <CommandAction
                                        icon={MessageSquareText}
                                        title="Request additional support"
                                        description="Notify administration if this case needs additional resources, coordination, or assistance."
                                        onClick={() =>
                                            onRequestWithdrawal?.(
                                                request,
                                                'additional_support',
                                            )
                                        }
                                        disabled={actionLoading}
                                    />

                                    <CommandAction
                                        icon={RotateCcw}
                                        title="Request withdrawal"
                                        description="Ask administration to review a request to withdraw your organization from this assignment."
                                        danger
                                        onClick={() =>
                                            onRequestWithdrawal?.(
                                                request,
                                                'withdrawal',
                                            )
                                        }
                                        disabled={actionLoading}
                                    />
                                </div>
                            </section>
                        )}

                        {/* BOTTOM SPACE FOR ACTION DOCK */}
                        <div className="h-5" />
                    </main>
                </div>

                {/* =====================================================
                    ACTION DOCK
                ===================================================== */}
                <div className="shrink-0">
                    <DrawerFooter
                        request={request}
                        onClose={handleClose}
                        onAction={onAction}
                        actionLoading={actionLoading}
                    />
                </div>
            </aside>
        </div>
    );
};

export default CaseReviewDrawer;

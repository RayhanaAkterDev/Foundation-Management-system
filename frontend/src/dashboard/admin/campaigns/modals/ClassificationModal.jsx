import { useState } from 'react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    Flame,
    LoaderCircle,
    RefreshCw,
    Sparkles,
    Star,
    X,
} from 'lucide-react';

import {
    assessCampaignUrgency,
    updateCampaignClassification,
} from '@/dashboard/admin/campaigns/api/campaignsAPI';

const PRIORITY_OPTIONS = [
    {
        value: 1,
        label: 'Low',
        color: '#80AFC9',
        description: 'Limited time sensitivity',
    },
    {
        value: 2,
        label: 'Normal',
        color: '#D6B66E',
        description: 'Standard attention',
    },
    {
        value: 3,
        label: 'High',
        color: '#E3A06D',
        description: 'Timely action needed',
    },
    {
        value: 4,
        label: 'Critical',
        color: '#E58C88',
        description: 'Immediate attention',
    },
];

const URGENCY_PRIORITY = {
    low: 1,
    normal: 2,
    high: 3,
    critical: 4,
};

const URGENCY_STYLES = {
    low: {
        label: 'Low urgency',
        color: '#80AFC9',
        background: 'rgba(128, 175, 201, 0.10)',
        border: 'rgba(128, 175, 201, 0.28)',
    },
    normal: {
        label: 'Normal urgency',
        color: '#D6B66E',
        background: 'rgba(214, 182, 110, 0.10)',
        border: 'rgba(214, 182, 110, 0.28)',
    },
    high: {
        label: 'High urgency',
        color: '#E3A06D',
        background: 'rgba(227, 160, 109, 0.10)',
        border: 'rgba(227, 160, 109, 0.28)',
    },
    critical: {
        label: 'Critical urgency',
        color: '#E58C88',
        background: 'rgba(229, 140, 136, 0.10)',
        border: 'rgba(229, 140, 136, 0.28)',
    },
};

function SettingRow({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
    disabled,
    color,
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={title}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8A9AAC] disabled:cursor-not-allowed disabled:opacity-50"
        >
            <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                    backgroundColor: `${color}12`,
                    color,
                }}
            >
                <Icon size={17} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-[#EEF1F5]!">
                    {title}
                </span>

                <span className="mt-0.5 block text-[12px] leading-5 text-[#9BA8B8]">
                    {description}
                </span>
            </span>

            <span
                aria-hidden="true"
                className={`relative h-[22px] w-[39px] shrink-0 rounded-full transition-colors duration-200 ${
                    checked ? 'bg-[#6CA99F]' : 'bg-[#465360]'
                }`}
            >
                <span
                    className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? 'translate-x-[20px]' : 'translate-x-[3px]'
                    }`}
                />
            </span>
        </button>
    );
}

function UrgencyAssessment({
    assessment,
    assessing,
    error,
    onAssess,
    onApply,
    disabled,
}) {
    const [showReasoning, setShowReasoning] = useState(true);

    const urgency = assessment?.urgency?.toLowerCase();
    const urgencyStyle = URGENCY_STYLES[urgency];
    const canApply = Boolean(urgencyStyle && URGENCY_PRIORITY[urgency]);

    return (
        <section className="border-b border-[#34404D] pb-5">
            {/* AI assessment heading */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#29394C] text-[#AAC6E9]">
                        <Sparkles size={17} strokeWidth={1.8} />
                    </span>

                    <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#EEF1F5]!">
                            AI urgency assessment
                        </h3>

                        <p className="mt-0.5 text-[11px] text-[#9BA8B8]">
                            Get an AI-assisted priority recommendation.
                        </p>
                    </div>
                </div>

                {assessment && !assessing && (
                    <button
                        type="button"
                        onClick={onAssess}
                        disabled={disabled}
                        aria-label="Reassess campaign"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#9BA8B8] transition hover:bg-[#2B3947] hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw size={15} />
                    </button>
                )}
            </div>

            {/* Initial assessment */}
            {!assessment && !assessing && !error && (
                <div className="mt-3 flex flex-col gap-3 rounded-lg bg-[#202D3A] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12px] leading-5 text-[#AAB8C8]">
                        Analyze campaign details and linked help requests.
                    </p>

                    <button
                        type="button"
                        onClick={onAssess}
                        disabled={disabled}
                        className="inline-flex min-h-[36px] shrink-0 items-center justify-center gap-2 rounded-md bg-[#DCE6F1] px-3.5 py-2 text-[12px] font-semibold text-[#1B2938] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9AAC] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Sparkles size={14} />
                        Assess urgency
                    </button>
                </div>
            )}

            {/* Assessing */}
            {assessing && (
                <div
                    role="status"
                    className="mt-4 flex items-center gap-3 rounded-lg bg-[#202D3A] px-4 py-4"
                >
                    <LoaderCircle
                        size={19}
                        className="shrink-0 animate-spin text-[#AAC6E9]"
                    />

                    <div>
                        <p className="text-[12px] font-medium text-[#E5EAF0]">
                            Assessing campaign details…
                        </p>

                        <p className="mt-1 text-[11px] text-[#94A3B4]">
                            Reviewing urgency and time sensitivity.
                        </p>
                    </div>
                </div>
            )}

            {/* Assessment error */}
            {error && !assessing && (
                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-[#B96C6C]/30 bg-[#B96C6C]/[0.08] p-3.5"
                >
                    <div className="flex items-start gap-2.5">
                        <AlertCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-[#E58C88]"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-semibold text-[#F0B0AC]">
                                Assessment unsuccessful
                            </p>

                            <p className="mt-1 break-words text-[12px] leading-5 text-[#D6B5B5]">
                                {error}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onAssess}
                        disabled={disabled}
                        className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-[#E7C0C0] hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw size={13} />
                        Try again
                    </button>
                </div>
            )}

            {/* AI result */}
            {assessment && urgencyStyle && !assessing && (
                <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#202D3A] px-3.5 py-3">
                        <div className="flex items-center gap-2.5">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: urgencyStyle.color,
                                }}
                            />

                            <div>
                                <p className="text-[11px] text-[#AAB6C4]">
                                    Recommended priority
                                </p>

                                <p
                                    className="text-[13px] font-semibold"
                                    style={{
                                        color: urgencyStyle.color,
                                    }}
                                >
                                    {urgencyStyle.label}
                                </p>
                            </div>
                        </div>

                        <span className="text-[11px] text-[#AAB6C4]">
                            Level {URGENCY_PRIORITY[urgency]} of 4
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowReasoning((current) => !current)}
                        aria-expanded={showReasoning}
                        className="mt-3 flex w-full items-center justify-between gap-3 py-1 text-left text-[12px] font-medium text-[#C6D2DE] hover:text-white"
                    >
                        AI reasoning
                        <ChevronDown
                            size={15}
                            className={`transition-transform ${
                                showReasoning ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {showReasoning && (
                        <div className="mt-2 space-y-3">
                            <p className="whitespace-pre-line text-[12px] leading-[1.8] text-[#B6C3D0]">
                                {assessment.reason}
                            </p>

                            {Array.isArray(assessment.missing_information) &&
                                assessment.missing_information.length > 0 && (
                                    <div className="border-l-2 border-[#D6B66E]/60 pl-3">
                                        <p className="text-[12px] font-semibold text-[#D6B66E]">
                                            Information to verify
                                        </p>

                                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[12px] leading-5 text-[#B6C3D0]">
                                            {assessment.missing_information.map(
                                                (item, index) => (
                                                    <li
                                                        key={`${index}-${item}`}
                                                    >
                                                        {item}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={onApply}
                            disabled={disabled || !canApply}
                            className="inline-flex min-h-[37px] items-center justify-center gap-2 rounded-md bg-[#DCE6F1] px-4 py-2 text-[12px] font-semibold text-[#1B2938] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Check size={14} />
                            Apply recommendation
                        </button>

                        <span className="text-[11px] text-[#91A0B2]">
                            Review and save to confirm.
                        </span>
                    </div>
                </div>
            )}

            {/* Unsupported urgency */}
            {assessment && !urgencyStyle && !assessing && (
                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-[#B96C6C]/30 bg-[#B96C6C]/[0.08] p-3 text-[12px] leading-5 text-[#E5AAAA]"
                >
                    The assessment returned an unsupported urgency level. Please
                    run the assessment again.
                    <button
                        type="button"
                        onClick={onAssess}
                        disabled={disabled}
                        className="mt-2 flex items-center gap-1.5 font-semibold text-[#F0C4C4] hover:text-white"
                    >
                        <RefreshCw size={12} />
                        Try again
                    </button>
                </div>
            )}
        </section>
    );
}

export default function ClassificationModal({ campaign, onClose, onSave }) {
    const [featured, setFeatured] = useState(Boolean(campaign?.is_featured));

    const [urgent, setUrgent] = useState(Boolean(campaign?.is_urgent));

    const [priority, setPriority] = useState(
        Number(campaign?.urgency_priority) || 2,
    );

    const [busy, setBusy] = useState(false);
    const [assessing, setAssessing] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [assessmentError, setAssessmentError] = useState('');
    const [assessment, setAssessment] = useState(null);
    const [savedMessage, setSavedMessage] = useState('');

    if (!campaign) return null;

    const handleAssess = async () => {
        if (assessing || busy) return;

        setAssessing(true);
        setAssessmentError('');
        setAssessment(null);
        setSavedMessage('');

        try {
            const response = await assessCampaignUrgency(campaign.id);

            if (response?.success === false) {
                throw new Error(
                    response.message || 'Unable to assess campaign urgency.',
                );
            }

            const result = response?.assessment;
            const urgency = result?.urgency?.toLowerCase();

            if (
                !result ||
                !URGENCY_STYLES[urgency] ||
                !URGENCY_PRIORITY[urgency] ||
                typeof result.reason !== 'string' ||
                !result.reason.trim()
            ) {
                throw new Error(
                    'The AI returned an incomplete or invalid assessment. Please try again.',
                );
            }

            setAssessment({
                ...result,
                urgency,
                missing_information: Array.isArray(result.missing_information)
                    ? result.missing_information
                    : [],
            });
        } catch (error) {
            setAssessmentError(
                error?.message ||
                    'Something went wrong while assessing campaign urgency.',
            );
        } finally {
            setAssessing(false);
        }
    };

    const handleApplyAssessment = () => {
        if (!assessment) return;

        const recommendedPriority = URGENCY_PRIORITY[assessment.urgency];

        if (!recommendedPriority) return;

        setPriority(recommendedPriority);

        setUrgent(
            assessment.urgency === 'high' || assessment.urgency === 'critical',
        );

        setSavedMessage('');
        setSaveError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (busy || assessing) return;

        setBusy(true);
        setSaveError('');
        setSavedMessage('');

        const classification = {
            is_featured: featured,
            is_urgent: urgent,
            urgency_priority: urgent ? Number(priority) : 2,
        };

        try {
            const response = await updateCampaignClassification(
                campaign.id,
                classification,
            );

            if (response?.success === false) {
                throw new Error(
                    response.message ||
                        'Unable to update campaign classification.',
                );
            }

            onSave?.({
                campaignId: campaign.id,
                classification,
                response,
            });
        } catch (error) {
            setSaveError(
                error?.message ||
                    'Something went wrong while saving the classification.',
            );
        } finally {
            setBusy(false);
        }
    };

    const selectedPriority =
        PRIORITY_OPTIONS.find((option) => option.value === Number(priority)) ||
        PRIORITY_OPTIONS[1];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#080D13]/80 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !busy &&
                    !assessing
                ) {
                    onClose?.();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="classification-modal-title"
                className="my-auto flex max-h-[calc(100dvh-24px)] w-full max-w-[540px] flex-col overflow-hidden rounded-xl border border-[#354352] bg-[#1B242E] shadow-[0_28px_90px_rgba(0,0,0,0.55)] sm:max-h-[calc(100dvh-40px)]"
            >
                {/* Header */}
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#34404D] px-5 py-4 sm:px-6 sm:py-5">
                    <div className="min-w-0">
                        <h2
                            id="classification-modal-title"
                            className="text-[18px] font-semibold tracking-[-0.025em] text-[#EEF1F5]!"
                        >
                            Campaign classification
                        </h2>

                        <p className="mt-1 truncate text-[12px] text-[#A4B2C3]">
                            {campaign.title || `Campaign #${campaign.id}`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy || assessing}
                        aria-label="Close modal"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#9BA8B8] transition hover:bg-[#2A3542] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9AAC] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 [scrollbar-color:#435263_transparent] [scrollbar-width:thin] sm:px-6">
                        {/* AI assessment */}
                        <UrgencyAssessment
                            assessment={assessment}
                            assessing={assessing}
                            error={assessmentError}
                            onAssess={handleAssess}
                            onApply={handleApplyAssessment}
                            disabled={busy}
                        />

                        {/* Visibility */}
                        <section>
                            <h3 className="mb-2 text-[13px] font-semibold text-[#EEF1F5]!">
                                Campaign visibility
                            </h3>

                            <div className="divide-y divide-[#34404D]">
                                <SettingRow
                                    icon={Star}
                                    title="Featured campaign"
                                    description="Show in featured sections"
                                    checked={featured}
                                    onChange={(value) => {
                                        setFeatured(value);
                                        setSavedMessage('');
                                        setSaveError('');
                                    }}
                                    disabled={busy || assessing}
                                    color="#D6B66E"
                                />

                                <SettingRow
                                    icon={Flame}
                                    title="Urgent campaign"
                                    description="Highlight for urgent attention"
                                    checked={urgent}
                                    onChange={(value) => {
                                        setUrgent(value);

                                        if (!value) {
                                            setPriority(2);
                                        }

                                        setSavedMessage('');
                                        setSaveError('');
                                    }}
                                    disabled={busy || assessing}
                                    color="#E39A93"
                                />
                            </div>
                        </section>

                        {/* Priority */}
                        <section
                            className={`border-t border-[#34404D] pt-5 transition-opacity ${
                                urgent ? '' : 'opacity-50'
                            }`}
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h3 className="text-[13px] font-semibold text-[#EEF1F5]!">
                                    Urgency priority
                                </h3>

                                <span
                                    className="text-[12px] font-medium"
                                    style={{
                                        color: selectedPriority.color,
                                    }}
                                >
                                    {selectedPriority.label}
                                </span>
                            </div>

                            {!urgent && (
                                <p className="mb-3 text-[12px] leading-5 text-[#9BA8B8]">
                                    Enable Urgent campaign to select an urgency
                                    priority.
                                </p>
                            )}

                            <div
                                role="group"
                                aria-label="Urgency priority"
                                aria-disabled={!urgent}
                                className={`grid grid-cols-4 gap-1.5 rounded-lg bg-[#131B24] p-1.5 ${
                                    !urgent ? 'cursor-not-allowed' : ''
                                }`}
                            >
                                {PRIORITY_OPTIONS.map((option) => {
                                    const selected =
                                        Number(priority) === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            aria-pressed={selected}
                                            disabled={
                                                busy || assessing || !urgent
                                            }
                                            onClick={() => {
                                                setPriority(option.value);
                                                setSavedMessage('');
                                                setSaveError('');
                                            }}
                                            className={`flex min-h-[40px] items-center justify-center rounded-md px-1.5 py-2 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9AAC] disabled:cursor-not-allowed disabled:opacity-50 ${
                                                selected && urgent
                                                    ? 'bg-[#344454] text-[#F3F5F7] shadow-sm'
                                                    : 'text-[#9BA8B8] hover:bg-[#25313D] hover:text-white'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Save success message */}
                        {savedMessage && (
                            <div
                                role="status"
                                className="flex items-start gap-2 rounded-lg border border-[#6CA99F]/30 bg-[#6CA99F]/[0.08] px-3.5 py-3 text-[12px] leading-5 text-[#A8D6CD]"
                            >
                                <CheckCircle2
                                    size={16}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{savedMessage}</p>
                            </div>
                        )}

                        {/* Save error */}
                        {saveError && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/[0.08] px-3.5 py-3 text-[12px] leading-5 text-red-300"
                            >
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{saveError}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-[#34404D] bg-[#19222C] px-5 py-3.5 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={busy || assessing}
                            className="min-h-[39px] rounded-lg px-4 py-2 text-[12px] font-medium text-[#B5C0CC] transition hover:bg-[#2B3743] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={busy || assessing}
                            className="inline-flex min-h-[39px] items-center justify-center gap-2 rounded-lg bg-[#E5E9ED] px-4 py-2 text-[12px] font-semibold text-[#17212B] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {busy ? (
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <Check size={15} strokeWidth={2.5} />
                            )}

                            {busy ? 'Saving changes…' : 'Save classification'}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}

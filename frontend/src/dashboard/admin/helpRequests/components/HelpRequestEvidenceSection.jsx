import { useState } from 'react';
import {
    AlertCircle,
    FileText,
    Image,
    Music,
    Paperclip,
    Send,
    Video,
    LoaderCircle,
    ExternalLink,
    Clock3,
    CheckCircle2,
} from 'lucide-react';

import {
    requestAdditionalEvidence,
    getHelpRequestEvidenceUrl,
} from '../api/helpRequestAPI';

const PANEL = 'min-w-0 overflow-hidden border border-[#303A47] bg-[#171D26]';

function show(value, fallback = 'Not provided') {
    if (value === null || value === undefined) return fallback;

    const result = String(value).trim();
    return result || fallback;
}

function formatSize(bytes) {
    const size = Number(bytes);

    if (!Number.isFinite(size) || size < 0) return 'Unknown size';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
    if (!value) return 'Date unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function getFileIcon(mimeType = '') {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
}

function SectionHeader({ title, subtitle, count }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#344150] bg-[#202B38] px-5 py-4 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center border border-[#3A495B] bg-[#273646] text-[#C3D0DE]">
                    <Paperclip size={16} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                    <h2 className="m-0! font-sans! text-[14px]! font-semibold! text-[#EEF1F5]!">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 mb-0! text-[12px] leading-5 text-[#9AAABD]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {count !== undefined && (
                <span className="border border-[#435064] bg-[#293747] px-2.5 py-1 text-[12px] font-medium tabular-nums text-[#D4DFEA]">
                    {count}
                </span>
            )}
        </div>
    );
}

function EvidenceFileRow({ requestId, evidence }) {
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState('');

    const iconType = getFileIcon(evidence.mime_type || '');

    const handleOpen = async () => {
        if (opening) return;

        setOpening(true);
        setError('');

        try {
            const response = await getHelpRequestEvidenceUrl(
                requestId,
                evidence.id,
            );

            const url =
                response?.url ||
                response?.signed_url ||
                response?.data?.url ||
                response?.data?.signed_url;

            if (!url) {
                throw new Error('Secure evidence URL was not returned.');
            }

            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            setError(err?.message || 'Unable to open this evidence file.');
        } finally {
            setOpening(false);
        }
    };

    return (
        <div className="min-w-0 border-b border-[#303A47] py-4 last:border-b-0">
            <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center border border-[#3A495B] bg-[#253242] text-[#B7C8D9]">
                    {iconType === 'image' && (
                        <Image size={17} strokeWidth={1.7} />
                    )}
                    {iconType === 'audio' && (
                        <Music size={17} strokeWidth={1.7} />
                    )}
                    {iconType === 'video' && (
                        <Video size={17} strokeWidth={1.7} />
                    )}
                    {iconType === 'document' && (
                        <FileText size={17} strokeWidth={1.7} />
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="m-0! wrap-break-word text-[13px] font-medium text-[#E5ECF3]">
                        {show(evidence.file_name, 'Evidence file')}
                    </p>

                    <p className="mt-1 mb-0! text-[11px] leading-5 text-[#93A4B6]">
                        {show(evidence.mime_type, 'Unknown format')}
                        {' · '}
                        {formatSize(evidence.file_size)}
                        {' · '}
                        {formatDate(evidence.created_at)}
                    </p>

                    {error && (
                        <p
                            role="alert"
                            className="mt-2 mb-0! text-[12px] text-[#E9B8BD]"
                        >
                            {error}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleOpen}
                    disabled={opening}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 border border-[#43556A] bg-[#263444] px-3 text-[12px] font-medium text-[#E4EBF3] transition-colors hover:bg-[#34465A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {opening ? (
                        <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                        <ExternalLink size={14} />
                    )}

                    <span className="hidden sm:inline">
                        {opening ? 'Opening...' : 'View'}
                    </span>
                </button>
            </div>
        </div>
    );
}

function EvidenceGroup({ title, evidences, requestId, emptyMessage }) {
    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E1E9F1]!">
                    {title}
                </h3>

                <span className="text-[12px] tabular-nums text-[#95A6B8]">
                    {evidences.length}{' '}
                    {evidences.length === 1 ? 'file' : 'files'}
                </span>
            </div>

            {evidences.length === 0 ? (
                <p className="mt-3 mb-0! border border-dashed border-[#394858] px-4 py-4 text-[12px] leading-5 text-[#94A4B5]">
                    {emptyMessage}
                </p>
            ) : (
                <div className="mt-3">
                    {evidences.map((evidence) => (
                        <EvidenceFileRow
                            key={evidence.id}
                            requestId={requestId}
                            evidence={evidence}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function EvidenceRequestItem({ item, requestId, evidences }) {
    const relatedEvidences = evidences.filter(
        (evidence) => Number(evidence.evidence_request_id) === Number(item.id),
    );

    const submitted = item.status === 'submitted';

    return (
        <article className="border border-[#344150] bg-[#151D27] px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="m-0! text-[12px] font-semibold text-[#DCE5EF]">
                    Evidence request #{item.id}
                </p>

                <span
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium ${
                        submitted
                            ? 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]'
                            : 'border-[#66583D] bg-[#332D22] text-[#E4C995]'
                    }`}
                >
                    {submitted ? (
                        <CheckCircle2 size={12} />
                    ) : (
                        <Clock3 size={12} />
                    )}

                    {submitted ? 'Submitted' : 'Awaiting response'}
                </span>
            </div>

            <p className="mt-3 mb-0! whitespace-pre-wrap wrap-break-word text-[13px] leading-6 text-[#C7D2DE]">
                {item.message}
            </p>

            <p className="mt-3 mb-0! text-[11px] text-[#899BAD]">
                Requested: {formatDate(item.created_at)}
                {item.submitted_at
                    ? ` · Submitted: ${formatDate(item.submitted_at)}`
                    : ''}
            </p>

            {submitted && relatedEvidences.length > 0 && (
                <div className="mt-4 border-t border-[#303A47] pt-3">
                    <p className="m-0! text-[12px] font-semibold text-[#DCE5EF]">
                        Submitted files
                    </p>

                    <div className="mt-2">
                        {relatedEvidences.map((evidence) => (
                            <EvidenceFileRow
                                key={evidence.id}
                                requestId={requestId}
                                evidence={evidence}
                            />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}

export default function HelpRequestEvidenceSection({ request, onUpdated }) {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const evidences = Array.isArray(request.evidences) ? request.evidences : [];

    const originalEvidences = evidences.filter(
        (item) => item.source === 'original',
    );

    const additionalEvidences = evidences.filter(
        (item) => item.source === 'additional',
    );

    const evidenceRequests = Array.isArray(request.evidence_requests)
        ? request.evidence_requests
        : Array.isArray(request.evidenceRequests)
          ? request.evidenceRequests
          : [];

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (sending) return;

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
            setError('Please enter a message for the requester.');
            return;
        }

        setSending(true);
        setError('');
        setSuccess('');

        try {
            await requestAdditionalEvidence(request.id, trimmedMessage);

            setMessage('');
            setSuccess('Additional evidence request sent successfully.');
            onUpdated?.();
        } catch (err) {
            setError(
                err?.message ||
                    'Unable to send the additional evidence request.',
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section className={PANEL}>
            <SectionHeader
                title="Evidence and supporting documents"
                subtitle="Review submitted files and request further evidence"
                count={evidences.length}
            />

            <div className="space-y-7 px-5 py-6 sm:px-7">
                <EvidenceGroup
                    title="Original evidence"
                    evidences={originalEvidences}
                    requestId={request.id}
                    emptyMessage="No original evidence files were found."
                />

                <div className="border-t border-[#303A47] pt-6">
                    <EvidenceGroup
                        title="Additional evidence"
                        evidences={additionalEvidences}
                        requestId={request.id}
                        emptyMessage="No additional evidence has been submitted."
                    />
                </div>

                <div className="border-t border-[#303A47] pt-6">
                    <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E1E9F1]!">
                        Previous evidence requests
                    </h3>

                    {evidenceRequests.length === 0 ? (
                        <p className="mt-3 mb-0! border border-dashed border-[#394858] px-4 py-4 text-[12px] leading-5 text-[#94A4B5]">
                            No additional evidence has been requested.
                        </p>
                    ) : (
                        <div className="mt-3 space-y-3">
                            {evidenceRequests.map((item) => (
                                <EvidenceRequestItem
                                    key={item.id}
                                    item={item}
                                    requestId={request.id}
                                    evidences={evidences}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-[#303A47] pt-6">
                    <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E1E9F1]!">
                        Request additional evidence
                    </h3>

                    <p className="mt-2 mb-0! text-[12px] leading-5 text-[#98A8BA]">
                        Explain what further information or documents the
                        requester needs to provide. This will not change the
                        help request's verification or overall status.
                    </p>

                    {(error || success) && (
                        <div
                            role={error ? 'alert' : 'status'}
                            className={`mt-4 flex items-start gap-2 border px-4 py-3 text-[12px] leading-5 ${
                                error
                                    ? 'border-[#75464C] bg-[#322126] text-[#E9B8BD]'
                                    : 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]'
                            }`}
                        >
                            {error ? (
                                <AlertCircle
                                    size={15}
                                    className="mt-0.5 shrink-0"
                                />
                            ) : (
                                <CheckCircle2
                                    size={15}
                                    className="mt-0.5 shrink-0"
                                />
                            )}

                            <span>{error || success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                        <label
                            htmlFor="additional-evidence-message"
                            className="block text-[12px] font-medium text-[#AAB8C7]"
                        >
                            Message to requester
                        </label>

                        <textarea
                            id="additional-evidence-message"
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value);
                                setError('');
                                setSuccess('');
                            }}
                            rows={4}
                            maxLength={5000}
                            disabled={sending}
                            placeholder="Describe the additional evidence required..."
                            className="block w-full min-w-0 resize-y border border-[#394858] bg-[#101720] px-3.5 py-3 text-[13px] leading-6 text-[#E1E8F0] outline-none placeholder:text-[#718196] focus:border-[#637489] disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[11px] tabular-nums text-[#8496A9]">
                                {message.length}/5000 characters
                            </span>

                            <button
                                type="submit"
                                disabled={sending || !message.trim()}
                                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#586678] bg-[#2B3949] px-4 text-[12px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#37495D] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sending ? (
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send size={14} />
                                )}

                                {sending
                                    ? 'Sending...'
                                    : 'Send evidence request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

import { useEffect, useState } from 'react';

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Eye,
    FileText,
    Image,
    LoaderCircle,
    Music,
    Paperclip,
    Send,
    Video,
    X,
} from 'lucide-react';

import {
    requestAdditionalEvidence,
    getHelpRequestEvidencePreview,
} from '../api/helpRequestAPI';

const PANEL = 'min-w-0 border border-[#303A47] bg-[#171D26]';

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

function FileIcon({ type }) {
    const Icon =
        type === 'image'
            ? Image
            : type === 'audio'
              ? Music
              : type === 'video'
                ? Video
                : FileText;

    return <Icon size={18} strokeWidth={1.7} />;
}

function SectionHeader({ title, subtitle, count }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#344150] bg-[#202B38] px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center border border-[#3A495B] bg-[#273646] text-[#C3D0DE]">
                    <Paperclip size={16} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                    <h2
                        className="m-0! font-sans! text-[14px]! font-semibold! leading-5!"
                        style={{ color: '#EEF1F5' }}
                    >
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 mb-0! text-[11px] leading-5 text-[#9AAABD]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {count !== undefined && (
                <span className="border border-[#435064] bg-[#293747] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[#D4DFEA]">
                    {count} {count === 1 ? 'file' : 'files'}
                </span>
            )}
        </div>
    );
}

/* =========================================================
   EVIDENCE PREVIEW
========================================================= */

function EvidencePreviewModal({ fileUrl, mimeType, fileName, onClose }) {
    const isImage = mimeType.startsWith('image/');
    const isAudio = mimeType.startsWith('audio/');
    const isVideo = mimeType.startsWith('video/');
    const isPdf = mimeType === 'application/pdf';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Preview: ${fileName || 'Evidence file'}`}
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden border border-[#3A4859] bg-[#171D26] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex min-w-0 items-center justify-between gap-3 border-b border-[#303A47] px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <FileText
                            size={16}
                            className="shrink-0 text-[#9CB0C5]"
                        />
                        <p className="m-0! min-w-0 break-all text-[13px] font-medium text-[#EEF1F5]">
                            {fileName || 'Evidence preview'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="shrink-0 p-2 text-[#A0ADBD] transition-colors hover:text-white"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="min-h-[200px] flex-1 overflow-auto bg-[#10151D] p-3 sm:p-5">
                    {isImage && (
                        <div className="flex min-h-[250px] items-center justify-center">
                            <img
                                src={fileUrl}
                                alt={fileName || 'Evidence'}
                                className="max-h-[72vh] max-w-full object-contain"
                            />
                        </div>
                    )}

                    {isPdf && (
                        <iframe
                            src={fileUrl}
                            title={fileName || 'Evidence PDF preview'}
                            className="h-[72vh] w-full border-0 bg-white"
                        />
                    )}

                    {isAudio && (
                        <div className="flex min-h-[250px] items-center justify-center">
                            <audio
                                controls
                                preload="metadata"
                                src={fileUrl}
                                className="w-full max-w-xl"
                            >
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    )}

                    {isVideo && (
                        <div className="flex min-h-[250px] items-center justify-center">
                            <video
                                controls
                                playsInline
                                preload="metadata"
                                src={fileUrl}
                                className="max-h-[72vh] max-w-full"
                            >
                                Your browser does not support video playback.
                            </video>
                        </div>
                    )}

                    {!isImage && !isPdf && !isAudio && !isVideo && (
                        <p className="py-12 text-center text-[13px] text-[#A0ADBD]">
                            Preview is not available for this file type.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   EVIDENCE FILE ROW
========================================================= */

function EvidenceFileRow({ requestId, evidence }) {
    const [opening, setOpening] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewType, setPreviewType] = useState('');

    const mimeType = String(evidence.mime_type || '').toLowerCase();
    const iconType = getFileIcon(mimeType);

    const closePreview = () => {
        setPreviewUrl('');
        setPreviewType('');
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleOpen = async () => {
        if (opening) return;

        setOpening(true);
        setError('');

        try {
            const blob = await getHelpRequestEvidencePreview(
                requestId,
                evidence.id,
            );

            const fileUrl = URL.createObjectURL(blob);

            // DOC and DOCX files use the download fallback.
            if (
                mimeType === 'application/msword' ||
                mimeType ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                const link = document.createElement('a');

                link.href = fileUrl;
                link.download = evidence.file_name || 'evidence';

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.setTimeout(() => {
                    URL.revokeObjectURL(fileUrl);
                }, 1000);

                return;
            }

            setPreviewType(mimeType);
            setPreviewUrl(fileUrl);
        } catch (err) {
            setError(err?.message || 'Unable to preview this evidence file.');
        } finally {
            setOpening(false);
        }
    };

    return (
        <>
            <article className="group flex min-w-0 flex-col gap-3 border-b border-[#303A47] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center border border-[#3A495B] bg-[#253242] text-[#B7C8D9] transition-colors group-hover:bg-[#304256]">
                        <FileIcon type={iconType} />
                    </span>

                    <div className="min-w-0">
                        <p className="m-0! break-all text-[13px] font-semibold text-[#E5ECF3]">
                            {show(evidence.file_name, 'Evidence file')}
                        </p>

                        <p className="mt-1 mb-0! flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-[#93A4B6]">
                            <span>
                                {show(evidence.mime_type, 'Unknown format')}
                            </span>
                            <span className="text-[#526477]">·</span>
                            <span>{formatSize(evidence.file_size)}</span>
                            <span className="text-[#526477]">·</span>
                            <span>{formatDate(evidence.created_at)}</span>
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
                </div>

                <button
                    type="button"
                    onClick={handleOpen}
                    disabled={opening}
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 self-start border border-[#43556A] bg-[#263444] px-3.5 text-[11px] font-semibold text-[#E4EBF3] transition-colors hover:bg-[#34465A] disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
                >
                    {opening ? (
                        <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                        <Eye size={14} />
                    )}

                    {opening ? 'Loading...' : 'Preview'}
                </button>
            </article>

            {previewUrl && (
                <EvidencePreviewModal
                    fileUrl={previewUrl}
                    mimeType={previewType}
                    fileName={evidence.file_name}
                    onClose={closePreview}
                />
            )}
        </>
    );
}

/* =========================================================
   EVIDENCE GROUP
========================================================= */

function EvidenceGroup({ title, evidences, requestId, emptyMessage }) {
    return (
        <section className="min-w-0">
            <div className="flex items-center justify-between gap-3 border-b border-[#344150] pb-3">
                <h3
                    className="m-0! font-sans! text-[13px]! font-semibold!"
                    style={{ color: '#E1E9F1' }}
                >
                    {title}
                </h3>

                <span className="text-[11px] tabular-nums text-[#95A6B8]">
                    {String(evidences.length).padStart(2, '0')}{' '}
                    {evidences.length === 1 ? 'file' : 'files'}
                </span>
            </div>

            {evidences.length === 0 ? (
                <p className="mt-3 mb-0! border border-dashed border-[#394858] bg-[#141B24] px-4 py-4 text-[12px] leading-5 text-[#94A4B5]">
                    {emptyMessage}
                </p>
            ) : (
                <div>
                    {evidences.map((evidence) => (
                        <EvidenceFileRow
                            key={evidence.id}
                            requestId={requestId}
                            evidence={evidence}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

/* =========================================================
   PREVIOUS EVIDENCE REQUEST
========================================================= */

function EvidenceRequestItem({ item, requestId, evidences }) {
    const relatedEvidences = evidences.filter(
        (evidence) => Number(evidence.evidence_request_id) === Number(item.id),
    );

    const submitted =
        String(item.status || '')
            .trim()
            .toLowerCase() === 'submitted';

    return (
        <article className="relative border-l-2 border-[#52677D] py-1 pl-5 sm:pl-6">
            <span className="absolute -left-[5px] top-1 size-2 rounded-full border border-[#8298AE] bg-[#253242]" />

            <div className="flex flex-wrap items-center gap-3">
                <p className="m-0! text-[12px] font-semibold text-[#DCE5EF]">
                    Evidence request #{item.id}
                </p>

                <span
                    className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-medium ${
                        submitted
                            ? 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]'
                            : 'border-[#66583D] bg-[#332D22] text-[#E4C995]'
                    }`}
                >
                    {submitted ? (
                        <CheckCircle2 size={11} />
                    ) : (
                        <Clock3 size={11} />
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
                    <p className="m-0! text-[11px] font-semibold uppercase tracking-[0.1em] text-[#AEBECD]">
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

/* =========================================================
   MAIN EVIDENCE COMPONENT
========================================================= */

export default function HelpRequestEvidenceSection({ request, onUpdated }) {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isPending =
        String(request.status || '')
            .trim()
            .toLowerCase() === 'pending';

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
        <section className={`${PANEL} overflow-hidden`}>
            <SectionHeader
                title="Evidence and supporting documents"
                subtitle="Review submitted files and request further evidence"
                count={evidences.length}
            />

            <div className="space-y-7 px-4 py-5 sm:px-6 sm:py-6">
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3
                            className="m-0! font-sans! text-[14px]! font-semibold!"
                            style={{ color: '#E1E9F1' }}
                        >
                            Previous evidence requests
                        </h3>

                        <span className="font-mono text-[11px] text-[#95A6B8]">
                            {String(evidenceRequests.length).padStart(2, '0')}{' '}
                            {evidenceRequests.length === 1
                                ? 'request'
                                : 'requests'}
                        </span>
                    </div>

                    {evidenceRequests.length === 0 ? (
                        <p className="mt-3 mb-0! border border-dashed border-[#394858] bg-[#141B24] px-4 py-4 text-[12px] leading-5 text-[#94A4B5]">
                            No additional evidence has been requested.
                        </p>
                    ) : (
                        <div className="mt-5 space-y-6">
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

                {isPending && (
                    <div className="border-t border-[#303A47] pt-6">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-9">
                            <div>
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8295A9]">
                                    Requester follow-up
                                </p>

                                <h3
                                    className="m-0! font-sans! text-[18px]! font-semibold! leading-6!"
                                    style={{ color: '#E8EEF5' }}
                                >
                                    Request additional evidence
                                </h3>

                                <p className="mt-2 mb-0! text-[12px] leading-6 text-[#98A8BA]">
                                    Explain what further information or
                                    documents the requester needs to provide.
                                    This will not change the help request's
                                    verification or overall status.
                                </p>
                            </div>

                            <div className="min-w-0">
                                {(error || success) && (
                                    <div
                                        role={error ? 'alert' : 'status'}
                                        className={`mb-4 flex items-start gap-2 border px-4 py-3 text-[12px] leading-5 ${
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

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-3"
                                >
                                    <label
                                        htmlFor="additional-evidence-message"
                                        className="block text-[11px] font-semibold text-[#C6D2DF]"
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
                                        rows={5}
                                        maxLength={5000}
                                        disabled={sending}
                                        placeholder="Describe the additional evidence required..."
                                        className="block w-full min-w-0 resize-y border border-[#394858] bg-[#101720] px-4 py-3 text-[13px] leading-6 text-[#E1E8F0] outline-none placeholder:text-[#718196] focus:border-[#71869B] disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <span className="text-[10px] tabular-nums text-[#8496A9]">
                                            {message.length}/5000 characters
                                        </span>

                                        <button
                                            type="submit"
                                            disabled={
                                                sending || !message.trim()
                                            }
                                            className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#586678] bg-[#2B3949] px-4 text-[11px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#37495D] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {sending ? (
                                                <LoaderCircle
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Send size={13} />
                                            )}

                                            {sending
                                                ? 'Sending...'
                                                : 'Send evidence request'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

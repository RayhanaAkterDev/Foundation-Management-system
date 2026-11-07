import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Pencil,
    CalendarDays,
    MapPin,
    FileText,
    ClipboardList,
    Building2,
    Clock3,
    Upload,
    Eye,
    X,
    Paperclip,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import {
    getMyHelpRequests,
    submitAdditionalEvidence,
    getHelpRequestEvidencePreview,
} from './api/helpRequestAPI';

import {
    normalizeHelpRequests,
    getAssignmentInfo,
    getStatusLabel,
    getUrgencyLabel,
} from './utils/helpRequestUtils';

const BASE = '/individual/dashboard/help-requests';

const COLORS = {
    surface: '#1A212B',
    border: '#303A47',
    text: '#EEF1F5',
    muted: '#A0ADBD',
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_TOTAL_SIZE = 35 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'pdf',
    'doc',
    'docx',
    'mp3',
    'wav',
    'm4a',
    'mp4',
    'mov',
];

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const formatFileSize = (bytes) => {
    if (!Number.isFinite(Number(bytes))) return 'Unknown size';

    const size = Number(bytes);

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileExtension = (fileName) => {
    return fileName.split('.').pop()?.toLowerCase() || '';
};

const STATUS_TONES = {
    pending: 'border-[#51412A] bg-[#292116] text-[#D9B77D]',
    verified: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
    completed: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
    rejected: 'border-[#57343D] bg-[#2C1D23] text-[#D9A0A8]',
    in_progress: 'border-[#45415C] bg-[#252339] text-[#C4BCE7]',
};

const DEFAULT_STATUS_TONE = 'border-[#394656] bg-[#263343] text-[#C8D2DF]';

function Info({ label, value }) {
    const displayValue =
        value === null || value === undefined || value === '' ? '—' : value;

    return (
        <div className="min-w-0 border-b border-[#303A47] py-3.5 last:border-b-0">
            <dt className="mb-1.5 text-[12px] font-medium! text-[#A0ADBD]">
                {label}
            </dt>

            <dd className="min-w-0 wrap-break-word text-[13px] font-medium! leading-6 text-[#EEF1F5]!">
                {displayValue}
            </dd>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 border-b border-[#303A47] bg-[#202A36] px-5 py-4 sm:px-6">
            <span className="flex size-9 shrink-0 items-center justify-center border border-[#354456] bg-[#293747] text-[#B9C8D9]">
                <Icon size={17} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
                <h3 className="text-[14px] font-semibold! text-[#EEF1F5]!">
                    {title}
                </h3>

                {subtitle && (
                    <p className="mt-1 text-[12px] leading-5 text-[#A0ADBD]">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const tone = STATUS_TONES[status] || DEFAULT_STATUS_TONE;

    return (
        <span
            className={`inline-flex min-h-9 shrink-0 items-center gap-2 border px-3 py-2 text-[12px] font-semibold! ${tone}`}
        >
            <span className="size-1.5 shrink-0 rounded-full bg-current" />

            {getStatusLabel(status)}
        </span>
    );
}

// =========================================================
// Evidence preview modal
// =========================================================

function EvidencePreviewModal({ fileUrl, mimeType, fileName, onClose }) {
    const isImage = mimeType.startsWith('image/');
    const isAudio = mimeType.startsWith('audio/');
    const isVideo = mimeType.startsWith('video/');
    const isPdf = mimeType === 'application/pdf';

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-3 sm:p-6"
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
                    <p className="min-w-0 break-all text-[13px] font-medium! text-[#EEF1F5]!">
                        {fileName || 'Evidence preview'}
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="shrink-0 p-2 text-[#A0ADBD] transition-colors hover:text-white"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="min-h-50 flex-1 overflow-auto bg-[#10151D] p-3 sm:p-5">
                    {isImage && (
                        <div className="flex min-h-62.5 items-center justify-center">
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
                        <div className="flex min-h-62.5 items-center justify-center">
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
                        <div className="flex min-h-62.5 items-center justify-center">
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

// =========================================================
// Secure evidence file viewing
// =========================================================

function EvidenceFileRow({ requestId, evidence }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewType, setPreviewType] = useState('');

    const mimeType = String(evidence.mime_type || '').toLowerCase();

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

    const handleView = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError('');

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
            setLoading(false);
        }
    };

    return (
        <>
            <div className="border-b border-[#303A47] py-3 last:border-b-0">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Paperclip
                            size={15}
                            className="shrink-0 text-[#A0ADBD]"
                        />

                        <div className="min-w-0">
                            <p className="break-all text-[13px] font-medium! text-[#EEF1F5]!">
                                {evidence.file_name || 'Evidence file'}
                            </p>

                            <p className="mt-1 text-[11px] text-[#A0ADBD]">
                                {formatFileSize(evidence.file_size)}
                                {evidence.created_at
                                    ? ` · ${formatDate(evidence.created_at)}`
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleView}
                        disabled={loading}
                        className="inline-flex min-h-9 shrink-0 items-center gap-2 border border-[#46566A] bg-[#263343] px-3 text-[12px] font-medium! text-[#EEF1F5]! transition-colors hover:bg-[#304155] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Eye size={14} />
                        {loading ? 'Loading...' : 'View'}
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mt-2 text-[12px] text-[#D9A0A8]">
                        {error}
                    </p>
                )}
            </div>

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

// =========================================================
// Additional evidence submission
// =========================================================

function EvidenceRequestItem({
    requestId,
    evidenceRequest,
    evidences,
    onSubmitted,
}) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isPending = evidenceRequest.status === 'pending';

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        event.target.value = '';

        if (!selectedFiles.length) return;

        setError('');

        const combinedFiles = [...files, ...selectedFiles];

        if (combinedFiles.length > MAX_FILES) {
            setError(`You can upload a maximum of ${MAX_FILES} files.`);
            return;
        }

        for (const file of selectedFiles) {
            const extension = getFileExtension(file.name);

            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                setError(`File type not allowed: ${file.name}`);
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(`${file.name} exceeds the 20 MB file limit.`);
                return;
            }
        }

        const totalSize = combinedFiles.reduce(
            (total, file) => total + file.size,
            0,
        );

        if (totalSize > MAX_TOTAL_SIZE) {
            setError('The combined file size cannot exceed 35 MB.');
            return;
        }

        setFiles(combinedFiles);
    };

    const removeFile = (indexToRemove) => {
        setFiles((current) =>
            current.filter((_, index) => index !== indexToRemove),
        );

        setError('');
    };

    const handleSubmit = async () => {
        if (!files.length) {
            setError('Please select at least one evidence file.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const formData = new FormData();

            files.forEach((file) => {
                formData.append('evidences[]', file);
            });

            await submitAdditionalEvidence(
                requestId,
                evidenceRequest.id,
                formData,
            );

            setFiles([]);

            await onSubmitted();
        } catch (err) {
            const validationErrors = err?.errors
                ? Object.values(err.errors).flat().join(' ')
                : '';

            setError(
                validationErrors ||
                    err?.message ||
                    'Unable to submit additional evidence.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="border-b border-[#303A47] py-5 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold! text-[#EEF1F5]!">
                    Evidence request #{evidenceRequest.id}
                </p>

                <span
                    className={`inline-flex border px-2.5 py-1 text-[11px] capitalize ${
                        isPending
                            ? 'border-[#51412A] bg-[#292116] text-[#D9B77D]'
                            : 'border-[#305043] bg-[#182B24] text-[#9BD1B2]'
                    }`}
                >
                    {String(evidenceRequest.status || 'pending').replaceAll(
                        '_',
                        ' ',
                    )}
                </span>
            </div>

            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-[13px] leading-6 text-[#C8D2DF]">
                {evidenceRequest.message}
            </p>

            <p className="mt-2 text-[11px] text-[#A0ADBD]">
                Requested on {formatDate(evidenceRequest.created_at)}
            </p>

            {evidences.length > 0 && (
                <div className="mt-4">
                    <p className="mb-1 text-[12px] font-semibold! text-[#EEF1F5]!">
                        Submitted additional evidence
                    </p>

                    {evidences.map((evidence) => (
                        <EvidenceFileRow
                            key={evidence.id}
                            requestId={requestId}
                            evidence={evidence}
                        />
                    ))}
                </div>
            )}

            {isPending && (
                <div className="mt-4 border-t border-[#303A47] pt-4">
                    <label
                        htmlFor={`evidence-upload-${evidenceRequest.id}`}
                        className="mb-2 block text-[12px] font-medium! text-[#D2DAE4]"
                    >
                        Upload requested evidence
                    </label>

                    <input
                        id={`evidence-upload-${evidenceRequest.id}`}
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.mp3,.wav,.m4a,.mp4,.mov"
                        onChange={handleFileChange}
                        disabled={submitting}
                        className="block w-full text-[12px] text-[#A0ADBD] file:mr-3 file:border file:border-[#46566A] file:bg-[#263343] file:px-3 file:py-2 file:text-[12px] file:font-medium! file:text-[#EEF1F5] hover:file:bg-[#304155] disabled:opacity-50"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-[#A0ADBD]">
                        JPG, PNG, WebP, PDF, DOC, DOCX, MP3, WAV, M4A, MP4 or
                        MOV. Maximum 5 files, 20 MB each and 35 MB total.
                    </p>

                    {files.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex min-w-0 items-center justify-between gap-3 border border-[#303A47] bg-[#202A36] px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="break-all text-[12px] text-[#D2DAE4]">
                                            {file.name}
                                        </p>

                                        <p className="mt-1 text-[11px] text-[#A0ADBD]">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        disabled={submitting}
                                        aria-label={`Remove ${file.name}`}
                                        className="shrink-0 p-1 text-[#A0ADBD] transition-colors hover:text-[#D9A0A8] disabled:opacity-50"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ))}

                            <p className="text-right text-[11px] text-[#A0ADBD]">
                                Total:{' '}
                                {formatFileSize(
                                    files.reduce(
                                        (total, file) => total + file.size,
                                        0,
                                    ),
                                )}
                            </p>
                        </div>
                    )}

                    {error && (
                        <p className="mt-3 text-[12px] leading-5 text-[#D9A0A8]">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || files.length === 0}
                        className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 border border-[#42645D] bg-[#18332F] px-4 text-[12px] font-semibold! text-[#B8D8CE]! transition-colors hover:bg-[#21443E] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload size={14} />

                        {submitting
                            ? 'Submitting...'
                            : 'Submit additional evidence'}
                    </button>
                </div>
            )}
        </div>
    );
}

// =========================================================
// Main request content
// =========================================================

function RequestContent({ request, onEdit, onRefresh }) {
    const assignmentInfo = getAssignmentInfo(request);

    const assignment = assignmentInfo?.currentAssignment;
    const organization = assignment?.organization;

    const organizationName =
        organization?.name ||
        organization?.organization_name ||
        request?.organization?.name ||
        'Not assigned';

    const assignments = Array.isArray(request.assignments)
        ? request.assignments
        : [];

    const evidences = Array.isArray(request.evidences) ? request.evidences : [];

    const evidenceRequests = Array.isArray(request.evidenceRequests)
        ? request.evidenceRequests
        : [];

    const originalEvidences = evidences.filter(
        (item) => item.source === 'original',
    );

    return (
        <div className="space-y-5 lg:space-y-6">
            {/* Request identity */}
            <section
                className="flex min-w-0 flex-col gap-5 border px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                style={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                }}
            >
                <div className="flex min-w-0 items-start gap-4">
                    <span className="hidden size-12 shrink-0 items-center justify-center border border-[#394758] bg-[#263343] text-[#B7C7D8] sm:flex">
                        <FileText size={22} strokeWidth={1.7} />
                    </span>

                    <div className="min-w-0">
                        <p className="mb-2 text-[12px] text-[#A0ADBD]">
                            Help request #{request.id}
                        </p>

                        <h2 className="wrap-break-word text-[20px] font-semibold! leading-snug text-[#EEF1F5]! sm:text-[24px]">
                            {request.title || 'Untitled request'}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#AAB7C7]">
                            <span className="inline-flex min-w-0 items-center gap-2">
                                <MapPin size={14} className="shrink-0" />

                                <span className="wrap-break-word">
                                    {request.district || 'Location unavailable'}
                                </span>
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <CalendarDays size={14} />

                                {formatDate(request.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <StatusBadge status={request.status} />

                    {request.status === 'pending' && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#46566A] bg-[#263343] px-3 text-[12px] font-medium! text-[#EEF1F5]! transition-colors hover:bg-[#304155]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Edit request
                        </button>
                    )}
                </div>
            </section>

            {/* Main details and sidebar */}
            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
                <main className="min-w-0 space-y-5">
                    {/* Request information */}
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={FileText}
                            title="About this request"
                            subtitle="Request details and assistance requirements"
                        />

                        <div className="px-5 py-5 sm:px-6 sm:py-6">
                            <p className="whitespace-pre-wrap wrap-break-word text-[14px] leading-7 text-[#D2DAE4]">
                                {request.description ||
                                    'No description provided.'}
                            </p>

                            <div className="mt-6 border-t border-[#303A47] pt-5">
                                <h4 className="mb-3 text-[13px] font-semibold! text-[#EEF1F5]!">
                                    Request information
                                </h4>

                                <dl className="grid min-w-0 gap-x-8 sm:grid-cols-2">
                                    <Info
                                        label="Category"
                                        value={request.category}
                                    />

                                    <Info
                                        label="Urgency"
                                        value={getUrgencyLabel(request.urgency)}
                                    />

                                    <Info
                                        label="District"
                                        value={request.district}
                                    />

                                    <Info
                                        label="Request ID"
                                        value={String(request.id)}
                                    />

                                    <Info
                                        label="Address"
                                        value={request.address}
                                    />

                                    <Info
                                        label="Contact Number"
                                        value={request.contact_phone}
                                    />
                                </dl>
                            </div>
                        </div>
                    </section>

                    {/* Original evidence */}
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={Paperclip}
                            title="Original evidence"
                            subtitle="Files submitted with your original request"
                        />

                        <div className="px-5 py-3 sm:px-6">
                            {originalEvidences.length > 0 ? (
                                originalEvidences.map((evidence) => (
                                    <EvidenceFileRow
                                        key={evidence.id}
                                        requestId={request.id}
                                        evidence={evidence}
                                    />
                                ))
                            ) : (
                                <p className="py-3 text-[13px] text-[#A0ADBD]">
                                    No original evidence files found.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Additional evidence requests */}
                    {evidenceRequests.length > 0 && (
                        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                            <SectionHeader
                                icon={Upload}
                                title="Additional evidence"
                                subtitle="Evidence requests and responses from the admin"
                            />

                            <div className="px-5 py-2 sm:px-6">
                                {evidenceRequests.map((evidenceRequest) => {
                                    const relatedEvidences = evidences.filter(
                                        (item) =>
                                            Number(item.evidence_request_id) ===
                                            Number(evidenceRequest.id),
                                    );

                                    return (
                                        <EvidenceRequestItem
                                            key={evidenceRequest.id}
                                            requestId={request.id}
                                            evidenceRequest={evidenceRequest}
                                            evidences={relatedEvidences}
                                            onSubmitted={onRefresh}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Assignment history */}
                    {assignments.length > 0 && (
                        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                            <SectionHeader
                                icon={Building2}
                                title="Assignment history"
                                subtitle="Organizations connected to this request"
                            />

                            <div className="divide-y divide-[#303A47]">
                                {assignments.map((item, index) => {
                                    const name =
                                        item.organization?.name ||
                                        item.organization?.organization_name ||
                                        'Organization';

                                    return (
                                        <div
                                            key={item.id ?? index}
                                            className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
                                        >
                                            <div className="min-w-0">
                                                <p className="wrap-break-word text-[13px] font-semibold! text-[#EEF1F5]!">
                                                    {name}
                                                </p>

                                                <p className="mt-1 text-[12px] leading-5 text-[#A0ADBD]">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}

                                                    {item.id
                                                        ? ` · Assignment #${item.id}`
                                                        : ''}
                                                </p>
                                            </div>

                                            <span className="inline-flex border border-[#394758] bg-[#263343] px-2.5 py-1 text-[11px] capitalize text-[#C8D2DF]">
                                                {String(
                                                    item.status || 'Pending',
                                                ).replaceAll('_', ' ')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar */}
                <aside className="min-w-0 space-y-5">
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={ClipboardList}
                            title="Request overview"
                            subtitle="Current request classification"
                        />

                        <dl className="px-5 py-2">
                            <Info
                                label="Status"
                                value={getStatusLabel(request.status)}
                            />

                            <Info label="Category" value={request.category} />

                            <Info
                                label="Urgency"
                                value={getUrgencyLabel(request.urgency)}
                            />

                            <Info
                                label="Assigned organization"
                                value={organizationName}
                            />
                        </dl>
                    </section>

                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={Clock3}
                            title="Record history"
                            subtitle="Submission and last modification"
                        />

                        <div className="space-y-5 px-5 py-5">
                            <div>
                                <p className="text-[12px] text-[#A0ADBD]">
                                    Submitted
                                </p>

                                <p className="mt-1 text-[13px] font-medium! text-[#EEF1F5]!">
                                    {formatDate(request.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-[#A0ADBD]">
                                    Last updated
                                </p>

                                <p className="mt-1 text-[13px] font-medium! text-[#EEF1F5]!">
                                    {formatDate(request.updated_at)}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

// =========================================================
// Help Request Details page
// =========================================================

export default function HelpRequestDetails() {
    const params = useParams();
    const navigate = useNavigate();

    const id =
        params.id ??
        params.requestId ??
        params.helpRequestId ??
        params.help_request_id;

    const [reloadKey, setReloadKey] = useState(0);

    const [requestState, setRequestState] = useState({
        requestId: null,
        reloadKey: -1,
        request: null,
        loading: true,
        error: '',
    });

    useEffect(() => {
        let cancelled = false;

        async function loadRequest() {
            try {
                if (id === null || id === undefined) {
                    throw new Error('Invalid help request ID.');
                }

                const response = await getMyHelpRequests();

                const items = normalizeHelpRequests(
                    response?.help_requests ||
                        response?.helpRequests ||
                        response?.data ||
                        [],
                );

                const selected =
                    items.find((item) => String(item.id) === String(id)) ||
                    null;

                if (!selected) {
                    throw new Error(
                        'This request was not found among your submissions.',
                    );
                }

                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: selected,
                        loading: false,
                        error: '',
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: null,
                        loading: false,
                        error:
                            err?.message || 'Unable to load this help request.',
                    });
                }
            }
        }

        loadRequest();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const loading =
        requestState.loading ||
        requestState.requestId !== id ||
        requestState.reloadKey !== reloadKey;

    const { request, error } = requestState;

    const handleRetry = () => {
        setReloadKey((current) => current + 1);
    };

    const handleBack = () => {
        navigate(BASE);
    };

    const handleEdit = () => {
        navigate(`${BASE}/${id}/edit`);
    };

    const header = (
        <PageHeader
            title="Help request details"
            subtitle="Review your submitted request and its current progress."
            action={
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[13px] font-medium! text-[#C4CDD8] transition-colors hover:bg-[#202A35] hover:text-[#EEF1F5]!"
                >
                    <ArrowLeft size={15} strokeWidth={1.8} />
                    All help requests
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading help request..."
                    description="Retrieving your submitted request information."
                />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingError
                    title={
                        error?.includes('not found')
                            ? 'Help request not found'
                            : 'Unable to load help request'
                    }
                    message={
                        error ||
                        'The requested help request could not be found.'
                    }
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans lg:space-y-7">
            {header}

            <RequestContent
                request={request}
                onEdit={handleEdit}
                onRefresh={handleRetry}
            />
        </div>
    );
}

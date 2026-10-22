import { useEffect } from 'react';
import { AlertCircle, FileText, X } from 'lucide-react';

import LoadingUI from '@/components/dashboard/LoadingUI';

export default function RejectionModal({
    request,
    note,
    setNote,
    error,
    setError,
    loading = false,
    onClose,
    onSubmit,
}) {
    useEffect(() => {
        if (!request) return undefined;

        const handleEscape = (event) => {
            if (event.key === 'Escape' && !loading) {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [request, loading, onClose]);

    if (!request) return null;

    const value = note ?? '';

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loading) return;

        onSubmit?.();
    };

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-[3px] sm:px-5"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose?.();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="rejection-modal-title"
                className="flex max-h-[min(90dvh,760px)] w-full max-w-[520px] flex-col overflow-hidden border border-[#303A47] bg-[#10161F] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
                <header className="shrink-0 border-b border-[#29333F] bg-[#151C25] px-5 py-5 sm:px-6 sm:py-6">
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div className="flex size-10 shrink-0 items-center justify-center border border-[#493038] bg-[#281A1F] text-[#D1959B]">
                                <X size={19} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 pt-0.5">
                                <h2
                                    id="rejection-modal-title"
                                    className="text-[18px] font-semibold! leading-snug tracking-[-0.02em] text-[#EEF1F5]! sm:text-[19px]"
                                >
                                    Decline assignment
                                </h2>

                                <p className="mt-1.5 max-w-[380px] text-[13px] leading-[1.7] text-[#8792A1]">
                                    Explain why your organization cannot take
                                    responsibility for this request.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close rejection dialog"
                            className="flex size-8 shrink-0 items-center justify-center border border-transparent text-[#8792A1] transition-colors hover:border-[#343E4B] hover:bg-[#202A35] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <X size={18} strokeWidth={1.8} />
                        </button>
                    </div>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 [scrollbar-width:thin] [scrollbar-color:#303A47_transparent]">
                        <div className="flex min-w-0 items-start gap-3 border border-[#29333F] bg-[#151C25] px-4 py-3.5">
                            <FileText
                                size={17}
                                strokeWidth={1.7}
                                className="mt-0.5 shrink-0 text-[#8792A1]"
                            />

                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-[#8792A1]">
                                    Help request
                                </p>

                                <p className="mt-1 break-words text-[13px] font-semibold! leading-5 text-[#EEF1F5]">
                                    {request.title || 'Untitled request'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label
                                htmlFor="rejection-note"
                                className="mb-2.5 block text-[13px] font-medium text-[#D2DAE4]"
                            >
                                Reason for declining
                                <span className="ml-1 text-[#D1959B]">*</span>
                            </label>

                            <textarea
                                id="rejection-note"
                                name="rejection-note"
                                value={value}
                                onChange={(event) => {
                                    setNote?.(event.target.value);

                                    if (error) {
                                        setError?.('');
                                    }
                                }}
                                disabled={loading}
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Explain why your organization cannot accept this assignment..."
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                    error
                                        ? 'rejection-note-error'
                                        : 'rejection-note-help'
                                }
                                className={`block min-h-[148px] w-full resize-y border bg-[#0E1219] px-4 py-3 text-[13px] leading-[1.7] text-[#EEF1F5] outline-none transition-colors placeholder:text-[#687587] disabled:cursor-not-allowed disabled:opacity-60 ${
                                    error
                                        ? 'border-[#9D555F] focus:border-[#C47B85]'
                                        : 'border-[#343E4B] hover:border-[#48576A] focus:border-[#72839A]'
                                }`}
                            />

                            <div className="mt-2 flex items-start justify-between gap-3">
                                <p
                                    id="rejection-note-help"
                                    className="text-[11px] leading-5 text-[#8792A1]"
                                >
                                    This reason will be shared with the
                                    administrator.
                                </p>

                                <span className="shrink-0 text-[11px] tabular-nums text-[#8792A1]">
                                    {value.length}/2000
                                </span>
                            </div>

                            {error && (
                                <div
                                    id="rejection-note-error"
                                    role="alert"
                                    className="mt-4 flex items-start gap-2.5 border border-[#493038] bg-[#281A1F] px-3.5 py-3"
                                >
                                    <AlertCircle
                                        size={16}
                                        strokeWidth={1.8}
                                        className="mt-0.5 shrink-0 text-[#D1959B]"
                                    />

                                    <p className="text-[12px] leading-5 text-[#E2AAB0]">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 border-t border-[#29333F] bg-[#151C25] px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center border border-[#343E4B] bg-[#151C25] px-4 text-[13px] font-medium text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#202A35] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !value.trim()}
                            className="inline-flex h-10 min-w-[150px] items-center justify-center gap-2 border border-[#9D555F] bg-[#713640] px-4 text-[13px] font-semibold! text-[#FFF1F2]! transition-colors hover:border-[#BA6973] hover:bg-[#87434E] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <LoadingUI variant="inline" />
                                    Declining...
                                </>
                            ) : (
                                <>
                                    <X size={15} strokeWidth={1.9} />
                                    Decline assignment
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
